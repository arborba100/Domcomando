import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-700/50 mt-20 py-12">
      <div className="max-w-[120rem] mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-foreground">
              COMPLEXO
            </h3>
            <p className="font-paragraph text-sm text-foreground/70">
              Jogo multiplayer estratégico com economia dinâmica.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-heading text-sm font-bold text-secondary uppercase">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-paragraph text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className="font-paragraph text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Perfil
                </Link>
              </li>
              <li>
                <Link to="/star-map" className="font-paragraph text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Mapa
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Game Modes */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-heading text-sm font-bold text-secondary uppercase">
              Modos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/giro-no-asfalto" className="font-paragraph text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Giro no Asfalto
                </Link>
              </li>
              <li>
                <Link to="/luxury-showroom" className="font-paragraph text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Showroom de Luxo
                </Link>
              </li>
              <li>
                <Link to="/barraco" className="font-paragraph text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Barraco
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-heading text-sm font-bold text-secondary uppercase">
              Informações
            </h4>
            <p className="font-paragraph text-xs text-foreground/70">
              © 2026 COMPLEXO. Todos os direitos reservados.
            </p>
            <p className="font-paragraph text-xs text-foreground/50">
              Versão 1.0 - Multiplayer
            </p>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-slate-700/30 pt-8">
          <p className="font-paragraph text-xs text-center text-foreground/50">
            Desenvolvido com estratégia e ousadia
          </p>
        </div>
      </div>
    </footer>
  );
}
