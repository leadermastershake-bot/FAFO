import React, { useState, useEffect } from 'react';

// Mock data for now
const mockAuctions = [
  { id: '1', title: 'Rare CryptoKitty', description: 'A one-of-a-kind CryptoKitty', startPrice: 10, endTime: new Date(Date.now() + 3600 * 1000) },
  { id: '2', title: 'Decentraland Parcel', description: 'A prime piece of virtual real estate', startPrice: 100, endTime: new Date(Date.now() + 7200 * 1000) },
];

export function AuctionHouse() {
  const [auctions, setAuctions] = useState(mockAuctions);

  // In the future, this will fetch auctions from the API
  // useEffect(() => {
  //   fetch('/api/auctions?chain=ethereum') // Example for Ethereum
  //     .then(res => res.json())
  //     .then(data => setAuctions(data))
  //     .catch(err => console.error('Failed to fetch auctions:', err));
  // }, []);

  return (
    <div className="auction-house-container">
      <h2>Live Auctions</h2>
      <div className="auction-list">
        {auctions.map(auction => (
          <div key={auction.id} className="auction-card">
            <h3>{auction.title}</h3>
            <p>{auction.description}</p>
            <p><strong>Starting Bid:</strong> {auction.startPrice} ETH</p>
            <p><strong>Ends In:</strong> {((auction.endTime.getTime() - Date.now()) / 1000 / 60).toFixed(0)} minutes</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
