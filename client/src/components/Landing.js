import React from 'react'
import { Image } from 'semantic-ui-react'
import btt from './dashboard/btt.png'
import { Segment } from 'semantic-ui-react'

const Landing = () => {
  return (
    <div style={{ textAlign: 'center', paddingBottom: 400, paddingTop: 20 }}>
      <Segment style={{ width: 1079, height: 900 }}>
        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          <a href="/dashboard">
            <Image inline size={'huge'} src={btt} />
          </a>
        </div>
      </Segment>
    </div>
  )
}

export default Landing
