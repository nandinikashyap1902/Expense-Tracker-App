import { Bar } from "@reactchartjs/react-chart.js";
import "chartjs-plugin-datalabels";

const data = {
  labels: [
    "2015年度",
    "2016年度",
    "2017年度",
    "2018年度",
    "2019年度",
    "2020年度"
  ],
  datasets: [
    {
      type: "bar",
      label: "総数",
      backgroundColor: "#318fb5",
      data: [4857, 7289, 8108, 7899, 11140, 13559],
      borderColor: "white",
      borderWidth: 2,
      yAxisID: "first-y-axis",
      order: 2, // order低いほうが上にくる
      datalabels: {
        display: "auto", // グラフの数値表示が重なったら、片方消すオプション
        align: "top"
      }
    },
    {
      type: "bar",
      label: "hoge数",
      backgroundColor: "#b0cac7",
      data: [680, 1108, 1200, 1098, 967, 800],
      yAxisID: "first-y-axis",
      order: 3,
      datalabels: {
        display: "auto",
        align: "top"
      }
    },
    {
      type: "line",
      label: "hoge率",
      borderColor: "#005086",
      borderWidth: 1,
      fill: false,
      data: [14, 15.2, 14.8, 13.9, 8.68, 5.9],
      yAxisID: "second-y-axis",
      order: 1,
      lineTension: 0, // 直線引く
      datalabels: {
        display: "auto",
        align: "top"
      }
    }
  ]
};

const options = {
  scales: {
    yAxes: [
      {
        id: "first-y-axis",
        type: "linear",
        position: "left",
        gridLines: {},
        ticks: {
          callback: (value: number) => {
            return value + "人";
          }
        }
      },
      {
        id: "second-y-axis",
        type: "linear",
        position: "right",
        gridLines: {},
        ticks: {
          callback: (value: number) => {
            return value + "%";
          }
        }
      }
    ]
  },
  legend: {
    position: "right"
  }
};

const ReactChartJs2Sample = () => {
  return <Bar type="bar" data={data} options={options} />;
};

export default ReactChartJs2Sample;
