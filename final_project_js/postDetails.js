const urlParams = new URLSearchParams(location.search);
const id = urlParams.get("postId");
console.log(id);

function getPost() {
    let currentPost = document.getElementById("currentPost");
    toggleLoeader(true);
    axios.get(`${url}/posts/${id}`)
        .then(response => {
            // post info
            let post = response.data.data;
            let body = post.body;
            let comments = post.comments;
            let bodyImg = post.image;
            let title = post.title;

            // user info
            let profileImage = post.author.profile_image;
            let userName = post.author.username;

            // comment info
            let commentsCount = post.comments_count;

            let postTitle = "";
            if (post.title != null) {
                postTitle = post.title;
            }

            let commentsContent = ``;

            for (let comment of comments) {
                commentsContent += `
                        <!-- Start Comment -->
                            <div class="comment mb-3">
                                <div id="userDetails" class="mb-2">
                                    <img src="${comment.author.profile_image}" class="img-thumbnail rounded-circle"
                                        style="width: 60px; height: 60px;" alt="">
                                    <b>${comment.author.username}</b>
                                </div>

                                <div id="userAction" class="p-3 rounded-4"
                                    style="background-color: rgb(236, 235, 235); width: fit-content; max-width: 100%">
                                    <p style="font-weight: 500; margin-bottom: 0;">
                                        ${comment.body}
                                    </p>
                                </div>
                            </div>
                            <!-- End Comment -->
                        `;
            }
            currentPost.innerHTML = "";
            let postContent = `
                        <h2>
                        <span>${userName}'s</span>
                        Post
                        </h2>
                    <div class="card shadow boxCard">
                        <div class="card-header">
                        <img src="${profileImage}" alt="" class="img-thumbnail rounded-circle"
                        style="width: 60px; height: 60px;">
                    <h5 class="d-inline">${userName}</h5>
                    </div>
                        <div class="card-body">
                        <img src="${bodyImg}" alt="" class="w-100">
                        <h6 style="color: #777" class="mt-3">${post.created_at}</h6>
                        <h5>${title}</h5>
                        <p>${body}</p>
                        <hr>
                        <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                            </svg>
                            <span>
                                (${commentsCount}) Comments
                            </span>
                    </div>
                    <hr>
                    <div id="commentsInfo">
                        ${commentsContent}
                    </div>

                    <!-- Start Add Comment -->
                        <div id="addComment" class="d-flex">
                                <input type="text" id="comment-input" class="rounded" placeholder="Add Comment">
                                <button type="button" class="btn btn-outline-primary" id="sendComment"
                                    style="width: 11%;" onclick="createCommentClickd()">Send</button>
                        </div>
                        <!-- End Add Comment -->
                </div>
            </div>
        </div>
    </div>
        </div>
    `;
            currentPost.innerHTML = postContent;
            showOrHideCommentInput();
        })
        .catch(error => {
            console.log("Error " + error);
        })
        .finally(() => {
            toggleLoeader(false);
        })
}
getPost();


// sendComment.addEventListener("click", createComment);
let sendComment = document.getElementById("sendComment");

function createCommentClickd() {
    // alert("aaaa");
    let bodyComment = document.getElementById("comment-input").value;
    let token = localStorage.getItem("token");


    const bodyParams = {
        "body": bodyComment
    }
    const headers = {
        "authorization": `Bearer ${token}`
    }
    axios.post(`${url}/posts/${id}/comments`, bodyParams, {
        headers: headers
    })
        .then(response => {
            console.log(response);
            showAlert("Comment Created Successfully", "success");
            getPost();
        })
        .catch(error => {
            let e = error.response.data.message;
            console.log("Error " + e);
            showAlert(e, "danger");
        })

    //      sendComment.onkeyup = function (e) {
    //     if (e.keyCode === 13) {
    //         createCommentClickd();
    //     }
    // }
}

function showOrHideCommentInput() {
    token = localStorage.getItem("token");
    let addComment = document.getElementById("addComment");
    if (token == null) {
        addComment.style.setProperty("display", "none", "important");
    } else {
        addComment.style.setProperty("display", "flex", "important");
    }
}