import React, { useState } from "react";
import MaterialTable from 'material-table';
import Admin from "layouts/Admin.js";

import Checkbox from '@material-ui/core/Checkbox';

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

const today = moment(new Date())

const table_columns = [
  {
    title: 'Nom', field: 'title',
    initialEditValue: 'Nom',
    validate: rowData => rowData.title === '' ? { isValid: false, helperText: 'Rentrez un nom.' } : true,
  },
  {
    title: 'Date de début', field: 'start',
    initialEditValue: today.format("DD/MM/yyyy"),
    editComponent: ({value, onChange}) => (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          format="DD/MM/yyyy"
          value={moment(value, 'DD/MM/yyyy')}
          onChange={date => onChange(date.format('DD/MM/yyyy'))}
        />
      </MuiPickersUtilsProvider>
    )
  },
  {
    title: "Date de fin", field: 'end',
    initialEditValue: today.format("DD/MM/yyyy"),
    validate: rowData => rowData.start > rowData.end ? { isValid: false, helperText: 'La date de fin doit etre après celle darrivée' } : true,
    editComponent: ({value, onChange}) => (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          format="DD/MM/yyyy"
          value={moment(value, 'DD/MM/yyyy')}
          onChange={date => onChange(date.format('DD/MM/yyyy'))}
        />
      </MuiPickersUtilsProvider>
    )
  },
  {
    title: "Nombre de personnes", field: 'nombre',
    type: 'numeric',
    initialEditValue: 1,
    validate: rowData => rowData.nombre > 0 ? true : {isValid: false, helperText: 'Rentrez un nombre.' },
  },
  {
    title: "Validé", field: 'valid',
    initialEditValue: false,
    render: rowData => (
      <Checkbox
        disabled
        checked={rowData.valid}
        onChange={e => {}}
      />
    ),
    editComponent: ({value, onChange}) => (
      <Checkbox
      checked={value}
      onChange={e => onChange(e.target.checked)}
      color="default"
    />
    )
  },
  {
    title: "Payé", field: 'paye',
    initialEditValue: false,
    render: rowData => (
      <Checkbox
        disabled
        checked={rowData.paye}
        onChange={e => {}}
      />
    ),
    editComponent: ({value, onChange}) => (
      <Checkbox
      checked={value}
      onChange={e => onChange(e.target.checked)}
      color="default"
    />
    )
  },
];

function Reservations(props) {

  const [reservations, updateReservations] = useState(props.reservations);

  return (
    <MaterialTable
      title="Liste des réservations"
      views={['month']}
      columns={table_columns}
      data={reservations}
      options={{
        draggable: false,
      }}
      editable={{
        onRowAdd: async newReservation => {
          const response = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            body: JSON.stringify([newReservation, ...reservations])
          });
          updateReservations(await response.json());
        },
        onRowUpdate: async (newReservation, oldData) => {
          const data = [...reservations];
          data[data.indexOf(oldData)] = newReservation;
          // console.log(data);
          const response = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            body: JSON.stringify(data)
          });
          updateReservations(await response.json());
        },
        onRowDelete: async oldData => {
          console.log(oldData);
          const data = [...reservations];
          data.splice(data.indexOf(oldData), 1);
          const response = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            body: JSON.stringify(data)
          });
          updateReservations(await response.json());
        }
      }}
    />
  );
}

Reservations.getInitialProps = async (ctx) => {
  const response = await fetch('http://localhost:3000/api/reservations');
  return {
    reservations: await response.json()
  };
}

Reservations.layout = Admin;

export default Reservations;
