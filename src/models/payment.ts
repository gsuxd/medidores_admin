export enum PaymentMethod {
  cash = 'CASH',
  card = 'CARD',
  transfer = 'TRANSFER',
}

export enum PaymentStatus {
  pending = 'PENDING',
  confirmed = 'CONFIRMED',
  rejected = 'REJECTED',
}

interface IPayment {
  id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_id: string;
  redirect_url: string;
  partnerId: number;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date;
  deletedAt: Date;
}

export default class Payment implements IPayment {
  id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_id: string;
  redirect_url: string;
  partnerId: number;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date;
  deletedAt: Date;
  fullName: string = "";
  userId: number = 0;

  constructor(props: IPayment) {
    this.id = props.id;
    this.amount = props.amount;
    this.method = props.method;
    this.status = props.status;
    this.reference_id = props.reference_id;
    this.redirect_url = props.redirect_url;
    this.partnerId = props.partnerId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.confirmedAt = props.confirmedAt;
    this.deletedAt = props.deletedAt;
  }

  toJson() {
    return {
      id: this.id,
      amount: this.amount,
      method: this.method,
      status: this.status,
      reference_id: this.reference_id,
      redirect_url: this.redirect_url,
      partnerId: this.partnerId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      confirmedAt: this.confirmedAt.toISOString(),
      deletedAt: this.deletedAt,
    };
  }

  public get estado() {
    switch (this.status) {
      case PaymentStatus.pending:
        return "Pendiente";
      case PaymentStatus.confirmed:
        return "Confirmado";
      case PaymentStatus.rejected:
        return "Rechazado";
    }
  }

  public get metodo() {
    switch (this.method) {
      case PaymentMethod.cash:
        return "Efectivo";
      case PaymentMethod.card:
        return "Tarjeta";
      case PaymentMethod.transfer:
        return "Transferencia";
    }
  }

  copyWith({
    id,
    amount,
    method,
    status,
    reference_id,
    redirect_url,
    partnerId,
    createdAt,
    updatedAt,
    confirmedAt,
    deletedAt,
  }: Partial<IPayment>) {
    return new Payment({
      id: id ?? this.id,
      amount: amount ?? this.amount,
      method: method ?? this.method,
      status: status ?? this.status,
      reference_id: reference_id ?? this.reference_id,
      redirect_url: redirect_url ?? this.redirect_url,
      partnerId: partnerId ?? this.partnerId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      confirmedAt: confirmedAt ?? this.confirmedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: any): Payment {
    const payment = new Payment({
      id: json.id,
      amount: json.amount,
      method: PaymentMethod[json.method.toLowerCase() as keyof typeof PaymentMethod],
      status: PaymentStatus[json.status.toLowerCase() as keyof typeof PaymentStatus],
      reference_id: json.reference_id,
      redirect_url: json.redirect_url,
      partnerId: json.partnerId,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
      confirmedAt: new Date(json.confirmedAt),
      deletedAt: new Date(json.deletedAt),
    });
    if (json.partner) {
      payment.fullName = json.partner.user.name + " " + json.partner.user.lastName;
      payment.userId = json.partner.user.id;
    }
    return payment;
  }
}
