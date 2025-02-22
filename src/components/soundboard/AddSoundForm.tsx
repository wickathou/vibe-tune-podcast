
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddSoundFormProps {
  onAddSound: (sound: { name: string; src: string; category: string }) => void;
  onRecordingComplete: (sound: { name: string; src: string; category: string }) => void;
}

const AddSoundForm = ({ onAddSound, onRecordingComplete }: AddSoundFormProps) => {
  const [newSound, setNewSound] = useState({ name: '', src: '', category: 'URL' });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleAddSound = () => {
    if (!newSound.name || !newSound.src) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    onAddSound(newSound);
    setNewSound({ name: '', src: '', category: 'URL' });
  };

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

        onRecordingComplete({
          name: recordingName,
          src: audioUrl,
          category: 'Recorded'
        });
        
        setRecordingName('');
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

  return (
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
  );
};

export default AddSoundForm;

