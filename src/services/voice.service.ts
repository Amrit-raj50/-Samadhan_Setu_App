import api from './api';

const BHASHINI_SUPPORTED_LANGS = ['hi', 'en', 'bn', 'or', 'ur', 'bho', 'mag', 'mai'];

// sat, ho, mun ke liye koi native/Bhashini voice nahi — Hindi TTS pe route karo
const NO_NATIVE_VOICE_LANGS = ['sat', 'ho', 'mun'];

export function resolveVoiceLanguage(appLanguage: string): string {
  return NO_NATIVE_VOICE_LANGS.includes(appLanguage) ? 'hi' : appLanguage;
}

export function isBhashiniSupported(lang: string): boolean {
  return BHASHINI_SUPPORTED_LANGS.includes(lang);
}

export async function synthesizeSpeech(text: string, language: string): Promise<string> {
  try {
    // POST /api/voice/tts -> { audio: base64String }
    const res = await api.post('/voice/tts', { text, language });
    return res.data.audio;
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.warn('[Voice Service] /voice/tts route not found (404) on current backend. Check if backend is updated & deployed.');
    } else {
      console.warn('[Voice Service] TTS error:', err.response?.data || err.message);
    }
    throw err;
  }
}

export async function transcribeAudio(audioBase64: string, language: string): Promise<string> {
  try {
    // POST /api/voice/asr -> { text: string }
    const res = await api.post('/voice/asr', { audioBase64, language });
    return res.data.text;
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.warn('[Voice Service] /voice/asr route not found (404) on current backend.');
    } else {
      console.warn('[Voice Service] ASR error:', err.response?.data || err.message);
    }
    throw err;
  }
}
