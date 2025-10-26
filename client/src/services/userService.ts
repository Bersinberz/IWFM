import axiosInstance from "./axisInstance";

export interface User {
  _id: string;
  name: string;
  role: "Admin" | "Driver";
  email: string;
}


export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>("/users/getUsers");
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  const res = await axiosInstance.post("/users/createUser", user);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};