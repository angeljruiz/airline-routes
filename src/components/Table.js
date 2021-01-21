import React from 'react'

export default function Table({ columns, rows, formatValue, page, perPage }) {
  const pageRows = rows.slice(page * perPage, page * perPage + perPage)

  return (
    <table>
      <thead>
        <tr>
          { columns.map( col => (
            <th key={col.name}>
              {col.name}
            </th>
          ))}
        </tr>
        { pageRows.map( row  => (
          <tr key={JSON.stringify(row)}>
            { columns.map( col => 
              <td key={col.property}>
                {formatValue(col.property, row[col.property])}
              </td>
            )}
          </tr>
          ))}
      </thead>
    </table>
  )
}