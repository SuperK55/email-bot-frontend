import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Play, Pause, Trash2, Eye } from 'lucide-react';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns');
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id) => {
    try {
      await api.post(`/campaigns/${id}/start`);
      toast.success('Campanha iniciada');
      fetchCampaigns();
    } catch (error) {
      toast.error('Falha ao iniciar campanha');
    }
  };

  const handlePause = async (id) => {
    try {
      await api.post(`/campaigns/${id}/pause`);
      toast.success('Campanha pausada');
      fetchCampaigns();
    } catch (error) {
      toast.error('Falha ao pausar campanha');
    }
  };

  const handleResume = async (id) => {
    try {
      await api.post(`/campaigns/${id}/resume`);
      toast.success('Campanha retomada');
      fetchCampaigns();
    } catch (error) {
      toast.error('Falha ao retomar campanha');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta campanha?')) return;

    try {
      await api.delete(`/campaigns/${id}`);
      toast.success('Campanha excluída');
      fetchCampaigns();
    } catch (error) {
      toast.error('Falha ao excluir campanha');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campanhas</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#0e121b] hover:bg-[#1a1f2e] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Plus size={20} />
          Nova Campanha
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map(campaign => {
          const progress = campaign.total_recipients > 0
            ? ((campaign.sent_count / campaign.total_recipients) * 100).toFixed(1)
            : 0;

          return (
            <div key={campaign.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Template: {campaign.template_name}</span>
                    <span>Lista: {campaign.list_name}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                  ${campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
                  ${campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
                `}>
                  {campaign.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-semibold">{campaign.sent_count} / {campaign.total_recipients} ({progress}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#0e121b] h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {campaign.status === 'draft' && (
                  <button
                    onClick={() => handleStart(campaign.id)}
                    className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    <Play size={16} />
                    Iniciar
                  </button>
                )}
                {campaign.status === 'active' && (
                  <button
                    onClick={() => handlePause(campaign.id)}
                    className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    <Pause size={16} />
                    Pausar
                  </button>
                )}
                {campaign.status === 'paused' && (
                  <button
                    onClick={() => handleResume(campaign.id)}
                    className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    <Play size={16} />
                    Retomar
                  </button>
                )}
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  <Eye size={16} />
                  Detalhes
                </Link>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma campanha criada ainda</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-[#0e121b] hover:text-[#1a1f2e] font-medium"
          >
            Criar a primeira campanha
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchCampaigns();
          }}
        />
      )}
    </div>
  );
}

function CreateCampaignModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [listId, setListId] = useState('');
  const [dailyLimit, setDailyLimit] = useState(4000);
  const [templates, setTemplates] = useState([]);
  const [lists, setLists] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchLists();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Failed to fetch templates');
    }
  };

  const fetchLists = async () => {
    try {
      const response = await api.get('/lists');
      setLists(response.data.lists.filter(l => l.status === 'completed'));
    } catch (error) {
      console.error('Failed to fetch lists');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await api.post('/campaigns', {
        name,
        template_id: parseInt(templateId),
        list_id: parseInt(listId),
        daily_limit: parseInt(dailyLimit)
      });

      toast.success('Campanha criada com sucesso');
      onSuccess();
    } catch (error) {
      toast.error('Falha ao criar campanha');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Campanha</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Campanha</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0e121b] focus:ring-4 focus:ring-gray-100 outline-none"
              placeholder="Ex: Campanha Janeiro 2025"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0e121b] focus:ring-4 focus:ring-gray-100 outline-none"
            >
              <option value="">Selecione um template</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lista de Emails</label>
            <select
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0e121b] focus:ring-4 focus:ring-gray-100 outline-none"
            >
              <option value="">Selecione uma lista</option>
              {lists.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.valid_count} contatos)</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Limite Diário</label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              required
              min="1"
              max="10000"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0e121b] focus:ring-4 focus:ring-gray-100 outline-none"
            />
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-4 py-3 bg-[#0e121b] hover:bg-[#1a1f2e] text-white rounded-lg hover:shadow-lg font-medium transition disabled:opacity-60"
            >
              {creating ? 'Criando...' : 'Criar Campanha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

