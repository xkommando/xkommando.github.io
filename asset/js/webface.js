

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
headroom.init();


var btn_send = document.getElementById("btn_submit");

var lad_send = Ladda.create(btn_send);


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
            lad_send.start();
            //btn_send.attr("disabled", true);

            e.preventDefault();

            var cta_name = $("input#cta_name").val();
            var cta_email = $("input#cta_email").val();
            var cta_msg = $("textarea#cta_message").val();
            cta_msg = cta_msg.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

            var params = {
                "cta_name":cta_name,
                "cta_email": cta_email,
                "cta_message":cta_msg
            };
            var query = encodeQueryData(params);

            $.ajax({
                url: "http://webface-backend.appspot.com/api/support/contact",
                //url:"http://localhost:8080/api/support/contact",
                data: query,
                timeout: 8000,
                success: function( data ) {
                    var prompt = $("#modal_msg");
                    if (data == 200) {
                        prompt.text("Thanks for your message, I will reply to you soon.");
                    } else if (data < 500) {
                        prompt.text("Oops, could send the message, plase contact <a href='mailto:feedback2bowen@outlook.com'> </a>");
                    } else {
                        prompt.text("Server error, plase contact <a href='mailto:feedback2bowen@outlook.com'> </a>");
                    }

                    $("#modal_send").modal();

                    //$('#contact_form').find("input[type=text],input[type=email], textarea").val("");
                    $('#contact_form').trigger("reset");
                    lad_send.stop();
                },
                error: function(data) {
                    prompt.text("Oops, failed to send message due to network error<p>plase contact <a href='mailto:feedback2bowen@outlook.com'> for help</p>  </a>");
                    $("#modal_send").modal();
                    lad_send.stop();
                }
            });

        },
        filter: function() {
            return $(this).is(":visible");
        }
    });


});