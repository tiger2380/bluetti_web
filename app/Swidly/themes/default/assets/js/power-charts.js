const ctx = document.getElementById("myChart");
const batteryLineCtx = document.getElementById("batteryLineChart");

const LIGHTTHEME = {
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
    pointBackgroundColor: "rgba(255, 99, 132, 1)",
    pointBorderColor: "#000",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: "rgba(255, 99, 132, 1)",
};
const DARKTHEME = {
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)",
    pointBackgroundColor: "rgba(54, 162, 235, 1)",
    pointBorderColor: "#fff",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: "rgba(54, 162, 235, 1)",
};

window.eventEmitter.on("theme", (data) => {
    if (data.theme === "dark") {
        myChart.options.scales.x.title.color = DARKTHEME.pointBorderColor;
        myChart.options.scales.x.ticks.color = DARKTHEME.pointBorderColor;
        myChart.options.scales.y.title.color = DARKTHEME.pointBorderColor;
        myChart.options.scales.y.ticks.color = DARKTHEME.pointBorderColor;
        myChart.options.plugins.title.color = DARKTHEME.pointBorderColor;
        myChart.options.plugins.legend.labels.color = DARKTHEME.pointBorderColor;
        myChart.options.plugins.subtitle.color = DARKTHEME.pointBorderColor;

        batteryLineChart.options.scales.x.title.color = DARKTHEME.pointBorderColor;
        batteryLineChart.options.scales.x.ticks.color = DARKTHEME.pointBorderColor;
        batteryLineChart.options.scales.y.title.color = DARKTHEME.pointBorderColor;
        batteryLineChart.options.scales.y.ticks.color = DARKTHEME.pointBorderColor;
        batteryLineChart.options.plugins.title.color = DARKTHEME.pointBorderColor;
        batteryLineChart.options.plugins.legend.labels.color =
          DARKTHEME.pointBorderColor;
        batteryLineChart.options.plugins.subtitle.color = DARKTHEME.pointBorderColor;

        myChart.update();
        batteryLineChart.update();
    } else {
        myChart.options.scales.x.title.color = LIGHTTHEME.pointBorderColor;
        myChart.options.scales.x.ticks.color = LIGHTTHEME.pointBorderColor;
        myChart.options.scales.y.title.color = LIGHTTHEME.pointBorderColor;
        myChart.options.scales.y.ticks.color = LIGHTTHEME.pointBorderColor;
        myChart.options.plugins.title.color = LIGHTTHEME.pointBorderColor;
        myChart.options.plugins.legend.labels.color =
          LIGHTTHEME.pointBorderColor;
        myChart.options.plugins.subtitle.color = LIGHTTHEME.pointBorderColor;

        batteryLineChart.options.scales.x.title.color =
          LIGHTTHEME.pointBorderColor;
        batteryLineChart.options.scales.x.ticks.color =
          LIGHTTHEME.pointBorderColor;
        batteryLineChart.options.scales.y.title.color =
          LIGHTTHEME.pointBorderColor;
        batteryLineChart.options.scales.y.ticks.color =
          LIGHTTHEME.pointBorderColor;
        batteryLineChart.options.plugins.title.color =
          LIGHTTHEME.pointBorderColor;
        batteryLineChart.options.plugins.legend.labels.color =
          LIGHTTHEME.pointBorderColor;
        batteryLineChart.options.plugins.subtitle.color =
          LIGHTTHEME.pointBorderColor;
        
        myChart.update();
        batteryLineChart.update();
    }
});

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  var strTime = hours + ":" + minutes + ":" + seconds + " " + ampm;
  return strTime;
}

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "AC Output",
        data: [0, 0, 0, 0],
        backgroundColor: ["rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
        fill: false,
        pointStyle: false,
      },
      {
        label: "AC Input",
        data: [0, 0, 0, 0],
        backgroundColor: ["rgba(54, 162, 235, 0.8)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
        fill: false,
        pointStyle: false,
      },
      {
        label: "DC Input",
        data: [0, 0, 0, 0],
        backgroundColor: ["rgba(75, 192, 192, 0.8)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
        fill: false,
        pointStyle: false,
        color: "black",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: "black",
        },
        ticks: {
          color: "black",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Power (W)",
          color: "black",
        },
        ticks: {
          color: "black",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Overall View",
        color: "black",
      },
      legend: {
        labels: {
          color: "black",
        },
      },
      subtitle: {
        display: true,
        text: "Click and drag to zoom | ctrl+drag to pan",
        color: "black",
        font: {
          size: 12,
          family: "arial, sans-serif",
          weight: "normal",
        },
        padding: {
          bottom: 10,
        },
      },
      zoom: {
        zoom: {
          drag: {
            enabled: true,
          },
          mode: "x",
          onZoomComplete: (chart) => {
            const zoomLevel = chart.chart.getZoomLevel();
            if (zoomLevel < 1) {
              chart.chart.resetZoom();
            }
          },
        },
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: "ctrl",
        },
      },
    },
  },
});

window.myChart = myChart;
const now = new Date();

