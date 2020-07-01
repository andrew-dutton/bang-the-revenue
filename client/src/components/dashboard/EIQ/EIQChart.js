import React from 'react'
import { Segment } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-trendline'

const EIQChart = props => {

  const footer = () => {
    if(props.dataTypeValue === "comparison") {
      return null
    } else {
      return "TOTAL: $" + window.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }

  const data = {
    labels: props.dateLabels,
    datasets: [     
      {
        label: 'Training',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#000099',
        borderColor: '#000099',
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
        data: props.trainingData
      },
      {
        label: 'Support',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
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
        data: props.supportData
      },
      {
        label: 'Onboarding',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#009900',
        borderColor: '#009900',
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
        data: props.onboardingData
      },
      {
        label: 'Concierge',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#CCCC00',
        borderColor: '#CCCC00',
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
        data: props.conciergeData
      },
      {
        label: 'Advisory',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#FF8000',
        borderColor: '#FF8000',
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
        data: props.advisoryData
      }, {
        label: 'Admins',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#CC0000',
        borderColor: '#CC0000',
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
        data: props.adminsData
      }
    ]
  }

  return (
    <Segment color={props.selectedColor} style={{ width: 1051 }}>
      <Bar
        data={data}
        options={{
          title: {
            display: true,
            text: 'Combined EIQ Sales per month in AUD',
            fontSize: 30,
            fontColor: '#000000',
            fontFamily: 'Titillium Web'
        },
          'onClick': (event, item) => {
            if (item.length > 0 && props.timePeriodValue === "eiqLaunch") {
              props.updateCurrentMonth(item[0]["_index"] + 42)
            } else if(item.length > 0 && props.timePeriodValue === "allTime") {
              props.updateCurrentMonth(item[0]["_index"])
            }
          },
          'scales': {
              xAxes: [{ 
                stacked: true 
              }],
              yAxes: [{ 
                stacked: true ,
                ticks: {
                  beginAtZero: true,
                  max: 250000,
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
          legend: {
            reverse: true
          },
          tooltips: {
            itemSort: function(a, b) { return b.datasetIndex - a.datasetIndex },
            mode: 'label',
            callbacks: {
                afterTitle: function() {
                    window.total = 0;
                },
                label: function(tooltipItem, data) {
                    var corporation = data.datasets[tooltipItem.datasetIndex].label;
                    var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    window.total += parseInt(valor);
                    return corporation + ": $" + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");             
                },
                footer: footer
              }
          }
        }}
      />
    </Segment>

  )
}

export default EIQChart