import API_KEYS from '../api_keys.js'
import axios from 'axios'
const API_HOST = "coronavirus-monitor.p.rapidapi.com"
const CASES_BY_COUNTRY = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php"
const WORLD_TOTAL_STAT = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php"
const headers = {
	"x-rapidapi-key": "e6fed55464msh198d7d4a035b700p10569fjsne5d4ddf13d10",
	"x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
	"useQueryString": true
}

class World{
  data = {}
  dataLoaded = 0
  constructor(world, data){
    if(world instanceof World){
      this.data = country.data
    }else if(typeof world == 'object'){
      this.data = world
    }
    if(typeof data == 'object'){
      this.data = {...this.data, ...data}
    }
  }

  get deaths(){
    return parseNumber(this.data.total_deaths)
  }

  get cases(){
    return parseNumber(this.data.total_cases)
  }

  get active_cases(){
    return parseNumber(this.data.active_cases)
  }

  get deaths_per_1m_population(){
    return parseNumber(this.data.deaths_per_1m_population)
  }

  async get(){
    const response = await axios(WORLD_TOTAL_STAT, {headers})
    const data = response.data
    this.data = data
    this.dataLoaded = Date.now()
    return this
  }

  async getAuto(){
    if(!this.dataLoaded) return await this.get()
    return this
  }
}

class DataManager{
  static instance = new DataManager()
  world = new World()

  countriesLoaded = 0

  constructor(){

  }

  async getCountries(){
    const response = await axios(CASES_BY_COUNTRY, {headers})
    const data = response.data
    const countries_stat = data.countries_stat
    for(const country of countries_stat){
      this.countries[country.country_name] = new Country(this.countries[country.country_name], country)
    }
    this.countriesLoaded = Date.now()
    return this.countries
  }

  async countriesAuto(){
    if(!this.countriesLoaded) return this.getCountries()
    return this.countries
  }

  countries = {}

  getCountriesList(search = '', filter = { filter_order: ['deaths_per_1m_population'], order_mode: "desc" }){
    let list = []
    for(const country_name of Object.keys(this.countries)){
      list.push(this.countries[country_name])
    }

    let list2
    if(search.trim()){
      list2 = []
      for(const country of list){
        if(compare(country.country_name, search)) list2.push(country)
        else if(compare(country.deaths, search)) list2.push(country)
        else if(compare(country.cases, search)) list2.push(country)
      }
      list = list2
    }

    if(filter){
      const order = filter.filter_order || []
      const m = filter.order_mode == 'desc' ? -1 : 1
      for(const key of order){
        list = list.sort((a, b) => (a[key] > b[key]) ? m : m*-1)
      }
    }

    return list
  }

  get countriesList(){
    return this.getCountriesList()
  }
}

class Country{
  data = {}
  constructor(country, data){
    if(typeof country == 'string'){
      this.data = {country_name:country}
    }else
    if(country instanceof Country){
      this.data = country.data
    }else if(typeof country == 'object'){
      this.data = country
    }
    if(typeof data == 'object'){
      this.data = {...this.data, ...data}
    }
    return this
  }

  async get(){
    const response = await axios(WORLD_TOTAL_STAT, {headers,query:{country:this.data.name}})
    this.data = response.data
    return this
  }

  get country_name(){
    return this.data.country_name || ''
  }

  get name(){
    return this.country_name
  }

  get deaths(){
    return parseNumber(this.data.deaths || this.data.total_deaths)
  }

  get cases(){
    return parseNumber(this.data.cases || this.data.total_cases)
  }

  get recovered(){
    return parseNumber(this.data.recovered || this.data.total_recovered)
  }

  get serious_critical(){
    return parseNumber(this.data.serious_critical || this.data.total_serious_critical)
  }

  get deaths_per_1m_population(){
    return parseNumber(this.data.deaths_per_1m_population || this.data.total_deaths_per_1m_population)
  }

  get new_cases(){
    return parseNumber(this.data.new_cases)
  }

  get new_deaths(){
    return parseNumber(this.data.new_deaths)
  }
}


function parseNumber(num){
  try {
    return parseFloat(num.replace(/,/gi,''))
  } catch (e) {
    return 0
  }
}

function compare(str1, str2){
  return str1.toString().toLowerCase().search(str2.toString().toLowerCase().trim()) != -1
}

window.dataManager = DataManager.instance
export default DataManager
exports.Country = Country
