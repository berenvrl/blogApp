const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
require("express-async-errors");
app.use(express.json());
app.use(cors());

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB", error.message);
  });

// app.use(middleware.requestLogger);
// app.use(middleware.tokenExtractor);
app.use(
  "/api/blogs",
  middleware.tokenExtractor,
  middleware.userExtractor,
  blogsRouter
);
app.use("/api/users", usersRouter);
app.use("/api/login", middleware.tokenExtractor, loginRouter);

//emptying db in test mode
// /api/testing/reset empties db
if(process.env.NODE_ENV === 'test'){
  const testingRouter=require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;

/*
require("express-async-errors"); =>library for eliminating catch blocks
app.use(cors()); => adds the necessary HTTP headers to manage cors restrictions in requests
app.use(express.json()); => to parse JSON data in incoming requests=>req.body obj=>access JSON data in route handlers
*/

/*
Most used Express methods:
app.get()
app.post()
app.delete()
app.put()
app.use()
app.listen()

status()
end()
*/
