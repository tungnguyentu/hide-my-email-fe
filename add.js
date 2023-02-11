/* ADD NEW */


async function generateEmail(){
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
        let url = "http://123.30.234.72:8080/proxies"
        let res = await fetch(url, requestOptions);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderProxy(){
    let emailAddress = await generateEmail();
    let proxy = document.getElementById("proxy")
    proxy.innerText = emailAddress["email"];
}


async function createForward(){
    try {
        const auth = sessionStorage.getItem('token');
        let isValid = validateRequiredFields()
        if (!isValid) {
            return
        }
        let link = isLink()
        if (!link) {
            Swal.fire({
            title: 'Lỗi!',
            text: "Đường dẫn không đúng định dạng",
            heightAuto: false,
            customClass: {
                title: "swal-title",
                icon: "swal-icon",
                popup: "swal-text",
            },
            icon: 'error'
        })
        return
        }
        const user = await loadDestination()
        let email = document.getElementById("proxy").innerHTML;
        let note = document.getElementById("forward-note").value;
        let password = document.getElementById("password").value;
        let label = document.getElementById("forward-title").value;
        let _data = {
            source: email,
            password: password,
            note: note,
            destination: user,
            label: label
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            },
            body: JSON.stringify(_data),
        };
        let url = "http://123.30.234.72:8080/forwards"
        let res = await fetch(url, requestOptions);
        result = await res.json();
        window.location.href = "/home.html"
    } catch (error) {
        console.log(error);
    }
}

function redirectToDetail(id, active) {
    if (active) {
        window.location = "/new.html?id=" + id;
    } else {
        window.location = "/deactivate.html?id=" + id;
    }
}

function isLink() {
    let url = document.getElementById("forward-title").value;
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

function validateRequiredFields() {
    let url = document.getElementById("forward-title").value;
    if (url == "") {
        Swal.fire({
            title: 'Lỗi!',
            text: "Vui lòng điền đường dẫn",
            heightAuto: false,
            customClass: {
                title: "swal-title",
                icon: "swal-icon",
                popup: "swal-text",
            },
            icon: 'error'
        })
        return false;
    }
    return true;
}

async function loadDestination() {
    const auth = sessionStorage.getItem('token');
    const data = parseJwt(auth)
    // const personalEmail = document.getElementById("personal-email");
    // personalEmail.innerHTML = data.sub
    return data.sub
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
