require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const users = [
  {
    name: "Pavan Kumar Neteti",
    email: "pavankumarneteti717@gmail.com"
  },
  {
    name: "AJ",
    email: "aj717@gmail.com"
  },
  {
    name: "Vinay Ratnam",
    email: "vinayratnam717@gmail.com"
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});

    const createdUsers = await User.insertMany(users);

    console.log("Users seeded successfully:");

    createdUsers.forEach((user) => {
      console.log(`${user.name} - ${user._id}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedUsers();