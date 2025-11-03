import { GoogleGenAI, Modality } from "@google/genai";

export const generateCartoonImage = async (prompt: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please enter your API key to generate images.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // aka nano banana
      contents: {
        parts: [
          {
            // Add a style guide to the prompt for better results
            text: `Generate a minimalist, clean, flat-style cartoon image of: ${prompt}. The style should have simple shapes and a limited, pleasing color palette.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE], // Must be an array with a single Modality.IMAGE element.
      },
    });

    const candidate = response.candidates?.[0];

    if (!candidate) {
        throw new Error("No candidates returned from the API.");
    }

    if (candidate.finishReason === 'SAFETY') {
        throw new Error('Image generation failed due to safety policies. Please modify your prompt and try again.');
    }
    
    const imagePart = candidate.content.parts.find(part => part.inlineData);

    if (imagePart?.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
    }

    throw new Error("No image data found in the API response.");

  } catch (error: any) {
    console.error("Error generating image with Gemini API:", error);
    if (error.message?.includes('API key not valid')) {
        throw new Error("Your API key is not valid. Please check it and try again.");
    }
    if (error.message?.includes('429')) {
        throw new Error("You have exceeded your API request limit. Please wait a moment and try again.");
    }
    // Re-throw specific errors that were already processed
    if (error.message.startsWith('Image generation failed') || error.message.startsWith('Your API key is not valid')) {
        throw error;
    }
    throw new Error("Failed to communicate with the image generation service. Check your network connection or API key.");
  }
};