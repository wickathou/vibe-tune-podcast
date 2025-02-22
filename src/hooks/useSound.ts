
import { useState, useRef, useCallback } from 'react';

export interface Sound {
  id: string;
  name: string;
  src: string;
  category: string;
}

export const useSound = (sound: Sound) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(1);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sound.src);
      audioRef.current.volume = volume;
    }
    
    if (isPlaying) {
      // If already playing, stop the sound
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      // If not playing, start the sound
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

  return { play, stop, isPlaying, volume, updateVolume };
};
