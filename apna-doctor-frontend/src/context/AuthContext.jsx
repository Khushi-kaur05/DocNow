import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← add this

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // ← done checking
  }, []);

  const login = (data) => {
    const userData = {
      id: data.user.id,
      token: data.accessToken || data.token,
      role: data.user.role,
      username: data.user.name,
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      gender: data.user.gender || "male"
    };
    setUser(userData);
    console.log("Setting user data in Auth Context=====", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("usr data in local storage stored successfully==========")
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);