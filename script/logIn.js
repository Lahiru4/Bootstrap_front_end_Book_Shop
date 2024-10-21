/*log in*/
$('#loginBtn').on('click', () => {
    let username = $('#username').val();
    let password = $('#password').val();

    if (!username || !password) {
        notify('danger', 'Enter Username & Password', 'Invade Input');
    } else {
        let settings = {
            "url": "http://localhost:8081/ali/v1/user/checkUser/" + username + "/" + password,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            console.log(response.code);
            let userType = response.content.userType;
            if (userType == 'Admin') {
                //    ToDo: View admin panel
                window.location.href = "Admin.html";
                Swal.fire({
                    icon: "success",
                    title: "Login Successful as Admin",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else if (userType == 'Cashier') {
                //    ToDo: View cashier panel
                //user_type='Cashier';
                window.location.href = "cashier.html";
                Swal.fire({
                    icon: "success",
                    title: "Login Successful as Cashier",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "User Not Verified",
                    text: "Wrong username or password!"
                });
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // ToDo: Handle the error
            Swal.fire({
                icon: "error",
                title: "User Not Verified",
                text: "Wrong username or password!"
            });
        });
    }

});

function notify(type, message, hed) {
    (() => {

        var area = document.getElementById("notification-area");
        let n = document.createElement("div");
        let notification = Math.random().toString(36).substr(2, 10);
        n.setAttribute("id", notification);
        n.classList.add("notification", type);
        n.innerHTML = "<div><b>" + hed + "</b></div>" + message;
        area.appendChild(n);

        let color = document.createElement("div");
        let colorid = "color" + Math.random().toString(36).substr(2, 10);
        color.setAttribute("id", colorid);
        color.classList.add("notification-color", type);
        document.getElementById(notification).appendChild(color);


        let icon = document.createElement("a");
        let iconid = "icon" + Math.random().toString(36).substr(2, 10);
        icon.setAttribute("id", iconid);
        icon.classList.add("notification-icon", type);
        document.getElementById(notification).appendChild(icon);


        let _icon = document.createElement("i");
        let _iconid = "_icon" + Math.random().toString(36).substr(2, 10);
        _icon.setAttribute("id", _iconid);

        if (type == 'success') {
            _icon.className = "fa fa-2x fa-check-circle";
        } else {
            _icon.className = "fa fa-2x fa-exclamation-circle";
        }
        document.getElementById(iconid).appendChild(_icon);
        area.style.display = 'block';
        setTimeout(() => {
            var notifications = document.getElementById("notification-area").getElementsByClassName("notification");
            for (let i = 0; i < notifications.length; i++) {
                if (notifications[i].getAttribute("id") == notification) {
                    notifications[i].remove();
                    break;
                }
            }
            if (notifications.length == 0) {
                area.style.display = 'none';
            }

        }, 8000);
    })();
}
$(document).ready(function() {
    $('#username').on('keypress', function(event) {
        if (event.which === 13) { // Enter key
            $('#password').focus();
        }
    });

    $('#password').on('keypress', function(event) {
        if (event.which === 13) { // Enter key
            $('#loginBtn').click();
        }
    });

});
