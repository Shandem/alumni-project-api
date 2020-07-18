// imports
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const port = process.env.PORT || 3001
const app = express()

// middleware - JSON parsing
app.use(express.json())

// middleware - cors
const corsOptions = {
  origin:[`http://localhost:3000`],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// middleware - session config
app.use(session({
  // store the session in our DB
  store: new MongoStore({ url: "mongodb://localhost:27017/crafts" }),
  secret: "ILikePizza",
  resave: false,
  // Only create a session if a property is added to the session
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use((request, response, next) => {
  console.log(`Request received, url = ${request.url} ,${new Date().toLocaleTimeString()}`);
  next(); // The next() method will pass the request on to the next function in the middleware chain (in this app, routes are next)
});

// this route is for testing server is on
app.get("/", (req, res) => {
  res.send("Server is on");
});

// middleware - API routes
app.use('/api/v1/users', routes.users)
app.use('/api/v1/auth', routes.auth)
app.use('/api/v1/post', routes.post)

// connection
app.listen(port, () => console.log(`Server is running on port ${port}`))