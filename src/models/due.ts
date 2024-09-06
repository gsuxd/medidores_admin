import { BillStatus } from "./bill";

interface IDue {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  adminId: number;
  total: number;
  status: BillStatus;
}

export default class Due implements IDue{
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
  readonly adminId: number;
  readonly total: number;
  readonly status: BillStatus;

  constructor(props: IDue) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.adminId = props.adminId;
    this.total = props.total;
    this.status = props.status;
  }

  get estado(): string {
    switch (this.status) {
      case BillStatus.emited:
        return "Emitida";
      case BillStatus.paid:
        return "Pagada";
      case BillStatus.overdue:
        return "Vencida";
      case BillStatus.partial:
        return "Parcial";
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
        total: data.total,
        status: BillStatus[data.status as keyof typeof BillStatus],
        });
    }

    toJson() {
        return {
        id: this.id,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        deletedAt: this.deletedAt,
        adminId: this.adminId,
        total: this.total,
        status: this.status,
        };
    }

    copyWith({
        id,
        createdAt,
        updatedAt,
        deletedAt,
        adminId,
        total,
        status,
    }: Partial<IDue>): Due {
        return new Due({
        id: id ?? this.id,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        deletedAt: deletedAt ?? this.deletedAt,
        adminId: adminId ?? this.adminId,
        total: total ?? this.total,
        status: status ?? this.status,
        });
    }
}
