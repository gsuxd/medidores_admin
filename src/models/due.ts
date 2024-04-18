import { BillStatus } from "./bill";

export default class Due {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
  readonly adminId: number;
  readonly dues: number;
  readonly status: BillStatus;

  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    adminId,
    dues,
    status,
  }: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    adminId: number;
    dues: number;
    status: BillStatus;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.adminId = adminId;
    this.dues = dues;
    this.status = status;
  }

  get estado(): string {
    switch (this.status) {
      case BillStatus.emited:
        return "Emitida";
      case BillStatus.paid:
        return "Pagada";
      case BillStatus.overdue:
        return "Vencida";
      default:
        return "Desconocido";
    }
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(data: any): Due {
        return new Due({
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        deletedAt: new Date(data.deletedAt),
        adminId: data.adminId,
        dues: data.dues,
        status: BillStatus[data.status as keyof typeof BillStatus],
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJson(): any {
        return {
        id: this.id,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        deletedAt: this.deletedAt,
        adminId: this.adminId,
        dues: this.dues,
        status: this.status,
        };
    }

    copyWith({
        id,
        createdAt,
        updatedAt,
        deletedAt,
        adminId,
        dues,
        status,
    }: {
        id?: number;
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date;
        adminId?: number;
        dues?: number;
        status?: BillStatus;
    }): Due {
        return new Due({
        id: id ?? this.id,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        deletedAt: deletedAt ?? this.deletedAt,
        adminId: adminId ?? this.adminId,
        dues: dues ?? this.dues,
        status: status ?? this.status,
        });
    }
}
