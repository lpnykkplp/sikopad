import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { getScanHistory, addScanRecord } from '../utils/storage';

export default function KontrolScreen({ user }) {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await getScanHistory();
            setScanHistory(data);
        };
        loadHistory();
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup scanner on unmount
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { });
                scannerRef.current.clear().catch(() => { });
                scannerRef.current = null;
            }
        };
    }, []);

    const startScanner = async () => {
        setError(null);
        setScanResult(null);

        try {
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                (decodedText) => {
                    // Success callback
                    const record = {
                        id: Date.now().toString(),
                        value: decodedText,
                        user,
                        timestamp: new Date().toISOString(),
                    };
                    addScanRecord(record).then(() => {
                        getScanHistory().then(data => setScanHistory(data));
                    });
                    setScanResult(record);

                    // Stop scanner after successful scan
                    scanner.stop().then(() => {
                        scanner.clear();
                        scannerRef.current = null;
                        setScanning(false);
                    }).catch(() => { });
                },
                () => {
                    // Error callback (ignore — fires on every non-QR frame)
                }
            );
            setScanning(true);
        } catch (err) {
            setError('Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.');
            console.error(err);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (e) { /* ignore */ }
            scannerRef.current = null;
        }
        setScanning(false);
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white text-glow-sm">Kontrol QR</h2>
                <p className="text-dark-400 text-sm mt-1">Scan QR code untuk kontrol</p>
            </div>

            {/* Scanner Card */}
            <div className="glass-card rounded-2xl p-5 mb-5">
                <div id="qr-reader" ref={containerRef} className="mb-4 rounded-xl overflow-hidden" />

                {!scanning ? (
                    <button
                        onClick={startScanner}
                        className="w-full btn-glow text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                        </svg>
                        Mulai Scan
                    </button>
                ) : (
                    <button
                        onClick={stopScanner}
                        className="w-full bg-red-600/80 hover:bg-red-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                        </svg>
                        Berhenti Scan
                    </button>
                )}

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Scan Result */}
            {scanResult && (
                <div className="glass-card rounded-2xl p-5 mb-5 animate-slide-up border-primary-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-green-400">Scan Berhasil!</h3>
                    </div>
                    <div className="bg-dark-900/50 rounded-xl p-4">
                        <p className="text-dark-300 text-xs mb-1">Hasil:</p>
                        <p className="text-white font-mono text-sm break-all">{scanResult.value || scanResult.result}</p>
                        <p className="text-dark-500 text-xs mt-2">{formatDate(scanResult.timestamp)}</p>
                    </div>
                </div>
            )}

            {/* History Toggle */}
            <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full glass-card rounded-2xl p-4 flex items-center justify-between hover:border-primary-500/30 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-medium text-dark-300 text-sm">Riwayat Scan ({scanHistory.length})</span>
                </div>
                <svg className={`w-5 h-5 text-dark-500 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {/* History List */}
            {showHistory && (
                <div className="mt-3 space-y-2 animate-slide-up">
                    {scanHistory.length === 0 ? (
                        <div className="text-center py-8 text-dark-500 text-sm">
                            Belum ada riwayat scan
                        </div>
                    ) : (
                        scanHistory.map((item) => (
                            <div key={item.id} className="glass-card rounded-xl p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-dark-200 text-sm font-mono truncate">{item.value || item.result}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-primary-400/70 text-xs">{item.user || item.scannedBy}</span>
                                            <span className="text-dark-700">•</span>
                                            <span className="text-dark-500 text-xs">{formatDate(item.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
