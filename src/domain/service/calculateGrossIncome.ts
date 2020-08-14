import Expense from '../model/Expense';
import Revenue from '../model/Revenue';
import GrossIncome from '../model/GrossIncome';

const calculateGrossIncome = (revenue: Revenue, expense: Expense) =>
  new GrossIncome(revenue.getValue() - expense.getValue());
export default calculateGrossIncome;
