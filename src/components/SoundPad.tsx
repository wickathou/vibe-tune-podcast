
import { useState } from 'react';
import { Sound, useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { Music, Link, Mic, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface SoundPadProps {
  sound: Sound;
  onDelete?: (id: string) => void;
  isCustom?: boolean;
}

const SoundPad = ({ sound, onDelete, isCustom = false }: SoundPadProps) => {
  const { play, stop, isPlaying } = useSound(sound);
  const [isPressed, setIsPressed] = useState(false);
  const { toast } = useToast();

  const handlePress = () => {
    setIsPressed(true);
    play();
    setTimeout(() => setIsPressed(false), 200);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(sound.id);
      toast({
        title: "Success",
        description: "Sound deleted successfully",
      });
    }
  };

  const getIcon = () => {
    if (sound.category === 'URL') return <Link className="w-8 h-8 text-white/80" />;
    if (sound.category === 'Recorded') return <Mic className="w-8 h-8 text-white/80" />;
    return <Music className="w-8 h-8 text-white/80" />;
  };

  return (
    <div className="relative group">
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
          isPressed && "scale-95",
          sound.category === 'URL' && "bg-blue-500/20 hover:bg-blue-500/30",
          sound.category === 'Recorded' && "bg-green-500/20 hover:bg-green-500/30"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium text-white/90">
            {sound.name}
          </span>
        </div>
        {isPressed && (
          <div className="absolute inset-0 animate-ripple bg-white/20 rounded-full" />
        )}
      </button>
      
      {isCustom && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SoundPad;

