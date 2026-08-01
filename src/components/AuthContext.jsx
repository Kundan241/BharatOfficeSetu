import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
          const isHardcodedAdmin = ['admin@bos.com', 'mu8ndan@gmail.com'].includes(currentUser.email);
          
          if (adminSnap.exists() || isHardcodedAdmin) {
            setIsAdmin(true);
            setRole('admin');
            setPartnerName('Admin/Self');
          } else {
            const partnerSnap = await getDoc(doc(db, 'partners', currentUser.uid));
            if (partnerSnap.exists()) {
              setIsAdmin(false);
              setRole('partner');
              setPartnerName(partnerSnap.data().name || currentUser.email);
            } else {
              setIsAdmin(false);
              setRole(null);
              setPartnerName('');
            }
          }
        } catch (error) {
          console.error("Error checking roles in context:", error);
          setIsAdmin(false);
          setRole(null);
          setPartnerName('');
        }
      } else {
        setIsAdmin(false);
        setRole(null);
        setPartnerName('');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, partnerName, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
