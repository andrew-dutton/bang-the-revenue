import React from 'react'
import { Image, Grid, Button } from 'semantic-ui-react'
import btt from './dashboard/btt.png'

const Landing = () => {
  return (
    <div style={{ textAlign: 'center', paddingBottom: 400 }}>

      <div style={{ textAlign: 'center' }}>
        <a href="/dashboard">
          <Image inline verticalAlign size={'huge'} src={btt} />
        </a>
        <h1 style={{ fontFamily: 'Titillium Web', fontSize: 75 }}>Financial Analysis</h1>
      </div>
    </div>
  )
}

export default Landing
