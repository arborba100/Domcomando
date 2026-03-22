import React, { useState, useRef, useEffect } from 'react';
import { useSkillTreeStore, SkillNode } from '@/store/skillTreeStore';
import { useAgilitySkillTreeStore } from '@/store/agilitySkillTreeStore';
import { useAttackSkillTreeStore } from '@/store/attackSkillTreeStore';
import { useDefenseSkillTreeStore } from '@/store/defenseSkillTreeStore';
import { useRespeitSkillTreeStore } from '@/store/respeitSkillTreeStore';
import { useVigorSkillTreeStore } from '@/store/vigorSkillTreeStore';
import { useIntelligenceSkillTreeStore } from '@/store/intelligenceSkillTreeStore';
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
} from 'lucide-react';

const TREE_COLORS = {
  inteligencia: { bg: '#1e3a8a', border: '#3b82f6', glow: '#60a5fa', icon: Brain },
  agilidade: { bg: '#7c2d12', border: '#ea580c', glow: '#fb923c', icon: Zap },
  ataque: { bg: '#7c1d1d', border: '#dc2626', glow: '#ef4444', icon: Sword },
  defesa: { bg: '#1e3a3a', border: '#14b8a6', glow: '#2dd4bf', icon: Shield },
  respeito: { bg: '#3f2d1f', border: '#d97706', glow: '#fbbf24', icon: Crown },
  vigor: { bg: '#2d1f3f', border: '#a855f7', glow: '#d8b4fe', icon: Heart },
};

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Brain,
  Ear,
  Cpu,
  Zap,
  Gauge,
  Sword,
  Flame,
  Target,
  Shield,
  Lock,
  Crown,
  Users,
  Heart,
};

interface SkillNodeProps {
  skill: SkillNode;
  canUpgrade: boolean;
  onUpgrade: (skillId: string) => void;
  isUpgrading: boolean;
  treeColor: (typeof TREE_COLORS)[keyof typeof TREE_COLORS];
}

