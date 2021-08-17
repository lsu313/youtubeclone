import React, {useState} from 'react'
import axios from 'axios'
import {useSelector} from 'react-redux'
import SingleComment from './SingleComment'
/*웹 페이지에서 submit을 누를시 발생되는 정보를 videoDetailpage state로 보낸다 */
import ReplyComment from './ReplyComment'
function Comment(props) {
    const videoId = props.postId
    const user = useSelector(state => state.user)
    const [commentValue, setcommentValue] = useState("")
    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value)
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const variables = { // typing 시 발생하는 정보를 취합하여 저장
            content: commentValue ,
            writer: user.userData._id, //localstorage가 아닌 redux의 state에서 정보를 가져오는 방법
            postId: videoId
        }
        axios.post('/api/comment/saveComment',variables)
        .then(response => {
            if(response.data.success){
                    console.log(response.data.result)
                    setcommentValue("")
                    props.refreshFunction(response.data.result) 
                    //comment 내용을 videoDetailpage로 넘김(업데이트)
            }else{
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }
    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/*comment lists */}
            {props.commentLists && props.commentLists.map((comment,index)=> (
                (!comment.responseTo && 
                    <React.Fragment>
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId}/>
                <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId}  commentLists = {props.commentLists}/>
                </React.Fragment>
                ) //responseTo 없는애들만 출력이 되게한다.
                //이말은 즉슨 원 댓글에 대한 답글이 있으면(responseTo가 있으면)
                //바로 출력되지 않고 답글이 아닌 댓글이면(responseTo가 없으면)
                //출력이되게하는것이다.
            ))}
            
            {/*Root comment form */}
            <form style={{display: 'flex'}} onSubmit = {onSubmit}>
                <textarea
                style ={{ width:'100%', bolderRadius: '5px'}}
                onChange ={handleClick} //typing 시 글자가 보이게 됨
                value={commentValue}
                placeholder="코멘트를 작성해주세요."
                />
                <br />
                <button style={{width: '20%', height: '52px'}} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
