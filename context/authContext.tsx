import { ReactNode, createContext, useEffect, useState } from "react";
import {
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseAuth } from "@/utils/firebase";

interface InistialStateProps {
  user: any;
  loading: boolean;
  error: string;
  guestLogin: () => void;
  googleSignIn: () => void;
  logout: () => void;
  isAuthenticated?: boolean | null;
}

const initialState = {
  user: null,
  loading: false,
  error: "",
  guestLogin: () => {},
  googleSignIn: () => {},
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

  const updateUserData = (user: any) => {
    setUser({
      expirationTime: user.stsTokenManager.expirationTime as number,
      refreshToken: user.stsTokenManager.refreshToken,
      metadata: user.metadata,
      isAnonymous: user.isAnonymous,
      accessToken: user.accessToken,
      id: user.uid,
    });

    localStorage.setItem("userToken", user.accessToken);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const guestLogin = () => {
    setLoading(true);
    signInAnonymously(firebaseAuth)
      .then((res) => {
        console.log(res.user);
        const userdata = res.user as any;
        updateUserData(userdata);
        // router.push("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.code, error.message);
        setError(error.message);
      });
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    signInWithPopup(firebaseAuth, provider)
      .then((res) => {
        // // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(res);
        // const token = credential?.accessToken;
        // // IdP data available using getAdditionalUserInfo(res)
        // console.log(token);

        console.log(res.user);
        const userdata = res.user as any;
        updateUserData(userdata);
      })
      .catch((error) => {
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // console.log(email, credential);

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
      value={{
        user,
        guestLogin,
        googleSignIn,
        loading,
        error,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
