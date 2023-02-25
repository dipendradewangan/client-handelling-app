// set contry code in mobile number form

$(document).ready(() => {
    $("#country").on("input", async function () {
        let keyword = $(this).val().toLowerCase();

        // check coutnry stored in localstorage or not
        const localStorageResponse = checkDataInLocalStorage("countryCode");
        if (localStorageResponse.isExist) {
            const countries = localStorageResponse.data;

            for (let country of countries) {
                if (country.name.toLowerCase().indexOf(keyword) != -1) {
                    $("#code").html(country.dial_code);
                }
            }
        }
        else {
            // if coutnry not  stored in localstorage call ajax request and store response in localstorage
            const request = {
                type: "GET",
                url: "../json/country-code.json"
            }

            const response = await ajax(request);

            const countryData = JSON.stringify(response);
            localStorage.setItem("countryCode", countryData);

            // clear input field
            $("#country").val("");

        }
    })
})


// add client request
$(document).ready(function () {
    $("#addClientForm").submit(async function (event) {
        event.preventDefault();
        const formdata = new FormData(event.target);

        // find the token from browser cookie
        const tokenData = getCookie("authToken");

        // perform operation according to token available or not
        if (tokenData.isFindToken) {
            formdata.append("token", tokenData.token);
            const request = {
                type: "POST",
                url: "/clients",
                data: formdata,
                submitBtn: "#add-client-submit",
                loaderBtn: "#add-client-loader"
            }
            try {
                const clientRes = await ajax(request);
                console.log(clientRes);
                $("#clientModal").modal("hide");
            }
            catch (error) {
                console.log(error);
                $(".client-email").addClass("text-danger");

            }
        }
        else {
            alert("Unauthenticated token!");
        }
    })
})


const getCookie = (cookieName) => {
    const allCookie = document.cookie;
    const cookieArray = allCookie.split(";");
    for (let cookie of cookieArray) {
        if (cookie.indexOf(cookieName) != -1) {
            return {
                isFindToken: true,
                token: cookie.split("=")[1]
            }
        }
    }
    return {
        isFindToken: false,
    };
}


const checkDataInLocalStorage = (key) => {
    if (localStorage.getItem(key) != null) {
        const tmp = localStorage.getItem(key);
        const data = JSON.parse(tmp);
        return {
            isExist: true,
            data: data
        }
    }
    else {
        return {
            isExist: false
        }
    }
}



// show clients
$(document).ready(function () {
    let from = 0;
    let to = 5;
    showClients(from, to);
})


const showClients = async (from, to) => {
    const request = {
        type: "GET",
        url: `/clients/${from}/${to}`
    }

    const response = await ajax(request);
    if (response.data.length > 0) {
        for (let client of response.data) {
            console.log(client);
            console.log(client.clientName);
            const tr = `<tr>
                <td>
                    <div class="d-flex align-items-center gap-4">
                        <i class="fa fa-user-circle" style="font-size :40px"></i>
                        <div>
                            <p class="m-0 p-0 text-capitalize">${client.clientName}</p>
                            <small class="text-uppercase">${client.clientCountry}</small>
                        </div>
                    </div>
                </td>
                <td clas="d-flex align-items-center">${client.clientEmail}</td>
                <td clas="d-flex align-items-center">${client.clientMobile}</td>
                <td clas="d-flex align-items-center"><span class="badge bg-danger">Offline</span></td>
                <td clas="d-flex align-items-center">${client.updatedAt}</td>
                <td>
                    <div class="d-flex gap-3">
                        <button class="icon-btn-primary">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="icon-btn-danger">
                            <i class="fa fa-trash"></i>
                        </button>
                        <button class="icon-btn-info">
                            <i class="fa fa-share-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
            $("table").append(tr);
        }
    }
    else {
        alert("Client not found!");
    }

}


// defining ajax function
const ajax = (request) => {

    // use promise for make asyncronous
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: request.type,
            url: request.url,
            data: request.type == "GET" ? {} : request.data,
            processData: request.type == "GET" ? true : false,
            contentType: request.type == "GET" ? "application/json" : false,
            beforeSend: () => {
                $(request.loaderBtn).removeClass("d-none");
                $(request.submitBtn).addClass("d-none");
            },
            success: (res) => {
                $(request.loaderBtn).addClass("d-none");
                $(request.submitBtn).removeClass("d-none");
                resolve(res)
            },
            error: (err) => {
                $(request.loaderBtn).addClass("d-none");
                $(request.submitBtn).removeClass("d-none");
                reject(err);
            }
        });

    })
}
