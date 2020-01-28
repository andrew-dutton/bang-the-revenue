import React from 'react'
import { Segment } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import DataIn from '../DataIn'

const cashflowChart = props => {
 const options = {
  scales: {
       xAxes: [{
           stacked: true
       }],
       yAxes: [{
           stacked: true
       }]
   }
}
  const data = {
    labels: DataIn.CashflowLabels,
    datasets: [
      {
        label: 'ANZ',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,1,0.4)',
        borderColor: 'rgba(75,192,1,0.4)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: props.anzi
      },
      {
        label: 'Canada',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(222,213,42,0.4)',
        borderColor: 'rgba(222,213,42,0.4)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: props.cani
      },
      {
        label: 'USA',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(234,77,49,0.4)',
        borderColor: 'rgba(234,77,49,0.4)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: props.usai
      },
      {
        label: 'UK',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(49,234,212,0.4)',
        borderColor: 'rgba(49,234,212,0.4)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: props.uki
      }
    ]
    }

    return (
      <Segment color={props.selectedColor} style={{ width: 1000 }}>
        <Bar
          data={data}
          options={options}
        />
      </Segment>
    )
}

export default cashflowChart