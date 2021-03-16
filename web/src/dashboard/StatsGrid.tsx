import { DataGrid, GridColDef } from "@material-ui/data-grid";
import React from "react";

export type PlayerDataT = {
  AB: string;
  BB: string;
  CS: string;
  G: string;
  GIDP: string;
  H: string;
  HBP: string;
  HR: string;
  IBB: string;
  R: string;
  RBI: string;
  SB: string;
  SF: string;
  SH: string;
  SO: string;
  lg_id: string;
  player_id: string;
  stint: string;
  team_id: string;
  three_b: string;
  two_b: string;
  year_id: string;
};

const columnNames = [
  "player_id",
  "year_id",
  "stint",
  "team_id",
  "lg_id",
  "G",
  "AB",
  "R",
  "H",
  "two_b",
  "three_b",
  "HR",
  "RBI",
  "SB",
  "CS",
  "BB",
  "SO",
  "IBB",
  "HBP",
  "SH",
  "SF",
  "GIDP",
];

const columns: GridColDef[] = columnNames.map((c) => {
  return { headerName: c, field: c };
});

type Props = { data: PlayerDataT[] };
const StatsGrid = ({ data }: Props) => {
  return (
    <DataGrid
      rows={data}
      getRowId={(row) => row.player_id}
      columns={columns}

      loading={data.length === 0}
    />
  );
};

export default StatsGrid;
