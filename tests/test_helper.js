const Blog = require("../models/blog");
const User = require("../models/user");

const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

//checking blogs in db
const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

//creating a db obj ID that doesnt belong to any blogs obj in db
const nonExistingID = async () => {
  const blog = new Blog({
    title: "will remove",
  });

  await blog.save();
  await blog.deleteOne();

  return blog.id.toString();
};

//checking users in db
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

//to give authonetication to a user
const initialUser = async () => {
  const userResponse = await api.post("/api/users").send({
    username: "rachelgreen",
    name: "joey tribiani",
    password: "testpassword",
  });

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "rachelgreen", password: "testpassword" });

  const token = loginResponse.body.token;
  const userId = userResponse.body._id;

  console.log(token, userId);

  return { token, userId };
};

module.exports = {
  initialBlogs,
  blogsInDB,
  nonExistingID,
  usersInDb,
  initialUser,
};
