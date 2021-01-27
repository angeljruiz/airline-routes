export function generateRoot(airlines, airports, routes) {
  const root = {};

  routes.forEach((route) => {
    const selectedAirline = airlines.find((airline) => airline.id === route.airline);
    const selectedSrc = airports.find((airport) => airport.code === route.src);
    const selectedDest = airports.find((airport) => airport.code === route.dest);

    if (!root[route.airline]) root[route.airline] = { routes: [], airports: {} };
    if (!root[route.src]) root[route.src] = { routes: [], airlines: {} };
    if (!root[route.dest]) root[route.dest] = { routes: [], airlines: {} };

    root[route.airline].airports[route.src] = 'src';
    root[route.airline].airports[route.dest] = 'dest';
    root[route.airline].name = selectedAirline.name;
    root[route.airline].routes.push({ src: route.src, dest: route.dest });

    root[route.src].airlines[route.airline] = { dest: route.dest };
    root[route.src].name = selectedSrc.name;
    root[route.src].lat = selectedSrc.lat;
    root[route.src].long = selectedSrc.long;
    root[route.src].routes.push({ airline: route.airline, dest: route.dest });

    root[route.dest].airlines[route.airline] = { src: route.src };
    root[route.dest].name = selectedDest.name;
    root[route.dest].lat = selectedDest.lat;
    root[route.dest].long = selectedDest.long;
    root[route.dest].routes.push({ airline: route.airline, src: route.src });
  });

  return root;
}

export function generateRoutes(root, routes, airlineFilter, airportFilter) {
  const generateRoute = (airline, src, dest) => ({
    airline,
    src,
    srcLat: root[src].lat,
    srcLong: root[src].long,
    dest,
    destLat: root[dest].lat,
    destLong: root[dest].long,
  });

  if (airlineFilter !== 'all' && airportFilter !== 'all') {
    return root[airlineFilter].routes.reduce((result, route) => {
      if (route.src === airportFilter || route.dest === airportFilter) result.push(generateRoute(Number(airlineFilter), route.src, route.dest));
      return result;
    }, []);
  } if (airlineFilter !== 'all') {
    return root[airlineFilter].routes.reduce((result, route) => {
      result.push(generateRoute(Number(airlineFilter), route.src, route.dest));
      return result;
    }, []);
  } if (airportFilter !== 'all') {
    return root[airportFilter].routes.reduce((result, route) => {
      if (route.src) result.push(generateRoute(route.airline, route.src, airportFilter));
      else result.push(generateRoute(route.airline, airportFilter, route.dest));
      return result;
    }, []);
  }
  return routes.map((route) => generateRoute(route.airline, route.src, route.dest));
}
