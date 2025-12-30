import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Building2, 
  User, 
  FileText, 
  Rocket, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  Globe,
  DollarSign,
  Eye,
  Trash2,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { Button, Input, Modal, Badge, Heading, Label, SearchInput, Card } from '../components/UI';
import { MOCK_CLIENTS } from '../services/mockData';
import { Client, ClientPlan } from '../types';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  
  // Estado para exclusão de cliente
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', industry: '', website: '', logo: null,
    contactName: '', email: '', phone: '', role: '',
    plan: ClientPlan.FEE, value: '', startDate: '',
    objective: '', socialMedia: ''
  });

  const handleOpenModal = () => {
    setCurrentStep(1);
    setFormData({
      name: '', industry: '', website: '', logo: null,
      contactName: '', email: '', phone: '', role: '',
      plan: ClientPlan.FEE, value: '', startDate: '',
      objective: '', socialMedia: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!formData.name) return;
    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      plan: formData.plan,
      status: 'Ativo',
      lastInteraction: 'Hoje',
      contacts: [],
      personas: [],
      tone: { casualFormal: 50, friendlyProfessional: 50, funnySerious: 50, accessibleExclusive: 50, modernClassic: 50, softImposing: 50 },
      socialHistory: [],
      colors: {
        primary: { hex: '#000000', cmyk: '0,0,0,100', pantone: 'Black' },
        secondary: { hex: '#FFFFFF', cmyk: '0,0,0,0', pantone: 'White' }
      }
    };
    setClients([...clients, client]);
    setIsModalOpen(false);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setClientToDelete(null);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = [
    { id: 1, title: 'Empresa', icon: Building2 },
    { id: 2, title: 'Contato', icon: User },
    { id: 3, title: 'Contrato', icon: FileText },
    { id: 4, title: 'Kick-off', icon: Rocket },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Heading>Clientes</Heading>
          <p className="text-gray-400 mt-2 font-bold uppercase text-xs tracking-widest">Contratos e Onboarding</p>
        </div>
        <Button onClick={handleOpenModal} size="lg" className="px-10">
          <Plus size={18} className="mr-2" /> Novo Onboarding
        </Button>
      </div>

      <div className="max-w-md">
        <SearchInput 
          placeholder="Buscar cliente ou contato..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6"><Label className="mb-0">Cliente</Label></th>
                <th className="px-8 py-6"><Label className="mb-0">Modelo</Label></th>
                <th className="px-8 py-6"><Label className="mb-0">Status</Label></th>
                <th className="px-8 py-6"><Label className="mb-0">Contato</Label></th>
                <th className="px-8 py-6 text-right"><Label className="mb-0">Ações</Label></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/clientes/${client.id}`)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-xs border-4 border-white shadow-xl">
                            {client.name.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-black uppercase tracking-tight text-gray-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={client.plan === ClientPlan.FEE ? 'red' : 'outline'}>
                      {client.plan}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={client.status === 'Ativo' ? 'green' : 'outline'}>
                      {client.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-bold">{client.email.split('@')[0]}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right relative">
                    <button onClick={(e) => { e.stopPropagation(); setActiveActionId(client.id); }} className="p-3 text-gray-300 hover:text-primary rounded-xl transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                    {activeActionId === client.id && (
                        <div className="absolute right-12 top-14 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in zoom-in-95">
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${client.id}`); }} className="w-full text-left px-5 py-4 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                <Eye size={16} /> Ver Brandbook
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setClientToDelete(client); }} className="w-full text-left px-5 py-4 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center gap-3 border-t border-gray-50">
                                <Trash2 size={16} /> Excluir
                            </button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL NOVO CLIENTE */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Onboarding" className="max-w-2xl" footer={
          <div className="flex justify-between w-full">
            {currentStep > 1 ? <Button variant="ghost" onClick={() => setCurrentStep(p => p - 1)}>Anterior</Button> : <div />}
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Sair</Button>
                <Button onClick={currentStep < 4 ? () => setCurrentStep(p => p + 1) : handleSaveClient}>
                    {currentStep < 4 ? 'Próximo' : 'Finalizar'}
                </Button>
            </div>
          </div>
      }>
        <div className="min-h-[400px]">
            <div className="flex items-center justify-between mb-12 px-2 relative">
                <div className="absolute left-0 top-5 w-full h-1 bg-gray-50 -z-10" />
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                            step.id === currentStep ? 'border-primary bg-primary text-white scale-110 shadow-lg' : 
                            step.id < currentStep ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200 text-gray-300 bg-white'
                        }`}>
                            {step.id < currentStep ? <Check size={18} /> : <step.icon size={18} />}
                        </div>
                        <Label className="mb-0 text-[8px]">{step.title}</Label>
                    </div>
                ))}
            </div>
            {currentStep === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    <div className="flex flex-col items-center gap-6 p-10 border-4 border-dashed border-gray-50 rounded-[2rem] bg-gray-50/20 hover:bg-gray-50 transition-all cursor-pointer group">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-gray-200 group-hover:text-primary transition-colors">
                            <Upload size={32} />
                        </div>
                        <Heading level={3} className="text-gray-300">Identidade Visual</Heading>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nome da Empresa *" placeholder="Ex: TechSolutions Inc." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        <Input label="Site" icon={Globe} placeholder="www.empresa.com" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                    </div>
                </div>
            )}
        </div>
      </Modal>

      {/* MODAL CONFIRMAÇÃO EXCLUIR CLIENTE */}
      <Modal 
        isOpen={clientToDelete !== null} 
        onClose={() => setClientToDelete(null)} 
        title="Confirmar Exclusão de Cliente"
        footer={
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setClientToDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDeleteClient}>Confirmar Exclusão</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
                <Heading level={3}>Deseja excluir este cliente?</Heading>
                <p className="text-sm font-medium text-gray-500">Você está removendo o cliente <span className="text-gray-900 font-black">{clientToDelete?.name}</span>. Esta ação apagará todos os dados de brandbook, métricas e histórico deste cliente.</p>
            </div>
        </div>
      </Modal>
    </div>
  );
};