import api from './api';

// Native Bhashini TTS models available: hi, en, bn, or
// For regional tribal & local dialects (sat, ho, mun, bho, mag, mai, ur),
// route to Hindi TTS so citizens can hear instructions in spoken Hindi
const BHASHINI_NATIVE_LANGS = ['hi', 'en', 'bn', 'or'];

export function resolveVoiceLanguage(appLanguage: string): string {
  if (!appLanguage) return 'hi';
  const clean = appLanguage.toLowerCase();
  if (BHASHINI_NATIVE_LANGS.includes(clean)) {
    return clean;
  }
  // Default to Hindi voice for all regional languages/dialects
  return 'hi';
}

export function isBhashiniSupported(lang: string): boolean {
  // All app languages are supported (either natively or via Hindi voice fallback)
  return true;
}

export async function synthesizeSpeech(text: string, language: string): Promise<string> {
  try {
    const effectiveLang = resolveVoiceLanguage(language);
    // POST /api/voice/tts -> { audio: base64String }
    const res = await api.post('/voice/tts', { text, language: effectiveLang });
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
