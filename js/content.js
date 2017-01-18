/*
 * An attempt replicate Python's str.title.
 */
function titlecase(str)
{
    return str.toLowerCase().split(' ').map(i => i[0].toUpperCase() + i.substring(1)).join(' ');
}

/*
 * 'action' keeps track of what operation should be performed. This is a hacky
 * workaround for my lack of understanding about how to use content script
 * functions, along with calling them from the background scripts (and passing
 * the necessary arguments).
 */
chrome.storage.local.get('action', function(val) {
    var action = val['action'];

    if (!action)
    {
        /*
         * Fall-back for no selected action.
         */
        console.log("No action was selected.");
    }
    else if (action === 1)
    {                 
        /*
         * Select the Students, given by the 'student_list' variable in chrome's
         * local storage, within the form under the 'Section Criteria' area of the
         * 'Create Smart View' section of the Smart View creation page.
         */
        chrome.storage.local.get('student_list', function(val) {
            var count = 0;
            var select_values = [];
            var simpleList = document.getElementById('simpleList');
            var student_list = val['student_list'].map(function(str) { 
                return str.map(function(s) {
                    return titlecase(s);
                }).join();
            });

            $("#simpleList > option").each(function() {
                name = this.text.split(',').map(function(s) { return titlecase(s); }).join();
                console.log(name);
                if (student_list.indexOf(name) >= 0)
                {
                    select_values.push(simpleList[count].value);
                }
                count++;
            });
            $('#simpleList').val(select_values);
        });
    }
    else
    {
        /*
         * Fall-back for a non-zero, unsupported selected action.
         */
        console.log("The selected action has no corresponding functionality.");
    }
});


/*
 * Reset action to zero for ensuring future actions are uniquely and
 * purposefully selected.
 */
chrome.storage.local.set({'action': 0}, function() { 
    chrome.runtime.sendMessage('Action completed, set to zero.'); 
});
