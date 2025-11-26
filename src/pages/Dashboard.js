import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, List, FileText, Send, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  const quotaPercentage = stats?.todayQuota ? 
    (stats.todayQuota.emails_sent / stats.todayQuota.quota_limit * 100).toFixed(1) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#0e121b]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Campanhas</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.campaigns?.total || 0}</p>
              <p className="text-sm text-gray-500 mt-1">{stats?.campaigns?.active || 0} ativas</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <Send className="text-[#0e121b]" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Listas</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.lists?.total || 0}</p>
              <p className="text-sm text-gray-500 mt-1">{stats?.lists?.total_contacts || 0} contatos</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <List className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Templates</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.templates?.total || 0}</p>
              <p className="text-sm text-gray-500 mt-1">disponíveis</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Cota Hoje</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.todayQuota?.emails_sent || 0}</p>
              <p className="text-sm text-gray-500 mt-1">de {stats?.todayQuota?.quota_limit || 4000} ({quotaPercentage}%)</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Activity className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Envios dos Últimos 7 Dias</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.recentSends || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="emails_sent" fill="#667eea" name="Emails Enviados" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Recent Campaigns */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Campanhas Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Template</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lista</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Enviados</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentCampaigns?.map(campaign => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{campaign.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{campaign.template_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{campaign.list_name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                      ${campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
                      ${campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
                    `}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{campaign.sent_count}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{campaign.total_recipients}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="text-[#0e121b] hover:text-[#1a1f2e] font-medium text-sm"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap">
        <Link
          to="/lists"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 rounded-lg shadow-md border-2 border-gray-200 transition"
        >
          <List size={20} />
          <span className="font-medium">Nova Lista</span>
        </Link>
        <Link
          to="/templates"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 rounded-lg shadow-md border-2 border-gray-200 transition"
        >
          <FileText size={20} />
          <span className="font-medium">Novo Template</span>
        </Link>
        <Link
          to="/campaigns"
          className="flex items-center gap-2 bg-[#0e121b] hover:bg-[#1a1f2e] text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          <Send size={20} />
          <span className="font-medium">Nova Campanha</span>
        </Link>
      </div>
    </div>
  );
}

