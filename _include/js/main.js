/*
 * author: Viktor Miller
 * last update: 23-06-15
 *
 */
jQuery(function($){

var BRUSHED = window.BRUSHED || {};

var en = false;
var ko = false;
var include = '_include';
var imageTxt = 'Lern uns kennen!';

var language = window.location.href;

if(language.indexOf('http://gyvg.de/en/') !== -1){
	en = true;
	var include = '../_include'
	var imageTxt = 'Get to know us!';
} else if (language.indexOf('http://gyvg.de/ko/') !== -1){
	ko = true;
	var include = '../_include';
	var imageTxt = '우리 만나요!';
}

/* ==================================================
	Countdown
================================================== */
/*
 * author: Viktor Miller
 * date: 30-07-14
 * last update: 25-08-15
 */

BRUSHED.countdown = function(){

$.ajax({
   url: include+"/php/call.php",
   dataType: 'json'
}).done(
	function(data){
		/*
			TESTE die Monate 0,...,11
			month = 8;
			day = 1;
		*/
		var today = new Date();
		var day = today.getDate();
		var month = today.getMonth();
		var year = today.getFullYear();
		/*****************************************
		* Zeige den nächsten Termin im neuen Monat
		* 7 Tage vor Beginn des neuen Monats an
		******************************************/
		var nextMonth = new Date(year,month+1,1);
		var sevenDaysBefore = new Date(nextMonth.setDate(nextMonth.getDate()-7));
		//console.log(sevenDaysBefore<today);
		if (sevenDaysBefore<today){
			month = month+1;
			day = 1;
		}
		/******************ENDE*******************/
		var meetingDate = getFirstMeeting(year,month);
		var d = meetingDate.getDate();
		var m = meetingDate.getMonth()+1;
		var y = meetingDate.getFullYear();
		/******************************************
		* Falls der aktuelle Tag größer als der Tag
		* vom ersten Samstag im Monat ist wähle den
		* Tag vom vierten Samstag im Monat aus
		******************************************/
		if(day>d){
			meetingDate = getSecondMeeting(year,month);
			d = meetingDate.getDate();
			m = meetingDate.getMonth()+1;
			y = meetingDate.getFullYear();
		}

		/******************************************
		*
		* Naechstes Treffen entfaellt
		*
		******************************************/

		/* $.getJSON(include+"/php/call.php", function(jsonData) {
		   meeingDate = jsonData[0];
		   for (var x = 0; x < jsonData.length; x++) {
				console.log(jsonData[x]);
		   }
		}); */

		var skippedMeeting = data[0][0]; //skipped date
		var skippedDate = new Date(skippedMeeting);
		var changedMeeting = data[0][1]; //next meeting date
		var changedDate = new Date(changedMeeting);

		/*console.log("skippedDate: "+skippedDate);
		console.log("meetingDate: "+meetingDate);
		console.log("changedDate: "+changedDate);
		console.log(skippedDate.getDate()===meetingDate.getDate());*/

		if(skippedDate.getDate()===meetingDate.getDate()){
			if(today<meetingDate){
				return $('#clock').html('<p>Unser nächstes Treffen am <strong>'+d+'.'+m+'.'+y+'</strong> entfällt.</p><p>Next meeting is cancelled.</p>');
			}
		}

		/******************ENDE*******************/

		/******************************************
		*
		* Treffen aendern
		*
		******************************************/

		//Compare changed Date with the real next meeting date
		if(today.getDate()<changedDate.getDate()){
				if (changedDate.getDate()<meetingDate.getDate()){
					console.log(changedDate.getDate()<meetingDate.getDate());
					meetingDate=changedDate;
					d = meetingDate.getDate();
					m = meetingDate.getMonth()+1;
					y = meetingDate.getFullYear();
				}
		}
		/******************ENDE*******************/

		/******************************************
		* LANGUAGE
		******************************************/
		var formatTxt = '%-H Std. %M Min. %S Sek.';
		var formatDay = '%-d T. ';
		var formatWk = '%-w Wo. ';
		var todayTxt = 'Heute, den <strong>'+d+'.'+m+'.'+y+'</strong>, um <strong>18:30 Uhr</strong> in<br>';
		var futureTxt = 'Samstag, den <strong>'+d+'.'+m+'.'+y+'</strong>, um <strong>18:30 Uhr</strong> in<br>';
		var soonTxt = 'Das Datum wird in K&uuml;rze bekannt gegeben!';

		if(en){
			var formatTxt = '%-H h %M min %S sec';
			var formatDay = '%-d day%!d ';
			var formatWk = '%-w week%!w ';
			var mname = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			var todayTxt = 'Today <strong>'+mname[m-1]+' '+d+'th</strong>, '+y+' in<br>';
			var futureTxt = 'Saturday <strong>'+mname[m-1]+' '+d+'th, '+y+', 6:30pm</strong> in<br>';
			var soonTxt = 'The time and date will be announced!';
		} else if (ko){
			var formatTxt = '%-H시 %M분 %S초';
			var formatDay = '%-d일 ';
			var formatWk = '%-w주 ';
			var todayTxt = '오늘 <strong>'+m+'월 '+d+'일, '+y+'</strong> <br>';
			var futureTxt = '토요일 <strong>'+m+'월 '+d+'일, '+y+'</strong> <br>';
			var soonTxt = 'The time and date will be announced!';
		}
		/******************ENDE*******************/

		$('#clock').countdown(y+'/'+m+'/'+d+' 18:30:00').on('update.countdown', function(event) {
			var format = formatTxt;
			if(event.offset.days > 0) {
			format = formatDay + format;
			}
			if(event.offset.weeks > 0) {
				format = formatWk + format;
			}
			if(day==d)
				$(this).html(event.strftime(todayTxt+format));
			else
				$(this).html(event.strftime(futureTxt+format));
		}).on('finish.countdown', function(event) {
			$(this).html(soonTxt);
			$(this).parent().addClass('disabled');
		});

   }
);

/* var skippedDate = new Date('2015-08-15');
var today = new Date();
console.log("Vergleich " +today);
if(today<skippedDate){
	return $('#clock').html('<p class="exp-2015-08-17">Aufgrund unserer Visionsreise entfällt unser nächstes Treffen</p><p>Next meeting is cancelled.</p>');
} */

}

var getFirstMeeting = function(year, month){
    var meetingDate = new Date(year, month, 1, 0, 0, 0, 0);
    meetingDate.setDate(7-meetingDate.getDay());
    return meetingDate;
};

var getSecondMeeting = function(year, month){
    var meetingDate = new Date(year, month, 1, 0, 0, 0, 0);
    meetingDate.setDate(21-meetingDate.getDay());
    return meetingDate;
};

/* ==================================================
   Content Expirator
================================================== */
/*
 * Title: Content Expirator
 * Author: DansNetwork.com
 * URL: http://dansnetwork.com/content-expirator-jquery-content-expiration-plugin/
 * Version: 0.1.0
 * Requirements: jQuery 1.4 or higher (will probably work with previous versions)
 *
 * HOW TO USE: class="exp-2015-06-28" or class="show-2015-06-28"
 *
 */

BRUSHED.contentExp = function(prfx){
		var pfix = prfx || 'exp';
        $("[class|="+pfix+"]").each(function(){
            var eString = $(this).attr('class').split(' ')[0];
            var dString = eString.split('-');
            var d = new Date(dString[1],dString[2].toString()-1,dString[3]);
            var today = new Date();
			if(d < today){
				$(this).hide();
			}
		});
	}

BRUSHED.contentShw = function(prfx){
		var pfix = prfx || 'show';
        $("[class|="+pfix+"]").each(function(){
			$(this).hide();
            var eString = $(this).attr('class').split(' ')[0];
            var dString = eString.split('-');
            var d = new Date(dString[1],dString[2].toString()-1,dString[3]);
            var today = new Date();
			if(d <= today){
				$(this).show();
			}
		});
	}

/* ==================================================
   Mobile Navigation
================================================== */
var mobileMenuClone = $('#menu').clone().attr('id', 'navigation-mobile');

BRUSHED.mobileNav = function(){
	var windowWidth = $(window).width();

	if( windowWidth <= 979 ) {
		if( $('#mobile-nav').length > 0 ) {
			mobileMenuClone.insertAfter('#menu');
			$('#navigation-mobile #menu-nav').attr('id', 'menu-nav-mobile');
		}
	} else {
		$('#navigation-mobile').css('display', 'none');
		if ($('#mobile-nav').hasClass('open')) {
			$('#mobile-nav').removeClass('open');
		}
	}
}

BRUSHED.listenerMenu = function(){
	$('#mobile-nav').on('click', function(e){
		$(this).toggleClass('open');

		if ($('#mobile-nav').hasClass('open')) {
			$('#navigation-mobile').slideDown(500, 'easeOutExpo');
		} else {
			$('#navigation-mobile').slideUp(500, 'easeOutExpo');
		}
		e.preventDefault();
	});

	$('#menu-nav-mobile a').on('click', function(){
		$('#mobile-nav').removeClass('open');
		$('#navigation-mobile').slideUp(350, 'easeOutExpo');
	});
}


/* ==================================================
   Slider Options
================================================== */

BRUSHED.slider = function(){
	$.supersized({
		// Functionality
		slideshow               :   1,			// Slideshow on/off
		autoplay				:	1,			// Slideshow starts playing automatically
		start_slide             :   1,			// Start slide (0 is random)
		stop_loop				:	0,			// Pauses slideshow on last slide
		random					: 	0,			// Randomize slide order (Ignores start slide)
		slide_interval          :   12000,		// Length between transitions
		transition              :   1, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
		transition_speed		:	300,		// Speed of transition
		new_window				:	1,			// Image links open in new window/tab
		pause_hover             :   1,			// Pause slideshow on hover
		keyboard_nav            :   1,			// Keyboard navigation on/off
		performance				:	0,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
		image_protect			:	1,			// Disables image dragging and right click with Javascript

		// Size & Position
		min_width		        :   0,			// Min width allowed (in pixels)
		min_height		        :   0,			// Min height allowed (in pixels)
		vertical_center         :   1,			// Vertically center background
		horizontal_center       :   1,			// Horizontally center background
		fit_always				:	0,			// Image will never exceed browser width or height (Ignores min. dimensions)
		fit_portrait         	:   1,			// Portrait images will not exceed browser height
		fit_landscape			:   0,			// Landscape images will not exceed browser width

		// Components
		slide_links				:	'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
		thumb_links				:	0,			// Individual thumb links for each slide
		thumbnail_navigation    :   0,			// Thumbnail navigation
		slides 					:  	[			// Slideshow Images
											{image : include+'/img/slider-images/image01.jpg', title : '<div class="slide-content">&nbsp</div>', thumb : '', url : ''},
											{image : include+'/img/slider-images/image02.jpg', title : '<div class="slide-content">'+imageTxt+'</div>', thumb : '', url : ''}/* ,
											{image : include+'/img/slider-images/image03.jpg', title : '<div class="slide-content">We are <br> passionate for <br> Jesus</div>', thumb : '', url : ''},
											{image : include+'/img/slider-images/image04.jpg', title : '<div class="slide-content">Traveling the world!</div>', thumb : '', url : ''}   */
									],

		// Theme Options
		progress_bar			:	0,			// Timer for each slide
		mouse_scrub				:	0

	});

}


/* ==================================================
   Navigation Fix
================================================== */

BRUSHED.nav = function(){
	$('.sticky-nav').waypoint('sticky');
}


/* ==================================================
   Filter Works
================================================== */

BRUSHED.filter = function (){
	if($('#projects').length > 0){
		var $container = $('#projects');

		$container.imagesLoaded(function() {
			$container.isotope({
			  // options
			  animationEngine: 'best-available',
			  itemSelector : '.item-thumbs',
			  layoutMode : 'fitRows'
			});
		});


		// filter items when filter link is clicked
		var $optionSets = $('#options .option-set'),
			$optionLinks = $optionSets.find('a');

		  $optionLinks.click(function(){
			var $this = $(this);
			// don't proceed if already selected
			if ( $this.hasClass('selected') ) {
			  return false;
			}
			var $optionSet = $this.parents('.option-set');
			$optionSet.find('.selected').removeClass('selected');
			$this.addClass('selected');

			// make option object dynamically, i.e. { filter: '.my-filter-class' }
			var options = {},
				key = $optionSet.attr('data-option-key'),
				value = $this.attr('data-option-value');
			// parse 'false' as false boolean
			value = value === 'false' ? false : value;
			options[ key ] = value;
			if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
			  // changes in layout modes need extra logic
			  changeLayoutMode( $this, options )
			} else {
			  // otherwise, apply new options
			  $container.isotope( options );
			}

			return false;
		});
	}
}


/* ==================================================
   FancyBox
================================================== */

BRUSHED.fancyBox = function(){
	if($('.fancybox').length > 0 || $('.fancybox-media').length > 0 || $('.fancybox-various').length > 0){

		$(".fancybox").fancybox({
				padding : 0,
				beforeShow: function () {
					this.title = $(this.element).attr('title');
					this.title = '<h4>' + this.title + '</h4>' + '<p>' + $(this.element).parent().find('img').attr('alt') + '</p>';
				},
				helpers : {
					title : { type: 'inside' },
				}
			});

		$('.fancybox-media').fancybox({
			openEffect  : 'none',
			closeEffect : 'none',
			helpers : {
				media : {}
			}
		});
	}
}


/* ==================================================
   Contact Form
================================================== */

BRUSHED.contactForm = function(){
	$("#contact-submit").on('click',function() {
		$contact_form = $('#contact-form');

		var fields = $contact_form.serialize();

		$.ajax({
			type: "POST",
			url: include+"/php/contact.php",
			data: fields,
			dataType: 'json',
			success: function(response) {

				if(response.status){
					$('#contact-form input').val('');
					$('#contact-form textarea').val('');
				}

				$('#response').empty().html(response.html);
			}
		});
		return false;
	});
}


/* ==================================================
   Twitter Feed
================================================== */

BRUSHED.tweetFeed = function(){

	var valueTop = -64; // Margin Top Value

    $("#ticker").tweet({
          modpath: include+'/js/twitter/',
          username: "Bluxart", // Change this with YOUR ID
          page: 1,
          avatar_size: 0,
          count: 10,
		  template: "{text}{time}",
		  filter: function(t){ return ! /^@\w+/.test(t.tweet_raw_text); },
          loading_text: "loading ..."
	}).bind("loaded", function() {
	  var ul = $(this).find(".tweet_list");
	  var ticker = function() {
		setTimeout(function() {
			ul.find('li:first').animate( {marginTop: valueTop + 'px'}, 500, 'linear', function() {
				$(this).detach().appendTo(ul).removeAttr('style');
			});
		  ticker();
		}, 5000);
	  };
	  ticker();
	});

}


/* ==================================================
   Menu Highlight
================================================== */

BRUSHED.menu = function(){
	$('#menu-nav, #menu-nav-mobile').onePageNav({
		currentClass: 'current',
    	changeHash: false,
    	scrollSpeed: 750,
    	scrollOffset: 30,
    	scrollThreshold: 0.5,
		easing: 'easeOutExpo',
		filter: ':not(.external)'
	});
}

/* ==================================================
   Next Section Home Slider
================================================== */

BRUSHED.goSectionNext = function(){
	$('* #smscroll').on('click', function(){

		$target = $($(this).attr('href')).offset().top-130;

		$('body, html').animate({scrollTop : $target}, 750, 'easeOutExpo');

		/* TODO
		 * by clicking the link the active state is not reseted and the box stays red.
		 */
		accordion_trigger_toggle.delegate('.accordion-toggle','click', function(event){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).addClass('inactive');
			}
			else{
				$(this).removeClass('inactive');
				$(this).addClass('active');
			}
			event.preventDefault();
		});
		/*End*/
		return false;
	});
}

