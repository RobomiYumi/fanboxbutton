//Notes
//PIXIV when javascript is disable load a white page.
//PIXIV loads the webpage's content with 7 XHR calls
//creator.get Request has some public user information

(function() {

//Creates a hook on all XHR request
var addXMLRequestCallback = (callback) => {
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}

var addPixivButton = (link) => {
    var elLink = document.createElement("a");
    elLink.setAttribute('href', link);
    elLink.innerHTML = 'Go to pixiv';
    elLink.style.position = "fixed";
    elLink.style.top ="0";
    elLink.style.left ="0";
    elLink.style.backgroundColor = "#0096FA";
    elLink.style.padding = "3px 5px";
    elLink.style.display = "block";
    elLink.style.zIndex = "9999";
    elLink.style.color = "#fff";
    elLink.style.fontSize = "12px";
    document.body.appendChild(elLink);
}

addXMLRequestCallback( (xhr) => {

    //xhr.onreadystatechange = () => { override the original onreadystatechange
    xhr.addEventListener("load", () => {
        if ( xhr.readyState == 4 && xhr.status == 200 ) {

            if ( typeof xhr.responseURL !== "undefined" &&  xhr.responseURL.match(/creator.get/g) ) {
                var response = JSON.parse(xhr.responseText);

                var baseLink = "https://www.pixiv.net/en/users/";
                var userId = response.body.user.userId;

                if (userId) {
                   addPixivButton(baseLink + userId);
                }

            }

        }
     });

});

})();
