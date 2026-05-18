import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';
import { Search, Download, Loader2 } from 'lucide-react';

const ParticipantsPage = () => {
  const [pendaftaran, setPendaftaran] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchEventsDropdown();
  }, []);

  useEffect(() => {
    fetchPeserta();
  }, [page, selectedEvent]);

  const fetchEventsDropdown = async () => {
    try {
      const response = await api.get('/kegiatan', { params: { limit: 100 } });
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch events for dropdown:', error);
    }
  };

  const fetchPeserta = async () => {
    try {
      setLoading(true);
      const response = await api.get('/peserta', {
        params: { limit: 10, page, search: searchTerm, kegiatan_id: selectedEvent }
      });
      setPendaftaran(response.data.data);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      console.error('Failed to fetch peserta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPeserta();
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.get('/peserta/export', {
        params: { kegiatan_id: selectedEvent },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `peserta_kegiatan_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to export peserta:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daftar Peserta</h1>
            <p className="mt-1 text-gray-500">Lihat dan kelola peserta di setiap kegiatan.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              disabled={exporting || pendaftaran.length === 0}
              className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm text-sm font-medium disabled:opacity-60"
            >
              {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-end">
          <form onSubmit={handleSearch} className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cari Pendaftaran</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="hidden">Search</button>
          </form>

          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">KEGIATAN</label>
            <select
              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Kegiatan</option>
              {events.map(event => (
                <option key={event.kegiatan_id} value={event.kegiatan_id}>{event.judul}</option>
              ))}
            </select>
          </div>
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama & Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kegiatan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Telepon & Institusi</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendaftaran.length > 0 ? (
                      pendaftaran.map((reg) => (
                        <tr key={reg.pendaftaran_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                {reg.peserta?.nama?.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{reg.peserta?.nama}</div>
                                <div className="text-xs text-gray-500">{reg.peserta?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reg.kegiatan?.judul || '-'}</div>
                            <div className="text-xs text-gray-500 font-mono">#{reg.pendaftaran_id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reg.peserta?.nomor_telepon}</div>
                            <div className="text-xs text-gray-500">{reg.peserta?.institusi}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              reg.status_pendaftaran === 'terdaftar' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {reg.status_pendaftaran}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          Tidak ada peserta ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalItems > 0 && (
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">{(page - 1) * 10 + 1}</span> - <span className="font-medium">{Math.min(page * 10, totalItems)}</span> dari <span className="font-medium">{totalItems}</span>
                  </div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                    >
                      Sebelumnya
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Hal {page} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
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

export default ParticipantsPage;
