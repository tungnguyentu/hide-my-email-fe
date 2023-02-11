
function redirectHome() {
    window.location = "/home.html";
}

async function login() {
    try {
        is_valid = validateForm()
        if (!is_valid) {
            return Swal.fire(
                'Lỗi',
                'Vui lòng điền đầy đủ thông tin',
                'error'
                )
        }
        is_email = ValidateEmail()
        if (!is_email) {
            return Swal.fire(
                'Lỗi',
                'Vui lòng nhập đúng định dạng email',
                'error'
                )
        }
        const remember = document.getElementById('checkbox')
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
        let url = "http://123.30.234.72:8080/auth/token"
        let res = await fetch(url, requestOptions);
        result = await res.json();
        if (result.access_token) {
            if (remember.checked) {
                sessionStorage.setItem('token', result.access_token);
            }
            return redirectHome();
        } else {
            return Swal.fire(
                'Lỗi',
                'Sai email hoặc mật khẩu',
                'error'
                )
        }

    } catch (error) {
        console.log(error);
    }
}

function ValidateEmail() {
    let email = document.getElementById("email").value
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    return (false)
}

function validateForm() {

    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    if (email == "" || password == "") {
        return false;
    }
    return true;
}

async function CheckSessions() {
    const auth = sessionStorage.getItem('token');
    if (!auth) {
        return
    }
    if (auth) {
        window.location.href = "/home.html";
        return
    }
}
document.addEventListener("DOMContentLoaded", function () { CheckSessions(); }, false);
