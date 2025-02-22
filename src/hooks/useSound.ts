
import { useState, useRef, useCallback, useEffect } from 'react';

export interface Sound {
  id: string;
  name: string;
  src: string;
  category: string;
}

export const useSound = (sound: Sound) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element and set up duration detection
    const audio = new Audio(sound.src);
    audioRef.current = audio;
    
    const handleLoadedMetadata = () => {
      setDuration(Math.round(audio.duration));
    };

    // For Blob URLs (recordings), we need to wait for the audio to be loaded
    if (sound.category === 'Recorded') {
      audio.preload = 'metadata';
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    // If the audio already has metadata, set duration immediately
    if (audio.duration) {
      setDuration(Math.round(audio.duration));
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.remove();
    };
  }, [sound.src, sound.category]);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sound.src);
      audioRef.current.volume = volume;
    }
    
    if (!isPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [sound.src, volume, isPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  return { play, stop, isPlaying, volume, updateVolume, duration };
};
