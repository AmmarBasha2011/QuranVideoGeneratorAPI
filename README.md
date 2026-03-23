# Quran Videos Maker & API 📖🎥

Professional automation tool for generating randomized Quranic shorts (9:16) for YouTube, TikTok, and Reels. This project provides both a powerful API and a modern web interface for creating high-quality Quranic content in seconds.

**Repository:** [https://github.com/AmmarBasha2011/QuranVideoGeneratorAPI](https://github.com/AmmarBasha2011/QuranVideoGeneratorAPI)

## ✨ Features

- **Automated Video Generation:** Creates 9:16 portrait videos with English translations and high-quality audio.
- **23+ Professional Reciters:** Support for a wide range of popular Qaris including Alafasy, Abdul Basit, Minshawi, Ajamy, and many more.
- **Dynamic Subtitles:** Real-time synced subtitles with the recitation, including verse numbering.
- **Modern UI:** Professional "Deep Blue" dark mode interface with glassmorphism and real-time processing feedback.
- **Management API:** Comprehensive API for generating, tracking, and deleting videos to manage server storage.
- **Swagger Documentation:** Interactive API docs built-in for easy integration and testing.
- **Customizable Aesthetics:** Option to randomize or specify text colors, backgrounds, and technical parameters like FPS.
- **High Performance:** Utilizes FFmpeg for efficient video rendering with optimized presets.
- **Storage Management:** Built-in deletion endpoint to keep server storage clean.
- **Docker Support:** Ready-to-use Dockerfile for easy deployment, containerization, and scaling.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- FFmpeg installed on your system

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AmmarBasha2011/QuranVideoGeneratorAPI.git
   cd QuranVideoGeneratorAPI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:8000`.

## 🛠 API Endpoints

- `POST /api/v1/video/generate`: Start a new video generation job.
- `GET /api/v1/video/status/{jobId}`: Check the progress and get the download URL.
- `POST /api/v1/video/delete`: Remove a generated video from the server storage.
- `GET /api/v1/quran/reciters`: List all available reciters.
- `GET /api/v1/quran/surahs`: List all Surahs from the Holy Quran.

Detailed documentation is available at `/docs` when the server is running.

## 🗺 ROADMAP

- [ ] **Multi-language Support:** Add translations for Arabic, French, Urdu, Indonesian, etc.
- [ ] **Background Selection UI:** Allow users to upload or choose specific backgrounds from a library.
- [ ] **Advanced Text Styling:** More font choices, shadows, and animation styles for subtitles.
- [ ] **Custom Watermarks:** Support for adding user-provided logos or watermarks.
- [ ] **Social Media Direct Upload:** Integration with YouTube/TikTok APIs for automated posting.
- [x] **Docker Support:** Fully functional Dockerfile provided for easier deployment and scaling.
- [ ] **Persistent Storage:** Move from in-memory job tracking to a database (Redis/MongoDB).
- [ ] **Webhooks:** Notify external services when video generation is complete.

## 🎨 Technology Stack

- **Backend:** Node.js, Express, TypeScript, Fluent-ffmpeg
- **Frontend:** React, Vite, Tailwind CSS v4, Lucide Icons
- **API Documentation:** Swagger UI

## 📝 License

Copyright (c) 2026 Ammar Elkhateeb (INEX Team).

This project is licensed under the GPL-3.0 License. You must give appropriate credit, provide a link to the original repository, and indicate if changes were made. You may not claim this work as your own.
