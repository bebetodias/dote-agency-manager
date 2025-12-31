
import React from 'react';

export enum JobStage {
  BRIEFING = "Briefing",
  RESEARCH = "Pesquisa e conteúdo",
  CREATION = "Criação",
  INTERNAL_APPROVAL = "Aprovação Interna",
  CLIENT_APPROVAL = "Aprovação Cliente",
  PRODUCTION = "Produção",
  LAUNCH = "Veiculação"
}

export enum JobType {
  OFFLINE = "Offline",
  DIGITAL = "Digital"
}

export enum PieceStatus {
  PENDING = "Pendente",
  DONE = "Concluído",
  APPROVED = "Aprovado",
  REDO = "Refação"
}

export interface JobPiece {
  id: string;
  name: string;
  type: JobType;
  format: string;
  assigneeIds: string[];
  content: string;
  finalArtLink?: string;
  status: PieceStatus;
}

export interface JobHistoryEntry {
  id: string;
  date: string;
  user: string;
  action: string;
}

export enum ClientPlan {
  JOB = "Por Job",
  FEE = "FEE (Mensal)"
}

export interface ClientContact {
  id: string;
  avatar?: string;
  name: string;
  role: string;
  responsibilities: string;
  whatsapp: string;
  corpEmail: string;
  whatsappGroup?: string;
}

export interface ClientPersona {
  id: string;
  name: string;
  photo: string;
  origin: string;
  familyStatus: string;
  routine: string;
  lifestyle: string;
  purchaseFrequency: string;
  wherePurchases: string;
  influences: string;
  motivation: string;
  aspirations: string;
}

export interface SocialPlatformMetric {
  id: string;
  platform: string;
  profileName: string;
  profileLink: string;
  followersEntry: number;
  followersCurrent: number;
  reachEntry: number;
  reachCurrent: number;
  engagementEntry: number;
  engagementCurrent: number;
  clicksEntry: number;
  clicksCurrent: number;
  relevantContent: string;
  performance: string;
  lastCampaigns: string;
}

export interface ClientColor {
  hex: string;
  cmyk: string;
  pantone: string;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  plan: ClientPlan;
  status: 'Ativo' | 'Inativo' | 'Onboarding';
  lastInteraction: string;
  cnpj?: string;
  razaoSocial?: string;
  inscricaoMunicipal?: string;
  address?: string;
  email: string;
  phone: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  otherChannels?: string;
  contacts: ClientContact[];
  foundingDate?: string;
  founderStory?: string;
  evolution?: string;
  currentMoment?: string;
  mission?: string;
  vision?: string;
  values?: string;
  centralMessage?: string;
  brandConcept?: string;
  language?: string;
  practicalTerms?: string;
  whatToAvoid?: string;
  keywords?: string[];
  personas: ClientPersona[];
  tone: {
    casualFormal: number;
    friendlyProfessional: number;
    funnySerious: number;
    accessibleExclusive: number;
    modernClassic: number;
    softImposing: number;
  };
  socialHistory: SocialPlatformMetric[];
  colors: {
    primary: ClientColor;
    secondary: ClientColor;
    notes?: string;
  };
}

export type TeamRole = 'Designer' | 'Creator' | 'Atendimento' | 'Videomaker' | 'Gestor' | 'Financeiro';

export interface AccessPermissions {
  dashboard: boolean;
  clients: boolean;
  team: boolean;
  jobs: boolean;
  financial: boolean;
  settings: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  status: 'Ativo' | 'Inativo' | 'Férias';
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;
  joinedDate?: string;
  bio?: string;
  skills?: string[];
  permissions?: AccessPermissions;
}

export interface Job {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  type: JobType;
  stage: JobStage;
  assigneeId: string;
  deadline: string;
  description?: string;
  dropboxLinks?: string[];
  pieces?: JobPiece[];
  history?: JobHistoryEntry[];
}

export interface CommemorativeDate {
  id: string;
  name: string;
  day: number;
  month: number;
  clientId?: string; 
}

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}
