import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import BerandaScreen from './components/BerandaScreen';
import KontrolScreen from './components/KontrolScreen';
import ApelScreen from './components/ApelScreen';
import TitikQrScreen from './components/TitikQrScreen';
import { getUser, setUser, clearUser } from './utils/storage';

const BASE_TABS = [
    {
        key: 'beranda',
        label: 'Beranda',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
    },
    {
        key: 'kontrol',
        label: 'Kontrol',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
        ),
    },
    {
        key: 'apel',
        label: 'Apel',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
        ),
    },
];

const ADMIN_TAB = {
    key: 'titikqr',
    label: 'Titik QR',
    icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
};

export default function App() {
    const [user, setUserState] = useState(null);
    const [activeTab, setActiveTab] = useState('beranda');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const isAdmin = user === 'Admin';
    const TABS = isAdmin ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS;

    useEffect(() => {
        const saved = getUser();
        if (saved) setUserState(saved);
    }, []);

    const handleLogin = (selectedUser) => {
        setUser(selectedUser);
        setUserState(selectedUser);
        setActiveTab('beranda');
    };

    const handleLogout = () => {
        clearUser();
        setUserState(null);
        setShowLogoutConfirm(false);
        setActiveTab('beranda');
    };

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-dark-950 bg-mesh flex flex-col">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none bg-glow-radial" />

            {/* Top Bar */}
            <header className="sticky top-0 z-50 glass border-b border-dark-800/50">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/30 to-teal-500/30 border border-primary-500/20 flex items-center justify-center shadow-glow-sm">
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white tracking-wide">SIKOPAD</h1>
                            <p className="text-[10px] text-dark-500 -mt-0.5">Sistem Kontrol Terpadu</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors text-xs font-semibold"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Keluar
                    </button>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-xs shadow-glow animate-slide-up">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">Keluar?</h3>
                            <p className="text-dark-400 text-sm mb-5">Anda akan keluar dari sistem</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-dark-300 text-sm font-medium hover:bg-dark-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-24 relative z-10">
                {activeTab === 'beranda' && <BerandaScreen user={user} />}
                {activeTab === 'kontrol' && <KontrolScreen user={user} />}
                {activeTab === 'apel' && <ApelScreen user={user} />}
                {activeTab === 'titikqr' && isAdmin && <TitikQrScreen user={user} />}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-dark-800/50">
                <div className="max-w-lg mx-auto flex items-center">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex flex-col items-center py-3 relative transition-all duration-300 ${activeTab === tab.key
                                ? 'text-primary-400 tab-active'
                                : 'text-dark-500 hover:text-dark-400'
                                }`}
                        >
                            <span className={`transition-transform duration-300 ${activeTab === tab.key ? 'scale-110' : ''}`}>
                                {tab.icon}
                            </span>
                            <span className="text-[10px] font-medium mt-1">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
