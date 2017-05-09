

function updataInfo(form) {
    const auth = firebase.auth();
    const user = auth.currentUser;
    let arr = ['username', 'job', 'age', 'photoUrl', 'descriptions'];
    let obj = {};
    arr.forEach(function(key) {
        obj[key] = form[key].value;
    });

    if (user) {

        obj.uid = user.uid;
        let obj2 = {};
        obj2[`/user/${user.uid}`] = obj;

        firebase.database().ref().update(obj2)
            .then(function() {
                alert("更新成功");
                updateUserView(user);
            })
            .catch(function(error) {
                alert(error.message);
            });
    } else {
        alert("ni 沒有登入");
    }
}


function updateUserView(user) {
    const auth = firebase.auth();
    let arr = ['username', 'job', 'age', 'photoUrl', 'descriptions'];

    if (!user) {
        arr.forEach(function(key) {
            window[key].value = '';
            if (window[key + '_e']) {
                window[key + '_e'].textContent = '';
            }
        });

        photo_e.src = '';
        email_e.textContent = '';
        email.value = '';
        password.value = '';
        return
    };

    return firebase.database()
        .ref(`/user/${user.uid}`)
        .once(`value`)
        .then(x => x.val())
        .then(function(info) {
            if (!user) return;
            arr.forEach(function(key) {
                window[key].value = info[key] || '';
                if (window[key + '_e']) {
                    window[key + '_e'].textContent = info[key] || '';
                }
            });

            photo_e.src = info.photoUrl;
            email_e.textContent = user.email;
        });
}
function sendMessage(form){
  const auth = firebase.auth();
  const UID = auth.currentUser.uid;
  if(!UID){
    alert("ni 沒有登入");
    return false;
  }
  let messageText = form.message.value;

  if(!messageText.trim()){
      alert("Type somthing.");
      return false;
  }

  let messageRef = firebase.database().ref('message');
  let childRef = messageRef.push();
  form.message.value="";
  childRef.set({
    uid: UID,
    message:messageText
  });
}

function receivedMessage(message, user){
  const auth = firebase.auth();
  const UID = auth.currentUser.uid;
  const msgList = document.querySelector("#messageList");
  let msgDiv = document.createElement('div');
  let avater = new Image();
  let name = document.createElement('div');
  let msg =  document.createElement('div');

  msgDiv.classList.add('message-container');
  avater.classList.add('avater');
  name.classList.add('name');
  msg.classList.add('msg');

  user = user || {
      username : "NONE",
      photoUrl : 'image/default.jpg',
  };

  user.photoUrl = user.photoUrl || 'image/default.jpg';
  if(UID===message.uid){
    msgDiv.classList.add('self');
  }

  avater.src = user.photoUrl;
  name.textContent = user.username;
  msg.textContent = message.message;

  msgDiv.appendChild(avater);
  msgDiv.appendChild(name);
  msgDiv.appendChild(msg);

  msgList.appendChild(msgDiv);
  msgList.scrollTop = msgList.scrollHeight + 000;
}

firebase.auth().onAuthStateChanged(function(user) {
    updateUserView(user);
    if (user) {
        let userMap = {};
        const messageRef = firebase.database().ref('message');

        messageRef.limitToLast(10).off('child_added');
        messageRef.limitToLast(10).on('child_added', function(s){
            let msg = s.val();
            if(!msg) return;
            if(userMap[msg.uid]){
              receivedMessage(msg, userMap[msg.uid]);
            }else{
              firebase.database()
                  .ref(`/user/${user.uid}`)
                  .once(`value`)
                  .then(x => x.val())
                  .then(function(info) {
                      userMap[msg.uid] = info;

                      receivedMessage(msg, userMap[msg.uid]);
                  });
            }
        });
    } else {

        const msgList = document.querySelector("#messageList");
        msgList.innerHTML = '';
        const messageRef = firebase.database().ref('message');
        messageRef.limitToLast(10).off('child_added');
    }
});

photo.onchange = function() {
    const auth = firebase.auth();
    const user = auth.currentUser;
    if (!this.value) {
        photoUrl.value = '';
        return;
    }
    if (user) {
        let file = this.files[0];
        let sRef = firebase.storage().ref(`/user/${user.uid}.jpg`);
        let meta = {
            contentType: file.type
        };

        sRef.put(file, meta)
            .then(function(s) {
                photoUrl.value = s.metadata.downloadURLs[0];
            })
            .catch(function(error) {
                alert(error.message);
            });
    } else {
        alert("ni 沒有登入");
    }
};
//----------------------------------------------------------------
