       
document.addEventListener('DOMContentLoaded', () => {

  // show modal if new user (exit disabled)
  if (!localStorage.getItem('display_name')) {
    $('#exampleModal').modal({keyboard: false, backdrop: 'static'})    
  }


// *********************** (START-FORM MODAL JS) *************************

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

  // display avatar and get its number on click
  document.querySelectorAll('.avatar_option').forEach( avatar_selection => {
    avatar_selection.onclick = () => {
    document.querySelector('#avatar_selection').src = avatar_selection.src;
    document.querySelector('#avatar_selection_btn').innerHTML = "";
    document.querySelector('#avatar_number').value = avatar_selection.dataset.value;
    };
  });


// *********************** (CHAT APP JS) *************************

  // keep messages scroll at bottom
  var messageBody = document.querySelector('#msg-body');
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

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
                <div class="text">
                  ${ message.text }
                </div>
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

// *********************** (SOCKETIO EVENTS) *************************

  // Connect to websocket (standard line)
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure following buttons
  socket.on('connect', () => {

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
          if (invalid_name) {
            return false;
          } else {
            localStorage.setItem('display_name', display_name.value);
            // emit an event to notify server
            socket.emit('new user', {'display_name': display_name.value});
            return true;
          };
      }; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      // verify start-form onsubmit
      document.querySelector('#add_channel_form').onsubmit = () => {

        var channel_name = document.querySelector('#new_channel_name').value;
        // emit an event to notify server
        socket.emit('new channel', {'channel_name': channel_name});


      }; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
              <div class="text">
                ${ message_dict.text }
              </div>
            </div>
          `
          );

          // keep messages scroll at bottom
          var messageBody = document.querySelector('#msg-body');
          messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

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
      }; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
          <div class="text">
            ${ data.message_dict.text }
          </div>
        </div>
      `);  
    }; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // keep messages scroll at bottom
    var messageBody = document.querySelector('#msg-body');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

  });  

});

// autofocus on message input on keydown (unless a modal is up)
document.body.addEventListener('keydown', () => {
  var modal1 = document.querySelector('#exampleModal')
  var modal2 = document.querySelector('#add_channel_modal')

  if (modal1.contains(document.activeElement) === false && modal2.contains(document.activeElement) === false)
  {document.querySelector('#msg-input').focus()};

});
