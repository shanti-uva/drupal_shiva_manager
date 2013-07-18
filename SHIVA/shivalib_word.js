SHIVA_Show.prototype.DrawWordCloud = function() {
    //Helper Functions
    //extract Object attrs from an array of Objects
    Array.prototype.extract = function(attr) {
        var res = [];
        for (var i = 0; i < this.length; i++) {
            res.push(this[i][attr]);
        }
        return res;
    }
    //find the difference between an array and an array of Objects
    Array.prototype.diff = function(arr) {
        return this.filter(function(val) {
            return arr.indexOf(val.text) == -1;
        });
    }
    //retrieve an array item
    Array.prototype.find = function(item, attr) {
        for (var i = 0; i < this.length; i++) {
            if (this[i][attr] == item)
                return this[i];
        }
        return false;
    }
    var cloud;
    var fill = d3.scale.category20();
    //Routing to prevent unecessary redraws
    if (!this.wcloud) {
        cloud = new wordCloud(this.container);
        this.wcloud = cloud;
        cloud.options = this.options;
        cloud.load(this.options.dataSourceUrl);
    } else {
        cloud = this.wcloud;
        var props = Object.keys(this.options);
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (this.wcloud.options[prop] != this.options[prop]) {
                if (prop == "dataSourceUrl") {
                    cloud.options = this.options;
                    cloud.load(cloud.options['dataSourceUrl']);
                    break;
                } else if (prop == "width" || prop == "height" || prop == "low_threshold" || prop == "high_threshold" || prop == 'tiltRange' || prop == "scale") {
                    if(prop == "height"){
                        if(this.options.height.indexOf('%') != -1)
                            this.options.height = $('#containerDiv').height()*(this.options.height.slice(0,-1)/100);
                    }
                    cloud.options = this.options;
                    cloud.buildLayout(cloud.d);
                } else {
                    switch (prop) {
                        case 'font_name':
                            d3.selectAll('text').style('font-family', this.options.font_name);
                            break;
                        case 'backgroundColor':
                            if(typeof this.options.backgroundColor == 'undefined' || this.options.backgroundColor == '')
                                this.options.backgroundColor = 'ffffff';
                            d3.select('rect').style('fill', '#' + this.options.backgroundColor);
                            break;
                        case 'spectrum':
                            cloud.colorize(this.options.spectrum);
                            break;
                        case 'title':
                            d3.select('#cloudTitle').text(this.options.title);
                            break;
                        case 'titleColor':
                            d3.select('#cloudTitle').attr('fill', '#' + this.options.titleColor);
                            break;
                        case 'titleFontSize':
                            d3.select('#cloudTitle').style('font-size', this.options.titleFontSize + 'px');
                            break;
                        case 'wordList':
                            if (this.options.wordList == "true")
                                $('#cloudShowListButton').show();
                            else {
                                $('#cloudShowListButton').hide();
                                $('#wordCloudWordList').hide();
                            }
                            break;
                    }
                }
            }
        }
        cloud.options = this.options;
    }
    function wordCloud(container) {
        this.d = [];
        this.filterSet = [];
        this.container = container;
        this.draw = function(data) {
            $('svg').remove();
            $('#cloudLoad').remove(); 
            var svg = d3.select("#" + cloud.container).append("svg").attr("id", "wordCloud").attr("width", cloud.options.width).attr("height", cloud.options.height)//.attr('viewbox', '0 0 '+[cloud.options.width, cloud.options.height].join(' '));
            svg.append("g").attr('fill', 'none').attr('scale', '(1,-1)').append('rect').attr('x', 0).attr('y', 0).attr('width', '100%').attr('height', '90%').style('fill', (typeof cloud.options.backgroundColor =="undefined" || cloud.options.backgroundColor == "") ? 'white' : '#'+cloud.options.backgroundColor);
            var t = d3.select('g').selectAll("text").data(data);
            t.enter().append("text").attr('class', 'word').style("font-size", function(d) {
                return d.size + "px";
            }).style("font-family", cloud.options.font_name).style("fill", function(d, i) {
                if(typeof d.color != 'undefined')
                    return (d.color[0]=="#")?d.color:'#'+d.color;
                return fill(i);
            }).attr("text-anchor", "middle").attr("transform", function(d) {
                return "translate(" + [d.x+cloud.options.width/2, d.y+cloud.options.height/2] + ")rotate(" + d.rotate + ")";
            }).text(function(d) {
                return d.text;
            });
            t.exit().remove();
            
            d3.select('svg').append('text').attr('id', 'cloudTitle').text(cloud.options.title).style('font-size', cloud.options.titleFontSize + 'px').attr('text-anchor', 'middle').attr('y', cloud.options.height - (cloud.options.titleFontSize)).attr('x', cloud.options.width / 2);
            shivaLib.SendShivaMessage("ShivaWord=ready|" +window.name);
            //add wordlist
            if($('#wordCloudWordList').length ==0){
            $('#containerDiv').append($('<a>').attr('id', 'cloudShowListButton').css({
                position : 'absolute',
                top : '10px',
                left : 0,
                width : '25px',
                height : '20px'
            }).click(function() {
                $('#wordCloudWordList').toggle();
            }).button({
                icons : {
                    primary : 'ui-icon-script'
                }
            }).hide());

            $('#containerDiv').append($('<div>', {
                id : 'wordCloudWordList',
                css : {
                    position :'absolute',
                    top : '10px',
                    left : '20px',
                    height : (cloud.options.height * 0.6) + "px",
                    width : '120px',
                    borderRadius : '8px',
                    border : '5px solid #EEE',
                    backgroundColor : 'white',
                    overflow: 'scroll',
                    padding: '5px',
                }
            }).hide());
            }
            d3.selectAll('.listEntry').remove();
            
            d3.select('#wordCloudWordList').selectAll('.listEntry').data(cloud.d).enter().append('div').attr('class','listEntry').style('vertical-align','middle').style('height','20px').style('width', '100px').text(function(d) {
                return d.text + " (" + d.freq + ")";
            }).on('click', function(d){
                //More SEA events
                console.log(d.text + " : " +  d.freq);
                shivaLib.SendShivaMessage("ShivaWord=click|" +window.name+"|"+ d.text + "|" + d.freq);
                $('.listEntry').css('backgroundColor','white');
                $(this).css('backgroundColor', 'rgba(255,255,105,0.5)');
            });
            
            var listClickHandler = function(e, pass){
                e.preventDefault();
                e.stopPropagation();
                if(typeof pass =="undefined")
                    pass = false;
                if($(this).hasClass('ui-icon-close')){
                    $(this).removeClass('ui-icon-close').addClass('ui-icon-arrowreturnthick-1-w');
                    $(this).parent().css('opacity',0.5);
                }
                else{
                    $(this).removeClass('ui-icon-arrowreturnthick-1-w').addClass('ui-icon-close');
                    $(this).parent().css('opacity',1);   
                }
                var word = $(this).parent().text().split(' ')[0];
                if(!pass)
                    cloud.filter();                
            };
            
            $('.listEntry').append($('<span>',{
                css: {
                    float: 'right'
                }
            }).addClass('listEntryFilter ui-icon ui-icon-close').on('click', listClickHandler));
            
            $('.listEntry').filter(function(i){
                    return cloud.filterSet.indexOf($(this).text().split(' ')[0]) != -1;
            }).find('span').trigger('click',[true]);
            
            if (cloud.options.wordlist == "true") {
                $('#cloudShowListButton').show();
            }
            
            //add colors if necessary
            if(typeof cloud.options.spectrum != "undefined" && cloud.options.spectrum!="")
                cloud.colorize(cloud.options.spectrum);
            
            //Bind Events for SHIVA Messages
            d3.selectAll('.word').on("click", function(d) {
                console.log(d.text + " : " +  d.freq);
                shivaLib.SendShivaMessage("ShivaWord=click|" +window.name+"|"+ d.text + "|" + d.freq);
            });
            //ready
            shivaLib.SendShivaMessage("ShivaWord=ready|"+window.name);
        };
        this.buildLayout = function(words) {
            var count = 0;
            var l = words.length;
            for(var i=0; i<l; i++){
                count+=words[i].freq;
            }
            //how close is the max to the average?
            var avg = count/l;
            var distro = (words[0].freq-avg)/(words[0].freq);
                        
            var fs;
            if(cloud.options.scale=="logarithmic")
                fs = d3.scale.log().range([5,100]);
            else if(cloud.options.scale=="linear")
                fs = d3.scale.linear().domain([0, words[0].freq]).range([5,distro*(0.15*cloud.options.height)]);
            else if(cloud.options.scale =="binary")
                fs = d3.scale.quantile().range([0,(cloud.options.height/(words.length/5))]);
                  
            var high,low;      
            low = (typeof cloud.options.low_threshold == 'undefined' || cloud.options.low_threshold=='')?0:parseInt(cloud.options.low_threshold);
            high = (typeof cloud.options.high_threshold == 'undefined' || cloud.options.high_threshold=='')?100000000000:parseInt(cloud.options.high_threshold);
            words = words.filter(function(el){
                return el.freq >= low && el.freq <= high;
            });
            
            d3.layout.cloud().size([cloud.options.width, cloud.options.height * 0.8]).words(words).rotate(function() {
                return ~~((Math.random() * 2) * cloud.options.tiltRange)*((Math.random()>0.5)?1:-1);
            }).font(cloud.options.font_name).fontSize(function(d) {
                return fs(d.freq);
            }).on("end", function(){
                cloud.draw(words);
            }).start();
        };
        this.load = function(src, algo) {
            if (typeof algo == "undefined")
                algo = "raw";
            d3.select('svg').remove();
            var qs = 'parser.php?' + encodeURIComponent('url') + '=' + encodeURIComponent(src) + "&" + encodeURIComponent('a') + '=' + encodeURIComponent(algo);
            d3.json(qs, function(error, d) {
                if (d.error) {
                    if (d.error == "fetch_fail")
                        alert("Sorry we didn't find anything at that URL. Plese make sure it is correct.");
                    else if (d.error == "robots")
                        $('<div id="wordcloudError"><p> SHIVA has detected that the site you are trying to access has set a robots.txt policy that prohibits machine access to the content you are trying to fetch. Please instead copy and paste the text from the page you would like to access into the text box to the right of "Data source URL". <br /><br /> For more information about robots.txt, please visit <a target="_blank" href="http://www.robotstxt.org/robotstxt.html">this page.</a></p></div>').dialog({
                            appendTo : 'body',
                            position : 'top'
                        });
                    return false;
                }
                cloud.d = d;
                cloud.buildLayout(d);
            });
        };
        this.filter = function(){
            var words = [];
            cloud.filterSet.length = 0;
            $('.listEntry').filter(function(){
                return $(this).children('span').hasClass('ui-icon-close');
            }).each(function(){
                words.push($(this).text().split(' (')[0]);
            });
            var data = cloud.d.filter(function(el){
                if(words.indexOf(el.text) == -1){
                    cloud.filterSet.push(el.text);
                    return false;
                }
                else
                    return true;
            });
            cloud.buildLayout(data);
        };
        this.colorize = function(colors){
             var opts = colors.split(',').slice(0, -1);
                            if (opts.length == 1)
                                opts.push('ffffff');
                            var spec = [];
                            for (var j = 1; j < opts.length; j++) {
                                var s = d3.hsl('#' + opts[j - 1]);
                                var e = d3.hsl('#' + opts[j]);
                                spec.push(d3.interpolate(s, e));
                            }
                            var size = cloud.d[0].freq + 1;
                            d3.selectAll('.word').style('fill', function(d, i) {
                                var hole = Math.floor((cloud.d[i].freq / size) * spec.length);
                                var rem = (cloud.d[i].freq / size) * spec.length % 1;
                                return spec[hole](rem);
            });
        };
    }
}

