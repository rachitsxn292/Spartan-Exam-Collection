import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">

            <button type="button" onClick={this.props.sidebarCollapse} className="btn btn-info">
                <i className="fas fa-align-left"></i>
                
            </button>
            <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i className="fas fa-align-justify"></i>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Account</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    )
  }
}
