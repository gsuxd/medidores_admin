import Config from "./config";
import AdminAccount from "./user/adminAccount";
import SellerAccount from "./user/sellerAccount";

interface ISSR {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | undefined;
  name: string;
  address: string;
  phone: string;
  email: string;
  president: AdminAccount;
  seller: SellerAccount;
  admins: AdminAccount[];
  bankNumber: string;
  config: Config;
}


export default class SSR implements ISSR{
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

  constructor(props: ISSR) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.name = props.name;
    this.address = props.address;
    this.phone = props.phone;
    this.email = props.email;
    this.president = props.president;
    this.seller = props.seller;
    this.admins = props.admins;
    this.bankNumber = props.bankNumber;
    this.config = props.config;
  }

  toJson() {
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
  }: Partial<ISSR>): SSR {
    return new SSR({
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      address: address ?? this.address,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      president: president ?? this.president,
      seller: seller ?? this.seller,
      admins: admins ?? this.admins,
      bankNumber: bankNumber ?? this.bankNumber,
      config: config ?? this.config,
    });
  }
}
