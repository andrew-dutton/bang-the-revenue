import React from 'react'
import { Segment, Checkbox, Grid } from 'semantic-ui-react'

const licenceToggles = props => {
  return (
    <div>
      <Segment color={"green"} style={{ width: 70, height: 513 }}>
        <br />
        <div>
          Annual
        <br />
          <br />
          <Checkbox defaultChecked toggle active={props.annualActive} onClick={props.handleClickAnnual} />
        </div>
        <br />
        <div>
          Project
        <br />
          <br />
          <Checkbox defaultChecked toggle active={props.projectActive} onClick={props.handleClickProject} />
        </div>
        <br />
        <div>
          Static
        <br />
          <br />
          <Checkbox defaultChecked toggle active={props.staticActive} onClick={props.handleClickStatic} />
        </div>
        <br />
        <div>
          Budget
        <br />
          <br />
          <Checkbox defaultChecked toggle active={props.budgetActive} onClick={props.handleClickBudget} />
        </div>
        <br />
        <br />
        <div style={props.headingStyle}>
          <br />
          <br />
        </div>
      </Segment>
    </div>
  )
}

export default licenceToggles