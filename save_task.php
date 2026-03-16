<?php
$db = new SQLite3('study.db');

$db->exec('CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    time TEXT
)');

if(isset($_POST['name']) && !empty(trim($_POST['name']))) {
    $name = $_POST['name'];

    $stmt = $db->prepare('INSERT INTO tasks (name) VALUES (:name)');
    $stmt->bindValue(':name', $name, SQLITE3_TEXT);
    $stmt->execute();
}

header('Location: index.html');
exit;
?>