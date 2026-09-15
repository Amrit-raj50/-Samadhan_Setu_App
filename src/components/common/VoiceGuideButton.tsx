import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { resolveVoiceLanguage, isBhashiniSupported, synthesizeSpeech } from '../../services/voice.service';
import { useAppStore } from '../../store/appStore';
import { colors } from '../../theme/colors';

// Lazy load native modules to prevent crash in Expo Go / Web when native modules are unavailable
let AudioModule: any = null;
try {
  AudioModule = require('expo-av').Audio;
} catch {
  AudioModule = null;
}

let SpeechModule: any = null;
try {
  SpeechModule = require('expo-speech');
} catch {
  SpeechModule = null;
}

let currentSound: any = null;

interface VoiceGuideButtonProps {
  text: string;
}

export function VoiceGuideButton({ text }: VoiceGuideButtonProps) {
  const language = useAppStore((s) => s.language);
  const isVoiceGuideEnabled = useAppStore((s) => s.isVoiceGuideEnabled);
  const [loading, setLoading] = useState(false);

  if (!isVoiceGuideEnabled) return null;

  const speakWithDevice = (lang: string) => {
    if (SpeechModule && SpeechModule.speak) {
      SpeechModule.speak(text, { language: lang === 'hi' ? 'hi-IN' : 'en-IN' });
    }
  };

  const handlePress = async () => {
    setLoading(true);
    const effectiveLang = resolveVoiceLanguage(language);

    try {
      const audioBase64 = await synthesizeSpeech(text, effectiveLang);
      await playBase64Audio(audioBase64);
    } catch (err) {
      console.warn('[VoiceGuideButton] Bhashini TTS failed, falling back to device voice:', err);
      speakWithDevice(effectiveLang);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.chuna} />
      ) : (
        <Volume2 size={20} color={colors.chuna} />
      )}
    </TouchableOpacity>
  );
}

async function playBase64Audio(base64: string) {
  if (!AudioModule) {
    throw new Error('Expo AV Audio module is not available in current environment');
  }
  if (currentSound) {
    try {
      await currentSound.unloadAsync();
    } catch {}
  }
  const { sound } = await AudioModule.Sound.createAsync(
    { uri: `data:audio/wav;base64,${base64}` },
    { shouldPlay: true }
  );
  currentSound = sound;
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});