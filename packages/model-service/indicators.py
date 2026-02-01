import pandas as pd
import numpy as np

def calculate_sma(data, window):
    """Calculates the Simple Moving Average (SMA)."""
    return data['prices'].rolling(window=window).mean()

def calculate_ema(data, window):
    """Calculates the Exponential Moving Average (EMA)."""
    return data['prices'].ewm(span=window, adjust=False).mean()

def calculate_rsi(data, window=14):
    """Calculates the Relative Strength Index (RSI)."""
    delta = data['prices'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(data, fast_period=12, slow_period=26, signal_period=9):
    """Calculates the Moving Average Convergence Divergence (MACD)."""
    ema_fast = calculate_ema(data, fast_period)
    ema_slow = calculate_ema(data, slow_period)
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal_period, adjust=False).mean()
    return macd_line, signal_line

def calculate_bollinger_bands(data, window=20, num_std_dev=2):
    """Calculates the Bollinger Bands."""
    sma = calculate_sma(data, window)
    std_dev = data['prices'].rolling(window=window).std()
    upper_band = sma + (std_dev * num_std_dev)
    lower_band = sma - (std_dev * num_std_dev)
    return upper_band, lower_band
