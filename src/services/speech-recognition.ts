// Speech Recognition Service for Real-time Transcription
export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

// Extended SpeechRecognition interface for better TypeScript support
interface ExtendedSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
}

interface ExtendedSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): ExtendedSpeechRecognition;
    };
    SpeechRecognition: {
      new (): ExtendedSpeechRecognition;
    };
  }
}

export class SpeechRecognitionService {
  private recognition: ExtendedSpeechRecognition | null = null;
  private isListening = false;
  private callbacks: {
    onResult?: (result: SpeechRecognitionResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  } = {};

  constructor(config: SpeechRecognitionConfig = {}) {
    if (!this.isSpeechRecognitionSupported()) {
      console.warn('Speech recognition is not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.maxAlternatives = config.maxAlternatives ?? 1;
    this.recognition.lang = config.language || 'en-US';

    // Set up event listeners
    this.setupEventListeners();
  }

  private isSpeechRecognitionSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  private setupEventListeners(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };

    this.recognition.onresult = (event: ExtendedSpeechRecognitionEvent) => {
      const results = event.results;
      const lastResult = results[event.resultIndex];
      const transcript = lastResult[0].transcript;
      const confidence = lastResult[0].confidence;

      const result: SpeechRecognitionResult = {
        text: transcript,
        confidence: confidence,
        isFinal: lastResult.isFinal,
      };

      this.callbacks.onResult?.(result);
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'Unknown speech recognition error';

      switch (event.error) {
        case 'not-allowed':
          errorMessage =
            'Microphone access denied. Please allow microphone permissions.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking.';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed. Please check your microphone.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during speech recognition.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was aborted.';
          break;
        case 'bad-grammar':
          errorMessage = 'Grammar compilation error.';
          break;
        case 'language-not-supported':
          errorMessage = 'Language not supported for speech recognition.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      this.callbacks.onError?.(errorMessage);
    };
  }

  public start(callbacks: {
    onResult?: (result: SpeechRecognitionResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }): boolean {
    if (!this.recognition) {
      callbacks.onError?.(
        'Speech recognition is not supported in this browser'
      );
      return false;
    }

    if (this.isListening) {
      callbacks.onError?.('Speech recognition is already running');
      return false;
    }

    this.callbacks = callbacks;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      callbacks.onError?.('Failed to start speech recognition');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public abort(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  public isActive(): boolean {
    return this.isListening;
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public setLanguage(language: string): void {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  public getLanguage(): string {
    return this.recognition?.lang || 'en-US';
  }

  // Get list of supported languages (common ones)
  public static getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish (Spain)' },
      { code: 'es-MX', name: 'Spanish (Mexico)' },
      { code: 'fr-FR', name: 'French (France)' },
      { code: 'de-DE', name: 'German (Germany)' },
      { code: 'it-IT', name: 'Italian (Italy)' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'pt-PT', name: 'Portuguese (Portugal)' },
      { code: 'ru-RU', name: 'Russian' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'zh-TW', name: 'Chinese (Traditional)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'ar-SA', name: 'Arabic' },
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'th-TH', name: 'Thai' },
      { code: 'vi-VN', name: 'Vietnamese' },
      { code: 'nl-NL', name: 'Dutch' },
      { code: 'sv-SE', name: 'Swedish' },
      { code: 'da-DK', name: 'Danish' },
      { code: 'no-NO', name: 'Norwegian' },
      { code: 'fi-FI', name: 'Finnish' },
      { code: 'pl-PL', name: 'Polish' },
      { code: 'tr-TR', name: 'Turkish' },
      { code: 'he-IL', name: 'Hebrew' },
    ];
  }
}

// React Hook for Speech Recognition
import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (
    transcript: string,
    isFinal: boolean,
    confidence: number
  ) => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);

  // Initialize speech recognition service
  useEffect(() => {
    speechRecognitionRef.current = new SpeechRecognitionService({
      language: options.language,
      continuous: options.continuous,
      interimResults: options.interimResults,
    });

    setIsSupported(speechRecognitionRef.current.isSupported());

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, [options.language, options.continuous, options.interimResults]);

  const startListening = useCallback(() => {
    if (!speechRecognitionRef.current || isListening) return false;

    return speechRecognitionRef.current.start({
      onStart: () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
      },
      onEnd: () => {
        setIsListening(false);
      },
      onResult: (result) => {
        setTranscript(result.text);
        options.onTranscript?.(result.text, result.isFinal, result.confidence);
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
      },
    });
  }, [isListening, options]);

  const stopListening = useCallback(() => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
  }, []);

  const abortListening = useCallback(() => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.abort();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    error,
    transcript,
    startListening,
    stopListening,
    abortListening,
    resetTranscript,
  };
};

export default SpeechRecognitionService;
