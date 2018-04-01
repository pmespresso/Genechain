/******************************************************************************************* */

// Third Party Libraries
import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import routes from "../shared/routes";
import fs from 'fs-extra';
import assert from 'assert';
import promise from 'promise';
var session = require('express-session');
require('dotenv').config();

/******************************************************************************************* */

// GenomeLink
const genomeLink = require('genomelink-node');
var GENE_API_BASE = 'https://genomelink.io';

//Storj
import storj from 'storj-lib';
import storj_utils from 'storj-lib/lib/utils';
var api = 'https://api.storj.io';
var client;
var KEYRING_PASS = 'somepassword';
var keyring = storj.KeyRing('./');

// Storj variables
var STORJ_EMAIL = process.env.STORJ_EMAIL;
var STORJ_PASSWORD = process.env.STORJ_PASSWORD;

var storjCredentials = {
  email: STORJ_EMAIL,
  password: STORJ_PASSWORD
};

/* ****************************************************************************************** */

// Components
import App from "../shared/App";
import sourceMapSupport from "source-map-support";
var async = require('async');

/******************************************************************************************* */

if (process.env.NODE_ENV === "development") {
  sourceMapSupport.install();
}

/**********************************EXPRESS MIDDLEWARE********************************** */

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

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


/**********************************HACKY GLOBAL VARIABLES********************************** */

var report_scopes = require('./scopes').report_scopes;
const scope = report_scopes.slice(0, 20).join(' ');

var separator = function() {
  return console.log('================================');
};

