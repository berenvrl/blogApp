const blogsRouter = require("express").Router();
const { isValidElement } = require("react");
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");
const mongoose = require("mongoose");

/*
//isolates token from the authorization header
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "");
  }
};
*/

// / instead of /api/blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// / instead of /api/blogs/:id
blogsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid ID" });
  } else {
    const blog = await Blog.findById(id);

    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  }
});

// / instead of /api/blogs
//creating a blog post only if with authorization
blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  // console.log(user);

  if (body.title && body.url) {
    //const token = request.token;
    //console.log("token", token);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });

    if (user) {
      if (blog.user.toString() === user._id.toString()) {
        const savedBlog = await blog.save();

        console.log("savedBlog", savedBlog);

        user.blogs = user.blogs.concat(savedBlog._id);

        await user.save();

        response.status(201).json(savedBlog);
      } else {
        response.status(403).json({ error: "invalid user" });
      }
    } else {
      return response.status(400).end();
    }
  } else {
    response.status(400).end();
  }
});

// / instead of /api/blogs/:id
//creating a blog post only if with authorization
blogsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  const user = request.user;

  if (user) {
    //find blog obj to be deleted
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    if (blog.id === id) {
      //delete a blog
      await Blog.findByIdAndDelete(id);
      response.status(204).end();
    }
  } else {
    return response.status(401).json({ error: "Unauthorized access" });
  }
});

// / instead of /api/blogs/:id
//creating a blog post only if with authorization
blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;
  const id = request.params.id;

  const user = request.user;

  if (user) {
    const blog = {
      title,
      author,
      url,
      likes,
    };

    const updatedblog = await Blog.findByIdAndUpdate(id, blog, { new: true });

    response.json(updatedblog);
  } else {
    return response.status(401).json({ error: "Unauthorized access" });
  }
});

module.exports = blogsRouter;

//NOTES
/*
201-created
200-OK
204-no content,server doesnt return any content, delete requests
400-bad request, missing/wrong request
404-not found, server not working with related request, invalid url, unauthorized access
401-unauthorized
*/

/*
router obj: A router object is an isolated instance of middleware and routes

advantages of use of router obj:
1)modularity => clearer seperation
2)middleware: routers obj can define middleware functions, ex. authentication middleware
3)route prefixing =>common prefix for routes, great to work with larger groups
4)easy integration: in express app => better code organization
5)reusability: u can use them in different express apps
6)testing-debugging: routers provide a way to isolate and test specific sets of routes and handlers=> better testing
*/

/*
eliminating try-catch in async functions => npm install express-async-errors => require('express-async-errors) in app.js => no need next()
*/
