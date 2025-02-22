
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface SoundboardHeaderProps {
  onAddSoundClick: () => void;
}

const SoundboardHeader = ({ onAddSoundClick }: SoundboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white/90">
          Soundboard
        </h1>
        <a className='text-white' href='https://javi.ju.mp/' target='blank'>By Javi</a>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onAddSoundClick}
        className="text-white bg-black"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Sound
      </Button>
    </div>
  );
};

export default SoundboardHeader;

