/* Deactivate */

async function renderForwardDeactivate() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    let forward = await detailForward(id);
    const date = new Date(forward.created_at + "Z")
    let month = date.getMonth() + 1;
    console.log(forward);

    let createAt = document.getElementById("createAt");
    createAt.innerHTML = "Bạn đã tạo email này vào " +  date.getDate() + " tháng " + month + ", " + date.getFullYear();
    let title = document.getElementById("title");
    title.innerText = forward.label;
    let password = document.getElementById("password");
    password.value = forward.password
    let source = document.getElementById("source");
    source.innerHTML = forward.source;
    let forwardTo = document.getElementById("forward-to");
    forwardTo.innerHTML = forward.destination;
    let label = document.getElementById("label");
    label.value = forward.label;
    let note = document.getElementById("note");
    note.value = forward.note;
}

async function detailForward(id) {
    try {
        const auth = sessionStorage.getItem('token');
        var requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        };
        let url = "http://123.30.234.72:8000/forwards/" + id
        let res = await fetch(url, requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}


async function activeForward(){
    try {
        const auth = sessionStorage.getItem('token');
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        };
        let url = "http://123.30.234.72:8000/forwards/"+id+"/activate"
        let res = await fetch(url, requestOptions);
        result = await res.json();
        return window.location.href = "home.html"
    } catch (error) {
        console.log(error);
    }
}

async function deleteForward(){
    try {
        const auth = sessionStorage.getItem('token');
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        var requestOptions = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        };
        let url = "http://123.30.234.72:8000/forwards/"+id
        let res = await fetch(url, requestOptions);
        await res.json();
        window.location = "/home.html";
    } catch (error) {
        console.log(error);
    }
}

function copy()
{
    var r = document.createRange();
    r.selectNode(document.getElementById("source"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}