"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#pContent").val() === '') {
        handleError("Post content is required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "title" },
            "Title: "
        ),
        React.createElement("input", { id: "pTitle", type: "text", name: "title", placeholder: "title" }),
        React.createElement(
            "label",
            { htmlFor: "post" },
            "Post: "
        ),
        React.createElement("input", { id: "pContent", type: "text", name: "post", placeholder: "write something..." }),
        React.createElement(
            "label",
            { htmlFor: "pTag" },
            "Tag(s): "
        ),
        React.createElement("input", { id: "pTag", type: "text", name: "tag", placeholder: "tag, something, here" }),
        React.createElement("input", { type: "hidden", id: "csrfVal", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Post" })
    );
};

// Delete Domos
var handleDelete = function handleDelete(e, domo) {

    //NEVER FORGET
    e.preventDefault();

    console.log($("#" + domo.title + "deleteForm").serialize() + document.querySelector("#csrfVal").value);

    var domoSerialize = $("#" + domo.title + "deleteForm").serialize() + document.querySelector("#csrfVal").value;

    //console.log(domoSerialize);

    sendAjax('POST', $("#" + domo.title + "deleteForm").attr("action"), domoSerialize, function () {
        loadDomosFromServer();
    });

    return false;
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "Nothing here...Start by posting something."
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {

        var tagStr = domo.tag.split(",");
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " ",
                domo.title,
                " "
            ),
            React.createElement(
                "p",
                { className: "domoAge" },
                " ",
                domo.post,
                " "
            ),
            React.createElement(
                "p",
                { className: "domoHeight" },
                " Tag(s): ",
                tagStr
            ),
            React.createElement(
                "form",
                { id: domo.title + "deleteForm",
                    onSubmit: function onSubmit(e) {
                        return handleDelete(e, domo);
                    },
                    name: "deleteForm",
                    action: "/delete",
                    method: "POST"
                },
                React.createElement("input", { type: "hidden", name: "domoID", value: domo._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { type: "submit", value: "Delete" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoForm, { domos: [], csrf: csrf }), document.querySelector("#domos"));

    loadDomosFromServer();
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
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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
