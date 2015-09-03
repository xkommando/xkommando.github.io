


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


var encodeQueryData = function (map) {
    var ret = [];
    for (var d in map)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(map[d]));
    return ret.join("&");
};

$(function() {


    $("input,select,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, e, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, e) {
            $("#btn_submit").attr("disabled", true);
            e.preventDefault();

            var cta_name = $("input#cta_name").val();
            var cta_email = $("input#cta_email").val();
            var cta_msg = $("textarea#cta_message").val();

            var params = {
                "cta_name":cta_name,
                "cta_email": cta_email,
                "cta_msg":cta_msg
            };
            var query = encodeQueryData(params);
            $.get( "http://webface-backend.appspot.com/api/support/contact", query)
            //$.get( "http://localhost:8080/api/support/contact", query)
                .done(function( data ) {
                    alert( "Mail Sended: " + data );
                });
        },
        filter: function() {
            return $(this).is(":visible");
        }
    });


});
