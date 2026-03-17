import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Multiplayer3DMap from '@/components/game/Multiplayer3DMap';

export default function CityMapPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">
        <Multiplayer3DMap />
      </main>
      <Footer />
    </div>
  );
}
