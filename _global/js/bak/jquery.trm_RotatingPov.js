//REQUIRES JQUERY, JQUERY CYCLE PLUGIN FOUND AT http://jquery.malsup.com/cycle/pager.html
(function(e,c){function h(b){e.fn.cycle.debug&&a(b)}function a(){window.console&&console.log&&console.log("[cycle] "+Array.prototype.join.call(arguments," "))}function j(b,g,a){var d=e(b).data("cycle.opts"),c=!!b.cyclePause;c&&d.paused?d.paused(b,d,g,a):!c&&d.resumed&&d.resumed(b,d,g,a)}function i(b,g,k){function d(b,g,k){if(!b&&!0===g){b=e(k).data("cycle.opts");if(!b)return a("options not found, can not resume"),!1;if(k.cycleTimeout)clearTimeout(k.cycleTimeout),k.cycleTimeout=0;t(b.elements,b,1,
!b.backwards)}}if(b.cycleStop==c)b.cycleStop=0;if(g===c||null===g)g={};if(g.constructor==String)switch(g){case "destroy":case "stop":k=e(b).data("cycle.opts");if(!k)return!1;b.cycleStop++;b.cycleTimeout&&clearTimeout(b.cycleTimeout);b.cycleTimeout=0;k.elements&&e(k.elements).stop();e(b).removeData("cycle.opts");"destroy"==g&&l(k);return!1;case "toggle":return b.cyclePause=1===b.cyclePause?0:1,d(b.cyclePause,k,b),j(b),!1;case "pause":return b.cyclePause=1,j(b),!1;case "resume":return b.cyclePause=
0,d(!1,k,b),j(b),!1;case "prev":case "next":k=e(b).data("cycle.opts");if(!k)return a('options not found, "prev/next" ignored'),!1;e.fn.cycle[g](k);return!1;default:g={fx:g}}else if(g.constructor==Number){var i=g,g=e(b).data("cycle.opts");if(!g)return a("options not found, can not advance slide"),!1;if(0>i||i>=g.elements.length)return a("invalid slide index: "+i),!1;g.nextSlide=i;if(b.cycleTimeout)clearTimeout(b.cycleTimeout),b.cycleTimeout=0;if("string"==typeof k)g.oneTimeFx=k;t(g.elements,g,1,i>=
g.currSlide);return!1}return g}function d(b,g){if(!e.support.opacity&&g.cleartype&&b.style.filter)try{b.style.removeAttribute("filter")}catch(a){}}function l(b){b.next&&e(b.next).unbind(b.prevNextEvent);b.prev&&e(b.prev).unbind(b.prevNextEvent);if(b.pager||b.pagerAnchorBuilder)e.each(b.pagerAnchors||[],function(){this.unbind().remove()});b.pagerAnchors=null;b.destroy&&b.destroy(b)}function n(b,g,k,i,z){var q,f=e.extend({},e.fn.cycle.defaults,i||{},e.metadata?b.metadata():e.meta?b.data():{}),h=e.isFunction(b.data)?
b.data(f.metaAttr):null;h&&(f=e.extend(f,h));if(f.autostop)f.countdown=f.autostopCount||k.length;var l=b[0];b.data("cycle.opts",f);f.$cont=b;f.stopCount=l.cycleStop;f.elements=k;f.before=f.before?[f.before]:[];f.after=f.after?[f.after]:[];!e.support.opacity&&f.cleartype&&f.after.push(function(){d(this,f)});f.continuous&&f.after.push(function(){t(k,f,0,!f.backwards)});m(f);!e.support.opacity&&f.cleartype&&!f.cleartypeNoBg&&r(g);"static"==b.css("position")&&b.css("position","relative");f.width&&b.width(f.width);
f.height&&"auto"!=f.height&&b.height(f.height);f.startingSlide!=c?(f.startingSlide=parseInt(f.startingSlide,10),f.startingSlide>=k.length||0>f.startSlide?f.startingSlide=0:q=!0):f.startingSlide=f.backwards?k.length-1:0;if(f.random){f.randomMap=[];for(h=0;h<k.length;h++)f.randomMap.push(h);f.randomMap.sort(function(){return Math.random()-0.5});if(q)for(q=0;q<k.length;q++){if(f.startingSlide==f.randomMap[q])f.randomIndex=q}else f.randomIndex=1,f.startingSlide=f.randomMap[1]}else if(f.startingSlide>=
k.length)f.startingSlide=0;f.currSlide=f.startingSlide||0;var o=f.startingSlide;g.css({position:"absolute",top:0,left:0}).hide().each(function(b){b=f.backwards?o?b<=o?k.length+(b-o):o-b:k.length-b:o?b>=o?k.length-(b-o):o-b:k.length-b;e(this).css("z-index",b)});e(k[o]).css("opacity",1).show();d(k[o],f);f.fit&&(f.aspect?g.each(function(){var b=e(this),g=!0===f.aspect?b.width()/b.height():f.aspect;f.width&&b.width()!=f.width&&(b.width(f.width),b.height(f.width/g));f.height&&b.height()<f.height&&(b.height(f.height),
b.width(f.height*g))}):(f.width&&g.width(f.width),f.height&&"auto"!=f.height&&g.height(f.height)));f.center&&(!f.fit||f.aspect)&&g.each(function(){var b=e(this);b.css({"margin-left":f.width?(f.width-b.width())/2+"px":0,"margin-top":f.height?(f.height-b.height())/2+"px":0})});f.center&&!f.fit&&!f.slideResize&&g.each(function(){var b=e(this);b.css({"margin-left":f.width?(f.width-b.width())/2+"px":0,"margin-top":f.height?(f.height-b.height())/2+"px":0})});if(f.containerResize&&!b.innerHeight()){for(var n=
h=q=0;n<k.length;n++){var v=e(k[n]),w=v[0],u=v.outerWidth(),x=v.outerHeight();u||(u=w.offsetWidth||w.width||v.attr("width"));x||(x=w.offsetHeight||w.height||v.attr("height"));q=u>q?u:q;h=x>h?x:h}0<q&&0<h&&b.css({width:q+"px",height:h+"px"})}var B=!1;f.pause&&b.hover(function(){B=!0;this.cyclePause++;j(l,!0)},function(){B&&this.cyclePause--;j(l,!0)});if(!1===s(f))return!1;var C=!1;i.requeueAttempts=i.requeueAttempts||0;g.each(function(){var b=e(this);this.cycleH=f.fit&&f.height?f.height:b.height()||
this.offsetHeight||this.height||b.attr("height")||0;this.cycleW=f.fit&&f.width?f.width:b.width()||this.offsetWidth||this.width||b.attr("width")||0;if(b.is("img")){var b=e.browser.mozilla&&34==this.cycleW&&19==this.cycleH&&!this.complete,g=e.browser.opera&&(42==this.cycleW&&19==this.cycleH||37==this.cycleW&&17==this.cycleH)&&!this.complete,k=0==this.cycleH&&0==this.cycleW&&!this.complete;if(e.browser.msie&&28==this.cycleW&&30==this.cycleH&&!this.complete||b||g||k){if(z.s&&f.requeueOnImageNotLoaded&&
100>++i.requeueAttempts)return a(i.requeueAttempts," - img slide not loaded, requeuing slideshow: ",this.src,this.cycleW,this.cycleH),setTimeout(function(){e(z.s,z.c).cycle(i)},f.requeueTimeout),C=!0,!1;a("could not determine size of image: "+this.src,this.cycleW,this.cycleH)}}return!0});if(C)return!1;f.cssBefore=f.cssBefore||{};f.cssAfter=f.cssAfter||{};f.cssFirst=f.cssFirst||{};f.animIn=f.animIn||{};f.animOut=f.animOut||{};g.not(":eq("+o+")").css(f.cssBefore);e(g[o]).css(f.cssFirst);if(f.timeout){f.timeout=
parseInt(f.timeout,10);if(f.speed.constructor==String)f.speed=e.fx.speeds[f.speed]||parseInt(f.speed,10);f.sync||(f.speed/=2);for(q="none"==f.fx?0:"shuffle"==f.fx?500:250;f.timeout-f.speed<q;)f.timeout+=f.speed}if(f.easing)f.easeIn=f.easeOut=f.easing;if(!f.speedIn)f.speedIn=f.speed;if(!f.speedOut)f.speedOut=f.speed;f.slideCount=k.length;f.currSlide=f.lastSlide=o;if(f.random){if(++f.randomIndex==k.length)f.randomIndex=0;f.nextSlide=f.randomMap[f.randomIndex]}else f.nextSlide=f.backwards?0==f.startingSlide?
k.length-1:f.startingSlide-1:f.startingSlide>=k.length-1?0:f.startingSlide+1;if(!f.multiFx)if(q=e.fn.cycle.transitions[f.fx],e.isFunction(q))q(b,g,f);else if("custom"!=f.fx&&!f.multiFx)return a("unknown transition: "+f.fx,"; slideshow terminating"),!1;b=g[o];f.skipInitializationCallbacks||(f.before.length&&f.before[0].apply(b,[b,b,f,!0]),f.after.length&&f.after[0].apply(b,[b,b,f,!0]));f.next&&e(f.next).bind(f.prevNextEvent,function(){return y(f,1)});f.prev&&e(f.prev).bind(f.prevNextEvent,function(){return y(f,
0)});(f.pager||f.pagerAnchorBuilder)&&A(k,f);D(f,k);return f}function m(b){b.original={before:[],after:[]};b.original.cssBefore=e.extend({},b.cssBefore);b.original.cssAfter=e.extend({},b.cssAfter);b.original.animIn=e.extend({},b.animIn);b.original.animOut=e.extend({},b.animOut);e.each(b.before,function(){b.original.before.push(this)});e.each(b.after,function(){b.original.after.push(this)})}function s(b){var g,k,d=e.fn.cycle.transitions;if(0<b.fx.indexOf(",")){b.multiFx=!0;b.fxs=b.fx.replace(/\s*/g,
"").split(",");for(g=0;g<b.fxs.length;g++){var i=b.fxs[g];k=d[i];if(!k||!d.hasOwnProperty(i)||!e.isFunction(k))a("discarding unknown transition: ",i),b.fxs.splice(g,1),g--}if(!b.fxs.length)return a("No valid transitions named; slideshow terminating."),!1}else if("all"==b.fx)for(p in b.multiFx=!0,b.fxs=[],d)k=d[p],d.hasOwnProperty(p)&&e.isFunction(k)&&b.fxs.push(p);if(b.multiFx&&b.randomizeEffects){k=Math.floor(20*Math.random())+30;for(g=0;g<k;g++)d=Math.floor(Math.random()*b.fxs.length),b.fxs.push(b.fxs.splice(d,
1)[0]);h("randomized fx sequence: ",b.fxs)}return!0}function D(b,g){b.addSlide=function(a,d){var i=e(a),c=i[0];b.autostopCount||b.countdown++;g[d?"unshift":"push"](c);if(b.els)b.els[d?"unshift":"push"](c);b.slideCount=g.length;b.random&&(b.randomMap.push(b.slideCount-1),b.randomMap.sort(function(){return Math.random()-0.5}));i.css("position","absolute");i[d?"prependTo":"appendTo"](b.$cont);d&&(b.currSlide++,b.nextSlide++);!e.support.opacity&&b.cleartype&&!b.cleartypeNoBg&&r(i);b.fit&&b.width&&i.width(b.width);
b.fit&&b.height&&"auto"!=b.height&&i.height(b.height);c.cycleH=b.fit&&b.height?b.height:i.height();c.cycleW=b.fit&&b.width?b.width:i.width();i.css(b.cssBefore);(b.pager||b.pagerAnchorBuilder)&&e.fn.cycle.createPagerAnchor(g.length-1,c,e(b.pager),g,b);if(e.isFunction(b.onAddSlide))b.onAddSlide(i);else i.hide()}}function t(b,g,a,d){function i(){var a=0;g.timeout&&!g.continuous?(a=u(b[g.currSlide],b[g.nextSlide],g,d),"shuffle"==g.fx&&(a-=g.speedOut)):g.continuous&&j.cyclePause&&(a=10);if(0<a)j.cycleTimeout=
setTimeout(function(){t(b,g,0,!g.backwards)},a)}if(a&&g.busy&&g.manualTrump)h("manualTrump in go(), stopping active transition"),e(b).stop(!0,!0),g.busy=0;if(g.busy)h("transition active, ignoring new tx request");else{var j=g.$cont[0],f=b[g.currSlide],l=b[g.nextSlide];if(!(j.cycleStop!=g.stopCount||0===j.cycleTimeout&&!a))if(!a&&!j.cyclePause&&!g.bounce&&(g.autostop&&0>=--g.countdown||g.nowrap&&!g.random&&g.nextSlide<g.currSlide))g.end&&g.end(g);else{var n=!1;if((a||!j.cyclePause)&&g.nextSlide!=g.currSlide){var n=
!0,o=g.fx;f.cycleH=f.cycleH||e(f).height();f.cycleW=f.cycleW||e(f).width();l.cycleH=l.cycleH||e(l).height();l.cycleW=l.cycleW||e(l).width();if(g.multiFx){if(d&&(g.lastFx==c||++g.lastFx>=g.fxs.length))g.lastFx=0;else if(!d&&(g.lastFx==c||0>--g.lastFx))g.lastFx=g.fxs.length-1;o=g.fxs[g.lastFx]}if(g.oneTimeFx)o=g.oneTimeFx,g.oneTimeFx=null;e.fn.cycle.resetState(g,o);g.before.length&&e.each(g.before,function(b,a){j.cycleStop==g.stopCount&&a.apply(l,[f,l,g,d])});var m=function(){g.busy=0;e.each(g.after,
function(b,a){j.cycleStop==g.stopCount&&a.apply(l,[f,l,g,d])});j.cycleStop||i()};h("tx firing("+o+"); currSlide: "+g.currSlide+"; nextSlide: "+g.nextSlide);g.busy=1;if(g.fxFn)g.fxFn(f,l,g,m,d,a&&g.fastOnEvent);else if(e.isFunction(e.fn.cycle[g.fx]))e.fn.cycle[g.fx](f,l,g,m,d,a&&g.fastOnEvent);else e.fn.cycle.custom(f,l,g,m,d,a&&g.fastOnEvent)}else i();if(n||g.nextSlide==g.currSlide)if(g.lastSlide=g.currSlide,g.random){g.currSlide=g.nextSlide;if(++g.randomIndex==b.length)g.randomIndex=0,g.randomMap.sort(function(){return Math.random()-
0.5});g.nextSlide=g.randomMap[g.randomIndex];if(g.nextSlide==g.currSlide)g.nextSlide=g.currSlide==g.slideCount-1?0:g.currSlide+1}else g.backwards?(a=0>g.nextSlide-1)&&g.bounce?(g.backwards=!g.backwards,g.nextSlide=1,g.currSlide=0):(g.nextSlide=a?b.length-1:g.nextSlide-1,g.currSlide=a?0:g.nextSlide+1):(a=g.nextSlide+1==b.length)&&g.bounce?(g.backwards=!g.backwards,g.nextSlide=b.length-2,g.currSlide=b.length-1):(g.nextSlide=a?0:g.nextSlide+1,g.currSlide=a?b.length-1:g.nextSlide-1);n&&g.pager&&g.updateActivePagerLink(g.pager,
g.currSlide,g.activePagerClass)}}}function u(b,a,e,d){if(e.timeoutFn){for(b=e.timeoutFn.call(b,b,a,e,d);"none"!=e.fx&&250>b-e.speed;)b+=e.speed;h("calculated timeout: "+b+"; speed: "+e.speed);if(!1!==b)return b}return e.timeout}function y(b,a){var d=a?1:-1,i=b.elements,c=b.$cont[0],j=c.cycleTimeout;if(j)clearTimeout(j),c.cycleTimeout=0;if(b.random&&0>d){b.randomIndex--;if(-2==--b.randomIndex)b.randomIndex=i.length-2;else if(-1==b.randomIndex)b.randomIndex=i.length-1;b.nextSlide=b.randomMap[b.randomIndex]}else if(b.random)b.nextSlide=
b.randomMap[b.randomIndex];else if(b.nextSlide=b.currSlide+d,0>b.nextSlide){if(b.nowrap)return!1;b.nextSlide=i.length-1}else if(b.nextSlide>=i.length){if(b.nowrap)return!1;b.nextSlide=0}c=b.onPrevNextEvent||b.prevNextClick;e.isFunction(c)&&c(0<d,b.nextSlide,i[b.nextSlide]);t(i,b,1,a);return!1}function A(b,a){var d=e(a.pager);e.each(b,function(i,c){e.fn.cycle.createPagerAnchor(i,c,d,b,a)});a.updateActivePagerLink(a.pager,a.startingSlide,a.activePagerClass)}function r(b){function a(b){b=parseInt(b,
10).toString(16);return 2>b.length?"0"+b:b}function d(b){for(;b&&"html"!=b.nodeName.toLowerCase();b=b.parentNode){var i=e.css(b,"background-color");if(i&&0<=i.indexOf("rgb"))return b=i.match(/\d+/g),"#"+a(b[0])+a(b[1])+a(b[2]);if(i&&"transparent"!=i)return i}return"#ffffff"}h("applying clearType background-color hack");b.each(function(){e(this).css("background-color",d(this))})}if(e.support==c)e.support={opacity:!e.browser.msie};e.expr[":"].paused=function(b){return b.cyclePause};e.fn.cycle=function(b,
g){var d={s:this.selector,c:this.context};if(0===this.length&&"stop"!=b){if(!e.isReady&&d.s)return a("DOM not ready, queuing slideshow"),e(function(){e(d.s,d.c).cycle(b,g)}),this;a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)"));return this}return this.each(function(){var c=i(this,b,g);if(!1!==c){c.updateActivePagerLink=c.updateActivePagerLink||e.fn.cycle.updateActivePagerLink;this.cycleTimeout&&clearTimeout(this.cycleTimeout);this.cycleTimeout=this.cyclePause=0;
var j=e(this),l=c.slideExpr?e(c.slideExpr,this):j.children(),f=l.get(),m=n(j,l,f,c,d);if(!1!==m)if(2>f.length)a("terminating; too few slides: "+f.length);else if(j=m.continuous?10:u(f[m.currSlide],f[m.nextSlide],m,!m.backwards))j+=m.delay||0,10>j&&(j=10),h("first timeout: "+j),this.cycleTimeout=setTimeout(function(){t(f,m,0,!c.backwards)},j)}})};e.fn.cycle.resetState=function(b,a){a=a||b.fx;b.before=[];b.after=[];b.cssBefore=e.extend({},b.original.cssBefore);b.cssAfter=e.extend({},b.original.cssAfter);
b.animIn=e.extend({},b.original.animIn);b.animOut=e.extend({},b.original.animOut);b.fxFn=null;e.each(b.original.before,function(){b.before.push(this)});e.each(b.original.after,function(){b.after.push(this)});var d=e.fn.cycle.transitions[a];e.isFunction(d)&&d(b.$cont,e(b.elements),b)};e.fn.cycle.updateActivePagerLink=function(b,a,d){e(b).each(function(){e(this).children().removeClass(d).eq(a).addClass(d)})};e.fn.cycle.next=function(b){y(b,1)};e.fn.cycle.prev=function(b){y(b,0)};e.fn.cycle.createPagerAnchor=
function(b,a,d,i,c){e.isFunction(c.pagerAnchorBuilder)?(a=c.pagerAnchorBuilder(b,a),h("pagerAnchorBuilder("+b+", el) returned: "+a)):a='<a href="#">'+(b+1)+"</a>";if(a){var l=e(a);if(0===l.parents("body").length){var f=[];1<d.length?(d.each(function(){var b=l.clone(!0);e(this).append(b);f.push(b[0])}),l=e(f)):l.appendTo(d)}c.pagerAnchors=c.pagerAnchors||[];c.pagerAnchors.push(l);d=function(a){a.preventDefault();c.nextSlide=b;var a=c.$cont[0],f=a.cycleTimeout;if(f)clearTimeout(f),a.cycleTimeout=0;
a=c.onPagerEvent||c.pagerClick;e.isFunction(a)&&a(c.nextSlide,i[c.nextSlide]);t(i,c,1,c.currSlide<b)};/mouseenter|mouseover/i.test(c.pagerEvent)?l.hover(d,function(){}):l.bind(c.pagerEvent,d);!/^click/.test(c.pagerEvent)&&!c.allowPagerClickBubble&&l.bind("click.cycle",function(){return!1});var m=c.$cont[0],n=!1;c.pauseOnPagerHover&&l.hover(function(){n=!0;m.cyclePause++;j(m,!0,!0)},function(){n&&m.cyclePause--;j(m,!0,!0)})}};e.fn.cycle.hopsFromLast=function(b,a){var e=b.lastSlide,d=b.currSlide;return a?
d>e?d-e:b.slideCount-e:d<e?e-d:e+b.slideCount-d};e.fn.cycle.commonReset=function(b,a,d,c,i,j){e(d.elements).not(b).hide();if("undefined"==typeof d.cssBefore.opacity)d.cssBefore.opacity=1;d.cssBefore.display="block";if(d.slideResize&&!1!==c&&0<a.cycleW)d.cssBefore.width=a.cycleW;if(d.slideResize&&!1!==i&&0<a.cycleH)d.cssBefore.height=a.cycleH;d.cssAfter=d.cssAfter||{};d.cssAfter.display="none";e(b).css("zIndex",d.slideCount+(!0===j?1:0));e(a).css("zIndex",d.slideCount+(!0===j?0:1))};e.fn.cycle.custom=
function(b,a,d,c,i,j){var f=e(b),h=e(a),l=d.speedIn,b=d.speedOut,m=d.easeIn,a=d.easeOut;h.css(d.cssBefore);j&&(l="number"==typeof j?b=j:b=1,m=a=null);var n=function(){h.animate(d.animIn,l,m,function(){c()})};f.animate(d.animOut,b,a,function(){f.css(d.cssAfter);d.sync||n()});d.sync&&n()};e.fn.cycle.transitions={fade:function(b,a,d){a.not(":eq("+d.currSlide+")").css("opacity",0);d.before.push(function(b,a,d){e.fn.cycle.commonReset(b,a,d);d.cssBefore.opacity=0});d.animIn={opacity:1};d.animOut={opacity:0};
d.cssBefore={top:0,left:0}}};e.fn.cycle.ver=function(){return"2.9999"};e.fn.cycle.defaults={activePagerClass:"activeSlide",after:null,allowPagerClickBubble:!1,animIn:null,animOut:null,aspect:!1,autostop:0,autostopCount:0,backwards:!1,before:null,center:null,cleartype:!e.support.opacity,cleartypeNoBg:!1,containerResize:1,continuous:0,cssAfter:null,cssBefore:null,delay:0,easeIn:null,easeOut:null,easing:null,end:null,fastOnEvent:0,fit:0,fx:"fade",fxFn:null,height:"auto",manualTrump:!0,metaAttr:"cycle",
next:null,nowrap:0,onPagerEvent:null,onPrevNextEvent:null,pager:null,pagerAnchorBuilder:null,pagerEvent:"click.cycle",pause:0,pauseOnPagerHover:0,prev:null,prevNextEvent:"click.cycle",random:0,randomizeEffects:1,requeueOnImageNotLoaded:!0,requeueTimeout:250,rev:0,shuffle:null,skipInitializationCallbacks:!1,slideExpr:null,slideResize:1,speed:1E3,speedIn:null,speedOut:null,startingSlide:c,sync:1,timeout:4E3,timeoutFn:null,updateActivePagerLink:null,width:null}})(jQuery);
(function(e){e.fn.cycle.transitions.none=function(c,h,a){a.fxFn=function(a,c,d,h){e(c).show();e(a).hide();h()}};e.fn.cycle.transitions.fadeout=function(c,h,a){h.not(":eq("+a.currSlide+")").css({display:"block",opacity:1});a.before.push(function(a,c,d,h,n,m){e(a).css("zIndex",d.slideCount+(!0===!m?1:0));e(c).css("zIndex",d.slideCount+(!0===!m?0:1))});a.animIn.opacity=1;a.animOut.opacity=0;a.cssBefore.opacity=1;a.cssBefore.display="block";a.cssAfter.zIndex=0};e.fn.cycle.transitions.scrollUp=function(c,
h,a){c.css("overflow","hidden");a.before.push(e.fn.cycle.commonReset);c=c.height();a.cssBefore.top=c;a.cssBefore.left=0;a.cssFirst.top=0;a.animIn.top=0;a.animOut.top=-c};e.fn.cycle.transitions.scrollDown=function(c,h,a){c.css("overflow","hidden");a.before.push(e.fn.cycle.commonReset);c=c.height();a.cssFirst.top=0;a.cssBefore.top=-c;a.cssBefore.left=0;a.animIn.top=0;a.animOut.top=c};e.fn.cycle.transitions.scrollLeft=function(c,h,a){c.css("overflow","hidden");a.before.push(e.fn.cycle.commonReset);c=
c.width();a.cssFirst.left=0;a.cssBefore.left=c;a.cssBefore.top=0;a.animIn.left=0;a.animOut.left=0-c};e.fn.cycle.transitions.scrollRight=function(c,h,a){c.css("overflow","hidden");a.before.push(e.fn.cycle.commonReset);c=c.width();a.cssFirst.left=0;a.cssBefore.left=-c;a.cssBefore.top=0;a.animIn.left=0;a.animOut.left=c};e.fn.cycle.transitions.scrollHorz=function(c,h,a){c.css("overflow","hidden").width();a.before.push(function(a,c,d,h){d.rev&&(h=!h);e.fn.cycle.commonReset(a,c,d);d.cssBefore.left=h?c.cycleW-
1:1-c.cycleW;d.animOut.left=h?-a.cycleW:a.cycleW});a.cssFirst.left=0;a.cssBefore.top=0;a.animIn.left=0;a.animOut.top=0};e.fn.cycle.transitions.scrollVert=function(c,h,a){c.css("overflow","hidden");a.before.push(function(a,c,d,h){d.rev&&(h=!h);e.fn.cycle.commonReset(a,c,d);d.cssBefore.top=h?1-c.cycleH:c.cycleH-1;d.animOut.top=h?a.cycleH:-a.cycleH});a.cssFirst.top=0;a.cssBefore.left=0;a.animIn.top=0;a.animOut.left=0};e.fn.cycle.transitions.slideX=function(c,h,a){a.before.push(function(a,c,d){e(d.elements).not(a).hide();
e.fn.cycle.commonReset(a,c,d,!1,!0);d.animIn.width=c.cycleW});a.cssBefore.left=0;a.cssBefore.top=0;a.cssBefore.width=0;a.animIn.width="show";a.animOut.width=0};e.fn.cycle.transitions.slideY=function(c,h,a){a.before.push(function(a,c,d){e(d.elements).not(a).hide();e.fn.cycle.commonReset(a,c,d,!0,!1);d.animIn.height=c.cycleH});a.cssBefore.left=0;a.cssBefore.top=0;a.cssBefore.height=0;a.animIn.height="show";a.animOut.height=0};e.fn.cycle.transitions.shuffle=function(c,h,a){c=c.css("overflow","visible").width();
h.css({left:0,top:0});a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!0,!0,!0)});if(!a.speedAdjusted)a.speed/=2,a.speedAdjusted=!0;a.random=0;a.shuffle=a.shuffle||{left:-c,top:15};a.els=[];for(c=0;c<h.length;c++)a.els.push(h[c]);for(c=0;c<a.currSlide;c++)a.els.push(a.els.shift());a.fxFn=function(a,c,d,h,n){d.rev&&(n=!n);var m=n?e(a):e(c);e(c).css(d.cssBefore);var s=d.slideCount;m.animate(d.shuffle,d.speedIn,d.easeIn,function(){for(var c=e.fn.cycle.hopsFromLast(d,n),i=0;i<c;i++)n?d.els.push(d.els.shift()):
d.els.unshift(d.els.pop());if(n){c=0;for(i=d.els.length;c<i;c++)e(d.els[c]).css("z-index",i-c+s)}else c=e(a).css("z-index"),m.css("z-index",parseInt(c,10)+1+s);m.animate({left:0,top:0},d.speedOut,d.easeOut,function(){e(n?this:a).hide();h&&h()})})};e.extend(a.cssBefore,{display:"block",opacity:1,top:0,left:0})};e.fn.cycle.transitions.turnUp=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!0,!1);d.cssBefore.top=c.cycleH;d.animIn.height=c.cycleH;d.animOut.width=c.cycleW});
a.cssFirst.top=0;a.cssBefore.left=0;a.cssBefore.height=0;a.animIn.top=0;a.animOut.height=0};e.fn.cycle.transitions.turnDown=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!0,!1);d.animIn.height=c.cycleH;d.animOut.top=a.cycleH});a.cssFirst.top=0;a.cssBefore.left=0;a.cssBefore.top=0;a.cssBefore.height=0;a.animOut.height=0};e.fn.cycle.transitions.turnLeft=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!1,!0);d.cssBefore.left=c.cycleW;d.animIn.width=
c.cycleW});a.cssBefore.top=0;a.cssBefore.width=0;a.animIn.left=0;a.animOut.width=0};e.fn.cycle.transitions.turnRight=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!1,!0);d.animIn.width=c.cycleW;d.animOut.left=a.cycleW});e.extend(a.cssBefore,{top:0,left:0,width:0});a.animIn.left=0;a.animOut.width=0};e.fn.cycle.transitions.zoom=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!1,!1,!0);d.cssBefore.top=c.cycleH/2;d.cssBefore.left=c.cycleW/2;e.extend(d.animIn,
{top:0,left:0,width:c.cycleW,height:c.cycleH});e.extend(d.animOut,{width:0,height:0,top:a.cycleH/2,left:a.cycleW/2})});a.cssFirst.top=0;a.cssFirst.left=0;a.cssBefore.width=0;a.cssBefore.height=0};e.fn.cycle.transitions.fadeZoom=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!1,!1);d.cssBefore.left=c.cycleW/2;d.cssBefore.top=c.cycleH/2;e.extend(d.animIn,{top:0,left:0,width:c.cycleW,height:c.cycleH})});a.cssBefore.width=0;a.cssBefore.height=0;a.animOut.opacity=0};e.fn.cycle.transitions.blindX=
function(c,h,a){c=c.css("overflow","hidden").width();a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d);d.animIn.width=c.cycleW;d.animOut.left=a.cycleW});a.cssBefore.left=c;a.cssBefore.top=0;a.animIn.left=0;a.animOut.left=c};e.fn.cycle.transitions.blindY=function(c,h,a){c=c.css("overflow","hidden").height();a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d);d.animIn.height=c.cycleH;d.animOut.top=a.cycleH});a.cssBefore.top=c;a.cssBefore.left=0;a.animIn.top=0;a.animOut.top=c};e.fn.cycle.transitions.blindZ=
function(c,h,a){h=c.css("overflow","hidden").height();c=c.width();a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d);d.animIn.height=c.cycleH;d.animOut.top=a.cycleH});a.cssBefore.top=h;a.cssBefore.left=c;a.animIn.top=0;a.animIn.left=0;a.animOut.top=h;a.animOut.left=c};e.fn.cycle.transitions.growX=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!1,!0);d.cssBefore.left=this.cycleW/2;d.animIn.left=0;d.animIn.width=this.cycleW;d.animOut.left=0});a.cssBefore.top=0;a.cssBefore.width=
0};e.fn.cycle.transitions.growY=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!0,!1);d.cssBefore.top=this.cycleH/2;d.animIn.top=0;d.animIn.height=this.cycleH;d.animOut.top=0});a.cssBefore.height=0;a.cssBefore.left=0};e.fn.cycle.transitions.curtainX=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!1,!0,!0);d.cssBefore.left=c.cycleW/2;d.animIn.left=0;d.animIn.width=this.cycleW;d.animOut.left=a.cycleW/2;d.animOut.width=0});a.cssBefore.top=0;a.cssBefore.width=
0};e.fn.cycle.transitions.curtainY=function(c,h,a){a.before.push(function(a,c,d){e.fn.cycle.commonReset(a,c,d,!0,!1,!0);d.cssBefore.top=c.cycleH/2;d.animIn.top=0;d.animIn.height=c.cycleH;d.animOut.top=a.cycleH/2;d.animOut.height=0});a.cssBefore.height=0;a.cssBefore.left=0};e.fn.cycle.transitions.cover=function(c,h,a){var j=a.direction||"left",i=c.css("overflow","hidden").width(),d=c.height();a.before.push(function(a,c,h){e.fn.cycle.commonReset(a,c,h);"right"==j?h.cssBefore.left=-i:"up"==j?h.cssBefore.top=
d:"down"==j?h.cssBefore.top=-d:h.cssBefore.left=i});a.animIn.left=0;a.animIn.top=0;a.cssBefore.top=0;a.cssBefore.left=0};e.fn.cycle.transitions.uncover=function(c,h,a){var j=a.direction||"left",i=c.css("overflow","hidden").width(),d=c.height();a.before.push(function(a,c,h){e.fn.cycle.commonReset(a,c,h,!0,!0,!0);"right"==j?h.animOut.left=i:"up"==j?h.animOut.top=-d:"down"==j?h.animOut.top=d:h.animOut.left=-i});a.animIn.left=0;a.animIn.top=0;a.cssBefore.top=0;a.cssBefore.left=0};e.fn.cycle.transitions.toss=
function(c,h,a){var j=c.css("overflow","visible").width(),i=c.height();a.before.push(function(a,c,h){e.fn.cycle.commonReset(a,c,h,!0,!0,!0);!h.animOut.left&&!h.animOut.top?e.extend(h.animOut,{left:2*j,top:-i/2,opacity:0}):h.animOut.opacity=0});a.cssBefore.left=0;a.cssBefore.top=0;a.animIn.left=0};e.fn.cycle.transitions.wipe=function(c,h,a){var j=c.css("overflow","hidden").width(),i=c.height();a.cssBefore=a.cssBefore||{};var d;a.clip&&(/l2r/.test(a.clip)?d="rect(0px 0px "+i+"px 0px)":/r2l/.test(a.clip)?
d="rect(0px "+j+"px "+i+"px "+j+"px)":/t2b/.test(a.clip)?d="rect(0px "+j+"px 0px 0px)":/b2t/.test(a.clip)?d="rect("+i+"px "+j+"px "+i+"px 0px)":/zoom/.test(a.clip)&&(c=parseInt(i/2,10),h=parseInt(j/2,10),d="rect("+c+"px "+h+"px "+c+"px "+h+"px)"));a.cssBefore.clip=a.cssBefore.clip||d||"rect(0px 0px 0px 0px)";var c=a.cssBefore.clip.match(/(\d+)/g),l=parseInt(c[0],10),n=parseInt(c[1],10),m=parseInt(c[2],10),s=parseInt(c[3],10);a.before.push(function(a,c,d){if(a!=c){var h=e(a),A=e(c);e.fn.cycle.commonReset(a,
c,d,!0,!0,!1);d.cssAfter.display="block";var r=1,b=parseInt(d.speedIn/13,10)-1;(function k(){var a=l?l-parseInt(r*(l/b),10):0,c=s?s-parseInt(r*(s/b),10):0,d=m<i?m+parseInt(r*((i-m)/b||1),10):i,e=n<j?n+parseInt(r*((j-n)/b||1),10):j;A.css({clip:"rect("+a+"px "+e+"px "+d+"px "+c+"px)"});r++<=b?setTimeout(k,13):h.css("display","none")})()}});e.extend(a.cssBefore,{display:"block",opacity:1,top:0,left:0});a.animIn={left:0};a.animOut={left:0}}})(jQuery);


