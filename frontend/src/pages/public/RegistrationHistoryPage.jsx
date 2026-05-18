import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Search, Loader2, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

const RegistrationHistoryPage = () => {
  const [email, setEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      setLoading(true);
      const response = await api.get('/pendaftaran', {
        params: { email }
      });
      setRegistrations(response.data.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Failed to fetch registration history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Cek Riwayat Pendaftaran
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Masukkan email Anda untuk melihat tiket dan status kegiatan.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleSearch}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Email Terdaftar
            </label>
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cari'}
              </button>
            </div>
          </form>
        </div>

        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hasil Pencarian untuk: <span className="text-primary">{email}</span></h2>
            
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <div key={reg.pendaftaran_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 bg-gray-50 p-6 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">ID Pendaftaran</p>
                    <p className="text-lg font-mono font-bold text-gray-900 mb-4">#{reg.pendaftaran_id}</p>
                    
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                    <div className="flex items-center">
                      {reg.status_pendaftaran === 'terdaftar' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Terdaftar
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" /> Dibatalkan
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 sm:w-2/3 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{reg.kegiatan?.judul}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span>{new Date(reg.kegiatan?.tanggal_mulai).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span>{reg.kegiatan?.lokasi}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500">
                      Mendaftar pada: {new Date(reg.tanggal_daftar).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tidak ada riwayat pendaftaran</h3>
                <p className="mt-1 text-sm text-gray-500">Kami tidak menemukan pendaftaran dengan email tersebut.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationHistoryPage;