/* ==================================================
   Next Section
================================================== */

BRUSHED.goSection = function(){
	$('#nextsection').on('click', function(){
		$target = $($(this).attr('href')).offset().top-30;

		$('body, html').animate({scrollTop : $target}, 750, 'easeOutExpo');
		return false;
	});
}

/* ==================================================
   GoUp
================================================== */

BRUSHED.goUp = function(){
	$('#goUp').on('click', function(){
		$target = $($(this).attr('href')).offset().top-30;

		$('body, html').animate({scrollTop : $target}, 750, 'easeOutExpo');
		return false;
	});
}


/* ==================================================
	Scroll to Top
================================================== */

BRUSHED.scrollToTop = function(){
	var windowWidth = $(window).width(),
		didScroll = false;

	var $arrow = $('#back-to-top');

	$arrow.click(function(e) {
		$('body,html').animate({ scrollTop: "0" }, 750, 'easeOutExpo' );
		e.preventDefault();
	})

	$(window).scroll(function() {
		didScroll = true;
	});

	setInterval(function() {
		if( didScroll ) {
			didScroll = false;

			if( $(window).scrollTop() > 1000 ) {
				$arrow.css('display', 'block');
			} else {
				$arrow.css('display', 'none');
			}
		}
	}, 250);
}

/* ==================================================
   Thumbs / Social Effects
================================================== */

