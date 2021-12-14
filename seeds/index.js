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
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: "61aa850453075f21c01ece79",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse temporibus impedit commodi ullam, consectetur nisi perspiciatis magnam corporis nostrum culpa. Ex beatae error nobis praesentium iusto odit ad incidunt porro?",
      price,
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      images: [
        {
          url: "https://res.cloudinary.com/jim-fuhrman-the-freelancer/image/upload/v1638891493/YelpCamp/poiha5wtbzwxnzyiwths.jpg",
          filename: "YelpCamp/poiha5wtbzwxnzyiwths"
        },
        {
          url: "https://res.cloudinary.com/jim-fuhrman-the-freelancer/image/upload/v1638891493/YelpCamp/rzmra5vxp2omltdh3clo.jpg",
          filename: "YelpCamp/rzmra5vxp2omltdh3clo"
        },
        {
          url: "https://res.cloudinary.com/jim-fuhrman-the-freelancer/image/upload/v1638891493/YelpCamp/bubbcwnzbprmus0z6xr0.jpg",
          filename: "YelpCamp/bubbcwnzbprmus0z6xr0"
        }
      ]
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
