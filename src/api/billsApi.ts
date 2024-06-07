import Bill from "@/models/bill";
import axios from "axios";

interface ParamsListBills {
  page: number;
  limit: number;
  rut: string;
  start: Date,
  end: Date,
  deleted: boolean,
  userId?: number,
  order?: "asc" | "desc"| null;
  orderBy?: string| null;
  enabled?: boolean| null;
}

export default abstract class BillsApi {
  static async getBill(id: number): Promise<Bill> {
    try {
      const res = await axios.get(import.meta.env.VITE_SERVER_URL + "/api/admin/bill/" + id, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }});
      return Bill.fromJson(res.data);
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }
  static async listBills(params: ParamsListBills): Promise<{
    count: number;
    bills: Map<number, Bill>;
  }> {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/api/admin/bill/",
        { params: params.enabled ? {
          ...params,
          start: params.start.toISOString(),
          end: params.end.toISOString()
        } : {
          page: params.page,
          limit: params.limit,
        }, headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        } }
      );
      const bills = new Map<number, Bill>();
      for (const user of res.data.bills) {
        bills.set(user.id, Bill.fromJson(user));
      }
      return {...res.data,  bills};
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }
}
