var select_id=null;
function addNewItemOnAction() {
    $('#stock_save_btn').css('display', 'block');
    $('#stock_update_btn').css('display', 'none');
    $('#addNewItemLiable').css('display', 'none');
    $('#stock_from').css('display', 'block');
    $('#addNewItemHide').css('display', 'block');

    $('#item_code').val('');
    $('#item_name').val('');
    $('#perches_price').val('');
    $('#selling_price').val('');
    $('#item_discount').val('');
    $('#QtyOnHand').val('');
    // Clear error messages or any other content
    $('#DiscountValid').text(''); // Clear the error message for discount validation
    // Optionally, you can clear disabled input fields too (if needed)
    $('#final_selling_price').val('');
    $('#item_profit').val('');
}

function addNewItemHideOnAction() {
    $('#addNewItemLiable').css('display', 'block');
    $('#stock_from').css('display', 'none');
    $('#addNewItemHide').css('display', 'none');

    $('#item_code').val('');
    $('#item_name').val('');
    $('#perches_price').val('');
    $('#selling_price').val('');
    $('#item_discount').val('');
    $('#QtyOnHand').val('');
    // Clear error messages or any other content
    $('#DiscountValid').text(''); // Clear the error message for discount validation
    // Optionally, you can clear disabled input fields too (if needed)
    $('#final_selling_price').val('');
    $('#item_profit').val('');
}

$('#selling_price').prop('disabled', true);
$('#item_discount').prop('disabled', true);
$('#QtyOnHand').prop('disabled', true);

function textClear() {
    $('#item_code').val('');
    $('#item_name').val('');
    $('#perches_price').val('');
    $('#selling_price').val('');
    $('#item_discount').val('');
    $('#QtyOnHand').val('');
    // Clear error messages or any other content
    $('#DiscountValid').text(''); // Clear the error message for discount validation
    // Optionally, you can clear disabled input fields too (if needed)
    $('#final_selling_price').val('');
    $('#item_profit').val('');

}

/*save items start*/

//document.getElementById('stock_from').addEventListener('submit', function(event) {
function clearAll() {
    $("#item_code").val('');
    $("#item_name").val('');
    $("#perches_price").val('');
    $("#selling_price").val('');
    $("#item_discount").val('');
    $("#final_selling_price").val('');
    $("#item_profit").val('');
    $("#QtyOnHand").val('');
}

function saveOnActionItems() {
    if ($("#QtyOnHand").val() != '') {
        var data = {
            "item_code": $("#item_code").val(),
            "item_name": $("#item_name").val(),
            "perches_price": $("#perches_price").val(),
            "selling_price": $("#selling_price").val(),
            "item_discount": $("#item_discount").val(),
            "final_selling_price": $("#final_selling_price").val(),
            "item_profit": $("#item_profit").val(),
            "qty": parseInt($("#QtyOnHand").val()),
        };
        console.log(data);
        var settings = {
            "url": "http://localhost:8081/ali/v1/stock/save",
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
                clearAll();
                loaderTableData();
                notify('success', 'Your file has been save.', 'Save!');
            } else if (response.code === "06") {
                swal("Already item code", "You clicked the button!", "error");
            } else {
                swal("Save fail", "You clicked the button!", "error");
            }
        });
    } else {
        notify('danger', 'fill all data', 'fill all data')
    }

}

//event.preventDefault();

// });
/*save items end*/

/*perches_price input action start*/
const inputElement_perches_price = document.getElementById('perches_price');

function handleInput_perches_price(event) {
    const typedText = event.target.value;
    $('#item_discount').val('');
    $('#selling_price').val('');
    $('#item_discount').val('');
    $('#final_selling_price').val('');
    $('#item_profit').val('');
    $('#QtyOnHand').val('');
    if (parseInt(typedText) > 0) {
        $('#selling_price').prop('disabled', false);
    } else {
        $('#selling_price').prop('disabled', true);
    }

}

inputElement_perches_price.addEventListener('input', handleInput_perches_price);
/*perches_price input action end*/

/*selling_price input action start*/
const inputElement = document.getElementById('selling_price');

function handleInput(event) {
    $('#item_discount').val('');
    $('#QtyOnHand').val('');
    $('#item_profit').val('');
    $('#final_selling_price').val('');
    const typedText = event.target.value;
    const tep_p_price = $('#perches_price').val();
    if (parseInt(typedText, 10) > parseInt(tep_p_price, 10)) {
        $('#item_discount').prop('disabled', false);
        $('#final_selling_price').val(parseInt(typedText, 10));
        const p_price = $('#perches_price').val();
        $('#item_profit').val(parseInt(typedText - p_price, 10));
    } else {
        $('#item_discount').prop('disabled', true);
    }


}

inputElement.addEventListener('input', handleInput);

/*selling_price input action end*/

/*item_discount input action start*/

const inputElementDiscount = document.getElementById('item_discount');

function handleInputDiscount(event) {
    const typedText = event.target.value;
    console.log(`Typed: ${typedText}`);
    $('#QtyOnHand').val('');
    let selling_price = $('#selling_price').val();

    if (parseInt(typedText) <= parseInt(selling_price) && parseInt(typedText) >= 0) {
        $('#DiscountValid').text("");
        $('#QtyOnHand').prop('disabled', false);
        $('#final_selling_price').val(parseInt(selling_price - parseInt(typedText), 10));
        /**/
        const p_price = $('#perches_price').val();
        $('#item_profit').val(parseInt($('#final_selling_price').val() - p_price, 10));
    } else {
        $('#QtyOnHand').prop('disabled', true);
        $('#DiscountValid').text("Discount Invalid Input");
    }

}

