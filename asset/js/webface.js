


// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
});

// cache
var $root = $('html, body');

//创建 Headroom 对象，将页面元素传递进去
var headroom = new window.Headroom(
    document.getElementById("wf_nav"), {
    "tolerance": 5,
    "offset": 80,
    "classes": {
        "initial": "animated",
        "pinned": "slideDown",
        "unpinned": "slideUp"
    }
});

// 初始化
headroom.init();


$(function() {

    $("#contact_form").change(function() {
        alert("Stop there! the message function is not ready yet.");
        $(this).closest('form').find("input[type=text],input[type=email], textarea").val("");
    });

    $("#btn_submit").click(function (e) {
        e.preventDefault();
        alert("Oops, submit function not implemented yet!");
        $(this).closest('form').find("input[type=text],input[type=email], textarea").val("");
    });

});
