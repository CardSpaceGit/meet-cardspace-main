# Supabase Integration for CardSpace App

This directory contains the necessary files to set up the Supabase backend for the CardSpace app's brand loyalty card feature.

## Setup Instructions

### 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Create a new project and note down the project URL and anon key
3. Set up your database tables, storage, and categories using the provided schema files

### 2. Configure Environment Variables

Create or update your `.env` file in the root of your project with the following variables:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database and Storage Setup

#### Option 1: Using the Setup Script

Run the setup script from the project root:

```bash
node scripts/setup-supabase.js
```

This will guide you through the setup process and show you the SQL commands to execute.

#### Option 2: Manual Setup

1. Navigate to the SQL Editor in your Supabase dashboard
2. First, run the contents of `schema.sql` to set up the brands table
3. Then, run the contents of `storage-setup.sql` to set up the storage bucket and policies
4. Finally, run the contents of `categories-setup.sql` to set up the categories system

### 4. Verify Setup

After running the SQL files, verify that:

#### Database
- The `brands` table has been created
- The `brand_categories` table has been created
- Sample data has been inserted
- Row level security policies are in place

#### Storage
- The `brand-logos` bucket has been created
- Storage policies allow public read access
- Storage policies allow authenticated users to upload, update, and delete

## Table Structure

### Brands Table

| Column Name | Type | Description |
|-------------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Brand name |
| subtitle | TEXT | Short description of loyalty program |
| description | TEXT | Full description of the program |
| logo_url | TEXT | URL to brand logo image |
| category | TEXT | Legacy category name (for backward compatibility) |
| category_id | UUID | Foreign key to brand_categories table |
| website_url | TEXT | URL to the brand's website |
| terms_and_conditions | TEXT | Terms for the loyalty program |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Brand Categories Table

| Column Name | Type | Description |
|-------------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Category name |
| slug | TEXT | URL-friendly identifier |
| description | TEXT | Description of the category |
| icon_name | TEXT | Identifier for frontend icon |
| color | TEXT | Hex color code for styling |
| display_order | INTEGER | Order for display in UI |
| is_featured | BOOLEAN | Whether category is featured |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Using Storage for Brand Images

The app is set up to use Supabase Storage for brand logos. The configuration includes:

1. A public bucket called `brand-logos`
2. RLS policies to allow public read access
3. RLS policies to allow authenticated users to upload, update, and delete files
4. Helper functions in the app to manage uploads and get public URLs

### Storage Functions in the App

The app includes several functions for working with the storage system:

```typescript
// Get a public URL for a brand logo
getBrandLogoUrl(fileName: string): string

// Upload a brand logo and get its public URL
uploadBrandLogo(file: Blob, fileName: string): Promise<string>

// Delete a brand logo
deleteBrandLogo(fileName: string): Promise<void>

// List all brand logos
listBrandLogos(): Promise<string[]>

// Generate a unique file name for a brand logo
generateBrandLogoFileName(brandId: string, fileType: string): string
```

## Using Categories

The app includes several functions for working with the category system:

```typescript
// Fetch all categories
fetchAllCategories(): Promise<Category[]>

// Fetch only featured categories
fetchFeaturedCategories(): Promise<Category[]>

// Get a category by ID
getCategoryById(categoryId: string): Promise<Category | null>

// Get a category by slug
getCategoryBySlug(slug: string): Promise<Category | null>

// Search categories by name
searchCategories(query: string): Promise<Category[]>
```

## Usage in the App

The app uses a combination of the database, storage, and categories services:

1. When creating a new brand, it first creates the database record with category_id
2. Then uploads the logo to storage and updates the brand with the logo URL
3. When fetching brands, it uses the stored URLs to display the logos
4. Categories are used for organizing and filtering brands

## Testing the API

You can test your Supabase API integration directly from the dashboard:
1. Go to the API section in Supabase
2. Try the auto-generated API documentation
3. Use the provided API endpoints to test fetching brands data

## Troubleshooting

Common issues:
- **Storage permissions**: If you can't upload or access images, check the bucket policies
- **CORS errors**: Make sure your Supabase project has the proper CORS configuration for your app domain
- **Authentication issues**: Verify your anon key is correctly set in the environment variables
- **Missing data**: Check the SQL execution history to ensure all commands ran successfully
- **Storage URLs**: If images aren't displaying, check that the public URLs are being generated correctly
- **Category migrations**: If existing brands are not linked to categories, ensure the category_id field is properly updated 