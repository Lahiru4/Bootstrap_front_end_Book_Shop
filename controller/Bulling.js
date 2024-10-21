$('#items_search').focus();

function setInvoiceNumber() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8081/ali/v1/order/getInvoiceNumber",
        async: true,
        success: function (data) {
            $('#invoice_number').text("Invoice Number : " + parseInt(data));
            $('#reportInvoiceNumber').text("Invoice Number : " + parseInt(data));
        },
        error: function (xhr, exception) {
            alert("Error")
        }
    });
}

setInvoiceNumber();

var selectedRowIndex = 0;

const currentDateTime = new Date();
const options = {timeZone: 'Asia/Colombo'};
const currentDateTimeIST = currentDateTime.toLocaleString('en-US', options);
$('#date').text(currentDateTimeIST);

document.getElementById('billing-stock-tbl').addEventListener('click', function (e) {
    if (e.target.tagName === 'TD' && e.target.parentNode.tagName === 'TR') {

        var row = e.target.parentNode;  // Get the clicked table row
        var rowId = row.id;
        console.log(rowId);
        var cells = Array.from(e.target.parentNode.children);

        var name = cells[1].textContent;
        var qty = cells[2].textContent;
        var mr_price = cells[3].textContent;
        var price = cells[4].textContent;
        var date = cells[5].textContent;
        if (name === "Description") {
            return;
        }
        openSweetAlert(name, qty, price, date, e.target.parentNode, rowId, mr_price);
    }
});

function openSweetAlert(name, qty, price, date, clickedRow, rowId, mrp) {
    var audio = new Audio('assets/sound/beep-07a.wav');
    audio.play();
    Swal.fire({
        title: 'ADD TO CART',
        html:
            '<div id="addtoCartWrapper">' +
            '<label id="addtoCartItemName">' + name + '</label>' + '<br>' +
            '<div id="addtoCartItemInDateOnHWrapper">' + '<label id="addtoCartItemInDade">In Date:</label>' + '<label class="popupQty">' + date + '</label>' + '</div>' + '<br>' +
            '<div id="addtoCartItemOnHWrapper">' + '<label id="addtoCartItemOnH">Qty. On hand:</label>' + '<label class="popupQty">' + qty + '</label>' + '</div>' + '<br>' +
            '<div id="addtoCartItemPriceWrapper">' + '<label>Price:</label>' + '<div>' + '<span class="blue-colour">LKR </span>' + '<label class="popupPrice"><input id="addtoCartItemPrice" type="number">' + price + '</label>' + '</div>' + '</div>' +
            '<div id="addtoCartItemQtyWrapper">' + '<label id="addtoCartItemQty">Quantity:</label>' + '<input id="billingPopupQty"" placeholder="Enter Quantity" type="number">' + '</div>' +
            '<div>',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        confirmButtonText: '<i class="bx bxs-cart-add"></i><span class="addtocartbtnTxt">Add to cart</span>',
        confirmButtonClass: 'custom-confirm-button',
        cancelButtonText: 'Cancel',
        cancelButtonClass: 'custom-cancel-button',
        customClass: 'popUp',
        onOpen: function () {
            var billingPopupQty = document.getElementById('billingPopupQty');
            billingPopupQty.focus();
            billingPopupQty.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    Swal.clickConfirm();
                }
            });
        }
    }).then(function (result) {
        var audio = new Audio('assets/sound/beep-07a.wav');
        audio.play();
        if (result.isConfirmed) {
            var setTblItemName = name;
            var setTblItemQty = $('#billingPopupQty').val();
            var newPrice = $('#addtoCartItemPrice').val();
            if (parseInt(newPrice, 10) > 0) {
                price = newPrice;
            }
            var setTblItemPrice = price;
            var setTblItemTot = parseInt(mrp, 10) * setTblItemQty;
            var setTblItemAmount = setTblItemTot - ((parseInt(mrp, 10) - parseInt(price, 10)) * setTblItemQty);

            if ((qty - setTblItemQty) < 0 || setTblItemQty <= 0) {
                notify('danger', 'The item quantity you entered is not in stock. (ඔබ ඇතුලත් කල අයිටම් ප්‍ර්මානය ගබඩාවේ නොමැත.)', 'invalid input')
                var audio = new Audio('assets/sound/beep-03.wav');
                audio.play();
            } else {
                console.log(qty)
                console.log(setTblItemQty)
                clickedRow.cells[2].textContent = qty - setTblItemQty;

                var table = document.getElementById('table-bill').getElementsByTagName('tbody')[0];
                for (var i = 0; i < table.rows.length; i++) {
                    var row = table.rows[i];
                    var Id = row.id;
                    if (Id === rowId) {
                        removeTableRoe(row);
                    }
                }
                var newRow = table.insertRow(table.rows.length);
                newRow.id = rowId;

                var cell1 = newRow.insertCell(0);
                var cell2 = newRow.insertCell(1);
                var cell3 = newRow.insertCell(2);
                var cell4 = newRow.insertCell(3);
                var cell5 = newRow.insertCell(4);
                var cell6 = newRow.insertCell(5);
                var cell7 = newRow.insertCell(6);
                var cell8 = newRow.insertCell(7);
                cell2.style.display = 'none';
                var previousCell5Value = 0;

                if (table.rows.length > 1) {
                    previousCell5Value = parseFloat(table.rows[table.rows.length - 2].cells[5].textContent);
                }
                var totalAmount = previousCell5Value + price * setTblItemQty;


                cell1.innerHTML = setTblItemName;
                cell2.innerHTML = rowId;
                cell3.innerHTML = setTblItemQty;
                cell4.innerHTML = mrp;
                cell5.innerHTML = setTblItemTot;
                cell6.innerHTML = (parseInt(price, 10) - parseInt(mrp, 10)) * setTblItemQty;
                cell7.innerHTML = setTblItemAmount;
                cell8.innerHTML = '<i class="fa-solid fa-trash-can" onclick="removeTableRow(this)"></i>';

                var row = `<tr class=${rowId}><td style="font-size: 21px;" colspan="5">${setTblItemName}</td></tr>`;
                var row2 = `<tr class=${rowId} style="border-bottom: #181a1e solid 1px"><td></td><td style="text-align: center;font-size: 21px;">${setTblItemQty}</td><td style="text-align: center;font-size: 21px;">${mrp}</td><td style="text-align: center;font-size: 21px;">${setTblItemTot}</td><td style="text-align: center;font-size: 21px;">${(parseInt(price, 10) - parseInt(mrp, 10)) * setTblItemQty}</td><td style="text-align: center;font-size: 21px;">${setTblItemAmount}</td></tr>`;
                $('#reportBillTableBody').append(row);
                $('#reportBillTableBody').append(row2);
                updateTotalAmount();
            }
        } else if (result.isDismissed) {
            console.log('Cancel button clicked');
        }
    });
}