inputElementDiscount.addEventListener('input', handleInputDiscount);

/*item_discount input action end*/

/*QtyOnHand input action start*/
const inputElementQty = document.getElementById('QtyOnHand');

function handleInputQtyOnHand(event) {
    const typedText = event.target.value;
    console.log(`Typed: ${typedText}`);
    const i_profit = $('#item_profit').val();
}

inputElementQty.addEventListener('input', handleInputQtyOnHand);
/*QtyOnHand input action end*/


/*loader full stock*/
loaderTableData();

function loaderTableData() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8081/ali/v1/stock/getAll",
        async: false,
        success: function (data) {
            var stockCost = 00;
            if (data.code === "00") {
                $('#stock-tbody').empty();
                for (let item of data.content) {
                    let id = item.id;
                    let item_code = item.item_code;
                    let item_name = item.item_name;
                    let perches_price = item.perches_price;
                    let selling_price = item.selling_price;
                    let item_discount = item.item_discount;
                    let final_selling_price = item.final_selling_price;
                    let qty = item.qty;
                    let inDate = item.inDate;

                    if (parseInt(qty) < 20) {
                        var row = `<tr id=${id}><td>${item_code}</td><td>${item_name}</td><td>${item_discount}</td><td style="background-color: #D32F2F">${qty}</td><td>${perches_price}</td><td>${selling_price}</td><td>${final_selling_price}</td><td>${inDate}</td><td><i class="fa-solid fa-pencil"></i></td><td><i class="fa-solid fa-trash-can"></i></td></tr>`;
                        $('#stock-tbody').append(row);
                    } else {
                        var row = `<tr id=${id}><td>${item_code}</td><td>${item_name}</td><td>${item_discount}</td><td>${qty}</td><td>${perches_price}</td><td>${selling_price}</td><td>${final_selling_price}</td><td>${inDate}</td><td><i class="fa-solid fa-pencil"></i></td><td><i class="fa-solid fa-trash-can"></i></td></tr>`;
                        $('#stock-tbody').append(row);

                    }
                    stockCost = parseInt(stockCost, 10) + (parseInt(perches_price, 10)*parseInt(qty, 10));
                }
            }
            /*set sub info set */
            var table = document.getElementById('stock-tbl').getElementsByTagName('tbody')[0];
            $('#stock_count').text(table.rows.length + "");
            $('#stock_cost').text(stockCost + "");


        },
        error: function (xhr, exception) {
            alert("Error")
        }
    });

}

/*update on action*/
$('#stock-tbl').on('click', 'tr td:nth-child(9)', (e) => {
    addNewItemOnAction();

    $('#selling_price').prop('disabled', false);
    $('#item_discount').prop('disabled', false);
    $('#QtyOnHand').prop('disabled', false);

    $('#stock_save_btn').css('display', 'none');
    $('#stock_update_btn').css('display', 'block');

    var row = $(e.target).closest('tr');
    var itemCode = row.find('td:eq(0)').text();
    var name = row.find('td:eq(1)').text();
    var discount = row.find('td:eq(2)').text();
    var qty = row.find('td:eq(3)').text();
    var perchesPrice = row.find('td:eq(4)').text();
    var marketPrice = row.find('td:eq(5)').text();
    var sellingPrice = row.find('td:eq(6)').text();

    $('#item_code').val(itemCode);
    $('#item_name').val(name);
    $('#perches_price').val(perchesPrice);
    $('#selling_price').val(marketPrice);
    $('#item_discount').val(discount);
    $('#final_selling_price').val(sellingPrice);
    $('#item_profit').val(sellingPrice - perchesPrice);
    $('#QtyOnHand').val(qty);

    select_id=row.attr('id');


});
/*delete On action*/
$('#stock-tbl').on('click', 'tr td:nth-child(10)', (e) => {
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
                url: "http://localhost:8081/ali/v1/stock/delete/" + rowId,
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


                    }
                },
                error: function (xhr, exception) {
                    notify('danger', 'saver err', 'saver err');
                }
            });


        }
    });
});

/*update on action*/
$('#stock_update_btn').on('click', (e) => {
    var updateData = {
        "id": select_id,
        "item_code": $('#item_code').val(),
        "item_name": $('#item_name').val(),
        "perches_price": $('#perches_price').val(),
        "selling_price": $('#selling_price').val(),
        "item_discount": $('#item_discount').val(),
        "final_selling_price": $('#final_selling_price').val(),
        "item_profit": $('#item_profit').val(),
        "qty": $('#QtyOnHand').val(),
    }
    var setting = {
        "url": "http://localhost:8081/ali/v1/stock/update",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(updateData),
    }
    $.ajax(setting).done(function (response) {
        console.log(response.code);
        if (response.code === "00") {
            addNewItemHideOnAction();
            clearAll();
            loaderTableData();
            notify('success', 'Your file has been save.', 'Save!');
        } else if (response.code === "06") {
            swal("Already item code", "You clicked the button!", "error");
        } else {
            swal("Save fail", "You clicked the button!", "error");
        }
    });
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

        }, 3000);
    })();
}