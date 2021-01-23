import React from 'react';

export default function Map({ routes }) {
  return (
    <svg className="map" viewBox="-180 -90 360 180">
      <g transform="scale(1 -1)">
        <image xlinkHref="equirectangular_world.jpg" href="equirectangular_world.jpg" x="-180" y="-90" height="100%" width="100%" transform="scale(1 -1)" />

        {routes.map( (route, i) => (
          <g key={i}>
            <circle className="source" cx={route.srcLong} cy={route.srcLat}>
              <title></title>
            </circle>
            <circle className="destination" cx={route.destLong} cy={route.destLat}>
              <title></title>
            </circle>
            <path d={`M${route.srcLong} ${route.srcLat} L ${route.destLong} ${route.destLat}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
