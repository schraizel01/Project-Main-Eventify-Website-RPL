import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    jenis: 'seminar',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    lokasi: '',
    penyelenggara: '',
    kuota: 100,
    status: 'aktif'
  });

  useEffect(() => {
    fetchEventData();
  }, [id]);

  // For PostgreSQL TIMESTAMP (without timezone), just use the string directly
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    return dateString.slice(0, 16);
  };

  const fetchEventData = async () => {
    try {
      const response = await api.get(`/kegiatan/${id}`);
      const event = response.data.data;
      
      setFormData({
        judul: event.judul,
        jenis: event.jenis,
        deskripsi: event.deskripsi,
        tanggal_mulai: formatDateTimeLocal(event.tanggal_mulai),
        tanggal_selesai: formatDateTimeLocal(event.tanggal_selesai),
        lokasi: event.lokasi,
        penyelenggara: event.penyelenggara,
        kuota: event.kuota,
        status: event.status,
        gambar: event.gambar || ''
      });
    } catch (error) {
      toast.error('Gagal memuat data kegiatan');
      navigate('/admin/events');
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
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai,
        kuota: parseInt(formData.kuota)
      };

      await api.put(`/kegiatan/admin/${id}`, payload);
      toast.success('Kegiatan Berhasil Diedit');
      navigate('/admin/events');
    } catch (error) {
      toast.error('Gagal mengubah kegiatan');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <Link to="/admin/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Manage Events
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Kegiatan</h1>
          <p className="mt-1 text-gray-500">Ubah informasi untuk kegiatan ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="judul" className="block text-sm font-semibold text-gray-700 mb-1">Judul Kegiatan *</label>
                <input type="text" id="judul" name="judul" required value={formData.judul} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div>
                <label htmlFor="jenis" className="block text-sm font-semibold text-gray-700 mb-1">Jenis Kegiatan *</label>
                <select id="jenis" name="jenis" required value={formData.jenis} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm bg-white">
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="kuota" className="block text-sm font-semibold text-gray-700 mb-1">Kuota Peserta *</label>
                <input type="number" id="kuota" name="kuota" min="1" required value={formData.kuota} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div>
                <label htmlFor="tanggal_mulai" className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Mulai *</label>
                <input type="datetime-local" id="tanggal_mulai" name="tanggal_mulai" required value={formData.tanggal_mulai} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div>
                <label htmlFor="tanggal_selesai" className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Selesai *</label>
                <input type="datetime-local" id="tanggal_selesai" name="tanggal_selesai" required value={formData.tanggal_selesai} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="lokasi" className="block text-sm font-semibold text-gray-700 mb-1">Lokasi *</label>
                <input type="text" id="lokasi" name="lokasi" required value={formData.lokasi} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="penyelenggara" className="block text-sm font-semibold text-gray-700 mb-1">Penyelenggara *</label>
                <input type="text" id="penyelenggara" name="penyelenggara" required value={formData.penyelenggara} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Kegiatan *</label>
                <textarea id="deskripsi" name="deskripsi" rows="6" required value={formData.deskripsi} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm"></textarea>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="gambar" className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar Kegiatan (Opsional)</label>
                <input type="url" id="gambar" name="gambar" value={formData.gambar} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm" />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">Status Kegiatan</label>
                <select id="status" name="status" required value={formData.status} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm bg-white">
                  <option value="aktif">Aktif</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>

          </div>

          <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4">
            <Link to="/admin/events" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors">
              Batal
            </Link>
            <button type="submit" disabled={submitting} className="flex items-center justify-center px-6 py-2.5 bg-primary text-white hover:bg-secondary rounded-lg font-medium disabled:opacity-70">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditEventPage;
