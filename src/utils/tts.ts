import { TextToSpeech } from '@capacitor-community/text-to-speech';

export const speak = async (text:string) => {
  await TextToSpeech.speak({
    text,
    lang: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    category: 'ambient',
    queueStrategy: 1
  });
};

export const stopSpeech = async () => {
  await TextToSpeech.stop();
};

export const getSupportedLanguages = async () => {
  const languages = await TextToSpeech.getSupportedLanguages();
};

export const getSupportedVoices = async () => {
  const voices = await TextToSpeech.getSupportedVoices();
};

export const isLanguageSupported = async (lang: string) => {
  const isSupported = await TextToSpeech.isLanguageSupported({ lang });
};