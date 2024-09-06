interface ISellerAccount {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: number;
  organizations: number[];
}

export default class SellerAccount implements ISellerAccount {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
  readonly userId: number;
  readonly organizations: number[];

  constructor(props: ISellerAccount) {
    this.createdAt = props.createdAt;
    this.id = props.id;
    this.deletedAt =  props.deletedAt;
    this.updatedAt = props.updatedAt;
    this.userId = props.userId;
    this.organizations = props.organizations;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(data: any) {
    return new SellerAccount({
        createdAt: new Date(data.createdAt),
        id: data.id,
        updatedAt: new Date(data.updatedAt),
        userId: data.userId,
        organizations: data.organizations.map((val: {id: number}) => val.id)
    })
  }

  copyWith({
    createdAt,
    id,
    updatedAt,
    userId,
    organizations,
    deletedAt
  }: Partial<ISellerAccount>) {
    return new SellerAccount({
      createdAt: createdAt ?? this.createdAt,
      id: id ?? this.id,
      updatedAt: updatedAt ?? this.updatedAt,
      userId: userId ?? this.userId,
      organizations: organizations ?? this.organizations,
      deletedAt: deletedAt ?? this.deletedAt
    });
  }

  toJson() {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      id: this.id,
      userId: this.userId,
      deletedAt: this.deletedAt,
      ssrId: this.organizations 
    }
  }
}
