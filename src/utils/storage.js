/**
 * Storage utility providing window.storage integration with fallback to window.localStorage.
 */
export const storage = {
  async get(key, shared = false) {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function") {
      try {
        const res = await window.storage.get(key, shared);
        if (res && typeof res.value !== "undefined") return res;
      } catch (err) {
        // Fallback to localStorage if window.storage throws missing key or fails
      }
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return { value: item };
      }
    }
    return null;
  },

  async set(key, value, shared = false) {
    let success = false;
    if (typeof window !== "undefined" && window.storage && typeof window.storage.set === "function") {
      try {
        const res = await window.storage.set(key, value, shared);
        if (res) success = true;
      } catch (err) {
        // Continue to localStorage fallback
      }
    }
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        success = true;
      } catch (err) {
        // localStorage quotas or errors
      }
    }
    return success;
  },

  async delete(key, shared = false) {
    let success = false;
    if (typeof window !== "undefined" && window.storage && typeof window.storage.delete === "function") {
      try {
        await window.storage.delete(key, shared);
        success = true;
      } catch (err) {
        // Continue to localStorage fallback
      }
    }
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
        success = true;
      } catch (err) {
        // localStorage errors
      }
    }
    return success;
  }
};
