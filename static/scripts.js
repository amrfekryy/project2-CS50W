       
document.addEventListener('DOMContentLoaded', () => {

  // disable esc/click exit and show modal
  $('#exampleModal').modal({keyboard: false, backdrop: 'static'})
  $('#exampleModal').modal('show')

  // keep messages scroll at bottom
  var messageBody = document.querySelector('#msg-body');
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

  // validate if display name available onkeyup (mark is-valid/is-invalid)
  var display_name = document.querySelector('#display_name');
  var display_name_feedback = document.querySelector('#display_name_feedback');
  display_name.onkeyup = () => {
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
            display_name_feedback.classList.remove('invalid-feedback');
            display_name_feedback.classList.add('valid-feedback');
            display_name_feedback.innerHTML = "Looks good!"
        }
        else {
            // mark as invalid
            display_name.classList.remove('is-valid');
            display_name.classList.add('is-invalid');
            display_name_feedback.classList.remove('valid-feedback');
            display_name_feedback.classList.add('invalid-feedback');
            display_name_feedback.innerHTML = "This name is taken!"
        }
        // check for empty field
        if (display_name.value === "") {
            // mark as invalid
            display_name.classList.remove('is-valid');
            display_name.classList.add('is-invalid');
            display_name_feedback.classList.remove('valid-feedback');
            display_name_feedback.classList.add('invalid-feedback');
            display_name_feedback.innerHTML = "Please enter a display name"
        }
    }
    // Add data to send with request
    const data = new FormData();
    data.append('display_name', name);
    // Send request
    request.send(data);
    return false; // stop page reload
  };
  // verify start-form onsubmit
  document.querySelector('#start_form').onsubmit = () => {
      // temp variable
      var invalid_name = false;        
      // don't submit and mark invalid if:
      // no display name present
      if (display_name.value === "") {
          display_name.classList.add('is-invalid');
          display_name_feedback.classList.remove('valid-feedback');
          display_name_feedback.classList.add('invalid-feedback');
          display_name_feedback.innerHTML = "Please enter a display name"                           
          invalid_name = true;
      };
      // invalid display name present
      if (display_name.classList.contains('is-invalid')) {
          invalid_name = true;
      }
      if (invalid_name) {return false;} else {return true;};
  };


  // toggle sidebar on click
  document.querySelector('#sidebarCollapse').onclick = () => {
    document.querySelector('#sidebar').classList.toggle('active');
    document.querySelector('#content').classList.toggle('active');
    document.querySelector('#sidebarCollapse').classList.toggle('active');
    document.querySelector('#channel-name').classList.toggle('active');
  };

  // highlight message input on focus
  document.querySelectorAll('.msg-element').forEach( msg_element => {
    msg_element.onfocus = () => {
    document.querySelector('#msg-input').style.borderColor = "#01445A";
    document.querySelector('#msg-btn').style.borderColor = "#01445A";
    document.querySelector('#msg-btn').style.color = "#fff";
    document.querySelector('#msg-btn').style.backgroundColor = "#01445A";
    };
  });

  // un-highlight message input on focus out
  document.querySelectorAll('.msg-element').forEach( msg_element => {
    msg_element.onfocusout = () => {
    document.querySelector('#msg-input').style.borderColor = "grey";
    document.querySelector('#msg-btn').style.borderColor = "grey";
    document.querySelector('#msg-btn').style.color = "grey";
    document.querySelector('#msg-btn').style.backgroundColor = "inherit";
    };
  });
  
  // display avatar and get its number on click
  document.querySelectorAll('.avatar_option').forEach( avatar_selection => {
    avatar_selection.onclick = () => {
    document.querySelector('#avatar_selection').src = avatar_selection.src;
    document.querySelector('#avatar_selection_btn').innerHTML = "";
    document.querySelector('#avatar_number').value = avatar_selection.dataset.value;
    };
  });

});