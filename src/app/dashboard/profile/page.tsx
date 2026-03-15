'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  locale: string;
  defaultLanguage: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    avatarUrl: '',
    bio: '',
    website: '',
    locale: 'en',
    defaultLanguage: 'en',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          username: data.profile.username || '',
          displayName: data.profile.displayName || '',
          avatarUrl: data.profile.avatarUrl || '',
          bio: data.profile.bio || '',
          website: data.profile.website || '',
          locale: data.profile.locale || 'en',
          defaultLanguage: data.profile.defaultLanguage || 'en',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data.profile);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-64 bg-muted/50 border-r border-border p-6 sticky top-0 h-screen">
          <div className="mb-12">
            <h1 className="text-2xl font-display font-bold">OasisBio</h1>
            <p className="text-muted-foreground text-sm">Profile</p>
          </div>
          
          <nav className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </a>
            </Button>
            <Button asChild className="w-full justify-start">
              <a href="/dashboard/profile">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/settings">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
            </Button>
          </nav>
        </div>

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-md">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your public profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="Your display name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="your-username"
                      required
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      This will be used in your public profile URL
                    </p>
                  </div>

                  <div>
                    <label htmlFor="avatarUrl" className="block text-sm font-medium mb-2">
                      Avatar URL
                    </label>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      type="url"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a little about yourself..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-2">
                      Website
                    </label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="locale" className="block text-sm font-medium mb-2">
                      Language
                    </label>
                    <select
                      id="locale"
                      name="locale"
                      value={formData.locale}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="defaultLanguage" className="block text-sm font-medium mb-2">
                      Default Content Language
                    </label>
                    <select
                      id="defaultLanguage"
                      name="defaultLanguage"
                      value={formData.defaultLanguage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving} size="lg">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
