import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import React from "react";
import FilingMethod, {
  FilingMethodId
} from "../../../domain/model/FilingMethod";

const FilingMethodSetting = ({
  expanded,
  onExpand,
  filingMethod,
  setFilingMethodId
}: {
  expanded: boolean;
  onExpand: () => void;
  filingMethod: FilingMethod;
  setFilingMethodId: (id: FilingMethodId) => void;
}) => (
  <Accordion expanded={expanded} onChange={onExpand}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>申告方式</Typography>
      <Typography>{filingMethod.getLabel()}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <RadioGroup value={filingMethod.getId()}>
        {[
          FilingMethod.WHITE,
          FilingMethod.BLUE_SINGLE,
          FilingMethod.BLUE_DOUBLE
        ].map(aMethod => (
          <FormControlLabel
            control={<Radio />}
            key={aMethod.getId()}
            label={aMethod.getLabel()}
            onChange={() => setFilingMethodId(aMethod.getId())}
            value={aMethod.getId()}
          />
        ))}
      </RadioGroup>
    </AccordionDetails>
  </Accordion>
);

export default FilingMethodSetting;
