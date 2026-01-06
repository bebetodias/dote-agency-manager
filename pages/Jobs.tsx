
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  List, 
  Layout, 
  MoreVertical, 
  Calendar, 
  ChevronRight, 
  Search, 
  User, 
  Target,
  Trash2,
  Users,
  Clock,
  Layers
} from 'lucide-react';
import { Button, Input, Modal, Badge, Heading, Label, SearchInput, Card } from '../components/UI';
import { MOCK_JOBS, MOCK_CLIENTS, MOCK_TEAM } from '../services/mockData';
import { Job, JobStage, JobType } from '../types';

const STAGES = Object.values(JobStage);
type ViewMode = 'my-jobs' | 'by-stage' | 'by-assignee' | 'timeline';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('my-jobs');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

  // Usuário "logado" para o filtro de Meus Jobs
  const currentUser = MOCK_TEAM[0];

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

  const handleDropStage = (e: React.DragEvent, col: JobStage) => {
    e.preventDefault();
    if (!dragItem.current) return;
    const jobId = dragItem.current;
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, stage: col } : job));
  };

  const handleDropAssignee = (e: React.DragEvent, memberId: string) => {
    e.preventDefault();
    if (!dragItem.current) return;
    const jobId = dragItem.current;
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, assigneeId: memberId } : job));
  };

  const formatDateBr = (dateStr: string) => {
    if (!dateStr) return '--/--/----';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  // --- COMPONENTES DE VISUALIZAÇÃO ---

  const MyJobsTable = () => {
    const myJobs = jobs.filter(j => j.assigneeId === currentUser.id);
    return (
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-xl">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-400 font-black uppercase tracking-widest text-[10px] sticky top-0 z-20 backdrop-blur-md">
              <tr>
                <th className="px-10 py-6">Job</th>
                <th className="px-10 py-6">Cliente</th>
                <th className="px-10 py-6">Prazo</th>
                <th className="px-10 py-6">Etapa</th>
                <th className="px-10 py-6">Peças</th>
                <th className="px-10 py-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50/80 cursor-pointer group transition-colors" onClick={() => navigate(`/jobs/${job.id}`)}>
                  <td className="px-10 py-5">
                    <div className="flex flex-col">
                      <span className="text-base font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight">{job.title}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{job.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-5 font-black uppercase text-[10px] tracking-widest text-primary">{job.clientName}</td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                      <Calendar size={14} className="text-primary"/>
                      {formatDateBr(job.deadline)}
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <Badge variant="outline" className="text-[9px] px-3 py-1 bg-white">{job.stage}</Badge>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-2">
                      <Badge variant="red" className="px-2 py-0.5">{job.pieces?.length || 0}</Badge>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ativos</span>
                    </div>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))}
              {myJobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">Nenhum job atribuído a você</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  const KanbanByStage = () => (
    <div className="h-full overflow-x-auto flex gap-6 custom-scrollbar pb-4 select-none">
      {STAGES.map((col) => {
        const colJobs = jobs.filter(j => j.stage === col);
        return (
          <div 
            key={col} 
            className="w-[340px] h-full flex flex-col rounded-[2.5rem] border-2 transition-all duration-500 shrink-0 bg-white shadow-xl border-gray-100"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropStage(e, col)}
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
                  <div key={job.id} draggable onDragStart={(e) => handleDragStart(e, job.id)} onDragEnd={handleDragEnd} onClick={() => navigate(`/jobs/${job.id}`)} className="p-6 rounded-3xl border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-2xl transition-all group border-l-4 border-l-primary bg-white border-gray-100">
                     <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{job.clientName}</span>
                     <h4 className="text-base font-black mb-6 leading-tight group-hover:text-primary transition-colors tracking-tight text-gray-900">{job.title}</h4>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-[9px] font-black border border-white shadow-lg">{assignee?.name.substring(0,2).toUpperCase()}</div>
                           <span className="text-[10px] font-bold text-gray-700">{assignee?.name.split(' ')[0]}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-gray-900 flex items-center gap-1"><Clock size={12} className="text-primary"/> {formatDateBr(job.deadline).substring(0,5)}</span>
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
  );

  const KanbanByAssignee = () => (
    <div className="h-full overflow-x-auto flex gap-6 custom-scrollbar pb-4 select-none">
      {MOCK_TEAM.map((member) => {
        const memberJobs = jobs.filter(j => j.assigneeId === member.id);
        return (
          <div 
            key={member.id} 
            className="w-[340px] h-full flex flex-col rounded-[2.5rem] border-2 transition-all duration-500 shrink-0 bg-white shadow-xl border-gray-100"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropAssignee(e, member.id)}
          >
            <div className="p-8 pb-4 flex items-center justify-between sticky top-0 z-10 text-gray-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
                  <img src={member.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black uppercase tracking-widest">{member.name.split(' ')[0]}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{member.role}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-xs font-black bg-gray-900 text-white">
                {memberJobs.length}
              </div>
            </div>
            <div className="px-6 pb-8 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
              {memberJobs.map((job) => (
                <div key={job.id} draggable onDragStart={(e) => handleDragStart(e, job.id)} onDragEnd={handleDragEnd} onClick={() => navigate(`/jobs/${job.id}`)} className="p-6 rounded-3xl border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-2xl transition-all group border-l-4 border-l-red-500 bg-white border-gray-100">
                   <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{job.clientName}</span>
                   <h4 className="text-base font-black mb-6 leading-tight group-hover:text-primary transition-colors tracking-tight text-gray-900">{job.title}</h4>
                   <div className="flex items-center justify-between">
                      <Badge variant="outline" className="scale-90 text-gray-400 px-3">{job.stage}</Badge>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-gray-900 flex items-center gap-1"><Clock size={12} className="text-primary"/> {formatDateBr(job.deadline).substring(0,5)}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const TimelineView = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-xl bg-white">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-30 bg-gray-900 text-white">
              <tr>
                <th className="p-6 text-left w-64 border-r border-gray-800 shrink-0 sticky left-0 z-40 bg-gray-900">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Responsável</span>
                </th>
                {days.map(day => (
                  <th key={day} className={`p-4 min-w-[100px] text-center border-r border-gray-800 ${day === today.getDate() ? 'bg-primary' : ''}`}>
                    <span className="text-xs font-black block">{day}</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                      {new Date(today.getFullYear(), today.getMonth(), day).toLocaleDateString('pt-BR', { weekday: 'short' }).split('.')[0]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_TEAM.map(member => (
                <tr key={member.id} className="group hover:bg-gray-50/50">
                  <td className="p-6 border-r border-gray-100 sticky left-0 z-20 bg-white group-hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                        <img src={member.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{member.name.split(' ')[0]}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{member.role}</span>
                      </div>
                    </div>
                  </td>
                  {days.map(day => {
                    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayJobs = jobs.filter(j => j.assigneeId === member.id && j.deadline === dateStr);
                    
                    return (
                      <td key={day} className={`p-2 border-r border-gray-50 align-top ${day === today.getDate() ? 'bg-red-50/10' : ''}`}>
                        <div className="space-y-1">
                          {dayJobs.map(job => (
                            <div 
                              key={job.id} 
                              onClick={() => navigate(`/jobs/${job.id}`)}
                              className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary transition-all cursor-pointer group/job"
                            >
                               <div className="text-[8px] font-black text-primary uppercase tracking-widest truncate mb-1">{job.clientName}</div>
                               <div className="text-[10px] font-black text-gray-900 leading-tight uppercase line-clamp-2">{job.title}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 md:left-60 bg-[#F3F4F6] flex flex-col overflow-hidden">
      {/* HEADER FIXO */}
      <div className="relative z-20 px-8 pt-8 pb-6 flex flex-col md:flex-row items-end justify-between shrink-0 gap-6">
        <div className="w-full md:w-auto">
          <Heading level={1}>Pauta de Jobs</Heading>
          <div className="flex gap-4 mt-4">
             {[
               { id: 'my-jobs', label: 'Meus Jobs', icon: User },
               { id: 'by-stage', label: 'Por Etapa', icon: Layers },
               { id: 'by-assignee', label: 'Por Responsável', icon: Users },
               { id: 'timeline', label: 'Timeline', icon: Clock }
             ].map(mode => (
               <button 
                key={mode.id}
                onClick={() => setViewMode(mode.id as ViewMode)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === mode.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-400 hover:text-gray-900 hover:shadow-md'
                }`}
               >
                 <mode.icon size={14} /> {mode.label}
               </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => setIsNewJobOpen(true)} size="lg" className="px-8 h-14">
            <Plus size={20} className="mr-2" strokeWidth={3} /> Novo Job
          </Button>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO DINÂMICA */}
      <div className="relative z-10 flex-1 overflow-hidden px-8 pb-8">
        {viewMode === 'my-jobs' && <MyJobsTable />}
        {viewMode === 'by-stage' && <KanbanByStage />}
        {viewMode === 'by-assignee' && <KanbanByAssignee />}
        {viewMode === 'timeline' && <TimelineView />}
      </div>

      {/* MODAL DE NOVO JOB (SIMPLIFICADO PARA O EXEMPLO) */}
      <Modal isOpen={isNewJobOpen} onClose={() => setIsNewJobOpen(false)} title="Lançar Novo Job">
        <div className="space-y-6">
            <Input label="Título do Job" placeholder="Ex: Campanha Natal" onChange={(e) => setNewJobData({...newJobData, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Deadline" type="date" onChange={(e) => setNewJobData({...newJobData, deadline: e.target.value})} />
              <div className="space-y-1">
                <Label>Responsável</Label>
                <select className="w-full h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/30 px-6 text-sm font-bold focus:border-primary outline-none" onChange={(e) => setNewJobData({...newJobData, assigneeId: e.target.value})}>
                  {MOCK_TEAM.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <Button onClick={() => {
              if (newJobData.title) {
                const job: Job = {
                  id: `JOB-${Math.floor(Math.random()*1000)}`,
                  title: newJobData.title,
                  clientId: '1',
                  clientName: 'TechSolutions Inc.',
                  type: JobType.DIGITAL,
                  stage: JobStage.BRIEFING,
                  assigneeId: newJobData.assigneeId || '1',
                  deadline: newJobData.deadline || '2024-12-25',
                  pieces: []
                };
                setJobs([job, ...jobs]);
                setIsNewJobOpen(false);
              }
            }} className="w-full h-14">Lançar Job</Button>
        </div>
      </Modal>
    </div>
  );
};
