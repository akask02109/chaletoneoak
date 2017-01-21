//JavaScript Document
var the_main_template_dir="http://www.dolcegabbana.com/wp-brand-content/themes/dg_brandsite/";
if(window.location.host=="www.dolcegabbana.it"||window.location.host=="www.dolcegabbana.it"){
	the_main_template_dir="http://www.dolcegabbana.it/wp-brand-content/themes/dg_brandsite/";
}
var isMobileDevice=false;
var isSmartPhone=false;
var headerLocked=false;
var isApple=false;

var fullscreenEnabled=document.fullscreenEnabled||document.mozFullScreenEnabled||document.webkitFullscreenEnabled;
if(fullscreenEnabled){
	// fullscreen Events
	document.addEventListener("fullscreenchange",function(e){block_videoplayer.fullScreenEventReceiver();});
	document.addEventListener("mozfullscreenchange",function(e){block_videoplayer.fullScreenEventReceiver();});
	document.addEventListener("webkitfullscreenchange",function(e){block_videoplayer.fullScreenEventReceiver();});
	document.addEventListener("msfullscreenchange",function(e){block_videoplayer.fullScreenEventReceiver();});
}

isSmartPhone=MobileEsp.DetectSmartphone()||MobileEsp.DetectIphone();
isTablet=MobileEsp.DetectTierTablet();
isApple=MobileEsp.DetectIos();
//force mobile DELETE THIS
//isTablet=true;
//isSmartPhone=true;
//end force mobile DELETE THIS
isMobileDevice=isSmartPhone||isTablet;	


function Log(data) {
	//console.log(data);
}

function launchIntoFullscreen(element) {
	if(fullscreenEnabled){
		if(element.requestFullscreen){element.requestFullscreen();}
		else if(element.mozRequestFullScreen){element.mozRequestFullScreen();}
		else if(element.webkitRequestFullscreen){element.webkitRequestFullscreen();}
		else if(element.msRequestFullscreen){element.msRequestFullscreen();}
	}
}
function exitFullscreen() {
	if(fullscreenEnabled){
		if(document.exitFullscreen){document.exitFullscreen();}
		else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}
		else if(document.webkitExitFullscreen){document.webkitExitFullscreen();}
	}
}


jQuery(document).ready(function() {

	jwplayer.key="Sp9Bf3/UIblk5NyMDG1/KCgJq95rPO7NNBpwtwmuKcE=";

	
	Log('isMobileDevice:' + isMobileDevice);
	Log('isTablet:' + isTablet);
	Log('isSmartPhone:' + isSmartPhone);
	
	if(isMobileDevice){ 
		jQuery('html,#content').addClass('mobileDevice');
		if(isSmartPhone){jQuery('html,#content').addClass('smartPhoneDevice');}
		if(isTablet){jQuery('html,#content').addClass('tabletDevice');}
		if(isApple){jQuery('html,#content').addClass('appleMobDevice');}
	}else{
		jQuery('html,#content').addClass('dskDevice');
	}
	jQuery('.disabledLink').on('click',function(ev){
		ev.preventDefault();
	});
	
	// Animate the scroll to top
	jQuery('.go-top').click(function(event) {
		event.preventDefault();
		jQuery('html, body').animate({scrollTop:0}, 300);
		mobileMenu.resetMenu('all');
	});
	
	// Show or hide the sticky footer button
	jQuery(window).scroll(function() {
		if (jQuery(this).scrollTop() > 900) {
			jQuery('.go-top').fadeIn(200);
		} else {
			jQuery('.go-top').fadeOut(200);
		}
	});

	mobileMenu.init();
	topMenu.init();
	topBar.init();
	sectionNav.init();
	gap_datalayer.init();
	
});


var sectionNav={
	nav:null,
	navButtons:null,
	pageSections:null,
	scrollTime:600,
	init:function(){
		var $this=this;
		$this.nav=jQuery('#dg-navigate-section');
		if($this.nav.length>0){
			$this.navButtons=$this.nav.find('.dg-navigate-section-item');
			$this.navButtons.removeClass('current');
			$this.pageSections=jQuery('.dg_section');
			if($this.pageSections.length>1){
				$this.pageSections.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
					if(isInView){ //element is now visible in the viewport
						if(visiblePartY=='top'){
						}else if(visiblePartY=='bottom'){
						}else{//whole part of element is visible
							$this.navButtons.removeClass('current');
							var secId=jQuery(this).attr('data-sectionid');
							$this.nav.find('.dg-navigate-section-item[data-section="'+secId+'"]').addClass('current');
						}
					}else{
						//element has gone out of viewport
					}
				});
				$this.navButtons.on('click',function(){
					var sct=jQuery(this).attr('data-section');
					Log('Scrolling to: '+sct);
					var $toScroll=jQuery('[data-sectionid="'+sct+'"]');
					if(typeof $toScroll!="undefined"&&$toScroll.length>0){
						var offset=(sct=='dg_section_0')?-55:-42;//h of collepsed header
						jQuery.scrollTo( 
							$toScroll,
							$this.scrollTime,
							{
								offset:offset,
								axis:'y',
								onAfter:function(){}
							}
						);
					}else{
						Log(sct+' NOT DEFINED')
					}
				});
			}else{
				//only one section...HIDE ALL
				$this.nav.hide();
			}
		}
	}
}


var top_slider={
	
	slider_obj:null,
	sliderH:null,
	slides:null,
	sliderInterval:null,
	slideTime:4000,
	fadeTime:1500,
	hPercent:0.92,
	animationTime:350,
	currentSlide:null,
	isLanding:false,
	loadedImages:new Array(),
	init:function(isLanding){
		var $this=this;
		
		if(!isSmartPhone){
			if(typeof isLanding!='undefined'){$this.isLanding=isLanding;}
			$this.slider_obj=jQuery('#top_slider');
			$this.slider_obj.parent('#top_slider_container').addClass('loading-images');
			$this.slides=$this.slider_obj.find('li');
			
			jQuery.each($this.slides,function(index,value) {
				jQuery($this.slides[index]).hide();
			});
			
			//$this.resetSliderH();
			
			$this.slider_obj.imagesLoaded(function() {
				
				jQuery($this.slides[0]).fadeIn($this.animationTime).promise().done( function(){
					$this.currentSlide=0;
					jQuery($this.slides[$this.currentSlide]).addClass('active');
					$this.slider_obj.parent('#top_slider_container').removeClass('loading-images');
					$this.playSlider();
					
					$this.slider_obj.mouseenter(function() {
						if(top_slider.slides.length > 1) {$this.pauseSlider(); }
					}).mouseleave(function() {
						if(top_slider.slides.length > 1) { $this.playSlider(); }
					});
					jQuery(window).resize(function(e) { $this.resetSliderH(); });
					$this.resetSliderH();
				});
			});
		}
	},
	getSlides:function(){ return this.slides; },
	playSlider:function() {
		var $this=this;
		//Log('top_slider: play');
		if(top_slider.slides.length > 1) {
			/*if on load user have mouse inside slider than "$this.slider_obj.mouseenter" is not called and there are two call on playSlider, to prevent this we need to reset the interval*/
			if(typeof $this.sliderInterval!='undefined'&&$this.sliderInterval!=null){
				$this.pauseSlider();
			}
			$this.sliderInterval=setInterval(
				function(){
					//Log('top_slider: transition');
					var current_slide_index=$this.currentSlide;
					$this.currentSlide=($this.currentSlide + 1) % $this.slides.length;
					
					jQuery($this.slides[current_slide_index]).removeClass('active').fadeOut( $this.fadeTime );
					jQuery($this.slides[$this.currentSlide]).addClass('active').fadeIn( $this.fadeTime );
					
				}, $this.slideTime );
		}
	},
	pauseSlider:function(){
		var $this=this;
		//Log('top_slider: pause');
		$this.slider_obj.stop(true,true);
		window.clearInterval($this.sliderInterval);
	},
	resetSliderH:function(){
		var $this=this;
		var space=jQuery(window).height()*$this.hPercent;
		var h=space-175;//jQuery('#branding').height();
		var ih=jQuery($this.slides[$this.currentSlide]).find('img').height();
		if(ih != null){
			if(ih>0&&h>ih){h=ih;}
			$this.sliderH=h;
			Log('top_slider resize: '+$this.sliderH);
			//$this.sliderH=jQuery($this.slides[$this.currentSlide]).find('img').height();
			//$this.slider_obj.stop(true,false).animate({height:$this.sliderH},$this.animationTime,'easeOutCubic');
			$this.slider_obj.stop(true,true).css({height:$this.sliderH});
			if($this.isLanding){
				//Log(jQuery('div.main-block.landingPage .fullRow .single-block'));
				jQuery('div.main-block.landingPage .fullRow .single-block').animate({height:$this.sliderH},$this.animationTime,'easeOutCubic');
			}
		}
	}
};










var top_slider_mobile={
	
	slider_obj:null,
	sliderH:null,
	slides:null,
	sliderInterval:null,
	slideTime:4000,
	fadeTime:1500, 
	currentSlide:null,
	loadedImages:new Array(),
	
	init:function(){
		var $this=this;

		$this.slider_obj=jQuery('#top_slider_mobile');
		$this.slides=$this.slider_obj.find('li');
		
		$this.slider_obj.parent('#top_slider_mobile_container').addClass('loading-images');
		
		jQuery.each($this.slides , function(index , value) {
			jQuery($this.slides[index]).hide();
		});
		
		$this.slider_obj.imagesLoaded(function() {
			jQuery($this.slides[0]).show().promise().done( function(){
				$this.currentSlide=0;
				jQuery($this.slides[$this.currentSlide]).addClass('active');
				$this.slider_obj.parent('#top_slider_mobile_container').removeClass('loading-images');
				$this.playSlider();
			});
			
			$this.slider_obj.mouseenter(function() {
				if(top_slider.slides.length > 1) {$this.pauseSlider(); }
			}).mouseleave(function() {
				if(top_slider.slides.length > 1) { $this.playSlider(); }
			});
			
			jQuery(window).resize(function(e) {
				$this.resetSliderH();
            });
		});
	},
	getSlides:function(){return this.slides;},
	playSlider:function() {
		var $this=this;
		
		$this.resetSliderH();
		if(top_slider_mobile.slides.length > 1) { 
			$this.sliderInterval=setInterval(
				function(){
					
					var current_slide_index=$this.currentSlide;
					$this.currentSlide=($this.currentSlide + 1) % $this.slides.length;
					
					jQuery($this.slides[current_slide_index]).removeClass('active').fadeOut( $this.fadeTime );
					jQuery($this.slides[$this.currentSlide]).addClass('active').fadeIn( $this.fadeTime );

				}, $this.slideTime );
		}
	},
	pauseSlider:function(){
		var $this=this;
		$this.slider_obj.stop(true,true);
		window.clearInterval($this.sliderInterval);
	},
	resetSliderH:function(){
		var $this=this;
		$this.sliderH=jQuery($this.slides[$this.currentSlide]).find('img').height();
		$this.slider_obj.css('height',$this.sliderH);
	}
};



var GD_Gallery={
	content:null,
	init:function(){
		if(typeof max_container_width!="undefined"&&typeof gallery_img!="undefined"){
			if(isMobileDevice){
				jQuery('head').prepend('<meta name="viewport" content="width=device-width, maximum-scale=1.0, initial-scale=1.0, user-scalable=no" />');
			}
			var $this=this;
			//$this.content=jQuery("#content");
			$this.content=jQuery("#gallery-wrapper");
			var cur_row=0;
			for(var i=0; i<gallery_img.length; i++){
				var rowData=new Object();
				rowData.i=i;
				rowData.img_src=gallery_img[i]['src'];
				rowData.img_width=gallery_img[i]['width'];
				rowData.max_height_px=gallery_img[i]['max_height_px'];
				rowData.type=gallery_img[i]['type'];
				rowData.url=gallery_img[i]['url'];
				rowData.title=gallery_img[i]['title'];
				
				var row=gallery_img[i]['row'];
				var width_content=$this.content.width();
				if (width_content<max_container_width){
					rowData.max_height_px=rowData.max_height_px*width_content/max_container_width;
				}
				jQuery("#row_"+row).append($this.getRowTemplate(rowData));
				if (cur_row!=row){
					jQuery('#thumb_'+(i-1)).css("float","right");
					cur_row=row;
				}
			}
			jQuery(document).ready(function(e) {
				$this.resizeAll($this.content.width());
				if(isMSIE(8)){
					setTimeout(function(){$this.resizeAll($this.content.width());},2000);
				}
			});
			jQuery(window).resize(function() {
				$this.resizeAll($this.content.width());
			});
		}
	},
	getRowTemplate:function(obj){
		return '<div id="thumb_'+obj.i+'" class="single-element '+obj.type+'" style="width:'+obj.img_width+';display:inline-block;height:'+Math.floor(obj.max_height_px)+'px"><a href="'+obj.url+'" class="imagecontainer"><img src="'+obj.img_src+'" alt="'+obj.title+'" style="width:100%;height:100%;"></a><div class="overlay-box-shadow"><a href="'+obj.url+'" class="overlay-plus-icon"></a><div class="social-box"><div class="social-share-cont"><a data-social_id="fb_social_share" data-href="'+obj.url+'" target="_blank" href="http://www.facebook.com/sharer.php?u='+encodeURIComponent(obj.url)+'" class="overlay-sharer fb">&nbsp;</a><a data-social_id="tb_social_share" data-href="'+obj.url+'" target="_blank" href="http://tumblr.com/share?s=&v=3&t='+obj.title+'&u='+encodeURIComponent(obj.url)+'" class="overlay-sharer tb">&nbsp;</a><a data-social_id="tw_social_share" data-href="'+obj.url+'" target="_blank" href="https://twitter.com/intent/tweet?url='+obj.url+'&amp;text='+obj.title+'&amp;via=dolcegabbana" class="overlay-sharer tw">&nbsp;</a></div></div></div></div>';
	},
	resizeAll:function(width_content){
		if (width_content<max_container_width){
			for(var i=0; i<gallery_img.length; i++){
				var max_height_px=gallery_img[i]['max_height_px'];
				var thumb_height=Math.floor(max_height_px*width_content/max_container_width);
				jQuery("#thumb_"+i).css("height",thumb_height+"px");
			}				
		}
		else if (width_content>=max_container_width){
			for(var i=0; i<gallery_img.length; i++){
				jQuery("#thumb_"+i).css("height",Math.floor(gallery_img[i]['max_height_px'])+"px");
			}
		}
	}
}



