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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md animate-slide-up">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        SIKOPAD
                    </h1>
                    <p className="text-primary-600 text-sm font-medium mt-1 tracking-wider uppercase">
                        Sistem Kontrol Terpadu
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                        Lapas Narkotika Kelas IIA Yogyakarta
                    </p>
                </div>

                {/* Login Card */}
                <div className="flat-card p-8">
                    <h2 className="text-base font-semibold text-slate-700 mb-6 text-center">
                        Masuk ke Sistem
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-500 mb-2">
                            Pilih Akun
                        </label>
                        <div className="relative">
                            <select
                                value={selected}
                                onChange={(e) => setSelected(e.target.value)}
                                className="w-full input-flat rounded-xl px-4 py-3.5 text-slate-700 appearance-none cursor-pointer pr-10 text-sm"
                            >
                                <option value="" disabled>— Pilih akun —</option>
                                {USERS.map((user) => (
                                    <option key={user} value={user}>{user}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={!selected}
                        className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-colors duration-200 ${selected
                            ? 'btn-primary cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                    >
                        {selected ? `Masuk sebagai ${selected}` : 'Pilih akun terlebih dahulu'}
                    </button>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    © 2026 SIKOPAD v1.0
                </p>
            </div>
        </div>
    );
}
