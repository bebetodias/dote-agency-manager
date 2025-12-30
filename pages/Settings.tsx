import React, { useState } from 'react';
import { Save, Plus, Trash2, Calendar as CalendarIcon, Shield, Bell, Zap, Link2, AlertTriangle } from 'lucide-react';
import { Button, Input, Card, Badge, Modal, Heading } from '../components/UI';
import { MOCK_DATES } from '../services/mockData';
import { CommemorativeDate } from '../types';

export const SettingsPage: React.FC = () => {
  const [generalDates, setGeneralDates] = useState<CommemorativeDate[]>(MOCK_DATES.filter(d => !d.clientId));
  const [dropboxConnected, setDropboxConnected] = useState(true);
  
  // Estado para exclusão de data
  const [dateToDelete, setDateToDelete] = useState<CommemorativeDate | null>(null);

  const confirmDeleteDate = () => {
    if (dateToDelete) {
      setGeneralDates(prev => prev.filter(d => d.id !== dateToDelete.id));
      setDateToDelete(null);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Configurações</h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Parâmetros globais da agência</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-1">
            <button className="w-full text-left px-5 py-3 rounded-xl bg-red-50 text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                <CalendarIcon size={16} /> Datas Gerais
            </button>
            <button className="w-full text-left px-5 py-3 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                <Shield size={16} /> Permissões
            </button>
            <button className="w-full text-left px-5 py-3 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                <Bell size={16} /> Notificações
            </button>
            <button className="w-full text-left px-5 py-3 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 border-t border-gray-100 pt-5 mt-2">
                <Zap size={16} /> Integrações
            </button>
        </aside>

        <div className="md:col-span-3 space-y-8">
            <Card className="p-8">
                <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-5">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Calendário Institucional</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Datas compartilhadas por toda a agência</p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 uppercase text-[10px] font-black tracking-widest"><Plus size={14}/> Nova Data</Button>
                </div>

                <div className="space-y-3">
                    {generalDates.map(date => (
                        <div key={date.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-100 text-primary flex items-center justify-center font-black text-xs">
                                    {date.day}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 uppercase">{date.name}</div>
                                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Mês {date.month + 1}</div>
                                </div>
                            </div>
                            <button onClick={() => setDateToDelete(date)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-8">
                <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-5">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Armazenamento Externo</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Integração com serviços de nuvem</p>
                    </div>
                </div>

                <div className="p-6 border-2 border-gray-100 rounded-2xl flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <Link2 size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-gray-900 uppercase">Dropbox Business</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Utilizado para links de briefing e artes finais</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant={dropboxConnected ? 'default' : 'outline'} className={dropboxConnected ? 'bg-green-500' : ''}>
                          {dropboxConnected ? 'Conectado' : 'Desconectado'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="font-black text-[10px] uppercase"
                          onClick={() => setDropboxConnected(!dropboxConnected)}
                        >
                          {dropboxConnected ? 'Desconectar' : 'Conectar Agora'}
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end pt-4">
                <Button className="gap-2 px-10 h-14 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-red-900/20">
                    <Save size={18}/> Salvar Preferências
                </Button>
            </div>
        </div>
      </div>

      {/* MODAL CONFIRMAÇÃO EXCLUIR DATA */}
      <Modal 
        isOpen={dateToDelete !== null} 
        onClose={() => setDateToDelete(null)} 
        title="Confirmar Exclusão de Data"
        footer={
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setDateToDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDeleteDate}>Confirmar Exclusão</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <Trash2 size={40} />
            </div>
            <div className="space-y-2">
                <Heading level={3}>Remover do Calendário Geral?</Heading>
                <p className="text-sm font-medium text-gray-500">A data <span className="text-gray-900 font-black">{dateToDelete?.name}</span> não aparecerá mais nos dashboards da equipe.</p>
            </div>
        </div>
      </Modal>
    </div>
  );
};