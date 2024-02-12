//exercises 4.3-4.7

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likesArray = blogs.map((item) => item.likes);

  const reducer = (sum, item) => {
    return sum + item;
  };

  return blogs.length === 0 ? 0 : likesArray.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current;
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const blogCounts = {};

  for (let i = 0; i < blogs.length; i++) {
    const author = blogs[i].author;
    blogCounts[author] = (blogCounts[author] || 0) + 1;

    //console.log(blogCounts[author], author);
  }

  let topAuthor = "";
  let maxBlogs = 0;

  for (const author in blogCounts) {
    if (blogCounts[author] > maxBlogs) {
      topAuthor = author;
      maxBlogs = blogCounts[author];
    }
  }

  return { author: topAuthor, blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  const likesByAuthor = {};

  for (const blog of blogs) {
    const author = blog.author;
    const likes = blog.likes;

    if (!likesByAuthor[author]) {
      likesByAuthor[author] = 0;
    }
    likesByAuthor[author] += likes;
  }

  let topAuthor = "";
  let maxLikesCount = 0;

  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > maxLikesCount) {
      topAuthor = author;
      maxLikesCount = likesByAuthor[author];
    }
  }

  return { author: topAuthor, likes: maxLikesCount };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs,
};
