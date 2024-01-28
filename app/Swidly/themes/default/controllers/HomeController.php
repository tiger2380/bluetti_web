<?php

declare(strict_types=1);

namespace Swidly\themes\default\controllers;

use Swidly\Core\Attributes\Middleware;
use Swidly\Core\Controller;
use Swidly\Core\Attributes\Route;
use Swidly\Core\SwidlyException;
use Swidly\Middleware\CsrfMiddleware;
use Swidly\Middleware\AccountMiddleware;


class HomeController extends Controller {

    /**
     * @throws SwidlyException
     */
    #[Route(methods: ['GET'], path: ['/', '/home'])]
    function Index($req, $res) {
        $this->render('dashboard', ['title' => 'Dashboard Page']);
    }

    /**
     * @throws SwidlyException
     */
    #[Route(methods: 'GET', path: '/about')]
    function About($req, $res) {
        $model = $this->getModel('PostModel');
        $this->render('about', ['title' => 'About Page']);
    }

    /**
     * @throws SwidlyException
     */
    #[Middleware((CsrfMiddleware::class))]
    #[Route(methods: ['GET', 'POST'], path: '/contact')]
    function Contact($req, $res) {
        $this->render('contact', ['title' => 'Contact Page']);
    }

    /**
     * @throws SwidlyException
     */
    #[Route(methods: 'GET', path: '/faq')]
    function Faq($req, $res) {
        $this->render('faq', ['title' => 'FAQ Page']);
    }

    #[Route(methods: 'GET', path: '/dashboard', name: 'dashboard')]
    function Dashboard($req, $res) {
        $this->render('dashboard', ['title' => 'Dashboard Page']);
    }
}