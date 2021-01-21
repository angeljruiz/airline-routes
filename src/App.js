import React, { useState } from 'react';
import { Button } from '@material-ui/core'
import './App.css';

import Table from './components/Table';
import Select from './components/Select';
import data from './data'

const { routes, formatValue, airlines, airports, getAirlineById, getAirportByCode } = data

const App = () => {
  const [page, setPage] = useState(0)
  const [airlineFilter, setAirlineFilter] = useState(false)
  const [airportFilter, setAirportFilter] = useState(false)

  let filteredRoutes = routes
  const perPage = 50
  const maxPage = Math.ceil(routes.length / perPage)
  const columns = [
    {name: 'Airline', property: 'airline'},
    {name: 'Source Airport', property: 'src'},
    {name: 'Destination Airport', property: 'dest'},
  ]

  if(airlineFilter) { 
    filteredRoutes = filteredRoutes.filter( route => getAirlineById(route.airline) === airlineFilter)
  }
  if(airportFilter) { 
    filteredRoutes = filteredRoutes.filter( route => getAirportByCode(route.src) === airportFilter || getAirportByCode(route.dest) === airportFilter)
  }


  function turnPage(flips) {
    if(page + flips >= 0 && page + flips < maxPage)
      setPage(page + flips)
  }

  function handleFilterChange(setFilter, { target: { value }}) {
    if(value === 'all')
      setFilter(false)
    else
      setFilter(value)
  }

  function clearFilters() {
    setAirportFilter(false)
    setAirlineFilter(false)
  }

  return(
    <div className="app">
    <header className="header">
      <h1 className="title">Airline Routes</h1>
    </header>
    <section>
      <Select 
        options={airlines} 
        valueKey="id" 
        titleKey="name" 
        allTitle="All Airlines" 
        value={airlineFilter} 
        onChange={(e) => handleFilterChange(setAirlineFilter, e)} 
      />
      <Select 
        options={airports} 
        valueKey="id" 
        titleKey="name" 
        allTitle="All Airports" 
        value={airportFilter}
        onChange={(e) => handleFilterChange(setAirportFilter, e)} 
      />

      <Table columns={columns} rows={filteredRoutes} formatValue={formatValue} page={page} perPage={perPage} />

      <p>{`Showing ${page * perPage + 1}-${page * perPage + perPage} of ${filteredRoutes.length} routes`}</p>

      <Button onClick={() => turnPage(-1)} variant="contained" color="secondary" style={{ marginRight: '16px' }}>Previous Page</Button>
      <Button onClick={() => turnPage(1)} variant="contained" color="primary" style={{ marginRight: '16px' }}>Next Page</Button>
      <Button onClick={clearFilters} variant="contained" color="primary">Clear Filters</Button>
    </section>
  </div>
  )
}

export default App;