from __future__ import annotations

import os
import sqlite3
from dataclasses import asdict, dataclass
from datetime import date, datetime, timedelta
from typing import Any, Optional

from flask import Flask, jsonify, redirect, render_template, request, url_for

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "study.db")

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                details TEXT,
                priority INTEGER NOT NULL DEFAULT 3,
                deadline TEXT,
                status TEXT NOT NULL DEFAULT 'todo',
                created_at TEXT NOT NULL
            );
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);")


@dataclass
class Task:
    id: int
    title: str
    details: str
    priority: int
    deadline: Optional[str]
    status: str
    created_at: str

    @property
    def deadline_date(self) -> Optional[date]:
        if not self.deadline:
            return None
        try:
            return datetime.strptime(self.deadline, "%Y-%m-%d").date()
        except ValueError:
            return None


def row_to_task(r: sqlite3.Row) -> Task:
    return Task(
        id=int(r["id"]),
        title=str(r["title"]),
        details=str(r["details"] or ""),
        priority=int(r["priority"]),
        deadline=r["deadline"],
        status=str(r["status"]),
        created_at=str(r["created_at"]),
    )


def fetch_tasks(
    *,
    status: Optional[str] = None,
    start: Optional[date] = None,
    end: Optional[date] = None,
) -> list[Task]:
    q = "SELECT * FROM tasks WHERE 1=1"
    params: list[Any] = []

    if status in {"todo", "done"}:
        q += " AND status=?"
        params.append(status)

    if start is not None:
        q += " AND (deadline IS NULL OR deadline>=?)"
        params.append(start.isoformat())

    if end is not None:
        q += " AND (deadline IS NULL OR deadline<=?)"
        params.append(end.isoformat())

    q += " ORDER BY (deadline IS NULL), deadline ASC, priority ASC, id DESC"

    with get_db() as conn:
        rows = conn.execute(q, params).fetchall()
    return [row_to_task(r) for r in rows]


def get_task(task_id: int) -> Optional[Task]:
    with get_db() as conn:
        r = conn.execute("SELECT * FROM tasks WHERE id=?", (task_id,)).fetchone()
    return row_to_task(r) if r else None


def compute_suggestions(tasks: list[Task]) -> list[str]:
    today = date.today()
    tips: list[str] = []

    urgent = [t for t in tasks if t.status == "todo" and t.deadline_date and (t.deadline_date - today).days <= 2]
    high = [t for t in tasks if t.status == "todo" and t.priority <= 2]
    no_deadline = [t for t in tasks if t.status == "todo" and not t.deadline_date]

    if urgent:
        tips.append("Сначала закрой срочные задачи (дедлайн 0–2 дня): " + ", ".join(t.title for t in urgent[:3]))
    if high:
        tips.append("Выдели 1–2 блока по 25–40 минут на приоритетные задачи: " + ", ".join(t.title for t in high[:3]))
    if no_deadline:
        tips.append("У части задач нет дедлайна — задай хотя бы примерную дату, чтобы планировщик мог распределять нагрузку.")

    week_end = today + timedelta(days=7)
    week = [t for t in tasks if t.status == "todo" and t.deadline_date and today <= t.deadline_date <= week_end]
    if len(week) >= 6:
        tips.append("На этой неделе много дедлайнов. Разбей большие задачи на шаги и делай каждый день по 1–2 шага.")

    if not tips:
        tips.append("План выглядит ровно. Поддерживай темп: 2–3 помодоро в день на ключевую задачу.")

    return tips


@app.route("/")
def home():
    return redirect(url_for("study_page"))


@app.route("/study")
def study_page():
    return render_template(
        "study.html",
        title="Study with Me",
        view="all",
        status="all",
        today=date.today().isoformat(),
    )


@app.route("/tasks", methods=["GET", "POST"])
def tasks_view():
    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        details = (request.form.get("details") or "").strip()
        priority = int(request.form.get("priority") or 3)
        deadline = (request.form.get("deadline") or "").strip() or None

        if title:
            with get_db() as conn:
                conn.execute(
                    "INSERT INTO tasks(title, details, priority, deadline, status, created_at) VALUES(?,?,?,?,?,?)",
                    (title, details, priority, deadline, "todo", datetime.now().isoformat(timespec="seconds")),
                )
        return redirect(url_for("tasks_view"))

    status = request.args.get("status")
    view = request.args.get("view", "all")

    start: Optional[date] = None
    end: Optional[date] = None
    today = date.today()

    if view == "week":
        start = today
        end = today + timedelta(days=7)
    elif view == "month":
        start = today.replace(day=1)
        if start.month == 12:
            next_month = date(start.year + 1, 1, 1)
        else:
            next_month = date(start.year, start.month + 1, 1)
        end = next_month - timedelta(days=1)

    tasks = fetch_tasks(status=status, start=start, end=end)
    suggestions = compute_suggestions(tasks)

    return render_template(
        "index.html",
        tasks=tasks,
        suggestions=suggestions,
        status=status or "all",
        view=view,
        today=today.isoformat(),
        title="Study Planner",
    )


