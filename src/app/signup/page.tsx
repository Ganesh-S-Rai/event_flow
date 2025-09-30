
import { SignupForm } from './signup-form';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-8">
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center justify-center mb-6" prefetch={false}>
                        <Zap className="h-8 w-8 text-primary" />
                        <span className="ml-2 text-2xl font-bold">EventFlow</span>
                    </Link>
                    <h1 className="text-3xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground">Enter your details below to get started</p>
                </div>
                <SignupForm />
                 <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline" prefetch={false}>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
