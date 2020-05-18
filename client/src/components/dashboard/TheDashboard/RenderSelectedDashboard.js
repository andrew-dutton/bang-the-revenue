import React from 'react'
import ActiveLicences from '../../dashboard/ActiveLicences/ActiveLicences'
import RecurringRevenueGraph from '../../dashboard/RecurringRevenue/RecurringRevenueGraph'
import Churn from '../../dashboard/Churn/Churn'
import QR from '../../dashboard/QuarterlyReporting/QR'
import Budget from '../../dashboard/Budget/Budget'
import Cashflow from '../../dashboard/Cashflow/Cashflow'
import Search from '../../dashboard/Search/Search'
import Forecasts from '../../dashboard/Forecasts/Forecasts'
import EIQ from '../../dashboard/EIQ/EIQ'
import Churn2 from '../../dashboard/NonRecurringRevenue/Churn2'


const renderSelectedDashboard = props => {
  let toDisplay;

  if (props.selected === "Non Recurring") {
    toDisplay = <Churn2 forexData={props.forexData} rawData={props.rawData} />
  }

  if (props.selected === "Active Licences") {
    toDisplay = <ActiveLicences toRender={"AL"} rawData={props.rawData} rawSpend={props.rawSpend}/>
  }

  if (props.selected === "Recurring Revenue") {
    toDisplay = <RecurringRevenueGraph forexData={props.forexData} rawData={props.rawData} />
  }

  if (props.selected === "Churn") {
    toDisplay = <Churn forexData={props.forexData} rawData={props.rawData} />
  }

  if (props.selected === "EIQ") {
    toDisplay = <EIQ forexData={props.forexData} rawData={props.rawData} />
  }

  if (props.selected === "QR") {
    toDisplay = <QR forexData={props.forexData} rawData={props.rawData} />
  }

  if (props.selected === "Budget") {
    toDisplay = <Budget rawSpend={props.rawSpend}/>
  }

  if (props.selected === "Whats Next") {
    props.displayWhatsNext()
  }

  if (props.selected === "Cashflow") {
    toDisplay = <Cashflow forexData={props.forexData} rawData={props.rawData} rawCashflow={props.rawCashflow}/>
  }

  if (props.selected === "Search") {
    toDisplay = <Search rawData={props.rawData} />
  }

  if (props.selected === "Forecasts") {
    toDisplay = <Forecasts rawData={props.rawData} />
  }

  return (
    <div style={{ fontFamily: 'Titillium Web' }}>
      {toDisplay}
    </div>
  )
}

export default renderSelectedDashboard