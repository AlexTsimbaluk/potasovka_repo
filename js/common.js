var dateStart = new Date().getTime();

$.fn.reverse = [].reverse;

$(document).ready(function() {

	var screenWidth = screen.width;
	var windowWidth = $(window).width();
	var scrollWidth = screenWidth - windowWidth;
	if (screenWidth > 1200 && scrollWidth < 35) {
		// $('.header-main').css({'height' : screen.height});
	}


	if (screenWidth > 600) {
		$('.rules-list .rule div:first-child, .small-visible > div:odd').addClass("wow fadeInLeft").attr("data-wow-offset", "200");
		$('.rules-list .rule div:last-child, .small-visible > div:even').addClass("wow fadeInRight").attr("data-wow-offset", "200");
		$('.contacts .side-contacts .contact-wrapper').addClass("wow bounceIn").attr("data-wow-offset", "50");
	}


	$(".nav-collapse").slicknav({
            label: '',
            duplicate: true,
            prependTo: 'header',
            duration: 200,
            closeOnClick: true,
            init: function () {},
            beforeOpen: function () {},
            beforeClose: function () {},
            afterOpen: function () {},
            afterClose: function () {}
        });
	/*var nav = responsiveNav(".nav-collapse", {
		// customToggle: 'nav-toggle-custom',
		// openPos: "absolute",
		label: ''
	});*/


	// navigation
	// $('li a', '.page-nav, .side-nav').click(function() {
	$('.slicknav_nav li a, .page-nav li a, .side-nav li a').click(function() {
		$('.page-nav li, .side-nav li').removeClass('active');
		$(this).parent().addClass('active');
		$('html, body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500);
		return false;
	});

	// anchor movement
	if (window.location.hash != '' && $(window.location.hash).length) {
		$('html, body').animate({scrollTop: $(window.location.hash).offset().top}, 500);
	}

	//показ формы обратного звонка
	$('.registration .show-register').click(function (e) {
		e.preventDefault();
		// $('.popup-form, .popup-overlay').fadeIn(500);
		//$('.registration .reg-descr').css({'opacity':0});
		$('.registration .reg-descr').hide();
		$('.registration .popup-form').fadeIn(500);
	});

	//закрытие модального окна и формы, сброс полей формы
	/*$('.popup-overlay, .close-popup').click(function (e){
		$('.popup-form, .popup-overlay').fadeOut(500);
		$(':input', '.popup-form').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
	});*/

	//закрытие модального окна и формы, сброс полей формы
	$('.registration .popup-form .close-popup').click(function (e){
		$('.registration .popup-form').hide();
		// $('.reg-descr, .show-register', '.registration').css({'display':'inline-block'});
		$('.registration .reg-descr').fadeIn(500);
		$(':input', '.registration .popup-form').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
	});


	/*Dropdown city in Registration*/
	// $('select.city').select2({
	// 	width: '370px'
	// });
	$('select.city').chosen({
		width: '370px'
	});
	$('.chosen-container .chosen-single b').html('<i class="fa fa-angle-down">');
	$('select.city').on('chosen:showing_dropdown', function(e) {
		$('.chosen-container .chosen-single b').html('<i class="fa fa-angle-up">');
	});
	$('select.city').on('chosen:hiding_dropdown', function(e) {
		$('.chosen-container .chosen-single b').html('<i class="fa fa-angle-down">');
	});
	$('.chosen-container .chosen-search').append('<i class="fa fa-search">');

	$('select.city').on('change', function(e) {
		if($('select.city option:selected').val() == 'grodno') {
			$('.registration .common-info > div:visible').hide();
			$('.registration .no-game').fadeIn(500);
		} else {
			$('.no-game, .popup-form', '.registration').hide();
			$('.registration .reg-descr').fadeIn(500);
		}
	});


	var gamesDate = [];



	$('#register-game-button').click(function(e){

		var validate = true;
		$('#register-form .required').each(function(){
			if ($(this).val().length < 1) {
				validate = false;
				$(this).addClass('error-validate');
			}
		});

		if (!isEmail($('.registration-email').val())) {
			validate = false;
			$('.registration-email').addClass('error-validate');
		}

		if (!validate) {
			return false;
		}

		$.ajax({
			url: '/game-register',
			type: 'POST',
			data: $("#register-form").serialize(),
			beforeSend: function (request) {
				return request.setRequestHeader("X-CSRF-Token", $("meta[name='_csrf_token']").attr('content'));
			},
			success: function (response) {
				$(".popup-form").hide();
				$(':input', ".popup-form").not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
				if (response.status == 'success') {
					$('.popup-message-register, .popup-overlay').fadeIn(1000);
					setTimeout(function(){
						$('#register-form .required').each(function(){
							$(this).val('');
						});
						$(".popup-message-register, .popup-overlay").fadeOut(1000);
						$(':input', ".popup-form").not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
					}, 4500);

				}
			}
		});

		e.preventDefault();
	});

	$('#send-email').click(function(e){

		var validate = true;
		$('#contact-form .required').each(function(){
			if ($(this).val().length < 1) {
				validate = false;
				$(this).addClass('error-validate');
			}
		});

		if (!isEmail($('.callback-email').val())) {
			validate = false;
			$('.callback-email').addClass('error-validate');
		}

		if (!validate) {
			return false;
		}

		$.ajax({
			url: '/contact',
			type: 'POST',
			data: $("#contact-form").serialize(),
			beforeSend: function (request) {
				return request.setRequestHeader("X-CSRF-Token", $("meta[name='_csrf_token']").attr('content'));
			},
			success: function (response) {
				if (response.status == 'success') {
					$('.popup-message, .popup-overlay').fadeIn(1000);
					setTimeout(function(){
						$('#contact-form .required').each(function(){
							$(this).val('');
						});
						$(".popup-message, .popup-overlay").fadeOut(1000);
						$(':input', ".popup-form").not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
					}, 4500);

				}
			}
		});

		e.preventDefault();
	});

	$(document).on('keypress', '.required.error-validate', function(){
		if ($(this).val().length > 2) {
			$(this).removeClass('error-validate');
		}
	});

	function isEmail(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}

	$.ajax({
		url: '/get-games-date',
		type: 'GET',
		beforeSend: function (request) {
			return request.setRequestHeader("X-CSRF-Token", $("meta[name='_csrf_token']").attr('content'));
		},
		success: function (response) {
			if (response.games.length > 0) {
				gamesDate = response.games;
			}

			$('td.ui-state-active-game').each(function(){
				$(this).addClass('hide');
			});


			var dat = new Date();

			var currentDay = dat.getDate();
			var currentMonth = dat.getMonth();
			var currentYear = dat.getFullYear();


			/* Calendar */
			$('#calendar').datepicker({
				inline: true,
				firstDay: 1,
				showOtherMonths: true,
				monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
				dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
				beforeShowDay: function(date) {

					var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();

					for (var index in gamesDate) {
						if (gamesDate.hasOwnProperty(index)) {
							if (gamesDate[index].day == d && gamesDate[index].month - 1 == m && gamesDate[index].year == y) {
								return [true, 'ui-state-highlight'];
							}
						}
					}

					return [false, ''];
				},
				onSelect: function(date, e) {

					var d = e.currentDay, m = e.currentMonth, y = e.currentYear;

					for (var index in gamesDate) {
						if (gamesDate.hasOwnProperty(index)) {

							if (gamesDate[index].day == d && gamesDate[index].month - 1 == m && gamesDate[index].year == y) {

								if ($('#form-gameId').val() == gamesDate[index].id) {
									return true;
								}

								$('#form-gameId').val(gamesDate[index].id);

								var info = gamesDate[index].info;
								$('#game-info span').fadeOut(500, function() {
									$('#game-info').html('<span>' + info + '</span>');
									$('#game-info').fadeIn(500);
								});

								var address = gamesDate[index].address;
								$('#game-address span').fadeOut(500, function() {
									$('#game-address').html('<span>' + address + '</span>');
									$('#game-address').fadeIn(500);
								});

								var time = gamesDate[index].time;
								$('#game-time span').fadeOut(500, function() {
									$('#game-time').html('<span>' + time + '</span>');
									$('#game-time').fadeIn(500);
								});
							}
						}
					}

				}
			});


			$('td.ui-state-highlight').each(function(key, value){
				if (key == 0) {
					$(this).children('a').addClass('ui-state-active');
				}
			})
		}
	});


	$('#calendar').datepicker({
		inline: true,
		firstDay: 1,
		showOtherMonths: true,
		monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
		dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		beforeShowDay: function(date) {

			var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();

			for (var index in gamesDate) {
				if (gamesDate.hasOwnProperty(index)) {
					if (gamesDate[index].day == d && gamesDate[index].month - 1 == m && gamesDate[index].year == y) {
						return [true, 'ui-state-highlight'];
					}
				}
			}

			return [false, ''];
		},
		onSelect: function(date, e) {

			var d = e.currentDay, m = e.currentMonth, y = e.currentYear;

			for (var index in gamesDate) {
				if (gamesDate.hasOwnProperty(index)) {

					if (gamesDate[index].day == d && gamesDate[index].month - 1 == m && gamesDate[index].year == y) {

						if ($('#form-gameId').val() == gamesDate[index].id) {
							return true;
						}

						$('#form-gameId').val(gamesDate[index].id);

						var info = gamesDate[index].info;
						$('#game-info span').fadeOut(500, function() {
							$('#game-info').html('<span>' + info + '</span>');
							$('#game-info').fadeIn(500);
						});

						var address = gamesDate[index].address;
						$('#game-address span').fadeOut(500, function() {
							$('#game-address').html('<span>' + address + '</span>');
							$('#game-address').fadeIn(500);
						});

						var time = gamesDate[index].time;
						$('#game-time span').fadeOut(500, function() {
							$('#game-time').html('<span>' + time + '</span>');
							$('#game-time').fadeIn(500);
						});
					}
				}
			}

		}
	});




});


// menu active item on scroll
$(window).scroll(function() {
	// console.log('scroll');
	$('.side-nav li').removeClass('active');
	$('.side-nav li a').reverse().each(function() {
		if ($($(this).attr('href')).offset().top < $(window).scrollTop() + 50) {
			$(this).parent().addClass('active');
			return false;
		}
	});

	$('.page-nav li').removeClass('active');
	$('.page-nav li a').reverse().each(function() {
		if ($($(this).attr('href')).offset().top < $(window).scrollTop() + 50) {
			//$(this).parent().addClass('active');
			return false;
		}
	});
}).scroll();

$(window).load(function() {

	new WOW().init();

	var dateLoad = new Date().getTime();
	// console.log((dateLoad - dateStart) + ' ms');

	// Preloader
	/*$(".loader_inner").fadeOut();
	$(".loader").delay(400).fadeOut("slow");*/

});

