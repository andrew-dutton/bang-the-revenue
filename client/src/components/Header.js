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
            <Menu.Item to="/" name="home" active={this.state.activeItem === 'home'} onClick={this.handleItemClick}>
              <a href="/">Bang The Table</a>
            </Menu.Item>
            <Menu.Item fitted style={{ backgroundColor: '#EA961C' }} to="/dashboard" name="dashboard" active={this.state.activeItem === 'dashboard'} onClick={this.handleItemClick}>
              <a href="/dashboard" style={{ backgroundColor: '#EA961C', color: 'white', paddingLeft: 20, paddingRight: 20 }}>Dashboard</a>
            </Menu.Item>
            <Menu.Item position="right" fitted style={{ backgroundColor: '#1BAA8F' }} >
              {this.renderName()}
            </Menu.Item>
            <Menu.Item fitted name="log" style={{ backgroundColor: "#3DA4D4", paddingRight: 20, paddingLeft: 20 }}>
              <p>
                {this.renderContent()}
              </p>
            </Menu.Item>
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
