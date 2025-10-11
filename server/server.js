const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PUBLISHED_DIR = path.join(__dirname, 'published');

// Ensure directories exist
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(PUBLISHED_DIR, { recursive: true });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- API Endpoints ---

// Simple hello endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password, accessLevel } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // In a real app, you would validate against a database.
  // For this simulation, any non-empty username/password is valid.
  console.log(`Login attempt for user: ${username} with access level ${accessLevel}`);

  // Return user object on success
  res.json({
    username: username,
    accessLevel: accessLevel,
    message: 'Login successful!'
  });
});

// --- Panel Data Endpoints ---

// System Status Data
app.get('/api/system-status', (req, res) => {
  res.json({
    status: 'Online',
    learningMode: 'Active',
    activeAgents: 3,
    databaseStatus: 'Connected',
    successRate: '68%',
    totalTrades: 142,
    uptime: '01:23:45',
  });
});

// Trading Dashboard Data
app.get('/api/trading-dashboard', (req, res) => {
  res.json({
    currentCapital: 1234.56,
    target: 10000.00,
    progress: 12.35,
    recentTrades: [
      { id: 1, type: 'BUY', pair: 'BTC/USD', price: 68123.45, profit: 56.78, success: true },
      { id: 2, type: 'SELL', pair: 'ETH/USD', price: 3456.78, profit: -12.34, success: false },
      { id: 3, type: 'BUY', pair: 'SOL/USD', price: 172.50, profit: 23.45, success: true },
    ]
  });
});

// Database Panel Data
app.get('/api/database-status', (req, res) => {
  res.json({
    records: 1200000,
    size: '256MB',
    backups: 12,
    nextBackup: 'In 3 hours',
    lastBackup: '3 hours ago',
  });
});

// Agents Panel Data
app.get('/api/agents', (req, res) => {
  res.json([
    { id: 'alpha', name: 'ALPHA - Strategy Optimizer', status: 'active', task: 'Analyzing market patterns', performance: 0.75 },
    { id: 'beta', name: 'BETA - Risk Manager', status: 'working', task: 'Monitoring portfolio risk', performance: 0.92 },
    { id: 'gamma', name: 'GAMMA - Network Monitor', status: 'learning', task: 'System health monitoring', performance: -0.15 },
  ]);
});

// Chat Endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  console.log(`Received chat message: ${message}`);
  res.json({
    sender: 'llm',
    text: `Acknowledged: "${message}". Processing...`
  });
});

// --- Page Management Endpoints ---

// Endpoint to upload a file
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully!', file: req.file });
});

// Endpoint to get all pages
app.get('/api/pages', (req, res) => {
  const unpublished = fs.readdirSync(UPLOADS_DIR);
  const published = fs.readdirSync(PUBLISHED_DIR);
  res.json({ unpublished, published });
});

// Endpoint to get a specific page's content
app.get('/api/page/:pageName', (req, res) => {
  const { pageName } = req.params;
  const unpublishedPath = path.join(UPLOADS_DIR, pageName);
  const publishedPath = path.join(PUBLISHED_DIR, pageName);

  if (fs.existsSync(unpublishedPath)) {
    res.sendFile(unpublishedPath);
  } else if (fs.existsSync(publishedPath)) {
    res.sendFile(publishedPath);
  } else {
    res.status(404).send('Page not found');
  }
});

// Endpoint to publish a page
app.post('/api/publish/:pageName', (req, res) => {
  const { pageName } = req.params;
  const sourcePath = path.join(UPLOADS_DIR, pageName);
  const destinationPath = path.join(PUBLISHED_DIR, pageName);

  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, destinationPath);
    res.json({ message: 'Page published successfully!' });
  } else {
    res.status(404).send('Page not found in uploads');
  }
});

// Endpoint to unpublish a page
app.post('/api/unpublish/:pageName', (req, res) => {
    const { pageName } = req.params;
    const sourcePath = path.join(PUBLISHED_DIR, pageName);
    const destinationPath = path.join(UPLOADS_DIR, pageName);

    if (fs.existsSync(sourcePath)) {
        fs.renameSync(sourcePath, destinationPath);
        res.json({ message: 'Page unpublished successfully!' });
    } else {
        res.status(404).send('Page not found in published');
    }
});


// Endpoint to delete a page
app.delete('/api/pages/:pageName', (req, res) => {
  const { pageName } = req.params;
  const unpublishedPath = path.join(UPLOADS_DIR, pageName);
  const publishedPath = path.join(PUBLISHED_DIR, pageName);

  if (fs.existsSync(unpublishedPath)) {
    fs.unlinkSync(unpublishedPath);
    res.json({ message: 'Page deleted successfully from uploads!' });
  } else if (fs.existsSync(publishedPath)) {
    fs.unlinkSync(publishedPath);
    res.json({ message: 'Page deleted successfully from published!' });
  } else {
    res.status(404).send('Page not found');
  }
});

// Serve published pages statically
app.use('/pages', express.static(PUBLISHED_DIR));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
