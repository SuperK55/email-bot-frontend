import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data.templates);
    } catch (error) {
      toast.error('Falha ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este template?')) return;

    try {
      await api.delete(`/templates/${id}`);
      toast.success('Template excluído com sucesso');
      fetchTemplates();
    } catch (error) {
      toast.error('Falha ao excluir template');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Templates de Email</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#0e121b] hover:bg-[#1a1f2e] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Plus size={20} />
          Novo Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.subject}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setEditingTemplate(template)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum template criado ainda</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-[#0e121b] hover:text-[#1a1f2e] font-medium"
          >
            Criar o primeiro template
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTemplates();
          }}
        />
      )}

      {editingTemplate && (
        <CreateTemplateModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSuccess={() => {
            setEditingTemplate(null);
            fetchTemplates();
          }}
        />
      )}
    </div>
  );
}

function CreateTemplateModal({ onClose, onSuccess, template = null }) {
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [textContent, setTextContent] = useState(template?.text_content || '');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      if (template) {
        // Update existing template
        await api.put(`/templates/${template.id}`, {
          name,
          subject,
          text_content: textContent,
          html_content: '' // Plain text only
        });
        toast.success('Template atualizado com sucesso');
      } else {
        // Create new template
        await api.post('/templates', {
          name,
          subject,
          text_content: textContent,
          html_content: '' // Plain text only
        });
        toast.success('Template criado com sucesso');
      }
      onSuccess();
    } catch (error) {
      toast.error(template ? 'Falha ao atualizar template' : 'Falha ao criar template');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {template ? 'Editar Template' : 'Criar Template'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Template</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0e121b] focus:ring-4 focus:ring-gray-100 outline-none"
              placeholder="Ex: Boas-vindas"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assunto do Email</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0e121b] focus:ring-4 focus:ring-gray-100 outline-none"
              placeholder="Ex: Bem-vindo à Koch Construtora"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo do Email
            </label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required
              rows={12}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none resize-y"
              placeholder="Olá {{nome}},

Bem-vindo à Koch Construtora!

Atenciosamente,
Equipe Koch Construtora"
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Pressione Enter para criar uma nova linha. Use variáveis: {'{{nome}}'}, {'{{email}}'}, {'{{empresa}}'}
            </p>
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
              {creating ? (template ? 'Atualizando...' : 'Criando...') : (template ? 'Atualizar Template' : 'Criar Template')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

