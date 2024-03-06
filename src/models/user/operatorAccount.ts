export default class OperatorAccount {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly userId: number;
    readonly adminId: number;
    constructor({
      id,
      createdAt,
      updatedAt,
      userId,
      adminId,
    }: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      userId: number;
      adminId: number;
    }) {
      this.id = id;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.userId = userId;
      this.adminId = adminId;
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
    toJson(): {
      id: number;
      createdAt: string;
      updatedAt: string;
      userId: number;
      adminId: number;
    } {
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
    }: {
      id?: number;
      createdAt?: Date;
      updatedAt?: Date;
      userId?: number;
      adminId?: number;
    }): OperatorAccount {
      return new OperatorAccount({
        id: id ?? this.id,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        userId: userId ?? this.userId,
        adminId: adminId ?? this.adminId,
      });
    }
  }