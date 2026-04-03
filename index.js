// validation logic is separated in a different file, validations.js
// usually we put these commands at the top of file
const { validateCourse } = require("./validations");


// basic crud api
const express = require("express");
const app = express(); // app is your server

app.use(express.json());
// express.json() is a middleware, it helps parse json data

const port = process.env.PORT || 3000;
// use local port 3000 or any other port set by your environment

// Backend Basics... 
app.get("/", async (req, res) => {
    res.send("Backend Basics...");
});

// inside index.js
// before app.get(...)
// course data is stored in an array of objects
const courses = [
    {
        id: 1,
        name: "SWE",
        enrollment: 20,
    },
    {
        id: 2,
        name: "FP",
        enrollment: 10,
    },
    {
        id: 3,
        name: "Python",
        enrollment: 30,
    },
];
// port listener
app.listen(port, () => console.log(`Listening on port: ${port}`));



app.put("/api/courses/:id", async (req, res) => {
    //step 1: look up the course, if not found return 404, resource not found
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) {
        // 404 error means not found
        return res.status(404).send("Course does not exist...");
    }
    //step2: validate and return 400 if the input is not in good shape
    const userInput = {
        name: req.body.name,
        enrollment: req.body.enrollment,
    };
    const { error, value } = validateCourse(userInput);
    if (error) {
        return res.status(400).send(error.message);
    }
    // step3: if no error, then update and return updated course
    course.name = value.name;
    course.enrollment = value.enrollment;
    return res.send(course); // convention, return the updated object
});

app.delete("/api/courses/:id", async (req, res) => {
    // step 1: look up the course, if not found return 404, resource not found
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) {
        // step 2 404 error means not found
        return res.status(404).send("Course does not exist...");
    }
    // step3: if no error, then delete and return deleted course
    const index = courses.indexOf(course);
    courses.splice(index, 1); // delete the course from the array
    return res.send(course); //return the deleted course
});

// app getters for courses
app.get("/api/courses/:id", async (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send("Course does not exist...");
    else res.send(course);
});

// in the same index.js file
// get all courses
app.get("/api/courses", async (req, res) => {
    res.send(courses); 
});

// adding new data
app.post("/api/courses", async (req, res) => {
    const userInput = {
        name: req.body.name,
        enrollment: req.body.enrollment,
    };
    const { error, value } = validateCourse(userInput);

    if (error) {
        return res.status(400).send(error.message);
    } else {
        const newCourse = {
            id: courses.length + 1,
            name: req.body.name,
            enrollment: req.body.enrollment,
        };
        courses.push(newCourse); // add to the course list
        return res.send(newCourse); //convention, return the new object
    }
});

