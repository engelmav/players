import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import StatsGrid from "./StatsGrid";
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

const Backdrop = (props: ContainerPropType) => (
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
  filterName: string;
  value: string;
};

const statsService = async (filters = [] as FilterT[]) => {
  const params: any = {};
  filters.forEach((f) => (params[f.filterName] = f.value));
  return (await axios.get("/stats", { params })).data;
};

export default function Dashboard() {
  const classes = useStyles();
  const [stats, setStats] = React.useState([]);
  const [divisionOpts, setDivisionOpts] = React.useState([]);
  const [yearOpts, setYearOpts] = React.useState([]);
  const [teamOpts, setTeamOpts] = React.useState([]);

  const [filters, setFilters] = React.useState<FilterT[]>([]);

  const getStats = async (filters = [] as FilterT[]) => {
    setFilters(filters);
    const resp = await statsService(filters);
    console.log("payload",resp);
    const { divisions, years, teams } = resp.payload.filterData;
    const { stats } = resp.payload;
    setDivisionOpts(divisions);
    setYearOpts(years);
    setTeamOpts(teams);
    setStats(stats);
  };

  const handleFilterChange = async (filterName: string, value: string) => {
    let newFilters: FilterT[];
    if (value === "All") {
      // "All" has the effect of REMOVING a filter. So we filter out the filter.
      newFilters = filters.filter(
        (filter) => filter.filterName !== filterName
      ) as FilterT[];
    } else {
      // if the value is anything else, add it:
      newFilters = filters.concat({ filterName, value });
    }
    getStats(newFilters);
  };

  React.useEffect(() => {
    getStats();
  }, []);

  return (
    <OuterContainer>
      <CssBaseline />
      <Backdrop>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Box display="flex" justifyContent="flex-start">
                  {[
                    ["Division", "lg_id", divisionOpts],
                    ["Year", "year_id", yearOpts],
                    ["Team", "team_id", teamOpts],
                  ].map((item, idx) => (
                    <Box mr={3}>
                      <Dropdown
                        key={idx}
                        label={item[0] as string}
                        filterId={item[1] as string}
                        options={(item[2] as string[]) || []}
                        onSelectItem={handleFilterChange}
                      />
                    </Box>
                  ))}
                </Box>
                <div style={{ display: "flex", height: 450 }}>
                  <StatsGrid data={stats} />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Backdrop>
    </OuterContainer>
  );
}
