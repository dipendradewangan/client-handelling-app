$(document).ready(function(){
    $(".toggler").click(()=>{
        let state = $(".sidenav").hasClass("sidenav-open");
        if(state){
            $(".sidenav").addClass("sidenav-close")
            $(".sidenav").removeClass("sidenav-open")
            
            // section control
            $(".section").addClass("section-close")
            $(".section").removeClass("section-open")
        }
        else{
            $(".sidenav").addClass("sidenav-open")
            $(".sidenav").removeClass("sidenav-close")
            
            // section control
            $(".section").removeClass("section-close")
            $(".section").addClass("section-open")
        }
    })
})