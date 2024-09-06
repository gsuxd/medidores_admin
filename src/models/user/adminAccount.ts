interface IAdminAccount {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  ssrId: number;
  organizationId?: number;
  totalDebt: number;
  fixedPrice: number;
  section1Price: number;
  section1Limit: number;
  section2Price: number;
  section2Limit: number;
  section3Price: number;
  section3Limit: number;
  billDate: Date;
  billPrice: number;
}

export default class AdminAccount implements IAdminAccount{
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly userId: number;
    readonly ssrId: number;
    readonly organizationId?: number;
    readonly totalDebt: number;
    readonly fixedPrice: number;
    readonly section1Price: number;
    readonly section1Limit: number;
    readonly section2Price: number;
    readonly section2Limit: number;
    readonly section3Price: number;
    readonly section3Limit: number;
    readonly billDate: Date;
    readonly billPrice: number;
    constructor(props: IAdminAccount) {
      this.id = props.id;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      this.userId = props.userId;
      this.ssrId = props.ssrId;
      this.organizationId = props.organizationId;
      this.totalDebt = props.totalDebt;
      this.fixedPrice = props.fixedPrice;
      this.section1Price = props.section1Price;
      this.section1Limit = props.section1Limit;
      this.section2Price = props.section2Price;
      this.section2Limit = props.section2Limit;
      this.section3Price = props.section3Price;
      this.section3Limit = props.section3Limit;
      this.billDate = props.billDate;
      this.billPrice = props.billPrice;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(json: any): AdminAccount {
      return new AdminAccount({
        id: json.id,
        createdAt: new Date(json.createdAt),
        updatedAt: new Date(json.updatedAt),
        userId: json.userId,
        ssrId: json.ssrId,
        organizationId: json.organizationId ? json.organizationId : undefined,
        totalDebt: json.totalDebt,
        fixedPrice: json.fixedPrice,
        section1Price: json.section1Price,
        section1Limit: json.section1Limit,
        section2Price: json.section2Price,
        section2Limit: json.section2Limit,
        section3Price: json.section3Price,
        section3Limit: json.section3Limit,
        billDate: new Date(json.billDate),
        billPrice: json.billPrice,
      });
    }

    toJson() {
      return {
        id: this.id,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
        userId: this.userId,
        ssrId: this.ssrId,
        organizationId: this.organizationId ? this.organizationId : undefined,
        totalDebt: this.totalDebt,
        fixedPrice: this.fixedPrice,
        section1Price: this.section1Price,
        section1Limit: this.section1Limit,
        section2Price: this.section2Price,
        section2Limit: this.section2Limit,
        section3Price: this.section3Price,
        section3Limit: this.section3Limit,
        billDate: this.billDate.toISOString(),
        billPrice: this.billPrice,
      };
    }

    copyWith({
      id,
      createdAt,
      updatedAt,
      userId,
      ssrId,
      organizationId,
      totalDebt,
      fixedPrice,
      section1Price,
      section1Limit,
      section2Price,
      section2Limit,
      section3Price,
      section3Limit,
      billDate,
      billPrice,
    }: Partial<IAdminAccount>): AdminAccount {
      return new AdminAccount({
        id: id ?? this.id,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        userId: userId ?? this.userId,
        ssrId: ssrId ?? this.ssrId,
        organizationId: organizationId ?? this.organizationId,
        totalDebt: totalDebt ?? this.totalDebt,
        fixedPrice: fixedPrice ?? this.fixedPrice,
        section1Price: section1Price ?? this.section1Price,
        section1Limit: section1Limit ?? this.section1Limit,
        section2Price: section2Price ?? this.section2Price,
        section2Limit: section2Limit ?? this.section2Limit,
        section3Price: section3Price ?? this.section3Price,
        section3Limit: section3Limit ?? this.section3Limit,
        billDate: billDate ?? this.billDate,
        billPrice: billPrice ?? this.billPrice,
      });
    }
  }
  
  