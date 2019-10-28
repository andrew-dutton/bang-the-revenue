import React from 'react'
import { Segment } from 'semantic-ui-react'

const displayMonth = (props) => {
  return (
    <div style={{ textAlign: 'center', paddingTop: 14, paddingBottom: 12, fontFamily: 'Titillium Web' }}>
      <Segment color={props.currentColor} style={{ width: 1079, fontFamily: 'Titillium Web' }}>
        <h1 style={{ textAlign: "center", fontFamily: 'Titillium Web' }}>{props.currentMonth}</h1>
      </Segment>
    </div>
  )
}

export default displayMonth
