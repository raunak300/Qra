const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("./Model/userModel");
const Post = require("./Model/postModel");
require("dotenv").config();

const MONGO_URI = process.env.DB_URL;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Connected to MongoDB");
    seed();
  })
  .catch((err) => console.error("❌ MongoDB connection failed", err));

const topics = [
  "AI is changing the world",
  "New iPhone 16 leaks are out",
  "ChatGPT is scary good",
  "Mental health in GenZ",
  "Cricket World Cup 2025 predictions",
  "Is JavaScript better than Python?",
  "SpaceX Mars mission updates",
  "Anime vs Movies debate",
  "Best coding languages in 2025",
  "Should college teach DSA?",
];

async function seed() {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});

    for (let i = 0; i < 100; i++) {
      const fullName = faker.person.fullName();
      const email = faker.internet.email();
      const password = "123456"; // Auto-hashed by pre-save hook
      const userName = faker.internet.userName(fullName);
      const userImg = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;

      const user = new User({
        fullName,
        email,
        password,
        userName,
        userImg,
      });

      await user.save();

      const numPosts = Math.floor(Math.random() * 2) + 2; // 2-3 posts
      for (let j = 0; j < numPosts; j++) {
        const title = faker.helpers.arrayElement(topics);
        const textContent = faker.lorem.sentences({ min: 2, max: 4 });
        const imagePath = `https://picsum.photos/seed/${faker.word.words(1)}${j}/500/300`;

        const post = new Post({
          email: user.email,
          userName: user.userName,
          userId: user._id,
          title,
          textContent,
          imagePath,
        });

        await post.save();

        // Push post to user's uploadedPosts array
        user.uploadedPosts.push({
          postId: post._id,
          title,
          textContent,
          imagePath,
        });
      }

      await user.save(); // Save user with uploadedPosts
    }

    console.log("✅ Seeding complete.");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  }
}
