import React from 'react'
import Chart from 'react-google-charts'

const scatterChart = props => {

	const chartEvents = [
		{
			eventName: "select",
			options: {
				tooltip: {
					trigger: "selection"
				}
			},
			callback: ({ chartWrapper }) => {
				const chart = chartWrapper.getChart().getSelection()[0].row;
				props.setChangedMonth(chart)
			}
		}
	]

  return (
    <div style={{ fontFamily: 'Titillium Web' }}>
      <Chart
        width={'984px'}
        height={'482px'}
        chartEvents={chartEvents}
        chartType="ScatterChart"
        crosshair={{ trigger: "selection" }}
        tooltip={{ trigger: "selection" }}
        loader={<div>Loading Chart</div>}
        data={props.churnArray}
        options={{
          'vAxis': {
            'title': 'Churn %',
            'titleTextStyle': {
              fontName: 'Titillium Web'
            }
          },
          'hAxis': {
            'title': 'Date',
            'format': 'MMM-yy'
            },
          pointSize: 8,
          legend: 'none',
          titleTextStyle: { fontName: 'Titillium Web', bold: false },
          title: 'You can click on any point in the scatter graph to see the churn breakdown for that month',
          'chartArea': { 'width': '90%', 'height': '80%' },
          colors: props.chartColor,
          animation: {
            startup: true,
            easing: 'linear',
            duration: 750,
          },
          trendlines: {
            0: {
              type: 'polynomial',
              degree: 3,
              labelInLegend: 'Trend',
              lineWidth: 7,
              opacity: .5
            }
          }
        }}
      />
    </div>
  )
}

export default scatterChart