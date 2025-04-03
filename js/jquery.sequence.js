/* jQuery Sequence Animator
 * Animates a sequence of PNG files with some limited options.
 * @author Calvin Lai
 * @email callai@gmail.com 
 * @copyright 2012 Calvin Lai
	
  LICENSED UNDER MIT

  Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:
	
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function($){

  //Animates PNG sequences.
  function Sequence(el, options) {
    //Defaults
    this.defaults = {
      name: '',
      fps: 30,
      repeat: false,
      preload: false,
      imageClassName: null,
      complete: function(){},
      step: function(){},
      start: function(){}
    };
    this.opts = $.extend({}, this.defaults, options);
    this.$el = $(el);

    this.totalFrames = 0;
    this.currentFrame = 0;
  }

  Sequence.prototype = {

    init: function() {
      var _this = this;

      // get all frames and hide each one
      var elem = _this.$el;

      _this.frames = $('img' + (_this.opts.imageClassName != null ? '.' + _this.opts.imageClassName : ''), elem);
      _this.totalFrames = _this.frames.length;

      if (_this.opts.preload) {
        var images = [];
        for (var i = 0; i < _this.frames.length; i++) {
          var frame = _this.frames[i];
          images.push(frame.attr('src'));
        }
        _this.preload(images);
      } else {
        _this.start();
      }
    },

    start: function() {
      var _this = this;

      if (typeof _this.opts.start == 'function') {
        _this.opts.start(_this.frames.length);
      }

      _this.anim = setInterval(function(){

        _this.showFrame(_this.currentFrame + 1);

      }, 1000 / _this.opts.fps);

    },

    next: function() {
      var _this = this;
      var nextFrame = _this.currentFrame + 1;

      if (nextFrame < _this.totalFrames) {
        _this.showFrame(nextFrame);
      }

    },

    prev: function() {
      var _this = this;
      var prevFrame = _this.currentFrame - 1;

      if (prevFrame != 0) {
        _this.showFrame(prevFrame);
      }

    },

    showFrame: function(newFrame) {
      var _this = this;
      var currentFrame = _this.currentFrame;

      if (typeof _this.opts.step == 'function') {
        _this.opts.step(_this.frames[currentFrame], newFrame, _this.totalFrames);
      }

      // show the next frame
      $(_this.frames[newFrame]).css('display', 'block');

      // hide the current frame, except for the last frame
      if (newFrame!= _this.frames.length) {
        $(_this.frames[currentFrame]).css('display', 'none');
      }

      // end the animation after last frame is reached
      if (currentFrame == _this.frames.length) {

        _this.stop();

        // callback
        if (typeof _this.opts.complete == 'function') {
          _this.opts.complete(_this.$el);
        }
        return;
      }

      _this.currentFrame = newFrame;
    },

    stop: function() {
      var _this = this;
      window.clearInterval(_this.anim);

      if (_this.opts.repeat) {
        // also hide the last frame if we're repeating.
        $(_this.frames[_this.frames.length - 1]).css('display', 'none');
        _this.currentFrame = 0;
        _this.start();
      }

    },


    /* preload()
     * Preloads images specified as an array of relative paths.
     */
    preload: function(sources) {
      var _this = this;
      for (var i = 0, loaded = 0; i < sources.length; ++i) {
        // insert each image into the dom to preload them
        $('<img />').on('load', function() {
          loaded++;
          if (loaded >= sources.length) {
            _this.start();
          }
        }).attr('src', sources[i]).appendTo('body').css('display','none');
      }
    }

  };

  $.fn.sequence = function(options) {
    if (this.length) {
      this.each(function() {
        if (typeof options == 'string') {
          var rev = $(this).data('sequence');
          if (typeof rev != 'undefined') {
            rev[options]();
          }
        } else {
          var rev = new Sequence(this, options);
          rev.init();
          $(this).data('sequence', rev);
        }
      });
    }
  };
})(jQuery);

