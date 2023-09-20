getPosts();
let postsContainer = document.getElementById("posts");
let currentPage = 1;
let lastPage = 1;


function userClicked(userId) {
    location = `profile.html?userId=${userId}`;
}

function getPosts(page = 1) {
    // turn on the toggleLoader berfore the request
    toggleLoeader(true);
    axios.get(`${url}/posts?limit=5&page=${page}`)
        .then(response => {
            // mean here the response is finished, so hide the toggleLoader
            const posts = response.data.data;
            let tags = response.data.data.tags;
            lastPage = response.data.meta.last_page;
            console.log(lastPage);
            for (let post of posts) {
                const author = post.author;

                // show or hide (edit) button
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;
                let editButtonContent = ``;
                // let deleteButtonContent = ``;

                if (isMyPost) {
                    editButtonContent = `
                    <button class="btn btn-danger delete1"
                            style="float: right; position: relative; top: 10px; right: 10px;"
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
                    <div class="card shadow boxCard" >
                        <div class="card-header">

                            <span onclick="userClicked(${author.id})">
                                <img src="${author.profile_image}" alt="" class="img-thumbnail rounded-circle"
                                    style="width: 60px; height: 60px;">
                                <h5 class="d-inline">${author.username}</h5>
                            </span>
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
                postsContainer.innerHTML += content;

                const currentPost = `post-tags-${post.id}`;
                for (tags of post.tags) {
                    document.getElementById(currentPost).innerHTML += ` 
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
                        ${tags.name}
                    </button>`

                    console.log(tags.name);
                }

                // createComments(author.username, postTitle, post.body, author.profile_image, post.image, post.comments_count);
            }

        })
        .catch(error => {
            let e = error.response.data.message;
            showAlert(e, "danger");
        })
        .finally(() => {
            toggleLoeader(false);
        })
}


function showPostDetails(postId) {
    location = `postDetails.html?postId=${postId}`;
}

function addBtnClicked() {
    // data-bs-toggle="modal" data-bs-target="#createPost-modal"

    document.getElementById("post-id-input").value = "";
    document.getElementById("createPostModal").innerHTML = "Create A New Post";
    document.getElementById("title-input").value = "";
    document.getElementById("body-input").value = "";
    document.getElementById("createBtn").innerHTML = "Create";
    let postModal = new bootstrap.Modal(document.getElementById("createPost-modal"));
    postModal.toggle();
}


// Start infinit scroll
window.addEventListener("scroll", () => {
    const endOfPage = window.innerHeight + Math.floor(window.scrollY) >= document.body.scrollHeight;
    // console.log(window.innerHeight, Math.floor(window.scrollY), document.body.scrollHeight);
    // console.log(endOfPage);

    if (endOfPage && currentPage < lastPage) {
        getPosts(currentPage + 1);
        currentPage++;
    }

});
// End infinit scroll

// Start Review Btn Modal

function feedbackBtnClicked() {
    const reviewBody = document.getElementById("review-body").value;
    const reviewImage = document.getElementById("review-img-input").files[0];
    let formData = new FormData();
    formData.append("image", reviewImage);
    formData.append("body", reviewBody);

    const headers = {
        // "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    toggleLoeader(true);
    axios.post(`${url}/posts`, formData, {
        headers: headers
    })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            let e = error.response.data.message;
            showAlert(e, "danger");
        })
        .finally(() => {
            toggleLoeader(false);
        })
}
// End Review Btn Modal
