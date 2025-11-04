import React, { useState } from 'react';
import './AddHoldingForm.css';

interface AddHoldingFormProps {
    onHoldingAdded: () => void;
    onCancel: () => void;
}

const AddHoldingForm: React.FC<AddHoldingFormProps> = ({ onHoldingAdded, onCancel }) => {
    const [asset, setAsset] = useState('');
    const [quantity, setQuantity] = useState('');
    const [averageCost, setAverageCost] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const response = await fetch('/api/portfolio/holding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset,
                    quantity: parseFloat(quantity),
                    averageCost: parseFloat(averageCost),
                }),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error || 'Failed to add holding.');
            }

            onHoldingAdded();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Add New Holding</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="asset">Asset (e.g., BTC, ETH)</label>
                        <input
                            id="asset"
                            type="text"
                            value={asset}
                            onChange={(e) => setAsset(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="averageCost">Average Cost per Unit ($)</label>
                        <input
                            id="averageCost"
                            type="number"
                            value={averageCost}
                            onChange={(e) => setAverageCost(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={submitting} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="btn-submit">
                            {submitting ? 'Adding...' : 'Add Holding'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHoldingForm;
