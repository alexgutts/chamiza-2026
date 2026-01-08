# Database Fix Instructions - Chamiza 2026

## Problem
When users try to make changes to the app that affect the database, errors occur. This is likely due to:

1. **Missing Tables**: Some tables haven't been created yet
2. **Missing RLS Policies**: Row Level Security (RLS) is enabled, but UPDATE and DELETE policies are missing for most tables
3. **Storage Bucket Issues**: The storage bucket name was incorrect in the code (`bucket` instead of `gallery`)
4. **Poor Error Handling**: Errors weren't being logged properly, making it hard to debug

## Solution

I've created a comprehensive setup script that fixes everything in one go.

---

## Step 1: Run the Complete Setup Script

### How to Apply:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your Chamiza 2026 project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the Complete Setup Script**
   - Open the file: **`supabase-complete-setup.sql`** ⭐ (USE THIS ONE)
   - Copy ALL the contents
   - Paste into the SQL Editor

4. **Run the Script**
   - Click the "RUN" button (or press Ctrl/Cmd + Enter)
   - Wait for the script to complete (should take ~5 seconds)

5. **Check the Results**
   - You should see success messages in the output panel
   - Look for messages like:
     ```
     ========================================
     CHAMIZA 2026 DATABASE SETUP COMPLETE!
     ========================================

     ✓ Tables created: 8 of 8
     ✓ RLS policies created: 32
     ✓ Storage bucket configured: gallery
     ✓ Indexes created for performance
     ✓ Seed data added

     🎉 Your database is ready to use!
     ```

### What This Script Does:

- ✅ Creates all 8 database tables (if they don't exist)
- ✅ Drops all existing RLS policies to avoid conflicts
- ✅ Creates comprehensive policies for all operations (SELECT, INSERT, UPDATE, DELETE)
- ✅ Configures the storage bucket properly for image uploads
- ✅ Adds proper indexes for performance
- ✅ Inserts seed data (initial venue location)
- ✅ Verifies everything is configured correctly

---

## Step 2: Verify the Fix

After running the SQL script, test the following operations:

### Test Checklist:

- [ ] **Guest Confirmations**: Try confirming attendance
- [ ] **Public Chat**: Send a message in the chat banner
- [ ] **Family Tree**: Add a family member
- [ ] **Plans**: Create a new plan or join an existing one
- [ ] **Recommendations**: Add a hotel/AirBnB recommendation
- [ ] **Gallery**: Upload a photo (if applicable)
- [ ] **Places**: Add a location to the map (if applicable)

---

## Step 3: Check Browser Console for Errors

If you still encounter errors after running the fix:

1. **Open Browser DevTools**
   - Press `F12` or right-click → "Inspect"
   - Go to the "Console" tab

2. **Look for Detailed Error Messages**
   - Now the app will show detailed Supabase errors including:
     - Error message
     - Error code
     - Error details
     - Hints for fixing

3. **Common Errors and Solutions**:

   | Error Code | Description | Solution |
   |------------|-------------|----------|
   | `23505` | Duplicate key violation | The record already exists (e.g., guest name already confirmed) |
   | `42501` | Insufficient privilege | RLS policy blocking access - rerun the fix script |
   | `23503` | Foreign key violation | Referenced record doesn't exist (e.g., invalid parent_id in family tree) |
   | `23502` | Not null violation | Required field is missing |
   | `PGRST` errors | PostgREST API errors | Usually indicates RLS policy issues - rerun fix script |

---

## What Was Changed in the Code

### 1. Fixed Storage Bucket Name (`src/lib/supabase.ts`)
```typescript
// BEFORE (wrong):
.from("bucket")

// AFTER (correct):
.from("gallery")
```

### 2. Added Detailed Error Logging
All database functions now log detailed error information:
```typescript
console.error("Supabase error adding X:", {
  message: error.message,
  details: error.details,
  hint: error.hint,
  code: error.code,
});
```

### 3. Improved Error Messages in Components
- `src/app/familia/page.tsx` - Shows actual error messages
- `src/components/PublicChatBanner.tsx` - Shows actual error messages
- `src/components/GuestConfirmation.tsx` - Already had good error handling

---

## Troubleshooting

### Still Getting Errors?

1. **Verify Environment Variables**
   - Check `.env.local` file exists
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly

2. **Check Supabase Project Status**
   - Ensure your Supabase project is active and not paused
   - Check if you've hit any rate limits

3. **Verify Tables Exist**
   Run this in SQL Editor to check:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

   You should see these 8 tables:
   - `recommendations`
   - `plans`
   - `plan_participants`
   - `places`
   - `gallery_images`
   - `public_chat_messages`
   - `guest_confirmations`
   - `family_members`

4. **Check RLS Policies**
   Run this to see all policies:
   ```sql
   SELECT schemaname, tablename, policyname
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;
   ```

---

## Need More Help?

If you're still experiencing issues:

1. **Check the browser console** - Copy the full error message
2. **Check Supabase logs** - Go to your Supabase Dashboard → Logs → API Logs
3. **Look at the error details** - The new error logging should show exactly what's wrong

---

## Files Created/Modified

- ⭐ `supabase-complete-setup.sql` - Complete database setup script (NEW) - **USE THIS ONE**
- ✅ `supabase-fix-all.sql` - Fix script (only if tables already exist)
- ✅ `src/lib/supabase.ts` - Fixed storage bucket name + added detailed error logging
- ✅ `src/app/familia/page.tsx` - Better error messages
- ✅ `src/components/PublicChatBanner.tsx` - Better error messages
- ✅ `DATABASE-FIX-INSTRUCTIONS.md` - This file (NEW)

---

## Summary

The main issue was that your database had RLS enabled but was missing UPDATE and DELETE policies. This meant users could read and create records, but couldn't modify or delete them. The fix script adds all necessary policies so all CRUD operations work properly.

Additionally, the storage bucket name was incorrect for image uploads, which has been fixed in the code.

Now when errors occur, you'll see detailed information in the browser console to help debug the issue!
