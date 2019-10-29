import React from 'react'
import { Segment, Grid, Button, Dimmer, Loader, Icon, Image } from 'semantic-ui-react'
import ActiveLicencesBox from '../ActiveLicences/ActiveLicencesBox'
import RecurringRevenueBox from '../RecurringRevenue/RecurringRevenueBox'
import ChurnBox from '../Churn/ChurnBox'
import RRRBox from '../RecurringRevenue/RecurringRevenueBox'
import NonRecurringBox from '../NonRecurringRevenue/NonRecurringBox'
import EIQBox from '../EIQ/EIQBox'
import CACBox from '../CAC/CACBox'
import LTVBox from '../LTV/LTVBox'
import BudgetBox from '../BudgetVariances/BudgetBox'

const renderFullDashboard = props => {
  if (props.selected === "Select Chart") {
    return (
      <div style={{ paddingTop: 24, paddingBotton: 100 }}>
        <div style={{ paddingBottom: 12 }}>
          <Segment color="black" style={{ width: 1079 }}>
            <Grid verticalAlign={"middle"}>
              <Grid.Column width={4}>
                <Button basic style={{ cursor: 'pointer', fontSize: 12 }} onClick={() => props.triggerWhatsNext()} compact color="orange"><Icon name="cogs"></Icon>Work In Progress</Button>
              </Grid.Column>
              <Grid.Column width={8}>
                <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>Dashboard</h1>
              </Grid.Column>
              <Grid.Column width={4}>
                <p style={{ textAlign: "right", size: 10 }}><Icon name="star outline"></Icon>=  Recently Updated</p>
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
        <Segment style={{ width: 1079, textAlign: "center", backgroundColor: '#F7F7F7' }}>
          <Dimmer active={props.rawData.length < 1}>
            <Loader>Syncing data....</Loader>
          </Dimmer>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <div style={{ cursor: 'pointer' }} id="Active Licences" onMouseEnter={() => props.onMouseEnterActiveLicences()} onMouseLeave={() => props.onMouseLeaveActiveLiecences()} onClick={e => props.handleSelection(e.currentTarget.id)}>
                  <Segment color={"green"} inverted={props.selected === "Active Licences"} raised={props.raised === "Active Licences"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Active Licences</h1>
                    <ActiveLicencesBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <Image fluid label={{ as: 'a', color: 'orange', corner: 'right', icon: 'star' }} />
                <div style={{ cursor: 'pointer' }} onMouseEnter={() => props.onMouseEnterRecurringRevenue()} onMouseLeave={() => props.onMouseLeaveRecurringRevenue()} id="Recurring Revenue" onClick={e => props.handleSelection(e.currentTarget.id)}>
                  <Segment color={"orange"} inverted={props.selected === "Recurring Revenue"} raised={props.raised === "Recurring Revenue"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h1>
                    <RecurringRevenueBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <Image fluid label={{ as: 'a', color: 'blue', corner: 'right', icon: 'star' }} />
                <div style={{ cursor: 'pointer' }} id="Churn" onMouseEnter={() => props.onMouseEnterChurn()} onMouseLeave={() => props.onMouseLeaveChurn()} onClick={e => props.handleSelection(e.currentTarget.id)}>
                  <Segment color={"blue"} inverted={props.selected === "Churn"} raised={props.raised === "Churn"}>

                    <h1 style={{ fontFamily: 'Titillium Web' }}>Client Churn</h1>
                    <ChurnBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ color: '#E0E0E0' }} columns={3}>
              <Grid.Column>
                <div style={{ color: '#A0A0A0' }} id="RRR" onMouseEnter={() => props.onMouseEnterRRR()} onMouseLeave={() => props.onMouseLeaveRRR()}>
                  <Segment color="yellow" inverted={props.selected === "RRR"} raised={props.raised === "RRR"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Revenue Run Rate</h1>
                    <RRRBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div id="Non Recurring" onMouseEnter={() => props.onMouseEnterNonRecurring()} onMouseLeave={() => props.onMouseLeaveNonRecurring()}>
                  <Segment inverted={props.selected === "Non Recurring"} raised={props.raised === "Non Recurring"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Non Recurring Revenue</h1>
                    <NonRecurringBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div id="EIQ" onMouseEnter={() => props.onMouseEnterEIQ()} onMouseLeave={() => props.onMouseLeaveEIQ()}>
                  <Segment inverted={props.selected === "EIQ"} raised={props.raised === "EIQ"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>EngagementIQ</h1>
                    <EIQBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ color: '#E0E0E0' }} columns={3}>
              <Grid.Column>
                <div id="CAC" onMouseEnter={() => props.onMouseEnterCAC()} onMouseLeave={() => props.onMouseLeaveCAC()}>
                  <Segment inverted={props.selected === "CAC"} raised={props.raised === "CAC"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Cost of Acquiring Clients</h1>
                    <CACBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div id="LTV" onMouseEnter={() => props.onMouseEnterLTV()} onMouseLeave={() => props.onMouseLeaveLTV()}>
                  <Segment inverted={props.selected === "LTV"} raised={props.raised === "LTV"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Client Life Time Value</h1>
                    <LTVBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div id="Budget" onMouseEnter={() => props.onMouseEnterBudget()} onMouseLeave={() => props.onMouseLeaveBudget()}>
                  <Segment inverted={props.selected === "Budget"} raised={props.raised === "Budget"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Budget Variances</h1>
                    <BudgetBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div >
    )
  }
  return null
}

export default renderFullDashboard