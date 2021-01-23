import React from 'react';

export default function Select({
  options, onChange, allTitle, value,
}) {
  return (
    <select onChange={onChange} value={value}>
      <option value="all">{allTitle}</option>
      { options.map(({
        name, disabled, id, code,
      }) => <option key={name} disabled={disabled} value={id || code}>{name}</option>)}
    </select>
  );
}
