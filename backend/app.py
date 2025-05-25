from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# Hardcoded demo TCO dataset
TCO_DATA = {
    "Porsche Cayenne 2017": {
        "Fuel/Energy": { "user_car": 9000, "tesla": 2500 },
        "Maintenance": { "user_car": 6000, "tesla": 2000 },
        "Insurance": { "user_car": 4500, "tesla": 4000 },
        "Total": { "user_car": 19500, "tesla": 8500 }
    },
    "BMW 3 Series 2018": {
        "Fuel/Energy": { "user_car": 7500, "tesla": 2400 },
        "Maintenance": { "user_car": 3800, "tesla": 1800 },
        "Insurance": { "user_car": 4100, "tesla": 3900 },
        "Total": { "user_car": 15400, "tesla": 8100 }
    },
    "Honda Accord 2020": {
        "Fuel/Energy": { "user_car": 6800, "tesla": 2300 },
        "Maintenance": { "user_car": 3000, "tesla": 1700 },
        "Insurance": { "user_car": 3900, "tesla": 3500 },
        "Total": { "user_car": 13700, "tesla": 7500 }
    }
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json()
    key = f"{data['make']} {data['model']} {data['year']}"
    result = TCO_DATA.get(key, {
        "Fuel/Energy": { "user_car": 9000, "tesla": 2500 },
        "Maintenance": { "user_car": 6000, "tesla": 2000 },
        "Insurance": { "user_car": 4500, "tesla": 4000 },
        "Total": { "user_car": 19500, "tesla": 8500 }
    })
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
