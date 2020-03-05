import React, { Component } from 'react'
import DashboardHeading from '../DashboardHeading'
import { Segment, Grid } from 'semantic-ui-react'

class Forecasts extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div>
        <div style={{ paddingTop: 24, paddingBotton: 24 }}>
          <DashboardHeading title={"Forecasting the Financial Year"} currentColor={"purple"} />
        </div>
        <div>
          <Segment color={"purple"} style={{ width: 1079 }}>
            <Grid columns={12} style={{ width: 1300 }}>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>INVOICED</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>MONTH</p>
              </Grid.Column>
              <Grid.Column width={2}>
                <p style={{textAlign: "center"}}>AUS</p>
              </Grid.Column>
              <Grid.Column width={2}>
                <p style={{textAlign: "center"}}>NZ</p>
              </Grid.Column>
              <Grid.Column width={2}>
                <p style={{textAlign: "center"}}>CAN</p>
              </Grid.Column>
              <Grid.Column width={2}>
                <p style={{textAlign: "center"}}>USA</p>
              </Grid.Column>
              <Grid.Column width={2}>
                <p style={{textAlign: "center"}}>UK</p>
              </Grid.Column>
            </Grid>
            <Grid columns={12} style={{ width: 1300 }}>
              <Grid.Column width={1}>
     
              </Grid.Column>
              <Grid.Column width={1}>

              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>EB</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>NB</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>EB</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>NB</p>
              </Grid.Column>              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>EB</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>NB</p>
              </Grid.Column>              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>EB</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>NB</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>NB</p>
              </Grid.Column>              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>EB</p>
              </Grid.Column>
              <Grid.Column width={1}>
                <p style={{textAlign: "center"}}>NB</p>
              </Grid.Column>
            </Grid>
          </Segment>
                  </div>
      </div>
    )
  }
}

export default Forecasts

