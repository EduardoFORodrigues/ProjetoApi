import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
interface AuthContextData {
  isAuthenticated: boolean;
  userType: "aluno" | "professor" | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"aluno" | "professor" | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Salvar token e userType em SecureStore ao logar
  const login = async (token: string) => {
    const decodedToken = jwtDecode(token) as {
      type: "aluno" | "professor";
    };
    setToken(token);
    if (decodedToken) {
      setUserType(decodedToken?.type);
    }
    setIsAuthenticated(true);
  };

  // Remover token e userType de SecureStore ao deslogar
  const logout = async () => {
    setToken(null);
    setUserType(null);
    setIsAuthenticated(false);
  };

  // Validar token ao inicializar o contexto
  const validateToken = async (): Promise<boolean> => {
    if (token) {
      setIsAuthenticated(true);
      return true;
    } else {
      logout(); // Caso o token esteja inválido
      return false;
    }
  };

  useEffect(() => {
    validateToken(); // Verificar autenticação ao carregar o app
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, token, login, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
