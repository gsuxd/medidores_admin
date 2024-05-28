import AdminAccount from "./adminAccount";
import OperatorAccount from "./operatorAccount";
import PartnerAccount from "./partnerAccount";
import SellerAccount from "./sellerAccount";

export enum UserRole { master = "master", seller = "seller", admin = "admin", operator = "operator", partner = "partner" }

export default class User {
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

  constructor({
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
    adminAccount,
    operatorAccount,
    sellerAccount,
  }: {
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
  }) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.password = password;
    this.role = role;
    this.emailVerified = emailVerified;
    this.phone = phone;
    this.rut = rut;
    this.address = address;
    this.partnerAccount = partnerAccount;
    this.adminAccount = adminAccount;
    this.sellerAccount = sellerAccount
    this.operatorAccount = operatorAccount;
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
        if (this.adminAccount?.organization) {
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
  

  toJson(): {
    id: number;
    name: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    email?: string;
    password?: string;
    role: string;
    emailVerified: boolean;
    phone: string;
    rut: string;
    address: string;
    partnerAccount?: Record<string, unknown>;
    adminAccount?: Record<string, unknown>;
    sellerAccount?: Record<string, unknown>;
    operatorAccount?: Record<string, unknown>;
  } {
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
  }: {
    id?: number;
    name?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    email?: string;
    password?: string;
    role?: UserRole;
    emailVerified?: boolean;
    phone?: string;
    rut?: string;
    address?: string;
    partnerAccount?: PartnerAccount;
    operatorAccount?: OperatorAccount;
    adminAccount?: AdminAccount;
    sellerAccount?: SellerAccount;
  }): User {
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

