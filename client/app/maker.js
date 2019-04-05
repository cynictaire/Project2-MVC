const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if ($("#pTitle").val() === '' || $("#pContent").val() === '' || $("#pTag").val() === '') {
        handleError("Title and post content are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm" 
              onSubmit={handleDomo}
              name="domoForm"
              action="/maker"
              method="POST"
              className="domoForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="pTitle" type="text" name="title" placeholder="title"/>
            <label htmlFor="post">Post: </label>
            <input id="pContent" type="text" name="post" placeholder="write something..."/>
            <label htmlFor="pTag">Tag(s): </label>
            <input id="pTag" type="text" name="tag" placeholder="tag something"/>
            <input type="hidden" id="csrfVal" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Post" />
        </form>
    );
};

// Delete Domos
const handleDelete = (e, domo) => {

    //console.log($(`#${domo.name}deleteForm`).serialize());
    
    let domoSerialize = $(`#${domo.name}deleteForm`).serialize() + document.querySelector("#csrfVal").value;
    
    //console.log(domoSerialize);
    
    sendAjax('POST', $(`#${domo.name}deleteForm`).attr("action"), domoSerialize, function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">Nothing here...Start by posting something.</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> {domo.title} </h3>
                <p className="domoAge"> {domo.post} </p>
                <p className="domoHeight"> Tag(s): {domo.tag} </p>
                
                <form id={`${domo.name}deleteForm`} 
                      onSubmit={(e) => handleDelete(e, domo)}
                      name="deleteForm"
                      action="/delete"
                      method="POST"
                >
                    <input type="hidden" name="domoID" value={domo._id} />
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input type="submit" value="Delete"/>
                </form>
            </div>
        );
    });
        
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
        <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoForm domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken(); 
});