var block_videoplayer={
	videoPlayer:null,
	element:null,
	videoID:null,
	playLayer:null,
	//featured:null,
	pushUrl:'',
	coverurl:'',
	pushTitle:'',
	//playerReady:false,
	//YT_player:null,
	videoPlaying:false,
	videoH:null,
	firstPush:true,
	autoplay:false,
	push_the_url:false,
	hPercent:0.92,
	animationTime:450,
	video_prop_w4h:658/1170,
	video_prop_h4w:1170/658,
	headerH:175,
	headerCollH:43,
	headerMob:95,
	isFs:false,
	qLevels:null,
	inFullScreen:false,
	init:function(autoplay,push_the_url){
		var $this=this;
		//Log('block_videoplayer.init');
		$this.autoplay=autoplay;
		$this.push_the_url=push_the_url;
		$this.element=jQuery('#video-placeholder');
		$this.playerwrapper=jQuery('#videoplayer-wrapper');
		$this.toggleEl=jQuery('#video-placeholder .featured');
		$this.playLayer=jQuery('#video-placeholder #play-layer');
		if(jQuery('#fsGallery').length>0&&typeof fsPicSlider!="undefined"){$this.isFs=true;}		
		$this.videoID=$this.element.attr('data-videoid');
		$this.pushUrl=$this.element.attr('data-pushurl');
		$this.coverurl=$this.element.attr('data-coverurl');
		$this.pushTitle=$this.element.attr('data-pushtitle');
		//$this.playerwrapper.hide();
		//$this.element.addClass('loading');
		$this.initPlayer();
		$this.resetVideoH();
		jQuery(window).resize(function(){$this.resetVideoH();});
	},
	initPlayer:function(){
		var $this=this;
		Log('initVideoPlayer');
		
		var foundSource=false;
		var poster='';
		var _options={
			'id':'the_video_player','width':"100%",'height':"100%",'autostart':false,
			'controls':false,'repeat':false,'controlbar':'over',//'primary':'flash',
			'fallback':true,'stretching':'fill','screencolor':'000000','wmode':'transparent',
			'skin':the_main_template_dir+"js/jwplayer/skin/dg/dg.xml","mute":false,
			'flashplayer':the_main_template_dir+"js/jwplayer/jwplayer.flash.swf",
			'html5player':the_main_template_dir+"js/jwplayer/jwplayer.html5.js"
		}
		if(typeof $this.coverurl!=='undefined'&&$this.coverurl!=''){
			_options['image']=$this.coverurl;
		}
		//YouTube Video
		Log('YouTube Video');
		if($this.videoID!=null&&$this.videoID!=''){
			foundSource=true;
			_options['file']="http://www.youtube.com/watch?v="+$this.videoID+"?rel=0&showinfo=0&modestbranding=0&wmode=opaque&vq=hd720";
		}

		if(foundSource){
			if(isMobileDevice){
				$this.playLayer.hide();
				$this.playerwrapper.html($this.embedVideoIframeTemplate($this.videoID));
				$this.YT_player=new YT.Player('videoplayer',{
					events:{
						'onReady':block_videoplayer.onPlayerReady,
						'onStateChange':block_videoplayer.onPlayerStateChange 
						//'onError':video_player.onPlayerStateChange
					}
				});
				//lockHeder('lock');
			}else{
				if(isMSIE(9)||isMSIE(8)){_options['primary']='flash';}
				$this.videoPlayer=jwplayer("theVideo").setup(_options);
				$this.toggleEl.animate({opacity:1},$this.animationTime);
				$this.playLayer.animate({opacity:1},$this.animationTime);
				$this.playerwrapper.fadeIn($this.animationTime);
				
				$this.resetVideoH();
				$this.element.removeClass('loading');
				$this.videoPlayer.onReady(function(){
					Log('Player Ready');
					$this.initControls();
				}).onPlay(function(){
					lockHeder('lock');
					$this.playLayer.animate({opacity:0},$this.animationTime);
					$this.controlBar.btnPlay.addClass('toggled');
					$this.resetVideoH();
					if($this.firstPush){
						$this.qLevels=$this.videoPlayer.getQualityLevels();
						$this.videoPlayer.setCurrentQuality(2);
						gap_datalayer.track_video('www.youtube.com/watch?v='+$this.videoID);
						$this.firstPush=false;
					}
					if($this.firstPush||$this.push_the_url){
						$this.firstPush=false;
						$this.push_the_url=false;
						pushUrl($this.pushUrl,'');
					}
					
					
				}).onPause(function(){
					$this.playLayer.animate({opacity:1},$this.animationTime);
					$this.controlBar.btnPlay.removeClass('toggled');
					//if(jQuery('html').hasClass('fullScreenVideo')){exitFullscreen();}
					//jQuery('html').removeClass('fullScreenVideo');
					//$this.controlBar.btnFull.removeClass('toggled');
					lockHeder('unlock');
					$this.resetVideoH();
				}).onComplete(function(){
					if(jQuery('html').hasClass('fullScreenVideo')){exitFullscreen();}
					jQuery('html').removeClass('fullScreenVideo');
					$this.controlBar.btnFull.removeClass('toggled');
					$this.toggleEl.fadeIn($this.animationTime);
					$this.controlBar.timeLineTime.css('width','0%');
					$this.controlBar.btnPlay.removeClass('toggled');
					$this.controlBar.wrap.fadeOut($this.animationTime);
					block_videoplayer.firstPush=true;
					lockHeder('unlock');
					$this.resetVideoH();
				});
			}
			
			$this.element.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
				if(isInView){ //element is now visible in the viewport
					if(visiblePartY=='top'){
					}else if(visiblePartY=='bottom'){}else{
						/*whole part of element is visible*/
						$this.playTheVideo();
					}
				}else{
					//element has gone out of viewport
					$this.pauseTheVideo();
				}
			});
		}
	},
	pauseTheVideo:function(){
		var $this=this;
		if(isMobileDevice){
			if(typeof $this.YT_player!="undefined"&&$this.YT_player!=null){
				//pause video only if is in play
				if($this.YT_player.getPlayerState()==1){
					Log('block_videolayer: pauseTheVideo');
					$this.YT_player.pauseVideo();
				}
			}
		}else{
			if(typeof $this.videoPlayer!="undefined"&&$this.videoPlayer!=null){
				//pause video only if is in play
				if($this.videoPlayer.getState()=="PLAYING"){
					Log('block_videolayer: pauseTheVideo');
					$this.videoPlayer.pause();
				}
			}
		}
	},
	playTheVideo:function(){
		return;//disabled
		var $this=this;
		if(isMobileDevice){
			if(typeof $this.YT_player!="undefined"&&$this.YT_player!=null){
				//play video only if is in pause (not stopped but only paused)
				if($this.YT_player.getPlayerState()==2){
					Log('block_videolayer: playTheVideo');
					$this.YT_player.playVideo();
				}
			}
		}else{
			if(typeof $this.videoPlayer!="undefined"&&$this.videoPlayer!=null){
				//play video only if is in pause (not stopped but only paused)
				if($this.videoPlayer.getState()=="PAUSED"){
					Log('block_videolayer: playTheVideo');
					$this.videoPlayer.play();
				}
			}
		}
	},
	onPlayerReady:function(){
		var $this=this;
		Log('PlayerReady');
		block_videoplayer.playerReady=true;
		block_videoplayer.videoPlaying=true;
		block_videoplayer.playerwrapper.fadeIn($this.animationTime);
		block_videoplayer.toggleEl.animate({opacity:1},$this.animationTime);
	},
	onPlayerStateChange:function(event){
		if (event.data==YT.PlayerState.ENDED) {
			block_videoplayer.onVideoEnd();
		}
		else if (event.data == YT.PlayerState.PLAYING) {
			if(!block_videoplayer.push_the_url&&block_videoplayer.firstPush){
				gap_datalayer.track_video('www.youtube.com/watch?v='+block_videoplayer.videoID);
				block_videoplayer.firstPush=false;
			}
			if(block_videoplayer.push_the_url&&block_videoplayer.firstPush) {
				gap_datalayer.track_video('www.youtube.com/watch?v='+block_videoplayer.videoID);
				//pushUrl(block_videoplayer.pushUrl , block_videoplayer.pushTitle);
				block_videoplayer.firstPush=false;
			}
			if(!isSmartPhone){block_videoplayer.toggleEl.slideUp();}
		}
		else if(event.data==YT.PlayerState.PAUSED){}
		else if(event.data==YT.PlayerState.BUFFERING){}
		else if(event.data==YT.PlayerState.CUED){}
		else if(event.data==-1) {}
	},
	onVideoEnd:function(){ 
		var $this=this;
		block_videoplayer.videoPlaying=false;
		block_videoplayer.toggleEl.slideDown();
		block_videoplayer.firstPush=true;
		lockHeder('unlock');
	},
	initControls:function(){
		var $this=this;
		$this.controlBar={
			wrap:$this.element.find('.dg-video-controls'),
			btnPlay:$this.element.find('.dg-video-controls .dg-play-btn'),
			btnMute:$this.element.find('.dg-video-controls .dg-mute-btn'),
			btnFull:$this.element.find('.dg-video-controls .dg-full-btn'),
			timeLine:$this.element.find('.dg-video-controls .dg-timeline-wrap'),
			timeLineTime:$this.element.find('.dg-video-controls .dg-timeline-wrap .dg-timeline')
		}
		
		if(typeof $this.videoPlayer!='undefined'){

			$this.playLayer.on('click',function(e){
				$this.videoPlayer.play();
				$this.toggleEl.fadeOut($this.animationTime);
				$this.controlBar.wrap.fadeIn($this.animationTime);
				//$this.controlBar.btnPlay.toggleClass('toggled');
			});
			$this.controlBar.btnPlay.on('click',function(e){
				$this.videoPlayer.play();
				//$this.controlBar.btnPlay.toggleClass('toggled');
			});
			$this.videoPlayer.onTime(function(e){
				var delta=e.duration-e.position;
				var perc=100-(delta/e.duration)*100;
				//Log('Duration: '+perc);
				if(perc>100){ perc=100; }
				$this.controlBar.timeLineTime.css('width',perc.toFixed(2)+'%');
			});
			$this.controlBar.timeLine.on('click',function(e){
				var tot=$this.controlBar.timeLine.width();
				var delta=tot-(e.clientX-jQuery(this).offset().left);
				var perc=1-((delta/tot).toFixed(2));
				$this.videoPlayer.seek($this.videoPlayer.getDuration()*perc);
				$this.controlBar.btnPlay.addClass('toggled');
			});
			$this.controlBar.btnMute.on('click',function(e){
				$this.videoPlayer.setMute();
				$this.controlBar.btnMute.toggleClass('toggled');
			});
			$this.controlBar.btnFull.on('click',function(e){
				if(!$this.inFullScreen){
					launchIntoFullscreen(document.documentElement);
					jQuery('html').addClass('fullScreenVideo');
					$this.controlBar.btnFull.addClass('toggled');
					setTimeout(function(){$this.inFullScreen=true;},500);
				}else{
					$this.inFullScreen=false;
					exitFullscreen();
					jQuery('html').removeClass('fullScreenVideo');
					$this.controlBar.btnFull.removeClass('toggled');
				}
				$this.resetVideoH();
			});
			if($this.autoplay){$this.playLayer.click();}
		}
	},
	fullScreenEventReceiver:function(){
		var $this=this;
		if($this.inFullScreen){
			Log('fullScreenEventReceiver');
			$this.inFullScreen=false;
			jQuery('html').removeClass('fullScreenVideo');
			$this.controlBar.btnFull.removeClass('toggled');
		}
	},
	resetVideoH:function() {
		var $this=this;

		if(isMobileDevice){
			$this.videoH=$this.element.width()*($this.video_prop_w4h);
			$this.playerwrapper.css('height',$this.videoH);
			if(isTablet){
				$this.element.css('height',$this.videoH);
			}else{
				jQuery('#videoplayer').height($this.videoH);
			}
		}else{
			//$this.videoH=$this.videoContainer.width()*(627 / 1280);
			var hh=headerLocked?$this.headerCollH:$this.headerH;
			var mt_wrap=headerLocked&&!jQuery('html').hasClass('fullScreenVideo')?$this.headerCollH:0;
			$this.wrapperH=$this.element.width()*$this.video_prop_w4h;
			var maxH=(jQuery(window).innerHeight()*$this.hPercent)-hh;
			var mt=0;
			mt=($this.wrapperH-maxH)/2;
			if(maxH<$this.wrapperH){
				mt=-1*($this.wrapperH-maxH)/2;
			}else{
				maxH=$this.wrapperH;
				mt=0;
			}
			if(typeof $this.videoPlayer!="undefined"&&$this.videoPlayer!=null){
				//if !in play && !in pause video must be aligned in top!
				var state=$this.videoPlayer.getState();
				Log(state);
				if(state!="PAUSED"&&state!="PLAY"&&state!="PLAYING"){mt=0;}
			}
			//Log('maxH:'+maxH);
			//Log('wrapperH:'+$this.wrapperH);
			//Log('mt:'+mt);
			$this.element.css({'height':maxH,'margin-top':mt_wrap});
			$this.playerwrapper.css({'height':$this.wrapperH,'margin-top':mt});
			//$this.playerwrapper.css({'height':maxH});
			//$this.featured.css({'margin-top':mt});
			//$this.element.css('height',$this.videoH);
		}
	},
	embedVideoIframeTemplate:function(videoID){return '<iframe id="videoplayer" src="https://www.youtube.com/embed/'+videoID+'?enablejsapi=1&amp;autoplay=0&amp;autohide=1&amp;controls=1&amp;rel=0&amp;color=white&amp;showinfo=0&amp;modestbranding=0&amp;wmode=opaque&amp;hd=1&amp;vq=hd720&amp;origin=http://'+window.location.host+'" frameborder="0" style="width:100%; height:100%;"></iframe>';}

}