BRUSHED.utils = function(){

	$('.item-thumbs').bind('touchstart', function(){
		$(".active").removeClass("active");
      	$(this).addClass('active');
    });

	$('.image-wrap').bind('touchstart', function(){
		$(".active").removeClass("active");
      	$(this).addClass('active');
    });

	$('#social ul li').bind('touchstart', function(){
		$(".active").removeClass("active");
      	$(this).addClass('active');
    });

}

/* ==================================================
   Accordion
================================================== */

BRUSHED.accordion = function(){
	var accordion_trigger = $('.accordion-heading.accordionize');

	accordion_trigger.delegate('.accordion-toggle','click', function(event){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		   	$(this).addClass('inactive');
		}
		else{
		  	accordion_trigger.find('.active').addClass('inactive');
		  	accordion_trigger.find('.active').removeClass('active');
		  	$(this).removeClass('inactive');
		  	$(this).addClass('active');
	 	}
		event.preventDefault();
	});
}

/* ==================================================
   Toggle
================================================== */

BRUSHED.toggle = function(){
	var accordion_trigger_toggle = $('.accordion-heading.togglize');

	accordion_trigger_toggle.delegate('.accordion-toggle','click', function(event){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		   	$(this).addClass('inactive');
		}
		else{
		  	$(this).removeClass('inactive');
		  	$(this).addClass('active');
	 	}
		event.preventDefault();
	});
}

