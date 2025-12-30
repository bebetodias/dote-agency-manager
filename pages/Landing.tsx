import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '../components/UI';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge variant="red">Agência Dote</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 max-w-4xl mx-auto">
            Impulsione sua Marca com <span className="text-primary">Criatividade</span> e Estratégia
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Somos uma agência full-service focada em resultados reais. Do branding à performance, conectamos sua empresa ao futuro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primaryDark transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2"
            >
                Comece seu Projeto <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 rounded-full font-semibold text-lg text-gray-700 hover:bg-gray-100 transition-all">
              Ver Portfólio
            </button>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-red-100 to-transparent rounded-full opacity-50 blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-primary mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold">Criação Ágil</h3>
              <p className="text-gray-400 leading-relaxed">Design e redação integrados para entregar campanhas impactantes em tempo recorde.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-primary mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold">Performance Digital</h3>
              <p className="text-gray-400 leading-relaxed">Gestão de tráfego pago e SEO focados em ROI e conversão qualificada.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-primary mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold">Consultoria Completa</h3>
              <p className="text-gray-400 leading-relaxed">Planejamento estratégico que vai além do marketing, ajudando seu negócio a escalar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-bold tracking-tight">Dote.</span>
          <div className="text-sm text-gray-500">
            © 2024 Agência Dote. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};