const url = "https://tarmeezacademy.com/api/v1";

// Satrt Posts Requstes

function createPostBtnClicked() {
    let postId = document.getElementById("post-id-input").value;
    let isCreate = postId == null || postId == "";


    let title = document.getElementById("title-input").value;
    let body = document.getElementById("body-input").value;
    let image = document.getElementById("img-input").files[0];
    let token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);

    const headers = {
        // "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    let baseUrl = ``;

    if (isCreate) {
        baseUrl = `${url}/posts`;
    } else {
        formData.append("_method", "put");
        baseUrl = `${url}/posts/${postId}`;
    }
    toggleLoeader(true);
    axios.post(`${baseUrl}`, formData, {
        headers: headers
    })
        .then(response => {
            const modal = document.getElementById("createPost-modal");
            const modalInstabce = bootstrap.Modal.getInstance(modal);
            modalInstabce.hide();
            showAlert("post compelete", "success");
            setTimeout("location.reload(true);", 5000);
        })
        .catch(error => {
            let e = error.response.data.message;
            showAlert(e, "danger");
        })
        .finally(() => {
            toggleLoeader(false);
        })

}

function editPostBtnClicked(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj));
    console.log(post);

    document.getElementById("post-id-input").value = post.id;
    document.getElementById("createPostModal").innerHTML = "Edit Post";
    document.getElementById("title-input").value = post.title;
    document.getElementById("body-input").value = post.body;
    document.getElementById("createBtn").innerHTML = "Update";
    let postModal = new bootstrap.Modal(document.getElementById("createPost-modal"));
    postModal.toggle();
}

function deletePostBtnClicked(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj));
    console.log(post);

    document.getElementById("delete-post-id-input").value = post.id;
}

function confirmPostDelete() {

    const postId = document.getElementById("delete-post-id-input").value;
    console.log(postId);
    let token = localStorage.getItem("token");
    const headers = {
        // "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    toggleLoeader(true);
    axios.delete(`${url}/posts/${postId}`, {
        headers: headers
    })
        .then(response => {
            console.log(response);
            const modal = document.getElementById("deletePostModal");
            const modalInstabce = bootstrap.Modal.getInstance(modal);
            modalInstabce.hide();
            showAlert("post deleted successfully", "success");
            setTimeout("location.reload(true);", 0);
        })
        .catch(error => {
            let e = error.response.data.message;
            showAlert(e, "danger");
        })
        .finally(() => {
            toggleLoeader(false);
        })
}
// End Posts Requstes



// Start Auth Functions
function logInBtnClicked() {
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

    const bodyParams = {
        "username": username,
        "password": password
    }
    toggleLoeader(true);
    axios.post(`${url}/login`, bodyParams)
        .then(response => {
            token = response.data.token;
            user = JSON.stringify(response.data.user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);

            const modal = document.getElementById("login-modal");
            const modalInstabce = bootstrap.Modal.getInstance(modal);
            modalInstabce.hide();
            showAlert("Logged In Success !", "success");
            setupUI();
        })
        .catch(error => {
            let e = error.response.data.message;
            showAlert(e, "danger");
        })
        .finally(() => {
            toggleLoeader(false);
        })
}
function RegisterBtnClicked() {
    const username = document.getElementById("register-username-input").value;
    const password = document.getElementById("register-password-input").value;
    const name = document.getElementById("name-input").value;
    const image = document.getElementById("profile-input").files[0];


    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("image", image);

    const headers = {
        "Content-Type": "multipart/form-data",
    }
    toggleLoeader(true);
    axios.post(`${url}/register`, formData, {
        headers: headers
    })
        .then(response => {
            console.log(response.data);
            token = response.data.token;
            user = JSON.stringify(response.data.user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);

            const modal = document.getElementById("register-modal");
            const modalInstabce = bootstrap.Modal.getInstance(modal);
            modalInstabce.hide();
            showAlert("New User Registred successfully", "success");
            setupUI();
        })
        .catch(error => {
            let e = error.response.data.message;
            showAlert(e, "danger");
        })
        .finally(() => {
            toggleLoeader(false);
        })
}
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    showAlert("Logged out Success !", "success");
    setupUI();
}
function showAlert(messageAlert, messageType) {
    const alertPlaceholder = document.getElementById("success-alert");
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    appendAlert(messageAlert, messageType);

    // todo: hide the alert
    setTimeout(() => {
        // const alert = bootstrap.Alert.getOrCreateInstance('#success-alert');
        // const modal = document.getElementById("success-alert");
        // const modalInstabce = bootstrap.Modal.getInstance(modal);
        // modalInstabce.hide();
    }, 2500);
}

function profileCliked() {
    const user = getCurrentUser();
    const userId = user.id;
    location = `profile.html?userId=${userId}`;
}

function setupUI() {
    token = localStorage.getItem("token");
    let loginContainer = document.getElementById("logged-in-container");
    let logoutContainer = document.getElementById("logout-container");
    let addPostBtn = document.getElementById("addPostBtn");
    let userProfile = document.getElementById("main");
    if (token == null) { // user is gust (not logged in)
        loginContainer.style.setProperty("display", "flex", "important");
        logoutContainer.style.setProperty("display", "none", "important");
        // userProfile.style.setProperty("display", "none", "important");

        if (addPostBtn != null) {
            addPostBtn.style.setProperty("display", "none", "important");
        }

    } else { // for logged in user
        loginContainer.style.setProperty("display", "none", "important");
        logoutContainer.style.setProperty("display", "flex", "important");
        // userProfile.style.setProperty("display", "block", "important");


        if (addPostBtn != null) {
            addPostBtn.style.setProperty("display", "block", "important");
        }

        const user = getCurrentUser();
        document.getElementById("nav-username").innerHTML = user.username;
        document.getElementById("nav-profile").src = user.profile_image;
        // console.log(user);
    }
}
setupUI();

function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");

    if (storageUser != null) {
        user = JSON.parse(storageUser);
    }

    return user;
}
// End Auth Functions



function toggleLoeader(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = "visible";
    } else {
        document.getElementById("loader").style.visibility = "hidden";
    }
    // return show;
}