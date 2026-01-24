# Deployment Notes

## Latest Deployment
- Date: 2026-01-24
- Fix: Removed duplicate header from courses page
- Issue: Anonymous users were seeing two headers
- Solution: Let marketing layout handle header, courses page only renders content
- Commit: Includes fix for double header issue

## What Changed
- File: app/(marketing)/courses/page.tsx
- Removed lines 34-56 (duplicate header element)
- Marketing layout now exclusively handles header rendering
- Anonymous users: Marketing header + hero + courses grid
- Logged-in users: AuthenticatedLayout header + courses grid (no hero)

## Testing
1. Logout from https://ailearnhub.io
2. Visit: https://ailearnhub.io/courses
3. Expected: ONE header (not two)
4. Expected: Hero section visible
5. Expected: Courses grid below