/* ==================================================
   Tooltip
================================================== */

BRUSHED.toolTip = function(){
    $('a[data-toggle=tooltip]').tooltip();
}


/* ==================================================
	Popover
================================================== */

BRUSHED.popOver = function(){
    $('a[data-toggle=popover]').popover();
}


/* ==================================================
	Google Map Location *VM-29.07.14
================================================== */

BRUSHED.gmap = function(){
	// Create an array of styles.
	var styles = [
					{
						stylers: [
							{ saturation: -300 }

						]
					},{
						featureType: 'road',
						elementType: 'geometry',
						stylers: [
							{ hue: "#ecf0f1" },
							{ visibility: 'simplified' }
						]
					},{
						featureType: 'road',
						elementType: 'labels',
						stylers: [
							{ visibility: 'on' }
						]
					}
				  ],

					// Lagitute and longitude for your location goes here
				   lat = 50.058478,
				   lng =  8.222245,

				  // Create a new StyledMapType object, passing it the array of styles,
				  // as well as the name to be displayed on the map type control.
				  customMap = new google.maps.StyledMapType(styles,
					  {name: 'Styled Map'}),

				// Create a map object, and include the MapTypeId to add
				// to the map type control.
				  mapOptions = {
					  zoom: 15,
					scrollwheel: false,
					  center: new google.maps.LatLng( lat, lng ),
					  mapTypeControlOptions: {
						  mapTypeIds: [google.maps.MapTypeId.ROADMAP],

					  }
				  },
				  map = new google.maps.Map(document.getElementById('map'), mapOptions),
				  myLatlng = new google.maps.LatLng( lat, lng ),

				  marker = new google.maps.Marker({
					position: myLatlng,
					map: map/*,
					icon: include+"/img/marker.png"*/
				  });

				  //Associate the styled map with the MapTypeId and set it to display.
				  map.mapTypes.set('map_style', customMap);
				  map.setMapTypeId('map_style');
}


