{@include 'inc/header'}
<style>
	  * {
		  padding: 0;
		  margin: 0;
		  box-sizing: border-box;
	  }
      body {
        background-color: rgb(41, 37, 41) !important;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
      #app {
		width: 98%;
		margin: 0 auto;
		padding: 2rem;
      }
      
	  .btn {
		padding: 10px;
		font-size: 14px;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		margin-bottom: 10px;
		background-color: #4caf50;
		color: white;
		transition: background-color 0.3s ease;
	  }
	  .btn:hover {
		  background-color: #3e8e41;
	  }
	  .btn:active {
		  color: black;
		  background-color: #3e8e41;
	  }
      pre {
        outline: 1px solid #ccc;
        padding: 5px;
        margin: 5px;
      }
      .string {
        color: green;
      }
      .number {
        color: darkorange;
      }
      .boolean {
        color: blue;
      }
      .null {
        color: magenta;
      }
      .key {
        color: red;
      }
      #remainingTime {
        position: absolute;
        bottom: 15px;
        color: white;
        font-size: 0.8rem;
        left: 50%;
        transform: translateX(-50%);
      }
      #showDetails {
        display: none;
      }
      #showDetails + pre {
        display: none;
      }
      #showDetails:checked + pre {
        display: block;
      }
    </style>
    <div id="app">
      <button id="btn" class="btn">Connect to Device</button>
      <hr/>
      <h2 style="color: white; margin-bottom: 2rem;">Details <label class="btn" style="font-size: 0.8rem; font-weight: lighter;" for="showDetails">Hide/Show Details</button></h2>
      <input type="checkbox" id="showDetails" checked/>
      <pre>
        <div id="details"></div>
      </pre>
      <div id="chart">
        <h2 style="color: white">Charts</h2>
        <div
          style="
            width: 100%;
            padding: 0;
            display: flex;
            justify-items: between;
            align-items: center;
            gap: 2;
          "
        >
          <div style="flex: 1; position: relative;">
            <canvas id="batteryChart" style="flex: 1"></canvas>
            <p id="remainingTime"></p>
          </div>
          <div style="flex: 1;">
            <canvas id="powerChart" style="flex: 1"></canvas>
          </div>
        </div>
        <hr/>
        <div style="width: 100vw; height: 80vh; position: relative;">
	        <button class="btn" style="position: absolute; left: 2rem; top: 30px;" onClick="myChart.resetZoom()">Reset Zoom</button>
	        <canvas id="myChart"></canvas>
        </div>
        <hr/>
        <div style="width: 100vw; height: 80vh; position: relative;">
	        <button class="btn" style="position: absolute; left: 2rem; top: 30px;" onClick="batteryLineChart.resetZoom()">Reset Zoom</button>
	        <canvas id="batteryLineChart"></canvas>
        </div>
      </div>
      <!--<p>AC OUTPUT: <span id="ac_output"></span></p>
        <p>AC INPUT POWER: <span id="ac_input"></span></p>
        <p>Battery: <span id="battery"></span></p>
        <p>DC INPUT POWER: <span id="dc_input"></span></p>
        <hr />
        <p>AC OUTPUT STATE: <span id="ac_output_state"></span></p>
        <p>DC OUTPUT STATE: <span id="dc_output_state"></span></p>-->
    </div>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-zoom/2.0.1/chartjs-plugin-zoom.min.js"
      integrity="sha512-wUYbRPLV5zs6IqvWd88HIqZU/b8TBx+I8LEioQ/UC0t5EMCLApqhIAnUg7EsAzdbhhdgW07TqYDdH3QEXRcPOQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <script src="EventEmitter.js"></script>
    <script src="utils.js"></script>
    <script src="enums.js"></script>
    <script src="devices/Parser.js"></script>
    <script src="devices/Commands.js"></script>
    <script src="app.js"></script>
    <script>
      
    </script>
{@include inc/footer}