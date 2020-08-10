import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import React, { Fragment } from "react";
import DeemedPurchaseRate, {
  DeemedPurchaseRateId
} from "../../../domain/model/DeemedPurchaseRate";

const toFormLabel = (aRate: DeemedPurchaseRate) =>
  `${aRate.getRate() * 100}% ${aRate.getTarget()}`;

const ConsumptionTaxSettings = ({
  expanded,
  onExpand,
  deemedPurchaseRate,
  setDeemedPurchaseRateId
}: {
  expanded: boolean;
  onExpand: () => void;
  deemedPurchaseRate: DeemedPurchaseRate;
  setDeemedPurchaseRateId: (id: DeemedPurchaseRateId) => void;
}) => (
  <Accordion expanded={expanded} onChange={onExpand}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>消費税の設定</Typography>
      <Typography>
        {`みなし仕入率: ${deemedPurchaseRate.getRate() * 100}%`}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <FormControl component="fieldset">
        <FormLabel component="legend">みなし仕入率</FormLabel>
        <RadioGroup
          name="deemed_purchase_rate"
          value={deemedPurchaseRate.getId()}
        >
          {[
            DeemedPurchaseRate.RATE_90,
            DeemedPurchaseRate.RATE_80,
            DeemedPurchaseRate.RATE_70,
            DeemedPurchaseRate.RATE_60,
            DeemedPurchaseRate.RATE_50
          ].map(aRate => (
            <Fragment key={aRate.getId()}>
              <FormControlLabel
                control={<Radio size="small" />}
                label={toFormLabel(aRate)}
                onChange={() => setDeemedPurchaseRateId(aRate.getId())}
                value={aRate.getId()}
              />
            </Fragment>
          ))}
        </RadioGroup>
      </FormControl>
    </AccordionDetails>
  </Accordion>
);

export default ConsumptionTaxSettings;
