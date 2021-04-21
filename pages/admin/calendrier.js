import React, { useState } from "react";

import Admin from "layouts/Admin.js";

import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import MomentUtils from '@date-io/moment';

import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import TextField from '@material-ui/core/TextField';
import Danger from "components/Typography/Danger.js";


// core components
import { makeStyles } from "@material-ui/core/styles";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Box from '@material-ui/core/Box';

import { Calendar, momentLocalizer } from 'react-big-calendar'

import 'isomorphic-fetch';

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://banc2.vercel.app';

const localizer = momentLocalizer(moment)

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

function createDate(liste) {
  var listeDates = [];
  for (const dataPoint of liste) {
    listeDates = listeDates.concat([
      {
        'title': dataPoint.title + ' (' + dataPoint.nombre + ')',
        'start': moment(dataPoint.start, 'DD/MM/yyyy').toDate(),
        'end': moment(dataPoint.end, 'DD/MM/yyyy').toDate(),
        'valid': dataPoint.valid,
        'paye': dataPoint.paye
      }
    ]);
  }
  return listeDates;
}


function eventStyleGetter(event, start, end) {
    // console.log(event);
    var backgroundColor = 'DarkSeaGreen'
    if (!event.paye) {
      backgroundColor = 'LightSalmon'
    }
    if (!event.valid) {
      backgroundColor = 'LightCoral'
    }
    var style = {
        backgroundColor: backgroundColor,
    };
    return {
        style: style
    };
}

function Calendrier(props) {
    const classes = useStyles();
    const [reservations, updateReservations] = useState(props.reservations);

    // For rendering dates
    const myEventsList = createDate(reservations);

    // Form state
    const [selectedStartDate, setSelectedStartDate] = useState(moment(new Date()));
    const [selectedEndDate, setSelectedEndDate] = useState(moment(new Date()));
    const [reservationName, setReservationName] = useState('');
    const [numberPeople, setNumberPeople] = useState('');

    const [loading, setLoading] = useState(false);

    const addReservation = async () => {
      const newReservation = {
        title: reservationName,
        start: selectedStartDate.format("DD/MM/yyyy"),
        end: selectedEndDate.format("DD/MM/yyyy"),
        nombre: numberPeople,
        valid: false,
        paye: false
      };

      setLoading(true);

      // update
      const response = await fetch(`${server}/api/reservations`, {
        method: 'POST',
        body: JSON.stringify(newReservation)
      });

      const newresponse = await fetch(`${server}/api/reservations`);
      updateReservations(await newresponse.json());

      // reset
      setLoading(false);
      setSelectedStartDate(moment(new Date()));
      setSelectedEndDate(moment(new Date()));
      setNumberPeople('');
      setReservationName('');
    }

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardBody>
                <Calendar
                  localizer={localizer}
                  events={myEventsList}
                  defaultView='month'
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  eventPropGetter={eventStyleGetter}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>Créer une nouvelle réservation</h4>
              </CardHeader>
              <CardBody>
                Pour modifier ou supprimer une réservation, allez dans l'onglet Réservations.
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        format="DD/MM/yyyy"
                        margin="normal"
                        label="Date de début"
                        value={selectedStartDate}
                        onChange={date => setSelectedStartDate(date)}
                      />
                    </MuiPickersUtilsProvider>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        format="DD/MM/yyyy"
                        label="Date de fin"
                        margin="normal"
                        value={selectedEndDate}
                        onChange={date => setSelectedEndDate(date)}
                      />
                    </MuiPickersUtilsProvider>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <TextField
                      id="Nom"
                      label="Nom"
                      value={reservationName}
                      onInput={e => setReservationName(e.target.value)}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    type="number"
                    id="nbre"
                    label="Nombre personnes"
                    value={numberPeople}
                    onInput={e => setNumberPeople(e.target.value)}
                  />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button disabled={loading || reservationName==='' || numberPeople==='' || selectedEndDate<selectedStartDate} onClick={addReservation} color="info">{ loading ? 'En cours' : 'Confirmer' }</Button>
                <Box p={1}>
                  <Danger>
                    {(reservationName==='' || numberPeople==='' || selectedEndDate<selectedStartDate) ? 'Remplir tous les champs. Date de début après date de fin.' : ''}
                  </Danger>
                </Box>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
}

Calendrier.getInitialProps = async (ctx) => {
  const response = await fetch('http://localhost:3000/api/reservations');
  return {
    reservations: await response.json()
  };
}

Calendrier.layout = Admin;

export default Calendrier;
