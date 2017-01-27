chrome.browserAction.onClicked.addListener(function()
{
    var dialog_url = chrome.extension.getURL("dialog.html");
    chrome.windows.create({
        "url":dialog_url, 
        focused:true,
        type:'panel',
        width: 360,
        height: 360,
    });
});

function use_jquery(tabId, func) 
{
    chrome.tabs.executeScript(tabId, { file: 'js/libs/jquery-3.1.1.min.js'}, func );
}

function select_students() 
{
    chrome.tabs.query(
        {currentWindow: false, url: "*://*.campus.fsu.edu/*"},
        function (tabs) {
            use_jquery(
                tabs[0].id,
                function() {
                    chrome.tabs.executeScript(
                        tabs[0].id, 
                        { 
                            file: "js/content.js" 
                        }, 
                        function() { 
                            chrome.runtime.sendMessage("Content script run."); 
                        }
                    );
                }
            );
        }
    );
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if (request.type == "select_students")
    {
        select_students();
    }
});
