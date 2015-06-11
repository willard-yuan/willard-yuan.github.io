/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @version 0.0.1
 * @github https://github.com/wenzhixin/side-menu
 * @blog http://wenzhixin.net.cn
 */

(function($) {
	
	'use strict';

	function SideMenu($el) {
		this.$el = $el;
	}


	SideMenu.prototype = {
		constructor: SideMenu,

		events: function() {
			if (this.maxHeight > 0) {
				this.$scroll.show();
				this.$menu.off('mousewheel').on('mousewheel', $.proxy(this.wheel, this));
				this.$up.off('click').on('click', $.proxy(this.scrollUp, this));
				this.$down.off('click').on('click', $.proxy(this.scrollDown, this));
			}
			$(window).off('scroll').on('scroll', $.proxy(this.checkPosition, this));
		},

		init: function(options) {
			this.options = options;
			
			this.initViews();
			this.initDatas();
			this.events();
		},
		
		initViews: function() {
			var that = this,
				counts = {},
				preLevel = 0;
			
			this.$menu = $([
				'<div class="side-menu">',
					'<div class="side-bar">',
						'<div class="sidebar-top"></div>',
						'<div class="sidebar-bottom"></div>',
					'</div>',
					'<div class="side-scroll">',
						'<div class="side-scroll-up disabled"></div>',
						'<div class="side-scroll-down"></div>',
					'</div>',
					'<div class="side-catalog">',
						'<dl></dl>',
					'<div>',
				'</div>'
			].join(''));
			this.$top = this.$menu.find('.sidebar-top');
			this.$bottom = this.$menu.find('.sidebar-bottom');
			this.$scroll = this.$menu.find('.side-scroll');
			this.$up = this.$menu.find('.side-scroll-up');
			this.$down = this.$menu.find('.side-scroll-down');
			this.$catalog = this.$menu.find('.side-catalog');
			this.$list = this.$menu.find('dl');
			
			this.$el.find(this.options.hs.join(',')).each(function(i) {
				var $this = $(this),
					$div,
					name = $this[0].localName,
					title = $this.text(),
					level = $.inArray(name, that.options.hs) + 1,
					nums = [],
					index;
				
				if (level - preLevel > 1) {
					return;
				}
				if (!counts.hasOwnProperty(name) || level - preLevel === 1) {
					counts[name] = 0;
				}
				counts[name]++;
				
				$.each(counts, function(i) {
					nums.push(counts[i]);
					if (nums.length === level) {
						return false;
					}
				});
				index = nums.join('.');
				
				$div = $('<div id="sideMenuTitle' + index + '" class="side-menu-affix"></div>');
				$div.insertAfter($this).append($this);
				
				that.$list.append([
					'<a href="#sideMenuTitle' + index + '">',
						'<dd data-id="sideMenuTitle' + index + '" class="side-catalog-item' + level + '">',
							'<span class="side-catalog-index">' + index + '</span>',
							'<span href="#sideMenuTitle' + index + '" title="' + title + '">' + title + '</span>',
							'<span class="side-catalog-dot"></span>',
						'</dd>',
					'</a>'
				].join(''));
				preLevel = level;
			});
			$(this.options.container).append(this.$menu);
		},
		
		initDatas: function() {
			this.iScroll = 0;
			this.maxHeight = this.$list.outerHeight(true) - this.$catalog.outerHeight(true);
		},
		
		wheel: function(event) {
			var oEvent = event.originalEvent,
				iDelta = oEvent.wheelDelta ? oEvent.wheelDelta / 120 : -oEvent.detail / 3;
	
			this.iScroll -= iDelta * 40;
			this.scroll();
			return false;
		},
		
		scrollUp: function() {
			this.iScroll -= 40;
			this.scroll();
		},
		
		scrollDown: function() {
			this.iScroll += 40;
			this.scroll();
		},
		
		scroll: function() {
			this.iScroll = Math.min(this.maxHeight, Math.max(0, this.iScroll));
			this.$list.css('top', -this.iScroll);

			this.$up.removeClass('disabled');
			this.$down.removeClass('disabled');
			if (this.iScroll === 0) {
				this.$up.addClass('disabled');
			}
			if (this.iScroll === this.maxHeight) {
				this.$down.addClass('disabled');
			}
		},
		
		checkPosition: function() {
			var $affixs = this.$el.find('.side-menu-affix'),
				scrollHeight = $(window).height(),
				scrollTop = $('body').scrollTop(),
				maxScrollTop = $('body').height() - scrollHeight,
				id = $affixs.first().attr('id');
				
			this.$el.find('.side-menu-affix').each(function() {
				var $this = $(this);
				
				if (~~$this.offset().top <= scrollTop) {
					id = $this.attr('id');
				} else {
					return false;
				}
			});
			if (scrollTop >= maxScrollTop) {
				id = $affixs.last().attr('id');
			}
			this.$list.find('dd').removeClass('active')
				.filter('[data-id="' + id + '"]').addClass('active');
		}

		/** public function **/
	};

	$.fn.sideMenu = function() {
		var option = arguments[0],
			args = arguments,
			value,
			allowedMethods = [];// public function

		this.each(function() {
			var $this = $(this), data = $this.data('sideMenu'),
				options = $.extend({}, $.fn.sideMenu.defaults, typeof option === 'object' && option);

			if ( typeof option === 'string') {
				if ($.inArray(option, allowedMethods) < 0) {
					throw "Unknown method: " + option;
				}
				value = data[option](args[1]);
			} else {
				if (!data) {
					data = new SideMenu($this);
					data.init(options, true);
					$this.data('sideMenu', data);
				} else {
					data.init(options);
				}
			}
		});

		return value ? value : this;
	};

	$.fn.sideMenu.defaults = {
		container: 'body',
		hs: ['h2', 'h3', 'h4']
	};
})(jQuery);
