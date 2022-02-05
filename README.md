# httpChat
socket.io에 대해 공부하면서 정리해볼 겸  
http만 쓸 수 있는 극한의 상황(!?)에서도 채팅이란걸 할 수 있게 예제 보면서 미니멀하게 구성해봤습니다.  
(컨셉: 해커들이 가볍게 쓸 수 있는 and 기록이 남는걸 싫어하는 사람들을 위한 채팅앱)  

## Requirements
- express
- socket.io

## Settings
config.js

## Events
- [server<-client] 'joinRoom', (userName, roomName, pw)
- [server<-client] 'leaveRoom', (userName, roomName)
- [server->client] 'room info', (currentRoom, roomList)
- [server<-client] 'chat', (roomName, msg)
- [server->client] 'chat', (msg)

