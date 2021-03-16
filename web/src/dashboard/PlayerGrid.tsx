import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { useEffect } from "react";

type PlayerDataT = {
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
  "GIDP"
  ];
  
const columns: GridColDef[] = columnNames.map(c => { return { headerName: c, field: c }})

type Props = { data: PlayerDataT[] };
const PlayerGrid = (props: Props) => {
  const { data } = props;

  return (
    <div style={{ display: "flex", height: 350 }}>
      <DataGrid
        rows={data}
        getRowId={(row) => row.player_id}
        columns={columns}
        pageSize={20}
        loading={data.length === 0}
      />
    </div>
  );
};

export default PlayerGrid;
