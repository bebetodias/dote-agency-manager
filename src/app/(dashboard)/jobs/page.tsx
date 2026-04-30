"use client";


import React, { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Calendar, 
  ChevronRight, 
  User, 
  Clock, 
  Layers
} from 'lucide-react';
import { Button, Input, Modal, Badge, Heading, Label, Card } from '../../../components/UI';
import { MOCK_JOBS, MOCK_CLIENTS, MOCK_TEAM } from '../../../services/mockData';
import { Job, JobStage, JobType } from '../../../types';

const STAGES = Object.values(JobStage);
type ViewMode = 'my-jobs' | 'by-stage' | 'by-assignee' | 'timeline';

export default function JobsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('my-jobs');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);

  const currentUser = MOCK_TEAM[0];

  const [newJobData, setNewJobData] = useState<Partial<Job>>({
    stage: JobStage.BRIEFING,
    type: JobType.DIGITAL,
  });

  const dragItem = useRef<string | null>(null);

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

  const formatDateBr = (dateStr: string) => {
    if (!dateStr) return '--/--/----';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const MyJobsTable = () => {
    const myJobs = jobs.filter(j => j.assigneeId === currentUser.id);
    return (
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-xl">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold text-[11px] uppercase tracking-wider sticky top-0 z-20 backdrop-blur-md border-b border-gray-100">
              <tr>
                <th className="px-10 py-5">Job</th>
                <th className="px-10 py-5">Cliente</th>
                <th className="px-10 py-5">Prazo</th>
                <th className="px-10 py-5">Etapa</th>
                <th className="px-10 py-5">Peças</th>
                <th className="px-10 py-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50/80 cursor-pointer group transition-colors" onClick={() => router.push(`/jobs/${job.id}`)}>
                  <td className="px-10 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{job.title}</span>
                      <span className="text-[10px] font-medium text-gray-400 mt-1">{job.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-5 font-bold text-xs text-primary">{job.clientName}</td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                      <Calendar size={14} className="text-primary"/>
                      {formatDateBr(job.deadline)}
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <Badge variant="outline" className="text-[10px] font-semibold py-1 px-3 bg-white">{job.stage}</Badge>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-2">
                      <Badge variant="red" className="px-2 py-0.5 text-[9px]">{job.pieces?.length || 0}</Badge>
                      <span className="text-[10px] font-medium text-gray-400">Ativos</span>
                    </div>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))}
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
            className="w-[320px] h-full flex flex-col rounded-[2rem] border border-gray-100 transition-all duration-300 shrink-0 bg-white shadow-xl"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropStage(e, col)}
          >
            <div className="p-8 pb-4 flex items-center justify-between sticky top-0 z-10 text-gray-900">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">{col}</h3>
                <p className="text-[11px] font-medium text-gray-400">{colJobs.length} {colJobs.length === 1 ? 'Job' : 'Jobs'}</p>
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold bg-gray-50 text-gray-600 border border-gray-100">
                {colJobs.length}
              </div>
            </div>
            <div className="px-6 pb-8 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {colJobs.map((job) => {
                const assignee = MOCK_TEAM.find(t => t.id === job.assigneeId);
                return (
                  <div key={job.id} draggable onDragStart={(e) => handleDragStart(e, job.id)} onDragEnd={handleDragEnd} onClick={() => router.push(`/jobs/${job.id}`)} className="p-5 rounded-2xl border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-xl hover:border-primary/10 transition-all group bg-white">
                     <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 block">{job.clientName}</span>
                     <h4 className="text-[13px] font-semibold mb-4 leading-tight group-hover:text-primary transition-colors text-gray-900">{job.title}</h4>
                     <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                              {assignee?.avatar ? (
                                <img src={assignee.avatar} alt={assignee.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center text-[9px] font-bold">
                                  {assignee?.name.substring(0,2).toUpperCase()}
                                </div>
                              )}
                           </div>
                           <span className="text-[11px] font-medium text-gray-600">{assignee?.name.split(' ')[0]}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5"><Clock size={12} className="text-primary"/> {formatDateBr(job.deadline).substring(0,5)}</span>
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

  return (
    <div className="fixed inset-0 md:left-60 bg-[#F8F9FA] flex flex-col overflow-hidden">
      <div className="relative z-20 px-8 pt-8 pb-6 flex flex-col md:flex-row items-end justify-between shrink-0 gap-6">
        <div className="w-full md:w-auto">
          <Heading level={1}>Pauta de Jobs</Heading>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 md:pb-0 scroll-hide">
             {[
               { id: 'my-jobs', label: 'Meus Jobs', icon: User },
               { id: 'by-stage', label: 'Por Etapa', icon: Layers },
             ].map(mode => (
               <button 
                key={mode.id}
                onClick={() => setViewMode(mode.id as ViewMode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  viewMode === mode.id ? 'bg-primary text-white shadow-lg shadow-red-500/10' : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
                }`}
               >
                 <mode.icon size={14} /> {mode.label}
               </button>
             ))}
          </div>
        </div>

        <Button onClick={() => setIsNewJobOpen(true)} size="lg" className="px-8 h-12 shadow-lg shadow-red-500/10">
          <Plus size={18} className="mr-2" strokeWidth={2.5} /> Novo Job
        </Button>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden px-8 pb-8">
        {viewMode === 'my-jobs' && <MyJobsTable />}
        {viewMode === 'by-stage' && <KanbanByStage />}
      </div>

      <Modal isOpen={isNewJobOpen} onClose={() => setIsNewJobOpen(false)} title="Lançar Novo Job">
        <div className="space-y-6">
            <Input label="Título do Job" placeholder="Ex: Campanha de Natal 2024" value={newJobData.title} onChange={e => setNewJobData({...newJobData, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Deadline" type="date" onChange={(e) => setNewJobData({...newJobData, deadline: e.target.value})} />
              <div className="space-y-1">
                <Label>Responsável</Label>
                <select className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50/30 px-6 text-sm font-semibold focus:border-primary outline-none" onChange={(e) => setNewJobData({...newJobData, assigneeId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {MOCK_TEAM.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <Button className="w-full h-14">Lançar Job</Button>
        </div>
      </Modal>
    </div>
  );
};
