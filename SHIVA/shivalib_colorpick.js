///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB COLOR PICKER
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.ColorPicker = function(mode, attr) {
    $("#shiva_dialogDiv").remove();                                     //remove existing dialogs
    var self = this;
	var sel = "";
	console.log(isNaN(attr));
	if (isNaN(attr)) 
		sel="#"+attr.replace(/___/g,"");
	else if (attr < 0) 
		sel = "#colordiv";
	else if (attr > 100)														
		sel="#itemInput"+(Math.floor(attr/100)-1)+"-"+(attr%100);	
	else sel = "#propInput" + attr;
		
	console.log(sel);
    var inputBox = $(sel);
    var inputBoxChip = $(sel+"C");

    //HELPER FUNCTIONS
    this.HEX_to_HSV = function(hexString) {                             
        var value = hexString.substring(1);
        
        var r = parseInt(value.substring(0, 2), 16) / 255;
        var g = parseInt(value.substring(2, 4), 16) / 255;
        var b = parseInt(value.substring(4, 6), 16) / 255;

        var max = Math.max.apply(Math, [r, g, b]);
        var min = Math.min.apply(Math, [r, g, b]);

        var hue;
        var sat;
        var val = max;

        var delta = max - min;
        if (max != 0)
            sat = delta / max;
        else {
            sat = 0;
            hue = 0;
            return;
        }

        if (delta == 0) {
            return [0, 0, val];
        }

        if (r == max)
            hue = (g - b) / delta;
        else if (g == max)
            hue = 2 + (b - r) / delta;
        else
            hue = 4 + (r - g) / delta;
        hue *= 60;
        if (hue < 0)
            hue += 360;
        return [hue, sat, val];
    }

    this.RGB_to_HSV = function(r, g, b) {

        var max = Math.max.apply(Math, [r, g, b]);
        var min = Math.min.apply(Math, [r, g, b]);

        var hue;
        var sat;
        var val = max;

        var delta = max - min;

        if (max != 0)
            sat = delta / max;
        else {
            sat = 0;
            hue = 0;
            return [hue, sat, val];
        }

        if (delta == 0) {
            return [0, 0, val];
        }

        if (r == max) {
            hue = (g - b) / delta;
        } else if (g == max) {
            hue = 2 + (b - r) / delta;
        } else {
            hue = 4 + (r - g) / delta;
        }

        hue *= 60;
        if (hue < 0)
            hue += 360;
        return [hue, sat, val];
    }

    this.HSV_to_HEX = function(h, s, v) {

        if (h === 0)
            h = .001;
        else if (h == 360)
            h = 359.999;

        chroma = v * s;
        hprime = h / 60;
        x = chroma * (1 - Math.abs(hprime % 2 - 1));

        var r;
        var g;
        var b;

        if (h == 0)
            r, g, b = 0;
        else if (hprime >= 0 && hprime < 1) {
            r = chroma;
            g = x;
            b = 0;
        } else if (hprime >= 1 && hprime < 2) {
            r = x;
            g = chroma;
            b = 0;
        } else if (hprime >= 2 && hprime < 3) {
            r = 0;
            g = chroma;
            b = x;
        } else if (hprime >= 3 && hprime < 4) {
            r = 0;
            g = x;
            b = chroma;
        } else if (hprime >= 4 && hprime < 5) {
            r = x;
            g = 0;
            b = chroma;
        } else if (hprime >= 5 && hprime < 6) {

            r = chroma;
            g = 0;
            b = x;
        }

        m = v - chroma;
        r = Math.round(255 * (r + m));
        g = Math.round(255 * (g + m));
        b = Math.round(255 * (b + m));

        return self.RGB_to_HEX(r, g, b);
    }

    this.RGB_to_HEX = function(r, g, b) {
        h1 = Math.floor(r / 16).toString(16);
        h2 = Math.floor((r % 16)).toString(16);
        h3 = Math.floor(g / 16).toString(16);
        h4 = Math.floor((g % 16)).toString(16);
        h5 = Math.floor(b / 16).toString(16);
        h6 = Math.floor((b % 16)).toString(16);

        return "#" + h1 + h2 + h3 + h4 + h5 + h6;
    }
    
    //  BUILDING THE COLORPICKER
    var hue = 0;
    var sat = 1;
    var val = 1;
    var cp_current = 0;
    var cp_first = 0;

	var z = ($('.ui-widget-overlay').length > 0)?($('.ui-widget-overlay').css('z-index')+1):'auto';
    $('body').append($("<div>", {
        id : 'shiva_dialogDiv',
         css : {
        	zIndex: z,
            position : 'absolute',
            right : '100px',
            top : '30px',
            width : '240px',
            marginLeft : '2px',
            marginRight : '2px',
            padding : '5px',
            paddingBottom : '30px',
            paddingTop : '10px'
        }
    }).draggable().addClass("propTable"));
    //TABS
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_colorbar',
        css : {
            position : 'absolute',
            right : '1px',
            top : '-1px',
            width : '244px',
            height : '22px',
            borderTopLeftRadius : '8px',
            borderTopRightRadius : '8px'
        }
    }));
   $("#cp_colorbar").append($("<a>", {
      css : {
            width : '30px',
            height : '20px',
            position : 'relative',
            left : '-5px',
            float : 'left',
            border : '0',
            borderRadius : '0',
            borderTopLeftRadius : '8px',
            borderRight : '1px solid gray',
            borderBottom : '1px solid gray'
        	},
        click : function() {
            if (cp_first > 0)
                cp_first--;
            self.position_bar();
        	}
	    }).button({
	        icons : {
	            primary : 'ui-icon-arrowthick-1-w'
	        	},
	        text : false
	 }).addClass("cbar_control"));
    $("#cp_colorbar").append($("<a>", {
        css : {
            width : '28px',
            height : '20px',
            position : 'absolute',
            left : '216px',
            top : '0px',
            border : '0',
            borderRadius : '0',
            borderTopRightRadius : '8px',
            borderLeft : '1px solid gray',
            borderBottom : '1px solid gray'
        },
        click : function() {
            if (cp_first < $(".tab").length - 5)
                cp_first++
            self.position_bar();
        }
    }).button({
        icons : {
            primary : 'ui-icon-arrowthick-1-e'
        },
        text : false
    }).addClass("cbar_control"));
    $("#cp_colorbar").append($("<a>", {
         css : {
            width : '18.5px',
            height : '20px',
            position : 'absolute',
            top : '0',
            left : '196px',
            border : '0',
            borderRadius : '0',
            borderLeft : '1px solid gray',
            borderBottom : '1px solid gray'
        },
        click : function() {
            cp_first++;
            self.add();
        }
    }).button({
        icons : {
            primary : 'ui-icon-plusthick'
        },
        text : false
    }).addClass("cbar_control"));
    $("#cp_colorbar a").hover(function() {
        $(this).css("cursor", "pointer");
    });
    $("#shiva_dialogDiv").append($("<span>", {
        html : "S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B",
        css : {
            color : 'gray',
            position : 'absolute',
            top : '25px',
            left : 
            '186px'
        }
    }));
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_colormap',
        css : {
            position : 'relative',
            top : '20px',
            width : '150px',
            padding : '2px',
            height : '150px'
        }
    }));
    $("#cp_colormap").append($("<img>", {
        src : 'hsv_wheel.png',
        click : function(e) {
            self.position((e.pageX - $(this).parent().offset().left), (e.pageY - $(this).parent().offset().top));
        }
    }))
    $("#shiva_dialogDiv").append($("<input>", {
        id : 'cp_current',
        maxLength : '7',
        css : {
            position : 'absolute',
            top : '97px',
            left : '52.5px',
            width : '58px',
            height : '20px',
            border : '0',
            textAlign : 'center',
            backgroundColor : 'transparent'
        },
        change : function() {
            var val = $(this).attr("value");
            if (val[0] != "#")
                val = "#" + val;
            if (val == "none")
                self.update(null);
            else if (val.length === 7) {
                var hsv = self.HEX_to_HSV(val);
                if (hsv == -1) {
                    self.setColor(0, 0, 0);
                    $(this).attr("value", "000000");
                } else {
                    hue = hsv[0];
                    sat = hsv[1];
                    val = hsv[2];
                    self.setColor(hue, sat, val);
                }
            }
        }
    }));
    //SLIDERS
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_brightness',
        title : 'brightness',
        css : {
            width : '5px',
            height : '85px',
            position : 'relative',
            right : '24.5px',
            top : '-120px',
            float : 'right',
            borderRadius : '8px',
            border : '1px solid gray'
        }
    }).slider({
        value : 100,
        orientation : 'vertical'
    }).addClass("slider"));
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_saturation',
        title : 'saturation',
        css : {
            width : '5px',
            height : '85px',
            position : 'relative',
            right : '45.5px',
            top : '-120px',
            float : 'right',
            borderRadius : '8px',
            border : '1px solid gray'
        }
    }).slider({
        value : 100,
        orientation : 'vertical'
    }).addClass("slider"));
    $(".slider a").css("width", '20px');
    $(".slider a").css("height", '10px');
    $(".slider a").css("left", "-8px");
    $(".slider").first().slider("option", "slide", function() {
        self.setColor(hue, sat, $(this).slider("option", "value") / 100);
    });
    $(".slider").last().slider("option", "slide", function() {
        self.setColor(hue,$(this).slider("option", "value") / 100, val);
    });
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_chip',
        css : {
            border : '1px solid gray',
            borderRadius : '4px',
            width : '50px',
            height : '30px',
            position : 'relative',
            left : '172px',
            top: '-25px'
        }
    }));
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_basic',
        css : {
            width : '216px',
            position : 'relative',
            left : '10px'
        }
    }));
    $("#cp_basic").append($("<div>", {
        id : 'basic_colors',
        css : {
            position : 'absolute',
            width : '216px',
            height : '20px',
            border : '1px solid gray'
        }
    }))
    $("#cp_basic").append($("<div>", {
        id : 'neutral',
        css : {
            position : 'absolute',
            top : '20px',
            width : '216px',
            height : '20px',
            border : '1px solid gray'
        }
    }))
    var form = [16, 16];
    for (var i = 0; i < 2; i++) {
        var html = "";
        for (var j = 0; j < form[i]; j++) {
            html += "<div class= \'chips\' style=\'height:100%;width:" + ((1 / form[i]) * 100) + "%;float:left\'></div>";
        }
        $("#cp_basic").children().eq(i).html(html);
    }
    for (var i = 0; i < 16; i++) {
        $("#basic_colors").children().eq(i).css("backgroundColor", self.HSV_to_HEX((i * 22.5), 1, 1))
    }
    for (var i = 0; i < 16; i++) {
        $("#neutral").children().eq(i).css("backgroundColor", self.HSV_to_HEX(0, 0, (i * 0.06666666666666667)));
    }
    $("#cp_basic").children().children().click(function() {
        var color = $(this).css("backgroundColor");
        color = color.slice(4, color.length - 1);
        color = color.split(",");
        var hsv = self.RGB_to_HSV(color[0] / 255, color[1] / 255, color[2] / 255);
        self.setColor(hsv[0], hsv[1], hsv[2]);
    });

    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_control',
        css : {
            width : '216px',
            height : '30px',
            position : 'relative',
            top : '50px'
        }
    }));

    //SCHEMES
    $("#cp_control").append($("<button>", {
        id : 'cp_schemes',
        html : 'Schemes',
        css : {
            left : '18px'
        },
        click : function() {
            $("#cp_schemediv").toggle();
        }
    }).addClass("button"));
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_schemediv',
        css : {
            height : '160px',
            position : 'relative',
            top : '60px',
            paddingBottom : '30px'

        }
    }));
    $("#cp_schemediv").hide();

    $("#cp_schemediv").append($("<div>", {
        id : 'cp_schemebox'
    }));
    for (var i = 0; i < 4; i++) {
        $("#cp_schemebox").append($("<div>", {
            css : {
                width : '100%',
                height : '35px',
                position : 'relative',
                top : '-5px',
                paddingBottom : '2px',
                paddingTop : '2px'
            }
        }));
    };
    var names = [["monochromatic"], ["complementary", "split-complementary"], ["triadic", "analagous"], ["tetrad"]];
    var form = [[16], [2, 3], [3, 3], [4]];
    for (var i = 0; i < form.length; i++) {
        for (var j = 0; j < form[i].length; j++) {
            $("#cp_schemebox").children().eq(i).append($("<div>", {
                html : "<center>" + names[i][j] + "</center>",
                css : {
                    float : 'left',
                    position : 'absolute',
                    top : '0',
                    left : (((92 / form[i].length) + 2) * j) + 2 + "%",
                    fontSize : '10px',
                    width : 92 / form[i].length + "%",
                    height : '100%'
                }
            }));
            for (var k = 0; k < form[i][j]; k++) {
                $("#cp_schemebox").children().eq(i).children("div").eq(j).append($("<div>", {
                    css : {
                        float : 'left',
                        position : 'relative',
                        top : '1px',
                        width : 100 / form[i][j] + "%",
                        height : '50%'
                    }
                }));
            }
        }
    }
    $("#cp_schemebox").children().children().css("fontSize", "8.5px");
    $("#cp_schemebox div:not(:has(*))").filter("div").click(function() {
        var color = $(this).css("backgroundColor");
        color = color.slice(4, color.length - 1);
        color = color.split(",");
        color = self.RGB_to_HEX(color[0], color[1], color[2]);
        $(".tab").eq(cp_current).children().first().css("backgroundColor", color);
        $(".tab").eq(cp_current).children().first().html("");
        self.drawColors(color);
    });
    ///end of schemes

    $("#cp_control").append($("<button>", {
        id : 'cp_nocolor',
         html : "No color",
        css : {
            left : '22px'
        },
        click : function() {
            self.update("none");
        }
    }).addClass("button"));

    $("#cp_control").append($("<button>", {
        id : 'cp_OK',
        html : "OK",
        css : {
            width : '60px',
            left : '35px'
        },
        click : function() {
            $("#shiva_dialogDiv").remove();
            return;
        }
    }).addClass("button"));
    $(".button").button();
    $(".button").css({
        position : 'relative',
        borderRadius : '8px',
        float : 'left',
        fontSize : '9px',
        top : '3px'
    });

    this.scheme = function() {    //Dynamically builds the schemes                                      
        for (var i = 0; i < 16; i++) {
            $("#cp_schemebox").children("div").eq(0).children("div").eq(0).children("div").eq(i).css("backgroundColor", self.HSV_to_HEX(hue, (1 - (i / 16)), 1));
        }
        $("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 180) % 360, sat, val));
        $("#cp_schemebox").children("div").eq
        (1).children("div").eq(1).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 150) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 210) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 120) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 240) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX((hue + 330) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 390) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 30) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 180) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(3).css("backgroundColor", self.HSV_to_HEX((hue + 210) % 360, sat, val));
    }

    this.update = function(attr, value) {     //Sets "hue", "sat", or "val" and handles the consequences
        if (attr == "none") {
            $(".tab").eq(cp_current).children().html("<center>none</center>");
            $(".tab").eq(cp_current).children().css("backgroundColor", "white");
            $("#cp_chip").css("backgroundColor", "white");
            $("#cp_chip").css("border", "1px dashed gray");
            $(".slider").first().slider("option", "value", 100);
            $(".slider").last().slider("option", "value", 100);
            //handle inputBox?
        } else if (attr == null) {
            $(".tab").eq(cp_current).children().html("");
            $(".tab").eq(cp_current).children().css("backgroundColor", "transparent");
            $("#cp_current").attr("value", "");
            $("#cp_chip").css("backgroundColor", "transparent");
            $("#cp_chip").css("border", "1px dashed gray");
            $(".slider").first().slider("option", "value", 100)
            $(".slider").last().slider("option", "value", 100)
            //handle inputBox?
        } else {
            if (attr == "saturation") {
                sat = value;
            } else if (attr == "brightness") {
                val = value;
            } else if (attr == "hue") {
                hue = value;
            }
            var color = self.HSV_to_HEX(hue, sat, val);
            $("#cp_chip").css("backgroundColor", color);
            $("#cp_chip").css("border", "1px solid gray");
            $("#cp_current").attr("value", color.slice(1))
            $(".tab").eq(cp_current).children().css("backgroundColor", color)
            $(".tab").eq(cp_current).children().html('');
            $(".slider").first().slider("option", "value", val * 100)
            $(".slider").last().slider("option", "value", sat * 100)
        }
        self.scheme()
    }

    this.add = function(color_HEX) {                //Adds a new chip to the tabs
        cp_current = $(".tab").length;
        $("#cp_colorbar a:eq(1)").before($("<div>", {
            css : {
                height : '16px',
                width : '28px',
                border : '1px solid gray',
                borderTop : '0',
                padding : '2px',
                position : 'relative',
                left : '-6px',
                float : 'left'
            },
            click : function() {
                $(".tab:not(:eq(" + $(this).index(".tab") + "))").css("borderBottom", '1px solid gray');
                $(this).css("borderBottom", '0');
                cp_current = $(this).index(".tab");
            }
        }).addClass("tab").append($("<div>", {
            css : {
                fontSize : '10px',
                width : "100%",
                height : '100%'
            }
        })).append($("<img>", {
            src : 'cpclose.png',
            css : {
                width : '4px',
                position : 'absolute',
                top : '2.5px',
                right : '2.5px'
            },
            mouseenter : function() {
                $(this).css({
                    width : '10px'
                })
            },
            mouseleave : function() {
                $(this).css({
                    width : '4px'
                })
            },
            click : function() {
                cp_current = $(this).parent().index(".tab");
                self.removeTab();
            }
        })));
        if (color_HEX == "none") {
            $('.tab').last().children().css("backgroundColor", "transparent");
            self.update("none");
        } else if (color_HEX == null) {
            $('.tab').last().children().css("backgroundColor", "transparent");
            self.update(null);
        } else {
            $('.tab').last().children().css("backgroundColor", color_HEX);
            var color = self.HEX_to_HSV(color_HEX);
            if ( typeof color != "undefined")
                self.setColor(color[0], color[1], color[2]);
            else
                self.setColor(0, 0, 0);
        }
        self.position_bar();
    }
    
    this.drawColors = function(color_HEX) {
		if (mode != 0) {
			var colors = inputBox.val().split(",");
			colors[cp_current] = color_HEX.slice(1);

			var boxChip = colors[cp_current];
			boxChip = "#" + boxChip;
			inputBox.css('border-color', boxChip);
			inputBoxChip.css('background-color', boxChip);

			var str = colors.toString();

			if (str[str.length - 1] != ",")
				str += ",";
			inputBox.val(str);
		}
		else{
			var boxChip = color_HEX;
			inputBox.css('border-color', boxChip);
			inputBoxChip.css('background-color', boxChip);
			inputBox.val(boxChip.slice(1,boxChip.length));
		}

		Draw();
	}
    this.setColor = function(h, s, v) {                       
        self.update("hue", h);
        self.update("saturation", s);
        self.update("brightness", v);

       self.drawColors(self.HSV_to_HEX(h, s, v));
    }

    this.position_bar = function() {
        if (cp_current > cp_first + 4)
            cp_current = cp_first + 4;
        $(".tab").eq(cp_current).click();
        $(".tab").show();
        $(".tab:lt(" + cp_first + ")").hide();
        $(".tab:gt(" + (cp_first + 4) + ")").hide();
    }
    //HANDLES the setting of HUE by angle relative to the center of the wheel
    this.position = function(x, y) {
        var xrel = x - 75;
        var yrel = 75 - y;
        var angleR = Math.atan2(yrel, xrel);

        var angle = angleR * (180 / Math.PI);
        var h;

        if (angle > 0) {
            h = (360 - (angle - 90)) % 360;
        } else {
            h = 90 + (angle - (angle * 2));
        }
        self.setColor(h, 1, 1);
    }

    this.removeTab = function() {
        $(".tab").eq(cp_current).remove();
        var colors = inputBox.val();
        colors = colors.split(",");
        colors.splice(cp_current, 1)
        var str = colors.toString();
        if (str[str.length - 1] != ",")
            str = str + ",";
        inputBox.val(str);
        while ($(".tab").length < 5)
        self.add();
        cp_current = cp_first;
        $(".tab").eq(cp_current).click();
        Draw();
    }
    //COLORPICKER INITIALIZATION

    var oldcols = inputBox.val();

    //SINGLE color mode
    if (mode == 0) {
        $("#cp_colorbar").hide();
        if (oldcols != "") {
            if (oldcols[0] != "#")
                oldcols = "#" + oldcols;
            var color = self.HEX_to_HSV(oldcols);
            self.setColor(color[0], color[1], color[2]);
        }
    }
    //MULTI color mode
    else {
        $("#cp_nocolor").hide();
        $("#cp_OK").css("left", '90px');
        if (oldcols != "") {
            oldcols = oldcols.split(",");
            var rem = 6 - oldcols.length;
            for (var i = 0; i < oldcols.length; i++) {
                if (oldcols[i] != "") {
                    self.add("#" + oldcols[i]);
                }
            }
            if (rem > 0) {
                for (var j = 0; j < rem; j++) {
                    self.add();
                }
            }
        } else {
            for (var j = 0; j < 5; j++) {
                self.add();
            }
        }

        $(".tab").first().click();
        Draw();

        $(".tab").hover(function() {
            $(this).css("cursor", "pointer");
        });
    }
    $("#cp_schemebox div:not(:has(*))").hover(function() {
        $(this).css("cursor", "pointer");
    });
    $("#cp_basic div:not(:has(*))").hover(function() {
        $(this).css("cursor", "pointer");
    });
    $(".slider a").hover(function() {
        $(this).css("cursor", "pointer");
    });
}

