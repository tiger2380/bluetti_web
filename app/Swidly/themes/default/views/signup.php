{@include 'inc/header'}
<section class="py-4 py-md-5 my-5">
    <div class="container py-md-5">
        <div class="row">
            <?php if (isset($results)): ?>
            <div class="col-md-6 offset-md-3">
                <div class="alert alert-<?= $results['status'] ? 'success' : 'danger' ?>" role="alert">
                    <?= $results['message'] ?>
                </div>
            </div>
            <?php endif; ?>
            <div class="col-md-6 text-center"><img class="img-fluid w-100"
                    src="/<?= Swidly\Core\Swidly::theme()['url'] ?>/assets/img/illustrations/register.svg"></div>
            <div class="col-md-5 col-xl-4 text-center text-md-start">
                <h2 class="display-6 fw-bold mb-5"><span class="underline pb-1"><strong>Sign up</strong></span></h2>
                <form method="post" data-bs-theme="light">
                    <input type="hidden" name="csrf" value="<?= Swidly\Core\Store::csrf() ?>">
                    <div class="mb-3"><input class="shadow-sm form-control" type="email" name="email"
                            placeholder="Email"></div>
                    <div class="mb-5"><button class="btn btn-primary shadow" type="submit">{get_login_code,
                            default="Send Code"}</button>
                    </div>
                </form>
                <p class="text-muted">Have an account? <a href="login.html">Log in&nbsp;<svg
                            xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                            stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                            stroke-linejoin="round" class="icon icon-tabler icon-tabler-arrow-narrow-right">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <line x1="15" y1="16" x2="19" y2="12"></line>
                            <line x1="15" y1="8" x2="19" y2="12"></line>
                        </svg></a>&nbsp;</p>
            </div>
        </div>
    </div>
</section>
{@include 'inc/header'}