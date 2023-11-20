import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("Auth context must be used inside AuthProvider");
  return context;
};

export default useAuth;
