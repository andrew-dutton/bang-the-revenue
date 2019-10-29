import React from 'react'
import ActiveLicences from '../../dashboard/ActiveLicences/ActiveLicences'
import RecurringRevenueGraph from '../../dashboard/RecurringRevenue/RecurringRevenueGraph'
import Churn from '../../dashboard/Churn/Churn'

const renderSelectedDashboard = props => {
  let toDisplay;

  if (props.selected === "Active Licences") {
    toDisplay = <ActiveLicences rawData={props.rawData} />
  }

  if (props.selected === "Recurring Revenue") {
    toDisplay = <RecurringRevenueGraph forexData={props.forexData} rawData={props.rawData} />
  }

  if (props.selected === "Churn") {
    toDisplay = <Churn forexData={props.forexData} rawData={props.rawData} />
  }

  if (props.selected === "Whats Next") {
    props.displayWhatsNext()
  }

  return (
    <div style={{ fontFamily: 'Titillium Web' }}>
      {toDisplay}
    </div >
  )
}

export default renderSelectedDashboard