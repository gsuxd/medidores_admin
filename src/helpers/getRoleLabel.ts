import { UserRole } from "@/models/user/user";

export default function getRoleLabel(role: UserRole) {
  switch (role) {
    case UserRole.master:
      return "Maestro";
    case UserRole.seller:
      return "Vendedor";
    case UserRole.admin:
      return "Administrador";
    case UserRole.operator:
      return "Operador";
    case UserRole.partner:
      return "Socio";
  }
}
