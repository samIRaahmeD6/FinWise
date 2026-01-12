from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    user_id = data.get("user_id", 0)
    month = data.get("month", 1)

    history = ["1000", "1200", "800", "950"]  

    try:
        history_numeric = np.array(history, dtype=float)
    except ValueError:
        return jsonify({"error": "History contains non-numeric values"}), 400

    avg = history_numeric.mean()

    predicted_expense = avg + month * 50 + int(user_id) * 10

    return jsonify({"predicted_expense": predicted_expense})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
