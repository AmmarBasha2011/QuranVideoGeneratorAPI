# Quran Videos Maker & API 📖🎥

Professional automation tool for generating randomized Quranic shorts (9:16) for YouTube, TikTok, and Reels. This project provides both a powerful API and a modern web interface for creating high-quality Quranic content in seconds.

## ✨ Features

- **Automated Video Generation:** Creates 9:16 portrait videos with English translations and high-quality audio.
- **23+ Professional Reciters:** Support for a wide range of popular Qaris including Alafasy, Abdul Basit, Minshawi, and many more.
- **Modern UI:** Professional "Deep Blue" dark mode interface with glassmorphism and real-time processing feedback.
- **Management API:** Comprehensive API for generating, tracking, and deleting videos to manage server storage.
- **Swagger Documentation:** Interactive API docs built-in for easy integration.
- **Customizable:** Option to randomize or specify text colors, backgrounds, and technical parameters like FPS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- FFmpeg installed on your system

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/quran-video-maker.git
   cd quran-video-maker
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

## 🎨 Technology Stack

- **Backend:** Node.js, Express, TypeScript, Fluent-ffmpeg
- **Frontend:** React, Vite, Tailwind CSS v4, Lucide Icons
- **API Documentation:** Swagger UI

## 📝 License

This project is open-source and available under the [ISC License](LICENSE).
