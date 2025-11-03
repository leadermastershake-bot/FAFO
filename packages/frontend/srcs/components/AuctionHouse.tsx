import React, { useState, useEffect } from 'react';

// Define the shape of our auction data
interface Auction {
  id: string;
  title: string;
  description: string;
  startPrice: number;
  endTime: string; // The backend will send this as an ISO string
}

export function AuctionHouse() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live auctions from our new, powerful backend
    fetch('/api/auctions?chain=ethereum') // Defaulting to Ethereum for now
      .then(res => {
        if (!res.ok) {
          throw new Error('The auction house is closed for maintenance. Please check back soon.');
        }
        return res.json();
      })
      .then(data => {
        setAuctions(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch auctions:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="auction-house-container">Summoning live auctions...</div>;
  }

  if (error) {
    return <div className="auction-house-container error">{error}</div>;
  }

  return (
    <div className="auction-house-container">
      <h2>Live Auctions: Your Arena of Opportunity</h2>
      <div className="auction-list">
        {auctions.length > 0 ? (
          auctions.map(auction => (
            <div key={auction.id} className="auction-card">
              <h3>{auction.title}</h3>
              <p>{auction.description}</p>
              <p><strong>Starting Bid:</strong> {auction.startPrice} ETH</p>
              <p><strong>Ends In:</strong> {((new Date(auction.endTime).getTime() - Date.now()) / 1000 / 60).toFixed(0)} minutes</p>
              <button>View Details</button>
            </div>
          ))
        ) : (
          <p>The arena is quiet for now, but new opportunities are always on the horizon. Stay sharp.</p>
        )}
      </div>
    </div>
  );
}
