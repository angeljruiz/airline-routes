import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import './App.css';

import Map from './components/Map';
import Table from './components/Table';
import Select from './components/Select';

import data from './data';

const {
  routes, formatValue, airlines, airports
} = data;

const App = () => {
  const [page, setPage] = useState(0);
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [airportFilter, setAirportFilter] = useState('all');
  const [filteredAirlines, setFilteredAirlines] = useState(airlines);
  const [filteredAirports, setFilteredAirports] = useState(airports);

  let filteredRoutes = routes

  const perPage = 50;
  const router = generateRouteStructure();
  const maxPage = Math.ceil(routes.length / perPage);
  const columns = [
    { name: 'Airline', property: 'airline' },
    { name: 'Source Airport', property: 'src' },
    { name: 'Destination Airport', property: 'dest' },
  ];

  if (airlineFilter !== 'all') {
    filteredRoutes = filteredRoutes.filter((route) => route.airline === Number(airlineFilter));
  }
  if (airportFilter !== 'all') {
    filteredRoutes = filteredRoutes.filter((route) => route.src === airportFilter || route.dest === airportFilter);
  }

  filteredRoutes = filteredRoutes.map( route => ({
    ...route,
    srcLat: router[route.src].lat,
    srcLong: router[route.src].long,
    destLat: router[route.dest].lat,
    destLong: router[route.dest].long,
  }))

  function generateRouteStructure() {
    const router = {};

    routes.forEach((route) => {
      const selectedAirline = airlines.find((airline) => airline.id === route.airline);
      const selectedSrc = airports.find((airport) => airport.code === route.src);
      const selectedDest = airports.find((airport) => airport.code === route.dest);

      if (!router[route.airline]) router[route.airline] = {};
      if (!router[route.src]) router[route.src] = {};
      if (!router[route.dest]) router[route.dest] = {};

      router[route.airline][route.src] = true;
      router[route.airline][route.dest] = true;
      router[route.airline].name = selectedAirline.name;

      router[route.src][route.airline] = true;
      router[route.src].name = selectedSrc.name;
      router[route.src].lat = selectedSrc.lat;
      router[route.src].long = selectedSrc.long;

      router[route.dest][route.airline] = true;
      router[route.dest].name = selectedDest.name;
      router[route.dest].lat = selectedDest.lat;
      router[route.dest].long = selectedDest.long;
    });

    return router;
  }

  function turnPage(flips) {
    if (page + flips >= 0 && page + flips < maxPage) setPage(page + flips);
  }

  function handleAirlineChange({ target: { value } }) {
    setAirlineFilter(value);

    if (value === 'all') {
      if (airportFilter === 'all') {
        setFilteredAirlines(airlines);
        setFilteredAirports(airports);
      } else {
        setFilteredAirlines(airlines.map((airline) => {
          const temp = { ...airline };
          temp.disabled = !router[airportFilter][airline.id];
          return temp;
        }));
      }
      return;
    }

    setFilteredAirlines(airlines.map((airline) => {
      const temp = { ...airline };
      temp.disabled = airline.id !== Number(value);
      return temp;
    }));

    if (airportFilter === 'all') {
      setFilteredAirports(airports.map((airport) => {
        const temp = { ...airport };
        temp.disabled = !router[value][airport.code];
        return temp;
      }));
    }
  }

  function handleAirportChange({ target: { value } }) {
    setAirportFilter(value);

    if (value === 'all') {
      if (airlineFilter === 'all') {
        setFilteredAirlines(airlines);
        setFilteredAirports(airports);
      } else {
        setFilteredAirports(airports.map((airport) => {
          const temp = { ...airport };
          temp.disabled = !router[airlineFilter][airport.code];
          return temp;
        }));
      }
      return;
    }

    setFilteredAirports(airports.map((airport) => {
      const temp = { ...airport };
      temp.disabled = airport.code !== value;
      return temp;
    }));

    if (airlineFilter === 'all') {
      setFilteredAirlines(airlines.map((airline) => {
        const temp = { ...airline };
        temp.disabled = !router[value][airline.id];
        return temp;
      }));
    }
  }

  function clearFilters() {
    setAirportFilter('all');
    setAirlineFilter('all');
    setFilteredAirlines(airlines);
    setFilteredAirports(airports);
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Airline Routes</h1>
      </header>
      <section>
        <Map routes={filteredRoutes} />

        <Select
          options={filteredAirlines}
          valueKey="id"
          titleKey="name"
          allTitle="All Airlines"
          value={airlineFilter}
          onChange={handleAirlineChange}
        />
        <Select
          options={filteredAirports}
          valueKey="id"
          titleKey="name"
          allTitle="All Airports"
          value={airportFilter}
          onChange={handleAirportChange}
        />

        <Table columns={columns} rows={filteredRoutes} formatValue={formatValue} page={page} perPage={perPage} />

        <Button onClick={() => turnPage(-1)} variant="contained" color="secondary" style={{ marginRight: '16px' }}>Previous Page</Button>
        <Button onClick={() => turnPage(1)} variant="contained" color="primary" style={{ marginRight: '16px' }}>Next Page</Button>
        <Button onClick={clearFilters} variant="contained" color="primary">Clear Filters</Button>
      </section>
    </div>
  );
};

export default App;
