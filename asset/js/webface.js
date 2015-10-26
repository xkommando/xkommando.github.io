Webface.localize = function () {
    if (Webface.localLang) {
        $('.i18n-txt').each(function () {
            var key = $(this).attr("data-i18n-key");
            if (key) {
                var localPhrase = Webface.localLang[key];
                if (localPhrase)
                    $(this).html(localPhrase);
            }
        });
        $(".i18n-txt-p").each(function () {
            var key = $(this).attr("data-i18n-key");
            if (key) {
                var localPhrase = Webface.localLang[key];
                if (localPhrase)
                    $(this).attr("placeholder", localPhrase);
            }
        });
    }
};
Webface.encodeQueryData = function (map) {
    var ret = [];
    for (var d in map)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(map[d]));
    return ret.join("&");
};
Webface.escapeHTML = function (str) {
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
};
Webface.getLocalLangOrElse = function(key, def) {
    if (Webface.localLang) {
        var v = Webface.localLang[key];
        console.log(key + "   " + v);
        if (v === undefined)
            return def;
        else
            return v;
    }
    return def;
};
Webface.countVisit = function () {
    var reqLoc = new XMLHttpRequest();

    //reqLoc.open("GET", "http://localhost:8080/api/location-pv-count?app-id=cbw-webface",
    reqLoc.open("GET", "http://webface-backend.appspot.com/api/location-pv-count?app-id=cbw-webface",
        true); // true for async
    // do not wait for response, as some request comes from behind the GWF
    reqLoc.onreadystatechange = function () {
        if (reqLoc.readyState == 4 && reqLoc.status == 200)
            Webface.location = JSON.parse(reqLoc.responseText);
    };
    reqLoc.send(null);
};

Webface.countVisit();

$(document).ready(function () {
// cached
    var $body = $('body');
// jQuery for page scrolling feature - requires jQuery Easing plugin
    $body.on('click', '.page-scroll a', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    new window.Headroom(
        document.getElementById("wf_nav"), {
            "tolerance": 5,
            "offset": 80,
            "classes": {
                "initial": "animated",
                "pinned": "slideDown",
                "unpinned": "slideUp"
            }
        }).init();
// Floating label headings for the contact form
    $body.on("input propertychange", ".floating-label-form-group", function (e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function () {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function () {
        $(this).removeClass("floating-label-form-group-with-focus");
    });

    var lad_send = Ladda.create(document.getElementById("btn_submit"));
    $("input,select,textarea").jqBootstrapValidation({
        preventSubmit: true,
        //submitError: function ($form, e, errors) {
        //    // additional error messages or events
        //},
        submitSuccess: function ($form, e) {
            e.preventDefault();
            lad_send.start();
            //btn_send.attr("disabled", true);

            var cta_name = $("input#cta_name").val();
            var cta_email = $("input#cta_email").val();
            var cta_msg = Webface.escapeHTML($("#cta_message").val());
            var params = {
                "cta_name": cta_name,
                "cta_email": cta_email,
                "cta_message": cta_msg
            };
            var query = Webface.encodeQueryData(params);
            var promptModalTitle = $("#modal_title");
            var promptModalMsg = $("#modal_msg");

            var title_err =  "Oops, could send the message.";
            var msg_err = "plase contact me via <a href='mailto:feedback2bowen@outlook.com'>feedback2bowen@outlook.com</a>.";
            var title;
            var msg;
            $.ajax({
                url: "http://webface-backend.appspot.com/api/support/contact",
                //url:"http://localhost:8080/api/support/contact",
                data: query,
                timeout: 8000,
                success: function (data) {
                    try {
                        if (data == 200) {
                            title = Webface.getLocalLangOrElse("contactMsg-200-title", "Message Sent Successfully.");
                            msg = Webface.getLocalLangOrElse("contactMsg-200-msg", "Thanks for your message, I will reply to you soon.");
                        } else {
                            title = Webface.getLocalLangOrElse("contactMsg-error-title",  "Oops, could send the message.");
                            msg = Webface.getLocalLangOrElse("contactMsg-error-msg", "plase contact me via <a href='mailto:feedback2bowen@outlook.com'>feedback2bowen@outlook.com</a>.");
                        }
                    } catch (err) {
                        title = title_err;
                        msg = msg_err;
                    }

                    promptModalTitle.html(title);
                    promptModalMsg.html(msg);

                    $("#modal_send").modal();
                    $('#contact_form').trigger("reset");
                    lad_send.stop();
                },
                error: function (data) {
                    title = Webface.getLocalLangOrElse("contactMsg-error-title", "Oops, could send the message.");
                    msg = Webface.getLocalLangOrElse("net-error-msg", "network error plase check your connection, <p> Or contact me for help <a href='mailto:feedback2bowen@outlook.com'> feedback2bowen@outlook.com </a></p>");

                    promptModalTitle.html(title);
                    promptModalMsg.html(msg);

                    $("#modal_send").modal();
                    lad_send.stop();
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        }
    });
});