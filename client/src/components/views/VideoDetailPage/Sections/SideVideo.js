import React, {useEffect, useState} from 'react'
import axios from 'axios'


function SideVideo() {

    const [sideVideo, setsideVideo] = useState([])

    /*useEffect: DB에서 데이터 불러옴*/
    useEffect(() => {
        axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setsideVideo(response.data.videos)
                } else {
                    alert('비디오 가져오기를 실패했습니다.')
                }
            })
    }, [])

     /*return 다음은 하나의 템플릿(사이드 비디오 썸네일)
    그러므로 map메소드를 이용하여 여러개에 적용한다.
    */
    const renderSideVideo = sideVideo.map((video, index)=> {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        
        return <div key={index} style = {{display: 'flex', marginBottom: "1rem", padding: '0 2rem'}}>
        <div style={{width: '40%', marginRight: '1rem'}}>
            <a href>
                <img style ={{ width: '100%', height:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail'/>
            </a>
        </div>
        <div style = {{width: '50%'}}>
            <a href style={{color: 'gray'}}>
                <span style={{fronSize: '1rem', color: 'black'}}>
                    {video.title}
                </span><br />
                <span>{video.writer.name}</span><br />
                <span>{video.views} views</span><br />
                <span>{minutes}:{seconds}</span>
            </a>

        </div>
    </div>
    })
   
    
    return(
        <React.Fragment>
            <div style={{marginTop: '3rem'}} />
            {renderSideVideo}
        </React.Fragment>
    )
        
    
}

export default SideVideo
