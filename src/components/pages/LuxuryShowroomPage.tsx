import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LuxuryShowroomPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center py-4">
        {/* Background image occupying 90% of screen height */}
        <div className="relative w-full h-[90vh] overflow-hidden rounded-lg">
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
      </div>
      <Footer />
    </div>
  );
}
