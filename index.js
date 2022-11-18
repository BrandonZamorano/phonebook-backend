require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/Person')
const PORT = process.env.PORT || 3001

morgan.token('postData', (request) => JSON.stringify(request.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


app.get('/info', (request, response, next) => {
    const timestamp = new Date()

    Person.find({})
        .then(results => {
            response.send(`
        <p>Phonebook has info for ${results.length} people</p>
        <p>${timestamp}</p>
    `)
                .catch(error => next(error))
        })

})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(people => {
            response.json(people)
        })

    // response.json(persons);
})


app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body


    const person = new Person({
        name,
        number
    })

    Person.find({ name })
        .then(results => {
            console.log('RESULTS: ', results)
            if (results.length >= 1) {
                return response.status(400).send({ error: 'Person with name already exists!' })
            } else {

                person.save()
                    .then(savedPerson => {
                        response.json(savedPerson)
                    }).catch(error => next(error))
            }
        })
        .catch(error => next(error))




    // response.json(person);

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const { name, number } = request.body

    const person = {
        name,
        number
    }

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            console.log('updated Person: ', updatedPerson)
            if (!updatedPerson) {
                return response.status(404).end()
            }
            response.json(updatedPerson)
        })
        .catch(error => next(error))


})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })

})


const errorHandler = (error, request, response) => {
    console.log(error.name)

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'bad id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({
            error: error.message
        })
    }


}

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})