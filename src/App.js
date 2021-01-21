import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core'
import './App.css';

import Table from './components/Table';
import data from './data'

const { routes, formatValue, airlines, getAirlineById } = data

const App = () => {
  const [page, setPage] = useState(0)
  const [airlineFilter, setAirlineFilter] = useState(false)
  // const [airportFilter, setAirportFilter] = useState(false)

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

  // if(airport)

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

  return(
    <div className="app">
    <header className="header">
      <h1 className="title">Airline Routes</h1>
    </header>
    <section>
      <select onChange={(e) => handleFilterChange(setAirlineFilter, e)} >
        <option value="all">All Airlines</option>
        { airlines.map( ({ name }) => <option key={name}>{name}</option>)}
      </select>
      <Table columns={columns} rows={filteredRoutes} formatValue={formatValue} page={page} perPage={perPage} />
      <p>{`Showing ${page * perPage + 1}-${page * perPage + perPage} of ${filteredRoutes.length} routes`}</p>
      <Button onClick={() => turnPage(-1)} variant="contained" color="secondary" style={{ marginRight: '15px' }}>Previous Page</Button>
      <Button onClick={() => turnPage(1)} variant="contained" color="primary">Next Page</Button>
    </section>
  </div>
  )
}

export default App;