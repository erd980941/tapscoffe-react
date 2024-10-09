import React from 'react'
import { getTableById } from '../../../../services/tableService';

const TableDetailsPage = async ({params}) => {
  const table = await  getTableById(params.id);
  return (
    <div><h1>{table.name}</h1></div>
  )
}

export default TableDetailsPage