function updateTotalAmount() {

    var table = document.getElementById('table-bill').getElementsByTagName('tbody')[0];
    var totalAmount = 0;
    var totaleDescAmount = 0;
    for (var i = 0; i < table.rows.length; i++) {
        totalAmount += parseFloat(table.rows[i].cells[6].textContent);
        totaleDescAmount += parseFloat(table.rows[i].cells[5].textContent);
    }
    $('#billItems').text("Items : " + table.rows.length);

    $('#items').text("Items : " + table.rows.length);
    $('#billing-Total-lbl').text(totalAmount);
    $('#billing-Total-lbl-rs').text("Rs.");
    $('#billing-Total-lbl-double-dot').text(".00");
    $('#report_tot_amount').text(totalAmount + ".00");
    $('#billing-subTotal-lbl').text(totalAmount + ".00");
    $('#reportGrandTotal').text(totalAmount + ".00");

    $('#totalDiscount-lbl').text("Rs." + totaleDescAmount + ".00");
    $('#totDesi-count').val(0);
}


window.removeTableRow = function (element) {
    var audio = new Audio('assets/sound/beep-07a.wav');
    audio.play();
    var row = element.closest('tr');
    var id = row.id;
    var table = document.getElementById('reportBillTable').getElementsByTagName('tbody')[0];
    for (var i = 0; i < table.rows.length; i++) {
        var row001 = table.rows[i];
        var Id_id = row001.className;
        if (id === Id_id) {
            row001.remove();
            console.log(Id_id + "okay");
            var temp = (i + 1);
            table.rows[i].remove();
        }
    }
    var itemName = row.cells[0].textContent;
    var removedQty = parseInt(row.cells[2].textContent, 10);
    console.log(removedQty + "removedQty");
    row.remove();
    updateTotalAmount();
    updateParentTable(id, removedQty);
};

