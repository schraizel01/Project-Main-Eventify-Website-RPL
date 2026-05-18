import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

const EventCard = ({ event }) => {
  const isAlmostFull = event.jumlah_terdaftar >= event.kuota * 0.9 && event.jumlah_terdaftar < event.kuota;
  const isFull = event.jumlah_terdaftar >= event.kuota;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100 group">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {event.gambar ? (
          <img src={event.gambar} alt={event.judul} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-gray-400 font-medium">Gambar Kegiatan</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase">
          {event.jenis}
        </div>
        {isFull && (
          <div className="absolute top-4 right-4 bg-danger text-white px-3 py-1 rounded-full text-xs font-bold">
            Penuh
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.judul}</h3>
        
        <div className="mt-auto space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span className="truncate">{new Date(event.tanggal_mulai).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span className="truncate">{event.lokasi}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span>{event.jumlah_terdaftar} Terdaftar / {event.kuota} Kuota</span>
          </div>
          
          {isAlmostFull && (
            <div className="text-xs text-warning font-medium mt-1">
              Hampir Penuh! Sisa {event.kuota - event.jumlah_terdaftar} kursi lagi.
            </div>
          )}
        </div>
      </div>
      
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <span className="font-semibold text-primary">Gratis</span>
        <Link 
          to={`/events/${event.kegiatan_id}`}
          className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
