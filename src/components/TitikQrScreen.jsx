import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getQrPoints, addQrPoint, updateQrPoint, deleteQrPoint } from '../utils/storage';

export default function TitikQrScreen({ user }) {
    const [points, setPoints] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showQrPreview, setShowQrPreview] = useState(null);
    const [formName, setFormName] = useState('');
    const [formLocation, setFormLocation] = useState('');

    useEffect(() => {
        const loadPoints = async () => {
            const data = await getQrPoints();
            setPoints(data);
        };
        loadPoints();
    }, []);

    const handleAdd = async () => {
        if (!formName.trim()) return;
        const point = {
            id: Date.now().toString(),
            name: formName.trim(),
            location: formLocation.trim(),
            qrValue: `SIKOPAD-${formName.trim().toUpperCase().replace(/\s+/g, '_')}-${Date.now()}`,
            createdAt: new Date().toISOString(),
            createdBy: user,
        };
        const updated = await addQrPoint(point);
        setPoints(updated);
        setFormName('');
        setFormLocation('');
        setShowAddModal(false);
    };

    const handleEdit = async () => {
        if (!formName.trim() || !showEditModal) return;
        const updated = await updateQrPoint(showEditModal.id, {
            name: formName.trim(),
            location: formLocation.trim(),
        });
        setPoints(updated);
        setFormName('');
        setFormLocation('');
        setShowEditModal(null);
    };

    const handleDelete = async (id) => {
        const updated = await deleteQrPoint(id);
        setPoints(updated);
        setShowDeleteConfirm(null);
    };

    const openEditModal = (point) => {
        setFormName(point.name);
        setFormLocation(point.location || '');
        setShowEditModal(point);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(null);
        setFormName('');
        setFormLocation('');
    };

    const handlePrintAll = useCallback(() => {
        if (points.length === 0) return;

        const qrItems = points.map((point) => {
            const svgMarkup = renderToStaticMarkup(
                <QRCodeSVG value={point.qrValue} size={180} level="H" />
            );
            return { ...point, svgMarkup };
        });

        const printHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Cetak QR Code - SIKOPAD</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: #fff; }
        h1 { text-align: center; font-size: 18px; margin-bottom: 4px; }
        .subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; text-align: center; page-break-inside: avoid; }
        .card h3 { font-size: 13px; margin-bottom: 4px; }
        .card .location { font-size: 11px; color: #666; margin-bottom: 10px; }
        .card svg { display: block; margin: 0 auto 8px; }
        .card .qr-value { font-size: 8px; color: #999; word-break: break-all; font-family: monospace; }
        @media print {
            body { padding: 10px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <h1>SIKOPAD - Titik Kontrol QR Code</h1>
    <p class="subtitle">Lapas Narkotika Kelas IIA Yogyakarta</p>
    <div class="grid">
        ${qrItems.map(item => `
            <div class="card">
                <h3>${item.name}</h3>
                ${item.location ? `<p class="location">${item.location}</p>` : '<p class="location">&nbsp;</p>'}
                ${item.svgMarkup}
                <p class="qr-value">${item.qrValue}</p>
            </div>
        `).join('')}
    </div>
    <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printHtml);
            printWindow.document.close();
        }
    }, [points]);

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Titik QR</h2>
                    <p className="text-slate-400 text-sm mt-1">Kelola titik kontrol QR code</p>
                </div>
                <div className="flex items-center gap-2">
                    {points.length > 0 && (
                        <button
                            onClick={handlePrintAll}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors"
                            title="Cetak semua QR"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.159 48.159 0 018.5 0m-8.5 0V6.938a2.25 2.25 0 01.598-1.524 48.21 48.21 0 017.304 0 2.25 2.25 0 01.598 1.524V7.03" />
                            </svg>
                            Cetak
                        </button>
                    )}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah
                    </button>
                </div>
            </div>

            {/* Points List */}
            {points.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-sm mb-1">Belum ada titik QR</p>
                    <p className="text-slate-400 text-xs">Tekan tombol "Tambah" untuk membuat titik baru</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {points.map((point, index) => (
                        <div key={point.id} className="flat-card p-4 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="flex items-start gap-3">
                                <button
                                    onClick={() => setShowQrPreview(point)}
                                    className="flex-shrink-0 bg-slate-50 rounded-lg p-1.5 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                                >
                                    <QRCodeSVG value={point.qrValue} size={52} level="M" />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-slate-700 font-semibold text-sm truncate">{point.name}</h3>
                                    {point.location && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            <span className="text-slate-400 text-xs truncate">{point.location}</span>
                                        </div>
                                    )}
                                    <p className="text-slate-400 text-[10px] mt-1.5">
                                        Dibuat: {new Date(point.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button
                                        onClick={() => setShowQrPreview(point)}
                                        className="w-8 h-8 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-500 transition-colors"
                                        title="Lihat QR"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openEditModal(point)}
                                        className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-500 transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(point.id)}
                                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                                        title="Hapus"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {showDeleteConfirm === point.id && (
                                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                                    <p className="text-red-600 text-sm mb-3">Yakin ingin menghapus titik "<span className="font-semibold">{point.name}</span>"?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(point.id)}
                                            className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                                        >
                                            Ya, Hapus
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(null)}
                                            className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* QR Preview Modal */}
            {showQrPreview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 animate-fade-in" onClick={() => setShowQrPreview(null)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-lg animate-slide-up border border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">{showQrPreview.name}</h3>
                            {showQrPreview.location && (
                                <p className="text-slate-400 text-xs mb-4">{showQrPreview.location}</p>
                            )}
                            <div className="bg-white rounded-xl p-4 inline-block mx-auto mb-4 border border-slate-200">
                                <QRCodeSVG value={showQrPreview.qrValue} size={200} level="H" includeMargin={false} />
                            </div>
                            <p className="text-slate-400 text-[10px] font-mono break-all mb-4 px-2">{showQrPreview.qrValue}</p>
                            <button
                                onClick={() => setShowQrPreview(null)}
                                className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 animate-fade-in" onClick={closeModal}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg animate-slide-up border border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-slate-800 mb-5">
                            {showEditModal ? 'Edit Titik QR' : 'Tambah Titik QR'}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-500 mb-1.5">Nama Titik</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Contoh: Pos Jaga Utama"
                                className="w-full input-flat rounded-xl px-4 py-3 text-slate-700 text-sm"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-500 mb-1.5">Lokasi <span className="text-slate-400">(opsional)</span></label>
                            <input
                                type="text"
                                value={formLocation}
                                onChange={(e) => setFormLocation(e.target.value)}
                                placeholder="Contoh: Gerbang Depan Blok A"
                                className="w-full input-flat rounded-xl px-4 py-3 text-slate-700 text-sm"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={showEditModal ? handleEdit : handleAdd}
                                disabled={!formName.trim()}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${formName.trim()
                                    ? 'btn-primary'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    }`}
                            >
                                {showEditModal ? 'Simpan' : 'Tambah'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
