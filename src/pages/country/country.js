import React, { Component } from 'react'
import { Link } from 'historypp-react-router'
import openDialog from 'dialogspp'
import BottomSheet from 'dialogspp/bottomsheet'
import FullScreenPage from 'dialogspp/fullscreenpage'
import contextmenu from 'dialogspp/contextmenu'
import axios from 'axios'
import DataManager, { Country } from '../../util/data_manager'
const dataManager = DataManager.instance

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.props.state,
    }
  }

  //Loads initial data for page (is static to be used on server side rendering)
  static async initialData(params){
    name = params.country_name || ''
    try {
      const country = dataManager.countries[name] || await new Country(name).get()
      console.log(country)
      return {
        country_name: name,
        country,
        initialDataLoaded: true
      }
    } catch (e) {
      console.error(e)
      return {
        country_name: params.country_name || '',
        initialDataError: true,
      }
    }
  }

  //data could be received from saved state managed from router
  async componentDidMount(){
    if(!this.state.initialDataLoaded){ //initialDataLoaded is used to know if the data is loaded
      const initialData = await Home.initialData(this.props.params)
      this.setState({...initialData})
    }
  }

  componentDidUpdate(){
    //Saves data to router state manager
    this.props.saveState(this.state)
  }


  render(){
    return <div className="container">
    <section className="total-card">{this.state.initialDataLoaded ?
      <>
        <h2>{this.state.country_name}</h2>
        <p>Muertes <b>{this.state.country.deaths} 💀</b></p>
        <p>Casos <b>{this.state.country.cases} 📈</b></p>
        <p>Muertes por millón <b>{this.state.country.total_cases_per_1m_population} 💀📈</b></p>
        <p>Casos criticos <b>{this.state.country.serious_critical} 🟥</b></p>
      </>
      :
      <>
        {
          this.state.initialDataError ? <>
            <h2>{this.state.country_name}</h2>
            <h2>Error al cargar</h2>
          </>
          :
          <>
            <h2>{this.state.country_name}</h2>
            <h2>Cargando...</h2>
          </>
        }
      </>
    }</section>
    </div>
  }
}
