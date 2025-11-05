from flask import Flask, request, jsonify
from llm_core import get_trade_suggestion, validate_action

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, from the Model Service!'

@app.route('/suggest', methods=['POST'])
def suggest():
    """
    Endpoint to get a trade suggestion.
    Expects JSON with 'market_data'.
    """
    data = request.get_json()
    if not data or 'market_data' not in data:
        return jsonify({"error": "Missing market_data"}), 400

    suggestion = get_trade_suggestion(data['market_data'])
    return jsonify(suggestion)

@app.route('/validate', methods=['POST'])
def validate():
    """
    Endpoint to validate a user action.
    Expects JSON with 'action_details'.
    """
    data = request.get_json()
    if not data or 'action_details' not in data:
        return jsonify({"error": "Missing action_details"}), 400

    validation = validate_action(data['action_details'])
    return jsonify(validation)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
