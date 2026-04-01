# OasisBio Technical Documentation

## Project Overview

OasisBio is a cross-era identity system that allows users to create and manage multiple identity versions across different time periods and fictional worlds. It provides a comprehensive platform for building, storing, and displaying digital identities with rich features including ability pools, repositories, 3D model support, and worldbuilding capabilities.

## Technology Stack

### Frontend
- **Framework**: Next.js 14.1.4 with App Router
- **Language**: TypeScript 5.4.3
- **Styling**: Tailwind CSS 3.4.3
- **Authentication**: Supabase Auth with OTP
- **Components**: Custom React components
- **State Management**: React useState and useEffect hooks

### Backend
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.19.1
- **Authentication**: Supabase Auth with OTP
- **Object Storage**: Cloudflare R2 (for large files)
- **ZIP Processing**: archiver and unzipper

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
- **World Documents**: Detailed content for specific worlds

### 4. 3D Model Support
- GLB file uploads (single binary format)
- 3D model preview
- Era-specific models
- World-bound visuals
- Model versioning

### 5. User Authentication
- Secure registration and login
- Supabase Auth with OTP (One-Time Password) authentication
- Session management with Supabase Auth helpers
- User profile information included in session
- Protected routes with middleware

### 6. Import/Export Functionality
- **Export**: Download character data as ZIP files
  - Support for single character and batch exports
  - Export content includes character JSON, DCOS, references, world data, 3D models, and images
  - Files stored in Cloudflare R2 for efficient download
- **Import**: Upload ZIP files to create or update characters
  - Automatic parsing and processing of imported data
  - Support for both new character creation and existing character updates
  - Error handling and import result reporting
- **Export History**: Track recent export activities
  - Stores last 3 export records per user
  - Includes file name, size, character count, and timestamp

### 7. Layered Storage Architecture
- **Supabase Storage**: For small files and metadata
  - Avatars, character covers, model previews
  - JSON metadata files
- **Cloudflare R2**: For large files
  - 3D models (GLB format)
  - Export ZIP files
  - High-resolution textures
- **CDN Integration**: Cloudflare CDN for fast file delivery

## Database Models

### User
- id: String (primary key)
- name: String (optional)
- email: String (unique)
- emailVerified: DateTime (optional)
- image: String (optional)
- createdAt: DateTime
- updatedAt: DateTime
- oasisBios: Array of OasisBio
- profiles: Array of Profile
- exportHistory: Array of ExportHistory

### OasisBio
- id: String (primary key)
- userId: String (foreign key to User)
- title: String
- slug: String (unique)
- tagline: String (optional)
- summary: String (optional)
- identityMode: String (default: "real")
- birthDate: DateTime (optional)
- gender: String (optional)
- pronouns: String (optional)
- placeOfOrigin: String (optional)
- currentEra: String (optional)
- species: String (optional)
- status: String (default: "draft")
- description: String (optional)
- coverImageUrl: String (optional)
- defaultLanguage: String (default: "en")
- visibility: String (default: "private")
- featured: Boolean (default: false)
- publishedAt: DateTime (optional)
- createdAt: DateTime
- updatedAt: DateTime
- abilities: Array of Ability
- dcosFiles: Array of DcosFile
- references: Array of ReferenceItem
- worlds: Array of WorldItem
- models: Array of ModelItem
- eras: Array of EraIdentity
- publication: OasisBioPublication
- relationshipsA: Array of CharacterRelationship
- relationshipsB: Array of CharacterRelationship

### EraIdentity
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- eraType: String
- startYear: Int (optional)
- endYear: Int (optional)
- description: String (optional)
- sortOrder: Int (default: 0)
- abilities: Array of Ability

### Ability
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- category: String
- sourceType: String (default: "custom")
- level: Int (default: 1)
- description: String (optional)
- relatedWorldId: String (optional)
- relatedEraId: String (optional)

### DcosFile
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- title: String
- slug: String (unique)
- content: String
- folderPath: String
- status: String (default: "draft")
- version: Int (default: 1)
- eraId: String (optional)
- createdAt: DateTime
- updatedAt: DateTime

### ReferenceItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- url: String
- title: String
- description: String (optional)
- sourceType: String
- provider: String (optional)
- coverImage: String (optional)
- metadata: String (optional)
- eraId: String (optional)
- worldId: String (optional)
- tags: String

### WorldItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- summary: String
- timeSetting: String (optional)
- geography: String (optional)
- physicsRules: String (optional)
- socialStructure: String (optional)
- aestheticKeywords: String (optional)
- majorConflict: String (optional)
- visibility: String (default: "private")
- timeline: String (optional)
- rules: String (optional)
- factions: String (optional)
- documents: Array of WorldDocument
- abilities: Array of Ability

### WorldDocument
- id: String (primary key)
- worldId: String (foreign key to WorldItem)
- title: String
- docType: String
- slug: String
- content: String
- folderPath: String (default: "/")
- sortOrder: Int (default: 0)
- createdAt: DateTime
- updatedAt: DateTime

### ModelItem
- id: String (primary key)
- oasisBioId: String (foreign key to OasisBio)
- name: String
- filePath: String
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

### ExportHistory
- id: String (primary key)
- userId: String (foreign key to User)
- fileName: String
- fileSize: Int
- characterCount: Int
- createdAt: DateTime

