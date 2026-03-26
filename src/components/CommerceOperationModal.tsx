import { useState, useEffect } from 'react';
import { X, Clock3, DollarSign, Landmark, BadgeDollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import {
  ComercioKey,
  COMERCIOS_CONFIG,
  calcularValorLavagem,
  calcularTempoLavagem,
  calcularTaxaAplicada,
} from '@/types/comercios';
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
  dirtyMoney: propDirtyMoney,
  cleanMoney: propCleanMoney,
  onClose,
  onStartOperation,
  onCompleteOperation,
}: CommerceOperationModalProps) {
  // Usar valores das props (que vêm do jogador) como prioridade
  const dirtyMoney = propDirtyMoney;
  const cleanMoney = propCleanMoney;
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !commerceData?.emAndamento || !commerceData?.horarioFim) return;

    const updateTimer = () => {
      const remaining = Math.max(0, commerceData.horarioFim! - Date.now());
      setTimeLeft(Math.ceil(remaining / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);
    return () => clearInterval(interval);
  }, [isOpen, commerceData?.emAndamento, commerceData?.horarioFim]);

  if (!isOpen || !commerceId || !commerceData) return null;

  const config = COMERCIOS_CONFIG[commerceId];
  const valorLavagem = calcularValorLavagem(commerceId, commerceData.nivelNegocio);
  const tempoLavagem = calcularTempoLavagem(commerceId, commerceData.nivelNegocio);
  const taxaAplicada = calcularTaxaAplicada(commerceId, commerceData.nivelTaxa);
  const descontoEfetivo = COMERCIOS_CONFIG[commerceId].taxaBase - taxaAplicada;
  const cleanMoneyGanho = Math.floor(valorLavagem * (taxaAplicada / 100));

  const hoje = new Date().toDateString();
  const jaUsouHoje = commerceData.ultimaDataUso === hoje;

  let status = 'Disponível';
  let statusColor = 'text-emerald-400';
  let statusBg = 'from-emerald-500/20 to-emerald-300/10 border-emerald-400/40';

  if (commerceData.emAndamento) {
    status = 'Lavagem em andamento';
    statusColor = 'text-amber-300';
    statusBg = 'from-amber-500/20 to-orange-300/10 border-amber-400/40';
  } else if (jaUsouHoje && !commerceData.emAndamento) {
    status = 'Limite diário atingido';
    statusColor = 'text-red-300';
    statusBg = 'from-red-500/20 to-red-300/10 border-red-400/40';
  }

  const canStart =
    !commerceData.emAndamento &&
    !jaUsouHoje &&
    dirtyMoney >= valorLavagem;

  const canComplete =
    !!commerceData.emAndamento &&
    !!commerceData.horarioFim &&
    Date.now() >= commerceData.horarioFim;

  const handleStartClick = async () => {
    console.log('🎯 Botão "Iniciar Lavagem" clicado para:', commerceId);
    setError('');
    setIsStarting(true);
    try {
      console.log('📞 Chamando onStartOperation...');
      await onStartOperation(commerceId);
      console.log('✅ onStartOperation completado com sucesso');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao iniciar lavagem';
      console.error('❌ Erro ao iniciar lavagem:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompleteClick = async () => {
    console.log('🏁 Botão "Finalizar Lavagem" clicado para:', commerceId);
    setError('');
    setIsCompleting(true);
    try {
      console.log('📞 Chamando onCompleteOperation...');
      await onCompleteOperation(commerceId);
      console.log('✅ onCompleteOperation completado com sucesso');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao finalizar lavagem';
      console.error('❌ Erro ao finalizar lavagem:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsCompleting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const StatCard = ({
    icon,
    title,
    value,
    valueClass = 'text-cyan-200',
  }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    valueClass?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-cyan-400/20 bg-slate-950/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
        {icon}
        <span>{title}</span>
      </div>
      <div className={`mt-3 text-lg md:text-xl font-black ${valueClass}`}>
        {value}
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      >
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-400/30 bg-[linear-gradient(180deg,rgba(6,12,24,0.98)_0%,rgba(12,20,36,0.98)_100%)] shadow-[0_0_60px_rgba(0,240,255,0.18)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.08),transparent_35%),radial-gradient(circle_at_bottom,rgba(157,0,255,0.08),transparent_35%)]" />

          <div className="relative border-b border-cyan-400/20 bg-black/20 px-5 py-4 md:px-8 md:py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-400/70">
                  Operação de lavagem
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-black uppercase tracking-wide text-cyan-200">
                  {config.nome}
                </h2>

                <div className={`mt-3 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusBg} ${statusColor}`}>
                  {commerceData.emAndamento ? (
                    <Clock3 className="h-4 w-4" />
                  ) : jaUsouHoje ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span>{status}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-full border border-cyan-400/20 bg-slate-900/70 p-2 text-cyan-300 transition hover:bg-slate-800 hover:text-cyan-100"
                aria-label="Fechar modal"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="relative px-5 py-5 md:px-8 md:py-7">
            {/* Container vazio para novo conteúdo */}
            <div className="min-h-[400px] rounded-2xl border border-cyan-400/20 bg-slate-950/40 p-6">
              {/* Espaço reservado para novo conteúdo */}
            </div>
          </div>

          <div className="relative flex flex-col-reverse gap-3 border-t border-cyan-400/20 bg-black/20 px-5 py-4 md:flex-row md:justify-end md:px-8">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-cyan-400/40 bg-transparent text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100"
            >
              Fechar
            </Button>

            {commerceData.emAndamento && timeLeft === 0 && canComplete ? (
              <Button
                onClick={handleCompleteClick}
                disabled={isCompleting}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black uppercase tracking-wide hover:from-emerald-400 hover:to-emerald-500"
              >
                {isCompleting ? 'Finalizando...' : 'Finalizar Lavagem'}
              </Button>
            ) : canStart ? (
              <Button
                onClick={handleStartClick}
                disabled={isStarting}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-wide hover:from-cyan-400 hover:to-blue-500"
              >
                {isStarting ? 'Iniciando...' : 'Iniciar Lavagem'}
              </Button>
            ) : (
              <Button
                disabled
                className="bg-slate-700 text-slate-300 cursor-not-allowed font-bold uppercase tracking-wide"
              >
                {jaUsouHoje ? 'Limite Diário Atingido' : 'Indisponível'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