var topBar={
	dsk_height:220,
//	lang_dsk_height:170,
	lang_dsk_height:80,
	fade_time:300,
	slide_time:450,
	close_button:null,
	dg_world_button:null,
	dg_lang_button:null,
	dg_lang_content:null,
	dg_world_content:null,
	hiddenLayer:null,
	layerOpen:false,
	current_content:null,
	//locked:false,
	
	init:function(){
		var $this=this;
		$this.dg_world_button=jQuery('#topBar #topBarLeft li.userWorld a');
		$this.dg_lang_button=jQuery('#topBar #topBarRight li.changeLanguage a');
		$this.dg_world_content=jQuery('#hiddenTopLayer #userWorld');
		$this.world_hiddenLayer=jQuery('#hiddenTopLayer');
		$this.dg_lang_content=jQuery('#lang-hiddenLayer #loadchangeLanguage');
		$this.lang_hiddenLayer=jQuery('#lang-hiddenLayer');
		$this.close_button=jQuery('#hiddenlayer-wrapper .closeIcon');
		
		$this.dg_world_button.on('click' , function(ev){
			if(!$this.dg_world_content.hasClass('current')){
				$this.toggleLanguage('close' , function(){topBar.toggleDGworld('open');} );
			} else {
				$this.toggleDGworld('close');
			}
			//reset topMenu
			topMenu.resetAll();
		});
		
		$this.dg_lang_button.on('click' , function(ev){
			if(!$this.dg_lang_content.hasClass('current')){
				$this.toggleDGworld('close', function(){topBar.toggleLanguage('open');});
			} else {
				$this.toggleLanguage('close');
			}
			//reset topMenu
			topMenu.resetAll();
		});
		$this.close_button.on('click' , function(ev){
			$this.resetAll();
		});
		
	},
	toggleDGworld:function(animation , callback){
		var $this=this;
		if(callback==undefined||callback==null){callback=function(){return;}}
		//smartphone need different transition
		if(isSmartPhone){
			if(animation== 'open' && !$this.layerOpen){
				$this.world_hiddenLayer.fadeIn($this.slide_time , function() {
					$this.layerOpen=true;
					$this.dg_world_content.addClass('current');
					$this.dg_world_content.fadeIn($this.fade_time);
					$this.dg_world_button.parent().addClass('active');
					callback();
				});
			} else if(animation== 'close'){
				$this.dg_world_content.fadeOut($this.fade_time);
				$this.world_hiddenLayer.fadeOut($this.slide_time , function() {
					$this.layerOpen=false;
					$this.dg_world_content.removeClass('current');
					$this.dg_world_button.parent().removeClass('active');
					$this.resetTop();
					callback();
				});
			}
		} else {
			if(animation== 'open' && !$this.layerOpen){
				$this.world_hiddenLayer.animate({height:$this.dsk_height+"px"}, $this.slide_time , function() {
					$this.layerOpen=true;
					$this.dg_world_content.addClass('current');
					$this.dg_world_content.fadeIn($this.fade_time);
					$this.dg_world_button.parent().addClass('active');
					callback();
				});
			} else if(animation== 'close'){
				$this.dg_world_content.fadeOut($this.fade_time);
				$this.world_hiddenLayer.animate({height:"0px"}, $this.slide_time , function() {
					$this.layerOpen=false;
					$this.dg_world_content.removeClass('current');
					$this.dg_world_button.parent().removeClass('active');
					$this.resetTop();
					callback();
				});
			}
		}
	},
	toggleLanguage:function(animation , callback){
		var $this=this;
		if(callback==undefined||callback==null){callback=function(){return;}}
		//smartphone need different transition
		if(isSmartPhone){
			if(animation== 'open' && !$this.layerOpen){
				$this.lang_hiddenLayer.fadeIn($this.slide_time , function() {
					$this.layerOpen=true;
					$this.dg_lang_content.addClass('current');
					$this.dg_lang_content.fadeIn($this.fade_time);
					$this.dg_lang_button.parent().addClass('active');
					callback();
				});
			} else if(animation== 'close'){
				$this.dg_lang_content.fadeOut($this.fade_time);
				$this.lang_hiddenLayer.fadeOut($this.slide_time , function() {
					$this.layerOpen=false;
					$this.dg_lang_content.removeClass('current');
					$this.resetTop();
					callback();
				});
			}
		} else {
			if(animation== 'open' && !$this.layerOpen){
				$this.lang_hiddenLayer.animate({height:$this.lang_dsk_height+"px"}, $this.slide_time , function() {
					$this.layerOpen=true;
					$this.dg_lang_content.addClass('current');
					$this.dg_lang_content.fadeIn($this.fade_time);
					$this.dg_lang_button.parent().addClass('active');
					callback();
				});
			} else if(animation== 'close'){
				$this.dg_lang_content.fadeOut($this.fade_time);
				$this.lang_hiddenLayer.animate({height:"0px"}, $this.slide_time , function() {
					$this.layerOpen=false;
					$this.dg_lang_content.removeClass('current');
					$this.resetTop();
					callback();
				});
			}
		}
	},
	resetTop:function(){
		var $this=this;
		$this.dg_world_button.parent().removeClass('active');
		$this.dg_lang_button.parent().removeClass('active');
	},
	resetAll:function(){
		var $this=this;
		$this.toggleLanguage('close');
		$this.toggleDGworld('close');
	}
}






var topMenu={
	fadeTime:300,
	slideTime:300,
	headerH:176,
	subMenuTotHeight:225+176,
	isOpen:false,
	isStiky:false,
	currentMenu:null,
	menuLinks:null,
	subMenus:null,
	theMainManu:null,
	closeButton:null,
	locked:false,
	topBar:null,
	mainPageContent:null,
	footer:null,
	
	init:function(){
		var $this=this;
		$this.menu_links=jQuery('#external_links .main-menu-link a');
		$this.subMenus=jQuery('#external_links #submenu .submenu_block');
		$this.theMainMenu=jQuery('#external_links ul#the_main_menu');
		$this.closeButton=jQuery('#external_links .closeIcon');
		$this.mainPageContent=jQuery('#content');
		$this.topBar=jQuery('#content #topBar');
		$this.footer=jQuery('#content #footer');
		/*
		if(isMobileDevice){
			$this.menu_links.hammer().on("hold", function(ev) {
				ev.preventDefault();
				window.location.href=this.href ;
			});
		}
		$this.menu_links.on( 'dblclick' , function(ev){
				ev.preventDefault();
				window.location.href=this.href ;
		});
		*/
		//show collapsed header
		jQuery(window).scroll(function() {
			//call fixFooter for make footer position fixed if needed
			$this.fixFooter();
			//if(!jQuery('body').hasClass('lockHeader')){
			if(!headerLocked){
				if (
					jQuery(this).scrollTop() > ($this.headerH)
					&& jQuery(window).width() > 760
				) {
					$this.isStiky=true;
					$this.topBar.hide();
					$this.mainPageContent.addClass('header-implode follow-scroll');
					$this.setMargin('max');
				} else {
					$this.isStiky=false;
					$this.topBar.show();
					$this.mainPageContent.removeClass('header-implode follow-scroll');
					$this.setMargin('min');
				}
			}
		});
		$this.menu_links.on( 'click' , function(ev){
			ev.preventDefault();
			if(!$this.locked){
				$this.locked=true;
				$this.toggleSubmenu(jQuery(this));
				//reset topbar menu
				topBar.resetAll();
			}
		});
		$this.closeButton.on( 'click' , function(ev){
			ev.preventDefault();
			$this.resetAll();
		});
		jQuery(window).resize(function(){$this.fixFooter();});		
	},
	fixFooter:function(){
		var $this=this;
		if(jQuery(window).height()>$this.mainPageContent.height()+$this.footer.height()){
			$this.footer.addClass('fixedFooter');
		}else{
			$this.footer.removeClass('fixedFooter');
		}
	},
	toggleSubmenu:function(theLink){
		var $this=this;
		var hrefLink=theLink.attr('href');
		var tmpMenu=jQuery('#'+theLink.attr('data-submenuID'));
		Log('topMenu: tmpMenu->'+tmpMenu);
		Log('topMenu: isStiky->'+$this.isStiky);
		if($this.currentMenu==null){
			$this.currentMenu=tmpMenu;
			$this.menu_links.removeClass('active').promise().done(function(){
				if($this.isStiky){
					$this.mainPageContent.animate({'padding-top':$this.subMenuTotHeight},$this.slideTime);
				}
				$this.currentMenu.slideDown( $this.slideTime , function(){
					$this.isOpen=true;
					theLink.addClass('active');
					$this.locked=false;
				});
			});		
		} else if($this.currentMenu.attr('id')==tmpMenu.attr('id')){
			$this.menu_links.removeClass('active');
			if($this.isStiky){
				$this.mainPageContent.animate({'padding-top':$this.headerH},$this.slideTime);
			}else{
				$this.mainPageContent.animate({'padding-top':0},$this.slideTime);
			}
			$this.currentMenu.slideUp( $this.slideTime , function(){
				$this.isOpen=false;
				$this.currentMenu=null;
				$this.locked=false;
			});
		} else {
			$this.currentMenu.fadeOut( $this.fadeTime , function(){
				$this.isOpen=false;
				$this.currentMenu=tmpMenu;
				$this.menu_links.removeClass('active').promise().done(function(){
					$this.currentMenu.fadeIn( $this.fadeTime , function(){
						$this.isOpen=true;
						$this.locked=false;
						theLink.addClass('active');
					});
				});
			});
		}
		
	},
	resetAll:function(){
		var $this=this;
		if($this.isOpen){
			$this.menu_links.removeClass('active');
			$this.currentMenu.slideUp( $this.slideTime , function(){
				$this.isOpen=false;
				$this.currentMenu=null;
				$this.locked=false;
			});
			if($this.isStiky){
				$this.mainPageContent.animate({'padding-top':$this.headerH},$this.slideTime);
			} else {
				$this.mainPageContent.animate({'padding-top':0},$this.slideTime);
			}
		}
	},
	setMargin:function (qt){
		var $this=this;
		if(qt=='max'){
			if($this.isOpen){
				$this.mainPageContent.css('padding-top',$this.subMenuTotHeight);
			}else{
				$this.mainPageContent.css('padding-top',$this.headerH);
			}
		}else if(qt=='min'){
			$this.mainPageContent.css('padding-top',0);
		}
	}
}





var mobileMenu={
	mainMenu:new Object(),
	footerMenu:new Object(),
	
	init:function(){
		var $this=this;
		if(isMobileDevice){}
			
		$this.mainMenu.obj=jQuery('#header div.toggleMenuContainer');
		$this.mainMenu.nav=jQuery('#header div.toggleMenuContainer .toggleNav');
		$this.mainMenu.isOpen=false;
		$this.footerMenu.obj=jQuery('#footer div.toggleMenuFooterContainer');
		$this.footerMenu.nav=jQuery('#footer div.toggleMenuFooterContainer .toggleFooterNav');
		$this.footerMenu.isOpen=false;

		/*
		$this.mainMenu.nav.find("> li a").each(function() {
			if (jQuery(this).next().length > 0) {
				jQuery(this).addClass("parent");
			}
		})
		*/
		
		$this.mainMenu.obj.find(".toggleMenu").click(function(e) {
			e.preventDefault();
			var $me=jQuery(this);
			if($this.mainMenu.isOpen) {
				$me.removeClass("active");
				jQuery('div.arrow-right,div.arrow-left').removeClass("absolutePos");
				$this.mainMenu.nav.slideUp("slow").promise().done( function(){
					$this.mainMenu.isOpen=false;
					if(picSlider != null && picSlider != 'undefine' ){
						if(picSlider.isMobile){ picSlider.resetSizeAndPositionMobile(); }
					}
				});
			} else {
				$me.addClass("active");
				jQuery('div.arrow-right,div.arrow-left').addClass("absolutePos");
				$this.mainMenu.nav.slideDown("slow").promise().done( function(){
					$this.mainMenu.isOpen=true;
					$this.resetMenu('bottom');
					if(picSlider != null && picSlider != 'undefine' ){
						if(picSlider.isMobile){ picSlider.resetSizeAndPositionMobile(); }
					}
				});
			}
		});
		
		$this.footerMenu.obj.find('.toggleFooterMenu').click(function(e) {
			e.preventDefault();
			var $me=jQuery(this);
			if($this.footerMenu.isOpen){
				jQuery('div.arrow-right,div.arrow-left').removeClass("absolutePos");
				$this.footerMenu.nav.slideUp("slow").promise().done( function(){
					$this.footerMenu.isOpen=false;
					jQuery('.go-top').css('bottom','56px');
					if(picSlider != null && picSlider != 'undefine' ){
						if(picSlider.isMobile){ picSlider.resetSizeAndPositionMobile(); }
					}
				});
			} else {
				$this.footerMenu.nav.slideDown("slow").promise().done( function(){
					jQuery("html, body").animate({ scrollTop:jQuery(document).height() }, 500);
					$this.footerMenu.isOpen=true;
					$this.resetMenu('top');
					jQuery('.go-top').css('bottom',$this.footerMenu.obj.height() + 5);
					if(picSlider != null && picSlider != 'undefine' ){
						if(picSlider.isMobile){ picSlider.resetSizeAndPositionMobile(); }
					}
				});
			}
		});
		
		$this.mainMenu.nav.find("li a.parent").unbind('click').bind('click', function(e) {
			// must be attached to anchor element to prevent bubbling
			e.preventDefault();
			var $me=jQuery(this);
			var $parents=jQuery(this).parent("li").siblings();
			$me.parent("li").toggleClass("hover");
			$me.next("ul").toggleClass("ciao");
			if($parents.hasClass("hover")){	$parents.removeClass("hover"); }
			 
		});		  

		jQuery(".toggleSelectMenu").click(function(e) {
			e.preventDefault();
			jQuery("html, body").animate({ scrollTop:jQuery(document).height() }, 1000);
			jQuery(this).toggleClass("active");
			jQuery(".toggleSelectNav").slideToggle("slow");
		});
	
		jQuery(".toggleMenu").css("display", "inline-block");
		if (!jQuery(".toggleMenu").hasClass("active"))
		{ jQuery(".toggleNav").hide();}
		else { jQuery(".toggleNav").show(); }
		jQuery(".toggleNav li").unbind('mouseenter mouseleave');
		
	},
	resetMenu:function(menu){
		var $this=this;
		if(menu=='all'){
			if($this.footerMenu.isOpen){$this.footerMenu.obj.find('.toggleFooterMenu').click();}
			if($this.mainMenu.isOpen){$this.mainMenu.obj.find(".toggleMenu").click();}
		}else if(menu=='top'){
			if($this.mainMenu.isOpen){$this.mainMenu.obj.find(".toggleMenu").click();}
		}else if(menu=='bottom'){
			if($this.footerMenu.isOpen){$this.footerMenu.obj.find('.toggleFooterMenu').click();}
		}
	}
	
}









