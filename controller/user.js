$(document).ready(function () {
    $('#user_type').change(function () {
        var selectedOption = $(this).val();
        if (selectedOption === "Admin") {
            $('#access_details').text('Permission granted for all data');
        } else if (selectedOption === "Cashier") {
            $('#access_details').text('Permission Cashier');
        } else {
            $('#access_details').text('In Stock Permission');
        }

    });
});
$(document).ready(function () {
    $('#user_password').hover(
        function () {
            // Hover in
            $(this).attr('type', 'text');
        },
        function () {
            // Hover out
            $(this).attr('type', 'password');
        }
    );
});
loaderUserTableData();
/*save user*/
document.getElementById('user_from').addEventListener('submit', function (event) {
    event.preventDefault();
    var data = {
        "username": $("#user_name").val(),
        "password": $("#user_password").val(),
        "userType": $("#user_type").val(),
        "email": $("#user_email").val()
    };
    console.log(data);
    var settings = {
        "url": "http://localhost:8080/tempBookShop-0.0.1-SNAPSHOT/ali/v1/user/save",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(data,),
    };
    $.ajax(settings).done(function (response) {
        console.log(response.code);
        if (response.code === "00") {
            loaderUserTableData()
            notify('success', 'Your file has been save.', 'Save!');
            textClear();
        } else if (response.code === "06") {
            swal("Already item code", "You clicked the button!", "error");
        } else {
            swal("Save fail", "You clicked the button!", "error");
        }
    });
});

function textClear() {
    $("#user_name").val(''),
        $("#user_password").val(''),
        $("#user_type").val(''),
        $("#user_email").val('')
}

function loaderUserTableData() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/tempBookShop-0.0.1-SNAPSHOT/ali/v1/user/getAll",
        async: false,
        success: function (userData) {
            if (userData.code === "00") {
                $('#user-tbody').empty();
                for (let user of userData.content) {
                    let id = user.id;
                    let username = user.username;
                    let password = user.password;
                    let userType = user.userType;
                    let email = user.email;

                    var rowUser = `<tr id=${id}><td>${id}</td><td>${username}</td><td>${password}</td><td>${userType}</td><td>${email}</td><td><i class="fa-solid fa-trash-can"></i></td></tr>`;
                    $('#user-tbody').append(rowUser);
                }
            }
        },
        error: function (xhr, exception) {
            alert("Error")
        }
    });

}

/*delete On action*/
$('#user-tbl').on('click', 'tr td:nth-child(5)', (e) => {
    var row = $(e.target).closest('tr');
    var rowId = row.attr('id')
    console.log(rowId)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            //remove from tbl
            $.ajax({
                method: "DELETE",
                url: "http://localhost:8080/tempBookShop-0.0.1-SNAPSHOT/ali/v1/user/delete/" + rowId,
                async: true,
                success: function (data) {
                    if (data.code === "00") {
                        row.remove();
                        /*Swal.fire({
                                  title: "Deleted!",
                                  text: "Your file has been deleted.",
                                  icon: "success"
                                });*/
                        notify('success', 'Your file has been deleted.', 'Deleted!');
                    } else {
                        console.log(data.setMessage);
                    }
                },
                error: function (xhr, exception) {
                    notify('danger', 'saver err', 'saver err')
                }
            });
        }
    });
});

function addNewUserOnAction() {
    $('#user_from').css('display', 'block');
    $('#addNewUserHide').css('display', 'block');
    $('#addNewUserLiable').css('display', 'none');
}

function addNewUserHideOnAction() {
    $('#user_from').css('display', 'none');
    $('#addNewUserHide').css('display', 'none');
    $('#addNewUserLiable').css('display', 'block');
}