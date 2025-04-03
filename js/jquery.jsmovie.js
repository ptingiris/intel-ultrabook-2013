/**
 *	jsMovie
 *	@author RadMedia - Richard Burkhardt
 *	@version 1.3.7d
 *	
 *	This is a jQuery-plugin for jQuery 1.5.1 (tested). This plugin enables you
 *	to play imagesequences without flash or HTML5 with the benefit of playing
 *	your movies backwards and having PNG images animated.
 *
 *	@TODO: streaming of content
 *	@TODO: html5 / canvas for mobile devices and grafic acceleration (research)
 *	@TODO: preload verbose
 *
 *	SETTINGS
 *	@param images	-	array of images that are played in this order ! important image names my not contain any spaces
 *	@param sequence	-	string like image####.jpg which automaticly fills the images array, 
 *						image#.jpg would render like image123.jpg
 *						image#####.jpg would render like image00123.jpg ! important image names my not contain any spaces
 *	@param from		-	integer value that defines the start of the sequence
 *	@param to		-	integer value that defines the end of the sequence
 *	@param step		-	integer value that defines the step length of the sequence. 2 would render every second frame
 *	@param folder	-	string that contains the image folder
 *	@param grid		-	object that contans the structure of an image, i.e. {height:800,width:600,rows:1,columns:1}
 *	@param grid.height	-	integer value that represents the image height of the resultung frame in a multi-frame image
 *	@param grid.width	-	integer value that represents the image width of the resultung frame in a multi-frame image
 *	@param grid.rows	-	integer value that represents the number of frame rows in a multi-frame image
 *	@param grid.columns	-	integer value that represents the number of frame columns in a multi-frame image
 *	@param loader	-	object that contans the parameters for the image preloader
 *	@param loader.path		-	string that contains the preloader image path
 *	@param loader.height	-	integer value that represents the preloader height
 *	@param loader.width		-	integer value that represents the preloader width
 *	@param loader.rows		-	integer value that represents the number of frame rows in the multi-frame preloader image
 *	@param loader.columns	-	integer value that represents the number of frame columns in the multi-frame preloader image
 *	@param fps		-	float value that represents the frames per second rate
 *	@param width	-	integer value that scales the target frame to the wanted player width
 *	@param height	-	integer value that scales the target frame to the wanted player height
 *	@param  loadParallel - integer value that represents the amount of pictures that are parallely loaded
 *	@param repeat	-	boolean value enables or disables the auto repeat function
 *	@param playOnLoad		-	boolean value. if set to true the video atomaticly starts to play after the frames are loaded 
 *	@param playBackwards	-	boolean value. if set to true the video plays backwards
 *	@param showPreLoader	-	boolean value. if set to true the preloader will be displayed
 *	@param verbose	-	boolean value. if set to true the player will trigger the verbose event
 *
 *	METHODS
 *	init	-	initialises the plugin	- $(".movie").richMovie({});
 *	option	-	sets an option	- $(".movie").richMovie("option","repeat",true);
 *	realFps	-	returns the real Frames pre Second timing	- $(".movie").richMovie("realFps");
 *	play	- $(".movie").richMovie("play");
 *	pause	- $(".movie").richMovie("pause");
 *	stop	- $(".movie").richMovie("stop");
 *	playUntil	- $(".movie").richMovie("playUntil",10);
 *	goto	- $(".movie").richMovie("goto",20);
 *	destroy	- $(".movie").richMovie("destroy");
 *	throwError	- $(".movie").richMovie("throwError",1);
 *
 *	EVENTS
 *	play	-	is tiggered when the movie starts playing
 *	pause	-	is tiggered when the movie pauses
 *	stop	-	is tiggered when the movie stops
 *	playing	-	is tiggered when the movie enters a frame
 *	loaded	-	is tiggered when the movie has finished its loading process
 *	verbose	-	is tiggered when the movie outputs a verbose, the callback has an extra argument like function(e,output){} which contains the text
**/

