
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, UserPlus, Search, Phone, ChevronRight, User, Briefcase, Hash, FileText, Camera, Lock } from 'lucide-react';
import { Card, Button, Badge, Heading, Label, SearchInput, Modal, Input } from '../components/UI';
import { MOCK_TEAM, DEFAULT_PERMISSIONS } from '../services/mockData';
import { TeamRole, TeamMember } from '../types';

export const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Estado para o Modal de Novo Membro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: 'Designer',
    email: '',
    password: '',
    phone: '',
    bio: '',
    skills: [],
    status: 'Ativo'
  });

  const roles: TeamRole[] = ['Gestor', 'Designer', 'Creator', 'Videomaker', 'Atendimento', 'Financeiro'];

  const handleSaveMember = () => {
    if (!formData.name || !formData.email) return;

    const role = (formData.role as TeamRole) || 'Designer';
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      role: role,
      email: formData.email,
      password: formData.password || 'dote123',
      phone: formData.phone || '',
      status: 'Ativo',
      joinedDate: new Date().toISOString().split('T')[0],
      bio: formData.bio || '',
      skills: formData.skills || [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff&size=150`,
      permissions: DEFAULT_PERMISSIONS[role]
    };

    setTeam([newMember, ...team]);
    setIsModalOpen(false);
    setFormData({ name: '', role: 'Designer', email: '', password: '', phone: '', bio: '', skills: [], status: 'Ativo' });
  };

  const filteredTeam = team.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
          <Heading>Equipe Dote</Heading>
          <p className="text-gray-400 mt-2 font-bold uppercase text-xs tracking-widest">Gestão de Talentos e Capital Humano</p>
        </div>
        <Button size="lg" className="px-10 h-14 shadow-xl shadow-red-500/20" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={20} className="mr-2" strokeWidth={3} /> Novo Membro
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="max-w-md w-full">
            <SearchInput placeholder="Buscar colaborador pelo nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select 
            className="h-14 px-6 bg-white rounded-2xl border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 focus:border-primary outline-none shadow-sm cursor-pointer transition-all hover:border-gray-200"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
        >
            <option value="all">Filtrar por Cargo: Todos</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeam.map((member) => (
            <Card key={member.id} onClick={() => navigate(`/equipe/${member.id}`)} className="p-0 border-none shadow-xl bg-white group overflow-hidden">
                <div className="p-10 flex flex-col items-center text-center">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-[3rem] bg-gray-100 flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-gray-200">{member.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
                            member.status === 'Ativo' ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                    <Badge variant="outline" className="mt-4 border-gray-100 text-gray-400 group-hover:border-primary/20 group-hover:text-primary transition-colors">{member.role}</Badge>
                    
                    <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-50 mt-10 pt-8">
                        <a href={`mailto:${member.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary hover:bg-red-50 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-100">
                            <Mail size={16} /> Mail
                        </a>
                        <a href={`tel:${member.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary hover:bg-red-50 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-100">
                            <Phone size={16} /> Call
                        </a>
                    </div>
                </div>
                <div className="bg-gray-50/50 px-10 py-5 flex items-center justify-between border-t border-gray-50 group-hover:bg-red-50/30 transition-colors">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary">Ver Perfil Detalhado</span>
                    <ChevronRight size={16} className="text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
            </Card>
        ))}
        {filteredTeam.length === 0 && (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-100 rounded-[3rem]">
                <Heading level={3} className="text-gray-300 mb-2">Nenhum talento encontrado</Heading>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tente ajustar seus filtros de busca ou cargo</p>
            </div>
        )}
      </div>

      {/* MODAL DE NOVO MEMBRO */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Novo Talento"
        className="max-w-2xl"
        footer={
          <div className="flex gap-4 w-full justify-between">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-gray-400">Cancelar</Button>
            <Button onClick={handleSaveMember} className="px-10 h-14">
                Salvar Colaborador
            </Button>
          </div>
        }
      >
        <div className="space-y-8 py-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-primary hover:bg-red-50 transition-all cursor-pointer group">
                    <Camera size={24} className="group-hover:text-primary transition-colors" />
                    <span className="text-[8px] font-black uppercase tracking-widest mt-2 group-hover:text-primary">Upload</span>
                </div>
                <Label className="mb-0">Foto do Perfil</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Nome Completo *" 
                    placeholder="Ex: João da Silva" 
                    icon={User}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <div className="space-y-1">
                    <Label>Cargo / Especialidade *</Label>
                    <div className="relative">
                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <select 
                            className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-gray-100 bg-gray-50/30 text-sm font-bold focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value as TeamRole})}
                        >
                            {roles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Email Corporativo *" 
                    placeholder="joao@agenciadote.com" 
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Input 
                    label="Senha de Acesso *" 
                    placeholder="••••••••" 
                    icon={Lock}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <Input 
                label="WhatsApp / Telefone" 
                placeholder="(00) 00000-0000" 
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />

            <Input 
                label="Bio / Experiência Profissional" 
                placeholder="Conte um pouco sobre a trajetória deste talento..." 
                multiline
                icon={FileText}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />

            <div className="space-y-3">
                <Label>Principais Competências (Separadas por vírgula)</Label>
                <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input 
                        className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-gray-100 bg-gray-50/30 text-sm font-bold focus:border-primary outline-none transition-all placeholder:text-gray-300"
                        placeholder="Ex: Photoshop, UX Design, Copywriting, Estratégia"
                        onBlur={(e) => {
                            const skills = (e.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(s => s !== '');
                            setFormData({...formData, skills});
                        }}
                    />
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pressione ENTER ou saia do campo para confirmar as tags</p>
            </div>
        </div>
      </Modal>
    </div>
  );
};
