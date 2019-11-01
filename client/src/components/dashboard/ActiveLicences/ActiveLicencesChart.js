import React from 'react'
import { Segment } from 'semantic-ui-react'
import { Line } from 'react-chartjs-2'
import DataIn from '../DataIn'

const activeLicencesChart = props => {
  const data = {
    labels: DataIn.Labels,
    datasets: [
      {
        label: 'Australia',
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
        data: props.ausData
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
        data: props.canData
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
        data: props.usaData
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
        data: props.ukData
      },
      {
        label: 'New Zealand',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(234,49,223,0.4)',
        borderColor: 'rgba(234,49,223,0.4)',
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
        data: props.nzData
      }
    ]
  }

  return (
    <Segment color={props.selectedColor} style={{ width: 1000 }}>
      <Line
        data={data}
        options={{
          'onClick': (event, item) => {
            if (item.length > 0) {
              props.updateCurrentMonth(item[0]["_index"])
            }
          }
        }}
      />
    </Segment>

  )
}

export default activeLicencesChart