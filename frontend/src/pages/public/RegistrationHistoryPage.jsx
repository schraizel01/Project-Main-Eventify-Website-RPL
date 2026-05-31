import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Search, Loader2, MapPin, Calendar, ArrowLeft, Filter, Star } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const RegistrationHistoryPage = () => {
  const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination & filter
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;

    try {
      setLoading(true);
      const response = await api.get('/pendaftaran', {
        params: { email: inputEmail.trim() }
      });
      setRegistrations(response.data.data || []);
      setEmail(inputEmail.trim());
      setHasSearched(true);
      setPage(1);
      setSearchTerm('');
    } catch (error) {
      console.error('Failed to fetch registration history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasSearched(false);
    setRegistrations([]);
    setInputEmail('');
    setEmail('');
    setPage(1);
    setSearchTerm('');
  };

  // Derived stats
  const totalRegistrations = registrations.length;
  const now = new Date();
  const activeRegistrations = registrations.filter(reg => {
    const mulai = reg.kegiatan?.tanggal_mulai;
    return mulai && new Date(mulai) > now && reg.status_pendaftaran === 'terdaftar';
  });

  const nextEvent = activeRegistrations
    .sort((a, b) => new Date(a.kegiatan.tanggal_mulai) - new Date(b.kegiatan.tanggal_mulai))[0];

  const daysUntilNext = nextEvent
    ? Math.ceil((new Date(nextEvent.kegiatan.tanggal_mulai) - now) / (1000 * 60 * 60 * 24))
    : null;

  // Filtered & paginated registrations
  const filtered = useMemo(() => {
    if (!searchTerm) return registrations;
    const q = searchTerm.toLowerCase();
    return registrations.filter(
      reg =>
        reg.kegiatan?.judul?.toLowerCase().includes(q) ||
        reg.kegiatan?.lokasi?.toLowerCase().includes(q)
    );
  }, [registrations, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── Search form (initial state) ──────────────────────────────────────────────
  if (!hasSearched) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4fb] font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">Cek Riwayat Pendaftaran</h1>
              <p className="mt-2 text-gray-500">Masukkan email Anda untuk melihat tiket dan status kegiatan.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Alamat Email Terdaftar
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="contoh@email.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-70 shadow-sm"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4" /> Cari Riwayat</>}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Results dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4fb] font-sans">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <button
          onClick={handleReset}
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali Ke Events
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Event Registrations</h1>
          <p className="mt-1 text-gray-500">Manage and track your upcoming academic engagements.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left Stats Panel ───────────────────────────────────────── */}
          <div className="lg:w-56 flex-shrink-0 flex flex-col gap-4">

            {/* Total Registrations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Total Registrations</p>
              <p className="text-5xl font-extrabold text-gray-900 leading-none mb-4">{totalRegistrations}</p>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: totalRegistrations > 0 ? '100%' : '0%' }}
                />
              </div>
            </div>

            {/* Active Registrations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Active Registration</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                </div>
                <p className="text-4xl font-extrabold text-gray-900">{activeRegistrations.length}</p>
              </div>
              {daysUntilNext !== null ? (
                <p className="text-xs text-gray-500 font-medium">Next Event In {daysUntilNext} Day{daysUntilNext !== 1 ? 's' : ''}</p>
              ) : (
                <p className="text-xs text-gray-400">Tidak ada event mendatang</p>
              )}
            </div>

            {/* Re-search */}
            <button
              onClick={handleReset}
              className="w-full text-center text-xs text-primary font-semibold border border-primary/30 hover:bg-primary/5 rounded-xl py-2.5 transition-colors"
            >
              Ganti Email
            </button>
          </div>

          {/* ── Right: Registration Table ──────────────────────────────── */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Table header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Registration History</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari event..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-44"
                  />
                </div>
                <div className="p-2 rounded-lg border border-gray-200 text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
              </div>
            </div>

            {filtered.length > 0 ? (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginated.map((reg) => (
                        <tr key={reg.pendaftaran_id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{reg.kegiatan?.judul || '-'}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-600">
                              {reg.kegiatan?.tanggal_mulai
                                ? new Date(reg.kegiatan.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                                : '-'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[160px]">{reg.kegiatan?.lokasi || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              reg.status_pendaftaran === 'terdaftar'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {reg.status_pendaftaran === 'terdaftar' ? 'Registered' : 'Dibatalkan'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} registrations
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {searchTerm ? 'Tidak ditemukan' : 'Tidak ada riwayat pendaftaran'}
                </h3>
                <p className="text-sm text-gray-500">
                  {searchTerm
                    ? `Tidak ada event yang cocok dengan "${searchTerm}"`
                    : 'Kami tidak menemukan pendaftaran dengan email tersebut.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-sm text-primary font-semibold hover:underline"
                  >
                    Hapus filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationHistoryPage;
