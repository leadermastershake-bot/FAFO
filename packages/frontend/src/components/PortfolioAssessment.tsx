import React, { useState, useEffect } from 'react';
import './PortfolioAssessment.css';

interface Assessment {
    overallAssessment: string;
    holdingAssessments: {
        asset: string;
        quantity: number;
        currentValue: string;
        suggestion: string;
    }[];
}

interface PortfolioAssessmentProps {
    onClose: () => void;
}

const PortfolioAssessment: React.FC<PortfolioAssessmentProps> = ({ onClose }) => {
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
