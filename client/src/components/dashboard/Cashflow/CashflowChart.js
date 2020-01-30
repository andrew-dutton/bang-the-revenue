import React from 'react'
import { Segment } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'

const cashflowChart = props => {
  const options = {
  scales: {
       xAxes: [{
           stacked: true
       }],
       yAxes: [{
           stacked: true,
           ticks: {
            beginAtZero:true,
            callback: function(value, index, values) {
                if(parseInt(value) >= 1000){
                   return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                   return '$' + value;
                }
           }                            
        }
    }]
   },
   title: {
     display: true,
     text: props.dataTypeValue === "invoiced" ? "Invoiced in AUD" : "Spent in AUD",
     fontSize: 20
   },
   tooltips: {
    mode: 'label',
    callbacks: {
        afterTitle: function() {
            window.total = 0;
        },
        label: function(tooltipItem, data) {
            var corporation = data.datasets[tooltipItem.datasetIndex].label;
            var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            window.total += valor;
            return corporation + ": $" + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");             
        },
        footer: function() {
            return "TOTAL: $" + window.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
  }
}
  const data = {
    labels: props.labels,
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
        data: props.dataTypeValue === "invoiced" ? props.anzi : props.anzs
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
        data: props.dataTypeValue === "invoiced" ? props.cani : props.cans
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
        data: props.dataTypeValue === "invoiced" ? props.usai : props.usas
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
        data: props.dataTypeValue === "invoiced" ? props.uki : props.uks
      }
    ]
    }

    return (
      <Segment color={props.currentColor} style={{ width: 1079 }}>
        <Bar
          data={data}
          options={options}
        />
      </Segment>
    )
}

export default cashflowChart