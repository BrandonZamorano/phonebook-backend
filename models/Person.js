const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        console.log((`DB Connected!`));
    })
    .catch(err => console.log(err))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /\d{2,3}-\d+/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`

        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})



module.exports = mongoose.model("Person", personSchema);