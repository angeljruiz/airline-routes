import React, { Component } from 'react';
import './App.css';

import data from './data'

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
        { data.routes.map( route => (<>
          <tr>
            <td>{route.airline}</td>
            <td>{route.src}</td>
            <td>{route.dest}</td>
          </tr>
        </>))}
      </thead>
    </table>
  </section>
</div>
)

export default App;