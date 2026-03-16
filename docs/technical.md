# OasisBio Technical Documentation

## Project Overview

OasisBio is a cross-era identity system that allows users to create and manage multiple identity versions across different time periods and fictional worlds. It provides a comprehensive platform for building, storing, and displaying digital identities with rich features including ability pools, repositories, 3D model support, and worldbuilding capabilities.

## Technology Stack

### Frontend
- **Framework**: Next.js 14.1.4 with App Router
- **Language**: TypeScript 5.4.3
- **Styling**: Tailwind CSS 3.4.3
- **Authentication**: NextAuth.js 4.24.13 with email/password and OAuth (Google, GitHub)
- **Components**: Custom React components
- **State Management**: React useState and useEffect hooks

### Backend
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.19.1
- **Authentication**: NextAuth.js with Prisma Adapter
- **Password Hashing**: bcryptjs 3.0.3

### Deployment
- **Hosting**: Cloudflare Pages
- **Database**: Supabase
- **Environment Variables**: .env file configuration

## Project Structure

```
OasisBio/
├── prisma/                  # Database models and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migration files
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API endpoints
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── bio/             # Public OasisBio pages
│   │   └── (other pages)    # Additional website pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions
│   └── generated/           # Generated Prisma client
├── docs/                    # Project documentation
├── .env                     # Environment variables
├── package.json             # Project dependencies
└── tailwind.config.js       # Tailwind CSS configuration
```

## Core Features

### 1. Cross-Era Identity System
- Multiple identity versions (Past, Present, Future, Alternate, Fictional)
- Timeline-based identity management
- Era-specific attributes and abilities

### 2. Ability Pool System
- Custom and official ability categories
- Skill levels (1-5)
- Era and world binding
- Categorized skill system

### 3. Repositories
- **DCOS (Dynamic Core Operating Script)**: Core identity narrative files
- **References**: External links and resources
- **Worlds**: Fictional world creation and management

### 4. 3D Model Support
- GLB file uploads (single binary format)
- 3D model preview
- Era-specific models
- World-bound visuals
- Model versioning

### 5. User Authentication
- Secure registration and login
- Password hashing (bcryptjs)
- Session management with JWT
- User profile information included in session
- Protected routes with middleware
- OAuth support (Google, GitHub)

## Database Models

### User
- id: String (primary key)
- name: String (optional)
- email: String (unique)
- emailVerified: DateTime (optional)
- image: String (optional)
- password: String
- createdAt: DateTime
- updatedAt: DateTime
- oasisBios: Array of OasisBio
- profiles: Array of Profile

### OasisBio
- id: String (primary key)
- userId: String (foreign key to User)
- title: String
- slug: String (unique)
- tagline: String (optional)
- identityMode: String (default: "real")
- birthDate: DateTime (optional)
- gender: String (optional)
- pronouns: String (optional)
- placeOfOrigin: String (optional)
- currentEra: String (optional)
- species: String (optional)
- status: String (optional)
- description: String (optional)
- visibility: String (default: "private")
- createdAt: DateTime
- updatedAt: DateTime
- abilities: Array of Ability
- dcosFiles: Array of DcosFile
- references: Array of ReferenceItem
- worlds: Array of WorldItem
- models: Array of ModelItem
- eras: Array of EraIdentity

### EraIdentity
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- eraType: String
- startDate: DateTime (optional)
- endDate: DateTime (optional)
- description: String (optional)

### Ability
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- category: String
- type: String (default: "custom")
- level: Int (default: 1)
- description: String (optional)
- relatedWorldId: String (optional)
- relatedEraId: String (optional)

### DcosFile
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- title: String
- content: String
- folder: String
- createdAt: DateTime
- updatedAt: DateTime

### ReferenceItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- url: String
- title: String
- type: String
- description: String (optional)
- tags: String

### WorldItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- summary: String
- timeline: String (optional)
- rules: String (optional)
- factions: String (optional)

### ModelItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- filePath: String (GLB file path)
- modelFormat: String (default: "glb")
- previewImage: String (optional)
- relatedWorldId: String (optional)
- relatedEraId: String (optional)
- isPrimary: Boolean (default: false)
- version: Int (default: 1)
- createdAt: DateTime
- updatedAt: DateTime