function removeTableRoe(row) {
    var id = row.id;
    var table = document.getElementById('reportBillTable').getElementsByTagName('tbody')[0];
    for (var i = 0; i < table.rows.length; i++) {
        var row001 = table.rows[i];
        var Id_id = row001.className;
        if (id === Id_id) {
            row001.remove();
            console.log(Id_id + "okay");
            var temp = (i + 1);
            table.rows[i].remove();
        }
    }
    var itemName = row.cells[0].textContent;
    var removedQty = parseInt(row.cells[2].textContent, 10);
    console.log(removedQty + "removedQty");
    row.remove();
    updateTotalAmount();
    updateParentTable(id, removedQty);
}

function clear1() {

    $('#customer_name').val('');
    $('#totDesi-count').val('');
    $('#totDesi-count_rs').text("");
    $('#payAmount').val('');
    $('#billing-balance-lbl').text("00.00");

    $('#report_discount').text("00.00");
    $('#reportBillPayAmount').text("00.00");
    $('#reportBillBalance').text("00.00");

    $('#billing-subTotal-lbl').text("00");
    $('#report_tot_amount').text("00.00");
    $('#reportGrandTotal').text("00.00");

    $('#bill_table_boday').empty();

    $('#reportCustomerName').css('display', 'none');


}

function updateParentTable(id, removedQty) {
    var matchingRow = $("#billing-stock-tbl tbody tr#" + id);
    var currentQty = parseInt(matchingRow.find("td:eq(2)").text(), 10);
    console.log(currentQty + "currentQty");
    matchingRow.find("td:eq(2)").text(currentQty + removedQty);

}


