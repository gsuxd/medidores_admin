import Payment from "@/models/payment";
import axios from "axios";

interface ParamsListPayments {
  page: number;
  limit: number;
  rut: string;
  start: Date,
  end: Date,
  userId?: number,
  order?: "asc" | "desc"| null;
  orderBy?: string| null;
  enabled?: boolean| null;
}

export default abstract class PaymentsApi {
  static async getPayment(id: number): Promise<Payment> {
    try {
      const res = await axios.get(import.meta.env.VITE_SERVER_URL + "/api/admin/payments/" + id, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }});
      return Payment.fromJson(res.data);
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }
  static async list(params: ParamsListPayments): Promise<{
    count: number;
    payments: Map<number, Payment>;
  }> {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/api/admin/payments/",
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
      const payments = new Map<number, Payment>();
      for (const payment of res.data.payments) {
        payments.set(payment.id, Payment.fromJson(payment));
      }
      return {...res.data,  payments};
    } catch (error) {
      throw new Error(
        "Error inesperado, verifica tu conexión e intenta más tarde"
      );
    }
  }

}
