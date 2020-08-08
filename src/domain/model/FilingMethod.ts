class FilingMethod {
  static WHITE = new FilingMethod("white", "白色申告");
  static BLUE_SINGLE = new FilingMethod("blue_single", "青色申告 (単式簿記)");
  static BLUE_DOUBLE = new FilingMethod("blue_double", "青色申告 (複式簿記)");

  constructor(private id: string, private label: string) {}

  getId() {
    return this.id;
  }

  getLabel() {
    return this.label;
  }
}

export default FilingMethod;
