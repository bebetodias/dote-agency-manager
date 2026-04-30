
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  Settings, 
  Menu,
  X,
  Camera
} from 'lucide-react';
import { MOCK_TEAM } from '../services/mockData';

// --- LANDING PAGE LAYOUT ---
export const LandingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: 'Início', id: '#home' },
    { label: 'Serviços', id: '#features' },
    { label: 'Sobre', id: '#' },
    { label: 'Contato', id: '#footer' },
  ];

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    
    if (id === '#' || id === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => {
              router.push('/landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl font-bold text-black tracking-tight bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity" 
          >
            Dote.
          </button>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((item) => (
              <button 
                key={item.label} 
                onClick={() => handleScrollTo(item.id)}
                className="text-gray-700 hover:text-primary transition-all duration-300 font-medium text-sm cursor-pointer bg-transparent border-none"
              >
                {item.label}
              </button>
            ))}
            <button 
                onClick={() => router.push('/login')}
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
                Login
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-24 px-6 md:hidden animate-in slide-in-from-top-10 duration-200">
           <nav className="flex flex-col gap-6 text-lg">
            {navLinks.map((item) => (
              <button 
                key={item.label} 
                onClick={() => handleScrollTo(item.id)}
                className="font-semibold text-gray-900 border-b border-gray-100 pb-2 cursor-pointer text-left bg-transparent"
              >
                {item.label}
              </button>
            ))}
            <button 
                onClick={() => {
                  router.push('/login');
                  setMobileMenuOpen(false);
                }} 
                className="text-primary font-bold pt-2 text-left" 
            >
                Acessar Sistema
            </button>
          </nav>
        </div>
      )}

      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

// --- DASHBOARD LAYOUT ---
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Use mock user for consistency
  const currentUser = MOCK_TEAM[0];

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: Users, label: 'Equipe', path: '/equipe' }, 
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Camera, label: 'Produção', path: '/producao' },
    { icon: CreditCard, label: 'Financeiro', path: '/financeiro' },
    { icon: Settings, label: 'Configurações', path: '/config' },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center px-8 border-b border-gray-900/50">
          <span className="text-2xl font-bold tracking-tight text-white">Dote.</span>
      </div>
      
      <nav className="flex-1 py-6 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/');
          const Icon = item.icon;
          
          return (
            <button 
              key={item.path} 
              onClick={() => {
                router.push(item.path);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-left
                ${isActive 
                  ? 'bg-primary text-white font-semibold shadow-lg shadow-red-500/10' 
                  : 'text-gray-400 font-medium hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-5 border-t border-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-bold">
                {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white truncate">{currentUser.name}</span>
            <span className="text-xs text-gray-500">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-black text-white hidden md:flex flex-col shadow-2xl z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black text-white transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="absolute top-4 right-4">
            <button onClick={() => setIsMobileOpen(false)} className="text-gray-400 hover:text-white p-2">
                <X />
            </button>
         </div>
         <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-60 transition-all duration-300">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden sticky top-0 z-30 shadow-sm text-gray-900">
             <span className="text-xl font-bold">Dote.</span>
             <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileOpen(true)}>
                <Menu />
             </button>
        </header>

        <main className="p-4 md:p-8 w-full max-w-none mx-auto animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};
