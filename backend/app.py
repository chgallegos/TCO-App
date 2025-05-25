
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# Fuel/Electricity adjustment factors by state (simplified for demo)
STATE_COSTS = {
    "UT": { "gas": 1.0, "electric": 1.0 },
    "CA": { "gas": 1.2, "electric": 1.6 },
    "TX": { "gas": 0.95, "electric": 0.9 },
    "NY": { "gas": 1.1, "electric": 1.4 },
    "FL": { "gas": 1.05, "electric": 1.1 }
}

# Expanded demo vehicle data
TCO_DATA = {
    "Porsche Cayenne 2017 Base": { "maintenance": 6000, "insurance": 4500, "tesla": 8500 },
    "BMW 3 Series 2018 330i": { "maintenance": 3800, "insurance": 4100, "tesla": 8100 },
    "Honda Accord 2020 EX": { "maintenance": 3000, "insurance": 3900, "tesla": 7500 },
    "Toyota Camry 2019 SE": { "maintenance": 2800, "insurance": 3600, "tesla": 7400 },
    "Chevrolet Malibu 2020 LT": { "maintenance": 3200, "insurance": 3700, "tesla": 7300 },
    "Ford F-150 2021 XLT": { "maintenance": 4000, "insurance": 4600, "tesla": 8200 }
}

# Base costs before adjustment (in USD)
BASE_FUEL_COST = 9000
BASE_ELECTRIC_COST = 2500

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json()
    key = f"{data['make']} {data['model']} {data['year']} {data['style']}"
    state = data.get("state", "UT")

    state_fuel_factor = STATE_COSTS.get(state, STATE_COSTS["UT"])

    if key in TCO_DATA:
        car = TCO_DATA[key]
        result = {
            "Fuel/Energy": {
                "user_car": round(BASE_FUEL_COST * state_fuel_factor["gas"]),
                "tesla": round(BASE_ELECTRIC_COST * state_fuel_factor["electric"])
            },
            "Maintenance": {
                "user_car": car["maintenance"],
                "tesla": 2000
            },
            "Insurance": {
                "user_car": car["insurance"],
                "tesla": 4000
            }
        }
        result["Total"] = {
            "user_car": sum([v["user_car"] for v in result.values()]),
            "tesla": sum([v["tesla"] for v in result.values()])
        }
    else:
        result = {
            "Fuel/Energy": { "user_car": 9500, "tesla": 2500 },
            "Maintenance": { "user_car": 5000, "tesla": 2000 },
            "Insurance": { "user_car": 4500, "tesla": 4000 },
            "Total": { "user_car": 19000, "tesla": 8500 }
        }

    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
