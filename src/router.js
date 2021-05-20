import React, { Component } from 'react'
import Router, { Route, Link } from 'historypp-react-router'
import Home from './pages/home/home'
import Timezones from './pages/timezones/timezones'
import Country from './pages/country/country'
import Random from './pages/random/random'

export default class RouterComponent extends Component{
  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    //This router requires a HistoryPlusPlus instance to work
    //Transition duration in seconds (default: 0.3)
    return <Router history={this.props.history} transition={0.5}>
      <Route path="/" helmet={<title>Datos del covid</title>}>
        <Home/>
      </Route>
      <Route path="/pais/:country_name" helmet={<title>Datos especificos</title>}>
        <Country/>
      </Route>
      <Route path="/" exact={false} helmet={<title>Covid now</title>}>
        404 [sad face]
      </Route>
    </Router>
  }
}
