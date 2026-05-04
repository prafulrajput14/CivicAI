# CivicAI Platform

Welcome to the **CivicAI Platform** repository. CivicAI is a comprehensive, modern web application designed to bridge the gap in rural and public services by providing an accessible interface for healthcare, government services, and employment opportunities.

## 🚀 Key Features

### 1. 🔐 Secure Authentication System
- End-to-end user authentication (Login / Signup).
- Email OTP verification integrated via Nodemailer (Gmail SMTP).
- Clean, split-screen UI with glassmorphic aesthetics.

### 2. 🎙️ Voice Assistant & Multilingual UI
- Voice-enabled accessibility tailored for rural users with transliterated greetings.
- Speech synthesis and voice interactions in multiple Indian languages.
- Clear digit pronunciation and markdown-sanitized outputs for a natural listening experience.

### 3. 🏢 Government Jobs Portal
- Automated scraper gathering the latest government job listings.
- Standardized UI across supported languages for exploring job opportunities.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS & shadcn/ui
- Lucide React Icons

**Backend:**
- Node.js & Express.js
- Nodemailer for email services
- Custom APIs for Auth, Scraper, and Voice integrations

## ⚙️ Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and `npm` (or `bun`/`yarn`) installed.

## 📦 Local Setup & Installation

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the required environment variables:
   ```env
   # Add your environment variables here
   PORT=5000
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password
   ```
   *(Note: The `.env` file is excluded from version control for security.)*

4. **Run the Development Servers**

   **Start the Backend Server:**
   ```sh
   cd server
   npm install
   node index.js
   ```

   **Start the Frontend Client:**
   Open a new terminal in the project root and run:
   ```sh
   npm run dev
   ```

## 🌐 Deployment
This project is configured to run on Vercel or any modern hosting provider. Ensure environment variables are properly set in your hosting platform.
<!-- 
---
*CivicAI.* -->
