/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Labs from './pages/Labs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Assessment from './pages/Assessment';
import CareerGuidance from './pages/CareerGuidance';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/career-guidance" element={<CareerGuidance />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
