import React, { useState, useEffect } from 'react';
import { ArtIcon } from './icons/ArtIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
}

const FILTERS = [
    { id: 'none', name: 'None', className: '' },
    { id: 'bw', name: 'Black & White', className: 'grayscale' },
    { id: 'sepia', name: 'Sepia', className: 'sepia' },
    { id: 'vintage', name: 'Vintage', className: 'saturate-150 contrast-75' },
    { id: 'sketch', name: 'Sketch', className: 'grayscale contrast-200' },
    { id: 'neon', name: 'Neon Glow', className: 'saturate-200 brightness-125 drop-shadow-[0_0_8px_#f59e0b]' },
];
type FilterId = 'none' | 'bw' | 'sepia' | 'vintage' | 'sketch' | 'neon';

const LoadingSkeleton: React.FC = () => (
  <div className="w-full aspect-square bg-slate-100 border-2 border-slate-900 rounded-lg animate-pulse flex flex-col items-center justify-center p-4">
     <svg className="animate-spin h-10 w-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-slate-600 font-semibold">Creating your masterpiece...</p>
  </div>
);

const InitialState: React.FC = () => (
  <div className="w-full aspect-square border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center p-4 text-center">
    <ArtIcon className="w-16 h-16 text-slate-400 mb-4" />
    <h3 className="text-xl font-semibold text-slate-800">Your cartoon will appear here</h3>
    <p className="text-slate-500 mt-1">Let your imagination run wild and see what you can create!</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="w-full aspect-square border-2 border-red-400 bg-red-50 rounded-lg flex flex-col items-center justify-center p-4 text-center">
      <svg className="w-16 h-16 text-red-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    <h3 className="text-xl font-semibold text-red-800">Oops! Something went wrong.</h3>
    <p className="text-red-600 mt-1">{message}</p>
  </div>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, error }) => {
  const [canShare, setCanShare] = useState(false);
  const [selectedFilterId, setSelectedFilterId] = useState<FilterId>('none');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const selectedFilter = FILTERS.find(f => f.id === selectedFilterId);

  useEffect(() => {
    if (navigator.share) {
      setCanShare(true);
    }
  }, []);

  useEffect(() => {
    // Reset filter when a new image is generated or cleared
    setSelectedFilterId('none');
    setIsImageLoaded(false);
  }, [image]);

  const tailwindToCssFilter = (className: string): string => {
    if (!className) return 'none';
    const filters = [];
    if (className.includes('grayscale')) filters.push('grayscale(1)');
    if (className.includes('sepia')) filters.push('sepia(1)');
    if (className.includes('saturate-150')) filters.push('saturate(1.5)');
    if (className.includes('saturate-200')) filters.push('saturate(2)');
    if (className.includes('contrast-75')) filters.push('contrast(0.75)');
    if (className.includes('contrast-200')) filters.push('contrast(2)');
    if (className.includes('brightness-125')) filters.push('brightness(1.25)');
    if (className.includes('drop-shadow-[0_0_8px_#f59e0b]')) filters.push('drop-shadow(0 0 8px #f59e0b)');
    return filters.length > 0 ? filters.join(' ') : 'none';
  };

  const getFilteredImageBlob = (filterClassName: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
        if (!image) return resolve(null);
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(null);

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = tailwindToCssFilter(filterClassName);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.onerror = () => resolve(null);
        img.src = image;
    });
  };

  const handleDownload = async () => {
    if (!image) return;
    const blob = await getFilteredImageBlob(selectedFilter?.className || '');
    if (!blob) {
      console.error('Failed to create image blob for download.');
      // Fallback to direct download if canvas fails
      const link = document.createElement('a');
      link.href = image;
      link.download = `cartoon-generator.png`;
      link.click();
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cartoon-generator.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!image || !navigator.share) return;
    const blob = await getFilteredImageBlob(selectedFilter?.className || '');
    if (!blob) {
        console.error('Failed to create image blob for sharing.');
        return;
    }
    try {
      const file = new File([blob], `cartoon-generator.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Cartoon Creation!',
          text: 'Check out this cartoon I made with the AI Cartoon Generator!',
          files: [file],
        });
      } else {
        alert("Your browser doesn't support sharing this image directly.");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Silently catch the error from the user cancelling the share dialog.
      } else {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSkeleton />}
      {!isLoading && error && <ErrorDisplay message={error} />}
      {!isLoading && !error && image && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full bg-white p-2 rounded-lg border-2 border-slate-900 shadow-[8px_8px_0px_#f59e0b]">
            <img 
              src={image} 
              alt="Generated cartoon" 
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-auto object-contain rounded-md transition-all duration-500 ${selectedFilter?.className || ''} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          
          <div className="mt-4 w-full">
            <p className="text-center font-semibold text-slate-700 mb-3">Apply a Filter:</p>
            <div className="flex justify-center flex-wrap gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilterId(filter.id as FilterId)}
                  className={`px-4 py-1 text-sm font-semibold rounded-full border-2 border-slate-900 transition-all duration-200 shadow-[2px_2px_0px_#0f172a] hover:shadow-none hover:-translate-y-px ${
                    selectedFilterId === filter.id
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-white text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-bold rounded-lg text-slate-900 bg-amber-400 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
              aria-label="Download generated image"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download
            </button>
            {canShare && (
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold rounded-lg text-slate-900 bg-amber-400 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
                aria-label="Share generated image"
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Share
              </button>
            )}
          </div>
        </div>
      )}
      {!isLoading && !error && !image && <InitialState />}
    </div>
  );
};

export default ImageDisplay;