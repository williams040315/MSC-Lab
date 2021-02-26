/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\public\js\scriptWelcome.js
 * Created Date: Thursday, April 4th 2019, 4:12:52 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Perform Login/Register request and save the token
 * 
 * OpenSource
 */
var error = "This is the famous error variable";
var errorJSON = {};
 var tryToken = localStorage.getItem("access_token");
if (tryToken) {
  window.location.href = "/views/dashboard";
}

$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

function registerRequest() {
 
  var name = document.getElementById("nameReg").value;
  var email = document.getElementById("emailReg").value;
  var password = document.getElementById("passwordReg").value;

  $.ajax({
    type: 'POST',
    url : '/users/register',
    crossDomain: true,
    data: '{ "name": "' + name + '", "email": "' + email + '", "password": "' + password + '" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) {
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Account created!</strong> ' + name + ' your account has been created<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><img class="mb-4 img-fluid" src="https://media.giphy.com/media/11J8lEFfvHLipi/giphy.gif"></div>';
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
})
}


function loginRequest() {
  var email = document.getElementById("emailLog").value;
  var password = document.getElementById("passwordLog").value;

  $.ajax({
    type: 'POST',
    url : '/users/auth',
    crossDomain: true,
    data: '{ "email": "' + email + '", "password": "' + password + '" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "/views/dashboard";
      }
      else {

      }
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
})

}

