'use client';

import React, { useState } from 'react';
import { useSession } from '@/lib/auth.client';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { AuthForm, AuthButton, AuthInput, OAuthButtons } from '@/components/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if already logged in
  if (session) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true,
        },
      });

      if (error) {
        setError(error.message || 'Registration failed');
      } else {
        setSuccess('Verification code sent to your email. Please check your inbox.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm title="Sign Up" error={error} success={success}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthButton 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
        >
          Sign Up
        </AuthButton>
      </form>
      
      <OAuthButtons />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/auth/login" className="text-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </AuthForm>
  );
}
