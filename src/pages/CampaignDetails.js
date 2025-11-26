import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, CheckCircle, XCircle, Clock, Play, Pause } from 'lucide-react';

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignDetails();
    const interval = setInterval(fetchCampaignDetails, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/campaigns/${id}`);
      setCampaign(response.data.campaign);
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Falha ao carregar detalhes da campanha');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      await api.post(`/campaigns/${id}/start`);
      toast.success('Campanha iniciada');
      fetchCampaignDetails();
    } catch (error) {
      toast.error('Falha ao iniciar campanha');
    }
  };

  const handlePause = async () => {
    try {
      await api.post(`/campaigns/${id}/pause`);
      toast.success('Campanha pausada');
      fetchCampaignDetails();
    } catch (error) {
      toast.error('Falha ao pausar campanha');
    }
  };

  const handleResume = async () => {
    try {
      await api.post(`/campaigns/${id}/resume`);
      toast.success('Campanha retomada');
      fetchCampaignDetails();
    } catch (error) {
      toast.error('Falha ao retomar campanha');
    }
  };

  if (loading && !campaign) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!campaign) {
    return null;
  }

  const progress = campaign.total_recipients > 0
    ? ((campaign.sent_count / campaign.total_recipients) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Voltar para Campanhas
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Template: <strong>{campaign.template_name}</strong></span>
              <span>Lista: <strong>{campaign.list_name}</strong></span>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold
            ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : ''}
            ${campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
            ${campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
          `}>
            {campaign.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Mail size={20} />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{campaign.total_recipients || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Enviados</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats?.sent || campaign.sent_count || 0}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <XCircle size={20} />
              <span className="text-sm font-medium">Falhas</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats?.failed || 0}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <Clock size={20} />
              <span className="text-sm font-medium">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{stats?.pending || 0}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progresso</span>
            <span className="font-semibold">{campaign.sent_count} / {campaign.total_recipients} ({progress}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-gray-800 to-gray-900 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {campaign.status === 'draft' && (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Play size={16} />
              Iniciar
            </button>
          )}
          {campaign.status === 'active' && (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Pause size={16} />
              Pausar
            </button>
          )}
          {campaign.status === 'paused' && (
            <button
              onClick={handleResume}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Play size={16} />
              Retomar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informações da Campanha</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Limite Diário:</span>
            <p className="font-semibold text-gray-900">{campaign.daily_limit || 4000} emails</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Criada em:</span>
            <p className="font-semibold text-gray-900">
              {new Date(campaign.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
          {campaign.started_at && (
            <div>
              <span className="text-sm text-gray-600">Iniciada em:</span>
              <p className="font-semibold text-gray-900">
                {new Date(campaign.started_at).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
          {campaign.completed_at && (
            <div>
              <span className="text-sm text-gray-600">Completada em:</span>
              <p className="font-semibold text-gray-900">
                {new Date(campaign.completed_at).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

