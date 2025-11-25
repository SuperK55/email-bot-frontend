import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, Trash2, Eye } from 'lucide-react';

export default function Lists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await api.get('/lists');
      setLists(response.data.lists);
    } catch (error) {
      toast.error('Falha ao carregar listas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta lista?')) return;

    try {
      await api.delete(`/lists/${id}`);
      toast.success('Lista excluída com sucesso');
      fetchLists();
    } catch (error) {
      toast.error('Falha ao excluir lista');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Listas de Email</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Upload size={20} />
          Fazer Upload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map(list => (
          <div key={list.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{list.name}</h3>
                <p className="text-sm text-gray-600">{list.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${list.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                ${list.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${list.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
              `}>
                {list.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-900">{list.total_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Válidos:</span>
                <span className="font-semibold text-green-600">{list.valid_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Inválidos:</span>
                <span className="font-semibold text-red-600">{list.invalid_count}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link
                to={`/lists/${list.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                <Eye size={16} />
                Ver
              </Link>
              <button
                onClick={() => handleDelete(list.id)}
                className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {lists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma lista criada ainda</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Fazer o primeiro upload
          </button>
        </div>
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchLists();
          }}
        />
      )}
    </div>
  );
}

function UploadModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Selecione um arquivo');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', file);

      await api.post('/lists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Upload iniciado! A lista será processada em instantes.');
      onSuccess();
    } catch (error) {
      toast.error('Falha ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fazer Upload de Lista</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Lista</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none"
              placeholder="Ex: Clientes 2025"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none"
              placeholder="Descrição opcional"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo (.txt ou .csv)
            </label>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              Formato: um email por linha ou CSV com coluna "email"
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
              disabled={uploading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-medium transition disabled:opacity-60"
            >
              {uploading ? 'Enviando...' : 'Fazer Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

