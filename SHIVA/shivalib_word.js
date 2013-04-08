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
    Array.prototype.find = function(item, attr){
        for(var i=0; i<this.length; i++){
            if(this[i][attr]==item)
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
                } else if (prop == "width" || prop == "height" || prop == "wordcount") {
                    cloud.options = this.options;
                    cloud.buildLayout(cloud.d.slice(0, cloud.options.wordcount), cloud.d[0].size);
                } else {
                    switch (prop) {
                        case 'font_name':
                            d3.selectAll('text').style('font-family', this.options.font_name);
                            break;
                        case 'backgroundColor':
                            d3.select('rect').style('fill', '#'+this.options.backgroundColor);
                            break;
                        case 'spectrum':
                            var opts = this.options.spectrum.split(',').slice(0,-1);
                            if(opts.length==1)
                                opts.push('ffffff');
                            var spec = [];
                            for (var j=1; j<opts.length; j++) {
                                var s = d3.hsl('#'+opts[j-1]);
                                var e = d3.hsl('#'+opts[j]);
                                spec.push(d3.interpolate(s,e));
                            }
                            var size = cloud.d[0].size+1;
                            d3.selectAll('.word').style('fill', function(d, i){
                                var hole = Math.floor((cloud.d[i].size/size)*spec.length);
                                var rem = (cloud.d[i].size/size)*spec.length%1;
                                return spec[hole](rem);
                            });
                            break;
                        case 'title': 
                            d3.select('#cloudTitle').text(this.options.title);
                        break;
                        case 'titleColor':
                            d3.select('#cloudTitle').attr('fill', '#'+this.options.titleColor);
                        break;
                        case 'titleFontSize':
                            d3.select('#cloudTitle').style('font-size', this.options.titleFontSize+'px');
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
        this.draw = function(words) {
            $('#containerDiv').html('');
            d3.select("#" + cloud.container).append("svg").attr("id", "wordCloud").attr("width", cloud.options.width).attr("height", cloud.options.height).append("g").attr("transform", "translate(" + cloud.options.width / 2.15 + "," + ((cloud.options.height / 2.15)) + ")").append('rect').attr("transform", "translate(-" + cloud.options.width / 2.15 + ",-" + ((cloud.options.height / 2.15)) + ")").attr('x', 0).attr('y', 0).attr('width', '100%').attr('height', '80%').style('fill', (cloud.options.backgroundColor == "") ? 'white' : cloud.options.backgroundColor);
            d3.select('g').selectAll("text").data(words).enter().append("text").attr('class', 'word').style("font-size", function(d) {
                return d.size + "px";
            }).style("font-family", cloud.options.font_name).style("fill", function(d, i) {
                return fill(i);
            }).attr("text-anchor", "middle").attr("transform", function(d) {
                return "translate(" + [d.x + 30, d.y] + ")rotate(" + d.rotate + ")";
            }).text(function(d) {
                return d.text;
            });
            d3.select('svg').append('text').attr('id', 'cloudTitle').text(cloud.options.title).style('font-size', cloud.options.titleFontSize+'px').attr('text-anchor', 'middle').attr('y', cloud.options.height - 35).attr('x', cloud.options.width / 2);
            
            //Bind Events for SHIVA Messages
            d3.selectAll('.word').on("click", function() {
                console.log(d.text+" : "+d.size);
                shivaLib.SendShivaMessage("ShivaWord=click|"+d.text+"|"+d.size);
            });
            //ready
            shivaLib.SendShivaMessage("ShivaWord=ready");
        };
        this.buildLayout = function(data, max) {
            d3.layout.cloud().size([cloud.options.width, cloud.options.height * 0.8]).words(data).rotate(function() {
                return ~~(Math.random() * 2) * 90;
            }).font(cloud.options.font_name).fontSize(function(d) {
                return d.size * ((cloud.options.height / 3) / max);
            }).on("end", cloud.draw).start();
        };
        this.load = function(src) {
            d3.select('svg').remove();
            var qs = 'parser.php?' + encodeURIComponent('url') + '=' + encodeURIComponent(src);
            d3.json(qs, function(error, data) {
                if(data.error){
                    if(data.error=="fetch_fail")
                        alert("Sorry we didn't find anything at that URL. Plese make sure it is correct.");  
                    else if(data.error == "robots") 
                        $('<div id="wordcloudError"><p> SHIVA has detected that the site you are trying to access has set a robots.txt policy that prohibits machine access to the content you are trying to fetch. Please instead copy and paste the text from the page you would like to access into the text box to the right of "Data source URL". <br /><br /> For more information about robots.txt, please visit <a target="_blank" href="http://www.robotstxt.org/robotstxt.html">this page.</a></p></div>').dialog({appendTo:'body',position:'top'});
                    return false;            
                }
                cloud.d = data;
                cloud.buildLayout(data.slice(0, cloud.options.wordcount), data[0].size);
            });
        };
        this.parseRaw = function(str){
            var stop = ["a", "A", "about", "About", "above", "Above", "after", "After", "again", "Again", "against", "Against", "all", "All", "am", "Am", "an", "An", "and", "And", "any", "Any", "are", "Are", "aren\'t", "Aren\'t", "as", "As", "at", "At", "be", "Be", "because", "Because", "been", "Been", "before", "Before", "being", "Being", "below", "Below", "between", "Between", "both", "Both", "but", "But", "by", "By", "can\'t", "Can\'t", "cannot", "Cannot", "could", "Could", "couldn\'t", "Couldn\'t", "did", "Did", "didn\'t", "Didn\'t", "do", "Do", "does", "Does", "doesn\'t", "Doesn\'t", "doing", "Doing", "don\'t", "Don\'t", "down", "Down", "during", "During", "each", "Each", "few", "Few", "for", "For", "from", "From", "further", "Further", "had", "Had", "hadn\'t", "Hadn\'t", "has", "Has", "hasn\'t", "Hasn\'t", "have", "Have", "haven\'t", "Haven\'t", "having", "Having", "he", "He", "he\'d", "He\'d", "he\'ll", "He\'ll", "he\'s", "He\'s", "her", "Her", "here", "Here", "here\'s", "Here\'s", "hers", "Hers", "herself", "Herself", "him", "Him", "himself", "Himself", "his", "His", "how", "How", "how\'s", "How\'s", "i", "I", "i\'d", "I\'d", "i\'ll", "I\'ll", "i\'m", "I\'m", "i\'ve", "I\'ve", "if", "If", "in", "In", "into", "Into", "is", "Is", "isn\'t", "Isn\'t", "it", "It", "it\'s", "It\'s", "its", "Its", "itself", "Itself", "let\'s", "Let\'s", "me", "Me", "more", "More", "most", "Most", "mustn\'t", "Mustn\'t", "my", "My", "myself", "Myself", "no", "No", "nor", "Nor", "not", "Not", "of", "Of", "off", "Off", "on", "On", "once", "Once", "only", "Only", "or", "Or", "other", "Other", "ought", "Ought", "our", "Our", "ours ", "Ours ", "ourselves", "Ourselves", "out", "Out", "over", "Over", "own", "Own", "same", "Same", "shan\'t", "Shan\'t", "she", "She", "she\'d", "She\'d", "she\'ll", "She\'ll", "she\'s", "She\'s", "should", "Should", "shouldn\'t", "Shouldn\'t", "so", "So", "some", "Some", "such", "Such", "than", "Than", "that", "That", "that\'s", "That\'s", "the", "The", "their", "Their", "theirs", "Theirs", "them", "Them", "themselves", "Themselves", "then", "Then", "there", "There", "there\'s", "There\'s", "these", "These", "they", "They", "they\'d", "They\'d", "they\'ll", "They\'ll", "they\'re", "They\'re", "they\'ve", "They\'ve", "this", "This", "those", "Those", "through", "Through", "to", "To", "too", "Too", "under", "Under", "until", "Until", "up", "Up", "very", "Very", "was", "Was", "wasn\'t", "Wasn\'t", "we", "We", "we\'d", "We\'d", "we\'ll", "We\'ll", "we\'re", "We\'re", "we\'ve", "We\'ve", "were", "Were", "weren\'t", "Weren\'t", "what", "What", "what\'s", "What\'s", "when", "When", "when\'s", "When\'s", "where", "Where", "where\'s", "Where\'s", "which", "Which", "while", "While", "who", "Who", "who\'s", "Who\'s", "whom", "Whom", "why", "Why", "why\'s", "Why\'s", "with", "With", "won\'t", "Won\'t", "would", "Would", "wouldn\'t", "Wouldn\'t", "you", "You", "you\'d", "You\'d", "you\'ll", "You\'ll", "you\'re", "You\'re", "you\'ve", "You\'ve", "your", "Your", "yours", "Yours", "yourself", "Yourself", "yourselves", "Yourselves"];
            str= str.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            str = str.replace(/\s/g, ' ');
            var tokes = str.split(' ');
            var count = [];
            for(var i=0; i<tokes.length; i++){
                var w = tokes[i].toLowerCase();
                var ind = count.extract('text').indexOf(w); 
                if(/w/.test(w) || stop.indexOf(w) != -1)
                    continue;
                if(ind ==-1){
                    count.push({text:w, size:1});
                }
                else{
                    count[ind].size++;
                }
            }
            count.sort(function(a,b){
                return a.size-b.size;
            });
            cloud.d = count;
            //cloud.buildLayout(count.slice(0, cloud.options.wordcount), count[0].size);
        }
    }

    /*wordCloud.prototype.filter = function(word) {
     if (cloud.d.extract('text').indexOf(word) == -1) {
     for (var i = 0; i < 3; i++) {
     $('#wordFilter').animate({
     backgroundColor : "yellow"
     }, 200, function() {
     $(this).css('background-color', 'white');
     });
     }
     } else {
     cloud.filterSet.push(word);
     var filtered = cloud.d.slice(0, (cloud.options.wordcount + cloud.filterSet.length)).diff(cloud.filterSet);
     d3.select('svg').remove();
     cloud.buildLayout(filtered, filtered[0].size);

     $('body').append($('<div>', {
     html : '<span>' + $('#wordFilter').val() + '</span>',
     css : {
     textAlign : 'left',
     verticalAlign : 'center',
     width : '100px',
     height : '25px',
     position : 'absolute',
     right : '15px',
     top : 35 + ($('.filterWord').length * 25) + 'px',
     },
     mouseenter : function() {
     $(this).css('border', '1px solid black');
     },
     mouseleave : function() {
     $(this).css('border', 0);
     }
     }).addClass('filterWord').append($('<button>', {
     html : 'X',
     css : {
     width : 'auto',
     height : 'auto',
     float : 'right'
     },
     click : function() {
     $(this).parent().remove();
     cloud.filterSet.splice(cloud.filterSet.indexOf($(this).parent().children('span').html()), 1);
     var filtered = cloud.d.slice(0, (100 + cloud.filterSet.length)).diff(cloud.filterSet);
     d3.select('svg').remove();
     cloud.buildLayout(filtered, filtered[0].size);
     }
     })));
     }
     }*/
}

SHIVA_Show.prototype.WordActions = function(msg){
    var m = msg.split('=')[1];
    var cmd = m.split('|');
    switch(cmd[0]){
        case 'data':
            if(/^http/gi.test(cmd[1])){
                //parse URL
                this.wcloud.load(cmd[1]);  
            }
            else{
                try {
                    //check if JSON
                    var json = JSON.parse(cmd[1]);
                    json.sort(function(a,b){
                        return a.size-b.size;
                    });
                    this.wcloud.buildLayout(json.slice(0, this.wcloud.options.wordcount),json[0].size);
                } catch(e){
                    //parse raw
                    this.wcloud.load(cmd[1]);
                }
            }
        break;
    }
}