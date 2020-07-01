import React from 'react'
import { Grid, Segment } from 'semantic-ui-react'

const CACMainBox = props => {


	return (
		<div>
			<Segment style={{ width: 1079, height: 900, textAlign: "center" }}>
				<Grid>
					<Grid.Row columns={5}>
						<Grid.Column>
							<Segment color={props.color}>
								<h3>{["Churn", <br/>, "Rate"]}</h3>
							</Segment>
						</Grid.Column>
						<Grid.Column>
						<Segment color={props.color}>
								<h3>{["Average", <br/>, "Client Spend"]}</h3>
							</Segment>
						</Grid.Column>			
						<Grid.Column>
						<Segment color={props.color}>
								<h3>{["Client", <br/>, "Lifetime Value"]}</h3>
							</Segment>
						</Grid.Column>					
						<Grid.Column>						
						<Segment color={props.color}>
								<h3>{["Our", <br/>, "Costs"]}</h3>
							</Segment>
						</Grid.Column>
						<Grid.Column>						
						<Segment color={props.color}>
								<h3>{["Cost to", <br />, "Acquire 1 Client"]}</h3>
							</Segment>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		</div>
	)
}

export default CACMainBox