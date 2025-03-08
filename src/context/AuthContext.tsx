import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Creator, Brand } from "../types";
import { mockAuthApi } from "../services/mockApi";

interface AuthContextType {
  user: (Creator | Brand) | null;
  userType: "creator" | "brand" | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    userType: "creator" | "brand"
  ) => Promise<boolean>;
  register: (
    userData: Partial<Creator | Brand>,
    userType: "creator" | "brand"
  ) => Promise<void>;
  logout: () => void;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<(Creator | Brand) | null>(null);
  const [userType, setUserType] = useState<"creator" | "brand" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUserType = localStorage.getItem("userType") as
        | "creator"
        | "brand"
        | null;

      if (token && storedUserType) {
        try {
          const { data } = await mockAuthApi.getCurrentUser();
          setUser(data);
          setUserType(storedUserType);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    type: "creator" | "brand"
  ) => {
    setIsLoading(true);
    try {
      const response = await mockAuthApi.login(email, password, type);

      if (response.success) {
        const userData = response.data.user;
        const token = response.data.token;

        if (type === "creator") {
          setUser(userData as Creator);
        } else {
          setUser(userData as Brand);
        }

        setIsAuthenticated(true);
        setUserType(type);

        localStorage.setItem("token", token);
        localStorage.setItem("userType", type);
        localStorage.setItem("userData", JSON.stringify(userData));

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: Partial<Creator | Brand>,
    type: "creator" | "brand"
  ) => {
    setIsLoading(true);
    try {
      const { data } = await mockAuthApi.register(userData, type);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", type);
      setUser(data.user);
      setUserType(type);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    mockAuthApi.logout().catch(console.error);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