/**********************************ENDPOINTS********************************** */
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
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
        <script src="./bundle.js" defer></script>
        <script> window.__genes__ = ${serialize(req.session.gene_reports)}  </script>
      </head>

      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
    `);
});

/**********************************GENELINK********************************** */

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

/**********************************STORJ********************************** */

/**
 * Simple endpoint to make sure your STORJ_EMAIL and STORJ_PASSWORD environment
 * variables are on your .env file
 */
app.get('/user/retrieve', function(req, res) {
  separator();
  console.log('Retrieving basic auth credentials...');
  res.status(200).send(storjCredentials);
});

app.get('/user/authenticate/user-pass', function(req, res) {
  separator();
  console.log('Attempting to log in with basic auth...');
  if (!STORJ_EMAIL || !STORJ_PASSWORD) {
    return res.status(400).send('No credentials. Make sure you have a .env file with KEY=VALUE pairs')
  }
  client = storj.BridgeClient(api, { basicAuth: storjCredentials });
  console.log('Logged in with basic auth');
  res.status(200).send('successful');
});

/**
//  * Creates a bucket on your Storj account
//  */
app.post('/buckets/create', function(req, res) {
  separator();
  // Settings for bucket
  var bucketInfo = {
    name: req.body.name
  };

  // Create bucket
  console.log('Creating bucket ', req.body.name, '...');
  client.createBucket(bucketInfo, function(err, bucket) {
    if (err) {
      return console.log('error', err.message);
    }
    console.log(bucket, ' created!');
    res.status(200).send(bucket);
  });
});

// /**
//  * Lists all buckets on your account
//  */
app.get('/buckets/list', function(req, res) {
  separator();
  console.log('Getting buckets...')
  client.getBuckets(function(err, buckets) {
    if (err) {
      return console.log('error', err.message);
    }
    console.log('Retrieved buckets', buckets);
    res.status(200).send(buckets);
  });
});

app.post('/reports/save', function(req, res) {
  console.log('req.body -> ', req.body);
  if (req.body) {
    let reports = req.body;

    // write reports to a file
    fs.writeFile('./genes.json', reports, (err) => {
      if (err) {
        console.log('error => ', err);
      } else {
        console.log('file has been saved');
        res.status(200).send();
      }
    });
  }
});

//
// /**
//  * Uploads a file to a bucket. For simplicity, the file and bucket are
//  * predetermined and hardcoded. The basic steps of uploading a file are:
//  * 1. Decide what bucket and file you're going to upload.
//  *   a. Retrieve ID of bucket
//  *   b. Retrieve path to file
//  *   c. Retrieve name of file
//  * 2. Create a filekey based on your user name, bucketId, and filename - these
//  *    variables are then taken and combined with your keyring mnemonic to
//  *    generate a deterministic key to encrypt the file.
//  * 3. Create a temporary path to store the encrypted file (remember, files
//  *    should be encrypted before they are uploaded)
//  * 4. Instantiate encrypter
//  * 5. Encrypt the file by creating a stream, piping the contents of the stream
//  *    through your encrypter, and then taking the result and writing it to
//  *    the temporary path determined in step 3
//  * 6. Create a token for uploading the file to the bucket
//  * 7. Store file in bucket
//  * 8. Bonus points: Clean up your encrypted file that you made
//  *
//  * Note: We didn't do this check here, but you could also check to make sure
//  * that the file name doesn't already exist in the bucket. Currently this will
//  * just overwrite any file with the same name.
//  */
app.get('/files/upload', function(req, res) {
  separator();
  console.log('Retrieving buckets...')
  // Step 1
  client.getBuckets(function(err, buckets) {
    if (err) {
      return console.error(err.message);
    }

    // Step 1a) Use the first bucket
    var bucketId = buckets[0].id;
    console.log('Uploading file to: ', bucketId);

    // Step 1b) Path of file

    var filepath = './public/genes.json';
    console.log('Path of file: ', filepath);

    // Step 1c) Name of file
    var filename = 'genes.json';
    console.log('Name of file: ', filename);

    // Step 2) Create a filekey with username, bucketId, and filename
    var filekey = getFileKey(STORJ_EMAIL, bucketId, filename);

    // Step 3) Create a temporary path to store the encrypted file
    var tmppath = filepath + '.crypt';

    // Step 4) Instantiate encrypter
    var encrypter = new storj.EncryptStream(filekey);

    // Step 5) Encrypt file
    fs.createReadStream(filepath)
      .pipe(encrypter)
      .pipe(fs.createWriteStream(tmppath))
      .on('finish', function() {
        console.log('Finished encrypting');

        // Step 6) Create token for uploading to bucket by bucketId
        client.createToken(bucketId, 'PUSH', function(err, token) {
          if (err) {
            console.log('error', err.message);
          }
          console.log('Created token', token.token);

          // Step 7) Store the file
          console.log('Storing file in bucket...');
          client.storeFileInBucket(bucketId, token.token, tmppath,
            function(err, file) {
              if (err) {
                return console.log('error', err.message);
              }
              console.log('Stored file in bucket');
              // Step 8) Clean up and delete tmp encrypted file
              console.log('Cleaning up and deleting temporary encrypted file...');
              fs.unlink(tmppath, function(err) {
                if (err) {
                  return console.log(err);
                }
                console.log('Temporary encrypted file deleted');
              });

              console.log(`File ${filename} successfully uploaded to ${bucketId}`);
              res.status(200).send(file);
            });
        });
      });
  });
});

// /**
//  * Lists all files in buckets
//  */
app.get('/files/list', function(req, res) {
  separator();
  // Create object to hold all the buckets and files
  var bucketFiles = {};

  // Get buckets
  console.log('Getting buckets...')
  client.getBuckets(function(err, buckets) {
    if (err) {
      return console.log('error', err.message);
    }

    // Get all the buckets, and then return the files in the bucket
    // Assign files to bucketFiles
    async.each(buckets, function(bucket, callback) {
      console.log('bucket', bucket.id);
      client.listFilesInBucket(bucket.id, function(err, files) {
        if (err) {
          return callback(err);
        }
        // bucketFiles.myPictureBucket = [];
        bucketFiles[bucket.name] = files;
        callback(null);
      })
    }, function(err) {
      if (err) {
        return console.log('error');
      }
      console.log('bucketFiles retrieved: ', bucketFiles);
      res.status(200).send(bucketFiles);
    });
  });
});

// /**
//  * Downloads a file from bucket. For simplicity, file and bucket are
//  * predetermined and hardcoded. The steps to download a bucket are more or less
//  * the inverse of uploading a file
//  * 1. Decide what bucket and file you're going to download
//  *    a. Retrieve ID of bucket
//  *    b. Retrieve ID of file
//  * 2. Create a filekey based on the user name, bucketId, and filename. As long
//  *    as your followed this same process when uploading the file, you'll be
//  *    able to download the file the same way. What you're doing is recreating
//  *    the deterministic key that will allow you to decrypt the file. The reason
//  *    why someone else can't generate this file key is because of the mnemonic *    on your key ring. As long as you keep this secure, your file is secure.
//  *    If you wanted to be able to allow this file to be downloaded by multiple
//  *    devices or people, you can export the mnemonic and import it onto another
//  *    keyring
//  * 3. Decide where you want to download the file
//  * 4. Instantiate decrypter
//  * 5. Download the file: Create file stream to get all your file shards, take
//  *    those chunks as they come in and pipe them through the decrypter and then
//  *    to your target file
//  */
app.get('/files/download', function(req, res) {
  separator();
  // Step 1) Decide what file you're download
  client.getBuckets(function(err, buckets) {
    if (err) {
      return console.log('error', err.message);
    }

    // Step 1a) Retrieve ID of bucket
    var bucketId = buckets[0].id;
    console.log('Got bucketId', bucketId);

    // Step 1b) Get the fileId of the file we want to download.
    client.listFilesInBucket(bucketId, function(err, files) {
      if (err) {
        return console.log('error', err.message);
      }

      // Get grumpy file
      var grumpyFile = files.find(function(file) {
        return file.filename.match(filename);
      });
      // Step 1b)
      var fileId = grumpyFile.id;
      var filename = 'genes.json'
      // Note: make sure the filename here is the same as when you generated
      // the filename when you uploaded. Because the filekey was generated
      // using the filename, they MUST match, otherwise the key will not be
      // the same and you cannot download the file

      // Step 2) Create filekey
      var filekey = getFileKey(STORJ_EMAIL, bucketId, filename);

      // Step 3) Decide where the downloaded file will be saved
      var target = fs.createWriteStream('./public/genes-dwnld.json');

      // Step 4) Instantiate decrypter
      var decrypter = new storj.DecryptStream(filekey);

      var received = 0;

      // Step 5) Download the file
      console.log('Creating file stream...');
      client.createFileStream(bucketId, fileId, { exclude: [] },
      function(err, stream) {
        if (err) {
          return console.log('error', err.message);
        }

        // Handle stream errors
        stream.on('error', function(err) {
          console.log('warn', 'Failed to download shard, reason: %s', [err.message]);
          // Delete the partial file if there's a failure
          fs.unlink(filepath, function(unlinkFailed) {
            if (unlinkFailed) {
              return console.log('error', 'Failed to unlink partial file.');
            }
            if (!err.pointer) {
              return;
            }
          });
        }).pipe(through(function(chunk) {
          received += chunk.length;
          console.log('info', 'Received %s of %s bytes', [received, stream._length]);
          this.queue(chunk);
        })).pipe(decrypter)
          .pipe(target);
      });

      // Handle events emitted from file download stream
      target.on('finish', function() {
        console.log('Finished downloading file!');
        res.status(200).send('successful')
      }).on('error', function(err) {
        console.log('error', err.message);
      });
    });
  });
});

/**
 * Deterministically generates filekey to upload/download file based on
 * mnemonic stored on keyring. This means you only need to have the mnemonic
 * in order to upload/download on different devices. Think of the mnemonic like
 * an API key i.e. keep it secret! keep it safe!
 */
function getFileKey(user, bucketId, filename) {
  console.log('Generating filekey...')
  generateMnemonic();
  var realBucketId = storj_utils.calculateBucketId(user, bucketId);
  var realFileId = storj_utils.calculateFileId(bucketId, filename);
  var filekey = keyring.generateFileKey(realBucketId, realFileId);
  console.log('Filekey generated!');
  return filekey;
}


/**
 * This generates a mnemonic that is used to create deterministic keys to
 * upload and download buckets and files.
 * This puts the mnemonic on your keyring (only one mnemonic is held per
 * keyring) and also writes the mnemonic to your local .env file.
 */
function generateMnemonic() {
  console.log('Attempting to retrieve mnemonic');
  var mnemonic = keyring.exportMnemonic();
  var newMnemonic;

  if (mnemonic) {
    console.log('Mnemonic already exists', mnemonic);
  } else {
    console.log('Mnemonic doesn\'t exist or new keyring');
    try {
      keyring.importMnemonic(process.env.STORJ_MNEMONIC);
    } catch(err) {
      console.log('process.env.STORJ_MNEONIC', err);
      try {
        keyring.importMnemonic(keyring.generateDeterministicKey());
      } catch(err) {
        console.log('generateDeterministicKey', err);
      }
    }
  }

  console.log('Mnemonic successfully retrieved/generated and imported');
  if (!process.env.STORJ_MNEMONIC) {
    console.log('Mnemonic not saved to env vars. Saving...');
    // Write mnemonic to .env file
    fs.appendFileSync('./.env', `STORJ_MNEMONIC="${mnemonic || newMnemonic}"`);
    console.log('Mnemonic written to .env file. Make sure to add this to heroku config variables with \'heroku config:set STORJ_MNEMONIC="<VALUE FROM .ENV FILE>\'');
    return;
  }
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening");
});
