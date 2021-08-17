import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd'
import axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes'
//import { withRouter } from 'react-router-dom'; 
function VideoDetailPage(props) {
    /*비디오 정보를 몽고디비에서 가져오기 위해 useEffect사용
    여기서는 썸네일 클릭시 링크를 통해 해당 비디오 영상을 재생하기 위한
    작업이다.
    */
   
    const videoId = props.match.params.videoId // App.js에서 videoId 사용
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])
    //state에 저장된 정보를 Comment 컴포넌트로 보낸다 <Comment />
    
    useEffect(() => {

        //app.js에서 videoId 경로로 설정
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data) //댓글에 대한 정보들
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert("비디오 정보를 가져오길 실패했습니다.")
                }
            })
            axios.post('/api/comment/getComments', variable) //해당 비디오의 모든 코멘트를 가져옴
            .then(response => {
                if(response.data.success){
                    setComments(response.data.comments)
                }else{
                    alert('코멘트 정보를 가져오는 것을 실패 하였습니다.')
                }
            })
        }, [])
    const refreshFunction = (newComments) => {
        /*웹에서 comment작성 시 그 정보가 videoDetailpage에 와서 
        refreshfunction을 통해서 stateComments에 업데이트=> 다시 props으로 Comment.js로 가서 웹에서
        바로 댓글이 써지게 구현
        */
        setComments(Comments.concat(newComments))
    }
    if (VideoDetail.writer){
       const subscribeButton =  VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    
                    <div style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>

                        <List.Item
                       // {/*{[<LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')} /> */}
                       //userTo={Video.writer._id} userFrom={localStorage.getItem('userId')}
                         actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId = {videoId}/>,subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />

                        </List.Item>
                        <Comment refreshFunction ={refreshFunction} commentLists= {Comments} postId= {videoId} />
                    </div>
    
                </Col>


                <Col lg={6} xs={24}>
                    <SideVideo/>
                   
                </Col>


            </Row>
        )
}else {
    return <div>loading...</div>
}
}


export default VideoDetailPage
