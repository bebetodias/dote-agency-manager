
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { Card, Badge, Heading, Label, Button } from '../../../components/UI';
import { JobStage, PieceStatus } from '../../../types';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; subtext?: string; trend?: { val: string, positive: boolean } }> = ({ title, value, icon: Icon, subtext, trend }) => (
  <Card className="p-8 hover:shadow-xl transition-all group border-none bg-white">
    <div className="flex items-center justify-between mb-6">
      <Label className="mb-0">{title}</Label>
      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors">
        <Icon className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
      </div>
    </div>
    <div className="flex flex-col">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] font-bold uppercase tracking-wider ${trend.positive ? 'text-green-500' : 'text-primary'}`}>
            {trend.positive ? '↑' : '↓'} {trend.val}
          </span>
        )}
      </div>
      {subtext && <span className="text-xs font-medium text-gray-400 mt-2">{subtext}</span>}
    </div>
  </Card>
);

const DashboardCalendar: React.FC<{ monthEvents: any[] }> = ({ monthEvents }) => {
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

  const eventsThisMonth = monthEvents.filter((d: any) => d.month === currentMonth + 1); // JS getMonth is 0-indexed, DB is 1-indexed

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-primary shrink-0" />
          <h3 className="text-sm font-semibold text-gray-900">Calendário</h3>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-gray-900"><ChevronLeft size={14} /></button>
          <span className="text-[10px] font-bold px-2 text-center text-gray-600">{monthNames[currentMonth].substring(0, 3).toUpperCase()}</span>
          <button onClick={handleNextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-gray-900"><ChevronRight size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <span key={`${d}-${i}`} className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: startDay }).map((_, i) => (<div key={`empty-${i}`} className="h-8" />))}
        {Array.from({ length: days }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = eventsThisMonth.filter((e: any) => e.day === dayNum);
          const hasGeneral = dayEvents.some(e => !e.clientId);
          const hasClient = dayEvents.some(e => e.clientId);

          return (
            <div key={dayNum} className="h-9 relative flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-default group transition-all">
              <span className="text-xs font-normal text-gray-700">{dayNum}</span>
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

export default function DashboardClient({ currentUser, jobs, commemorativeDates, teamMembers }: { currentUser: any, jobs: any[], commemorativeDates: any[], teamMembers: any[] }) {
  const router = useRouter();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const myJobs = useMemo(() => {
    return jobs.filter(j => j.assigneeId === currentUser?.id);
  }, [jobs, currentUser?.id]);

  const upcomingAlerts = useMemo(() => {
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(today.getDate() + 15);

    return commemorativeDates.filter(date => {
      const eventDate = new Date(today.getFullYear(), date.month - 1, date.day);
      return eventDate >= today && eventDate <= fifteenDaysFromNow;
    });
  }, [commemorativeDates, today]);

  const stats = useMemo(() => {
    const monthJobs = jobs.filter(j => {
      if(!j.deadline) return false;
      const d = new Date(j.deadline);
      return d.toISOString().startsWith(todayStr.substring(0, 7));
    });
    const totalMonth = monthJobs.length;
    const completedOnTime = monthJobs.filter(j => {
      const isDone = j.stage === 'Veiculação';
      if(!j.deadline) return false;
      return isDone && new Date(j.deadline).toISOString().split('T')[0] >= todayStr;
    }).length;
    const onTimeRate = totalMonth > 0 ? Math.round((completedOnTime / totalMonth) * 100) : 0;

    const allPieces = jobs.flatMap(j => j.pieces || []);
    const completedPieces = allPieces.filter(p => p.status === PieceStatus.DONE || p.status === PieceStatus.APPROVED).length;

    return {
      totalMonth,
      onTimeRate,
      completedPieces,
      totalTime: '124h 40m',
      productivity: '0.62'
    };
  }, [todayStr]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Heading level={1}>Dashboard</Heading>
          <p className="text-gray-400 font-medium text-sm">Gestão Operacional de Pauta</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-700">Equipe Online: 12</span>
          </div>
          <Badge variant="outline" className="h-10 px-4 bg-white border-gray-100 font-semibold text-xs">
            {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card className="p-0 border-none shadow-xl bg-white overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3 border-l-4 border-primary pl-5">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Meus Jobs</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/jobs')} className="text-primary font-bold text-xs">
                Ver todos os jobs <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
            <div className="overflow-x-auto px-4 pb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Job</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Prazo</th>
                    <th className="px-6 py-4 text-center">Escala</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myJobs.map((job) => {
                    const isOverdue = job.deadline && new Date(job.deadline).toISOString().split('T')[0] < todayStr && job.stage !== 'Veiculação';
                    const assignee = teamMembers.find(t => t.id === job.assigneeId);

                    return (
                      <tr
                        key={job.id}
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className={`hover:bg-gray-50 transition-all cursor-pointer group ${isOverdue ? 'bg-red-50/30' : ''}`}
                      >
                        <td className="px-6 py-6">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{job.title}</span>
                          <div className="text-[11px] font-medium text-gray-400 mt-1">{job.id}</div>
                        </td>
                        <td className="px-6 py-6 font-bold text-xs text-primary">{job.client?.name || job.clientName}</td>
                        <td className="px-6 py-6">
                          <Badge variant="outline" className="border-gray-200 text-gray-500 bg-white text-[10px] py-1">{job.stage}</Badge>
                        </td>
                        <td className="px-6 py-6">
                          <div className={`flex items-center gap-2 text-xs font-semibold ${isOverdue ? 'text-primary animate-pulse' : 'text-gray-900'}`}>
                            <Clock size={14} />
                            {new Date(job.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center">
                            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-100" title={assignee?.name}>
                              {assignee?.avatar ? (
                                <img src={assignee.avatar} alt={assignee.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">
                                  {assignee?.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 border-none shadow-xl bg-white">
            <DashboardCalendar monthEvents={commemorativeDates} />
          </Card>

          <Card className="p-8 border-none shadow-xl bg-white">
            <div className="flex items-center gap-3 mb-6">
              <BellRing size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-gray-900">Lembretes</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-all" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">Reunião de Pauta Geral</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Hoje, 14:00h</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-300 shrink-0 group-hover:scale-150 transition-all" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-500 truncate">Brainstorm Natal</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Amanhã, 10:00h</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Jobs no Mês" value={stats.totalMonth.toString()} icon={FileText} subtext={`${stats.onTimeRate}% entregues no prazo`} />
        <StatCard title="Peças Ativas" value={stats.completedPieces.toString()} icon={CheckCircle2} subtext="Volume histórico acumulado" />
        <StatCard title="Tempo Estimado" value={stats.totalTime} icon={Clock} subtext="Horas produtivas reais" />
        <StatCard title="Produtividade" value={stats.productivity} icon={Zap} subtext="Peças por minuto ativo" trend={{ val: '4%', positive: true }} />
      </div>
    </div>
  );
};
