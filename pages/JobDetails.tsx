
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle, 
  Paperclip, 
  MessageSquare, 
  MoreHorizontal,
  Clock,
  Trash2,
  Save,
  Link as LinkIcon,
  Plus,
  Trash,
  Layout,
  Briefcase,
  History,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  ExternalLink,
  Edit3,
  TrendingUp,
  Play,
  Square,
  AlertTriangle,
  Search,
  Check,
  X,
  UserPlus
} from 'lucide-react';
import { Button, Input, Badge, Card, Modal, Heading, Label } from '../components/UI';
import { MOCK_JOBS, MOCK_CLIENTS, MOCK_TEAM } from '../services/mockData';
import { Job, JobStage, JobType, JobPiece, PieceStatus, JobHistoryEntry, TeamMember } from '../types';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'briefing' | 'pieces' | 'timeline'>('briefing');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Estados de Atribuição (Assign to UI)
  const [assigningPieceId, setAssigningPieceId] = useState<string | null>(null);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [tempAssignees, setTempAssignees] = useState<string[]>([]);

  // Estados de Confirmação de Exclusão
  const [isDeleteJobModalOpen, setIsDeleteJobModalOpen] = useState(false);
  const [pieceToDelete, setPieceToDelete] = useState<JobPiece | null>(null);

  // Estados do Time Tracking
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [activeTimers, setActiveTimers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(currentActive => {
        const anyActive = Object.values(currentActive).some(v => v);
        if (!anyActive) return currentActive;
        setTimers(prevTimers => {
          const newTimers = { ...prevTimers };
          Object.keys(currentActive).forEach(pieceId => {
            if (currentActive[pieceId]) {
              newTimers[pieceId] = (newTimers[pieceId] || 0) + 1;
            }
          });
          return newTimers;
        });
        return currentActive;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (pieceId: string) => {
    setActiveTimers(prev => ({ ...prev, [pieceId]: !prev[pieceId] }));
    if (activeTimers[pieceId] && job) {
      const newHistory: JobHistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        user: MOCK_TEAM[0].name,
        action: `Pausou timer na peça: ${job.pieces?.find(p => p.id === pieceId)?.name}`
      };
      setJob({ ...job, history: [newHistory, ...(job.history || [])] });
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).join(":");
  };

  useEffect(() => {
    const foundJob = MOCK_JOBS.find(j => j.id === id);
    if (foundJob) {
      setJob({
        ...foundJob,
        dropboxLinks: foundJob.dropboxLinks || [],
        pieces: foundJob.pieces || [],
        history: foundJob.history || []
      });
    }
    setLoading(false);
  }, [id]);

  const handleSave = () => {
    if (job) {
        const newHistory: JobHistoryEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            user: MOCK_TEAM[0].name,
            action: 'Job atualizado manualmente'
        };
        setJob({ ...job, history: [newHistory, ...(job.history || [])] });
    }
  };

  const confirmDeleteJob = () => {
    console.log("Job excluído:", job?.id);
    navigate('/jobs');
  };

  const confirmDeletePiece = () => {
    if (job && pieceToDelete) {
      setJob({
        ...job,
        pieces: job.pieces?.filter(p => p.id !== pieceToDelete.id),
        history: [{
          id: Date.now().toString(),
          date: new Date().toLocaleString(),
          user: MOCK_TEAM[0].name,
          action: `Excluiu a peça: ${pieceToDelete.name}`
        }, ...(job.history || [])]
      });
      setPieceToDelete(null);
    }
  };

  const handleAddLink = () => {
    if (job) setJob({ ...job, dropboxLinks: [...(job.dropboxLinks || []), ""] });
  };

  const handleUpdateLink = (index: number, value: string) => {
    if (job) {
      const newLinks = [...(job.dropboxLinks || [])];
      newLinks[index] = value;
      setJob({ ...job, dropboxLinks: newLinks });
    }
  };

  const handleRemoveLink = (index: number) => {
    if (job) {
      const newLinks = [...(job.dropboxLinks || [])].filter((_, i) => i !== index);
      setJob({ ...job, dropboxLinks: newLinks });
    }
  };

  const handleAddPiece = () => {
    if (job) {
      const newPiece: JobPiece = {
        id: Date.now().toString(),
        name: 'Nova Peça',
        type: JobType.DIGITAL,
        format: '',
        assigneeIds: [],
        content: '',
        status: PieceStatus.PENDING
      };
      setJob({ ...job, pieces: [...(job.pieces || []), newPiece] });
    }
  };

  const updatePieceStatus = (pieceId: string, status: PieceStatus) => {
    if (job) {
      setJob({
        ...job,
        pieces: job.pieces?.map(p => p.id === pieceId ? { ...p, status } : p)
      });
    }
  };

  const updatePieceField = (pieceId: string, field: keyof JobPiece, value: any) => {
    if (job) {
      setJob({
        ...job,
        pieces: job.pieces?.map(p => p.id === pieceId ? { ...p, [field]: value } : p)
      });
    }
  };

  // Funções de Atribuição (Assign to)
  const openAssigneeSelector = (piece: JobPiece) => {
    setAssigningPieceId(piece.id);
    setTempAssignees([...piece.assigneeIds]);
    setAssigneeSearch('');
  };

  const toggleAssigneeInTemp = (memberId: string) => {
    if (tempAssignees.includes(memberId)) {
      setTempAssignees(tempAssignees.filter(id => id !== memberId));
    } else {
      setTempAssignees([...tempAssignees, memberId]);
    }
  };

  const confirmAssignment = () => {
    if (job && assigningPieceId) {
      updatePieceField(assigningPieceId, 'assigneeIds', tempAssignees);
      setAssigningPieceId(null);
    }
  };

  const filteredTeamMembers = useMemo(() => {
    return MOCK_TEAM.filter(member => 
      member.name.toLowerCase().includes(assigneeSearch.toLowerCase())
    );
  }, [assigneeSearch]);

  const progressStats = React.useMemo(() => {
    if (!job || !job.pieces) return { total: 0, completed: 0, percent: 0 };
    const total = job.pieces.length;
    const completed = job.pieces.filter(p => p.status === PieceStatus.DONE || p.status === PieceStatus.APPROVED).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [job]);

  if (loading) return <div className="p-10 text-center text-gray-900 font-bold uppercase tracking-widest animate-pulse">Carregando detalhes do Job...</div>;
  if (!job) return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold text-gray-900 uppercase">Job não encontrado</h2>
        <Button onClick={() => navigate('/jobs')} variant="outline"><ArrowLeft size={16} className="mr-2"/> Voltar para Jobs</Button>
    </div>
  );

  return (
    <div className="w-full pb-20">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
        <div className="p-8 pb-4 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/jobs')} className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-red-50 transition-all border border-gray-100 shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div className="space-y-1">
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                    <span className="text-primary">{job.clientName}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-400 font-bold">{job.id}</span>
                    <Badge variant="outline" className="ml-2 text-[9px] py-0.5 px-3 rounded-lg border-gray-200 text-gray-500 font-black">
                        {job.stage}
                    </Badge>
                </div>
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input 
                      autoFocus
                      className="text-4xl font-black text-gray-900 uppercase tracking-tighter bg-white border-b-2 border-primary focus:outline-none w-full"
                      value={job.title}
                      onChange={(e) => setJob({...job, title: e.target.value})}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    />
                  </div>
                ) : (
                  <div className="group flex items-center gap-3 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter truncate group-hover:text-primary transition-colors leading-none">
                        {job.title}
                    </h1>
                    <Edit3 size={18} className="text-gray-200 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                )}
            </div>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progresso de Entregas</span>
                </div>
                <span className="text-[11px] font-black text-primary uppercase tracking-widest">{progressStats.percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${progressStats.percent}%` }} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                {progressStats.completed} de {progressStats.total} peças concluídas
            </p>
          </div>
        </div>

        <div className="mx-8 border-t border-gray-50" />

        <div className="px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-8">
              {[
                { id: 'briefing', label: 'Briefing', icon: Briefcase },
                { id: 'pieces', label: 'Peças', icon: Layout },
                { id: 'timeline', label: 'Timeline', icon: History }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-1 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 relative ${
                    activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-primary" />}
                </button>
              ))}
          </div>
          <Button variant="outline" className="font-black uppercase text-[10px] tracking-widest gap-2 bg-white border-gray-200 h-10 px-6 rounded-lg text-gray-700 hover:bg-gray-50" onClick={handleSave}>
            <Save size={16} /> Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 min-w-0">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'briefing' && (
              <div className="space-y-8">
                <Card className="p-10">
                  <div className="flex items-center gap-3 mb-8 border-l-4 border-primary pl-5">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Detalhamento do Briefing</h2>
                  </div>
                  <textarea 
                    className="w-full min-h-[300px] bg-white border-2 border-gray-100 rounded-3xl p-8 text-gray-700 text-sm leading-relaxed focus:outline-none focus:border-primary transition-all placeholder:text-gray-300 font-medium"
                    placeholder="Descreva aqui o objetivo, público-alvo, tom de voz e demais instruções para o time criativo..."
                    value={job.description || ''}
                    onChange={(e) => setJob({...job, description: e.target.value})}
                  />
                </Card>

                <Card className="p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-5">
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Arquivos & Referências</h2>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddLink} className="font-black uppercase text-[10px] tracking-widest gap-2">
                        <Plus size={14} /> Adicionar Link
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {job.dropboxLinks?.map((link, index) => (
                      <div key={index} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <Input className="pl-12 h-14 rounded-2xl border-2 border-gray-100 font-bold text-gray-700 bg-white" placeholder="Link do Dropbox" value={link} onChange={(e) => handleUpdateLink(index, e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => window.open(link, '_blank')} className="p-4 bg-white text-gray-400 hover:text-primary hover:bg-red-50 border border-gray-100 rounded-2xl transition-all"><ExternalLink size={20} /></button>
                          <button onClick={() => handleRemoveLink(index)} className="p-4 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 rounded-2xl transition-all"><Trash size={20} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'pieces' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-5">
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Peças do Job</h2>
                    </div>
                    <Button onClick={handleAddPiece} className="font-black uppercase text-[10px] tracking-widest gap-2 px-8 h-12 shadow-lg shadow-red-900/20">
                        <Plus size={18} /> Nova Peça
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {job.pieces?.map((piece) => {
                    const isTimerRunning = activeTimers[piece.id];
                    const time = timers[piece.id] || 0;
                    const pieceAssignees = MOCK_TEAM.filter(m => piece.assigneeIds.includes(m.id));

                    return (
                      <Card key={piece.id} className="p-0 overflow-hidden border-2 border-gray-100 group relative">
                        <div className="flex flex-col md:flex-row">
                          <div className={`w-3 shrink-0 ${piece.status === PieceStatus.APPROVED ? 'bg-green-500' : piece.status === PieceStatus.REDO ? 'bg-orange-500' : piece.status === PieceStatus.DONE ? 'bg-blue-500' : 'bg-gray-200'}`} />
                          <div className="p-8 flex-1 bg-white grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                            <div className="md:col-span-3 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <Badge variant="red" className="scale-110">{piece.status}</Badge>
                                  <input className="text-2xl font-black text-gray-900 uppercase tracking-tight bg-white border-b-2 border-transparent focus:border-primary focus:outline-none" value={piece.name} onChange={(e) => updatePieceField(piece.id, 'name', e.target.value)} />
                               </div>
                               <div className="flex items-center gap-4 bg-gray-50 p-2 pl-4 rounded-2xl border border-gray-100">
                                  <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Duração</span>
                                    <span className={`text-sm font-black tracking-tighter ${isTimerRunning ? 'text-primary animate-pulse' : 'text-gray-900'}`}>{formatTime(time)}</span>
                                  </div>
                                  <button onClick={() => toggleTimer(piece.id)} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-lg ${isTimerRunning ? 'bg-primary text-white hover:bg-primaryDark animate-pulse' : 'bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-100'}`}>
                                    {isTimerRunning ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                                  </button>
                               </div>
                            </div>

                            {/* CONFIGURAÇÕES: 1/3 do box */}
                            <div className="space-y-6 md:col-span-1">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</label>
                                  <select className="w-full h-11 rounded-xl border-2 border-gray-100 bg-white text-gray-900 px-4 text-xs font-bold focus:border-primary outline-none" value={piece.type} onChange={(e) => updatePieceField(piece.id, 'type', e.target.value)}>
                                    <option value={JobType.DIGITAL}>Digital</option>
                                    <option value={JobType.OFFLINE}>Offline</option>
                                  </select>
                                </div>
                                <Input label="Formato" className="h-11 border-2 border-gray-100 font-bold text-xs bg-white text-gray-900" value={piece.format} onChange={(e) => updatePieceField(piece.id, 'format', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Responsáveis</label>
                                  <div className="flex items-center gap-2">
                                     <div className="flex -space-x-2 overflow-hidden">
                                        {pieceAssignees.map(m => (
                                          <div key={m.id} className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden bg-gray-100" title={m.name}>
                                            <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                                          </div>
                                        ))}
                                        {pieceAssignees.length === 0 && (
                                          <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                            <User size={16} />
                                          </div>
                                        )}
                                     </div>
                                     <button 
                                        onClick={() => openAssigneeSelector(piece)}
                                        className="h-10 w-10 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center group"
                                     >
                                        <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                                     </button>
                                  </div>
                              </div>
                            </div>

                            {/* CONTEÚDO: 2/3 do box */}
                            <div className="space-y-6 md:col-span-2">
                              <div className="space-y-1">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conteúdo / Texto</label>
                                  <textarea className="w-full min-h-[140px] rounded-xl border-2 border-gray-100 bg-white text-gray-900 p-4 text-xs font-medium focus:border-primary outline-none" placeholder="Insira o texto da peça ou instruções detalhadas..." value={piece.content} onChange={(e) => updatePieceField(piece.id, 'content', e.target.value)} />
                              </div>
                              <Input label="Link da Arte Final" icon={ExternalLink} className="h-11 border-2 border-gray-100 font-bold text-xs bg-white text-gray-900" placeholder="Link para o Dropbox ou Drive..." value={piece.finalArtLink} onChange={(e) => updatePieceField(piece.id, 'finalArtLink', e.target.value)} />
                            </div>

                            <div className="md:col-span-3 border-t border-gray-50 pt-6 flex items-center justify-between">
                              <div className="flex gap-2">
                                 <Button variant={piece.status === PieceStatus.DONE ? 'primary' : 'outline'} size="sm" onClick={() => updatePieceStatus(piece.id, PieceStatus.DONE)}><CheckCircle2 size={14} className="mr-2" /> Concluído</Button>
                                 <Button variant={piece.status === PieceStatus.APPROVED ? 'primary' : 'outline'} size="sm" className="border-green-200 text-green-700 hover:bg-green-50" onClick={() => updatePieceStatus(piece.id, PieceStatus.APPROVED)}><CheckCircle2 size={14} className="mr-2" /> Aprovado</Button>
                                 <Button variant={piece.status === PieceStatus.REDO ? 'danger' : 'outline'} size="sm" onClick={() => updatePieceStatus(piece.id, PieceStatus.REDO)}><RotateCcw size={14} className="mr-2" /> Refação</Button>
                              </div>
                              <button className="text-gray-300 hover:text-red-500 transition-colors p-2" onClick={() => setPieceToDelete(piece)}>
                                <Trash size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <Card className="p-10">
                <div className="flex items-center gap-3 mb-10 border-l-4 border-primary pl-5">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Histórico</h2>
                </div>
                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {job.history?.map((entry) => (
                    <div key={entry.id} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 shadow-sm"><div className="w-2 h-2 rounded-full bg-primary" /></div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{entry.user}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{entry.date}</span>
                         </div>
                         <p className="text-sm font-bold text-gray-900">{entry.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <aside className="space-y-6">
            <Card className="p-8 sticky top-8 bg-white">
                <div className="space-y-8">
                  <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Status</label>
                      <select className="w-full h-12 rounded-xl border-2 border-gray-100 bg-white text-gray-900 px-4 text-xs font-black uppercase tracking-tight focus:border-primary outline-none" value={job.stage} onChange={(e) => setJob({...job, stage: e.target.value as JobStage})}>
                          {Object.values(JobStage).map(stage => <option key={stage} value={stage}>{stage}</option>)}
                      </select>
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Deadline</label>
                      <Input type="date" className="h-12 border-2 border-gray-100 font-bold bg-white text-gray-900" value={job.deadline} onChange={(e) => setJob({...job, deadline: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Responsável</label>
                      <select className="w-full h-12 rounded-xl border-2 border-gray-100 bg-white text-gray-900 px-4 text-xs font-bold focus:border-primary outline-none" value={job.assigneeId} onChange={(e) => setJob({...job, assigneeId: e.target.value})}>
                          {MOCK_TEAM.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                  </div>
                  <div className="h-px bg-gray-50" />
                  <div className="pt-4">
                     <Button variant="danger" className="w-full h-12 font-black uppercase text-[10px] tracking-widest gap-2 opacity-50 hover:opacity-100 transition-opacity" onClick={() => setIsDeleteJobModalOpen(true)}>
                        <Trash2 size={16} /> Excluir Job
                     </Button>
                  </div>
                </div>
            </Card>
        </aside>
      </div>

      {/* NOVO MODAL: SELETOR DE RESPONSÁVEIS (ASSIGN TO) */}
      <Modal 
        isOpen={assigningPieceId !== null} 
        onClose={() => setAssigningPieceId(null)} 
        title="Atribuir a"
        className="max-w-md"
        footer={
          <div className="flex w-full gap-4">
            <Button onClick={confirmAssignment} className="flex-1 h-14 bg-[#007AFF] hover:bg-[#0066CC] shadow-none">Atribuir</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex -space-x-2">
                {tempAssignees.map(id => {
                  const member = MOCK_TEAM.find(m => m.id === id);
                  return (
                    <div key={id} className="h-12 w-12 rounded-full ring-4 ring-white overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                      <img src={member?.avatar} alt={member?.name} className="h-full w-full object-cover" />
                    </div>
                  );
                })}
             </div>
             <button onClick={() => setAssigningPieceId(null)} className="text-sm font-bold text-gray-400 hover:text-gray-600">Cancelar</button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              className="w-full h-12 pl-12 pr-6 rounded-xl border-none bg-gray-50 text-sm font-medium focus:ring-0 placeholder:text-gray-400"
              placeholder="Encontrar usuários"
              value={assigneeSearch}
              onChange={(e) => setAssigneeSearch(e.target.value)}
            />
          </div>

          <div className="max-h-72 overflow-y-auto custom-scrollbar -mx-2 px-2">
            <div className="space-y-1">
              {filteredTeamMembers.map((member) => {
                const isSelected = tempAssignees.includes(member.id);
                return (
                  <button 
                    key={member.id}
                    onClick={() => toggleAssigneeInTemp(member.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{member.name}</span>
                    </div>
                    {isSelected && <Check size={20} className="text-[#007AFF]" />}
                  </button>
                );
              })}
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                  <User size={20} />
                </div>
                <span className="text-sm font-bold">Não atribuído</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL CONFIRMAÇÃO EXCLUIR JOB */}
      <Modal 
        isOpen={isDeleteJobModalOpen} 
        onClose={() => setIsDeleteJobModalOpen(false)} 
        title="Confirmar Exclusão do Job"
        footer={
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDeleteJobModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDeleteJob}>Confirmar Exclusão</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
                <Heading level={3}>Atenção!</Heading>
                <p className="text-sm font-medium text-gray-500">Você está prestes a excluir the Job <span className="text-gray-900 font-black">{job.title}</span>. Esta ação não pode ser desfeita e removerá todo o histórico e peças associadas.</p>
            </div>
        </div>
      </Modal>

      {/* MODAL CONFIRMAÇÃO EXCLUIR PEÇA */}
      <Modal 
        isOpen={pieceToDelete !== null} 
        onClose={() => setPieceToDelete(null)} 
        title="Confirmar Exclusão da Peça"
        footer={
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setPieceToDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDeletePiece}>Confirmar Exclusão</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <Trash2 size={40} />
            </div>
            <div className="space-y-2">
                <Heading level={3}>Deseja remover esta peça?</Heading>
                <p className="text-sm font-medium text-gray-500">A peça <span className="text-gray-900 font-black">{pieceToDelete?.name}</span> será removida permanentemente deste job.</p>
            </div>
        </div>
      </Modal>
    </div>
  );
};
