import React from 'react';
import Card from '../UI/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
//import faker from 'faker';

const Chart = ({ expensesToChart, currency }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  // export
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        /* position: 'top',
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 16,
          },
          color: 'white',
        }, */
      },
      title: {
        display: true,
        text: '',
        color: 'white',
      },
    },
    indexAxis: 'x',
    scales: {
      y: {
        ticks: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bolder',
          },
        },
      },
      x: {
        ticks: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bolder',
          },
        },
      },
    },
  };
  let labels = [];
  let amountsData = [];
  //export
  const data = {
    labels,
    datasets: [
      {
        label: currency,
        data: '',
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(201, 203, 207, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(201, 203, 207, 0.7)',
        ],
      },
    ],
  };

  //   data.datasets[0].data = labels.map(() =>
  //     faker.datatype.number({ min: 0, max: 1000 })
  //   );

  let fallbackText = '';
  if (expensesToChart.length > 0) {
    //expensesToChart is a prop passed to here from ExpensesApp.js (filterdExpenses)
    fallbackText = `Expenses of ${new Date(
      expensesToChart[0].date
    ).getFullYear()}`;
  } else {
    fallbackText = 'No Expenses for selected year';
  }
  options.plugins.title.text = fallbackText;
  // chartedMonths is array will be created to hold the total amount expenses in each month of the pased filtered year to chart
  let chartedMonths = [
    { month: 'Jan', amount: 0, monthNumber: 0 },
    { month: 'Feb', amount: 0, monthNumber: 1 },
    { month: 'Mar', amount: 0, monthNumber: 2 },
    { month: 'Apr', amount: 0, monthNumber: 3 },
    { month: 'May', amount: 0, monthNumber: 4 },
    { month: 'Jun', amount: 0, monthNumber: 5 },
    { month: 'Jul', amount: 0, monthNumber: 6 },
    { month: 'Aug', amount: 0, monthNumber: 7 },
    { month: 'Sep', amount: 0, monthNumber: 8 },
    { month: 'Oct', amount: 0, monthNumber: 9 },
    { month: 'Nov', amount: 0, monthNumber: 10 },
    { month: 'Dec', amount: 0, monthNumber: 11 },
  ];
  for (let i = 0; i < expensesToChart.length; i++) {
    const month = new Date(expensesToChart[i].date).toLocaleString('default', {
      month: 'short',
    });
    for (let j = 0; j < chartedMonths.length; j++) {
      if (chartedMonths[j].month === month) {
        chartedMonths[j].amount += expensesToChart[i].amount;
      }
    }
  }
  //now we will filer chartedMonths to take away the months that have no expenses. and then sort the last result to according to the months calendar start. and sign the end resilt in arrayOfChartData
  const arrayOfChartData = chartedMonths
    .filter((item) => item.amount > 0)
    .sort((a, b) => a.monthNumber - b.monthNumber);

  for (let i = 0; i < arrayOfChartData.length; i++) {
    labels.push(arrayOfChartData[i].month); //I will push the x axe info to labels array
    amountsData.push(arrayOfChartData[i].amount);
  }
  data.datasets[0].data = amountsData; // I will push the y axe info to data array
  return (
    <Card>
      <Bar options={options} data={data} />
    </Card>
  );
};

// export { Chart, data, options};
export default Chart;



/*  let chartData = {}; //I will extract from my filtered passed data an object with the month name as key and the total amounts of that month expenses as value and assign this object to chartData
  for (let i = 0; i < expensesToChart.length; i++) {
    const month = new Date(expensesToChart[i].date).toLocaleString('default', {
      month: 'short',
    });
    if (chartData.hasOwnProperty(month)) {
      chartData[month] = chartData[month] + expensesToChart[i].amount;
    } else {
      chartData[month] = expensesToChart[i].amount;
    }
  }

  let arrayOfChartData = []; //I will creat from chartData an array of arries each arry inside this array has two values the first is the month name and the second is the total amount, then i will assign this array to arrayOfChartData
  for (const key in chartData) {
    arrayOfChartData.push([key, chartData[key]]);
  }

  arrayOfChartData.sort((a, b) => (a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1)); // here we use sort it to start from the first month */
