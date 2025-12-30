import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  List, 
  Layout, 
  MoreVertical, 
  Calendar, 
  ChevronRight, 
  Upload, 
  Search, 
  User, 
  Target,
  Link as LinkIcon,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button, Input, Modal, Badge, Heading, Label, SearchInput, Card } from '../components/UI';
import { MOCK_JOBS, MOCK_CLIENTS, MOCK_TEAM } from '../services/mockData';
import { Job, JobStage, JobType } from '../types';

const COLUMNS = Object.values(JobStage);

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [newJobStep, setNewJobStep] = useState(1);
  
  // Estado para o Autoselect de Cliente
  const [clientSearch, setClientSearch] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

  const [newJobData, setNewJobData] = useState<Partial<Job>>({
    stage: JobStage.BRIEFING,
    type: JobType.DIGITAL,
    dropboxLinks: []
  });

  const dragItem = useRef<string | null>(null);

  const filteredClients = useMemo(() => {
    if (!clientSearch) return [];
    return MOCK_CLIENTS.filter(c => 
      c.name.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    dragItem.current = id;
    e.currentTarget.classList.add('opacity-40');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-40');
    dragItem.current = null;
  };

  const handleDrop = (e: React.DragEvent, col: JobStage) => {
    e.preventDefault();
    if (!dragItem.current) return;
    const jobId = dragItem.current;
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, stage: col } : job));
  };

  const handleAdvanceJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const currentIndex = COLUMNS.indexOf(job.stage);
        if (currentIndex < COLUMNS.length - 1) return { ...job, stage: COLUMNS[currentIndex + 1] };
      }
      return job;
    }));
  };

  const handleOpenJob = (job: Job) => navigate(`/jobs/${job.id}`);

  const formatDateBr = (dateStr: string) => {
    if (!dateStr) return '--/--/----';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleSelectClient = (client: typeof MOCK_CLIENTS[0]) => {
    setNewJobData({ ...newJobData, clientId: client.id, clientName: client.name });
    setClientSearch(client.name);
    setIsClientDropdownOpen(false);
  };

  // Funções para gerenciar links no modal
  const handleAddLink = () => {
    setNewJobData({ 
      ...newJobData, 
      dropboxLinks: [...(newJobData.dropboxLinks || []), ""] 
    });
  };

  const handleUpdateLink = (index: number, value: string) => {
    const newLinks = [...(newJobData.dropboxLinks || [])];
    newLinks[index] = value;
    setNewJobData({ ...newJobData, dropboxLinks: newLinks });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...(newJobData.dropboxLinks || [])].filter((_, i) => i !== index);
    setNewJobData({ ...newJobData, dropboxLinks: newLinks });
  };

  return (
    <div className="fixed inset-0 md:left-60 bg-[#F3F4F6] flex flex-col overflow-hidden">
      {/* HEADER FIXO */}
      <div className="relative z-20 px-8 pt-8 pb-6 flex items-end justify-between shrink-0">
        <div>
          <Heading level={1}>Fluxo de Jobs</Heading>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Status de Pauta em Tempo Real</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl p-1.5 flex shadow-2xl border border-gray-100">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
            >
              <Layout size={20} />
            </button>
          </div>
          
          <Button onClick={() => setIsNewJobOpen(true)} size="lg" className="px-8 h-14">
            <Plus size={20} className="mr-2" strokeWidth={3} />
            Novo Job
          </Button>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="relative z-10 flex-1 overflow-hidden px-8 pb-8">
        {viewMode === 'list' ? (
          <Card className="h-full overflow-hidden flex flex-col border-none">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-400 font-black uppercase tracking-widest text-[10px] sticky top-0 z-20 backdrop-blur-md">
                  <tr>
                    <th className="px-10 py-6">Cliente / Job</th>
                    <th className="px-10 py-6">Responsável</th>
                    <th className="px-10 py-6">Etapa</th>
                    <th className="px-10 py-6">Prazo</th>
                    <th className="px-10 py-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {COLUMNS.map(stage => {
                    const stageJobs = jobs.filter(j => j.stage === stage);
                    if (stageJobs.length === 0) return null;
                    return (
                      <React.Fragment key={stage}>
                        <tr className="bg-gray-50/30">
                          <td colSpan={5} className="px-10 py-3 text-[9px] font-black text-primary uppercase tracking-[0.3em]">{stage}</td>
                        </tr>
                        {stageJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50/80 cursor-pointer group transition-colors" onClick={() => handleOpenJob(job)}>
                             <td className="px-10 py-5">
                               <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{job.clientName}</span>
                                 <span className="text-base font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight">{job.title}</span>
                               </div>
                             </td>
                             <td className="px-10 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center text-[10px] font-black uppercase border-2 border-white shadow-sm">
                                    {MOCK_TEAM.find(t => t.id === job.assigneeId)?.name.substring(0,2)}
                                  </div>
                                  <span className="text-xs font-bold text-gray-700">{MOCK_TEAM.find(t => t.id === job.assigneeId)?.name}</span>
                                </div>
                             </td>
                             <td className="px-10 py-5">
                               <Badge variant="outline" className="text-[9px] px-3 py-1">{job.stage}</Badge>
                             </td>
                             <td className="px-10 py-5">
                               <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                 <Calendar size={14} className="text-primary"/>
                                 {formatDateBr(job.deadline)}
                               </div>
                             </td>
                             <td className="px-10 py-5 text-right">
                               <button onClick={(e) => handleAdvanceJob(e, job.id)} className="h-10 w-10 inline-flex items-center justify-center rounded-xl border-2 border-gray-100 hover:border-primary hover:text-primary transition-all">
                                  <ChevronRight size={18} />
                               </button>
                             </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="h-full overflow-x-auto flex gap-6 custom-scrollbar scroll-smooth pb-4 select-none">
            {COLUMNS.map((col) => {
              const colJobs = jobs.filter(j => j.stage === col);
              return (
                <div 
                  key={col} 
                  className="w-[360px] h-full flex flex-col rounded-[2.5rem] border-2 transition-all duration-500 shrink-0 bg-white shadow-xl border-gray-100"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, col)}
                >
                  <div className="p-8 pb-4 flex items-center justify-between sticky top-0 z-10 text-gray-900">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-black uppercase tracking-widest">{col}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{colJobs.length} Jobs</p>
                    </div>
                    <div className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-xs font-black bg-gray-900 text-white border border-gray-900">
                      {colJobs.length}
                    </div>
                  </div>

                  <div className="px-6 pb-8 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
                    {colJobs.map((job) => {
                      const assignee = MOCK_TEAM.find(t => t.id === job.assigneeId);
                      return (
                        <div 
                          key={job.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, job.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleOpenJob(job)}
                          className="p-6 rounded-3xl border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-2xl transition-all group border-l-4 border-l-primary relative bg-white border-gray-100 hover:border-gray-200"
                        >
                           <div className="flex justify-between items-start mb-4">
                             <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{job.clientName}</span>
                             <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                                <MoreVertical size={16} />
                             </button>
                           </div>
                           <h4 className="text-base font-black mb-8 leading-tight group-hover:text-primary transition-colors tracking-tight text-gray-900">{job.title}</h4>
                           <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-[11px] font-black border-2 border-white shadow-xl">
                                  {assignee?.name.substring(0,2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Resp.</span>
                                  <span className="text-[11px] font-bold text-gray-700">{assignee?.name.split(' ')[0]}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] font-black uppercase tracking-widest block text-gray-400">Deadline</span>
                                <div className="flex items-center gap-1.5 text-[11px] font-black text-gray-900">
                                  <Calendar size={12} className="text-primary"/>
                                  {formatDateBr(job.deadline)}
                                </div>
                              </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE NOVO JOB REFORMULADO */}
      <Modal 
        isOpen={isNewJobOpen} 
        onClose={() => {
            setIsNewJobOpen(false);
            setNewJobStep(1);
            setClientSearch('');
            setNewJobData({ stage: JobStage.BRIEFING, type: JobType.DIGITAL, dropboxLinks: [] });
        }} 
        title={`Abrir Novo Job - Passo ${newJobStep}/3`}
        className="max-w-2xl"
        footer={
          <div className="flex justify-between w-full">
            {newJobStep > 1 ? (
              <Button variant="outline" onClick={() => setNewJobStep(p => p - 1)}>Voltar</Button>
            ) : <div />}
            
            {newJobStep < 3 ? (
              <Button onClick={() => setNewJobStep(p => p + 1)}>Próximo Passo</Button>
            ) : (
              <Button onClick={() => {
                const job: Job = {
                  id: `JOB-${Math.floor(Math.random() * 1000)}`,
                  title: newJobData.title || 'Novo Job',
                  clientId: newJobData.clientId || '1',
                  clientName: newJobData.clientName || 'Cliente',
                  type: JobType.DIGITAL,
                  stage: newJobData.stage || JobStage.BRIEFING,
                  assigneeId: newJobData.assigneeId || '1',
                  deadline: newJobData.deadline || new Date().toISOString().split('T')[0],
                  description: newJobData.description,
                  dropboxLinks: newJobData.dropboxLinks?.filter(l => l.trim() !== '') || []
                };
                setJobs([job, ...jobs]);
                setIsNewJobOpen(false);
                setNewJobStep(1);
                setNewJobData({ stage: JobStage.BRIEFING, type: JobType.DIGITAL, dropboxLinks: [] });
                setClientSearch('');
              }} className="px-10">Lançar no Fluxo</Button>
            )}
          </div>
        }
      >
        <div className="min-h-[400px]">
            <div className="w-full h-2 bg-gray-100 rounded-full mb-12 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500 shadow-lg" style={{ width: `${(newJobStep / 3) * 100}%` }} />
            </div>

            {newJobStep === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    {/* AUTOSELECT DE CLIENTE */}
                    <div className="space-y-1 relative">
                        <Label>Selecione o Cliente *</Label>
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <input 
                                className="w-full h-14 pl-14 pr-6 bg-white rounded-2xl border-2 border-gray-100 text-sm font-bold focus:border-primary outline-none transition-all shadow-sm"
                                placeholder="Digite o nome do cliente..."
                                value={clientSearch}
                                onChange={(e) => {
                                    setClientSearch(e.target.value);
                                    setIsClientDropdownOpen(true);
                                }}
                                onFocus={() => setIsClientDropdownOpen(true)}
                            />
                        </div>
                        {isClientDropdownOpen && filteredClients.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in zoom-in-95 duration-200">
                                {filteredClients.map(c => (
                                    <button 
                                        key={c.id} 
                                        className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                                        onClick={() => handleSelectClient(c)}
                                    >
                                        <span className="text-sm font-black uppercase text-gray-900 group-hover:text-primary">{c.name}</span>
                                        <ChevronRight size={16} className="text-gray-200 group-hover:text-primary" />
                                    </button>
                                ))}
                            </div>
                        )}
                        {isClientDropdownOpen && clientSearch && filteredClients.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-2xl z-50">
                                <span className="text-[10px] font-black text-gray-300 uppercase">Nenhum cliente encontrado</span>
                            </div>
                        )}
                    </div>

                    <Input 
                        label="O que vamos criar hoje? *" 
                        placeholder="Ex: Campanha de Natal 2024"
                        value={newJobData.title || ''}
                        onChange={(e) => setNewJobData({...newJobData, title: e.target.value})}
                    />

                    <div className="space-y-1">
                        <Label>Status inicial do Fluxo</Label>
                        <div className="relative">
                            <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <select 
                                className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-gray-100 bg-gray-50/30 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                                value={newJobData.stage}
                                onChange={(e) => setNewJobData({...newJobData, stage: e.target.value as JobStage})}
                            >
                                {COLUMNS.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {newJobStep === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Deadline Final *" 
                            type="date"
                            value={newJobData.deadline || ''}
                            onChange={(e) => setNewJobData({...newJobData, deadline: e.target.value})}
                        />
                        <div className="space-y-1">
                            <Label>Responsável Geral *</Label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                <select 
                                    className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-gray-100 bg-gray-50/30 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                                    value={newJobData.assigneeId}
                                    onChange={(e) => setNewJobData({...newJobData, assigneeId: e.target.value})}
                                >
                                    <option value="">Selecione...</option>
                                    {MOCK_TEAM.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <Input 
                        label="Briefing / Resumo do Projeto" 
                        multiline
                        placeholder="Quais os principais objetivos desta entrega?"
                        value={newJobData.description || ''}
                        onChange={(e) => setNewJobData({...newJobData, description: e.target.value})}
                    />
                </div>
            )}

            {newJobStep === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Heading level={3}>Referências & Links</Heading>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilize links externos do Dropbox ou Drive</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleAddLink} className="font-black uppercase text-[10px] tracking-widest gap-2">
                            <Plus size={14} /> Novo Link
                        </Button>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {newJobData.dropboxLinks?.map((link, index) => (
                            <div key={index} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input 
                                        className="w-full h-14 pl-14 pr-6 bg-white rounded-2xl border-2 border-gray-100 text-sm font-bold focus:border-primary outline-none transition-all shadow-sm"
                                        placeholder="Cole a URL do Dropbox aqui..."
                                        value={link}
                                        onChange={(e) => handleUpdateLink(index, e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleRemoveLink(index)}
                                    className="h-14 w-14 flex items-center justify-center bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 border-2 border-gray-100 rounded-2xl transition-all shrink-0"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}

                        {(!newJobData.dropboxLinks || newJobData.dropboxLinks.length === 0) && (
                            <div 
                                onClick={handleAddLink}
                                className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-gray-300 gap-6 group hover:border-primary hover:bg-red-50/10 transition-all cursor-pointer"
                            >
                                <div className="p-6 bg-white rounded-3xl shadow-xl text-gray-300 group-hover:text-primary transition-colors">
                                   <LinkIcon size={40} />
                                </div>
                                <div className="text-center">
                                  <Heading level={3} className="text-gray-300 mb-1 group-hover:text-gray-900 transition-colors">Vincular Referências</Heading>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Clique para adicionar o primeiro link</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-blue-500 rounded-lg text-white mt-1"><AlertCircle size={16}/></div>
                        <div>
                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest block mb-1">Dica Dote</span>
                            <p className="text-xs font-medium text-blue-600 leading-relaxed">Não armazenamos arquivos no sistema para garantir a agilidade. Mantenha suas referências e artes finais organizadas no Dropbox corporativo.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </Modal>
    </div>
  );
};
