import React, { Component } from 'react';
import './App.css';

import data from './data'

const { routes, getAirlineById, getAirportByCode } = data

console.log(getAirlineById(2143));

const App = () => (
  <div className="app">
  <header className="header">
    <h1 className="title">Airline Routes</h1>
  </header>
  <section>
    <p>
      Welcome to the app!
    </p>
    <table>
      <thead>
        <tr>
          <th>Airline</th>
          <th>Source</th>
          <th>Destination</th>
        </tr>
        { routes.map( route => (<>
          <tr>
            <td>{getAirlineById(route.airline)}</td>
            <td>{getAirportByCode(route.src)}</td>
            <td>{getAirportByCode(route.dest)}</td>
          </tr>
        </>))}
      </thead>
    </table>
  </section>
</div>
)

export default App;