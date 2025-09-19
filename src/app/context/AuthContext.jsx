"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";

// Centralized Auth + Alert Context
const AuthContext = createContext(null);

const STORAGE_KEY = "auth.user";

// Resolve a role from various user shapes
function resolveRole(user) {
  if (!user) return null;
  if (typeof user.role === "string" && user.role.trim())
    return user.role.trim();
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    const first = user.roles.find((r) => typeof r === "string" && r.trim());
    if (first) return first.trim();
  }
  // Default role if your app expects one even when absent
  return "User";
}

export function AuthProvider({ children, autoCloseAlertMs = 3000 }) {
  // Auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =============== ALERT (auto-managed) ===========================
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");

  const [messageAlert, setMessageAlert] = useState({
    messageKh: "",
    messageEn: "",
  });

  const alertTimeoutRef = useRef(null);

  const clearAnyExistingTimer = () => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }
  };

  const closeAlert = useCallback(() => {
    clearAnyExistingTimer();
    setOpen(false);
  }, []);

  const quickAlert = (status = "info", messageEn = "", messageKh = "") => {
    showAlert({
      status,
      messageEn,
      messageKh: messageKh || messageEn, // fallback to English if Khmer not provided
    });
  };

  const setAlert = (open, alert, message) => {
    setOpen(open);
    setAlertStatus(alert);
    setMessageAlert(message);
  };

  const clearAlert = useCallback(() => {
    clearAnyExistingTimer();
    setOpen(false);
    setAlertStatus("");
    setMessageAlert({ messageKh: "", messageEn: "" });
  }, []);

  // Auto show + optional auto-close
  const showAlert = useCallback(
    ({
      status = "info",
      messageEn = "",
      messageKh = "",
      autoCloseMs = autoCloseAlertMs,
    } = {}) => {
      // Normalize status
      const normalized = String(status).toLowerCase();
      const allowed = ["success", "error", "warning", "info"];
      const finalStatus = allowed.includes(normalized) ? normalized : "info";

      const finalMessageKh = messageKh || messageEn || "";
      const finalMessageEn = messageEn || "";

      setAlertStatus(finalStatus);
      setMessageAlert({
        messageKh: finalMessageKh,
        messageEn: finalMessageEn,
      });
      setOpen(true);

      clearAnyExistingTimer();
      if (autoCloseMs && autoCloseMs > 0) {
        alertTimeoutRef.current = setTimeout(() => {
          setOpen(false);
          setAlertStatus("");
          setMessageAlert({ messageKh: "", messageEn: "" });
          alertTimeoutRef.current = null;
        }, autoCloseMs);
      }
    },
    [autoCloseAlertMs]
  );

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearAnyExistingTimer();
    };
  }, []);

  // =============== AUTH PERSISTENCE ================================
  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const raw =
          typeof window !== "undefined"
            ? window.localStorage.getItem(STORAGE_KEY)
            : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!cancelled) setUser(parsed);
        } else {
        }
      } catch (e) {
        console.error("Failed to hydrate auth user:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const role = useMemo(() => resolveRole(user), [user]);

  const hasPermission = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;
      if (loading) return false;
      if (!role) return false;
      if (role === "Admin") return true; // Admin as super-role
      return requiredRoles.includes(role);
    },
    [loading, role]
  );

  const login = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      hasPermission,
      login,
      logout,

      // Alerts
      alertOpen: open,
      alertStatus,
      messageAlert,
      showAlert,
      closeAlert,
      clearAlert,
      quickAlert,
      setAlert,

      setOpen,
      setAlertStatus,
      setMessageAlert,
    }),
    [
      user,
      role,
      loading,
      hasPermission,
      login,
      logout,
      open,
      alertStatus,
      messageAlert,
      showAlert,
      closeAlert,
      clearAlert,
    ]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