SHIVA_Show.prototype.WordActions = function(msg) {
    var m = msg.split('=')[1];
    var cmd = m.split('|');
    switch(cmd[0]) {
        case 'data':
            if (/^http/gi.test(cmd[1])) {
                //parse URL
                this.wcloud.load(cmd[1]);
            } else {
                try {
                    //check if JSON
                    var json = JSON.parse(cmd[1]);
                    if(json[0] instanceof Array){
                        json = json.map(function(a){
                            if (typeof a[2] != "undefined")
                                return {'text':a[0], 'size':0, 'freq':a[1], 'color':a[2]};
                            return   {'text':a[0], 'size':0, 'freq':a[1]};
                         });                    
                    }
                    json.sort(function(a,b){
                        return b.freq-a.freq;
                    });
                    this.wcloud.d = json;
                    this.wcloud.buildLayout(json);
                } catch(e) {
                    //parse raw
                    this.wcloud.load(cmd[1]);
                }
            }
        break;
        case 'resize':
            if (cmd[1] == "100") {                                            // If forcing 100%
                $("#"+shivaLib.container).width("100%");                    // Set container 100%
                $("#"+shivaLib.container).height("100%");                   // Set container 100%
                this.wcloud.options.width =  $("#"+shivaLib.container).width();
                this.wcloud.options.height =  $("#"+shivaLib.container).height();
            }
            this.wcloud.buildLayout(this.wcloud.d);
        break;
    }
}