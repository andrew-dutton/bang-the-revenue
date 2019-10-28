import React from 'react'
import { Segment } from 'semantic-ui-react'

const dashboardHeading = props => {
  return (
    <div style={{ paddingBottom: 24 }}>
      <Segment color={props.currentColor} style={{ width: 1079 }}>
        <h1 style={{ fontSize: 40, textAlign: "center", fontFamily: 'Titillium Web' }}>
          Active Licences
      </h1>
      </Segment>
    </div>
  )
}

export default dashboardHeading