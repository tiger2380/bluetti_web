<?php

namespace Swidly\Middleware;

use Swidly\Core\SwidlyException;

class AuthMiddleware extends BaseMiddleWare {
    /**
     * @throws SwidlyException
     */
    public function execute($request, $response) {
        if(!$request->is_authenticated) {
            $response->redirect('/login', ['message' => 'You must be logged in to view this page.']);
        }
    }
}