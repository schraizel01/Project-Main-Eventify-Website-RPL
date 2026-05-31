import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Link, X, Image as ImageIcon, Loader2, RefreshCw, ZoomIn, ZoomOut, Scissors } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Cropper Modal States
  const [cropSrc, setCropSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({ w: 480, h: 270 });
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const frameRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Handle drag-and-drop actions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      initiateCropper(file);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      initiateCropper(file);
    }
  };

  // Open cropper modal with chosen image file
  const initiateCropper = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Berkas harus berupa gambar (PNG, JPG, JPEG, WEBP, GIF)!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // allow up to 10MB raw file for crop
      toast.error('Ukuran gambar terlalu besar! Maksimal 10MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCropSrc(objectUrl);
  };

  // Calculate base scale to make sure image covers the frame (Cover Logic)
  const handleImageLoad = (e) => {
    if (!frameRef.current) return;
    const F_w = frameRef.current.clientWidth;
    const F_h = frameRef.current.clientHeight;
    setFrameSize({ w: F_w, h: F_h });

    const { naturalWidth, naturalHeight } = e.target;
    
    // Scale image so that naturalAspectRatio covers F_w x F_h
    const ratioX = F_w / naturalWidth;
    const ratioY = F_h / naturalHeight;
    const baseScale = Math.max(ratioX, ratioY);

    const width = naturalWidth * baseScale;
    const height = naturalHeight * baseScale;

    setImgDimensions({ width, height });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Helper to constrain drag offset so image never pops out of crop bounds
  const constrainOffset = (x, y, currentZoom, currentDimensions) => {
    const F_w = frameSize.w;
    const F_h = frameSize.h;

    const W_z = currentDimensions.width * currentZoom;
    const H_z = currentDimensions.height * currentZoom;

    // Bounds limit offsets
    const minX = (F_w - W_z) / 2;
    const maxX = (W_z - F_w) / 2;
    const minY = (F_h - H_z) / 2;
    const maxY = (H_z - F_h) / 2;

    // Constrain x & y, handling cases where scaled size might be slightly smaller
    return {
      x: W_z >= F_w ? Math.min(maxX, Math.max(minX, x)) : 0,
      y: H_z >= F_h ? Math.min(maxY, Math.max(minY, y)) : 0,
    };
  };

  // Handle Drag Events for mouse and touch dragging
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      const constrained = constrainOffset(newX, newY, zoom, imgDimensions);
      setOffset(constrained);
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const newX = e.touches[0].clientX - dragStartRef.current.x;
      const newY = e.touches[0].clientY - dragStartRef.current.y;
      const constrained = constrainOffset(newX, newY, zoom, imgDimensions);
      setOffset(constrained);
    };

    const onTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, zoom, imgDimensions, offset, frameSize]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      };
    }
  };

  // Handle slider zoom
  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    const constrained = constrainOffset(offset.x, offset.y, newZoom, imgDimensions);
    setOffset(constrained);
  };

  const handleZoomBtn = (direction) => {
    const step = 0.2;
    const newZoom = Math.min(3, Math.max(1, zoom + (direction === 'in' ? step : -step)));
    setZoom(newZoom);
    const constrained = constrainOffset(offset.x, offset.y, newZoom, imgDimensions);
    setOffset(constrained);
  };

  // Crop drawing onto Canvas and upload file
  const handleCropAndUpload = () => {
    if (!imgRef.current || !selectedFile) return;

    const F_w = frameSize.w;
    const F_h = frameSize.h;

    // High quality target canvas size (16:9 ratio)
    const C_w = 800;
    const C_h = 450;

    // Ratio between Canvas and Visible Frame size
    const scaleRatio = C_w / F_w;

    // Image scaled dimensions in the UI Frame
    const W_z = imgDimensions.width * zoom;
    const H_z = imgDimensions.height * zoom;

    // Rendered image top-left position relative to visible frame
    const left = (F_w - W_z) / 2 + offset.x;
    const top = (F_h - H_z) / 2 + offset.y;

    // Convert coordinates to high-resolution Canvas coordinate space
    const canvas_w = W_z * scaleRatio;
    const canvas_h = H_z * scaleRatio;
    const canvas_x = left * scaleRatio;
    const canvas_y = top * scaleRatio;

    // Set up HTML5 Canvas
    const canvas = document.createElement('canvas');
    canvas.width = C_w;
    canvas.height = C_h;
    const ctx = canvas.getContext('2d');

    // High-quality image rendering setup
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw cropped image onto Canvas
    ctx.drawImage(imgRef.current, canvas_x, canvas_y, canvas_w, canvas_h);

    // Convert Canvas to Blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Gagal memproses crop gambar.');
        return;
      }

      // Cleanup object URL
      if (cropSrc) {
        URL.revokeObjectURL(cropSrc);
        setCropSrc(null);
      }

      // Create new File from cropped blob
      const croppedFile = new File([blob], selectedFile.name || 'cropped-event.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      // Submit cropped file using current upload process
      await uploadFile(croppedFile);
    }, 'image/jpeg', 0.92); // 92% JPEG compression quality
  };

  // Perform upload to Express Backend
  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('gambar', file);

    try {
      const response = await api.post('/kegiatan/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        onChange(response.data.url);
        toast.success('Gambar berhasil dipotong & diunggah!');
      } else {
        toast.error(response.data.message || 'Gagal mengunggah gambar');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat mengunggah gambar.';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const cancelCropping = () => {
    if (cropSrc) {
      URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
    }
    setSelectedFile(null);
    toast('Pemotongan dibatalkan', { icon: 'ℹ️' });
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Gambar dihapus');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Compute actual positioned coordinates dynamically
  const F_w = frameSize.w;
  const F_h = frameSize.h;
  const W_z = imgDimensions.width * zoom;
  const H_z = imgDimensions.height * zoom;
  const left = (imgDimensions.width ? (F_w - W_z) / 2 : 0) + offset.x;
  const top = (imgDimensions.height ? (F_h - H_z) / 2 : 0) + offset.y;

  return (
    <div className="w-full space-y-4">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unggah File Lokal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tautan URL Gambar
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          {!value ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-primary bg-blue-50/50 scale-[1.01]'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {uploading ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-medium text-gray-600">Mengirim gambar ke server...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-6 space-y-3">
                  <div className="p-3 bg-white rounded-full shadow-sm text-gray-400 border border-gray-100">
                    <UploadCloud className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Tarik & lepas gambar di sini, atau <span className="text-primary hover:text-secondary">pilih file</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, JPEG, WEBP, atau GIF (Maks. 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Image Preview Area */
            <div className="relative rounded-xl border border-gray-200 overflow-hidden group shadow-sm bg-gray-50 max-w-lg">
              <img
                src={value}
                alt="Preview Gambar Kegiatan"
                className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'; // fallback placeholder
                }}
              />
              
              {/* Overlay Control Bar */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg text-sm font-semibold shadow-sm transition-all scale-95 group-hover:scale-100 duration-300"
                >
                  <RefreshCw className="w-4 h-4 text-primary" />
                  Ganti Gambar
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-sm font-semibold shadow-sm transition-all scale-95 group-hover:scale-100 duration-300"
                >
                  <X className="w-4 h-4" />
                  Hapus
                </button>
              </div>

              {/* Hidden file input for Ganti Gambar */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'url' && (
        <div className="space-y-4">
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/gambar-event.jpg"
              className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          {/* Simple URL Preview if value exists */}
          {value && (
            <div className="mt-2 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 max-w-sm">
              <img
                src={value}
                alt="URL Preview"
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* CROPPER MODAL (DIALOUGE OVERLAY) */}
      {cropSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="relative flex flex-col w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-primary" />
                  Sesuaikan Gambar Kegiatan
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Geser dan atur perbesaran gambar untuk rasio 16:9 kartu event.
                </p>
              </div>
              <button
                type="button"
                onClick={cancelCropping}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Active Cropping Frame */}
            <div className="p-6 bg-gray-50/50 flex flex-col items-center justify-center">
              {/* Responsive 16:9 Aspect Frame */}
              <div
                ref={frameRef}
                className="relative w-full aspect-[16/9] bg-neutral-900 border border-neutral-800 shadow-inner rounded-xl overflow-hidden cursor-move group select-none"
              >
                <img
                  ref={imgRef}
                  src={cropSrc}
                  alt="Crop Target"
                  onLoad={handleImageLoad}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className="absolute max-w-none max-h-none pointer-events-none select-none transition-shadow"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${W_z}px`,
                    height: `${H_z}px`,
                    pointerEvents: 'auto', // override to capture events
                  }}
                />

                {/* Subtile grid alignment guide inside crop box (fades out on interaction) */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20 divide-x divide-y divide-white/20 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                  <div></div><div></div><div></div>
                  <div></div><div></div><div></div>
                  <div></div><div></div><div></div>
                </div>

                {/* Cover Safe Guide Overlay */}
                <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-xl"></div>
              </div>

              {/* Slider & Zoom Controls */}
              <div className="w-full mt-6 flex items-center justify-between gap-4 px-2">
                <button
                  type="button"
                  onClick={() => handleZoomBtn('out')}
                  disabled={zoom <= 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-gray-400 w-6 text-right">1x</span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={handleZoomChange}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  />
                  <span className="text-[10px] font-semibold text-gray-400 w-6">3x</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleZoomBtn('in')}
                  disabled={zoom >= 3}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={cancelCropping}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCropAndUpload}
                className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-secondary text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
              >
                <Scissors className="w-4 h-4" />
                Potong & Unggah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
