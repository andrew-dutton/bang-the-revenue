import React from 'react'
import { Segment, Button, Icon } from 'semantic-ui-react'

const whatsNext = props => {
  if (props.selected === "whats next") {
    return (
      <div style={{ paddingTop: 24 }}>
        <Segment color="purple" style={{ width: 1079, paddingTop: 24, fontFamily: 'Titillium Web' }}>
          <h1 style={{ fontFamily: 'Titillium Web' }}>
            What's next
      </h1>

          <h3 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h3>
          <ol start={1} style={{ fontFamily: 'Titillium Web' }}>
            <li>Add toggle buttons for territories which update data table below (same style as Churn page)</li>
            <li>Allow any combination of territory data to be displayed on chart at once</li>
            <li>Include toggle to show total revenue line on chart</li>
            <li>Add option to show revenue data in USD or AUD (any other currencies worthwhile?)</li>
          </ol>

          <h3 style={{ fontFamily: 'Titillium Web' }}>Main Dashboard</h3>
          <ol start={5}>
            <li>Hook data up to each section. Numbers here are currently hardcoded for September</li>
          </ol>

          <h3 style={{ fontFamily: 'Titillium Web' }}>Revenue Run Rate</h3>
          <ol start={6}>
            <li>Build out RRR dashboard</li>
          </ol>

          <h3 style={{ fontFamily: 'Titillium Web' }}>Churn</h3>
          <ol start={7}>
            <li>Add option to show churn data quarterly and annually</li>
            <li>Add switch to show Client Number Churn (as is currently displayed) or Churn by dollar value with option to select currency</li>
          </ol>

          <h3 style={{ fontFamily: 'Titillium Web' }}>Other tasks, not ordered by priority</h3>
          <ul style={{ fontFamily: 'Titillium Web' }}>
            <li>Add EIQ/EHQ columns in tables</li>
            <li>Add Global toggles to all graphs</li>
            <li>Build out remaining dashboards</li>
            <li>Create a privacy concious report of spending data that is meaningful and easy to report against revenue numbers. (This one is a big job)</li>
            <li>Add mini graphs to each dashboard square for figures that could be better presented visually than just with text</li>
            <li>Add ability to change currency being displayed when currency flags are clicked (On Client Churn page only for now, but could be used on any dashboard)</li>
            <li>Add functionality to display all data related to a specific client when their name is clicked on any table in which they appear</li>
            <li>Time travel back to specific months on Active Licence</li>
            <li>Non Recurring Revenue dashboard build - use this to analyse sales for each product family</li>
            <li>Set up Cost of Acquiring Clients Dashboard (CAC) - showing total marketing spend vs converted new leads (by month/qtr/annual)</li>
            <li>EIQ dashboard build - Display list of current EIQ licences and show their added value relative to client's EHQ licence</li>
            <li>LTV dashboard - there are a number of different formulas for calculating this. Create dynamic chart that can show results using different calculation methods</li>
            <li>Create board report option that automatically outputs a set of specific charts and table combinations in an exportable format</li>
            <li>Add a toggle button on main dashboard that switches the dislpay of all figures to show current quarter rather than just previous month(current view)</li>
            <li>Track "Expansion": Increase in revenue when when a client renews, we sell more than their previous licence, or if renew clients on to a higher EIQ package</li>
            <li>Toggle to switch main dashboard to dislpay all figures in any chosen currency</li>
          </ul>
          <h3 style={{ fontFamily: 'Titillium Web' }}>Non data related site improvements</h3>
          <ul style={{ fontFamily: 'Titillium Web' }}>
            <li>Add basic invoice search page. Not as a dashboard. Link to this will be in the header</li>
            <li>Need a "Loading" icon for when toggling options take a while to reload. A lot of number crunching in Client Churn causing some lag</li>
            <li>Consider changing layout. Maybe make things smaller, or use more width of screen</li>
            <li>Add current forex rates on main screen</li>
            <li>Create funcionality for people to make comments</li>
            <li>Create ability to export tables to a google sheet</li>
            <li>Templates to create printer/PDF friendly nicely formatted reports</li>
            <li>Code should be refactored to make it more dry</li>
          </ul>
        </Segment>

        <Segment color="yellow" style={{ width: 1079, paddingTop: 24, fontFamily: 'Titillium Web' }}>
          <h1 style={{ fontFamily: 'Titillium Web' }}>
            What's New
      </h1>

          <h3 style={{ fontFamily: 'Titillium Web' }}>23 October 2019</h3>

          <h4 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h4>
          <ul style={{ fontFamily: 'Titillium Web' }}>
            <li>Time travel back to any month by clicking it in graph to show that month's details below<Icon color="green" name="check"></Icon></li>
          </ul>

          <h4 style={{ fontFamily: 'Titillium Web' }}>Active Licences</h4>
          <ul style={{ fontFamily: 'Titillium Web' }}>
            <li>Time travel back to any month by clicking it in graph to show that month's details below<Icon color="green" name="check"></Icon></li>
          </ul>

          <h3 style={{ fontFamily: 'Titillium Web' }}>22 October 2019</h3>

          <h4 style={{ fontFamily: 'Titillium Web' }}>Recurring Revenue</h4>
          <ul style={{ fontFamily: 'Titillium Web' }}>
            <li>Show total of current month in AUD<Icon color="green" name="check"></Icon></li>
            <li>Display forex exchange rates for current months's calculations<Icon color="green" name="check"></Icon></li>
            <li>Add toggle for adding non recurring revenue for current month<Icon color="green" name="check"></Icon></li>
            <li>When include non recurring toggle is selected, table appears below with details of non recurring products invoiced in current month <Icon color="green" name="check"></Icon></li>
          </ul>

          <h3 style={{ fontFamily: 'Titillium Web' }}>19 October 2019</h3>

          <h4 style={{ fontFamily: 'Titillium Web' }}>Churn</h4>
          <ul style={{ fontFamily: 'Titillium Web' }}>
            <li>Display MRR value lost and added<Icon color="green" name="check"></Icon></li>
            <li>Display forex exchange rates that are being used in current months's calculations<Icon color="green" name="check"></Icon></li>
            <li>Fix formatting of currencies displayed in subheadings and in table data<Icon color="green" name="check"></Icon></li>
          </ul>
          <br />
          <Button
            basic
            compact color='orange'
            style={{ cursor: 'pointer', size: 11 }}
            onClick={() => props.backToDashboard()}>
            <Icon name="arrow left"></Icon>Back to Dashboard
          </Button>
        </Segment>

      </div >
    )
  }

  return null
}

export default whatsNext