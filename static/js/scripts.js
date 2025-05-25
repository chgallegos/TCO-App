document.getElementById("tco-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    year: document.getElementById("year").value,
    fuel_cost: parseFloat(document.getElementById("fuel_cost").value),
    maintenance_cost: parseFloat(document.getElementById("maintenance_cost").value),
    insurance_cost: parseFloat(document.getElementById("insurance_cost").value),
    total_cost: parseFloat(document.getElementById("total_cost").value),
    tesla_model: document.getElementById("tesla_model").value
  };

  fetch("/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((data) => drawChart(data));
});

let chartInstance = null;

function drawChart(data) {
  const labels = Object.keys(data);
  const userCarData = labels.map((key) => data[key].user_car);
  const teslaData = labels.map((key) => data[key].tesla);

  // Destroy old chart if it exists
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

  // Update totals
  const userTotal = data["Total"].user_car.toLocaleString("en-US", { style: "currency", currency: "USD" });
  const teslaTotal = data["Total"].tesla.toLocaleString("en-US", { style: "currency", currency: "USD" });

  document.getElementById("totals").innerHTML = `
    <div><strong>Other Car Total:</strong> ${userTotal}</div>
    <div><strong>Tesla Total:</strong> ${teslaTotal}</div>
  `;
}
