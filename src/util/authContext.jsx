import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const inintalUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};
