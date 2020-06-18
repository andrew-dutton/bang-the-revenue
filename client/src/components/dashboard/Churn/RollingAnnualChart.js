import React from 'react'
import { Line } from 'react-chartjs-2'
import DataIn from '../../../components/dashboard/DataIn'

const rollingAnnualChart = props => {
  let labels = DataIn.Labels.slice(12)
  const data = {
    labels: labels,
    datasets: [
      {
        label: props.terText,
        fill: false,
        lineTension: 0.1,
        backgroundColor: props.rgbColor,
        borderColor: props.rgbColor,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: props.rgbColor,
        pointBackgroundColor: props.rgbColor,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: props.rgbColor,
        pointHoverBorderColor: props.rgbColor,
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: props.rollingAnnualChurnArray
      }
    ]
  }


  return (
    <div>
      <Line
        data={data}
        options={{
          title: {
            display: true,
            text: 'Rolling Annual Churn Rate',
            fontSize: 22,
            fontFamily: "Titillium Web",
            fontStyle: 'bold',
            fontColor: '#000000'
          },
          'onClick': (event, item) => {
            if (item.length > 0) {
              props.setChangedMonth(item[0]["_index"]+11)
            }
          },
          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    min: 0
                     
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
                    return corporation + "  " + valor           
                }
              }
          }
        }}
      />
    </div>
  )
}

export default rollingAnnualChart