{@include 'inc/header'}
<section class="py-4 py-md-5 my-5">
    <div class="container py-md-5">
        <div class="row">
            <div class="col-md-6 text-center"><img class="img-fluid w-100" src="<?= Swidly\Core\Swidly::theme()['url'] ?>/assets/img/illustrations/login.svg"></div>
            <div class="col-md-5 col-xl-4 text-center text-md-start">
                <?php if (isset($results)): ?>
                <div class="col-md-6 offset-md-3">
                    <div class="alert alert-<?=$results['status'] ? 'success' : 'danger'?>" role="alert">
                        <?=$results['message']?>
                    </div>
                </div>
                <?php endif;?>
                <h2 class="display-6 fw-bold mb-5"><span class="underline pb-1"><strong>Login</strong><br></span></h2>
                <form method="post" data-bs-theme="light" action="">
                    <input type="hidden" name="csrf" value="<?= Swidly\Core\Store::csrf() ?>">
                    <div class="mb-3"><input class="shadow-sm form-control" type="email" name="email"
                            placeholder="Email"></div>
                    <div class="mb-5"><button class="btn btn-primary shadow" type="submit">{get_login_code,
                            default="Send Code"}</button>
                    </div>
                </form>
                <p class="text-muted"><a href="forgotten-password.html">Forgot your password?</a></p>
            </div>
        </div>
    </div>
</section>
{@include 'inc/footer'}