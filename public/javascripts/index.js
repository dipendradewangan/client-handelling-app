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
                const data = JSON.parse(res.text);
                if (data.isCompanyCreated) {
                    // redireact user to profile page
                    $("#signup-form").trigger("reset");

                } else {
                    const field = data.message.field;
                    const label = data.message.label;
                    $("." + field + "_error").html(label)
                    $("#" + field).addClass("border-danger");
                    $("#" + field).click(() => {
                        resetValidator(field);
                    });
                }
            },
            error: (err) => {
                console.log(err);
            }

        })
    })
})




// login request

$(document).ready(function(){
    $("#login-form").submit(function(event){
        event.preventDefault();
        $.ajax({
            type : "POST",
            url : "api/login",
            data : new FormData(event.target),
            processData : false,
            contentType : false,
            beforeSend : ()=>{
                $(".before-send-login").removeClass("d-none")
                $(".login-btn").addClass("d-none")
            },
            success : (res)=>{
                // $(".login-btn").removeClass("d-none")
                // $(".before-send-login").addClass("d-none")
                console.log(res);
            }
        })
    })
})


let resetValidator = (field) => {
    $("#" + field).removeClass("border-danger");
    $("." + field + "_error").html("");
}