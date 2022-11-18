require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const Person = require('./models/Person')
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
    Person.find({})
    .then(people => {
        response.json(people)
    })

    // response.json(persons);
})


const generateId = () => Math.floor(Math.random() * 3000)
app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body || !body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })

    
    
    // response.json(person);
    
})

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    
    Person.findById(id)
    .then(person => {
        response.json(person)
    })
    .catch(error => next(error))

})

app.put("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    const { name, number } = request.body;

    const person = {
        name,
        number
    }

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            console.log("updated Person: ", updatedPerson);
            if (!updatedPerson) {
                return response.status(404).end()
            }
            response.json(updatedPerson)
        })
        .catch(error => next(error))


})

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            console.log(result);
            response.status(204).end();
        })
        .catch(error => {
            next(error)
        })

})


const errorHandler = (error, request, response, next) => {
    console.log(error.name);
    
    if (error.name === "CastError") {
        response.status(400).send({
            error: "bad id"
        })
    }
    
}

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})