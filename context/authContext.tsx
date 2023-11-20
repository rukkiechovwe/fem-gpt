import { ReactNode, createContext, useEffect, useState } from "react";
import { signInAnonymously, signOut } from "firebase/auth";
import { firebaseAuth } from "@/utils/firebase";

interface InistialStateProps {
  user: any;
  loading: boolean;
  error: string;
  guestLogin: () => void;
  logout: () => void;
  isAuthenticated?: boolean | null;
}

const initialState = {
  user: null,
  loading: false,
  error: "",
  guestLogin: () => {},
  logout: () => {},
  isAuthenticated: null,
};

const AuthContext = createContext<InistialStateProps>({ ...initialState });

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // start a new conversation while saving old conversation

  const [user, setUser] = useState<InistialStateProps["user"]>(
    initialState.user
  );
  const [error, setError] = useState<InistialStateProps["error"]>(
    initialState.error
  );
  const [loading, setLoading] = useState<InistialStateProps["loading"]>(
    initialState.loading
  );
  const [isAuthenticated, setIsAuthenticated] = useState<
    InistialStateProps["isAuthenticated"]
  >(initialState.isAuthenticated);

  useEffect(() => {
    setLoading(true);
    const item = localStorage.getItem("userToken") ? true : false;
    if (item) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const guestLogin = () => {
    setLoading(true);
    signInAnonymously(firebaseAuth)
      .then((res) => {
        // console.log(res.user);
        const userdata = res.user as any;
        setUser({
          expirationTime: userdata.stsTokenManager.expirationTime as number,
          refreshToken: userdata.stsTokenManager.refreshToken,
          metadata: res.user.metadata,
          isAnonymous: res.user.isAnonymous,
          accessToken: userdata.accessToken,
        });

        localStorage.setItem("userToken", userdata.accessToken);
        setIsAuthenticated(true);

        setLoading(false);
        // router.push("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.code, error.message);
        setError(error.message);
      });
  };

  const logout = () => {
    console.log("loging out...");

    signOut(firebaseAuth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("userToken");
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, guestLogin, loading, error, isAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
