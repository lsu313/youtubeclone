const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        //type에 id만 넣어도 User.js에 있는 정보들을 다 불러 모을수 있다.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type:String,
        maxlength: 50
    },
    description : {
        type: String
    },
    privacy:{
        type: Number
    },
    filePath: {
        type: String
    },
    category : {
        tpye:String
    },
    views: {
        type: Number,
        default : 0
    },
    duration : {
        type: String
    },
    thumbnail: {
        type:String
    },
    //timestamps: true 만든 data과 update data 표시
},{timestamps: true})




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }