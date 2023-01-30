$(document).ready(()=>{
    $("#country").on("input", async function(){
        let keyword = $(this).val().toLowerCase();

        // check coutnry stored in localstorage or not
        const localStorageResponse = checkDataInLocalStorage("countryCode");
        if(localStorageResponse.isExist){
            const countries = localStorageResponse.data;
            
            for(let country of countries){
                if(country.name.toLowerCase().indexOf(keyword) != -1){
                    console.log(country)
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
            success : (res)=>{
                resolve(res) 
            },
            error : (err)=>{
                reject(err);
            }
        });

    })
}
