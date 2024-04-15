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
  ssrId?: number| null;
  enabled?: boolean| null;
}

export default abstract class UsersApi {
  static async update(user: unknown): Promise<void> {
    try {
      const res = await axios.put(import.meta.env.VITE_SERVER_URL + "/api/auth/update/", user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      return res.data;
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }

  static async getUser(id: number): Promise<{
    user: User;
    ssrId: number;
  }> {
    try {
      const res = await axios.get(import.meta.env.VITE_SERVER_URL + "/api/admin/user/" + id, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }});
      return {
        user: User.fromJson(res.data.user),
        ssrId: res.data.ssrId
      };
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }
  static async listUsers(params: ParamsListUsers): Promise<{
    count: number;
    pages: number;
    users: Map<number, User>;
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
      const users = new Map<number, User>();
      for (const user of res.data.users) {
        users.set(user.id, User.fromJson(user));
      }
      return {...res.data, users};
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }
}
