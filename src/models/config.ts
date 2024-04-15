export default class Config {
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
    });
  }

  constructor({
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
  }: {
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
  }) {
    this.id = id;
    this.billPrice = billPrice;
    this.billDate = billDate;
    this.ssrId = ssrId;
    this.billPriceSection1 = billPriceSection1;
    this.billPriceSection2 = billPriceSection2;
    this.billPriceSection3 = billPriceSection3;
    this.billLimitSection1 = billLimitSection1;
    this.billLimitSection2 = billLimitSection2;
    this.billLimitSection3 = billLimitSection3;
    this.fixedPrice = fixedPrice;
    this.subsidy = subsidy;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJson(): any {
    return {
      id: this.id,
      billPrice: this.billPrice,
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
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyWith({
    id = this.id,
    billPrice = this.billPrice,
    billDate = this.billDate,
    ssrId = this.ssrId,
    billPriceSection1 = this.billPriceSection1,
    billPriceSection2 = this.billPriceSection2,
    billPriceSection3 = this.billPriceSection3,
    billLimitSection1 = this.billLimitSection1,
    billLimitSection2 = this.billLimitSection2,
    billLimitSection3 = this.billLimitSection3,
    fixedPrice = this.fixedPrice,
    subsidy = this.subsidy,
  }: {
    id?: number;
    billPrice?: number;
    billDate?: Date;
    ssrId?: number;
    billPriceSection1?: number;
    billPriceSection2?: number;
    billPriceSection3?: number;
    billLimitSection1?: number;
    billLimitSection2?: number;
    billLimitSection3?: number;
    fixedPrice?: number;
    subsidy?: number;
  }): Config {
    return new Config({
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
    });
  }
}
