let socket = io()

// 접속 되었을 때 실행

/* 접속 시 실행 */
socket.on('connect',function() {
    let name = prompt('반갑습니다!','')

    /* 이름이 빈칸인 경우 */
    if(!name) {
        name = '익명'
    }

    let input = document.querySelector('.total')
    input.innerText = '접속중';

    /* 서버에 새로운 유저가 왔다고 알림 */
    socket.emit('newUser', name)
})

socket.on('update', function(data) {
    console.log(`${data.name}: ${data.message}`)
})

// 메시지 전송 함수

function send(e) {
    // 입력되어있는 데이터 가져오기
    let message = document.querySelector('.chat-input').value;

    // 데이터 가져오기 빈칸으로 변경

    document.querySelector('.chat-input').value = '';

    // 서버로 send 이벤트 전달 + 데이터와 함께

    socket.emit('message',{type: 'message', message: message})
}

