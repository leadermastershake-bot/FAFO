import React, { useState, useEffect } from 'react';
import './PortfolioAssessment.css';

interface HoldingAssessment {
    asset: string;
    quantity: number;
    currentValue: string;
    suggestion: string;
    actionId: string;
}

interface Assessment {
    overallAssessment: string;
    holdingAssessments: HoldingAssessment[];
}

interface PortfolioAssessmentProps {
    onClose: () => void;
}

const PortfolioAssessment: React.FC<PortfolioAssessmentProps> = ({ onClose }) => {
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedbackSent, setFeedbackSent] = useState<string[]>([]);

    const handleFeedback = async (actionId: string, type: 'POSITIVE' | 'NEGATIVE') => {
        if (feedbackSent.includes(actionId)) return; // Prevent double submission

        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionId, type }),
            });
            setFeedbackSent(prev => [...prev, actionId]);
        } catch (err) {
            console.error('Failed to send feedback', err);
        }
    };

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const response = await fetch('/api/portfolio/assessment');
                if (!response.ok) {
                    throw new Error('The Oracle is silent. Failed to fetch assessment.');
                }
                const data = await response.json();
                setAssessment(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessment();
    }, []);

    return (
        <div className="modal-backdrop">
            <div className="modal-content assessment-modal">
                <button onClick={onClose} className="btn-close">X</button>
                <h3>The Oracle Has Spoken</h3>
                {loading && <p>Consulting the ether...</p>}
                {error && <p className="error">{error}</p>}
                {assessment && (
                    <>
                        <p className="overall-assessment">"{assessment.overallAssessment}"</p>
                        <div className="holding-assessments">
                            {assessment.holdingAssessments.map(holding => (
                                <div key={holding.asset} className="holding-card">
                                    <h4>{holding.asset}</h4>
                                    <p><strong>Value:</strong> ${holding.currentValue}</p>
                                    <p className="suggestion"><strong>Command:</strong> {holding.suggestion}</p>
                                    <div className="feedback-buttons">
                                        <button
                                            onClick={() => handleFeedback(holding.actionId, 'POSITIVE')}
                                            disabled={feedbackSent.includes(holding.actionId)}
                                            className="btn-feedback btn-positive"
                                        >👍</button>
                                        <button
                                            onClick={() => handleFeedback(holding.actionId, 'NEGATIVE')}
                                            disabled={feedbackSent.includes(holding.actionId)}
                                            className="btn-feedback btn-negative"
                                        >👎</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PortfolioAssessment;
