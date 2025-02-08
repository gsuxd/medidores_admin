

interface IConfig {
  id: number;
  billPrice: number;
  billDate: Date;
  ssrId: number;
  billPriceSection1: number;
  billPriceSection2: number;
  billPriceSection3: number;
  billLimitSection1: number;
  billLimitSection2: number;
  billLimitSection3: number;
  fixedPrice: number;
  subsidy: number;
  paymentEnabled: boolean;
  paymentToken?: string | null | undefined;
}

export default class Config implements IConfig{
  readonly id: number;
  readonly billPrice: number;
  readonly billDate: Date;
  readonly ssrId: number;
  readonly billPriceSection1: number;
  readonly billPriceSection2: number;
  readonly billPriceSection3: number;
  readonly billLimitSection1: number;
  readonly billLimitSection2: number;
  readonly billLimitSection3: number;
  readonly fixedPrice: number;
  readonly subsidy: number;
  readonly paymentEnabled: boolean;
  readonly paymentToken: string | null | undefined;

  constructor(props: IConfig) {
    this.id = props.id;
    this.billPrice = props.billPrice;
    this.billDate = props.billDate;
    this.ssrId = props.ssrId;
    this.billPriceSection1 = props.billPriceSection1;
    this.billPriceSection2 = props.billPriceSection2;
    this.billPriceSection3 = props.billPriceSection3;
    this.billLimitSection1 = props.billLimitSection1;
    this.billLimitSection2 = props.billLimitSection2;
    this.billLimitSection3 = props.billLimitSection3;
    this.fixedPrice = props.fixedPrice;
    this.subsidy = props.subsidy;
    this.paymentEnabled = props.paymentEnabled;
    this.paymentToken = props.paymentToken;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(data: any): Config {
    return new Config({
      id: data.id,
      billPrice: data.billPrice,
      billDate: new Date(data.billDate),
      ssrId: data.ssrId,
      billPriceSection1: data.billPriceSection1,
      billPriceSection2: data.billPriceSection2,
      billPriceSection3: data.billPriceSection3,
      billLimitSection1: data.billLimitSection1,
      billLimitSection2: data.billLimitSection2,
      billLimitSection3: data.billLimitSection3,
      fixedPrice: data.fixedPrice,
      subsidy: data.subsidy,
      paymentEnabled: data.paymentEnabled,
      paymentToken: data.paymentToken
    });
  }

  toJson(): IConfig {
    return {
      id: this.id,
      billPrice: this.billPrice,
      //@ts-expect-error 3219
      billDate: this.billDate.toISOString(),
      ssrId: this.ssrId,
      billPriceSection1: this.billPriceSection1,
      billPriceSection2: this.billPriceSection2,
      billPriceSection3: this.billPriceSection3,
      billLimitSection1: this.billLimitSection1,
      billLimitSection2: this.billLimitSection2,
      billLimitSection3: this.billLimitSection3,
      fixedPrice: this.fixedPrice,
      subsidy: this.subsidy,
      paymentEnabled: this.paymentEnabled,
      paymentToken: this.paymentToken
    };
  }

  copyWith({
    id,
    billPrice,
    billDate,
    ssrId,
    billPriceSection1,
    billPriceSection2,
    billPriceSection3,
    billLimitSection1,
    billLimitSection2,
    billLimitSection3,
    fixedPrice,
    subsidy,
    paymentEnabled,
    paymentToken,
  }: Partial<IConfig>): Config {
    return new Config({
      id: id ?? this.id,
      billPrice: billPrice ?? this.billPrice,
      billDate: billDate ?? this.billDate,
      ssrId: ssrId ?? this.ssrId,
      billPriceSection1: billPriceSection1 ?? this.billPriceSection1,
      billPriceSection2: billPriceSection2 ?? this.billPriceSection2,
      billPriceSection3: billPriceSection3 ?? this.billPriceSection3,
      billLimitSection1: billLimitSection1 ?? this.billLimitSection1,
      billLimitSection2:  billLimitSection2 ?? this.billLimitSection2,
      billLimitSection3: billLimitSection3 ?? this.billLimitSection3,
      fixedPrice: fixedPrice ?? this.fixedPrice,
      subsidy: subsidy ?? this.subsidy,
      paymentEnabled: paymentEnabled ?? this.paymentEnabled,
      paymentToken: paymentToken ?? this.paymentToken,
    });
  }
}
