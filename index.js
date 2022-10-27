/* LOGIN */
async function onLoadLogin(){
    validate()
}

async function login() {
    try {
        var data = new URLSearchParams();
        data.append('username', document.getElementById("email").value);
        data.append('password', document.getElementById("password").value);
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data,
        };
        let url = "http://privaterelay.asia:8080/auth/token"
        let res = await fetch(url, requestOptions);
        result = await res.json();
        if (result.access_token) {
            window.localStorage.setItem("token", result.access_token);
            window.localStorage.setItem("status", "loggedIn")
            return redirectHome();
        } else {
            return swal("Error", "Tài khoản hoặc mật khẩu không đúng!", "error");
        }

    } catch (error) {
        console.log(error);
    }
}

/* Register */
async function register() {
    try {
        let _data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_data),
        };
        let url = "http://privaterelay.asia:8080/auth/register"
        let res = await fetch(url, requestOptions);
        result = await res.json();
        if (result.access_token) {
            swal("Success", "Đăng ký thành công", "success");
            redirectLogin()
        } else {
            return swal("Error", "Đăng ký thất bại", "error");
        }
    } catch (error) {
        console.log(error);
    }
}


async function logout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("status")
    redirectLogin();
}

async function validate() {
    let token = window.localStorage.getItem("token")
    if (token != null) {
        return redirectHome()
    }
}



