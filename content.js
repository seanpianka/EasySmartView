var action = chrome.storage.sync.get('action');

if (action === 1)
{
    var simpleList = document.getElementById('simpleList');
    var student_list = chrome.storage.sync.get('student_list');


    console.log(student_list);

    chrome.storage.sync.set({'action': 0}, function() { 
        chrome.runtime.sendMessage('Action completed, set to zero.'); 
    }); // done
}
