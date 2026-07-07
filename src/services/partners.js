import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { createClientAccount, sendSetPasswordEmail } from './auth';

/**
 * Creates a Firebase Auth user, saves their profile to partners/{uid},
 * and sends a password reset (welcome) email.
 * @param {Object} formData - { name, email, phone }
 * @returns {Promise<Object>} - { uid, tempPassword }
 */
export const createPartner = async (formData) => {
  const cleanPhone = formData.phone.replace(/\D/g, '');
  const last4 = cleanPhone.slice(-4) || '1234';
  const tempPassword = `BOS@${last4}`;

  // 1. Create Firebase Auth user via secondary app (to avoid logging out current admin)
  const authRes = await createClientAccount(formData.email, tempPassword);
  if (authRes.error) {
    throw new Error(authRes.error);
  }

  const uid = authRes.user.uid;
  const formattedPhone = formData.phone.startsWith('+91') ? formData.phone : '+91' + formData.phone;

  // 2. Save profile to partners/{uid}
  await setDoc(doc(db, 'partners', uid), {
    name: formData.name,
    email: formData.email,
    phone: formattedPhone,
    role: 'partner',
    tempPasswordUsed: true,
    createdAt: serverTimestamp()
  });

  // 3. Send welcome email (password reset)
  const emailRes = await sendSetPasswordEmail(formData.email);
  if (emailRes.error) {
    console.error("Warning: Welcome email could not be sent:", emailRes.error);
  }

  return { uid, tempPassword };
};

/**
 * Fetches all documents from the partners collection.
 * @returns {Promise<Array>}
 */
export const getAllPartners = async () => {
  try {
    const snap = await getDocs(collection(db, 'partners'));
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error in getAllPartners:", error);
    throw error;
  }
};

/**
 * Fetches a single partner document.
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export const getPartner = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'partners', uid));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error in getPartner:", error);
    throw error;
  }
};

/**
 * Adds a document to partners/{partnerUid}/referrals.
 * @param {string} partnerUid
 * @param {Object} referralData - { clientName, arnNumber, month, gstStatus, paymentStatus }
 * @returns {Promise<string>} - Created document ID
 */
export const addReferral = async (partnerUid, referralData) => {
  try {
    const docRef = await addDoc(collection(db, `partners/${partnerUid}/referrals`), {
      ...referralData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error in addReferral:", error);
    throw error;
  }
};

/**
 * Updates GST or Payment status for a specific referral.
 * @param {string} partnerUid
 * @param {string} referralId
 * @param {Object} updates - Updates to apply (e.g. { gstStatus, paymentStatus })
 * @returns {Promise<void>}
 */
export const updateReferralStatus = async (partnerUid, referralId, updates) => {
  try {
    await updateDoc(doc(db, `partners/${partnerUid}/referrals`, referralId), updates);
  } catch (error) {
    console.error("Error in updateReferralStatus:", error);
    throw error;
  }
};

/**
 * Fetches referrals for a specific partner using onSnapshot for real-time updates.
 * @param {string} partnerUid
 * @param {Function} callback - Callback function to receive the real-time array of referrals
 * @returns {Function} - Unsubscribe function
 */
export const getPartnerReferrals = (partnerUid, callback) => {
  const q = query(
    collection(db, `partners/${partnerUid}/referrals`),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const referrals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
    callback(referrals);
  }, (error) => {
    console.error("Error in getPartnerReferrals real-time listener:", error);
  });
};
