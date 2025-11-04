import React, { useState, useEffect, useCallback } from 'react';
import './Portfolio.css';
import AddHoldingForm from './AddHoldingForm';
import PortfolioAssessment from './PortfolioAssessment';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAssessment, setShowAssessment] = useState(false);

    const fetchPortfolio = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/portfolio');
            if (!response.ok) {
                throw new Error('Failed to fetch portfolio.');
            }
            const data = await response.json();
            setPortfolio(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    const handleRemoveHolding = async (asset: string) => {
        if (!window.confirm(`Are you sure you want to remove ${asset}?`)) return;

        try {
            const response = await fetch(`/api/portfolio/holding/${asset}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove holding.');
            }
            fetchPortfolio(); // Refetch portfolio after removing
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading portfolio...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!portfolio) return <div>No portfolio found.</div>;

    const totalValue = portfolio.holdings.reduce((acc: number, holding: any) => acc + (holding.quantity * holding.averageCost), 0);

    return (
        <div className="portfolio-container">
            <h2>My Portfolio</h2>
            <div className="portfolio-summary">
                <h4>Total Value: ${totalValue.toFixed(2)}</h4>
            </div>
            <table className="holdings-table">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Quantity</th>
                        <th>Average Cost</th>
                        <th>Total Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.holdings.map((holding: any) => (
                        <tr key={holding.id}>
                            <td>{holding.asset}</td>
                            <td>{holding.quantity}</td>
                            <td>${holding.averageCost.toFixed(2)}</td>
                            <td>${(holding.quantity * holding.averageCost).toFixed(2)}</td>
                            <td>
                                <button
                                    onClick={() => handleRemoveHolding(holding.asset)}
                                    className="btn-remove"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="portfolio-actions">
                <button onClick={() => setShowAddForm(true)} className="btn-add-new">
                    Add New Holding
                </button>
                <button onClick={() => setShowAssessment(true)} className="btn-assess">
                    Unleash the Oracle
                </button>
            </div>

            {showAddForm && (
                <AddHoldingForm
                    onHoldingAdded={() => {
                        setShowAddForm(false);
                        fetchPortfolio();
                    }}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {showAssessment && <PortfolioAssessment onClose={() => setShowAssessment(false)} />}
        </div>
    );
};

export default Portfolio;
