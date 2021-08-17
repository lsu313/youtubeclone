import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import {useSelector} from 'react-redux'
import axios from 'axios'
import LikeDislikes from './LikeDislikes';
const { TextArea } = Input;

function SingleComment(props) {

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    const user = useSelector(state => state.user)
    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const variables = { // typing 시 발생하는 정보를 취합하여 저장
            content: CommentValue ,
            writer: user.userData._id, //localstorage가 아닌 redux의 state에서 정보를 가져오는 방법
            postId: props.postId,
            responseTo: props.comment._id    //comment.js와 다른점 
        }
        axios.post('/api/comment/saveComment',variables)
        .then(response => {
            if(response.data.success){
                    console.log(response.data.result)
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result) 
                    //videoDetailpage state에 업데이트 
            }else{
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }
    const actions = [
        <LikeDislikes userId = {localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]
    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content= {<p>{props.comment.content}</p>}
            />

            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                    <textarea
                        style={{ width: '100%', bolderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해주세요."
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
                </form>

            }
        </div>
    )
}

export default SingleComment
