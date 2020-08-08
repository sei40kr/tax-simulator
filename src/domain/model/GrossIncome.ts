import Expense from "./Expense";
import Revenue from "./Revenue";

class GrossIncome {
  private value: number;

  constructor(revenue: Revenue, expense: Expense) {
    this.value = revenue.getValue() - expense.getValue();
  }

  getValue() {
    return this.value;
  }
}

export default GrossIncome;
