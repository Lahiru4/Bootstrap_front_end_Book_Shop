
var currentDate = new Date().toISOString().split('T')[0];
$('#selectDate').val(currentDate);
getDalyOrders();
function getDalyOrders(){

var select_date=$('#selectDate').val();
console.log(select_date);

if(select_date == ''){
    notify('danger', 'select Date ','කරුනාකර දවස ඇතුලත් කරන්න');
}
$.ajax({
        method:"GET",
        url:"http://localhost:8081/ali/v1/order/getDalyOrders/"+select_date,
        async:false,
        success: function (data) {
        var stockCost=00;
            if (data.code==="00"){
                $('#orderlog-tbody').empty();
                 console.log(data.content);
                 var allItems=00;
                 var allCost=00;
                 var allP=00;
                 var count=00;
                for (let item of data.content){
                    let invoice_number=item.invoice_number;
                    let in_date=item.in_date;
                    let items_count=item.items_count;
                    let total=item.total;
                    let discount=item.discount;
                    let discount_rs=item.discount_rs;
                    let grand_total=item.grand_total;
                    let pay_amount=item.pay_amount;
                    let payAmount_type=item.payAmount_type;
                    let cost=item.cost;
                    let profit=item.profit;

                    var row=`<tr><td>${invoice_number}</td><td>${in_date}</td><td>${items_count}</td><td>${grand_total}</td><td>${cost}</td><td>${profit}</td><td><i class="fa-solid fa-eye"></i></td></tr>`;
                    $('#orderlog-tbody').append(row);

                    allItems=parseInt(allItems)+parseInt(items_count);
                    allCost=parseInt(cost,10)+parseInt(allCost,10);
                    allP=parseInt(profit,10)+parseInt(allP,10);
                    count++;
                }


                /*info set */

                $('#order_count_daly').text(count);
                $('#order_all_items_qty').text(allItems);
                $('#order_cost').text(allCost);
                $('#order_profit').text(allP);
            }
        },
        error: function (xhr, exception) {
            alert("Error");
        }
    });
}

$('#orderlog-tbl').on('click', 'tr td:nth-child(7)', (e) => {
    var row = $(e.target).closest('tr');
    var invoiceNumber = row.find('td:first-child').text().trim();
    console.log(invoiceNumber);
    $.ajax({
            method:"GET",
            url:"http://localhost:8081/ali/v1/order/getOrder/"+invoiceNumber,
            async:true,
            success: function (data) {
                if (data.code==="00"){

                     console.log(data.content);
                     let invoice_number=data.content.invoice_number;
                     let in_date=data.content.in_date;
                     let items_count=data.content.items_count;
                     let total=data.content.total;
                     let discount=data.content.discount;
                     let discount_rs=data.content.discount_rs;
                     let grand_total=data.content.grand_total;
                     let pay_amount=data.content.pay_amount;
                     let balance=data.content.balance;
                     let payAmount_type=data.content.payAmount_type;
                     let cashier=data.content.cashier;

                     $('#date').text("Date :"+in_date);
                     $('#reportInvoiceNumber').text("Invoice Number : "+invoice_number);
                     $('#items').text("Items : "+items_count);
                     $('#report_cashier_name').text("cashier : "+cashier);
                     $('#report_tot_amount').text(total+".00");
                     $('#report_discount').text(discount_rs+".00");
                     $('#reportGrandTotal').text(grand_total+".00");
                     $('#reportBillPayAmount').text(pay_amount+".00");
                     $('#reportBillBalance').text(balance+".00");

                     $.ajax({
                                 method:"GET",
                                 url:"http://localhost:8081/ali/v1/order/getAllOrderDetails/"+invoice_number,
                                 async:true,
                                 success: function (data2) {
                                     if (data2.code==="00"){
                                     $('#reportBillTableBody').empty();
                                        for (let item of data2.content){
                                            let item_name=item.item_name;
                                            let quantity=item.quantity;
                                            let mrp=item.mrp;
                                            let price=item.price;
                                            let amount=item.amount;
                                            var row=`<tr><td style="font-size: 21px;" colspan="5">${item_name}</td></tr>`;
                                            var row2=`<tr style="border-bottom: #181a1e solid 1px"><td></td><td style="text-align: center;font-size: 21px;">${quantity}</td><td style="text-align: center;font-size: 21px;">${mrp}</td><td style="text-align: center;font-size: 21px;">${price}</td><td style="text-align: center;font-size: 21px;">${amount}</td></tr>`;
                                            $('#reportBillTableBody').append(row);
                                            $('#reportBillTableBody').append(row2);
                                        }
                                        var divContent = document.getElementById('invoice').innerHTML;
                                        var printWindow = window.open('', '', 'width=400,height=600');
                                        printWindow.open();
                                        printWindow.document.write('<html><head><title></title>');
                                        printWindow.document.write('<link rel="stylesheet" href="assets/css/invoice.css">');
                                        printWindow.document.write('</head><body>');
                                        printWindow.document.write('<div>' + divContent + '</div>');
                                        printWindow.document.write('<script src="controller/Bulling.js"></script>');
                                        printWindow.document.write('</body></html>');
                                        printWindow.document.close();
                                     }
                                 }
                     });

                }
            },
            error: function (xhr, exception) {
                alert("Error");
            }
        });
});
/*info*/
function notify(type, message,hed) {
                    (() => {

                        var area = document.getElementById("notification-area");
                        let n = document.createElement("div");
                        let notification = Math.random().toString(36).substr(2, 10);
                        n.setAttribute("id", notification);
                        n.classList.add("notification", type);
                        n.innerHTML = "<div><b>" +hed+"</b></div>" + message;
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
                        }
                        else {
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

$("#orderlogSearch").on("input", function() {
            var filter = $(this).val().toUpperCase();
            $("#orderlog-tbl tbody tr").each(function() {
                var id = $(this).find("td:eq(0)").text();
                if (id.toUpperCase().indexOf(filter)> -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });