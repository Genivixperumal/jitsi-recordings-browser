require('dotenv-flow').config();
const cors = require('cors');
const hound = require('hound');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const filestore = require('session-file-store')(session);
const fs = require('fs');
const { exit } = require('process');

const { checkUserPwd } = require('./auth');
const { readAll, findPath } = require('./dir_scan');
const errors = require('./errors');
const utils = require('./utils');

const recordingsDir = process.env.WATCH_DIR;
const PORT = process.env.BIND_TO_PORT;
const dirs = [];

const watcher = hound.watch(recordingsDir);
watcher.on('create', function (file, stats) {
  console.log(file + ' was added. Reloading...');
  readAll(dirs, recordingsDir);
  console.log("Reloading OK. Found "+dirs.length+" recordings.");
});

readAll(dirs, recordingsDir);
utils.printStartup(dirs);

const app = express();

if (!process.env.SESSION_SECRET) {
  console.log("Error: a session secret is not set (see comment for " +
              "SESSION_SECRET in env.example for more details).");
  exit(1);
}

// Configure session:
const sessionConfig = {
  cookie: {
    httpOnly: true,
    domain: process.env.DOMAIN,
    path: process.env.COOKIE_PATH,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
  },
  name: "sessionIdentifier",
  rolling: true,
  resave: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  store: new filestore({
    retries: 0,
    ttl: 60 * 60 * 24 * 30,
  }),
};
const corsConfig = {
  credentials: true,
  origin: process.env.CORS_ORIGIN,
  methods: ["POST", "GET", "DELETE"],
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = !(process.env.INSECURE_COOKIES); //undefined -> secure, true -> false
  sessionConfig.proxy = true; //undefined -> secure, true -> false
  if (!sessionConfig.cookie.secure)
    console.log("\n###########\n# WARNING #"+
                " Using insecure (http) cookies in production. This is"+
                " strongly not recommended.\n###########\n");
} else if (app.get('env') === 'development') {
  console.log("DEVELOPMENT MODE: using non-secure http-cookies");
  sessionConfig.cookie.secure = false;
  sessionConfig.cookie.sameSite = 'lax';
} else console.log("Warning: an unknown environment: "+app.get('env'));
// Check that htpasswd exists:
if (!fs.existsSync(process.env.HTPASSWD_FILE))
  throw new Error(`No htpasswd found at: ${process.env.HTPASSWD_FILE}`);
// Enable middlewares:
app.use(helmet()); // this must be the first app.use() call
utils.setupLogging(app);
app.use(cors(corsConfig));
app.use(session(sessionConfig));
app.use(express.json());

//Common request handler for streaming and download
const download = (isStream, req, res) => {
  if (utils.checkIfNotAuth(req, res)) return;
  const path = findPath(encodeURI(req.params[0]), dirs);
  console.log("download: isStream="+isStream+" path=["+path+"]");
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  // Download with "save as" dialog requires:
  //1. Content type to be application/octet-stream, ...
  const contentType = isStream ? 'video/mp4' : 'application/octet-stream';
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    };
    //2. ...and Content-Disposition: attachment
    if (!isStream) head['Content-Disposition'] = 'attachment';
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': contentType,
    };
    //2. ...and Content-Disposition: attachment
    if (!isStream) head['Content-Disposition'] = 'attachment';
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};

// Endpoints:
app.get('/recordings', (req, res) => {
  if (utils.checkIfNotAuth(req, res)) return;
  res.json(dirs);
});
app.get('/stream/*', (req, res) => {
  download(true, req, res);
});
app.get('/download/*', (req, res) => {
  download(false, req, res);
});
app.post('/auth', async (req, res) => {
  // Disable endpoint for already authorized sessions:
  if (req.session.authorized) return;
  if (req.body?.auth &&
    await checkUserPwd(req.body.auth.username, req.body.auth.password)) {
    req.session.user = req.body.auth.username;
    req.session.authorized = true;
    res.send({ authorized: true });
  } else {
    const error = (req.body && req.body.auth) ? errors.INCORRECT_PASSWORD : errors.NO_USER_SPECIFIED;
    res.status(401).send(error);
  }
});
app.get('/user', (req, res) => {
  if (utils.checkIfNotAuth(req, res)) res.status(401).end();
  else res.send({ user: req.session.user }).end();
});
app.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.status(err === null ? 200 : 500).end();
  });
});

app.listen(PORT, () => {
  console.log('Server started on port: ' + PORT);
});
