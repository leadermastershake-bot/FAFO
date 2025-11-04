import React, { useState, useEffect } from 'react';
import './TradeHistory.css';
import TradeRatingModal from './TradeRatingModal';

interface Trade {
    id: string;
    asset: string;
    quantity: number;
    entryPrice: number;
    exitPrice: number | null;
    status: 'OPEN' | 'CLOSED';
    profitAndLoss: number | null;
    entryTimestamp: string;
}

const TradeHistory = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

    const fetchTrades = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/trades');
            if (!response.ok) {
                throw new Error('Failed to fetch trade history.');
            }
            const data = await response.json();
            setTrades(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrades();
    }, []);

    const handleCloseTrade = async (tradeId: string) => {
        const exitPrice = prompt('Enter the exit price for this trade:');
        if (!exitPrice || isNaN(parseFloat(exitPrice))) {
            alert('Invalid price entered.');
            return;
        }

        try {
            await fetch(`/api/trades/${tradeId}/close`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exitPrice: parseFloat(exitPrice) }),
            });
            fetchTrades(); // Refetch trades to show the updated status
        } catch (err) {
            alert('Failed to close trade.');
        }
    };

    if (loading) return <div>Loading trade history...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="trade-history-container">
            <h3>Trade Ledger</h3>
            <table className="trades-table">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Quantity</th>
                        <th>Entry Price</th>
                        <th>Exit Price</th>
                        <th>P&L</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map(trade => (
                        <tr key={trade.id} className={`status-${trade.status.toLowerCase()}`}>
                            <td>{trade.asset}</td>
                            <td>{trade.quantity}</td>
                            <td>${trade.entryPrice.toFixed(2)}</td>
                            <td>{trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : 'N/A'}</td>
                            <td className={trade.profitAndLoss && trade.profitAndLoss > 0 ? 'profit' : 'loss'}>
                                {trade.profitAndLoss ? `$${trade.profitAndLoss.toFixed(2)}` : 'N/A'}
                            </td>
                            <td>{trade.status}</td>
                            <td>{new Date(trade.entryTimestamp).toLocaleDateString()}</td>
                            <td>
                                {trade.status === 'OPEN' && (
                                    <button onClick={() => handleCloseTrade(trade.id)} className="btn-close-trade">
                                        Close
                                    </button>
                                )}
                                {trade.status === 'CLOSED' && (
                                    <button onClick={() => setSelectedTradeId(trade.id)} className="btn-view-rating">
                                        View Rating
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedTradeId && (
                <TradeRatingModal
                    tradeId={selectedTradeId}
                    onClose={() => setSelectedTradeId(null)}
                />
            )}
        </div>
    );
};

export default TradeHistory;
