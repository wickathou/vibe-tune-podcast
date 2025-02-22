import { useCallback, useState, useEffect, useRef } from 'react';
import SoundPad from './SoundPad';
import { Volume2, Plus, Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
  { id: '5', name: 'Damn son!', src: '/sounds/damn_son.mp3', category: 'Meme' },
];

const Soundboard = () => {
  const [category, setCategory] = useState<string>('all');
  const [volume, setVolume] = useState(1);
  const [sounds, setSounds] = useState<CustomSound[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSound, setNewSound] = useState({ name: '', src: '', category: 'URL' });
  const { toast } = useToast();

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const savedSounds = localStorage.getItem('customSounds');
    if (savedSounds) {
      setSounds([...DEFAULT_SOUNDS, ...JSON.parse(savedSounds)]);
    } else {
      setSounds(DEFAULT_SOUNDS);
    }
  }, []);

  const startRecording = async () => {
    if (!recordingName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a name for your recording",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newSoundObj = {
          id: Date.now().toString(),
          name: recordingName,
          src: audioUrl,
          category: 'Recorded'
        };

        const customSounds = sounds.filter(s => !DEFAULT_SOUNDS.some(d => d.id === s.id));
        const updatedCustomSounds = [...customSounds, newSoundObj];
        localStorage.setItem('customSounds', JSON.stringify(updatedCustomSounds));

        setSounds(prevSounds => [...prevSounds, newSoundObj]);
        setRecordingName('');
        setShowAddForm(false);

        toast({
          title: "Success",
          description: "Recording saved successfully!",
        });
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleDeleteSound = (id: string) => {
    const customSounds = sounds.filter(s => !DEFAULT_SOUNDS.some(d => d.id === s.id));
    const updatedCustomSounds = customSounds.filter(s => s.id !== id);
    localStorage.setItem('customSounds', JSON.stringify(updatedCustomSounds));
    setSounds(prevSounds => [...DEFAULT_SOUNDS, ...updatedCustomSounds]);
  };

  const handleAddSound = () => {
    if (!newSound.name || !newSound.src) {
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
    setNewSound({ name: '', src: '', category: 'URL' });
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
            <div>
              <h1 className="text-3xl font-bold text-white/90">
                Soundboard
              </h1>
              <a className='text-white' href='https://javi.ju.mp/' target='blank'>By Javi</a>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-white bg-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sound
            </Button>
          </div>

          {showAddForm && (
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Add from URL</h3>
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

              <div className="border-t border-white/10 my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Record Sound</h3>
                <Input
                  placeholder="Recording name"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  disabled={isRecording}
                />
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="w-full"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="w-full"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>
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
