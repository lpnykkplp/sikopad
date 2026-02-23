import { useState, useEffect } from 'react';
import { getScanHistory } from '../utils/storage';

export default function BerandaScreen({ user }) {
    const [clock, setClock] = useState(new Date());
    const [scanHistory, setScanHistory] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchScans = async () => {
            const data = await getScanHistory();
            setScanHistory(data);
        };
        fetchScans();
        const poller = setInterval(fetchScans, 3000);
        return () => clearInterval(poller);
    }, []);

    const hours = clock.getHours();
    let greeting = 'Selamat Pagi';
    if (hours >= 11 && hours < 15) greeting = 'Selamat Siang';
    else if (hours >= 15 && hours < 18) greeting = 'Selamat Sore';
    else if (hours >= 18 || hours < 4) greeting = 'Selamat Malam';

    const formatTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="animate-fade-in">
            {/* Welcome */}
            <div className="flat-card p-6 mb-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-slate-400 text-sm">{greeting} 👋</p>
                        <h2 className="text-xl font-bold text-slate-800 mt-1">{user}</h2>
                        <p className="text-slate-400 text-xs mt-2">
                            {clock.toLocaleDateString('id-ID', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-primary-500 font-mono tracking-wider">
                            {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                        </p>
                        <p className="text-slate-400 text-[10px] mt-0.5">WIB</p>
                    </div>
                </div>
            </div>

            {/* Riwayat Scan */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h3 className="text-sm font-semibold text-slate-700">Riwayat Scan</h3>
                    </div>
                    <span className="text-slate-400 text-xs">{scanHistory.length} total</span>
                </div>

                {scanHistory.length === 0 ? (
                    <div className="flat-card p-8 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 text-sm mb-1">Belum ada riwayat scan</p>
                        <p className="text-slate-400 text-xs">Gunakan menu Kontrol untuk scan QR code</p>
                    </div>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin space-y-2">
                        {scanHistory.map((scan, i) => (
                            <div
                                key={scan.id || i}
                                className="flat-card p-3 flex items-center gap-3"
                            >
                                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-700 text-sm font-medium truncate">{scan.name || scan.value || 'QR Scan'}</p>
                                    {scan.note && (
                                        <p className="text-slate-400 text-[10px] mt-0.5 italic truncate">"{scan.note}"</p>
                                    )}
                                    <p className="text-slate-400 text-[10px] mt-0.5">{scan.user || user}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-primary-500 text-xs font-mono">{formatTime(scan.timestamp)}</p>
                                    <p className="text-slate-400 text-[10px]">{formatDate(scan.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flat-card p-5">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-1">Tentang SIKOPAD</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            Sistem Kontrol Terpadu untuk membantu operasional Lapas Narkotika Kelas IIA Yogyakarta.
                            Gunakan fitur <span className="text-primary-500 font-medium">Kontrol</span> untuk scan QR dan <span className="text-primary-500 font-medium">Apel Hunian</span> untuk pencatatan WBP.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
