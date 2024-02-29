{@include 'inc/header'}
<section class="py-4 py-md-5 my-5">
    <section class="py-4 py-md-5 my-5">
    <div class="container py-md-5">
        <div class="row">
            <h2>Welcome <?= \Swidly\Core\Store::get(\Swidly\Core\Swidly::getConfig('session_name')) ?></h2>
        </div>
    </div>
</section>
    
</section>
{@include 'inc/footer'}