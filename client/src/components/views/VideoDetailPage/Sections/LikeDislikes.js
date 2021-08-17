import React, {useState, useEffect} from 'react'
import {Tooltip, Icon} from 'antd'
import axios from 'axios'
function LikeDislikes(props) {

    const [Dislikes, setDislikes] = useState(0)
    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)
    let variable = {
        
    }
    if(props.video){
        //video에 대한 좋아요 싫어요 
        variable = {videoId: props.videoId, userId: props.userId}
    }else{
        //comment에 대한 좋아요 싫어요
        variable = {commentId:props.commentId , userId: props.userId}
    }
    
    useEffect(() => {
       axios.post('/api/like/getLikes', variable)
       .then(response => {
           if(response.data.success){
                // 얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)
                //내가 이미 그 좋아요를 눌렀는지
                response.data.likes.map(like => {
                    //어떤 좋아요의 정보에 내 아이디가 있다면
                    //내가 그 정보를 눌렀다는것이다.
                    if(like.userId === props.userId){
                        setLikeAction('liked')
                        
                    }
                })
           }
           else{
               alert('Likes에 정보를 가져오지 못했습니다.')
           }
       })

       axios.post('/api/like/getDislikes', variable)
       .then(response => {
           if(response.data.success){
                // 얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length)
                //내가 이미 그 싫어요를 눌렀는지
                response.data.dislikes.map(dislike => {
                    //어떤 싫어요의 정보에 내 아이디가 있다면
                    //내가 그 정보를 눌렀다는것이다.
                    if(dislike.userId === props.userId){
                        setDislikeAction('disliked')
                    }
                })
           }
           else{
               alert('DisLikes에 정보를 가져오지 못했습니다.')
           }
       })
    }, [])

    const onLike = () => {
        if(LikeAction === null){
            axios.post('/api/like/upLike', variable)
            .then(response => {
                if(response.data.success){
                    setLikes(Likes + 1)
                    setLikeAction('liked')

                    if(DislikeAction !==null){ // dislike이미 클릭
                        setDislikeAction(null)
                        setDislikes(Dislikes - 1)

                    }
                }else{
                    alert('Like를 올리지 못하였습니다.')
                }
            })
        }else{
            axios.post('/api/like/unLike', variable)
            .then(response => {
                if(response.data.success){
                    setLikes(Likes - 1)
                    setLikeAction(null)
                }else{
                    alert('Like를 내리지 못하였습니다.')
                }
            })
        }
    }

    const onDisLike = () => {
        if(DislikeAction !== null){ //dislike 이미 클릭
            axios.post('/api/like/unDisLike', variable)
            .then(response => {
                if(response.data.success){
                    setDislikes(Dislikes - 1)
                    setLikeAction(null)

                    if(DislikeAction !==null){ // dislike이미 클릭
                        setDislikeAction(null)
                        setDislikes(Dislikes - 1)

                    }
                }else{
                    alert('DisLike를 지우지 못하였습니다.')
                }
            })
        }else{ //dislike버튼 클릭 되어있지 않았을때
            axios.post('/api/like/upDisLike', variable)
            .then(response => {
                if(response.data.success){
                    setDislikes(DislikeAction + 1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null){
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }
                }else{
                    alert('Like를 내리지 못하였습니다.')
                }
            })
        }
        



    }
    return (
        <div>
            <span key = "comment-basic-like">
                <Tooltip title="Like">
                    <Icon type = "like"
                             theme={LikeAction === 'liked'?  "filled": 'outlined' } 
                            onClick={onLike}
                    />

                    
                </Tooltip>
                <span style = {{paddingLeft: '8px', cursor: 'auto'}}>{Likes}</span>
            </span>&nbsp;&nbsp;

            <span key = "comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type = "dislike"
                            theme={DislikeAction === 'disliked'?  "filled": 'outlined' } 
                            onClick={onDisLike}
                    />

                    
                </Tooltip>
                <span style = {{paddingLeft: '8px', cursor: 'auto'}}>{Dislikes}</span>
                </span>
        </div>
    )
}

export default LikeDislikes
