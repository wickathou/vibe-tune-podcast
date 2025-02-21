
import { useCallback, useState } from 'react';
import SoundPad from './SoundPad';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SAMPLE_SOUNDS = [
  { id: '1', name: 'bruh', src: '/sounds/bruh.mp3', category: 'Meme' },
  { id: '2', name: 'boom', src: '/sounds/boom.mp3', category: 'Meme' },
  { id: '3', name: 'that sus', src: '/sounds/dramatic_hell_kitchens.mp3', category: 'Meme' },
  { id: '4', name: 'OMG Hell No', src: '/sounds/omg_hell_no.mp3', category: 'Meme' },
];

const Soundboard = () => {
  const [category, setCategory] = useState<string>('all');
  const [volume, setVolume] = useState(1);

  const filteredSounds = useCallback(() => {
    if (category === 'all') return SAMPLE_SOUNDS;
    return SAMPLE_SOUNDS.filter(sound => sound.category === category);
  }, [category]);

  const categories = ['all', ...new Set(SAMPLE_SOUNDS.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-white/90 text-center">
            Soundboard
          </h1>
          
          <div className="flex items-center justify-center gap-2 p-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  category === cat
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
            <Volume2 className="w-5 h-5 text-white/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSounds().map((sound) => (
            <SoundPad key={sound.id} sound={sound} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Soundboard;
