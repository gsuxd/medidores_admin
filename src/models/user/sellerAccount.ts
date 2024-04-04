export default class SellerAccount {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
  readonly userId: number;

  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    userId
  }: {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | undefined,
    userId: number
  }){
    this.createdAt = createdAt
    this.id = id
    this.deletedAt =  deletedAt
    this.updatedAt = updatedAt
    this.userId = userId
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(data: any) {
    return new SellerAccount({
        createdAt: new Date(data['createdAt']),
        id: data['id'],
        updatedAt: new Date(data['updatedAt']),
        userId: data['userId'],
    })
  }

  toJson() {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      id: this.id,
      userId: this.userId,
      deletedAt: this.deletedAt 
    }
  }
}
