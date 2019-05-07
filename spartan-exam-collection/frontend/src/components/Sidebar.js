import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import history from './../lib/history'

class Sidebar extends Component {
    getActiveClass= (tab)=>{
        if(this.props.activeTab === tab)
            return "active";
        else
            return ""
    }
    logoutNow = ()=>{
        localStorage.removeItem('x-access-token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiresAt');
        this.props.history.push('/');
    }
  render() {
    let auth = this.props.auth;
    let userName = auth.getUser().firstName || "Student";
    return (
        <nav id="sidebar" className={this.props.getSidebarStatus()}>
        <div className="sidebar-header">
            <h5>Spartan Collection</h5>
        </div>

        <ul className="list-unstyled components">
            <p>Hello, {userName}!</p>
            <li className={this.getActiveClass('Search')}>
                <Link to='/home'>Search</Link>
            </li>
            <li className={this.getActiveClass('New')}>
                <Link to='/home/new'>New</Link>
            </li>
            <li className={this.getActiveClass('Bookmark')}>
                <Link to='/home/bookmark'>Bookmarked</Link>
            </li>
        </ul>

        <form  onSubmit={this.logoutNow}>
            <div className="form-group text-center">
                <input type="submit" className="btnSubmit" value="Logout" />
            </div>
        </form>
    </nav>
    )
  }
}

export default Sidebar;
