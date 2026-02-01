import { useContext, useEffect, useState, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/client"; // axios instance with credentials enabled
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);


  const location = useLocation();

  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
  ];

  const isPublicRoute = publicRoutes.some(path =>
    location.pathname.startsWith(path)
  );
    

  // Fetch user info if cookie exists
  const fetchUser = async () => {
    try {
      const res = await api.get("/api/user/auth-me");
      const data = res.data;

      if (data?.success) {
        setUserDetails(data.data);
      } else {
        setUserDetails(null);
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
      // Clear user state on 401 errors (token expired/invalid)
      if (error.response?.status === 401) {
        setUser(null);
        setUserDetails(null);
        localStorage.removeItem("user");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (isPublicRoute) {
    setLoading(false);
    return;
  }

  fetchUser();
}, [location.pathname]);

  // Logout
  const logout = async () => {
    try {
      const res = await api.post("/api/user/logout");
      const data = res.data;

      if (data.success) {
        setUser(null);
        localStorage.clear();
        toast.success(data.message || "Logout successful");
        navigate("/login");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const values = {
    api,
    navigate,
    user,
    setUser,
    logout,
    loading,
    userDetails,
  };

  return (
    <AppContext.Provider value={values}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
