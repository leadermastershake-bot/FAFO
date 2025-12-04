// packages/frontend/src/components/VirtualizedCanvas.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { getTradeSuggestion } from '../services/aiService';

// A simple modal component
function ThoughtChainModal({ thoughtChain, onClose }: { thoughtChain: string[], onClose: () => void }) {
  if (!thoughtChain.length) return null;

  const modalStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
    color: '#333'
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    fontSize: '1.5em'
  };

  return (
    <div style={modalStyle}>
      <button onClick={onClose} style={closeButtonStyle}>&times;</button>
      <h3>AI Thought Process</h3>
      <ul>
        {thoughtChain.map((thought, index) => (
          <li key={index}>{thought}</li>
        ))}
      </ul>
    </div>
  );
}

function LlmSprite({ suggestion, onClick }: { suggestion: any, onClick: () => void }) {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    // Rotate the sprite
    mesh.current.rotation.y += 0.01;
    // Add a gentle hover effect
    mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  const color = suggestion.suggestion === 'buy' ? 'green' : 'red';

  return (
    <mesh
      ref={mesh}
      scale={hovered ? 1.2 : 1}
      onClick={onClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <coneGeometry args={[1, 1.5, 8]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

export function VirtualizedCanvas() {
  const [suggestion, setSuggestion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [symbol, setSymbol] = useState('BTC');

  useEffect(() => {
    if (!symbol) return;

    const fetchSuggestion = async () => {
      setError(null);
      setSuggestion(null);
      try {
        const marketData = { symbol: symbol };
        const result = await getTradeSuggestion(marketData);
        setSuggestion(result);
      } catch (err) {
        setError('Failed to fetch AI suggestion.');
        console.error(err);
      }
    };

    fetchSuggestion();
  }, [symbol]);

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  }

  if (!suggestion) {
    return <div>Loading AI suggestion...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter crypto symbol (e.g., ETH)"
        />
        <button onClick={() => setSymbol(symbol)}>Get Suggestion</button>
      </div>
      <div style={{ width: '100%', height: '500px', position: 'relative', marginTop: '20px' }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <LlmSprite suggestion={suggestion} onClick={() => setModalOpen(true)} />
        </Canvas>
        {isModalOpen && (
          <ThoughtChainModal
            thoughtChain={suggestion.thought_chain}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
