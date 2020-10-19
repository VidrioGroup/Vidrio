const usernameInput = document.getElementById('username');
const button = document.getElementById('join_leave');
const shareScreen = document.getElementById('share_screen');
const container = document.getElementById('container');
const count = document.getElementById('count');
let socket = io.connect("http://0.0.0.0:5000/");
let connected = false;
let room;
let screenTrack;

function addLocalVideo() {
    Twilio.Video.createLocalVideoTrack().then(track => {
        let video = document.getElementById('local').firstChild;
        let trackElement = track.attach();
        //trackElement.addEventListener('click', () => { zoomTrack(trackElement); });
        video.appendChild(trackElement);
    });
};

function connectButtonHandler(event) {
    event.preventDefault();
    if (!connected) {
        let username = usernameInput.value;
        if (!username) {
            alert('Enter your name before connecting');
            return;
        }
        button.disabled = true;
        button.innerHTML = 'Connecting...';
        connect(username).then(() => {
            button.innerHTML = 'Leave call';
            button.disabled = false;
            shareScreen.disabled = false;
        }).catch(() => {
            alert('Connection failed. Is the backend running?');
            button.innerHTML = 'Join call';
            button.disabled = false;
        });
    }
    else {
        disconnect();
        button.innerHTML = 'Join call';
        connected = false;
        shareScreen.innerHTML = 'Share screen';
        shareScreen.disabled = true;
    }
};

function connect(username) {
    let promise = new Promise((resolve, reject) => {
        // get a token from the back end
        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({'username': username})
        }).then(res => res.json()).then(data => {
            // join video call
            return Twilio.Video.connect(data.token);
        }).then(_room => {
            room = _room;

            //console.log(room.participants);

            room.participants.forEach(participantConnected);
            room.on('participantConnected', participantConnected);
            room.on('participantDisconnected', participantDisconnected);
            connected = true;
            updateParticipantCount();
            resolve();
        }).catch(() => {
            reject();
        });
    });
    return promise;
};

function updateParticipantCount() {
    if (!connected)
        count.innerHTML = 'Disconnected.';
    else
        count.innerHTML = (room.participants.size + 1) + ' participants online.';
};

