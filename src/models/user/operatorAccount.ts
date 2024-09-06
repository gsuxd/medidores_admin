
interface IOperatorAccount {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    adminId: number;
}

export default class OperatorAccount implements IOperatorAccount {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly userId: number;
    readonly adminId: number;
    constructor(props: IOperatorAccount) {
      this.id = props.id;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      this.userId = props.userId;
      this.adminId = props.adminId;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(json: any): OperatorAccount {
      return new OperatorAccount({
        id: json.id,
        createdAt: new Date(json.createdAt),
        updatedAt: new Date(json.updatedAt),
        userId: json.userId,
        adminId: json.adminId,
      });
    }
    toJson() {
      return {
        id: this.id,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
        userId: this.userId,
        adminId: this.adminId,
      };
    }
    copyWith({
      id,
      createdAt,
      updatedAt,
      userId,
      adminId,
    }: Partial<IOperatorAccount>): OperatorAccount {
      return new OperatorAccount({
        id: id ?? this.id,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        userId: userId ?? this.userId,
        adminId: adminId ?? this.adminId,
      });
    }
  }