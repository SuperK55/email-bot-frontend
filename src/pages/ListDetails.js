import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ListDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    fetchListDetails();
    fetchContacts();
  }, [id, page]);

  const fetchListDetails = async () => {
    try {
      const response = await api.get(`/lists/${id}`);
      setList(response.data.list);
    } catch (error) {
      toast.error('Falha ao carregar detalhes da lista');
      navigate('/lists');
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lists/${id}/contacts`, {
        params: { page, limit: 50 }
      });
      setContacts(response.data.contacts);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Falha ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !list) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!list) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/lists')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Voltar para Listas
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{list.name}</h1>
            {list.description && (
              <p className="text-gray-600">{list.description}</p>
            )}
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold
            ${list.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
            ${list.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${list.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
          `}>
            {list.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Mail size={20} />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{list.total_count || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Válidos</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{list.valid_count || 0}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <XCircle size={20} />
              <span className="text-sm font-medium">Inválidos</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{list.invalid_count || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contatos</h2>
        
        {loading ? (
          <div className="text-center py-8">Carregando contatos...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum contato encontrado</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{contact.email}</td>
                      <td className="py-3 px-4 text-gray-600">{contact.name || '-'}</td>
                      <td className="py-3 px-4">
                        {contact.is_valid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle size={14} />
                            Válido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <XCircle size={14} />
                            Inválido
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Mostrando {((page - 1) * 50) + 1} - {Math.min(page * 50, pagination.total)} de {pagination.total} contatos
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {page} de {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Próxima
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

