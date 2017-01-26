document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('open-btn').addEventListener('click', function() {
        var dialog_url = chrome.extension.getURL("dialog.html");
        chrome.windows.create({
            "url":dialog_url, 
            focused:true,
            type:'panel',
            width: 360,
            height: 360,
        });
    });
});
