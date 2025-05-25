
let mileageMultiplier = 1.2; // default to 12,000 mi/year
let chartInstance = null;

document.addEventListener("DOMContentLoaded", function () {
  const vehicleData = {
    "Porsche": {
      "Cayenne": {
        "2017": ["Base", "S", "Turbo"]
      }
    },
    "BMW": {
      "3 Series": {
        "2018": ["320i", "330i", "340i"]
      }
    },
    "Honda": {
      "Accord": {
        "2020": ["LX", "EX", "Sport"]
      }
    },
    "Toyota": {
      "Camry": {
        "2019": ["LE", "SE", "XLE"]
      }
    },
    "Chevrolet": {
      "Malibu": {
        "2020": ["LS", "LT", "Premier"]
      }
    },
    "Ford": {
      "F-150": {
        "2021": ["XL", "XLT", "Lariat"]
      }
    }
  };

  const makeSelect = document.getElementById("make");
  const modelSelect = document.getElementById("model");
  const yearSelect = document.getElementById("year");
  const styleSelect = document.getElementById("style");

  Object.keys(vehicleData).forEach(make => {
    const opt = document.createElement("option");
    opt.value = make;
    opt.text = make;
    makeSelect.appendChild(opt);
  });

  makeSelect.addEventListener("change", function () {
    modelSelect.innerHTML = "<option value=''>Select Model</option>";
    yearSelect.innerHTML = "<option value=''>Select Year</option>";
    styleSelect.innerHTML = "<option value=''>Select Style</option>";

    Object.keys(vehicleData[this.value]).forEach(model => {
      const opt = document.createElement("option");
      opt.value = model;
      opt.text = model;
      modelSelect.appendChild(opt);
    });
  });

  modelSelect.addEventListener("change", function () {
    yearSelect.innerHTML = "<option value=''>Select Year</option>";
    styleSelect.innerHTML = "<option value=''>Select Style</option>";

    const selectedMake = makeSelect.value;
    Object.keys(vehicleData[selectedMake][this.value]).forEach(year => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.text = year;
      yearSelect.appendChild(opt);
    });
  });

  yearSelect.addEventListener("change", function () {
    styleSelect.innerHTML = "<option value=''>Select Style</option>";

    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;
    const styles = vehicleData[selectedMake][selectedModel][this.value];
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
    const trimSelect = document.getElementById("tesla_trim");
    trimSelect.innerHTML = "";
    (trimMap[this.value] || []).forEach(trim => {
      const opt = document.createElement("option");
      opt.value = trim;
      opt.text = trim;
      trimSelect.appendChild(opt);
    });
  });

  document.querySelectorAll(".mileage-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".mileage-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      mileageMultiplier = parseFloat(this.getAttribute("data-multiplier"));
    });
  });

  document.getElementById("reset-btn").addEventListener("click", function () {
    document.getElementById("tco-form").reset();
    document.getElementById("comparisonChart").getContext("2d").clearRect(0, 0, 400, 400);
    document.getElementById("estimation").style.display = "none";
    document.getElementById("totals").innerHTML = "";
    mileageMultiplier = 1.2;
    document.querySelectorAll(".mileage-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-multiplier="1.2"]').classList.add("active");
  });
});

document.getElementById("tco-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("estimation").style.display = "block";
  document.getElementById("loading").textContent = "Loading vehicle cost estimates...";

  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  const style = document.getElementById("style").value;
  const state = document.getElementById("state").value;

  fetch("/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ make, model, year, style, state })
  })
    .then((response) => response.json())
    .then((data) => {
      data["Fuel/Energy"].user_car = Math.round(data["Fuel/Energy"].user_car * mileageMultiplier);
      data["Fuel/Energy"].tesla = Math.round(data["Fuel/Energy"].tesla * mileageMultiplier);
      data["Total"] = {
        user_car: data["Fuel/Energy"].user_car + data["Maintenance"].user_car + data["Insurance"].user_car,
        tesla: data["Fuel/Energy"].tesla + data["Maintenance"].tesla + data["Insurance"].tesla
      };
      drawChart(data);
    });
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
        { label: "Other Car", data: userCarData, backgroundColor: "#333" },
        { label: "Tesla", data: teslaData, backgroundColor: "#e82127" }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Other Car vs Tesla" }
      },
      scales: { y: { beginAtZero: true } }
    }
  });

  document.getElementById("totals").innerHTML = `
    <div><strong>Other Car Total:</strong> ${data["Total"].user_car.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
    <div><strong>Tesla Total:</strong> ${data["Total"].tesla.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
  `;
}
