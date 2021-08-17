const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             Like
//=================================

router.post('/getLikes',(req,res) => {
    let variable = {}
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }
    
    Like.find(variable)
    .exec((err,likes)=> {
        if(err) return res.status(400).send(err)
        res.status(200).json({success: true, likes})
    })
})

router.post('/getDislikes',(req,res) => {
    let variable = {}
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }
    
    Dislike.find(variable)
    .exec((err,dislikes)=> {
        if(err) return res.status(400).send(err)
        res.status(200).json({success: true, dislikes})
    })
})


router.post('/upLike',(req,res) => {
    let variable = {}
    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }
    
   //Like collection에다가 클릭정보를 넣어준다.
   const like = new Like(variable)
   like.save((err,likeResult)=> {
       if(err) return res.json({success:false, err})
   })

   //만약에 dislike이 이미 클릭 되어있다면 dislike을 1줄여준다.
   Dislike.findOneAndDelete(variable)
   .exec((err,disLikeResult)=> {
       if(err) return res.status(400).json({success:false,err})
       res.status(200).json({success: true})
   })
})

router.post('/unLike',(req,res) => {
    let variable = {}
    if(req.body.videoId){
        variable = {videoId: req.body.videoId,userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId,userId: req.body.userId}
    }
    
    Like.findOneAndDelete(variable) //저장했던 like을 없앤다.
    .exec((err,result) => {
        if(err) return res.status(400).json({success:false,err})
       res.status(200).json({success: true})
    })
})



router.post('/unDisLike',(req,res) => {
    let variable = {}
    if(req.body.videoId){
        variable = {videoId: req.body.videoId,userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId,userId: req.body.userId}
    }
    
    DisLike.findOneAndDelete(variable) //저장했던 Dislike을 없앤다.
    .exec((err,result) => {
        if(err) return res.status(400).json({success:false,err})
       res.status(200).json({success: true})
    })
})


router.post('/upDisLike',(req,res) => {
    let variable = {}
    if(req.body.videoId){
        variable = {videoId: req.body.videoId,userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId,userId: req.body.userId}
    }
    
   //DisLike collection에다가 클릭정보를 넣어준다.
   const dislike = new Dislike(variable)
   dislike.save((err,dislikeResult)=> {
       if(err) return res.json({success:false, err})
   })

   //만약에 like이 이미 클릭 되어있다면 like을 1줄여준다.
   Like.findOneAndDelete(variable)
   .exec((err,likeResult)=> {
       if(err) return res.status(400).json({success:false,err})
       res.status(200).json({success: true})
   })
})

module.exports = router;