import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';
//import TextArea from 'antd/lib/input/TextArea';
const { TextArea } = Input;
const { Title } = Typography;

const PrivateOption = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]
const CategoryOption = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Auto & vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" }
]

function VideoUploadPage(props) {
    //state안에 value(input textarea selectarea등) 저장 => 서버에 state로 보냄
    const user = useSelector(state => state.user) //redux에 있는 state에 담긴 user 정보를 변수에 저장
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")


    const onTitleChange = (event) => { //title 칸에 글자 쳐지게 = state 변경
        setVideoTitle(event.currentTarget.value)
    }
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }
    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]) // files: 동영상 파일 정보 인자
        //server 에 request => axios(라이브러리)사용
        axios.post('/api/video/uploadfiles', formData, config) // 파일을 보낼때는 위와 같은 코드(header type 지정 등) 를 써야 오류 안남
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    setFilePath(response.data.url)
                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                console.log(response.data)
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)
                            }
                            else {
                                alert("썸네일 생성에 실패했습니다.")
                            }
                        })
                } else {
                    alert("비디오 업로드를 실패했습니다.")
                }
            })
    }

    const onSumit =(e) => {
        e.preventDefault();
        const variables = {
            //redux 통해 user data 받아옴
            writer:user.userData._id ,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,

        }
        axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success){
                message.success("성공적으로 업로드 했습니다.")
                setTimeout(()=> {

                }, 3000) // 3초 뒤 화면 전환
                props.history.push('/')
            }
            else{
                alert("비디오 업로드에 실패했습니다.")
            }
        })
    }
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form omSubmit={onSumit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* drop zone 영상 드래그*/}
                    <Dropzone
                        //ondrop : 비디오 서버에 보낸다음 저장
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={1000000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                width: '300px', height: '240px', border: '1px solid lightgray',
                                alignItems: 'center', justifyContent: 'center'
                            }}{...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ frontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>
                    {/* thumnail */}
                     {/*thumbnail 있을때만 표시 */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="tumbnail" />
                        </div>
                    }
                </div>
                <br />
                <br />
                <label>Title</label>
                <br />
                <input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOption.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                        //index: 0 or 1 
                    ))}

                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOption.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                        //index: 0 or 1 or 2 or 3
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="Large" onClick={onSumit}>
                    submit
                </Button>

            </Form>
        </div >
    )
}

export default VideoUploadPage
