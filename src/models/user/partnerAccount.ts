
interface IPartnerAccount {
    id: number;
    userId: number;
    adminId: number;
    totalDebt: number;
    totalConsumed: number;
    measurer: string;
  }

export default class PartnerAccount implements IPartnerAccount {
    readonly id: number;
    readonly userId: number;
    readonly adminId: number;
    readonly totalDebt: number;
    readonly totalConsumed: number;
    readonly measurer: string;
    constructor(props: IPartnerAccount) {
      this.id = props.id;
      this.userId = props.userId;
      this.adminId = props.adminId;
      this.totalDebt = props.totalDebt;
      this.totalConsumed = props.totalConsumed;
      this.measurer = props.measurer;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJson(json: any): PartnerAccount {
      return new PartnerAccount({
        id: json.id,
        userId: json.userId,
        adminId: json.adminId,
        totalDebt: json.totalDebt,
        totalConsumed: json.totalConsumed,
        measurer: json.measurer,
      });
    }
    toJson() {
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
    }: Partial<IPartnerAccount>): PartnerAccount {
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
  
  