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

export interface User {
  id: string;
  email: string;
  name: string;
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

const TOKEN_KEY = 'codelens_jwt_token';
const USER_KEY = 'codelens_user_data';
const ACTIVE_REPORT_KEY = 'codelens_active_report';

export const api = {
  // Auth Helpers
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  getUser(): User | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACTIVE_REPORT_KEY);
  },

  getHeaders(isMultipart = false): Record<string, string> {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth Operations
  async register(email: string, passwordPlain: string, name: string): Promise<User> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password: passwordPlain, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    this.setSession(data.token, data.user);
    return data.user;
  },

  async login(email: string, passwordPlain: string): Promise<User> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password: passwordPlain })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.setSession(data.token, data.user);
    return data.user;
  },

  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (!res.ok) {
        this.clearSession();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  // Analysis Operations
  async analyzeURL(url: string): Promise<Report> {
    const res = await fetch('/api/analyze/url', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'URL analysis failed');
    this.setActiveReport(data);
    return data;
  },

  async analyzeDescription(description: string): Promise<Report> {
    const res = await fetch('/api/analyze/desc', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Description analysis failed');
    this.setActiveReport(data);
    return data;
  },

  async analyzeScreenshot(base64Image: string, filename: string): Promise<Report> {
    const res = await fetch('/api/analyze/image', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ image: base64Image, filename })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Screenshot analysis failed');
    this.setActiveReport(data);
    return data;
  },

  // Report Operations
  async getReports(): Promise<Report[]> {
    const res = await fetch('/api/reports', {
      method: 'GET',
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch reports');
    return data;
  },

  async getReportById(id: string): Promise<Report> {
    const res = await fetch(`/api/reports/${id}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch report');
    return data;
  },

  async toggleShareReport(id: string, isShared: boolean): Promise<Report> {
    const res = await fetch(`/api/reports/${id}/share`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ isShared })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update share status');
    return data;
  },

  async submitFeedback(id: string, rating: number, comments: string, name?: string): Promise<Feedback> {
    const res = await fetch(`/api/reports/${id}/feedback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ rating, comments, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');
    return data;
  },

  // Active Report State caching
  getActiveReport(): Report | null {
    const data = localStorage.getItem(ACTIVE_REPORT_KEY);
    return data ? JSON.parse(data) : null;
  },

  setActiveReport(report: Report) {
    localStorage.setItem(ACTIVE_REPORT_KEY, JSON.stringify(report));
  }
};
