{@include 'inc/header'}
<link rel="stylesheet" href="/<?= Swidly\Core\Swidly::theme()['url'] ?>/assets/css/snackbar.css">
<link rel="stylesheet" href="/<?= Swidly\Core\Swidly::theme()['url'] ?>/assets/css/login-code.css">
<section class="py-4 py-md-5 my-5">
    <div class="container py-md-5">
        <div class="row otp-card">
            <div class="col-12 mt-3">
                <h1>OTP Verification</h1>
                <p class="text-muted">Code has been send to <strong>...<?= substr($email, stripos($email, '@') - 3, strlen($email)) ?></strong></p>
                <form method="post" action="<?= Swidly\Core\Swidly::path('validate-code') ?>">
                    <div class="otp-card-inputs">
                            <input type="text" maxlength="1" autofocus>
                            <input type="text" maxlength="1" autofocus>
                            <input type="text" maxlength="1" autofocus>
                            <input type="text" maxlength="1" autofocus>
                            <input type="text" maxlength="1" autofocus>
                    </div>
                </form>
                <p>Didn't get the OTP <a href="">Resend</a></p>
                <button disabled>Verify Code</button>
            </div>
        </div>
    </div>
</section>
<div id="snackbar"></div>
<script src="/<?= Swidly\Core\Swidly::theme()['url'] ?>/assets/js/snackbar.js"></script>
<script src="/<?= Swidly\Core\Swidly::theme()['url'] ?>/assets/js/login-code.js"></script>