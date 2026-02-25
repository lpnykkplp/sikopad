import { useState, useEffect } from 'react';
import {
    getApelRecords,
    addApelRecord,
    updateApelRecord,
    deleteApelRecord,
} from '../utils/storage';

const BLOCKS = [
    {
        key: 'anggrek', name: 'Anggrek', color: 'bg-pink-50 border-pink-200', iconColor: 'text-pink-500',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" /></svg>,
    },
    {
        key: 'bougenville', name: 'Bougenville', color: 'bg-purple-50 border-purple-200', iconColor: 'text-purple-500',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" /></svg>,
    },
    {
        key: 'cempaka', name: 'Cempaka', color: 'bg-yellow-50 border-yellow-200', iconColor: 'text-yellow-600',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
    },
    {
        key: 'dahlia', name: 'Dahlia', color: 'bg-orange-50 border-orange-200', iconColor: 'text-orange-500',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" /></svg>,
    },
    {
        key: 'edelweise', name: 'Edelweise', color: 'bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-500',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>,
    },
    {
        key: 'dapur', name: 'Dapur', color: 'bg-cyan-50 border-cyan-200', iconColor: 'text-cyan-500',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
    },
];

const emptyForm = () => BLOCKS.reduce((acc, b) => ({ ...acc, [b.key]: '' }), {});

const SHIFTS = [
    { key: 'pagi', label: 'Pagi', icon: '🌅', color: 'bg-amber-50 border-amber-300 text-amber-700' },
    { key: 'siang', label: 'Siang', icon: '☀️', color: 'bg-sky-50 border-sky-300 text-sky-700' },
    { key: 'malam', label: 'Malam', icon: '🌙', color: 'bg-indigo-50 border-indigo-300 text-indigo-700' },
];

export default function ApelScreen({ user }) {
    const [form, setForm] = useState(emptyForm());
    const [shift, setShift] = useState('');
    const [records, setRecords] = useState([]);
    const [view, setView] = useState('form');
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const loadRecords = async () => {
            const data = await getApelRecords();
            setRecords(data);
        };
        loadRecords();
    }, []);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const total = Object.values(form).reduce((sum, v) => sum + (parseInt(v) || 0), 0);

    const handleSave = async () => {
        if (total === 0 || !shift) return;

        if (editingId) {
            const data = {};
            BLOCKS.forEach((b) => { data[b.key] = parseInt(form[b.key]) || 0; });
            data.total = Object.values(data).reduce((s, v) => s + v, 0);
            data.shift = shift;
            const updated = await updateApelRecord(editingId, data);
            setRecords(updated);
            setEditingId(null);
        } else {
            const record = { id: Date.now().toString(), user, shift, timestamp: new Date().toISOString() };
            BLOCKS.forEach((b) => { record[b.key] = parseInt(form[b.key]) || 0; });
            record.total = Object.values(form).reduce((s, v) => s + (parseInt(v) || 0), 0);
            await addApelRecord(record);
            const updated = await getApelRecords();
            setRecords(updated);
        }

        setForm(emptyForm());
        setShift('');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        const f = {};
        BLOCKS.forEach((b) => { f[b.key] = record[b.key]?.toString() || ''; });
        setForm(f);
        setShift(record.shift || '');
        setView('form');
    };

    const handleDelete = async (id) => {
        const updated = await deleteApelRecord(id);
        setRecords(updated);
        setShowDeleteConfirm(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm());
        setShift('');
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('id-ID', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Apel Hunian</h2>
                    <p className="text-slate-400 text-sm mt-1">Data jumlah WBP per blok</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flat-card p-1 flex mb-6">
                <button
                    onClick={() => { setView('form'); handleCancelEdit(); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${view === 'form'
                        ? 'bg-primary-500 text-white'
                        : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Input Data
                </button>
                <button
                    onClick={() => { setView('history'); handleCancelEdit(); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${view === 'history'
                        ? 'bg-primary-500 text-white'
                        : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Riwayat ({records.length})
                </button>
            </div>

            {/* Form View */}
            {view === 'form' && (
                <div className="animate-fade-in">
                    {editingId && (
                        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                            <span className="text-amber-600 text-sm font-medium">Mode Edit</span>
                            <button onClick={handleCancelEdit} className="text-amber-500 hover:text-amber-600 text-xs underline">
                                Batal
                            </button>
                        </div>
                    )}

                    {/* Shift Selector */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-slate-500 mb-2">Waktu Apel</label>
                        <div className="grid grid-cols-3 gap-2">
                            {SHIFTS.map((s) => (
                                <button
                                    key={s.key}
                                    onClick={() => setShift(s.key)}
                                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-1.5 ${shift === s.key
                                            ? s.color + ' ring-2 ring-offset-1 ring-primary-300'
                                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                        }`}
                                >
                                    <span>{s.icon}</span> {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {BLOCKS.map((block) => (
                            <div
                                key={block.key}
                                className={`rounded-xl p-4 border transition-colors ${block.color}`}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={block.iconColor}>{block.icon}</span>
                                    <span className="text-sm font-bold text-slate-700">{block.name}</span>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    value={form[block.key]}
                                    onChange={(e) => handleChange(block.key, e.target.value)}
                                    placeholder="0"
                                    className="w-full input-flat rounded-lg px-3 py-2.5 text-center text-slate-800 font-semibold text-lg"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flat-card p-4 mb-5 border-primary-200">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-sm font-medium">Total WBP</span>
                            <span className="text-2xl font-bold text-primary-500">{total}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={total === 0 || !shift}
                        className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 ${total > 0 && shift
                            ? 'btn-primary cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                    >
                        {saveSuccess ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Tersimpan!
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                {editingId ? 'Update Data' : 'Simpan Data'}
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* History */}
            {view === 'history' && (
                <div className="animate-fade-in space-y-3">
                    {records.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <p className="text-slate-500 text-sm">Belum ada riwayat apel</p>
                        </div>
                    ) : (
                        records.map((record) => (
                            <div key={record.id} className="flat-card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-slate-700 text-sm font-semibold">{record.user}</p>
                                            {record.shift && (
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${SHIFTS.find(s => s.key === record.shift)?.color || 'bg-slate-50 border-slate-200 text-slate-500'
                                                    }`}>
                                                    {SHIFTS.find(s => s.key === record.shift)?.icon} {SHIFTS.find(s => s.key === record.shift)?.label}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-xs mt-0.5">{formatDate(record.timestamp)}</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-primary-50 border border-primary-200">
                                        <span className="text-primary-600 text-sm font-bold">{record.total}</span>
                                        <span className="text-primary-400 text-xs ml-1">WBP</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {BLOCKS.map((block) => (
                                        <div key={block.key} className="bg-slate-50 rounded-lg p-2 text-center">
                                            <p className="text-slate-500 text-[10px] font-bold mb-0.5">
                                                <span className={`inline-block mr-0.5 align-middle ${block.iconColor}`}>
                                                    <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m3-6h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12" /></svg>
                                                </span>
                                                {block.name}
                                            </p>
                                            <p className="text-slate-700 text-sm font-semibold">{record[block.key] || 0}</p>
                                        </div>
                                    ))}
                                </div>

                                {record.user === user && (
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                        <button
                                            onClick={() => handleEdit(record)}
                                            className="flex-1 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(record.id)}
                                            className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            Hapus
                                        </button>
                                    </div>
                                )}

                                {showDeleteConfirm === record.id && (
                                    <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                                        <p className="text-red-600 text-sm mb-3">Yakin ingin menghapus data ini?</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDelete(record.id)}
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
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
