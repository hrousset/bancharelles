/*!

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import EventIcon from '@material-ui/icons/Event';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SecurityIcon from '@material-ui/icons/Security';
import AnnouncementIcon from '@material-ui/icons/Announcement';

const dashboardRoutes = [
  {
    path: "/calendrier",
    name: "Calendrier",
    icon: EventIcon,

    layout: "/admin",
  },
  {
    path: "/reservations",
    name: "Réservations",
    icon: EventAvailableIcon,

    layout: "/admin",
  },
  {
    path: "/news",
    name: "Nouvelles",
    icon: AnnouncementIcon,

    layout: "/admin",
  },
  {
    path: "/login",
    name: "Validation",
    icon: SecurityIcon,

    layout: "/admin",
  },
];

export default dashboardRoutes;
