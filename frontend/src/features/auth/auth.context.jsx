import { createContext, useState, useEffect } from "react";
import { Getme } from './services/auth.api';   // path apne folder structure ke hisab se adjust karein

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);   // ← false ki jagah true (important, neeche wajah)

    useEffect(() => {
        (async () => {
            try {
                const data = await Getme();
                setUser(data.user);
            } catch (err) {
                setUser(null);   // no valid cookie / expired token → logged out
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, setLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};