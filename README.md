<div align="center">
  <h1>🎥 VidFlow (Next.js Video Application)</h1>
  <p>A full-stack, aesthetic video sharing application built with Next.js, NextAuth, ImageKit, and MongoDB.</p>
</div>

---

## 📌 Project Overview
If you built this using "vibe coding" (using AI generation to build fast), it can be hard to understand what is actually happening! This document breaks down **exactly** how your app works from start to finish.

This app relies on 4 main pillars:
1. **Next.js (App Router)**: The React framework that powers your UI and API routes.
2. **MongoDB / Mongoose**: Your database where you save User credentials and Video details.
3. **NextAuth**: The authentication system that logs users in securely.
4. **ImageKit**: Cloud storage where the actual physical video files (MP4s) are uploaded and served from.

---

## 📂 Architecture & Folder Structure

In Next.js, the folder structure determines how your app works.

```text
src/
├── app/                  # Everything UI & API related lives here
│   ├── api/              # Your Backend Server routes (fetching database data)
│   ├── components/       # Reusable UI pieces (Navbar, FileUploader)
│   ├── login/            # /login page UI
│   ├── register/         # /register page UI
│   ├── uploadvideos/     # /uploadvideos page UI
│   ├── globals.css       # Tailwind CSS styles
│   ├── layout.js         # The master wrapper around every single page
│   └── page.js           # The Homepage "/" UI
├── lib/                  # Helper functions and utilities
│   ├── api-client.js     # Functions to neatly call your own /api endpoints
│   ├── auth.js           # NextAuth configuration options
│   └── db.js             # Code to connect to MongoDB
├── models/               # Database schemas
│   ├── usermodel.js      # How a User is saved in the DB
│   └── videomodel.js     # How a Video is saved in the DB
└── Middleware.js         # Security guard that protects private pages
```

---

## 📖 Feature 1: Authentication Flow

How does a user securely register and log in?

### 1. Registration (`src/app/api/auth/register/route.js`)
When a user clicks "Register" on the UI:
1. The form sends their email and password to this API route.
2. The server connects to MongoDB (`await mongoConnect()`).
3. It checks if the email exists. If not, it creates a new `User` in the database.
4. *Behind the scenes, the `usermodel.js` uses `bcrypt` to mathematically encrypt the password before saving it.*

### 2. Login (`src/lib/auth.js`)
NextAuth is a library that handles logins automatically.
1. When a user logs in, NextAuth reads `auth.js`.
2. It looks up the email in MongoDB.
3. It uses `bcrypt.compare()` to check if the typed password matches the encrypted database password.
4. If it matches, NextAuth creates a secure "Session Token" holding the user's ID and Email.

### 3. Middleware Security (`src/Middleware.js`)
Next.js Middleware acts as a bouncer at a club. It checks every incoming request:
- If a user tries to visit `/uploadvideos` but has NO valid Session Token, the middleware redirects them away.
- Only `/login`, `/register`, and `/` (Home) are open to the public without a login.

---

## 📖 Feature 2: Uploading a Video

Videos are huge files; you don't save them in MongoDB. You save them in **ImageKit**, and then save the ImageKit URL to MongoDB.

### 1. The Uploader Component (`src/app/components/FileUploade.jsx`)
This component uses the `@imagekit/next` tool.
1. It first calls `fetch("/api/auth/imagekit-auth")`. ImageKit requires a secure signature to allow uploads from the browser.
2. Once the signature is received, the file is uploaded directly from the browser to ImageKit servers.
3. Once ImageKit receives it, it gives you back an object with a newly created `.url` and `.thumbnailUrl`.

### 2. Saving the Video Database Entry (`src/app/uploadvideos/page.jsx`)
Now that the heavy video file is safely in the cloud, you need to save it to your database.
1. The `handleSuccess(res)` function triggers.
2. It builds an object containing the Title, Description, and the URLs provided by ImageKit.
3. It uses `apiClient.createVideo(videoData)` to send this data to your backend.

### 3. The Backend API (`src/app/api/videos/route.js: POST`)
1. Receives the `videoData`.
2. Asks NextAuth who is currently logged in (`session = await auth()`).
3. Creates a new Mongoose document (`Video.create()`) that holds the title, the ImageKit URL, and importantly, the **`userId`** of the person who uploaded it.

---

## 📖 Feature 3: The Video Feed (Home Page)

How do all those videos show up on the root `/` page?

### 1. Fetching (`src/app/page.js`)
1. When the page loads, `useEffect` triggers a function called `fetchVideos()`.
2. `fetchVideos()` calls your backend `<GET> /api/videos` route.
3. The backend asks MongoDB: `Video.find({}).sort({ createdAt: -1 })` (Give me all videos, newest first).
4. The array of videos from the database is sent back to the UI and stored in the `videos` state variable.

### 2. Rendering the HTML
React uses `.map()` to loop through the `videos` array and generate a "Glassmorphism Card" for every single one.
- We render a native HTML `<video>` element using the `video.videoUrl` provided by ImageKit.
- Hover events trigger `.play()` on the video element for silent previews.

### 3. Secure Deletion
React compares the `userId` attached to the video in the database, with your current `session.user.id`.
- If they match exactly, a **Delete Trash Button** appears!
- Clicking delete fires `<DELETE> /api/videos?id=123`.
- The backend checks your session ID against the video's database owner ID again to prevent hacking. If you own it, it runs `Video.findByIdAndDelete()`.

---

## 🎨 Why it looks so Aesthetic?
Next.js uses **Tailwind CSS**. Those long strings in the `className=""` are styling the pages.
- `bg-zinc-950`: Creates the incredibly dark, almost-black background.
- `backdrop-blur-xl`: Creates the "frosted glass" effect under cards.
- `bg-gradient-to-br`: Creates those colorful gradient text effects.
- Absolute positioned blurred `div`s create the glowing orbs in the background.

## 🚀 Getting Started Locally

If you ever restart your computer or stop working here's how to run the app:

```bash
# Keep this terminal running!
npm run dev
```

Then visit `http://localhost:3000` in your browser.

---

## 🌍 How to Deploy (Make it Live!)

The absolute easiest way to deploy a Next.js application is using **Vercel** (the creators of Next.js). Here is exactly how to do it:

### Step 1: Push your code to GitHub
1. Create a free account on [GitHub](https://github.com/).
2. Create a new repository.
3. In your terminal, run:
```bash
git add .
git commit -m "Initial commit for VidFlow"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Create a free account on [Vercel](https://vercel.com/) and sign in with your GitHub account.
2. Click **"Add New Project"**.
3. Import the GitHub repository you just created.

### Step 3: Add your Environment Variables
Vercel needs to know your secret passwords to connect to your database and ImageKit. 
In the Vercel deployment screen, open the **"Environment Variables"** dropdown and copy-paste everything from your local `.env.local` file. You need:
- `MONGODB_URI` 
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_PUBLIC_KEY` (ImageKit)
- `NEXT_PUBLIC_PRIVATE_KEY` (ImageKit)
- `NEXT_PUBLIC_URL_ENDPOINT` (ImageKit)

### Step 4: Click Deploy!
Vercel will build your app and give you a live URL (like `https://vidflow.vercel.app`) that you can share with anyone in the world!
