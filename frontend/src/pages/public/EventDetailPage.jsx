import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Calendar, MapPin, Users, Clock, Loader2, ArrowLeft, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nomor_identitas: '',
    institusi: '',
    nomor_telepon: '',
    catatan: ''
  });

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/kegiatan/${id}`);
      setEvent(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat detail kegiatan');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/pendaftaran', {
        kegiatan_id: event.kegiatan_id,
        ...formData
      });
      
      setIsModalOpen(false);
      navigate('/register/success', { state: { eventTitle: event.judul } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftar kegiatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  const isFull = event.jumlah_terdaftar >= event.kuota;
  const isClosed = event.status !== 'aktif';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-64 sm:h-80 w-full bg-gradient-to-br from-primary/30 to-secondary/30 relative flex items-center justify-center overflow-hidden">
              {event.gambar ? (
                <img src={event.gambar} alt={event.judul} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 font-bold text-xl">Gambar Kegiatan</span>
              )}
            </div>

            <div className="p-8 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {event.jenis}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  event.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                {event.judul}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Tanggal Mulai</p>
                      <p className="text-gray-600">{new Date(event.tanggal_mulai).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Tanggal Selesai</p>
                      <p className="text-gray-600">{new Date(event.tanggal_selesai).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Lokasi</p>
                      <p className="text-gray-600">{event.lokasi}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Penyelenggara</p>
                      <p className="text-gray-600">{event.penyelenggara}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                    <div className="w-full">
                      <p className="font-semibold text-gray-900">Kapasitas</p>
                      <div className="flex items-center justify-between mt-1 mb-1 text-sm text-gray-600">
                        <span>{event.jumlah_terdaftar} Terdaftar</span>
                        <span>Total Kuota: {event.kuota}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isFull ? 'bg-danger' : 'bg-primary'}`} 
                          style={{ width: `${Math.min(100, (event.jumlah_terdaftar / event.kuota) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Kegiatan</h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {event.deskripsi}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">Gratis</p>
                </div>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isFull || isClosed}
                  className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                    isFull || isClosed 
                    ? 'bg-gray-400 cursor-not-allowed shadow-none hover:translate-y-0' 
                    : 'bg-primary hover:bg-secondary'
                  }`}
                >
                  {isFull ? 'Kuota Penuh' : isClosed ? 'Pendaftaran Ditutup' : 'Daftar Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2" id="modal-title">
                      Form Pendaftaran
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Lengkapi data diri Anda di bawah ini.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                        <input type="text" name="nama" id="nama" required value={formData.nama} onChange={handleInputChange} className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Alamat Email *</label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" />
                      </div>

                      <div>
                        <label htmlFor="nomor_telepon" className="block text-sm font-medium text-gray-700">Nomor Telepon *</label>
                        <input type="text" name="nomor_telepon" id="nomor_telepon" required value={formData.nomor_telepon} onChange={handleInputChange} className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" />
                      </div>

                      <div>
                        <label htmlFor="institusi" className="block text-sm font-medium text-gray-700">Institusi / Universitas</label>
                        <input type="text" name="institusi" id="institusi" value={formData.institusi} onChange={handleInputChange} className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" />
                      </div>

                      <div>
                        <label htmlFor="nomor_identitas" className="block text-sm font-medium text-gray-700">Nomor Identitas (NIM/KTP)</label>
                        <input type="text" name="nomor_identitas" id="nomor_identitas" value={formData.nomor_identitas} onChange={handleInputChange} className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" />
                      </div>

                      <div>
                        <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">Catatan Tambahan</label>
                        <textarea name="catatan" id="catatan" rows="3" value={formData.catatan} onChange={handleInputChange} className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3"></textarea>
                      </div>

                      <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 mt-6">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                        >
                          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Konfirmasi Pendaftaran
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetailPage;
