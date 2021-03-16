import { FormControl, InputLabel, Select } from "@material-ui/core";
import React, { useState } from "react";


type Props = {
  options: string[];
  label: string;
}
const Dropdown = ({ options, label }: Props) => {

  const [value, setValue] = useState("All");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value)
    setValue(event.target.value as string);
  }

  return (
    <FormControl>
      <InputLabel htmlFor="native-simple">{label}</InputLabel>
      <Select
        native
        value={value}
        onChange={handleChange}
        inputProps={{
          name: "age",
          id: "native-simple",
        }}
      >
        <option aria-label="All" value="All" />
        {options.map((o, index) => <option value={index}>{o}</option>)}
      </Select>
    </FormControl>
  );
};

export default Dropdown;