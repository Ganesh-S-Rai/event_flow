
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { isUserWhitelisted } from '@/lib/whitelist';
import { useToast } from './use-toast';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

const protectedRoutes = ['/dashboard'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        if (isUserWhitelisted(user.email)) {
          setUser(user);
        } else {
          signOut(auth);
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'Your email address is not authorized to access this application.',
          });
          setUser(null);
        }
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
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

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
