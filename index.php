<?php
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    require 'router.php';

    $router = new Router;

    $router->add('/', function () {
        header('Location: index.html');
        exit();
    });

    $router->add('/get-books', function() {
        header('Content-Type: application/json');

        $db = connectDB();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            $stmt = $db->prepare('SELECT * FROM KJV_books WHERE id = :bookID');
            $stmt->bindValue(':bookID', $data['bookID'], SQLITE3_INTEGER );

            $bookName = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

            echo json_encode($bookName);
        }
        else {
            $result = $db->query('SELECT * FROM KJV_books');
            $data = [];
    
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
    
            $db->close();
    
            echo json_encode($data);
        }

        $db->close();
    });

    $router->add('#^/books/([a-z\-]+)$#', function ($bookName) {
        include 'book.html';
    });

    $router->add('/load-book', function () {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        $bookName = $data['bookName'];
        $bookName = str_replace('-', ' ', $bookName);
        
        $db = connectDB();
        
        $data = [];

        $stmt = $db->prepare('SELECT * FROM KJV_books WHERE LOWER(name) = :bookName');
        $stmt->bindValue(':bookName', $bookName, SQLITE3_TEXT);
        $result = $stmt->execute()->fetchArray(SQLITE3_ASSOC);
        $bookID = $result['id'];
        $bookName = $result['name'];

        $stmt = $db->prepare('SELECT chapter, verse, text FROM KJV_verses WHERE book_id = :bookID');
        $stmt->bindValue(':bookID', $bookID, SQLITE3_INTEGER);
        $result = $stmt->execute();

        $verses = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $verses[] = $row;
        }
        
        $data['bookName'] = $bookName;
        $data['verses'] = $verses;
        
        header('Content-Type: application/json');
        echo json_encode($data); 
        
        //$db->close();
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