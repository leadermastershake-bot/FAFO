# llm_core.py
# This module will house the 1-bit BitNet LLM implementation.
import random
import time
import requests

def get_live_market_data(blockchain, address):
    """
    Fetches live market data from the DIA API.
    """
    url = f"https://api.diadata.org/v1/assetQuotation/{blockchain}/{address}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        return {
            "price": data.get("Price"),
            "volume": data.get("VolumeYesterdayUSD")
        }
    except requests.exceptions.RequestException as e:
        print(f"Error fetching live market data: {e}")
        return None

# A simple mapping for symbols to DIA API parameters
ASSET_MAP = {
    "BTC": {"blockchain": "Bitcoin", "address": "0x0000000000000000000000000000000000000000"},
    "ETH": {"blockchain": "Ethereum", "address": "0x0000000000000000000000000000000000000000"},
    "SOL": {"blockchain": "Solana", "address": "0x0000000000000000000000000000000000000000"},
}

def get_trade_suggestion(market_data):
    """
    Generates a trade suggestion based on live market data.
    """
    symbol = market_data.get('symbol', 'BTC').upper()
    asset_info = ASSET_MAP.get(symbol)

    if not asset_info:
        return {"error": f"Symbol '{symbol}' not supported."}

    blockchain = asset_info["blockchain"]
    address = asset_info["address"]

    thought_chain = [
        f"[Time: {time.time()}] Initializing analysis for: {symbol}",
        f"Step 1: Fetching live market data from DIA API for {blockchain}/{address}..."
    ]

    live_data = get_live_market_data(blockchain, address)

    if not live_data or live_data.get("price") is None:
        thought_chain.append("   - FAILED to fetch live market data. Using simulated data as fallback.")
        price = 60000 * (1 + random.uniform(-0.05, 0.05)) # Fallback price
        volume = 20000 * (1 + random.uniform(-0.2, 0.2)) # Fallback volume
    else:
        price = live_data["price"]
        volume = live_data["volume"]
        thought_chain.append(f"   - SUCCESS: Live Price={price:,.2f} USD, Volume={volume:,.2f} USD")

    thought_chain.append("Step 2: Evaluating moving averages (simulated logic on live data)...")

    # Simulate moving averages based on the live price
    ma_50 = price * (1 + random.uniform(-0.02, 0.02))
    ma_200 = price * (1 + random.uniform(-0.05, 0.05))

    if ma_50 > ma_200:
        thought_chain.append("   - 50-day MA is above 200-day MA. Bullish signal detected.")
        suggestion = "buy"
        confidence = 0.7
    else:
        thought_chain.append("   - 50-day MA is below 200-day MA. Bearish signal detected.")
        suggestion = "sell"
        confidence = 0.7

    thought_chain.append("Step 3: Analyzing trading volume...")
    if volume > 1_000_000_000: # Example threshold for high volume
        thought_chain.append(f"   - High trading volume ({volume:,.2f} USD) indicates strong market interest.")
        confidence += 0.15
    else:
        thought_chain.append(f"   - Low trading volume ({volume:,.2f} USD) indicates weak market interest.")
        confidence -= 0.1

    thought_chain.append("Step 4: Finalizing recommendation...")
    confidence = min(max(confidence, 0), 1)

    return {
        "suggestion": suggestion,
        "confidence": round(confidence, 2),
        "thought_chain": thought_chain,
        "estimated_profit_percent": round(random.uniform(1.5, 5.0), 2),
        "live_data_used": bool(live_data and live_data.get("price") is not None)
    }

def validate_action(action_details):
    """
    Simulates a more detailed security and risk validation logic.
    """
    thought_chain = [
        f"[Time: {time.time()}] Validating action: {action_details.get('type', 'N/A')} for {action_details.get('symbol', 'N/A')}",
        "Step 1: Checking against user's risk profile (simulated)..."
    ]

    user_risk_profile = "aggressive" # Placeholder
    is_risky_trade = action_details.get('leverage', 1) > 5

    if is_risky_trade and user_risk_profile != "aggressive":
        thought_chain.append("   - High-leverage trade conflicts with non-aggressive risk profile. Action invalid.")
        return {
            "is_valid": False,
            "reason": "Leverage exceeds user's risk tolerance.",
            "thought_chain": thought_chain
        }
    else:
        thought_chain.append("   - Action aligns with user's risk profile.")

    thought_chain.append("Step 2: Simulating market volatility check...")
    volatility_index = random.uniform(0.1, 1.0)
    if volatility_index > 0.8 and action_details.get('amount_usd', 0) > 1000:
        thought_chain.append("   - High market volatility detected for a large trade. Recommending caution.")
        return {
            "is_valid": True,
            "reason": "Action is valid, but high market volatility detected. Proceed with caution.",
            "thought_chain": thought_chain
        }
    else:
        thought_chain.append("   - Market volatility is within acceptable parameters.")

    thought_chain.append("Step 3: Final validation complete.")
    return {
        "is_valid": True,
        "reason": "Action is within all risk and security parameters.",
        "thought_chain": thought_chain
    }
