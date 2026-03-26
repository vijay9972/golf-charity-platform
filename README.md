# Golf Charity Platform ⛳️

A full-stack, monolithic web application built with **React (Vite)** on the frontend and **Node.js (Express)** on the backend. This platform allows users to manage their golf scores, subscribe to premium features via Stripe, and participate in charity draws. 

## Features
- **Secure Authentication**: Powered by Supabase Auth with JWT integration.
- **Score Management**: Track and calculate users' best golf rounds.
- **Premium Subscriptions**: Fully integrated with Stripe Checkout and Stripe Webhooks.
- **Charity Allocation**: Allows users to dynamically route a portion of their subscription funds to a charity of their choice.
- **Dynamic Draws**: Admin-controlled monthly prize draws funded directly from the premium pool.

## Tech Stack
- **Frontend**: React, Vite, React Router, Lucide Icons, CSS Variables (Dark glassmorphism theme).
- **Backend**: Node.js, Express, Stripe API, Supabase JS Client.
- **Deployment**: Configured out-of-the-box for [Render.com](https://render.com) using a `render.yaml` blueprint.

## Local Development Setup

### 1. Prerequisites
- Node.js installed
- Supabase Project (URL & Key)
- Stripe Account (Secret Key & Webhook Secret)

### 2. Environment Variables
Create a `.env` file in the `frontend` folder:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. Run Locally

**Quick Start Script (Windows):**
Simply double-click the `deploy.bat` file in the root directory. It will install all dependencies, build the frontend, and boot up both services on port 5000.

**Manual Start:**
1. From the root directory: `npm run postinstall`
2. Build the frontend: `npm run build`
3. Start the backend: `npm start`
4. The backend will automatically serve your compiled React frontend on `http://localhost:5000`.

## Deployment to Render (Automatic)
This repository is configured for an instant, unified deployment on Render using Blueprints.
1. Fork or push this repository to GitHub.
2. Go to Render Dashboard -> **Blueprints** -> **New Blueprint**.
3. Connect your repository.
4. Render will prompt you for your Supabase and Stripe keys. 
5. Click **Apply**! The backend will automatically build and statically host your frontend.
