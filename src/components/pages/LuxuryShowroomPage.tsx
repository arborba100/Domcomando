import { Image } from '@/components/ui/image';

export default function LuxuryShowroomPage() {
  return (
    <div className="w-full h-screen fixed inset-0 overflow-hidden">
      {/* Full-screen background image */}
      <Image
        src="https://static.wixstatic.com/media/50f4bf_38c9f88d54654e38906e049af6a8b5a4~mv2.png"
        alt="Luxury Showroom Background"
        className="w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      
      {/* Overlay for content */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
