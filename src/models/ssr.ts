import Config from "./config";
import AdminAccount from "./user/adminAccount";
import SellerAccount from "./user/sellerAccount";

export default class SSR {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
  readonly name: string;
  readonly address: string;
  readonly phone: string;
  readonly email: string;
  readonly seller: SellerAccount;
  readonly president: AdminAccount;
  readonly admins: AdminAccount[];
  readonly bankNumber: string;
  readonly config: Config;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(data: any): SSR {
    return new SSR({
      id: data.id,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      seller: SellerAccount.fromJson(data.seller),
      president: AdminAccount.fromJson(data.president),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      admins: data.admins.map((seller: any) => AdminAccount.fromJson(seller)),
      bankNumber: data.bankNumber,
      config: Config.fromJson(data.config),
    
    });
  }

  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    name,
    address,
    phone,
    email,
    president,
    seller,
    admins,
    bankNumber,
    config,
  }: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | undefined;
    name: string;
    address: string;
    phone: string;
    email: string;
    president: AdminAccount;
    seller: SellerAccount;
    admins: AdminAccount[];
    bankNumber: string;
    config: Config;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.president = president;
    this.seller = seller;
    this.admins = admins;
    this.bankNumber = bankNumber;
    this.config = config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJson(): any {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
      name: this.name,
      address: this.address,
      phone: this.phone,
      email: this.email,
      president: this.president.toJson(),
      seller: this.seller.toJson(),
      admins: this.admins.map((admin) => admin.toJson()),
      bankNumber: this.bankNumber,
      config: this.config?.toJson(),
    };
  }

  copyWith({
    id = this.id,
    createdAt = this.createdAt,
    updatedAt = this.updatedAt,
    deletedAt = this.deletedAt,
    name = this.name,
    address = this.address,
    phone = this.phone,
    email = this.email,
    president = this.president,
    seller = this.seller,
    admins = this.admins,
    bankNumber = this.bankNumber,
    config = this.config,
  }: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    president?: AdminAccount;
    seller?: SellerAccount;
    admins?: AdminAccount[];
    bankNumber?: string;
    config?: Config;
  }): SSR {
    return new SSR({
      id,
      createdAt,
      updatedAt,
      deletedAt,
      name,
      address,
      phone,
      email,
      president,
      seller,
      admins,
      bankNumber,
      config,
    });
  }
}
