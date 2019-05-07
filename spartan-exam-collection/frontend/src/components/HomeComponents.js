import React, {
    Component
} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Search from './Search';
import Auth from '../lib/auth';
import AddNewImage from './AddNewImage';
import Bookmarked from './Bookmarked';
const auth = new Auth();
export default class HomeComponents extends Component {
    state = {
        hideSidebar: true,
        activeTab: "Search"
    }
    sidebarCollapse = (e) => {
        e.preventDefault();
        this.setState((prev) => {
            return {
                hideSidebar: !prev.hideSidebar
            }
        })
    }
    setActiveTab = (tab) => {
        this.setState(() => {
            return {
                activeTab: tab
            }
        })
    }
    getSidebarStatus = () => {
        return this.state.hideSidebar ? "" : "active"
    }
    cardClick = () => {
        console.log("Card CLick")
        this.setState((prev) => {
            return {
                hideSidebar: !prev.hideSidebar
            }
        })
    }
    render() {
        let isAuthenticated = auth.isAuthenticated();
        let redirectVar = null;
        if (!isAuthenticated) {
            redirectVar = <Redirect to="/" />
        }
        return (
            <div>
                {/* {redirectVar} */}
                <div className="wrapper">
                    <Sidebar getSidebarStatus={this.getSidebarStatus} activeTab={this.state.activeTab} auth={auth} {...this.props} />
                    <div id="content" >
                        <Header sidebarCollapse={this.sidebarCollapse} />

                        <div className="container-fluid">
                            <Switch>
                                <Route path="/home/bookmark" render={(props) => <Bookmarked changeActiveTab={this.setActiveTab} auth={auth} {...props} />} />
                                <Route path="/home/new" render={(props) => <AddNewImage changeActiveTab={this.setActiveTab} auth={auth} {...props} />} />
                                <Route path="/home" render={(props) => <Search changeActiveTab={this.setActiveTab} auth={auth} {...props} />} />
                            </Switch>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
