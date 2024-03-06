export default class AdminAccount {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly userId: string;
    readonly sellerId: string;
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
    constructor({
      id,
      createdAt,
      updatedAt,
      userId,
      sellerId,
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
    }: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      sellerId: string;
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
    }) {
      this.id = id;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.userId = userId;
      this.sellerId = sellerId;
      this.totalDebt = totalDebt;
      this.fixedPrice = fixedPrice;
      this.section1Price = section1Price;
      this.section1Limit = section1Limit;
      this.section2Price = section2Price;
      this.section2Limit = section2Limit;
      this.section3Price = section3Price;
      this.section3Limit = section3Limit;
      this.billDate = billDate;
      this.billPrice = billPrice;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(json: any): AdminAccount {
      return new AdminAccount({
        id: json.id,
        createdAt: new Date(json.createdAt),
        updatedAt: new Date(json.updatedAt),
        userId: json.userId,
        sellerId: json.sellerId,
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
    toJson(): {
      id: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
      sellerId: string;
      totalDebt: number;
      fixedPrice: number;
      section1Price: number;
      section1Limit: number;
      section2Price: number;
      section2Limit: number;
      section3Price: number;
      section3Limit: number;
      billDate: string;
      billPrice: number;
    } {
      return {
        id: this.id,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
        userId: this.userId,
        sellerId: this.sellerId,
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
      sellerId,
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
    }: {
      id?: string;
      createdAt?: Date;
      updatedAt?: Date;
      userId?: string;
      sellerId?: string;
      totalDebt?: number;
      fixedPrice?: number;
      section1Price?: number;
      section1Limit?: number;
      section2Price?: number;
      section2Limit?: number;
      section3Price?: number;
      section3Limit?: number;
      billDate?: Date;
      billPrice?: number;
    }): AdminAccount {
      return new AdminAccount({
        id: id ?? this.id,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        userId: userId ?? this.userId,
        sellerId: sellerId ?? this.sellerId,
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
  
  