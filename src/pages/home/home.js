import React, { Component } from 'react'
import { Link, LinkPopOnBack, LinkReplace } from 'historypp-react-router'
import axios from 'axios'
import DataManager from '../../util/data_manager'
import openFilterSettings from './filter'

const dataManager = DataManager.instance

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.props.state,
      search: '',
    }
  }

  //Loads initial data for page (is static to be used on server side rendering)
  static async initialData(){
    await Promise.all([
      await dataManager.countriesAuto(),
      await dataManager.world.getAuto(),
    ])

    try {
      return {
        world: dataManager.world,
        countries: dataManager.countriesList,
        initialDataLoaded: true
      }
    } catch (e) {
      console.error(e)
      return {
        initialDataError: true,
      }
    }
  }

  //data could be received from saved state managed from router
  async componentDidMount(){
    if(!this.state.initialDataLoaded){ //initialDataLoaded is used to know if the data is loaded
      const initialData = await Home.initialData()
      this.setState({...initialData})
    }
  }

  componentDidUpdate(){
    //Saves data to router state manager
    this.props.saveState(this.state)
  }

  render(){
    return (<article className="container">

      <section className="total-card">{this.state.initialDataLoaded ?
        <>
          <h2>Datos globales</h2>
          <p>Muertes <b>{this.state.world.deaths} 💀</b></p>
          <p>Casos <b>{this.state.world.cases} 📈</b></p>
          <p>Muertes por millón <b>{this.state.world.deaths_per_1m_population} 💀📈</b></p>
        </>
        :
        <>
          {
            this.state.initialDataError ? <>
              <h2>Error al cargar</h2>
            </>
            :
            <>
              <h2>Cargando...</h2>
            </>
          }
        </>
      }</section>
      <form className="search-card">
        <input type="search" name="search" placeholder="Buscar" value={this.state.search} onChange={e => {
          const countries = dataManager.getCountriesList(e.target.value, this.state.filter)
          this.setState({
            countries,
            search: e.target.value,
          })
        }}/>
        <svg
        onClick={async e => {
          const settings = await openFilterSettings(this.props.history)
          if(!settings) return
          const countries = dataManager.getCountriesList(this.state.search, settings)
          this.setState({
            countries
          })
        }}
        id="Capa_1" style={{fill: 'white'}} enableBackground="new 0 0 512 512" height={512} viewBox="0 0 512 512" width={512} xmlns="http://www.w3.org/2000/svg"><g><path d="m420.404 0h-328.808c-50.506 0-91.596 41.09-91.596 91.596v328.809c0 50.505 41.09 91.595 91.596 91.595h328.809c50.505 0 91.595-41.09 91.595-91.596v-328.808c0-50.506-41.09-91.596-91.596-91.596zm61.596 420.404c0 33.964-27.632 61.596-61.596 61.596h-328.808c-33.964 0-61.596-27.632-61.596-61.596v-328.808c0-33.964 27.632-61.596 61.596-61.596h328.809c33.963 0 61.595 27.632 61.595 61.596z" /><path d="m432.733 112.467h-228.461c-6.281-18.655-23.926-32.133-44.672-32.133s-38.391 13.478-44.672 32.133h-35.661c-8.284 0-15 6.716-15 15s6.716 15 15 15h35.662c6.281 18.655 23.926 32.133 44.672 32.133s38.391-13.478 44.672-32.133h228.461c8.284 0 15-6.716 15-15s-6.716-15-15.001-15zm-273.133 32.133c-9.447 0-17.133-7.686-17.133-17.133s7.686-17.133 17.133-17.133 17.133 7.686 17.133 17.133-7.686 17.133-17.133 17.133z" /><path d="m432.733 241h-35.662c-6.281-18.655-23.927-32.133-44.672-32.133s-38.39 13.478-44.671 32.133h-228.461c-8.284 0-15 6.716-15 15s6.716 15 15 15h228.461c6.281 18.655 23.927 32.133 44.672 32.133s38.391-13.478 44.672-32.133h35.662c8.284 0 15-6.716 15-15s-6.716-15-15.001-15zm-80.333 32.133c-9.447 0-17.133-7.686-17.133-17.133s7.686-17.133 17.133-17.133 17.133 7.686 17.133 17.133-7.686 17.133-17.133 17.133z" /><path d="m432.733 369.533h-164.194c-6.281-18.655-23.926-32.133-44.672-32.133s-38.391 13.478-44.672 32.133h-99.928c-8.284 0-15 6.716-15 15s6.716 15 15 15h99.928c6.281 18.655 23.926 32.133 44.672 32.133s38.391-13.478 44.672-32.133h164.195c8.284 0 15-6.716 15-15s-6.716-15-15.001-15zm-208.866 32.134c-9.447 0-17.133-7.686-17.133-17.133s7.686-17.133 17.133-17.133 17.133 7.685 17.133 17.132-7.686 17.134-17.133 17.134z" /></g></svg>
      </form>
      <ul className="countries">
      {this.state.initialDataLoaded && this.state.countries.map(country => {
        return <li key={country.country_name}>
          <Link className="country-card" to={'/pais/'+country.country_name}>
            <h2>{country.country_name}</h2>
            <p>Muertes <b>{country.deaths}</b></p>
            <p>Casos <b>{country.cases}</b></p>
            <p>Muertes por millon <b>{country.deaths_per_1m_population}</b></p>
            <p>Hoy 📈<b>{country.new_cases}</b> - 💀<b>{country.new_deaths}</b></p>
          </Link>
        </li>
      })}
      </ul>
    </article>)
  }
}


// return (<div>
//   Actual time:
//   <br/>
//   {this.state.initialDataLoaded && this.state.datetime}
//   {this.state.initialDataError && "Error loading data"}
//   <br/>
//   <Link to="/timezones">Timezones</Link>
//   <br/>
//   <LinkPopOnBack to="/random">Random #1</LinkPopOnBack> Cannot return to it going forward
//   <br/>
//   <LinkReplace to="/random">Random #2</LinkReplace> Replace actual page
//   <br/>
//   <Link to="/404error">404 fallback</Link>
//   <br/>
//   {AsyncLoadedComponent && <AsyncLoadedComponent/>}
// </div>)
