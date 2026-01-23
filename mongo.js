const mongoose = require('mongoose')

// No paso los argumentos necesarios
if (process.argv.length < 3){
    console.log('Tienes que pasar minimo la contrasena')   
    process.exit(1)
}

const password = process.argv[2]
const url =
`mongodb+srv://tmurilloa_db_user:${password}@ejercicio3-fullstackope.4ezzobl.mongodb.net/Agenda?appName=Ejercicio3-Fullstackopen`
mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
}) 

const Person = mongoose.model('Person', personSchema)

// Solo paso como argumento la contrasena
if (process.argv.length === 3){
    Person.find({}).then(result  => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

// si el proceso tiene 3 argumentos
if (process.argv.length > 3){

    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name,
        number
    })

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}