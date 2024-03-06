export default class PartnerAccount {
    readonly id: number;
    readonly userId: number;
    readonly adminId: number;
    readonly totalDebt: number;
    readonly totalConsumed: number;
    readonly measurer: string;
    constructor({
      id,
      userId,
      adminId,
      totalDebt,
      totalConsumed,
      measurer,
    }: {
      id: number;
      userId: number;
      adminId: number;
      totalDebt: number;
      totalConsumed: number;
      measurer: string;
    }) {
      this.id = id;
      this.userId = userId;
      this.adminId = adminId;
      this.totalDebt = totalDebt;
      this.totalConsumed = totalConsumed;
      this.measurer = measurer;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(json: any): PartnerAccount {
      return new PartnerAccount({
        id: json['id'] as number,
        userId: json['userId'] as number,
        adminId: json['adminId'] as number,
        totalDebt: typeof json['totalDebt'] === 'number'
          ? json['totalDebt']
          : Number(json['totalDebt']),
        totalConsumed: typeof json['totalConsumed'] === 'number'
          ? json['totalConsumed']
          : Number(json['totalConsumed']),
        measurer: json['measurer'] as string,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJson(): { [key: string]: any } {
      return {
        id: this.id,
        userId: this.userId,
        adminId: this.adminId,
        totalDebt: this.totalDebt,
        totalConsumed: this.totalConsumed,
        measurer: this.measurer,
      };
    }
    copyWith({
      id,
      userId,
      adminId,
      totalDebt,
      totalConsumed,
      measurer,
    }: {
      id?: number;
      userId?: number;
      adminId?: number;
      totalDebt?: number;
      totalConsumed?: number;
      measurer?: string;
    }): PartnerAccount {
      return new PartnerAccount({
        id: id ?? this.id,
        userId: userId ?? this.userId,
        adminId: adminId ?? this.adminId,
        totalDebt: totalDebt ?? this.totalDebt,
        totalConsumed: totalConsumed ?? this.totalConsumed,
        measurer: measurer ?? this.measurer,
      });
    }
  }
  
  