const SkillNodeComponent: React.FC<SkillNodeProps> = (
  {
    skill,
    canUpgrade,
    onUpgrade,
    isUpgrading,
    treeColor,
  }
) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isLocked = !canUpgrade && skill.level === 0;
  const isCompleted = skill.level >= skill.maxLevel;
  const isAvailable = canUpgrade && !isCompleted;

  const getStateColor = () => {
    if (isCompleted) return 'from-green-500 to-green-600';
    if (isAvailable) return `from-${treeColor.border} to-${treeColor.glow}`;
    return 'from-gray-600 to-gray-700';
  };

  const IconComponent = ICON_MAP[skill.icon] || Brain;

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="relative"
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
      >
        <div
          className={`relative w-24 h-24 rounded-lg cursor-pointer transition-all duration-300 ${
            isLocked ? 'cursor-not-allowed opacity-60' : ''
          }`}
          style={{
            background: isCompleted
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : isAvailable
                ? `linear-gradient(135deg, ${treeColor.border} 0%, ${treeColor.glow} 100%)`
                : 'linear-gradient(135deg, #4b5563 0%, #2d3748 100%)',
            boxShadow: isCompleted
              ? '0 0 20px rgba(16, 185, 129, 0.6)'
              : isAvailable
                ? `0 0 20px ${treeColor.glow}80`
                : '0 0 10px rgba(0, 0, 0, 0.5)',
            border: `2px solid ${
              isCompleted ? '#10b981' : isAvailable ? treeColor.border : '#4b5563'
            }`,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => {
            if (canUpgrade && !isCompleted) {
              onUpgrade(skill.id);
            }
          }}
        >
          <div className="flex items-center justify-center w-full h-full">
            <IconComponent
              size={32}
              className={`${
                isCompleted ? 'text-white' : isAvailable ? 'text-white' : 'text-gray-400'
              }`}
            />
          </div>

          {isLocked && (
            <div className="absolute top-1 right-1 bg-red-600 rounded-full p-1">
              <Lock size={12} className="text-white" />
            </div>
          )}

          {isCompleted && (
            <div className="absolute top-1 right-1 bg-green-600 rounded-full p-1">
              <Check size={12} className="text-white" />
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-2 text-center">
        <p className="text-xs font-bold text-white truncate w-24">{skill.name}</p>
        <p
          className="text-xs font-semibold"
          style={{
            color: isCompleted ? '#10b981' : isAvailable ? treeColor.glow : '#9ca3af',
          }}
        >
          {skill.level}/{skill.maxLevel}
        </p>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50 w-48 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg"
          >
            <p className="text-xs font-bold text-white mb-1">{skill.name}</p>
            <p className="text-xs text-gray-300 mb-2">{skill.description}</p>

            {!isCompleted && (
              <div className="text-xs text-yellow-400 font-semibold mb-2">
                Custo: ${(skill.baseCost * (skill.level + 1)).toLocaleString()}
              </div>
            )}

            {skill.requires && skill.requires.length > 0 && (
              <div className="text-xs text-orange-400 mb-2">
                <p className="font-semibold">Requer:</p>
                {skill.requires.map((req) => (
                  <p key={req} className="text-orange-300">
                    • {req}
                  </p>
                ))}
              </div>
            )}

            {isCompleted && (
              <div className="text-xs text-green-400 font-semibold">✓ Completo</div>
            )}

            {isLocked && (
              <div className="text-xs text-red-400 font-semibold flex items-center gap-1">
                <AlertCircle size={12} />
                Bloqueado
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SkillTreeProps {
  treeKey: keyof typeof TREE_COLORS;
  title: string;
}

const SkillTree: React.FC<SkillTreeProps> = ({ treeKey, title }) => {
  const {
    skills,
    getSkillsByTree,
    canUpgradeSkill,
    upgradeSkill,
    isUpgrading,
  } = useSkillTreeStore();

  const treeSkills = getSkillsByTree(treeKey);
  const treeColor = TREE_COLORS[treeKey];

  const handleUpgrade = (skillId: string) => {
    upgradeSkill(skillId);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-gradient-to-b from-gray-900 to-black rounded-lg border border-gray-800">
      <div className="text-center">
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: treeColor.glow }}
        >
          {title}
        </h3>
        <div
          className="h-1 w-12 mx-auto rounded"
          style={{ backgroundColor: treeColor.glow }}
        />
      </div>

      <div className="flex flex-col gap-12 w-full">
        {treeSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            {index > 0 && (
              <div
                className="h-8 w-1 mb-4"
                style={{
                  background: `linear-gradient(180deg, ${treeColor.glow}80 0%, ${treeColor.glow}20 100%)`,
                }}
              />
            )}

            <SkillNodeComponent
              skill={skill}
              canUpgrade={canUpgradeSkill(skill.id)}
              onUpgrade={handleUpgrade}
              isUpgrading={isUpgrading}
              treeColor={treeColor}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ... keep existing code (AgilitySkillSection, DefenseSkillSection, VigorSkillSection, IntelligenceSkillSection, AttackSkillSection) ...

// Respect Skill Component
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

// ... keep existing code (AgilitySkillSection, DefenseSkillSection, VigorSkillSection, IntelligenceSkillSection, AttackSkillSection) ...

export default function InvestmentSkillTreePage() {
  const { playerMoney, resetSkills } = useSkillTreeStore();
  const [expandedTrees, setExpandedTrees] = useState<Record<string, boolean>>({
    inteligencia: false,
    agilidade: true,
    ataque: true,
    defesa: true,
    respeito: true,
    vigor: true,
  });

  const toggleTree = (tree: string) => {
    setExpandedTrees((prev) => ({
      ...prev,
      [tree]: !prev[tree],
    }));
  };

  const treeLabels = {
    inteligencia: 'Inteligência',
    agilidade: 'Agilidade',
    ataque: 'Ataque',
    defesa: 'Defesa',
    respeito: 'Respeito',
    vigor: 'Vigor',
  };

  const AnimatePresence = ({ children }: any) => <>{children}</>;
  const ChevronRight = ({ className }: any) => <ChevronDown className={className} />;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[100rem] mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Centro de Investimento
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Desenvolva suas habilidades e domine o jogo. Cada upgrade aumenta suas capacidades.
          </p>

          {/* Player Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="bg-gradient-to-br from-yellow-900 to-yellow-950 border border-yellow-600 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-yellow-300 text-sm font-semibold mb-1">Dinheiro Disponível</p>
              <p className="text-3xl font-bold text-yellow-400">
                ${playerMoney.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-green-900 to-green-950 border border-green-600 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-green-300 text-sm font-semibold mb-1">Status</p>
              <p className="text-2xl font-bold text-green-400">Ativo</p>
            </motion.div>

            <motion.button
              onClick={resetSkills}
              className="bg-gradient-to-br from-red-900 to-red-950 border border-red-600 rounded-lg p-4 hover:from-red-800 hover:to-red-900 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-red-300 text-sm font-semibold mb-1">Ação</p>
              <p className="text-lg font-bold text-red-400">Resetar Árvore</p>
            </motion.button>
          </div>
        </div>

        {/* Skill Trees Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agilidade Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTree('agilidade')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                style={{
                  backgroundColor: `${TREE_COLORS['agilidade'].bg}20`,
                  borderBottom: expandedTrees['agilidade']
                    ? `2px solid ${TREE_COLORS['agilidade'].border}`
                    : 'none',
                }}
              >
                <span className="text-lg font-bold">Agilidade</span>
                {expandedTrees['agilidade'] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <AnimatePresence>
                {expandedTrees['agilidade'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {/* AgilitySkillSection component would go here */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Ataque Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTree('ataque')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                style={{
                  backgroundColor: `${TREE_COLORS['ataque'].bg}20`,
                  borderBottom: expandedTrees['ataque']
                    ? `2px solid ${TREE_COLORS['ataque'].border}`
                    : 'none',
                }}
              >
                <span className="text-lg font-bold">Ataque</span>
                {expandedTrees['ataque'] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <AnimatePresence>
                {expandedTrees['ataque'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {/* AttackSkillSection component would go here */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Defesa Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTree('defesa')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                style={{
                  backgroundColor: `${TREE_COLORS['defesa'].bg}20`,
                  borderBottom: expandedTrees['defesa']
                    ? `2px solid ${TREE_COLORS['defesa'].border}`
                    : 'none',
                }}
              >
                <span className="text-lg font-bold">Defesa</span>
                {expandedTrees['defesa'] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <AnimatePresence>
                {expandedTrees['defesa'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {/* DefenseSkillSection component would go here */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Respeito Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTree('respeito')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                style={{
                  backgroundColor: `${TREE_COLORS['respeito'].bg}20`,
                  borderBottom: expandedTrees['respeito']
                    ? `2px solid ${TREE_COLORS['respeito'].border}`
                    : 'none',
                }}
              >
                <span className="text-lg font-bold">Respeito</span>
                {expandedTrees['respeito'] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <AnimatePresence>
                {expandedTrees['respeito'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    <RespeitSkillSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Vigor Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTree('vigor')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                style={{
                  backgroundColor: `${TREE_COLORS['vigor'].bg}20`,
                  borderBottom: expandedTrees['vigor']
                    ? `2px solid ${TREE_COLORS['vigor'].border}`
                    : 'none',
                }}
              >
                <span className="text-lg font-bold">Vigor</span>
                {expandedTrees['vigor'] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <AnimatePresence>
                {expandedTrees['vigor'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {/* VigorSkillSection component would go here */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Inteligência Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTree('inteligencia')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                style={{
                  backgroundColor: `${TREE_COLORS['inteligencia'].bg}20`,
                  borderBottom: expandedTrees['inteligencia']
                    ? `2px solid ${TREE_COLORS['inteligencia'].border}`
                    : 'none',
                }}
              >
                <span className="text-lg font-bold">Inteligência</span>
                {expandedTrees['inteligencia'] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <AnimatePresence>
                {expandedTrees['inteligencia'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {/* IntelligenceSkillSection component would go here */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Como Funciona</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Estados das Habilidades</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-600" />
                  <span>Bloqueado - Requer pré-requisitos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span>Disponível - Pronto para upgrade</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span>Completo - Máximo nível atingido</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-orange-400 mb-3">Sistema de Custo</h3>
              <p className="text-sm text-gray-300 mb-3">
                Cada upgrade custa: <span className="text-yellow-400 font-bold">baseCost × (nível + 1)</span>
              </p>
              <p className="text-sm text-gray-300">
                Clique em uma habilidade para fazer upgrade se tiver dinheiro suficiente.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
