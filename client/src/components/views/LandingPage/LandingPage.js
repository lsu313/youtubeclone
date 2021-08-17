import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography
const { Meta } = Card;
function LandingPage() {

    const [Video, setVideo] = useState([])
    useEffect(() => {
        axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setVideo(response.data.videos)
                    //console.log(response.data.videos.thumbnail)
                } else {
                    alert('비디오 가져오기를 실패했습니다.')
                }
            })
    }, []) //[]: 비어있으면 한번만 

    const renderCards = Video.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24}>
            
           
                    <div style={{ position: 'relative' }}>
                    <a href={`/video/${video._id}`} > {/* 비디오 클릭시 링크 통해 페이지 이동 */}
                        
                        <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                        {console.log(video.thumbnail)}
                       <div className="duration">
    
                            <span>{minutes} : {seconds}</span>
                        </div>
            
                
                
            </a>
            </div>
            <br />
            <Meta
                avatar={
                    //user image
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views}</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>
    })


    return (
        <>
            <div style={{ width: '85%', margin: '3rem auto' }}>
                <Title level={2}> Recommended </Title>
                <hr />
                <Row gutter={[32, 16]}>

                    {renderCards}

                </Row>
            </div>
            <div style={{ float: 'right' }}>Thanks For Using This Boiler Plate </div>
        </>
    )
}

export default LandingPage
