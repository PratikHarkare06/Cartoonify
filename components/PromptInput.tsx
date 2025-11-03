import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  'A cat wearing a tiny wizard hat',
  'A smiling slice of pizza surfing a wave of cheese',
  'A raccoon astronaut planting a flag on a donut planet',
  'Two friendly robots sharing a milkshake',
  'A grumpy cloud raining candy',
  'A penguin riding a unicycle in a library',
  'A cactus giving a balloon a hug',
  'A detective squirrel looking for a missing acorn',
];

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [displaySuggestions, setDisplaySuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle and pick 3 suggestions on component mount
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    setDisplaySuggestions(shuffled.slice(0, 3));
  }, []);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="prompt-input" className="text-lg font-semibold text-slate-800">
        Describe the cartoon you want to create:
      </label>
      <div className="relative">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow for click events
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder="e.g., A happy robot drinking coffee on the moon"
          className="w-full p-4 bg-white border-2 border-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow duration-200 resize-none text-slate-900 placeholder-slate-500"
          rows={3}
          disabled={isLoading}
        />
        {isFocused && !prompt && (
          <div className="mt-2 px-1">
            <p className="text-sm font-medium text-slate-600 mb-2">
              Need ideas? Try one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {displaySuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-sm font-semibold bg-amber-100 text-amber-900 rounded-full border border-amber-300 hover:bg-amber-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !prompt.trim()}
        className="inline-flex items-center justify-center px-6 py-3 text-base font-bold rounded-lg text-slate-900 bg-amber-400 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 disabled:bg-amber-200 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generate Cartoon
          </>
        )}
      </button>
    </div>
  );
};

export default PromptInput;