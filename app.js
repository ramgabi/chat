
// 설치한 express, socket.io, 기본 내장 모듈 불러오기
const express = require('express'),
      socket = require('socket.io'),
      http =require('http')
      fs = require('fs')

// express 객체 생성
const app = express()

// express http 서버 생성
const server = http.createServer(app)

// 생성된 서버를 socket.io에 바인딩
const io = socket(server)

app.use('/css',express.static('./html/css'))
app.use('/js',express.static('./html/js'))
app.use('/img',express.static('./html/css/img'))

// get 방식으로 / 경로에 접속하면 실행됨

app.get('/', function (req, res) {
    fs.readFile('./html/index.html',function(err,data) {
        if(err) {
            res.send('에러')
            return
        }

        res.writeHead(200, {'content-Type':'text/html'})
        res.write(data)
        res.end()
    })
})

io.sockets.on('connection',function(socket) {

    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.on('newUser', function(name) {
        console.log(name + '님이 접속하였습니다.')

        /*  소켓에 이름 저장 */
        socket.name = name

        /* 모든 소켓에게 전송 */
        io.sockets.emit('update', {type: 'connect', name:'SERVER',maessage:name + '님이 접속하였습니다.'})
    })

    /* 전송한 메시지 받기 */
    socket.on('message', function(data) {
        /* 받은 데이터에 누가 보냈는지 이름을 추가 */
        data.name = socket.name

        console.log(data)

        /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.emit('update',data);
    })

    
/*     socket.on('send',function(data) {
        console.log('전달된 메시지:',data.msg)
    }) */

    /* 접속 종료 */
    socket.on('disconnect',function() {
        console.log(socket.name + '님이 나가셨습니다')  
        
        /* 나간 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.emit('update', {tupe: 'disconnect', name:'SERVER',message: socket.name + '님이 나가셨습니다.'})
    })
})

//서버를 8080 포트로 listen
server.listen(8080, function() {
    console.log('서버 실행중..')
})