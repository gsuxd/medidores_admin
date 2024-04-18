import Due from "@/models/due";
import axios from "axios";

interface IParams {
    start: Date;
    end: Date;
    status: string;
    page: number;
    adminId: number;
    order: string,
    orderBy: string,
    enabled: boolean;
}

export default abstract class DueApi {
    static async getDues(params: IParams): Promise<{
        dues: Map<number, Due>;
        count: number;
        pages: number;
    }> {
        try {
            const {data} = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/dues`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: params.enabled ? {
                    ...params,
                    start: params.start.toISOString(),
                    end: params.end.toISOString()
                } : {
                    adminId: params.adminId
                }
                })
            const dues = new Map<number, Due>();
            for (const due of data.dues) {
                dues.set(due.id, Due.fromJson(due));
            }
            return {
                dues,
                count: data.count,
                pages: data.pages
            }
        } catch (error) {
            throw new Error('Error, intenta de nuevo');
        }
    }
}