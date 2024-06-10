import { useAuthStore } from "@/providers/context";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie, destroyCookie } from "nookies";

interface LoginResponse {
  access: string;
  refresh: string;
}

const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:8000/api/token/",
      {
        username,
        password,
      }
    );

    const token = response.data.access;
    const refresh = response.data.refresh;
    useAuthStore.getState().setAuth(token, refresh);

    setCookie(null, "accessToken", token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
    setCookie(null, "refreshToken", refresh, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return true;
  } catch (error) {
    console.error("Failed to login:", error);
    return false;
  }
};

const refresh = async (): Promise<boolean> => {
  const refreshToken = useAuthStore.getState().refresh;
  if (!refreshToken) {
    console.error("No refresh token available");
    return false;
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/api/token/refresh/",
      {
        refresh: refreshToken,
      }
    );

    const { access, refresh } = response.data;
    useAuthStore.getState().setAuth(access, refresh);

    setCookie(null, "accessToken", access, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
    setCookie(null, "refreshToken", refresh, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    useAuthStore.getState().clearAuth(); // Clear auth state on failure
    return false;
  }
};

const logout = async () => {
  useAuthStore.getState().clearAuth();
  delete axios.defaults.headers.common["Authorization"];
  destroyCookie(null, "accessToken");
  destroyCookie(null, "refreshToken");
  window.location.reload();
};

export { login, logout, refresh };
