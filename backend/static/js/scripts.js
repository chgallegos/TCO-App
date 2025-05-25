
document.addEventListener("DOMContentLoaded", function () {
  const vehicleData = {
    Porsche: {
      "Cayenne": {
        "2017": ["Base", "S", "Turbo"]
      }
    },
    BMW: {
      "3 Series": {
        "2018": ["320i", "330i", "340i"]
      }
    },
    Honda: {
      "Accord": {
        "2020": ["LX", "EX", "Sport"]
      }
    }
  };

  const makeSelect = document.getElementById("make");
  const modelSelect = document.getElementById("model");
  const yearSelect = document.getElementById("year");
  const styleSelect = document.getElementById("style");

  // Populate makes
  Object.keys(vehicleData).forEach(make => {
    const opt = document.createElement("option");
    opt.value = make;
    opt.text = make;
    makeSelect.appendChild(opt);
  });

  makeSelect.addEventListener("change", function () {
    modelSelect.innerHTML = "";
    yearSelect.innerHTML = "";
    styleSelect.innerHTML = "";
    const models = Object.keys(vehicleData[this.value]);
    models.forEach(model => {
      const opt = document.createElement("option");
      opt.value = model;
      opt.text = model;
      modelSelect.appendChild(opt);
    });
  });

  modelSelect.addEventListener("change", function () {
    yearSelect.innerHTML = "";
    styleSelect.innerHTML = "";
    const selectedMake = makeSelect.value;
    const years = Object.keys(vehicleData[selectedMake][this.value]);
    years.forEach(year => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.text = year;
      yearSelect.appendChild(opt);
    });
  });

  yearSelect.addEventListener("change", function () {
    styleSelect.innerHTML = "";
    const styles = vehicleData[makeSelect.value][modelSelect.value][this.value];
    styles.forEach(style => {
      const opt = document.createElement("option");
      opt.value = style;
      opt.text = style;
      styleSelect.appendChild(opt);
    });
  });

  const trimMap = {
    "Model 3": ["Standard Range Plus", "Long Range", "Performance"],
    "Model Y": ["Long Range", "Performance"],
    "Model S": ["Dual Motor", "Plaid"],
    "Model X": ["Long Range", "Plaid"]
  };

  document.getElementById("tesla_model").addEventListener("change", function () {
    const selected = this.value;
    const trimSelect = document.getElementById("tesla_trim");
    trimSelect.innerHTML = "";
    if (trimMap[selected]) {
      trimMap[selected].forEach(trim => {
        const option = document.createElement("option");
        option.value = trim;
        option.text = trim;
        trimSelect.appendChild(option);
      });
    }
  });
});

let chartInstance = null;

document.getElementById("tco-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("estimation").style.display = "block";
  document.getElementById("loading").textContent = "Loading vehicle cost estimates...";

  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  const key = make + " " + model + " " + year;

  fetch("/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ make, model, year })
  })
    .then((response) => response.json())
    .then((data) => drawChart(data));
});

function drawChart(data) {
  const labels = Object.keys(data);
  const userCarData = labels.map((key) => data[key].user_car);
  const teslaData = labels.map((key) => data[key].tesla);

  if (chartInstance) chartInstance.destroy();

  const ctx = document.getElementById("comparisonChart").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Other Car",
          data: userCarData,
          backgroundColor: "#333"
        },
        {
          label: "Tesla",
          data: teslaData,
          backgroundColor: "#e82127"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Other Car vs Tesla"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  document.getElementById("totals").innerHTML = `
    <div><strong>Other Car Total:</strong> ${data["Total"].user_car.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
    <div><strong>Tesla Total:</strong> ${data["Total"].tesla.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
  `;
}
