"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/db/supabase";

interface IUserContext {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  loading: true,
  error: null,
});

export const useUser = () => useContext(UserContext);

interface Props {
  children: ReactNode;
}

export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const login = async () => {
      try {
        const usrEmail = process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL ?? "";
        const usrPW = process.env.NEXT_PUBLIC_SUPABASE_USER_PW ?? "";

        const { data, error } = await supabase.auth.signInWithPassword({
          email: usrEmail,
          password: usrPW,
        });

        if (error) throw error;
        if (!data.session || !data.user) throw new Error("No session returned");

        setUser(data.user); // this ensures the JWT is set for client-side requests
      } catch (err: any) {
        console.error("Login error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    login();
  }, []);

  // Optionally, render children only after login succeeds
  if (loading) return <div>Logging in...</div>;
  if (error) return <div>Login failed: {error}</div>;

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}