var picSlider={
	
	imagesData:null,
	slider:null,
	wrapper:null,
	socialLinksContainer:null,
	socialLinks:null,
	arrows:null,
	zoomWrapper:null,
	zoomContent:null,
	zoomImage:null,
	arrowsSize:100,
	slideTime:600,
	fadeTime:500,
	slideAnimation:'swing',
	preChargeImages:4,
	preChargeImagesMobile:2,
	isIpad:false,	
	state:new Object({
		currentSlide:null,
		prevSlides:new Array(),
		prevSlidesWith:0,
		totalSlide:null,
		pCurr:0,
		pMin:0,
		pMax:0,
		rv:null,
		rh:null,
		slides:null,
		sliderWidth:0,
		sliderMargin:0,
		zoomOpen:false,
		md:{l:0,r:0}
	}),
	init:function(jsonData){
		if(isSmartPhone){mobPicSlider.init(jsonData); return; }
		var $this=this;
		if(isTablet){
			jQuery('head').prepend('<meta name="viewport" content="width=device-width, maximum-scale=1.0, initial-scale=1.0, user-scalable=no" />');
			$this.isIpad=MobileEsp.DetectIpad();
			if (
			$this.isIpad && 
				window.innerHeight != document.documentElement.clientHeight
			) {
				
				var fixViewportHeight = function() {
					document.documentElement.style.height = window.innerHeight + "px";
					//alert(document.documentElement.style.height);
					if (document.body.scrollTop !== 0) {
						window.scrollTo(0, 0);
					}
				};
			
				window.addEventListener("scroll", fixViewportHeight, false);
				window.addEventListener("orientationchange", fixViewportHeight, false);
				fixViewportHeight();
			
				document.body.style.webkitTransform = "translate3d(0,0,0)";
			}
						
			
		}
		//get the data
		$this.imagesData=jQuery(jsonData);
		//Log(jsonData);
		//set the variables
		
		$this.state.totalSlide=$this.imagesData.length;
		$this.socialLinksContainer=jQuery('#shares-gallery');
		$this.socialLinks=jQuery('#scrolling-shares');
		$this.arrows=jQuery('div.arrow-right, div.arrow-left');
		$this.arrowsSize=jQuery('#navigation-left').width()*2;
		$this.wrapper=jQuery('#pic-slider');
		$this.slider=$this.wrapper.find('#slider');
		$this.zoomWrapper=jQuery('#overlay-popup');
		$this.zoomContent=jQuery('#overlay-popup-content');
		
		//find the slide to start
		$this.imagesData.each(function(index, element) {
            if(element.startWithMe) {
				var _id='';
				for(var i=0 ; i < index ; i++){
					_id='slide_'+$this.imagesData[i].slide_unique_id;
					$this.slider.append('<div id="'+_id+'" class="slide '+$this.imagesData[i].slideType+' loading" data-index="'+i+'" style=""></div>');
				}
				_id='slide_'+element.slide_unique_id;
				var haveInfo=false;
				var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
				if(element.slideMetadata.models){
					haveInfo=true;
					info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
				}
				if(element.slideMetadata.credits){
					if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
					haveInfo=true;
					info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
				}
				info+='</div></div>';
				if(!haveInfo){info="";}
				$this.slider.append('<div id="'+_id+'" class="slide '+element.slideType+' current loading" data-index="'+index+'"><div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" /></div>');
				$this.state.currentSlide=_id;
				for(var i=index+1 ; i< $this.state.totalSlide ; i++){
					_id='slide_'+$this.imagesData[i].slide_unique_id;
					$this.slider.append('<div id="'+_id+'" class="slide '+$this.imagesData[i].slideType+' loading" data-index="'+i+'"></div>');
				}
				$this.state.pCurr=index;
				$this.state.pMin=index;
				$this.state.pMax=index;
				if(isTablet){
					$this.loadImages('prev',$this.preChargeImagesMobile);
					$this.loadImages('next',$this.preChargeImagesMobile);
				}else{
					$this.loadImages('prev',$this.preChargeImages);
					$this.loadImages('next',$this.preChargeImages);
				}
			}
        });
		$this.slider.find('.slide.current').imagesLoaded(function(){
			$this.slider.find('.slide.current img').animate({'opacity':1},$this.fadeTime,function(){
				$this.slider.find('.slide.current').removeClass('loading');
				$this.slider.find('.slide.current').addClass('loaded');
			});
		});
		$this.state.slides=$this.slider.find('.slide');

		$this.resetSizeAndPosition();
		jQuery(window).resize( function(){ $this.resetSizeAndPosition(); });
		$this.socialLinksContainer.on('click',function(e){$this.resetSizeAndPosition();});

		$this.state.slides.on('click' ,function(e){
			if(jQuery(this).attr('data-index')==$this.state.pCurr){
				$this.setZoom();
			}
		});

		$this.zoomWrapper.find('#popup-close-button').on('click' ,function(e){ $this.unsetZoom();});
		
		jQuery('a#navigation-right').on( 'click',function(ev){ev.preventDefault();$this.goRight();});
		jQuery('a#navigation-left').on( 'click',function(ev){ev.preventDefault();$this.goLeft();});
		//add listener for Right/Left to +/- 1 images
		if($this.state.pCurr+1<$this.state.totalSlide){
			$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]').on('click',function(){$this.goRight();});
		}
		if($this.state.pCurr-1>=0){
			$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]').on('click',function(){$this.goLeft();});
		}
		//add keyboard support
		jQuery(document).keydown(function(e){
			if(e.keyCode==39) {$this.goRight();}//rignt
			else if(e.keyCode==37){$this.goLeft();}//left
			else if(e.keyCode==27){//esc
				if($this.state.zoomOpen){$this.unsetZoom();}
				//else {jQuery('a#close-goback-button').click();}
			}
		});
		//add mouse wheel support
		$this.wrapper.mousewheel(function(event, delta) {			
			if(!$this.state.zoomOpen&&typeof event.originalEvent.deltaY!="undefined"){
				if(event.originalEvent.deltaY>0){
					$this.state.md.l++;
					if($this.state.md.l%5==0){$this.goLeft();Log('Left Scroll:'+$this.state.md.l+' -> goLeft');}
				}else{
					$this.state.md.r++;
					if($this.state.md.r%5==0){$this.goRight();Log('Right Scroll:'+$this.state.md.r+' -> goRight');}
				}
			}
		});

		//add swipe support
		$this.state.slides.swipe( {
			swipeLeft:function() {$this.goRight();},
			swipeRight:function() {$this.goLeft();},
			tap:function() {
				if(jQuery(this).attr('data-index')==$this.state.pCurr){$this.setZoom();}
			},
		});
		
		//hide control we dont need
		$this.hideUnneededControls();
		
		$this.updateSocialLinks();
		$this.socialLinksContainer.on('click',function(){$this.resetSizeAndPosition();});
		$this.resetSizeAndPosition();
	},
	goLeft:function(){
		var $this=this;
		if($this.state.pCurr-1>=0&&!$this.state.zoomOpen){
			$this.toggleInfo('close');
			var delta=0;
			var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
			var $prev=$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]');			
			delta=($curr.width()/2)+($prev.width()/2);
			$this.state.pCurr--;
			$this.state.sliderMargin=$this.state.sliderMargin - delta;
			$curr.removeClass('current');
			$prev.addClass('current');	//$this.slider.animate({'margin-left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,'linear',function(){
			$this.slider.stop(true,true).animate({'left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,$this.slideAnimation,function(){
				$this.loadImages('prev',1);
				pushUrl($this.imagesData[$this.state.pCurr].pushUrl, $this.imagesData[$this.state.pCurr].slideMetadata.title);
				gap_datalayer.track_gallery($this.imagesData[$this.state.pCurr].pushUrl);
				$this.updateSocialLinks();
				$this.hideUnneededControls();
				//add listener for Right/Left to +/- 2 images
				$this.state.slides.unbind('click').promise().done(function(){
					$this.state.slides.on('click' ,function(e){
						if(jQuery(this).attr('data-index')==$this.state.pCurr){
							$this.setZoom();
						}
					});
					if($this.state.pCurr+1<$this.state.totalSlide){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]').on('click',function(){
							$this.goRight();
						});
						if($this.state.pCurr+2<$this.state.totalSlide){
							$this.slider.find('.slide[data-index="'+($this.state.pCurr+2)+'"]').on('click',function(){
								$this.goRight();
							});
						}
					}
					if($this.state.pCurr-1>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]').on('click',function(){$this.goLeft();});
						if($this.state.pCurr-2>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-2)+'"]').on('click',function(){$this.goLeft();});
						}
					}
				});
				Log($this.state);
			});
		}
	},
	goRight:function(){
		var $this=this;
		if($this.state.pCurr+1<$this.state.totalSlide&&!$this.state.zoomOpen){
			$this.toggleInfo('close');
			var delta=0;
			var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
			var $next=$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]');
			delta=($curr.width()/2)+($next.width()/2);
			$this.state.pCurr++;
			$this.state.sliderMargin=$this.state.sliderMargin + delta;
			$curr.removeClass('current');
			$next.addClass('current');			//$this.slider.animate({'margin-left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,'linear',function(){
			$this.slider.stop(true,true).animate({'left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,$this.slideAnimation,function(){
				$this.loadImages('next',1);
				pushUrl($this.imagesData[$this.state.pCurr].pushUrl, $this.imagesData[$this.state.pCurr].slideMetadata.title);
				gap_datalayer.track_gallery($this.imagesData[$this.state.pCurr].pushUrl);
				$this.updateSocialLinks();
				$this.hideUnneededControls();
				//add listener for Right/Left to +/- 2 images
				$this.state.slides.unbind('click').promise().done(function(){
					$this.state.slides.on('click' ,function(e){
						if(jQuery(this).attr('data-index')==$this.state.pCurr){
							$this.setZoom();
						}
					});
					if($this.state.pCurr+1<$this.state.totalSlide){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]').on('click',function(){
							$this.goRight();
						});
						if($this.state.pCurr+2<$this.state.totalSlide){
							$this.slider.find('.slide[data-index="'+($this.state.pCurr+2)+'"]').on('click',function(){
								$this.goRight();
							});
						}
					}
					if($this.state.pCurr-1>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]').on('click',function(){$this.goLeft();});
						if($this.state.pCurr-2>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-2)+'"]').on('click',function(){$this.goLeft();});
						}
					}
				});
				Log($this.state);
			});
		}
	},
	toggleInfo:function(action){
		var $this=this;
		var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
		if(action=="close"){$curr.removeClass('infoOpen');Log("picSlider->toggleInfo:close");}
		else if(action=="open"){$curr.addClass('infoOpen');Log("picSlider->toggleInfo:open");}
		else if(action=="toggle"){
			if($curr.hasClass('infoOpen')){$curr.removeClass('infoOpen');Log("picSlider->toggleInfo:close");}
			else{$curr.addClass('infoOpen');Log("picSlider->toggleInfo:open");}
		}
	},
	hideUnneededControls:function(){
		var $this=this;
		if($this.state.pCurr==0){jQuery('a#navigation-left').fadeOut($this.fadeTime);
		}else{jQuery('a#navigation-left').fadeIn($this.fadeTime);}
		if($this.state.pCurr==$this.state.totalSlide-1){jQuery('a#navigation-right').fadeOut($this.fadeTime);
		}else{jQuery('a#navigation-right').fadeIn($this.fadeTime);}
	},
	updateSocialLinks:function(){
		var $this=this;
		var encodeurl=encodeURIComponent($this.imagesData[$this.state.pCurr].pushUrl);
		var title=$this.imagesData[$this.state.pCurr].slideMetadata.title;
		var ecodedTitle=encodeURIComponent(title);

		$this.socialLinks.find('span.facebook').parent('a').attr('href' , 'http://www.facebook.com/sharer.php?u='+encodeurl );
		$this.socialLinks.find('span.twitter').parent('a').attr('href' , 'https://twitter.com/intent/tweet?url='+encodeurl+'&amp;text='+ecodedTitle+'&amp;via=dolcegabbana' );
		$this.socialLinks.find('span.pinterest').parent('a').attr('href' , 'http://pinterest.com/pin/create/bookmarklet/?media='+$this.imagesData[$this.state.pCurr].zoomImage.url+'&url='+encodeurl+'&is_video=false&description='+ecodedTitle );
		$this.socialLinks.find('span.googleplus').parent('a').attr('href' , 'https://plus.google.com/share?url='+encodeurl );


		/*		
		$this.socialLinks.find('span.googleplus').parent('a').attr('href','');
		$this.socialLinks.find('span.pinterest').parent('a').attr('href','')
		http://www.facebook.com/sharer.php?u=[uri encoded URL]'
		https://twitter.com/intent/tweet?url=[uri encoded URL]&amp;text=[Title]&amp;via=dolcegabbana'
		http://tumblr.com/share?s=&v=3&t=[Title]&u=[uri encoded URL]
		*/
	},
	loadImages:function(type,num){
		var $this=this;
		if(type=='prev'){
			for(var i=1 ; i <= num ; i++){
				if($this.state.pMin-1 >= 0) {
					$this.state.pMin--;
					var $el=$this.slider.find('.slide[data-index="'+$this.state.pMin+'"]');
					if(!$el.hasClass('loaded')){
						var element=$this.imagesData[$this.state.pMin];
						var haveInfo=false;
						var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
						if(element.slideMetadata.models){
							haveInfo=true;
							info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
						}
						if(element.slideMetadata.credits){
							if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
							haveInfo=true;
							info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
						}
						info+='</div></div>';
						if(!haveInfo){info="";}
						$el.html('<div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" />');
					}
				}
			}
			$this.slider.find('.slide').imagesLoaded(function(){
				var $el=$this.slider.find('.slide>img').parent();
				$el.removeClass('loading');
				$el.addClass('loaded');
				$el.find('img').animate({'opacity':1},$this.fadeTime);
			});
		}else if(type=='next'){
			for(var i=1 ; i <= num ; i++){
				if($this.state.pMax+1 < $this.state.totalSlide) {
					$this.state.pMax++;
					var $el=$this.slider.find('.slide[data-index="'+$this.state.pMax+'"]');
					if(!$el.hasClass('loaded')){
						var element=$this.imagesData[$this.state.pMax];
						var haveInfo=false;
						var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
						if(element.slideMetadata.models){
							haveInfo=true;
							info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
						}
						if(element.slideMetadata.credits){
							if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
							haveInfo=true;
							info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
						}
						info+='</div></div>';
						if(!haveInfo){info="";}
						$el.html('<div class="gallery_img_overlay"></div><img src="'+element.slideImage.url+'" />');
					}
				}
			}
			$this.slider.find('.slide').imagesLoaded(function(){
				var $el=$this.slider.find('.slide>img').parent();
				$el.removeClass('loading');
				$el.addClass('loaded');
				$el.find('img').animate({'opacity':1},$this.fadeTime);
			});
		}
	},
	resetSizeAndPosition:function(){
		var $this=this;
		//var imgH=$this.mainImage.height();
		var wH=jQuery(window).height();
		if($this.isIpad){wH=window.innerHeight;}
		var wW=jQuery(window).width();
		var headerH=jQuery('.gallery-header').height();
		var footerH=$this.socialLinksContainer.height();
		var wrH=wH-(headerH+footerH);
		//fix 18px for ipad (?)
		//if($this.isIpad&&wW>768){wrH=wrH-18;}
		//jQuery('body,#content').css('overflow','hidden');
		$this.wrapper.css('height',wrH);
		$this.slider.find('.slide, .slide > img').css({'height':wrH,'padding-top':'0px'});
		$this.state.sliderMargin=0;
		//alert("wh:"+wH+" headerH+:"+headerH+" footerH:"+footerH+" wrH:"+wrH);
		jQuery.each($this.state.slides,function(i,e){
			var $el=jQuery(e);
			var $obj=$this.imagesData[$el.attr('data-index')];
			var w=wrH*$obj.imgRatio;
			w=Math.round(w);
			//image width must be <= of sreeen width
			if(w<=wW){
				$el.width(w);
			}else{
				w=wW;
				$el.width(w);
				var newH=w*$obj.imgRatioReverse;
				$el.css({'height':newH,'padding-top':((wrH-newH)/2)+'px'});
				$el.find('img').height(newH);
			}
			$this.state.sliderWidth+=w;
			if(i<$this.state.pCurr){$this.state.sliderMargin+=w;}
			else if(i==$this.state.pCurr){$this.state.sliderMargin+=w/2;}
		});
		$this.slider.width(picSlider.state.sliderWidth);
		//picSlider.slider.animate({'margin-left':(-1*$this.state.sliderMargin)+(wW/2)},$this.slideTime,'linear');
		//picSlider.slider.css('margin-left',(-1*$this.state.sliderMargin)+(wW/2));
		picSlider.slider.css('left',(-1*$this.state.sliderMargin)+(wW/2));
	},
	resetSizeAndPositionMobile:function(){//here for retrocompatibility only
		return;
	},
	setZoom:function(){
		var $this=this;
		if(isTablet){
			$this.zoomContent.parent().css('background-position',(jQuery(window).width()/2 -15)+'px '+(jQuery(window).height()/2 -15)+'px');
		}
		$this.zoomContent.html('<img src="'+$this.imagesData[$this.state.pCurr].zoomImage.url+'"/>');
		$this.zoomImage=$this.zoomContent.find('img');
		$this.zoomWrapper.fadeIn($this.fadeTime);
		$this.zoomContent.imagesLoaded(function(){
			
			if(!isTablet){
				$this.zoomImage.css('top',0);//-1*jQuery(window).height()/2);
				$this.zoomImage.on('click',function(){$this.unsetZoom();});
			}else{
				$this.zoomImage.css('top','');
				jQuery('html').addClass('popupOpen');
			}
			$this.zoomImage.animate({'opacity':1},$this.fadeTime,function(){
				$this.state.zoomOpen=true;
				if(!isTablet){
					$this.zoomWrapper.mousemove(function(e) {
						var ph=jQuery(window).height();
						var ih=$this.zoomImage.height();
						var top=-1*((ih-ph)/ph)*e.pageY;
						/*Log('Y:'+e.pageY);Log('ph:'+ph);Log('ih:'+ih);Log('top:'+top);Log('-----------------');*/
						$this.zoomImage.css('top',top+"px");
					});
				}
			});
		});

	},
	unsetZoom:function(){
		var $this=this;
		$this.zoomWrapper.fadeOut($this.fadeTime,function(){
			jQuery('html').removeClass('popupOpen');
			$this.state.zoomOpen=false;
			$this.zoomContent.html('');
			$this.zoomImage=null;
			if(isTablet){setTimeout(function(){$this.resetSizeAndPosition()},800);}
		});
	}
};


