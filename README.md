# Study Studio — Exam Timer, Pacing & Grade Boundaries

A comprehensive revision and exam companion designed for IGCSE, GCSE, and high school students. Includes precision paper pacing, ambient sound generation, live exam countdowns, and official June 2026 grade boundary calculators.

---

## ✨ Features

- ⏱️ **Exam & Focus Timer**:
  - Focus intervals (25m Focus, 50m Deep focus, 5m / 15m breaks).
  - Pre-calibrated exam papers for Physics, Chemistry, Biology, and Mathematics.
  - Interactive pacing guide with quarter-interval checkpoints and minutes-per-mark tracking.
  - SVG circular dial with live countdown and optional screen wake-lock.
  - Custom session builder with marks pacing calculation.

- 🎧 **Ambient Noise Generator**:
  - Synthesized Web Audio API sound generator (White noise, Pink noise, Brown noise, and Rain filter).
  - Auto-start and auto-stop linked to timer sessions.

- ⏱️ **Precision Stopwatch**:
  - Millisecond accuracy (`00:00.00`).
  - Lap recording with automated **Fastest** and **Slowest** question timing comparison.

- 📅 **Exam Countdown Timetable**:
  - Real-time countdown clock (Days, Hours, Minutes, Seconds) to the next scheduled exam.
  - Chronological schedule for all upcoming papers with sample/custom dates.

- 📊 **Official Grade Boundaries (June 2026)**:
  - Official June 2026 thresholds from **Cambridge International (A* to G)**, **Pearson Edexcel (9 to 1)**, and **OxfordAQA (9 to 1)**.
  - Interactive raw score testing with real-time grade calculation and marks required to reach the next grade band.
  - Visual color-segmented threshold bar with pointer indicator.
  - Editable threshold cut-offs with one-click reset.

- 🎨 **Dynamic Colors & Themes**:
  - Accent colors dynamically adapt to the active subject or selected tools.
  - Dark, Light, and System Auto theme support.
  - Low eye-strain background palettes: Slate, Ink, Forest, Plum, Paper, and Mono.

---

## 🚀 How to Add to GitHub & Deploy Publicly

### Step 1: Push to GitHub

1. Create a new repository at [github.com/new](https://github.com/new). Name it `study-studio` and make it **Public**.
2. In your terminal, run:

```bash
# Add your GitHub repository as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/study-studio.git

# Push your code to the main branch
git push -u origin main
```

---

### Step 2: Deploy Publicly (Free Options)

#### Option A: GitHub Pages (Automated via GitHub Actions)
A pre-configured GitHub Actions workflow is already present in `.github/workflows/deploy.yml`.
1. In your GitHub repository, navigate to **Settings** &gt; **Pages**.
2. Under **Build and deployment** &gt; **Source**, select **GitHub Actions**.
3. Push any commit to `main`, and your site will be live at:
   `https://<YOUR-USERNAME>.github.io/study-studio/`

#### Option B: Vercel (1-Click Instant Deployment)
1. Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Select **Import** next to your `study-studio` repository.
3. Vercel automatically detects the Vite framework and builds into `dist`.
4. Click **Deploy** to receive a public HTTPS URL (e.g. `study-studio.vercel.app`).

#### Option C: Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and click **Add new site** &gt; **Import an existing project**.
2. Connect your GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy Site**.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📄 License
MIT License. Built for students worldwide.
