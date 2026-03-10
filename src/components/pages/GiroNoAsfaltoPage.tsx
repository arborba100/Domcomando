import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GiroNoAsfaltoPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] flex flex-col">
      <Header />

      {/* Slot Machine Illustration Section - Full Screen */}
      <section className="flex-1 w-full bg-[#0a0d14] flex items-center justify-center relative overflow-hidden">
        {/* Atmospheric Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4500]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00eaff]/5 rounded-full blur-[150px]" />
          
          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="max-w-[100rem] mx-auto flex justify-center w-full h-full px-4 relative z-10">
          <Image
            src="https://static.wixstatic.com/media/50f4bf_041a01113b744e19a741c17c67111857~mv2.png"
            alt="Ultra realistic cinematic slot machine facing the player, front view"
            width={1200}
            height={800}
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