var mobPicSlider={
	
	imagesData:null,
	slider:null,
	wrapper:null,
	socialLinksContainer:null,
	socialLinks:null,
	arrows:null,
	mobileZoomIn:null,
	mobileZoomOut:null,
	zoomWrapper:null,
	zoomContent:null,
	zoomImage:null,
	arrowsSize:100,
	slideTime:550,
	fadeTime:500,
	preChargeImagesMobile:2,	
	slideAnimation:'swing',
	showInfoButton:null,
	state:new Object({
		currentSlide:null,
		prevSlides:new Array(),
		prevSlidesWith:0,
		totalSlide:null,
		pCurr:0,
		pMin:0,
		pMax:0,
		rv:null,
		rh:null,
		slides:null,
		sliderWidth:0,
		sliderMargin:0,
		zoomOpen:false
	}),
	shareBar:{
		barWrapper:null,
		barInner:null,
		openButton:null,
		closeButton:null
	},
	init:function(jsonData){
		var $this=this;
		//get the data
		$this.imagesData=jQuery(jsonData);
		Log('Mobile Init -> mobPicSlider');
		//set the variables
		jQuery('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');

		$this.state.totalSlide=$this.imagesData.length;
		$this.socialLinks=jQuery('#pic-slider-mob-shareBarInner');
		$this.arrows=jQuery('div.arrow-right, div.arrow-left');
		$this.arrowsSize=jQuery('#navigation-left').width()*2;
		$this.wrapper=jQuery('#pic-slider');
		$this.slider=$this.wrapper.find('#slider');
		$this.zoomWrapper=jQuery('#overlay-popup');
		$this.zoomContent=jQuery('#overlay-popup-content');
		$this.showInfoButton=jQuery('#pic-slider-mob-showInfo');
		
		//find the slide to start
		$this.imagesData.each(function(index, element) {
            if(element.startWithMe) {
				var _id='';
				for(var i=0 ; i < index ; i++){
					_id='slide_'+$this.imagesData[i].slide_unique_id;
					$this.slider.append('<div id="'+_id+'" class="slide '+$this.imagesData[i].slideType+' loading" data-index="'+i+'" style=""></div>');
				}
				_id='slide_'+element.slide_unique_id;
				var haveInfo=false;
				var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
				if(element.slideMetadata.models){
					haveInfo=true;
					info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
				}
				if(element.slideMetadata.credits){
					if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
					haveInfo=true;
					info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
				}
				info+='</div><div class="pic-slider-mob-infoCloseButton mobileonly mobileButtons onlyForInfo"><span>&nbsp;</span></div></div>';
				if(!haveInfo){info="";}				
				$this.slider.append('<div id="'+_id+'" class="slide '+element.slideType+' current loading" data-index="'+index+'"><div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" /></div>');
				$this.state.currentSlide=_id;
				for(var i=index+1 ; i< $this.state.totalSlide ; i++){
					_id='slide_'+$this.imagesData[i].slide_unique_id;
					$this.slider.append('<div id="'+_id+'" class="slide '+$this.imagesData[i].slideType+' loading" data-index="'+i+'"></div>');
				}
				$this.state.pCurr=index;
				$this.state.pMin=index;
				$this.state.pMax=index;
				$this.loadImages('prev',$this.preChargeImagesMobile);
				$this.loadImages('next',$this.preChargeImagesMobile);
			}
        });
		$this.slider.find('.slide.current').imagesLoaded(function(){
			$this.slider.find('.slide.current img').animate({'opacity':1},$this.fadeTime,function(){
				$this.slider.find('.slide.current').removeClass('loading');
				$this.slider.find('.slide.current').addClass('loaded');
			});
		});
		
		$this.state.slides=$this.slider.find('.slide');
		
		$this.updateSocialLinks();
		$this.resetSizeAndPosition();
		jQuery(window).resize( function(){ $this.resetSizeAndPosition(); });
		
		jQuery('#pic-slider-mob-zoomButton').on('click' ,function(e){$this.setZoom();});
		$this.zoomWrapper.find('#popup-close-button').on('click' ,function(e){ $this.unsetZoom();});
		
		jQuery('a#navigation-right').on( 'click',function(ev){ev.preventDefault();$this.goRight();});
		jQuery('a#navigation-left').on( 'click',function(ev){ev.preventDefault();$this.goLeft();});
				
		//add swipe support
		$this.wrapper.swipe( {
			swipeLeft:function(){$this.goRight();},
			swipeRight:function(){$this.goLeft();}
		});
		
		//share bar
		$this.shareBar.barWrapper=jQuery('#pic-slider-mob-shareBarWrapper');
		$this.shareBar.barInner=$this.shareBar.barWrapper.find('#pic-slider-mob-shareBarInner');
		$this.shareBar.openButton=$this.shareBar.barWrapper.find('#pic-slider-mob-shareOpenButton');
		$this.shareBar.closeButton=$this.shareBar.barWrapper.find('#pic-slider-mob-shareCloseButton');
		$this.showInfoButton.on('click',function(e){
			e.preventDefault();
			$this.toggleInfo('toggle');
		});
		$this.shareBar.openButton.on('click',function(e){
			e.preventDefault();
			$this.shareBar.openButton.fadeOut($this.fadeTime);
			$this.shareBar.barInner.css({'width':0,'display':'block'});
			$this.showInfoButton.fadeOut($this.fadeTime);
			$this.shareBar.barInner.animate({'width':jQuery(window).width()},$this.slideTime,function(){
				$this.socialLinks.find('a>span').fadeIn($this.fadeTime);
				$this.shareBar.closeButton.find('span').fadeIn($this.fadeTime);
			});
		});
		$this.shareBar.closeButton.on('click',function(e){
			e.preventDefault();
			$this.socialLinks.find('a>span').fadeOut($this.fadeTime);
			$this.shareBar.closeButton.find('span').fadeOut($this.fadeTime);
			$this.shareBar.barInner.animate({'width':0},$this.slideTime,function(){
				$this.shareBar.barInner.hide();
				$this.shareBar.openButton.fadeIn($this.fadeTime);
				$this.showInfoButton.fadeIn($this.fadeTime);
			});
		});
		$this.toggleInfo('JUST_TO_HIDE_INFOBUTTON_IF_NO_INFO');
	},
	goLeft:function(){
		var $this=this;
		if($this.state.pCurr-1>=0){
			$this.toggleInfo('close');
			var delta=0;
			var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
			var $prev=$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]');
			delta=($curr.width()/2)+($prev.width()/2);
			$this.state.pCurr--;
			$this.state.sliderMargin=$this.state.sliderMargin - delta;
			$curr.removeClass('current');
			$prev.addClass('current');
			//$this.slider.animate({'margin-left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,'linear',function(){
			$this.slider.animate({'left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,$this.slideAnimation,function(){
				$this.loadImages('prev',1);
				pushUrl($this.imagesData[$this.state.pCurr].pushUrl, $this.imagesData[$this.state.pCurr].slideMetadata.title);
				$this.toggleInfo('JUST_TO_HIDE_INFOBUTTON_IF_NO_INFO');
				gap_datalayer.track_gallery($this.imagesData[$this.state.pCurr].pushUrl);
				$this.updateSocialLinks();
			});
		}
	},
	goRight:function(){
		var $this=this;
		if($this.state.pCurr+1<$this.state.totalSlide){
			$this.toggleInfo('close');
			var delta=0;
			var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
			var $succ=$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]');
			delta=($curr.width()/2)+($succ.width()/2);
			$this.state.pCurr++;
			$this.state.sliderMargin=$this.state.sliderMargin + delta;
			$curr.removeClass('current');
			$succ.addClass('current');
//$this.slider.animate({'margin-left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,'linear',function(){
			$this.slider.animate({'left':(-1*$this.state.sliderMargin)+(jQuery(window).width()/2)},$this.slideTime,$this.slideAnimation,function(){
				$this.loadImages('next',1);
				pushUrl($this.imagesData[$this.state.pCurr].pushUrl, $this.imagesData[$this.state.pCurr].slideMetadata.title);
				$this.toggleInfo('JUST_TO_HIDE_INFOBUTTON_IF_NO_INFO');
				gap_datalayer.track_gallery($this.imagesData[$this.state.pCurr].pushUrl);
				$this.updateSocialLinks();
			});
		}
	},
	toggleInfo:function(action){
		var $this=this;
		var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
		var $infoWrapper=$curr.find('.gallery_info_overlay');
		var $infoContent=$curr.find('.gallery_info_overlay .infoWrapper');
		var $closeButton=$curr.find('.gallery_info_overlay .pic-slider-mob-infoCloseButton');
		if(typeof $closeButton!="undefined"&&$closeButton.length>0){
			//do my job only if we have info to show
			//in case showInfoButton is hidden must show it
			$this.showInfoButton.fadeIn(300);
			if(action=="close"){
				Log("mobPicSlider->toggleInfo:close");
				$infoContent.fadeOut($this.fadeTime,function(){
					$infoWrapper.animate({'width':0},$this.slideTime,function(){
						$curr.removeClass('infoOpen');
						$this.showInfoButton.removeClass('infoOpen');
						$this.shareBar.openButton.fadeIn($this.fadeTime);
					});
				})
			}else if(action=="open"){
				Log("mobPicSlider->toggleInfo:open");
				$curr.addClass('infoOpen');
				$this.showInfoButton.addClass('infoOpen');
				$this.shareBar.openButton.fadeOut($this.fadeTime);
				$infoWrapper.animate({'width':jQuery(window).innerWidth()},$this.slideTime,function(){
					var mt=($infoWrapper.innerHeight()-$infoContent.innerHeight())/2;
					$infoContent.css('margin-top',mt).fadeIn($this.fadeTime);
					$closeButton.swipe({
						tap:function(event,target){$this.toggleInfo('close');}
					});
				});
			}else if(action=="toggle"){
				if($curr.hasClass('infoOpen')){
					Log("mobPicSlider->toggleInfo:toggle-close");
					$this.shareBar.openButton.fadeOut($this.fadeTime);
					$infoContent.fadeOut($this.fadeTime,function(){
						$infoWrapper.animate({'width':0},$this.slideTime,function(){
							$curr.removeClass('infoOpen');
							$this.showInfoButton.removeClass('infoOpen');
						});
					})
				}else{
					Log("mobPicSlider->toggleInfo:toggle-open");
					$curr.addClass('infoOpen');
					$this.showInfoButton.addClass('infoOpen');
					Log($infoWrapper);
					$this.shareBar.openButton.fadeOut($this.fadeTime);
					$infoWrapper.animate({'width':jQuery(window).innerWidth()},$this.slideTime,function(){
						var mt=($infoWrapper.innerHeight()-$infoContent.innerHeight())/2;
						$infoContent.css('margin-top',mt).fadeIn($this.fadeTime);
						$closeButton.swipe({
							tap:function(event,target){$this.toggleInfo('close');}
						});
					});
				}
			}
		}else{
			//i have no info to show, so hide the info icon
			$this.showInfoButton.fadeOut(300);
		}
	},
	updateSocialLinks:function(){
		var $this=this;
		Log('Changing Sharers');
		var encodeurl=encodeURIComponent($this.imagesData[$this.state.pCurr].pushUrl);
		var title=$this.imagesData[$this.state.pCurr].slideMetadata.title;
                var ecodedTitle=encodeURIComponent(title);

		$this.socialLinks.find('span.facebook').parent('a').attr('href','http://www.facebook.com/sharer.php?u='+encodeurl );
		$this.socialLinks.find('span.tumblr').parent('a').attr('href','http://tumblr.com/share?s=&v=3&t='+title+'&u='+encodeurl );
		$this.socialLinks.find('span.twitter').parent('a').attr('href','https://twitter.com/intent/tweet?url='+encodeurl+'&amp;text='+ecodedTitle+'&amp;via=dolcegabbana' );
		$this.socialLinks.find('span.google').parent('a').attr('href','https://plus.google.com/share?url='+encodeurl );
		$this.socialLinks.find('span.pinterest').parent('a').attr('href' , 'http://pinterest.com/pin/create/bookmarklet/?media='+$this.imagesData[$this.state.pCurr].zoomImage.url+'&url='+encodeurl+'&is_video=false&description='+ecodedTitle )
		/*
		http://www.facebook.com/sharer.php?u=[uri encoded URL]'
		https://twitter.com/intent/tweet?url=[uri encoded URL]&amp;text=[Title]&amp;via=dolcegabbana'
		http://tumblr.com/share?s=&v=3&t=[Title]&u=[uri encoded URL]
		https://plus.google.com/share?url=[URL]
		http://pinterest.com/pin/create/bookmarklet/?media=[MEDIA]&url=[URL]&is_video=false&description=[TITLE]
		*/
	},
	loadImages:function(type,num){
		var $this=this;
		if(type=='prev'){
			for(var i=1 ; i <= num ; i++){
				if($this.state.pMin-1 >= 0) {
					$this.state.pMin--;
					var $el=$this.slider.find('.slide[data-index="'+$this.state.pMin+'"]');
					if(!$el.hasClass('loaded')){
						var element=$this.imagesData[$this.state.pMin];
						var haveInfo=false;
						var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
						if(element.slideMetadata.models){
							haveInfo=true;
							info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
						}
						if(element.slideMetadata.credits){
							if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
							haveInfo=true;
							info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
						}
						info+='</div><div class="pic-slider-mob-infoCloseButton mobileonly mobileButtons onlyForInfo"><span>&nbsp;</span></div></div>';
						if(!haveInfo){info="";}				
						$el.html('<div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" />');
					}
				}
			}
			$this.slider.find('.slide').imagesLoaded(function(){
				var $el=$this.slider.find('.slide>img').parent();
				$el.removeClass('loading');
				$el.addClass('loaded');
				$el.find('img').animate({'opacity':1},$this.fadeTime);
			});
		}else if(type=='next'){
			for(var i=1 ; i <= num ; i++){
				if($this.state.pMax+1 < $this.state.totalSlide) {
					$this.state.pMax++;
					var $el=$this.slider.find('.slide[data-index="'+$this.state.pMax+'"]');
					if(!$el.hasClass('loaded')){
						var element=$this.imagesData[$this.state.pMax];
						var haveInfo=false;
						var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
						if(element.slideMetadata.models){
							haveInfo=true;
							info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
						}
						if(element.slideMetadata.credits){
							if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
							haveInfo=true;
							info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
						}
						info+='</div><div class="pic-slider-mob-infoCloseButton mobileonly mobileButtons onlyForInfo"><span>&nbsp;</span></div></div>';
						if(!haveInfo){info="";}				
						$el.html('<div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" />');
					}
				}
			}
			$this.slider.find('.slide').imagesLoaded(function(){
				var $el=$this.slider.find('.slide>img').parent();
				$el.removeClass('loading');
				$el.addClass('loaded');
				$el.find('img').animate({'opacity':1},$this.fadeTime);
			});
		}
	},
	resetSizeAndPosition:function(){
		var $this=this;
		//var imgH=$this.mainImage.height();
		var wH=jQuery(window).innerHeight();
		var wW=jQuery(window).innerWidth();
		$this.wrapper.css('height' , wH);
		$this.slider.find('.slide,.slide > img').css({'height':wH,'padding-top':'0px'});
		$this.state.sliderMargin=0;
		jQuery.each($this.state.slides , function(i,e){
			var $el=jQuery(e);
			var $obj=$this.imagesData[$el.attr('data-index')];
			var w=wH*$obj.imgRatio;
			w=Math.round(w);
			//image width must be <= of sreeen width
			if(w <= wW){
				$el.width(w);
			} else {
				w=wW;
				$el.width(w);
				var newH=w*$obj.imgRatioReverse;
				$el.css({'height':newH,'padding-top':((wH-newH)/2)+'px'});
				$el.find('img').height(newH);
			}
			$this.state.sliderWidth+=w;
			if(i<$this.state.pCurr){$this.state.sliderMargin+=w;}
			else if(i==$this.state.pCurr){$this.state.sliderMargin+=w/2;}
		});
		$this.slider.width($this.state.sliderWidth);
		//picSlider.slider.animate({'margin-left':(-1*$this.state.sliderMargin)+(wW/2)},$this.slideTime,'linear');
		//$this.slider.css('margin-left',(-1*$this.state.sliderMargin)+(wW/2));
		$this.slider.css('left',(-1*$this.state.sliderMargin)+(wW/2));
	},
	setZoom:function(){
		var $this=this;
		$this.zoomContent.parent().css('background-position',(jQuery(window).width()/2 -15)+'px '+(jQuery(window).height()/2 -15)+'px');
		$this.zoomContent.html('<img src="'+$this.imagesData[$this.state.pCurr].zoomImage.url+'"/>');
		$this.zoomImage=$this.zoomContent.find('img');
		
		$this.zoomWrapper.fadeIn($this.fadeTime);
		$this.zoomContent.imagesLoaded(function(){
			$this.zoomImage.on('click',function(){$this.unsetZoom();});
			$this.zoomImage.css('top','');
			jQuery('html').addClass('popupOpen');
			$this.zoomImage.animate({'opacity':1},$this.fadeTime,function(){
				$this.state.zoomOpen=true;
			});
		});

	},
	unsetZoom:function(){
		var $this=this;
		$this.zoomWrapper.hide();
		$this.zoomContent.html('');
		jQuery('html').removeClass('popupOpen');
		//$this.resetSizeAndPosition();
		$this.state.zoomOpen=false;
		$this.zoomImage=null;
		setTimeout(function(){$this.resetSizeAndPosition()},800);
	}
};






