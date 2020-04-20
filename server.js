const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/workout";

const db = require("./models");

// const Workout = require("./models/workout.js");
// const Exercise = require("./models/exercise.js");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.post("/api/workouts", ({ body }, res) => {
  const workout = new db.Workout(body);
  
  db.Workout.create(workout)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", (req , res) => {
  const id = req.params.id;
  console.log("workout = " + id);
  console.log("workout = " + req.body);
  console.log("workout = " + JSON.stringify(req.body));

  
  db.Exercise.create(req.body)
  .then(({_id}) => db.Workout.findOneAndUpdate({_id: id }, { $push: { exercises: _id } }, { new: true }))
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  });
});


app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({}).populate('exercises')
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
