{@include 'inc/header'}
<?= Swidly\Core\Swidly::load_stylesheet_file('dashboard', '/assets/css') ?>
<div class="dashboard">
    <aside>
        <div class="toggle">
            <a href="/dashboard">
                <h1><?= Swidly\Core\Swidly::getTItle() ?></h1>
            </a>
        </div>
        <div class="sidebar">
            <nav>
                <a href="/dashboard" class="active">
                    <span class="material-symbols-sharp">
                        dashboard
                    </span>
                    Dashboard
                </a>
                <a href="/charts">
                    <span class="material-symbols-sharp">
                        monitoring
                    </span>
                    Charts
                </a>
                <a href="/logout"> 
                    <span class="material-symbols-sharp">
                        logout
                    </span>
                    Logout
                </a>
            </nav>
        </div>
    </aside>
    <main>
        <h2>Dashboard</h2>
        <section>
            <h3>
                Overview
                <small>Today</small>
                <span class="material-symbols-sharp">
                    calendar_today
                </span>
            </h3>
            <div class="blocks">
                <div class="block">
                    <div class="text">
                        <p>Device</p>
                        <small class="value" id="deviceName"></small>
                    </div>
                    <div class="icon">
                        <span class="material-symbols-sharp">
                            lightbulb
                        </span>
                    </div>
                </div>
                <div class="block">
                    <div class="text">
                        <p>Battery Status</p>
                        <small class="value" id="batteryStatus"></small>
                    </div>
                    <div class="icon">
                        <span class="material-symbols-sharp">
                            battery_4_bar
                        </span>
                    </div>
                </div>
                <div class="block">
                    <div class="text">
                        <p>Weather</p>
                        <small class="value" id="weatherCondition"></small>
                    </div>
                    <div class="icon">
                        <span class="material-symbols-sharp">
                            sunny
                        </span>
                    </div>
                </div>
                <div class="block">
                    <div class="text">
                        <p>PV Input</p>
                        <small class="value" id="pvInput">0W</small>
                    </div>
                    <div class="icon">
                        <span class="material-symbols-sharp">
                            solar_power
                        </span>
                    </div>
                </div>
            </div>
        </section>
        <div class="scrollable" style="height: calc(100vh - 155px);">
            <section style="margin-top: 1.4rem;">
                <div style="width: 100%; height: 300px; position: relative;">
                    <button class="btn" style="position: absolute; left: 2rem; top: 30px;" onClick="myChart.resetZoom()">Reset Zoom</button>
                    <canvas id="myChart"></canvas>
                </div>
                <hr/>
                <div style="width: 100%; height: 300px; position: relative;">
                    <button class="btn" style="position: absolute; left: 2rem; top: 30px;" onClick="batteryLineChart.resetZoom()">Reset Zoom</button>
                    <canvas id="batteryLineChart"></canvas>
                </div>
            </section>
            <hr />
            <section>
                <h2 style="color: white; margin-bottom: 2rem;">Details <label class="btn" style="font-size: 0.8rem; font-weight: lighter;" for="showDetails">Hide/Show Details</button></h2>
                <input type="checkbox" id="showDetails" checked/>
                <pre>
                    <div id="details"></div>
                </pre>
            </section>
        </div>
    </main>
    <article>
        <div class="user-notifications">
            <div class="dark-mode">
                <span class="material-symbols-sharp active">
                    light_mode
                </span>
                <span class="material-symbols-sharp">
                    dark_mode
                </span>
            </div>
            <button id="conntectBluetooth" class="btn">
                <span class="material-symbols-sharp">
                    bluetooth
                </span>
                Connect
            </button>
        </div>
        <div class="side-charts">
            <div style="flex: 1; width: 100%;">
                <semi-gauge id="loadGauge" maxValue="5000" value="0">
                    <span slot="label" id="loadGaugeLabel" class="label">0w</span>
                    <p>Load</p>
                </semi-gauge>
            </div>
            <div style="flex: 1; width: 100%;">
                <semi-gauge id="solarGauge" maxValue="3000" value="0" fill="#ffcc66">
                    <span slot="label" id="solarGaugeLabel" class="label">0w</span>
                    <p>Solar PV</p>
                </semi-gauge>
            </div>
            <div style="flex: 1; width: 100%;">
                <semi-gauge id="gridGauge" maxValue="5000" value="0" fill="#80bfff">
                    <span slot="label" id="gridGaugeLabel" class="label">0w</span>
                    <p>Grid</p>
                </semi-gauge>
            </div>
            <div style="flex: 1; width: 100%;">
                <semi-gauge id="batteryGauge" maxValue="5000" value="0" fill="#ff6666">
                    <span slot="label" id="batteryGaugeLabel" class="label">0w</span>
                    <p>Battery</p>
                </semi-gauge>
            </div>
        </div>
    </article>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
<script
    src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-zoom/2.0.1/chartjs-plugin-zoom.min.js"
    integrity="sha512-wUYbRPLV5zs6IqvWd88HIqZU/b8TBx+I8LEioQ/UC0t5EMCLApqhIAnUg7EsAzdbhhdgW07TqYDdH3QEXRcPOQ=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
></script>
<?= Swidly\Core\Swidly::load_script_file('gauge', '/assets/js/components') ?>
<?= Swidly\Core\Swidly::load_script_file('EventEmitter', '/assets/js') ?>
<?= Swidly\Core\Swidly::load_script_file('utils', '/assets/js') ?>
<?= Swidly\Core\Swidly::load_script_file('enums', '/assets/js') ?>
<?= Swidly\Core\Swidly::load_script_file('Parser', '/assets/js/devices') ?>
<?= Swidly\Core\Swidly::load_script_file('Commands', '/assets/js/devices') ?>
<?= Swidly\Core\Swidly::load_script_file('smooth-scrollbar', '/assets/js') ?>
<?= Swidly\Core\Swidly::load_script_file('app', '/assets/js') ?>
<?= Swidly\Core\Swidly::load_script_file('power-charts', '/assets/js') ?>
<?= Swidly\Core\Swidly::load_script_file('dashboard', '/assets/js') ?>
{@include 'inc/footer'}