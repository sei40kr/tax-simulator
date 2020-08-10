export type DeemedPurchaseRateId = "90" | "80" | "70" | "60" | "50" | "40";

class DeemedPurchaseRate {
  static RATE_90 = new DeemedPurchaseRate("90", 0.9, "卸売業");
  static RATE_80 = new DeemedPurchaseRate("80", 0.8, "小売業");
  static RATE_70 = new DeemedPurchaseRate(
    "70",
    0.7,
    "農業, 林業, 漁業, 鉱業, 建設, 製造, 電気, ガス, 水道"
  );
  static RATE_60 = new DeemedPurchaseRate("60", 0.6, "飲食店");
  static RATE_50 = new DeemedPurchaseRate(
    "50",
    0.5,
    "金融, 保険, 運輸通信, サービス業 (飲食除く)"
  );
  static RATE_40 = new DeemedPurchaseRate("40", 0.4, "不動産");

  static fromId(id: DeemedPurchaseRateId) {
    switch (id) {
      case "90":
        return DeemedPurchaseRate.RATE_90;
      case "80":
        return DeemedPurchaseRate.RATE_80;
      case "70":
        return DeemedPurchaseRate.RATE_70;
      case "60":
        return DeemedPurchaseRate.RATE_60;
      case "50":
        return DeemedPurchaseRate.RATE_50;
      case "40":
        return DeemedPurchaseRate.RATE_40;
    }
  }

  constructor(
    private id: DeemedPurchaseRateId,
    private rate: number,
    private target: string
  ) {}

  getId() {
    return this.id;
  }

  getRate() {
    return this.rate;
  }

  getTarget() {
    return this.target;
  }
}

export default DeemedPurchaseRate;
