import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
  Typography
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeFilingMethod,
  selectFilingMethod
} from "../../../application/modules/settings";
import FilingMethod from "../../../domain/model/FilingMethod";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primaryHeading: {
      fontSize: theme.typography.pxToRem(14),
      flexBasis: "33.33%",
      flexShrink: 0
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(14),
      color: theme.palette.text.secondary
    }
  })
);

const Settings = () => {
  const dispatch = useDispatch();
  const filingMethod = useSelector(selectFilingMethod);
  const [expanded, setExpanded] = useState("filing_method");

  const classes = useStyles();

  return (
    <Fragment>
      <Accordion
        expanded={expanded === "filing_method"}
        onChange={() => setExpanded("filing_method")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.primaryHeading}>申告方式</Typography>
          <Typography className={classes.secondaryHeading}>
            {filingMethod.getLabel()}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RadioGroup name="filing_method" value={filingMethod.getId()}>
            {[
              FilingMethod.WHITE,
              FilingMethod.BLUE_SINGLE,
              FilingMethod.BLUE_DOUBLE
            ].map(aFilingMethod => (
              <FormControlLabel
                control={<Radio />}
                key={aFilingMethod.getId()}
                label={aFilingMethod.getLabel()}
                onChange={() => dispatch(changeFilingMethod(aFilingMethod))}
                value={aFilingMethod.getId()}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default Settings;
