// set contry code in mobile number form

$(document).ready(()=>{
    $("#country").on("input", async function(){
        let keyword = $(this).val().toLowerCase();

        // check coutnry stored in localstorage or not
        const localStorageResponse = checkDataInLocalStorage("countryCode");
        if(localStorageResponse.isExist){
            const countries = localStorageResponse.data;
            
            for(let country of countries){
                if(country.name.toLowerCase().indexOf(keyword) != -1){
                    $("#code").html(country.dial_code);
                }
            }
        }
        else{
            // if coutnry not  stored in localstorage call ajax request and store response in localstorage
            const request = {
                type : "GET",
                url : "../json/country-code.json"
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
$(document).ready(function(){
    $("#addClientForm").submit(async function(event){
        event.preventDefault();
        const formdata = new FormData(event.target);
        const tokenData = getCookie("authToken");
        if(tokenData.isFindToken){
            formdata.append("token",tokenData.token);
            const request = {
                type : "POST",
                url : "/clients",
                data : formdata,
            }
            const clientRes = await ajax(request);
            console.log(clientRes);
        }
        else{
            alert("Unauthenticated token!");
        }
    })
})


const getCookie = (cookieName)=>{
    const allCookie = document.cookie;
    const cookieArray = allCookie.split(";");
    for(let cookie of cookieArray){
        if(cookie.indexOf(cookieName) != -1){
            return {
                isFindToken : true,
                token : cookie.split("=")[1]
            }
        }
    }
    return {
        isFindToken : false,
    };
}


const checkDataInLocalStorage = (key)=>{
    if(localStorage.getItem(key) != null){
        const tmp = localStorage.getItem(key);
        const data = JSON.parse(tmp);
        return {
            isExist : true,
            data : data
        }
    }
    else{
        return {
            isExist : false
        }
    }
}



// defining ajax function
const ajax = (request)=>{

    // use promise for make asyncronous
    return new Promise(function(resolve, reject){
        $.ajax({
            type : request.type,
            url : request.url,
            data : request.type == "GET" ? {}: request.data,
            processData : request.type == "GET" ? true : false,
            contentType : request.type == "GET" ? "application/json" :false,
            success : (res)=>{
                resolve(res) 
            },
            error : (err)=>{
                reject(err);
            }
        });

    })
}
