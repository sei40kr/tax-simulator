import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectExpense,
  selectRevenue,
} from '../../../application/modules/calculationInput';
import {
  selectConsumptionTax,
  selectGrossIncome,
} from '../../../application/modules/calculationResult';
import formatCurrency from '../../formatCurrency';

const row = (label: string, value: string) => (
  <TableRow>
    <TableCell component="th" scope="row">
      {label}
    </TableCell>
    <TableCell align="right">{value}</TableCell>
  </TableRow>
);

const CalculationResult = () => {
  const revenue = useSelector(selectRevenue);
  const expense = useSelector(selectExpense);
  const grossIncome = useSelector(selectGrossIncome);
  const consumptionTax = useSelector(selectConsumptionTax);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {row('年間売上', formatCurrency(revenue.getValue()))}
          {row('年間経費', formatCurrency(-expense.getValue()))}
          {row('額面年収', formatCurrency(grossIncome.getValue()))}
          {row('消費税', formatCurrency(-consumptionTax.getValue()))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CalculationResult;
