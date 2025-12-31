
import { Client, ClientPlan, Job, JobStage, JobType, TeamMember, CommemorativeDate, PieceStatus, AccessPermissions } from '../types';

export const DEFAULT_PERMISSIONS: Record<string, AccessPermissions> = {
  'Gestor': { dashboard: true, clients: true, team: true, jobs: true, financial: true, settings: true },
  'Atendimento': { dashboard: true, clients: true, team: false, jobs: true, financial: false, settings: false },
  'Designer': { dashboard: true, clients: false, team: false, jobs: true, financial: false, settings: false },
  'Creator': { dashboard: true, clients: false, team: false, jobs: true, financial: false, settings: false },
  'Videomaker': { dashboard: true, clients: false, team: false, jobs: true, financial: false, settings: false },
  'Financeiro': { dashboard: true, clients: true, team: false, jobs: false, financial: true, settings: false },
};

export const MOCK_TEAM: TeamMember[] = [
  { 
    id: '1', 
    name: 'Jéssica Bastianini', 
    role: 'Atendimento', 
    status: 'Ativo', 
    email: 'ana@dote.com', 
    password: 'password123',
    phone: '(11) 91234-5678', 
    joinedDate: '2022-01-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop',
    bio: 'Especialista em gestão ágil com foco em agências criativas. Apaixonada por otimização de processos e liderança de pessoas.',
    skills: ['Gestão de Projetos', 'Scrum', 'Atendimento', 'Estratégia'],
    permissions: DEFAULT_PERMISSIONS['Atendimento']
  },
  { 
    id: '2', 
    name: 'Roberto Dias', 
    role: 'Designer', 
    status: 'Ativo', 
    email: 'roberto@dote.com', 
    password: 'password123',
    phone: '(11) 99127-0303', 
    joinedDate: '2024-02-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop',
    bio: 'Designer multidisciplinar focado em identidades visuais e interfaces modernas. Gosta de minimalismo e tipografia forte.',
    skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX Design'],
    permissions: DEFAULT_PERMISSIONS['Designer']
  },
  { 
    id: '3', 
    name: 'Julia Lima', 
    role: 'Creator', 
    status: 'Ativo', 
    email: 'julia@dote.com', 
    password: 'password123',
    phone: '(11) 95555-4444', 
    joinedDate: '2023-06-20',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&fit=crop',
    bio: 'Redatora publicitária e estrategista de conteúdo. Cria narrativas que conectam marcas a pessoas de forma autêntica.',
    skills: ['Copywriting', 'SEO', 'Planejamento de Conteúdo', 'Social Media'],
    permissions: DEFAULT_PERMISSIONS['Creator']
  },
];

