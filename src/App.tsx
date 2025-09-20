import { useEffect } from 'react';
import { initDB } from './db';

function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-4xl font-bold text-purple-400">METABOTPRIME</h1>
      <p className="text-lg text-gray-400">LLM-Powered Trading AI</p>
      {/* Trading dashboard components will go here */}
    </div>
  );
}

export default App;
