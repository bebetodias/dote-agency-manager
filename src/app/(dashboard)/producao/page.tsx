"use client";


import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Trash, 
  Edit3, 
  Check, 
  Search,
  UserPlus
} from 'lucide-react';
import { Card, Button, Badge, Heading, Label, Modal, Input } from '../../../components/UI';
import { MOCK_PRODUCTIONS, MOCK_TEAM } from '../../../services/mockData';
import { Production, Equipment } from '../../../types';

export default function ProductionsPage() {
  const [productions, setProductions] = useState<Production[]>(MOCK_PRODUCTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduction, setEditingProduction] = useState<Production | null>(null);

  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [tempAssignees, setTempAssignees] = useState<string[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState('');

  const [formData, setFormData] = useState<Partial<Production>>({
    name: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    involvedMemberIds: [],
    equipment: [],
    status: 'Em Planejamento'
  });

  const handleOpenAdd = () => {
    setEditingProduction(null);
    setFormData({
      name: '',
      location: '',
      date: '',
      startTime: '',
      endTime: '',
      involvedMemberIds: [],
      equipment: [],
      status: 'Em Planejamento'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Production) => {
    setEditingProduction(prod);
    setFormData({ ...prod });
    setIsModalOpen(true);
  };

  const handleSaveProduction = () => {
    if (!formData.name || !formData.date) return;

    if (editingProduction) {
      setProductions(prev => prev.map(p => p.id === editingProduction.id ? { ...p, ...formData } as Production : p));
    } else {
      const newProd: Production = {
        id: `PROD-${Math.floor(Math.random() * 1000)}`,
        ...formData
      } as Production;
      setProductions([newProd, ...productions]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta produção?')) {
      setProductions(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleEquipment = (prodId: string, eqId: string) => {
    setProductions(prev => prev.map(p => {
      if (p.id !== prodId) return p;
      return {
        ...p,
        equipment: p.equipment.map(eq => eq.id === eqId ? { ...eq, checked: !eq.checked } : eq)
      };
    }));
  };

  const addEquipmentField = () => {
    const newEq: Equipment = {
      id: `eq-${Date.now()}`,
      name: '',
      checked: false
    };
    setFormData({ ...formData, equipment: [...(formData.equipment || []), newEq] });
  };

  const updateEquipmentName = (id: string, name: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment?.map(eq => eq.id === id ? { ...eq, name } : eq)
    });
  };

  const removeEquipment = (id: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment?.filter(eq => eq.id !== id)
    });
  };

  const openAssigneeSelector = () => {
    setTempAssignees([...(formData.involvedMemberIds || [])]);
    setIsAssigneeModalOpen(true);
  };

  const toggleAssigneeInTemp = (id: string) => {
    if (tempAssignees.includes(id)) {
      setTempAssignees(tempAssignees.filter(mid => mid !== id));
    } else {
      setTempAssignees([...tempAssignees, id]);
    }
  };

  const confirmAssignment = () => {
    setFormData({ ...formData, involvedMemberIds: tempAssignees });
    setIsAssigneeModalOpen(false);
  };

  const filteredTeamMembers = useMemo(() => {
    return MOCK_TEAM.filter(member => 
      member.name.toLowerCase().includes(assigneeSearch.toLowerCase())
    );
  }, [assigneeSearch]);

  const getStatusColor = (status: Production['status']) => {
    switch (status) {
      case 'Confirmada': return 'green';
      case 'Em Planejamento': return 'orange';
      case 'Concluída': return 'default';
      case 'Cancelada': return 'red';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Heading level={1}>Produção</Heading>
          <p className="text-gray-400 font-medium text-sm">Agendamento de Fotos e Vídeos</p>
        </div>
        <Button onClick={handleOpenAdd} size="lg" className="px-10 h-14 shadow-xl shadow-red-500/10">
          <Plus size={20} className="mr-2" strokeWidth={2.5} /> Nova Produção
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {productions.map(prod => (
          <Card key={prod.id} className="p-0 border-none shadow-xl bg-white overflow-hidden group">
            <div className="flex flex-col lg:flex-row">
              <div className="p-8 flex-1 border-r border-gray-50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-primary rounded-2xl">
                      <Camera size={22} />
                    </div>
                    <div>
                      <Badge variant={getStatusColor(prod.status)} className="mb-1.5 text-[10px] py-0.5">{prod.status}</Badge>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">{prod.name}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEdit(prod)} className="p-3 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all border border-transparent hover:border-gray-100"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(prod.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-gray-100"><Trash size={18} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-1.5">
                    <Label>Localização</Label>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <span className="truncate">{prod.location}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data e Horário</Label>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar size={16} className="text-primary shrink-0" />
                      <span>{new Date(prod.date).toLocaleDateString('pt-BR')}</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <Clock size={16} className="text-primary shrink-0" />
                      <span>{prod.startTime} - {prod.endTime}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Equipe Técnica</Label>
                    <div className="flex -space-x-2">
                      {prod.involvedMemberIds.map(mid => {
                        const member = MOCK_TEAM.find(m => m.id === mid);
                        return (
                          <div key={mid} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-md ring-1 ring-gray-100" title={member?.name}>
                            <img src={member?.avatar} alt={member?.name} className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                      {prod.involvedMemberIds.length === 0 && (
                         <span className="text-xs font-medium text-gray-400 italic pt-2">Sem escala</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-80 bg-gray-50/30 p-8 shrink-0 border-t lg:border-t-0">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary"/> Checklist
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">
                    {prod.equipment.filter(e => e.checked).length}/{prod.equipment.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {prod.equipment.map(eq => (
                    <button 
                      key={eq.id}
                      onClick={() => toggleEquipment(prod.id, eq.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group/item"
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${eq.checked ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-50 border-gray-200 text-transparent group-hover/item:text-gray-200'}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className={`text-[12px] font-semibold text-left transition-all ${eq.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {eq.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduction ? "Editar Produção" : "Nova Produção"}
        className="max-w-2xl"
        footer={<Button onClick={handleSaveProduction} className="h-14 px-10">Confirmar Produção</Button>}
      >
        <div className="space-y-6">
          <Input label="Título da Produção" placeholder="Ex: Fotos Coleção de Inverno" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-6">
            <Input label="Local" icon={MapPin} placeholder="Estúdio, Endereço..." value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            <Input label="Data" type="date" icon={Calendar} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Início" type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
              <Input label="Término" type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Status Atual</Label>
              <select className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50/30 px-6 text-sm font-semibold focus:border-primary outline-none" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Production['status'] })}>
                <option value="Em Planejamento">Em Planejamento</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Concluída">Concluída</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="mb-0">Pessoas Envolvidas</Label>
                <Button variant="ghost" size="sm" onClick={openAssigneeSelector} className="text-primary font-bold text-xs"><UserPlus size={14} className="mr-1"/> Escalar</Button>
              </div>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 min-h-[60px]">
                {formData.involvedMemberIds?.map(mid => {
                  const member = MOCK_TEAM.find(m => m.id === mid);
                  return (
                    <div key={mid} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                      <img src={member?.avatar} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-xs font-semibold text-gray-700">{member?.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isAssigneeModalOpen} 
        onClose={() => setIsAssigneeModalOpen(false)} 
        title="Escalar Equipe"
        className="max-w-md"
        footer={<Button onClick={confirmAssignment} className="w-full h-12">Confirmar Escala</Button>}
      >
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              className="w-full h-12 pl-12 pr-6 rounded-xl border border-gray-100 bg-gray-50/30 text-sm font-medium focus:border-primary outline-none"
              placeholder="Buscar colaborador..."
              value={assigneeSearch}
              onChange={(e) => setAssigneeSearch(e.target.value)}
            />
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar -mx-2 px-2">
            <div className="space-y-1">
              {filteredTeamMembers.map((member) => {
                const isSelected = tempAssignees.includes(member.id);
                return (
                  <button 
                    key={member.id}
                    onClick={() => toggleAssigneeInTemp(member.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${isSelected ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-100">
                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-semibold text-gray-900 block">{member.name}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{member.role}</span>
                      </div>
                    </div>
                    {isSelected && <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
