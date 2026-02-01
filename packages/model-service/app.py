from flask import Flask, request, jsonify
from data_fetcher import get_market_chart, get_volatility
from indicators import *
import pandas as pd

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Analyzes market data and returns a trading signal.
    """
    data = request.get_json()
    coin_id = data.get('coin_id')
    vs_currency = data.get('vs_currency')
    days = data.get('days')
    indicators_to_use = data.get('indicators', [])

    if not all([coin_id, vs_currency, days]):
        return jsonify({"error": "Missing required parameters"}), 400

    market_data = get_market_chart(coin_id, vs_currency, days)
    if not market_data or 'prices' not in market_data:
        return jsonify({"error": "Could not fetch market data"}), 500

    df = pd.DataFrame(market_data['prices'], columns=['timestamp', 'prices'])

    score = 0

    if 'sma' in indicators_to_use:
        sma_short = calculate_sma(df, window=10).iloc[-1]
        sma_long = calculate_sma(df, window=50).iloc[-1]
        if sma_short > sma_long:
            score += 1
        else:
            score -= 1

    if 'ema' in indicators_to_use:
        ema_short = calculate_ema(df, window=10).iloc[-1]
        ema_long = calculate_ema(df, window=50).iloc[-1]
        if ema_short > ema_long:
            score += 1
        else:
            score -= 1

    if 'rsi' in indicators_to_use:
        rsi = calculate_rsi(df).iloc[-1]
        if rsi < 30:
            score += 1
        elif rsi > 70:
            score -= 1

    if 'macd' in indicators_to_use:
        macd_line, signal_line = calculate_macd(df)
        if macd_line.iloc[-1] > signal_line.iloc[-1]:
            score += 1
        else:
            score -= 1

    if 'bollinger_bands' in indicators_to_use:
        upper_band, lower_band = calculate_bollinger_bands(df)
        if df['prices'].iloc[-1] < lower_band.iloc[-1]:
            score += 1
        elif df['prices'].iloc[-1] > upper_band.iloc[-1]:
            score -= 1

    if score > 0:
        signal = "buy"
    elif score < 0:
        signal = "sell"
    else:
        signal = "hold"

    return jsonify({"signal": signal})

@app.route('/market_data', methods=['POST'])
def market_data():
    """
    Fetches historical market data.
    """
    data = request.get_json()
    coin_id = data.get('coin_id')
    vs_currency = data.get('vs_currency')
    days = data.get('days')

    if not all([coin_id, vs_currency, days]):
        return jsonify({"error": "Missing required parameters"}), 400

    market_data = get_market_chart(coin_id, vs_currency, days)
    if not market_data or 'prices' not in market_data:
        return jsonify({"error": "Could not fetch market data"}), 500

    return jsonify(market_data)

@app.route('/volatility', methods=['POST'])
def volatility():
    """
    Fetches volatility data.
    """
    data = request.get_json()
    coin_id = data.get('coin_id')
    vs_currency = data.get('vs_currency')

    if not all([coin_id, vs_currency]):
        return jsonify({"error": "Missing required parameters"}), 400

    volatility = get_volatility(coin_id, vs_currency)
    if volatility is None:
        return jsonify({"error": "Could not fetch volatility data"}), 500

    return jsonify({"volatility": volatility})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
