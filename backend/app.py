from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Load Tesla data
def load_tesla_data():
    with open("data/tesla_data.json") as f:
        return json.load(f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/compare", methods=["POST"])
def compare():
    user_data = request.get_json()
    tesla_data = load_tesla_data()[user_data["tesla_model"]]
    comparison = {
        "Fuel/Energy": {
            "user_car": user_data["fuel_cost"],
            "tesla": tesla_data["fuel_cost"]
        },
        "Maintenance": {
            "user_car": user_data["maintenance_cost"],
            "tesla": tesla_data["maintenance_cost"]
        },
        "Insurance": {
            "user_car": user_data["insurance_cost"],
            "tesla": tesla_data["insurance_cost"]
        },
        "Total": {
            "user_car": user_data["total_cost"],
            "tesla": tesla_data["total_cost"]
        }
    }
    return jsonify(comparison)

if __name__ == "__main__":
    app.run(debug=True)
