import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InviteProvider } from './context/InviteContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/Home';
import CreateInvitePage from './pages/criarPage';
import PreviewPage from './pages/preview';
import ManageInvitesPage from './pages/ManageInvitesPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/Sobre';
import ValidateInvitePage from './pages/ValidateInvitePage';
import './index.css';

function App() {
  return (
    <InviteProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/criar" element={<CreateInvitePage />} />
            <Route path="/convite/:id" element={<PreviewPage />} />
            <Route path="/validar/:qrCode" element={<ValidateInvitePage />} />
            <Route path="/gerenciar" element={<ManageInvitesPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </InviteProvider>
  );
}

export default App;
