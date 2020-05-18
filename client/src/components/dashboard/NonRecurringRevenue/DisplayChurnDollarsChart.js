import React from 'react'
import { Segment, Grid } from 'semantic-ui-react'
import Chart from 'react-google-charts'

const displayChurnDollarsChart = props => {
	// const chartEvents = [
	// 	{
	// 		eventName: "select",
	// 		options: {
	// 			tooltip: {
	// 				trigger: "selection"
	// 			}
	// 		},
	// 		callback: ({ chartWrapper }) => {
	// 			const chart = chartWrapper.getChart().getSelection()[0].row;
	// 			this.setState((prevState) => ({ selectedMonth: chart }))
	// 			this.props.setChurnDollarsChurnValue(this.state.chartData[this.state.selectedMonth + 1][1])
	// 			this.props.updateMonthInParent(chart)
	// 		}
	// 	}
	// ]	

	return (
		<Grid.Column width={15}>
			<Segment color="blue" style={{ width: 1000, fontFamily: 'Titillium Web' }}>
				<div style={{ fontFamily: 'Titillium Web' }}>
					<Chart
						width={'984px'}
						height={'484px'}
						chartEvents={chartEvents}
						chartType="ScatterChart"
						crosshair={{ trigger: "selection" }}
						tooltip={{ trigger: "selection" }}
						loader={<div>Loading Chart</div>}
						data={props.chartData}
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
			</Segment>
		</Grid.Column>)
}

export default displayChurnDollarsChart