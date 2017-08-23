function es() {

    var registerForm = document.forms["form"],
         name = registerForm.elements["name"].value,
         theme = registerForm.elements["theme"].value,
         content = registerForm.elements["content"].value;
    
    if (name != "" && theme != "" && content != "") {
        $.ajax({
                type: "POST",
                url: "/",
                data: JSON.stringify({name: name, theme: theme, content:  content}),
                dataType: "json",
                contentType: "application/json",
                success: function(data){

                     if (data != "1") {
                        $(".iss").append('<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">'+data.name+'</h3>'+data.theme+'</div><div class="panel-body">'+data.content+'</div><div class="panel-footer">'+data.time+'</div></div>');
                        
                    } else if (data = "1") {
                        alert("Неправильно заполненны поля");
                    }
                    },
                });
        
    } else {
        alert("Неправильно заполненны поля");
    }
}
