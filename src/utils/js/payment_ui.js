$(".mask-input").each(function (i, b) {
    console.log(b, i);
    if (!$(b).hasClass("dropdown")) {
        (function (b) {
            if (i == 0) {
                $(b).addClass('selected');
            }
            b.onclick = function (e) {
                $(".mask-input.selected").each(function (_, el) {
                    $(el).removeClass('selected');
                })
                $(b).addClass('selected');
            }
            var mask = b.getAttribute("data-placeholder");
            var optional = 0;
            var masked = false;
            for (var c in mask) {
                c = mask[c];
                switch (c) {
                    case "[":
                        masked = true;
                        break;
                    case "]":
                        masked = false;
                        break;
                    default:
                        if (!masked) {
                            b.innerHTML += "<m>" + c + "</m>"
                        } else {
                            if (c == 9) {
                                optional++;
                            }
                            b.innerHTML += "<c data-mask=" + c + " class=empty>" + c + "</c>"
                        }
                        b.value = c;
                }
            }
            b.position = 0;
            b.chars = b.querySelectorAll("c");

            b.onkey = function (key) {
                console.log(b, this);
                if (key != 'C' && b.position < b.chars.length) {
                    b.chars[b.position].innerHTML = key;
                    b.chars[b.position].className = 'ok';
                    b.position++;
                } else if (key == 'C' && b.position > 0) {
                    b.position--;
                    b.chars[b.position].innerHTML = b.chars[b.position].getAttribute("data-mask");
                    b.chars[b.position].className = 'empty';
                }
                if (b.position >= (b.chars.length - optional)) {
                    b.className = "mask-input selected done";

                    if (document.querySelectorAll(".mask-input").length == document.querySelectorAll(".mask-input.done").length) {
                        document.querySelector('.continue').style.display = 'block';
                    }
                } else {
                    document.querySelector('.continue').style.display = 'none';
                    b.className = "mask-input selected";
                }
            }
        })(b);
    } else {
        (function (b) {
            b.onclick = function (e) {
                $(".mask-input.selected").each(function (_, el) {
                    $(el).removeClass('selected');
                })
                $(b).addClass('selected');
            }
            $(b).find(".value").click(function (v) {
                console.log($(b).find(".text"))
                $(b).find(".text").data('value',$(this).data('value'));
                $(b).find(".text").text($(this).text());

                v.stopPropagation();
                if (document.querySelectorAll(".mask-input").length == document.querySelectorAll(".mask-input.done").length) {
                    document.querySelector('.continue').style.display = 'block';
                }
                $(b).removeClass('selected').addClass('done');
                $(b).next().addClass('selected');
                return false;
            })
        })(b);
    }
});

$(".digit-button").each(function (_, b) {
    b.onclick = function () {
        document.querySelector(".mask-input.selected").onkey($(b).data("key"));
        return false;
    }
});

document.querySelector('.continue').onclick = function (e) {
    var params = [];
    var i = 0;
    $(".mask-input.done").each(function (_, t) {
        var text = '';
        if (!$(t).hasClass("dropdown")) {
            for (var c in t.children) {
                if (!t.children.hasOwnProperty(c))
                    continue;
                c = t.children[c]
                if (c.className == 'ok') {
                    text += c.innerHTML;
                }
            }
        } else {
            text = $(t).data('value');
        }
        params.push({name: $(t).data("name"), value: text});
        i++;
    })

    window.location = continueLink + encodeURIComponent(JSON.stringify(params));
}