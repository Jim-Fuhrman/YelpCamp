if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const flash = require("connect-flash")
const ExpressError = require("./utils/ExpressError")
const methodOverride = require("method-override")

const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

const userRoutes = require("./routes/users")
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  /*useCreateIndex: true,*/ /* This line causes big problems. */
  useUnifiedTopology: true /* This line causes big problems. */ /* This line causes big problems. */
  /*useFindAndModify: false*/
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("database connected")
})

const { campgroundSchema, reviewSchema } = require("./schemas.js")
const Schemas = require("./schemas")

const app = express()

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true })) /* This parses our HTML body. Without it the body has nothing in it. */
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

const sessionConfig = {
  secret: "thisshouldbeabetersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  console.log(req.session)
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "coltttt@gmail.com", username: "colttt" })
  const newUser = await User.register(user, "chicken")
  res.send(newUser)
})

//register - form
//Post / register - create a user

app.use("/", userRoutes)
app.use("/campgrounds", campgroundRoutes) /* This needs to come ahead of the next app.get*/
app.use("/campgrounds/:id/reviews", reviewRoutes)

app.get("/", (req, res) => {
  res.render("home")
})

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = "Something went wrong"
  res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
  console.log("serving on port 3000")
})
