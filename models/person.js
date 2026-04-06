require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connectin to: ', url )

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const validatorNumber = (number) => {
    const regex = /^\d{2,3}-\d+$/
    return regex.test(number)
}

const personSchema = new mongoose.Schema({
    name: {type: String, minLength: 3},
    number: {type: String, minLength: 8, validate: {
        validator: validatorNumber,
        message: props => `${props.value} is not a valid phone number!`
    }}
}) 

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)