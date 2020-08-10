import {
  Box,
  Button,
  createStyles,
  Grid,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Theme
} from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { update } from "../../../application/modules/calculationInput";
import DeemedPurchaseRate from "../../../domain/model/DeemedPurchaseRate";
import FilingMethod from "../../../domain/model/FilingMethod";
import ConsumptionTaxSettings from "./ConsumptionTaxSettings";
import FilingMethodSetting from "./FilingMethodSetting";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settings: {
      "& .MuiAccordionSummary-content p:first-child": {
        fontSize: theme.typography.pxToRem(14),
        flexBasis: "33.33%",
        flexShrink: 0
      },
      "& .MuiAccordionSummary-content p:nth-child(2)": {
        fontSize: theme.typography.pxToRem(14),
        color: theme.palette.text.secondary
      }
    }
  })
);

type ActiveAccordionId = "filing_method" | "consumption_tax_setting";

const Form = () => {
  const [revenue, setRevenue] = useState("");
  const [expense, setExpense] = useState("");
  const [filingMethodId, setFilingMethodId] = useState(
    FilingMethod.WHITE.getId()
  );
  const filingMethod = FilingMethod.fromId(filingMethodId);
  const [deemedPurchaseRateId, setDeemedPurchaseRateId] = useState(
    DeemedPurchaseRate.RATE_90.getId()
  );
  const deemedPurchaseRate = DeemedPurchaseRate.fromId(deemedPurchaseRateId);
  const [expandedAccordionId, expandAccordionById] = useState(
    "filing_method" as ActiveAccordionId
  );
  const dispatch = useDispatch();

  const classes = useStyles();

  const validate = () => {
    return !isNaN(parseInt(revenue)) && !isNaN(parseInt(expense));
  };
  const onCalculate = (_event: any) => {
    if (validate()) {
      dispatch(
        update({
          revenue: parseInt(revenue),
          expense: parseInt(expense),
          filingMethodId,
          deemedPurchaseRateId
        })
      );
    }
  };

  return (
    <Fragment>
      <Paper>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                fullWidth
                id="revenue"
                label="年間売上"
                margin="normal"
                onChange={event => setRevenue(event.target.value)}
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
                onChange={event => setExpense(event.target.value)}
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
      <Box className={classes.settings}>
        <FilingMethodSetting
          expanded={expandedAccordionId == "filing_method"}
          onExpand={() => expandAccordionById("filing_method")}
          filingMethod={filingMethod}
          setFilingMethodId={setFilingMethodId}
        />
        <ConsumptionTaxSettings
          expanded={expandedAccordionId == "consumption_tax_setting"}
          onExpand={() => expandAccordionById("consumption_tax_setting")}
          deemedPurchaseRate={deemedPurchaseRate}
          setDeemedPurchaseRateId={setDeemedPurchaseRateId}
        />
      </Box>
    </Fragment>
  );
};

export default Form;
