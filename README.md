# 🎨 AI Cartoon Generator

Welcome to the AI Cartoon Generator! This is a fun and interactive web application that uses the Google Gemini API to transform your text prompts into unique, minimalist-style cartoon images. Experiment with different ideas, apply creative filters, and share your creations with the world!


---
## ✨ Features

- **AI-Powered Image Generation**: Leverages the powerful `gemini-2.5-flash-image` model to create high-quality cartoon images from simple text descriptions.
- **Minimalist Cartoon Style**: Prompts are automatically enhanced to generate images with a clean, flat-style aesthetic, featuring simple shapes and pleasing color palettes.
- **Creative Filters**: Apply post-generation filters to your cartoons, including Black & White, Sepia, Vintage, Sketch, and a vibrant Neon Glow.
- **Prompt Suggestions**: Stuck for ideas? The app provides random, fun suggestions to get your creativity flowing.
- **Download & Share**: Easily download your final image or use the native Web Share API to send it to friends or post on social media. Filters are applied to the final image!
- **Interactive UI**: A playful, responsive, and user-friendly interface with a distinct cartoon theme.
- **Clear Error Handling**: Provides specific feedback for common issues like invalid API keys, rate limits, or safety-policy violations.
- **Local-First Setup**: Designed to be run easily on a local machine with a simple API key input.

---

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript
- **AI Model**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS
- **Icons**: Custom SVG components

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- A package manager like `npm` or `yarn`

### Step 1: Get a Gemini API Key

This application requires a Google Gemini API key to function.

1.  Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click **"Create API key"** and copy the generated key. You will need this in a later step.

### Step 2: Set Up the Project Locally

3.  **Clone the repository** (or download and extract the project files into a new folder):
    ```bash
    git clone https://github.com/your-username/cartoon-generator.git
    cd cartoon-generator
    ```

4.  **Install the dependencies**:
    ```bash
    npm install
    ```

5.  **Run the development server**:
    ```bash
    npm run dev
    ```
    This will start the application, and you can view it in your browser at `http://localhost:5173` (or another port if 5173 is in use).

### Step 3: Using the Application

1.  **Enter Your API Key & Prompt**: In the running application, paste the key you got from Google AI Studio into the setup field. Then, describe the cartoon you want to create in the text area. You can also click one of the suggestions if you need inspiration!

2.  **Generate, Apply Filters & Share**: Click the **"Generate Cartoon"** button. Once the image appears, you can apply different visual filters, download the final result, or share it.

---

## 📁 Project Structure

The project is organized into a `components` directory for reusable UI elements, a `services` directory for API logic, and main files like `App.tsx` that tie everything together.

```
/
├── public/
│   └── images/
│       ├── snapshot-main.png
│       └── snapshot-result.png
├── src/
│   ├── components/
│   │   ├── icons/
│   │   │   ├── ArtIcon.tsx
│   │   │   └── ...
│   │   ├── Header.tsx
│   │   ├── ImageDisplay.tsx
│   │   └── PromptInput.tsx
│   │
│   ├── services/
│   │   └── geminiService.ts
│   │
│   ├── App.tsx
│   └── index.tsx
│
├── index.html
├── README.md
└── package.json
```
