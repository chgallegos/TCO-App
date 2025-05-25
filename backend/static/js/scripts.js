document.addEventListener("DOMContentLoaded", function () {
  var carquery = new CarQuery();
  carquery.init();
  carquery.setFilters({ sold_in_us: true });
  carquery.initMakeDropdown("make");

  document.getElementById("make").addEventListener("change", function () {
    carquery.initModelDropdown("model", this.value);
  });

  document.getElementById("model").addEventListener("change", function () {
    carquery.initYearDropdown("year", document.getElementById("make").value, this.value);
  });

  document.getElementById("year").addEventListener("change", function () {
    carquery.initTrimDropdown("style", document.getElementById("make").value, document.getElementById("model").value, this.value);
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
  const data = {
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    year: document.getElementById("year").value,
    style: document.getElementById("style").value,
    zipcode: document.getElementById("zipcode").value,
    state: document.getElementById("state").value,
    fuel_cost: parseFloat(document.getElementById("fuel_cost").value),
    maintenance_cost: parseFloat(document.getElementById("maintenance_cost").value),
    insurance_cost: parseFloat(document.getElementById("insurance_cost").value),
    total_cost: parseFloat(document.getElementById("total_cost").value),
    tesla_model: document.getElementById("tesla_model").value,
    tesla_trim: document.getElementById("tesla_trim").value
  };

  fetch("/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
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
