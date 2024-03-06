import useAuth from "@/auth/useAuth"
import { createContext } from "react"
interface IAdminContext {
    auth: ReturnType<typeof useAuth>
}

// @ts-expect-error 432
export const AdminContext = createContext<IAdminContext>(null)