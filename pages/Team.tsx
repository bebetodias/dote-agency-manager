import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, UserPlus, Search, Phone, ChevronRight } from 'lucide-react';
import { Card, Button, Badge, Heading, Label, SearchInput } from '../components/UI';
import { MOCK_TEAM } from '../services/mockData';
import { TeamRole } from '../types';

export const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredTeam = MOCK_TEAM.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles: TeamRole[] = ['Gestor', 'Designer', 'Creator', 'Videomaker', 'Atendimento', 'Financeiro'];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
          <Heading>Equipe Dote</Heading>
          <p className="text-gray-400 mt-2 font-bold uppercase text-xs tracking-widest">Gestão de Talentos</p>
        </div>
        <Button size="lg" className="px-10">
            <UserPlus size={18} className="mr-2" /> Novo Membro
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="max-w-md w-full">
            <SearchInput placeholder="Buscar colaborador..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select 
            className="h-14 px-6 bg-white rounded-2xl border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 focus:border-primary outline-none shadow-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
        >
            <option value="all">Todos os Cargos</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeam.map((member) => (
            <Card key={member.id} onClick={() => navigate(`/equipe/${member.id}`)} className="p-0">
                <div className="p-10 flex flex-col items-center text-center">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-[3rem] bg-gray-100 flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl transition-transform group-hover:scale-105">
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-gray-200">{member.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-green-500 border-4 border-white shadow-lg" />
                    </div>
                    
                    <Heading level={3} className="group-hover:text-primary transition-colors">{member.name}</Heading>
                    <Badge variant="outline" className="mt-4">{member.role}</Badge>
                    
                    <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-50 mt-10 pt-8">
                        <button className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary hover:bg-red-50 transition-all font-black uppercase text-[10px] tracking-widest">
                            <Mail size={16} /> Mail
                        </button>
                        <button className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary hover:bg-red-50 transition-all font-black uppercase text-[10px] tracking-widest">
                            <Phone size={16} /> Call
                        </button>
                    </div>
                </div>
                <div className="bg-gray-50/50 px-10 py-5 flex items-center justify-between border-t border-gray-50">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ver Perfil Completo</span>
                    <ChevronRight size={16} className="text-gray-200" />
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
};
