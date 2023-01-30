$(document).ready(()=>{
    $("#country").on("input", async function(){
        let keyword = $(this).val().toLowerCase();
        console.log(keyword);
        const request = {
            type : "GET",
            url : "../json/country-code.json"
        }

        const response = await ajax(request);
        console.log(response);
    })
})


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