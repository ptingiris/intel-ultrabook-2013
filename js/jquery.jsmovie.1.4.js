/**
 *	jsMovie
 *	@author Burkhardt & Schmidt Medienkommunikation GbR - Richard Burkhardt
 *	@version 1.4.2
 *
 *	This is a jQuery-plugin for jQuery 1.4+ (tested). This plugin enables you
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
 *	@param loadParallel - integer value that represents the amount of pictures that are parallely loaded
 *	@param repeat	-	boolean value enables or disables the auto repeat function
 *	@param playOnLoad		-	boolean value. if set to true the video atomaticly starts to play after the frames are loaded
 *	@param playBackwards	-	boolean value. if set to true the video plays backwards
 *	@param showPreLoader	-	boolean value. if set to true the preloader will be displayed
 *	@param verbose	-	boolean value. if set to true the player will trigger the verbose event
 *
 *	METHODS
 *	init 	      -	initialises the plugin	- $(".movie").jsMovie({});
 *	option	      -	sets an option	- $(".movie").jsMovie("option","repeat",true);
 *	realFps	      -	returns the real frames pre second	- $(".movie").jsMovie("realFps");
 *	play	      - $(".movie").jsMovie("play");
 *                - $(".movie").jsMovie("play",1,80,false,false);
 *					play_movie_event(e, fromFrame, toFrame, repeat, performStop){
 *	pause	      - $(".movie").jsMovie("pause");
 *	stop	      - $(".movie").jsMovie("stop");
 *	playUntil	  - $(".movie").jsMovie("playUntil",10); !DEPRECATED - use play instead
 *	nextFrame	  - $(".movie").jsMovie("nextFrame");
 *	previousFrame - $(".movie").jsMovie("previousFrame");
 *	playClip	  - $(".movie").jsMovie("playClip","startClip");
 *                - $(".movie").jsMovie("playClip",clip);
 *                - $(".movie").jsMovie("playClip",function(){return {start:10,end:20,pause:1000} });
 *                - $(".movie").jsMovie("playClip",3);
 *	playClips	  - $(".movie").jsMovie("playClips");
 *  addClip       - $(".movie").jsMovie("addClip","startClip",4,13,1000); - defines a clip with start frame 4 and end frame 12 with a pause of 1 second in the end
 *  getClip       - $(".movie").jsMovie("addClip"); - returns the clip object
 *  removeClip    - $(".movie").jsMovie("removeClip","startClip"); - returns an array with the clip objects
 *  getClipQueue  - $(".movie").jsMovie("getClipQueue")
 *	gotoFrame	  - $(".movie").jsMovie("gotoFrame",20);
 *	destroy	      - $(".movie").jsMovie("destroy");
 *	throwError	  - $(".movie").jsMovie("throwError",1);
 *
 *	EVENTS
 *	play	-	is triggered when the movie starts playing
 *	pause	-	is triggered when the movie pauses
 *	stop	-	is triggered when the movie stops
 *	ended	-	is triggered when a clip played its last frame
 *	playing	-	is triggered when the movie enters a frame
 *	loaded	-	is triggered when the movie has finished its loading process
 *	verbose	-	is triggered when the movie outputs a verbose, the callback has an extra argument like function(e,output){} which contains the text
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
        loader: {path: "/images/animation-loader.png",height:50,width:50,rows:2,columns:4},
        fps: 12,
        width: 640,
        height: 480,
        loadParallel: 5,
        repeat:true,
        playOnLoad:false,
        playBackwards:false,
        showPreLoader:false,
        verbose:true,
        clipQueue:[]
    };

    var methods = {
        /**
         * @param options
         */
        init : function(options) {

            //clone setting object for multible use
            _settings = $.extend(true, {}, settings);

            if (options != undefined) {
                $.extend( _settings, options );
            }

            return this.each(function(){
                var data = $(this).data("jsMovie");

                //no initialization has been done
                if(!data){
                    $(this).data("settings",_settings);
                    $(this).data("jsMovie",$(this));
                    //load images from sequence
                    if($(this).data("settings").sequence !== ''){
                        $(this).data("settings").images = [];
                        var findZero;
                        for(var sequence_no = $(this).data("settings").from; sequence_no <= $(this).data("settings").to; sequence_no = sequence_no+$(this).data("settings").step){
                            var digits = 1;
                            if(sequence_no > 0){
                                digits = (Math.floor(Math.log(sequence_no)/Math.log(10))+1);
								//alert(digits);
                            }
                            findZero = new RegExp("^(.*?)([#]{1,"+digits+"}?)([^#]+)","g");
							//alert(findZero);
                            var findZeroResult = findZero.exec($(this).data("settings").sequence);
                            $(this).data("settings").images.push((findZeroResult[1]+sequence_no+findZeroResult[3]).replace(/#/g,"0"));
                        }
                    }
                    //scale canvas
					//console.log($(this).data("settings").width);
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

        /**
         * @param option
         * @param value
         */
        option : function (option, value){

            if(value == undefined){
                return this.data("settings")[option];
            }else{
                this.data("settings")[option] = value;
                return this;
            }

        },

        /**
         * Returns the real frames per second reached by the script
         */
        realFps : function(){
            return $(this).data("realFps");
        },

        /**
         * @param int fromFrame The first frame
         * @param int toFrame The last frame
         * @param bool repeat Determine wether to loop this image sequence or not
         * @param bool performStop Determine wether to stop or to pause after the last frame - only if repeat is set to false
         */
        play : function(fromFrame,toFrame,repeat,performStop,fps,width,height){
            if(this.data("loadStatus") != "loaded"){
                var self = this;
                this.bind('loaded.playDeferrer',function(){
                    methods.play.apply(self,[fromFrame,toFrame,repeat,performStop,fps,width,height]);
                });
                return this;
            }

            if(fromFrame === undefined){
                fromFrame = 1;
            }

            if(toFrame === undefined){
                toFrame = $(this).data("settings").images.length*$(this).data("settings").grid.rows*$(this).data("settings").grid.columns;
            }

            if(repeat === undefined){
                repeat = $(this).data("settings").repeat;
            }

            if(performStop === undefined){
                performStop = true;
            }

            $(this).data("currentStatus","play");
            $(this).trigger("play",[fromFrame,toFrame,repeat,performStop,fps,width,height]);
            return this;
        },

        /**
         * Pause the image sequence
         */
        pause : function(){
            $(this).data("currentStatus","paused");
            $(this).trigger("pause");
            return this;
        },

        /**
         * Stop the image sequence -> causes it to jump to frame 1
         */
        stop : function(){
            $(this).data("currentStatus","stopped");
            $(this).trigger("stop");
            return this;
        },

        /**
         * Depricated ! use play(1,frame) instead
         */
        playUntil : function(frame) {
            methods.play.apply(this,[1,frame]);
            return this;
        },

        /**
         * Jumps to a certain frame
         * @param int frame The frame to jump to
         */
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

        /**
         * Goto the next frame
         */
        nextFrame : function(){
            if($(this).data("currentFrame").next('.jsMovieFrame').length == 0){
                $(this).data("frame0").show();
                $(this).data("currentFrame").hide();
                $(this).data("currentFrame",$(this).data("frame0"));
            }else{
                $(this).data("currentFrame").next().show();
                $(this).data("currentFrame").hide();
                //$(this).data("currentFrame",$(this).data("currentFrame").next());
				//andrea
				if($(this).data("currentFrame").data('frame') == $(this).data("settings").to){
					//stop at last frame
					//$(this).data("currentFrame",$(this).data("settings").to);
					//console.log($(this).data("currentFrame").data('frame'));
					//$(this).data("currentFrame",$(this).data("settings").to);
					//console.log($(this).data("settings").to);
					

				}else{
					$(this).data("currentFrame",$(this).data("currentFrame").next());
				}
            }
            return this;
        },

        /**
         * Goto the next previouse frame
         */
        previousFrame : function(){
            if($(this).data("currentFrame").data('frame') != 1){
                $(this).data("currentFrame").prev().show();
                $(this).data("currentFrame").hide();
                $(this).data("currentFrame",$(this).data("currentFrame").prev());
            }else{
                $(this).data("currentFrame").siblings('.jsMovieFrame').last().show();
                $(this).data("currentFrame").hide();
                $(this).data("currentFrame",$(this).data("currentFrame").siblings('.jsMovieFrame').last());
            }
            return this;
        },

        /**
         * Playes a certein defined clip
         * @param string clip The name of the clip
         * @param bool repeat Determine wether to loop this image sequence or not
         * @param bool performStop Determine wether to stop or to pause after the last frame - only if repeat is set to false
         */
        playClip : function(clip,repeat,performStop,fps,width,height){
            if(repeat === undefined){
                repeat = $(this).data("settings").repeat;
            }

            if(clip === undefined){
                methods.play.apply(this);
            }

            if(performStop === undefined){
                performStop = true;
            }

            if(typeof clip == 'object'){
                _clip = clip;
            }
            if(typeof clip == 'string'){
                _clip = methods.getClip.apply(this,[clip]);
            }
            if(typeof clip == 'function'){
                _clip = clip();
            }
            if(typeof clip == 'number'){
                if(clip < 0){
                    clip = 0;
                }
                if(clip > this.data("settings").clipQueue.length){
                    clip = this.data("settings").clipQueue.length-1;
                }
                _clip = this.data("settings").clipQueue[parseInt(clip)];
            }

            if(_clip){
                if(this.data("settings").playBackwards){
                    methods.gotoFrame.apply(this,[_clip.end]);
                }else{
                    methods.gotoFrame.apply(this,[_clip.start]);
                }
                methods.play.apply(this,[_clip.start,_clip.end,repeat,performStop,fps,width,height]);
            }else{
                methods.throwError(3);
            }

            return this;
        },

        /**
         * Plays all clips after another
         */
        playClips : function(){
            var self = this;
            if(this.data("settings").clipQueue.length < 1){
                methods.play.apply(this);
            }else{
                if(this.data("currentClip") === undefined){
                    this.data("currentClip",self.data("settings").playBackwards?self.data("settings").clipQueue.length-1:0);
                }

                var _previousClip = this.data("settings").clipQueue[this.data("currentClip") <= 0?this.data("settings").clipQueue.length-1:this.data("currentClip")-1]

                var _currentClip = this.data("settings").clipQueue[this.data("currentClip")];
                methods.playClip.apply(this,[this.data("currentClip"),false]);

                this.bind("ended.playClips",function(e){
                    $(this).unbind(".playClips");
                    if(!(_currentClip.pause > 0)){
                        _currentClip.pause = 0
                    }
                    methods.gotoFrame.apply($(this),[self.data("settings").playBackwards?_currentClip.start:_currentClip.end]);

                    setTimeout(function(){
                        if(self.data("settings").playBackwards){
                            if(self.data("settings").repeat){
                                self.data("currentClip",self.data("currentClip")<=0?self.data("settings").clipQueue.length-1:self.data("currentClip")-1);
                                methods.playClips.apply(self);
                            }else{
                                if(self.data("currentClip")>0){
                                    self.data("currentClip",self.data("currentClip")-1);
                                    methods.playClips.apply(self);
                                }
                            }
                        }else{
                            if(self.data("settings").repeat){
                                self.data("currentClip",self.data("currentClip")==self.data("settings").clipQueue.length-1?0:self.data("currentClip")+1);
                                methods.playClips.apply(self);
                            }else{
                                if(self.data("currentClip") < self.data("settings").clipQueue.length-1){
                                    self.data("currentClip",self.data("currentClip")+1);
                                    methods.playClips.apply(self);
                                }
                            }
                        }
                    },$(this).data("settings").playBackwards?_previousClip.pause:_currentClip.pause);
                })
            }
        },

        /**
         * @param string name The name of the clip
         * @param int start The starting frame
         * @param int end The endframe
         * @param bool pause Declare a pause after the clip before playing the next one
         * @param int insertAt The index where to insert the clip in the clip queue
         */
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

        /**
         * Get The clipobject by name
         * @param string name The clip objects name
         */
        getClip : function(name){
            for(var i in $(this).data("settings").clipQueue){
                if($(this).data("settings").clipQueue[i].name == name){
                    return $(this).data("settings").clipQueue[i];
                }
            }
            return undefined;
        },

        /**
         * deletes a clip object
         * @param object|string clip
         */
        removeClip : function(clip){
            for(var i in $(this).data("settings").clipQueue){
                if($(this).data("settings").clipQueue[i].name == clip || $(this).data("settings").clipQueue[i] === clip){
                    // retrun the clip and unset it in the queue
                }
            }
            return this;
        },

        /**
         * @return array An array of objects
         */
        getClipQueue : function(){
            return $(this).data("settings").clipQueue;
        },

        /**
         * destroys this
         */
        destroy : function(){
            return this.each(function(){
                $(this).children().remove();
                $(this).css($(this).data("restoreCss"));
                clearInterval($(this).data("playingInterval"));
                $(this).removeData();
            });

        },

        /**
         * @param int errno The error that is to be thrown
         */
        throwError : function(errno){
            var error = "";
            if(errno != undefined){
                if(errno == 1){
                    error = "This Objekt has already been initialized!";
                }else if(errno == 2){
                    error = "Clip out of Range!";
                }else if(errno == 3){
                    error = "Clip not Found!";
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

            return this;
        }


    };

    /*Eventhandler*/
    function play_movie_event(e, fromFrame, toFrame, repeat, performStop,fps,width,height){
		//console.log(fps);

		if(width === undefined){
            width = $(this).data("settings").width;
        }	
		
		if(height === undefined){
            height = $(this).data("settings").height;
        }	
		// AM
		// re-adjusts the divs (if necessary)
		// this is called right now for the particles onyl
		// I extended the plugin for the particle area to not destroy and recreate, but pass in new values to this event.
		//console.log(width);
		//$(this).find(".jsMovieFrame").css({width:width, height:height, overflow:'visible',border: "solid 1px red"});
		//$(this).css({width:width, height:height, overflow:'hidden',border: "solid 1px blue"});

        //HARDCODE to max width, overflow handled elsewhere
		$(this).find(".jsMovieFrame").css({width:800, height:height, overflow:'visible'});
		$(this).css({width:800, height:height, overflow:'hidden', visibility:'hidden'});
        
		if(fps === undefined){
            fps = $(this).data("settings").fps;
        }
		
        if(fromFrame === undefined || fromFrame < 1){
            fromFrame = 1;
        }

        if(toFrame === undefined || toFrame > $(this).data("settings").images.length*$(this).data("settings").grid.rows*$(this).data("settings").grid.columns){
            toFrame = $(this).data("settings").images.length*$(this).data("settings").grid.rows*$(this).data("settings").grid.columns;
        }

        if(repeat === undefined){
            repeat = $(this).data("settings").repeat
        }

        if(performStop === undefined){
            performStop = true;
        }

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
                    if($(self).data("currentFrame").data('frame') == fromFrame && !repeat){
                        if(performStop){
                            $(self).trigger('stop');
                        }else{
                            $(self).trigger('pause');
                        }
                        $(self).trigger('ended');
                    }else{
                        $(self).trigger('playing');
                        if($(self).data("currentFrame").data('frame') != fromFrame){
                            methods.previousFrame.apply($(self));
                        }else{
                            methods.gotoFrame.apply($(self),[toFrame]);
                        }
                    }
                }else{

                    if($(self).data("currentFrame").data('frame') == toFrame && !repeat){
                        if(performStop){
                            $(self).trigger('stop');
							methods.gotoFrame.apply($(self),[toFrame]);
							//console.log ('here' + fromFrame);
                        }else{
                            $(self).trigger('pause');
                        }
						$(self).trigger('ended');
                    }else{
                        $(self).trigger('playing');
                        if($(self).data("currentFrame").data('frame') != toFrame){
                            methods.nextFrame.apply($(self));
                        }else{
                            methods.gotoFrame.apply($(self),[fromFrame]);
                        }
                    }
                }

            }, 1000/fps));
        }
        // else {
            var lastWidth = $(this).data("lastWidth");
            $(this).css({visibility:'visible'});
            $("#movie").css({width:lastWidth});
            TweenLite.set($("#trm-pov-badge-star1"), {left:lastWidth});
            //TweenLite.set($("#movie"), {width:lastWidth});
            $(this).data("lastWidth",width);
        //}
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
                preloadImages.apply($(this),[loadParralelCount]);
            }
            return;
        }

        if(imageToLoad > this.data("settings").images.length){
            this.data("loadStatus","loaded");
            this.trigger("loaded");
            if(this.data("settings").playOnLoad){
                methods.play.apply($(this));
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
            preloadImages.apply($(self),[imageToLoad+self.data('settings').loadParallel]);
            //verbose
            verboseOut.apply(self,["Image #"+(imageToLoad)+" has been loaded"]);
            refreshLoaderPosition.apply($(self));
        }
        curImg.src = $(this).data("settings").folder+$(this).data("settings").images[imageToLoad-1];
        /*FOR THE BROWSERS THAT DON'T JUST PRELOAD ON INSTANCIATION LIKE OPERA,CHROME - THEY ONLY CACHE VISIBLE BACKGROUNDIMAGES*/
        $('#jsMovie_image_preload_container').append(curImg);
        $(curImg).css({height:"1px",width:"1px"});

    }

    function animatePrelaoder(){
        if(this.data("loadStatus") != "loaded" && $(this).data("settings").showPreLoader){
            this
                .append("<div class='laoderOverlay' />")
                .children(".laoderOverlay")
                .css({/*"background-color":"black",*/
                    opacity:0.1,
                    height:this.height()+"px",
                    width:this.width()+"px",
                    position:'absolute',
                    top:this.offset().top+"px",
                    left:this.offset().left+"px"});
            this
                .append("<div class='laoderAnimation' />")
                .children(".laoderAnimation")
                .css({"background-image":"url("+$(this).data("settings").loader.path+")",
                    height:$(this).data("settings").loader.height+"px",
                    width:$(this).data("settings").loader.width+"px",
                    position:'absolute',
					  top:"200px",
					  left:"380px",					  
					  //top:(this.offset().top+(this.height()/2)-($(this).data("settings").loader.height/2))+"px",
					  //left:(this.offset().left+(this.width()/2)-($(this).data("settings").loader.width/2))+"px",
					  'background-repeat':'no-repeat'});
            this.children(".laoderAnimation").data("currentFrame",0);

            var self = this;
            var loadingInterval = setInterval(function() {
                if(self.data("loadStatus") == "loaded"){
                    self.children(".laoderOverlay, .laoderAnimation").remove();
                    clearInterval(loadingInterval);
                }
                var frame = self.children(".laoderAnimation").data("currentFrame");
                self.children(".laoderAnimation").css({'background-position':(-$(self).data("settings").loader.width*(frame%$(self).data("settings").loader.columns))+"px "+(-$(self).data("settings").loader.height*Math.floor(frame/$(self).data("settings").loader.columns))+"px"});
                self.children(".laoderAnimation").data("currentFrame",(frame+1)%($(self).data("settings").loader.rows*$(self).data("settings").loader.columns));
                refreshLoaderPosition.apply($(self));
            }, 100);
        }
    }

    function refreshLoaderPosition(){
        this.children(".laoderOverlay").css({top:this.offset().top+"px",left:this.offset().left+"px"});
		this.children(".laoderAnimation").css({top:"200px",left:"380px"});		
        //this.children(".laoderAnimation").css({top:(this.offset().top+(this.height()/2)-($(this).data("settings").loader.height/2))+"px",left:(this.offset().left+(this.width()/2)-($(this).data("settings").loader.width/2))+"px"});
    }

    function verboseOut(out){
        this.trigger("verbose",out);
    }



        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply(this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.jsMovie' );
        }
		this.data("loadStatus") = "";
    };

})(jQuery);
