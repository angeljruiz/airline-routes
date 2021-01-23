import React, { useCallback, useEffect, useState } from 'react';
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
  const [root] = useState(generateRoot());
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [airportFilter, setAirportFilter] = useState('all');
  const [filteredRoutes, setFilteredRoutes] = useState(routes);
  const [filteredAirlines, setFilteredAirlines] = useState(airlines);
  const [filteredAirports, setFilteredAirports] = useState(airports);

  const perPage = 50;
  const maxPage = Math.ceil(routes.length / perPage);
  const columns = [
    { name: 'Airline', property: 'airline' },
    { name: 'Source Airport', property: 'src' },
    { name: 'Destination Airport', property: 'dest' },
  ];

  const generateRoutes = useCallback( () => {
    const generateRoute = (airline, src, dest) => ({
      airline: airline, 
      src: src, 
      srcLat: root[src].lat, 
      srcLong: root[src].long, 
      dest: dest,
      destLat: root[dest].lat,
      destLong: root[dest].long
    });

    if (airlineFilter !== 'all' && airportFilter !== 'all') {
      return root[airlineFilter].routes.reduce( (result, route) => {
        if (route.src === airportFilter || route.dest === airportFilter)
          result.push(generateRoute(Number(airlineFilter), route.src, route.dest))
        return result
      }, [] )
    } else if (airlineFilter !== 'all') {
      return root[airlineFilter].routes.reduce( (result, route) => {
        result.push(generateRoute(Number(airlineFilter), route.src, route.dest))
        return result
      }, [] )
    } else if (airportFilter !== 'all') {
      return root[airportFilter].routes.reduce( (result, route) => {
        if (route.src)
          result.push(generateRoute(route.airline, route.src, airportFilter))
        else
          result.push(generateRoute(route.airline, airportFilter, route.dest))
        return result
      }, [] )
    } else {
      return routes.map( route => generateRoute(route.airline, route.src, route.dest))
    }
  }, [airlineFilter, airportFilter, root])

  useEffect( () => setFilteredRoutes(generateRoutes()), [generateRoutes])

  function generateRoot() {
    const root = {};

    routes.forEach((route) => {
      const selectedAirline = airlines.find((airline) => airline.id === route.airline);
      const selectedSrc = airports.find((airport) => airport.code === route.src);
      const selectedDest = airports.find((airport) => airport.code === route.dest);

      if (!root[route.airline]) root[route.airline] = { routes: [], airports: {} };
      if (!root[route.src]) root[route.src] = { routes: [], airlines: {} };
      if (!root[route.dest]) root[route.dest] = { routes: [], airlines: {} };

      root[route.airline].airports[route.src] = 'src'
      root[route.airline].airports[route.dest] = 'dest'
      root[route.airline].name = selectedAirline.name;
      root[route.airline].routes.push({ src: route.src, dest: route.dest})

      root[route.src].airlines[route.airline] = { dest: route.dest }
      root[route.src].name = selectedSrc.name;
      root[route.src].lat = selectedSrc.lat;
      root[route.src].long = selectedSrc.long;
      root[route.src].routes.push({ airline: route.airline, dest: route.dest })

      root[route.dest].airlines[route.airline] = { src: route.src}
      root[route.dest].name = selectedDest.name;
      root[route.dest].lat = selectedDest.lat;
      root[route.dest].long = selectedDest.long;
      root[route.dest].routes.push({ airline: route.airline, src: route.src });
    });

    return root;
  }

  function disable(obj, disabled) {
    const temp = { ...obj };
    temp.disabled = disabled
    return temp;
  }

  function turnPage(flips) {
    setPage(page + flips);
  }

  function handleAirlineChange({ target: { value } }) {
    setAirlineFilter(value);

    if (value === 'all') {
      if (airportFilter === 'all') {
        resetFilters()
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
    
    if (value === 'all') {
      if (airlineFilter === 'all') {
        resetFilters()
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

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Airline Routes</h1>
      </header>
      <section>
        <Map routes={filteredRoutes} />
        <br />
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
        <button onClick={clearFilters} variant="contained" color="primary">Clear Filters</button>

        <br />
        <br />
        <Table columns={columns} rows={filteredRoutes} formatValue={formatValue} page={page} perPage={perPage} />
        
        <button disabled={page < 1} onClick={() => turnPage(-1)} variant="contained" color="secondary" style={{ marginRight: '16px' }}>Previous Page</button>
        <button disabled={page + 2 > maxPage} onClick={() => turnPage(1)} variant="contained" color="primary" style={{ marginRight: '16px' }}>Next Page</button>

        <br />
        <br />
      </section>
    </div>
  );
};

export default App;
