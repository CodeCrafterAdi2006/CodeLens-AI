import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { db, hashPassword } from './db';
import { collectSignals } from './collector';
import {
  analyzeURLSignals,
  analyzeTextDescription,
  analyzeImageScreenshot
} from './ai';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'codelens-super-secret-key';

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Ensure large base64 screenshot uploads work
app.use(express.static(path.join(process.cwd(), 'dist'))); // Serve built frontend files in production

// Custom typescript typing helper
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  } | null;
}

// Authentication Middlewares
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded as any;
    next();
  });
}

function optionalAuthenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded as any;
    }
    next();
  });
}

// Auth Routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await db.createUser(email, password, name);
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user || hashPassword(password) !== user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analysis Routes
app.post('/api/analyze/url', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const userId = req.user ? req.user.id : null;
    
    // 1. Gather observable page indicators
    const signals = await collectSignals(url);
    
    // 2. Perform AI analysis combining extracted metrics
    const report = await analyzeURLSignals(signals, userId);
    
    // 3. Save report in local store
    const savedReport = await db.createReport(report);
    
    res.json(savedReport);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze/desc', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const userId = req.user ? req.user.id : null;
    const report = await analyzeTextDescription(description, userId);
    const savedReport = await db.createReport(report);

    res.json(savedReport);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze/image', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Base64 image is required' });
    }

    const userId = req.user ? req.user.id : null;
    const cleanFilename = filename || 'screenshot.png';

    // Remove base64 data prefix if present (e.g. data:image/png;base64,)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const report = await analyzeImageScreenshot(base64Data, cleanFilename, userId);
    const savedReport = await db.createReport(report);

    res.json(savedReport);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// History & Report Management
app.get('/api/reports', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const reports = await db.getReports(req.user.id);
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/:id', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const report = await db.getReportById(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // A report is viewable if:
    // 1. It belongs to the requester
    // 2. It is marked as shared (public)
    const userId = req.user ? req.user.id : null;
    if (report.userId !== userId && !report.isShared) {
      return res.status(403).json({ error: 'Access denied to this report' });
    }

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reports/:id/share', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isShared } = req.body;
    if (typeof isShared !== 'boolean') {
      return res.status(400).json({ error: 'isShared boolean flag is required' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const report = await db.getReportById(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.userId !== req.user.id) {
      return res.status(403).json({ error: 'Only the report owner can modify share status' });
    }

    const updated = await db.updateReportSharing(id, isShared);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Feedback API
app.post('/api/reports/:id/feedback', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comments, name } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating between 1 and 5 is required' });
    }

    const report = await db.getReportById(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const userId = req.user ? req.user.id : null;
    const userName = name || (req.user ? req.user.name : 'Anonymous Guest');

    const feedback = await db.createFeedback({
      reportId: id,
      userId,
      userName,
      rating,
      comments: comments || ''
    });

    res.status(201).json(feedback);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in production index
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Not Found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`CodeLens AI API server running on port ${PORT}`);
});
