import Expense from './Expense';
import Revenue from './Revenue';

class GrossIncome {
  constructor(private value: number) {}

  getValue() {
    return this.value;
  }
}

export default GrossIncome;
