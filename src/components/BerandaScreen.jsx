import { useState, useEffect } from 'react';
import { getScanHistory } from '../utils/storage';

export default function BerandaScreen({ user }) {
    const [clock, setClock] = useState(new Date());
    const [scanHistory, setScanHistory] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Poll scan history every 3 seconds for realtime updates
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

    const recentScans = scanHistory.slice(0, 15);

    return (
        <div className="animate-fade-in">
            {/* Welcome Section */}
            <div className="glass-card rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-start justify-between">
                    <div>
                        <p className="text-dark-400 text-sm">{greeting} 👋</p>
                        <h2 className="text-2xl font-bold text-white mt-1 text-glow-sm">{user}</h2>
                        <p className="text-dark-500 text-xs mt-2">
                            {clock.toLocaleDateString('id-ID', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-primary-400 text-glow-sm font-mono tracking-wider">
                            {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                        </p>
                        <p className="text-dark-500 text-[10px] mt-0.5">WIB</p>
                    </div>
                </div>
            </div>

            {/* Riwayat Scan Realtime */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <h3 className="text-sm font-semibold text-dark-200">Riwayat Scan</h3>
                    </div>
                    <span className="text-dark-500 text-xs">{scanHistory.length} total</span>
                </div>

                {recentScans.length === 0 ? (
                    <div className="glass-card rounded-xl p-8 text-center">
                        <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-dark-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                            </svg>
                        </div>
                        <p className="text-dark-500 text-sm mb-1">Belum ada riwayat scan</p>
                        <p className="text-dark-600 text-xs">Gunakan menu Kontrol untuk scan QR code</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentScans.map((scan, i) => (
                            <div
                                key={scan.id || i}
                                className="glass-card rounded-xl p-3 flex items-center gap-3 animate-fade-in"
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-dark-200 text-sm font-medium truncate">{scan.value || scan.qrValue || 'QR Scan'}</p>
                                    <p className="text-dark-500 text-[10px] mt-0.5">{scan.user || user}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-primary-400 text-xs font-mono">{formatTime(scan.timestamp)}</p>
                                    <p className="text-dark-600 text-[10px]">{formatDate(scan.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="glass-card rounded-2xl p-5 border-primary-500/10">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-dark-200 mb-1">Tentang SIKOPAD</h3>
                        <p className="text-dark-500 text-xs leading-relaxed">
                            Sistem Kontrol Terpadu untuk membantu operasional Lapas Narkotika Kelas IIA Yogyakarta.
                            Gunakan fitur <span className="text-primary-400">Kontrol</span> untuk scan QR dan <span className="text-primary-400">Apel Hunian</span> untuk pencatatan WBP.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

