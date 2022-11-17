const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3001;

morgan.token('postData', (request, response) => JSON.stringify(request.body))

app.use(express.static("build"))
app.use(cors());
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get("/info", (request, response) => {
    const timestamp = new Date();
    
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${timestamp}</p>
    `)
})

app.get("/api/persons", (request, response) => {
    response.json(persons);
})


const generateId = () => Math.floor(Math.random() * 3000)
app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body || !body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
       ...body ,
       id: generateId()
    }
    
    persons = [...persons, person]
    
    response.json(person);
    
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id);

    if (person) {
        return response.json(person)
    } else {
        response.status(404).end();
    }

})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})