<?php

/**
 * Created a route for the API
 */

use Swidly\Middleware\AuthMiddleware;
use Swidly\Core\DB;

$this->get('/sw_admin/themes', function($req, $res) {
    $documentRoot = $_SERVER['DOCUMENT_ROOT'];
    $themesPath = $documentRoot.'/Swidly/themes';
    $themeInfos = [];

    $themes = array_diff(scandir($themesPath), ['..', '.']);
    foreach ($themes as $theme) {
        $realPath = $themesPath.'/'.$theme;
        if(is_dir($realPath) && $theme !== 'sw_admin') {
            $themeFile = glob($realPath.'/theme.*')[0];
           $themeInfos[] = \Swidly\Core\File::readArray($themeFile);
        }
    }

    $res->addData('themes', $themeInfos);
    $res->json();
})->registerMiddleware(AuthMiddleware::class);

$this->post('/api/monitoring', function($req, $res) {
    $data = $req->getDecoded();
    $data['ip'] = $_SERVER['REMOTE_ADDR'];
    $sql = "INSERT INTO `monitoring`(`data`, `timestamp`, `user_id`) VALUES (?, ?, ?)";

    $payload = [
        json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        time(),
        1
    ];

    DB::SQL($sql)->run($payload);

    $res->addData('body', $data);
    $res->json();
});//->registerMiddleware(AuthMiddleware::class);

$this->get('/api/monitoring', function($req, $res) {
    $sql = "SELECT * FROM `monitoring` ORDER BY `timestamp` DESC LIMIT 100";
    $data = DB::SQL($sql)->run();
    $res->addData('data', $data);
    $res->json();
});