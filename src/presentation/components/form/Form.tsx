import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField
} from "@material-ui/core";
import React, { ChangeEvent, Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { calculate } from "../../../application/modules/calculation";
import Expense from "../../../domain/model/Expense";
import Revenue from "../../../domain/model/Revenue";

const Form = () => {
  const [revenue, setRevenue] = useState("");
  const [expense, setExpense] = useState("");
  const dispatch = useDispatch();

  const onRevenueChange = (event: ChangeEvent<HTMLInputElement>) =>
    setRevenue(event.target.value);
  const onExpenseChange = (event: ChangeEvent<HTMLInputElement>) =>
    setExpense(event.target.value);

  const validate = () => {
    return !isNaN(parseInt(revenue)) && !isNaN(parseInt(expense));
  };
  const onCalculate = (_event: any) => {
    if (validate()) {
      dispatch(
        calculate({
          revenue: new Revenue(parseInt(revenue)),
          expense: new Expense(parseInt(expense))
        })
      );
    }
  };

  return (
    <Fragment>
      <Paper>
        <Box pb={2} pl={3} pr={3} pt={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                fullWidth
                id="revenue"
                label="年間売上"
                margin="normal"
                onChange={onRevenueChange}
                required
                size="small"
                type="number"
                value={revenue}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">¥</InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="expense"
                label="年間経費"
                margin="normal"
                onChange={onExpenseChange}
                required
                size="small"
                type="number"
                value={expense}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">¥</InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <Box mt={1} textAlign="right">
            <Button
              color="primary"
              disabled={!validate()}
              onClick={onCalculate}
              variant="contained"
            >
              計算
            </Button>
          </Box>
        </Box>
      </Paper>
    </Fragment>
  );
};

export default Form;