async function getForwards() {
    try {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            }
        };
        let res = await fetch("http://privaterelay.asia:8080/forwards", requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function logged(){
    let token = window.localStorage.getItem("token")
    if (token == null) {
        return redirectLogin()
    }
}

async function renderForwards() {
    logged()
    let users = await getForwards()
    let active_forward = '';
    let deactivate_forward = '';
    let active = 0;
    let deactivate = 0;
    users.forEach(user => {
        let htmlSegment = `<div class="row" style="width: 1160px;padding-right: 100px;padding-left: 100px;">
                            <div class="col">
                                <div class="card" id="forward-card" onclick="redirectToDetail('${user.id}', ${user.is_active})">
                                    <div class="card-body" style="height: 80px;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;border-top-right-radius: 8px;border-top-left-radius: 8px;border-width: 2px;box-shadow: 6px 6px 2px 2px var(--bs-card-cap-bg);">
                                        <h4 class="card-title" style="font-family: 'San Francisco Display';">${user.label}</h4>
                                        <h6 class="text-muted card-subtitle mb-2" style="font-family: 'San Francisco Display';">${user.source}</h6>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <br>`;
        if (user.is_active) {
            active_forward += htmlSegment;
            active += 1;
        } else {
            deactivate_forward += htmlSegment;
            deactivate += 1;
        }

    });
    let activeDeactivate = document.getElementById("active-deactivate")
    activeDeactivate.innerText = active + " đang hoạt động, " + deactivate + " không hoạt động";
    let activeQuantity = document.getElementById("active-quantity")
    activeQuantity.innerText = active + " địa chỉ email đang hoạt động";
    let deactivateQuantity = document.getElementById("deactivate-quantity")
    deactivateQuantity.innerText = deactivate + " địa chỉ email không hoạt động";
    let active_div = document.getElementById("active-item");
    active_div.innerHTML = active_forward;
    let deactivate_div = document.getElementById("deactivate-item");
    deactivate_div.innerHTML = deactivate_forward;
}

function redirectHome() {
    window.location = "/index.html";
}

function redirectNew() {
    window.location = "/new.html";
}

function redirectLogin() {
    window.location = "/login.html";
}

/* DETAIL */
async function detailForward(id) {
    logged()
    try {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            }
        };
        let url = "http://privaterelay.asia:8080/forwards/" + id
        let res = await fetch(url, requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function deactivateForward(id) {
    logged()
    try {
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            }
        };
        let url = "http://privaterelay.asia:8080/forwards/" + id + "/deactivate"
        let res = await fetch(url, requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function redirectToDetail(id, active) {
    if (active) {
        window.location = "/detail.html?id=" + id;
    } else {
        window.location = "/deactivate.html?id=" + id;
    }

}

async function redirectToHome() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    await deactivateForward(id);
    window.location = "/home.html";
}

async function renderDetailForward() {
    logged()
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    let forward = await detailForward(id);
    const date = new Date(forward.created_at + "Z")
    let month = date.getMonth() + 1;

    let createAt = document.getElementById("createAt");
    createAt.innerHTML = "Bạn đã tạo email này vào " + date.getDate() + " tháng " + month + ", " + date.getFullYear();
    let title = document.getElementById("title");
    title.innerText = forward.label;
    let source = document.getElementById("source");
    source.innerHTML = forward.source;
    let forwardTo = document.getElementById("forward-to");
    forwardTo.value = forward.destination;
    let label = document.getElementById("label");
    label.value = forward.label;
    let note = document.getElementById("note");
    note.value = forward.note;
}

function copy() {
    var r = document.createRange();
    r.selectNode(document.getElementById("source"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}


/* ADD NEW */

async function generateEmail() {
    try {
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            }
        };
        let url = "http://privaterelay.asia:8080/proxies"
        let res = await fetch(url, requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }

}

async function renderProxy() {
    logged()
    let emailAddress = await generateEmail();
    let proxy = document.getElementById("proxy")
    proxy.innerText = emailAddress["email"];
}


async function createForward() {
    try {
        let _data = {
            account_id: "f50ec0b7-f960-400d-91f0-c42a6d44e3d0",
            source: document.getElementById("proxy").innerText,
            destination: document.getElementById("forward-to").value,
            label: document.getElementById("forward-title").value,
            note: document.getElementById("forward-note").value
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            },
            body: JSON.stringify(_data),
        };
        let url = "http://privaterelay.asia:8080/forwards"
        let res = await fetch(url, requestOptions);
        result = await res.json();
        await redirectToDetail(result.id, result.is_active);
    } catch (error) {
        console.log(error);
    }
}


/* Deactivate */

async function renderForwardDeactivate() {
    logged()
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    let forward = await detailForward(id);
    const date = new Date(forward.created_at + "Z")
    let month = date.getMonth() + 1;

    let createAt = document.getElementById("createAt");
    createAt.innerHTML = "Bạn đã tạo email này vào " + date.getDate() + " tháng " + month + ", " + date.getFullYear();
    let title = document.getElementById("title");
    title.innerText = forward.label;
    let source = document.getElementById("source");
    source.innerHTML = forward.source;
    let forwardTo = document.getElementById("forward-to");
    forwardTo.innerHTML = forward.destination;
    let label = document.getElementById("label");
    label.value = forward.label;
    let note = document.getElementById("note");
    note.value = forward.note;
}

async function activeForward() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            }
        };
        let url = "http://privaterelay.asia:8080/forwards/" + id + "/activate"
        let res = await fetch(url, requestOptions);
        result = await res.json();
        await redirectToDetail(result.id, result.is_active);
    } catch (error) {
        console.log(error);
    }
}

async function deleteForward() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        var requestOptions = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            }
        };
        let url = "http://privaterelay.asia:8080/forwards/" + id
        let res = await fetch(url, requestOptions);
        await res.json();
        window.location = "/home.html";
    } catch (error) {
        console.log(error);
    }
}


function showUpdate() {
    document.getElementById("update-button").hidden = false;
}

async function updateForward() {
    try {
        let _data = {
            destination: document.getElementById("forward-to").value,
            label: document.getElementById("forward-title").value,
            note: document.getElementById("forward-note").value
        }
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        var requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("token")
            },
            body: JSON.stringify(_data),
        };
        let url = "http://privaterelay.asia:8080/forwards" + id
        let res = await fetch(url, requestOptions);
        result = await res.json();
        document.getElementById("update-button").hidden = true;
    } catch (error) {
        console.log(error);
    }
}