
import Soundboard from '@/components/Soundboard';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Soundboard />
      <footer className="mt-auto p-4 text-center text-sm text-gray-600">
        <p>By <a href="https://javi.ju.mp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Javi</a></p>
      </footer>
    </div>
  );
};

export default Index;
