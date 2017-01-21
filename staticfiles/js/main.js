$(document).ready(function() {
	$window = $(window);
	$menuEl = $('.mainNav ul');
	var scrollableElements = '#press-wrapper, #gallery-wrapper';
	
	if (isMobileDevice) {
		scrollableElements += ', #home-wrapper, #revive-wrapper, #play-wrapper, #indulge-wrapper, #thechalet-wrapper, #megeve-wrapper, #packages-wrapper, #tariff-wrapper, #contact-wrapper';
	}
	
	$('#fullpage').fullpage({
		//css3:false,
		anchors:[
			'a_home', 
			'a_connection', 
			'a_revive', 
			'a_play', 
			'a_indulge', 
			'a_wine', 
			'a_thechalet', 
			'a_megeve', 
			'a_summer', 
			'a_packages',
			'a_tariff', 
			'a_press', 
			'a_contact', 
			'a_gallery'
		],
		/*scrollOverflow: true,*/
		normalScrollElements: scrollableElements,
		afterRender: function(){
			var pluginContainer = $(this);
			
			// set current menu
			if (window.location.hash) {
				var current = window.location.hash.substr(window.location.hash.indexOf('#') + 3);
				$('.mainNav a[href="#' + current + '"]').parent().addClass('current');
			} else {
				$('.mainNav a[href="#home"]').parent().addClass('current');
			}
		},
		afterResize: function(){
			var pluginContainer = $(this);
			
			// adjust content-wrapper height
			resizeContentWrapper();
		},
		afterLoad: function(anchorLink, index){
			var loadedSection = $(this);
			loadedSection.addClass('section-active');
		},
		onLeave: function(index, nextIndex, direction){
			var leavingSection = $(this);
			leavingSection.removeClass('section-active');
			
			// set current menu item
			$('.mainNav a[href="#' + $('#fullpage section')[index - 1].id + '"]').parent().removeClass('current');
			$('.mainNav a[href="#' + $('#fullpage section')[nextIndex - 1].id + '"]').parent().addClass('current');
			
			// apply menu style to current selection
			if($(window).width() > 1024){
				$('.mainNav ul').get(0).className = '';
				$('.mainNav ul').addClass($('#fullpage section')[nextIndex - 1].id);
			}
			
		}
	});
	
	
	////////////////////////////////////////////////////
	//Show/Hide .mainNav
	////////////////////////////////////////////////////
	$('.viewNav').click(function(){
		$menuEl.scrollTop(0);
		$('.mainNav').toggleClass('navClose');
		
		$menuTop = $menuEl.offsetParent().position().top;
		$menuHeight = $menuEl.height()
		if (($menuTop + $menuHeight) > $window.height()) {
			$menuEl.css('max-height', ($window.height() - $menuTop - 25));
			$menuEl.css('overflow', 'auto');
		}
	});
	
	
	////////////////////////////////////////////////////
	//Menu Click
	//scroll and mobile menu visibility toogle
	////////////////////////////////////////////////////
	$(".mainNav a").click(function(e) {
		e.preventDefault();
		var $this = $(this);
		$target = $(this.href.substr(this.href.indexOf('#')));
		
		// move to section
		$.fn.fullpage.moveTo('a_' + this.href.substr(this.href.indexOf('#') + 1));
		
		$('.mainNav').toggleClass('navClose');
	});
	
	
	////////////////////////////////////////////////////
	//Start Gallery
	////////////////////////////////////////////////////
	GD_Gallery.init();
	
	////////////////////////////////////////////////////
	//Brochure Video
	////////////////////////////////////////////////////
	$(document).ready(function() {
		$('.brochure-video').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false
		});
	});
	
	
	////////////////////////////////////////////////////
	//Prevent MouseWheel on .content-wrappers
	////////////////////////////////////////////////////
	$('.content-wrapper, .content-wrapper-multicolumn').each(function(){
		if ($(this).hasClass('content-wrapper') && $(this).closest('.content-wrapper-multicolumn').length > 0) {
			$('.content-wrapper, .content-wrapper-multicolumn').mousewheel(function(event) {
				var wrapperHeight = $(event.currentTarget).height();
				var scrollHeight = event.currentTarget.scrollHeight;
		
				if (scrollHeight > wrapperHeight) {
					event.stopPropagation();
				}
			});
		}
	});
	
	
	/*$('.content-wrapper, .content-wrapper-multicolumn').mousewheel(function(event) {
		var wrapperHeight = $(event.currentTarget).height();
		var scrollHeight = event.currentTarget.scrollHeight;
		
		if (scrollHeight > wrapperHeight) {
			event.stopPropagation();
		}
	});*/
	
	
	////////////////////////////////////////////////////
	//adjust .content-wrapper height
	////////////////////////////////////////////////////
	resizeContentWrapper();
	
	
	////////////////////////////////////////////////////
	//go directly to gallery if comes from gallery page
	////////////////////////////////////////////////////
	if (window.location.hash == '#to_gallery') {
		$.fn.fullpage.silentMoveTo('a_gallery')
	}
});


////////////////////////////////////////////////////
//Adjust height of content-wrappers
////////////////////////////////////////////////////
function resizeContentWrapper(){
	$('.pageSection').each(function(index) {
		var sectionHeight = $( window ).height();
		var containerHeight = $(this).find('.container').height();
		var containerTopPadding = parseInt($(this).find('.container').css('padding-top'));
		var contentWrapper = $(this).find('.content-wrapper');
		var contentWrapperMultiColumn = $(this).find('.content-wrapper-multicolumn');
		var bottomMargin = (isMobileDevice) ? 40 : 60;
		
		if (isMobileDevice && contentWrapperMultiColumn.length > 0) {
			contentWrapperMultiColumn.css('height', (sectionHeight - (containerTopPadding + bottomMargin)));
		} else {
			if (contentWrapper.length > 0) {
				contentWrapper.css('height', (sectionHeight - (containerTopPadding + bottomMargin)));
			}
		}

	});
}