export const MOCK_CLIENTS: Client[] = [
  { 
    id: '1', 
    name: 'TechSolutions Inc.', 
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=220&h=120&fit=crop',
    plan: ClientPlan.FEE, 
    status: 'Ativo', 
    lastInteraction: 'Hoje',
    email: 'contact@tech.com', 
    phone: '(11) 99999-9999',
    cnpj: '12.345.678/0001-99',
    razaoSocial: 'Tech Solutions Inovações LTDA',
    inscricaoMunicipal: '987654-32',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP',
    website: 'www.techsolutions.com.br',
    instagram: '@techsolutions_br',
    linkedin: 'linkedin.com/company/techsolutions',
    contacts: [
      {
        id: 'c1',
        name: 'Carlos Mendes',
        role: 'Diretor de Marketing',
        responsibilities: 'Aprovação de verba e estratégia global.',
        whatsapp: '(11) 98888-7777',
        corpEmail: 'carlos@tech.com',
        whatsappGroup: 'https://wa.me/group/tech'
      }
    ],
    foundingDate: '2015-05-12',
    founderStory: 'Nascida em uma garagem no Vale do Silício Brasileiro por dois engenheiros frustrados com a lentidão do suporte de TI tradicional.',
    evolution: 'Começou como suporte local, evoluiu para infraestrutura na nuvem em 2018 e hoje lidera o setor de IA aplicada.',
    currentMoment: 'Consolidação de mercado e expansão para a América Latina.',
    mission: 'Simplificar a tecnologia para empresas de todos os tamanhos.',
    vision: 'Ser a espinha dorsal tecnológica das maiores inovações globais.',
    values: 'Transparência, Velocidade, Empathia e Inovação Incremental.',
    centralMessage: 'Tecnologia que entende de gente.',
    brandConcept: 'Eficiência Invisível - tudo funciona tão bem que você nem nota que existe.',
    language: 'Direta, técnica porém didática, sem juridiquês.',
    practicalTerms: 'Solução, Fluxo, Integração, Futuro.',
    whatToAvoid: 'Termos excessivamente alarmistas ou promessas milagrosas.',
    keywords: ['IA', 'Cloud', 'Suporte', 'Performance', 'Inovação'],
    personas: [
      {
        id: 'p1',
        name: 'Rodrigo Inovador',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=220&h=220&fit=crop',
        origin: 'Curitiba, vive em SP',
        familyStatus: 'Solteiro, mora com um pet',
        routine: 'Trabalha 10h por dia, pratica CrossFit e gosta de podcasts de negócios.',
        lifestyle: 'Early adopter, valoriza design e funcionalidade.',
        purchaseFrequency: 'Mensal (assinaturas B2B)',
        wherePurchases: 'Online, LinkedIn Ads, Indicações',
        influences: 'YouTube Tech, newsletters especializadas',
        motivation: 'Crescer a empresa e automatizar o máximo possível.',
        aspirations: 'Ser referência no setor e ter tempo livre para viajar.'
      }
    ],
    tone: {
      casualFormal: 65,
      friendlyProfessional: 80,
      funnySerious: 30,
      accessibleExclusive: 50,
      modernClassic: 90,
      softImposing: 40
    },
    socialHistory: [
      {
        id: 's1',
        platform: 'Instagram',
        profileName: '@techsolutions_br',
        profileLink: 'instagram.com/techsolutions',
        followersEntry: 1500,
        followersCurrent: 4500,
        reachEntry: 5000,
        reachCurrent: 12000,
        engagementEntry: 2.5,
        engagementCurrent: 4.8,
        clicksEntry: 120,
        clicksCurrent: 850,
        relevantContent: 'Reels sobre Dicas de Produtividade em TI.',
        performance: 'Alta em conteúdos educacionais.',
        lastCampaigns: 'Lançamento do Módulo IA (Out/23)'
      }
    ],
    colors: {
      primary: { hex: '#0055FF', cmyk: '100, 60, 0, 0', pantone: 'Process Blue' },
      secondary: { hex: '#111827', cmyk: '0, 0, 0, 95', pantone: 'Black 6 C' },
      notes: 'Usar degradês suaves entre o primário e branco.'
    }
  },
  { id: '2', name: 'Boutique Flora', plan: ClientPlan.JOB, status: 'Ativo', lastInteraction: 'Ontem', email: 'flora@boutique.com', phone: '(11) 98888-8888', contacts: [], personas: [], tone: { casualFormal: 50, friendlyProfessional: 50, funnySerious: 50, accessibleExclusive: 50, modernClassic: 50, softImposing: 50 }, socialHistory: [], colors: { primary: { hex: '#E11D48', cmyk: '0, 90, 60, 0', pantone: '199 C' }, secondary: { hex: '#FFF1F2', cmyk: '0, 2, 1, 0', pantone: '705 C' } } },
];

export const MOCK_DATES: CommemorativeDate[] = [
  { id: 'd1', name: 'Natal', day: 25, month: 11 },
  { id: 'd2', name: 'Ano Novo', day: 1, month: 0 },
  { id: 'd3', name: 'Dia do Cliente', day: 15, month: 8 },
  { id: 'd4', name: 'Aniversário TechSolutions', day: 20, month: 4, clientId: '1' },
];

export const MOCK_JOBS: Job[] = [
  { 
    id: 'JOB-101', 
    title: 'Campanha Black Friday', 
    clientId: '1', 
    clientName: 'TechSolutions Inc.', 
    type: JobType.DIGITAL, 
    stage: JobStage.CREATION, 
    assigneeId: '2', 
    deadline: '2023-11-20',
    description: 'Campanha focada em IA e automação para o varejo.',
    dropboxLinks: ['https://www.dropbox.com/s/sample1', 'https://www.dropbox.com/s/sample2'],
    pieces: [
      { 
        id: 'p1', 
        name: 'Banner Site', 
        type: JobType.DIGITAL, 
        format: '1920x600', 
        assigneeIds: ['2'], 
        content: 'Chamada: IA que vende por você. CTA: Saiba Mais.', 
        status: PieceStatus.PENDING 
      }
    ],
    history: [
      { id: 'h1', date: '2023-10-15 10:00', user: 'Ana Silva', action: 'Job criado' }
    ]
  },
  { 
    id: 'JOB-102', 
    title: 'Novo Logo Floral', 
    clientId: '2', 
    clientName: 'Boutique Flora', 
    type: JobType.OFFLINE, 
    stage: JobStage.BRIEFING, 
    assigneeId: '1', 
    deadline: '2023-12-15',
    pieces: [],
    history: []
  },
];
