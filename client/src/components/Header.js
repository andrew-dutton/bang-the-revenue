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
            <Menu.Item href="/auth/google" name="log" style={{ backgroundColor: "#3DA4D4", paddingRight: 20, paddingLeft: 20, color: 'white' }}>
              Login with Google
            </Menu.Item>
          </div>
        )
      default:
        return (
          <div>
            <Menu.Item href="/api/logout" name="log" style={{ backgroundColor: "#3DA4D4", paddingRight: 20, paddingLeft: 20, color: 'white' }}>
              Logout
            </Menu.Item>
          </div>
        )
    }
  }

  renderName = () => {
    if (!this.props.auth) {
      return null
    } else {
      return (
        <div>
          <p style={{ textAlign: "center", paddingLeft: 20, paddingRight: 20 }}>
            {this.props.auth.displayName}
          </p>
        </div>
      )
    }
  }

  render() {
    return (
      <nav>
        <div>
          <Menu borderless compact inverted style={{ width: 1079, backgroundColor: '#00597A' }}>
            <Menu.Item to="/" name="home" active={this.state.activeItem === 'home'} href="/" onClick={this.handleItemClick}>
              Bang The Table
            </Menu.Item>
            <Menu.Item fitted style={{ backgroundColor: '#EA961C', paddingLeft: 20, paddingRight: 20 }} href="/dashboard" name="dashboard" active={this.state.activeItem === 'dashboard'} onClick={this.handleItemClick}>
              Dashboard
            </Menu.Item>
            <Menu.Item position="right" fitted style={{ backgroundColor: '#1BAA8F' }} >
              {this.renderName()}
            </Menu.Item>
            {this.renderContent()}
          </Menu>
        </div>
      </nav >
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Header)
