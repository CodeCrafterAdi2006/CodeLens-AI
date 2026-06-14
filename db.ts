import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'database.json');

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface TechStackItem {
  name: string;
  confidence: number;
  reason: string;
}

export interface TechStack {
  frontend: TechStackItem[];
  backend: TechStackItem[];
  databaseInfra: TechStackItem[];
}

export interface Report {
  id: string;
  userId: string | null;
  title: string;
  domain: string;
  inputType: 'url' | 'image' | 'desc';
  inputValue: string;
  techStack: TechStack;
  architectureSummary: string;
  architectureNodes: Array<{
    id: string;
    type: 'client' | 'api' | 'db' | 'cache' | 'cdn';
    name: string;
    description: string;
    technologies: string[];
  }>;
  uiUxAnalysis: {
    typography: string;
    layouts: string;
    designTokens: string;
    details: string;
  };
  databaseHypothesis: {
    mermaidDiagram: string;
    tables: Array<{
      name: string;
      columns: Array<{ name: string; type: string; key?: string }>;
      relations: string[];
    }>;
  };
  developmentWorkflow: string[];
  learningRoadmap: Array<{
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    tech: string[];
  }>;
  improvementSuggestions: Array<{
    title: string;
    severity: 'High Impact' | 'Medium Impact' | 'Quick Win' | 'Critical';
    description: string;
    action: string;
  }>;
  missingInferences: string[];
  isShared: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  reportId: string;
  userId: string | null;
  userName: string;
  rating: number;
  comments: string;
  createdAt: string;
}

interface DBData {
  users: User[];
  reports: Report[];
  feedback: Feedback[];
}

async function readDB(): Promise<DBData> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    const initialData: DBData = { users: [], reports: [], feedback: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

async function writeDB(data: DBData): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export const db = {
  // User Operations
  async getUserById(id: string): Promise<User | null> {
    const data = await readDB();
    return data.users.find(u => u.id === id) || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const data = await readDB();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(email: string, passwordPlain: string, name: string): Promise<User> {
    const data = await readDB();
    const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new Error('User already exists');

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: hashPassword(passwordPlain),
      name,
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    await writeDB(data);
    return newUser;
  },

  // Report Operations
  async getReports(userId: string | null): Promise<Report[]> {
    const data = await readDB();
    if (!userId) return [];
    return data.reports.filter(r => r.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getReportById(id: string): Promise<Report | null> {
    const data = await readDB();
    return data.reports.find(r => r.id === id) || null;
  },

  async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'isShared'>): Promise<Report> {
    const data = await readDB();
    const newReport: Report = {
      ...reportData,
      id: crypto.randomUUID(),
      isShared: false,
      createdAt: new Date().toISOString()
    };

    data.reports.push(newReport);
    await writeDB(data);
    return newReport;
  },

  async updateReportSharing(id: string, isShared: boolean): Promise<Report | null> {
    const data = await readDB();
    const reportIndex = data.reports.findIndex(r => r.id === id);
    if (reportIndex === -1) return null;
    
    data.reports[reportIndex].isShared = isShared;
    await writeDB(data);
    return data.reports[reportIndex];
  },

  // Feedback Operations
  async createFeedback(feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
    const data = await readDB();
    const newFeedback: Feedback = {
      ...feedbackData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    data.feedback.push(newFeedback);
    await writeDB(data);
    return newFeedback;
  },

  async getFeedbackByReport(reportId: string): Promise<Feedback[]> {
    const data = await readDB();
    return data.feedback.filter(f => f.reportId === reportId);
  }
};
