import React, { useState } from 'react';
import './AuctionDetails.css';

// Mock data for a single auction
const mockAuction = {
  id: '1',
  title: 'Rare CryptoKitty',
  description: 'A one-of-a-kind CryptoKitty with a unique genetic sequence. It is one of only 100 ever minted.',
  startPrice: 10,
  endTime: new Date(Date.now() + 3600 * 1000),
  highestBid: 12,
  bidders: 3,
};

export function AuctionDetails() {
  const [bidAmount, setBidAmount] = useState('');

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount))) {
      alert('Please enter a valid bid amount.');
      return;
    }
    // In the future, this will submit the bid to the API
    console.log(`Submitting bid for ${bidAmount} ETH`);
    alert(`Your bid of ${bidAmount} ETH has been placed!`);
  };

  return (
    <div className="auction-details-container">
      <h2>{mockAuction.title}</h2>
      <div className="auction-info">
        <p>{mockAuction.description}</p>
        <div className="details-grid">
          <p><strong>Starting Bid:</strong> {mockAuction.startPrice} ETH</p>
          <p><strong>Highest Bid:</strong> {mockAuction.highestBid} ETH</p>
          <p><strong>Number of Bidders:</strong> {mockAuction.bidders}</p>
          <p><strong>Ends In:</strong> {((mockAuction.endTime.getTime() - Date.now()) / 1000 / 60).toFixed(0)} minutes</p>
        </div>
      </div>
      <div className="bidding-form-container">
        <h3>Place Your Bid</h3>
        <form onSubmit={handleBidSubmit}>
          <input
            type="text"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter your bid amount in ETH"
          />
          <button type="submit">Place Bid</button>
        </form>
      </div>
    </div>
  );
}
