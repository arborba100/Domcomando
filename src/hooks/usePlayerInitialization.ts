import { useEffect } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Players } from '@/entities';
import { getInitialComercioData } from '@/types/comercios';

export const usePlayerInitialization = () => {
  const { member } = useMember();

  useEffect(() => {
    const initializePlayer = async () => {
      if (!member?._id) return;

      try {
        const player = await BaseCrudService.getById<Players>('players', member._id);

        // Se o jogador não tem dados de comércios, inicializar
        if (player && !player.comercios) {
          const comercios = getInitialComercioData();
          const dirtyMoney = player.dirtyMoney || 1000;

          await BaseCrudService.update<Players>('players', {
            _id: member._id,
            comercios: JSON.stringify(comercios),
            dirtyMoney,
          });
        }
      } catch (error) {
        console.error('Erro ao inicializar jogador:', error);
      }
    };

    initializePlayer();
  }, [member?._id]);
};
