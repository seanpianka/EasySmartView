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


function createCORSRequest(method, url, sync) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, sync);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

document.addEventListener('DOMContentLoaded', function() {
    student_list_form = document.getElementById('student-list');

	$('#open-roster').on('change', function(){
        roster_input = document.getElementById("open-roster");
        var form_data = new FormData();
		form_data.append('userfile', roster_input.files[0], 'roster.pdf');
		form_data.append('requiredfile_userfile', '1');

        // send post request with pdf to extracter
        var url = "http://www.extractpdf.com/"
        url = url + ((/\?/).test(url) ? "&" : "?") + new Date().getTime()
		var http = createCORSRequest('POST', url, true);

		if (!http) { throw new Error('CORS not supported.'); }
        http.setRequestHeader(
			"Content-type", 
            "multipart/form-data; boundary=----WebKitFormBoundaryHfmWClWWbX7pw7rj"
        );
        xhr.overrideMimeType('text/plain; charset=x-user-defined');

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                res_html = $.parseHTML(http.responseText);
                console.log(res_html);
            }
        };

        http.send(form_data);
	});

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

    document.getElementById('save-list-btn').addEventListener('click', function() {
        if (student_list_form.value)
        {
            chrome.storage.local.set({'student_list_text': student_list_form.value}, function() {
                chrome.runtime.sendMessage('List saved.'); 
            });
        }
    });

    document.getElementById('load-list-storage-btn').addEventListener('click', function() {
        chrome.storage.local.get('student_list_text', function(val) {
            student_list_text = val['student_list_text'];

            if (student_list_text) { student_list_form.value = student_list_text; }
        });
    });

    document.getElementById('load-list-pdf-btn').addEventListener('click', function() {
        // get pdf data
        $('#open-roster').trigger('click');

        // https://stackoverflow.com/questions/28858027/how-to-read-file-from-chrome-extension
        // https://stackoverflow.com/questions/38020515/chrome-extension-open-file-dialog-from-background-script
        // https://stackoverflow.com/questions/14012348/how-to-use-chrome-extension-filesystem-api
        // https://stackoverflow.com/questions/26884140/open-import-file-in-a-chrome-extension
        // https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        // http://www.extractpdf.com/
    });
});
