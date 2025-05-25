
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# State adjustment multipliers
STATE_COSTS = {
    "UT": { "gas": 1.0, "electric": 1.0 },
    "CA": { "gas": 1.2, "electric": 1.6 },
    "TX": { "gas": 0.95, "electric": 0.9 },
    "NY": { "gas": 1.1, "electric": 1.4 },
    "FL": { "gas": 1.05, "electric": 1.1 }
}

# Base fuel/electricity costs for 5 years
BASE_FUEL_COST = 9000
BASE_ELECTRIC_COST = 2500

# Expanded hardcoded TCO data
TCO_DATA = {
    "Porsche Cayenne 2017 Base": { "maintenance": 6000, "insurance": 4500 },
    "Porsche Cayenne 2017 S": { "maintenance": 6400, "insurance": 4600 },
    "Porsche Cayenne 2017 Turbo": { "maintenance": 6800, "insurance": 4700 },

    "BMW 3 Series 2018 320i": { "maintenance": 3600, "insurance": 4000 },
    "BMW 3 Series 2018 330i": { "maintenance": 3800, "insurance": 4100 },
    "BMW 3 Series 2018 340i": { "maintenance": 4000, "insurance": 4200 },

    "Honda Accord 2020 LX": { "maintenance": 2800, "insurance": 3700 },
    "Honda Accord 2020 EX": { "maintenance": 3000, "insurance": 3900 },
    "Honda Accord 2020 Sport": { "maintenance": 3200, "insurance": 4000 },

    "Toyota Camry 2019 LE": { "maintenance": 2600, "insurance": 3500 },
    "Toyota Camry 2019 SE": { "maintenance": 2800, "insurance": 3600 },
    "Toyota Camry 2019 XLE": { "maintenance": 3000, "insurance": 3700 },

    "Chevrolet Malibu 2020 LS": { "maintenance": 3000, "insurance": 3600 },
    "Chevrolet Malibu 2020 LT": { "maintenance": 3200, "insurance": 3700 },
    "Chevrolet Malibu 2020 Premier": { "maintenance": 3400, "insurance": 3900 },

    "Ford F-150 2021 XL": { "maintenance": 3700, "insurance": 4400 },
    "Ford F-150 2021 XLT": { "maintenance": 4000, "insurance": 4600 },
    "Ford F-150 2021 Lariat": { "maintenance": 4200, "insurance": 4800 }
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json()
    make = data.get("make")
    model = data.get("model")
    year = data.get("year")
    style = data.get("style")
    state = data.get("state", "UT")

    key = f"{make} {model} {year} {style}"
    state_factor = STATE_COSTS.get(state, STATE_COSTS["UT"])

    if key in TCO_DATA:
        car = TCO_DATA[key]
        result = {
            "Fuel/Energy": {
                "user_car": round(BASE_FUEL_COST * state_factor["gas"]),
                "tesla": round(BASE_ELECTRIC_COST * state_factor["electric"])
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
