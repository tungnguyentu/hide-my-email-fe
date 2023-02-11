async function getForwards() {
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
        let res = await fetch("http://123.30.234.72:8080/forwards", requestOptions);
        result = await res.json()
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function renderForwards() {
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


function redirectToDetail(id, active) {
    if (active) {
        window.location = "/detail.html?id=" + id;
    } else {
        window.location = "/deactivate.html?id=" + id;
    }
}

async function logout(){
    sessionStorage.removeItem('token');
    window.location = "/login.html"
}

function redirectAddItem() {
        window.location = "/new.html"
}
