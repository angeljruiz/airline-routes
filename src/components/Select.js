import React from 'react'

export default function Select({ options, onChange, allTitle, value}) {
  return (
    <select onChange={onChange} value={value}>
      <option value="all">{allTitle}</option>
      { options.map( ({ name }) => <option key={name}>{name}</option>)}
    </select>
  )
}