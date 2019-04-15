const handlePost = (e) => {
    e.preventDefault();
    
    $("#postMessage").animate({width:'hide'}, 350);
    
    if ($("#pContent").val() === '') {
        handleError("Post content is required");
        return false;
    }
    
    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function() {
        loadPostsFromServer();
    });
    
    return false;
};

const PostForm = (props) => {
    return (
        <form id="postForm" 
              onSubmit={handlePost}
              name="postForm"
              action="/maker"
              method="POST"
        >
            <input id="pTitle" type="text" name="title" placeholder="Title"/>
            <textarea id="pContent" type="text" name="post" placeholder="Your text here"></textarea>
            <input id="pTag" type="text" name="tag" placeholder="tag, something, like, this"/>
            <input type="hidden" id="csrfVal" name="_csrf" value={props.csrf} />
            <input id="postSubmit" type="submit" value="Post" />
        </form>
    );
};

// Delete Posts
const handleDelete = (e, post) => {
    
    //NEVER FORGET
    e.preventDefault();

    console.log($(`#${post.title}deleteForm`).serialize() + document.querySelector("#csrfVal").value);
    
    let postSerialize = $(`#${post.title}deleteForm`).serialize() + document.querySelector("#csrfVal").value;
    
    //console.log(postSerialize);
    
    sendAjax('POST', $(`#${post.title}deleteForm`).attr("action"), postSerialize, function() {
        loadPostsFromServer();
    });
    
    return false;
};

const PostList = function(props) {
    if(props.posts.length === 0) {
        return (
            <div className="postList">
            </div>
        );
    }
    
    const postNodes = props.posts.map(function(post) {
        
        let tagStr = post.tag.split(",");
        return (
            <div key={post._id} className="post">
                <img src="/assets/img/domoface.jpeg" alt="post face" className="postFace" />
                <h3 className="postTitle"> {post.title} </h3>
                <p id="postContent"> {post.post} </p><br>
                </br>
                <p id="postTags"> # {tagStr}</p>
                
                <form id={`${post.title}deleteForm`} 
                      onSubmit={(e) => handleDelete(e, post)}
                      name="deleteForm"
                      action="/delete"
                      method="POST"
                >
                    <input type="hidden" name="postID" value={post._id} />
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input id="deleteButton" type="submit" value="Delete"/>
                </form>
            </div>
        );
    });
        
    return (
        <div className="postList">
            {postNodes}
        </div>
    );
};

// Password Change
const handleChangePW = (e) => {
    e.preventDefault();
    
    $("#postMessage").animate({width:'hide'}, 350);
    
    if($("#oldPass").val()==='' || $("#pass").val()==='' || $("#pass2").val()===''){
        handleError("All fields are required");
        return false;
    }
    
    if($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords do not match");
        return false;
    }
    
    sendAjax('POST',$("#changePWForm").attr("action"), $("#changePWForm").serialize(), redirect);
    return false;
};

// Password Change Form
const ChangePWForm = (props) => {
    return (
        <form id="changePWForm" 
            onSubmit={handleChangePW}
            name="changePWForm"
            action="/changePW"
            method="POST"
            className="changePWForm"
        >
            <h3 className="formTitle">CHANGE PASSWORD</h3>
            <input id="oldPass" type="password" name="oldPass" placeholder="current password"/>
            <input id="pass" type="passoword" name="pass" placeholder="new password"/>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="submit" id="pwSubmit" value="Change Password" />
        </form>
    );
};

// Site About
const AboutWindow = () => {
  return(
        <div id="info">
            <h3 className="formTitle">What can you do here?</h3>
            <p id="desc">
                Going through existential crisis and can't sleep at ungodly hours at night? Worry not, you can post your thoughts and rants on here... For the viewing of no one but your own!
            </p>
        </div>
  );
};

// Purchasable Themes
const ThemesWindow = () => {
    return(
        <div id="themes">
            <h3 className="formTitle">THEMES</h3>
            <div id="thm1">
                <p>Autumn Theme</p>
                <p className="purchase">PURCHASE</p>
            </div>
            <div id="thm2">
                <p>Winter Theme</p>
                <p className="purchase">PURCHASE</p>
            </div>
            <div id="thm3">
                <p>Summer Theme</p>
                <p className="purchase">PURCHASE</p>
            </div>
        </div>
    );
};

const loadPostsFromServer = () => {
    sendAjax('GET', '/getPosts', null, (data) => {
        ReactDOM.render(
        <PostList posts={data.posts} />, document.querySelector("#posts")
        );
    });
};

// Windows For Different Pages
const createPasswordChangeWindow = (csrf) => {
    ReactDOM.render(
        <ChangePWForm csrf={csrf} />, document.querySelector("#posts")
    );
};

const createAboutWindow = () => {
    ReactDOM.render(
        <AboutWindow />, document.querySelector("#posts")
    );
};

const createThemesWindow = () => {
    ReactDOM.render(
        <ThemesWindow />, document.querySelector("#posts")
    );
};

const createMainWindow = (csrf) => {
    ReactDOM.render(
        <PostForm csrf={csrf} />, document.querySelector("#makePost")
    );
    
    ReactDOM.render(
        <PostForm posts={[]} csrf={csrf} />, document.querySelector("#posts")
    );
};

const setup = function(csrf) {
    const changePWButton = document.querySelector("#changePWButton");
    const aboutButton = document.querySelector("#aboutButton");
    const themesButton = document.querySelector("#themesButton");
    
    changePWButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPasswordChangeWindow(csrf);
        return false;
    });
    
    aboutButton.addEventListener("click", (e) => {
        e.preventDefault();
        createAboutWindow();
        return false;
    });
    
    themesButton.addEventListener("click", (e) => {
        e.preventDefault();
        createThemesWindow();
        return false;
    });
    
    createMainWindow(csrf);
    loadPostsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken(); 
});