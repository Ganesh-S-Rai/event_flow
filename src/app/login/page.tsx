
import { LoginForm } from './login-form';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-8">
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center justify-center mb-6" prefetch={false}>
                        <Zap className="h-8 w-8 text-primary" />
                        <span className="ml-2 text-2xl font-bold">EventFlow</span>
                    </Link>
                    <h1 className="text-3xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground">Enter your credentials to access your account</p>
                </div>
                <LoginForm />
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:underline" prefetch={false}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
