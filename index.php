<?php
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    require 'router.php';

    $router = new Router;

    $router->add('/', function () {
        header('Location: index.html');
        exit();
    });

    $router->add('/get-books', function() {
        $db = connectDB();
        
        $result = $db->query('SELECT * FROM KJV_books');
        $data = [];

        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $data[] = $row;
        }

        $db->close();

        header('Content-Type: application/json');
        echo json_encode($data);
    });

    $router->add('#^/books/(\d+)$#', function ($bookID) {
        $db = connectDB();
        
        $data = [];

        $stmt = $db->prepare('SELECT name FROM KJV_books WHERE id = :bookID');
        $stmt->bindValue(':bookID', $bookID, SQLITE3_INTEGER);
        $bookName = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

        $stmt = $db->prepare('SELECT chapter, verse, text FROM KJV_verses WHERE book_id = :bookID');
        $stmt->bindValue(':bookID', $bookID, SQLITE3_INTEGER);
        $result = $stmt->execute();

        $verses = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $verses[] = $row;
        }

        $data['bookName'] = $bookName['name'];
        $data['bookSection'] = $bookID < 40 ? 'old-testament' : 'new-testament';
        $data['verses'] = $verses;
    
        $uri = $_SERVER['REQUEST_URI'];

        header('Content-Type: application/json');
        echo json_encode($data);    
    });

    $router->dispatch($path);


    function connectDB() {
        try {
            return new SQLite3('KJV.db');
        }
        catch (Exception $e) {
            echo json_encode(['error' => 'Unable to connect to the database']);
            exit();
        }
    }
?>