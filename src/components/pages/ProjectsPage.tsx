import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Zap, Users, Target, Trophy } from 'lucide-react';

export default function ProjectsPage() {
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

  const projects = [
    {
      id: 1,
      title: 'Giro no Asfalto',
      description: 'Domina as ruas da cidade com estratégia e coragem. Construa sua reputação nas favelas.',
      icon: Zap,
      route: '/giro-no-asfalto',
      color: 'from-logo-gradient-start to-logo-gradient-end',
    },
    {
      id: 2,
      title: 'Luxury Showroom',
      description: 'Exiba seu poder através do luxo. Colecione os carros mais exclusivos e impressione.',
      icon: Trophy,
      route: '/luxury-showroom',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 3,
      title: 'Luxo 1',
      description: 'Acesso exclusivo ao primeiro nível de luxo. Onde começa a verdadeira riqueza.',
      icon: Target,
      route: '/luxo-1',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 4,
      title: 'Casa',
      description: 'Construa seu império imobiliário. Invista em propriedades e aumente sua fortuna.',
      icon: Users,
      route: '/casa',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 5,
      title: 'Barraco',
      description: 'Comece do zero nas ruas. Prove que você tem o que é preciso para subir.',
      icon: Zap,
      route: '/barraco',
      color: 'from-red-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-4 py-8 pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4" style={{
              textShadow: '0 0 20px rgba(0,234,255,0.5)'
            }}>
              Projetos
            </h1>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              Explore os diferentes caminhos para dominar o submundo. Cada projeto oferece uma experiência única de poder e estratégia.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => {
              const IconComponent = project.icon;
              return (
                <motion.a
                  key={project.id}
                  href={project.route}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-lg border border-secondary/30 hover:border-secondary/60 transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'rgba(15,20,30,0.6)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative p-8 flex flex-col h-full">
                    {/* Icon */}
                    <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/40 group-hover:to-secondary/20 transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-secondary group-hover:text-secondary/80 transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="font-paragraph text-sm text-foreground/70 mb-6 flex-grow">
                      {project.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-secondary text-sm font-paragraph font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>Explorar</span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>

                  {/* Border Glow on Hover */}
                  <div className="absolute inset-0 rounded-lg border border-secondary/0 group-hover:border-secondary/30 transition-all duration-300 pointer-events-none" style={{
                    boxShadow: 'inset 0 0 20px rgba(0,234,255,0), 0 0 20px rgba(0,234,255,0) group-hover:inset 0 0 20px rgba(0,234,255,0.1) group-hover:0 0 20px rgba(0,234,255,0.2)'
                  }} />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20 pt-16 border-t border-secondary/20"
          >
            <motion.h2 variants={itemVariants} className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Por que escolher nossos projetos?
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { title: 'Imersão Total', description: 'Experiência cinematográfica em cada detalhe' },
                { title: 'Estratégia Profunda', description: 'Decisões que realmente importam' },
                { title: 'Comunidade Ativa', description: 'Conecte-se com outros jogadores' },
                { title: 'Progressão Contínua', description: 'Sempre há algo novo para conquistar' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-6 rounded-lg border border-secondary/20 hover:border-secondary/50 transition-all duration-300"
                  style={{
                    background: 'rgba(15,20,30,0.4)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <h4 className="font-heading text-lg font-bold text-secondary mb-2">
                    {feature.title}
                  </h4>
                  <p className="font-paragraph text-sm text-foreground/70">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
