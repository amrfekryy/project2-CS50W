       
document.addEventListener('DOMContentLoaded', () => {

  // disable exit on Esc key or screen click
  $('#exampleModal').modal({
    keyboard: false,
    backdrop: 'static'
  })
  
  // show modal
  $('#exampleModal').modal('show')

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
  
  // display avatar and get its number on click
  document.querySelectorAll('.avatar_option').forEach( avatar_selection => {
    avatar_selection.onclick = () => {
    document.querySelector('#avatar_selection').src = avatar_selection.src;
    document.querySelector('#avatar_selection_btn').innerHTML = "";
    document.querySelector('#avatar_number').value = avatar_selection.dataset.value;
    };
  });

});
