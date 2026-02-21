// Supabase-backed storage functions for Sikopad
import { supabase } from './supabaseClient';

// ============ User session (localStorage only) ============
export function getUser() {
    const raw = localStorage.getItem('sikopad_user');
    return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
    localStorage.setItem('sikopad_user', JSON.stringify(user));
}

export function clearUser() {
    localStorage.removeItem('sikopad_user');
}

// ============ Scan History ============
export async function getScanHistory() {
    const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('timestamp', { ascending: false });
    if (error) { console.error('getScanHistory error:', error); return []; }
    return data.map(r => ({
        id: r.id,
        user: r.user_name,
        value: r.value,
        timestamp: r.timestamp,
    }));
}

export async function addScanRecord(record) {
    const { error } = await supabase.from('scan_history').insert({
        id: record.id || Date.now().toString(),
        user_name: record.user,
        value: record.value || record.qrValue || '',
        timestamp: record.timestamp || new Date().toISOString(),
    });
    if (error) console.error('addScanRecord error:', error);
}

// ============ Apel Records ============
export async function getApelRecords() {
    const { data, error } = await supabase
        .from('apel_records')
        .select('*')
        .order('timestamp', { ascending: false });
    if (error) { console.error('getApelRecords error:', error); return []; }
    return data.map(r => ({
        id: r.id,
        user: r.user_name,
        anggrek: r.anggrek,
        bougenville: r.bougenville,
        cempaka: r.cempaka,
        dahlia: r.dahlia,
        edelweise: r.edelweise,
        dapur: r.dapur,
        total: r.total,
        timestamp: r.timestamp,
        updatedAt: r.updated_at,
    }));
}

export async function addApelRecord(record) {
    const { error } = await supabase.from('apel_records').insert({
        id: record.id || Date.now().toString(),
        user_name: record.user,
        anggrek: record.anggrek || 0,
        bougenville: record.bougenville || 0,
        cempaka: record.cempaka || 0,
        dahlia: record.dahlia || 0,
        edelweise: record.edelweise || 0,
        dapur: record.dapur || 0,
        total: record.total || 0,
        timestamp: record.timestamp || new Date().toISOString(),
    });
    if (error) console.error('addApelRecord error:', error);
}

export async function updateApelRecord(id, updatedData) {
    const payload = { updated_at: new Date().toISOString() };
    const fields = ['anggrek', 'bougenville', 'cempaka', 'dahlia', 'edelweise', 'dapur', 'total'];
    fields.forEach(f => { if (updatedData[f] !== undefined) payload[f] = updatedData[f]; });

    const { error } = await supabase.from('apel_records').update(payload).eq('id', id);
    if (error) console.error('updateApelRecord error:', error);
    return await getApelRecords();
}

export async function deleteApelRecord(id) {
    const { error } = await supabase.from('apel_records').delete().eq('id', id);
    if (error) console.error('deleteApelRecord error:', error);
    return await getApelRecords();
}

// ============ QR Points ============
export async function getQrPoints() {
    const { data, error } = await supabase
        .from('qr_points')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getQrPoints error:', error); return []; }
    return data.map(r => ({
        id: r.id,
        name: r.name,
        location: r.location,
        qrValue: r.qr_value,
        createdBy: r.created_by,
        createdAt: r.created_at,
    }));
}

export async function addQrPoint(point) {
    const { error } = await supabase.from('qr_points').insert({
        id: point.id || Date.now().toString(),
        name: point.name,
        location: point.location || '',
        qr_value: point.qrValue,
        created_by: point.createdBy,
        created_at: point.createdAt || new Date().toISOString(),
    });
    if (error) console.error('addQrPoint error:', error);
    return await getQrPoints();
}

export async function updateQrPoint(id, updatedData) {
    const payload = {};
    if (updatedData.name !== undefined) payload.name = updatedData.name;
    if (updatedData.location !== undefined) payload.location = updatedData.location;

    const { error } = await supabase.from('qr_points').update(payload).eq('id', id);
    if (error) console.error('updateQrPoint error:', error);
    return await getQrPoints();
}

export async function deleteQrPoint(id) {
    const { error } = await supabase.from('qr_points').delete().eq('id', id);
    if (error) console.error('deleteQrPoint error:', error);
    return await getQrPoints();
}
