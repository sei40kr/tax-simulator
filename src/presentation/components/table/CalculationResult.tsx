import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import {
  selectExpense,
  selectGrossIncome,
  selectRevenue
} from "../../../application/modules/calculation";
import formatCurrency from "../../formatCurrency";

const row = (label: string, value: string) => (
  <TableRow>
    <TableCell component="th" scope="row">
      {label}
    </TableCell>
    <TableCell align="right">{value}</TableCell>
  </TableRow>
);

const CalculationResult = () => {
  const revenue = useSelector(selectRevenue)?.getValue();
  const expense = useSelector(selectExpense)?.getValue();
  const grossIncome = useSelector(selectGrossIncome)?.getValue();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {row("年間売上", formatCurrency(revenue))}
          {row(
            "年間経費",
            formatCurrency(expense !== undefined ? expense * -1 : undefined)
          )}
          {row("額面年収", formatCurrency(grossIncome))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CalculationResult;
