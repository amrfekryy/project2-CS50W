document.addEventListener('DOMContentLoaded', () => {

  show_modal_if_new_user()

  validate_display_name_onkeyup()

  select_avatar_and_set_value()

  validate_channel_name_onkeyup()

  keep_message_scroll_at_bottom()

  toggle_sidebar_onclick()

  highlight_message_input_onfocus()
  unhighlight_message_input_onfocusout()

  switch_channel_onclick()


  // Connect to websocket (standard line)
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  // When connected, configure following buttons
  socket.on('connect', () => {

    validate_startform_and_emit_newuser_onsubmit(socket)
    validate_channelform_and_emit_newchannel_onsubmit(socket)
    add_and_emit_newmessage_onsubmit(socket)
    leave_flack_onclick(socket)

  });

  // on socket notifications from server
  socket.on('add_new_channel', data => {
    const li = document.createElement('li');
    li.innerHTML = data.channel_name;
    document.querySelector('.channels-list > ul').append(li);
  });  
  socket.on('add_new_user', data => {
    const li = document.createElement('li');
    li.innerHTML = data.display_name;
    document.querySelector('.users-list > ul').append(li);
  });
  socket.on('add_new_message', data => {
    
    // get the current channel name
    var current_channel_name = document.querySelector('#channel-name > h4 > i').innerHTML;
    // only display new messages if ..
    if (current_channel_name === data.channel_name && current_channel_name !== "welcome") {
      document.querySelector('#msg-body2').insertAdjacentHTML('beforeend', 
      `
        <div class="message">
          <img class="avatar" src="../static/images/avatars/${ data.message_dict.avatar_number }.png">
          <strong class="name">${ data.message_dict.username }</strong>
          <span class="time">${ data.message_dict.time }</span>
          <div class="text">${ data.message_dict.text }</div>
        </div>
      `);  
    };

    keep_message_scroll_at_bottom()

  });  
  socket.on('delete_user', data => {

    document.querySelectorAll('user-li').forEach(li => {
      if (li.innerHTML === data.display_name) {
        li.parentNode.removeChild(li);
      }
    });
  });

});

// autofocus on message input on keydown (unless a modal is up)
document.body.addEventListener('keydown', () => {
  var modal1 = document.querySelector('#exampleModal')
  var modal2 = document.querySelector('#add_channel_modal')

  if (modal1.contains(document.activeElement) === false && modal2.contains(document.activeElement) === false)
  {document.querySelector('#msg-input').focus()};

});

// *********** FUNCTIONS ***************

