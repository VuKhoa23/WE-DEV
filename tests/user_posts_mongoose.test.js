const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Post = require("../models/postModel");

/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DB_KHOA, {
    useUnifiedTopology: false,
  });
});

describe("Create a user and post and assign to each other", () => {
  it("User and post should be created", async () => {
    const username = "Test";
    const email = "test@example.com";
    const password = "12345";
    const user = await User.create({ username, email, password });

    const content = "Today the weather is so good";
    const post = await Post.create({ content, owner: user._id });

    user.posts.push(post._id);
    await user.save();

    const content2 = "I feel so sad";
    const post2 = await Post.create({ content: content2, owner: user._id });

    user.posts.push(post2._id);
    await user.save();
    expect(user.posts.length > 0);
  });
});

describe("Delete the user", () => {
  it("If the user is deleted. The associate post should be deleted too", async () => {
    const username = "Test";
    const user = await User.findOne({ username: username });
    const userId = user._id;
    await User.findOneAndRemove({ username });

    const postResult = await Post.findOne({ owner: userId });
    expect(postResult == null);
  });
});

// afterAll(async () => {
//   await mongoose.connection.close();
// });
