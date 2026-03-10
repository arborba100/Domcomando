import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GiroNoAsfaltoPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Slot Machine Illustration Section - Full Screen */}
      <section className="flex-1 w-full px-4 bg-black flex items-center justify-center">
        <div className="max-w-[100rem] mx-auto flex justify-center w-full">
          <Image
            src="https://static.wixstatic.com/media/50f4bf_041a01113b744e19a741c17c67111857~mv2.png"
            alt="Ultra realistic cinematic slot machine facing the player, front view"
            width={1200}
            height={800}
            className="w-full max-w-4xl h-auto object-contain"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