(function($) {
 	$.fn.jsMovie = function(method) {
	var settings = {
		images : [],
		sequence : '',
		from : 0,
		to : 1,
		step : 1,
		folder : "pic/",
		grid: {height:800,width:600,rows:1,columns:1},
		loader: {path:"images/animation-loader.png",height:50,width:50,rows:2,columns:4},
		fps: 12,
		width: 640,
		height: 480,
		loadParallel: 1,
		repeat:true,
		playOnLoad:false,
		playBackwards:false,
		showPreLoader:true,
		verbose:true
	};			
	
	var methods = {
		init : function(options) {
			
			if (options != undefined) { 
				$.extend( settings, options );
			}
			
			return this.each(function(){
				var data = $(this).data("jsMovie");
				
				//no initialization has been done
				if(!data){
					$(this).data("settings",settings);
					$(this).data("jsMovie",$(this));
					//load images from sequence
					if($(this).data("settings").sequence !== ''){
						$(this).data("settings").images = [];
						var findZero;
						for(var sequence_no = $(this).data("settings").from; sequence_no <= $(this).data("settings").to; sequence_no = sequence_no+$(this).data("settings").step){							
							var digits = 1;
                            if(sequence_no > 0){
                                digits = (Math.floor(Math.log(sequence_no)/Math.log(10))+1);
							}
                            findZero = new RegExp("^(.*?)([#]{1,"+digits+"}?)([^#]+)","g");
							var findZeroResult = findZero.exec($(this).data("settings").sequence);
							$(this).data("settings").images.push((findZeroResult[1]+sequence_no+findZeroResult[3]).replace(/#/g,"0"));
						}
					}
                    //scale canvas
					$(this).data("restoreCss",{width:$(this).width(),height:$(this).height(),overflow:$(this).css('overflow')});
					$(this).css({width:$(this).data("settings").width, height:$(this).data("settings").height, overflow:'hidden'});
					//create frames
					$(this).data("currentFrame",$(this));
					var frameNo = 0;
					for(var i = 0;i < $(this).data("settings").images.length;i++){
						for(var row = 0;row < $(this).data("settings").grid.rows;row++){
							for(var col = 0;col < $(this).data("settings").grid.columns;col++){
								$(this).data("frame"+frameNo,$("<div class='jsMovieFrame' />"));
								$(this).append($(this).data("frame"+frameNo));
								$(this).data("currentFrame",$(this).data("frame"+frameNo));
								//hideAllFrames
								$(this).data("currentFrame").hide();
								//style image
								$(this).data("frame"+frameNo)
									.css({width:$(this).data("settings").width, 
										  height:$(this).data("settings").height,
										  'background-position':(-$(this).data("settings").grid.width*col)+"px "+(-$(this).data("settings").grid.height*row)+"px",
										  'background-repeat':'no-repeat'
										  })
									.data("frame",frameNo+1);
								frameNo++;
							}
						}
					}
					
					//movie is stoped by default
					$(this).data("currentStatus","stopped");
					$(this).bind("play",play_movie_event);
					$(this).bind("stop",stop_movie_event);
					$(this).bind("pause",pause_movie_event);
					
					//show first frame
					$(this).data("frame0").show();
					$(this).data("currentFrame",$(this).data("frame0"));
					$(this).data("currentFrame").css({'background-image':'url("'+$(this).data("settings").folder+$(this).data("settings").images[0]+'")'});
					
					//add containers
					$(this).append("<div id='jsMovie_event_overlay'></div>");
					$(this).append("<div id='jsMovie_image_preload_container'></div>");
										
					//prepare event container
					var self = $(this);
					$('#jsMovie_event_overlay').css({width:$(self).data("settings").width, height:$(self).data("settings").height*2, 'margin-top':'-'+($(self).data("settings").height*2)+"px"});
					
					//preload all images
					preloadImages.apply($(this));
					//show preloader
					animatePrelaoder.apply($(this));
					
				}else{
					methods.throwError(1);
				}

			});
		
		},
		
		option : function (option, value){
			
			if(value == undefined){
				return this.data("settings")[option];
			}else{
				this.data("settings")[option] = value;
				return this;
			}
			
		},
		realFps : function(){
			return $(this).data("realFps");
		}
		,
		play : function(){
			$(this).data("currentStatus","play");
			$(this).trigger("play");
			return this;
		},
		
		pause : function(){
			$(this).data("currentStatus","paused");
			$(this).trigger("pause");
			return this;
		},
		
		stop : function(){
			$(this).data("currentStatus","stopped");
			$(this).trigger("stop");
			return this;
		},
		
		playUntil : function(frame) {
			$(this).data("playUntil",frame);
			if(frame != $(this).data("currentFrame").data('frame')){
				methods.play.apply(this);
			}
			return this;
		},
		
		gotoFrame : function(frame){
			var self = this;
			$(this)
				.find(".jsMovieFrame")
				.each(function(index,elem){
					// find the wanted frame
					// only show frame if the image has been loaded
					if(frame == $(this).data('frame') && $(this).data('loaded') !== undefined){
						$(self).find(".jsMovieFrame").hide();
						$(self).data("currentFrame",$(this));
						$(self).data("currentFrame").show();
					}else{
						$(self).data("gotoFrameOnLoaded",frame);
					}
				});	
			return this;
		},
       addClip : function(name,start,end,pause,insertAt){
            if(pause === undefined){
                pause = 0;                   
            }

            if(insertAt === undefined){
                insertAt = $(this).data("settings").clipQueue.length    
            }
            if(start >= 1 && 
               end <= $(this).data("settings").images.length*$(this).data("settings").grid.rows*$(this).data("settings").grid.columns && 
               insertAt <= $(this).data("settings").clipQueue.length)

            {

                newClip = {name : name, start : start, end : end, pause: pause};
                $(this).data("settings").clipQueue.splice(insertAt,0,newClip);
            }else{
                methods.throwError(2);
            }
            return this;
        },		
		addSequence: function(sequence, folder) {
				$(this).data("settings").sequence  =  sequence;
				$(this).data("settings").folder = folder;
			return this;
		},
		destroy : function(){
	
			return this.each(function(){
				$(this).children().remove();
				$(this).css($(this).data("restoreCss"));
				clearInterval($(this).data("playingInterval"));
				$(this).removeData();
			});
	
		},
		
		throwError : function(errno){
			var error = "";
			if(errno != undefined){
				if(errno == 1){
					error = "This Objekt has already been initialized!";
				}else if(true){
					error = "Unknown Error";
				}
			}else{
				error = "Unknown Error";
			}
			
			if(window.console) {
				console.log(error);
			} else {
				alert(error);
			}
		}
		
		
	};
	
	/*Eventhandler*/
	function play_movie_event(e){
		if($(this).data("currentStatus") == 'play'){
			clearInterval($(this).data("playingInterval"));
			$(this).data("currentStatus","playing");
			var self=this;
			$(this).data("playingInterval",setInterval(function() {
				// FPS Messurement
				if($(self).data("realFpsTimeStamp") != undefined){
					$(self).data("realFps",1/(((new Date()).getTime()-$(self).data("realFpsTimeStamp"))/1000));
					//verboseOut.apply($(self),[$(self).data("realFps").toFixed(2)+"fps"]);
				}else{
					$(self).data("realFps",$(self).data("settings").fps);
				}
				$(self).data("realFpsTimeStamp",(new Date()).getTime());
				
				// play frames
				if($(self).data("settings").playBackwards){
					if($(self).data("currentFrame").data('frame') != 1){
						$(self).data("currentFrame").prev().show();
						$(self).data("currentFrame").hide();
						$(self).data("currentFrame",$(self).data("currentFrame").prev());
						$(self).trigger('playing');
					}else{
						if($(self).data("settings").repeat){
							$(self).data("currentFrame").siblings('.jsMovieFrame').last().show();
							$(self).data("currentFrame").hide();
							$(self).data("currentFrame",$(self).data("currentFrame").siblings('.jsMovieFrame').last());
							$(self).trigger('playing');
						}else{
							$(self).trigger('stop');
						}
					}
				}else{
					if($(self).data("currentFrame").next('.jsMovieFrame').length == 0){
						if($(self).data("settings").repeat){
							$(self).data("frame0").show();
							$(self).data("currentFrame").hide();
							$(self).data("currentFrame",$(self).data("frame0"));
							$(self).trigger('playing');		
						}
					}else{
							$(self).data("currentFrame").next().show();
							$(self).data("currentFrame").hide();
							$(self).data("currentFrame",$(self).data("currentFrame").next());
							$(self).trigger('playing');
					}
				}
				
				if($(self).data("playUntil") == $(self).data("currentFrame").data('frame')){
				   $(self).trigger('pause');
				   $(self).data("playUntil",-1);
				}
			}, 1000/$(this).data("settings").fps));
		}
	}
	
	function stop_movie_event(e){
		clearInterval($(this).data("playingInterval"));
		$(this).find(".jsMovieFrame").hide();
		$(this).data("currentFrame",$(this).data("frame0"));
		$(this).data("currentFrame").show();
		$(this).data("currentStatus","stop");
		$(this).data("playUntil",-1);		
	}
	
	function pause_movie_event(e){
		clearInterval($(this).data("playingInterval"));
	}
	
	/*helper*/
	function preloadImages(imageToLoad){
		
		if(imageToLoad == undefined){
			imageToLoad = 0;
			this.data("loadStatus","loading");
			for(loadParralelCount = 1;loadParralelCount <= this.data('settings').loadParallel; loadParralelCount++){
				preloadImages.apply(this,[loadParralelCount]);	
			}
			return;
		}
		
		if(imageToLoad > this.data("settings").images.length){
			this.data("loadStatus","loaded");
			this.trigger("loaded");
			if(this.data("settings").playOnLoad){
				methods.play.apply(self);	
			}
			return;
		}
		
		var curImg = new Image();
		var self = this;
		
		curImg.onload = function(){
			//set background-image ----------- optimaization for iPad
			var framesPerImage = $(self).data("settings").grid.rows*$(self).data("settings").grid.columns;
			for(var i = 0; i<framesPerImage;i++){
				$(self).data("frame"+(i+((imageToLoad-1)*framesPerImage))).css({'background-image':'url('+$(self).data("settings").folder+$(self).data("settings").images[imageToLoad-1]+')'});
				$(self).data("frame"+(i+((imageToLoad-1)*framesPerImage))).data("loaded",true);
			}				
			//workarround to set the frame given by the goto method when the wanted frame hasn't been loaded yet - an event would dramaticly slow down FF3
			if($(self).data("gotoFrameOnLoaded") != undefined && Math.ceil($(self).data("gotoFrameOnLoaded")/framesPerImage) == imageToLoad){
				var gotoFrame = $(self).data("gotoFrameOnLoaded");
				$(self).removeData("gotoFrameOnLoaded");
				methods.gotoFrame.apply($(self),[gotoFrame]);				
			}
			//recursive call the next image to be loaded
			preloadImages.apply(self,[imageToLoad+self.data('settings').loadParallel]);
			//verbose
			verboseOut.apply(self,["Image #"+(imageToLoad)+" has been loaded"]);			
		}
		curImg.src = $(this).data("settings").folder+$(this).data("settings").images[imageToLoad-1];
		/*FOR THE BROWSERS THAT DON'T JUST PRELOAD ON INSTANCIATION LIKE OPERA,CHROME - THEY ONLY CACHE VISIBLE BACKGROUNDIMAGES*/
		$('#jsMovie_image_preload_container').append(curImg);
		$(curImg).css({height:"1px",width:"1px"});
		
	}
	
	function animatePrelaoder(){
		if(this.data("loadStatus") != "loaded" && $(this).data("settings").showPreLoader){
			this
				.append("<div class='loaderOverlay' />")
				.children(".loaderOverlay")
				.css({ opacity:0.1,
					  height:this.height()+"px",
					  width:this.width()+"px",
					  position:'absolute',
					  top:this.offset().top+"px",
					  left:this.offset().left+"px"});
			this
				.append("<div class='loaderAnimation' />")
				.children(".loaderAnimation")
				.css({"background-image":"url("+$(this).data("settings").loader.path+")",
					  height:$(this).data("settings").loader.height+"px",
					  width:$(this).data("settings").loader.width+"px",
					  position:'absolute',
					  top:"200px",
					  left:"380px",					  
					  //top:(this.offset().top+(this.height()/2)-($(this).data("settings").loader.height/2))+"px",
					  //left:(this.offset().left+(this.width()/2)-($(this).data("settings").loader.width/2))+"px",
					  'background-repeat':'no-repeat'});
			
			this.children(".loaderAnimation").data("currentFrame",0);
			
			var self = this;
			var loadingInterval = setInterval(function() {
				if(self.data("loadStatus") == "loaded"){
					self.children(".loaderOverlay, .loaderAnimation").remove();
					clearInterval(loadingInterval);
				}
				var frame = self.children(".loaderAnimation").data("currentFrame");
				self.children(".loaderAnimation").css({'background-position':(-$(self).data("settings").loader.width*(frame%$(self).data("settings").loader.columns))+"px "+(-$(self).data("settings").loader.height*Math.floor(frame/$(self).data("settings").loader.columns))+"px"});
				self.children(".loaderAnimation").data("currentFrame",(frame+1)%($(self).data("settings").loader.rows*$(self).data("settings").loader.columns));
			}, 100);
		}
	}
	
	function verboseOut(out){
		this.trigger("verbose",out);
	}
		

		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.jsMovie' );
		}
		 
   };
   
})(jQuery);