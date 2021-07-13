const socket = io('/');
const videoGrid = document.getElementById('video-grid')
var myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
var msg=document.getElementById('message')
var output=document.getElementById('output')
feedback=document.getElementById('feedback')
btn = document.getElementById('send')

let myVideoStream;
//function Start_Call(){
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia


navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream=stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream);
    console.log("uder connected ", userId)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  console.log("user disconnected" , userId)
})



myPeer.on("call", function (call) {
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream);
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});









myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  console.log("calling....")
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log("user video stream")
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)

}



/*handling chat*/
btn.addEventListener('click', function(){
  socket.emit('chat', {
      msg: message.value,
     
  });
  console.log("chat emitted")
  message.value = "";
});
msg.addEventListener('keypress',function(){
  socket.emit('typing.....',user_name.value);
})
socket.on('chat',function(data){
  feedback.innerHTML=' ';
  output.innerHTML+='<p><strong><i>' + user +': </i></strong>'+data.msg +'</p>'
});
socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + user + ' is typing a message...</em></p>';
});

function openchat() {
  // document.getElementById("chat-box").style.width="100%";
   var x=document.getElementById("chat-area").style.width="340px"
   
   document.getElementById("chat-area").style.marginLeft="1010px";
   var y= document.getElementById("main-area").style.width="850px"

 
  
  
 }




function openNav() {
  // document.getElementById("chat-box").style.width="100%";
   var x=document.getElementById("chat-area").style.width="90%"
   x.style.marginLeft="140px";
  
   
  
 }
 
 /* Set the width of the side navigation to 0 */
 function closeNav() {
   var ele=document.getElementById("chat-area")
   ele.style.width= "0px";
   ele.style.marginLeft= "140px";
   document.getElementById("main-area").style.marginLeft="165px";
   document.getElementById("main-area").style.width="88%";

 }
 /*main area- video call*/
 function openMain() {
  
   document.getElementById("main-area").style.width="88%"
   document.getElementById("main-area").style.height="100%";
   
  
 }
 
 /* Set the width of the side navigation to 0 */
 function closeMain() {
   var ele=document.getElementById("main-area")
   ele.style.width= "0px";
   ele.style.height="0px";
 }


function playStop() {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};
function setPlayVideo () {
  const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

function setStopVideo () {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};


function muteUnmute (){
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};
function setUnmuteButton() {
  const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
function setMuteButton () {
  const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};

 //link to invite people
 function InvitePeople(){
  prompt(
"Copy this link and send it to people you want to meet with",
window.location.href
)}
//displaying user name
function show_Name(){
prompt(
 "user Name :" ,user
)
}
