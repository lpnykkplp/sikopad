import { useState } from 'react';

const USERS = ['Administrator', 'RUPAM I', 'RUPAM II', 'RUPAM III', 'RUPAM IV'];

export default function LoginScreen({ onLogin }) {
    const [selected, setSelected] = useState('');

    const handleLogin = () => {
        if (selected) {
            onLogin(selected);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-mesh p-4">
            {/* Background Glow Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="relative w-full max-w-md animate-slide-up">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-teal-500/20 border border-primary-500/30 shadow-glow mb-5">
                        <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white text-glow tracking-tight">
                        SIKOPAD
                    </h1>
                    <p className="text-primary-400/80 text-sm font-medium mt-1 tracking-wider uppercase">
                        Sistem Kontrol Terpadu
                    </p>
                    <p className="text-dark-400 text-xs mt-2 leading-relaxed">
                        Lapas Narkotika Kelas IIA Yogyakarta
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass-card rounded-2xl p-8 shadow-glow-sm">
                    <h2 className="text-lg font-semibold text-dark-200 mb-6 text-center">
                        Masuk ke Sistem
                    </h2>

                    {/* Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-dark-400 mb-2">
                            Pilih Akun
                        </label>
                        <div className="relative">
                            <select
                                value={selected}
                                onChange={(e) => setSelected(e.target.value)}
                                className="w-full input-glow rounded-xl px-4 py-3.5 text-dark-200 appearance-none cursor-pointer pr-10 focus:ring-0 transition-all text-sm"
                            >
                                <option value="" disabled className="bg-dark-900 text-dark-400">
                                    — Pilih akun —
                                </option>
                                {USERS.map((user) => (
                                    <option key={user} value={user} className="bg-dark-900 text-dark-200">
                                        {user}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-primary-500/60" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={!selected}
                        className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${selected
                            ? 'btn-glow text-white cursor-pointer'
                            : 'bg-dark-800 text-dark-500 cursor-not-allowed border border-dark-700'
                            }`}
                    >
                        {selected ? `Masuk sebagai ${selected}` : 'Pilih akun terlebih dahulu'}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-dark-600 text-xs mt-6">
                    © 2026 SIKOPAD v1.0
                </p>
            </div>
        </div>
    );
}
