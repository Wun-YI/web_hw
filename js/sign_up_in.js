function signUp(email, password) {
    const auth = firebase.auth();
    return auth
        .createUserWithEmailAndPassword(email, password)
        .then(function(user) {
            alert('註冊完成');

            return user;
        })
        .catch(function(error) {
            alert(error.message);
        });
}

function signIn(email, password) {
    const auth = firebase.auth();
    return auth
        .signInWithEmailAndPassword(email, password)
        .then(function(user) {
            alert('登入成功');
            location.replace('./index.html')
            return user;
        })
        .catch(function(error) {
            alert(error.message);
        });
}

function signOut() {
    const auth = firebase.auth();
    return auth
        .signOut()
        .then(function(error) {
            alert('登出成功')
            location.replace('./login.html')
        });
}
//-----------------------------------------------------------------------
