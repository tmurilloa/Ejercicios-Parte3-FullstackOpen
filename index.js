require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))


/* Funciones GET */ 
app.get('/info', (request, response) => {
    const time = new Date()
    Person.countDocuments({}).then(result => {
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

app.get('/api/persons/:id', (request, response) =>{
    Person.findById(request.params.id).then(person =>{
        if(person){
        response.json(person)
        }
        else{
            response.status(404).end()
        }
    })
})

/* Funciones DELETE */
app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    datos = datos.filter(person => person.id !== id)

    response.status(204).end()
})

/* Funciones POST*/
const generateID = () => {
    random_id = Math.trunc(Math.random()* 500)
    console.log(random_id)
    return random_id
}

app.post('/api/persons', (request, response)=>{
    const body = request.body
    
    if (!body.name || !body.number){
        return response.status(400).json({error: 'name or number missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
