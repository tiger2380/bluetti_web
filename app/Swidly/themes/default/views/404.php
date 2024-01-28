{@include 'inc/header'}
<div style="font-size: 3rem;">
    <section class="py-5 mt-5">
        <div class="container">
            <div class="row row-cols-1 d-flex justify-content-center align-items-center">
                <div class="col-md-10 text-center"><img class="img-fluid w-100"
                        src="/<?= Swidly\Core\Swidly::theme()['url'] ?>/assets/img/illustrations/404.svg"></div>
                <div class="col text-center">
                    <h2 class="display-3 fw-bold mb-4">Page Not Found</h2>
                    <p class="fs-4 text-muted">Fusce adipiscing sit, torquent porta pulvinar.</p>
                    <p class="fs-6 text-muted"><?= $message ?></p>
                </div>
            </div>
        </div>
    </section>
</div>
{@include 'inc/footer'}