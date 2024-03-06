import axios, { AxiosError } from "axios";

export default abstract class AuthApi {
  static async login({ email, password }: { email: string; password: string }): Promise<{user: object, token: string}> {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/auth/login",
        { email, password }
      );
      const { data } = res;
      return data;
    } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response! && error.response.status === 400 || error.response!.status === 404) {
        if (error.response!.data.error) {
          throw new Error(error.response!.data.error)
        }
        throw new Error('Revisa los campos y vuelve a intentarlo')
      }
    }
      throw new Error("Ha ocurrido un error, por favor intente de nuevo");
    }
  }
}
