const mongoose = require("mongoose")
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers")
const Campground = require("../models/campground")

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      /*image: "https://images.unsplash.com/photo-1518602164578-cd0074062767?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", */
      image: "https://source.unsplash.com/collection/483251",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse temporibus impedit commodi ullam, consectetur nisi perspiciatis magnam corporis nostrum culpa. Ex beatae error nobis praesentium iusto odit ad incidunt porro?",
      price
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
