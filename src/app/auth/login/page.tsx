'use client';

import React, { useState } from 'react';
import { useSession } from '@/lib/auth.client';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { AuthForm, AuthButton, AuthInput, OAuthButtons } from '@/components/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if already logged in
  if (session) {
    router.push('/');
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setError(error.message || 'Failed to send verification code');
      } else {
        setSuccess('Verification code sent to your email');
        setShowOtp(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsVerifying(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (error) {
        setError(error.message || 'Invalid verification code');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthForm title="Sign In" error={error} success={success}>
      {!showOtp ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
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
            isLoading={isSending}
          >
            Send Verification Code
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <AuthInput
            id="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
            required
          />
          <AuthInput
            id="otp"
            type="text"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <AuthButton 
              type="button" 
              variant="outline" 
              onClick={() => setShowOtp(false)}
            >
              Change Email
            </AuthButton>
            <AuthButton 
              type="submit" 
              isLoading={isVerifying}
            >
              Verify Code
            </AuthButton>
          </div>
        </form>
      )}
      
      <OAuthButtons />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-primary hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </AuthForm>
  );
}
