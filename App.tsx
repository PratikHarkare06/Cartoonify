import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import { generateCartoonImage } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key to generate an image.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateCartoonImage(prompt, apiKey);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, apiKey]);

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="w-full p-6 bg-white rounded-2xl shadow-[8px_8px_0px_#0f172a] border-2 border-slate-900 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Setup Your API Key</h2>
            <p className="text-slate-600 mb-4">
              To run this app, you need a Gemini API key. Get one from{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-600 hover:underline font-semibold"
              >
                Google AI Studio
              </a>.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key here"
              className="w-full p-3 bg-white border-2 border-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200 text-slate-900 placeholder-slate-500"
              aria-label="Gemini API Key Input"
            />
          </div>

          <div className="w-full p-6 bg-white rounded-2xl shadow-[8px_8px_0px_#0f172a] border-2 border-slate-900">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          </div>
          <div className="mt-8">
            <ImageDisplay
              image={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;