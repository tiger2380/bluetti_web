const ctx = document.getElementById("myChart");
const batteryCtx = document.getElementById("batteryChart");
const powerCtx = document.getElementById("powerChart");
const batteryLineCtx = document.getElementById("batteryLineChart");
const batteryContext = batteryCtx.getContext("2d");

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
        powerChart.options.plugins.legend.labels.color = DARKTHEME.pointBorderColor;
        chart.options.plugins.legend.labels.color = DARKTHEME.pointBorderColor;
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

        chart.update();
        powerChart.update();
        myChart.update();
        batteryLineChart.update();
    } else {
        powerChart.options.plugins.legend.labels.color =
            LIGHTTHEME.pointBorderColor;
        chart.options.plugins.legend.labels.color = LIGHTTHEME.pointBorderColor;
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
        chart.update();
        powerChart.update();
    }
});

const batteryPlugin = {
  id: "batteryPlugin",
  afterDraw: (chart) => {
    const {
      ctx,
      config,
      data,
      chartArea: { top, bottom, left, right, height, width },
    } = chart;
    ctx.save();
    ctx.fillStyle = "rgba(199, 122, 188, 0)";
    ctx.fillRect(left, top, width, height);

    const fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    const text = (chart.data.datasets[0].data[0] || 0) + "%",
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height - 50;

    ctx.fillStyle = "rgba(199, 122, 188, 0.8)";
    ctx.fillText(text, textX, textY);
    ctx.restore();
  },
};

const powerChart = new Chart(powerCtx, {
  type: "doughnut",
  data: {
    labels: ["DC Input", "Load"],
    datasets: [
      {
        label: "Power",
        data: [0, 0],
        backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderColor: ["rgba(255, 255, 255 ,1)", "rgba(255, 255, 255 ,0.2)"],
        borderWidth: 1,
        circumference: 180,
        rotation: 270,
      },
    ],
  },
  options: {
    aspectRatio: 2,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  },
});

const chart = new Chart(batteryCtx, {
  type: "doughnut",
  data: {
    labels: ["battery"],
    datasets: [
      {
        label: "Battery Percentage",
        data: [0, 0],
        backgroundColor: ["rgba(159, 190, 253, 1)", "rgba(255, 255, 255, 1)"],
        borderColor: ["rgba(255, 255, 255 ,0.2)"],
        borderWidth: 1,
        circumference: 180,
        rotation: 270,
      },
    ],
  },
  options: {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "black",
        },
      },
      tooltip: {
        filter: (tooltipItem) => {
          return tooltipItem.dataIndex === 0;
        },
      },
    },
  },
  plugins: [batteryPlugin],
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

  chart.data.datasets[0].data[0] = data.battery;
  chart.data.datasets[0].data[1] = 100 - data.battery;
  chart.update();

  powerChart.data.datasets[0].data[0] = data.dc_input_power;
  powerChart.data.datasets[0].data[1] = data.ac_output_power;
  powerChart.update();

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

  const text2 = `~ ${timeRemaining.toFixed(2)} hours remaining. `;
    document.getElementById("remainingTime").innerHTML = text2;
    document.querySelector('#deviceName').innerHTML = data.device_type;
    document.querySelector('#batteryStatus').innerHTML = data.battery + '%';
    document.querySelector('#pvInput').innerHTML = data.dc_input_power + 'w';

  /*const response = await fetch("/api/monitoring", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify($data),
  });

  const json = await response.json();
  console.log(json);*/
});
