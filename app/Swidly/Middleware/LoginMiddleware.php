<?php

namespace Swidly\Middleware;

use Swidly\Core\SwidlyException;

class LoginMiddleware extends BaseMiddleWare {
    /**
     * @throws SwidlyException
     */
    public function execute($request, $response) {
        if ($request->is_authenticated) {
            $response->redirect(BASEURL.'/account');
        } else {
            $response->redirect(BASEURL.'/login');
        }
    }
}