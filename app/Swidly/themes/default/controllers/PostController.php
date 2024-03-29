<?php
    namespace Swidly\themes\default\controllers;

    use Swidly\Core\Attributes\Middleware;
    use Swidly\Core\Controller;
    use Swidly\Core\Attributes\Route;
use Swidly\Core\Http;
use Swidly\Middleware\AuthMiddleware;

    class PostController extends Controller {

        #[Route('GET', '/posts')]
        function Index($req, $res) {
            $response = Http::get('https://jsonplaceholder.typicode.com/posts');
            var_dump($response);
            $this->render('post', ['posts' => $posts, 'title' => 'Posts']);
        }

        #[Route(methods: ['POST'], path: '/posts/add', name: 'addPost')]
        function AddPost($req, $res) {
            $post = $this->getModel('PostModel');
            $post->setTitle($req->get('title'));
            $post->setBody($req->get('content'));
            $date = date('Y-m-d H:i:s');
            $post->setCreatedAt($date);

            if($post->save()) {
                $res->addData('message', 'Saved Successfully');
                $res->addData('status', true);
            } else {
                $res->addData('message', 'Unable to save data');
                $res->addData('status', false);
            }
            
            $res->json();
        }

        #[Middleware(AuthMiddleware::class)]
        #[Route(methods: ['GET'], path: '/post/:id', name: 'viewPost')]
        function ViewSingle($req, $res) {
            $id = $req->get('id');
            $post = $this->model->find(['id' => $id]);

            $this->render('single', ['post' => $post, 'title' => $post->getTitle()]);
        }

        #[Route(methods: ['POST'], path: '/posts/update', name: 'updatePost')]
        function UpdatePost($req, $res) {
            $postModel = $this->model->find(['id' => 2]);
            $postModel->setTitle($req->get('title'));

            $postModel->save();
        }
    }