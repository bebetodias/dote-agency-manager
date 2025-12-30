import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  DollarSign, 
  CheckSquare, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  BellRing, 
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle2,
  TrendingUp,
  User as UserIcon
} from 'lucide-react';
import { Card, Badge, Heading, Label, Button } from '../components/UI';
import { MOCK_TEAM, MOCK_DATES, MOCK_CLIENTS, MOCK_JOBS } from '../services/mockData';
import { JobStage, PieceStatus } from '../types';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; subtext?: string; trend?: { val: string, positive: boolean } }> = ({ title, value, icon: Icon, subtext, trend }) => (
  <Card className="p-8 hover:shadow-2xl transition-all group border-none bg-white">
    <div className="flex items-center justify-between mb-6">
      <Label className="mb-0">{title}</Label>
      <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-red-50 transition-colors">
        <Icon className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
      </div>
    </div>
    <div className="flex flex-col">
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-black text-gray-900 tracking-tighter">{value}</span>
        {trend && (
          <span className={`text-[10px] font-black uppercase tracking-widest ${trend.positive ? 'text-green-500' : 'text-primary'}`}>
            {trend.positive ? '↑' : '↓'} {trend.val}
          </span>
        )}
      </div>
      {subtext && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{subtext}</span>}
    </div>
  </Card>
);

const DashboardCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const days = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);

  const monthEvents = MOCK_DATES.filter(d => d.month === currentMonth);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-primary shrink-0" />
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Calendário</h3>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-gray-900"><ChevronLeft size={14}/></button>
          <span className="text-[9px] font-black w-[80px] text-center uppercase tracking-widest">{monthNames[currentMonth]}</span>
          <button onClick={handleNextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-gray-900"><ChevronRight size={14}/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
          <span key={d} className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: startDay }).map((_, i) => (<div key={`empty-${i}`} className="h-8" />))}
        {Array.from({ length: days }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = monthEvents.filter(e => e.day === dayNum);
          const hasGeneral = dayEvents.some(e => !e.clientId);
          const hasClient = dayEvents.some(e => e.clientId);

          return (
            <div key={dayNum} className="h-9 relative flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-default group transition-all">
              <span className="text-[11px] font-bold text-gray-700">{dayNum}</span>
              <div className="flex gap-0.5 mt-0.5">
                {hasGeneral && <div className="w-1 h-1 rounded-full bg-red-500" />}
                {hasClient && <div className="w-1 h-1 rounded-full bg-orange-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = MOCK_TEAM[0]; 
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Filtro Meus Jobs
  const myJobs = useMemo(() => {
    return MOCK_JOBS.filter(j => j.assigneeId === currentUser.id);
  }, [currentUser.id]);

  // Alertas Onboarding
  const upcomingAlerts = useMemo(() => {
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(today.getDate() + 15);

    return MOCK_DATES.filter(date => {
      const eventDate = new Date(today.getFullYear(), date.month, date.day);
      return eventDate >= today && eventDate <= fifteenDaysFromNow;
    });
  }, [today]);

  // Cálculos de Performance
  const stats = useMemo(() => {
    const monthJobs = MOCK_JOBS.filter(j => j.deadline.startsWith(todayStr.substring(0, 7)));
    const totalMonth = monthJobs.length;
    const completedOnTime = monthJobs.filter(j => {
        const isDone = j.stage === JobStage.LAUNCH;
        return isDone && j.deadline >= todayStr;
    }).length;
    const onTimeRate = totalMonth > 0 ? Math.round((completedOnTime / totalMonth) * 100) : 0;

    const allPieces = MOCK_JOBS.flatMap(j => j.pieces || []);
    const completedPieces = allPieces.filter(p => p.status === PieceStatus.DONE || p.status === PieceStatus.APPROVED).length;

    return {
        totalMonth,
        onTimeRate,
        completedPieces,
        totalTime: '124h 40m', // Mock
        productivity: '0.62' // Mock pieces/min
    };
  }, [todayStr]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
            <Heading level={1}>Dashboard</Heading>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Gestão Operacional de Pauta</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-gray-900 tracking-widest">Equipe Online: 12</span>
            </div>
            <Badge variant="outline" className="h-10 px-4 bg-white border-gray-100 font-black text-[10px] tracking-widest">
                {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* COLUNA ESQUERDA: MEUS JOBS (OPERACIONAL) */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="p-0 border-none shadow-xl bg-white overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3 border-l-4 border-primary pl-5">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Meus Jobs</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')} className="text-primary font-black uppercase text-[10px] tracking-widest">
                Ver todos os jobs <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
            <div className="overflow-x-auto px-4 pb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Job</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Prazo</th>
                    <th className="px-6 py-4 text-center">Responsáveis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myJobs.map((job) => {
                    const isOverdue = job.deadline < todayStr && job.stage !== JobStage.LAUNCH;
                    const assignee = MOCK_TEAM.find(t => t.id === job.assigneeId);
                    
                    return (
                      <tr 
                        key={job.id} 
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className={`hover:bg-gray-50 transition-all cursor-pointer group ${isOverdue ? 'bg-red-50/50 border-l-4 border-l-primary' : ''}`}
                      >
                        <td className="px-6 py-6">
                            <span className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors">{job.title}</span>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{job.id}</div>
                        </td>
                        <td className="px-6 py-6 font-black uppercase text-[10px] tracking-widest text-primary">{job.clientName}</td>
                        <td className="px-6 py-6">
                            <Badge variant="outline" className="border-gray-200 text-gray-500 bg-white scale-90">{job.stage}</Badge>
                        </td>
                        <td className="px-6 py-6">
                            <div className={`flex items-center gap-2 text-[11px] font-black ${isOverdue ? 'text-primary animate-pulse' : 'text-gray-900'}`}>
                                <Clock size={12} />
                                {new Date(job.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </div>
                        </td>
                        <td className="px-6 py-6">
                            <div className="flex justify-center">
                                <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-[9px] font-black uppercase border-2 border-white shadow-sm ring-1 ring-gray-100" title={assignee?.name}>
                                    {assignee?.name.substring(0,2).toUpperCase()}
                                </div>
                            </div>
                        </td>
                      </tr>
                    );
                  })}
                  {myJobs.length === 0 && (
                    <tr>
                        <td colSpan={5} className="py-20 text-center font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">
                            Você não possui jobs atribuídos no momento
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* COLUNA DIREITA: SIDETRACK (CALENDÁRIO, ALERTAS, LEMBRETES) */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-xl bg-white">
            <DashboardCalendar />
          </Card>

          {upcomingAlerts.length > 0 && (
            <Card className="p-8 border-none bg-orange-50/20 shadow-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle size={18} className="text-orange-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Alerta Onboarding</h3>
                </div>
                <div className="space-y-3">
                    {upcomingAlerts.slice(0, 2).map(alert => (
                        <div key={alert.id} className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all cursor-pointer">
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase text-gray-900 tracking-tight truncate">{alert.name}</p>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{alert.day}/{alert.month + 1}</span>
                            </div>
                            <Badge variant="red" className="scale-75 origin-right">Hoje</Badge>
                        </div>
                    ))}
                </div>
            </Card>
          )}

          <Card className="p-8 border-none shadow-xl bg-white">
            <div className="flex items-center gap-3 mb-6">
                <BellRing size={18} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Lembretes</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-all" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-tight text-gray-900 truncate">Reunião de Pauta GERAL</p>
                  <Label className="mb-0 mt-0.5 text-[8px]">Hoje, 14:00h</Label>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-300 shrink-0 group-hover:scale-150 transition-all" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-tight text-gray-400 truncate">Brainstorm Campanha Natal</p>
                  <Label className="mb-0 mt-0.5 text-[8px]">Amanhã, 10:00h</Label>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* RODAPÉ: MÉTRICAS DE PERFORMANCE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
            title="Jobs no Mês" 
            value={stats.totalMonth.toString()} 
            icon={FileText} 
            subtext={`${stats.onTimeRate}% no prazo`} 
            trend={{ val: '4%', positive: true }}
        />
        <StatCard 
            title="Peças Concluídas" 
            value={stats.completedPieces.toString()} 
            icon={CheckCircle2} 
            subtext="Acumulado histórico" 
            trend={{ val: '12%', positive: true }}
        />
        <StatCard 
            title="Total Timetracker" 
            value={stats.totalTime} 
            icon={Clock} 
            subtext="Horas produtivas reais" 
        />
        <StatCard 
            title="Peças / Min" 
            value={stats.productivity} 
            icon={Zap} 
            subtext="Índice de Produtividade" 
            trend={{ val: '0.05', positive: true }}
        />
      </div>
    </div>
  );
};
