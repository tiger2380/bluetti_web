<?php
    namespace Swidly\themes\default\controllers;

use Swidly\Core\Attributes\Middleware;
use Swidly\Core\Attributes\Route;
use Swidly\Core\Controller;
use Swidly\Middleware\CsrfMiddleware;
use Swidly\Core\PHPMailer;

class LoginController extends Controller {
    #[Route(['GET', 'POST'], '/login', 'login')]
    function Login($request, $response) {
        if ($request->isPost()) {
            /**
             * @var \Swidly\themes\default\models\UserModel
             */
            $user = $this->getModel('UserModel');
            if (!$user->find(['email' => $request->get('email')])) {
                $results = [
                    'status' => false,
                    'message' => 'Email address does not exist.'
                ];

                $this->render('login', ['results' => $results]);
                exit;
            }

            $results = $this->Code($request, $response);

            if ($results['status']) {
                $this->render('login-code', ['email' => $request->get('email')]);
                exit;
            } else {
                $this->render('login', ['results' => $results]);
                exit;
            }
        }
        
        $this->render('login');
    }

    #[Route('GET', '/logout', 'logout')]
    function Logout($request, $response) {
        \Swidly\Core\Store::delete(\Swidly\Core\Swidly::getConfig('session_name'));

        $response->redirect('/');
    }

    #[Route(['GET', 'POST'], '/signup', 'signup')]
    #[Middleware(CsrfMiddleware::class)]
    function Signup($request, $response) {
        if ($request->isPost()) {
            /**
             * @var \Swidly\themes\default\models\UserModel
             */
            $user = $this->getModel('UserModel');
            if ($user->find(['email' => $request->get('email')])) {
                $results = [
                    'status' => false,
                    'message' => 'Email address already exists.'
                ];

                $this->render('signup', ['results' => $results]);
                exit;
            }
            $user->setEmail($request->get('email'));

            if ($user->save()) {
                $results = $this->Code($request, $response);
                if ($results['status']) {
                    $this->render('login-code', ['email' => $request->get('email')]);
                    exit;
                } else {
                    $this->render('signup', ['results' => $results]);
                    exit;
                }
                exit;
            } else {
                dd('error');
            }
        }
        $this->render('signup');
    }

    #[Route('GET', '/login-code', 'login-code')]
    #[Middleware(CsrfMiddleware::class)]
    function loginCode($request, $response) {
        $this->render('login-code', ['email' => 'thaddeus.bibbs@hotmail.com']);
    }

    #[Route('GET', '/signout', 'signout')]
    function signout($request, $response)
    {
        \Swidly\Core\Store::delete(\Swidly\Core\Swidly::getConfig('session_name'));
        
        $response->redirect(BASEURL.'/home');
    }


    function Code($req, $res) {
        self::generateCode($req->get('email'));

        $results = [
            'status' => true,
            'message' => 'Code sent.'
        ];
        
        return $results;
    }

    function ViewCode($req, $res) {
        $email = $req->get('email');
        $this->render('login-code', ['email' => $email]);
    }

    #[Route('POST', '/validate-code', 'validate-code')]
    function validateCode($req, $res) {
        $email = $req->get('email');
        $code = $req->get('code');
        $results = [];

        $loginToken = $this->getModel('LoginTokensModel');
        $result = $loginToken->find(['email' => $email]);

        if($result) {
            $enddate = date($result->getTimestamp());
            $expiry_date = new \DateTime($enddate);
            $to_date = date("Y-m-d H:i:s");
            $start_date = new \DateTime($to_date);

            if(date_diff($start_date, $expiry_date)->i > 15) {
                $results = [
                    'status' => false,
                    'message' => 'Token has expired. A new one was sent to your email address.'
                ];
            } else {
                if($result->getToken() == trim($code)) {
                    \Swidly\Core\DB::Table('login_tokens')->Delete()->WhereOnce(['email' => $email]);

                    \Swidly\Core\Store::save(\Swidly\Core\Swidly::getConfig('session_name'), $email);

                    $results = [
                        'status' => true,
                        'message' => 'Please wait...'
                    ];
                }  else {
                    $results = [
                        'status' => false,
                        'message' => 'Invalid code'
                    ];
                }
            }
        } else {
            $results = [
                'status' => false,
                'message' => 'Please try again. If error persist, contact us at <email address>.'
            ];
        }

        echo json_encode($results);
    }


    static function generateCode($email) {
        $code = str_pad(random_int(0, 99999), 5, "0", STR_PAD_LEFT);

        $exists = \Swidly\Core\DB::Table('login_tokens')->Select()->Where(['email' => $email]);

        try {
            if(!$exists) {
                \Swidly\Core\DB::Table('login_tokens')->Insert([
                    'email' => $email,
                    'token' => $code,
                    'timestamp' => (new \DateTime())->format("Y-m-d H:i:s")
                ]);
            } else {
                //\Swidly\Core\DB::Table('login_tokens')->Update('unique_code = ?, timestamp = ? WHERE email = ?', [ $code, $email, time() ]);
                \Swidly\Core\DB::Table('login_tokens')->Update([
                    'token' => $code,
                    'timestamp' => (new \DateTime())->format("Y-m-d H:i:s")
                ])->Where(['email' => $email]);
            }

            $mail = new \Swidly\Core\PHPMailer\PHPMailer(true);

            $mail->IsSMTP(); // enable SMTP
            //$mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
            $mail->SMTPAuth = true; // authentication enabled
            $mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
            $mail->Host = "smtp.gmail.com";
            $mail->Port = 587;
            $mail->SMTPSecure = "tls"; 
            $mail->Username = "tiger2380@gmail.com";
            $mail->Password = "zycq sjit vbul virg";

            $mail->From = 'yourfriend@App.com';
            $mail->FromName = \Swidly\Core\Swidly::getConfig('app_title');
            $mail->addAddress($email);
            $mail->Subject = "Your ".\Swidly\Core\Swidly::getConfig('app_title')." Login Code";

            $app_title = \Swidly\Core\Swidly::getConfig('app_title');

$message = <<<HTML
    <html>
            <body style="background-color: #eee; padding: 3rem 0;">
                <h2 style="margin: 10px auto; width: 450px; text-align: center;">$app_title</h2>
                <div style="padding: 2rem; background-color: white; width: 450px; height: auto; margin: 5px auto;">
                    <p>Hello!</p>
                    <p>Here is your <strong>$app_title</strong> login code:</p>
                    <br/>
                    <strong style="font-size: 1.2rem;">{$code}</strong>
                    <br/><br/>
                    <p>This code is valid for the next 15 minutes.</p>
                    <p>If you did not request a login code from $app_title, please ignore this email.</p>
                </div>
            </body>
    </html>
HTML;
            $mail->isHTML(true);
            $mail->Body = $message;

            $mail->send();
        } catch(\Exception $ex) {
            dd($ex->getMessage());
            return false;
        }
        
        return $code;
    }
}