@app.route("/tasks/<int:task_id>/toggle", methods=["POST"])
def toggle_task(task_id: int):
    t = get_task(task_id)
    if not t:
        return redirect(url_for("tasks_view"))

    new_status = "done" if t.status != "done" else "todo"
    with get_db() as conn:
        conn.execute("UPDATE tasks SET status=? WHERE id=?", (new_status, task_id))

    return redirect(url_for("tasks_view"))


@app.route("/tasks/<int:task_id>/delete", methods=["POST"])
def delete_task(task_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    return redirect(url_for("tasks_view"))


@app.route("/tasks/<int:task_id>/edit", methods=["GET", "POST"])
def edit_task(task_id: int):
    t = get_task(task_id)
    if not t:
        return redirect(url_for("tasks_view"))

    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        details = (request.form.get("details") or "").strip()
        priority = int(request.form.get("priority") or 3)
        deadline = (request.form.get("deadline") or "").strip() or None
        status = (request.form.get("status") or "todo").strip()

        if status not in {"todo", "done"}:
            status = "todo"

        if title:
            with get_db() as conn:
                conn.execute(
                    "UPDATE tasks SET title=?, details=?, priority=?, deadline=?, status=? WHERE id=?",
                    (title, details, priority, deadline, status, task_id),
                )
        return redirect(url_for("tasks_view"))

    return render_template(
        "edit.html",
        task=t,
        title="Редактирование задачи",
        view="all",
        status="all",
        today=date.today().isoformat(),
    )


@app.route("/api/tasks", methods=["GET"])
def api_list_tasks():
    status = request.args.get("status")
    tasks = fetch_tasks(status=status)
    return jsonify([asdict(t) for t in tasks])


@app.route("/api/tasks", methods=["POST"])
def api_create_task():
    data = request.get_json(silent=True) or {}
    title = str(data.get("title", "")).strip()
    details = str(data.get("details", "")).strip()
    priority = int(data.get("priority", 3))
    deadline = str(data.get("deadline") or "").strip() or None

    if not title:
        return jsonify({"error": "title is required"}), 400

    with get_db() as conn:
        cur = conn.execute(
            "INSERT INTO tasks(title, details, priority, deadline, status, created_at) VALUES(?,?,?,?,?,?)",
            (title, details, priority, deadline, "todo", datetime.now().isoformat(timespec="seconds")),
        )
        task_id = int(cur.lastrowid)

    t = get_task(task_id)
    return jsonify(asdict(t)), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def api_update_task(task_id: int):
    t = get_task(task_id)
    if not t:
        return jsonify({"error": "not found"}), 404

    data = request.get_json(silent=True) or {}

    title = str(data.get("title", t.title)).strip()
    details = str(data.get("details", t.details)).strip()
    priority = int(data.get("priority", t.priority))
    deadline = str(data.get("deadline") if "deadline" in data else (t.deadline or "")).strip() or None
    status = str(data.get("status", t.status)).strip()

    if status not in {"todo", "done"}:
        status = t.status

    if not title:
        return jsonify({"error": "title is required"}), 400

    with get_db() as conn:
        conn.execute(
            "UPDATE tasks SET title=?, details=?, priority=?, deadline=?, status=? WHERE id=?",
            (title, details, priority, deadline, status, task_id),
        )

    t2 = get_task(task_id)
    return jsonify(asdict(t2))


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def api_delete_task(task_id: int):
    with get_db() as conn:
        cur = conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    if cur.rowcount == 0:
        return jsonify({"error": "not found"}), 404
    return jsonify({"ok": True})


@app.route("/api/suggestions", methods=["GET"])
def api_suggestions():
    status = request.args.get("status")
    tasks = fetch_tasks(status=status)
    return jsonify({"suggestions": compute_suggestions(tasks)})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)