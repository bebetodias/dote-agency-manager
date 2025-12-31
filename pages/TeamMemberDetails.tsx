
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Calendar, Briefcase, Award, 
  CheckCircle2, Clock, Trash2, Edit3, ChevronRight, 
  Target, TrendingUp, Layout, FileText, User, Hash, Lock, ShieldCheck, Settings, Users, DollarSign, LayoutDashboard, Check
} from 'lucide-react';
import { Button, Badge, Card, Modal, Input, Heading, Label } from '../components/UI';
import { MOCK_TEAM, MOCK_JOBS, DEFAULT_PERMISSIONS } from '../services/mockData';
import { TeamMember, Job, TeamRole, AccessPermissions } from '../types';

export const TeamMemberDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  
  // Estados para modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  
  // Dados temporários
  const [formData, setFormData] = useState<Partial<TeamMember>>({});
  const [newPassword, setNewPassword] = useState('');
  const [tempPermissions, setTempPermissions] = useState<AccessPermissions | null>(null);

  useEffect(() => {
    const found = MOCK_TEAM.find(m => m.id === id);
    if (found) {
      setMember(found);
      const jobs = MOCK_JOBS.filter(j => j.assigneeId === id);
      setActiveJobs(jobs);
    }
  }, [id]);

  const handleOpenEdit = () => {
    if (member) {
      setFormData({
        ...member,
        skills: [...(member.skills || [])]
      });
      setIsEditModalOpen(true);
    }
  };

  const handleOpenAccess = () => {
    if (member) {
      setTempPermissions({ ...(member.permissions || DEFAULT_PERMISSIONS[member.role] || DEFAULT_PERMISSIONS['Designer']) });
      setIsAccessModalOpen(true);
    }
  };

  const handleSaveProfile = () => {
    if (member && formData.name) {
      setMember({ ...member, ...formData } as TeamMember);
      setIsEditModalOpen(false);
    }
  };

  const handleSavePassword = () => {
    if (member && newPassword) {
      setMember({ ...member, password: newPassword });
      setNewPassword('');
      setIsPasswordModalOpen(false);
      alert('Senha alterada com sucesso!');
    }
  };

  const handleSaveAccess = () => {
    if (member && tempPermissions) {
      setMember({ ...member, permissions: tempPermissions });
      setIsAccessModalOpen(false);
    }
  };

  const togglePermission = (key: keyof AccessPermissions) => {
    if (tempPermissions) {
      setTempPermissions({ ...tempPermissions, [key]: !tempPermissions[key] });
    }
  };

  if (!member) return null;

  const roles: TeamRole[] = ['Gestor', 'Designer', 'Creator', 'Videomaker', 'Atendimento', 'Financeiro'];

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER DO PERFIL */}
      <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative shrink-0">
             <div className="w-40 h-40 rounded-[3rem] bg-gray-100 border-8 border-white shadow-2xl overflow-hidden">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-gray-200 flex items-center justify-center h-full">{member.name.charAt(0)}</span>
                )}
             </div>
             <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                <CheckCircle2 size={24} />
             </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
             <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                    <button onClick={() => navigate('/equipe')} className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-primary transition-all"><ArrowLeft size={16} /></button>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Perfil do Colaborador</span>
                </div>
                <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">{member.name}</h1>
                <p className="text-lg font-black text-primary uppercase tracking-widest">{member.role}</p>
             </div>

             <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Calendar size={14} className="text-primary"/> 
                    Entrou em: {new Date(member.joinedDate || '').toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Mail size={14} className="text-primary"/> {member.email}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Phone size={14} className="text-primary"/> {member.phone}
                </div>
             </div>

             <p className="text-gray-500 max-w-2xl text-sm font-medium leading-relaxed">{member.bio}</p>
             
             <div className="flex flex-wrap gap-3 pt-4 justify-center md:justify-start">
                <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)} className="bg-white border-gray-100 uppercase text-[9px] font-black tracking-widest gap-2">
                    <Lock size={14}/> Alterar Senha
                </Button>
                <Button variant="outline" size="sm" onClick={handleOpenAccess} className="bg-white border-gray-100 uppercase text-[9px] font-black tracking-widest gap-2">
                    <ShieldCheck size={14}/> Controle de Acesso
                </Button>
             </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
             <Button 
                variant="outline" 
                className="font-black uppercase text-[10px] tracking-widest gap-2 h-12 bg-white border-gray-100 shadow-sm"
                onClick={handleOpenEdit}
             >
                <Edit3 size={16} /> Editar Perfil
             </Button>
             <Button variant="danger" className="font-black uppercase text-[10px] tracking-widest gap-2 h-12 opacity-50 hover:opacity-100">
                <Trash2 size={16} /> Desativar Acesso
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
            <Card className="p-8">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <TrendingUp size={14} className="text-primary"/> Desempenho
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Jobs Ativos</span>
                        <span className="text-3xl font-black text-gray-900">{activeJobs.length}</span>
                    </div>
                    <div className="p-5 bg-green-50 rounded-2xl border border-green-100 text-center">
                        <span className="text-[9px] font-black text-green-400 uppercase tracking-widest block mb-2">Concluídos</span>
                        <span className="text-3xl font-black text-green-700">24</span>
                    </div>
                </div>
            </Card>

            <Card className="p-8">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <Award size={14} className="text-primary"/> Competências
                </h3>
                <div className="flex flex-wrap gap-2">
                    {member.skills?.map(skill => (
                        <Badge key={skill} variant="outline" className="bg-gray-50 border-gray-100 text-gray-600 px-4 py-1.5">{skill}</Badge>
                    ))}
                </div>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Briefcase size={14} className="text-primary"/> Jobs sob Responsabilidade
                    </h3>
                    <Badge variant="red">{activeJobs.length} em aberto</Badge>
                </div>

                <div className="space-y-4">
                    {activeJobs.map(job => (
                        <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-primary">{job.type === 'Digital' ? <Layout size={20}/> : <FileText size={20}/>}</div>
                                <div>
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">{job.clientName}</span>
                                    <h4 className="text-sm font-black text-gray-900 uppercase group-hover:text-primary transition-colors">{job.title}</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Deadline</span>
                                    <span className="text-xs font-bold text-gray-900">{new Date(job.deadline).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <Badge variant="outline" className="bg-white border-gray-200">{job.stage}</Badge>
                                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>

      {/* MODAL ALTERAR SENHA */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Segurança: Alterar Senha" footer={<Button onClick={handleSavePassword}>Confirmar Nova Senha</Button>}>
        <div className="space-y-4 py-4">
            <Input label="Nova Senha" type="password" icon={Lock} placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">A nova senha deve conter pelo menos 8 caracteres.</p>
        </div>
      </Modal>

      {/* MODAL CONTROLE DE ACESSO */}
      <Modal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} title="Controle de Acesso Individual" className="max-w-xl" footer={<Button onClick={handleSaveAccess}>Salvar Permissões</Button>}>
        <div className="space-y-6 py-4">
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 mb-6">
                <ShieldCheck className="text-primary mt-1" size={20} />
                <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase">Privilégios Customizados</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed mt-1">Alterações feitas aqui anulam o perfil padrão do cargo ({member.role}).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {[
                    { key: 'dashboard', label: 'Acesso ao Dashboard', icon: LayoutDashboard },
                    { key: 'clients', label: 'Gestão de Clientes / Brandbook', icon: Users },
                    { key: 'team', label: 'Gestão da Equipe', icon: User },
                    { key: 'jobs', label: 'Fluxo de Jobs e Pauta', icon: Briefcase },
                    { key: 'financial', label: 'Módulo Financeiro', icon: DollarSign },
                    { key: 'settings', label: 'Configurações do Sistema', icon: Settings },
                ].map((perm) => (
                    <div 
                        key={perm.key} 
                        onClick={() => togglePermission(perm.key as keyof AccessPermissions)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                            tempPermissions?.[perm.key as keyof AccessPermissions] ? 'border-primary bg-red-50/30 shadow-md' : 'border-gray-50 bg-white hover:border-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-colors ${tempPermissions?.[perm.key as keyof AccessPermissions] ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <perm.icon size={20} />
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-tight ${tempPermissions?.[perm.key as keyof AccessPermissions] ? 'text-gray-900' : 'text-gray-400'}`}>
                                {perm.label}
                            </span>
                        </div>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${tempPermissions?.[perm.key as keyof AccessPermissions] ? 'bg-primary scale-110' : 'bg-gray-100'}`}>
                            {tempPermissions?.[perm.key as keyof AccessPermissions] && <Check size={14} className="text-white" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Modal>

      {/* MODAL DE EDIÇÃO */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Editar Perfil"
        className="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProfile} className="px-8">Salvar Alterações</Button>
          </div>
        }
      >
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nome Completo" icon={User} value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <div className="space-y-1">
                 <Label>Cargo / Role</Label>
                 <select className="w-full h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/30 px-6 py-2 text-sm font-bold focus:border-primary outline-none transition-all" value={formData.role || ''} onChange={(e) => setFormData({...formData, role: e.target.value as TeamRole})}>
                    {roles.map(role => <option key={role} value={role}>{role}</option>)}
                 </select>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Email Corporativo" icon={Mail} type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <Input label="WhatsApp / Telefone" icon={Phone} value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
           </div>
           <Input label="Bio / Apresentação" multiline placeholder="Conte um pouco sobre suas especialidades..." value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
           <div className="space-y-3">
              <Label>Competências (Separadas por vírgula)</Label>
              <div className="relative">
                 <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                 <input className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-gray-100 bg-gray-50/30 text-sm font-bold focus:border-primary outline-none transition-all" placeholder="Ex: Photoshop, Estratégia, Copywriting..." value={formData.skills?.join(', ') || ''} onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} />
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
};
