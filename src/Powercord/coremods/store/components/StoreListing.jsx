/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { React } = require('powerCord/webpack');

const Layout = require('./StoreWrapper');

module.exports = React.memo(
  ({ type }) => (
    <Layout catchLine={`Find some neat ${type} to spice up your experience`} placeholder={`Search ${type}`}>

    </Layout>
  )
);
