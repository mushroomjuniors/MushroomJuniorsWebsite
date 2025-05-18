This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Category Slug Fix

To fix the issue with category slugs not matching, run the following SQL in your Supabase SQL Editor:

```sql
-- Update existing categories with slugs based on their names with special handling for fractions
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
```

After running this SQL, restart your application and the category pages should now work correctly.

## Debugging Tip

To see the slugs stored in your database, run this query:

```sql
SELECT id, name, slug FROM categories;
```

Make sure the slugs match what's being used in your application URLs.
