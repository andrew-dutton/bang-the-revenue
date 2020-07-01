import React, { Component } from 'react'
import { Grid, Segment, Dropdown, Button } from 'semantic-ui-react'
import DashboardHeading from '../DashboardHeading'
import CACMainBox from './CACMainBox'
import DataIn from '../DataIn'

class CAC extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentColor: "red",
		}

		



	}

	render() {
		const menu = DataIn.CACMenuMonths

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