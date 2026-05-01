import { useContext } from "react";
import { AuthContext } from "./authTypes";

export const useAuth = () => useContext(AuthContext);
