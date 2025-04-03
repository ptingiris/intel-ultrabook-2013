$(document).ready(function(){

	iefix();

	var pov_animation = "";
	var particleFolder = root + 'images/Renders/particles/';

	defaults = {
		povContainer: 	'#trmContainer #povContainer',
		navContainer: 	'#trmContainer #povContainer nav',
		activeSlide: 	window.location.hash == '' ? $('.activeSlide').attr('class').split(' ')[1] : window.location.hash.slice(2),
		activeView:  	3
	}

	var app = {
		init: 	[
			buildPov(defaults.povContainer,defaults.navContainer,defaults.activeSlide,defaults.activeView),
			mainNav(defaults.povContainer, defaults.activeSlide)
			],
		povViews: 		pov3Setup(),
		processors: 	accordian($('#trmContainer #performance .accordian'))
	}

	$('#trm-pov-badges').trm_RotatingPov({
		fx:     'fade',
		speed:  'slow',
		timeout: 3000, // set to 0 to turn off auto-rotation
		pager:  '#trm-badge-nav'
	});

	badgeNav();
	styleHelpers();

	//init sleek animation for pov 1
	Povs.reset();

	Povs.pov1.frames = {"start":0,"end":16};
	$('#pov-animation-explore').jsMovie({
		sequence : "SLEEK_###.png", folder   : root + "images/Renders/pov-explore/sleek/", from: 0,to: 16,
		fps :30, width: 798, height   : 516, showPreLoader : true,repeat:false,
		playOnLoad : false
	});

	$('body').on('loaded','#pov-animation-explore',Povs.init);
	$('body').on('ended','#pov-animation-explore',Povs.afterAnimation);

	$('body').on('loaded','#pov-animation-compare',Povs.pov2.init);

	//init particle animation
	$('#movie').jsMovie({sequence: "ParticlesLayered_###.png",from:1,to:120,step:1,folder : particleFolder,
		height:"72px",width:"724px",fps:24, playOnLoad: false,showPreLoader:true
	});

}); //$(document).ready

// functions -----------------------------------------------------------------------------

var
Povs = {
	init : function(){
		// console.log(Povs.pov1.frames)
		Povs.pov1.start(Povs.pov1.frames.start,Povs.pov1.frames.end);
		//$('body').off('loaded','#pov-animation-explore',Povs.init);
	},
	pov1 : {
		start : function(){ $('#pov-animation-explore').jsMovie('play',Povs.pov1.frames.start,Povs.pov1.frames.end); },
		frames : {}
	},
	pov2 : {
		init : function(){ Povs.pov2.start(); },

		start : function(){$('#pov-animation-compare').jsMovie('play',Povs.pov2.frames.start,Povs.pov2.frames.end); },
		frames : {}
	},
	afterAnimation : function(){
		//console.log('GO',$('#pov-animation-explore').jsMovie('getClip'), $('#pov-animation-explore').jsMovie())
		$('.performance').fadeIn();
		$('.convertible').fadeIn();
		$('.responsive').fadeIn();
		$('.touch').fadeIn();
		$('.sleek').fadeIn();
	},
	reset : function(){
		$('#sleek').each(function(){
			$(this).removeClass('activeView');
		});
		$('#sleek .sleek').addClass('activeView');

		$('.performance').hide();
		$('.convertible').hide();
		$('.responsive').hide();
		$('.touch').hide();
		$('.sleek').hide();
		//$('body').on('#pov-animation-explore','ended',function(){ console.log('ANI ENDED');  Povs.pov1.afterAnimation();  });
	}
};


