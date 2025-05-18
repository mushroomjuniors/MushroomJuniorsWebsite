-- Add slug column to categories table
ALTER TABLE categories ADD COLUMN slug TEXT;

-- Update existing categories with slugs based on their names with special handling for fractions
-- First handle common fractions like 3/4
UPDATE categories 
SET slug = REGEXP_REPLACE(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          LOWER(name),
          '(\d+)/(\d+)', '\1\2'  -- Convert fractions like 3/4 to 34
        ),
        '[''"]', ''  -- Remove apostrophes and quotes
      ),
      '[^a-z0-9]+', '-'  -- Replace non-alphanumeric with hyphens
    ),
    '^-+|-+$', ''  -- Remove leading/trailing hyphens
  ),
  '--+', '-'  -- Replace multiple hyphens with single hyphen
);

-- If using Supabase, you may want to make the slug column unique
ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug); 