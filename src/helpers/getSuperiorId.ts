import User, { UserRole } from "@/models/user/user";

export default function getSuperiorId(user: User): string | undefined {
  switch (user.role) {
    case UserRole.operator:
      return user.operatorAccount?.adminId.toString();
    case UserRole.partner:
      return user.partnerAccount?.adminId.toString();
    default:
      break;
  }
}
