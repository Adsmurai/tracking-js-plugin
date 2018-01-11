(function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://tracking-api.adsmurai.local');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
})();