/* 	CSV has 3 required args, and one optional arg:
	inputID: 			the id value of the source URL's <input>
	mode: 				choose 'show' to enable user validation; 'hide' to run silently
	output_type:		sets output type, choose 'JSON', or 'Array'; support for Gtables is possible but maybe not necessary...
							the chartWrapper expects an array for its datasource not a Gtable
	callback (optional): sets the callback function to be executed on completion...the final call will be callback(output_type)
*/

function CSV(inputID, mode, output_type, callback) {

				var self = this;
  
				var cellopts = [',', '\t', 'other']
				var textopts = ['\"', '\''];
				var cellDelim = ',';
				var quote = '\''
				var CSV_title = '';
				var csvHasHeader = false;
				var CSV_data = [];

				var input = '';
				$.get('proxy.php', {
					url : $('#' + inputID).val()
				}, function(data) {
					input = data;
					if (data == -1) {
						console.log("Bad data source.");
						alert("Please check your source URL...we didn't find anything at the other end.");
						return;
					} else {
						CSV_title = $('#' + inputID).val().split('/').pop().split(".")[0];
						if (mode === 'hide') {
							self.prep();
							self.parse();
							self.done();
						} else if (mode === 'show') {
							self.prep();
							self.show(10);
						} else
							console.log("Bad mode type.");
					}
				});

				self.prep = function() {
					input = input.replace(/\n\r/g, '\n');
					input = input.replace(/\r\n/g, '\n');
					input = input.replace(/\r/g, '\n');

					var c = input.split(',').length;
					var t = input.split('\t').length;
					var cn = input.split(';').length

					//try to autodetect cell delimiter
					if (c >= t && c >= cn)
						cellDelim = ',';
					else if (t >= c && t >= cn)
						cellDelim = '\t';
					else if (cn >= c && cn >= t)
						cellDelim = ';';
					//try to autodetect quote delimiter
					quote = (input.split("\"").length >= input.split("\'").length) ? "\"" : "\'";
				}

				self.parse = function(n) {
					var cell = "";
					var row = 0;
					var text = false;
					CSV_data[row] = [];

					for (var i = 0; i < input.length; i++) {
						if ( typeof n !== 'undefined' && row === n)
							break;
						text = (RegExp(quote, 'g').test(input[i])) ? !text : text;
						if (text)
							cell += input[i];
						else {
							if (/\n/g.test(input[i])) {
								CSV_data[row].push(cell);
								cell = "";
								row++;
								if ( typeof input[i + 1] != 'undefined')
									CSV_data[row] = [];
							} else if (RegExp(cellDelim, 'g').test(input[i])) {
								CSV_data[row].push(cell);
								cell = "";
							} else {
								cell += input[i];
							}
						}
					}
					if (typeof CSV_data[0][0] != typeof CSV_data[1][0]) {
						csvHasHeader = true;
					}
				}

				self.init = function() {
					$('body').append($("<div>", {
						id : 'CSV_overlay',
						css : {
							color : 'black',
							position : 'absolute',
							top : '0',
							left : '0',
							width : $(document).width(),
							height : '150%',
							opacity : '0.4',
							backgroundColor : 'black'
						}
					}).append($('<div>', {
						id : 'CSV_preview',
						css : {
							padding : '56px',
							position : 'absolute',
							top : '10%',
							left : '20%',
							width : '800px',
							height : '400px',
							backgroundColor : 'white',
							borderRadius : '5px'
						}
					}).append($("<div>", {
						id : 'CSV_preview_table',
						marginLeft : 'auto',
						marginRight : 'auto',
						css : {
							overflow : 'scroll',
							position : 'absolute',
							top : '25%',
							height : '330px',
							width : '86%',
							borderRadius : '5px',
							border : 'solid thin gray'
						}
					})).append($("<div>", {
						id : 'csvControl',
						css : {
							position : 'absolute',
							top : '2%',
							bottom : '76%',
							width : '86%',
							borderRadius : '5px'
						}
					}))));
					$("#csvControl").append($("<p>", {
						css : {
							position : 'relative',
							left : '5px'
						}
					}).append($("<span>", {
						html : "Title: "
					})).append($("<input>", {
						id : 'titleInput',
						value: CSV_title,
						css : {
							position : 'relative',
							left : '5px',
							marginRight : '40px'
						},
						change: function(){
							CSV_title = $(this).val();
						}
					})).append($("<span>", {
						html : 'Data has header row?'
					})).append($("<input>", {
						id : 'dataHasHeader',
						type : 'checkbox',
						checked : (csvHasHeader) ? true : false,
						css : {
							position : 'relative',
							left : '5px'
							},
						change : function() {
							csvHasHeader = ($(this).is(":checked")) ? true : false;
							self.show()
							}
					}))).append($("<p>", {
						css : {
							position : 'relative',
							left : '5px'
						}
					}).append($("<span>", {
						html : "Cell delimiter: "
					})).append($("<select>", {
						id : 'cellDelimInput',
						html : '<option value=0>Comma (,)</option><option value=1>Tab (\\t)</option><option value=2> Other </option>',
						css : {
							width : '100px',
							position : 'relative',
							left : '5px',
							marginRight : '40px'
						},
						change : function() {
							if ($(this).val() == 2) {
								$("#cellDelimOther").show();
							} else {
								$("#cellDelimOther").hide();
								cellDelim = cellopts[$(this).val()];
								self.show();
							}
						}
					})).append($("<span>", {
						html : 'Text delimitier: '
					})).append($("<select>", {
						id : 'textDelimInput',
						html : "<option value=0>Double quote (\")</option><option value=1>Single quote (\')</option>",
						css : {
							position : 'relative',
							left : '5px'
						},
						change : function() {
							quote = textopts[$(this).val()];
							self.show();
						}
					})));
					$('#CSV_overlay').append($("<input>", {
						id : 'cellDelimOther',
						css : {
							height : $('#cellDelimInput').css('height') - 2,
							width : '75px',
							position : 'absolute',
							left : $('#cellDelimInput').offset().left,
							top : $('#cellDelimInput').offset().top
						},
						change : function() {
							cellDelim = $(this).val();
							self.show();
						}
					}).hide());

					$('#CSV_preview').append($("<button>", {
						html : 'Back',
						css : {
							position : 'absolute',
							bottom : '15px',
							left : '350px'
						},
						click : function() {
							$(input).val("");
							$('#CSV_overlay').remove();
						}
					}).button()).append($("<button>", {
						html : 'Accept',
						css : {
							position : 'absolute',
							bottom : '15px',
							right : '391px'
						},
						click : function() {
							self.done();
						}
					}).button())

					$('#cellDelimInput').val(cellDelim);
					$('#textDelimInput').val(quote);
				}
				self.show = function() {
					if ($('#CSV_overlay').length > 0)
						$('#CSV_preview_table').children().remove();
					else
						self.init();
					self.parse(10);

					var gwidth;

					for (var i = 0; i < 10; i++) {
						var odd = (i % 2 == 0) ? 'lightgray' : 'transparent';
						$("#CSV_preview_table").append($("<div>", {
							css : {
								height : $('#CSV_preview_table').height() / 10 + 'px',
								backgroundColor : odd
							}
						}).addClass("row"));
						for (var j = 0; j < CSV_data[i].length; j++) {
							var alignment = 'right';
							if (isNaN(CSV_data[i][j]))
								alignment = 'left';
							$("#CSV_preview_table").children().eq(i).append($("<div>", {
								html : (i === 0 && csvHasHeader) ? '<center><strong>' + CSV_data[i][j] + '</strong></center>' : CSV_data[i][j],
								align : alignment,
								css : {
									paddingLeft : '2px',
									paddingRight : '2px',
									height : $('#CSV_preview_table').height() / 10 + 'px',
									float : 'left',
									outline : '1px solid black'
								}
							}).addClass("col"+j));
							if ($('.col' + j).length > 1 && $('.col' + j).last().width() > $('.col' + j).eq($('.col' + j).last().index('.col' + j) - 1).width()) {
								$('.col' + j).css('width', $('.col' + j).last().width() + 'px');
							} else {
								$('.col' + j).last().css('width', $('.col' + j).width() + 'px');
							}
						}
					}
					var gwidth = 0;
					for (var i = 0; i < $('.row').last().children().length; i++) {
						gwidth += $('.row').last().children().eq(i).width();
					}
					$('.row').css('width', (gwidth + (CSV_data[0].length * 4)) + 'px');
				}

				self.to_JSON = function() {
					if (CSV_data.length == 0) {
						throw new Error("The CSV_data source is empty.")
						return;
					} else {
						var table = {
							"title" : (CSV_title != "") ? CSV_title : "New Table",
							"headers" : (csvHasHeader) ? CSV_data[0] : null,
							"data" : (csvHasHeader) ? CSV_data.slice(1) : CSV_data
						}
						$("#CSV_overlay").remove();
						return table;
					}
				}

				/*self.to_Gtable = function() {
					if (CSV_data.length == 0) {
						throw new Error("The CSV_data source is empty.")
						return;
					} else{
						return google.visualization.arrayToDataTable(CSV_data);
					}
				}*/

				self.done = function() {
					self.parse();
					if (callback != null) {
						if (output_type === 'JSON') {
							callback(self.to_JSON());
						} else if (output_type === 'Google')
							callback(self.to_Gtable());
						else if(output_type === 'Array'){
							callback(CSV_data);
						}						
						else {
							console.log('Output type not recognized or not implemented.');
							return;
						}
					} else {
						if (output_type === 'JSON')
							return (self.toJSON());
						else if (output_type === 'Google')
							return (self.to_Gtable());
						else if(output_type === 'Array')
							return CSV_data;
						else
							console.log('Output type not recognized or not implemented.');
					}
				}
			}


