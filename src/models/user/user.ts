import AdminAccount from "./adminAccount";
import OperatorAccount from "./operatorAccount";
import PartnerAccount from "./partnerAccount";

export enum UserRole { master, seller, admin, operator, partner }

export default class User {
  readonly id: number;
  readonly name: string;
  readonly lastName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email?: string;
  readonly role: UserRole;
  readonly emailVerified: boolean;
  readonly phone: string;
  readonly rut: string;
  readonly address: string;
  readonly partnerAccount?: PartnerAccount;
  readonly adminAccount?: AdminAccount;
  readonly operatorAccount?: OperatorAccount;

  constructor({
    id,
    name,
    lastName,
    createdAt,
    updatedAt,
    email,
    role,
    emailVerified,
    phone,
    rut,
    address,
    partnerAccount,
    adminAccount,
    operatorAccount,
  }: {
    id: number;
    name: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    email?: string;
    role: UserRole;
    emailVerified: boolean;
    phone: string;
    rut: string;
    address: string;
    partnerAccount?: PartnerAccount;
    adminAccount?: AdminAccount;
    operatorAccount?: OperatorAccount;
  }) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.role = role;
    this.emailVerified = emailVerified;
    this.phone = phone;
    this.rut = rut;
    this.address = address;
    this.partnerAccount = partnerAccount;
    this.adminAccount = adminAccount;
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
    });
  }

  toJson(): {
    id: number;
    name: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    email?: string;
    role: string;
    emailVerified: boolean;
    phone: string;
    rut: string;
    address: string;
    partnerAccount?: Record<string, unknown>;
  } {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      email: this.email,
      role: this.role.toString(),
      emailVerified: this.emailVerified,
      phone: this.phone,
      rut: this.rut,
      address: this.address,
      partnerAccount: this.partnerAccount
        ? this.partnerAccount.toJson()
        : undefined,
    };
  }

  copyWith({
    id,
    name,
    lastName,
    createdAt,
    updatedAt,
    email,
    role,
    emailVerified,
    phone,
    rut,
    address,
    partnerAccount,
  }: {
    id?: number;
    name?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    email?: string;
    role?: UserRole;
    emailVerified?: boolean;
    phone?: string;
    rut?: string;
    address?: string;
    partnerAccount?: PartnerAccount;
  }): User {
    return new User({
      id: id ?? this.id,
      name: name ?? this.name,
      lastName: lastName ?? this.lastName,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      email: email ?? this.email,
      role: role ?? this.role,
      emailVerified: emailVerified ?? this.emailVerified,
      phone: phone ?? this.phone,
      rut: rut ?? this.rut,
      address: address ?? this.address,
      partnerAccount: partnerAccount ?? this.partnerAccount,
    });
  }
}

