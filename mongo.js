const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('password missing node mongo.js <password>')
    process.exit(1)
}


const password = process.argv[2]
const dbUrl = `mongodb+srv://fullstack:${password}@cluster0.foakwtk.mongodb.net/phonebook?retryWrites=true&w=majority`


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length >= 5) {
    // add person from args
    const name = process.argv[3]
    const number = process.argv[4]

    return mongoose.connect(dbUrl)
        .then(() => {
            const person = new Person({
                name,
                number
            })

            return person.save()
        }).then(result => {
            console.log(`Added ${result.name} number ${result.number} to phonebook`)
            return mongoose.connection.close()
        })
        .catch(err => console.log(err))

}


// if password is the only parametr, display all entries

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Connected!')

        return Person.find({})
    })
    .then(result => {
        console.log('phonebook: ')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)

        })

        return mongoose.connection.close()
    })
    .catch(err => console.log(err))