function participantConnected(participant) {
    let participantDiv = document.createElement('div');
    participantDiv.setAttribute('id', participant.sid);
    participantDiv.setAttribute('class', 'participant');

    let tracksDiv = document.createElement('div');
    participantDiv.appendChild(tracksDiv);

    let labelDiv = document.createElement('div');
    labelDiv.setAttribute('class', 'label');
    labelDiv.innerHTML = participant.identity;

    // set it up so you can drag users around
    participantDiv.setAttribute('draggable', 'true');
    participantDiv.setAttribute('ondragstart', 'drag(event)');

    participantDiv.appendChild(labelDiv);

    container.appendChild(participantDiv);

    participant.tracks.forEach(publication => {
        if (publication.isSubscribed)
            trackSubscribed(tracksDiv, publication.track);
    });
    participant.on('trackSubscribed', track => trackSubscribed(tracksDiv, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    updateParticipantCount();
};

function participantDisconnected(participant) {
    document.getElementById(participant.sid).remove();
    updateParticipantCount();
};

function trackSubscribed(div, track) {
    let trackElement = track.attach();
    //trackElement.addEventListener('click', () => { zoomTrack(trackElement); });
    div.appendChild(trackElement);
};

function trackUnsubscribed(track) {
    track.detach().forEach(element => {
        if (element.classList.contains('participantZoomed')) {
            zoomTrack(element);
        }
        element.remove()
    });
};

function disconnect() {
    room.disconnect();
    while (container.lastChild.id != 'local')
        container.removeChild(container.lastChild);
    button.innerHTML = 'Join call';
    connected = false;
    updateParticipantCount();
};

function shareScreenHandler() {
    event.preventDefault();
    // if screenTrack is null:
    if (!screenTrack) {
        navigator.mediaDevices.getDisplayMedia().then(stream => {
            screenTrack = new Twilio.Video.LocalVideoTrack(stream.getTracks()[0]);
            room.localParticipant.publishTrack(screenTrack);
            screenTrack.mediaStreamTrack.onended = () => { shareScreenHandler() };
            console.log(screenTrack);
            shareScreen.innerHTML = 'Stop sharing';
        }).catch(() => {
            alert('Could not share the screen.')
        });
    }
    else {
        room.localParticipant.unpublishTrack(screenTrack);
        screenTrack.stop();
        screenTrack = null;
        shareScreen.innerHTML = 'Share screen';
    }
};

function zoomTrack(trackElement) {
    if (!trackElement.classList.contains('participantZoomed')) {
        // zoom in
        container.childNodes.forEach(participant => {
            if (participant.className == 'participant') {
                participant.childNodes[0].childNodes.forEach(track => {
                    if (track === trackElement) {
                        track.classList.add('participantZoomed')
                    }
                    else {
                        track.classList.add('participantHidden')
                    }
                });
                participant.childNodes[1].classList.add('participantHidden');
            }
        });
    }
    else {
        // zoom out
        container.childNodes.forEach(participant => {
            if (participant.className == 'participant') {
                participant.childNodes[0].childNodes.forEach(track => {
                    if (track === trackElement) {
                        track.classList.remove('participantZoomed');
                    }
                    else {
                        track.classList.remove('participantHidden');
                    }
                });
                participant.childNodes[1].classList.remove('participantHidden');
            }
        });
    }
};
/*
participant.onmousedown = function(event) {
    let shiftX = event.clientX - participant.getBoundingClientRect().left;
    let shiftY = event.clientY - participant.getBoundingClientRect().top;
  
    participant.style.position = 'absolute';
    participant.style.zIndex = 1000;
    document.body.append(ball);
  
    moveAt(event.pageX, event.pageY);
  
    // moves the participant at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      participant.style.left = pageX - shiftX + 'px';
      participant.style.top = pageY - shiftY + 'px';
      socket.emit("movingToChair", {object: participant, left: participant.style.left, top: participant.style.top});
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
      
      participant.hidden = true; 
      let dropOntoObject = document.elementFromPoint(event.clientX, event.clientY);
      participant.hidden = false;
      if (!dropOntoObject) return;
      let dropParticipant = dropOntoObject.closest('.droppable'); 
    }
  
    // move the participant on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // drop the participant, remove unneeded handlers
    participant.onmouseup = function() {
        //
    };
};
*/
/*
participant.ondragstart = function() {
    return false;
};
function drop(ev) {
    document.removeEventListener('mousemove', onMouseMove);
    participant.onmouseup = null;
    participant.removeAttribute("title");
    ev.target.appendChild(participant);
    participant.setAttribute("title", ev.target.className);
    console.log(participant.title);
    socket.emit("atNewChair", {particip: participant, event: ev});
}
socket.on("movingToChair", function(data) {
    data.participant.style.left = data.left;
    data.participant.style.top = data.top;
});
socket.on("atNewChair", function(data) {
    data.particip.setAttribute("title", data.event.target.className);
});
*/
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let participant = document.getElementById(data);

    let ogTable = participant.getAttribute("title");
    participant.removeAttribute("title");
    participant.setAttribute("title", ev.target.id);
    ev.target.appendChild(participant);
    let nextTable = participant.getAttribute("title");

    //let rect = document.getElementById(data).getBoundingClientRect();
    // it allows for a lot more connection and human-to-human

    //socket.emit("movedToChair", {participan: participant, event: ev, rectangle: rect});
    
    //room.participants.forEach(addLocalToRemoteScreens);
}

socket.on("movedToChair", function(data) {
    data.participant.style.position = 'absolute';
    data.participant.style.zIndex = 1000;

    let shiftX = data.event.clientX - data.rectangle.left;
    let shiftY = data.event.clientY -data.rectangle.top;

    data.participant.style.left = data.event.pageX - shiftX + 'px';
    data.participant.style.top = data.event.pageY - shiftY + 'px';

    data.participant.setAttribute("title", data.event.target.className);
    data.event.target.appendChild(data.participant);
});

/*
function addLocalToRemoteScreens(participant) {
    let participantDiv = document.getElementById(participant.sid);
    //let participantDiv = document.createElement('div');
    //participantDiv.setAttribute('id', participant.sid);
    //participantDiv.setAttribute('class', 'participant');
    participantDiv.removeAttribute("title");
    let tableDiv = document.createElement('div');
    tableDiv.setAttribute('class', 'label');
    tableDiv.innerHTML = participant.identity;
    participantDiv.appendChild(tableDiv);
    container.appendChild(participantDiv);
    participant.tracks.forEach(publication => {
        if (publication.isSubscribed)
            trackSubscribed(tracksDiv, publication.track);
    });
    participant.on('trackSubscribed', track => trackSubscribed(tracksDiv, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);
    updateParticipantCount();
}; */



addLocalVideo();
button.addEventListener('click', connectButtonHandler);
shareScreen.addEventListener('click', shareScreenHandler);