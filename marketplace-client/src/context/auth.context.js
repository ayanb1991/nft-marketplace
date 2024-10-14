import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, fetchUserData } from "../utilities/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // fetch user data from firestore and merge it with user object
      if (user) {
        fetchUserData(user.uid).then((userData) => {
          if (userData) {
            setUser({ ...user, ...userData });
          } else {
            setUser(user);
          }
        });
      } else {
        setUser(null);
      }

      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
