import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, Save, Building2, Globe, Mail, Phone, FileText, 
  User, ExternalLink, Plus, Calendar as CalendarIcon, 
  History, Users, MessageCircle, Share2, Palette, Instagram, 
  Facebook, Linkedin, Music, MapPin, Hash, Check, Layout, Briefcase, 
  Target, Zap, AlertCircle, Edit3, Upload, X, Globe2, MoreHorizontal
} from 'lucide-react';
import { Button, Input, Badge, Card, Modal } from '../components/UI';
import { MOCK_CLIENTS, MOCK_DATES } from '../services/mockData';
import { Client, ClientPersona, ClientContact, SocialPlatformMetric, CommemorativeDate } from '../types';

export const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('data');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const foundClient = MOCK_CLIENTS.find(c => c.id === id);
    if (foundClient) setClient(foundClient);
    setLoading(false);
  }, [id]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && client) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClient({ ...client, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-900 font-bold">Carregando Brandbook...</div>;
  if (!client) return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold text-gray-900">Cliente não encontrado</h2>
        <Button onClick={() => navigate('/clientes')} variant="outline"><ArrowLeft size={16} className="mr-2"/> Voltar</Button>
    </div>
  );

  const navItems = [
    { id: 'data', label: 'Dados Básicos', icon: Building2 },
    { id: 'history', label: 'História', icon: History },
    { id: 'personas', label: 'Personas', icon: Users },
    { id: 'tone', label: 'Tom de Voz', icon: MessageCircle },
    { id: 'social', label: 'Redes Sociais', icon: Share2 },
    { id: 'calendar', label: 'Calendário Anual', icon: CalendarIcon },
    { id: 'palette', label: 'Paleta de Cores', icon: Palette },
  ];

  return (
    <div className="w-full pb-20">
      {/* HEADER ESTRATÉGICO */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-[220px] shrink-0">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative aspect-[220/120] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary hover:bg-red-50/10 transition-all"
                >
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="w-full h-full object-contain p-4" />
                    ) : (
                      <Upload className="text-gray-300 group-hover:text-primary transition-colors" size={32} />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Upload size={20} />
                        <span className="text-[10px] font-black uppercase mt-1">Carregar Logo</span>
                    </div>
                </div>
                <p className="text-[9px] text-gray-400 mt-2 text-center uppercase font-black tracking-widest">Logo 220px • Clique para alterar</p>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{client.name}</h1>
                    <Badge variant={client.status === 'Ativo' ? 'default' : 'outline'}>{client.status}</Badge>
                    <Badge variant="red">{client.plan}</Badge>
                </div>
                <p className="text-gray-500 max-w-2xl text-lg italic">"{client.brandConcept || 'Defina o conceito da marca na aba História.'}"</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-bold"><Globe2 size={16} className="text-primary"/> {client.website}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-bold"><Mail size={16} className="text-primary"/> {client.email}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-bold"><Phone size={16} className="text-primary"/> {client.phone}</div>
                </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <Button onClick={() => console.log('Saving...')} className="gap-2 w-full"><Save size={18}/> Salvar Perfil</Button>
                <Button variant="outline" onClick={() => navigate('/clientes')} className="w-full"><ArrowLeft size={18} className="mr-2"/> Voltar</Button>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl border border-gray-200 p-3 shadow-sm space-y-1">
                {navItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-red-900/20 translate-x-1' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </div>
        </aside>

        <div className="flex-1 min-w-0">
            {activeTab === 'data' && <DataSection client={client} setClient={setClient} />}
            {activeTab === 'history' && <HistorySection client={client} setClient={setClient} />}
            {activeTab === 'personas' && <PersonaSection client={client} setClient={setClient} />}
            {activeTab === 'tone' && <ToneSection client={client} setClient={setClient} />}
            {activeTab === 'social' && <SocialSection client={client} setClient={setClient} />}
            {activeTab === 'calendar' && <CalendarSection client={client} />}
            {activeTab === 'palette' && <PaletteSection client={client} setClient={setClient} />}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTES DE SUPORTE ---

const SectionHeader = ({ title, subtitle, onEdit }: { title: string, subtitle?: string, onEdit?: () => void }) => (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-primary pl-5">
        <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{subtitle}</p>}
        </div>
        {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-2 border-gray-200 font-black uppercase text-[10px] tracking-widest">
                <Edit3 size={14} /> Editar
            </Button>
        )}
    </div>
);

const StaticField = ({ label, value, icon: Icon }: { label: string, value?: string, icon?: React.ElementType }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{label}</label>
        <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
            {Icon && <Icon size={14} className="text-primary shrink-0" />}
            <span className="truncate">{value || '---'}</span>
        </div>
    </div>
);

// --- SEÇÕES ---

const DataSection = ({ client, setClient }: { client: Client, setClient: (c: Client) => void }) => {
  const [modalType, setModalType] = useState<'corp' | 'digital' | null>(null);
  const [tempData, setTempData] = useState<Partial<Client>>({});

  const handleEdit = (type: 'corp' | 'digital') => {
    setTempData({ ...client });
    setModalType(type);
  };

  const handleSave = () => {
    setClient({ ...client, ...tempData });
    setModalType(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="p-8">
            <SectionHeader title="Dados Básicos" subtitle="Informações institucionais e fiscais" onEdit={() => handleEdit('corp')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StaticField label="Razão Social" value={client.razaoSocial} />
                <StaticField label="CNPJ" value={client.cnpj} />
                <StaticField label="Inscrição Municipal" value={client.inscricaoMunicipal} />
                <div className="lg:col-span-3">
                    <StaticField label="Endereço Completo" icon={MapPin} value={client.address} />
                </div>
            </div>
        </Card>

        <Card className="p-8">
            <SectionHeader title="Presença Digital" subtitle="Canais de comunicação e redes" onEdit={() => handleEdit('digital')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StaticField label="Website" icon={Globe} value={client.website} />
                <StaticField label="Instagram" icon={Instagram} value={client.instagram} />
                <StaticField label="Facebook" icon={Facebook} value={client.facebook} />
                <StaticField label="Linkedin" icon={Linkedin} value={client.linkedin} />
                <StaticField label="TikTok" icon={Music} value={client.tiktok} />
                <StaticField label="Outros Canais" icon={Hash} value={client.otherChannels} />
            </div>
        </Card>

        <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1 border-l-4 border-primary pl-5">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Principais Contatos</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Pontos focais do projeto</p>
                </div>
                <Button size="sm" variant="outline" className="gap-2 border-gray-200 uppercase text-[10px] tracking-widest font-black">
                    <Plus size={14}/> Novo
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client.contacts.map((contact) => (
                    <div key={contact.id} className="group relative border border-gray-100 rounded-2xl p-6 flex gap-6 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                        <button className="absolute top-4 right-4 text-gray-300 hover:text-primary transition-colors">
                            <Edit3 size={16} />
                        </button>
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                            {contact.avatar ? <img src={contact.avatar} className="w-full h-full object-cover" /> : <User size={24} className="text-gray-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">{contact.name}</h4>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-3">{contact.role}</p>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><Mail size={12} className="text-gray-400"/> {contact.corpEmail}</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><Phone size={12} className="text-gray-400"/> {contact.whatsapp}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* MODAIS DADOS BÁSICOS */}
        <Modal 
          isOpen={modalType !== null} 
          onClose={() => setModalType(null)} 
          title={modalType === 'corp' ? 'Editar Dados Institucionais' : 'Editar Canais Digitais'}
          footer={<Button onClick={handleSave}>Salvar Brandbook</Button>}
          className="max-w-2xl"
        >
          {modalType === 'corp' && (
            <div className="grid grid-cols-1 gap-6">
              <Input label="Razão Social" value={tempData.razaoSocial} onChange={e => setTempData({...tempData, razaoSocial: e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="CNPJ" value={tempData.cnpj} onChange={e => setTempData({...tempData, cnpj: e.target.value})} />
                <Input label="Inscrição Municipal" value={tempData.inscricaoMunicipal} onChange={e => setTempData({...tempData, inscricaoMunicipal: e.target.value})} />
              </div>
              <Input label="Endereço Completo" icon={MapPin} value={tempData.address} onChange={e => setTempData({...tempData, address: e.target.value})} />
            </div>
          )}
          {modalType === 'digital' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Site / E-commerce" icon={Globe} value={tempData.website} onChange={e => setTempData({...tempData, website: e.target.value})} />
              <Input label="Instagram" icon={Instagram} value={tempData.instagram} onChange={e => setTempData({...tempData, instagram: e.target.value})} />
              <Input label="Facebook" icon={Facebook} value={tempData.facebook} onChange={e => setTempData({...tempData, facebook: e.target.value})} />
              <Input label="Linkedin" icon={Linkedin} value={tempData.linkedin} onChange={e => setTempData({...tempData, linkedin: e.target.value})} />
              <Input label="TikTok" icon={Music} value={tempData.tiktok} onChange={e => setTempData({...tempData, tiktok: e.target.value})} />
              <Input label="Outros Canais" icon={Hash} value={tempData.otherChannels} onChange={e => setTempData({...tempData, otherChannels: e.target.value})} />
            </div>
          )}
        </Modal>
    </div>
  );
};

const HistorySection = ({ client, setClient }: { client: Client, setClient: (c: Client) => void }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [tempData, setTempData] = useState<Partial<Client>>({});

    const handleEdit = () => {
        setTempData({ ...client });
        setIsEditOpen(true);
    };

    const handleSave = () => {
        setClient({ ...client, ...tempData });
        setIsEditOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8">
                <SectionHeader title="História da Marca" subtitle="Origens, missão e valores" onEdit={handleEdit} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <StaticField label="Data de Fundação" value={client.foundingDate} icon={CalendarIcon} />
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Fundador e Origem</label>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed">{client.founderStory}</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Evolução e Marcos</label>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed">{client.evolution}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StaticField label="Missão" value={client.mission} />
                            <StaticField label="Visão" value={client.vision} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Valores</label>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed">{client.values}</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <StaticField label="Mensagem Central" value={client.centralMessage} icon={Target} />
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Conceito da Marca</label>
                            <p className="text-lg font-black text-gray-900 italic tracking-tight">"{client.brandConcept}"</p>
                        </div>
                        <StaticField label="Linguagem Sugerida" value={client.language} />
                        <StaticField label="O que evitar" value={client.whatToAvoid} />
                        <div className="space-y-2 pt-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Palavras Chave</label>
                            <div className="flex flex-wrap gap-2">
                                {client.keywords?.map(k => <Badge key={k} variant="red">{k}</Badge>)}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar História e Conceito" className="max-w-4xl" footer={<Button onClick={handleSave}>Atualizar História</Button>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Input label="Data de Fundação" type="date" value={tempData.foundingDate} onChange={e => setTempData({...tempData, foundingDate: e.target.value})} />
                        <Input label="Fundador e Origem" multiline value={tempData.founderStory} onChange={e => setTempData({...tempData, founderStory: e.target.value})} />
                        <Input label="Evolução e Marcos" multiline value={tempData.evolution} onChange={e => setTempData({...tempData, evolution: e.target.value})} />
                        <Input label="Missão" value={tempData.mission} onChange={e => setTempData({...tempData, mission: e.target.value})} />
                        <Input label="Visão" value={tempData.vision} onChange={e => setTempData({...tempData, vision: e.target.value})} />
                        <Input label="Valores" multiline value={tempData.values} onChange={e => setTempData({...tempData, values: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                        <Input label="Mensagem Central" icon={Target} value={tempData.centralMessage} onChange={e => setTempData({...tempData, centralMessage: e.target.value})} />
                        <Input label="Conceito da Marca" multiline value={tempData.brandConcept} onChange={e => setTempData({...tempData, brandConcept: e.target.value})} />
                        <Input label="Linguagem Sugerida" value={tempData.language} onChange={e => setTempData({...tempData, language: e.target.value})} />
                        <Input label="O que evitar?" multiline value={tempData.whatToAvoid} onChange={e => setTempData({...tempData, whatToAvoid: e.target.value})} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const PersonaSection = ({ client, setClient }: { client: Client, setClient: (c: Client) => void }) => {
    const [editingPersona, setEditingPersona] = useState<ClientPersona | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleEdit = (persona: ClientPersona) => {
        setEditingPersona({ ...persona });
    };

    const handleSave = () => {
        if (editingPersona) {
            setClient({
                ...client,
                personas: client.personas.map(p => p.id === editingPersona.id ? editingPersona : p)
            });
            setEditingPersona(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <SectionHeader title="Personas" subtitle="Perfil do público ideal" />
                <Button className="gap-2 uppercase text-[10px] font-black tracking-widest"><Plus size={16}/> Nova Persona</Button>
            </div>
            <div className="grid grid-cols-1 gap-10">
                {client.personas.map((persona) => (
                    <Card key={persona.id} className="overflow-hidden border-2 border-gray-100 group relative">
                        <button onClick={() => handleEdit(persona)} className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-lg text-gray-300 hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                            <Edit3 size={18} />
                        </button>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-[220px] bg-gray-100 flex flex-col shrink-0">
                                <img src={persona.photo} alt={persona.name} className="w-full aspect-square object-cover" />
                                <div className="p-4 bg-gray-900 text-white text-center">
                                    <h3 className="font-black uppercase tracking-tighter text-xl">{persona.name}</h3>
                                    <Badge variant="red" className="mt-1">Persona Foco</Badge>
                                </div>
                            </div>
                            <div className="p-10 flex-1 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
                                <StaticField label="Origem / Onde Cresceu" value={persona.origin} />
                                <StaticField label="Situação Familiar" value={persona.familyStatus} />
                                <div className="md:col-span-2 space-y-1.5 border-t border-gray-50 pt-6">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-widest block">Rotina e Estilo de Vida</label>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed">{persona.routine} {persona.lifestyle}</p>
                                </div>
                                <StaticField label="Frequência de Compra" value={persona.purchaseFrequency} />
                                <StaticField label="Onde Compra" value={persona.wherePurchases} />
                                <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <StaticField label="Motivação" value={persona.motivation} />
                                    <StaticField label="Aspirações" value={persona.aspirations} />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={editingPersona !== null} onClose={() => setEditingPersona(null)} title="Editar Persona" className="max-w-3xl" footer={<Button onClick={handleSave}>Salvar Persona</Button>}>
                {editingPersona && (
                    <div className="space-y-6">
                        <Input label="Nome da Persona" value={editingPersona.name} onChange={e => setEditingPersona({...editingPersona, name: e.target.value})} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Origem" value={editingPersona.origin} onChange={e => setEditingPersona({...editingPersona, origin: e.target.value})} />
                            <Input label="Situação Familiar" value={editingPersona.familyStatus} onChange={e => setEditingPersona({...editingPersona, familyStatus: e.target.value})} />
                        </div>
                        <Input label="Rotina Típica" multiline value={editingPersona.routine} onChange={e => setEditingPersona({...editingPersona, routine: e.target.value})} />
                        <Input label="Estilo de Vida" multiline value={editingPersona.lifestyle} onChange={e => setEditingPersona({...editingPersona, lifestyle: e.target.value})} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Frequência" value={editingPersona.purchaseFrequency} onChange={e => setEditingPersona({...editingPersona, purchaseFrequency: e.target.value})} />
                            <Input label="Onde Compra" value={editingPersona.wherePurchases} onChange={e => setEditingPersona({...editingPersona, wherePurchases: e.target.value})} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const ToneSection = ({ client, setClient }: { client: Client, setClient: (c: Client) => void }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [tempTone, setTempTone] = useState<any>(null);

    const axes = [
        { key: 'casualFormal', left: 'Casual', right: 'Formal' },
        { key: 'friendlyProfessional', left: 'Amigável', right: 'Profissional' },
        { key: 'funnySerious', left: 'Divertido', right: 'Sério' },
        { key: 'accessibleExclusive', left: 'Acessível', right: 'Exclusivo' },
        { key: 'modernClassic', left: 'Moderno', right: 'Clássico' },
        { key: 'softImposing', left: 'Suave', right: 'Imponente' },
    ];

    const handleEdit = () => {
        setTempTone({ ...client.tone });
        setIsEditOpen(true);
    };

    const handleSave = () => {
        setClient({ ...client, tone: tempTone });
        setIsEditOpen(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8">
                <SectionHeader title="Tom de Voz" subtitle="Diretrizes de comunicação verbal" onEdit={handleEdit} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    {axes.map(axis => {
                        const val = client.tone[axis.key as keyof typeof client.tone];
                        return (
                            <div key={axis.key} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{axis.left} / {axis.right}</label>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                        {val < 40 ? axis.left : val > 60 ? axis.right : 'Equilibrado'}
                                    </p>
                                </div>
                                <div className="text-2xl font-black text-primary">{val}%</div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Intensidade do Tom" footer={<Button onClick={handleSave}>Salvar Voz</Button>}>
                <div className="space-y-8 py-4">
                    {axes.map(axis => (
                        <div key={axis.key} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>{axis.left}</span>
                                <span>{axis.right}</span>
                            </div>
                            <input type="range" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" value={tempTone?.[axis.key]} onChange={e => setTempTone({...tempTone, [axis.key]: parseInt(e.target.value)})} />
                            <div className="text-center font-black text-xs text-primary">{tempTone?.[axis.key]}%</div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

const SocialSection = ({ client, setClient }: { client: Client, setClient: (c: Client) => void }) => {
    const [editingMetric, setEditingMetric] = useState<SocialPlatformMetric | null>(null);

    const handleSave = () => {
        if (editingMetric) {
            setClient({
                ...client,
                socialHistory: client.socialHistory.map(s => s.id === editingMetric.id ? editingMetric : s)
            });
            setEditingMetric(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Performance Social" subtitle="Métricas comparativas e evolução" />
            {client.socialHistory.map((metric) => (
                <Card key={metric.id} className="overflow-hidden border-2 border-gray-100 group relative">
                    <button onClick={() => setEditingMetric({ ...metric })} className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-lg text-gray-300 hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                        <Edit3 size={18} />
                    </button>
                    <div className="bg-gray-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary rounded-2xl shadow-xl shadow-red-900/40 text-white"><Share2 size={28}/></div>
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{metric.platform} - {metric.profileName}</h4>
                                <a href={metric.profileLink} target="_blank" className="text-xs text-primary font-black uppercase tracking-widest hover:underline">{metric.profileLink}</a>
                            </div>
                        </div>
                        <Badge variant="red" className="scale-125">Ativo</Badge>
                    </div>
                    
                    <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white">
                        {[
                            { label: 'Seguidores', entry: metric.followersEntry, current: metric.followersCurrent },
                            { label: 'Alcance', entry: metric.reachEntry, current: metric.reachCurrent },
                            { label: 'Engajamento', entry: metric.engagementEntry, current: metric.engagementCurrent, unit: '%' },
                            { label: 'Cliques', entry: metric.clicksEntry, current: metric.clicksCurrent },
                        ].map(st => {
                            const growth = ((st.current - st.entry) / st.entry * 100).toFixed(1);
                            const isPos = parseFloat(growth) >= 0;
                            return (
                                <div key={st.label} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{st.label}</span>
                                    <div className="space-y-1">
                                        <div className="text-[10px] text-gray-400 font-bold">Início: {st.entry}{st.unit}</div>
                                        <div className="text-2xl font-black text-gray-900">{st.current}{st.unit}</div>
                                        <Badge variant={isPos ? 'outline' : 'red'} className={`mt-2 ${isPos ? 'text-green-600 bg-green-50' : ''}`}>
                                            {isPos ? '↑' : '↓'} {growth}%
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            ))}

            <Modal isOpen={editingMetric !== null} onClose={() => setEditingMetric(null)} title="Editar Métricas Sociais" footer={<Button onClick={handleSave}>Atualizar Dados</Button>}>
                {editingMetric && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Seguidores Entrada" type="number" value={editingMetric.followersEntry} onChange={e => setEditingMetric({...editingMetric, followersEntry: parseInt(e.target.value)})} />
                            <Input label="Seguidores Atual" type="number" value={editingMetric.followersCurrent} onChange={e => setEditingMetric({...editingMetric, followersCurrent: parseInt(e.target.value)})} />
                            <Input label="Alcance Entrada" type="number" value={editingMetric.reachEntry} onChange={e => setEditingMetric({...editingMetric, reachEntry: parseInt(e.target.value)})} />
                            <Input label="Alcance Atual" type="number" value={editingMetric.reachCurrent} onChange={e => setEditingMetric({...editingMetric, reachCurrent: parseInt(e.target.value)})} />
                        </div>
                        <Input label="Engajamento Atual (%)" type="number" step="0.1" value={editingMetric.engagementCurrent} onChange={e => setEditingMetric({...editingMetric, engagementCurrent: parseFloat(e.target.value)})} />
                    </div>
                )}
            </Modal>
        </div>
    );
};

const CalendarSection = ({ client }: { client: Client }) => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const dates = MOCK_DATES.filter(d => d.clientId === client.id || !d.clientId);
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <Card className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Calendário Anual" subtitle="Planejamento de datas estratégicas" onEdit={() => setIsAddOpen(true)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                {months.map((m, idx) => {
                    const monthDates = dates.filter(d => d.month === idx);
                    return (
                        <div key={m} className="border-2 border-gray-50 rounded-2xl p-6 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all min-h-[180px]">
                            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                                <span className="font-black text-gray-900 uppercase tracking-tighter text-2xl">{m}</span>
                                <Plus size={16} className="text-gray-300 hover:text-primary cursor-pointer transition-colors" />
                            </div>
                            <div className="space-y-3">
                                {monthDates.map(d => (
                                    <div key={d.id} className={`p-3 rounded-xl text-[10px] font-bold border-l-4 shadow-sm bg-white ${d.clientId ? 'border-orange-500 text-orange-700' : 'border-red-500 text-red-700'}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="opacity-60 uppercase">{d.day}/{idx+1}</span>
                                            {d.clientId && <Badge variant="outline" className="scale-75 origin-right">Brand</Badge>}
                                        </div>
                                        <div className="truncate uppercase tracking-tight">{d.name}</div>
                                    </div>
                                ))}
                                {monthDates.length === 0 && <span className="text-[10px] text-gray-300 italic font-bold uppercase">Sem eventos</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Nova Data Estratégica" footer={<Button onClick={() => setIsAddOpen(false)}>Agendar Data</Button>}>
                <div className="space-y-4">
                    <Input label="Título da Data" placeholder="Ex: Aniversário da Marca" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Dia" type="number" />
                        <Input label="Mês (0-11)" type="number" />
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

const PaletteSection = ({ client, setClient }: { client: Client, setClient: (c: Client) => void }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [tempColors, setTempColors] = useState<any>(null);

    const handleEdit = () => {
        setTempColors({ ...client.colors });
        setIsEditOpen(true);
    };

    const handleSave = () => {
        setClient({ ...client, colors: tempColors });
        setIsEditOpen(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-10">
                <SectionHeader title="Identidade Visual" subtitle="Códigos técnicos oficiais" onEdit={handleEdit} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
                    {[
                        { label: 'Cor Primária', data: client.colors.primary },
                        { label: 'Cor Secundária', data: client.colors.secondary }
                    ].map(color => (
                        <div key={color.label} className="flex items-center gap-10">
                            <div className="w-32 h-32 rounded-[2.5rem] shadow-2xl border-4 border-white ring-1 ring-gray-100 shrink-0" style={{ backgroundColor: color.data.hex }} />
                            <div className="flex-1 space-y-4">
                                <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">{color.label}</h4>
                                <div className="space-y-2">
                                    <StaticField label="HEX" value={color.data.hex} />
                                    <StaticField label="CMYK" value={color.data.cmyk} />
                                    <StaticField label="PANTONE" value={color.data.pantone} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="md:col-span-2 space-y-3 border-t border-gray-100 pt-10">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Observações de Identidade</label>
                        <p className="text-sm font-bold text-gray-600 leading-relaxed italic">"{client.colors.notes || 'Nenhuma observação técnica cadastrada.'}"</p>
                    </div>
                </div>
            </Card>

            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Paleta de Cores" footer={<Button onClick={handleSave}>Salvar Paleta</Button>}>
                {tempColors && (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase text-gray-900 tracking-widest border-b pb-2">Cor Primária</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <Input label="HEX" value={tempColors.primary.hex} onChange={e => setTempColors({...tempColors, primary: {...tempColors.primary, hex: e.target.value}})} />
                                <Input label="CMYK" value={tempColors.primary.cmyk} onChange={e => setTempColors({...tempColors, primary: {...tempColors.primary, cmyk: e.target.value}})} />
                                <Input label="PANTONE" value={tempColors.primary.pantone} onChange={e => setTempColors({...tempColors, primary: {...tempColors.primary, pantone: e.target.value}})} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase text-gray-900 tracking-widest border-b pb-2">Cor Secundária</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <Input label="HEX" value={tempColors.secondary.hex} onChange={e => setTempColors({...tempColors, secondary: {...tempColors.secondary, hex: e.target.value}})} />
                                <Input label="CMYK" value={tempColors.secondary.cmyk} onChange={e => setTempColors({...tempColors, secondary: {...tempColors.secondary, cmyk: e.target.value}})} />
                                <Input label="PANTONE" value={tempColors.secondary.pantone} onChange={e => setTempColors({...tempColors, secondary: {...tempColors.secondary, pantone: e.target.value}})} />
                            </div>
                        </div>
                        <Input label="Observações de Uso" multiline value={tempColors.notes} onChange={e => setTempColors({...tempColors, notes: e.target.value})} />
                    </div>
                )}
            </Modal>
        </div>
    );
};