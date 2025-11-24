
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { isUserWhitelisted } from '@/lib/whitelist';
import { useToast } from './use-toast';
import { doc, getDoc } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: any;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

const protectedRoutes = ['/dashboard'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Mock user for development/demo purposes
    const mockUser: any = {
      uid: 'mock-user-id',
      email: 'demo@eventflow.com',
      displayName: 'Demo User',
    };
    const mockProfile: UserProfile = {
      uid: 'mock-user-id',
      email: 'demo@eventflow.com',
      role: 'admin',
      createdAt: new Date(),
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (!user && isProtectedRoute) {
      router.push('/login');
    } else if (user && (pathname === '/login' || pathname === '/signup')) {
      router.push('/dashboard');
    }

  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
