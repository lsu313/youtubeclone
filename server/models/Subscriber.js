const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*subscriber model 구현 */
const subscriberSchema = mongoose.Schema({
    userTo: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true})




const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }