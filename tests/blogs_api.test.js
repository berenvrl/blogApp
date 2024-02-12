const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../tests/test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  //await Blog.insertMany(helper.initialBlogs);
  await User.deleteMany({});

  const blogobj = helper.initialBlogs.map((blog) => new Blog(blog));

  const promiseArray = blogobj.map((blog) => blog.save());

  await Promise.all(promiseArray); //Promise.all for transforming an array of promise into a single promise, that will be fulfilled once every promise in the array
}, 10000);

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    const { token } = await helper.initialUser();

    await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const { token } = await helper.initialUser();

    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 10000);

  test("a spesific blog is within the returned blogs", async () => {
    const { token } = await helper.initialUser();

    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const titles = response.body.map((blog) => blog.title);
    expect(titles).toContain("React patterns");
  });
});

describe("viewing a spesific blog", () => {
  test("succeeds with a valid id", async () => {
    const { token } = await helper.initialUser();

    const blogsAtStart = await helper.blogsInDB();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with status 404 if blog does not exist", async () => {
    const { token } = await helper.initialUser();

    const validNonExistingId = await helper.nonExistingID();

    await api
      .get(`/api/blogs/${validNonExistingId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const { token } = await helper.initialUser();

    const invalidID = "invalid-id";

    await api
      .get(`/api/blogs/${invalidID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
});

describe("addidtion of a new blog", () => {
  test("succeeds with valid data", async () => {
    const { userId, token } = await helper.initialUser();

    const newblog = {
      title: "new title",
      author: "new author",
      url: "new url",
      likes: 223,
      user: userId,
    };

    await api
      .post("/api/blogs")
      .send(newblog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsFinal = await helper.blogsInDB();

    expect(blogsFinal).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsFinal.map((blog) => blog.title);

    expect(titles).toContain("new title");
  });

  test("fails with status code 400 if data invalid", async () => {
    const { userId, token } = await helper.initialUser();

    const newBlog = {
      title: "this is a title",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    const blogsFinal = await helper.blogsInDB();

    expect(blogsFinal).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id valid", async () => {
    const { token } = await helper.initialUser();

    const blogsdb = await helper.blogsInDB();

    const toBeDeleted = blogsdb[0];

    await api
      .delete(`/api/blogs/${toBeDeleted.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const finalBlogs = await helper.blogsInDB();
    expect(finalBlogs).toHaveLength(helper.initialBlogs.length - 1);

    const titles = finalBlogs.map((blog) => blog.title);

    expect(titles).not.toContain(toBeDeleted.title);
  });
});

describe("updating blog", () => {
  test("updating likes of the blog", async () => {
    const { token } = await helper.initialUser();

    const blogsAtStart = await helper.blogsInDB();
    const blogsToBeUpdated = blogsAtStart[0];
    const updatedLikes = 222;

    const response = await api
      .put(`/api/blogs/${blogsToBeUpdated.id}`)
      .send({ likes: updatedLikes })
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(updatedLikes);

    const blogsAtEnd = await helper.blogsInDB();

    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.id === blogsToBeUpdated.id
    );

    expect(updatedBlog.likes).toBe(updatedLikes);
  });
});

//exercises 4.8-4.14
/*
test("amount of blog posts", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("blog post has id property instead of _id ", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;

  expect(blogs).toBeDefined();
  expect(blogs[0].id).toBeDefined();
  expect(blogs[0]._id).toBeUndefined();
});

test("adding new blog", async () => {
  const newBlog = {
    title: "new blog",
    author: "author of new blog",
    url: "url of new blog",
    likes: 210,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogAdded = await helper.blogsInDB();

  expect(blogAdded).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogAdded.map((blog) => blog.title);
  expect(titles).toContain("new blog");
});

test("blog without likes property has 0 by default", async () => {
  const newblog = {
    title: "new blog",
    author: "author of new blog",
    url: "url of new blog",
  };

  const response = await api.post("/api/blogs").send(newblog);

  expect(response.body.likes).toBe(0);
});

test("blog without url or title", async () => {
  const newBlog = {
    title: "new title",
    author: "new author",
    likes: 33,
  };
  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("deleting blog", async () => {
  const blogsfirst = await helper.blogsInDB();
  const toBeDeleted = blogsfirst[0];

  await api.delete(`/api/blogs/${toBeDeleted.id}`).expect(204);

  const blogsFinal = await helper.blogsInDB();

  expect(blogsFinal).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsFinal.map((blog) => blog.title);
  expect(titles).not.toContain(toBeDeleted.title);
}, 100000);

test("updated likes of the blog", async () => {
  const blogsAtStart = await helper.blogsInDB();

  const blogToBeUpdated = blogsAtStart[0];
  const updatedLikes = 98;

  const response = await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send({ likes: updatedLikes })
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body.likes).toBe(updatedLikes);

  const blogsAtEnd = await helper.blogsInDB();
  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToBeUpdated.id);

  expect(updatedBlog.likes).toBe(updatedLikes);
});

*/

//afterAll function of jest, to close connection to database
afterAll(async () => {
  await mongoose.connection.close();
});

//NOTES
/*
supertest : library for testing HTTP servers in Node.js, testing API endpoints, without actually starting a server
*/

/*
JEST FUNCTIONS
describe(name, fn): groups test cases
test(name, fn, timeout): define a test case
expect(value):defines an expectation in a test case, returns an obj
toBe():matcher, check strick equality
toBeDefined(), not.toBeDefined()
toBeUndefined(): check that a variable is undefined
toEqual(): checks deep equality, more suitable compare two objs
toContain()
toContainEqual()
beforeEach(fn): defines conditions before test
afterEach(fn): defined conditions after test
afterAll(fn, timeout): finalization step, clean up states, close connection to db
*/

/*
MongoDB Functions
deleteMany({}): to clear the collection and provide a clean env for each test
insertMany({})
*/

/*
Mongoose functions
find()
connect()
Schmena()
model()
save()
updateOne()
updateMany()
deleteOne(), deleteMany()
populate()=>joins queries between collections
*/

/*
using regex: to match a specific pattern(The actual value of the header is application/json; charset=utf-8):
/application\/json/ 
*/

/*
async/await syntax =>related to the fact that making a request to the API is an asynchronous operation
async/await =>writing async code=> for appearance of sync code
*/

//npm test -- tests/blogs_api.test.js
