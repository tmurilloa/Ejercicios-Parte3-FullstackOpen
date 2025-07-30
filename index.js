const express = require('express')
const app = express()

app.use(express.json())

let datos = [
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
]


/* Funciones GET */ 
app.get('/info', (request, response) => {
    const time = new Date()

    response.send(`
        <p>Phonebook has info for ${datos.length} people</p>
        <p>${time}</p>
        `)
})

app.get('/api/persons', (request, response) => {
    response.json(datos)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = datos.find(person => person.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }


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
    

    if (!body.name && !body.number){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const rep_name = datos.find(person => person.name === body.name)

    if (rep_name){
        return response.status(400).json({
            error: 'name already in data'
        })
    }

    const person = {
        "id": generateID(),
        "name": body.name,
        "number": body.number
    }

    datos = datos.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
