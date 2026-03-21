import React, { useState } from 'react';
import { useSkillTreeStore } from '@/store/skillTreeStore';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SkillNodeComponent: React.FC<{
  node: any;
  treeId: string;
  onUpgrade: (treeId: string, nodeId: string) => void;
  canUpgrade: boolean;
}> = ({ node, treeId, onUpgrade, canUpgrade }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNodeColor = () => {
    if (node.isLocked) return 'from-gray-700 to-gray-800';
    if (node.level >= node.maxLevel) return 'from-yellow-500 to-yellow-600';
    if (node.isAvailable) return 'from-orange-500 to-orange-600';
    return 'from-gray-600 to-gray-700';
  };

  const getStateLabel = () => {
    if (node.isLocked) return 'Bloqueado';
    if (node.level >= node.maxLevel) return 'Máximo';
    if (node.isAvailable) return 'Disponível';
    return 'Indisponível';
  };

  return (
    <motion.div
      className="relative mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection line to parent */}
      {node.parentId && (
        <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-orange-500 to-transparent transform -translate-x-1/2" />
      )}

      {/* Node container */}
      <div className={`bg-gradient-to-br ${getNodeColor()} rounded-lg p-4 border-2 ${
        node.isLocked ? 'border-gray-600' : 'border-orange-400'
      } cursor-pointer transition-all duration-300 ${
        isHovered && !node.isLocked ? 'shadow-lg shadow-orange-500/50 scale-105' : ''
      }`}>
        {/* Icon and name */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{node.icon}</span>
          <div className="flex-1">
            <h3 className="font-heading text-lg text-white font-bold">{node.name}</h3>
            <p className="text-xs text-gray-300">{getStateLabel()}</p>
          </div>
        </div>

        {/* Level indicator */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-paragraph text-gray-200">Nível</span>
            <span className="text-sm font-bold text-orange-300">{node.level}/{node.maxLevel}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${(node.level / node.maxLevel) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 mb-3 font-paragraph">{node.description}</p>

        {/* Upgrade button */}
        {!node.isLocked && node.level < node.maxLevel && (
          <button
            onClick={() => onUpgrade(treeId, node.id)}
            disabled={!canUpgrade}
            className={`w-full py-2 rounded font-heading text-sm font-bold transition-all duration-300 ${
              canUpgrade
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-lg hover:shadow-orange-500/50 cursor-pointer'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Upgrade ({node.cost} pts)
          </button>
        )}

        {node.level >= node.maxLevel && (
          <div className="w-full py-2 rounded font-heading text-sm font-bold text-center bg-yellow-600 text-white">
            Máximo Alcançado
          </div>
        )}

        {node.isLocked && (
          <div className="w-full py-2 rounded font-heading text-sm font-bold text-center bg-gray-700 text-gray-400">
            Desbloqueie a habilidade anterior
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SkillTreeSection: React.FC<{ tree: any; onUpgrade: (treeId: string, nodeId: string) => void; playerPoints: number }> = ({
  tree,
  onUpgrade,
  playerPoints,
}) => {
  const getAttributeColor = (attribute: string) => {
    const colors: Record<string, string> = {
      inteligencia: 'from-blue-600 to-blue-700',
      agilidade: 'from-green-600 to-green-700',
      ataque: 'from-red-600 to-red-700',
      defesa: 'from-purple-600 to-purple-700',
      respeito: 'from-yellow-600 to-yellow-700',
      vigor: 'from-pink-600 to-pink-700',
    };
    return colors[attribute] || 'from-gray-600 to-gray-700';
  };

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tree header */}
      <div className={`bg-gradient-to-r ${getAttributeColor(tree.attribute)} rounded-lg p-4 mb-6 border-2 border-opacity-50 border-white`}>
        <h2 className="font-heading text-2xl font-bold text-white mb-1">{tree.name}</h2>
        <p className="text-sm text-gray-200 font-paragraph">Pontos investidos: {tree.totalPoints}</p>
      </div>

      {/* Nodes container */}
      <div className="space-y-4 pl-4 border-l-2 border-orange-500 border-opacity-30">
        {tree.nodes.map((node: any) => (
          <SkillNodeComponent
            key={node.id}
            node={node}
            treeId={tree.id}
            onUpgrade={onUpgrade}
            canUpgrade={playerPoints >= node.cost && node.isAvailable && node.level < node.maxLevel}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default function InvestmentSkillTreePage() {
  const { skillTrees, playerPoints, upgradeSkill } = useSkillTreeStore();
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);

  const handleUpgrade = (treeId: string, nodeId: string) => {
    upgradeSkill(treeId, nodeId);
  };

  const attributes = [
    { id: 'inteligencia', name: 'Inteligência', icon: '🧠', color: 'from-blue-600 to-blue-700' },
    { id: 'agilidade', name: 'Agilidade', icon: '⚡', color: 'from-green-600 to-green-700' },
    { id: 'ataque', name: 'Ataque', icon: '👊', color: 'from-red-600 to-red-700' },
    { id: 'defesa', name: 'Defesa', icon: '🛡️', color: 'from-purple-600 to-purple-700' },
    { id: 'respeito', name: 'Respeito', icon: '👑', color: 'from-yellow-600 to-yellow-700' },
    { id: 'vigor', name: 'Vigor', icon: '💪', color: 'from-pink-600 to-pink-700' },
  ];

  const filteredTrees = selectedAttribute
    ? skillTrees.filter(t => t.attribute === selectedAttribute)
    : skillTrees;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23000%22 width=%22100%22 height=%22100%22/><circle cx=%2250%22 cy=%2250%22 r=%2230%22 fill=%22%23333%22/></svg>')] bg-repeat" />
      </div>

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-10 pointer-events-none" />

      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Page header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 mb-4">
            Árvore de Habilidades
          </h1>
          <p className="font-paragraph text-gray-300 text-lg mb-6">
            Invista seus pontos para desenvolver suas habilidades criminosas
          </p>

          {/* Points display */}
          <motion.div
            className="inline-block bg-gradient-to-r from-orange-600 to-yellow-600 rounded-lg px-6 py-3 border-2 border-orange-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="font-heading text-2xl font-bold text-white">
              Pontos Disponíveis: <span className="text-yellow-300">{playerPoints}</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Attribute filter tabs */}
        <motion.div
          className="mb-12 flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => setSelectedAttribute(null)}
            className={`px-6 py-2 rounded-lg font-heading font-bold transition-all duration-300 ${
              selectedAttribute === null
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Todas
          </button>
          {attributes.map(attr => (
            <button
              key={attr.id}
              onClick={() => setSelectedAttribute(attr.id)}
              className={`px-6 py-2 rounded-lg font-heading font-bold transition-all duration-300 flex items-center gap-2 ${
                selectedAttribute === attr.id
                  ? `bg-gradient-to-r ${attr.color} text-white shadow-lg`
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{attr.icon}</span>
              {attr.name}
            </button>
          ))}
        </motion.div>

        {/* Skill trees */}
        <div className="space-y-8">
          {filteredTrees.map(tree => (
            <SkillTreeSection
              key={tree.id}
              tree={tree}
              onUpgrade={handleUpgrade}
              playerPoints={playerPoints}
            />
          ))}
        </div>

        {/* Info section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border-2 border-orange-500 border-opacity-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-heading text-xl font-bold text-orange-400 mb-3">💡 Dicas</h3>
          <ul className="space-y-2 font-paragraph text-gray-300">
            <li>• Desbloqueie habilidades filhas ao atingir nível 1 na habilidade pai</li>
            <li>• Cada habilidade pode ser melhorada até o nível máximo</li>
            <li>• Escolha sua estratégia: foco em uma árvore ou desenvolvimento equilibrado</li>
            <li>• Ganhe mais pontos completando missões e operações</li>
          </ul>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
