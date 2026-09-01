const AUTH_KEY = "adminUser";

export const loginUser = (user, rememberMe = false) => {
  const userData = JSON.stringify(user);

  if (rememberMe) {
    localStorage.setItem(AUTH_KEY, userData);
    sessionStorage.removeItem(AUTH_KEY);
  } else {
    sessionStorage.setItem(AUTH_KEY, userData);
    localStorage.removeItem(AUTH_KEY);
  }
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = () => {
  const localUser = localStorage.getItem(AUTH_KEY);
  const sessionUser = sessionStorage.getItem(AUTH_KEY);

  const user = localUser || sessionUser;

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    logoutUser();
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};
