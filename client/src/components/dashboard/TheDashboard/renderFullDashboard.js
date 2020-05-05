import React from 'react'
import { Segment, Grid, Dimmer, Loader, Button } from 'semantic-ui-react'
import { Image } from 'semantic-ui-react'
// import btt from './dashboard/btt.png'
import btt from '../../dashboard/btt.png'
import ActiveLicencesBox from '../ActiveLicences/ActiveLicencesBox'
import RecurringRevenueBox from '../RecurringRevenue/RecurringRevenueBox'
import ChurnBox from '../Churn/ChurnBox'
import CashflowBox from '../Cashflow/CashflowBox'
import NonRecurringBox from '../NonRecurringRevenue/NonRecurringBox'
import EIQBox from '../EIQ/EIQBox'
import CACBox from '../CAC/CACBox'
import LTVBox from '../LTV/LTVBox'
import BudgetBox from '../BudgetVariances/BudgetBox'
import DataIn from '../DataIn'

const renderFullDashboard = props => {
  const dashActive = e => props.handleSelection(e.currentTarget.id)
  const dashStyleActive = { cursor: 'pointer', color: '#000000' }

  if (props.rawData.length < 1) {
    return (
      <div style={{ paddingTop: 24, paddingBotton: 100 }}>
        <div style={{ paddingBottom: 12 }}>
             <Segment color="black" style={{ width: 1079 }}>
               <Grid verticalAlign={"middle"}>
                 <Grid.Column width={4}>
                 </Grid.Column>
                 <Grid.Column width={8}>
                   <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>Dashboard</h1>
                 </Grid.Column>
                 <Grid.Column width={4}>
                 </Grid.Column>
               </Grid>
             </Segment>
           </div>
         <Segment style={{ width: 1079, height: 810, textAlign: "center", backgroundColor: '#F7F7F7' }}>
          <Dimmer active={props.rawData.length < 1} inverted>
             <Loader>Syncing data....</Loader>
             <Image inline size={'huge'} src={btt} />
           </Dimmer>
         </Segment>
      </div>
     )
  }

  if (props.selected === "Select Chart" && props.rawData.length > 0) {
    return (
      <div style={{ paddingTop: 24, paddingBotton: 100 }}>
        <div style={{ paddingBottom: 12 }}>
          <Segment color="black" style={{ width: 1079 }}>
            <Grid verticalAlign={"middle"}>
              <Grid.Column width={4}>
                <Button id="Search" onClick={e => props.handleSelection(e.currentTarget.id)} color="teal">Search Data</Button>
              </Grid.Column>
              <Grid.Column width={8}>
                <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>Dashboard</h1>
              </Grid.Column>
              <Grid.Column width={4}>
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
        <Segment style={{ width: 1079, textAlign: "center", backgroundColor: '#F7F7F7' }}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <div style={dashStyleActive} id="Active Licences" onMouseEnter={() => props.onMouseEnterActiveLicences()} onMouseLeave={() => props.onMouseLeaveActiveLiecences()} onClick={dashActive}>
                  <Segment color={"green"} inverted={props.selected === "Active Licences"} raised={props.raised === "Active Licences"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Active Licences</h1>
                    <ActiveLicencesBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div style={dashStyleActive} id="Recurring Revenue" onMouseEnter={() => props.onMouseEnterRecurringRevenue()} onMouseLeave={() => props.onMouseLeaveRecurringRevenue()} onClick={dashActive}>
                  <Segment color={"orange"} inverted={props.selected === "Recurring Revenue"} raised={props.raised === "Recurring Revenue"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h1>
                    <RecurringRevenueBox selected={props.selected} rawData={props.rawData} forexData={props.forexData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div style={dashStyleActive} id="Churn" onMouseEnter={() => props.onMouseEnterChurn()} onMouseLeave={() => props.onMouseLeaveChurn()} onClick={dashActive}>
                  <Segment color={"blue"} inverted={props.selected === "Churn"} raised={props.raised === "Churn"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Client Churn</h1>
                    <ChurnBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ color: '#E0E0E0' }} columns={3}>
              <Grid.Column>
                <div style={dashStyleActive} id="Cashflow" onMouseEnter={() => props.onMouseEnterCashflow()} onMouseLeave={() => props.onMouseLeaveCashflow()} onClick={dashActive} >
                  <Segment color="yellow" inverted={props.selected === "Cashflow"} raised={props.raised === "Cashflow"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Cashflow Reporting</h1>
                    <CashflowBox selected={props.selected} rawData={props.rawData} />
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column>
              <div id="EIQ" style={dashStyleActive} onMouseEnter={() => props.onMouseEnterEIQ()} onMouseLeave={() => props.onMouseLeaveEIQ()} onClick={dashActive} >
                  <Segment color="purple" inverted={props.selected === "EIQ"} raised={props.raised === "EIQ"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>EngagementIQ</h1>
                    <EIQBox selected={props.selected} rawData={props.rawData} />
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
                <div id="Budget" onMouseEnter={() => props.onMouseEnterBudget()} onMouseLeave={() => props.onMouseLeaveBudget()} >
                  <Segment inverted={props.selected === "Budget"} raised={props.raised === "Budget"}>
                    <h1 style={{ fontFamily: 'Titillium Web' }}>Budget Variances</h1>
                    <BudgetBox selected={props.selected} rawData={props.rawData} rawSpend={props.rawSpend}/>
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <div>
    <p style={{fontStyle: "italic"}}> Last updated {DataIn.Updated}</p>
        </div>
        <div>
          {/* <Button id="Forecasts" onClick={e => props.handleSelection(e.currentTarget.id)} color="teal">Forecasts</Button> */}
        </div>
      </div >
    )
  } 

  return null
}

export default renderFullDashboard