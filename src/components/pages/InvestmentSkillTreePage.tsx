import React, { useState, useRef, useEffect } from 'react';
import { useSkillTreeStore } from '@/store/skillTreeStore';
import { useAgilitySkillTreeStore } from '@/store/agilitySkillTreeStore';
import { useAttackSkillTreeStore } from '@/store/attackSkillTreeStore';
import { useDefenseSkillTreeStore } from '@/store/defenseSkillTreeStore';
import { useRespeitSkillTreeStore } from '@/store/respeitSkillTreeStore';
import { useVigorSkillTreeStore } from '@/store/vigorSkillTreeStore';
import { usePlayerStore } from '@/store/playerStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Brain,
  Zap,
  Sword,
  Shield,
  Crown,
  Heart,
  Lock,
  Flame,
  Target,
  Ear,
  Cpu,
  Gauge,
  Users,
  AlertCircle,
  Check,
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';

// Cinematographic Skill Tree Node Component
interface CinematicNodeProps {
  id: string;
  name: string;
  level?: number;
  maxLevel?: number;
  isLocked: boolean;
  isCompleted: boolean;
  isAvailable: boolean;
  isUpgrading?: boolean;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  remainingTime?: number;
}

const CinematicNode: React.FC<CinematicNodeProps> = ({
  id,
  name,
  level,
  maxLevel,
  isLocked,
  isCompleted,
  isAvailable,
  isUpgrading,
  icon,
  color,
  glowColor,
  onClick,
  size = 'medium',
  remainingTime,
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const getNodeStyle = () => {
    if (isCompleted) {
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.8), inset 0 0 20px rgba(16, 185, 129, 0.3)',
        border: '2px solid #10b981',
      };
    }
    if (isAvailable) {
      return {
        background: `linear-gradient(135deg, ${color} 0%, ${glowColor} 100%)`,
        boxShadow: `0 0 30px ${glowColor}99, inset 0 0 20px ${glowColor}33`,
        border: `2px solid ${color}`,
      };
    }
    return {
      background: 'linear-gradient(135deg, #4b5563 0%, #2d3748 100%)',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(0, 0, 0, 0.5)',
      border: '2px solid #4b5563',
      opacity: 0.6,
    };
  };

  return (
    <motion.div
      className="relative flex flex-col items-center"
      whileHover={!isLocked ? { scale: 1.1 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
    >
      <div
        className={`${sizeClasses[size]} rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
          isLocked ? 'cursor-not-allowed' : ''
        }`}
        style={getNodeStyle()}
        onClick={onClick}
      >
        {/* Animated glow background */}
        {isAvailable && !isLocked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          {icon}
        </div>

        {/* Status badges */}
        {isLocked && (
          <motion.div
            className="absolute top-1 right-1 bg-red-600 rounded-full p-1 z-20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock size={12} className="text-white" />
          </motion.div>
        )}

        {isCompleted && (
          <div className="absolute top-1 right-1 bg-green-600 rounded-full p-1 z-20">
            <Check size={12} className="text-white" />
          </div>
        )}

        {isUpgrading && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: glowColor,
              borderRightColor: glowColor,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-xs font-bold text-white truncate w-24">{name}</p>
        {level !== undefined && maxLevel !== undefined && (
          <p
            className="text-xs font-semibold"
            style={{
              color: isCompleted ? '#10b981' : isAvailable ? glowColor : '#9ca3af',
            }}
          >
            {level}/{maxLevel}
          </p>
        )}
        {isUpgrading && remainingTime !== undefined && (
          <p className="text-xs text-blue-400 font-semibold">
            {Math.ceil(remainingTime / 1000)}s
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Respect Skill Section
function RespeitSkillSection() {
  const {
    skills: respeitSkills,
    startUpgrade: respeitStartUpgrade,
    finalizeUpgrade: respeitFinalizeUpgrade,
    canUpgrade: respeitCanUpgrade,
    getRemainingTime: respeitGetRemainingTime,
    getRespectBonus,
    getSkillProgress,
  } = useRespeitSkillTreeStore();

  const { cleanMoney, dirtyMoney } = usePlayerStore();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [upgradeTimers, setUpgradeTimers] = useState<Record<string, number>>({});

  const totalMoney = cleanMoney + dirtyMoney;

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: Record<string, number> = {};
      Object.keys(respeitSkills).forEach((skillId) => {
        const remaining = respeitGetRemainingTime(skillId);
        if (remaining > 0) {
          newTimers[skillId] = remaining;
        } else if (respeitSkills[skillId].upgrading && remaining <= 0) {
          respeitFinalizeUpgrade(skillId);
        }
      });
      setUpgradeTimers(newTimers);
    }, 100);

    return () => clearInterval(interval);
  }, [respeitSkills, respeitGetRemainingTime, respeitFinalizeUpgrade]);

  const handleStartUpgrade = (skillId: string) => {
    const result = respeitStartUpgrade(skillId, totalMoney);
    if (result.success) {
      setSelectedSkill(skillId);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getCost = (skillId: string) => {
    const skill = respeitSkills[skillId];
    return Math.ceil(skill.baseCost * Math.pow(skill.level + 1, 1.8));
  };

  const getDuration = (skillId: string) => {
    const skill = respeitSkills[skillId];
    return Math.ceil(skill.baseTime * Math.pow(skill.level + 1, 1.5));
  };

  const totalRespect = getRespectBonus();
  const skillOrder = ['respeito_1', 'respeito_2', 'respeito_3', 'respeito_4', 'respeito_5'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-orange-400">Árvore de Respeito</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-400">{totalRespect}</div>
          <p className="text-xs text-gray-400">Nível Total</p>
        </div>
      </div>

      {skillOrder.map((skillId, index) => {
        const skill = respeitSkills[skillId];
        const cost = getCost(skillId);
        const duration = getDuration(skillId);
        const remainingTime = upgradeTimers[skillId] || 0;
        const canUpgradeSkill = respeitCanUpgrade(skillId, totalMoney);
        const progress = getSkillProgress(skillId);

        const isLocked = skill.requires && skill.requires.length > 0 && !canUpgradeSkill && skill.level === 0;

        return (
          <motion.div
            key={skillId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedSkill(selectedSkill === skillId ? null : skillId)}
            className="cursor-pointer"
          >
            <Card
              className={`bg-gradient-to-r p-6 border-2 transition-all ${
                selectedSkill === skillId
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/50'
                  : isLocked
                    ? 'border-gray-600 opacity-60'
                    : 'border-orange-500/50 hover:border-orange-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {index === 0 && '🏘️'}
                    {index === 1 && '👥'}
                    {index === 2 && '🕸️'}
                    {index === 3 && '👑'}
                    {index === 4 && '⚡'}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-400">
                      Nível {skill.level} / {skill.maxLevel}
                    </p>
                  </div>
                </div>

                {isLocked && <Lock className="w-6 h-6 text-gray-500" />}
                {!isLocked && skill.level === skill.maxLevel && (
                  <div className="text-2xl">✅</div>
                )}
                {!isLocked && skill.level < skill.maxLevel && (
                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${
                      selectedSkill === skillId ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedSkill === skillId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-slate-600 space-y-4"
                >
                  {/* Description */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Descrição:</p>
                    <p className="text-white">
                      {skillId === 'respeito_1' &&
                        'Desbloqueia áreas iniciais e pequenos bônus de influência'}
                      {skillId === 'respeito_2' &&
                        'Libera NPCs locais e missões básicas'}
                      {skillId === 'respeito_3' &&
                        'Acesso a contatos estratégicos e operações melhores'}
                      {skillId === 'respeito_4' &&
                        'Libera novas regiões do mapa e bônus de autoridade'}
                      {skillId === 'respeito_5' &&
                        'Desbloqueio global de conteúdo avançado e bônus massivo de influência'}
                    </p>
                  </div>

                  {/* Upgrade Info */}
                  {skill.level < skill.maxLevel && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Custo do Próximo Upgrade</p>
                        <p className="text-xl font-bold text-orange-400">${cost.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Tempo de Upgrade</p>
                        <p className="text-xl font-bold text-cyan-400">{formatTime(duration)}</p>
                      </div>
                    </div>
                  )}

                  {/* Upgrade Status */}
                  {skill.upgrading && remainingTime > 0 && (
                    <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <p className="text-sm text-blue-400">Upgrade em Progresso</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-300">{formatTime(remainingTime)}</p>
                      <div className="w-full bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${100 - (remainingTime / getDuration(skillId)) * 100}%`,
                          }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {skill.level < skill.maxLevel && !skill.upgrading && (
                      <Button
                        onClick={() => handleStartUpgrade(skillId)}
                        disabled={!canUpgradeSkill}
                        className={`flex-1 ${
                          canUpgradeSkill
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                            : 'bg-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {canUpgradeSkill ? 'Iniciar Upgrade' : 'Requisitos Não Atendidos'}
                      </Button>
                    )}

                    {skill.level === skill.maxLevel && (
                      <Button disabled className="flex-1 bg-gray-600">
                        Nível Máximo Atingido
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function InvestmentSkillTreePage() {
  const { playerMoney, resetSkills } = useSkillTreeStore();
  const { getRespectBonus } = useRespeitSkillTreeStore();
  const { getAgilityBonus } = useAgilitySkillTreeStore();
  const { getAttackBonus } = useAttackSkillTreeStore();
  const { getDefenseBonus } = useDefenseSkillTreeStore();
  const { getVigorStats } = useVigorSkillTreeStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle wheel zoom
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const categories = [
    { key: 'inteligencia', label: 'Inteligência', icon: Brain, color: '#3b82f6', glow: '#60a5fa' },
    { key: 'agilidade', label: 'Agilidade', icon: Zap, color: '#ea580c', glow: '#fb923c' },
    { key: 'ataque', label: 'Ataque', icon: Sword, color: '#dc2626', glow: '#ef4444' },
    { key: 'defesa', label: 'Defesa', icon: Shield, color: '#14b8a6', glow: '#2dd4bf' },
    { key: 'respeito', label: 'Respeito', icon: Crown, color: '#d97706', glow: '#fbbf24' },
    { key: 'vigor', label: 'Vigor', icon: Heart, color: '#a855f7', glow: '#d8b4fe' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Cinematographic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-black to-slate-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-900/20 rounded-full blur-3xl" />
        </div>
        {/* Animated particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Header />

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        {/* Top Section - Title and Stats */}
        <div className="px-6 py-8 border-b border-yellow-900/30">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[100rem] mx-auto"
          >
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent font-heading">
              DOMÍNIO DO COMANDO
            </h1>
            <p className="text-yellow-200/60 text-lg mb-6">Árvore de Progressão Criminal - Mapa Estratégico</p>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-600/50 rounded-lg p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-yellow-300/70 text-xs font-semibold mb-1">CAPITAL</p>
                <p className="text-2xl font-bold text-yellow-400">${playerMoney.toLocaleString()}</p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-600/50 rounded-lg p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-orange-300/70 text-xs font-semibold mb-1">RESPEITO</p>
                <p className="text-2xl font-bold text-orange-400">{getRespectBonus()}</p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-600/50 rounded-lg p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-purple-300/70 text-xs font-semibold mb-1">ENERGIA</p>
                <p className="text-2xl font-bold text-purple-400">{Math.floor(getVigorStats().maxEnergy)}</p>
              </motion.div>

              <motion.button
                onClick={resetSkills}
                className="bg-gradient-to-br from-red-900/40 to-red-950/40 border border-red-600/50 rounded-lg p-4 hover:from-red-800/50 hover:to-red-900/50 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-red-300/70 text-xs font-semibold mb-1">AÇÃO</p>
                <p className="text-lg font-bold text-red-400">RESETAR</p>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Skill Tree Canvas */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto relative"
          style={{
            background: 'radial-gradient(circle at center, rgba(30,30,30,0.5) 0%, rgba(0,0,0,0.8) 100%)',
          }}
        >
          <motion.div
            className="w-full h-full min-h-screen flex items-center justify-center p-8"
            style={{ scale, x: pan.x, y: pan.y }}
          >
            <div className="relative w-full max-w-6xl">
              {/* Central Node - PEQUENOS ESQUEMAS */}
              <div className="flex justify-center mb-20">
                <CinematicNode
                  id="start"
                  name="PEQUENOS ESQUEMAS"
                  isLocked={false}
                  isCompleted={false}
                  isAvailable={true}
                  icon={<Flame size={40} className="text-yellow-300" />}
                  color="#fbbf24"
                  glowColor="#fcd34d"
                  onClick={() => {}}
                  size="large"
                />
              </div>

              {/* Category Nodes - Second Layer */}
              <div className="flex justify-center gap-12 mb-20 flex-wrap">
                {categories.map((cat, idx) => {
                  const IconComponent = cat.icon;
                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CinematicNode
                        id={cat.key}
                        name={cat.label}
                        isLocked={false}
                        isCompleted={false}
                        isAvailable={true}
                        icon={<IconComponent size={32} className="text-white" />}
                        color={cat.color}
                        glowColor={cat.glow}
                        onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
                        size="medium"
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Respect Tree - Third Layer */}
              {selectedCategory === 'respeito' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto"
                >
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-orange-400 font-heading">ÁRVORE DE RESPEITO</h2>
                    <p className="text-orange-300/60 text-sm">Reputação e Influência Criminal</p>
                  </div>

                  <RespeitSkillSection />
                </motion.div>
              )}

              {/* Other Categories - Collapsed View */}
              {selectedCategory !== 'respeito' && selectedCategory && (
                <div className="text-center text-gray-400 text-sm">
                  <p>Categoria em desenvolvimento...</p>
                </div>
              )}

              {!selectedCategory && (
                <div className="text-center text-gray-400 text-sm">
                  <p>Clique em uma categoria para expandir a árvore de habilidades</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
