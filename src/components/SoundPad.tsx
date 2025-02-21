
import { useState } from 'react';
import { Sound, useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { Music } from 'lucide-react';

interface SoundPadProps {
  sound: Sound;
}

const SoundPad = ({ sound }: SoundPadProps) => {
  const { play, stop, isPlaying } = useSound(sound);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    play();
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <button
      onClick={handlePress}
      className={cn(
        "relative w-full aspect-square rounded-2xl p-4",
        "bg-white/10 backdrop-blur-md border border-white/20",
        "flex items-center justify-center",
        "transform transition-all duration-200 ease-out",
        "hover:bg-white/20 active:scale-95",
        "overflow-hidden",
        isPlaying && "ring-2 ring-white/40",
        isPressed && "scale-95"
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Music className="w-8 h-8 text-white/80" />
        <span className="text-sm font-medium text-white/90">
          {sound.name}
        </span>
      </div>
      {isPressed && (
        <div className="absolute inset-0 animate-ripple bg-white/20 rounded-full" />
      )}
    </button>
  );
};

export default SoundPad;
