import React, { useState } from "react";
import {
  Grid,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
} from "recharts";

// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Group A", value: 400, color: "primary" },
  { name: "Group B", value: 300, color: "secondary" },
  { name: "Group C", value: 300, color: "warning" },
  { name: "Group D", value: 200, color: "success" },
];

export default function Dashboard(props) {
  var jsonData = require('./dataTest.json');
  var bonjour = "bonjour ";
  var classes = useStyles();
  var theme = useTheme();

  // local
  var [mainChartState, setMainChartState] = useState("monthly");

  return (
    <>
      <Grid container spacing={4}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Timestamp">
            <Typography size="md">{ "Value : " + jsonData["timestamp"]}</Typography>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Ongoing action">
              <Typography size="md">{ "Device : " + jsonData["Action en cours"]["device"]}</Typography>
              <Typography size="md">{ "Topic : " + jsonData["Action en cours"]["topic"]}</Typography>
              <Typography size="md">{ "Action : " + jsonData["Action en cours"]["action"]}</Typography>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Experience">
          <Typography size="md">{ "Name : " + jsonData["Experience"]["nom"]}</Typography>
          <Typography size="md">{ "User : " + jsonData["Experience"]["user"]}</Typography>
          <Typography size="md">{ "Microscope : " + jsonData["Experience"]["microscope"]}</Typography>
          <Typography size="md">{ "Type : " + jsonData["Experience"]["type"]}</Typography>
            <div className={classes.legendElement}>
              <Typography size="md">{ "En cours <"}</Typography>
              <Dot color={jsonData["Experience"]["en cours"] ? "success" : "error"}/>
              <Typography size="md">{ ">"}</Typography>
            </div>
            <div className={classes.legendElement}>
              <Typography size="md">{ "En pause <"}</Typography>
              <Dot color={jsonData["Experience"]["en pause"] ? "success" : "error"}/>
              <Typography size="md">{ ">"}</Typography>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={8} sm={6} xs={12}>
          <Widget title="Image">
            <div className={classes.performanceLegendWrapper}>
              <div className={classes.legendElement}>
                <Typography size="md">{ "Nom : " + jsonData["image"]["nom"]}</Typography>
              </div>
            </div>
              <div className={classes.legendElement}>
                <Typography size="md">{ "Black <"}</Typography>
                <Dot color={jsonData["image"]["black"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
              <div className={classes.legendElement}>
                <Typography size="md">{ "White <"}</Typography>
                <Dot color={jsonData["image"]["white"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
              <div className={classes.legendElement}>
                <Typography size="md">{ "Noise <"}</Typography>
                <Dot color={jsonData["image"]["noise"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
              <div className={classes.legendElement}>
                <Typography size="md">{ "Blurred <"}</Typography>
                <Dot color={jsonData["image"]["blurred"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Cell">
              <Typography size="md">{ "Nb of cell : " + jsonData["cell"]["nCell"]}</Typography>
              <Typography size="md">{ "Size : " + jsonData["cell"]["size"]}</Typography>
              <Typography size="md">{ "Position : " + jsonData["cell"]["position"]}</Typography>
              <Typography size="md">{ "Fluorescence :" + jsonData["cell"]["fluorescence"]}</Typography>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Microscope">
              <Typography size="md">{ "Z : " + jsonData["microscope"]["z"]}</Typography>
              <Typography size="md">{ "Lim basse autofocus : " + jsonData["microscope"]["lim basse autofocus"]}</Typography>
              <Typography size="md">{ "Lim haute autofocus : " + jsonData["microscope"]["lim haute autofocus"]}</Typography>
              <Typography size="md">{ "Lim basse mécanique : " + jsonData["microscope"]["lim basse mécanique"]}</Typography>
              <Typography size="md">{ "Lim haute mécanique : " + jsonData["microscope"]["lim haute mécanique"]}</Typography>
              <Typography size="md">{ "Z offset auto focus : " + jsonData["microscope"]["z offset auto focus"]}</Typography>
              <Typography size="md">{ "Roue à filtre : " + jsonData["microscope"]["roue a filtre"]}</Typography>
              <Typography size="md">{ "Autofocus : " + jsonData["microscope"]["autofocus"]}</Typography>
              <Typography size="md">{ "intensité : " + jsonData["microscope"]["intensité"]}</Typography>
              <Typography size="md">{ "Shutter : " + jsonData["microscope"]["shutter"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["microscope"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Motionstage">
              <Typography size="md">{ "X : " + jsonData["motionstage"]["x"]}</Typography>
              <Typography size="md">{ "Y : " + jsonData["motionstage"]["y"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["motionstage"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Mosaic">
              <Typography size="md">{ "Masque name : " + jsonData["mosaic"]["masque"]}</Typography>
              <Typography size="md">{ "Script name : " + jsonData["mosaic"]["script"]}</Typography>
              <Typography size="md">{ "Mappa : " + jsonData["mosaic"]["mappa"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["mosaic"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Fluorescence">
              <Typography size="md">{ "Name : " + jsonData["fluorescence"]["nom"]}</Typography>
              <Typography size="md">{ "Channel : " + jsonData["fluorescence"]["channel"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["fluorescence"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Photoactivation">
              <Typography size="md">{ "Name : " + jsonData["photoactivation"]["nom"]}</Typography>
              <Typography size="md">{ "Channel : " + jsonData["photoactivation"]["channel"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["photoactivation"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Delay">
              <Typography size="md">{ "Temps : " + jsonData["delay"]["temps"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["delay"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Analysis">
              <Typography size="md">{ "Script name : " + jsonData["analysis"]["script"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["analysis"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Goto">
              <Typography size="md">{ "Where : " + jsonData["goto"]["where"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["goto"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget title="Break">
              <Typography size="md">{ "Who : " + jsonData["break"]["qui"]}</Typography>
              <div className={classes.legendElement}>
                <Typography size="md">{ "En cours <"}</Typography>
                <Dot color={jsonData["break"]["en cours"] ? "success" : "error"}/>
                <Typography size="md">{ ">"}</Typography>
              </div>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }

  return resultArray;
}
