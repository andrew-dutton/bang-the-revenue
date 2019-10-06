import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'


class Header extends Component {
  state = {
    activeItem: 'home'
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  renderContent() {
    switch (this.props.auth) {
      case null:
        return
      case false:
        return (
          <div>
            <a href="/auth/google" style={{ color: 'white' }}>Login with Google</a>
          </div>
        )
      default:
        return (
          <div>
            <a href="/api/logout" style={{ color: 'white' }}>Logout</a>
          </div>
        )
    }
  }

  render() {
    return (
      <nav>
        <div>
          <Menu inverted style={{ width: 1079 }}>
            <Menu.Item to="/dashboard" name="home" active={this.state.activeItem === 'home'} onClick={this.handleItemClick}>
              Bang The Table
            </Menu.Item>
            <Menu.Item to="/dashboard" name="dashboard" active={this.state.activeItem === 'dashboard'} onClick={this.handleItemClick}>
              <a href="/dashboard" style={{ color: 'white' }}>Dashboard</a>
            </Menu.Item>
            <Menu.Item name="log" position="right">
              <ul>
                {this.renderContent()}
              </ul>
            </Menu.Item>
          </Menu>
        </div>
      </nav>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Header)
