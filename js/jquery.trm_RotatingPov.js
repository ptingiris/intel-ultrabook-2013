(function ($) {
    $.fn.trm_RotatingPov = function (options) {
        var defaults = {
            xmlPath			: '',
            pager 			: '#nav', // the id or class of the pager
            speed 			: 200,	//transition time
            timeout 		: 9, // seconds
            fx 				: 'fade', // use the fx from cycle
            buttonHeight	: '',	// the height of the buttons in the pager
            timerInt  		: 100,	// how many milliseconds for the timer to run
            showPausePlay	: true,	// show the play and pause button
            toggleText		: true,	// show the text of the pause play button
            togglePausePlayOnHover : false,	// toggle between play and pause on mousehover mouseout
            hotSpotBorder 	: false,	// show borders on hotspote for debugging purposes
            useNext			: '',	// selector of element to use for next
            usePrev			: '',	// selector of element to use for prev
            hideNextGroup	: '',	// selector of controlGroup
            navClass		: '',	// class to add to nav
            navClassSeq 	: 'false',	// add numbers in a sequence to nav class
            onAnimateCallBack : '',
            hidePager : 'false',
			slideExpr : 'img',
			doTracking: true

        };

        var options = $.extend(defaults, options);
        var obj = $(this);
        var fullData;
        var totalItems;
        var rotateTimer;
        var thisSelector;
        var progressTimer = 0;
        var currentProgress = 0;
        var manualPause = false;
        var isTracked = new Array();
        var clickTrack = false;
        var converges = new Array();
        var flashIsReady = false;
        var currentSlide = 0;
        var currentPov = 0;
		var previousPov = 0;
		var initdone = false;
		var lockChange  = false;

		$(this).cycle({
			fx:     options.fx,
			speed:  options.speed,
			timeout: options.timeout,
			pager:  options.pager,
			pagerAnchorBuilder: function(idx, slide) { 
				var mnu = '<li class="pov_badge' + (idx+1) +'"><a href="#'+(idx+1)+'"></a></li>';
				return mnu;		
			},
			slideExpr: options.slideExpr,
			before: function onBefore (curr, next, opts) {
					previousPov = opts.currSlide+1;
			   },
            after : function onAfter(curr, next, opts) { // when the slide changes these functions will be called.
               	  var type = (clickTrack == true) ? 'click' : 'auto';
				  this.currentPov = opts.currSlide;	
				  animateBadges(type,this.currentPov);
				  if(type=='click'){
				  	opts.timeout = 0;
				  }
				  doTrack(type, curr, next, opts);
				  			  
				}
		}); 

	   // stop timer on hover
		progressTimer = 0;
		//progressTimer = setInterval(onProgress, options.timerInt);	
		$(options.pager + ' a').click(function(){clickTrack = true;});
        function onProgress(){
            currentProgress += options.timerInt;
            perc = currentProgress/(options.timeout*1000)*100;
            pos = options.buttonHeight-((options.buttonHeight/100)*perc) + 'px';
           // alert('here');
            $(options.pager + ' a.activeSlide').css({backgroundPosition: '0px ' + pos});
            if(perc == 100){
                onTimer()
            }
        }	
		
        function pauseTimer(){
        	if(options.togglePausePlayOnHover && options.toggleText){$('#trm_statusBtn').text('Play');}
            
            clearInterval(progressTimer);
            progressTimer = null;
        }

        function startTimer(){
            if(options.togglePausePlayOnHover && options.toggleText){$('#trm_statusBtn').text('Pause');}
            progressTimer = setInterval(onProgress, options.timerInt);
        }
        function resetTimer(){
            pauseTimer();
            startTimer();
        }		
        function doTrack(type, curr, next, opts){
        	//alert('opts.currSlide'+opts.currSlide);
        	var index = opts.currSlide;
        	currentPov = index
			clickTrack = false;
			//alert(type);
			
			switch(type.toUpperCase()){
				case 'CLICK':
					clickTrack = true;
					trackConverge(index+'_click');
					//alert('click');
				break;
				case 'AUTO':
					if(isTracked[index] != true){
						trackConverge(index+'_Impr');
						isTracked[index] = true;
					}
				break;
			}
        }
		
		function animateBadges(type,currentPov){
			if (lockChange) return;
			index = currentPov+1;

				switch(index)
				{
				case 0:
					strFPS = 20;
					strMoveTo = "-999px";
				  break;					
				case 1:
					strFPS = 20;
					strMoveTo = "124px";
				  break;					
				case 2:
				  strFPS = 25;	
				  strMoveTo = "272px";
				  break;
				case 3:
				  strFPS = 30;
				  strMoveTo = "425px";
				  break;						  
				case 4:
				  strFPS = 40;
				  strMoveTo = "580px";
				  break;	
				case 5:
				  strFPS = 55;					
				  strMoveTo = "721px";
				  break;
				default:
				  //code to be executed if n is different from case 1 and 2
				}

				previousPosition = strMoveTo;
				resetAnimation(strFPS, strMoveTo, previousPov, index);
				
				try {
					//$("#movie" + previousPov).jsMovie('destroy');
				}
				catch (e) {
					//alert(e);
				}				

		}
		
		function resetAnimation(strFPS, strMoveTo, previousPov, index) {
			/*if (lockChange) return;
			else lockChange = true;*/
			var lastbadge = $("#trm-pov-badge-star" + previousPov);
			var nextbadge = $("#trm-pov-badge-star" + index);
			var particlemovie = $("#movie");
			var badgeTL = new TimelineLite();

			if (initdone == false) {
				initdone = true;
				//$("#movie").jsMovie("play",1,240,true,false,strFPS,strMoveTo,"72px");
	            //$("#movie").css({width:0});
		        $("#trm-pov-badge-star1").css({visibility:'hidden'});
		        //lockChange = false;
			} 
			//else {
				$("#movie").jsMovie("play",1,240,true,false,strFPS,strMoveTo,"72px");
				badgeTL.add(TweenLite.to(lastbadge, 0, {autoAlpha:1, overwrite:"all"}));
				badgeTL.add(TweenLite.to(lastbadge, 1, {left:previousPosition}, {left:strMoveTo}));
				badgeTL.add(TweenLite.to(particlemovie, 1, {width:strMoveTo, overwrite:"all"}),"-=1");
				badgeTL.add(TweenLite.set(nextbadge, {left:strMoveTo, autoAlpha:0, overwrite:"all"}));
				if (previousPov<index)  {
					badgeTL.add(TweenLite.to(nextbadge, 0.5, {autoAlpha:1, ease:Bounce.easeIn}));
					badgeTL.add(TweenLite.set(lastbadge, {autoAlpha:0,delay:0.1}));
				} else {
					badgeTL.add(TweenLite.set(nextbadge, {autoAlpha:1,delay:0.1}));
					badgeTL.add(TweenLite.to(lastbadge, 0.5, {autoAlpha:0, ease:Bounce.easeIn}));
				}
				for (i = 1; i < 6; i++) {
					if (i != previousPov && i != index) {
						var otherbadge = $("#trm-pov-badge-star" + i);
						badgeTL.add(TweenLite.set(otherbadge, {autoAlpha:0}));
					}
				}
				badgeTL.add(TweenLite.set(nextbadge, {autoAlpha:1,delay:0.1}));
		        setTimeout(unlockChanges,2600);
			//}
		}

		function unlockChanges () {
		    lockChange = false;
		}

        function trackConverge(cid){
        	if(options.doTracking == true){
        		debug(cid + '_US_ENG_01');
	        	/*
	        	if(typeof Omniture_TrackEvent != 'undefined'){
	        		Omniture_TrackEvent('o',cid + '_US_ENG_01');
	        	}
	        	*/
	        	if(typeof(parent.s_omni) != 'undefined'){
					//s_omni.tl(this,'o', Metrics.settings.convergeId+converge+Metrics.settings.lang);
					s_omni.linkTrackVars = 'prop54';
					s_omni.prop54 = cid;
					s_omni.tl(this,'o'); 
					s_omni.linkTrackVars = s_omni.linkTrackEvents = "";
					
					//console.log('METRICS LOG: s_omni.prop54 ' + s_omni.prop54);
					
				}
				else{
					console.log('OMNITURE DISABLED ' + cid);
				}
        	}
        	
        }	

        function debug(params){
           if (typeof console != "undefined") {
                // console.log(params);
            }  
        }
		
	
    }
})(jQuery);


function trm_trackIt(cid){
	$(this).trm_RotatingPov.trackIt(cid);
}

