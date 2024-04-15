import SSR from "@/models/ssr";
import axios from "axios";

interface IUpdate {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    bankNumber: string;
    president: number;
    config: {
        billPrice: number;
        billLimitSection1: number;
        billLimitSection2: number;
        billLimitSection3: number;
        billPriceSection1: number;
        billPriceSection2: number;
        billPriceSection3: number;
        fixedPrice: number;
        subsidy: number;
    };
  }

export default abstract class SSRApi {
    static async login(ssrId: number): Promise<void>{
        try {
            await axios.post(import.meta.env.VITE_SERVER_URL + '/api/auth/login-ssr', {
                ssrId
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
        } catch (error) {
            throw new Error('Error inesperado, verifica tu conexión e intenta más tarde');
        }
    }

    static async update(data: IUpdate): Promise<void>{
        try {
            await axios.put(import.meta.env.VITE_SERVER_URL + '/api/admin/ssr/', data, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            return;
        } catch (e) {
            throw new Error('Error inesperado, verifica tu conexión e intenta más tarde');
        }
    }

    static async list(): Promise<{ssr: Map<number, SSR>}>{
        try {
            const {data} = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/admin/ssr/', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            const ssrMap = new Map<number, SSR>();
            for (const ssr of data.ssr) {
                ssrMap.set(ssr.id, SSR.fromJson(ssr));
            }
            return {...data, ssr: ssrMap};
        } catch (error) {
            throw new Error('Error inesperado, verifica tu conexión e intenta más tarde');
        }
    }
}