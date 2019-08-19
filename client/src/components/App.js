import { Container } from 'semantic-ui-react'
import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Landing from './Landing'
import './App.css'



import Header from './Header'
import Dashboard from './Dashboard'

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }

  render() {
    return (
      <div className="main">
        <BrowserRouter>
          <Container fluid>
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
