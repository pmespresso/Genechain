import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import routes from "../shared/routes";
var fs = require('fs-extra');
var assert = require('assert');

import App from "../shared/App";
import sourceMapSupport from "source-map-support";
var async = require('async');

const genomeLink = require('genomelink-node');
require('dotenv').config();
var promise = require('promise');
var session = require('express-session');

if (process.env.NODE_ENV === "development") {
  sourceMapSupport.install();
}

/* Define the app */
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(session({
  secret: 'YOURSECRET',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var report_scopes = require('./scopes').report_scopes;
const scope = report_scopes.slice(0, 20).join(' ');



/* Endpoints */
app.get("/", (req, res, next) => {
  console.log("req session (root) -> ", req.session);

    const markup = renderToString(
      <StaticRouter location={req.url} context={{}}>
        <App />
      </StaticRouter>
    );

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>W Combinator</title>
        <link rel="stylesheet" href="/css/main.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <script src="/bundle.js" defer></script>
        <script> window.__genes__ = ${serialize(req.session.gene_reports)}  </script>
      </head>

      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
    `);
});

var separator = function() {
  return console.log('================================');
};

var GENE_API_BASE = 'https://genomelink.io';

app.get('/authorize', cors(), async function(req, res) {
  separator();

  var result = {}

  // console.log(req.session.oauthToken);

  if (req.session.oauthToken) {
    result.err = "already authenticated";
    res.send(result);
  }

  const url = GENE_API_BASE + `/oauth/authorize?redirect_uri=${process.env.GENOMELINK_CALLBACK_URL}&client_id=${process.env.GENOMELINK_CLIENT_ID}&scope=${scope}&response_type=code`;

  result.url = url;
  res.json([result]); // have the client manually set window.location for CORS

});

app.get('/callback', function(req, res) {
  genomeLink.OAuth.token({ requestUrl: req.url }).then(function(token) {
    req.session.oauthToken = token;
    req.session.save(function(err) {
      if (err) {
        console.err(err);
      }
      console.log('req session (callback) -> ', req.session);

      res.redirect('/reports');
    });
  });
});


app.get('/reports', async function(req, res) {

  console.log('req session (reports) -> ', req.session);
  console.log('scope -> ', scope.split(' '));
  console.log(req.session.oauthToken);

  var reports = [];

  if (req.session.oauthToken) {
    console.log('hello!');
    reports = await Promise.all(scope.split(' ').map( async (name) => {
      return await genomeLink.Report.fetch({
        name: name.replace(/report:/g, ''),
        population: 'european',
        token: req.session.oauthToken
      });
    }));
    req.session.gene_reports = await reports;
    // console.log(await reports);
    console.log(req.session);

    req.session.save((err) => {
      if (err) {
        console.log('error with saving, ', err);
      }

      res.redirect('/');
    });

  } else {
    console.log('you need to connect your genome first!');
  }
});

app.post('/save', async function(req, res) {
  assert(req.body, "req.body null/undefined");

  // console.log('server POST body -> ', JSON.stringify(req.body));
  try {
    await fs.writeJSON('genes.txt', JSON.stringify(req.body))
      .then(() => {
          res.download('genes.txt');
          console.log("file successfully created -> ", __dirname);
      })
      .catch((err) => {
        console.log('err in write -> ', err);
      });
  } catch (err) {
    console.error('err outside -> ', err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening");
});
