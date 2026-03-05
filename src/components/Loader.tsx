import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
    </div>
  );
}
