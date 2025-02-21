
import { useCallback, useState, useEffect } from 'react';
import SoundPad from './SoundPad';
import { Volume2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface CustomSound {
  id: string;
  name: string;
  src: string;
  category: string;
}

const DEFAULT_SOUNDS = [
  { id: '1', name: 'bruh', src: '/sounds/bruh.mp3', category: 'Meme' },
  { id: '2', name: 'boom', src: '/sounds/boom.mp3', category: 'Meme' },
  { id: '3', name: 'that sus', src: '/sounds/dramatic_hell_kitchens.mp3', category: 'Meme' },
  { id: '4', name: 'OMG Hell No', src: '/sounds/omg_hell_no.mp3', category: 'Meme' },
];

const Soundboard = () => {
  const [category, setCategory] = useState<string>('all');
  const [volume, setVolume] = useState(1);
  const [sounds, setSounds] = useState<CustomSound[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSound, setNewSound] = useState({ name: '', src: '', category: '' });
  const { toast } = useToast();

  useEffect(() => {
    const savedSounds = localStorage.getItem('customSounds');
    if (savedSounds) {
      setSounds([...DEFAULT_SOUNDS, ...JSON.parse(savedSounds)]);
    } else {
      setSounds(DEFAULT_SOUNDS);
    }
  }, []);

  const handleAddSound = () => {
    if (!newSound.name || !newSound.src || !newSound.category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const newSoundObj = {
      id: Date.now().toString(),
      ...newSound
    };

    const customSounds = sounds.filter(s => !DEFAULT_SOUNDS.some(d => d.id === s.id));
    const updatedCustomSounds = [...customSounds, newSoundObj];
    localStorage.setItem('customSounds', JSON.stringify(updatedCustomSounds));

    setSounds(prevSounds => [...prevSounds, newSoundObj]);
    setNewSound({ name: '', src: '', category: '' });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Sound added successfully!",
    });
  };

  const filteredSounds = useCallback(() => {
    if (category === 'all') return sounds;
    return sounds.filter(sound => sound.category === category);
  }, [category, sounds]);

  const categories = ['all', ...new Set(sounds.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white/90">
              Soundboard
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sound
            </Button>
          </div>

          {showAddForm && (
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm space-y-4">
              <Input
                placeholder="Sound name"
                value={newSound.name}
                onChange={(e) => setNewSound(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                placeholder="Sound URL"
                value={newSound.src}
                onChange={(e) => setNewSound(prev => ({ ...prev, src: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                placeholder="Category"
                value={newSound.category}
                onChange={(e) => setNewSound(prev => ({ ...prev, category: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
              <Button onClick={handleAddSound}>Add Sound</Button>
            </div>
          )}
          
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
