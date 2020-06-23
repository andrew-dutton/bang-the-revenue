import React, { Component } from 'react'
import { Grid, Segment, GridColumn, Radio, Dropdown, Button } from 'semantic-ui-react'
import DashboardHeading from '../DashboardHeading'
import DataIn from '../DataIn'
import * as CH from './CACHelpers'
import CACMainBox from './CACMainBox'

class CAC extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentColor: "red",
		}

		



	}

	render() {
		const menu = [
			{ key: "July 2019", text: "July 2019", value: "July 2019"},
			{ key: "August 2019", text: "August 2019", value: "August 2019"},
			{ key: "September 2019", text: "September 2019", value: "September 2019"},
			{ key: "October 2019", text: "October 2019", value: "October 2019"},
			{ key: "November 2019", text: "November 2019", value: "November 2019"},
			{ key: "December 2019", text: "December 2019", value: "December 2019"},
			{ key: "Janaury 2020", text: "Janaury 2020", value: "Janaury 2020"},
			{ key: "February 2020", text: "February 2020", value: "February 2020"},
			{ key: "March 2020", text: "March 2020", value: "March 2020"},
			{ key: "April 2020", text: "April 2020", value: "April 2020"},
			{ key: "May 2020", text: "May 2020", value: "May 2020"},
			{ key: "June 2020", text: "June 2020", value: "June 2020"},
		]

		const reportinDatesText = ["Reporting", <br/>, "Dates"]

		return(
			<div style={{ paddingTop: 24, paddingBotton: 24 }}>
				<DashboardHeading title={"Cost of Acquiring Clients"} currentColor={this.state.currentColor} />
				<Segment color={this.state.currentColor} style={{ width: 1079, textAlign: "center"}}>
					<Grid>
						<Grid.Row columns={4}>
							<Grid.Column>
								<h2>{reportinDatesText}</h2>
							</Grid.Column>
							<Grid.Column>
								<h5>From</h5>
								<Dropdown placeholder="Start Date" selection options={menu}/>
							</Grid.Column>
							<Grid.Column>
								<h5>To</h5>
								<Dropdown placeholder="Start Date" selection options={menu}/>
							</Grid.Column>
							<Grid.Column verticalAlign={"middle"}>
								<Button primary>Submit</Button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				
	
				</Segment>
				<CACMainBox color={this.state.currentColor} />
			</div>
		)
	}
}

export default CAC