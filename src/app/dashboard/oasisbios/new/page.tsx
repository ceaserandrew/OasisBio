'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface ValidationErrors {
  [key: string]: string;
}

// Memoized card components for each step
const StepCard = React.memo(({ children, className = '' }) => (
  <Card variant="outlined" className={`transition-all duration-300 ease-in-out transform hover:shadow-md ${className}`}>
    {children}
  </Card>
));

export default function CreateOasisBioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // Form data
  const [identityMode, setIdentityMode] = useState('real');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [placeOfOrigin, setPlaceOfOrigin] = useState('');
  const [currentEra, setCurrentEra] = useState('');
  const [species, setSpecies] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  // API states
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load form data from localStorage on mount
  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const savedData = localStorage.getItem('oasisbio-create-form');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setIdentityMode(parsedData.identityMode || 'real');
        setTitle(parsedData.title || '');
        setSlug(parsedData.slug || '');
        setTagline(parsedData.tagline || '');
        setBirthDate(parsedData.birthDate || '');
        setGender(parsedData.gender || '');
        setPronouns(parsedData.pronouns || '');
        setPlaceOfOrigin(parsedData.placeOfOrigin || '');
        setCurrentEra(parsedData.currentEra || '');
        setSpecies(parsedData.species || '');
        setStatus(parsedData.status || '');
        setDescription(parsedData.description || '');
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    }
  }, [session, router]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const formData = {
      identityMode,
      title,
      slug,
      tagline,
      birthDate,
      gender,
      pronouns,
      placeOfOrigin,
      currentEra,
      species,
      status,
      description
    };

    localStorage.setItem('oasisbio-create-form', JSON.stringify(formData));
  }, [identityMode, title, slug, tagline, birthDate, gender, pronouns, placeOfOrigin, currentEra, species, status, description]);

  if (!session) {
    return null;
  }

  // Validation functions
  const validateStep = useCallback((currentStep: Step): boolean => {
    const newErrors: ValidationErrors = {};

    if (currentStep === 1) {
      if (!title.trim()) {
        newErrors.title = 'Character name is required';
      }
      if (!species) {
        newErrors.species = 'Species is required';
      }
      if (!status) {
        newErrors.status = 'Status is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, species, status]);

  const handleNext = useCallback(() => {
    if (validateStep(step)) {
      if (step < 6) {
        setStep((prev) => (prev + 1) as Step);
      }
    }
  }, [step, validateStep]);

  const handlePrevious = useCallback(() => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  }, [step]);

  const handleSubmit = useCallback(async () => {
    if (validateStep(step)) {
      setLoading(true);
      setApiError(null);

      try {
        const formData = {
          identityMode,
          title,
          slug,
          tagline,
          birthDate,
          gender,
          pronouns,
          placeOfOrigin,
          currentEra,
          species,
          status,
          description
        };

        const response = await fetch('/api/oasisbios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to create OasisBio');
        }

        const result = await response.json();
        console.log('OasisBio created successfully:', result);

        // Clear form data from localStorage
        localStorage.removeItem('oasisbio-create-form');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error creating OasisBio:', error);
        if (error instanceof Error) {
          setApiError(error.message || 'Failed to create OasisBio. Please try again.');
        } else if (error === 'NetworkError') {
          setApiError('Network error. Please check your internet connection and try again.');
        } else {
          setApiError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  }, [step, validateStep, identityMode, title, slug, tagline, birthDate, gender, pronouns, placeOfOrigin, currentEra, species, status, description, router]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Create New OasisBio</h1>
          <Button asChild>
            <a href="/dashboard">Cancel</a>
          </Button>
        </div>

        {apiError && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-6">
            {apiError}
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 md:mb-12 overflow-x-auto pb-2">
          <div className="flex items-center min-w-full">
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-mono transition-all duration-300 ${stepNum <= step ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-muted-foreground'}`}>
                  {stepNum}
                </div>
                <div className="mt-1 md:mt-2 text-xs font-mono text-center">
                  {stepNum === 1 && 'Identity'}
                  {stepNum === 2 && 'Era'}
                  {stepNum === 3 && 'Abilities'}
                  {stepNum === 4 && 'Repos'}
                  {stepNum === 5 && 'Model'}
                  {stepNum === 6 && 'Publish'}
                </div>
                {stepNum < 6 && (
                  <div className={`flex-1 h-1 mx-1 md:mx-2 transition-all duration-300 ${stepNum < step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <StepCard>
            <CardHeader>
              <CardTitle>Step 1: Identity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Character Name
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter a name for your character"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium mb-1">
                    Tagline
                  </label>
                  <Input
                    id="tagline"
                    placeholder="A short description of this identity"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="identityMode" className="block text-sm font-medium mb-1">
                    Identity Mode
                  </label>
                  <select
                    id="identityMode"
                    value={identityMode}
                    onChange={(e) => setIdentityMode(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out"
                  >
                    <option value="real">Real</option>
                    <option value="fictional">Fictional</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="future">Future</option>
                    <option value="alternate">Alternate</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
                      Birth Date
                    </label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <Input
                      id="gender"
                      placeholder="Enter gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="pronouns" className="block text-sm font-medium mb-1">
                      Pronouns
                    </label>
                    <Input
                      id="pronouns"
                      placeholder="Enter pronouns"
                      value={pronouns}
                      onChange={(e) => setPronouns(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="placeOfOrigin" className="block text-sm font-medium mb-1">
                      Origin Place
                    </label>
                    <Input
                      id="placeOfOrigin"
                      placeholder="Enter place of origin"
                      value={placeOfOrigin}
                      onChange={(e) => setPlaceOfOrigin(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="species" className="block text-sm font-medium mb-1">
                      Species
                    </label>
                    <select
                      id="species"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out"
                    >
                      <option value="">Select species</option>
                      <option value="human">Human</option>
                      <option value="synthetic">Synthetic</option>
                      <option value="ai">AI</option>
                      <option value="unknown">Unknown</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    {errors.species && (
                      <p className="text-sm text-destructive mt-1">{errors.species}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out"
                    >
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                      <option value="unknown">Unknown</option>
                      <option value="mythic">Mythic</option>
                    </select>
                    {errors.status && (
                      <p className="text-sm text-destructive mt-1">{errors.status}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter a description of this identity"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Era */}
        {step === 2 && (
          <StepCard>
            <CardHeader>
              <CardTitle>Step 2: Era</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Create era identities for your character.</p>
                <div className="border border-border rounded-md p-4 mb-4">
                  <h3 className="font-medium mb-2">Add New Era</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Era Name" />
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <option value="past">Past</option>
                      <option value="present">Present</option>
                      <option value="future">Future</option>
                      <option value="alternate">Alternate</option>
                      <option value="worldbound">Worldbound</option>
                    </select>
                    <Input placeholder="Start Year" type="number" />
                    <Input placeholder="End Year" type="number" />
                    <Input placeholder="Description" />
                  </div>
                  <Button className="mt-4">Add Era</Button>
                </div>
                <div className="border border-border rounded-md p-4">
                  <h3 className="font-medium mb-2">Your Eras</h3>
                  <p className="text-muted-foreground">No eras added yet.</p>
                </div>
              </div>
            </CardContent>
          </StepCard>
        )}

        {/* Step 3: Abilities */}
        {step === 3 && (
          <StepCard>
            <CardHeader>
              <CardTitle>Step 3: Build Your Ability Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add abilities to your OasisBio. You can add custom abilities or choose from presets.
              </p>
              <div className="border border-border rounded-md p-4 mb-4">
                <h3 className="font-medium mb-2">Add New Ability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Ability Name" />
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="">Select Category</option>
                    <option value="languages">Languages</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts</option>
                    <option value="music">Music</option>
                    <option value="technology">Technology</option>
                    <option value="science">Science</option>
                    <option value="social">Social</option>
                    <option value="combat">Combat</option>
                    <option value="worldbuilding">Worldbuilding</option>
                    <option value="fantasy">Fantasy</option>
                  </select>
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="1">1 - Novice</option>
                    <option value="2">2 - Basic</option>
                    <option value="3">3 - Skilled</option>
                    <option value="4">4 - Advanced</option>
                    <option value="5">5 - Mastery</option>
                  </select>
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="preset">Preset</option>
                    <option value="custom">Custom</option>
                  </select>
                  <Input placeholder="Description" />
                </div>
                <Button className="mt-4">Add Ability</Button>
              </div>
              <div className="border border-border rounded-md p-4">
                <h3 className="font-medium mb-2">Your Abilities</h3>
                <p className="text-muted-foreground">No abilities added yet.</p>
              </div>
            </CardContent>
          </StepCard>
        )}

        {/* Step 4: Repositories */}
        {step === 4 && (
          <StepCard>
            <CardHeader>
              <CardTitle>Step 4: Build Your Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">DCOS (Dynamic Core Operating Script)</h3>
                  <p className="text-muted-foreground mb-4">
                    Create core files that define your identity's narrative.
                  </p>
                  <Button>Add DCOS File</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">References</h3>
                  <p className="text-muted-foreground mb-4">
                    Add external references that relate to your identity.
                  </p>
                  <Button>Add Reference</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Worlds</h3>
                  <p className="text-muted-foreground mb-4">
                    Create worlds that your identity belongs to.
                  </p>
                  <Button>Add World</Button>
                </div>
              </div>
            </CardContent>
          </StepCard>
        )}

        {/* Step 5: Model */}
        {step === 5 && (
          <StepCard>
            <CardHeader>
              <CardTitle>Step 5: Upload 3D Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload an OBJ file to represent your identity visually.
              </p>
              <div className="border border-dashed border-border rounded-md p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Drag and drop your OBJ file here, or click to browse
                </p>
                <Button>Select File</Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports .obj files only
                </p>
              </div>
            </CardContent>
          </StepCard>
        )}

        {/* Step 6: Publish */}
        {step === 6 && (
          <StepCard>
            <CardHeader>
              <CardTitle>Step 6: Preview & Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Review your OasisBio and publish it to make it public.
              </p>
              <div className="border border-border rounded-md p-4 mb-4">
                <h3 className="font-medium mb-2">OasisBio Preview</h3>
                <p className="text-muted-foreground">Preview will appear here</p>
              </div>
              <div className="flex items-center space-x-4">
                <input type="checkbox" id="public" className="mr-2" />
                <label htmlFor="public">Make this OasisBio public</label>
              </div>
            </CardContent>
          </StepCard>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevious} disabled={loading}>
              Previous
            </Button>
          )}
          {step < 6 ? (
            <Button onClick={handleNext} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
