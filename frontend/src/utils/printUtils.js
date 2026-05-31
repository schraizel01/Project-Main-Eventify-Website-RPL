/**
 * Utility functions untuk fitur cetak (print)
 */

/**
 * Cetak Dashboard dengan statistik
 */
export const printDashboard = (stats, recentEvents) => {
  const printWindow = window.open('', '', 'width=900,height=600');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Laporan Dashboard Admin - Eventify</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #1f2937;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #6b7280;
          font-size: 12px;
        }
        
        .print-date {
          text-align: right;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 20px;
        }
        
        .stats-section {
          margin-bottom: 30px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .stat-card {
          border: 1px solid #e5e7eb;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
          margin: 25px 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        
        thead {
          background-color: #f3f4f6;
        }
        
        th {
          padding: 10px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #d1d5db;
        }
        
        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        tr:hover {
          background-color: #f9fafb;
        }
        
        .status-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-aktif {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status-tidak-aktif {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 11px;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Eventify Admin Dashboard</h1>
          <p>Laporan Statistik Kegiatan</p>
        </div>
        
        <div class="print-date">
          Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
          pukul ${new Date().toLocaleTimeString('id-ID')}
        </div>
        
        <div class="stats-section">
          <h2 class="section-title">Ringkasan Statistik</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Kegiatan</div>
              <div class="stat-value">${stats.totalEvents}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Peserta</div>
              <div class="stat-value">${stats.totalParticipants}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Kegiatan Mendatang</div>
              <div class="stat-value">${stats.upcomingEvents}</div>
            </div>
          </div>
        </div>
        
        <h2 class="section-title">Kegiatan Terbaru</h2>
        <table>
          <thead>
            <tr>
              <th>Judul</th>
              <th>Jenis</th>
              <th>Tanggal</th>
              <th>Peserta</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${recentEvents.map(event => `
              <tr>
                <td>${event.judul}</td>
                <td>${event.jenis}</td>
                <td>${new Date(event.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                <td>${event.jumlah_terdaftar} / ${event.kuota}</td>
                <td>
                  <span class="status-badge ${event.status === 'aktif' ? 'status-aktif' : 'status-tidak-aktif'}">
                    ${event.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>© 2026 Eventify Admin System. Document is confidential and for internal use only.</p>
        </div>
      </div>
      
      <script>
        window.print();
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Cetak daftar peserta
 */
export const printPeserta = (pesertaList, eventName = 'Semua Kegiatan') => {
  const printWindow = window.open('', '', 'width=1000,height=600');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Laporan Daftar Peserta - Eventify</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #1f2937;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #6b7280;
          font-size: 13px;
        }
        
        .event-info {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 12px 15px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .event-info strong {
          color: #1f2937;
        }
        
        .print-date {
          text-align: right;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 20px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        
        thead {
          background-color: #f3f4f6;
        }
        
        th {
          padding: 10px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #d1d5db;
        }
        
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        tr:hover {
          background-color: #f9fafb;
        }
        
        tbody tr:nth-child(even) {
          background-color: #fafafa;
        }
        
        .no-data {
          text-align: center;
          padding: 20px;
          color: #9ca3af;
          font-size: 13px;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: #9ca3af;
          font-size: 11px;
        }
        
        .summary {
          margin-top: 20px;
          padding: 15px;
          background-color: #f3f4f6;
          border-radius: 4px;
          text-align: right;
          font-size: 13px;
          font-weight: 600;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Eventify - Laporan Daftar Peserta</h1>
          <p>Dokumentasi peserta terdaftar</p>
        </div>
        
        <div class="print-date">
          Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
          pukul ${new Date().toLocaleTimeString('id-ID')}
        </div>
        
        <div class="event-info">
          <strong>Kegiatan:</strong> ${eventName}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>No. Telepon</th>
              <th>Asal Kampus</th>
              <th>Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            ${pesertaList.length > 0 ? pesertaList.map((reg, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${reg.peserta?.nama || '-'}</td>
                <td>${reg.peserta?.email || '-'}</td>
                <td>${reg.peserta?.nomor_telepon || '-'}</td>
                <td>${reg.peserta?.institusi || '-'}</td>
                <td>${reg.tanggal_daftar ? new Date(reg.tanggal_daftar).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="6" class="no-data">Tidak ada data peserta</td>
              </tr>
            `}
          </tbody>
        </table>
        
        ${pesertaList.length > 0 ? `
          <div class="summary">
            Total Peserta: ${pesertaList.length} orang
          </div>
        ` : ''}
        
        <div class="footer">
          <div>© 2026 Eventify Admin System</div>
          <div>Dokumen ini untuk penggunaan internal saja</div>
        </div>
      </div>
      
      <script>
        window.print();
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Cetak daftar event
 */
export const printEvents = (eventsList) => {
  const printWindow = window.open('', '', 'width=1000,height=600');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Laporan Daftar Event - Eventify</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #1f2937;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #6b7280;
          font-size: 13px;
        }
        
        .print-date {
          text-align: right;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 20px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        
        thead {
          background-color: #f3f4f6;
        }
        
        th {
          padding: 10px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #d1d5db;
        }
        
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        tr:hover {
          background-color: #f9fafb;
        }
        
        tbody tr:nth-child(even) {
          background-color: #fafafa;
        }
        
        .status-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-aktif {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status-tidak-aktif {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .no-data {
          text-align: center;
          padding: 20px;
          color: #9ca3af;
          font-size: 13px;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: #9ca3af;
          font-size: 11px;
        }
        
        .summary {
          margin-top: 20px;
          padding: 15px;
          background-color: #f3f4f6;
          border-radius: 4px;
          text-align: right;
          font-size: 13px;
          font-weight: 600;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Eventify - Laporan Daftar Event</h1>
          <p>Dokumentasi semua kegiatan yang terdaftar</p>
        </div>
        
        <div class="print-date">
          Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
          pukul ${new Date().toLocaleTimeString('id-ID')}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Judul Event</th>
              <th>Jenis</th>
              <th>Tanggal Mulai</th>
              <th>Penyelenggara</th>
              <th>Peserta</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${eventsList.length > 0 ? eventsList.map((event, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${event.judul}</strong></td>
                <td>${event.jenis}</td>
                <td>${new Date(event.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                <td>${event.penyelenggara || '-'}</td>
                <td>${event.jumlah_terdaftar} / ${event.kuota}</td>
                <td>
                  <span class="status-badge ${event.status === 'aktif' ? 'status-aktif' : 'status-tidak-aktif'}">
                    ${event.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7" class="no-data">Tidak ada data event</td>
              </tr>
            `}
          </tbody>
        </table>
        
        ${eventsList.length > 0 ? `
          <div class="summary">
            Total Event: ${eventsList.length}
          </div>
        ` : ''}
        
        <div class="footer">
          <div>© 2026 Eventify Admin System</div>
          <div>Dokumen ini untuk penggunaan internal saja</div>
        </div>
      </div>
      
      <script>
        window.print();
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Cetak halaman custom dengan template yang fleksibel
 */
export const printCustom = (title, subtitle, content, htmlContent = '') => {
  const printWindow = window.open('', '', 'width=1000,height=600');
  
  const customHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Eventify</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #1f2937;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #6b7280;
          font-size: 13px;
        }
        
        .print-date {
          text-align: right;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 20px;
        }
        
        .content {
          line-height: 1.8;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        
        <div class="print-date">
          Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
          pukul ${new Date().toLocaleTimeString('id-ID')}
        </div>
        
        <div class="content">
          ${htmlContent || content}
        </div>
      </div>
      
      <script>
        window.print();
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(customHtml);
  printWindow.document.close();
};
