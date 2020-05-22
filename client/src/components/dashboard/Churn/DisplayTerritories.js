import React from 'react'
import { Segment, Grid, Button } from 'semantic-ui-react'

const displayChart = props => {
	return (
		<div>
		<Segment color="blue" style={{ width: 1079 }} >
			<Grid></Grid>
				<Grid columns={2}>
				<Grid.Column width={12}>
					<div style={{ fontFamily: 'Titillium Web', textAlign: 'left' }}>
						<Button basic={props.churnTer !== "Global"} primary onClick={props.handleTerSelection} style={{ fontFamily: 'Titillium Web' }}>Global</Button>
						<Button basic={props.churnTer !== "AUS"} color="green" onClick={props.handleTerSelection} style={{ fontFamily: 'Titillium Web' }}>Australia</Button>
						<Button basic={props.churnTer !== "CAN"} color="yellow" onClick={props.handleTerSelection} style={{ fontFamily: 'Titillium Web' }}>Canada</Button>
						<Button basic={props.churnTer !== "USA"} color="red" onClick={props.handleTerSelection} style={{ fontFamily: 'Titillium Web' }}>United States</Button>
						<Button basic={props.churnTer !== "UK"} color="teal" onClick={props.handleTerSelection} style={{ fontFamily: 'Titillium Web' }}>United Kingdom</Button>
						<Button basic={props.churnTer !== "NZ"} color="purple" onClick={props.handleTerSelection} style={{ fontFamily: 'Titillium Web' }}>New Zealand</Button>
					</div> 
				</Grid.Column>
				<Grid.Column width={4}>
					<div style={{textAlign: "right"}}>
							<Button color="blue" basic={props.churnDollars} onClick={props.handleChurnStyleChartSelection} style={{ fontFamily: 'Titillium Web' }}>Client Number</Button>
							<Button color="blue" basic={!props.churnDollars} onClick={props.handleChurnStyleChartSelection} style={{ fontFamily: 'Titillium Web' }}>MRR Value</Button>
					</div>
				</Grid.Column> 
			</Grid>
		</Segment>
		</div>
	)
}

export default displayChart