//GAP DATALAYER FUNCS

var gap_datalayer={
    init:function(){
            var $this=this;
            $this.socialTop();
			$this.social_share();
    },
    socialTop:function(){
        var $this=this;
        var $btns=jQuery('#sharelink a.social');
        $btns.bind('click',function(e){
            var sname=jQuery(this).attr('data-id');
            var elURL=jQuery(this).attr('href');
            //Log("sname="+$this.getSocialName(sname)+" elURL="+elURL);
            dataLayer.push({'event':'social', 'socialNetwork':$this.getSocialName(sname), 'socialAction':'visit', 'socialTarget':elURL });
        });

    },
    social_share:function(){
		var $this=this;
		//for normal sharer
        var $btns=jQuery('#shares-gallery #scrolling-shares, #overlay-popup-social').find('a');
		$btns.on('click',function(e){
			var socialNetworkName=$this.getSocialShareName(jQuery(this).attr('data-social_id'));
			var elURL=window.location.href;
			//Log("elURL="+elURL+" socialNetworkName="+socialNetworkName);
			dataLayer.push({'event':'social', 'socialNetwork':socialNetworkName, 'socialAction':'share', 'socialTarget':elURL });
		});
		
        var $btns2=jQuery('div.social-share-cont').find('a.overlay-sharer');
		$btns2.on('click',function(e){
			var socialNetworkName=$this.getSocialShareName(jQuery(this).attr('data-social_id'));
			var elURL=jQuery(this).attr('data-href');
			//Log("elURL="+elURL+" socialNetworkName="+socialNetworkName);
			dataLayer.push({'event':'social', 'socialNetwork':socialNetworkName, 'socialAction':'share', 'socialTarget':elURL });
		});
		
    },
	track_single_social_share:function(socialNetworkName,elURL){
		dataLayer.push({'event':'social', 'socialNetwork':socialNetworkName, 'socialAction':'share', 'socialTarget':elURL });
	},
	track_single_social_visit:function(socialNetworkName,elURL){
		dataLayer.push({'event':'social', 'socialNetwork':socialNetworkName, 'socialAction':'visit', 'socialTarget':elURL });
	},
    track_video:function(videoUrl){
        //Log("videoUrl="+videoUrl);
        dataLayer.push({'event':'video', 'eventCategory':'video', 'eventAction':'open', 'eventLabel':videoUrl});
    },
	track_stream:function(label) {
		 dataLayer.push({'event':'video', 'eventCategory':'video', 'eventAction':'open', 'eventLabel':label});
		 dataLayer.push({'event':'video-streaming'});
	},
    track_gallery:function(path){
		//dataLayer.push({'event':'gallery', 'eventLabel':path});
    },

	track_filter:function(filtername){
		dataLayer.push({'event':'contentfilter', 'value':filtername });
	},
    infinite_scroll:function(){
        //Log("scrolling");
        //dataLayer.push({'event':'scrolling'});
    },
    getSocialName:function (el) {
        var typeSocial='';
        switch (el) {
            case 'int_tw':typeSocial='twitter';
                break;
            case 'mint_tw':typeSocial='twitter';
                break;
            case 'int_fb':typeSocial='facebook';
                break;
            case 'mint_fb':typeSocial='facebook';
                break;
            case 'int_yt':typeSocial='youtube';
                break;
            case 'mint_yt':typeSocial='youtube';
                break;
            case 'int_vimeo':typeSocial='vimeo';
                break;
            case 'mint_vimeo':typeSocial='vimeo';
                break;
            case 'int_instagram':typeSocial='instagram';
                break;
            case 'mint_instagram':typeSocial='instagram';
                break;
            case 'int_tumbler':typeSocial='tumblr';
                break;
            case 'mint_tumbler':typeSocial='tumblr';
                break;
            case 'int_podcast':typeSocial='podcast';
                break;
            case 'mint_podcast':typeSocial='podcast';
                break;
            case 'int_pinterest':typeSocial='pinterest';
                break;
            case 'mint_pinterest':typeSocial='pinterest';
                break;
            case 'int_gplus':typeSocial='googleplus';
                break;
            case 'mint_gplus':typeSocial='googleplus';
                break;
            case 'ch_kaixin':typeSocial='kaixin';
                break;
            case 'mch_kaixin':typeSocial='kaixin';
                break;
            case 'ch_weibo':typeSocial='weibo';
                break;
            case 'mch_weibo':typeSocial='weibo';
                break;
			case 'int_tudou':typeSocial='tudou';
				break;
            case 'ru_vkont':typeSocial='vkontakte';
                break;
            case 'mu_vkont':typeSocial='vkontakte';
                break;
            case 'ru_odno':typeSocial='odnoklassniki';
                break;
            case 'mru_odno':typeSocial='odnoklassniki';
                break;
            case 'ru_lj':typeSocial='livejournal';
                break;
            case 'mru_lj':typeSocial='livejournal';
                break;
        }

        return typeSocial;

    },
    getSocialShareName:function (el) {
        var typeSocial='';
        switch (el) {
            case 'tw_s':typeSocial='twitter';
                break;
			case 'tw_social_share':typeSocial='twitter';
				break;
			case 'twitter-join':typeSocial='twitter';
				break;
            case 'fb_s':typeSocial='facebook';
                break;
			case 'in_social_share':typeSocial='instagram';
                break;
			case 'instagram-join':typeSocial='instagram';
                break;
            case 'fb_social_share':typeSocial='facebook';
                break;
            case 'facebook-join':typeSocial='facebook';
                break;
            case 'tb_social_share':typeSocial='tumblr';
                break;
            case 'pt_s':typeSocial='pinterest';
                break;
            case 'pn_social_share':typeSocial='pinterest';
                break;
			case 'pt_social_share':typeSocial='pinterest';
			    break;
            case 'go_s':typeSocial='googleplus';
                break;
            case 'gp_social_share':typeSocial='googleplus';
                break;
        }

        return typeSocial;

    }

}




var mobFsPicSlider={
	imagesData:null,
	wrapper:null,
	totalSlide:0,
	fadeTime:500,	
	init:function(jsonData){
		var $this=this;
		jQuery('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');
		//get the data
		$this.imagesData=jQuery(jsonData);
		Log(jsonData);
		//set the variables
		$this.totalSlide=$this.imagesData.length;
		$this.wrapper=jQuery('#pic-slider');
		$this.wrapper.html('');
		//find the slide to start
		$this.imagesData.each(function(index, element) {
			var last=(index==$this.totalSlide-1)?" last":"";
			var number=index+1;
			if(number<10){number='0'+number;}
			$this.wrapper.append('<div id="slide_thumb_'+$this.imagesData[index].slide_unique_id+'" class="slide_thumb '+element.slideType+last+' loading" data-index="'+index+'" onClick="mobFsPicSlider.goToSlide('+index+')"><div class="gallery_img_overlay"><div>'+number+'</div></div><img style="opacity:0" src="'+element.thumbImage.url+'" /></div>').promise().done(function(){
				jQuery('#slide_thumb_'+$this.imagesData[index].slide_unique_id).imagesLoaded(function(){
					jQuery('#slide_thumb_'+$this.imagesData[index].slide_unique_id).find('img').animate({opacity:1},$this.fadeTime);
				});
			});
		});
	},
	goToSlide:function(index){
		var $this=this;
		var _link=$this.imagesData[index].pushUrl;
		if(typeof _link!='undefined'){
			window.location.href=_link;
		}
	}
};


