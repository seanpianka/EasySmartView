function use_jquery(tabId, func) 
{
    chrome.tabs.executeScript(tabId, { file: 'jquery-3.1.1.min.js'}, func );
}

function select_students() 
{
    use_jquery(chrome.tabs.executeScript(null, {
            file: "content.js"
        },
        function() {
            chrome.runtime.sendMessage("Content script run.");
        })
    );
}

document.addEventListener('DOMContentLoaded', function() {
    student_list_form = document.getElementById('student-list');

    document.getElementById('select-students-btn').addEventListener('click', function() {
        student_list = student_list_form.value.split('\n').map(function(str) { return str.split(','); });

        if (student_list[0][0] !== "") { action = 1; }
        else { action = student_list = 0; }
        chrome.storage.local.set({ 'student_list': student_list, 'action': action}, function() {
            if (student_list) { select_students(); }
        });
    });

    document.getElementById('clear-list-btn').addEventListener('click', function() {
        student_list_form.value = ""
    });

    document.getElementById('load-list-btn').addEventListener('click', function() {
        chrome.storage.local.get('student_list_text', function(val) {
            student_list_text = val['student_list_text'];

            if (student_list_text) { student_list_form.value = student_list_text; }
        });
    });

    document.getElementById('save-list-btn').addEventListener('click', function() {
        if (student_list_form.value)
        {
            chrome.storage.local.set({'student_list_text': student_list_form.value}, function() {
                chrome.runtime.sendMessage('List saved.'); 
            });
        }
    });
});
