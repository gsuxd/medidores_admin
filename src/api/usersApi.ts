import User, { UserRole } from "@/models/user/user";
import axios from "axios";

interface ParamsListUsers {
  role?: keyof typeof UserRole | 'all' | null;
  page?: number| null;
  limit?: number| null;
  name?: string| null;
  lastName?: string| null;
  email?: string| null;
  phone?: string| null;
  rut? : string| null;
  order?: "asc" | "desc"| null;
  orderBy?: string| null;
  sellerId?: number| null;
  adminId?: number| null;
  enabled?: boolean| null;
}

export default abstract class UsersApi {
  static async getUser(id: number): Promise<User> {
    try {
      const res = await axios.get(import.meta.env.VITE_SERVER_URL + "/api/admin/user/" + id, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }});
      return User.fromJson(res.data);
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }
  static async listUsers(params: ParamsListUsers): Promise<{
    count: number;
    pages: number;
    users: User[];
  }> {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/api/admin/user/",
        { params: params.enabled ? {
          ...params,
          role: params.role === "all" ? undefined : params.role
        } : null, headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        } }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {...res.data, users: res.data.users.map((user: any) => User.fromJson(user))};
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }
}