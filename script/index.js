const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');
sideBar.classList.toggle('close');
menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');

});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

/*window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});*/

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});


$('#Dashboard').css('display','block');
$('#Order').css('display','block');
$('#Stock').css('display','none');
$('#User').css('display','none');

$('.side-menu>li').eq(0).on('click', () => {
    $('#Dashboard').css('display','block');
    $('#Stock').css('display','none');
    $('#Order').css('display','none');
    $('#User').css('display','none');

})
$('.side-menu>li').eq(0).on('click', () => {
   $('#Dashboard').css('display','none');
   $('#Stock').css('display','none');
   $('#Order').css('display','block');
   $('#User').css('display','none');
})

$('.side-menu>li').eq(1).on('click', () => {
   $('#Dashboard').css('display','none');
   $('#Stock').css('display','block');
   $('#Order').css('display','none');
   $('#User').css('display','none');
})
$('.side-menu>li').eq(2).on('click', () => {
   $('#Dashboard').css('display','none');
   $('#Stock').css('display','none');
   $('#User').css('display','block');
   $('#Order').css('display','none');
})