function buildPov(container, nav, activeSlide, activeView){
	var pov 		= container + ' .pov.' + activeSlide;

	if(activeSlide!=='shop') {
		window.location.hash = '!' + activeSlide// + '-' + activeView;

		$('#trmContainer #povContainer .activeSlide')
			.removeClass('activeSlide')
			.removeAttr('style')
		if(!$(pov).hasClass('activeSlide')){
			$(pov)
				.fadeIn(1000)
				.addClass('activeSlide')
		}
	}
	if (activeSlide == 'compare') {
			try {
				$('#pov-animation-compare').jsMovie('destroy');
			}
			catch (e) {
				//alert(e);
			}
		//init detachable animation for pov 3
		$('#pov-animation-compare').css({top:"100px"});
		/*
		$('#pov-animation-compare').jsMovie({
			sequence : "detachable_###.png", folder: root +  "images/Renders/pov-compare/detachable/", from: 30,to: 105,
			fps :75, width: 295, height: 198, showPreLoader : false,repeat:false
		});
		$('#pov-animation-compare').jsMovie('play');
	*/
		Povs.pov2.frames = {"start":0,"end":32};
		//$('#pov-animation-compare').css({top:"100px"});
		$('#pov-animation-compare').jsMovie({
			sequence : "standard_###.png", folder   :root + "images/Renders/pov-compare/standard/", from: Povs.pov2.frames.start,to: Povs.pov2.frames.end,
			fps :30, width: 259, height: 171, showPreLoader : true,repeat:false
		});
		//$('#pov-animation-compare').jsMovie('play',Povs.pov2.frames.start,Povs.pov2.frames.end);

		//Reset copy for POV 3
		$("#standard").siblings('.activeView')
			.removeClass('activeView')
		$(".standard").siblings('.selected')
			.removeClass('selected')
		$("#standard").addClass('activeView')
		$(".standard").addClass('selected')
	}
	if (activeSlide == 'explore') { //Reset copy for POV 1
		$('#trmContainer #povContainer .explore .views').attr('id','sleek');
		// console.log($('#trmContainer #povContainer .explore #sleek li').css('display','list-item'))
		$(".sleek").siblings('.activeView')
				.removeClass('activeView')
				.removeAttr('style')

		$('#trmContainer #povContainer .explore #convertible').attr('id','sleek');
		$('#trmContainer #povContainer .explore #performance').attr('id','sleek');
		$('#trmContainer #povContainer .explore #responsive').attr('id','sleek');
	}
	// pov 2 buttons
	var button 	= [];
	var text 	= [];
	$('.pov.laptop .views li')
		.each(function(i){
			button[i] = new Image(); text[i] = new Image();

			button[i].src 	= !$(this).hasClass('activeView') ? root + 'images/_layout/button.png' : root + 'images/_layout/button-ovr.png';
			button[i].alt 	= i+1;
			text[i].src 	= root + 'images/pov-laptop-'+(i+1)+'.png';
			text[i].alt		= $(this).text()

			$(this).html(button[i]);
			$(this).children()
				.addClass('button')
				.wrap('<a>');

		})
		.bind({
			mouseenter: 	function(){

				var activeIdx 	= $(this).index();
				var newView 	= $(this).attr('class')==undefined ? '' : $(this).attr('class').split(' ')[0];

				$(this).parent().attr('id',newView)
				$(this).siblings('.activeView')
					.removeClass('activeView')
					.find('.button').attr('src',button)

				$(this)
					.addClass('activeView')
					.find('.button').attr('src',buttonOvr)

					$('.laptop .text').prepend($(text[activeIdx]).css('opacity',0))
					if($('.laptop .text img').length>1){
						$('.laptop .text img:last').remove()
					}

					if(navigator.userAgent.match('MSIE 8')==null){
						$('.laptop .text img').animate({
							opacity: 	1
						},600)							
					} else {
						var src = $('.laptop .text img').attr('src');
						$('.laptop .text img')
							.css('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='crop',src='" + src + "')");
					}

			}
		})

	// view navigation
	var viewContainer = $(pov).find('.activeView').parent();
	var button 		= root + 'images/_layout/button.png';
	var buttonOvr 	= root + 'images/_layout/button-ovr.png';

	if(activeSlide=="explore"){

		try {
			$('#pov-animation-explore').jsMovie('destroy');
		}
		catch (e) {
			//alert(e);
		}
		Povs.reset();
		$('#pov-animation-explore').jsMovie({
			sequence : "SLEEK_###.png", folder   : root + "images/Renders/pov-explore/sleek/", from: 0,to: 16,
			fps :30, width: 798, height   : 516, showPreLoader : true,repeat:false,
			playOnLoad : false
		});
	}

	viewContainer.children('li').on({
		click: 	function(){
			if(!$(this).hasClass('activeView')){
				var activeView 	= $(pov + ' .views').find('.activeView').attr('class').split(' ')[0];
				var newView 	= $(this).attr('class')==undefined ? '' : $(this).attr('class').split(' ')[0];

				try {
					$('#pov-animation-explore').jsMovie('destroy');
				}
				catch (e) {
					//alert(e);
				}

				Povs.reset();

				$(this).parent().attr('id',newView)
				$(this).siblings('.activeView')
					.removeClass('activeView')

				$(this)
					.addClass('activeView')


				var framePos = {}
				//animation handler for pov 1 for onclicks
				if ($(this).hasClass("convertible") ) {
					Povs.pov1.frames = {"start":0,"end":31};
					$('#pov-animation-explore').jsMovie({
						sequence : "CONVERTIBLE_###.png", folder   : root +  "images/Renders/pov-explore/convertible/", from: Povs.pov1.frames.start,to: Povs.pov1.frames.end,
						fps :30, width: 798, height   : 516, showPreLoader : true,repeat:false,
						playOnLoad : false
					});
					//console.log(Povs.pov1.frames);

				}else if ($(this).hasClass("responsive") ) {

					Povs.pov1.frames = {"start":0,"end":23};
					$('#pov-animation-explore').jsMovie({
						sequence : "RESPONSIVE_###.png", folder   : root + "images/Renders/pov-explore/responsive/", from: Povs.pov1.frames.start,to: Povs.pov1.frames.end,
						fps :30, width: 798, height   : 516, showPreLoader : true,repeat:false,
						playOnLoad : false
					});
				}else if ($(this).hasClass("touch") ) {

					Povs.pov1.frames = {"start":0,"end":20};
					$('#pov-animation-explore').jsMovie({
						sequence : "TOUCH_###.png", folder   : root + "images/Renders/pov-explore/touch/", from: Povs.pov1.frames.start,to: Povs.pov1.frames.end,
						fps :30, width: 798, height   : 516, showPreLoader : true,repeat:false,
						playOnLoad : false
					});
				}else if ($(this).hasClass("sleek") ) {

					Povs.pov1.frames = {"start":0,"end":16};
					$('#pov-animation-explore').jsMovie({
						sequence : "SLEEK_###.png", folder   : root + "images/Renders/pov-explore/sleek/", from: Povs.pov1.frames.start,to: Povs.pov1.frames.end,
						fps :30, width: 798, height   : 516, showPreLoader : true,repeat:false,
						playOnLoad : false
					});
				}else if ($(this).hasClass("performance") ) {

					Povs.pov1.frames = {"start":0,"end":16};
					$('#pov-animation-explore').jsMovie({
						sequence : "STUNNING_###.png", folder   : root + "images/Renders/pov-explore/stunning/", from: Povs.pov1.frames.start,to: Povs.pov1.frames.end,
						fps :30, width: 798, height   : 516, showPreLoader : true,repeat:false,
						playOnLoad : false
					});
				}

				//$('#pov-animation-explore').jsMovie('play',frames.start,frames.end);
			}
		}
	})

	// pov videos
	if($(pov).find('.video').parent('.cta').length==0 && $(pov).find('.video').length>0){
		var video = new Image();
			video.src 	= root + 'images/pov-' + activeSlide + '-video.png';
			video.alt 	= $(pov).find('.video').text();
		var width 		= activeSlide == 'laptop' ? '962px' : '640px';

		$(pov).find('.video')
			.html(video)
			.wrap('<div class="cta">')
			.colorbox({iframe:true, scrolling:false, innerWidth: width, innerHeight: '360px'})

	}

}

function mainNav(container, activeSlide){
	var menu = []; var id = []; var href = [];
	$(container).find('article').each(function(i){
		id[i] = $(this).attr('class').split(' ')[1];
		id[i] += $(this).hasClass('activeSlide') ? ' selected' : '';

		href[i] = $(this).find('h1 a').attr('href')!==undefined ? ' href="'+$(this).find('h1 a').attr('href') +'"' : '';

		menu[i] = '<li class="'+id[i]+'">';
		menu[i] += '<a'+href[i]+'><img src="' + root + 'images/blank.png" alt="'+$(this).find('h1').text()+'" width="100%" height="47"></a>';
		menu[i] += '</li>';
	})
	try {
		$('#pov-animation-compare').jsMovie('destroy');
	}
	catch (e) {
		//alert(e);
	}
	if (activeSlide == "compare") {
		/*
		$('#pov-animation-compare').jsMovie({
			sequence : "detachable_###.png", folder: root +  "images/Renders/pov-compare/detachable/", from: 30,to: 105,
			fps :75, width: 295, height: 198, showPreLoader : false,repeat:false
		});
		$('#pov-animation-compare').jsMovie('play');
		*/
		Povs.pov2.frames = {"start":0,"end":32};
		//$('#pov-animation-compare').css({top:"100px"});
		$('#pov-animation-compare').jsMovie({
			sequence : "standard_###.png", folder   :root + "images/Renders/pov-compare/standard/", from: Povs.pov2.frames.start,to: Povs.pov2.frames.end,
			fps :30, width: 259, height: 171, showPreLoader : true,repeat:false
		});
		//$('#pov-animation-compare').jsMovie('play',Povs.pov2.frames.start,Povs.pov2.frames.end);
	}

	$(container)
		.find('nav ul').append(menu.join(''));

	$(window).resize(function(){
		$('#trmContainer #povContainer nav a').height($('#nav-bg').height())
	})

	if(document.getElementById('nav-bg')!==null){
		var navBg = document.getElementById('nav-bg');
			navBg.src = root + 'images/_layout/pov-nav-'+activeSlide+'.png';
	}


	$('#trmContainer #povContainer nav li').on({

		mouseenter: 	function(){
			if(!$(this).hasClass('selected')){
				var id = $(this).attr('class').split(' ')[0];
				navBg.src = root + 'images/_layout/pov-nav-'+activeSlide+'-'+id+'-ovr.png'
			}
		},
        mouseleave:     function(){
            if(!$(this).hasClass('selected')){
            navBg.src = root + 'images/_layout/pov-nav-'+activeSlide+'.png';
            }
        },
		click: 			function() {
			if ($(this).attr('class')=='shop') return;
			Povs.pov1.frames = {"start":0,"end":16};
			var id = $(this).attr('class').split(' ')[0];
			activeSlide = $(this).attr('class').split(' ')[0]
			$(this).parents('nav').find('.selected').removeClass('selected')
			$(this).addClass('selected');
			navBg.src = root + 'images/_layout/pov-nav-'+activeSlide+'.png'
			buildPov(defaults.povContainer, defaults.navContainer, activeSlide, defaults.activeView)
		}

	})
}

function iefix(){
	var ua = navigator.userAgent.match('MSIE');
	var version = ua!==null ? parseInt(navigator.userAgent.split('MSIE')[1].slice(1)) : null
	if(ua!==null){
		$('#trmContainer').addClass('MSIE');
		if(version<9){
			$('#trmContainer').addClass('ie'+version);
			$('#trmContainer #povContainer .laptop .views li').each(function(i){
				$(this).addClass('child'+(i+1))
			})

			if (version==7){
				// hide page elements
				$('#badges, #performance, #footnotes, nav#main, #railImage').css('display','none')

				var ie9redir 		= new Image();
					ie9redir.src 	= root + 'images/ie7-backup-image.jpg'
					ie9redir.alt 	= 'Download IE9 here';

				$('#trmContainer #povContainer')
					.html(ie9redir)
					.append('<a class="ie9-download" href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie-9/worldwide-languages"><img src="'+root+'images/blank.png" alt="Download IE9 here" width="230" height="36"></a>')

				return false;
			}
		}
	}
}

function badgeNav(){
	var processor = [];
	$('#badges .processor')
		.each(function(i){
			processor[i] 	= $(this).attr('id');
			var alt 		= $(this).children('h2').text();

			if(processor[i]!=='compare-processors'){
				$(this)
					.prepend('<img src="'+root+'images/badge-large-'+processor[i]+'.png" alt="'+alt+'">')
					.prepend('<a class="close">Close X</a>')

					if(processor[i].slice(0,1)=='i'){
						$(this).append('<a class="cta compare" onclick="compareProcessors($(this));"><img class="compareBtn" src="'+root+'images/_layout/compare-processors.png" alt="Compare Core processors"></a>')
					}
				}
		})

	$('#badges #trm-badge-nav li').each(function(i){
		$(this).addClass(processor[i]);
	})

	$('#badges #trm-badge-nav li').bind({
		click: 	function(){
			var badge = processor[$(this).index()];
			// reposition page
			var destination = $('#processors').offset().top;
			$("html:not(:animated),body:not(:animated)").animate(
				{scrollTop: destination-10},
				500,
				'linear',
				function(){
					// if the compare processors overlay is showing, hide it
					if($('#trmContainer #compare-processors').css('display')=='block'){
						$('#trmContainer #compare-processors').css('display','none')
					}

					descToggle(badge)
				}
			);
		}
	})

	function descToggle(badge) { // hides description that is showing, then show description for clicked item
		// console.log($('#trmContainer .expanded'))
		$('#badges .processor.expanded, #badges .cta.expanded')
			.hide()
			.removeClass('expanded')
		$('#'+badge+' .compare').removeAttr('style');
		$('#' + badge)
			.slideDown(600)
			.addClass('expanded')
	}

	$('#badges .processor .close').click(function(){
		$('#badges .cta')
			.fadeOut()
			.removeClass('expanded').removeAttr('style')
		$(this).parent()
			.slideToggle(300,'linear',function(){
				$(this)
					.removeClass('expanded')
					.removeAttr('style')
			})
	})
}

function pov3Setup(){

		var id = []; bgImg = [];
		$('.pov.compare section h3').each(function(i){
			id[i] = ($(this).html().split('<')[0]).toLowerCase();
			$(this).parent('section').attr('id',id[i])

			bgImg[i] 		= new Image();
			//bgImg[i].src 	= root + 'images/pov-compare-' + id[i] + '.jpg';
			bgImg[i].src 	= root + 'images/pov-compare-bg.jpg';
			bgImg[i].alt 	= id[i];
		})

		$('.pov.compare .views li')
			.each(function(i){
				$(this)
					.addClass(id[i])
			})

		$('.pov.compare .views li').on({
			click: 	function(){
				var l 			= $(this).attr('class').split(' ').length - 1;
				var targetId 	= $(this).attr('class').split(' ')[l];

				if(!$(this).hasClass('selected')) {
					$(this).addClass('selected');
					$(this).siblings('.selected').removeClass('selected')
				} else return; // If already selected, then cancel

				try {
					$('#pov-animation-compare').jsMovie('destroy');
				}
				catch (e) {
					//alert(e);
				}

				$(this).siblings('.out').removeClass('out')

				$('.activeSlide .activeView')
					.removeClass('activeView')
					.removeAttr('style')

				$('#trmContainer #'+targetId)
					.addClass('activeView')
					.fadeIn(800)


				$('.activeSlide .bg-image').attr('id',targetId+'Bg')
				document.getElementById(targetId+'Bg').src = bgImg[$(this).index()].src
				// console.log()

				//alert(targetId);
				//animation handler

				//handler for compare animations

				if (targetId == "detachable")  {
					Povs.pov2.frames = {"start":0,"end":20};
					$('#pov-animation-compare').css({top:"100px"});
					$('#pov-animation-compare').jsMovie({
						sequence : "detachable_###.png", folder: root +  "images/Renders/pov-compare/" + targetId +"/", from: Povs.pov2.frames.start,to: Povs.pov2.frames.end,
						fps :30, width: 295, height: 198, showPreLoader : true,repeat:false
					});
				}else if (targetId == "flip") {
					Povs.pov2.frames = {"start":8,"end":41};
					$('#pov-animation-compare').css({top:"100px"});
					$('#pov-animation-compare').jsMovie({
						sequence : "flip_##.png", folder   :root + "images/Renders/pov-compare/" + targetId +"/", from: Povs.pov2.frames.start,to: Povs.pov2.frames.end,
						fps :30, width: 270, height: 190, showPreLoader : true,repeat:false
					});
				}else if (targetId == "slider") {
					Povs.pov2.frames = {"start":10,"end":43};
					$('#pov-animation-compare').css({top:"60px"});
					$('#pov-animation-compare').jsMovie({
						sequence : "slider_##.png", folder   : root + "images/Renders/pov-compare/slider/", from: Povs.pov2.frames.start,to: Povs.pov2.frames.end,
						fps :30, width: 260, height: 220, showPreLoader : true,repeat:false
					});

				}else if (targetId == "standard") {
					Povs.pov2.frames = {"start":0,"end":32};
					$('#pov-animation-compare').css({top:"100px"});
					$('#pov-animation-compare').jsMovie({
						sequence : "standard_###.png", folder   :root + "images/Renders/pov-compare/" + targetId +"/", from: Povs.pov2.frames.start,to: Povs.pov2.frames.end,
						fps :30, width: 259, height: 171, showPreLoader : true,repeat:false
					});
				}else if (targetId == "swivel") {
					Povs.pov2.frames = {"start":0,"end":19};
					$('#pov-animation-compare').css({top:"100px"});
					$('#pov-animation-compare').jsMovie({
						sequence : "swivel_###.png", folder   : root + "images/Renders/pov-compare/" + targetId +"/", from: Povs.pov2.frames.start,to: Povs.pov2.frames.end,
						fps :30, width: 260, height: 220, showPreLoader : true,repeat:false
					});
				}

				//$('#pov-animation-compare').jsMovie('play',Povs.pov2.frames.start,Povs.pov2.frames.end);

			}
			// 'mouseenter mouseleave': 	function(){
			// 		console.log($(this).siblings('.selected'))
			// 	$(this).siblings('.selected').toggleClass('out')
			// }
		})
}

$("#target").click(function() {
    $("#movie").jsMovie("play",1,120,true,false,5,"738px","72px");
});


function styleHelpers(){
	$('#badges .processor li:last-child, #trm-badge-nav li:last-child').addClass('last');
	$('#performance hgroup').prepend('<img class="corner right" src="'+root+'images/_layout/right-corner.png">');
	$('#performance hgroup .corner.right').css({
		position: 	'absolute',
		top: 		'-1px',
		right: 		'-1px'
	})
	$('#trmContainer .video').colorbox({iframe:true, scrolling:false, innerWidth: '640px', innerHeight: '360px'})

	var navBg = new Image(); navBg.src = root+'images/pov-compare-nav-active.png';
	$('#trmContainer .compare .views img')
		.addClass('main')
		.before(navBg)
		.siblings('img').addClass('bg');

	$('sup').click(function() {
			   $(this).removeAttr('href');
			   var elementClicked = '#footnotes';
			   var destination = $(elementClicked).offset().top;
			   $("html:not(:animated),body:not(:animated)").animate({
			   		scrollTop: destination-20}, 2000 );
			   		return false;
				});
}

function compareProcessors(target) {

	if($('#badges #compare-processors .close').length==0){
		$('#badges #compare-processors').prepend('<a class="close" onclick="closeMe($(this).parent());"><img src="'+root+'images/_layout/close.png" alt="Close"></a>')
	}

	$('#badges #compare-processors')
		.fadeIn(300)
}

function closeMe(target) {
	target.fadeOut(300);
}

function accordian(target){

	target.children('li').click(function(){
		if(!$(this).hasClass('expanded')){
			$(this).siblings('.expanded')
				.removeClass('expanded')
				.children('p').removeAttr('style')

			$(this).children('p').slideDown(500);
			$(this).addClass('expanded');
		}

	})

}

function testSafari(){
	$('#trm-badge-nav li a').each(function(i){
		test = $(this).attr('onclick');
		add = 'safariBadge($(this)); ';
		test = add + test;
		$(this).attr('onclick',test);
		console.log('LINK ' + i + ' EDITED');
	})
 	console.log('TEST SAFARI RAN');

	
}

function safariBadge(target){

	if($('#trmContainer #compare-processors').css('display')=='block'){
		$('#trmContainer #compare-processors').css('display','none')
	}

	var i = target.parent().index();
	var processor = $('#trmContainer .processor');
	var badge 	= $(processor[i]).attr('id');

	$('#badges .processor.expanded, #badges .cta.expanded')
		.hide()
		.removeClass('expanded')
	$('#'+badge+' .compare').removeAttr('style');
	$('#' + badge)
		.fadeIn(600)
		.addClass('expanded')
}

//setTimeout(testSafari,10000);