var fsPicSlider={
	
	imagesData:null,
	slider:null,
	wrapper:null,
	thumbLayer:null,
	socialLinksContainer:null,
	socialLinks:null,
	arrows:null,
	zoomWrapper:null,
	zoomContent:null,
	zoomImage:null,
	footer:null,
	header:null,
	arrowsSize:100,
	slideTime:600,
	fadeTime:500,
	headerH:177,
	headerCollH:43,
	slideAnimation:'swing',
	preChargeImages:4,
	preChargeImagesMobile:2,
	hPercent:0.92,
	winWidth:0,
	haveTopVideo:false,
	state:new Object({
		currentSlide:null,
		prevSlides:new Array(),
		prevSlidesWith:0,
		totalSlide:null,
		pCurr:0,
		pMin:0,
		pMax:0,
		rv:null,
		rh:null,
		slides:null,
		sliderWidth:0,
		sliderMargin:0,
		zoomOpen:false,
		md:{l:0,r:0}
	}),
	numeration:{curr:null,tot:null},
	
	init:function(jsonData,haveVideo){
		if(isSmartPhone){mobFsPicSlider.init(jsonData); return; }
		if(isTablet){
			jQuery('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');
		}
		var $this=this;
		$this.winWidth=jQuery(window).width();
		//get the data
		$this.imagesData=jQuery(jsonData);
		Log(jsonData);
		$this.haveTopVideo=haveVideo;
		//IF NO SLIDE HIDE ALL
		if($this.imagesData.length<=0){jQuery('#fsGallery').hide(); return;}
		//set the variables
		$this.header=jQuery('#branding');
		$this.footer=jQuery('#footer');
		$this.state.totalSlide=$this.imagesData.length;
		$this.socialLinksContainer=jQuery('#shares-gallery');
		$this.socialLinks=jQuery('#scrolling-shares');
		$this.arrows=jQuery('div.arrow-right, div.arrow-left');
		$this.arrowsSize=jQuery('#navigation-left').width()*2;
		$this.wrapper=jQuery('#pic-slider');
		$this.slider=$this.wrapper.find('#slider');
		$this.zoomWrapper=jQuery('#overlay-popup');
		$this.zoomContent=jQuery('#overlay-popup-content');
		$this.thumbLayer=jQuery('#fs-pic-slider-thumb-layer');
		$this.thumbWrap=jQuery('#fs-pic-slider-thumb-wrap');
		$this.numeration.curr=jQuery('#pic-slider-counter #pic-slider-counter-curr');
		$this.numeration.tot=jQuery('#pic-slider-counter #pic-slider-counter-tot');
		$this.numeration.tot.html($this.state.totalSlide);
		//find the slide to start
		$this.imagesData.each(function(index, element) {
			if(typeof element.slideImage.wrong!="undefined"){
				Log('Wrong "Slide" image on PID:'+$this.imagesData[index].slide_unique_id+' :'+element.slideImage.wrong);
			}
			if(typeof element.thumbImage.wrong!="undefined"){
				Log('Wrong "Thumb" image on PID:'+$this.imagesData[index].slide_unique_id+' :'+element.thumbImage.wrong);
			}
			if(typeof element.zoomImage.wrong!="undefined"){
				Log('Wrong "Zoom" image on PID:'+$this.imagesData[index].slide_unique_id+' :'+element.zoomImage.wrong);
			}

            if(element.startWithMe) {
				var _id='';
				for(var i=0 ; i < index ; i++){
					_id='slide_'+$this.imagesData[i].slide_unique_id;
					$this.slider.append('<div id="'+_id+'" class="slide '+$this.imagesData[i].slideType+' loading" data-index="'+i+'" style=""></div>');
				}
				_id='slide_'+element.slide_unique_id;
				var haveInfo=false;
				var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
				if(element.slideMetadata.models){
					haveInfo=true;
					info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
				}
				if(element.slideMetadata.credits){
					if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
					haveInfo=true;
					info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
				}
				info+='</div></div>';
				if(!haveInfo){info="";}
				$this.slider.append('<div id="'+_id+'" class="slide '+element.slideType+' current loading" data-index="'+index+'"><div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" /></div>');
				$this.state.currentSlide=_id;
				for(var i=index+1 ; i< $this.state.totalSlide ; i++){
					_id='slide_'+$this.imagesData[i].slide_unique_id;
					$this.slider.append('<div id="'+_id+'" class="slide '+$this.imagesData[i].slideType+' loading" data-index="'+i+'"></div>');
				}
				$this.slider.append('<div class="clear"></div>');
				$this.state.pCurr=index;
				$this.state.pMin=index;
				$this.state.pMax=index;
				if(isTablet){
					$this.loadImages('prev',$this.preChargeImagesMobile);
					$this.loadImages('next',$this.preChargeImagesMobile);
				}else{
					$this.loadImages('prev',$this.preChargeImages);
					$this.loadImages('next',$this.preChargeImages);
				}
			}
			var last=(index==$this.state.totalSlide-1)?" last":"";
			var number=index+1;
			if(number<10){number='0'+number;}
			$this.thumbWrap.append('<div id="slide_thumb'+$this.imagesData[index].slide_unique_id+'" class="slide_thumb '+element.slideType+last+' loading" data-index="'+index+'" onClick="fsPicSlider.closeThumbLayer();fsPicSlider.goToSlide('+index+')"><div class="gallery_img_overlay"><div>'+number+'</div></div><img src="'+element.thumbImage.url+'" /></div>');
        });
		$this.slider.find('.slide.current').imagesLoaded(function(){
			$this.slider.find('.slide.current img').animate({'opacity':1},$this.fadeTime,function(){
				$this.slider.find('.slide.current').removeClass('loading').addClass('loaded');
			});
		});
		$this.state.slides=$this.slider.find('.slide');
		
		//thumb overlay layer
		jQuery('#pic-slider-showThumbs').on('click',function(){
			$this.openThumbLayer();
		});
		jQuery('#pic-slider-showInfo').on('click',function(){
			$this.toggleInfo('toggle');
		});
		$this.thumbLayer.find('#fs-pic-slider-thumb-layer-close').on('click',function(){
			$this.closeThumbLayer();
		});
		
		$this.resetSizeAndPosition();
		jQuery(window).resize( function(){
			$this.winWidth=jQuery(window).width();
			$this.resetSizeAndPosition();
		});
		$this.thumbWrap.customScrollbar({updateOnWindowResize:true});
		
		$this.socialLinksContainer.on('click',function(e){$this.resetSizeAndPosition();});
		$this.state.slides.on('click',function(e){
			if(jQuery(this).attr('data-index')==$this.state.pCurr){
				$this.setZoom();
			}
		});

		$this.zoomWrapper.find('#popup-close-button').on('click' ,function(e){ $this.unsetZoom();});
		
		jQuery('a#navigation-right').on( 'click',function(ev){ev.preventDefault();$this.goRight();});
		jQuery('a#navigation-left').on( 'click',function(ev){ev.preventDefault();$this.goLeft();});
		//add listener for Right/Left to +/- 1 images
		if($this.state.pCurr+1<$this.state.totalSlide){
			$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]').on('click',function(){$this.goRight();});
		}
		if($this.state.pCurr-1>=0){
			$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]').on('click',function(){$this.goLeft();});
		}

		//add keyboard support
		jQuery(document).keydown(function(e){
			if(e.keyCode== 39) {$this.goRight();}//rignt
			else if(e.keyCode== 37){$this.goLeft();}//left
			else if(e.keyCode== 27){//esc
				if($this.state.zoomOpen){$this.unsetZoom();}
				//else {jQuery('a#close-goback-button').click();}
			}
		});
		
		//add swipe support
		$this.state.slides.swipe( {
			swipeLeft:function() {$this.goRight();},
			swipeRight:function() {$this.goLeft();},
			tap:function() {
				if(jQuery(this).attr('data-index')==$this.state.pCurr){$this.setZoom();}
			},
		});
		
		//hide control we dont need
		$this.hideUnneededControls();
		$this.toggleInfo('JUST_FOR_ENABLE_OR_DISABLE_INFOBUTTON_HOVER');
		$this.socialLinksContainer.on('click',function(){$this.resetSizeAndPosition();});
		$this.resetSizeAndPosition();
		
		//check url for slide param
		var urlParam=document.URL.substr(document.URL.lastIndexOf('#')+1);
		if(typeof urlParam!="undefined"&&urlParam!=document.URL){
			Log('urlParam: '+urlParam);
			var i=0;
			var foundParam=false;
			while(!foundParam&&i<$this.imagesData.length){
				if($this.imagesData[i].slide_name==urlParam){
					//go to selected slide
					foundParam=true;
					$this.goToSlide(i);
					pushUrl(currentPage.url,currentPage.title);
				}
				i++;
			}
		};
		
		$this.wrapper.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
			if(isInView){ //element is now visible in the viewport
				if(visiblePartY=='top'){
				}else if(visiblePartY=='bottom'){
				}else{
					/*whole part of element is visible*/
					block_videoplayer.pauseTheVideo();
				}
			}else{
				//element has gone out of viewport
			}
		});
		$this.updateSocialLinks();
	},
	goToSlide:function(slideNumber){
		var $this=this;
		slideNumber=parseInt(slideNumber);
		if(slideNumber!=$this.state.pCurr){
			//find the slide to start
			var $currSlide=jQuery('#'+$this.state.currentSlide);
			$this.toggleInfo('close');
			var delta=0;
			var before=slideNumber<$this.state.pCurr;
			$this.imagesData.each(function(index,element){
				delta+=jQuery($this.state.slides[index]).width();
				if(element.slideNumber==slideNumber){
					if(index+1<$this.state.totalSlide){
						delta+=jQuery($this.state.slides[index+1]).width();
					}
					if(before){
						$this.state.sliderMargin=$this.state.sliderMargin-delta;
						Log('before - '+$this.state.sliderMargin);
					}else{
						$this.state.sliderMargin=$this.state.sliderMargin+delta;
						Log('after - '+$this.state.sliderMargin);
					}
					var _id='';
					_id='slide_'+element.slide_unique_id;
					var $newCurrSlide=jQuery('#'+_id);
					if(!$newCurrSlide.hasClass('loaded')){
						var haveInfo=false;
						var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
						if(element.slideMetadata.models){
							haveInfo=true;
							info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
						}
						if(element.slideMetadata.credits){
							if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
							haveInfo=true;
							info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
						}
						info+='</div></div>';
						if(!haveInfo){info="";}
						$newCurrSlide.html('<div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" />');
						$newCurrSlide.removeClass('loading').addClass('loaded');
					}
					$currSlide.removeClass('current');
					$newCurrSlide.addClass('current');
					
					$this.state.currentSlide=_id;
					$this.state.pCurr=index;
					$this.state.pMin=index;
					$this.state.pMax=index;
					
					if(isTablet){
						$this.loadImages('prev',$this.preChargeImagesMobile);
						$this.loadImages('next',$this.preChargeImagesMobile);
					}else{
						$this.loadImages('prev',$this.preChargeImages);
						$this.loadImages('next',$this.preChargeImages);
					}
					
					$this.slider.stop(true,true).animate({'left':(-1*$this.state.sliderMargin)+($this.wrapper.width())},$this.slideTime,$this.slideAnimation,function(){
						//pushUrl($this.imagesData[$this.state.pCurr].pushUrl, $this.imagesData[$this.state.pCurr].slideMetadata.title);
						gap_datalayer.track_gallery($this.imagesData[$this.state.pCurr].pushUrl);
						$this.updateSocialLinks();
						$this.hideUnneededControls();
						$this.resetSizeAndPosition();
						//add listener for Right/Left to +/- 2 images
						$this.state.slides.unbind('click').promise().done(function(){
							$this.state.slides.on('click',function(e){
								if(jQuery(this).attr('data-index')==$this.state.pCurr){
									$this.setZoom();
								}
							});
							if($this.state.pCurr+1<$this.state.totalSlide){
								$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]').on('click',function(){
									$this.goRight();
								});
								if($this.state.pCurr+2<$this.state.totalSlide){
									$this.slider.find('.slide[data-index="'+($this.state.pCurr+2)+'"]').on('click',function(){										
										$this.goRight();
									});
								}
							}
							if($this.state.pCurr-1>=0){
								$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]').on('click',function(){$this.goLeft();});
								if($this.state.pCurr-2>=0){
								$this.slider.find('.slide[data-index="'+($this.state.pCurr-2)+'"]').on('click',function(){$this.goLeft();});
								}
							}
						});
					});
					$this.toggleInfo('JUST_FOR_ENABLE_OR_DISABLE_INFOBUTTON_HOVER');
					setTimeout(function(){
						jQuery.scrollTo( jQuery('#fsGallery'),600,{
							offset:0,axis:'y',
							onAfter:function(){}
						});
					},800);
				}
			});
		}
	},
	goLeft:function(){
		var $this=this;
		if($this.state.pCurr-1>=0&&!$this.state.zoomOpen){
			$this.toggleInfo('close');
			var delta=0;
			var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
			var $prev=$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]');			
			delta=($curr.width()/2)+($prev.width()/2);
			$this.state.pCurr--;
			$this.state.sliderMargin=$this.state.sliderMargin - delta;
			//Log($this.state.sliderMargin);
			$curr.removeClass('current');
			$prev.addClass('current');
			$this.slider.stop(true,true).animate({'left':(-1*$this.state.sliderMargin)+($this.wrapper.width()/2)},$this.slideTime,$this.slideAnimation,function(){
				$this.loadImages('prev',1);
				//pushUrl($this.imagesData[$this.state.pCurr].pushUrl, $this.imagesData[$this.state.pCurr].slideMetadata.title);
				gap_datalayer.track_gallery($this.imagesData[$this.state.pCurr].pushUrl);
				$this.hideUnneededControls();
				$this.state.currentSlide=$prev.attr('id');
				$this.updateSocialLinks();
				$this.toggleInfo('JUST_FOR_ENABLE_OR_DISABLE_INFOBUTTON_HOVER');
				//add listener for Right/Left to +/- 2 images
				$this.state.slides.unbind('click').promise().done(function(){
					$this.state.slides.on('click',function(e){
						if(jQuery(this).attr('data-index')==$this.state.pCurr){
							$this.setZoom();
						}
					});
					if($this.state.pCurr+1<$this.state.totalSlide){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]').on('click',function(){
							$this.goRight();
						});
						if($this.state.pCurr+2<$this.state.totalSlide){
							$this.slider.find('.slide[data-index="'+($this.state.pCurr+2)+'"]').on('click',function(){
								$this.goRight();
							});
						}
					}
					if($this.state.pCurr-1>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]').on('click',function(){$this.goLeft();});
						if($this.state.pCurr-2>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-2)+'"]').on('click',function(){$this.goLeft();});
						}
					}
				});
				Log($this.state);
			});
		}
	},
	goRight:function(){
		var $this=this;
		if($this.state.pCurr+1<$this.state.totalSlide&&!$this.state.zoomOpen){
			$this.toggleInfo('close');
			var delta=0;
			var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
			var $next=$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]');
			delta=($curr.width()/2)+($next.width()/2);
			$this.state.pCurr++;
			$this.state.sliderMargin=$this.state.sliderMargin + delta;
			//Log($this.state.sliderMargin);
			$curr.removeClass('current');
			$next.addClass('current');
			
			$this.slider.stop(true,true).animate({'left':(-1*$this.state.sliderMargin)+($this.wrapper.width()/2)},$this.slideTime,$this.slideAnimation,function(){
				$this.loadImages('next',1);
				//pushUrl($this.imagesData[$this.state.pCurr].pushUrl, $this.imagesData[$this.state.pCurr].slideMetadata.title);
				gap_datalayer.track_gallery($this.imagesData[$this.state.pCurr].pushUrl);
				$this.hideUnneededControls();
				$this.state.currentSlide=$next.attr('id');
				$this.updateSocialLinks();
				$this.toggleInfo('JUST_FOR_ENABLE_OR_DISABLE_INFOBUTTON_HOVER');
				//add listener for Right/Left to +/- 2 images
				$this.state.slides.unbind('click').promise().done(function(){
					$this.state.slides.on('click',function(e){
						if(jQuery(this).attr('data-index')==$this.state.pCurr){
							$this.setZoom();
						}
					});
					if($this.state.pCurr+1<$this.state.totalSlide){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr+1)+'"]').on('click',function(){
							$this.goRight();
						});
						if($this.state.pCurr+2<$this.state.totalSlide){
							$this.slider.find('.slide[data-index="'+($this.state.pCurr+2)+'"]').on('click',function(){
								$this.goRight();
							});
						}
					}
					if($this.state.pCurr-1>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-1)+'"]').on('click',function(){$this.goLeft();});
						if($this.state.pCurr-2>=0){
						$this.slider.find('.slide[data-index="'+($this.state.pCurr-2)+'"]').on('click',function(){$this.goLeft();});
						}
					}
				});
				Log($this.state);
			});
		}
	},
	hideUnneededControls:function(){
		var $this=this;
		var currNumber=$this.state.pCurr+1;
		
		if(currNumber<10){currNumber="0"+currNumber;}
		$this.numeration.curr.html(currNumber);
		
		if($this.state.pCurr==0){jQuery('a#navigation-left').fadeOut($this.fadeTime);
		}else{jQuery('a#navigation-left').fadeIn($this.fadeTime);}
		if($this.state.pCurr==$this.state.totalSlide-1){jQuery('a#navigation-right').fadeOut($this.fadeTime);
		}else{jQuery('a#navigation-right').fadeIn($this.fadeTime);}
	},
	updateSocialLinks:function(){
		var $this=this;
		var encodeurl=encodeURIComponent($this.imagesData[$this.state.pCurr].pushUrl);
		var title=$this.imagesData[$this.state.pCurr].slideMetadata.title;
		var ecodedTitle=encodeURIComponent(title);
		$this.socialLinks.find('span.facebook').parent('a').attr('href' , 'http://www.facebook.com/sharer.php?u='+encodeurl );
		$this.socialLinks.find('span.twitter').parent('a').attr('href' , 'https://twitter.com/intent/tweet?url='+encodeurl+'&amp;text='+ecodedTitle+'&amp;via=dolcegabbana' );
		$this.socialLinks.find('span.pinterest').parent('a').attr('href' , 'http://pinterest.com/pin/create/bookmarklet/?media='+$this.imagesData[$this.state.pCurr].zoomImage.url+'&url='+encodeurl+'&is_video=false&description='+ecodedTitle );
		$this.socialLinks.find('span.googleplus').parent('a').attr('href' , 'https://plus.google.com/share?url='+encodeurl );
		/*
		var socialW=200;
		var picW=jQuery('#'+$this.state.currentSlide).width();
		if(picW>socialW){socialW=picW;}
		$this.socialLinks.animate({width:socialW},300);
		*/
		/*
		http://www.facebook.com/sharer.php?u=[uri encoded URL]'
		https://twitter.com/intent/tweet?url=[uri encoded URL]&amp;text=[Title]&amp;via=dolcegabbana'
		http://tumblr.com/share?s=&v=3&t=[Title]&u=[uri encoded URL]
		https://plus.google.com/share?url=[URL]
		http://pinterest.com/pin/create/bookmarklet/?media=[MEDIA]&url=[URL]&is_video=false&description=[TITLE]
		*/
	},
	loadImages:function(type,num){
		var $this=this;
		if(type=='prev'){
			for(var i=1 ; i <= num ; i++){
				if($this.state.pMin-1 >= 0) {
					$this.state.pMin--;
					var $el=$this.slider.find('.slide[data-index="'+$this.state.pMin+'"]');
					if(!$el.hasClass('loaded')){
						var element=$this.imagesData[$this.state.pMin];
						var haveInfo=false;
						var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
						if(element.slideMetadata.models){
							haveInfo=true;
							info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
						}
						if(element.slideMetadata.credits){
							if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
							haveInfo=true;
							info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
						}
						info+='</div></div>';
						if(!haveInfo){info="";}
						$el.html('<div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" />');
					}
				}
			}
			$this.slider.find('.slide').imagesLoaded(function(){
				var $el=$this.slider.find('.slide>img').parent();
				$el.removeClass('loading');
				$el.addClass('loaded');
				$el.find('img').animate({'opacity':1},$this.fadeTime);
			});
		}else if(type=='next'){
			for(var i=1 ; i <= num ; i++){
				if($this.state.pMax+1 < $this.state.totalSlide) {
					$this.state.pMax++;
					var $el=$this.slider.find('.slide[data-index="'+$this.state.pMax+'"]');
					if(!$el.hasClass('loaded')){
						
						var element=$this.imagesData[$this.state.pMax];
						var haveInfo=false;
						var info='<div class="gallery_info_overlay"><div class="infoWrapper">';
						if(element.slideMetadata.models){
							haveInfo=true;
							info+='<span class="infoTitle">MODELS</span><span class="infoLabel">'+element.slideMetadata.models+'</span>';
						}
						if(element.slideMetadata.credits){
							if(haveInfo){info+='<span class="infoLabelSeparator"></span>';}
							haveInfo=true;
							info+='<span class="infoTitle">PHOTOGRAPHER</span><span class="infoLabel">'+element.slideMetadata.credits+'</span>';
						}
						info+='</div></div>';						
						if(!haveInfo){info="";}
						$el.html('<div class="gallery_img_overlay"></div>'+info+'<img src="'+element.slideImage.url+'" />');
					}
				}
			}
			$this.slider.find('.slide').imagesLoaded(function(){
				var $el=$this.slider.find('.slide>img').parent();
				$el.removeClass('loading');
				$el.addClass('loaded');
				$el.find('img').animate({'opacity':1},$this.fadeTime);
			});
		}
	},
	toggleInfo:function(action){
		var $this=this;
		var $curr=$this.slider.find('.slide[data-index="'+$this.state.pCurr+'"]');
		var $infoContent=$curr.find('.gallery_info_overlay');
		//do my job only if we have info to show
		if(typeof $infoContent!="undefined"&&$infoContent.length>0){
			//enable "i" button hover
			$this.socialLinks.removeClass('noInfo infoActive');
			if(action=="close"){
				Log("fsPicslider->toggleInfo:close");
				$curr.removeClass('infoOpen');
				$this.socialLinks.removeClass('infoActive');
			}else if(action=="open"){
				Log("fsPicslider->toggleInfo:open");
				$curr.addClass('infoOpen');
				$this.socialLinks.addClass('infoActive');
			}else if(action=="toggle"){
				if($curr.hasClass('infoOpen')){
					Log("fsPicslider->toggleInfo:toggle-close");
					$curr.removeClass('infoOpen');
					$this.socialLinks.removeClass('infoActive');
				}else{
					Log("fsPicslider->toggleInfo:toggle-open");
					$curr.addClass('infoOpen');
					$this.socialLinks.addClass('infoActive');
				}
			}
		}else{
			//disable "i" button hover
			$this.socialLinks.addClass('noInfo');
		}
	},
	resetSizeAndPosition:function(){
		var $this=this;
		//var imgH=$this.mainImage.height();
		var wH=jQuery(window).height();
		var winW=$this.winWidth;
		var wW=$this.wrapper.width();
		//var headerH=$this.headerH;//jQuery('#branding').height();
		//var hh=headerLocked?$this.headerCollH:$this.headerH;
		var hh=($this.haveTopVideo)?$this.headerCollH:$this.headerH;
		var footerH=$this.socialLinksContainer.height()+$this.footer.height();
		var wrH=($this.haveTopVideo)?(wH*$this.hPercent)-(footerH+hh):wH-(footerH+hh);
		$this.wrapper.css('height',wrH);
		$this.slider.find('.slide,.slide > img').css({'height':wrH,'padding-top':'0px'});
		$this.state.sliderMargin=0;
		jQuery.each($this.state.slides,function(i,e){
			var $el=jQuery(e);
			var $obj=$this.imagesData[$el.attr('data-index')];
			var w=wrH*$obj.imgRatio;
			w=Math.round(w);
			//image width must be <= of sreeen width
			if(w<=wW){
				$el.width(w);
				$el.attr('data-width',w);
			}else{
				w=wW;
				$el.width(w);
				$el.attr('data-width',w);
				var newH=w*$obj.imgRatioReverse;
				$el.css({'height':newH,'padding-top':((wrH-newH)/2)+'px'});
				$el.find('img').height(newH);
			}
			$this.state.sliderWidth+=w;
			if(i<$this.state.pCurr){$this.state.sliderMargin+=w;}
			else if(i==$this.state.pCurr){$this.state.sliderMargin+=w/2;}
		});
		
		/*
		var socialW=200;
		var picW=jQuery('#'+$this.state.currentSlide).width();
		if(picW>socialW){socialW=picW;}
		$this.socialLinks.animate({width:socialW},400);
		*/
		//thumb wrapper
		var th_padding=parseInt($this.thumbLayer.css('padding-top').replace('px',''))*2;
		$this.thumbLayer.css({height:(wH-th_padding),width:(winW-th_padding)});
		$this.thumbWrap.customScrollbar("resize", true)
			
		$this.slider.width(fsPicSlider.state.sliderWidth);
		//Log('resize left: '+(-1*$this.state.sliderMargin)+(wW/2));
		fsPicSlider.slider.css('left',(-1*$this.state.sliderMargin)+(wW/2));
	},
	resetSizeAndPositionMobile:function(){//here for retrocompatibility only
		return;
	},
	setZoom:function(){
		var $this=this;
		if(isTablet){
			$this.zoomContent.parent().css('background-position',($this.winWidth/2 -15)+'px '+(jQuery(window).height()/2 -15)+'px');
		}
		$this.zoomContent.html('<img src="'+$this.imagesData[$this.state.pCurr].zoomImage.url+'"/>');
		$this.zoomImage=$this.zoomContent.find('img');
		$this.zoomWrapper.fadeIn($this.fadeTime);
		//in case that we have a video in play we pause it
		block_videoplayer.pauseTheVideo();
		$this.zoomContent.imagesLoaded(function(){
			
			if(!isTablet){
				$this.zoomImage.css('top',0);//-1*jQuery(window).height()/2);
				$this.zoomImage.on('click',function(){$this.unsetZoom();});
			}else{
				$this.zoomImage.css('top','');
			}
			$this.zoomImage.animate({'opacity':1},$this.fadeTime,function(){
				jQuery('html').addClass('popupOpen');
				$this.footer.hide();
				$this.header.hide();
				$this.state.zoomOpen=true;
				if(!isTablet){
					$this.zoomWrapper.mousemove(function(e) {
						var ph=jQuery(window).height();
						var ih=ph;
						if($this.zoomImage!=null){
							var ih=$this.zoomImage.height();
						}
						var top=-1*((ih-ph)/ph)*e.pageY;
						/*Log('Y:'+e.pageY);Log('ph:'+ph);Log('ih:'+ih);Log('top:'+top);Log('-----------------');*/
						$this.zoomImage.css('top',top+"px");
					});
				}
			});
		});
	},
	unsetZoom:function(){
		var $this=this;
		jQuery('html').removeClass('popupOpen');
		setTimeout(function(){
			$this.footer.show();
			$this.header.show();
			jQuery.scrollTo( jQuery('#fsGallery'), 1 , {
				offset:0,axis:'y',
				onAfter:function(){
					$this.zoomWrapper.fadeOut($this.fadeTime,function(){
						$this.state.zoomOpen=false;
						$this.zoomContent.html('');
						$this.zoomImage=null;
						if(isTablet){setTimeout(function(){$this.resetSizeAndPosition()},800);}
					});
					
				}
			});
			
		},300);
	},
	openThumbLayer:function(){
		var $this=this;
		jQuery('html').addClass('popupOpen');
		$this.thumbLayer.fadeIn($this.fadeTime,function(){
			jQuery(document).bind('mousemove',fsPicSlider.thumbMouseMove);
		});
	},
	closeThumbLayer:function(){
		var $this=this;
		jQuery(document).unbind('mousemove',fsPicSlider.thumbMouseMove);
		jQuery('html').removeClass('popupOpen');
		$this.thumbLayer.fadeOut($this.fadeTime);
	},
	thumbMouseMove:function(e){
		if(e.clientX>=(fsPicSlider.winWidth-50)){
			fsPicSlider.thumbLayer.addClass('bigRail');
		}else{fsPicSlider.thumbLayer.removeClass('bigRail');}
	}
};


function pushUrl (reference , title) {
	if(history.pushState!=undefined && History.pushState!=undefined){
		if(title != '' && title != 'undefined'){
			History.pushState({state:1}, title, reference);
		} else {
			history.pushState({section:1}, "" , reference );
		}
	}
}


function is_a_mobile_device(){
	var user=navigator.userAgent;
	return (
	(jQuery.browser.mobile) ||
	(/Android/i.test(user)) || 
	(/iPhone|iPod/i.test(user)) || (/iPad/i.test(user)) || (user.match(/iPad/i) != null) || (navigator.platform.indexOf("iPhone") != -1)
	);	
}

function preload(arrayOfImages) {
    jQuery(arrayOfImages).each(function(){
        //$('<img/>')[0].src=this;
        new Image().src=this;
    });
}


function is_msie_8(){
	return (jQuery.browser.msie && parseInt(jQuery.browser.version, 10)===8);
}


function footer_toggle_language(footerlangID){
	if(!jQuery("#"+footerlangID).hasClass("active")){
		jQuery("#"+footerlangID+",.changelanguagefooter").addClass("active");
		jQuery(".go-top").css("visibility","hidden");
		jQuery("#"+footerlangID).slideToggle().promise().done(function(){
			jQuery.scrollTo(jQuery('#e_o_p'),400,{
				offset:0,
				axis:'y',
				onAfter:function(){}
			});
		});
	}else{
		jQuery("#"+footerlangID+",.changelanguagefooter").removeClass("active");
		jQuery("#"+footerlangID).slideToggle();
		jQuery(".go-top").css("visibility","visible");
	}
}	

/* STORE LOCARTOR */
function show_cities(country_id){
	jQuery("#city_wrapper").fadeIn().promise().done(function(){});
	jQuery('.cities').hide();
	jQuery("#store_wrapper").hide();
	jQuery('.stores').hide();
	jQuery("#cities_country-"+country_id).fadeIn().promise().done(function(){
		jQuery.scrollTo( jQuery('#city-list'),600,{
			offset:0,
			axis:'y',
			onAfter:function(){}
		});
	});
}
function show_stores(country_id, city_id){
	
	//Log(country_id+" "+city_id);
	jQuery("#store_wrapper").fadeIn();
	jQuery('.stores').hide();
	jQuery("#stores_cities-"+city_id+"-country-"+country_id).fadeIn().promise().done(function(){
		jQuery.scrollTo( jQuery('#store-list'),600,{
			offset:0,
			axis:'y',
			onAfter:function(){}
		});
	});

}

function lockHeder(op){
	if(op=='lock'){
		//prevent header to scroll with content
		jQuery('body').addClass('lockHeader');
		jQuery('#content').removeClass('follow-scroll').addClass('header-implode').css("padding-top","");
		headerLocked=true;
	} else if(op=='unlock'){
		//undo prevent header to scroll with content
		jQuery('body').removeClass('lockHeader');
		jQuery('#content').removeClass('follow-scroll header-implode');
		headerLocked=false;
	}
}