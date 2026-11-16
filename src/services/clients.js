import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';

export const getClient = async (uid) => {
  if (!uid) return { client: null };
  try {
    const docRef = doc(db, 'clients', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { client: { id: snap.id, ...snap.data() } };
    }
    return { client: null };
  } catch (error) {
    console.error('Error in getClient:', error);
    return { client: null, error };
  }
};

export const getAllClients = async () => {
  try {
    const snap = await getDocs(collection(db, 'clients'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching all clients:', error);
    return [];
  }
};

export const createClient = async (uid, data) => {
  try {
    await setDoc(doc(db, 'clients', uid), data, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error };
  }
};

export default { getClient, getAllClients, createClient };
