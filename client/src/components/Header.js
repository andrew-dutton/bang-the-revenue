import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return
      case false:
        return (
          <li><a href="/auth/google">Login with Google</a></li>
        )
      default:
        return (
          <div>
            <ul>
              <li><a href="/api/logout">Logout</a></li>
            </ul>
          </div>
        )
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to='/' className="left brand-logo">
            BTT Revenue
          </Link>
          <ul className="right">
            {this.renderContent()}
          </ul>
        </div>
      </nav>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Header)
