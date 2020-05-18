import React from 'react'
import { Grid, Segment, Checkbox } from 'semantic-ui-react'
import Chart from 'react-google-charts'

const displayChart = props => {
	const headingStyle = {
		textAlign: 'center'
	}

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

	const { annualActive, projectActive, staticActive, budgetActive } = props

	if (props.churnArray) {
		return (
			<Grid columns='equal' style={{ width: 1300, paddingTop: 12, fontFamily: 'Titillium Web' }}>
				<Grid.Column>
					<Segment color="blue" style={{ width: 70, height: 513 }}>
						<br />
						<br />
						<div>
							Annual
							<br />
							<br />
							<Checkbox toggle defaultChecked active={annualActive.toString()} onClick={props.handleClickAnnual} />
						</div>
						<br />
						<div>
							Project
							<br />
							<br />
							<Checkbox toggle defaultChecked active={projectActive.toString()} onClick={props.handleClickProject} />
						</div>
						<br />
						<div>
							Static
							<br />
							<br />
							<Checkbox toggle defaultChecked active={staticActive.toString()} onClick={props.handleClickStatic} />
						</div>
						<br />

						<div>
							Budget
							<br />
							<br />
							<Checkbox toggle defaultChecked active={budgetActive.toString()} onClick={props.handleClickBudget} />
						</div>
						<br />
						<br />
						<div style={headingStyle}>
							<br />
							<br />
						</div>
					</Segment>
				</Grid.Column>
				<Grid.Column width={15}>
					<Segment color="blue" style={{ width: 1000, fontFamily: 'Titillium Web' }}>
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
									animation: {
										duration: 1000,
										easing: 'out',
										startup: true
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
			</Grid.Column> 
		</Grid>)
	}

	return null			
}


export default displayChart


			// {/* {this.state.churnDollars ?  
			// <ChurnDollars 
			// 	rawData={this.props.rawData} 
			// 	forexData={this.props.forexData}
			// 	annual={this.state.annual}
			// 	project={this.state.project}
			// 	static={this.state.static}
			// 	budget={this.state.budget}
				// 	churnTer={this.state.churnTer}
				// 	chartColor={this.state.chartColor}
				// 	updateMonthInParent={this.updateMonthInParent}
				// 	setChurnDollarsChurnValue={this.setChurnDollarsChurnValue}
				// />  
				
				// :	