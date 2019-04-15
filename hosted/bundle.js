"use strict";

var handlePost = function handlePost(e) {
    e.preventDefault();

    $("#postMessage").animate({ width: 'hide' }, 350);

    if ($("#pContent").val() === '') {
        handleError("Post content is required");
        return false;
    }

    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function () {
        loadPostsFromServer();
    });

    return false;
};

var PostForm = function PostForm(props) {
    return React.createElement(
        "form",
        { id: "postForm",
            onSubmit: handlePost,
            name: "postForm",
            action: "/maker",
            method: "POST"
        },
        React.createElement("input", { id: "pTitle", type: "text", name: "title", placeholder: "Title" }),
        React.createElement("textarea", { id: "pContent", type: "text", name: "post", placeholder: "Your text here" }),
        React.createElement("input", { id: "pTag", type: "text", name: "tag", placeholder: "tag, something, like, this" }),
        React.createElement("input", { type: "hidden", id: "csrfVal", name: "_csrf", value: props.csrf }),
        React.createElement("input", { id: "postSubmit", type: "submit", value: "Post" })
    );
};

// Delete Posts
var handleDelete = function handleDelete(e, post) {

    //NEVER FORGET
    e.preventDefault();

    console.log($("#" + post.title + "deleteForm").serialize() + document.querySelector("#csrfVal").value);

    var postSerialize = $("#" + post.title + "deleteForm").serialize() + document.querySelector("#csrfVal").value;

    //console.log(postSerialize);

    sendAjax('POST', $("#" + post.title + "deleteForm").attr("action"), postSerialize, function () {
        loadPostsFromServer();
    });

    return false;
};

var PostList = function PostList(props) {
    if (props.posts.length === 0) {
        return React.createElement("div", { className: "postList" });
    }

    var postNodes = props.posts.map(function (post) {

        var tagStr = post.tag.split(",");
        return React.createElement(
            "div",
            { key: post._id, className: "post" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "post face", className: "postFace" }),
            React.createElement(
                "h3",
                { className: "postTitle" },
                " ",
                post.title,
                " "
            ),
            React.createElement(
                "p",
                { id: "postContent" },
                " ",
                post.post,
                " "
            ),
            React.createElement("br", null),
            React.createElement(
                "p",
                { id: "postTags" },
                " # ",
                tagStr
            ),
            React.createElement(
                "form",
                { id: post.title + "deleteForm",
                    onSubmit: function onSubmit(e) {
                        return handleDelete(e, post);
                    },
                    name: "deleteForm",
                    action: "/delete",
                    method: "POST"
                },
                React.createElement("input", { type: "hidden", name: "postID", value: post._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "deleteButton", type: "submit", value: "Delete" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "postList" },
        postNodes
    );
};

// Password Change
var handleChangePW = function handleChangePW(e) {
    e.preventDefault();

    $("#postMessage").animate({ width: 'hide' }, 350);

    if ($("#oldPass").val() === '' || $("#pass").val() === '' || $("#pass2").val() === '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changePWForm").attr("action"), $("#changePWForm").serialize(), redirect);
    return false;
};

// Password Change Form
var ChangePWForm = function ChangePWForm(props) {
    return React.createElement(
        "form",
        { id: "changePWForm",
            onSubmit: handleChangePW,
            name: "changePWForm",
            action: "/changePW",
            method: "POST",
            className: "changePWForm"
        },
        React.createElement(
            "h3",
            { className: "formTitle" },
            "CHANGE PASSWORD"
        ),
        React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "current password" }),
        React.createElement("input", { id: "pass", type: "passoword", name: "pass", placeholder: "new password" }),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { type: "submit", id: "pwSubmit", value: "Change Password" })
    );
};

// Site About
var AboutWindow = function AboutWindow() {
    return React.createElement(
        "div",
        { id: "info" },
        React.createElement(
            "h3",
            { className: "formTitle" },
            "What can you do here?"
        ),
        React.createElement(
            "p",
            { id: "desc" },
            "Going through existential crisis and can't sleep at ungodly hours at night? Worry not, you can post your thoughts and rants on here... For the viewing of no one but your own!"
        )
    );
};

// Purchasable Themes
var ThemesWindow = function ThemesWindow() {
    return React.createElement(
        "div",
        { id: "themes" },
        React.createElement(
            "h3",
            { className: "formTitle" },
            "THEMES"
        ),
        React.createElement(
            "div",
            { id: "thm1" },
            React.createElement(
                "p",
                null,
                "Autumn Theme"
            ),
            React.createElement(
                "p",
                { className: "purchase" },
                "PURCHASE"
            )
        ),
        React.createElement(
            "div",
            { id: "thm2" },
            React.createElement(
                "p",
                null,
                "Winter Theme"
            ),
            React.createElement(
                "p",
                { className: "purchase" },
                "PURCHASE"
            )
        ),
        React.createElement(
            "div",
            { id: "thm3" },
            React.createElement(
                "p",
                null,
                "Summer Theme"
            ),
            React.createElement(
                "p",
                { className: "purchase" },
                "PURCHASE"
            )
        )
    );
};

var loadPostsFromServer = function loadPostsFromServer() {
    sendAjax('GET', '/getPosts', null, function (data) {
        ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector("#posts"));
    });
};

// Windows For Different Pages
var createPasswordChangeWindow = function createPasswordChangeWindow(csrf) {
    ReactDOM.render(React.createElement(ChangePWForm, { csrf: csrf }), document.querySelector("#posts"));
};

var createAboutWindow = function createAboutWindow() {
    ReactDOM.render(React.createElement(AboutWindow, null), document.querySelector("#posts"));
};

var createThemesWindow = function createThemesWindow() {
    ReactDOM.render(React.createElement(ThemesWindow, null), document.querySelector("#posts"));
};

var createMainWindow = function createMainWindow(csrf) {
    ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#makePost"));

    ReactDOM.render(React.createElement(PostForm, { posts: [], csrf: csrf }), document.querySelector("#posts"));
};

var setup = function setup(csrf) {
    var changePWButton = document.querySelector("#changePWButton");
    var aboutButton = document.querySelector("#aboutButton");
    var themesButton = document.querySelector("#themesButton");

    changePWButton.addEventListener("click", function (e) {
        e.preventDefault();
        createPasswordChangeWindow(csrf);
        return false;
    });

    aboutButton.addEventListener("click", function (e) {
        e.preventDefault();
        createAboutWindow();
        return false;
    });

    themesButton.addEventListener("click", function (e) {
        e.preventDefault();
        createThemesWindow();
        return false;
    });

    createMainWindow(csrf);
    loadPostsFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#postMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#postMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
