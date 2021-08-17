const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             subscribe
//=================================

router.post('/subscribeNumber',(req,res) => {
  Subscriber.find({"userTo":req.body.userTo})
  .exec((err,subscribe)=> {
      if(err) return res.status(400).send(err)
      return res.status(200).json({success: true, subscribeNumber:subscribe.length})
      //subscribe.length에 따라(구독자의 수에 따라 case 다름 so 인자로 전달하여 다른 case 발생시킴)
    })
})

router.post('/subscribed',(req,res) => {
    Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err,subscribe)=>{
        if(err) return res.status(400).send(err);
        let result = false;
        if(subscribe.length !== 0){
            //length가 0이 아니라면 구독을 하고 있는것
            result = true;
        }
        res.status(200).json({success: true, subscribed: result})
    })
  })

  //
  router.post('/unSubscribe',(req,res) => {
      //Subscriber에 담겨있는 userTo userFrom 를 찾아서 없애준다.
    Subscriber.findOneAndDelete({userTo:req.body.userTo, userFrom: req.body.userFrom})
    .exec((err,doc) => {
        if(err) return res.status(400).json({success:false,err})
        res.status(200).json({success: true, doc})
    })
})
  //
  router.post('/subscribe',(req,res) => {
   const subscribe = new Subscriber(req.body)
   subscribe.save((err,doc)=> {
      console.log(subscribe)
       if(err) return res.json({success: false , err})
       res.status(200).json({success: true})
   })
  })



module.exports = router;