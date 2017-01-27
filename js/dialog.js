document.addEventListener('DOMContentLoaded', function() {
    student_list_form = document.getElementById('student-list');

	$('#open-roster').on('change', function(){
        roster_input = document.getElementById("open-roster");
        var form_data = new FormData();
		form_data.append('userfile', roster_input.files[0], 'roster.pdf');
		form_data.append('requiredfile_userfile', '1');

        // send post request with pdf to extracter
        var base_url = "http://www.extractpdf.com"
        var url = base_url + ((/\?/).test(base_url) ? "&" : "?") + new Date().getTime()

		$.ajax({
			type: "POST",
			url: url,
			data: form_data,
			//use contentType, processData for sure.
			contentType: false,
			processData: false,
			success: function(msg) {
                var id = msg.match(/var url = (.*);/g)[0].split('\'')[1].split('\'')[0];
                var url = base_url + id;
                $.ajax({
                    url: url,
                    success: function(msg){
                        res_html = $($.parseHTML(msg));
                        students = res_html.find('#resultarea')[0].value.match(/^(.+),\s*(.+)$/gm);
                        console.log(students);
                        student_list_form.value = students.join("\r\n");
                    }
                });
			}
		});
	});

    document.getElementById('select-students-btn').addEventListener('click', function() {
        student_list = student_list_form.value.split('\n').map(function(str) { return str.split(','); });

        if (student_list[0][0] !== "") { action = 1; }
        else { action = student_list = 0; }
        chrome.storage.local.set({ 'student_list': student_list, 'action': action}, function() {
            if (student_list) 
            { 
                chrome.runtime.sendMessage({type:"select_students"});
            }
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
    });
});