### Profile
- id: String (primary key)
- userId: String (foreign key to User)
- username: String (unique)
- displayName: String
- avatarUrl: String (optional)
- bio: String (optional)
- website: String (optional)
- locale: String (default: "en")
- defaultLanguage: String (default: "en")
- createdAt: DateTime
- updatedAt: DateTime

## Supabase Storage Configuration

### Storage Buckets

#### 1. avatars
- **Purpose**: User avatars
- **Access**: Public
- **Allowed MIME Types**: `image/webp`, `image/png`, `image/jpeg`
- **Max File Size**: 512 KB
- **Path Structure**: `{user_id}/avatar.{extension}`

#### 2. character-covers
- **Purpose**: Character cover images
- **Access**: Public
- **Allowed MIME Types**: `image/webp`, `image/png`, `image/jpeg`
- **Max File Size**: 800 KB
- **Path Structure**: `{user_id}/{character_id}/cover.{extension}`

#### 3. model-previews
- **Purpose**: Character model preview images
- **Access**: Public
- **Allowed MIME Types**: `image/webp`, `image/png`, `image/jpeg`
- **Max File Size**: 600 KB
- **Path Structure**: `{user_id}/{character_id}/preview.{extension}`

#### 4. models
- **Purpose**: 3D model files (GLB format)
- **Access**: Private
- **Allowed MIME Types**: `model/gltf-binary`, `application/octet-stream`
- **Max File Size**: 10 MB
- **Path Structure**: `{user_id}/{character_id}/{model_id}.glb`

### RLS Policies

#### models Bucket RLS Policies

**Read Policy**:
```sql
CREATE POLICY "Users can read their own models" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'models' 
  AND auth.uid() = (SELECT split_part(name, '/', 1)::uuid)
);
```

**Write Policy**:
```sql
CREATE POLICY "Users can write their own models" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'models' 
  AND auth.uid() = (SELECT split_part(name, '/', 1)::uuid)
);
```

**Delete Policy**:
```sql
CREATE POLICY "Users can delete their own models" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'models' 
  AND auth.uid() = (SELECT split_part(name, '/', 1)::uuid)
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

### User Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

### OasisBio Management
- `GET /api/oasisbios` - Get user's OasisBios
- `POST /api/oasisbios` - Create new OasisBio
- `GET /api/oasisbios/[id]` - Get specific OasisBio
- `PUT /api/oasisbios/[id]` - Update OasisBio
- `DELETE /api/oasisbios/[id]` - Delete OasisBio

### Ability Management
- `GET /api/oasisbios/[id]/abilities` - Get abilities for OasisBio
- `POST /api/oasisbios/[id]/abilities` - Add ability to OasisBio
- `PUT /api/abilities/[id]` - Update ability
- `DELETE /api/abilities/[id]` - Delete ability

### Repository Management
- **DCOS**: `GET|POST|PUT|DELETE /api/oasisbios/[id]/dcos`
- **References**: `GET|POST|PUT|DELETE /api/oasisbios/[id]/references`
- **Worlds**: `GET|POST|PUT|DELETE /api/oasisbios/[id]/worlds`

### Model Management
- `GET /api/oasisbios/[id]/models` - Get models for OasisBio
- `POST /api/oasisbios/[id]/models` - Upload model to OasisBio
- `DELETE /api/models/[id]` - Delete model

## Deployment

### Supabase Setup
1. Create a Supabase project
2. Configure the database with the provided schema
3. Set up environment variables with Supabase credentials

### Cloudflare Pages Deployment
1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next/static`
3. Add environment variables
4. Deploy the project

