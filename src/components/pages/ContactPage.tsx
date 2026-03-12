import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1000);
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
              Entre em Contato
            </h1>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              Tem dúvidas, sugestões ou quer reportar um problema? Estamos aqui para ajudar!
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6 flex flex-col items-center text-center">
              <Mail className="w-12 h-12 text-secondary mb-4" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">Email</h3>
              <p className="font-paragraph text-foreground/80">
                <a href="mailto:contato@dominio.com" className="hover:text-secondary transition-colors">
                  contato@dominio.com
                </a>
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6 flex flex-col items-center text-center">
              <Phone className="w-12 h-12 text-secondary mb-4" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">Telefone</h3>
              <p className="font-paragraph text-foreground/80">
                <a href="tel:+5511999999999" className="hover:text-secondary transition-colors">
                  +55 (11) 9999-9999
                </a>
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-6 flex flex-col items-center text-center">
              <MapPin className="w-12 h-12 text-secondary mb-4" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">Localização</h3>
              <p className="font-paragraph text-foreground/80">
                São Paulo, Brasil
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="bg-background/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-8 max-w-2xl mx-auto w-full">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Envie uma Mensagem</h2>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="font-paragraph text-green-400">{submitMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-heading text-sm font-bold text-foreground mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-secondary/30 rounded-lg text-foreground font-paragraph focus:outline-none focus:border-secondary transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-heading text-sm font-bold text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-secondary/30 rounded-lg text-foreground font-paragraph focus:outline-none focus:border-secondary transition-colors"
                  placeholder="seu.email@exemplo.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block font-heading text-sm font-bold text-foreground mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-secondary/30 rounded-lg text-foreground font-paragraph focus:outline-none focus:border-secondary transition-colors"
                  placeholder="Assunto da mensagem"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-heading text-sm font-bold text-foreground mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-background/50 border border-secondary/30 rounded-lg text-foreground font-paragraph focus:outline-none focus:border-secondary transition-colors resize-none"
                  placeholder="Sua mensagem aqui..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-logo-gradient-start to-logo-gradient-end text-white font-heading font-bold rounded-lg hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-logo-gradient-start/20 to-logo-gradient-end/20 border border-logo-gradient-start/50 rounded-lg p-8">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-secondary mb-2">Qual é o tempo de resposta?</h3>
                <p className="font-paragraph text-foreground/80">
                  Respondemos a todas as mensagens dentro de 24 horas durante dias úteis.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-secondary mb-2">Como reportar um bug?</h3>
                <p className="font-paragraph text-foreground/80">
                  Use o formulário acima com o assunto "Reportar Bug" e descreva o problema em detalhes.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-secondary mb-2">Posso sugerir novas funcionalidades?</h3>
                <p className="font-paragraph text-foreground/80">
                  Sim! Adoramos ouvir sugestões. Envie-as através do formulário com o assunto "Sugestão".
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
