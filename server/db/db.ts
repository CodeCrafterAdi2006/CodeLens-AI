import crypto from 'crypto';
import knex from './connection';

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

// Helper to deserialize SQLite text columns back into arrays/objects
function parseReportJSON(row: any): Report {
  return {
    ...row,
    isShared: Boolean(row.isShared),
    techStack: JSON.parse(row.techStack),
    architectureNodes: JSON.parse(row.architectureNodes),
    uiUxAnalysis: JSON.parse(row.uiUxAnalysis),
    databaseHypothesis: JSON.parse(row.databaseHypothesis),
    developmentWorkflow: JSON.parse(row.developmentWorkflow),
    learningRoadmap: JSON.parse(row.learningRoadmap),
    improvementSuggestions: JSON.parse(row.improvementSuggestions),
    missingInferences: JSON.parse(row.missingInferences),
  };
}

export function hashPassword(password: string): string {
  // Note: We use SHA-256 for now to avoid breaking existing users.
  // In Day 8, we will replace this with secure Bcrypt.
  return crypto.createHash('sha256').update(password).digest('hex');
}

export const db = {
  // User Operations
  async getUserById(id: string): Promise<User | null> {
    const user = await knex('users').where({ id }).first();
    return user || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await knex('users')
      .whereRaw('LOWER(email) = ?', [email.toLowerCase()])
      .first();
    return user || null;
  },

  async createUser(email: string, passwordPlain: string, name: string): Promise<User> {
    const existing = await this.getUserByEmail(email);
    if (existing) throw new Error('User already exists');

    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(passwordPlain),
      name,
      createdAt: new Date().toISOString()
    };

    await knex('users').insert(newUser);
    return newUser;
  },

  // Report Operations
  async getReports(userId: string | null): Promise<Report[]> {
    if (!userId) return [];
    const reports = await knex('reports')
      .where({ userId })
      .orderBy('createdAt', 'desc');
    return reports.map(parseReportJSON);
  },

  async getReportById(id: string): Promise<Report | null> {
    const report = await knex('reports').where({ id }).first();
    return report ? parseReportJSON(report) : null;
  },

  async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'isShared'>): Promise<Report> {
    const newReportId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Serialize objects/arrays into JSON strings for SQLite compatibility
    const dbReport = {
      ...reportData,
      id: newReportId,
      isShared: 0,
      createdAt,
      techStack: JSON.stringify(reportData.techStack),
      architectureNodes: JSON.stringify(reportData.architectureNodes),
      uiUxAnalysis: JSON.stringify(reportData.uiUxAnalysis),
      databaseHypothesis: JSON.stringify(reportData.databaseHypothesis),
      developmentWorkflow: JSON.stringify(reportData.developmentWorkflow),
      learningRoadmap: JSON.stringify(reportData.learningRoadmap),
      improvementSuggestions: JSON.stringify(reportData.improvementSuggestions),
      missingInferences: JSON.stringify(reportData.missingInferences),
    };

    await knex('reports').insert(dbReport);

    return {
      ...reportData,
      id: newReportId,
      isShared: false,
      createdAt
    };
  },

  async updateReportSharing(id: string, isShared: boolean): Promise<Report | null> {
    const rowsUpdated = await knex('reports')
      .where({ id })
      .update({ isShared: isShared ? 1 : 0 });

    if (rowsUpdated === 0) return null;
    return this.getReportById(id);
  },

  // Feedback Operations
  async createFeedback(feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    await knex('feedback').insert(newFeedback);
    return newFeedback;
  },

  async getFeedbackByReport(reportId: string): Promise<Feedback[]> {
    return knex('feedback').where({ reportId });
  }
};