const batteryLineChart = new Chart(batteryLineCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Battery",
        data: [0, 0, 0, 0],
        backgroundColor: ["rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
        pointStyle: false,
      },
      {
        label: "Battery Voltage",
        data: [0, 0, 0, 0],
        backgroundColor: ["rgba(54, 162, 235, 0.8)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
        pointStyle: false,
      },
    ],
  },
  options: {
    interaction: {
      intersect: false,
      mode: "index",
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: "black",
        },
        stacked: true,
        ticks: {
          color: "black",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Battery (SoC %)",
          color: "black",
        },
        ticks: {
          color: "black",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Battery View",
        color: "black",
      },
      legend: {
        labels: {
          color: "black",
        },
      },
      subtitle: {
        display: true,
        text: "Click and drag to zoom | ctrl+drag to pan",
        color: "black",
        font: {
          size: 12,
          family: "arial, sans-serif",
          weight: "normal",
        },
        padding: {
          bottom: 10,
        },
      },
      zoom: {
        zoom: {
          drag: {
            enabled: true,
          },
          mode: "x",
          onZoomComplete: (chart) => {
            const zoomLevel = chart.chart.getZoomLevel();
            if (zoomLevel < 1) {
              chart.chart.resetZoom();
            }
          },
        },
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: "ctrl",
        },
      },
    },
  },
});

window.batteryLineChart = batteryLineChart;

window.eventEmitter.on("update", async (data) => {
  const time = new Date();
  const timeStr =
    time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

  // reset power chart data and save image at 00:00:00 (24hr clock)
  if (timeStr === "00:00:00") {
    // take a capture of mychart canvas
    const image = myChart.toBase64Image();

    // save image to file
    const link = document.createElement("a");
    link.download = `performance-${timeStr}.png`;
    link.href = image;
    link.click();

    // clear mychart
    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
    myChart.data.datasets[1].data = [];
    myChart.data.datasets[2].data = [];
  }

  myChart.data.datasets[0].data.push(data.ac_output_power);
  myChart.data.datasets[1].data.push(data.ac_input_power);
  myChart.data.datasets[2].data.push(data.dc_input_power);

  //if (time.getMinutes() === 0 && time.getSeconds() === 0) {
  myChart.data.labels.push(formatAMPM(time));
  //} else {
  //   myChart.data.labels.push('');
  //}

  myChart.update();

  batteryLineChart.data.labels.push(formatAMPM(time));
  batteryLineChart.data.datasets[0].data.push(data.battery);
  batteryLineChart.data.datasets[1].data.push(data.internal_pack_voltage);
  batteryLineChart.update();

  // attempt to calculate battery remaning time
  const batteryCapacity = 51.2 * 60; // 51.2v, 60Ah = 3072wh
  const batteryEfficiency = 0.95; // 95% battery capacity(guessing)
  const outputLoad = data.ac_output_power || 1; // output load
  const inputLoad = (data.ac_input_power || 0) + (data.dc_input_power || 0); // input load (PV, Grid)
  const inverterEfficiency = 0.9; // 90% inverter efficiency
  const totalBatteryPercentage = data.battery;
  const timeRemaining =
    (batteryCapacity *
      batteryEfficiency *
      inverterEfficiency *
      (totalBatteryPercentage / 100)) /
    Math.abs(outputLoad - inputLoad); // hours

 // const text2 = `~ ${timeRemaining.toFixed(2)} hours remaining. `;
  //  document.getElementById("remainingTime").innerHTML = text2;
    document.querySelector('#deviceName').innerHTML = data.device_type;
    document.querySelector('#batteryStatus').innerHTML = data.battery + '%';
  document.querySelector('#pvInput').innerHTML = data.dc_input_power + 'w';
  document.querySelector('#loadGauge').setAttribute('value', data.ac_output_power);
  document.getElementById("loadGaugeLabel").textContent = data.ac_output_power + 'w';
  document
    .querySelector("#solarGauge")
    .setAttribute("value", data.dc_input_power);
  document.querySelector("#solarGaugeLabel").textContent = data.dc_input_power + 'w';
  document.querySelector('#gridGauge').setAttribute('value', data.ac_input_power);
  document.querySelector('#gridGaugeLabel').textContent = data.ac_input_power + 'w';

  const batteryLevel = ((data.dc_input_power + data.ac_input_power) - (data.ac_output_power + getPowerConsumption(data)));
  document.querySelector('#batteryGauge').setAttribute('value', Math.floor(batteryLevel));
  document.querySelector('#batteryGaugeLabel').textContent = Math.floor(batteryLevel) + 'w';

  if (batteryLevel < 0) {
    document
      .querySelector("#batteryGauge")
      .setAttribute("fill", "#ff6666");
  } else {
    document.querySelector('#batteryGauge').setAttribute('fill', '#12db00');
  }

  const response = await fetch("/api/monitoring", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  console.log(json);
});

function getPowerConsumption(data) {
  const device = data.device_type;
  const ac_state_bitwise = data.ac_output_state ? 1 : 0;
  const dc_state_bitwise = data.dc_output_state ? 2 : 0;
  const state = ac_state_bitwise & dc_state_bitwise;

  switch (state) {
    case 1: // ac only
      return device === "AC300" ? 37.6 : 27.4;
    case 2: // dc only
      return device === "AC300" ? 20.1 : 15.6;
    case 3: // both dc and ac is on
      return device === "AC300" ? 45.3 : 31.1;
    default:
      return device === "AC300" ? 16.9 : 12.6;
  }
}