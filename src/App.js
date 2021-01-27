import React, { useState } from 'react';
import './App.css';

import Map from './components/Map';
import Table from './components/Table';
import Select from './components/Select';

import { generateRoot, generateRoutes } from './modules/flatMapper';

import data from './data';

const {
  routes, formatValue, airlines, airports,
} = data;

const root = generateRoot(airlines, airports, routes);

const App = () => {
  const [page, setPage] = useState(0);
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [airportFilter, setAirportFilter] = useState('all');
  const [filteredAirlines, setFilteredAirlines] = useState(airlines);
  const [filteredAirports, setFilteredAirports] = useState(airports);

  const columns = [
    { name: 'Airline', property: 'airline' },
    { name: 'Source Airport', property: 'src' },
    { name: 'Destination Airport', property: 'dest' },
  ];

  const perPage = 50;
  const filteredRoutes = generateRoutes(root, routes, airlineFilter, airportFilter);
  const maxPage = Math.ceil(filteredRoutes.length / perPage);

  function disable(obj, disabled) {
    const temp = { ...obj };
    temp.disabled = disabled;
    return temp;
  }

  function turnPage(flips) {
    setPage(page + flips);
  }

  function resetFilters() {
    setFilteredAirlines(airlines);
    setFilteredAirports(airports);
  }

  function clearFilters() {
    setPage(0);
    setAirportFilter('all');
    setAirlineFilter('all');
    resetFilters();
  }

  function handleAirlineChange({ target: { value } }) {
    setAirlineFilter(value);
    setPage(0);

    if (value === 'all') {
      if (airportFilter === 'all') {
        resetFilters();
      } else {
        setFilteredAirlines(airlines.map((airline) => disable(airline, !root[airportFilter].airlines[airline.id])));
      }
      return;
    }

    setFilteredAirlines(airlines.map((airline) => disable(airline, airline.id !== Number(value))));

    if (airportFilter === 'all') {
      setFilteredAirports(airports.map((airport) => disable(airport, !root[value].airports[airport.code])));
    }
  }

  function handleAirportChange({ target: { value } }) {
    setAirportFilter(value);
    setPage(0);

    if (value === 'all') {
      if (airlineFilter === 'all') {
        resetFilters();
      } else {
        setFilteredAirports(airports.map((airport) => disable(airport, !root[airlineFilter].airports[airport.code])));
      }
      return;
    }

    setFilteredAirports(airports.map((airport) => disable(airport, airport.code !== value)));

    if (airlineFilter === 'all') {
      setFilteredAirlines(airlines.map((airline) => disable(airline, !root[value].airlines[airline.id])));
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Airline Routes</h1>
      </header>
      <section>
        <Map routes={filteredRoutes} />

        <br />
        Show routes flying out of
        <Select
          options={filteredAirlines}
          valueKey="id"
          titleKey="name"
          allTitle="All Airlines"
          value={airlineFilter}
          onChange={handleAirlineChange}
        />
        flying in or out of
        <Select
          options={filteredAirports}
          valueKey="id"
          titleKey="name"
          allTitle="All Airports"
          value={airportFilter}
          onChange={handleAirportChange}
        />
        <button type="button" onClick={clearFilters} variant="contained" color="primary">All routes</button>

        <Table columns={columns} rows={filteredRoutes} formatValue={formatValue} page={page} perPage={perPage} />

        <button type="button" disabled={page < 1} onClick={() => turnPage(-1)} variant="contained" color="secondary" style={{ marginRight: '16px' }}>Previous Page</button>
        <button type="button" disabled={page + 2 > maxPage} onClick={() => turnPage(1)} variant="contained" color="primary" style={{ marginRight: '16px' }}>Next Page</button>
      </section>
    </div>
  );
};

export default App;