## Storage Configuration

### Layered Storage Architecture

#### 1. Supabase Storage (Small Files)

##### Storage Buckets

###### 1. avatars
- **Purpose**: User avatars
- **Access**: Public
- **Allowed MIME Types**: `image/webp`, `image/png`, `image/jpeg`
- **Max File Size**: 512 KB
- **Path Structure**: `{user_id}/avatar.{extension}`

###### 2. character-covers
- **Purpose**: Character cover images
- **Access**: Public
- **Allowed MIME Types**: `image/webp`, `image/png`, `image/jpeg`
- **Max File Size**: 800 KB
- **Path Structure**: `{user_id}/{character_id}/cover.{extension}`

###### 3. model-previews
- **Purpose**: Character model preview images
- **Access**: Public
- **Allowed MIME Types**: `image/webp`, `image/png`, `image/jpeg`
- **Max File Size**: 600 KB
- **Path Structure**: `{user_id}/{character_id}/preview.{extension}`

#### 2. Cloudflare R2 (Large Files)

##### Storage Buckets

###### 1. models
- **Purpose**: 3D model files (GLB format)
- **Access**: Private (signed URLs)
- **Allowed MIME Types**: `model/gltf-binary`, `application/octet-stream`
- **Max File Size**: 12 MB
- **Path Structure**: `models/{user_id}/{character_id}/model.glb`
- **Versioning**: `models/{user_id}/{character_id}/history/{timestamp}/model.glb`

###### 2. exports
- **Purpose**: Export ZIP files
- **Access**: Private (signed URLs)
- **Allowed MIME Types**: `application/zip`
- **Max File Size**: 20 MB per character
- **Path Structure**: `exports/{user_id}/{timestamp}/{file_name}.zip`

###### 3. textures
- **Purpose**: High-resolution textures
- **Access**: Private (signed URLs)
- **Allowed MIME Types**: `image/png`, `image/jpeg`
- **Max File Size**: 5 MB
- **Path Structure**: `textures/{user_id}/{character_id}/{texture_name}.{extension}`

### Access Control

#### Supabase Storage Access Control
- **Public Buckets**: avatars, character-covers, model-previews
- **Private Buckets**: None (all large files now stored in Cloudflare R2)

#### Cloudflare R2 Access Control
- **Signed URLs**: Used for secure access to private files
- **Expiration**: URLs expire after a set time (default: 1 hour)
- **Path-Based Authorization**: User IDs in file paths ensure users can only access their own files

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/supabase-webhook` - Supabase Auth webhook for user sync

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

### DCOS Repository
- `GET /api/oasisbios/[id]/dcos` - Get DCOS files for OasisBio
- `POST /api/oasisbios/[id]/dcos` - Create DCOS file
- `PUT /api/dcos/[id]` - Update DCOS file
- `DELETE /api/dcos/[id]` - Delete DCOS file

### References Repository
- `GET /api/oasisbios/[id]/references` - Get references for OasisBio
- `POST /api/oasisbios/[id]/references` - Create reference
- `PUT /api/references/[id]` - Update reference
- `DELETE /api/references/[id]` - Delete reference

### Worlds Repository
- `GET /api/oasisbios/[id]/worlds` - Get worlds for OasisBio
- `POST /api/oasisbios/[id]/worlds` - Create world
- `PUT /api/worlds/[id]` - Update world
- `DELETE /api/worlds/[id]` - Delete world

### World Documents
- `GET /api/worlds/[id]/documents` - Get documents for world
- `POST /api/worlds/[id]/documents` - Create world document
- `PUT /api/worlddocuments/[id]` - Update world document
- `DELETE /api/worlddocuments/[id]` - Delete world document

### Model Management
- `GET /api/oasisbios/[id]/models` - Get models for OasisBio
- `POST /api/oasisbios/[id]/models` - Upload model to OasisBio
- `DELETE /api/models/[id]` - Delete model

### Import/Export
- `POST /api/export` - Export characters as ZIP file
- `GET /api/export/history` - Get export history
- `POST /api/import` - Import characters from ZIP file

## Deployment

### Supabase Setup
1. Create a Supabase project
2. Configure the database with the provided schema
3. Set up environment variables with Supabase credentials

### Cloudflare Pages Deployment
1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy the project

### Environment Variables
```
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.dhkgfdllgtmbkwcbubqt.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.dhkgfdllgtmbkwcbubqt.supabase.co:5432/postgres"

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL="https://dhkgfdllgtmbkwcbubqt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
SUPABASE_WEBHOOK_SECRET="[YOUR-WEBHOOK-SECRET]"

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID="[YOUR-R2-ACCESS-KEY-ID]"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="[YOUR-R2-SECRET-ACCESS-KEY]"
CLOUDFLARE_R2_ENDPOINT="https://[YOUR-ACCOUNT-ID].r2.cloudflarestorage.com"
CLOUDFLARE_R2_BUCKET_NAME="[YOUR-BUCKET-NAME]"
CLOUDFLARE_R2_ACCOUNT_ID="[YOUR-ACCOUNT-ID]"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[YOUR-SECRET-KEY-HERE]"

# Node Environment
NODE_ENV="development"
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare account with R2 enabled

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
- Authentication is handled through Supabase Auth
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
