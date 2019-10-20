import React from 'react'
import { Image } from 'semantic-ui-react'
import btt from './dashboard/btt.png'
import { Segment } from 'semantic-ui-react'

const Landing = () => {
  return (
    <div style={{ textAlign: 'center', paddingBottom: 400, paddingTop: 20 }}>
      <Segment style={{ width: 1079, height: 800 }}>
        <h1 style={{ fontFamily: 'Titillium Web', fontSize: 75, color: "#5E6468" }}>Financial Analysis</h1>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <a href="/dashboard">
            <Image inline verticalAlign size={'large'} src={btt} />
          </a>
        </div>
      </Segment>
    </div>
  )
}

export default Landing