/* ==================================================
	Init
================================================== */

$(document).ready(function(){
	Modernizr.load([
	{
		test: Modernizr.placeholder,
		nope: include+'/js/placeholder.js',
		complete : function() {
				if (!Modernizr.placeholder) {
						/* Placeholders.init({
						live: true,
						hideOnFocus: false,
						className: "yourClass",
						textColor: "#999"
						});  */
				}
		}
	}
	]);

	// Preload the page with jPreLoader
	$('body').jpreLoader({
		splashID: "#jSplash",
		showSplash: true,
		showPercentage: true,
		autoClose: true,
		splashFunction: function() {
			$('#circle').delay(250).animate({'opacity' : 1}, 500, 'linear');
		}
	});

    if ($(window).width() > 767) {
		BRUSHED.slider();
    }

	BRUSHED.nav();
	BRUSHED.contentExp();
	BRUSHED.contentShw();
	BRUSHED.mobileNav();
	BRUSHED.listenerMenu();
	BRUSHED.menu();
	BRUSHED.goSectionNext();
	BRUSHED.goSection();
	BRUSHED.goUp();
	BRUSHED.filter();
	BRUSHED.fancyBox();
	BRUSHED.contactForm();
	BRUSHED.tweetFeed();
	BRUSHED.scrollToTop();
	BRUSHED.utils();
	BRUSHED.accordion();
	BRUSHED.toggle();
	BRUSHED.toolTip();
	BRUSHED.popOver();
	BRUSHED.gmap();
	BRUSHED.countdown();
});

$(window).resize(function(){
	BRUSHED.mobileNav();
});

});