function validate_display_name_onkeyup() {
  
  // validate if display name available onkeyup (mark is-valid/is-invalid)
  const display_name = document.querySelector('#display_name');
  const display_name_feedback = document.querySelector('#display_name_feedback');
  display_name.onkeyup = () => {
    // Get display_name value
    const name = display_name.value;
    // Initialize new request
    const request = new XMLHttpRequest();
    request.open('POST', '/validate_name'); 
    // Callback function for when request completes
    request.onload = () => {
        // Extract JSON data from request
        const data = JSON.parse(request.responseText);
        // Update the result div
        if (data.name_available) {
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
    data.append('new_user_request', true);
    data.append('display_name', name);
    // Send request
    request.send(data);
    return false; // stop page reload
  };

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function validate_channel_name_onkeyup() {

  // validate if channel name available onkeyup (mark is-valid/is-invalid)
  const channel_name = document.querySelector('#new_channel_name');
  const channel_name_feedback = document.querySelector('#new_channel_name_feedback');
  channel_name.onkeyup = () => {
    // Get channel_name value
    const name = channel_name.value;
    // Initialize new request
    const request = new XMLHttpRequest();
    request.open('POST', '/validate_name'); 
    // Callback function for when request completes
    request.onload = () => {
        // Extract JSON data from request
        const data = JSON.parse(request.responseText);
        // Update the result div
        if (data.name_available) {
            // mark as valid
            channel_name.classList.remove('is-invalid');
            channel_name.classList.add('is-valid');
            channel_name_feedback.classList.remove('invalid-feedback');
            channel_name_feedback.classList.add('valid-feedback');
            channel_name_feedback.innerHTML = "Looks good!"
        }
        else {
            // mark as invalid
            channel_name.classList.remove('is-valid');
            channel_name.classList.add('is-invalid');
            channel_name_feedback.classList.remove('valid-feedback');
            channel_name_feedback.classList.add('invalid-feedback');
            channel_name_feedback.innerHTML = "There is a channel with this name!"
        }
        // check for empty field
        if (channel_name.value === "") {
            // mark as invalid
            channel_name.classList.remove('is-valid');
            channel_name.classList.add('is-invalid');
            channel_name_feedback.classList.remove('valid-feedback');
            channel_name_feedback.classList.add('invalid-feedback');
            channel_name_feedback.innerHTML = "Please enter a channel name"
        }
    }
    // Add data to send with request
    const data = new FormData();
    data.append('new_channel_request', true);
    data.append('channel_name', name);
    // Send request
    request.send(data);
    return false; // stop page reload
  };

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function show_modal_if_new_user() {
  
  // show modal if new user (exit disabled)
  if (!localStorage.getItem('display_name')) {
    $('#exampleModal').modal({keyboard: false, backdrop: 'static'})    
  }  

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function select_avatar_and_set_value() {

  // display avatar and set input value to avatar number
  document.querySelectorAll('.avatar_option').forEach( avatar_selection => {
    avatar_selection.onclick = () => {
    document.querySelector('#avatar_selection').src = avatar_selection.src;
    document.querySelector('#avatar_selection_btn').innerHTML = "";
    document.querySelector('#avatar_number').value = avatar_selection.dataset.value;
    };
  });

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function keep_message_scroll_at_bottom() {

  // keep messages scroll at bottom
  var messageBody = document.querySelector('#msg-body');
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function toggle_sidebar_onclick() {

  // toggle sidebar on click
  document.querySelector('#sidebarCollapse').onclick = () => {
    document.querySelector('#sidebar').classList.toggle('active'); // sidebar margin
    document.querySelector('#content').classList.toggle('active'); // content margin
    document.querySelector('#channel-name').classList.toggle('active'); // channel-name visibility
    
    let toggler = document.querySelector('#sidebarCollapse');
    toggler.classList.toggle('active'); // toggler margin
    if (toggler.classList.contains('active')) {
      toggler.innerHTML = '<i class="fas fa-chevron-circle-left fa-lg"></i>';
    }
    else {
      toggler.innerHTML = '<i class="fas fa-chevron-circle-right fa-lg"></i>';
    } // toggler icon
  };

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function highlight_message_input_onfocus() {

  // highlight message input on focus
  document.querySelectorAll('.msg-element').forEach( msg_element => {
    msg_element.onfocus = () => {
    document.querySelector('#msg-input').style.borderColor = "#01445A";
    document.querySelector('#msg-btn').style.borderColor = "#01445A";
    document.querySelector('#msg-btn').style.color = "#fff";
    document.querySelector('#msg-btn').style.backgroundColor = "#01445A";
    };
  });

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function unhighlight_message_input_onfocusout() {

  // un-highlight message input on focus out
  document.querySelectorAll('.msg-element').forEach( msg_element => {
    msg_element.onfocusout = () => {
    document.querySelector('#msg-input').style.borderColor = "grey";
    document.querySelector('#msg-btn').style.borderColor = "grey";
    document.querySelector('#msg-btn').style.color = "grey";
    document.querySelector('#msg-btn').style.backgroundColor = "inherit";
    };
  });

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function switch_channel_onclick() {

  // switch channel on click
  document.querySelectorAll('.channel-li').forEach( channel_li => {
    channel_li.onclick = () => {
      // Get new channel name
      const channel_name = channel_li.innerHTML;
      // Initialize new request
      const request = new XMLHttpRequest();
      request.open('POST', '/');
      // Callback function for when request completes
      request.onload = () => {
          // Extract JSON data from request
          const data = JSON.parse(request.responseText);
          
          // update channel name
          document.querySelector('#channel-name').innerHTML = `<h4><i>${channel_name}</i></h4>`;
          // clear messages section
          document.querySelector('#msg-body2').innerHTML = "";
          // add channel messages
          // alert(data.list)
          data.list.forEach(message => {
            document.querySelector('#msg-body2').insertAdjacentHTML('beforeend', 
            `
              <div class="message">
                <img class="avatar" src="../static/images/avatars/${ message.avatar_number }.png">
                <strong class="name">${ message.username }</strong>
                <span class="time">${ message.time }</span>
                <div class="text">${ message.text }</div>
              </div>
            `
            );
          });

          // keep messages scroll at bottom
          var messageBody = document.querySelector('#msg-body');
          messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

      }
      // Add data to send with request
      const data = new FormData();
      data.append('switch_to_this_channel', channel_name);
      // Send request
      request.send(data);
      return false; // stop page reload
    };

  });

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function leave_flack_onclick(socket) {

  document.querySelector('#leave_flack').onclick = () => {

    // document.querySelector('.sidebar-header').innerHTML = '';

    const display_name = localStorage.getItem('display_name');
    // emit an event to notify server
    socket.emit('user left', {'display_name': display_name});

    localStorage.removeItem('display_name');
    return true;
  };
} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function validate_startform_and_emit_newuser_onsubmit(socket) {

  const display_name = document.querySelector('#display_name');
  const display_name_feedback = document.querySelector('#display_name_feedback');

  // verify start-form onsubmit
  document.querySelector('#start_form').onsubmit = () => {
      // temp variable
      let invalid_name = false;        
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
      if (invalid_name) {
        return false;
      } else {
        localStorage.setItem('display_name', display_name.value);
        // emit an event to notify server
        socket.emit('new user', {'display_name': display_name.value});
        return true;
      };
  };

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function validate_channelform_and_emit_newchannel_onsubmit(socket) {

  const channel_name = document.querySelector('#new_channel_name');
  const channel_name_feedback = document.querySelector('#new_channel_name_feedback');

  // verify new-channel-form onsubmit
  document.querySelector('#add_channel_form').onsubmit = () => {

      // temp variable
      let invalid_name = false;        
      
      // don't submit and mark invalid if:
      // no display name present
      if (channel_name.value === "") {
          channel_name.classList.add('is-invalid');
          channel_name_feedback.classList.remove('valid-feedback');
          channel_name_feedback.classList.add('invalid-feedback');
          channel_name_feedback.innerHTML = "Please enter a channel name"                           
          invalid_name = true;
      };
      // invalid display name present
      if (channel_name.classList.contains('is-invalid')) {
          invalid_name = true;
      }
      if (invalid_name) {
        return false;
      } else {
        // emit an event to notify server
        socket.emit('new channel', {'channel_name': channel_name.value});
        return true;
      };
  };

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function add_and_emit_newmessage_onsubmit(socket) {

  // show new message on click
  document.querySelector('#msg-form').onsubmit = () => {
    // Get message
    const message = document.querySelector('#msg-input').value
    // Clear input field
    document.querySelector('#msg-input').value = ""
    // Initialize new request
    const request = new XMLHttpRequest();
    request.open('POST', '/');
    // Callback function for when request completes
    request.onload = () => {
      // Extract JSON data from request
      const message_dict = JSON.parse(request.responseText);
      
      // add message
      document.querySelector('#msg-body2').insertAdjacentHTML('beforeend', 
      `
        <div class="message">
          <img class="avatar" src="../static/images/avatars/${ message_dict.avatar_number }.png">
          <strong class="name">${ message_dict.username }</strong>
          <span class="time">${ message_dict.time }</span>
          <div class="text">${ message_dict.text }</div>
        </div>
      `
      );

      keep_message_scroll_at_bottom()

      // emit an event to notify server
      const channel_name = document.querySelector('#channel-name > h4 > i').innerHTML
      socket.emit('new message', {'message_dict': message_dict, 'channel_name': channel_name});

    }
    // Add data to send with request
    const data = new FormData();
    data.append('message', message);
    // Send request
    request.send(data);
    return false; // stop page reload
  };

} // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

