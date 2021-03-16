import { FormControl, InputLabel, makeStyles, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
    paddingRight: 400
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

type Props = {
  options: string[];
  label: string;
  filterId: string;
  onSelectItem: Function
};
const Dropdown = ({ options, label, onSelectItem, filterId }: Props) => {
  const classes = useStyles();
  const [value, setValue] = useState("All");
  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setValue(event.target.value);
    onSelectItem(filterId, event.target.value)
  };

  useEffect(() => {}, []);

  return (
    <FormControl margin="normal" className={classes.formControl}>
      <InputLabel htmlFor="native-simple">
        {label}
      </InputLabel>
      <Select
        native
        value={value}
        onChange={handleChange}

      >
        <option aria-label="All" value="All">
          {"All"}
        </option>
        {options.map((o, idx) => (
          <option key={idx} value={o}>{o}</option>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
