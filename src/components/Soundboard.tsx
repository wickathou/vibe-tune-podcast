
import { useState, useEffect } from 'react';
import SoundPad from './SoundPad';
import SoundboardHeader from './soundboard/SoundboardHeader';
import AddSoundForm from './soundboard/AddSoundForm';
import CategoryFilters from './soundboard/CategoryFilters';
import VolumeControl from './soundboard/VolumeControl';
import { useToast } from '@/hooks/use-toast';

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
  { id: '4', name: 'Rizz', src: '/sounds/rizz.mp3', category: 'Meme' },
  { id: '5', name: 'OMG Hell No', src: '/sounds/omg_hell_no.mp3', category: 'Meme' },
  { id: '6', name: 'Damn son!', src: '/sounds/damn_son.mp3', category: 'Meme' },
];

const Soundboard = () => {
  const [category, setCategory] = useState<string>('all');
  const [volume, setVolume] = useState(1);
  const [sounds, setSounds] = useState<CustomSound[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSounds = localStorage.getItem('customSounds');
    if (savedSounds) {
      setSounds([...DEFAULT_SOUNDS, ...JSON.parse(savedSounds)]);
    } else {
      setSounds(DEFAULT_SOUNDS);
    }
  }, []);

  const handleAddSound = (newSound: { name: string; src: string; category: string }) => {
    const newSoundObj = {
      id: Date.now().toString(),
      ...newSound
    };

    const customSounds = sounds.filter(s => !DEFAULT_SOUNDS.some(d => d.id === s.id));
    const updatedCustomSounds = [...customSounds, newSoundObj];
    localStorage.setItem('customSounds', JSON.stringify(updatedCustomSounds));

    setSounds(prevSounds => [...prevSounds, newSoundObj]);
    setShowAddForm(false);

    toast({
      title: "Success",
      description: "Sound added successfully!",
    });
  };

  const handleDeleteSound = (id: string) => {
    const customSounds = sounds.filter(s => !DEFAULT_SOUNDS.some(d => d.id === s.id));
    const updatedCustomSounds = customSounds.filter(s => s.id !== id);
    localStorage.setItem('customSounds', JSON.stringify(updatedCustomSounds));
    setSounds(prevSounds => [...DEFAULT_SOUNDS, ...updatedCustomSounds]);
  };

  const categories = ['all', ...new Set(sounds.map(s => s.category))];
  const filteredSounds = category === 'all' ? sounds : sounds.filter(sound => sound.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4">
          <SoundboardHeader onAddSoundClick={() => setShowAddForm(!showAddForm)} />

          {showAddForm && (
            <AddSoundForm 
              onAddSound={handleAddSound}
              onRecordingComplete={handleAddSound}
            />
          )}

          <CategoryFilters
            categories={categories}
            selectedCategory={category}
            onCategorySelect={setCategory}
          />

          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSounds.map((sound) => (
            <SoundPad 
              key={sound.id} 
              sound={sound} 
              onDelete={!DEFAULT_SOUNDS.some(d => d.id === sound.id) ? handleDeleteSound : undefined}
              isCustom={!DEFAULT_SOUNDS.some(d => d.id === sound.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Soundboard;

