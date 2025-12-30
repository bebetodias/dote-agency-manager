import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, PenTool } from 'lucide-react';
import { Button } from '../components/UI';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de autenticação com delay para feedback visual
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      {/* Lado Esquerdo - Branding & Hero */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 xl:p-24 bg-[#f8f6f6] z-10">
        {/* Logo Branding */}
        <div className="flex items-center gap-3 mb-12 lg:mb-0 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 bg-[#DC2626] rounded-xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
            <PenTool size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-[#1b0e0e] tracking-tighter text-3xl font-black leading-none uppercase">Dote</h1>
        </div>

        {/* Hero Content Principal */}
        <div className="flex flex-col justify-center flex-grow py-12 lg:py-0">
          <div className="max-w-xl animate-in fade-in slide-in-from-left duration-1000">
            <h2 className="text-[#1b0e0e] tracking-tight text-5xl md:text-7xl font-black leading-[1] mb-10">
              O que é preciso fazer. <span className="text-[#DC2626]">Bem-feito.</span>
            </h2>
            <div className="border-l-[6px] border-[#DC2626] pl-8">
              <p className="text-gray-500 text-xl md:text-2xl font-semibold leading-relaxed max-w-md opacity-80">
                Agência de Branding, Design e Estratégia. Transformando ideias em marcas memoráveis.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé Institucional */}
        <div className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] animate-in fade-in duration-700">
          © 2024 Dote Agency. All rights reserved.
        </div>

        {/* Elemento Decorativo de Fundo (Aura Vermelha) */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      </div>

      {/* Lado Direito - Interface de Login */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-6 sm:p-12 lg:p-24 z-20">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Cabeçalho do Formulário */}
          <div className="mb-14">
            <h3 className="text-[#1b0e0e] text-4xl md:text-5xl font-black leading-tight tracking-tighter mb-4 uppercase">Acesse sua conta</h3>
            <p className="text-gray-400 font-bold text-lg tracking-tight">Bem-vindo de volta! Por favor, insira seus dados.</p>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campo Email */}
            <div className="space-y-3">
              <label className="block text-[#1b0e0e] text-xs font-black uppercase tracking-[0.15em]" htmlFor="email">
                Email
              </label>
              <div className="relative group">
                <input 
                  id="email"
                  className="flex w-full rounded-2xl border-2 border-gray-50 bg-[#f9fafb] text-gray-900 px-6 py-5 pl-14 text-sm font-bold focus:outline-none focus:border-[#DC2626] focus:bg-white transition-all duration-300 placeholder:text-gray-300 shadow-sm group-hover:border-gray-100"
                  placeholder="exemplo@dote.com.br" 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#DC2626] transition-colors">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-[#1b0e0e] text-xs font-black uppercase tracking-[0.15em]" htmlFor="password">
                  Senha
                </label>
                <button type="button" className="text-[10px] font-black text-[#DC2626] uppercase tracking-widest hover:underline transition-all">
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative group">
                <input 
                  id="password"
                  className="flex w-full rounded-2xl border-2 border-gray-50 bg-[#f9fafb] text-gray-900 px-6 py-5 pl-14 text-sm font-bold focus:outline-none focus:border-[#DC2626] focus:bg-white transition-all duration-300 placeholder:text-gray-300 shadow-sm group-hover:border-gray-100"
                  placeholder="••••••••" 
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#DC2626] transition-colors">
                  <Lock size={20} />
                </div>
              </div>
            </div>

            {/* Botão de Ação Principal */}
            <button 
              className="w-full h-[72px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-black uppercase tracking-[0.25em] rounded-2xl shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 transform active:scale-[0.97] flex items-center justify-center gap-4 group" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Rodapé do Formulário */}
          <div className="mt-14 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Não tem uma conta?{' '}
              <button 
                onClick={() => navigate('/landing')}
                className="font-black text-[#1b0e0e] hover:text-[#DC2626] transition-colors border-b-2 border-transparent hover:border-[#DC2626]"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Overlay de Textura Sutil (Background) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] -z-10" />
    </div>
  );
};
