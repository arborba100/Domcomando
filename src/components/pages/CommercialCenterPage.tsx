import { Image } from '@/components/ui/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMember } from '@/integrations';
import { comerciosService } from '@/services/comerciosService';
import { Comercios, COMERCIOS_KEYS, ComercioKey } from '@/types/comercios';
import ComercioCard from '@/components/ComercioCard';
import { BaseCrudService } from '@/integrations';
import { Players } from '@/entities';
import CommercialCenterHotspots from '@/components/CommercialCenterHotspots';
import CommerceOperationModal from '@/components/CommerceOperationModal';
import { useDirtyMoneyStore } from '@/store/dirtyMoneyStore';
import { useCleanMoneyStore } from '@/store/cleanMoneyStore';
import { usePlayerStore } from '@/store/playerStore';
import { Building2, Landmark, Sparkles } from 'lucide-react';

const INITIAL_COMERCIOS_DATA: Comercios = {
  pizzaria: { nivelNegocio: 0, nivelTaxa: 0, ultimaDataUso: null, emAndamento: false, horarioFim: null, valorAtual: 0, taxaAplicada: 0 },
  admBens: { nivelNegocio: 0, nivelTaxa: 0, ultimaDataUso: null, emAndamento: false, horarioFim: null, valorAtual: 0, taxaAplicada: 0 },
  lavanderia: { nivelNegocio: 0, nivelTaxa: 0, ultimaDataUso: null, emAndamento: false, horarioFim: null, valorAtual: 0, taxaAplicada: 0 },
  academia: { nivelNegocio: 0, nivelTaxa: 0, ultimaDataUso: null, emAndamento: false, horarioFim: null, valorAtual: 0, taxaAplicada: 0 },
  templo: { nivelNegocio: 0, nivelTaxa: 0, ultimaDataUso: null, emAndamento: false, horarioFim: null, valorAtual: 0, taxaAplicada: 0 },
};

export default function CommercialCenterPage() {
  const { member } = useMember();

  const [comercios, setComercios] = useState<Comercios | null>(null);
  const [playerData, setPlayerData] = useState<Players | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCommerceModal, setActiveCommerceModal] = useState<ComercioKey | null>(null);

  const { dirtyMoney, setDirtyMoney } = useDirtyMoneyStore();
  const { cleanMoney, setCleanMoney } = useCleanMoneyStore();
  const { setLevel, setPlayerId, setPlayerName } = usePlayerStore();

  const syncPlayerToStores = (player: Players) => {
    setDirtyMoney(player.dirtyMoney || 0);
    setCleanMoney(player.cleanMoney || 0);
    setLevel(player.level || 1);
    setPlayerId(player._id);
    setPlayerName(player.playerName || 'Jogador');
  };

  // 🚀 LOAD PLAYER (CORRIGIDO)
  useEffect(() => {
    const load = async () => {
      if (!member?._id) return;

      try {
        const playerId = member._id;

        let player = await BaseCrudService.getById<Players>('players', playerId);

        // 🔥 CRIA PLAYER COM 1 BILHÃO
        if (!player) {
          player = {
            _id: playerId,
            playerName: member.profile?.nickname || 'Jogador',
            cleanMoney: 0,
            dirtyMoney: 1000000000,
            level: 1,
            progress: 0,
            comercios: JSON.stringify(INITIAL_COMERCIOS_DATA),
            isGuest: false,
            profilePicture: member.profile?.photo?.url,
          };

          await BaseCrudService.create('players', player);
        } else {
          // 🔥 FORÇA 1 BILHÃO SEMPRE (MODO TESTE)
          if (player.dirtyMoney !== 1000000000) {
            await BaseCrudService.update('players', {
              _id: playerId,
              dirtyMoney: 1000000000,
            });

            player = await BaseCrudService.getById<Players>('players', playerId);
          }
        }

        if (!player) return;

        setPlayerData(player);
        syncPlayerToStores(player);

        const data = player.comercios
          ? JSON.parse(player.comercios)
          : INITIAL_COMERCIOS_DATA;

        setComercios(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [member?._id]);

  // 🔄 UPDATE LOOP
  useEffect(() => {
    if (!member?._id) return;

    const interval = setInterval(async () => {
      const player = await BaseCrudService.getById<Players>('players', member._id);

      if (player) {
        setPlayerData(player);
        syncPlayerToStores(player);

        const data = player.comercios
          ? JSON.parse(player.comercios)
          : INITIAL_COMERCIOS_DATA;

        setComercios(data);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [member?._id]);

  const handleIniciarLavagem = async (key: ComercioKey) => {
    const result = await comerciosService.iniciarLavagem(
      member!._id,
      key,
      dirtyMoney
    );

    if (!result.sucesso) alert(result.mensagem);
  };

  const handleFinalizarLavagem = async (key: ComercioKey) => {
    const result = await comerciosService.finalizarLavagem(member!._id, key);

    if (!result.sucesso) alert(result.mensagem);
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(v);

  const openCommerceModal = (id: string) => {
    const map: any = {
      pizzaria: 'pizzaria',
      admBens: 'admBens',
      templo: 'templo',
      academia: 'academia',
      lavanderia: 'lavanderia',
    };

    setActiveCommerceModal(map[id]);
  };

  const closeCommerceModal = () => setActiveCommerceModal(null);

  return (
    <div className="min-h-screen bg-[#05040f] text-white">
      <Header />

      {/* HEADER */}
      <div className="pt-[90px] px-4">
        <div className="max-w-[1200px] mx-auto mb-6">
          <h1 className="text-4xl font-bold text-cyan-400">
            CENTRO COMERCIAL
          </h1>
        </div>
      </div>

      {/* BANNER */}
      <div className="px-4">
        <div className="max-w-[1100px] mx-auto relative">
          <Image
            src="https://static.wixstatic.com/media/50f4bf_fd64ac461d5d41c2a6bc7639af7590ac~mv2.png"
            className="w-full"
          />
          <CommercialCenterHotspots onCommerceClick={openCommerceModal} />
        </div>
      </div>

      {/* MONEY */}
      <div className="px-4 py-6">
        <div className="max-w-[1000px] mx-auto flex justify-between">
          <div>💰 Sujo: {formatCurrency(dirtyMoney)}</div>
          <div>🏦 Limpo: {formatCurrency(cleanMoney)}</div>
        </div>
      </div>

      {/* CARDS */}
      <div className="px-4 py-8">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-4">
          {comercios &&
            COMERCIOS_KEYS.map((key) => (
              <ComercioCard
                key={key}
                comercioKey={key}
                data={comercios[key]}
                onIniciar={() => handleIniciarLavagem(key)}
                onFinalizar={() => handleFinalizarLavagem(key)}
                dirtyMoney={dirtyMoney}
              />
            ))}
        </div>
      </div>

      {/* MODAL */}
      {activeCommerceModal && (
        <CommerceOperationModal
          isOpen
          commerceId={activeCommerceModal}
          commerceData={comercios?.[activeCommerceModal]!}
          dirtyMoney={dirtyMoney}
          cleanMoney={cleanMoney}
          onClose={closeCommerceModal}
          onStartOperation={handleIniciarLavagem}
          onCompleteOperation={handleFinalizarLavagem}
        />
      )}

      <Footer />
    </div>
  );
}