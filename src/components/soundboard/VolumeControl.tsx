
import { Volume2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center gap-2 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
      <Volume2 className="w-5 h-5 text-white/60" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;

