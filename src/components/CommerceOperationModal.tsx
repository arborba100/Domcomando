import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComercioKey, COMERCIOS_CONFIG, calcularValorLavagem, calcularTempoLavagem, calcularTaxaAplicada } from '@/types/comercios';
import { ComercioData } from '@/types/comercios';

interface CommerceOperationModalProps {
  isOpen: boolean;
  commerceId: ComercioKey | null;
  commerceData: ComercioData | null;
  dirtyMoney: number;
  cleanMoney: number;
  onClose: () => void;
  onStartOperation: (commerceId: ComercioKey) => Promise<void>;
  onCompleteOperation: (commerceId: ComercioKey) => Promise<void>;
}

export default function CommerceOperationModal({
  isOpen,
  commerceId,
  commerceData,
  dirtyMoney,
  cleanMoney,
  onClose,
  onStartOperation,
  onCompleteOperation,
}: CommerceOperationModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string>('');

  // Timer effect
  useEffect(() => {
    if (!isOpen || !commerceData?.emAndamento || !commerceData?.horarioFim) {
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, commerceData.horarioFim! - Date.now());
      setTimeLeft(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [isOpen, commerceData?.emAndamento, commerceData?.horarioFim]);

  if (!isOpen || !commerceId || !commerceData) {
    return null;
  }

  const config = COMERCIOS_CONFIG[commerceId];
  const valorLavagem = calcularValorLavagem(commerceId, commerceData.nivelNegocio);
  const tempoLavagem = calcularTempoLavagem(commerceId, commerceData.nivelNegocio);
  const taxaAplicada = calcularTaxaAplicada(commerceId, commerceData.nivelTaxa);
  const cleanMoneyGanho = Math.floor(valorLavagem * (taxaAplicada / 100));

  // Verificar se já foi usado hoje
  const hoje = new Date().toDateString();
  const jaUsouHoje = commerceData.ultimaDataUso === hoje;

  // Verificar status
  let status = 'Disponível';
  let statusColor = 'text-green-400';

  if (commerceData.emAndamento) {
    status = 'Lavagem em andamento';
    statusColor = 'text-yellow-400';
  } else if (jaUsouHoje && !commerceData.emAndamento) {
    status = 'Limite diário atingido';
    statusColor = 'text-red-400';
  }

  const canStart =
    !commerceData.emAndamento &&
    !jaUsouHoje &&
    dirtyMoney >= valorLavagem;

  const canComplete =
    commerceData.emAndamento &&
    commerceData.horarioFim &&
    Date.now() >= commerceData.horarioFim;

  const handleStartClick = async () => {
    setError('');
    setIsStarting(true);
    try {
      await onStartOperation(commerceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar lavagem');
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompleteClick = async () => {
    setError('');
    setIsCompleting(true);
    try {
      await onCompleteOperation(commerceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar lavagem');
    } finally {
      setIsCompleting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-400 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-b border-cyan-400/50 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cyan-300 font-heading">{config.nome}</h2>
              <p className={`text-sm mt-1 font-paragraph ${statusColor}`}>{status}</p>
            </div>
            <button
              onClick={onClose}
              className="text-cyan-300 hover:text-cyan-100 transition-colors"
              aria-label="Fechar modal"
            >
              <X size={28} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Operation Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Valor de Lavagem */}
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Valor de Lavagem
                </p>
                <p className="text-xl font-bold text-cyan-300 mt-2 font-heading">
                  {formatCurrency(valorLavagem)}
                </p>
              </div>

              {/* Taxa Base */}
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Taxa Base
                </p>
                <p className="text-xl font-bold text-cyan-300 mt-2 font-heading">
                  {COMERCIOS_CONFIG[commerceId].taxaBase}%
                </p>
              </div>

              {/* Tempo de Operação */}
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Tempo de Operação
                </p>
                <p className="text-xl font-bold text-cyan-300 mt-2 font-heading">
                  {formatTime(Math.floor(tempoLavagem / 1000))}
                </p>
              </div>

              {/* Desconto de Eficiência */}
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Desconto de Eficiência
                </p>
                <p className="text-xl font-bold text-green-400 mt-2 font-heading">
                  -{(COMERCIOS_CONFIG[commerceId].taxaBase - taxaAplicada).toFixed(1)}%
                </p>
              </div>

              {/* Taxa Final */}
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Taxa Final
                </p>
                <p className="text-xl font-bold text-yellow-400 mt-2 font-heading">
                  {taxaAplicada.toFixed(1)}%
                </p>
              </div>

              {/* Dinheiro Limpo Recebido */}
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Dinheiro Limpo Recebido
                </p>
                <p className="text-xl font-bold text-green-400 mt-2 font-heading">
                  {formatCurrency(cleanMoneyGanho)}
                </p>
              </div>
            </div>

            {/* Timer - shown when operation is in progress */}
            {commerceData.emAndamento && timeLeft > 0 && (
              <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-400/50 rounded p-4 text-center">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider mb-2">
                  Tempo Restante
                </p>
                <p className="text-3xl font-bold text-purple-300 font-heading font-mono">
                  {formatTime(timeLeft)}
                </p>
              </div>
            )}

            {/* Completion message */}
            {commerceData.emAndamento && timeLeft === 0 && (
              <div className="bg-gradient-to-r from-green-900/50 to-cyan-900/50 border border-green-400/50 rounded p-4 text-center">
                <p className="text-lg font-bold text-green-300 font-heading">
                  ✓ Operação Concluída!
                </p>
                <p className="text-sm text-green-200 mt-2 font-paragraph">
                  Clique em "Finalizar Lavagem" para receber o dinheiro limpo
                </p>
              </div>
            )}

            {/* Current Money Status */}
            <div className="grid grid-cols-2 gap-4 border-t border-cyan-400/30 pt-4">
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Dinheiro Sujo Disponível
                </p>
                <p className="text-lg font-bold text-green-400 mt-2 font-heading">
                  {formatCurrency(dirtyMoney)}
                </p>
              </div>
              <div className="bg-slate-700/50 border border-cyan-400/30 rounded p-4">
                <p className="text-xs text-gray-400 font-paragraph uppercase tracking-wider">
                  Dinheiro Limpo Total
                </p>
                <p className="text-lg font-bold text-yellow-400 mt-2 font-heading">
                  {formatCurrency(cleanMoney)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer - Buttons */}
          <div className="bg-slate-900/50 border-t border-cyan-400/30 px-6 py-4 flex gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
            >
              Fechar
            </Button>

            {commerceData.emAndamento && timeLeft === 0 && canComplete ? (
              <Button
                onClick={handleCompleteClick}
                disabled={isCompleting}
                className="bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                {isCompleting ? 'Finalizando...' : 'Finalizar Lavagem'}
              </Button>
            ) : canStart ? (
              <Button
                onClick={handleStartClick}
                disabled={isStarting}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
              >
                {isStarting ? 'Iniciando...' : 'Iniciar Lavagem'}
              </Button>
            ) : (
              <Button
                disabled
                className="bg-gray-600 text-gray-300 cursor-not-allowed"
              >
                {jaUsouHoje ? 'Limite Diário Atingido' : 'Indisponível'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
