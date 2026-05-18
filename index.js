const express = require("express");
const app = express();
const morgan = require('morgan')
app.use(express.json());
app.use(express.static('dist'))


let logger = morgan('tiny' )

app.use(logger)

let people = [
  { id: "1", name: "Arto Hellas", number: "909249249" },
  { id: "2", name: "Ada Lovelace", number: "9358385835" },
  { id: "3", name: "Dan Abramov", number: "2754752528" },
];

app.get("/api/people", (request, response) => {
  response.json(people);
});

const today = new Date();

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${people.length} people.
        
        ${today}</p>`);
});

app.get("/api/people/:id", (request, response) => {
  const id = request.params.id;
  const person = people.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/people/:id", (request, response) => {
  const id = request.params.id;
  console.log(id);
  people = people.filter((p) => p.id !== id);
  response.status(204).end();
});


app.post("/api/people", (request, response) => {
  const body = request.body;
  // console.log(body);
  if (
    body.name === "undefined" ||
    body.number === "undefined" ||
    body.name === "" ||
    body.number === ""
  ) {
    return response.status(400).json({ error: "Name or number missing." });
  }
  const nameAlreadyExists = (person) => person.name === body.name;
  if (people.some(nameAlreadyExists)) {
    return response.status(400).json({
      error: "Name must be unique.",
    });
  }
  // console.log(Object.keys(people));
  const person = {
    name: body.name,
    number: body.number,
    id: Math.ceil(Math.random() * 1000).toString(),
  };

  people = people.concat(person);

  response.json(person);
});

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