$("#items_search").on("input", function () {
    removerStockTableSelect();
    selectedRowIndex = 0;
    var filter = $(this).val().toUpperCase();
    $("#billing-stock-tbl tbody tr").each(function () {
        var id = $(this).find("td:eq(0)").text();
        var name = $(this).find("td:eq(1)").text();
        var name = $(this).find("td:eq(1)").text();
        var inDate = $(this).find("td:eq(4)").text();
        if (id.toUpperCase().indexOf(filter) > -1 || name.toUpperCase().indexOf(filter) > -1 || inDate.toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

function payOnAction() {
    var table = document.getElementById('table-bill').getElementsByTagName('tbody')[0];
    if (table.rows.length > 0) {
        if ($('#totDesi-count').val().length > 0 && $('#payAmount').val().length) {
            var divContent = document.getElementById('invoice').innerHTML;
            var printWindow = window.open('', '', 'width=800,height=600');
            printWindow.open();
            printWindow.document.write('<html><head><title></title>');
            printWindow.document.write('<link rel="stylesheet" href="assets/css/invoice.css">');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<div>' + divContent + '</div>');
            printWindow.document.write('<script src="controller/Bulling.js"></script>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();

            /*save orders*/

            const orderDTO = {
                "total": $("#billing-Total-lbl").text(),
                "discount": $("#totDesi-count").val(),
                "discount_rs": $("#totDesi-count_rs").text(),
                "grand_total": $("#billing-subTotal-lbl").text(),
                "pay_amount": $("#payAmount").val(),
                "balance": $("#billing-balance-lbl").text(),
                "payAmount_type": $("#paymentMethode").val(),
                "items_count": document.getElementById('table-bill').getElementsByTagName('tbody')[0].rows.length,
                "in_date": currentDateTimeIST,
                "cashier": $("#setUserName").text(),

            }
            var settings1 = {
                "url": "http://localhost:8081/ali/v1/order/saveOrder",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(
                    orderDTO,
                ),
            };
            $.ajax(settings1).done(function (response) {
                console.log(response);
                if (response.code === "00") {
                    const dataArray = [];
                    $('#table-bill tbody tr').each(function () {
                        const rowData = {
                            invoice_number: response.content.invoice_number,
                            item_name: $(this).find('td:eq(0)').text(),
                            itemId: $(this).attr('id'),
                            quantity: $(this).find('td:eq(2)').text(),
                            mrp: $(this).find('td:eq(3)').text(),
                            price: $(this).find('td:eq(4)').text(),
                            amount: $(this).find('td:eq(5)').text()
                        };
                        dataArray.push(rowData);
                    });
                    console.log(dataArray);
                    var settings2 = {
                        "url": "http://localhost:8081/ali/v1/order/saveOrderDetails",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify(
                            dataArray,
                        ),
                    };
                    $.ajax(settings2).done(function (response2) {
                        console.log(response2);
                        if (response2.code === "00") {
                            printWindow.print();
                            printWindow.close();
                            $('#items_search').focus();
                            clearAll();
                            setInvoiceNumber();
                            var audio = new Audio('assets/sound/sus_bell.mp3');
                            audio.play();
                            notify('success', 'Order is success notification message', 'order');
                            clear1();
                        }
                    });

                }
            });
        } else {
            notify('danger', 'plz Input All Data (කරුනාකර දත්ත සියල්ල එකතු කරන්න)', 'Input All Data')
            var audio = new Audio('assets/sound/beep-03.wav');
            audio.play();
        }
    } else {
        notify('danger', 'plz select Items (කරුනාකර අයටම් එකතු කරන්න)', 'Not Select items')
        var audio = new Audio('assets/sound/beep-03.wav');
        audio.play();
    }


}

function getAllTableDataBillItems() {
    const tableBody = document.getElementById("bill_table_boday");
    const tableRows = tableBody.querySelectorAll("tr");

    const dataArray = [];

    tableRows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll("td");

        cells.forEach(cell => {
            rowData.push(cell.textContent.trim());
        });

        dataArray.push(rowData);
    });

    return dataArray;
}

/*
notification
*/
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


/*    */

var itemsSearchInput = document.getElementById('items_search');


// Assuming you have a variable to keep track of the currently selected row index

// Get the table element
var table = document.getElementById('billing-stock-tbl');

function removerStockTableSelect() {
    for (var i = 0; i < table.rows.length; i++) {
        table.rows[i].classList.remove('selected-row');
    }
}

itemsSearchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        var code0 = table.rows[selectedRowIndex].cells[0].textContent;
        var name0 = table.rows[selectedRowIndex].cells[1].textContent;
        var qty0 = table.rows[selectedRowIndex].cells[2].textContent;
        var price0 = table.rows[selectedRowIndex].cells[3].textContent;
        var indate0 = table.rows[selectedRowIndex].cells[4].textContent;

        if (name0 === "Description" || code0 === "Code") {
            var audio = new Audio('assets/sound/beep-03.wav');
            audio.play();
            return;
        }
        var table0 = document.getElementById('billing-stock-tbl').getElementsByTagName('tbody')[0];
        console.log(selectedRowIndex - 1);
        var row = table0.rows[selectedRowIndex - 1];
        openSweetAlert(name0, qty0, price0, indate0, row, row.id);
    }


    // Check if the pressed key is an arrow key
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        // Prevent the default behavior of arrow keys (scrolling the page)
        e.preventDefault();

        // Calculate the new selected row index based on the arrow key pressed
        if (e.key === 'ArrowUp' && selectedRowIndex > 0) {
            selectedRowIndex--;
        } else if (e.key === 'ArrowDown' && selectedRowIndex < table.rows.length - 1) {
            selectedRowIndex++;
        }

        // Deselect all rows
        for (var i = 0; i < table.rows.length; i++) {
            table.rows[i].classList.remove('selected-row');
        }

        // Select the new row
        table.rows[selectedRowIndex].classList.add('selected-row');

        // Optionally, you can perform additional actions based on the selected row
        // For example, you can get data from the selected row and do something with it
        var selectedRowData = table.rows[selectedRowIndex].cells[0].textContent;
        console.log('Selected Row Data:', selectedRowIndex);
    }
});
lodeStockItems();

function lodeStockItems() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8081/ali/v1/stock/getAll",
        async: true,
        success: function (data) {
            if (data.code === "00") {
                $('#billing-stock-tbody').empty();
                for (let item of data.content) {
                    let id = item.id;
                    let item_code = item.item_code;
                    let item_name = item.item_name;
                    let perches_price = item.perches_price;
                    let selling_price = item.selling_price;
                    let item_discount = item.item_discount;
                    let final_selling_price = item.final_selling_price;
                    let item_profit = item.item_profit;
                    let qty = item.qty;
                    let total_profit = item.total_profit;
                    let inDate = item.inDate;
                    var row = `<tr id=${id}><td>${item_code}</td><td>${item_name}</td><td>${qty}</td><td>${selling_price}</td><td>${final_selling_price}</td><td>${inDate}</td></tr>`;
                    $('#billing-stock-tbody').append(row);
                }
            }
        },
        error: function (xhr, exception) {
            alert("Error")
        }
    });

}