(function ($) {
	

    $.fn.trm_RotatingPov = function (options) {

        var defaults = {
            xmlPath			: '',
            pager 			: '#trm_povnav', // the id or class of the pager
            speed 			: 200,	//transition time
            timeout 		: 9, // seconds
            fx 				: 'fade', // use the fx from cycle
            buttonHeight	: '',	// the height of the buttons in the pager
            timerInt  		: 100,	// how many milliseconds for the timer to run
            showPausePlay	: true,	// show the play and pause button
            toggleText		: true,	// show the text of the pause play button
            togglePausePlayOnHover : false,	// toggle between play and pause on mousehover mouseout
            hotSpotBorder 	: false	// show borders on hotspote for debugging purposes

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
        var currentPov = 0;
        var converges = new Array();
        var flashIsReady = false;
        var currentSlide = 0;

        $.fn.trm_RotatingPov.trackIt = function(params){
			trackConverge(params);
		}

		$.fn.trm_RotatingPov.flashReady = function(){
			flashIsReady = true;
			//conole.log('flashIsReady')
		}

        function l(params){
           if (typeof console != "undefined") {
                // console.log(params);
            }  
        }

        function parseData(selector, d){
            thisSelector = selector;
            totalItems = 0;
            fullData = $(d);
            $(d).find('pov').each(function(){

                var marker = $(this);
                var params = {}
                params.type = marker.attr('type');
                params.src = marker.find('src').text();
                params.altSrc = (marker.find('altSrc').text()) ? marker.find('altSrc').text() : '';
               // params.clickUrl = marker.find('clickUrl').text();
                params.links = marker.find('links');
                //params.target = marker.find('clickUrl').attr('target');
                params.w = marker.attr('width');
                params.h = marker.attr('height');
                params.description = marker.find('description').text();
                params.price = [[{
		        			amt: 	marker.find('price').text(),
		        			cls: 	marker.find('price').attr('class') !== '' ? marker.find('price').attr('class') : 'none',
		        			sku: 	marker.find('price').attr('data-sku')
		        		}]];
		        p = []

                if(showPrices == 'y') {

                	marker.find('price').each(function(j) {

		        		p[j] = {
		        			amt: 	$(this).text() !== undefined ? $(this).text() : '',
		        			pfx: 	$(this).attr('prefix') !== undefined ? $(this).attr('prefix') : '',
		        			cls: 	$(this).attr('class') !== undefined ? $(this).attr('class') : '',
		        			cur: 	$(this).attr('currency') !== undefined ? $(this).attr('currency') : '',
		        			sku: 	$(this).attr('data-sku') !== undefined ? $(this).attr('data-sku') : ''
		        		}

		        		if(p[j].amt.indexOf('.')!==-1) {
			        		p[j].amt = p[j].amt.split('.')
			        		p[j].amt[1] = '<span class="super">' + p[j].amt[1] + '</span>'
			        		p[j].amt = p[j].amt.join('.')		        			
		        		}

		        		p[j].out  = '<div class="'+p[j].cls+'">';
		        		p[j].out += '<span class="prefix">' + p[j].pfx + '</span>';
		        		p[j].out += '<p class="amount" data-sku="'+p[j].sku+'">' + p[j].cur + p[j].amt + '</p>';

		        		p[j].out += '</div>'

		        		p[j].out = j>0 ? p[j].out =  p[j-1].out + p[j].out : p[j].out
						
		        		params.price.amt = '<div class="price">' + p[j].out + '</div>'

                	})
                } else {
		        		params.price.amt = ''                	
                }

                converges[totalItems] = marker.attr('itrack');
                $(thisSelector).append(povType(params));

               
               if(params.type.toUpperCase() == 'SWF'){
                   
                    var flashvars = {};
                    var flashParams = {wmode:'transparent',allowScriptAccess:'always'};
                    var attributes = {}
                    var version = (marker.find('src').attr('version')) ? marker.find('src').attr('version') : '9';
                    var expressInstallSwfurl = '';
                    var targetDiv = 'swf'+(totalItems-1);
                  
                    //$('#'+targetDiv).css('display','block');
                    swfobject.embedSWF(
                        params.src, 
                        targetDiv, 
                        params.w, 
                        params.h, 
                        version, 
                        expressInstallSwfurl, 
                        flashvars, 
                        flashParams, 
                        attributes, 
                        function(e){
                            //$('#'+e.id).css('display','none');
                            //console.log('EMBEDED',e);
                        }
                    )
                    
                }
                
            })

            $(thisSelector).cycle({ 
                fx:     options.fx, 
                speed:   options.speed, 
                timeout: 0, 
                pager:  options.pager,
               before : function(e){
	               currentProgress = 0;
	               //flashIsReady = false;
               },
               after : function onAfter(curr, next, opts) {
               	  // when the slide changes these functions will be called.
               	  var type = (clickTrack == true) ? 'click' : 'auto';
               	  var thisPov = '#povItm'+opts.currSlide;
               	  // set description
               	  $('#trm_povdescription').html(' | ' + $(thisPov).data('description'));
               	 
               	  if($(thisPov).data('povtype').toUpperCase() == 'SWF'){
               	  	//console.log("swf"+opts.currSlide, $("#swf"+opts.currSlide));
               	  	currentSlide = opts.currSlide;
               	  	runSwf();               	  	
               	  }

               	  if($(thisPov).find('.amount').length>0) {
						priceLookup($(thisPov).find('.amount'));
               	  }

				  doTrack(type, curr, next, opts);
				}
				

            }); 

            // stop timer on hover
            progressTimer = 0;
           // rotateTimer = setInterval(onTimer, options.timeout*1000);
            progressTimer = setInterval(onProgress, options.timerInt);
            //$(thisSelector).mouseover(pauseTimer).mouseout(startTimer);
            
            options.buttonHeight = parseInt($(options.pager + ' a:nth-child(1)').css('height').substr(0,$(options.pager + ' a:nth-child(1)').css('height').length-2));
            $(options.pager + ' a').css({backgroundPosition: '0px '+ options.buttonHeight + 'px'});
           // if showing pause button
           	if(options.showPausePlay == true){
           		
           		var thisToggleText = (options.toggleText) ? 'Pause' : '';
           		$(options.pager).wrap('<div id="trm_povFooter" />');
            	$(options.pager).before('<div id="trm_statusBtn">'+thisToggleText+'</div>');
            
	            $('#trm_statusBtn').css({
	                position:$(options.pager).css('position'),
	                top:$(options.pager).css('top'),
	                left:$(options.pager).css('left'),
	                'z-index':$(options.pager).css('z-index')
	            });
	            $(options.pager).css('left',($('#trm_statusBtn').width() + 5));
            	$('#trm_statusBtn').mouseover(pauseTimer).mouseout(startTimer);
            	$('#trm_statusBtn').click(onPauseButtonClick);
            	$(options.pager).after('<span id="trm_povdescription"></span>');
            }


            $(thisSelector).mouseover(pauseTimer).mouseout(startTimer);    
            $(options.pager).mouseover(pauseTimer).mouseout(startTimer);
            $(options.pager + ' a').wrapInner('<div class="trm_pov_envelope" />');
            $(options.pager + ' a').click(function(){clickTrack = true;});
            $('#trm_povdescription').css({'left':parseInt($(options.pager).css('left'))+parseInt($(options.pager).width())+10,'position':'relative'});
        	$('#trm_povdescription').html(' | ' + $('#povItm0').data('description'));

        	if(totalItems == 1){
        		$('#trm_povFooter').hide();
        		$('.trm_povContainer').css('height','240px');
        	}
    	}

    	function runSwf(){
			if(flashIsReady === true){
				var flash = document.getElementById('swf'+currentSlide);
       	  		flash.startSwf();
       	  		//flashIsReady = false;
       	  		//console.log(flash,'flashIsReady','true');
       	  	}
       	  	else{
       	  		//console.log('flashIsNotReady','false',document.getElementById('swf'+currentSlide),$("#swf"+currentSlide));
       	  		setTimeout(runSwf, 50);
       	  	}
    	}

        function onTimer(){
            currentProgress = 0;
            $(thisSelector).cycle('next');
            $(options.pager + ' a').css({backgroundPosition: '0px '+ options.buttonHeight + 'px'});
        }

        function doTrack(type, curr, next, opts){
        	//l('opts.currSlide'+opts.currSlide);
        	var index = opts.currSlide;
        	currentPov = index
			clickTrack = false;

			switch(type.toUpperCase()){
				case 'CLICK':
					trackConverge(converges[index]+'_click');
				break;

				case 'AUTO':
					if(isTracked[index] != true){
						trackConverge(converges[index]+'_Impr');
						isTracked[index] = true;
					}
				break;
			}
        }

        function trackConverge(cid){
        	l(convergeId + '_' + cid + '_US_ENG_01');
        	if(typeof DynamicOmnitureTracking != 'undefined'){
        		// Omniture_TrackEvent('o',convergeId + '_' + cid + '_US_ENG_01');
        		DynamicOmnitureTracking(cid);
        		console.log(cid)
        	}
        }

        function onProgress(){
            currentProgress += options.timerInt;
            perc = currentProgress/(options.timeout*1000)*100;
            pos = options.buttonHeight-((options.buttonHeight/100)*perc) + 'px';
           
            $(options.pager + ' a.activeSlide').css({backgroundPosition: '0px ' + pos});
            if(perc == 100){
                onTimer()
            }
        }

        function onHover(){
            
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

        function onPauseButtonClick(){
        	if(manualPause == false){
        		pauseTimer();
        		if(options.toggleText){ $('#trm_statusBtn').text('Play'); }
        		$('#trm_statusBtn').addClass('trm_isPaused');
        		$('#trm_statusBtn').unbind('mouseover').unbind('mouseout');
        		$(thisSelector).unbind('mouseover').unbind('mouseout');
        		$(options.pager).unbind('mouseover').unbind('mouseout');
        		manualPause = true;
        		trackConverge(converges[currentPov]+'_PAUSE_CLICK');
        	}
        	else{
        		if(options.toggleText){ $('#trm_statusBtn').text('Pause'); }

        		$('#trm_statusBtn').removeClass('trm_isPaused');
        		$('#trm_statusBtn').mouseover(pauseTimer).mouseout(startTimer);
        		$(thisSelector).mouseover(pauseTimer).mouseout(startTimer);    
            	$(options.pager).mouseover(pauseTimer).mouseout(startTimer);
            	manualPause = false;
            	trackConverge(converges[currentPov]+'_PLAY_CLICK');
        	}
        }

        function povType(d){
            var pov = '';
            var hotSpots = '';
        	var convergeData = new Array();
        	var price = '',
        	trackSides = $(d.links).attr('trackSides');
        	$(d.links).find('link').each(function(){
        		var linkPos = '';
        		var iframeWidth = $(this).attr('iframeWidth')!==undefined ? $(this).attr('iframeWidth') : 'iframeWidth';
        		var iframeHeight = $(this).attr('iframeHeight')!==undefined ? $(this).attr('iframeHeight') : 'iframeHeight';
        		if(trackSides == 'true'){
        			linkPos = ($(this).attr('x') > (obj.width()/2)) ? 'RL' : 'LT';
        		}
        		debug = (options.hotSpotBorder == true) ? 'border:solid 1px #ff0000' : '';

        		var click = 'trm_trackIt(\''+$(this).attr('itrack')+'_'+linkPos+'\');'
        		if ($(this).attr('class')) {
        			if ($(this).attr('class').match('video')!==null) {
        				click = click+='$(this).colorbox({iframe:true, innerWidth:'+iframeWidth+', innerHeight:'+iframeHeight+'});'
        			}
        		}

        		var href = $(this).text()
        			href = href.match('http')==null ? root + href : href;

        		hotSpots += '<a onclick="'+click+'" href="'+href+'" target="'+$(this).attr('target')+'" class="trm_hotSpot '+$(this).attr('class')+'" id="" style="position:absolute;top:'+$(this).attr('y')+';left:'+$(this).attr('x')+';width:'+$(this).attr('w')+';height:'+$(this).attr('h')+';'+debug+'"></a>';
        	});

            switch(d.type.toUpperCase()){
                case 'JPG':
                	// check for links
                    pov =   '<div id="povItm'+totalItems+'" class="trm_povItem" data-description='+d.description+' data-povType="img"> \
                                    <img src="'+root+d.src+'" alt="'+d.description+'" /> \
                                	'+hotSpots+d.price.amt+' \
                            </div>';
                    totalItems ++;
                break;

             	case 'SWF':
             		
             		pov =   '<div id="povItm'+totalItems+'" class="trm_povItem" data-description='+d.description+' data-povType="swf"> \
             					<div id="swf'+totalItems+'"> \
             						<img src="'+d.altSrc+'" alt="'+d.description+'" /> \
             						'+hotSpots+' \
             					</div> \
             				</div>';
             		totalItems++;

             	break;
            }

            return pov;
        }

        return this.each(function () {
            var dt = new Date();
            var timeStr = '?'+dt.getTime()
            $.ajax({
                  url: options.xmlPath+timeStr,
                  type: 'GET',
                  dataType: 'xml',
                  complete: function(xhr, textStatus) {
                    //parseData(obj,xhr.responseText);
                  },
                  success: function(data, textStatus, xhr) {
                    parseData(obj,data);
                  },
                  error: function(xhr, textStatus, errorThrown) {
                    //called when there is an error
                  }
            });
        }

        )
    }
})(jQuery);


function trm_trackIt(cid){
	$(this).trm_RotatingPov.trackIt(cid);
}

function flashReady(){
	$(this).trm_RotatingPov.flashReady();
}


function priceLookup(p) {

	return p.wmItemLookup({
	 	useProxy : true,
	 	proxyUrl : '/trmsupport/proxy/proxy.aspx?url=',
		onPrice : function(r){
			// console.log('RESULTS',r);
			
			if(r.isRollback == true){
				$(r.target).html('$' + r.price + '<br />' + r.subText);	// find the class inside of the prod class called prodPrice and replace its html with the price returned
			}
			else{
				$(r.target).html('$' + r.price);	// find the class inside of the prod class called prodPrice and replace its html with the price returned
			}
			newPrice = r.target
		}
	 });

}