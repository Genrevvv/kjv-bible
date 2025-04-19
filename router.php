<?php
class Router {
    private $routes = [];

    public function add($path, $handler) {
        $this->routes[$path] = $handler;
    }

    public function dispatch($path) {
        foreach ($this->routes as $route => $handler) {
            if ($route[0] === '#' && substr($route, -1) === '#') {
                if (preg_match($route, $path, $matches)) {
                    array_shift($matches);
                    call_user_func_array($handler, $matches);
                    return;
                }
            } 
            elseif ($route === $path) {
                call_user_func($handler);
                return;
            }
        }

        echo 'Page not found';
    }
}
?>
