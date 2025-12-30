import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingLayout, DashboardLayout } from './components/Layouts';
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { DashboardHome } from './pages/DashboardHome';
import { ClientsPage } from './pages/Clients';
import { ClientDetailsPage } from './pages/ClientDetails';
import { JobsPage } from './pages/Jobs';
import { JobDetailsPage } from './pages/JobDetails';
import { TeamPage } from './pages/Team';
import { TeamMemberDetailsPage } from './pages/TeamMemberDetails';
import { SettingsPage } from './pages/Settings';

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          } 
        />
        
        <Route 
          path="/landing" 
          element={
            <LandingLayout>
              <LandingPage />
            </LandingLayout>
          } 
        />
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/clientes" 
          element={
            <DashboardLayout>
              <ClientsPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/clientes/:id" 
          element={
            <DashboardLayout>
              <ClientDetailsPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/jobs" 
          element={
            <DashboardLayout>
              <JobsPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/jobs/:id" 
          element={
            <DashboardLayout>
              <JobDetailsPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/equipe" 
          element={
            <DashboardLayout>
              <TeamPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/equipe/:id" 
          element={
            <DashboardLayout>
              <TeamMemberDetailsPage />
            </DashboardLayout>
          } 
        />
        
        <Route 
          path="/config" 
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          } 
        />

        <Route path="/financeiro" element={<DashboardLayout><div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">?</div><div className="text-center font-black uppercase text-xs tracking-widest text-gray-400">Módulo Financeiro em Desenvolvimento</div></div></DashboardLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
};

export default App;