### Environment Variables
```
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.dhkgfdllgtmbkwcbubqt.supabase.co:5432/postgres"

# NextAuth.js Secret
NEXTAUTH_SECRET="[YOUR-NEXTAUTH-SECRET]"

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL="https://dhkgfdllgtmbkwcbubqt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Google OAuth
GOOGLE_CLIENT_ID="[YOUR-GOOGLE-CLIENT-ID]"
GOOGLE_CLIENT_SECRET="[YOUR-GOOGLE-CLIENT-SECRET]"

# GitHub OAuth
GITHUB_CLIENT_ID="[YOUR-GITHUB-CLIENT-ID]"
GITHUB_CLIENT_SECRET="[YOUR-GITHUB-CLIENT-SECRET]"
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

### Testing
- Run build: `npm run build`
- Run lint: `npm run lint`

## Security Considerations
- Passwords are hashed using bcryptjs
- Authentication is handled through NextAuth.js
- Protected routes require valid session
- Environment variables are kept secure
- Input validation is implemented for all user inputs

## Input Validation and Error Handling

### Validation Tool Library
The project includes a comprehensive validation tool library (`src/lib/validation.ts`) that provides:
- **Common validation rules**: required fields, email format, password strength, username validation, URL validation
- **Form-specific validation**: `validateRegisterForm` and `validateSettingsForm` functions
- **Custom validation support**: extensible validation rules and error messages

### Enhanced Input Component
The `Input` component has been enhanced with:
- **Real-time validation**: Debounced validation as users type
- **Error display**: Integrated error messages
- **External and internal validation**: Support for both form-level and field-level validation
- **Accessibility**: Proper error states and ARIA attributes

### Form Validation Implementation
- **Register page**: Client-side validation for name, email, and password fields
- **Settings page**: Validation for account, profile, and security settings
- **Error feedback**: Clear error messages for invalid inputs
- **Submission handling**: Form submission validation and loading states

### Error Handling and User Feedback
- **Form submission errors**: Server error handling and display
- **Success messages**: Feedback for successful operations
- **Loading states**: Visual feedback during form submission
- **Field-level errors**: Real-time error display for individual fields

## Performance Optimization
- Next.js App Router for efficient routing
- Server-side rendering for improved SEO
- Static generation for public pages
- Tailwind CSS for optimized styling
- Prisma ORM for efficient database queries

## Future Enhancements
- AI-assisted content generation
- Template marketplace
- Character collaboration features
- Shared worlds
- Advanced 3D model editing
- Mobile app development

## Testing

### Test Plan

The application includes a comprehensive testing plan with three levels of testing:

1. **Unit Tests** - Test individual components and utilities in isolation
2. **Integration Tests** - Test interactions between multiple components and systems
3. **End-to-End Tests** - Test complete user journeys through the application

### Test Files

#### Unit Tests

- `src/lib/validation.test.ts` - Tests for validation utilities
- `src/components/navigation/NavItem.test.tsx` - Tests for NavItem component
- `src/components/navigation/MobileMenuToggle.test.tsx` - Tests for MobileMenuToggle component
- `src/components/navigation/NavigationBar.test.tsx` - Tests for NavigationBar component
- `src/components/Input.test.tsx` - Tests for Input component

#### Integration Tests

- `src/app/auth/__tests__/authentication.test.ts` - Tests for authentication flow
- `src/components/navigation/__tests__/navigation-integration.test.tsx` - Tests for navigation system
- `src/app/dashboard/settings/__tests__/settings.test.tsx` - Tests for settings page

#### End-to-End Tests

- `e2e/onboarding.test.ts` - Tests for user onboarding flow
- `e2e/dashboard-navigation.test.ts` - Tests for dashboard navigation
- `e2e/settings.test.ts` - Tests for settings management
- `e2e/responsive.test.ts` - Tests for responsive design

### Test Dependencies

The following test dependencies are used:

- **Jest** - JavaScript testing framework
- **React Testing Library** - Testing utilities for React components
- **Playwright** - End-to-end testing framework
- **MSW (Mock Service Worker)** - API mocking for tests

### Test Coverage Goals

- **Unit Tests**: ≥ 80% code coverage
- **Integration Tests**: ≥ 70% code coverage
- **End-to-End Tests**: Cover all critical user flows

### Test Execution

Tests can be run with the following commands:

- `npm test` - Run unit tests
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:coverage` - Run unit tests with coverage reporting
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:debug` - Run end-to-end tests in debug mode

### Test Results

All unit tests for the validation utilities and navigation components have been implemented and passed. The Input component tests have been implemented but could not be run due to environment limitations. The integration and end-to-end tests are planned but not yet implemented.

### Test Maintenance

Tests should be updated when components change, and new tests should be added for new features. Regularly running tests ensures application stability and prevents regressions.
