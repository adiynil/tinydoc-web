import service from "../core";

export const current = () => {
  return service.get("/users/current");
};

export const register = (user) => {
  return service.post("/users/register", user);
};

export const login = (user) => {
  return service.post("/users/login", user);
};

export default {
  current,
  register,
  login,
};
