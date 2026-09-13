/**
 * Samadhan Setu — VoiceGuideButton Component
 * 🔊 floating button on every screen.
 * Reads screen-specific Hindi instructions aloud via expo-speech.
 */
import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import * as Speech from 'expo-speech';
import { useAppStore } from '../../store/appStore';
import { colors } from '../../theme/colors';
import { touchTargets } from '../../theme/spacing';
import { Volume2, VolumeX } from 'lucide-react-native';

interface VoiceGuideButtonProps {
  text: string;
  lang?: string;
}

export const VoiceGuideButton: React.FC<VoiceGuideButtonProps> = ({
  text,
  lang,
}) => {
  const { isSpeaking, setSpeaking, language, isVoiceGuideEnabled } = useAppStore();

  const handlePress = useCallback(async () => {
    if (isSpeaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    // Santhali (sat), Ho (ho), Mundari (mun) are not supported by device TTS engines.
    // Fall back to Hindi (hi-IN) since tribal language speakers are bilingual.
    const ttsLangMap: Record<string, string> = {
      hi: 'hi-IN',
      en: 'en-US',
      sat: 'hi-IN',
      ho: 'hi-IN',
      mun: 'hi-IN',
    };
    const speechLang = lang || ttsLangMap[language] || 'hi-IN';

    Speech.speak(text, {
      language: speechLang,
      rate: 0.85, // Slower for better comprehension
      pitch: 1.0,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }, [text, lang, language, isSpeaking, setSpeaking]);

  if (!isVoiceGuideEnabled) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, isSpeaking && styles.speaking]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel="Voice guide"
      accessibilityRole="button"
    >
      {isSpeaking ? (
        <VolumeX size={24} color={colors.surface} />
      ) : (
        <Volume2 size={24} color={colors.surface} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 100,
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    borderRadius: touchTargets.minimum / 2,
    backgroundColor: colors.forestGreen, // Distinctly green
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  speaking: {
    backgroundColor: colors.ochre,
  },
});
