export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  role?: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Mock user data for development
const mockUsers: User[] = [
  {
    id: 1,
    email: 'jane@example.com',
    name: 'Jane Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: new Date('2024-01-15'),
    role: 'user',
  },
  {
    id: 2,
    email: 'sarah@example.com',
    name: 'Sarah Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2024-02-10'),
    role: 'user',
  },
  {
    id: 3,
    email: 'admin@luxeintimateS.com',
    name: 'Admin User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2024-01-01'),
    role: 'admin',
  },
];

// Authentication utilities
export class AuthService {
  private static currentUser: User | null = null;

  static async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    
    // Admin credentials
    if (email === 'admin@luxeintimateS.com' && password === 'admin123') {
      const adminUser = mockUsers.find(u => u.role === 'admin');
      if (adminUser) {
        this.currentUser = adminUser;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(adminUser));
        }
        return adminUser;
      }
    }
    
    // Regular user credentials
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    this.currentUser = user;
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
    
    return user;
  }

  static async register(email: string, password: string, name: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: mockUsers.length + 1,
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date(),
      role: 'user',
    };
    
    mockUsers.push(newUser);
    this.currentUser = newUser;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }
    
    return newUser;
  }

  static async logout(): Promise<void> {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
          return this.currentUser;
        } catch {
          localStorage.removeItem('auth_user');
        }
      }
    }
    
    return null;
  }

  static async refreshUser(): Promise<User | null> {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    // Simulate refreshing user data from API
    await new Promise(resolve => setTimeout(resolve, 500));
    return user;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || false;
  }

  static getAllUsers(): User[] {
    return mockUsers.filter(user => user.role !== 'admin');
  }
} 