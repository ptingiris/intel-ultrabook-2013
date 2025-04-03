$(document).ready(function() {

	app.init();

	$('#trm_rotatingPov').trm_RotatingPov({
		xmlPath : root+'data/povData.xml',
		pager : '#trm_povnav'
	});


}); //$(document).ready

	var app = {
		container: 	'$("#tdmContainer")',
		data: 		{
			path: 	root+'data/itemData.xml',
			get: 	function(data, output) {

				$.ajax({
				    type: "GET",
				    url: data,
				    dataType: "xml",
				    success: output
				  });

			},
			show: 	function(data) {

				var context 	= new Array();
				var container 	= $('#tdmContainer .content .categories');
				var h 			= 0;

				$(data).find('item').each(function(i){

					context[i] = {
						image: new Image(),
						link: {},
						anchor: 	new Array,
						w: $(data).find('items').attr('width'),
						h: $(data).find('items').attr('height')
					}
					
					var marker = $(this);

					// image
					context[i].image.src 	= root+marker.find('src').text();
					context[i].image.alt	= marker.find('alt').text();
					context[i].iLink 		= marker.find('ilink').text();
					context[i].itrack 		= marker.attr('itrack')

					// description
					context[i].header 		= marker.find('header').text();
					context[i].text 			= marker.find('text').text()!=='' ? '<p>'+marker.find('text').text()+'</p>' : '';
					
					//links
					marker.find('link').each(function(j) {

						var x = $(context[i].link[j]);

						context[i].link[j] = {
							id: 			'',
							cls: 			'',
							itrack: 		'',
							name: 			'',
							href: 			'',
							iframeWidth: 	iframeWidth,
							iframeHeight: 	iframeHeight
						}
						
						x.id = $(this).attr('id') !== undefined ? ' id="' + $(this).attr('id') +'"' : '';
						x.cls = $(this).attr('class') !== undefined ? $(this).attr('class') : 'shop';
						x.itrack = $(this).attr('itrack');
						x.name = $(this).attr('name');
						x.href = $(this).text().match('http')==null ? root + $(this).text() : $(this).text();

						context[i].anchor[j] 		= '';
						if(x.name !== undefined) {

							context[i].anchor[j] 	= '<a'+x.id+' class="'+x.cls+' ctrack" itrack="'+x.itrack+'" href="'+x.href+'">'+x.name+'</a>'	

						}

						if($(context[i].anchor[j]).hasClass('video')) {

							x.iframeWidth = $(this).attr('iframeWidth') !== undefined ? $(this).attr('iframeWidth') : iframeWidth;
							x.iframeHeight = $(this).attr('iframeHeight') !== undefined ? $(this).attr('iframeHeight') : iframeHeight;

							var tmp = context[i].anchor[j];
								tmp = $(tmp).attr({
									'target':'undefined',
									'onclick': 'javascript: $(this).colorbox({iframe:true, innerWidth:'+x.iframeWidth+', innerHeight:'+x.iframeHeight+'})'
								});
								tmp = tmp.wrap('<div id="tmp">');
								tmp = tmp.parent()
							
							context[i].anchor[j] = tmp.html();

						}

					})
					
					var version = $.browser.version;
					if (typeof version == 'string') {

						version = version.match('536.26')!==null ? parseInt(version.match('536')[0]) : $.browser.version

					}

					if ($.browser.safari && version == 536) {

						var item = '<li style="width: '+context[i].w+'px">';
							item += '<a class="photo ctrack" itrack="'+context[i].itrack+'" href="'+context[i].iLink+'">';
							item += '<img src="'+context[i].image.src+'" alt="'+context[i].image.alt+'" width="'+context[i].w+'" height="'+context[i].h+'"></a>';

						var info = '<div class="info">';
							info += '<h3>'+context[i].header+'</h3>';
							info += context[i].text;
							info += context[i].anchor.join('');

						$('.categories').append(item+=info);

					} else {
						app.hbTemplate.load(context[i])
					}
					
					$(container).find('.shop:last-child').addClass('all')

					container.children('li').each(function() {

						if($(this).height() > h) {
							h = $(this).height();
						}

					}).height(h)

				})

				var w 			= parseInt(context[0].w)
				var columns 	= Math.floor(container.width() / w);
				var margin		= function () {

					var i = $(container).children('li:first').css('margin-right').slice().match('px').index;

					return parseInt($(container).children('li:first').css('margin-right').slice(0,i))
				};
				var padding 	= (container.width() - ((w + margin() - 2) * columns)) / 2;
				padding 		= Math.ceil(padding)

				$(container).css('padding-left',padding);
				$(container).children('li:nth-child('+columns+'n+'+(columns+1)+')').addClass('last')
				
			}
		},
		hbTemplate: 	{
			source: $("#sectionTemplate").html(),
			context: 	{
				image: 	'image',
				iLink: 	'image link',
				title: 	'description title',
				text: 	'description text',
				prefix: 'link leading text',
				link: 	'buy now link'
			},
			load: 		function(context) {

				var source 		= app.hbTemplate.source;
				var template 	= Handlebars.compile(source);
				var html    	= template(context);
				var container 	= '#tdmContainer .categories'

				$(html).appendTo(container);

			}
		},
		tracking: 	function() {

			$('body').centerTracking({convergID: convergeId})

		},
		init: 	function() {
			if($('#sectionTemplate').length>0) {
				app.data.get(app.data.path, app.data.show);
			}
			
			if(typeof Omniture_TrackEvent!=='undefined') {
				app.tracking();
			}
			

			var container = eval(app.container)
			if(rightRail=='y') {

				container.addClass('cols');

			} else {

				container.find('.rightModuleContainer').remove();
				container.find('.trm_povContainer').wrap('<div class="fullscreen">');
				container.find('.content').addClass('fullscreen')

			}

			if($.browser.msie) {

				$('html').attr('id','ie7')

			}

		}
	};