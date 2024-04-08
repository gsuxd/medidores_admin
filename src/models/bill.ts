import User from "./user/user";

export enum BillStatus {
  emited,
  paid,
  overdue,
}

interface IBill {
  id: number;
  accountId: number;
  user?: User;
  operatorId: number;
  consumed: number;
  picture: string;
  file: string;
  notes: string;
  status: BillStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export default class Bill {
  readonly id: number;
  readonly accountId: number;
  readonly operatorId: number;
  readonly consumed: number;
  readonly picture: string;
  readonly file: string;
  readonly notes: string;
  readonly user?: User;
  readonly status: BillStatus;
  readonly total: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;

  constructor(props: IBill) {
    this.id = props.id;
    this.accountId = props.accountId;
    this.operatorId = props.operatorId;
    this.consumed = props.consumed;
    this.picture = props.picture;
    this.file = props.file;
    this.notes = props.notes;
    this.status = props.status;
    this.total = props.total;
    this.user = props.user;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  get estado() {
    switch (this.status) {
      case BillStatus.emited:
        return "Emitido";
      case BillStatus.overdue:
        return "Vencida";
      case BillStatus.paid:
        return "Pagada";
      default:
        break;
    }
  }

  static fromJson(props: IBill): Bill {
   return new Bill({
    ...props,
    // @ts-expect-error 998
    status: BillStatus[props.status],
    user: props.user,
    createdAt: new Date(props.createdAt),
    updatedAt: new Date(props.updatedAt),
    deletedAt: props.deletedAt && new Date(props.deletedAt)
   });
  }

  toJson(): IBill {
    return {
      id: this.id,
      accountId: this.accountId,
      operatorId: this.operatorId,
      consumed: this.consumed,
      picture: this.picture,
      file: this.file,
      notes: this.notes,
      status: this.status,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  copyWith({
    id,
    accountId,
    operatorId,
    user,
    consumed,
    picture,
    file,
    notes,
    status,
    total,
    createdAt,
    updatedAt,
    deletedAt
  }: {
    id?: number;
    accountId?: number;
    operatorId?: number;
    user?: User;
    consumed?: number;
    picture?: string;
    file?: string;
    notes?: string;
    status?: BillStatus;
    total?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    return new Bill({
        id: id ?? this.id,
        accountId: accountId ?? this.accountId,
        operatorId: operatorId ?? this.operatorId,
        consumed: consumed ?? this.consumed,
        picture: picture ?? this.picture,
        file: file ?? this.file,
        notes: notes ?? this.notes,
        user: user ?? this.user,
        status: status ?? this.status,
        total: total ?? this.total,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        deletedAt: deletedAt ?? this.deletedAt,
    }); 
  }
}
