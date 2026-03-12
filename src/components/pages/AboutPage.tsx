import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-4 py-8 pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4" style={{
              textShadow: '0 0 20px rgba(0,234,255,0.5)'
            }}>
              Sobre Domínio do Comando
            </h1>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              Conheça a história e a visão por trás do jogo mais imersivo de estratégia urbana
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div variants={itemVariants} className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-8">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Nossa História</h2>
            <p className="font-paragraph text-foreground/80 leading-relaxed mb-4">
              Domínio do Comando nasceu da paixão por criar experiências de jogo imersivas que desafiam os jogadores a tomar decisões estratégicas em um mundo urbano complexo e dinâmico.
            </p>
            <p className="font-paragraph text-foreground/80 leading-relaxed">
              Cada elemento do jogo foi cuidadosamente desenvolvido para oferecer uma experiência única, onde suas escolhas realmente importam e moldam seu caminho para o sucesso.
            </p>
          </motion.div>

          {/* Features Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
              <h3 className="font-heading text-xl font-bold text-secondary mb-3">Estratégia Profunda</h3>
              <p className="font-paragraph text-foreground/80">
                Tome decisões estratégicas que afetam seu progresso e reputação na cidade.
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
              <h3 className="font-heading text-xl font-bold text-secondary mb-3">Mundo Dinâmico</h3>
              <p className="font-paragraph text-foreground/80">
                Explore uma cidade viva com múltiplos locais, cada um oferecendo oportunidades únicas.
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
              <h3 className="font-heading text-xl font-bold text-secondary mb-3">Progressão Realista</h3>
              <p className="font-paragraph text-foreground/80">
                Suba de nível, ganhe reputação e desbloqueie novas áreas conforme você avança.
              </p>
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-logo-gradient-start/20 to-logo-gradient-end/20 border border-logo-gradient-start/50 rounded-lg p-8">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Nossa Missão</h2>
            <p className="font-paragraph text-foreground/80 leading-relaxed">
              Criar um ambiente de jogo onde a estratégia, a tomada de decisão e a progressão pessoal são recompensadas. Queremos que cada jogador sinta que suas ações têm peso e significado no mundo do jogo.
            </p>
          </motion.div>

          {/* Values Section */}
          <motion.div variants={itemVariants}>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold text-secondary mb-3">Inovação</h3>
                <p className="font-paragraph text-foreground/80">
                  Constantemente buscamos novas formas de melhorar a experiência do jogador e adicionar conteúdo fresco.
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold text-secondary mb-3">Comunidade</h3>
                <p className="font-paragraph text-foreground/80">
                  Valorizamos nossos jogadores e ouvimos seus feedbacks para criar uma comunidade vibrante.
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold text-secondary mb-3">Qualidade</h3>
                <p className="font-paragraph text-foreground/80">
                  Cada detalhe é polido para garantir uma experiência de jogo excepcional e imersiva.
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold text-secondary mb-3">Diversão</h3>
                <p className="font-paragraph text-foreground/80">
                  Acima de tudo, queremos que você se divirta e desfrute de cada momento no jogo.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
