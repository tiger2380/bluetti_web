<?php
    namespace Swidly\themes\default\controllers;

    use Swidly\Core\Attributes\Middleware;
    use Swidly\Core\Controller;
    use Swidly\Core\Attributes\Route;
    use Swidly\Middleware\AuthMiddleware;
    use Swidly\Core\Http;
    use Swidly\Core\Swidly;
    use Swidly\Core\Store;

    class PlaidController extends Controller {
        #[Middleware(AuthMiddleware::class)]
        function __construct() {}

            #[Route('GET', '/plaid')]
            function oauth($req, $res) {
                $this->render('plaid_oauth', [
                    'title' => 'Plaid OAuth',
                    'public_token' => $req->get('public_token', '')
                ]);
            }
            
            #[Route('POST', '/api/plaid/link/token/create')]
            function createLinkToken($req, $res) {
                $client = new Http();
                $response = $client->post('https://sandbox.plaid.com/link/token/create', [
                    'Content-Type: application/json',
                    'Accept: application/json'
                ], json_encode([
                    'client_id' => Swidly::getConfig('plaid::client_id'),
                    'secret' => Swidly::getConfig('plaid::sandbox'),
                    'user' => [
                        'client_user_id' => '123-test-user-id',
                        'legal_name' => 'John Doe',
                        'phone_number' => '+1 415 555 0123',
                        'phone_number_verified_time' => '2020-01-01T00:00:00Z',
                    ],
                    'client_name' => 'Swidly',
                    'products' => ['transactions'],
                    'country_codes' => ['US'],
                    'language' => 'en',
                    'webhook' => 'https://webhook.sample.com',
                    'link_customization_name' => 'default',
                    'redirect_uri' => 'https://localhost:8000/plaid/oauth',
                ]));
                
                echo json_encode(json_decode($response['body']));
            }

            #[Route('POST', '/api/plaid/public_token/exchange')]
            function publicTokenExchange($req, $res) {
                $client = new Http();
                $response = $client->post('https://sandbox.plaid.com/item/public_token/exchange', [
                    'Content-Type: application/json',
                    'Accept: application/json'
                ], json_encode([
                    'client_id' => Swidly::getConfig('plaid::client_id'),
                    'secret' => Swidly::getConfig('plaid::sandbox'),
                    'public_token' => $req->get('public_token')
                ]));
                
                $data = json_decode($response['body']);
                $access_token = $data->access_token;

                Store::set('access_token', $access_token);
            }

            #[Route('POST', '/api/plaid/is_user_connected')]
            function isUserConnect($req, $res) {
                if (Store::has('access_token')) {
                    $res->json([
                        'is_connected' => true,
                        'access_token' => Store::get('access_token')
                    ]);
                } else {
                    $res->json([
                        'is_connected' => false
                    ]);
                }
            }

            #[Route('POST', '/api/plaid/item/get')]
            function getItem($req, $res) {
                $client = new Http();
                $response = $client->post('https://sandbox.plaid.com/item/get', [
                    'Content-Type: application/json',
                    'Accept: application/json'
                ], json_encode([
                    'client_id' => Swidly::getConfig('plaid::client_id'),
                    'secret' => Swidly::getConfig('plaid::sandbox'),
                    'access_token' => $req->get('access_token')
                ]));
                $res->json($response);
            }

            #[Route('POST', '/api/plaid/link/token/get')]
            function getToken($req, $res) {
                $client = new Http();
                $response = $client->post('https://sandbox.plaid.com/link/token/get', [
                    'Content-Type: application/json',
                    'Accept: application/json'
                ], json_encode([
                    'client_id' => Swidly::getConfig('plaid::client_id'),
                    'secret' => Swidly::getConfig('plaid::sandbox'),
                    'link_token' => $req->get('link_token')
                ]));

                $res->json($response);
            }

            #[Route('POST', '/api/plaid/accounts/get')]
            function getAccounts($req, $res) {
                $client = new Http();
                $response = $client->post('https://sandbox.plaid.com/accounts/get', [
                    'Content-Type: application/json',
                    'Accept: application/json'
                ], json_encode([
                    'client_id' => Swidly::getConfig('plaid::client_id'),
                    'secret' => Swidly::getConfig('plaid::sandbox'),
                    'access_token' => $req->get('access_token')
                ]));
                $res->json($response);
            }
    }