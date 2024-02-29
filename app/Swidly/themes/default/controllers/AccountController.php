<?php
    namespace Swidly\themes\default\controllers;

    use Swidly\Core\Attributes\Middleware;
    use Swidly\Core\Controller;
    use Swidly\Core\Attributes\Route;
    use Swidly\Core\Http;
    use Swidly\Middleware\AuthMiddleware;

    class AccountController extends Controller {
        #[Route('GET', '/account')]
        #[Middleware(AuthMiddleware::class)]
        function Index($request, $response) {
            $this->render('account');
        }
    }