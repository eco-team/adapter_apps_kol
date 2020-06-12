window.isMobile = "";
window.typingTimer = 0;
window.doneTypingInterval = 500;

if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
) {
    window.isMobile = true;
} else {
    window.isMobile = false;
}

window.showOverlay = () => {
    $(".lightbox-overlay").addClass("open");
};

window.hideOverlay = () => {
    $(".lightbox-overlay").removeClass("open");
};

window.invalid_apitoken = () => {
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
};

window.openPopup = (id) => {
    $('#' + id).addClass('open');
}

window.closePopup = () => {
    $('.popup').removeClass('open');
}

window.findById = (obj, id) => {
    var result;
    for (var p in obj) {
        if (obj.jobid === id) {
            return obj;
        } else {
            if (typeof obj[p] === "object") {
                result = findById(obj[p], id);
                if (result) {
                    return result;
                }
            }
        }
    }
    return result;
}

$("input").keyup(function () {
    console.log('change')
    $(this).removeClass('require')
})


// check mobile phone ------------------------------------------------------
window.checkMobilePhone = phone => {
    const regPhone = /([0]{1})([6,8,9]{1})([0-9]{1})([0-9]{7})$/

    return regPhone.test(phone)
}
// ------------------------------------------------------------------------

// validateEmail --------------------------------------------------------
window.validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
// -------------------------------------------------------------------------


// ignore character --------------------------------------------------------
window.ignoreChar = event => {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (!(event.shiftKey == false && (keycode == 46 || keycode == 8 ||
        keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
        event.preventDefault();
    }
}
// -------------------------------------------------------------------------
window.checkInp = num => {
    var x = num
    if (isNaN(x)) {
        // console.log('char')
        return false;
    } else {
        // console.log('num')
        return true;
    }
}


window.statusText = text => {
    var TextContainer = '<div id="statustab"><p>' + text + '</p></div>'
    $('#container').append(TextContainer);

    setTimeout(() => {
        $('#statustab').remove();
    }, 1000);
}


window.columsale = [
    {
        title: "Sale name",
        dataIndex: "salename",
        key: "salename",
        class: "salename"
    },
    { title: "LineID", dataIndex: "lineid", key: "lineid", class: "lineid" },
    { title: "Phone", dataIndex: "mobile", key: "mobile", class: "mobile" },
    { title: "Email", dataIndex: "email", key: "email", class: "email" },
    {
        title: "Credit term",
        dataIndex: "creditterm",
        key: "creditterm",
        class: "creditterm"
    },
    {
        title: "Action",
        dataIndex: "contactid",
        key: "contactid",
        scopedSlots: { customRender: "action" },
        class: "action"
    }
];
window.columsupplier = [
    {
        title: "Supplier name",
        dataIndex: "salename",
        key: "salename",
        class: "salename"
    },
    { title: "LineID", dataIndex: "lineid", key: "lineid", class: "lineid" },
    { title: "Phone", dataIndex: "mobile", key: "mobile", class: "mobile" },
    { title: "Email", dataIndex: "email", key: "email", class: "email" },
    {
        title: "",
        dataIndex: "",
        key: "creditterm",
        class: "creditterm"
    },
    {
        title: "Action",
        dataIndex: "contactid",
        key: "contactid",
        scopedSlots: { customRender: "action" },
        class: "action"
    }
];

window.columnsKollist = [
    {
        title: "KOL name",
        dataIndex: "kolname"
    },
    {
        title: "Platform",
        dataIndex: "platformid",
        key: "platformid",
        scopedSlots: { customRender: "platformid" }
    },
    {
        title: "Scope of work",
        dataIndex: "scope"
    },
    {
        title: "Cost (THB)",
        dataIndex: "cost",
        scopedSlots: { customRender: "cost" },
        class: "cost"
    },
    {
        title: "Price (THB)",
        dataIndex: "price",
        scopedSlots: { customRender: "price" }
    },
    {
        title: "Margin (%)",
        dataIndex: "margin",
        scopedSlots: { customRender: "margin" }
    },
    {
        title: "Remark",
        dataIndex: "remark",
        class: "remark"
    },
    {
        title: "Timeline",
        dataIndex: "workingtime"
    }
];