const input_totDesi = document.getElementById('totDesi-count');

function totDesi_countTypeOnAction(event) {
    const typedText = event.target.value;
    console.log(typedText);
    var totAmount = $('#billing-Total-lbl').text();
    if (parseInt(typedText, 10) >= 0 && parseInt(typedText, 10) <= 100 && parseInt(totAmount, 10) > parseInt(typedText, 10)) {
        $('#totDesi-count').css('color', 'black');
        console.log(parseInt(totAmount, 10));
        console.log(parseInt((parseInt(totAmount, 10) / 100, 10)));
        console.log(parseInt((parseInt(totAmount, 10) / 100) * parseInt(typedText, 10), 10));
        var dicP = parseInt((parseInt(totAmount, 10) / 100) * parseInt(typedText, 10), 10);
        var subTot = parseInt(parseInt(totAmount, 10) - (parseInt(totAmount, 10) / 100) * parseInt(typedText, 10), 10);
        $('#report_discount').text(dicP + ".00");
        $('#totDesi-count_rs').text("");
        $('#totDesi-count_rs').text(dicP);
        $('#billing-subTotal-lbl').text(subTot);
        $('#reportGrandTotal').text(subTot + ".00");


    } else {
        $('#totDesi-count').css('color', 'red');
    }
}

input_totDesi.addEventListener('input', totDesi_countTypeOnAction);


$(document).ready(function () {
    $('#totDesi-count').keydown(function (e) {
        if (e.keyCode == 13) {
            $('#payAmount').focus();
        }
    });

    $('#payAmount').keydown(function (e) {
        if (e.keyCode == 13) {
            $('#paymentMethode').focus();
        }
    });
    $('#paymentMethode').keydown(function (e) {
        if (e.keyCode == 13) {
            $('#user_id').focus();
        }
    });
    $('#user_id').keydown(function (e) {
        if (e.keyCode == 13) {

            /**/
            var user_id = $('#user_id').val();
            if (user_id > 0) {
                $.ajax({
                    method: "GET",
                    url: "http://localhost:8081/ali/v1/user/getUser/" + user_id,
                    async: true,
                    success: function (data) {
                        if (data.code === "00") {
                            let username = data.content.username;
                            $('#report_cashier_name').text("cashier :" + username);
                            $('#setUserName').text(username);
                            $('#setUserName').text(username);
                            $('#payOnButton').focus();

                        } else {
                            $('#user_id').val('');
                            $('#user_id').focus();
                        }
                    },
                    error: function (xhr, exception) {
                        alert("Error")
                    }
                });
            }

            /**/
        }
    });

    $('#customer_name').keydown(function (e) {
        if (e.keyCode == 13) {
            $('#totDesi-count').focus();
        }
    });
});

$('#payAmount').on('input', () => {
    var inputText = $('#payAmount').val();
    $('#reportBillPayAmount').text(inputText + ".00");
    var Total = $('#billing-subTotal-lbl').text();

    if (parseInt(inputText) > parseInt(Total)) {
        $('#billing-balance-lbl').text(parseInt(inputText) - parseInt(Total));
        $('#reportBillBalance').text(parseInt(inputText) - parseInt(Total));
    } else {
        $('#billing-balance-lbl').text("00");
        $('#reportBillBalance').text("00");
    }
});

$('#customer_name').on('input', () => {
    if ($('#customer_name').val().length > 0) {
        $('#reportCustomerName').css('display', 'block');
        $('#reportCustomerName').text("Customer :" + $('#customer_name').val());
    } else {
        $('#reportCustomerName').css('display', 'none');
    }


});

function clearAll() {
    $('#reportBillTableBody').empty();
    $('#billing-Total-lbl').text("");
}

function endSalle() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8081/ali/v1/email/sendDalayReport",
        async: true,
        success: function (data) {
            if (data === 'okay') {
                alert("okay");
            }
        },
        error: function (xhr, exception) {

        }
    });
}