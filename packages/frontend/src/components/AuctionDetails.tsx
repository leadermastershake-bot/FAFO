import React, { useState, useEffect } from 'react';
import './AuctionDetails.css';

interface Bid {
  id: string;
  bidder: string;
  amount: number;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  startPrice: number;
  endTime: string;
  bids: Bid[];
}

// This component will need to receive an auctionId as a prop
// For now, we'll hardcode one for demonstration
const MOCK_AUCTION_ID = "your_hardcoded_auction_id_here";

export function AuctionDetails({ auctionId = MOCK_AUCTION_ID }) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  useEffect(() => {
    fetch(`/api/auctions/${auctionId}?chain=ethereum`)
      .then(res => {
        if (!res.ok) throw new Error('This opportunity has vanished into the ether. Find another.');
        return res.json();
      })
      .then(data => {
        setAuction(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [auctionId]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount))) {
      setBidMessage('Enter a valid bid. Fortune favors the bold, not the careless.');
      return;
    }

    try {
      const response = await fetch(`/api/auctions/${auctionId}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chain: 'ethereum',
          bidder: '0xCurrentUser', // This will be dynamic in a real app
          amount: parseFloat(bidAmount),
          isEncrypted: false, // For now
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Your bid was rejected by the fates.');
      setBidMessage(`Your bid of ${bidAmount} ETH has been accepted! May fortune smile upon you.`);
    } catch (err: any) {
      setBidMessage(err.message);
    }
  };

  if (isLoading) return <div className="auction-details-container">Loading auction details...</div>;
  if (error) return <div className="auction-details-container error">{error}</div>;
  if (!auction) return null;

  const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(b => b.amount)) : auction.startPrice;

  return (
    <div className="auction-details-container">
      <h2>{auction.title}</h2>
      <div className="auction-info">
        <p>{auction.description}</p>
        <div className="details-grid">
          <p><strong>Starting Bid:</strong> {auction.startPrice} ETH</p>
          <p><strong>Highest Bid:</strong> {highestBid} ETH</p>
          <p><strong>Number of Bidders:</strong> {auction.bids.length}</p>
          <p><strong>Ends In:</strong> {((new Date(auction.endTime).getTime() - Date.now()) / 1000 / 60).toFixed(0)} minutes</p>
        </div>
      </div>
      <div className="bidding-form-container">
        <h3>Place Your Bid. Seize Your Destiny.</h3>
        <form onSubmit={handleBidSubmit}>
          <input
            type="text"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter your bid amount in ETH"
          />
          <button type="submit">Place Bid</button>
        </form>
        {bidMessage && <p className="bid-message">{bidMessage}</p>}
      </div>
    </div>
  );
}
