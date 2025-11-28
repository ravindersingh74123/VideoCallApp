// Safely handle user & token values in localStorage

export const storage = {
  
  setToken(token) {
    if (!token) {
      localStorage.removeItem("token");
      return;
    }
    localStorage.setItem("token", token);
  },

  getToken() {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" && token !== "null" ? token : null;
  },

  setUser(user) {
    if (!user) {
      localStorage.removeItem("user");
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser() {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined" || raw === "null") return null;
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  },

  clearAll() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};
