function select_students() {
    chrome.tabs.executeScript(null, {
        file: "content.js"
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('select-students-btn').addEventListener('click', function() {
        student_list = document.getElementById('student-list').value.split('\n').map(function(str) { 
            return str.split(',');
        });

        console.log(student_list);

        chrome.storage.sync.set(
            {
                'student_list': student_list,
                'action': 1
            },
            function() {
                chrome.runtime.sendMessage('Student list updated.');
            }
        );

        select_students();
    });
});



