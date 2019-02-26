document.addEventListener('DOMContentLoaded', () => {

    // referance inputs
    var display_name = document.querySelector('#display_name');
    var msg_bg = document.querySelector('#msg_bg');

    // validate display name availability onkeyup
    document.querySelector('#display_name').onkeyup = () => {

        // Get display_name value
        const name = display_name.value;
        
        // Initialize new request
        const request = new XMLHttpRequest();
        request.open('POST', '/validate_name'); 

        // Callback function for when request completes
        request.onload = () => {

            // Extract JSON data from request
            const data1 = JSON.parse(request.responseText);

            // Update the result div
            if (data1.name_available) {
                // mark as valid
                display_name.classList.remove('is-invalid');
                display_name.classList.add('is-valid');
            }
            else {
                // mark as invalid
                display_name.classList.remove('is-valid');
                display_name.classList.add('is-invalid');
            }

            // check for empty field
            if (display_name.value === "") {
                // mark as invalid
                display_name.classList.remove('is-valid');
                display_name.classList.add('is-invalid');
            }
        }

        // Add data to send with request
        const data = new FormData();
        data.append('display_name', name);

        // Send request
        request.send(data);
        return false; // stop page reload
    };

    // validate dropdown onchange
    document.querySelector('#msg_bg').onchange = () => {

        // mark as valid
        msg_bg.classList.remove('is-invalid');
        msg_bg.classList.add('is-valid');

        // ** keep dropdown text but change value and bg-color ** 
        
        // set bg color of the dropdown to the selected value
        msg_bg.style.backgroundColor = msg_bg.options[msg_bg.selectedIndex].style.backgroundColor;
        // set default option value to the selected value 
        msg_bg.childNodes[1].setAttribute("value", msg_bg.value);
        // select default option
        msg_bg.selectedIndex = "0";
    };

    // validate all form onsubmit
    document.querySelector('#start_form').onsubmit = () => {

        var no_name = false;
        var no_color = false;        

        // check for input presence
        if (display_name.value === "") {
            display_name.classList.add('is-invalid');                           
            no_name = true;
        };
        if (msg_bg.value === "") {
            msg_bg.classList.add('is-invalid');
            no_color = true;                       
        };
        // don't submit if invalid name present
        if (display_name.classList.contains('is-invalid')) {
            no_name = true;
        }
        if (no_name || no_color) {return false;} else {return true;};
    };

});
