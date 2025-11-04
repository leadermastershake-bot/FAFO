import React, { useState, useEffect } from 'react';
import './TradeRatingModal.css';

interface Rating {
    finalScore: number;
    pnl: number;
    durationHours: number;
    marketBeat: boolean;
    bestCaseScenario: string;
    worstCaseScenario: string;
    breakdown: {
        pnlScore: number;
        durationScore: number;
        marketBeatScore: number;
        initialRiskScore: number;
    };
}

interface TradeRatingModalProps {
    tradeId: string;
    onClose: () => void;
}

const TradeRatingModal: React.FC<TradeRatingModalProps> = ({ tradeId, onClose }) => {
    const [rating, setRating] = useState<Rating | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await fetch(`/api/trades/${tradeId}/rating`);
                if (!response.ok) {
                    throw new Error('Failed to fetch trade rating.');
                }
                const data = await response.json();
                setRating(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRating();
    }, [tradeId]);

    return (
        <div className="modal-backdrop">
            <div className="modal-content rating-modal">
                <button onClick={onClose} className="btn-close">X</button>
                <h3>Arbiter's Verdict</h3>
                {loading && <p>Calculating score...</p>}
                {error && <p className="error">{error}</p>}
                {rating && (
                    <div className="rating-details">
                        <div className="final-score">
                            <p>Final Score</p>
                            <span>{rating.finalScore}</span>
                        </div>
                        <div className="rating-breakdown">
                            <h4>Performance Analysis</h4>
                            <p>P&L Score: {rating.breakdown.pnlScore}</p>
                            <p>Duration Score: {rating.breakdown.durationScore}</p>
                            <p>Market Beat Score: {rating.breakdown.marketBeatScore}</p>
                            <p>Risk Score: {rating.breakdown.initialRiskScore}</p>
                        </div>
                        <div className="scenarios">
                            <h4>Scenarios</h4>
                            <p>Best Case: ${rating.bestCaseScenario}</p>
                            <p>Worst Case: ${rating.worstCaseScenario}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradeRatingModal;
