import React from 'react'
import { Dimmer, Loader, Grid, Segment } from 'semantic-ui-react'

const displayTable = props => {
    if (props.showTable && props.lost && props.newClients) {
      return (
        <div style={{ paddingTop: 12, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
          <Segment style={{ width: 1079, backgroundColor: '#F7F7F7' }}>
            <Dimmer active={props.dimmer}>
              <Loader>Loading</Loader>
            </Dimmer>
            <Grid>
              <Grid.Column width={4}>
                <Segment color="blue">
                  <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Total Clients Lost in<br />{props.currentMonth}</h3>
                  <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{props.lost[props.selectedMonth].length}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment color="blue">
                  <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Total Clients Added in<br />{props.currentMonth}</h3>
                  <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{props.newClients[props.selectedMonth].length}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment color="blue">
                  <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Total Clients At End of<br />{props.currentPrevMonth}</h3>
                  <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{props.churnDataArray[props.selectedMonth][2]}</h2>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <div>
                {!props.churnDollars ? 
                  <Segment color="blue">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Churn Client Calculation<br />{props.currentMonth} </h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{props.churnArray[props.selectedMonth + 1][1].toFixed(2)}%</h2>
                  </Segment>

                  :

                  <Segment color="black">
                    <h3 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>Churn Value Calculation<br />{props.currentMonth} </h3>
                    <h2 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{props.churnArray[props.selectedMonth + 1][1].toFixed(2)}%</h2>
                  </Segment>}
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </div >
      )
    }

    return null
  }

  export default displayTable