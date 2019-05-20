import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import Overview from './views/Overview';
import Devices from './views/Devices';
import DeviceDetails from './views/DeviceDetails';

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/overview" />
  },
  {
    path: "/overview",
    layout: DefaultLayout,
    component: Overview,
    exact: true
  },
  {
    path: "/devices",
    layout: DefaultLayout,
    component: Devices,
    exact: true
  },
  {
    path: "/devices/:id",
    layout: DefaultLayout,
    component: DeviceDetails,
    exact: true
  }
];
