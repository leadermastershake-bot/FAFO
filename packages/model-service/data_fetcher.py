import requests
import time
import pandas as pd

# Token bucket for rate limiting
last_request_time = 0
tokens = 10 # Allow 10 requests in a burst

def can_make_request():
    global last_request_time, tokens

    current_time = time.time()
    time_passed = current_time - last_request_time

    # Add tokens based on time passed, up to a max of 10
    tokens = min(10, tokens + time_passed * 1) # Add 1 token per second

    if tokens >= 1:
        tokens -= 1
        last_request_time = current_time
        return True
    return False

# Placeholder for CoinGecko API base URL
BASE_URL = "https://api.coingecko.com/api/v3"

def get_market_chart(coin_id, vs_currency, days):
    """
    Fetches historical market data for a specific cryptocurrency.
    """
    while not can_make_request():
        time.sleep(0.1) # Wait for tokens to replenish

    url = f"{BASE_URL}/coins/{coin_id}/market_chart"
    params = {
        'vs_currency': vs_currency,
        'days': days
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes

        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def get_volatility(coin_id, vs_currency):
    """
    Fetches recent market data to calculate volatility.
    """
    # Fetch the last 2 days of data to have enough data points for volatility calculation
    market_data = get_market_chart(coin_id, vs_currency, days=2)
    if not market_data or 'prices' not in market_data:
        return None

    prices = [item[1] for item in market_data['prices']]
    returns = [(prices[i] - prices[i-1]) / prices[i-1] for i in range(1, len(prices))]

    # Calculate the standard deviation of the returns as a measure of volatility
    volatility = pd.Series(returns).std()
    return volatility
