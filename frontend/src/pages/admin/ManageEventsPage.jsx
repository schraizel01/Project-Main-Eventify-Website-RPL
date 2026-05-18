import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';
import { Edit2, Trash2, Plus, Loader2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/kegiatan', {
        params: { limit: 10, page }
      });
      setEvents(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    
    setIsDeleting(id);
    try {
      await api.delete(`/kegiatan/admin/${id}`);
      toast.success('Kegiatan berhasil dihapus');
      fetchEvents();
    } catch (error) {
      toast.error('Gagal menghapus kegiatan');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
            <p className="mt-1 text-gray-500">Create, edit, and manage your academic events.</p>
          </div>
          <Link
            to="/admin/events/create"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Buat Event Baru
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul & Jenis</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Penyelenggara</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Peserta</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.kegiatan_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 mb-1">{event.judul}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">{event.jenis}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(event.tanggal_mulai).toLocaleDateString('id-ID')}</div>
                          <div className="text-xs text-gray-500">{new Date(event.tanggal_mulai).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.penyelenggara}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.jumlah_terdaftar} Terdaftar</div>
                          <div className="text-xs text-gray-500">Kuota: {event.kuota}</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 max-w-[4rem]">
                            <div 
                              className="bg-primary h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, (event.jumlah_terdaftar / event.kuota) * 100)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link to={`/admin/events/${event.kegiatan_id}/edit`} className="text-blue-600 hover:text-blue-900 transition-colors">
                              <Edit2 className="w-5 h-5" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(event.kegiatan_id)}
                              disabled={isDeleting === event.kegiatan_id}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                            >
                              {isDeleting === event.kegiatan_id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-lg font-medium text-gray-900">Belum ada kegiatan</p>
                            <p className="text-sm">Klik "Buat Event Baru" untuk menambahkan kegiatan pertama Anda.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Halaman <span className="font-medium">{page}</span> dari <span className="font-medium">{totalPages}</span>
                  </div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageEventsPage;
