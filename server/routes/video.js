const express = require('express');
const router = express.Router();
const { Video } = require("../models/video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require('../models/Subscriber');

//storage multer config
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_$(file.originalname)`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only  mp4 is allowed'), false);

        }
        cb(null, true)
    }
});
const upload = multer({ storage: storage }).single("file");
//=================================
//             video
//=================================
router.post('/uploadfiles', (req, res) => {
    //req : client 에서 보내온 file(비디오) 서버에 저장
    //저장 하기 위해서 dependency다운로드 => multer
    upload(req, res, err => {
        //upload폴더로 보내줌
        if (err) {
            return res.json({ success: false, err })
            //videoUploadpage.js 에 response.data.success값을 return
        }
        return res.json({ success: true, url: res.req.file.path, filename: res.req.file.filename })
    })
})






router.post('/uploadVideo', (req, res) => {
    //비디오 정보를 저장한다 (mongoDB에) 
    //req.body 에 client에서 보낸 정보들 
    const video = new Video(req.body)
    video.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    }) // mongodb에 저장
})
router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id": req.body.videoId }) //client에사 보낸 videoId이용
        .populate('writer') // user의 모든 정보 가져옴
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
        })

})

router.post('/getSubscriptionVideos', (req, res) => {
    //현재 로그인된 자신의 아이디를 가지고 구독하는 사람을 찾는다.
    //userFrom: userTo를 구독한 사람
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err)
            let subscribedUser = []; //userTo는 여러개일수도 있으므로
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo)
            })

            //찾은 사람들의 비디오를 가지고 온다.
            Video.find({ writer: { $in: subscribedUser } })
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json({ success: true, videos })
                })
            //$in : 배열의 모든 요소의 writer를 찾아줌
        })
})




router.get('/getVideos', (req, res) => {
    //비디오를 db에서 가져와서 클라이언트에 보낸다.
    Video.find()
        .populate('writer') //popualte을 해줘야 모든 정보를 가져올수 있다.
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
})

router.post('/thumbnail', (req, res) => {
    //썸네일 생성하고 비디오 러닝타임도 가져오기


    let filePath = "";
    let fileDuration = "";
    //비디오 정보가져오기
    //ffmpeg.setFfmpegPath('C:\\..\\..\\bin\\ffmpeg.exe')
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    })




    //썸네일 생성
    ffmpeg(req.body.url) // client에사 본 비디오 저장경로 (./uploads)
        .on('filenames', function (filenames) {//파일네임 생성 (썸네일)
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () { //썸네일 생성 후 무엇을 할 것인지.
            console.log('screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err });
        })
        .screenshot({
            //옵션
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x420',
            filename: 'thumbnail-%b.png'
        })
})


module.exports = router;

/*
Get vs Post

get이란
 GET 은 클라이언트에서 서버로 어떠한 리소스로 부터 정보를 요청하기 위해 사용되는 메서드이다.

예를들면 게시판의 게시물을 조회할 때 쓸 수 있다.

GET을 통한 요청은 URL 주소 끝에 파라미터로 포함되어 전송되며, 이 부분을 쿼리 스트링 (query string) 이라고 부른다.

방식은 URL 끝에 " ? " 를 붙이고 그다음 변수명1=값1&변수명2=값2... 형식으로 이어 붙이면 된다.

예를들어 다음과 같은 방식이다.

www.example.com/show?name1=value1&name2=value2

서버에서는 name1 과 name2 라는 파라미터 명으로 각각 value1 과 value2 의 파라미터 값을 전달 받을 수 있다.

post란
POST는 클라이언트에서 서버로 리소스를 생성하거나 업데이트하기 위해 데이터를 보낼 때 사용 되는 메서드다. 예를들면 게시판에 게시글을 작성하는 작업 등을 할 때 사용할 된다.

POST는 전송할 데이터를 HTTP 메시지 body 부분에 담아서 서버로 보낸다. ( body 의 타입은 Content-Type 헤더에 따라 결정 된다.)

GET에서 URL 의 파라미터로 보냈던 name1=value1&name2=value2 가 body에 담겨 보내진다 생각하면 된다.

POST 로 데이터를 전송할 때 길이 제한이 따로 없어 용량이 큰 데이터를 보낼 때 사용하거나 GET처럼 데이터가 외부적으로 드러나는건 아니라서 보안이 필요한 부분에 많이 사용된다.

( 하지만 데이터를 암호화하지 않으면 body의 데이터도 결국 볼 수 있는건 똑같다. )

POST를 통한 데이터 전송은 보통 HTML form 을 통해 서버로 전송된다.

사용목적 : GET은 서버의 리소스에서 데이터를 요청할 때, POST는 서버의 리소스를 새로 생성하거나 업데이트할 때 사용한다.

DB로 따지면 GET은 SELECT 에 가깝고, POST는 Create 에 가깝다고 보면 된다.


요청에 body 유무 : GET 은 URL 파라미터에 요청하는 데이터를 담아 보내기 때문에 HTTP 메시지에 body가 없다. POST 는 body 에 데이터를 담아 보내기 때문에 당연히 HTTP 메시지에 body가 존재한다.


멱등성 (idempotent) : GET 요청은 멱등이며, POST는 멱등이 아니다.


멱등이란?
멱등의 사전적 정의는 연산을 여러 번 적용하더라도 결과가 달라지지 않는 성질을 의미한다.

GET은 리소스를 조회한다는 점에서 여러 번 요청하더라도 응답이 똑같을 것 이다. 반대로 POST는 리소스를 새로 생성하거나 업데이트할 때 사용되기 때문에 멱등이 아니라고 볼 수 있다. (POST 요청이 발생하면 서버가 변경될 수 있다.)



출처: https://noahlogs.tistory.com/35 [인생의 로그캣]
*/