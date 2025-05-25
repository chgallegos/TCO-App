
document.addEventListener("DOMContentLoaded", function () {
  const carquery = new CarQuery();
  carquery.init();
  carquery.setFilters({ sold_in_us: true });

  carquery.populateCarMakes("make");

  document.getElementById("make").addEventListener("change", function () {
    carquery.populateCarModels("model", this.value);
  });

  document.getElementById("model").addEventListener("change", function () {
    const make = document.getElementById("make").value;
    carquery.populateCarYears("year", make, this.value);
  });

  document.getElementById("year").addEventListener("change", function () {
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const year = this.value;
    carquery.populateCarTrims("style", make, model, year);
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

  // Simulated fetch of cost data
  setTimeout(() => {
    const simulatedData = {
      "Fuel/Energy": { user_car: 9500, tesla: 2500 },
      "Maintenance": { user_car: 4800, tesla: 2200 },
      "Insurance": { user_car: 6700, tesla: 6000 },
      "Total": {
        user_car: 9500 + 4800 + 6700,
        tesla: 2500 + 2200 + 6000
      }
    };

    document.getElementById("loading").textContent = "Estimates loaded.";
    drawChart(simulatedData);
  }, 1500);
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
