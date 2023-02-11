/* DETAIL */
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
        let url = "http://123.30.234.72:8080/forwards/" + id
        let res = await fetch(url, requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function deactivateForward(id) {
    try {
        const auth = sessionStorage.getItem('token');
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        };
        let url = "http://123.30.234.72:8080/forwards/"+id+"/deactivate"
        let res = await fetch(url, requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function redirectToDetail(id, active){
    if (active) {
        window.location = "/detail.html?id=" + id ;
    } else {
        window.location = "/deactivate.html?id=" + id ;
    }
}

async function redirectToHome(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    await deactivateForward(id);
    window.location = "/home.html";
}

async function renderDetailForward() {
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
    let source = document.getElementById("source");
    source.innerHTML = forward.source;
    let password = document.getElementById("password");
    password.value = forward.password;
    let forwardTo = document.getElementById("forward-to");
    forwardTo.innerText = forward.destination;
    let label = document.getElementById("label");
    label.value = forward.label;
    let note = document.getElementById("note");
    note.value = forward.note;
}


function showUpdate(){
    document.getElementById("update-button").hidden = false;
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


async function updateForward(){
    try {
        const auth = sessionStorage.getItem('token');
        let _data = {
            password: document.getElementById("password").value,
            label: document.getElementById("label").value,
            note: document.getElementById("note").value
        }
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        var requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            },
            body: JSON.stringify(_data),
        };
        let url = "http://123.30.234.72:8080/forwards/"+id
        let res = await fetch(url, requestOptions);
        result = await res.json();
        document.getElementById("update-button").hidden = true;
    } catch (error) {
        console.log(error);
    }
}