import React, {useEffect, useState} from 'react'
import axios from 'axios'
function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    
    useEffect(() => {
        /*비디오를 업로드 한사람이 얼마나 많은 구독자를 가지고 있는가? 
        에 대한 정보 => user id를 넣는다
        userId 는 videoDetatailpage.js내 writer._id를 props를 통해 가져온다
        */
        let variable  = {userTo: props.userTo}
        
        axios.post('/api/subscribe/subscribeNumber',variable) //subscribe route필요
        .then(response => {
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber)
            }else{
                alert('구독자 수 정보를 받아오지 못했습니다.')
            }
        })

        /*내가 이 영상 작성자를 구족했는지에 대한 정보 
         영상 작성자의 user id 및 나의 user id 필요
         작성자 아이디 props이용 , 나의 아이디: 로그인 시 localStorage에 저장 되어 있음.
         */
         let subscribedVariable = {userTo: props.userTo, userFrom: localStorage.getItem('userId')}
        axios.post('/api/subscribe/subscribed',subscribedVariable)
        .then(response=> {
            if(response.data.success){
                setSubscribed(response.data.subscribed)
            }else{
                alert("정보를 받아오지 못했습니다.")
            }
        })
    }, [])

    const onSubscribe = () => {

        let subscribedVariable = {
            //구독을 누르는 user의 id와 영상 작성자의 user id 필요
            userTo:props.userTo,
            userFrom:props.userFrom
        }
        console.log(subscribedVariable)
        if(Subscribed){
            //구독 취소하기
            axios.post('/api/subscribe/unSubscribe',subscribedVariable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber-1)
                    setSubscribed(!Subscribed)
                   
                }else{
                    alert('구독 취소하는데 실패 하였습니다.')
                }
            })

        }else{
            //구독 하기 
            axios.post('/api/subscribe/subscribe',subscribedVariable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber+1)
                    setSubscribed(!Subscribed)
                    
                }else{
                    alert('구독 하는데 실패 하였습니다.')
                }
            })
        }
    }
    return (
        <div>
            <button
                style={{backgroundColor: `${Subscribed ?  '#AAAAAA': '#CC0000'}`, borderRadius: '4px',
            color: 'white', padding: '10px 16px',
            frontWeight: '500', fronSize: '1rem', textTransform: 'uppercase'
            
            }}
            onClick={onSubscribe}
            >
               {SubscribeNumber}{Subscribed ? ' Subscribed': ' Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
