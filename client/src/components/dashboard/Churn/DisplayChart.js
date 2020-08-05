import React from 'react'
import { Grid, Segment, Checkbox } from 'semantic-ui-react'
import Scatter from './ScatterChart'
import RollingAnnualChart	from './RollingAnnualChart'

const displayChart = props => {
	const headingStyle = {
		textAlign: 'center'
	}

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
								<Checkbox toggle active={staticActive.toString()} onClick={props.handleClickStatic} />
							</div>
							<br />

							<div>
								Budget
								<br />
								<br />
								<Checkbox toggle active={budgetActive.toString()} onClick={props.handleClickBudget} />
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
							{props.scatter ?
								<Scatter 
									setChangedMonth={props.setChangedMonth}
									churnArray={props.churnArray}
									annualActive={props.annualActive}
									projectActive={props.projectActive}
									staticActive={props.staticActive}
									budgetActive={props.budgetActive}
									chartColor={props.chartColor}
								/>

							:
							
								<RollingAnnualChart 
									setChangedMonth={props.setChangedMonth}
									rollingAnnualChurnArray={props.rollingAnnualChurnArray}
									annualActive={props.annualActive}
									projectActive={props.projectActive}
									staticActive={props.staticActive}
									budgetActive={props.budgetActive}
									chartColor={props.chartColor}
									churnTer={props.churnTer}
									rgbColor={props.rgbColor}
									terText={props.terText}
								/>
							}
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