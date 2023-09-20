function getCurrentUserId() {
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("userId");
    return id;
}
const id = getCurrentUserId();
setupUI();
getUser()
getPosts();

// function profileInfo() {
//     let userInfo = JSON.parse(localStorage.getItem("user"));
//     let userName = userInfo.username;
//     let name = userInfo.name;
//     let profImage = userInfo.profile_image;
//     let commentsCount = userInfo.comments_count;
//     let postsCount = userInfo.posts_count;
//     let email = userInfo.email;
//     if (email == null) {
//         email = "there's no email";
//     } else {
//         email = userInfo.email;
//     }

//     let prfoContent = `
//     <!-- Start Main Info. -->
//         <div>
//             <div class="card shadow">
//                 <div class="card-body">
//                     <div class="row">
//                         <!-- Start User Image Col -->
//                         <div class="col-2">
//                             <img id="header-image" src=${profImage} alt=""
//                                 style="width: 100px; height: 100px;" class="rounded-circle img-thumbnail">
//                         </div>
//                         <!-- End User Image Col -->

//                         <!-- Start Username - Email - Name -->
//                         <div class="col-4 d-flex flex-column justify-content-evenly" style="font-weight: 700;">
//                             <div class="user-main-info">${email}</div>
//                             <div class="user-main-info">${name}</div>
//                             <div class="user-main-info">${userName}</div>
//                         </div>
//                         <!-- End Username - Email - Name -->

//                         <!-- Start Post & Comments Count -->
//                         <div class="col-4 d-flex flex-column justify-content-evenly">
//                             <div class="number-info">
//                                 <span>${postsCount}</span> Posts
//                             </div>

//                             <div class="number-info">
//                                 <span>${commentsCount}</span> Comments
//                             </div>
//                         </div>
//                         <!-- End Post & Comments Count -->
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <!-- End Main Info. -->
//     `;

//     document.getElementById("profInfo").innerHTML += prfoContent;
// }

// profileInfo();
function getUser() {
    toggleLoeader(true);
    axios.get(`${url}/users/${id}`)
        .then(response => {
            const user = response.data.data;

            // user info.
            document.getElementById("main-info-email").innerHTML = user.email;
            document.getElementById("main-info-name").innerHTML = user.name;
            document.getElementById("main-info-username").innerHTML = user.username;
            document.getElementById("main-info-image").src = user.profile_image;
            document.getElementById("author-posts").innerHTML = `${user.username}'s`;
            // posts & comments count
            document.getElementById("posts-count").innerHTML = user.posts_count;
            document.getElementById("comments-count").innerHTML = user.comments_count;
        })
        .catch(error => {
            let e = error.response.data.message;
            showAlert(e, "danger");
        })
        .finally(() => {
            toggleLoeader(false);
        })
}

function getPosts() {
    toggleLoeader(true);
    axios.get(`${url}/users/${id}/posts`)
        .then(response => {
            const posts = response.data.data;


            let tags = response.data.data.tags;
            document.getElementById("user-posts").innerHTML = "";
            for (let post of posts) {
                const author = post.author;
                // show or hide (edit) button
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;
                let editButtonContent = ``;
                // let deleteButtonContent = ``;

                if (isMyPost) {
                    editButtonContent = `
                    <button class="btn btn-danger"
                            style="float: right; position: relative; top: 10px; right: 10px; cursor: pointer;"
                            data-bs-toggle="modal" data-bs-target="#deletePostModal"
                            onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                    <button class="btn btn-secondary" 
                            style="float: right; position: relative; top: 10px; right: 20px;"
                            onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                            `;

                    // deleteButtonContent = `<button class="btn btn-danger" 
                    //         style="float: right; position: relative; top: 10px; right: 30px;"
                    //         data-bs-toggle="modal" data-bs-target="#deletePostModal">delete</button>`;
                }
                let postTitle = "";
                if (post.title != null) {
                    postTitle = post.title;
                }
                const content = `
            <!-- Start Post -->
                    <div class="card shadow boxCard">
                        <div class="card-header">
                            <img src="${author.profile_image}" alt="" class="img-thumbnail rounded-circle"
                                style="width: 60px; height: 60px;">
                            <h5 class="d-inline">${author.username}</h5>

                            ${editButtonContent}
                        </div>
                        <div class="card-body" onclick="showPostDetails(${post.id})">
                            <img src="${post.image}" alt="" class="w-100">
                            <h6 style="color: #777" class="mt-3">${post.created_at}</h6>
                            <h5>${postTitle}</h5>
                            <p>
                            ${post.body}
                            </p>

                            <hr>

                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pen" viewBox="0 0 16 16">
                                    <path
                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                </svg>
                                <span>
                                    (${post.comments_count}) Comments
                                </span>
                                <span id="post-tags-${post.id}">
                                
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- End Post -->
        `;
                document.getElementById("user-posts").innerHTML += content;

                const currentPost = `post-tags-${post.id}`;
                for (tags of post.tags) {
                    document.getElementById(currentPost).innerHTML += ` 
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
                        ${tags.name}
                    </button>`
                }

                // createComments(author.username, postTitle, post.body, author.profile_image, post.image, post.comments_count);
            }

        })
        .catch(error => {
            console.log("Error " + error);
        })
        .finally(() => {
            toggleLoeader(false);
        })
}