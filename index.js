require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())



morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))


/* Funciones GET */
app.get('/info', (request, response) => {
    const time = new Date()
    Person.countDocuments({})
    .then(result => {
        response.send(`
        <p>Phonebook has info for ${result} people</p>
        <p>${time}</p>
        `)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person){
        response.json(person)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => {next(error)})
})

/* Funciones DELETE */
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(() => {
        response.status(204).end()
    })
    .catch(error => {next(error)})
})

/* Funciones POST*/

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number){
        return response.status(400).json(
            {
            error: 'name or number missing'
        }
    )
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => {next(error)})
})

/* Funciones PUT*/
app.put('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => {next(error)})
})


// Middleware para manejo de errores

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
