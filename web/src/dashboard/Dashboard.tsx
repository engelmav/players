import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Chart from "./Chart";
import Deposits from "./Deposits";
import PlayerGrid from "./PlayerGrid";
import Dropdown from "./Dropdown";
import axios from "axios";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
}));

type ContainerPropType = { children: JSX.Element | JSX.Element[] };
const OuterContainer = (props: ContainerPropType) => (
  <Box sx={{ display: "flex" }}>{props.children}</Box>
);

const MainBox = (props: ContainerPropType) => (
  <Box
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
    }}
  >
    {props.children}
  </Box>
);

type FilterT = {
  _name: string;
  value: string;
};
type FilterDataT = {
  division: string[];
  year: string[];
  team: string[];
};

export default function Dashboard() {
  const classes = useStyles();
  const [stats, setStats] = React.useState([]);
  const [filterData, setFilterData] = React.useState<FilterDataT>({
    division: [],
    year: [],
    team: [],
  });
  const [filters, setFilters] = React.useState<FilterT[]>([]);

  const handleFilterChange = (_name: string, value: string) => {
    let newFilters;
    if (value === "All") {
      newFilters = filters.filter((f) => f._name !== _name);
    } else {
      // if the value is anything else, add it:
      newFilters = filters.concat({ _name: value } as FilterT);
    }
  };

  React.useEffect(() => {
    const getData = async () => {
      const statsResp = await axios.get("/players");
      setStats(statsResp.data.payload);
      // I want the backend to process this to relieve the client; the list
      // could get big.
      const filtersResp = await axios.get("/filters");
      setFilterData(filtersResp.data.payload);
    };
    getData();
  });

  return (
    <OuterContainer>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}></AppBar>
      <MainBox>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <Chart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                <Deposits />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Dropdown label={"Division"} options={filterData.division || []} />
                <Dropdown label={"Year"} options={filterData.year || [} />
                <Dropdown label={"Team"} options={filterData.team} />
                <PlayerGrid data={stats} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </MainBox>
    </OuterContainer>
  );
}
