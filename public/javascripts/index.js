// redirect in profile page without login by checking token in cookie
if (document.cookie.indexOf('authToken') != -1) {
    window.location = "/profile";
}


// signup request

$(document).ready(() => {
    $("#signup-form").submit((event) => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "api/signup",
            data: new FormData(event.target),
            processData: false,
            contentType: false,
            beforeSend: () => {
                $(".before-send-signup").removeClass("d-none");
                $(".signup-btn").addClass("d-none");
            },
            success: (res) => {
                $(".signup-btn").removeClass("d-none");
                $(".before-send-signup").addClass("d-none");
                
                if(res.isUserCreated){
                    window.location = "/profile"
                }
            },
            error: (err) => {
                console.log(err);
            }

        })
    })
})




// login request

$(document).ready(function () {
    $("#login-form").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "api/login",
            data: new FormData(event.target),
            processData: false,
            contentType: false,
            beforeSend: () => {
                $(".before-send-login").removeClass("d-none")
                $(".login-btn").addClass("d-none")
            },
            success: (res) => {
                $(".login-btn").removeClass("d-none")
                $(".before-send-login").addClass("d-none")
                if (res.isLogged) {
                    window.location = "/profile";
                } else {
                    $("#login_password").addClass("border-danger");
                    $(".login_password_error").html("Wrong password!");
                    $("#login_password").click(() => {
                        resetValidator("login_password");
                    })
                }

            },
            error: (err) => {
                $(".login-btn").removeClass("d-none");
                $(".before-send-login").addClass("d-none");
                // console.log(err.status);
                // console.log(err.responseJSON);
                if (err.status == 404) {
                    $("#login_id").addClass("border-danger");
                    $(".login_id_error").html("User not exist!");
                    $("#login_id").click(() => {
                        resetValidator("login_id");
                    })
                } else if (err.status == 401) {
                    $("#login_password").addClass("border-danger");
                    $(".login_password_error").html("Wrong password!");
                    $("#login_password").click(() => {
                        resetValidator("login_password");
                    })
                } else if (err.status == 406) {
                    $("#login_id").addClass("border-danger");
                    $(".login_id_error").html(err.responseJSON.message);
                    $("#login_id").click(() => {
                        resetValidator("login_id");
                    })
                } else {
                    alert("Internal server error!");
                }
            }
        })
    })
})





let resetValidator = (field) => {
    // $("#" + field).removeClass("text-danger");
    // $("#" + field).html("");
    $("#" + field).removeClass("border-danger");
    $("." + field + "_error").html("");
}