import AdminAccount from "./adminAccount";
import OperatorAccount from "./operatorAccount";
import PartnerAccount from "./partnerAccount";
import SellerAccount from "./sellerAccount";

export enum UserRole { master = "master", seller = "seller", admin = "admin", operator = "operator", partner = "partner" }


interface IUser {
  id: number;
  name: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  password?: string;
  role: UserRole;
  emailVerified: boolean;
  phone: string;
  rut: string;
  address: string;
  partnerAccount?: PartnerAccount;
  adminAccount?: AdminAccount;
  operatorAccount?: OperatorAccount;
  sellerAccount?: SellerAccount;
}

export default class User implements IUser{
  readonly id: number;
  readonly name: string;
  readonly lastName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email?: string;
  readonly password?: string;
  readonly role: UserRole;
  readonly emailVerified: boolean;
  readonly phone: string;
  readonly rut: string;
  readonly address: string;
  readonly partnerAccount?: PartnerAccount;
  readonly adminAccount?: AdminAccount;
  readonly operatorAccount?: OperatorAccount;
  readonly sellerAccount?: SellerAccount;

  constructor(props: IUser) {
    this.id = props.id;
    this.name = props.name;
    this.lastName = props.lastName;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.emailVerified = props.emailVerified;
    this.phone = props.phone;
    this.rut = props.rut;
    this.address = props.address;
    this.partnerAccount = props.partnerAccount;
    this.adminAccount = props.adminAccount;
    this.sellerAccount = props.sellerAccount
    this.operatorAccount = props.operatorAccount;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: any): User {
    return new User({
      id: json.id,
      name: json.name,
      lastName: json.lastName,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
      email: json.email,
      password: json.password,
      role: UserRole[json.role as keyof typeof UserRole],
      emailVerified: json.emailVerified,
      phone: json.phone,
      rut: json.rut,
      address: json.address,
      partnerAccount: json.partnerAccount
        ? PartnerAccount.fromJson(json.partnerAccount)
        : undefined,
      operatorAccount: json.operatorAccount
        ? OperatorAccount.fromJson(json.operatorAccount)
        : undefined,
      adminAccount: json.adminAccount
        ? AdminAccount.fromJson(json.adminAccount)
        : undefined,
      sellerAccount: json.sellerAccount
      ? SellerAccount.fromJson(json.sellerAccount)
      : undefined
    });
  }

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  get roleLabel(): string {
    switch (this.role) {
      case UserRole.admin:
        if (this.adminAccount?.organizationId) {
          return 'Presidente';
        }
        return "Administrador";
      case UserRole.operator:
        return "Operador";
      case UserRole.partner:
        return "Socio";
      case UserRole.seller:
        return "Vendedor";
      case UserRole.master:
        return "Master";
    }
  }
  getSuperior(array: User[]) : User | undefined{
    switch (this.role) {
      case UserRole.partner:
        return array.find((val) => val.adminAccount?.id === this.partnerAccount?.adminId);
      case UserRole.operator:
        return array.find((val) => val.adminAccount?.id === this.operatorAccount?.adminId);
    }
  }
  

  toJson() {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      email: this.email,
      password: this.password,
      role: UserRole[this.role],
      emailVerified: this.emailVerified,
      phone: this.phone,
      rut: this.rut,
      address: this.address,
      partnerAccount: this.partnerAccount
        ? this.partnerAccount.toJson()
        : undefined,
      operatorAccount: this.operatorAccount?.toJson(),
      adminAccount: this.adminAccount?.toJson(),
      sellerAccount: this.sellerAccount?.toJson()
    };
  }

  copyWith({
    id,
    name,
    lastName,
    createdAt,
    updatedAt,
    email,
    password,
    role,
    emailVerified,
    phone,
    rut,
    address,
    partnerAccount,
    operatorAccount,
    adminAccount,
    sellerAccount
  }:Partial<IUser>): User {
    return new User({
      id: id ?? this.id,
      name: name ?? this.name,
      lastName: lastName ?? this.lastName,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      email: email ?? this.email,
      password: password ?? this.password,
      role: role ?? this.role,
      emailVerified: emailVerified ?? this.emailVerified,
      phone: phone ?? this.phone,
      rut: rut ?? this.rut,
      address: address ?? this.address,
      partnerAccount: partnerAccount ?? this.partnerAccount,
      operatorAccount: operatorAccount ?? this.operatorAccount,
      adminAccount: adminAccount ?? this.adminAccount,
      sellerAccount: sellerAccount ?? this.sellerAccount,
    });
  }
}

