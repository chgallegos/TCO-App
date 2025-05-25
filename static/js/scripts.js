document.getElementById("tco-form").addEventListener("submit", function(e) {
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
  .then(response => response.json())
  .then(data => drawChart(data));
});

function drawChart(data) {
  const labels = Object.keys(data);
  const userCarData = labels.map(key => data[key].user_car);
  const teslaData = labels.map(key => data[key].tesla);

  new Chart(document.getElementById("comparisonChart"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Your Car',
          data: userCarData
        },
        {
          label: 'Tesla',
          data: teslaData
        }
      ]
    }
  });
}
