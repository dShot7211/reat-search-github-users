// STEP 1 - Include Dependencies
// Include react
import React from "react";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Chart from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

// STEP 2 - Chart Data

// STEP 3 - Creating the JSON object to store the chart configurations

const ChartComponent = ({ dataprop }) => {
  // console.log(dataprop);
  const chartConfigs = {
    type: "doughnut2d", // The chart type
    width: "100%", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // https://www.fusioncharts.com/dev/chart-attributes/pie3d  see all the prop of charts here!!
      // Chart Configuration
      chart: {
        caption: "Languages",
        decimals: 0, // remove decimals form the percents
        doughnutRadius: "45%", // for radius
        showPercentValues: 0,
        theme: "candy",
      },
      // Chart Data
      data: dataprop,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default ChartComponent;
