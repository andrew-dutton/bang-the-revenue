import { Container } from 'semantic-ui-react'
import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Landing from './Landing'
import './App.css'
import 'handsontable/dist/handsontable.full.css'
import GoogleFontLoader from 'react-google-font-loader'


import Header from './Header'
import Dashboard from './Dashboard'

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
    this.con()
  }

  con = () => {
    console.log('BBBBBB    TTTTTTTTTTTTT    TTTTTTTTTTTT')
    console.log('BB   BB         TT              TT')
    console.log('BB    BB        TT              TT')
    console.log('BB    BB        TT              TT')
    console.log('BB   BB         TT              TT')
    console.log('BB  BB          TT              TT')
    console.log('BBBB            TT              TT')
    console.log('BB  BB          TT              TT')
    console.log('BB   BB         TT              TT')
    console.log('BB    BB        TT              TT')
    console.log('BB   BB         TT              TT')
    console.log('BB  BB          TT              TT')
    console.log('BBBB            TT              TT')
  }



  render() {
    return (
      <div style={{ backgroundColor: '#F7F7F7' }} className="main" >
        <GoogleFontLoader
          fonts={[
            {
              font: 'Titillium Web',
              weights: [400, '400i'],
            },
          ]}
          subsets={['cyrillic-ext', 'greek']}
        />
        <BrowserRouter>
          <Container>
            <Header />
            <Route exact path="/" component={Landing} />
            <Route exact path="/dashboard" component={Dashboard} />
          </Container>
        </BrowserRouter>
      </div>
    )
  }
}

export default connect(null, actions)(App)









