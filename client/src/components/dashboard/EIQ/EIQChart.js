import React from 'react'
import { Segment } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import DataIn from '../DataIn'

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
        label: 'Admins',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(206,222,56)',
        borderColor: 'rgb(206,222,56)',
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
      },
      {
        label: 'Advisory',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(100,178,72)',
        borderColor: 'rgb(100,178,72)',
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
      },
      {
        label: 'Concierge',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(24,149,206)',
        borderColor: 'rgb(24,149,206)',
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
        label: 'Onboarding',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(63,95,173)',
        borderColor: 'rgb(63,95,173)',
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
        label: 'Support',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(72,50,144)',
        borderColor: 'rgb(72,50,144)',
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
        label: 'Training',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(126,56,151)',
        borderColor: 'rgb(126,56,151)',
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
      }
    ]
  }

  return (
    <Segment color={props.selectedColor} style={{ width: 1000 }}>
      <Bar
        data={data}
        options={{
          title: {
            display: true,
            text: 'Combined EIQ Sales per month in AUD',
            fontSize: 20,
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
                  max: 100000,
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
          tooltips: {
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