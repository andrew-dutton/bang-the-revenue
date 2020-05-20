import React from 'react'
import { Segment, Dimmer, Loader, Grid, Flag, Icon } from 'semantic-ui-react'
import { numberWithCommas } from './ChurnHelpers'

const displayMRRTable = props => {
	if(props.monthsText) {
		let forexMonth = props.monthsText[props.selectedMonth + 1].substring(3)
		let forex = props.forexData

		let todDisplay = (
			<div style={{ fontSize: 10, textAlign: "center", fontFamily: 'Titillium Web' }}>
				<h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>AUD Exchange Rates</h3>
				<Grid>
					<Grid.Column width={8}>
						<p><Flag name="ca" />{(1 / (forex[forexMonth]["AUD/CAD"])).toFixed(4)}</p>
						<p><Flag name="us" />{(1 / (forex[forexMonth]["AUD/USD"])).toFixed(4)}</p>
					</Grid.Column>
					<Grid.Column width={8}>
						<p><Flag name="uk" />{(1 / (forex[forexMonth]["AUD/GBP"])).toFixed(4)}</p>
						<p><Flag name="nz" />{(1 / (forex[forexMonth]["AUD/NZD"])).toFixed(4)}</p>
					</Grid.Column>
				</Grid>
			</div>)

		let added = props.addedTotalInAud
		let churn = props.churnTotalInAud
		let net = Math.round((added - churn).toFixed(2))
		let displayTotal = numberWithCommas(net)
		let MRRTotal = numberWithCommas(props.totalDataRR[props.selectedMonth])
		let arrow = ""
		let color = ""
		if ((added - churn) < 0) {
			arrow = "caret down"
			color = "red"
		} else {
			arrow = "caret up"
			color = "green"
		}

		let boxOneText = ["MRR Lost", <br/>, props.currentMonth]
		let boxTwoText = ["MRR Added", <br/>, props.currentMonth]
		let boxThreeTextA = ["Net MRR Change", <br/>, props.currentMonth]
		let boxThreeTextB = ["Total MRR", <br/>, props.currentPrevMonth]

		return (
			<div style={{ paddingTop: 12, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
				<Segment style={{ width: 1079, backgroundColor: '#F7F7F7' }}>
					<Dimmer active={props.dimmer}>
						<Loader>Loading</Loader>
					</Dimmer>
					<Grid>
						<Grid.Column width={4}>
							<div>
								<Segment color="blue">
									<h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{boxOneText}</h3>
									<h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>A${numberWithCommas(props.churnTotalInAud)}</h2>
								</Segment>
							</div>
						</Grid.Column>
						<Grid.Column width={4}>
							<div>
								<Segment color="blue">
									<h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{boxTwoText}</h3>
									<h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>A${numberWithCommas(props.addedTotalInAud)}</h2>
								</Segment>
							</div>
						</Grid.Column>
						<Grid.Column width={4}>
							<div>
							{!props.churnDollars ? 
								<Segment color="blue">
									<h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{boxThreeTextA}</h3>
									<h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}><Icon color={color} name={arrow}></Icon>A${displayTotal}<Icon color={color} name={arrow}></Icon></h2>
								</Segment>

								:

								<Segment color="black">
									<h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{boxThreeTextB}</h3>
									<h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>A${MRRTotal}</h2>
								</Segment>
							}
							</div>
						</Grid.Column>
						<Grid.Column width={4}>
							<div>
								<Segment color="blue">
									{todDisplay}
								</Segment>
							</div>
						</Grid.Column>
					</Grid>
				</Segment>
			</div>)
		}

		return null
}
			
  
  export default displayMRRTable