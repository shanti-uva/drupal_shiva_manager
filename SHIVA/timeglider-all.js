/**
 * @preserve
// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
*/
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,c,b){if(a!=null)if(s&&a.forEach===s)a.forEach(c,b);else if(a.length===
+a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&c.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){k?d=c.call(e,d,a,b,f):(d=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c=c||b.identity;var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e|=c.call(d,a,b,f))return m});return!!e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};h(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||
(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return f.call(a);if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,
function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),
function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,
b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);
c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;
a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;
if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==
1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||
!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};
b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};
var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,
arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();

/**
 * @preserve
 // Backbone.js 0.5.3
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://documentcloud.github.com/backbone
*/
(function(){var h=this,p=h.Backbone,e;e=typeof exports!=="undefined"?exports:h.Backbone={};e.VERSION="0.5.3";var f=h._;if(!f&&typeof require!=="undefined")f=require("underscore")._;var g=h.jQuery||h.Zepto;e.noConflict=function(){h.Backbone=p;return this};e.emulateHTTP=!1;e.emulateJSON=!1;e.Events={bind:function(a,b,c){var d=this._callbacks||(this._callbacks={});(d[a]||(d[a]=[])).push([b,c]);return this},unbind:function(a,b){var c;if(a){if(c=this._callbacks)if(b){c=c[a];if(!c)return this;for(var d=
0,e=c.length;d<e;d++)if(c[d]&&b===c[d][0]){c[d]=null;break}}else c[a]=[]}else this._callbacks={};return this},trigger:function(a){var b,c,d,e,f=2;if(!(c=this._callbacks))return this;for(;f--;)if(b=f?a:"all",b=c[b])for(var g=0,h=b.length;g<h;g++)(d=b[g])?(e=f?Array.prototype.slice.call(arguments,1):arguments,d[0].apply(d[1]||this,e)):(b.splice(g,1),g--,h--);return this}};e.Model=function(a,b){var c;a||(a={});if(c=this.defaults)f.isFunction(c)&&(c=c.call(this)),a=f.extend({},c,a);this.attributes={};
this._escapedAttributes={};this.cid=f.uniqueId("c");this.set(a,{silent:!0});this._changed=!1;this._previousAttributes=f.clone(this.attributes);if(b&&b.collection)this.collection=b.collection;this.initialize(a,b)};f.extend(e.Model.prototype,e.Events,{_previousAttributes:null,_changed:!1,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},get:function(a){return this.attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;b=this.attributes[a];
return this._escapedAttributes[a]=(b==null?"":""+b).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},has:function(a){return this.attributes[a]!=null},set:function(a,b){b||(b={});if(!a)return this;if(a.attributes)a=a.attributes;var c=this.attributes,d=this._escapedAttributes;if(!b.silent&&this.validate&&!this._performValidation(a,b))return!1;if(this.idAttribute in a)this.id=a[this.idAttribute];
var e=this._changing;this._changing=!0;for(var g in a){var h=a[g];if(!f.isEqual(c[g],h))c[g]=h,delete d[g],this._changed=!0,b.silent||this.trigger("change:"+g,this,h,b)}!e&&!b.silent&&this._changed&&this.change(b);this._changing=!1;return this},unset:function(a,b){if(!(a in this.attributes))return this;b||(b={});var c={};c[a]=void 0;if(!b.silent&&this.validate&&!this._performValidation(c,b))return!1;delete this.attributes[a];delete this._escapedAttributes[a];a==this.idAttribute&&delete this.id;this._changed=
!0;b.silent||(this.trigger("change:"+a,this,void 0,b),this.change(b));return this},clear:function(a){a||(a={});var b,c=this.attributes,d={};for(b in c)d[b]=void 0;if(!a.silent&&this.validate&&!this._performValidation(d,a))return!1;this.attributes={};this._escapedAttributes={};this._changed=!0;if(!a.silent){for(b in c)this.trigger("change:"+b,this,void 0,a);this.change(a)}return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,e,f){if(!b.set(b.parse(d,f),a))return!1;c&&
c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"read",this,a)},save:function(a,b){b||(b={});if(a&&!this.set(a,b))return!1;var c=this,d=b.success;b.success=function(a,e,f){if(!c.set(c.parse(a,f),b))return!1;d&&d(c,a,f)};b.error=i(b.error,c,b);var f=this.isNew()?"create":"update";return(this.sync||e.sync).call(this,f,this,b)},destroy:function(a){a||(a={});if(this.isNew())return this.trigger("destroy",this,this.collection,a);var b=this,c=a.success;a.success=function(d){b.trigger("destroy",
b,b.collection,a);c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"delete",this,a)},url:function(){var a=k(this.collection)||this.urlRoot||l();if(this.isNew())return a;return a+(a.charAt(a.length-1)=="/"?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this)},isNew:function(){return this.id==null},change:function(a){this.trigger("change",this,a);this._previousAttributes=f.clone(this.attributes);this._changed=!1},hasChanged:function(a){if(a)return this._previousAttributes[a]!=
this.attributes[a];return this._changed},changedAttributes:function(a){a||(a=this.attributes);var b=this._previousAttributes,c=!1,d;for(d in a)f.isEqual(b[d],a[d])||(c=c||{},c[d]=a[d]);return c},previous:function(a){if(!a||!this._previousAttributes)return null;return this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},_performValidation:function(a,b){var c=this.validate(a);if(c)return b.error?b.error(this,c,b):this.trigger("error",this,c,b),!1;return!0}});
e.Collection=function(a,b){b||(b={});if(b.comparator)this.comparator=b.comparator;f.bindAll(this,"_onModelEvent","_removeReference");this._reset();a&&this.reset(a,{silent:!0});this.initialize.apply(this,arguments)};f.extend(e.Collection.prototype,e.Events,{model:e.Model,initialize:function(){},toJSON:function(){return this.map(function(a){return a.toJSON()})},add:function(a,b){if(f.isArray(a))for(var c=0,d=a.length;c<d;c++)this._add(a[c],b);else this._add(a,b);return this},remove:function(a,b){if(f.isArray(a))for(var c=
0,d=a.length;c<d;c++)this._remove(a[c],b);else this._remove(a,b);return this},get:function(a){if(a==null)return null;return this._byId[a.id!=null?a.id:a]},getByCid:function(a){return a&&this._byCid[a.cid||a]},at:function(a){return this.models[a]},sort:function(a){a||(a={});if(!this.comparator)throw Error("Cannot sort a set without a comparator");this.models=this.sortBy(this.comparator);a.silent||this.trigger("reset",this,a);return this},pluck:function(a){return f.map(this.models,function(b){return b.get(a)})},
reset:function(a,b){a||(a=[]);b||(b={});this.each(this._removeReference);this._reset();this.add(a,{silent:!0});b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,f,e){b[a.add?"add":"reset"](b.parse(d,e),a);c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"read",this,a)},create:function(a,b){var c=this;b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var d=b.success;b.success=function(a,e,f){c.add(a,b);
d&&d(a,e,f)};a.save(null,b);return a},parse:function(a){return a},chain:function(){return f(this.models).chain()},_reset:function(){this.length=0;this.models=[];this._byId={};this._byCid={}},_prepareModel:function(a,b){if(a instanceof e.Model){if(!a.collection)a.collection=this}else{var c=a;a=new this.model(c,{collection:this});a.validate&&!a._performValidation(c,b)&&(a=!1)}return a},_add:function(a,b){b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var c=this.getByCid(a);if(c)throw Error(["Can't add the same model to a set twice",
c.id]);this._byId[a.id]=a;this._byCid[a.cid]=a;this.models.splice(b.at!=null?b.at:this.comparator?this.sortedIndex(a,this.comparator):this.length,0,a);a.bind("all",this._onModelEvent);this.length++;b.silent||a.trigger("add",a,this,b);return a},_remove:function(a,b){b||(b={});a=this.getByCid(a)||this.get(a);if(!a)return null;delete this._byId[a.id];delete this._byCid[a.cid];this.models.splice(this.indexOf(a),1);this.length--;b.silent||a.trigger("remove",a,this,b);this._removeReference(a);return a},
_removeReference:function(a){this==a.collection&&delete a.collection;a.unbind("all",this._onModelEvent)},_onModelEvent:function(a,b,c,d){(a=="add"||a=="remove")&&c!=this||(a=="destroy"&&this._remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],this._byId[b.id]=b),this.trigger.apply(this,arguments))}});f.each(["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max",
"min","sortBy","sortedIndex","toArray","size","first","rest","last","without","indexOf","lastIndexOf","isEmpty","groupBy"],function(a){e.Collection.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)))}});e.Router=function(a){a||(a={});if(a.routes)this.routes=a.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var q=/:([\w\d]+)/g,r=/\*([\w\d]+)/g,s=/[-[\]{}()+?.,\\^$|#\s]/g;f.extend(e.Router.prototype,e.Events,{initialize:function(){},route:function(a,
b,c){e.history||(e.history=new e.History);f.isRegExp(a)||(a=this._routeToRegExp(a));e.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d))},this))},navigate:function(a,b){e.history.navigate(a,b)},_bindRoutes:function(){if(this.routes){var a=[],b;for(b in this.routes)a.unshift([b,this.routes[b]]);b=0;for(var c=a.length;b<c;b++)this.route(a[b][0],a[b][1],this[a[b][1]])}},_routeToRegExp:function(a){a=a.replace(s,"\\$&").replace(q,
"([^/]*)").replace(r,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});e.History=function(){this.handlers=[];f.bindAll(this,"checkUrl")};var j=/^#*/,t=/msie [\w.]+/,m=!1;f.extend(e.History.prototype,{interval:50,getFragment:function(a,b){if(a==null)if(this._hasPushState||b){a=window.location.pathname;var c=window.location.search;c&&(a+=c);a.indexOf(this.options.root)==0&&(a=a.substr(this.options.root.length))}else a=window.location.hash;return decodeURIComponent(a.replace(j,
""))},start:function(a){if(m)throw Error("Backbone.history has already been started");this.options=f.extend({},{root:"/"},this.options,a);this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);a=this.getFragment();var b=document.documentMode;if(b=t.exec(navigator.userAgent.toLowerCase())&&(!b||b<=7))this.iframe=g('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a);
this._hasPushState?g(window).bind("popstate",this.checkUrl):"onhashchange"in window&&!b?g(window).bind("hashchange",this.checkUrl):setInterval(this.checkUrl,this.interval);this.fragment=a;m=!0;a=window.location;b=a.pathname==this.options.root;if(this._wantsPushState&&!this._hasPushState&&!b)return this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0;else if(this._wantsPushState&&this._hasPushState&&b&&a.hash)this.fragment=a.hash.replace(j,""),window.history.replaceState({},
document.title,a.protocol+"//"+a.host+this.options.root+this.fragment);if(!this.options.silent)return this.loadUrl()},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a==this.fragment&&this.iframe&&(a=this.getFragment(this.iframe.location.hash));if(a==this.fragment||a==decodeURIComponent(this.fragment))return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(window.location.hash)},loadUrl:function(a){var b=this.fragment=this.getFragment(a);
return f.any(this.handlers,function(a){if(a.route.test(b))return a.callback(b),!0})},navigate:function(a,b){var c=(a||"").replace(j,"");if(!(this.fragment==c||this.fragment==decodeURIComponent(c))){if(this._hasPushState){var d=window.location;c.indexOf(this.options.root)!=0&&(c=this.options.root+c);this.fragment=c;window.history.pushState({},document.title,d.protocol+"//"+d.host+c)}else if(window.location.hash=this.fragment=c,this.iframe&&c!=this.getFragment(this.iframe.location.hash))this.iframe.document.open().close(),
this.iframe.location.hash=c;b&&this.loadUrl(a)}}});e.View=function(a){this.cid=f.uniqueId("view");this._configure(a||{});this._ensureElement();this.delegateEvents();this.initialize.apply(this,arguments)};var u=/^(\S+)\s*(.*)$/,n=["model","collection","el","id","attributes","className","tagName"];f.extend(e.View.prototype,e.Events,{tagName:"div",$:function(a){return g(a,this.el)},initialize:function(){},render:function(){return this},remove:function(){g(this.el).remove();return this},make:function(a,
b,c){a=document.createElement(a);b&&g(a).attr(b);c&&g(a).html(c);return a},delegateEvents:function(a){if(a||(a=this.events))for(var b in f.isFunction(a)&&(a=a.call(this)),g(this.el).unbind(".delegateEvents"+this.cid),a){var c=this[a[b]];if(!c)throw Error('Event "'+a[b]+'" does not exist');var d=b.match(u),e=d[1];d=d[2];c=f.bind(c,this);e+=".delegateEvents"+this.cid;d===""?g(this.el).bind(e,c):g(this.el).delegate(d,e,c)}},_configure:function(a){this.options&&(a=f.extend({},this.options,a));for(var b=
0,c=n.length;b<c;b++){var d=n[b];a[d]&&(this[d]=a[d])}this.options=a},_ensureElement:function(){if(this.el){if(f.isString(this.el))this.el=g(this.el).get(0)}else{var a=this.attributes||{};if(this.id)a.id=this.id;if(this.className)a["class"]=this.className;this.el=this.make(this.tagName,a)}}});e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=function(a,b){var c=v(this,a,b);c.extend=this.extend;return c};var w={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};e.sync=function(a,
b,c){var d=w[a];c=f.extend({type:d,dataType:"json"},c);if(!c.url)c.url=k(b)||l();if(!c.data&&b&&(a=="create"||a=="update"))c.contentType="application/json",c.data=JSON.stringify(b.toJSON());if(e.emulateJSON)c.contentType="application/x-www-form-urlencoded",c.data=c.data?{model:c.data}:{};if(e.emulateHTTP&&(d==="PUT"||d==="DELETE")){if(e.emulateJSON)c.data._method=d;c.type="POST";c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d)}}if(c.type!=="GET"&&!e.emulateJSON)c.processData=
!1;return g.ajax(c)};var o=function(){},v=function(a,b,c){var d;d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){return a.apply(this,arguments)};f.extend(d,a);o.prototype=a.prototype;d.prototype=new o;b&&f.extend(d.prototype,b);c&&f.extend(d,c);d.prototype.constructor=d;d.__super__=a.prototype;return d},k=function(a){if(!a||!a.url)return null;return f.isFunction(a.url)?a.url():a.url},l=function(){throw Error('A "url" property or function must be specified');},i=function(a,b,c){return function(d){a?
a(b,d,c):b.trigger("error",b,d,c)}}}).call(this);

/**
 * @preserve
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function( jQuery, undefined ){
  var oldManip = jQuery.fn.domManip, tmplItmAtt = "_tmplitem", htmlExpr = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
    newTmplItems = {}, wrappedItems = {}, appendToTmplItems, topTmplItem = { key: 0, data: {} }, itemKey = 0, cloneIndex = 0, stack = [];

  function newTmplItem( options, parentItem, fn, data ) {
    // Returns a template item data structure for a new rendered instance of a template (a 'template item').
    // The content field is a hierarchical array of strings and nested items (to be
    // removed and replaced by nodes field of dom elements, once inserted in DOM).
    var newItem = {
      data: data || (data === 0 || data === false) ? data : (parentItem ? parentItem.data : {}),
      _wrap: parentItem ? parentItem._wrap : null,
      tmpl: null,
      parent: parentItem || null,
      nodes: [],
      calls: tiCalls,
      nest: tiNest,
      wrap: tiWrap,
      html: tiHtml,
      update: tiUpdate
    };
    if ( options ) {
      jQuery.extend( newItem, options, { nodes: [], parent: parentItem });
    }
    if ( fn ) {
      // Build the hierarchical content to be used during insertion into DOM
      newItem.tmpl = fn;
      newItem._ctnt = newItem._ctnt || newItem.tmpl( jQuery, newItem );
      newItem.key = ++itemKey;
      // Keep track of new template item, until it is stored as jQuery Data on DOM element
      (stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
    }
    return newItem;
  }

  // Override appendTo etc., in order to provide support for targeting multiple elements. (This code would disappear if integrated in jquery core).
  jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function( name, original ) {
    jQuery.fn[ name ] = function( selector ) {
      var ret = [], insert = jQuery( selector ), elems, i, l, tmplItems,
        parent = this.length === 1 && this[0].parentNode;

      appendToTmplItems = newTmplItems || {};
      if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
        insert[ original ]( this[0] );
        ret = this;
      } else {
        for ( i = 0, l = insert.length; i < l; i++ ) {
          cloneIndex = i;
          elems = (i > 0 ? this.clone(true) : this).get();
          jQuery( insert[i] )[ original ]( elems );
          ret = ret.concat( elems );
        }
        cloneIndex = 0;
        ret = this.pushStack( ret, name, insert.selector );
      }
      tmplItems = appendToTmplItems;
      appendToTmplItems = null;
      jQuery.tmpl.complete( tmplItems );
      return ret;
    };
  });

  jQuery.fn.extend({
    // Use first wrapped element as template markup.
    // Return wrapped set of template items, obtained by rendering template against data.
    tmpl: function( data, options, parentItem ) {
      return jQuery.tmpl( this[0], data, options, parentItem );
    },

    // Find which rendered template item the first wrapped DOM element belongs to
    tmplItem: function() {
      return jQuery.tmplItem( this[0] );
    },

    // Consider the first wrapped element as a template declaration, and get the compiled template or store it as a named template.
    template: function( name ) {
      return jQuery.template( name, this[0] );
    },

    domManip: function( args, table, callback, options ) {
      if ( args[0] && jQuery.isArray( args[0] )) {
        var dmArgs = jQuery.makeArray( arguments ), elems = args[0], elemsLength = elems.length, i = 0, tmplItem;
        while ( i < elemsLength && !(tmplItem = jQuery.data( elems[i++], "tmplItem" ))) {}
        if ( tmplItem && cloneIndex ) {
          dmArgs[2] = function( fragClone ) {
            // Handler called by oldManip when rendered template has been inserted into DOM.
            jQuery.tmpl.afterManip( this, fragClone, callback );
          };
        }
        oldManip.apply( this, dmArgs );
      } else {
        oldManip.apply( this, arguments );
      }
      cloneIndex = 0;
      if ( !appendToTmplItems ) {
        jQuery.tmpl.complete( newTmplItems );
      }
      return this;
    }
  });

  jQuery.extend({
    // Return wrapped set of template items, obtained by rendering template against data.
    tmpl: function( tmpl, data, options, parentItem ) {
      var ret, topLevel = !parentItem;
      if ( topLevel ) {
        // This is a top-level tmpl call (not from a nested template using {{tmpl}})
        parentItem = topTmplItem;
        tmpl = jQuery.template[tmpl] || jQuery.template( null, tmpl );
        wrappedItems = {}; // Any wrapped items will be rebuilt, since this is top level
      } else if ( !tmpl ) {
        // The template item is already associated with DOM - this is a refresh.
        // Re-evaluate rendered template for the parentItem
        tmpl = parentItem.tmpl;
        newTmplItems[parentItem.key] = parentItem;
        parentItem.nodes = [];
        if ( parentItem.wrapped ) {
          updateWrapped( parentItem, parentItem.wrapped );
        }
        // Rebuild, without creating a new template item
        return jQuery( build( parentItem, null, parentItem.tmpl( jQuery, parentItem ) ));
      }
      if ( !tmpl ) {
        return []; // Could throw...
      }
      if ( typeof data === "function" ) {
        data = data.call( parentItem || {} );
      }
      if ( options && options.wrapped ) {
        updateWrapped( options, options.wrapped );
      }
      ret = jQuery.isArray( data ) ? 
        jQuery.map( data, function( dataItem ) {
          return dataItem ? newTmplItem( options, parentItem, tmpl, dataItem ) : null;
        }) :
        [ newTmplItem( options, parentItem, tmpl, data ) ];
      return topLevel ? jQuery( build( parentItem, null, ret ) ) : ret;
    },

    // Return rendered template item for an element.
    tmplItem: function( elem ) {
      var tmplItem;
      if ( elem instanceof jQuery ) {
        elem = elem[0];
      }
      while ( elem && elem.nodeType === 1 && !(tmplItem = jQuery.data( elem, "tmplItem" )) && (elem = elem.parentNode) ) {}
      return tmplItem || topTmplItem;
    },

    // Set:
    // Use $.template( name, tmpl ) to cache a named template,
    // where tmpl is a template string, a script element or a jQuery instance wrapping a script element, etc.
    // Use $( "selector" ).template( name ) to provide access by name to a script block template declaration.

    // Get:
    // Use $.template( name ) to access a cached template.
    // Also $( selectorToScriptBlock ).template(), or $.template( null, templateString )
    // will return the compiled template, without adding a name reference.
    // If templateString includes at least one HTML tag, $.template( templateString ) is equivalent
    // to $.template( null, templateString )
    template: function( name, tmpl ) {
      if (tmpl) {
        // Compile template and associate with name
        if ( typeof tmpl === "string" ) {
          // This is an HTML string being passed directly in.
          tmpl = buildTmplFn( tmpl )
        } else if ( tmpl instanceof jQuery ) {
          tmpl = tmpl[0] || {};
        }
        if ( tmpl.nodeType ) {
          // If this is a template block, use cached copy, or generate tmpl function and cache.
          tmpl = jQuery.data( tmpl, "tmpl" ) || jQuery.data( tmpl, "tmpl", buildTmplFn( tmpl.innerHTML )); 
          // Issue: In IE, if the container element is not a script block, the innerHTML will remove quotes from attribute values whenever the value does not include white space. 
          // This means that foo="${x}" will not work if the value of x includes white space: foo="${x}" -> foo=value of x. 
          // To correct this, include space in tag: foo="${ x }" -> foo="value of x"
        }
        return typeof name === "string" ? (jQuery.template[name] = tmpl) : tmpl;
      }
      // Return named compiled template
      return name ? (typeof name !== "string" ? jQuery.template( null, name ): 
        (jQuery.template[name] || 
          // If not in map, treat as a selector. (If integrated with core, use quickExpr.exec) 
          jQuery.template( null, htmlExpr.test( name ) ? name : jQuery( name )))) : null; 
    },

    encode: function( text ) {
      // Do HTML encoding replacing < > & and ' and " by corresponding entities.
      return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
    }
  });

  jQuery.extend( jQuery.tmpl, {
    tag: {
      "tmpl": {
        _default: { $2: "null" },
        open: "if($notnull_1){__=__.concat($item.nest($1,$2));}"
        // tmpl target parameter can be of type function, so use $1, not $1a (so not auto detection of functions)
        // This means that {{tmpl foo}} treats foo as a template (which IS a function). 
        // Explicit parens can be used if foo is a function that returns a template: {{tmpl foo()}}.
      },
      "wrap": {
        _default: { $2: "null" },
        open: "$item.calls(__,$1,$2);__=[];",
        close: "call=$item.calls();__=call._.concat($item.wrap(call,__));"
      },
      "each": {
        _default: { $2: "$index, $value" },
        open: "if($notnull_1){$.each($1a,function($2){with(this){",
        close: "}});}"
      },
      "if": {
        open: "if(($notnull_1) && $1a){",
        close: "}"
      },
      "else": {
        _default: { $1: "true" },
        open: "}else if(($notnull_1) && $1a){"
      },
      "html": {
        // Unecoded expression evaluation. 
        open: "if($notnull_1){__.push($1a);}"
      },
      "=": {
        // Encoded expression evaluation. Abbreviated form is ${}.
        _default: { $1: "$data" },
        open: "if($notnull_1){__.push($.encode($1a));}"
      },
      "!": {
        // Comment tag. Skipped by parser
        open: ""
      }
    },

    // This stub can be overridden, e.g. in jquery.tmplPlus for providing rendered events
    complete: function( items ) {
      newTmplItems = {};
    },

    // Call this from code which overrides domManip, or equivalent
    // Manage cloning/storing template items etc.
    afterManip: function afterManip( elem, fragClone, callback ) {
      // Provides cloned fragment ready for fixup prior to and after insertion into DOM
      var content = fragClone.nodeType === 11 ?
        jQuery.makeArray(fragClone.childNodes) :
        fragClone.nodeType === 1 ? [fragClone] : [];

      // Return fragment to original caller (e.g. append) for DOM insertion
      callback.call( elem, fragClone );

      // Fragment has been inserted:- Add inserted nodes to tmplItem data structure. Replace inserted element annotations by jQuery.data.
      storeTmplItems( content );
      cloneIndex++;
    }
  });

  //========================== Private helper functions, used by code above ==========================

  function build( tmplItem, nested, content ) {
    // Convert hierarchical content into flat string array 
    // and finally return array of fragments ready for DOM insertion
    var frag, ret = content ? jQuery.map( content, function( item ) {
      return (typeof item === "string") ? 
        // Insert template item annotations, to be converted to jQuery.data( "tmplItem" ) when elems are inserted into DOM.
        (tmplItem.key ? item.replace( /(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + tmplItmAtt + "=\"" + tmplItem.key + "\" $2" ) : item) :
        // This is a child template item. Build nested template.
        build( item, tmplItem, item._ctnt );
    }) : 
    // If content is not defined, insert tmplItem directly. Not a template item. May be a string, or a string array, e.g. from {{html $item.html()}}. 
    tmplItem;
    if ( nested ) {
      return ret;
    }

    // top-level template
    ret = ret.join("");

    // Support templates which have initial or final text nodes, or consist only of text
    // Also support HTML entities within the HTML markup.
    ret.replace( /^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function( all, before, middle, after) {
      frag = jQuery( middle ).get();

      storeTmplItems( frag );
      if ( before ) {
        frag = unencode( before ).concat(frag);
      }
      if ( after ) {
        frag = frag.concat(unencode( after ));
      }
    });
    return frag ? frag : unencode( ret );
  }

  function unencode( text ) {
    // Use createElement, since createTextNode will not render HTML entities correctly
    var el = document.createElement( "div" );
    el.innerHTML = text;
    return jQuery.makeArray(el.childNodes);
  }

  // Generate a reusable function that will serve to render a template against data
  function buildTmplFn( markup ) {
    return new Function("jQuery","$item",
      // Use the variable __ to hold a string array while building the compiled template. (See https://github.com/jquery/jquery-tmpl/issues#issue/10).
      "var $=jQuery,call,__=[],$data=$item.data;" +

      // Introduce the data as local variables using with(){}
      "with($data){__.push('" +

      // Convert the template into pure JavaScript
      jQuery.trim(markup)
        .replace( /([\\'])/g, "\\$1" )
        .replace( /[\r\t\n]/g, " " )
        .replace( /\$\{([^\}]*)\}/g, "{{= $1}}" )
        .replace( /\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,
        function( all, slash, type, fnargs, target, parens, args ) {
          var tag = jQuery.tmpl.tag[ type ], def, expr, exprAutoFnDetect;
          if ( !tag ) {
            throw "Unknown template tag: " + type;
          }
          def = tag._default || [];
          if ( parens && !/\w$/.test(target)) {
            target += parens;
            parens = "";
          }
          if ( target ) {
            target = unescape( target ); 
            args = args ? ("," + unescape( args ) + ")") : (parens ? ")" : "");
            // Support for target being things like a.toLowerCase();
            // In that case don't call with template item as 'this' pointer. Just evaluate...
            expr = parens ? (target.indexOf(".") > -1 ? target + unescape( parens ) : ("(" + target + ").call($item" + args)) : target;
            exprAutoFnDetect = parens ? expr : "(typeof(" + target + ")==='function'?(" + target + ").call($item):(" + target + "))";
          } else {
            exprAutoFnDetect = expr = def.$1 || "null";
          }
          fnargs = unescape( fnargs );
          return "');" + 
            tag[ slash ? "close" : "open" ]
              .split( "$notnull_1" ).join( target ? "typeof(" + target + ")!=='undefined' && (" + target + ")!=null" : "true" )
              .split( "$1a" ).join( exprAutoFnDetect )
              .split( "$1" ).join( expr )
              .split( "$2" ).join( fnargs || def.$2 || "" ) +
            "__.push('";
        }) +
      "');}return __;"
    );
  }
  function updateWrapped( options, wrapped ) {
    // Build the wrapped content. 
    options._wrap = build( options, true, 
      // Suport imperative scenario in which options.wrapped can be set to a selector or an HTML string.
      jQuery.isArray( wrapped ) ? wrapped : [htmlExpr.test( wrapped ) ? wrapped : jQuery( wrapped ).html()]
    ).join("");
  }

  function unescape( args ) {
    return args ? args.replace( /\\'/g, "'").replace(/\\\\/g, "\\" ) : null;
  }
  function outerHtml( elem ) {
    var div = document.createElement("div");
    div.appendChild( elem.cloneNode(true) );
    return div.innerHTML;
  }

  // Store template items in jQuery.data(), ensuring a unique tmplItem data data structure for each rendered template instance.
  function storeTmplItems( content ) {
    var keySuffix = "_" + cloneIndex, elem, elems, newClonedItems = {}, i, l, m;
    for ( i = 0, l = content.length; i < l; i++ ) {
      if ( (elem = content[i]).nodeType !== 1 ) {
        continue;
      }
      elems = elem.getElementsByTagName("*");
      for ( m = elems.length - 1; m >= 0; m-- ) {
        processItemKey( elems[m] );
      }
      processItemKey( elem );
    }
    function processItemKey( el ) {
      var pntKey, pntNode = el, pntItem, tmplItem, key;
      // Ensure that each rendered template inserted into the DOM has its own template item,
      if ( (key = el.getAttribute( tmplItmAtt ))) {
        while ( pntNode.parentNode && (pntNode = pntNode.parentNode).nodeType === 1 && !(pntKey = pntNode.getAttribute( tmplItmAtt ))) { }
        if ( pntKey !== key ) {
          // The next ancestor with a _tmplitem expando is on a different key than this one.
          // So this is a top-level element within this template item
          // Set pntNode to the key of the parentNode, or to 0 if pntNode.parentNode is null, or pntNode is a fragment.
          pntNode = pntNode.parentNode ? (pntNode.nodeType === 11 ? 0 : (pntNode.getAttribute( tmplItmAtt ) || 0)) : 0;
          if ( !(tmplItem = newTmplItems[key]) ) {
            // The item is for wrapped content, and was copied from the temporary parent wrappedItem.
            tmplItem = wrappedItems[key];
            tmplItem = newTmplItem( tmplItem, newTmplItems[pntNode]||wrappedItems[pntNode] );
            tmplItem.key = ++itemKey;
            newTmplItems[itemKey] = tmplItem;
          }
          if ( cloneIndex ) {
            cloneTmplItem( key );
          }
        }
        el.removeAttribute( tmplItmAtt );
      } else if ( cloneIndex && (tmplItem = jQuery.data( el, "tmplItem" )) ) {
        // This was a rendered element, cloned during append or appendTo etc.
        // TmplItem stored in jQuery data has already been cloned in cloneCopyEvent. We must replace it with a fresh cloned tmplItem.
        cloneTmplItem( tmplItem.key );
        newTmplItems[tmplItem.key] = tmplItem;
        pntNode = jQuery.data( el.parentNode, "tmplItem" );
        pntNode = pntNode ? pntNode.key : 0;
      }
      if ( tmplItem ) {
        pntItem = tmplItem;
        // Find the template item of the parent element. 
        // (Using !=, not !==, since pntItem.key is number, and pntNode may be a string)
        while ( pntItem && pntItem.key != pntNode ) { 
          // Add this element as a top-level node for this rendered template item, as well as for any
          // ancestor items between this item and the item of its parent element
          pntItem.nodes.push( el );
          pntItem = pntItem.parent;
        }
        // Delete content built during rendering - reduce API surface area and memory use, and avoid exposing of stale data after rendering...
        delete tmplItem._ctnt;
        delete tmplItem._wrap;
        // Store template item as jQuery data on the element
        jQuery.data( el, "tmplItem", tmplItem );
      }
      function cloneTmplItem( key ) {
        key = key + keySuffix;
        tmplItem = newClonedItems[key] = 
          (newClonedItems[key] || newTmplItem( tmplItem, newTmplItems[tmplItem.parent.key + keySuffix] || tmplItem.parent ));
      }
    }
  }

  //---- Helper functions for template item ----

  function tiCalls( content, tmpl, data, options ) {
    if ( !content ) {
      return stack.pop();
    }
    stack.push({ _: content, tmpl: tmpl, item:this, data: data, options: options });
  }

  function tiNest( tmpl, data, options ) {
    // nested template, using {{tmpl}} tag
    return jQuery.tmpl( jQuery.template( tmpl ), data, options, this );
  }

  function tiWrap( call, wrapped ) {
    // nested template, using {{wrap}} tag
    var options = call.options || {};
    options.wrapped = wrapped;
    // Apply the template, which may incorporate wrapped content, 
    return jQuery.tmpl( jQuery.template( call.tmpl ), call.data, options, call.item );
  }

  function tiHtml( filter, textOnly ) {
    var wrapped = this._wrap;
    return jQuery.map(
      jQuery( jQuery.isArray( wrapped ) ? wrapped.join("") : wrapped ).filter( filter || "*" ),
      function(e) {
        return textOnly ?
          e.innerText || e.textContent :
          e.outerHTML || outerHtml(e);
      });
  }

  function tiUpdate() {
    var coll = this.nodes;
    jQuery.tmpl( null, null, null, this).insertBefore( coll[0] );
    jQuery( coll ).remove();
  }
})( jQuery );

/**
 * @license 
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 * 
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */
window.debug=(
  function(){
    var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,
    c=["error","warn","info","debug","log"],
    l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),
    j=l.length,a=[];
    
    while(--j>=0){
      (function(n){
        h[n]=function(){
          m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;
          while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);
            a.push(p);e(p);
            if(!d||!k(n)){return}
            d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}
            function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}
            h.setLevel=function(n){m=typeof n==="number"?n:9};
            function k(n){return m>0?m>n:c.length+m<=n}
            h.setCallback=function(){
              var o=b.call(arguments),n=a.length,p=n;
              f=o.shift()||null;
              g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;
              while(p<n){e(a[p++])}};
              return h})();

/*!
 * jQuery Tiny Pub/Sub - v0.6 - 1/10/2011
 * http://benalman.com/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function($){

  // Create a "dummy" jQuery object on which to bind, unbind and trigger event
  // handlers. Note that $({}) works in jQuery 1.4.3+, but because .unbind on
  // a "plain object" throws errors in older versions of jQuery, an element is
  // used here.
  var o = $('<b/>');

  // Subscribe to a topic. Works just like bind, except the passed handler
  // is wrapped in a function so that the event object can be stripped out.
  // Even though the event object might be useful, it is unnecessary and
  // will only complicate things in the future should the user decide to move
  // to a non-$.event-based pub/sub implementation.
  $.subscribe = function( topic, fn ) {

    // Call fn, stripping out the 1st argument (the event object).
    function wrapper() {
      return fn.apply( this, Array.prototype.slice.call( arguments, 1 ) );
    }

    // Add .guid property to function to allow it to be easily unbound. Note
    // that $.guid is new in jQuery 1.4+, and $.event.guid was used before.
    wrapper.guid = fn.guid = fn.guid || ( $.guid ? $.guid++ : $.event.guid++ );

    // Bind the handler.
    o.bind( topic, wrapper );
  };

  // Unsubscribe from a topic. Works exactly like unbind.
  $.unsubscribe = function() {
    o.unbind.apply( o, arguments );
  };

  // Publish a topic. Works exactly like trigger.
  $.publish = function() {
    o.trigger.apply( o, arguments );
  };

})(jQuery);

/**
 * @preserve
 * Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery)

/**
* @preserve
* jQuery.UI.iPad plugin
* Copyright (c) 2010 Stephen von Takach
* licensed under MIT.
* Date: 27/8/2010
*
* Project Home: 
* http://code.google.com/p/jquery-ui-for-ipad-and-iphone/
*/


$(function() {
  //
  // Extend jQuery feature detection
  //
  $.extend($.support, {
    touch: "ontouchend" in document
  });
  
  //
  // Hook up touch events
  //
  $.fn.addTouch = function() {
        if ($.support.touch) {
                this.each(function(i,el){
                        el.addEventListener("touchstart", iPadTouchHandler, false);
                        el.addEventListener("touchmove", iPadTouchHandler, false);
                        el.addEventListener("touchend", iPadTouchHandler, false);
                        el.addEventListener("touchcancel", iPadTouchHandler, false);
                });
        }
  };

});


var lastTap = null;     // Holds last tapped element (so we can compare for double tap)
var tapValid = false;     // Are we still in the .6 second window where a double tap can occur
var tapTimeout = null;      // The timeout reference

function cancelTap() {
  tapValid = false;
}


var rightClickPending = false;  // Is a right click still feasible
var rightClickEvent = null;   // the original event
var holdTimeout = null;     // timeout reference
var cancelMouseUp = false;    // prevents a click from occuring as we want the context menu


function cancelHold() {
  if (rightClickPending) {
    window.clearTimeout(holdTimeout);
    rightClickPending = false;
    rightClickEvent = null;
  }
}

function startHold(event) {
  if (rightClickPending)
    return;

  rightClickPending = true; // We could be performing a right click
  rightClickEvent = (event.changedTouches)[0];
  holdTimeout = window.setTimeout("doRightClick();", 800);
}


function doRightClick() {
  rightClickPending = false;

  //
  // We need to mouse up (as we were down)
  //
  var first = rightClickEvent,
    simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent("mouseup", true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
      false, false, false, false, 0, null);
  first.target.dispatchEvent(simulatedEvent);

  //
  // emulate a right click
  //
  simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent("mousedown", true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
      false, false, false, false, 2, null);
  first.target.dispatchEvent(simulatedEvent);

  //
  // Show a context menu
  //
  simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent("contextmenu", true, true, window, 1, first.screenX + 50, first.screenY + 5, first.clientX + 50, first.clientY + 5,
                                  false, false, false, false, 2, null);
  first.target.dispatchEvent(simulatedEvent);


  //
  // Note:: I don't mouse up the right click here however feel free to add if required
  //


  cancelMouseUp = true;
  rightClickEvent = null; // Release memory
}


//
// mouse over event then mouse down
//
function iPadTouchStart(event) {
  var touches = event.changedTouches,
    first = touches[0],
    type = "mouseover",
    simulatedEvent = document.createEvent("MouseEvent");
  //
  // Mouse over first - I have live events attached on mouse over
  //
  simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
                            false, false, false, false, 0, null);
  first.target.dispatchEvent(simulatedEvent);

  type = "mousedown";
  simulatedEvent = document.createEvent("MouseEvent");

  simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
                            false, false, false, false, 0, null);
  first.target.dispatchEvent(simulatedEvent);


  if (!tapValid) {
    lastTap = first.target;
    tapValid = true;
    tapTimeout = window.setTimeout("cancelTap();", 600);
    startHold(event);
  }
  else {
    window.clearTimeout(tapTimeout);

    //
    // If a double tap is still a possibility and the elements are the same
    //  Then perform a double click
    //
    if (first.target == lastTap) {
      lastTap = null;
      tapValid = false;

      type = "click";
      simulatedEvent = document.createEvent("MouseEvent");

      simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
                          false, false, false, false, 0/*left*/, null);
      first.target.dispatchEvent(simulatedEvent);

      type = "dblclick";
      simulatedEvent = document.createEvent("MouseEvent");

      simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
                          false, false, false, false, 0/*left*/, null);
      first.target.dispatchEvent(simulatedEvent);
    }
    else {
      lastTap = first.target;
      tapValid = true;
      tapTimeout = window.setTimeout("cancelTap();", 600);
      startHold(event);
    }
  }
}

function iPadTouchHandler(event) {
  var type = "",
    button = 0; /*left*/

  if (event.touches.length > 1)
    return;

  switch (event.type) {
    case "touchstart":
      if ($(event.changedTouches[0].target).is("select")) {
        return;
      }
      iPadTouchStart(event); /*We need to trigger two events here to support one touch drag and drop*/
      event.preventDefault();
      return false;
      break;

    case "touchmove":
      cancelHold();
      type = "mousemove";
      event.preventDefault();
      break;

    case "touchend":
      if (cancelMouseUp) {
        cancelMouseUp = false;
        event.preventDefault();
        return false;
      }
      cancelHold();
      type = "mouseup";
      break;

    default:
      return;
  }

  var touches = event.changedTouches,
    first = touches[0],
    simulatedEvent = document.createEvent("MouseEvent");

  simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
                            false, false, false, false, button, null);

  first.target.dispatchEvent(simulatedEvent);

  if (type == "mouseup" && tapValid && first.target == lastTap) { // This actually emulates the ipads default behaviour (which we prevented)
    simulatedEvent = document.createEvent("MouseEvent");    // This check avoids click being emulated on a double tap

    simulatedEvent.initMouseEvent("click", true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY,
                            false, false, false, false, button, null);

    first.target.dispatchEvent(simulatedEvent);
  }
}


/*@
 * @license
 * jQuery Globalization Plugin v1.0.0pre

 * http://github.com/jquery/jquery-global
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function() {

var Globalization = {}, localized = { en: {} };
localized["default"] = localized.en;

Globalization.extend = function( deep ) {
    var target = arguments[ 1 ] || {};
    for ( var i = 2, l = arguments.length; i < l; i++ ) {
        var source = arguments[ i ];
        if ( source ) {
            for ( var field in source ) {
                var sourceVal = source[ field ];
                if ( typeof sourceVal !== "undefined" ) {
                    if ( deep && (isObject( sourceVal ) || isArray( sourceVal )) ) {
                        var targetVal = target[ field ];
                        // extend onto the existing value, or create a new one
                        targetVal = targetVal && (isObject( targetVal ) || isArray( targetVal ))
                            ? targetVal
                            : (isArray( sourceVal ) ? [] : {});
                        target[ field ] = this.extend( true, targetVal, sourceVal );
                    }
                    else {
                        target[ field ] = sourceVal;
                    }
                }
            }
        }
    }
    return target;
}

Globalization.findClosestCulture = function(name) {
    var match;
    if ( !name ) {
        return this.culture || this.cultures["default"];
    }
    if ( isString( name ) ) {
        name = name.split( ',' );
    }
    if ( isArray( name ) ) {
        var lang,
            cultures = this.cultures,
            list = name,
            i, l = list.length,
            prioritized = [];
        for ( i = 0; i < l; i++ ) {
            name = trim( list[ i ] );
            var pri, parts = name.split( ';' );
            lang = trim( parts[ 0 ] );
            if ( parts.length === 1 ) {
                pri = 1;
            }
            else {
                name = trim( parts[ 1 ] );
                if ( name.indexOf("q=") === 0 ) {
                    name = name.substr( 2 );
                    pri = parseFloat( name, 10 );
                    pri = isNaN( pri ) ? 0 : pri;
                }
                else {
                    pri = 1;
                }
            }
            prioritized.push( { lang: lang, pri: pri } );
        }
        prioritized.sort(function(a, b) {
            return a.pri < b.pri ? 1 : -1;
        });

        // exact match
        for ( i = 0; i < l; i++ ) {
            lang = prioritized[ i ].lang;
            match = cultures[ lang ];
            if ( match ) {
                return match;
            }
        }

        // neutral language match
        for ( i = 0; i < l; i++ ) {
            lang = prioritized[ i ].lang;
            do {
                var index = lang.lastIndexOf( "-" );
                if ( index === -1 ) {
                    break;
                }
                // strip off the last part. e.g. en-US => en
                lang = lang.substr( 0, index );
                match = cultures[ lang ];
                if ( match ) {
                    return match;
                }
            }
            while ( 1 );
        }

        // last resort: match first culture using that language
    for ( i = 0; i < l; i++ ) {
            lang = prioritized[ i ].lang;
      for ( var cultureKey in cultures ) {
        var culture = cultures[ cultureKey ];
                if ( culture.language == lang ) {
                    return culture;
                }
      }
        }
    }
    else if ( typeof name === 'object' ) {
        return name;
    }
    return match || null;
}
Globalization.preferCulture = function(name) {
    this.culture = this.findClosestCulture( name ) || this.cultures["default"];
}
Globalization.localize = function(key, culture, value) {
    // usign default culture in case culture is not provided
    if (typeof culture !== 'string') {
        culture = this.culture.name || this.culture || "default";
    }
    culture = this.cultures[ culture ] || { name: culture };

    var local = localized[ culture.name ];
    if ( arguments.length === 3 ) {
        if ( !local) {
            local = localized[ culture.name ] = {};
        }
        local[ key ] = value;
    }
    else {
        if ( local ) {
            value = local[ key ];
        }
        if ( typeof value === 'undefined' ) {
            var language = localized[ culture.language ];
            if ( language ) {
                value = language[ key ];
            }
            if ( typeof value === 'undefined' ) {
                value = localized["default"][ key ];
            }
        }
    }
    return typeof value === "undefined" ? null : value;
}
Globalization.format = function(value, format, culture) {
    culture = this.findClosestCulture( culture );
    if ( typeof value === "number" ) {
        value = formatNumber( value, format, culture );
    }
    else if ( value instanceof Date ) {
        value = formatDate( value, format, culture );
    }
    // Added by ndg 2013-01-29 to add era to end of dates
    if(typeof(culture.calendar.eras) != "undefined" && !isNaN(value)) {
      if(value > 0 || culture.calendar.eras.length == 1) {
        value += " " + culture.calendar.eras[0].name;
      } else { 
        value = Math.abs(value) + " " + culture.calendar.eras[1].name;
      }
    }
    return value;
}
Globalization.parseInt = function(value, radix, culture) {
    return Math.floor( this.parseFloat( value, radix, culture ) );
}
Globalization.parseFloat = function(value, radix, culture) {
  // make radix optional
  if (typeof radix === "string") {
    culture = radix;
    radix = 10;
  }

    culture = this.findClosestCulture( culture );
    var ret = NaN,
        nf = culture.numberFormat;

  if (value.indexOf(culture.numberFormat.currency.symbol) > -1) {
    // remove currency symbol
    value = value.replace(culture.numberFormat.currency.symbol, "");
    // replace decimal seperator
    value = value.replace(culture.numberFormat.currency["."], culture.numberFormat["."]);
  }

    // trim leading and trailing whitespace
    value = trim( value );

    // allow infinity or hexidecimal
    if (regexInfinity.test(value)) {
        ret = parseFloat(value, radix);
    }
    else if (!radix && regexHex.test(value)) {
        ret = parseInt(value, 16);
    }
    else {
        var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
            sign = signInfo[0],
            num = signInfo[1];
        // determine sign and number
        if ( sign === "" && nf.pattern[0] !== "-n" ) {
            signInfo = parseNegativePattern( value, nf, "-n" );
            sign = signInfo[0];
            num = signInfo[1];
        }
        sign = sign || "+";
        // determine exponent and number
        var exponent,
            intAndFraction,
            exponentPos = num.indexOf( 'e' );
        if ( exponentPos < 0 ) exponentPos = num.indexOf( 'E' );
        if ( exponentPos < 0 ) {
            intAndFraction = num;
            exponent = null;
        }
        else {
            intAndFraction = num.substr( 0, exponentPos );
            exponent = num.substr( exponentPos + 1 );
        }
        // determine decimal position
        var integer,
            fraction,
            decSep = nf['.'],
            decimalPos = intAndFraction.indexOf( decSep );
        if ( decimalPos < 0 ) {
            integer = intAndFraction;
            fraction = null;
        }
        else {
            integer = intAndFraction.substr( 0, decimalPos );
            fraction = intAndFraction.substr( decimalPos + decSep.length );
        }
        // handle groups (e.g. 1,000,000)
        var groupSep = nf[","];
        integer = integer.split(groupSep).join('');
        var altGroupSep = groupSep.replace(/\u00A0/g, " ");
        if ( groupSep !== altGroupSep ) {
            integer = integer.split(altGroupSep).join('');
        }
        // build a natively parsable number string
        var p = sign + integer;
        if ( fraction !== null ) {
            p += '.' + fraction;
        }
        if ( exponent !== null ) {
            // exponent itself may have a number patternd
            var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
            p += 'e' + (expSignInfo[0] || "+") + expSignInfo[1];
        }
        if ( regexParseFloat.test( p ) ) {
            ret = parseFloat( p );
        }
    }
    return ret;
}
Globalization.parseDate = function(value, formats, culture) {
    culture = this.findClosestCulture( culture );

    var date, prop, patterns;
    if ( formats ) {
        if ( typeof formats === "string" ) {
            formats = [ formats ];
        }
        if ( formats.length ) {
            for ( var i = 0, l = formats.length; i < l; i++ ) {
                var format = formats[ i ];
                if ( format ) {
                    date = parseExact( value, format, culture );
                    if ( date ) {
                        break;
                    }
                }
            }
        }
    }
    else {
        patterns = culture.calendar.patterns;
        for ( prop in patterns ) {
            date = parseExact( value, patterns[prop], culture );
            if ( date ) {
                break;
            }
        }
    }
    return date || null;
}

// 1.    When defining a culture, all fields are required except the ones stated as optional.
// 2.    You can use Globalization.extend to copy an existing culture and provide only the differing values,
//       a good practice since most cultures do not differ too much from the 'default' culture.
//       DO use the 'default' culture if you do this, as it is the only one that definitely
//       exists.
// 3.    Other plugins may add to the culture information provided by extending it. However,
//       that plugin may extend it prior to the culture being defined, or after. Therefore,
//       do not overwrite values that already exist when defining the baseline for a culture,
//       by extending your culture object with the existing one.
// 4.    Each culture should have a ".calendars" object with at least one calendar named "standard"
//       which serves as the default calendar in use by that culture.
// 5.    Each culture should have a ".calendar" object which is the current calendar being used,
//       it may be dynamically changed at any time to one of the calendars in ".calendars".

// To define a culture, use the following pattern, which handles defining the culture based
// on the 'default culture, extending it with the existing culture if it exists, and defining
// it if it does not exist.
// Globalization.cultures.foo = Globalization.extend(true, Globalization.extend(true, {}, Globalization.cultures['default'], fooCulture), Globalization.cultures.foo)

var cultures = Globalization.cultures = Globalization.cultures || {};
var en = cultures["default"] = cultures.en = Globalization.extend(true, {
    // A unique name for the culture in the form <language code>-<country/region code>
    name: "en",
    // the name of the culture in the english language
    englishName: "English",
    // the name of the culture in its own language
    nativeName: "English",
    // whether the culture uses right-to-left text
    isRTL: false,
    // 'language' is used for so-called "specific" cultures.
    // For example, the culture "es-CL" means "Spanish, in Chili".
    // It represents the Spanish-speaking culture as it is in Chili,
    // which might have different formatting rules or even translations
    // than Spanish in Spain. A "neutral" culture is one that is not
    // specific to a region. For example, the culture "es" is the generic
    // Spanish culture, which may be a more generalized version of the language
    // that may or may not be what a specific culture expects.
    // For a specific culture like "es-CL", the 'language' field refers to the
    // neutral, generic culture information for the language it is using.
    // This is not always a simple matter of the string before the dash.
    // For example, the "zh-Hans" culture is netural (Simplified Chinese).
    // And the 'zh-SG' culture is Simplified Chinese in Singapore, whose lanugage
    // field is "zh-CHS", not "zh".
    // This field should be used to navigate from a specific culture to it's
    // more general, neutral culture. If a culture is already as general as it
    // can get, the language may refer to itself.
    language: "en",
    // numberFormat defines general number formatting rules, like the digits in
    // each grouping, the group separator, and how negative numbers are displayed.
    numberFormat: {
        // [negativePattern]
        // Note, numberFormat.pattern has no 'positivePattern' unlike percent and currency,
        // but is still defined as an array for consistency with them.
        //  negativePattern: one of "(n)|-n|- n|n-|n -"
        pattern: ["-n"],
        // number of decimal places normally shown
        decimals: 2,
        // string that separates number groups, as in 1,000,000
        ',': ",",
        // string that separates a number from the fractional portion, as in 1.99
        '.': ".",
        // array of numbers indicating the size of each number group.
        // TODO: more detailed description and example
        groupSizes: [3],
        // symbol used for positive numbers
        '+': "+",
        // symbol used for negative numbers
        '-': "-",
        percent: {
            // [negativePattern, positivePattern]
            //     negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
            //     positivePattern: one of "n %|n%|%n|% n"
            pattern: ["-n %","n %"],
            // number of decimal places normally shown
            decimals: 2,
            // array of numbers indicating the size of each number group.
            // TODO: more detailed description and example
            groupSizes: [3],
            // string that separates number groups, as in 1,000,000
            ',': ",",
            // string that separates a number from the fractional portion, as in 1.99
            '.': ".",
            // symbol used to represent a percentage
            symbol: "%"
        },
        currency: {
            // [negativePattern, positivePattern]
            //     negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
            //     positivePattern: one of "$n|n$|$ n|n $"
            pattern: ["($n)","$n"],
            // number of decimal places normally shown
            decimals: 2,
            // array of numbers indicating the size of each number group.
            // TODO: more detailed description and example
            groupSizes: [3],
            // string that separates number groups, as in 1,000,000
            ',': ",",
            // string that separates a number from the fractional portion, as in 1.99
            '.': ".",
            // symbol used to represent currency
            symbol: "$"
        }
    },
    // calendars defines all the possible calendars used by this culture.
    // There should be at least one defined with name 'standard', and is the default
    // calendar used by the culture.
    // A calendar contains information about how dates are formatted, information about
    // the calendar's eras, a standard set of the date formats,
    // translations for day and month names, and if the calendar is not based on the Gregorian
    // calendar, conversion functions to and from the Gregorian calendar.
    calendars: {
        standard: {
            // name that identifies the type of calendar this is
            name: "Gregorian_USEnglish",
            // separator of parts of a date (e.g. '/' in 11/05/1955)
            '/': "/",
            // separator of parts of a time (e.g. ':' in 05:44 PM)
            ':': ":",
            // the first day of the week (0 = Sunday, 1 = Monday, etc)
            firstDay: 0,
            days: {
                // full day names
                names: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                // abbreviated day names
                namesAbbr: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                // shortest day names
                namesShort: ["Su","Mo","Tu","We","Th","Fr","Sa"]
            },
            months: {
                // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
                names: ["January","February","March","April","May","June","July","August","September","October","November","December",""],
                // abbreviated month names
                namesAbbr: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]
            },
            // AM and PM designators in one of these forms:
            // The usual view, and the upper and lower case versions
            //      [standard,lowercase,uppercase]
            // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
            //      null
            AM: ["AM", "am", "AM"],
            PM: ["PM", "pm", "PM"],
            eras: [
                // eras in reverse chronological order.
                // name: the name of the era in this culture (e.g. A.D., C.E.)
                // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                // offset: offset in years from gregorian calendar
                { "name": "CE", "start": null, "offset": 0 },
                { "name": "BCE", "start": null, "offset": 0 }
            ],
            // when a two digit year is given, it will never be parsed as a four digit
            // year greater than this year (in the appropriate era for the culture)
            // Set it as a full year (e.g. 2029) or use an offset format starting from
            // the current year: "+19" would correspond to 2029 if the current year 2010.
            twoDigitYearMax: 2029,
            // set of predefined date and time patterns used by the culture
            // these represent the format someone in this culture would expect
            // to see given the portions of the date that are shown.
            patterns: {
                // short date pattern
                d: "M/d/yyyy",
                // long date pattern
                D: "dddd, MMMM dd, yyyy",
                // short time pattern
                t: "h:mm tt",
                // long time pattern
                T: "h:mm:ss tt",
                // long date, short time pattern
                f: "dddd, MMMM dd, yyyy h:mm tt",
                // long date, long time pattern
                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                // month/day pattern
                M: "MMMM dd",
                // month/year pattern
                Y: "yyyy MMMM",
                // S is a sortable format that does not vary by culture
                S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
            }
            // optional fields for each calendar:
            /*
            monthsGenitive:
                Same as months but used when the day preceeds the month.
                Omit if the culture has no genitive distinction in month names.
                For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
            convert:
                Allows for the support of non-gregorian based calendars. This convert object is used to
                to convert a date to and from a gregorian calendar date to handle parsing and formatting.
                The two functions:
                    fromGregorian(date)
                        Given the date as a parameter, return an array with parts [year, month, day]
                        corresponding to the non-gregorian based year, month, and day for the calendar.
                    toGregorian(year, month, day)
                        Given the non-gregorian year, month, and day, return a new Date() object
                        set to the corresponding date in the gregorian calendar.
            */
        }
    }
}, cultures.en);
en.calendar = en.calendar || en.calendars.standard;

var regexTrim = /^\s+|\s+$/g,
    regexInfinity = /^[+-]?infinity$/i,
    regexHex = /^0x[a-f0-9]+$/i,
    regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/,
    toString = Object.prototype.toString;

function startsWith(value, pattern) {
    return value.indexOf( pattern ) === 0;
}

function endsWith(value, pattern) {
    return value.substr( value.length - pattern.length ) === pattern;
}

function trim(value) {
    return (value+"").replace( regexTrim, "" );
}

function zeroPad(str, count, left) {
    for (var l=str.length; l < count; l++) {
        str = (left ? ('0' + str) : (str + '0'));
    }
    return str;
}

function isArray(obj) {
    return toString.call(obj) === "[object Array]";
}

function isString(obj) {
    return toString.call(obj) === "[object String]";
}

function isObject(obj) {
    return toString.call(obj) === "[object Object]";
}

function arrayIndexOf( array, item ) {
    if ( array.indexOf ) {
        return array.indexOf( item );
    }
    for ( var i = 0, length = array.length; i < length; i++ ) {
        if ( array[ i ] === item ) {
            return i;
        }
    }
    return -1;
}

// *************************************** Numbers ***************************************

function expandNumber(number, precision, formatInfo) {
    var groupSizes = formatInfo.groupSizes,
        curSize = groupSizes[ 0 ],
        curGroupIndex = 1,
        factor = Math.pow( 10, precision ),
        rounded = Math.round( number * factor ) / factor;
    if ( !isFinite(rounded) ) {
        rounded = number;
    }
    number = rounded;

    var numberString = number+"",
        right = "",
        split = numberString.split(/e/i),
        exponent = split.length > 1 ? parseInt( split[ 1 ], 10 ) : 0;
    numberString = split[ 0 ];
    split = numberString.split( "." );
    numberString = split[ 0 ];
    right = split.length > 1 ? split[ 1 ] : "";

    var l;
    if ( exponent > 0 ) {
        right = zeroPad( right, exponent, false );
        numberString += right.slice( 0, exponent );
        right = right.substr( exponent );
    }
    else if ( exponent < 0 ) {
        exponent = -exponent;
        numberString = zeroPad( numberString, exponent + 1 );
        right = numberString.slice( -exponent, numberString.length ) + right;
        numberString = numberString.slice( 0, -exponent );
    }

    if ( precision > 0 ) {
        right = formatInfo['.'] +
            ((right.length > precision) ? right.slice( 0, precision ) : zeroPad( right, precision ));
    }
    else {
        right = "";
    }

    var stringIndex = numberString.length - 1,
        sep = formatInfo[","],
        ret = "";

    while ( stringIndex >= 0 ) {
        if ( curSize === 0 || curSize > stringIndex ) {
            return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? ( sep + ret + right ) : right );
        }
        ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? ( sep + ret ) : "" );

        stringIndex -= curSize;

        if ( curGroupIndex < groupSizes.length ) {
            curSize = groupSizes[ curGroupIndex ];
            curGroupIndex++;
        }
    }
    return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
}


function parseNegativePattern(value, nf, negativePattern) {
    var neg = nf["-"],
        pos = nf["+"],
        ret;
    switch (negativePattern) {
        case "n -":
            neg = ' ' + neg;
            pos = ' ' + pos;
            // fall through
        case "n-":
            if ( endsWith( value, neg ) ) {
                ret = [ '-', value.substr( 0, value.length - neg.length ) ];
            }
            else if ( endsWith( value, pos ) ) {
                ret = [ '+', value.substr( 0, value.length - pos.length ) ];
            }
            break;
        case "- n":
            neg += ' ';
            pos += ' ';
            // fall through
        case "-n":
            if ( startsWith( value, neg ) ) {
                ret = [ '-', value.substr( neg.length ) ];
            }
            else if ( startsWith(value, pos) ) {
                ret = [ '+', value.substr( pos.length ) ];
            }
            break;
        case "(n)":
            if ( startsWith( value, '(' ) && endsWith( value, ')' ) ) {
                ret = [ '-', value.substr( 1, value.length - 2 ) ];
            }
            break;
    }
    return ret || [ '', value ];
}

function formatNumber(value, format, culture) {
    if ( !format || format === 'i' ) {
        return culture.name.length ? value.toLocaleString() : value.toString();
    }
    format = format || "D";

    var nf = culture.numberFormat,
        number = Math.abs(value),
        precision = -1,
        pattern;
    if (format.length > 1) precision = parseInt( format.slice( 1 ), 10 );

    var current = format.charAt( 0 ).toUpperCase(),
        formatInfo;

    switch (current) {
        case "D":
            pattern = 'n';
            if (precision !== -1) {
                number = zeroPad( ""+number, precision, true );
            }
            if (value < 0) number = -number;
            break;
        case "N":
            formatInfo = nf;
            // fall through
        case "C":
            formatInfo = formatInfo || nf.currency;
            // fall through
        case "P":
            formatInfo = formatInfo || nf.percent;
            pattern = value < 0 ? formatInfo.pattern[0] : (formatInfo.pattern[1] || "n");
            if (precision === -1) precision = formatInfo.decimals;
            number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
            break;
        default:
            throw "Bad number format specifier: " + current;
    }

    var patternParts = /n|\$|-|%/g,
        ret = "";
    for (;;) {
        var index = patternParts.lastIndex,
            ar = patternParts.exec(pattern);

        ret += pattern.slice( index, ar ? ar.index : pattern.length );

        if (!ar) {
            break;
        }

        switch (ar[0]) {
            case "n":
                ret += number;
                break;
            case "$":
                ret += nf.currency.symbol;
                break;
            case "-":
                // don't make 0 negative
                if ( /[1-9]/.test( number ) ) {
                    ret += nf["-"];
                }
                break;
            case "%":
                ret += nf.percent.symbol;
                break;
        }
    }

    return ret;
}

// *************************************** Dates ***************************************

function outOfRange(value, low, high) {
    return value < low || value > high;
}

function expandYear(cal, year) {
    // expands 2-digit year into 4 digits.
    var now = new Date(),
        era = getEra(now);
    if ( year < 100 ) {
        var twoDigitYearMax = cal.twoDigitYearMax;
        twoDigitYearMax = typeof twoDigitYearMax === 'string' ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
        var curr = getEraYear( now, cal, era );
        year += curr - ( curr % 100 );
        if ( year > twoDigitYearMax ) {
            year -= 100;
        }
    }
    return year;
}

function getEra(date, eras) {
    if ( !eras ) return 0;
    var start, ticks = date.getTime();
    for ( var i = 0, l = eras.length; i < l; i++ ) {
        start = eras[ i ].start;
        if ( start === null || ticks >= start ) {
            return i;
        }
    }
    return 0;
}

function toUpper(value) {
    // 'he-IL' has non-breaking space in weekday names.
    return value.split( "\u00A0" ).join(' ').toUpperCase();
}

function toUpperArray(arr) {
    var results = [];
    for ( var i = 0, l = arr.length; i < l; i++ ) {
        results[i] = toUpper(arr[i]);
    }
    return results;
}

function getEraYear(date, cal, era, sortable) {
    var year = date.getFullYear();
    if ( !sortable && cal.eras ) {
        // convert normal gregorian year to era-shifted gregorian
        // year by subtracting the era offset
        year -= cal.eras[ era ].offset;
    }
    return year;
}

function getDayIndex(cal, value, abbr) {
    var ret,
        days = cal.days,
        upperDays = cal._upperDays;
    if ( !upperDays ) {
        cal._upperDays = upperDays = [
            toUpperArray( days.names ),
            toUpperArray( days.namesAbbr ),
            toUpperArray( days.namesShort )
        ];
    }
    value = toUpper( value );
    if ( abbr ) {
        ret = arrayIndexOf( upperDays[ 1 ], value );
        if ( ret === -1 ) {
            ret = arrayIndexOf( upperDays[ 2 ], value );
        }
    }
    else {
        ret = arrayIndexOf( upperDays[ 0 ], value );
    }
    return ret;
}

function getMonthIndex(cal, value, abbr) {
    var months = cal.months,
        monthsGen = cal.monthsGenitive || cal.months,
        upperMonths = cal._upperMonths,
        upperMonthsGen = cal._upperMonthsGen;
    if ( !upperMonths ) {
        cal._upperMonths = upperMonths = [
            toUpperArray( months.names ),
            toUpperArray( months.namesAbbr )
        ];
        cal._upperMonthsGen = upperMonthsGen = [
            toUpperArray( monthsGen.names ),
            toUpperArray( monthsGen.namesAbbr )
        ];
    }
    value = toUpper( value );
    var i = arrayIndexOf( abbr ? upperMonths[ 1 ] : upperMonths[ 0 ], value );
    if ( i < 0 ) {
        i = arrayIndexOf( abbr ? upperMonthsGen[ 1 ] : upperMonthsGen[ 0 ], value );
    }
    return i;
}

function appendPreOrPostMatch(preMatch, strings) {
    // appends pre- and post- token match strings while removing escaped characters.
    // Returns a single quote count which is used to determine if the token occurs
    // in a string literal.
    var quoteCount = 0,
        escaped = false;
    for ( var i = 0, il = preMatch.length; i < il; i++ ) {
        var c = preMatch.charAt( i );
        switch ( c ) {
            case '\'':
                if ( escaped ) {
                    strings.push( "'" );
                }
                else {
                    quoteCount++;
                }
                escaped = false;
                break;
            case '\\':
                if ( escaped ) {
                    strings.push( "\\" );
                }
                escaped = !escaped;
                break;
            default:
                strings.push( c );
                escaped = false;
                break;
        }
    }
    return quoteCount;
}

function expandFormat(cal, format) {
    // expands unspecified or single character date formats into the full pattern.
    format = format || "F";
    var pattern,
        patterns = cal.patterns,
        len = format.length;
    if ( len === 1 ) {
        pattern = patterns[ format ];
        if ( !pattern ) {
            throw "Invalid date format string '" + format + "'.";
        }
        format = pattern;
    }
    else if ( len === 2  && format.charAt(0) === "%" ) {
        // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
        format = format.charAt( 1 );
    }
    return format;
}

function getParseRegExp(cal, format) {
    // converts a format string into a regular expression with groups that
    // can be used to extract date fields from a date string.
    // check for a cached parse regex.
    var re = cal._parseRegExp;
    if ( !re ) {
        cal._parseRegExp = re = {};
    }
    else {
        var reFormat = re[ format ];
        if ( reFormat ) {
            return reFormat;
        }
    }

    // expand single digit formats, then escape regular expression characters.
    var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
        regexp = ["^"],
        groups = [],
        index = 0,
        quoteCount = 0,
        tokenRegExp = getTokenRegExp(),
        match;

    // iterate through each date token found.
    while ( (match = tokenRegExp.exec( expFormat )) !== null ) {
        var preMatch = expFormat.slice( index, match.index );
        index = tokenRegExp.lastIndex;

        // don't replace any matches that occur inside a string literal.
        quoteCount += appendPreOrPostMatch( preMatch, regexp );
        if ( quoteCount % 2 ) {
            regexp.push( match[ 0 ] );
            continue;
        }

        // add a regex group for the token.
        var m = match[ 0 ],
            len = m.length,
            add;
        switch ( m ) {
            case 'dddd': case 'ddd':
            
            case 'MMMM': case 'MMM': case 'gg': case 'g':
                add = "(\\D+)";
                break;
                
            case 'tt': case 't':
                add = "(\\D*)";
                break;
            case 'yyyy':
            case 'fff':
            case 'ff':
            case 'f':
                add = "(\\d{" + len + "})";
                break;
            case 'dd': case 'd':
            case 'MM': case 'M':
            case 'yy': case 'y':
            case 'HH': case 'H':
            case 'hh': case 'h':
            case 'mm': case 'm':
            case 'ss': case 's':
                add = "(\\d\\d?)";
                break;
            case 'zzz':
                add = "([+-]?\\d\\d?:\\d{2})";
                break;
            case 'zz': case 'z':
                add = "([+-]?\\d\\d?)";
                break;
            case '/':
                add = "(\\" + cal["/"] + ")";
                break;
            default:
                throw "Invalid date format pattern '" + m + "'.";
                break;
        }
        if ( add ) {
            regexp.push( add );
        }
        groups.push( match[ 0 ] );
    }
    appendPreOrPostMatch( expFormat.slice( index ), regexp );
    regexp.push( "$" );

    // allow whitespace to differ when matching formats.
    var regexpStr = regexp.join( '' ).replace( /\s+/g, "\\s+" ),
        parseRegExp = {'regExp': regexpStr, 'groups': groups};

    // cache the regex for this format.
    return re[ format ] = parseRegExp;
}

function getTokenRegExp() {
    // regular expression for matching date and time tokens in format strings.
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}

function parseExact(value, format, culture) {
    // try to parse the date string by matching against the format string
    // while using the specified culture for date field names.
    value = trim( value );
    var cal = culture.calendar,
        // convert date formats into regular expressions with groupings.
        // use the regexp to determine the input format and extract the date fields.
        parseInfo = getParseRegExp(cal, format),
        match = new RegExp(parseInfo.regExp).exec(value);
    if (match === null) {
        return null;
    }
    // found a date format that matches the input.
    var groups = parseInfo.groups,
        era = null, year = null, month = null, date = null, weekDay = null,
        hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
        pmHour = false;
    // iterate the format groups to extract and set the date fields.
    for ( var j = 0, jl = groups.length; j < jl; j++ ) {
        var matchGroup = match[ j + 1 ];
        if ( matchGroup ) {
            var current = groups[ j ],
                clength = current.length,
                matchInt = parseInt( matchGroup, 10 );
            switch ( current ) {
                case 'dd': case 'd':
                    // Day of month.
                    date = matchInt;
                    // check that date is generally in valid range, also checking overflow below.
                    if ( outOfRange( date, 1, 31 ) ) return null;
                    break;
                case 'MMM':
                case 'MMMM':
                    month = getMonthIndex( cal, matchGroup, clength === 3 );
                    if ( outOfRange( month, 0, 11 ) ) return null;
                    break;
                case 'M': case 'MM':
                    // Month.
                    month = matchInt - 1;
                    if ( outOfRange( month, 0, 11 ) ) return null;
                    break;
                case 'y': case 'yy':
                case 'yyyy':
                    year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
                    if ( outOfRange( year, 0, 9999 ) ) return null;
                    break;
                case 'h': case 'hh':
                    // Hours (12-hour clock).
                    hour = matchInt;
                    if ( hour === 12 ) hour = 0;
                    if ( outOfRange( hour, 0, 11 ) ) return null;
                    break;
                case 'H': case 'HH':
                    // Hours (24-hour clock).
                    hour = matchInt;
                    if ( outOfRange( hour, 0, 23 ) ) return null;
                    break;
                case 'm': case 'mm':
                    // Minutes.
                    min = matchInt;
                    if ( outOfRange( min, 0, 59 ) ) return null;
                    break;
                case 's': case 'ss':
                    // Seconds.
                    sec = matchInt;
                    if ( outOfRange( sec, 0, 59 ) ) return null;
                    break;
                case 'tt': case 't':
                    // AM/PM designator.
                    // see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
                    // the AM tokens. If not, fail the parse for this format.
                    pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
                    if ( !pmHour && ( !cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2]) ) ) return null;
                    break;
                case 'f':
                    // Deciseconds.
                case 'ff':
                    // Centiseconds.
                case 'fff':
                    // Milliseconds.
                    msec = matchInt * Math.pow( 10, 3-clength );
                    if ( outOfRange( msec, 0, 999 ) ) return null;
                    break;
                case 'ddd':
                    // Day of week.
                case 'dddd':
                    // Day of week.
                    weekDay = getDayIndex( cal, matchGroup, clength === 3 );
                    if ( outOfRange( weekDay, 0, 6 ) ) return null;
                    break;
                case 'zzz':
                    // Time zone offset in +/- hours:min.
                    var offsets = matchGroup.split( /:/ );
                    if ( offsets.length !== 2 ) return null;
                    hourOffset = parseInt( offsets[ 0 ], 10 );
                    if ( outOfRange( hourOffset, -12, 13 ) ) return null;
                    var minOffset = parseInt( offsets[ 1 ], 10 );
                    if ( outOfRange( minOffset, 0, 59 ) ) return null;
                    tzMinOffset = (hourOffset * 60) + (startsWith( matchGroup, '-' ) ? -minOffset : minOffset);
                    break;
                case 'z': case 'zz':
                    // Time zone offset in +/- hours.
                    hourOffset = matchInt;
                    if ( outOfRange( hourOffset, -12, 13 ) ) return null;
                    tzMinOffset = hourOffset * 60;
                    break;
                case 'g': case 'gg':
                    var eraName = matchGroup;
                    if ( !eraName || !cal.eras ) return null;
                    eraName = trim( eraName.toLowerCase() );
                    for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
                        if ( eraName === cal.eras[ i ].name.toLowerCase() ) {
                            era = i;
                            break;
                        }
                    }
                    // could not find an era with that name
                    if ( era === null ) return null;
                    break;
            }
        }
    }
    var result = new Date(), defaultYear, convert = cal.convert;
    defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
    if ( year === null ) {
        year = defaultYear;
    }
    else if ( cal.eras ) {
        // year must be shifted to normal gregorian year
        // but not if year was not specified, its already normal gregorian
        // per the main if clause above.
        year += cal.eras[ (era || 0) ].offset;
    }
    // set default day and month to 1 and January, so if unspecified, these are the defaults
    // instead of the current day/month.
    if ( month === null ) {
        month = 0;
    }
    if ( date === null ) {
        date = 1;
    }
    // now have year, month, and date, but in the culture's calendar.
    // convert to gregorian if necessary
    if ( convert ) {
        result = convert.toGregorian( year, month, date );
        // conversion failed, must be an invalid match
        if ( result === null ) return null;
    }
    else {
        // have to set year, month and date together to avoid overflow based on current date.
        result.setFullYear( year, month, date );
        // check to see if date overflowed for specified month (only checked 1-31 above).
        if ( result.getDate() !== date ) return null;
        // invalid day of week.
        if ( weekDay !== null && result.getDay() !== weekDay ) {
            return null;
        }
    }
    // if pm designator token was found make sure the hours fit the 24-hour clock.
    if ( pmHour && hour < 12 ) {
        hour += 12;
    }
    result.setHours( hour, min, sec, msec );
    if ( tzMinOffset !== null ) {
        // adjust timezone to utc before applying local offset.
        var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
        // Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
        // to ensure both these fields will not exceed this range.  adjustedMin will range
        // somewhere between -1440 and 1500, so we only need to split this into hours.
        result.setHours( result.getHours() + parseInt( adjustedMin / 60, 10 ), adjustedMin % 60 );
    }
    return result;
}

function formatDate(value, format, culture) {
    var cal = culture.calendar,
        convert = cal.convert;
    if ( !format || !format.length || format === 'i' ) {
        var ret;
        if ( culture && culture.name.length ) {
            if ( convert ) {
                // non-gregorian calendar, so we cannot use built-in toLocaleString()
                ret = formatDate( value, cal.patterns.F, culture );
            }
            else {
                var eraDate = new Date( value.getTime() ),
                    era = getEra( value, cal.eras );
                eraDate.setFullYear( getEraYear( value, cal, era ) );
                ret = eraDate.toLocaleString();
            }
        }
        else {
            ret = value.toString();
        }
        return ret;
    }

    var eras = cal.eras,
        sortable = format === "s";
    format = expandFormat( cal, format );

    // Start with an empty string
    ret = [];
    var hour,
        zeros = ['0','00','000'],
        foundDay,
        checkedDay,
        dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
        quoteCount = 0,
        tokenRegExp = getTokenRegExp(),
        converted;

    function padZeros(num, c) {
        var r, s = num+'';
        if ( c > 1 && s.length < c ) {
            r = ( zeros[ c - 2 ] + s);
            return r.substr( r.length - c, c );
        }
        else {
            r = s;
        }
        return r;
    }

    function hasDay() {
        if ( foundDay || checkedDay ) {
            return foundDay;
        }
        foundDay = dayPartRegExp.test( format );
        checkedDay = true;
        return foundDay;
    }

    function getPart( date, part ) {
        if ( converted ) {
            return converted[ part ];
        }
        switch ( part ) {
            case 0: return date.getFullYear();
            case 1: return date.getMonth();
            case 2: return date.getDate();
        }
    }

    if ( !sortable && convert ) {
        converted = convert.fromGregorian( value );
    }

    for (;;) {
        // Save the current index
        var index = tokenRegExp.lastIndex,
            // Look for the next pattern
            ar = tokenRegExp.exec( format );

        // Append the text before the pattern (or the end of the string if not found)
        var preMatch = format.slice( index, ar ? ar.index : format.length );
        quoteCount += appendPreOrPostMatch( preMatch, ret );

        if ( !ar ) {
            break;
        }

        // do not replace any matches that occur inside a string literal.
        if ( quoteCount % 2 ) {
            ret.push( ar[ 0 ] );
            continue;
        }

        var current = ar[ 0 ],
            clength = current.length;

        switch ( current ) {
            case "ddd":
                //Day of the week, as a three-letter abbreviation
            case "dddd":
                // Day of the week, using the full name
                var names = (clength === 3) ? cal.days.namesAbbr : cal.days.names;
                ret.push( names[ value.getDay() ] );
                break;
            case "d":
                // Day of month, without leading zero for single-digit days
            case "dd":
                // Day of month, with leading zero for single-digit days
                foundDay = true;
                ret.push( padZeros( getPart( value, 2 ), clength ) );
                break;
            case "MMM":
                // Month, as a three-letter abbreviation
            case "MMMM":
                // Month, using the full name
                var part = getPart( value, 1 );
                ret.push( (cal.monthsGenitive && hasDay())
                    ? cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ]
                    : cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] );
                break;
            case "M":
                // Month, as digits, with no leading zero for single-digit months
            case "MM":
                // Month, as digits, with leading zero for single-digit months
                ret.push( padZeros( getPart( value, 1 ) + 1, clength ) );
                break;
            case "y":
                // Year, as two digits, but with no leading zero for years less than 10
            case "yy":
                // Year, as two digits, with leading zero for years less than 10
            case "yyyy":
                // Year represented by four full digits
                part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra( value, eras ), sortable );
                if ( clength < 4 ) {
                    part = part % 100;
                }
                ret.push( padZeros( part, clength ) );
                break;
            case "h":
                // Hours with no leading zero for single-digit hours, using 12-hour clock
            case "hh":
                // Hours with leading zero for single-digit hours, using 12-hour clock
                hour = value.getHours() % 12;
                if ( hour === 0 ) hour = 12;
                ret.push( padZeros( hour, clength ) );
                break;
            case "H":
                // Hours with no leading zero for single-digit hours, using 24-hour clock
            case "HH":
                // Hours with leading zero for single-digit hours, using 24-hour clock
                ret.push( padZeros( value.getHours(), clength ) );
                break;
            case "m":
                // Minutes with no leading zero  for single-digit minutes
            case "mm":
                // Minutes with leading zero  for single-digit minutes
                ret.push( padZeros( value.getMinutes(), clength ) );
                break;
            case "s":
                // Seconds with no leading zero for single-digit seconds
            case "ss":
                // Seconds with leading zero for single-digit seconds
                ret.push( padZeros(value .getSeconds(), clength ) );
                break;
            case "t":
                // One character am/pm indicator ("a" or "p")
            case "tt":
                // Multicharacter am/pm indicator
                part = value.getHours() < 12 ? (cal.AM ? cal.AM[0] : " ") : (cal.PM ? cal.PM[0] : " ");
                ret.push( clength === 1 ? part.charAt( 0 ) : part );
                break;
            case "f":
                // Deciseconds
            case "ff":
                // Centiseconds
            case "fff":
                // Milliseconds
                ret.push( padZeros( value.getMilliseconds(), 3 ).substr( 0, clength ) );
                break;
            case "z":
                // Time zone offset, no leading zero
            case "zz":
                // Time zone offset with leading zero
                hour = value.getTimezoneOffset() / 60;
                ret.push( (hour <= 0 ? '+' : '-') + padZeros( Math.floor( Math.abs( hour ) ), clength ) );
                break;
            case "zzz":
                // Time zone offset with leading zero
                hour = value.getTimezoneOffset() / 60;
                ret.push( (hour <= 0 ? '+' : '-') + padZeros( Math.floor( Math.abs( hour ) ), 2 ) +
                    // Hard coded ":" separator, rather than using cal.TimeSeparator
                    // Repeated here for consistency, plus ":" was already assumed in date parsing.
                    ":" + padZeros( Math.abs( value.getTimezoneOffset() % 60 ), 2 ) );
                break;
            case "g":
            case "gg":
                if ( cal.eras ) {
                    ret.push( cal.eras[ getEra(value, eras) ].name );
                }
                break;
        case "/":
            ret.push( cal["/"] );
            break;
        default:
            throw "Invalid date format pattern '" + current + "'.";
            break;
        }
    }
    return ret.join( '' );
}

// EXPORTS
jQuery.global = Globalization;

})();

// BEGINNING OF TIMEGLIDER CODE

/*
 * Timeglider for Javascript / jQuery 
 * http://timeglider.com/jquery
 *
 * Copyright 2011, Mnemograph LLC
 * Licensed under Timeglider Dual License
 * http://timeglider.com/jquery/?p=license
 *
 */

// initial declaration of timeglider object for widget
// authoring app will declare a different object, so
// this will defer to window.timeglider
timeglider = window.timeglider || {mode:"publish", version:"0.1.0"};


// TG_DATE

/*
*  TG_Date
* 
*  dependencies: jQuery, jQuery.global
*
* You might be wondering why we're not extending JS Date().
* That might be a good idea some day. There are some
* major issues with Date(): the "year zero" (or millisecond)
* in JS and other date APIs is 1970, so timestamps are negative
* prior to that; JS's Date() can't handle years prior to
* -271820, so some extension needs to be created to deal with
* times (on the order of billions of years) existing before that.
*
* This TG_Date object also has functionality which  goes hand-in-hand
* with the date hashing system: each event on the timeline is hashed
* according to day, year, decade, century, millenia, etc
*
*/

/*

IMPORTED DATE STANDARD

http://www.w3.org/TR/NOTE-datetime
"a profile of" ISO 8601 date format

Complete date plus hours, minutes and seconds:
YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)

Acceptable:
YYYY
YYYY-MM
YYYY-MM-DD
YYYY-MM-DDT13
YYYY-MM-DD 08:15 (strlen 16)
YYYY-MM-DD 08:15:30 (strlen 19)
(above would assume either a timeline-level timezone, or UTC)

containing its own timezone, this would ignore timeline timezone
YYYY-MM-DD 08:15:30-07:00
   

*/

timeglider.TG_Date = {};


(function(tg){
  
    
  var tg = timeglider, $ = jQuery;
  
  // caches speed up costly calculations
  var getRataDieCache = {},
    getDaysInYearSpanCache = {},
    getBCRataDieCache = {},
    getDateFromRDCache = {},
    getDateFromSecCache = {};
    
  var VALID_DATE_PATTERN = /^(\-?\d+)?(\-\d{1,2})?(\-\d{1,2})?(?:T| )?(\d{1,2})?(?::)?(\d{1,2})?(?::)?(\d{1,2})?(\+|\-)?(\d{1,2})?(?::)?(\d{1,2})?/;
  
  
   // MAIN CONSTRUCTOR
        
  tg.TG_Date = function (strOrNum, date_display, offSec) {
    var dateStr, isoStr, gotSec,
        offsetSeconds = offSec || 0;
   
   
      // SERIAL SECONDS
    if (typeof(strOrNum) == "number") {
            
      dateStr = isoStr = TG_Date.getDateFromSec(strOrNum);
      gotSec = (strOrNum + offsetSeconds);
    
    } else if (typeof(strOrNum) === "object") {
      
      // dateStr = strOrNum.ye + "-" + strOrNum.mo + "-" + strOrNum.da 
    
    // STRING
    } else {
    
      if (strOrNum == "today") {
        strOrNum = TG_Date.getToday();
      }
      
      dateStr = isoStr = strOrNum;
    }
  
    if(typeof(dateStr) == "undefined") { return {error:"invalid date"}; }
    
      if (VALID_DATE_PATTERN.test(dateStr)) {

      // !TODO: translate strings like "today" and "now"
      // "next week", "a week from thursday", "christmas"
            
          var parsed =  TG_Date.parse8601(dateStr);
          
          
          if (parsed.tz_ho) {
            // this is working ------ timezones in the string translate correctly
            // OK: transforms date properly to UTC since it should have been there
            parsed = TG_Date.toFromUTC(parsed, {hours:parsed.tz_ho, minutes:parsed.tz_mi}, "to");
          }
          
          
          // ye, mo, da, ho, mi, se arrive in parsed (with tz_)
                
      $.extend(this,parsed);

          // SERIAL day from year zero
          this.rd  = TG_Date.getRataDie(this);
    
          // SERIAL month from year 0
          this.mo_num = getMoNum(this);
          
          // SERIAL second from year 0
          this.sec = gotSec || getSec(this);
          
          this.date_display = (date_display) ? (date_display.toLowerCase()).substr(0,2) : "da";
      
      // TODO: get good str from parse8601  
          this.dateStr = isoStr;
      
      } else {
        return {error:"invalid date"};
      }
            
        return this;

  } // end TG_Date Function



  var TG_Date = tg.TG_Date;

  /*
  *  getTimeUnitSerial
  *  gets the serial number of specified time unit, using a ye-mo-da date object
  *  used in addToTicksArray() in Mediator
  *
  *  @param fd {object} i.e. the focus date: {ye:1968, mo:8, da:20}
  *  @param unit {string} scale-unit (da, mo, ye, etc)
  *
  *  @return {number} a non-zero serial for the specified time unit
  */
  TG_Date.getTimeUnitSerial = function (fd, unit) {
      var ret = 0;
      var floorCeil;
      
      if (fd.ye < 0) {
        floorCeil = Math.ceil;
      } else {
        floorCeil = Math.floor;
      }
      
      switch (unit) {
        case "da": ret =  fd.rd; break;
        // set up mo_num inside TG_Date constructor
        case "mo": ret =  fd.mo_num; break;
        case "ye": ret = fd.ye; break;
        case "de": ret =  floorCeil(fd.ye / 10); break;
        case "ce": ret =  floorCeil(fd.ye / 100); break;
        case "thou": ret =  floorCeil(fd.ye / 1000); break;
        case "tenthou": ret =  floorCeil(fd.ye / 10000); break;
        case "hundredthou": ret =  floorCeil(fd.ye / 100000); break;
        case "mill": ret =  floorCeil(fd.ye / 1000000); break;
        case "tenmill": ret =  floorCeil(fd.ye / 10000000); break;
        case "hundredmill": ret =  floorCeil(fd.ye / 100000000); break;
        case "bill": ret =  floorCeil(fd.ye / 1000000000); break;
      }
      return ret;
  };



  TG_Date.getMonthDays = function(mo,ye) {
    if ((TG_Date.isLeapYear(ye) == true) && (mo==2)) {
      return 29;
    } else  {
      return TG_Date.monthsDayNums[mo];
    }
  };


  TG_Date.twentyFourToTwelve = function (e) {
  
    var dob = {};
    dob.ye = e.ye;
    dob.mo = e.mo;
    dob.da = e.da;
    dob.ho = e.ho;
    dob.mi = e.mi;
    dob.ampm = "am";
  
    if (e.ho) {
      if (e.ho >= 12) {
        dob.ampm = "pm";
        if (e.ho > 12) {
          dob.ho = e.ho - 12;
        } else {
          dob.ho = 12;
        }
      } else if (e.ho == 0) {
        dob.ho = 12;
        dob.ampm = "am";
      } else {
        dob.ho = e.ho;
      }
    } else {
      dob.ho = 12;
      dob.mi = 0;
      dob.ampm = "am";
    }
  
    return dob;
  };
  
  
  /*
  * RELATES TO TICK WIDTH: SPECIFIC TO TIMELINE VIEW
  */
  TG_Date.getMonthAdj = function (serial, tw) {
    var d = TG_Date.getDateFromMonthNum(serial);
    var w;
    switch (d.mo) {
    
      // 31 days
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        var w = Math.floor(tw + ((tw/28) * 3));
        return {"width":w, "days":31};
      break;

      // Blasted February!
      case 2:
      if (TG_Date.isLeapYear(d.ye) == true) {
        w = Math.floor(tw + (tw/28));
        return {"width":w, "days":29};
      } else {
        return {"width":tw, "days":28};
      }
      break;
    
      default: 
      // 30 days
      w = Math.floor(tw + ((tw/28) * 2));
      return {"width":w, "days":30};
    }
  
  
  };


  /*
  * getDateFromMonthNum
  * Gets a month (1-12) and year from a serial month number
  * @param mn {number} serial month number
  * @return {object} ye, mo (numbers)
  */
  TG_Date.getDateFromMonthNum = function(mn) {

    var rem = 0;
    var ye, mo;

    if (mn > 0) {
      rem = mn % 12;

      if (rem == 0) { rem = 12 };

      mo = rem;
      ye = Math.ceil(mn / 12);

    } else {
      // BCE!
      rem = Math.abs(mn) % 12;
      mo = (12 - rem) + 1;
      if (mo == 13) mo = 1;
      // NOYEARZERO problem: here we would subtract
      // a year from the results to eliminate the year 0
      ye =  -1 * Math.ceil(Math.abs(mn) / 12); // -1

      }
    
    return {ye:ye, mo:mo};
  };



  /*
  * getMonthWidth
  * Starting with a base-width for a 28-day month, calculate
  * the width for any month with the possibility that it might
  * be a leap-year February.
  *
  * @param mo {number} month i.e. 1 = January, 12 = December
  * @param ye {number} year
  *
  * RELATES TO TICK WIDTH: SPECIFIC TO TIMELINE VIEW
  */
  TG_Date.getMonthWidth = function(mo,ye,tickWidth) {
  
    var dayWidth = tickWidth / 28;
    var ad;
    var nd = 28;

    switch (mo) {
      case 1: case 3: case 5: case 7: case 8: case 10: case 12: ad = 3; break;
      case 4: case 6: case 9: case 11: ad = 2; break;
      // leap year
      case 2: if (TG_Date.isLeapYear(ye) == true) { ad = 1; } else { ad=0; }; break;
    
    }

    var width = Math.floor(tickWidth + (dayWidth * ad));
    var days = nd + ad;

    return {width:width, numDays:days};
  };




  TG_Date.getToday = function () {
      var d = new Date(); 
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":00";
  }


  /*
   * Helps calculate the position of a modulo remainder in getRataDie()
   */
  TG_Date.getMonthFromRemDays = function (dnum, yr) {

    var tack = 0;
    var rem = 0;
    var m = 0;

    if (TG_Date.isLeapYear(yr)){ tack = 1; } else { tack=0; }
  
    if (dnum <= 31) { m = 1; rem = dnum; }
    else if ((dnum >31) && (dnum <= 59 + tack)) { m = 2; rem = dnum - (31 + tack); }
    else if ((dnum > 59 + tack) && (dnum <= 90 + tack)) { m = 3; rem = dnum - (59 + tack); }
    else if ((dnum > 90 + tack) && (dnum <= 120 + tack)) { m = 4; rem = dnum - (90 + tack); }
    else if ((dnum > 120 + tack) && (dnum <= 151 + tack)) { m = 5; rem = dnum - (120 + tack); }
    else if ((dnum > 151 + tack) && (dnum <= 181 + tack)) { m = 6; rem = dnum - (151 + tack); }
    else if ((dnum > 181 + tack) && (dnum <= 212 + tack)) { m = 7; rem = dnum - (181 + tack); }
    else if ((dnum > 212 + tack) && (dnum <= 243 + tack)) { m = 8; rem = dnum - (212 + tack); }
    else if ((dnum > 243 + tack) && (dnum <= 273 + tack)) { m = 9; rem = dnum - (243 + tack); }
    else if ((dnum > 273 + tack) && (dnum <= 304 + tack)) { m = 10; rem = dnum - (273 + tack); }
    else if ((dnum > 304 + tack) && (dnum <= 334 + tack)) { m = 11; rem = dnum - (304 + tack); }
    else { m = 12; rem = dnum - (334 + tack);  }

    return {mo:m, da:rem};

    };





  /*
   GET YYYY.MM.DD FROM (serial) rata die 
  @param snum is the rata die or day serial number
  */
  TG_Date.getDateFromRD = function (snum) {
    
    if (getDateFromRDCache[snum]) {
      return getDateFromRDCache[snum]
    }
    // in case it arrives as an RD-decimal
    var snumAb = Math.floor(snum);

    var bigP = 146097; // constant days in big cal cycle
    var chunk1 = Math.floor(snumAb / bigP);
    var chunk1days = chunk1 * bigP;
    var chunk1yrs = Math.floor(snumAb / bigP) * 400;
    var chunk2days = snumAb - chunk1days;
    var dechunker = chunk2days; 
    var ct = 1;

    var ia = chunk1yrs + 1;
    var iz = ia + 400;

    for (var i = ia; i <= iz; i++) {
      if (dechunker > 365) {
        dechunker -= 365;
        if (TG_Date.isLeapYear(i)) { dechunker -= 1; }
        ct++;
      }  else { i = iz; }
    }

    var yt = chunk1yrs + ct;
  
    if (dechunker == 0) dechunker = 1;
    var inf = TG_Date.getMonthFromRemDays(dechunker,yt);
    // in case...
    var miLong = (snum - snumAb) * 1440;
    var mi = Math.floor(miLong % 60);
    var ho = Math.floor(miLong / 60);
  
    if ((TG_Date.isLeapYear(yt)) && (inf['mo'] == 2)) {
      inf['da'] += 1;
    }

    var ret = yt + "-" + inf['mo'] + "-" + inf['da'] + " " + ho + ":" + mi + ":00";
    getDateFromRDCache[snum] = ret;
    
    return ret;
  
  }, // end getDateFromRD


  TG_Date.getDateFromSec = function (sec) {
    // FIRST GET Rata die
    if (getDateFromSecCache[sec]) {
      return getDateFromSecCache[sec]
    }
    
    // the sec/86400 represents a "rd-decimal form"
    // that will allow extraction of hour, minute, second
    var ret = TG_Date.getDateFromRD(sec / 86400);
    
    getDateFromSecCache[sec] = ret;
    
    return ret;
  };


  TG_Date.isLeapYear =  function(y) {
    if (y % 400 == 0) {
      return true;
    } else if (y % 100  == 0){
      return false;
    } else if (y % 4 == 0) {
      return true;
    } else {
      return false;
    }
  };


  /*
  * getRataDie
  * Core "normalizing" function for dates, the serial number day for
  * any date, starting with year 1 (well, zero...), wraps a getBCRataDie()
  * for getting negative year serial days
  *
  * @param dat {object} date object with {ye, mo, da}
  * @return {number} the serial day
  */
  TG_Date.getRataDie = function (dat) {
    
    var ye = dat.ye;
    var mo = dat.mo;
    var da = dat.da;
    var ret = 0;
    
    if (getRataDieCache[ye + "-" + mo + "-" + da]) {
      return getRataDieCache[ye + "-" + mo + "-" + da];
    }

  if (ye >= 0) { 
    // THERE IS NO YEAR ZERO!!!
    if (ye == 0) ye = 1;

    var fat =  (Math.floor(ye / 400)) * 146097,
        remStart = (ye - (ye % 400)),
        moreDays = parseInt(getDaysInYearSpan(remStart, ye)),
        daysSoFar = parseInt(getDaysSoFar(mo,ye));
      
    ret = (fat + moreDays + daysSoFar + da) - 366;
  
  } else if (ye < 0) {
    
    ret = TG_Date.getBCRataDie({ye:ye, mo:mo, da:da});
  } 

  getRataDieCache[ye + "-" + mo + "-" + da] = ret;
  
  return ret;

  ////// internal RataDie functions
        /*
        *  getDaysInYearSpan
        *  helps calculate chunks of whole years
        
        *  @param a {number} initial year in span
        *  @param z {number} last year in span
        * 
        *  @return {number} days in span of arg. years
        */
        function getDaysInYearSpan (a, z) {
  
          if (getDaysInYearSpanCache[a + "-" + z]) {
            return getDaysInYearSpanCache[a + "-" + z];
          }
          var t = 0;

          for (var i = a; i < z; i++){
            if (TG_Date.isLeapYear(i)) { t += 366; } else { t += 365; }
          }
        
          getDaysInYearSpanCache[a + "-" + z] = t;
        
          return t;

        };


        function getDaysSoFar (mo,ye) {
          
          var d;
  
          switch (mo) {
            case 1: d=0;   break; // 31
            case 2: d=31;  break; // 29
            case 3: d=59;  break; // 31
            case 4: d=90;  break; // 30
            case 5: d=120; break; // 31
            case 6: d=151; break; // 30
            case 7: d=181; break; // 31
            case 8: d=212; break; // 31
            case 9: d=243; break; // 30
            case 10: d=273;break; // 31
            case 11: d=304;break; // 30
            case 12: d=334;break; // 31
          }
  
          if (mo > 2) {
             if (TG_Date.isLeapYear(ye)) { d += 1; }
          }

          return d;
        };


  };

  TG_Date.monthNamesLet = ["","J","F","M","A","M","J","J","A","S","O","N","D"];

    TG_Date.monthsDayNums = [0,31,28,31,30,31,30,31,31,30,31,30,31,29];
  
    // NON-CULTURE
    TG_Date.units = ["da", "mo", "ye", "de", "ce", "thou", "tenthou", "hundredthou", "mill", "tenmill", "hundredmill", "bill"];
    
    
  /*
  Counts serial days starting with -1 in year -1. Visualize a number counting 
  from "right to left" on top of the other calendrical pieces chunking away
  from "left to right".  But since there's no origin farther back before 0
  we have no choice. 

  @param dat  object with .ye, .mo, .da
  */
  TG_Date.getBCRataDie = function (dat) {

    var ye = dat.ye,
        mo = dat.mo,
        da = dat.da;
    
    if (getBCRataDieCache[ye + "-" + mo + "-" + da]) {
        return getBCRataDieCache[ye + "-" + mo + "-" + da];
    }

    if (mo == 0) mo = 1;
    if (da == 0) da = 1;

    var absYe = Math.abs(ye);
    var chunks = [0,335,306,275,245,214,184,153,122,92,61,31,0];
    var mdays = TG_Date.monthsDayNums[mo];
    var rawYeDays = (absYe - 1) * 366;
    var rawMoDays = chunks[mo];
    var rawDaDays = (mdays - da) + 1;
    var ret = -1 * (rawYeDays + rawMoDays + rawDaDays);
    
    getBCRataDieCache[ye + "-" + mo + "-" + da] = ret;
    return ret;
  };


  TG_Date.setCulture = function(culture_str) {
    
    jQuery.global.culture = jQuery.global.cultures[culture_str];
 
    // ["","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    TG_Date.monthNames = $.merge([""],jQuery.global.culture.calendar.months.names);
    
    // ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    TG_Date.monthNamesAbbr = $.merge([""],jQuery.global.culture.calendar.months.namesAbbr);
  
    
  
    // ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    TG_Date.dayNames = jQuery.global.culture.calendar.days.names;
  
    // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    TG_Date.dayNamesAbbr = jQuery.global.culture.calendar.days.namesAbbr;
  
    TG_Date.dayNamesShort = jQuery.global.culture.calendar.days.namesShort;
  
    TG_Date.patterns = jQuery.global.culture.calendar.patterns;
    
  };


  /*
  *  INSTANCE METHODS  
  *
  */
  
  TG_Date.prototype = {
      
    format : function (sig, useLimit, tz_off) {
    
      var offset = tz_off || {"hours":0, "minutes":0};
    
      var jsDate, fromUTC; // jsDate
    
      /* "en" formats
      // short date pattern
      d: "M/d/yyyy",
      // long date pattern
      D: "dddd, MMMM dd, yyyy",
      // short time pattern
      t: "h:mm tt",
      // long time pattern
      T: "h:mm:ss tt",
      // long date, short time pattern
      f: "dddd, MMMM dd, yyyy h:mm tt",
      // long date, long time pattern
      F: "dddd, MMMM dd, yyyy h:mm:ss tt",
      // month/day pattern
      M: "MMMM dd",
      // month/year pattern
      Y: "yyyy MMMM",
      // S is a sortable format that does not vary by culture
      S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
      */
      
      // If, for example, an event wants only year-level time being displayed
      // (and not month, day...) filter out the undesired time levels
      if (useLimit == true) {
        // reduce to 2 chars for consistency
        var ddlim = this.date_display.substr(0,2);
        switch (ddlim) {
          case "no": return ""; break;
          case "ye": sig = "yyyy"; break;
          case "mo": sig = "MMM yyyy"; break;
          case "da": sig = "MMM d, yyyy"; break;
          case "ho": sig = "MMM d, yyyy h:mm tt"; break;
          
          default: sig = "f";
        }
      }
      
                  
            if (this.ye > -270000){
        
        var cloner = _.clone(this);
        fromUTC = TG_Date.toFromUTC(cloner, offset, "from");  
              
              var utcy = Number(fromUTC.ye);
              
              if (utcy > 0 && utcy < 100) {
                utcy = "0" + utcy;
                // we can use the same thing we use for the BIGNUM problem
                // below for this weird window that JS fails on
                return TG_Date.monthNamesAbbr[fromUTC.mo] + " " + fromUTC.da + ", " + fromUTC.ye;
                
              } else {
                jsDate = new Date(utcy, (fromUTC.mo-1), fromUTC.da, fromUTC.ho, fromUTC.mi, fromUTC.se, 0);
          return $.global.format(jsDate, sig);
              }
          
      
      
        } else {
          // BIGNUM_PROBLEM
        // year < -271,000 will fail as js Date
          // JUST RETURN YEAR
          return this.ye;
        }
      
    }

    } // end .prototype
    
    
  
  TG_Date.getTimeOffset = function(offsetString) {
    
    // remove all but numbers, minus, colon
    var oss = offsetString.replace(/[^-\d:]/gi, ""),
      osA = oss.split(":"),
      ho = parseInt(osA[0], 10),
      mi = parseInt(osA[1], 10),
    
      // minutes negative if hours are 
      sw = (ho < 0) ? -1 : 1,
    
      miDec = sw * ( mi / 60 ),
      dec = (ho + miDec),
      se = dec * 3600;
      
      var ob = {"decimal":dec, "hours":ho, "minutes":mi, "seconds":se, "string":oss};
  
      return ob; 
    
  };  
  
  
  TG_Date.tzOffsetStr = function (datestr, offsetStr) {
    if (datestr) {
    if (datestr.length == 19) {
      datestr += offsetStr;
    } else if (datestr.length == 16) {
      datestr += ":00" + offsetStr;
    }
    return datestr;
    }
  };
  
    
  /*
  * TG_parse8601
  * transforms string into TG Date object
  */
  TG_Date.parse8601 = function(str){
    //if(typeof(str) == "undefined") {str = "2012-09-29";}
    /*
    len   str
      4     YyYyYyY
    7     YyYyYyY-MM
    10    YyYyYyY-MM-DD
    13    YyYyYyY-MM-DDTHH (T is optional between day and hour)
    16    YyYyYyY-MM-DD HH:MM
    19    YyYyYyY-MM-DDTHH:MM:SS
    25    YyYyYyY-MM-DD HH:MM:SS-ZH:ZM
    */
   
    var ye, mo, da, ho, mi, se, bce, bce_ye, tz_pm, tz_ho, tz_mi,
      mo_default = 1,
      da_default = 1,
      ho_default = 12,
      mi_default = 0,
      se_default = 0,
      
      dedash = function (n){
        if (n) {
          return parseInt(n.replace("-", ""), 10);
        } else {
          return 0;
        }
      },
      //       YyYyYyY    MM          DD
      reg = VALID_DATE_PATTERN;
      var rx = str.match(reg);

      // picks up positive OR negative (bce)  
    ye = parseInt(rx[1]);
    
    if (!ye) return {"error":"invalid date; no year provided"};

    mo = dedash(rx[2]) || mo_default;
    da = dedash(rx[3]) || da_default;
    // rx[4] is the "T" or " "
    ho = dedash(rx[4]) || da_default;
    // rx[6] is ":"
    mi = dedash(rx[5]) || mi_default;
    // rx[8] is ":"
    se = dedash(rx[6]) || mi_default;
        
    // if year is < 1 or > 9999, override
    // tz offset, set it to 0/UTC no matter what
    
    // If the offset is negative, we want to make
    // sure that minutes are considered negative along
    // with the hours"-07:00" > {tz_ho:-7; tz_mi:-30}
    tz_pm = rx[7] || "+";
      tz_ho = parseInt(rx[8], 10) || 0;
    if (tz_pm == "-") {tz_ho = tz_ho * -1;}
    tz_mi = parseInt(rx[9], 10) || 0;
    if (tz_pm == "-") {tz_mi = tz_mi * -1;}
    
    // is it a leap year?? get this once

    return {"ye":ye, "mo":mo, "da":da, "ho":ho, "mi":mi, "se":se, "tz_ho":tz_ho, "tz_mi":tz_mi}
    

  }; // parse8601
  
  
  TG_Date.getLastDayOfMonth = function(ye, mo) {
    var lastDays = [0,31,28,31,30,31,30,31,31,30,31,30,31],
      da = 0;
    if (mo == 2 && TG_Date.isLeapYear(ye) == true) {
      da = 29;
    } else {
      da = lastDays[mo];
    }
    return da;
    
  }; 
  
  /* 
  * getDateTimeStrings
  *
  * @param str {String} ISO8601 date string
  * @return {Object} date, time as strings with am or pm
  */
  TG_Date.getDateTimeStrings = function (str) {
    
    var obj = TG_Date.parse8601(str);
  
    if (str == "today") {
      return {"date": "today", "time":""}
    } else {
      var date_val = obj.ye + "-" + unboil(obj.mo) + "-" + unboil(obj.da);
    }
    
    
    var ampm = "pm";
    
    if (obj.ho > 12) {
      obj.ho -= 12;
      ampm = "pm";
    } else {
      if (obj.ho == 0) { obj.ho = "12"; }
      ampm = "am";
    }
  
    var time_val = boil(obj.ho) + ":" + unboil(obj.mi) + " " + ampm;
    
    return {"date": date_val, "time":time_val}
  };
  
  
  // This is for a separate date input field --- YYYY-MM-DD (DATE ONLY)
  // field needs to be restricted by the $.alphanumeric plugin
  TG_Date.transValidateDateString = function (date_str) {
    
    if (date_str == "today"){
      return "today";
    }
    
    if (!date_str) return false; // date needs some value
    var reg = /^(\-?\d+|today|now) ?(bce?)?-?(\d{1,2})?-?(\d{1,2})?/,
      valid = "",
      match = date_str.match(reg),
      zb = TG_Date.zeroButt;
      
    if (match) {
      // now: 9999-09-09
      // today: get today
      
      // translate
      var ye = match[1],
        bc = match[2] || "",
        mo = match[3] || "07",
        da = match[4] || "1";
      
      if (parseInt(ye, 10) < 0 || bc.substr(0,1) == "b") {
        ye = -1 * (Math.abs(ye));
      }
      
      if (TG_Date.validateDate(ye, mo, da)) {
        return ye + "-" + zb(mo) + "-" + zb(da);
      } else {
        return false;
      }
    
      
    } else {
      return false;
    }
  };
  
  // This is for a separate TIME input field: 12:30 pm
  // field needs to be restricted by the $.alphanumeric plugin
  TG_Date.transValidateTimeString = function (time_str) {
    if (!time_str) return "12:00:00";
    
    var reg = /^(\d{1,2}|noon):?(\d{1,2})?:?(\d{1,2})? ?(am|pm)?/i,
      match = time_str.toLowerCase().match(reg),
      valid = "",
      zb = TG_Date.zeroButt;
    
    if (match[1]) {

      // translate
      if (match[0] == "noon") {
        valid = "12:00:00"
      } else {
        // HH MM
        var ho = parseInt(match[1], 10) || 12;
        var mi = parseInt(match[2], 10) || 0;
        var se = parseInt(match[3], 10) || 0;
        var ampm = match[4] || "am";
        
        if (TG_Date.validateTime(ho, mi, se) == false) return false;
        if (ampm == "pm" && ho < 12) ho += 12;
        valid = zb(ho) + ":" + zb(mi) + ":" + zb(se);
      }
    } else {
      valid = false;
    }
    
    return valid;
  };
  
  
  // make sure hours and minutes are valid numbers
  TG_Date.validateTime = function (ho, mi, se) {
    if ((ho < 0 || ho > 23) || (mi < 0 || mi > 59) || (se < 0 || se > 59)) { return false; }
    return true;
  };
  
  
    /*
    * validateDate
    * Rejects dates like "2001-13-32" and such
    *
    */
    TG_Date.validateDate = function (ye, mo, da) {
      
      // this takes care of leap year
      var ld = TG_Date.getMonthDays(mo, ye);

      if ((da > ld) || (da <= 0)) { return false; } 
      // invalid month numbers
      if ((mo > 12) || (mo < 0)) { return false; }
      // there's no year "0"
      if (ye == 0) { return false; }
      
      return true;
    };
        
        
  // make sure hours and minutes are valid numbers
  TG_Date.zeroButt = function (n) {
    
    var num = parseInt(n, 10);
    if (num > 9) {
      return String(num);
    } else {
      return "0" + num;
    }
  }
    

  /*
  * toFromUTC
  * transforms TG_Date object to be either in UTC (GMT!) or in non-UTC
  *
  * @param ob: {Object} date object including ye, mo, da, etc
  * @param offset: {Object} eg: hours, minutes {Number} x 2
  *
  * with offsets made clear. Used for formatting dates at all times
  * since all event dates are stored in UTC
  *
  * @ return {Object} returns SIMPLE DATE OBJECT: not a full TG_Date instance
  *                   since we don't want the overhead of calculating .rd etc.
  */    
  TG_Date.toFromUTC = function (ob, offset, toFrom) {
        
    var nh_dec = 0,
      lastDays = [0,31,28,31,30,31,30,31,31,30,31,30,31,29],
      
      deltaFloatToHM = function (flt){
        var fl = Math.abs(flt),
          h = Math.floor(fl),
          dec = fl - h,
          m = Math.round(dec * 60);
        
        return {"ho":h, "mi":m, "se":0};
      },
      delta = {};
            
    // Offset is the "timezone setting" on the timeline,
    // or the timezone to which to translate from UTC
    if (toFrom == "from") {
      delta.ho = -1 * offset.hours;
      delta.mi = -1 * offset.minutes;
    } else if (toFrom == "to"){
      delta.ho = offset.hours;
      delta.mi = offset.minutes;
    } else {
      delta.ho = -1 * ob.tz_ho;
      delta.mi = -1 * ob.tz_mi;
    }
  
    
    // no change, man!
    if (delta.ho == 0 && delta.mi ==0) {
      return ob; 
    } 
    
    // decimal overage or underage after adding offset
    var ho_delta = (ob.ho + (ob.mi / 60)) + ((-1 * delta.ho) + ((delta.mi * -1) / 60));
        
    // FWD OR BACK ?
    if (ho_delta < 0) {
      // go back a day
      nh_dec = 24 + ho_delta;
    
      if (ob.da > 1) {
        ob.da = ob.da - 1;
      } else { 
        // day is 1....
        if (ob.mo == 1) {
          // & month is JAN, go back to DEC
          ob.ye = ob.ye - 1; ob.mo = 12; ob.da = 31;
        } else { 
          ob.mo = ob.mo-1;
          // now that we know month, what is the last day number?
          ob.da = TG_Date.getLastDayOfMonth(ob.ye, ob.mo)
        }
      }
      
    } else if (ho_delta >= 24) {
      // going fwd a day
      nh_dec = ho_delta - 24;     

      if (TG_Date.isLeapYear(ob.ye) && ob.mo == 2 && ob.da==28){
        ob.da = 29;
      } else if (ob.da == lastDays[ob.mo]) {
        if (ob.mo == 12) {
          ob.ye = ob.ye + 1;
          ob.mo = 1;
        } else {
          ob.mo = ob.mo + 1;
        }
        ob.da = 1;
      } else {
        ob.da = ob.da + 1;
      }

    } else {
      nh_dec = ho_delta;
    }
    // delta did not take us from one day to another
    // only adjust the hour and minute
    var hm = deltaFloatToHM(nh_dec);
      ob.ho = hm.ho;
      ob.mi = hm.mi; 
      
    if (!offset) {
      ob.tz_ho = 0;
      ob.tz_mi = 0;
    } else {
      ob.tz_ho = offset.tz_ho;
      ob.tz_mi = offset.tz_mi;
    }
    
        
    ////// 
    // return ob;
    var retob = {ye:ob.ye, mo:ob.mo, da:ob.da, ho:ob.ho, mi:ob.mi, se:ob.se};
    
    return retob;
    
    
  }; // toFromUTC
  
  
  /*
   * TGSecToUnixSec
   * translates Timeglider seconds to unix-usable
   * SECONDS. Multiply by 1000 to get unix milliseconds
   * for JS dates, etc.
   *
   * @return {Number} SECONDS (not milliseconds)
   *
   */
  TG_Date.TGSecToUnixSec = function(tg_sec) {
    // 62135686740
    return tg_sec - (62135686740 - 24867);
  };
  
  
  TG_Date.JSDateToISODateString = function (d){  
      var pad = function(n){return n<10 ? '0'+n : n}  
      return d.getUTCFullYear()+'-'  
        + pad(d.getUTCMonth()+1)+'-'  
        + pad(d.getUTCDate())+' '  
        + pad(d.getUTCHours())+':'  
        + pad(d.getUTCMinutes())+':'  
        + pad(d.getUTCSeconds());  
  };
  
  
  
  TG_Date.timezones = [
      {"offset": "-12:00", "name": "Int'l Date Line West"},
      {"offset": "-11:00", "name": "Bering & Nome"},
      {"offset": "-10:00", "name": "Alaska-Hawaii Standard Time"},
      {"offset": "-10:00", "name": "U.S. Hawaiian Standard Time"},
      {"offset": "-10:00", "name": "U.S. Central Alaska Time"},
      {"offset": "-09:00", "name": "U.S. Yukon Standard Time"},
      {"offset": "-08:00", "name": "U.S. Pacific Standard Time"},
      {"offset": "-07:00", "name": "U.S. Mountain Standard Time"},
      {"offset": "-07:00", "name": "U.S. Pacific Daylight Time"},
      {"offset": "-06:00", "name": "U.S. Central Standard Time"},
      {"offset": "-06:00", "name": "U.S. Mountain Daylight Time"},
      {"offset": "-05:00", "name": "U.S. Eastern Standard Time"},
      {"offset": "-05:00", "name": "U.S. Central Daylight Time"},
      {"offset": "-04:00", "name": "U.S. Atlantic Standard Time"},
      {"offset": "-04:00", "name": "U.S. Eastern Daylight Time"},
      {"offset": "-03:30", "name": "Newfoundland Standard Time"},
      {"offset": "-03:00", "name": "Brazil Standard Time"},
      {"offset": "-03:00", "name": "Atlantic Daylight Time"},
      {"offset": "-03:00", "name": "Greenland Standard Time"},
      {"offset": "-02:00", "name": "Azores Time"},
      {"offset": "-01:00", "name": "West Africa Time"},
      {"offset": "00:00", "name": "Greenwich Mean Time/UTC"},
      {"offset": "00:00", "name": "Western European Time"},
      {"offset": "01:00", "name": "Central European Time"},
      {"offset": "01:00", "name": "Middle European Time"},
      {"offset": "01:00", "name": "British Summer Time"},
      {"offset": "01:00", "name": "Middle European Winter Time"},
      {"offset": "01:00", "name": "Swedish Winter Time"},
      {"offset": "01:00", "name": "French Winter Time"},
      {"offset": "02:00", "name": "Eastean EU"},
      {"offset": "02:00", "name": "USSR-zone1"},
      {"offset": "02:00", "name": "Middle European Summer Time"},
      {"offset": "02:00", "name": "French Summer Time"},
      {"offset": "03:00", "name": "Baghdad Time"},
      {"offset": "03:00", "name": "USSR-zone2"},
      {"offset": "03:30", "name": "Iran"},
      {"offset": "04:00", "name": "USSR-zone3"},
      {"offset": "05:00", "name": "USSR-zone4"},
      {"offset": "05:30", "name": "Indian Standard Time"},
      {"offset": "06:00", "name": "USSR-zone5"},
      {"offset": "06:30", "name": "North Sumatra Time"},
      {"offset": "07:00", "name": "USSR-zone6"},
      {"offset": "07:00", "name": "West Australian Standard Time"},
      {"offset": "07:30", "name": "Java"},
      {"offset": "08:00", "name": "China & Hong Kong"},
      {"offset": "08:00", "name": "USSR-zone7"},
      {"offset": "08:00", "name": "West Australian Daylight Time"},
      {"offset": "09:00", "name": "Japan"},
      {"offset": "09:00", "name": "Korea"},
      {"offset": "09:00", "name": "USSR-zone8"},
      {"offset": "09:30", "name": "South Australian Standard Time"},
      {"offset": "09:30", "name": "Central Australian Standard Time"},
      {"offset": "10:00", "name": "Guam Standard Time"},
      {"offset": "10:00", "name": "USSR-zone9"},
      {"offset": "10:00", "name": "East Australian Standard Time"},
      {"offset": "10:30", "name": "Central Australian Daylight Time"},
      {"offset": "10:30", "name": "South Australian Daylight Time"},
      {"offset": "11:00", "name": "USSR-zone10"},
      {"offset": "11:00", "name": "East Australian Daylight Time"},
      {"offset": "12:00", "name": "New Zealand Standard Time"},
      {"offset": "12:00", "name": "Int'l Date Line East"},
      {"offset": "13:00", "name": "New Zealand Daylight Time"}
  ];



        /*
        * boil
        * basic wrapper for parseInt to clean leading zeros,
        * as in dates
        */
        function boil (n) {
          return parseInt(n, 10);
        }; TG_Date.boil = boil;
        
        function unboil (n) {
          var no = parseInt(n, 10);
          if (no > 9 || no < 0) {
            return String(n);
          } else {
            return "0" + no;
          }
        }; TG_Date.unboil = unboil;


        function getSec (fd) {
                    
          var daSec = Math.abs(fd.rd) * 86400;
          var hoSec = (fd.ho) * 3600;
          var miSec = (fd.mi - 1) * 60;
          var bc = (fd.rd > 0) ? 1 : -1;
          var ret = bc * (daSec + hoSec + miSec);
          
          return ret;
        };


  
        /* getMoNum
        *
        * @param mo {Number} month from 1 to 12
        * @param ye {Number} straight year
        *
        */ 
        function getMoNum (ob) {
              if (ob.ye > 0) {
              return  ((ob.ye -1) * 12) + ob.mo;
            } else {
              return getMoNumBC(ob.mo, ob.ye);
            }
        };
  
        /*
        * getMoNumBC
        * In BC time, serial numbers for months are going backward
        * starting with December of 1 bce. So, a month that is actually
        * "month 12 of year -1" is actually just -1, and November of 
        * year 1 bce is -2. Capiche!?
        *
        * @param {object} ob ---> .ye (year)  .mo (month)
        * @return {number} serial month number (negative in this case)
        */
        function getMoNumBC (mo, ye) {
          var absYe = Math.abs(ye);
          var n = ((absYe - 1) * 12) + (12-(mo -1));
          return -1 * n;
        };
        


    function show(ob){
      return ob.ye + "-" + ob.mo + "-" + ob.da + " " + ob.ho + ":" + ob.mi;
    }
    

  
})(timeglider);

// TG_ORG

/*
 * Timeglider for Javascript / jQuery 
 * http://timeglider.com/jquery
 *
 * Copyright 2011, Mnemograph LLC
 * Licensed under Timeglider Dual License
 * http://timeglider.com/jquery/?p=license
 *
 */
 
 /*
  * Version 2 of TG_Org has a "global" check of
  * event-block position, rather than checking
  * against a tree of levels... 
  
  THIS IS THE LAST VERSION OF BOTTOM-UP LAYOUTS
  BY DEFAULT
  
  */

(function(tg){

  // standard "brick" height for placement grid
  var lev_ht = tg.levelHeight = 12,
      // number of available levels for events
      $ = jQuery,
      ceiling_padding = 30,
      topdown_pad = 30,
      bottomup_pad = -8;
      

  /*
  *  @constructor
  */
  tg.TG_Org = function() {
  
    var me = this;
    var icon_f = tg.icon_folder;

    this.blocks = [];
    this.ids = [];
    this.vis = [];
    this.pol = -1;
    this.placedBlocks = [];
    this.freshBlocks = [];
       
   
  /*
  * ******** PUBLIC METHODS **********
  */
  
    
    /*
    * TG_Org.addBlock
    * Adds a 2D geometric block object, corresponding to an event
    * into the "borg" layout.
    * 
    * @param {object} evob Event object including position values: left, width, top, height
                           -- no need for right and bottom
    * @param {string/number} tickScope This either "sweep" or the serial of a single tick (Number)
    * 
    */
    this.addBlock = function (evob, tickScope) {
    evob.right = evob.left + evob.width;
    evob.bottom = evob.top + evob.height;
    evob.tickScope = tickScope;
    me.freshBlocks.push(evob);
    me.blocks.push(evob);
    };
    
    
    /*
     *
     */
    this.clearFresh = function () {
      me.freshBlocks = [];
    }
    
    
    /*
    * TG_Org.getBorg
    *
    * @return {object} This particular "borg" object with its blocks, etc
    * 
    */
    this.getBorg = function () {
      return this;
    };


    /*
    * TG_Org.getBlocks
    * 
    * @return {array} An array of placement blocks (objects), each corresponding
    *                 to an event on the timeline.
    * 
    */
    this.getBlocks = function () {
      return this.blocks;
    };


    /*
    * TG_Org.getHTML
    * inside of args:
    *   @param tickScope {string|number} This either "sweep" or the serial of a single tick (Number)
    *   @param ceiling {number} The max height of the timeline display, after which a "+" appears
    *   @param onZoom {boolean} is the timeline at its preferred/initial zoom?
    *
    * @return {string} HTML with events passed back to view for actual layout of timeline
    */
    this.getHTML = function (args) {

      var tickScope = args.tickScope;
      var ceiling = args.ceiling;
          
        this.onIZoom = args.onIZoom;
              
    if (tickScope == "sweep") { 
      this.vis = [];
    }
    
    if (args.inverted) {
      // top down
      this.pol = 1;
    } else {
      // bottom up
      this.pol = -1;
    }
  
    this.freshBlocks.sort(sortBlocksByImportance);
    // cycle through events and move overlapping event up
  
    var positioned = [], 
      blHeight, 
      lastPos, 
      span_selector_class, 
      span_div, 
      img = '', 
      icon = '',
      html = '', 
      top_or_bottom_padding_from_title = 0,
      b = {},
      blength = this.freshBlocks.length,
      b_span_color = "",
      title_adj = 0,
      highest = 0,
      img_scale = 100,
      img_style = "",
      css_class = "",
      p_icon = "",
      p_overf = "",
      image_class = "lane",
      polarity_cond = "",
      ratio = (typeof(args.dimensions) == "undefined" || typeof(args.dimensions.ratio) == "undefined") ? 1 : args.dimensions.ratio; // added by ndg for SHANTI to adjust level of events when height of timeline is changed
      
    for (var i=0; i<blength; i++) {
    
        b = this.freshBlocks[i];
      title_adj = 0;
      img_scale = 100;
      img_style = "";
      
        // full sweep or just a tick added left or right
      if (b.tickScope == tickScope) {
        
        // is it not yet visible?
        if (_.indexOf(this.vis, b.id) == -1) {
  
          // it's not in the "visible" array, so add it
          this.vis.push(b.id);
          
          // if it's got static HTML in it
          if (b.html && b.html.substr(0,4) == "<div") {
                  // chop off the end and re-glue with style & id
            html += ("<div"+ 
                          " style='left:" + b.left + "px' "+
                          "id='" + b.id + "'"+
                           b.html.substr(4));
                  
          } else {      
                  
                  // if it has an image, it's either in "layout" mode (out on timeline full size)
                  // or it's going to be thumbnailed into the "bar"
            if (b.image) {
            
              /*
              if (this.onIZoom) {
                debug.log("on izoom!");
                image_class = b.image.display_class;
              } else {
                debug.log("on izoom!");
                image_class = "lane";
              }
              */
              
              image_class = b.image.display_class;
              
              
              if (b.shape && image_class == "inline") {
                img_style = " style='width:" + b.shape.img_wi + "px;height:auto;top:-" + b.shape.img_ht + "px'";
              } else {
                img_style = "";
              }

                             
                
              title_adj = 0; // b.shape.img_ht + 4;
              
              
              // different image classes ("bar", "above") are positioned
              // using a separate $.each routine in TimelineView rather than
              // being given absolute positioning here.
              img = "<div data-max_height='" + b.image.max_height + "' class='timeglider-event-image-" + image_class + "'><img src='" + b.image.src + "' " + img_style + "></div>";
              
              
            } else {
              // no image
              img = "";
            } 
                  
                  
                  highest = ceiling - ceiling_padding;
                    
            if (this.onIZoom && b.y_position > 0) {
              // absolute positioning
              b.top = me.pol * b.y_position;

            } else {
              // starts out checking block against the bottom layer
              //!RECURSIVE
              // *** alters the `b` block object
              b.attempts = 0;
              checkAgainstPlaced(b, highest);
              
            }
            
                        
            // note: divs that are higher have lower "top" values
            // `ceiling` being set at 0 (event_overflow set to "scroll") 
            // may require/allow for event scrolling possibilities...
            
            if (me.pol == -1) {
              polarity_cond = (ceiling && (Math.abs(b.top) > highest));
            } else {
              polarity_cond = (ceiling && (Math.abs(b.top + 30) > highest));
            }
            
            
            if (polarity_cond){
              
              p_overf = (me.pol == -1) ? "top:-" + (ceiling-10) + "px": "top:" + ceiling + "px"
              
              var white_cir = "<img src='" + icon_f + "circle_white.png'>";
              p_icon = (b.icon) ? "<img src='" + icon_f + b.icon + "'>": white_cir;
              
              // + + + symbols in place of events just under ceiling
              // if things are higher than the ceiling, show plus signs instead,
              // and we'll zoom in with these.
              html += "<div id='" + b.id + "' class='timeglider-timeline-event tg-event-overflow' style='left:" + b.left  + "px;" + p_overf + "'>" + p_icon + "</div>";
                    
            } else {
              
              if (b.fontsize > 2) {
              
                b_span_color = (b.span_color) ? ";background-color:" + b.span_color: "";
              
                b.fontsize < 10 ? b.opacity = b.fontsize / 10 : b.opacity=1;
              
                if (b.span == true) {
                  span_selector_class = "timeglider-event-spanning";
                  // add seconds into span data in case calculations
                  // are in demand in DOM
                  span_div = "<div data-starts='" + b.startdateObj.sec + "' data-ends='" + b.enddateObj.sec + "' class='timeglider-event-spanner' style='top:" + "px;height:" + b.fontsize + "px;width:" + b.spanwidth + "px" + b_span_color + "'></div>";
                } else {
                  span_selector_class = ""; 
                  span_div = "";
                }
      
                if (b.icon) {
                  icon = "<img class='timeglider-event-icon' src='" + icon_f + b.icon + "' style='height:" + b.fontsize + "px;left:-" + (b.fontsize + 2) + "px; top:" + title_adj + "px'>";
                } else {
                  icon = '';
                }
               
                // pad inverted (polarity 1) events to exceed the height
                // of the timeline title bar; pad "normal" top-up events
                // to have some space between them and the title bar
                top_or_bottom_padding_from_title = (me.pol === 1) ?
                  topdown_pad : bottomup_pad;
                
                // possible customized class
                css_class = b.css_class || '';
                
                // create classes for event types, added by ndg (etype code to add type class) 
                var etype = "";
                if (typeof(b.type) == "string" && b.type != "") {
                  var events = b.type.split(/,\s*/);
                  for(var n in events) {
                    if(events[n] != "") {
                      etype += " etype-" + events[n].toLowerCase().replace(/\s/g,'-');
                    }
                  }
                }
                
                // TODO: function for getting "standard" event shit
                html += "<div class='timeglider-timeline-event " 
                  + css_class + " " + span_selector_class + etype
                  + "' id='" + b.id + "' "
                  + "style='width:" + b.width  + "px;"
                  + "height:" + b.height + "px;"
                  + "left:" + b.left  + "px;" 
                  + "opacity:" + b.opacity + ";"
                  + "top:" + (b.top + top_or_bottom_padding_from_title) * ratio + "px;"
                  + "font-size:" + b.fontsize  + "px;'>"
                  + icon + img + span_div 
                  + "<div class='timeglider-event-title' style='top:" + title_adj + "px'>" 
                  + b.title
                  + "</div></div>";
              
              } // endif fontsize is > 1
            
            } // end if/else :: height > ceiling
  
          } // end if it's got valid HTML
  
        } // end check for visible... EXPENSIVE!!!!
        
      } // end tickScope check
      
    } // end for()

  
  return {"html":html};


  }; /// end getHTML





  /// PRIVATE STUFF ///
     
   /**
   * sortBlocksByImportance
   * Sorter helper for sorting events by importance
   * @param a {Number} 1st sort number
   * @param b {Number} 2nd sort number
   */
   var sortBlocksByImportance = function (a, b) {
      var x = b.importance, 
          y = a.importance;
      
      if (a.image && b.image){
        return -1;
      }
      
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  };
  
  
  

  /**
  * isOverlapping
  * Takes two objects and sees if the prospect overlaps with
  * an existing object [part of loop in checkAgainstPlaced()]
  *
  * @param {object} b1 Timeline-event object IN PLACE
  * @param {object} b2 Timeline-event object BEING ADDED
  */       
  var isOverlapping = function (b1, b2) {
      
      //!TODO ******* POLARITY IS NOT WORKED INTO THIS YET
      
        if (b2.shape) {
          var io = isOverlapping(b1, b2.shape);
          if (io == true) {
            return true;
          }
        }
    
    var vPadding = -6,
      lPadding = -16;
    
    if ((b2.left + lPadding > b1.right) || (b2.right < b1.left + lPadding) || (b2.bottom < b1.top + vPadding)) {
      // clear to left or right.
      return false;
    
    } else {
    
      if (  
        ((b2.left >= b1.left) && (b2.left <= b1.right)) ||
        ((b2.right >= b1.left) && (b2.right <= b1.right)) ||
        ((b2.right >= b1.right) && (b2.left <= b1.left)) ||
        ((b2.right <= b1.right) && (b2.left >= b1.left))
        ) {
    
          // OK, some kind of left-right overlap is happening, but
          // there also has to be top-bottom overlap for collision
        if (
                // 
                ((b2.bottom <= b1.bottom) && (b2.bottom >= b1.top)) || 
                ((b2.top <= b1.bottom) && (b2.top >= b1.top)) || 
                ((b2.bottom == b1.bottom) && (b2.top == b1.top))
                ) {
            // passes 2nd test -- it's overlapping!
            return true;
    
          } else {
            return false;
        }
        
        // end first big if: fails initial test
      }  
    return false;
    }

      // return false;

    };


  // private function
  var checkAgainstPlaced = function (block, ceil) {
        
    var ol = false, 

      placed = me.placedBlocks,
      placed_len = me.placedBlocks.length,
      
      collision = false;
    
    if ((placed_len == 0) || (Math.abs(block.top) > ceil)) {
          // just place it!
          collision = false;
          
        } else {
    
      // Go through all the placed blocks
      for (var e=0; e < placed_len; e++) {
        
        sh = false;
        ol = isOverlapping(placed[e],block);
        
        if (block.shape) {
          sh = isOverlapping(placed[e],block.shape);
        }
        
        if (ol == true || sh == true) {
          // BUMP UP
          if (me.pol === -1) {
            // DEFAULT, bottom up
            block.top -= lev_ht; 
            block.bottom -= lev_ht;
            if (block.shape) {
              block.shape.top -= lev_ht; 
              block.shape.bottom -= lev_ht;
            }
          } else {
            // "SOUTH" side, top town
            block.top += lev_ht; 
            block.bottom += lev_ht;
            if (block.shape) {
              block.shape.top += lev_ht; 
              block.shape.bottom += lev_ht;
            } 
          }
          
                    
          // *** RECURSIVE ***
          block.attempts++;
          
          
          // ......aaaaaand then check again
          checkAgainstPlaced(block, ceil);
      
          collision = true;
          
          // STOP LOOP -- there's a collision
          break;
        } // end if overlap is true
        
      } // end for
    }

    if (collision == false) {
            
            me.placedBlocks.push(block);                
      
      if (block.shape) {
        me.placedBlocks.push(block.shape);   
      }
    } // end if collision is false
        
  }; // end checkAgainstPlaced()
 
 
}; ///// END TG_Org
      
      
  
})(timeglider); 

/*
 * Timeglider for Javascript / jQuery 
 * http://timeglider.com/jquery
 *
 * Copyright 2011, Mnemograph LLC
 * Licensed under Timeglider Dual License
 * http://timeglider.com/jquery/?p=license
 *
 */

// BACKBONE MODEL

/*
*
* Timeline
* Backbone Model
*
*/

(function(tg){

  
  var TG_Date = tg.TG_Date,
    $ = jQuery,
    widget_options = {},
    tg_units = TG_Date.units,
    MED;


  tg.TG_EventCollection = Backbone.Collection.extend({
      
    eventHash:{},
    
    comparator: function(ev) {
      return ev.get("startdateObj").sec;
    },

    setTimelineHash: function(timeline_id, hash) {
      this.eventHash[timeline_id] = hash;
    },
    
    getTimelineHash: function(timeline_id, hash) {
      return this.eventHash[timeline_id];
    },
    
    model: tg.TG_Event
  });
  
  
  
  tg.adjustAllTitleWidths = function (collection) {
    
    _.each(collection.models, function(ev) {
      var nw = tg.getStringWidth(ev.get("title"));
      ev.set({"titleWidth":nw})
    })
  };
  
  
  // EVENT MODEL
  
  // map model onto larger timeglider namespace
  /////////////////////////////////////////////
  tg.TG_Event = Backbone.Model.extend({
  
    urlRoot : '/event',
  
    defaults: {
      "title":  "Untitled"
    },
    
    initialize: function(ev) {
      // Images start out being given a default width and height
      // of 0, so that we can "find out for ourselves" what the
      // size is.... pretty costly, though...
      // can this be done better with PHP?
      
      if (ev.image) {
        var img = ev.image;
        
        if (typeof img == "string") {
        
          var display_class = ev.image_class || "lane";
          var image_scale = ev.image_scale || 100;
          var image_width = ev.image_width || 0;
          var image_height = ev.image_height || 0;

          ev.image = {id: ev.id, scale:image_scale, src:ev.image, display_class:display_class, width:image_width, height:image_height};
          
          
        } else {
          // id, src etc already set
          ev.image.display_class = ev.image.display_class || "lane";
          ev.image.width = 0;
          ev.image.height = 0;
          ev.image.scale = ev.image.scale || 100;
          
          
        }

        // this will follow up with reporting size in separate "thread"
        this.getEventImageSize(ev.image, ev);
      
        // MED.imagesToSize++;
        
  
      } else {
        ev.image = '';
      }
      
      // further urldecoding?
      // by replacing the &amp; with & we actually
      // preserve HTML entities   
      ev.title = ev.title.replace(/&amp;/g, "&");
      ev.description = ev.description || "";
      ev.titleWidth = tg.getStringWidth(ev.title);
      
      ev.y_position = ev.y_position || 0;

      this.set(ev);
      
    },
  
        
    
    getEventImageSize:function(img, ev) { 
      
      var that = this,
        imgTesting = new Image(),
        img_src = imgTesting.src = img.src;
    
      imgTesting.onerror= delegatr(imgTesting, function () {
        if (tg.app && typeof tg.app.reportMissingImage == "function") {
          tg.app.reportMissingImage(img.src, ev);
        }
        that.set({"image":{src:img.src,status:"missing"}});
      });
      
      imgTesting.onload = delegatr(imgTesting, function () {
        that.get("image").height = this.height;
        that.get("image").width = this.width;
        that.get("image").max_height = this.height;
      });
    
      function delegatr(contextObject, delegateMethod) {
        return function() {
          return delegateMethod.apply(contextObject, arguments);
        }
      };
  
    }, // end getEventImageSize
    
    
    reIndex: function(do_delete) {
    
        var model = this,
          deleting = do_delete || false,
          cache = model.get("cache"),
          event_id = model.get("id"),
          new_start = model.get("startdateObj"),
          new_end = model.get("enddateObj"),
          ev_timelines = model.get("timelines"),
          ev_timeline_cache = cache.timelines,
          cache_start = cache.startdateObj || new_start,
          span = cache.span,
          timeline = {}, 
          hash = {},
          ser = 0, new_ser = 0,   
          arr = [],
          tl_union = _.union(ev_timeline_cache, ev_timelines),
          TG_Date = tg.TG_Date,
          MED = model.get("mediator"),
          TIMELINES = MED.timelineCollection,
          EVENTS = MED.eventCollection;
        
     
        // cycle through all event's past/present timelines
        // OUTER .each
        _.each(tl_union, function(timeline_id){ 
        
          timeline = TIMELINES.get(timeline_id);
          
          hash = EVENTS.getTimelineHash(timeline_id); 
          
          // remove from "all" array (used for bounds)
        hash["all"] = _.reject(hash["all"], function(eid){ 
          // truthy is rejected!!
          return eid == event_id;
        });
      
          
          // UNITS: "da", "mo", "ye", "de", "ce", "thou", "tenthou", 
          //        "hundredthou", "mill", "tenmill", "hundredmill", "bill"
          // INNER .each
          _.each(TG_Date.units, function(unit) {
          
          ser = TG_Date.getTimeUnitSerial(cache_start, unit);
          
          // REMOVE CACHED DATE INDICES FROM HASH   
          // ALL TIMELINES ARE CLEARED    
          if (hash[unit][ser] !== undefined) {
            hash[unit][ser] = _.reject(hash[unit][ser], function(eid){ 
              // truthy is rejected!
              return eid == event_id;
            });
          } 
          
          // RE-INDEX IN EVENT'S CURRENT TIMELINES ARRAY!!
          if (deleting != true) {
            if ($.inArray(timeline_id, ev_timelines) != -1) {
              new_ser = TG_Date.getTimeUnitSerial(new_start, unit);
              if (hash[unit][new_ser] !== undefined) {
                hash[unit][new_ser].push(event_id);
              } else {
                // create the array
                hash[unit][new_ser] = [event_id];
              }
            }
          } // end if not deleting
                
          }); // end inner _.each
          
          
          if (deleting != true) {
            if ($.inArray(timeline_id, ev_timelines) != -1) {
              hash["all"].push(event_id);
            }
          }
          
          
          // REFRESH BOUNDS: CYCLE THROUGH HASH'S "all" INDEX
          // INCLUDE ALL IN UNIONED TIMELINES
          var bounds = timeline.get("bounds");
          
          var spill = [];
          
          _.each(hash["all"], function (id) {
            var ev = EVENTS.get(id);
            spill.push(ev.get("startdateObj").sec);
            spill.push(ev.get("enddateObj").sec);
          });
          
          // does it have any events
          
        // totally new set of bounds!
          timeline.set({bounds:{first:_.min(spill), last:_.max(spill)}});
    
          var timeline_spans = timeline.get("spans");
        
        // WIPE OUT OLD SPAN REF NO MATTER WHAT
          if (cache.span) {
            delete timeline_spans["s_" + event_id];
          } 
          
          // RE/LIST SPAN
          if (deleting != true) {
            if (model.get("span") == true) {
              timeline_spans["s_" + event_id] = {id:event_id, start:new_start.sec, end:new_end.sec};
            }
              
          } 
          
          // make sure timeline "has_events" is accurate
          timeline.set({has_events:hash["all"].length});
        
        }); // end outer/first _.each, cycling across timelines cached/new
        
      
    } 

  
  });


  tg.TG_TimelineCollection = Backbone.Collection.extend({
    initialize:function() {
      // debug.log("hello collection");
    },
    model: tg.TG_Timeline
  });
  
  
  // TIMEGLIDER TIMELINE MODEL
  
  // map model onto larger timeglider namespace
  /////////////////////////////////////////////
  tg.TG_Timeline = Backbone.Model.extend({
  
    initialize: function() {
      
    },
    
    urlRoot : '/timeline',
    
    defaults: {
      // no other defaults?
      "initial_zoom":25,
      "timezone":"00:00",
      "title":  "Untitled",
      "events": [],
      "legend": []
    },
    
    // processes init model data, adds certain calculated values
    _chewTimeline : function (tdata) {
    
      // TODO ==> add additional units
      MED = tdata.mediator;
      
      tdata.timeline_id = tdata.id;
            
      widget_options = MED.options;
      
      var dhash = {
        "all":[],
        "da":[], 
        "mo":[], 
        "ye":[], 
        "de":[], 
        "ce":[], 
        "thou":[],
        "tenthou":[],
        "hundredthou":[],
        "mill":[],
        "tenmill":[],
        "hundredmill":[],
        "bill":[]
      };
      
      tdata.spans = {};
      tdata.hasImageLane = false;
      tdata.startSeconds = [];
      tdata.endSeconds = [];
      tdata.initial_zoom = parseInt(tdata.initial_zoom, 10) || 25;
      
      tdata.inverted = tdata.inverted || false;
      
      // render possible adjective/numeral strings to numeral
      tdata.size_importance = (tdata.size_importance == "false" || tdata.size_importance == "0")? 0 : 1;
      tdata.is_public = (tdata.is_public == "false" || tdata.is_public == "0")? 0 : 1;
      
      // widget options timezone default is "00:00";
      var tzoff = tdata.timezone || "00:00";
      
      tdata.timeOffset = TG_Date.getTimeOffset(tzoff);
            
      // TODO: VALIDATE COLOR, centralize default color(options?)
      if (!tdata.color) { tdata.color = "#333333"; }      
      
      if (tdata.events.length>0) {
        
        

        var date, ddisp, ev, id, unit, ser, tWidth;
        var l = tdata.events.length;
  
        for(var ei=0; ei< l; ei++) {
        
          ev=tdata.events[ei];
          
          // make sure it has an id!
          if (ev.id) { 
            id = ev.id 
          } else { 
            // if lacking an id, we'll make one...
            ev.id = id = "anon" + this.anonEventId++; 
          }
          
          ev.importance = parseInt(ev.importance, 10) + widget_options.boost;
          
          ev.low_threshold = ev.low_threshold || 1;
          ev.high_threshold = ev.high_threshold || 100;
          
          /*
            We do some pre-processing ** INCLUDING HASHING THE EVENT *
            BEFORE putting the event into it's Model&Collection because some 
            (processed) event attributes are needed at the timeline level
          */
      
          if (ev.map) {
            if (MED.main_map) {
              
              if (timeglider.mapping.ready){
                ev.map.marker_instance = timeglider.mapping.addAddMarkerToMap(ev, MED.main_map);
                // debug.log("marker_instance", ev.map.marker_instance);
              }
              // requires TG_Mapping.js component
              
            } else {
              // debug.log("NO MAIN MAP... BUT LOAD MAPS FOR MODAL");
              // load instance of maps for modal viewing
              // requires: TG_Mapping.js
              tg.googleMapsLoad();
            }
          }
          
          
          ev.callbacks = ev.callbacks || {};
          
          
          if (typeof ev.date_display == "object") {
            ddisp = "da";
          } else {
            // date_limit is allowed old JSON prop name,
            // replaced by date_display
            ddisp = ev.date_display || ev.date_limit || "da";
          }

          ev.date_display = ddisp.toLowerCase().substr(0,2);

          if (ev.link) {
            if (typeof ev.link == "string" && ev.link.substr(0,4) == "http") {
              // make an array
              ev.link = [{"url":ev.link, "label":"link"}]
            }
          } else {
            ev.link = "";
          }

          ev.date_display = ddisp.toLowerCase().substr(0,2);

                
          // if a timezone offset is set on the timeline, adjust
          // any events that do not have the timezone set on them
          if (tdata.timeOffset.seconds) {
            ev.startdate = TG_Date.tzOffsetStr(ev.startdate, tdata.timeOffset.string);
            
            if (ev.enddate) {
            ev.enddate = TG_Date.tzOffsetStr(ev.enddate, tdata.timeOffset.string);
            }
          }

          ev.startdateObj = new TG_Date(ev.startdate, ev.date_display);
          
          // !TODO: only if they're valid!
          if ((ev.enddate) && (ev.enddate !== ev.startdate)){
            ev.enddateObj = new TG_Date(ev.enddate, ev.date_display);
            ev.span=true;
            // index it rather than push to stack
            
            tdata.spans["s_" + ev.id] = {id:ev.id, start:ev.startdateObj.sec, end:ev.enddateObj.sec};
            
          } else {
            ev.enddateObj = ev.startdateObj;
            ev.span = false;
          }
          
          
          // haven't parsed the image/image_class business...
          if (ev.image) {
            //debug.log("has image!");
            if (ev.image.display_class != "inline") { 
              tdata.hasImageLane = true; 
            }
          }
                    
          tdata.startSeconds.push(ev.startdateObj.sec);
          tdata.endSeconds.push(ev.enddateObj.sec);

          // cache the initial date for updating hash later
          // important for edit/delete operations
          ev.cache = {timelines:[tdata.timeline_id], span:ev.span, startdateObj:_.clone(ev.startdateObj), enddateObj:_.clone(ev.enddateObj)}
                    
          if (!ev.icon || ev.icon === "none") {
            ev.icon = "";
          }  else {
            ev.icon = ev.icon;
          }
          
          
          if ((!isNaN(ev.startdateObj.sec))&&(!isNaN(ev.enddateObj.sec))){
                  
            dhash["all"].push(id);
            
            var uxl = tg_units.length;
            for (var ux = 0; ux < uxl; ux++) {
              unit = tg_units[ux];
              ///// DATE HASHING in action 
              ser = TG_Date.getTimeUnitSerial(ev.startdateObj, unit);
              if (dhash[unit][ser] !== undefined) {
                var shash = dhash[unit][ser];
                if (_.indexOf(shash, id) === -1) {
                  dhash[unit][ser].push(id);
                }
              } else {
                // create the array
                dhash[unit][ser] = [id];
              }
              /////////////////////////////
            } 
            
            ev.mediator = MED;
      
            /////////////////////////////////
            
            if (!MED.eventCollection.get(id)) {
            
              ev.timelines = [tdata.timeline_id];
            
              var new_model = new tg.TG_Event(ev);
              // model is defined in the eventCollection
              // we just need to add the raw object here and it
              // is "vivified", properties set, etc
              MED.eventCollection.add(new_model);
            
            } else {
              
              // trusting here that this is a true duplicate!
              // just needs to be associated with the timeline
              var existing_model = MED.eventCollection.get(id);
              existing_model.get("timelines").push(tdata.timeline_id);
  
            }
            
            
          
          } // end if !NaN
          
          
      
        } // end for: cycling through timeline's events
              
        // cycle through timeline, collecting start, end arrays
        // sort start, select first
        // sor last select last
        // set bounds
                
        var merged = $.merge(tdata.startSeconds,tdata.endSeconds);
        var sorted = _.sortBy(merged, function(g){ return parseInt(g); });

        /// bounds of timeline
        tdata.bounds = {"first": _.first(sorted), "last":_.last(sorted) };
        
        var date_from_sec = TG_Date.getDateFromSec(tdata.bounds.first);
        tdata.focus_date = tdata.focus_date || date_from_sec;
        tdata.focusDateObj = new TG_Date(tdata.focus_date);
        tdata.has_events = 1;
        
      } else {
      
        
        tdata.focus_date = tdata.focus_date || "today";       
        tdata.focusDateObj = new TG_Date(tdata.focus_date);
        tdata.bounds = {"first": tdata.focusDateObj.sec, "last":tdata.focusDateObj.sec + 86400};
        tdata.has_events = 0;
        
      }
      
      
      
      
      
      /* !TODO: necessary to parse this now, or just leave as is? */
      if (tdata.legend.length > 0) {
        //var legend = tdata.legend;
        //for (var i=0; i<legend.length; i++) {
        //  var legend_item = legend[i];
          // debug.log("leg. title:" + legend_item['title'])
        //}
        tdata.hasLegend = true;
      } else {
        tdata.hasLegend = false;
      }
      
      
      /// i.e. expanded or compressed...
      /// ought to be attribute at the timeline level
      /// TODO: create a $.merge for defaults for a timeline
      tdata.display = "expanded";
      
      
      MED.eventCollection.setTimelineHash(tdata.timeline_id, dhash);
      
      // keeping events in eventCollection
      // hashing references to evnet IDs inside the date hash
      delete tdata.events;

      return tdata;
    
    },
    
    initialize: function(attrs) { 
      var processed = this._chewTimeline(attrs);
      
      this.set(processed);
      
      this.bind("change", function() {
          // debug.log("changola");
      });
    }
  
  });
  

})(timeglider);

// TIMELINE VIEW

/*
 * Timeglider for Javascript / jQuery 
 * http://timeglider.com/jquery
 *
 * Copyright 2011, Mnemograph LLC
 * Licensed under Timeglider Dual License
 * http://timeglider.com/jquery/?p=license
 *
 */
 
 /* 
 !TODO:
 add 
 change "click" bindings to CLICKORTOUCH
 relying solely on jquery.support ....


/*
****************************************
timeglider.TimelineView
****************************************
*/
(function(tg){

  // MED below is a reference to the mediator reference
  // that will be passed into the main Constructor below
  var TG_Date = tg.TG_Date, 
    PL = "", 
    MED = "", 
    options = {},
    ticksSpeed = 0,
    t1Left = 0,
    t2Left = 0,
    ticksSpeedIv,
    container_name = '',
    $ = jQuery, 
    intervals ={}, 
    WIDGET_ID = "", 
    CONTAINER, TICKS, DATE, FOCUS_DATE,
    CLICKORTOUCH = $.support.touch ? "touchstart": "click";
      
  var stripPx = function (somethingPx) {
    if (typeof somethingPx == "number") return somethingPx;
    if (!somethingPx) return false;
    return parseInt(somethingPx.replace("px", ""), 10);
  }

// TIMELINE PLAYER

/*
*  timeglider.TG_TimelineView
*  This is _not_ a backbone view, though
*  other elements inside of it are.
*  
*
*/
tg.TG_TimelinePlayer = function (widget, mediator) {
    
  var me = this;
  
  // this.MED = mediator;
  
  // vars declared in closure above
  MED = mediator;
  
  options = mediator.options;
      // core identifier to "uniquify" the container
  PL = "#" + widget._id;
  
  WIDGET_ID = widget._id;
    container_name = options.base_namespace + "#" + WIDGET_ID;

  this.gens = 0;
  this.max_modals = 1; // added by NDG to limit number of open event modal windows
  
  this.titleBar = true;
  this.singleTitleHeight = 0;
  
  MED.setImageLaneHeight(options.image_lane_height, false, true);
  
  
  /*  references specific to the instance (rather than timeglider) so
    one can have more than one instance of the widget on a page */        
  this._views = {
        PLACE:PL,
        CONTAINER : PL + " .timeglider-container",
        SCRIM : PL + " .tg-scrim", 
        DATE : PL + " .tg-footer-center",
        FOCUS_DATE : PL + " .tg-date-display",
        TIMELINE_MENU : PL + " .timeglider-timeline-menu",
        TIMELINE_MENU_UL : PL + " .timeglider-timeline-menu ul", 
        TIMELINE_LIST_BT : PL + " .timeglider-list-bt", 
        SLIDER_CONTAINER : PL + " .timeglider-slider-container", 
        SLIDER : PL + " .timeglider-slider", 
        ZOOM_DISPLAY : PL + " .timeglider-zoomlevel-display",
        TRUCK : PL + " .timeglider-truck", 
        CENTERLINE : PL + " .timeglider-centerline", 
        TICKS : PL + " .timeglider-ticks", 
        HANDLE : PL + " .timeglider-handle",
        FOOTER : PL + " .timeglider-footer",
        FILTER_BT : PL + " .timeglider-filter-bt",
        FILTER_BOX : PL + " .timeglider-filter-box",
        SETTINGS_BT : PL + " .timeglider-settings-bt"
      }
    
  // shorthand for common elements
  CONTAINER = this._views.CONTAINER;
  TICKS = this._views.TICKS;

  this.dragSpeed = 0;
  this.tickNum = 0;
  this.leftside = 0;
  this.rightside = 0;
  this.ticksHandleOffset = 0; 
  this.timeoout_id = 1;
  this.sliderActive = false;
  this.ztop = 1000;
  this.filterBoxActivated = false;

  
  // this needs to be less than or equal to
  // timeglider.css value for .timeglider-tick 
  // height property
  this.tick_height = 32;
  
  
  // a state var for the left-right position of the timeline
  // to help track whether the timeline is too far left/right
  this.dragScopeState = {state:"okay",pos:0};


  /*  TEMPLATES FOR THINGS LIKE MODAL WINDOWS
  *   events themselves are non-templated and rendered in TG_Org.js
  *   as there are too many on-the-fly style attributes etc, and 
  *   the current theory is that templating would create lag
  *
  *
  */
  // in case custom event_modal fails, we need this object to exist
  this._templates = {}
  
  this._templates = {
      // allows for customized templates imported
    test : "testola",
    
    event_modal_small: "<div class='tg-modal timeglider-ev-modal ui-widget-content' id='${id}_modal'>" 
           + "<div class='tg-close-button tg-close-button-remove'>x</div>" 
           + "<div class='dateline'>{{html dateline}}</div>"
           + "<h4 id='title'>${title}</h4>"
           + "<div class='tg-ev-modal-description'><p>{{html image}}{{html description}}</p></div>"
           + "<ul class='timeglider-ev-modal-links'>{{html links}}</ul>"
           + "</div>",
          
        // For displaying an exterior page directly in the modal
        event_modal_iframe: "<div class='tg-modal timeglider-ev-modal ui-widget-content tg-iframe-modal' id='${id}_modal'>" 
           + "<div class='tg-close-button tg-close-button-remove'>x</div>" 
           + "<div class='dateline'>{{html dateline}}</div>"
           + "<h4 id='title'>{{html title}}</h4>"
           + "<iframe frameborder='none' src='${link}'></iframe>"
           + "</div>",
  
    // generated, appended on the fly, then removed
    event_modal_full : $.template( null,
    ////////
    "<div class='tg-modal tg-full_modal' id='ev_${id}_modal'>"
    + "<div class='tg-full_modal_scrim'></div>"
    + "<div class='tg-full_modal_panel'>"
    + "<div class='tg-full_modal_content'>"
    + "<div class='tg-close-button tg-full_modal_close'>x</div>"
    + "<div class='dateline'>{{html dateline}}</div>"
    + "<h4>${title}</h4>"
    + "<div class='tg-full_modal-body'>"
    + "{{html image}}{{html description}}"
    // + "<div id='insert'></div>"
    + "</div>"
    + "<div class='tg-full_modal-links'><ul>{{html links}}</ul></div>"
    // end of modal
    + "</div>"),
      

      // generated, appended on the fly, then removed
      filter_modal : $.template( null,
          "<div class='tg-modal timeglider-menu-modal timeglider-filter-box'>"+
          "<div class='tg-close-button'></div>"+
          "<h3>filter</h3>"+
          "<div class='timeglider-menu-modal-content'>"+
          "<div class='timeglider-formline'>show: "+
          "<input type='text' class='timeglider-filter-include'></div>"+
          "<div class='timeglider-formline'>hide: "+
          "<input type='text' class='timeglider-filter-exclude'></div>"+
          "<ul><li class='timeglider-filter-clear'>clear</li>"+
          "<li class='timeglider-filter-apply'>apply</li></ul></div>"+
           "<div class='timeglider-menu-modal-point-right'>"+
           "</div>"),
          
        timeline_list_modal : $.template( null,
          "<div class='timeglider-menu-modal timeglider-timeline-menu'>"+
          "<div class='tg-close-button'></div>"+
          "<h3>timelines</h3>"+
          "<div class='timeglider-menu-modal-content'><ul></ul></div>"+
          "<div class='timeglider-menu-modal-point-right'>"+
          "</div>"),
          
        settings_modal : $.template( null,
          "<div class='timeglider-menu-modal timeglider-settings-modal'>"+
          "<div class='tg-close-button'></div>"+
          "<h3>settings</h3>"+
          "<div class='timeglider-menu-modal-content'><div class='timeglider-settings-timezone'></div></div>"+
          "<div class='timeglider-menu-modal-point-right'>"+
          "</div>"),
        
        legend_modal : $.template( null,
          "<div class='timeglider-menu-modal tg-legend tg-display-none'  id='${id}_legend'>"+
          "<div class='tg-close-button-small tg-legend-close'></div>"+
          "<div class='timeglider-menu-modal-content'><ul id='${id}'>{{html legend_list}}</ul>"+
          
          "<div class='tg-legend-all'>all</div>"+
          "</div>"+
          "</div>")

    };
    
  this.timelineInfoModal = Backbone.View.extend({

    tagName: "div",
    
    model:tg.TG_Timeline,
    
    className: 'tg-modal tg-timeline-modal ui-widget-content',
    
    events: {
      "click .tg-close": "remove",
      "click .tg-timeline-start": "timelineStart"
    },
    
    template: function () {
      return "<h4>${title}</h4>"
      + "<div class='tg-timeline-description jscroll'>{{html description}}</div>"
      + "<ul><li class='tg-close'>close</li><li data-timeline_id='" + this.model.get("id") + "' class='tg-timeline-start'>start</li></ul>";
      
      },
    
    timelineStart: function() {
      MED.focusTimeline(this.model.get("id"));
      this.remove();
    },
    
    initialize: function() {
      // this.model.bind('change', this.render, this);
    },
    
    render: function() {
      $(this.el).html($.tmpl(this.template(), this.model.attributes)).attr("id", this.model.get("id") + "_timelineInfoModal");
      return this;
    },
    
    remove: function() {
      $(this.el).fadeOut();
    }
  });

  this.presInfoModal = Backbone.View.extend({
    
    tagName: "div",
    
    model:tg.TG_Timeline,
    
    className: 'tg-modal tg-timeline-modal tg-pres-modal ui-widget-content',
    
    events: {
      "click .tg-close": "remove",
      "click .tg-pres-start": "presStart"
    },
    
    template: function () {

      return "<div class='tg-timeline-description jscroll'>{{html description}}</div>"
      + "<ul><li class='tg-close'>close</li><li class='tg-pres-start'>start</li></ul>"
      + "<div class='tg-modal-corner tg-modal-corner-north'></div>";
      
      },
    
    presStart: function() {
      var pres = MED.presentation;
      MED.gotoDateZoom(pres.focus_date.dateStr, pres.initial_zoom);
    },

    render: function() {
      $(this.el).html($.tmpl(this.template(), this.model)).attr("id", "presInfoModal");
      return this;
    },
    
    remove: function() {
      $(this.el).fadeOut();
    }
  });
  



  
// SOME CLICK EVENTS

  $(CONTAINER)
    .delegate(".timeline-info-bt", CLICKORTOUCH, function () {
      var id = MED.sole_timeline_id; //$(this).data("timeline_id"); // ndg, 2013-02-20, Changed to prevent using the default empty value
      me.timelineModal(id);
    })  
    .delegate(".tg-expcol-bt", CLICKORTOUCH, function () {
      var id = $(this).data("timeline_id");
      me.expandCollapseTimeline(id);
    })
    .delegate(".tg-invert-bt", CLICKORTOUCH, function () {
      var id = $(this).data("timeline_id");
      me.invertTimeline(id);
    })
    .delegate(".tg-legend-bt", CLICKORTOUCH, function () {
      var id = $(this).data("timeline_id");
      me.legendModal(id);
    })
    .delegate(".tg-close-button-remove", CLICKORTOUCH, function () {
      $(this).parent().remove()
    })
    .delegate(".tg-full_modal_scrim, .tg-full_modal_close", CLICKORTOUCH, function () {
      $(".tg-full_modal").remove();
    })
    .delegate(".tg-event-overflow", CLICKORTOUCH, function () {
      MED.zoom(-1);
    })
    .delegate(".tg-event-overflow", "hover", function () {
      
      var evid = $(this).data("event_id");
      
      //!TODO
      // take id and focus to it, then zoom in until it's
      // visible: then highlight and fade out highlight
    })
    .delegate(".tg-legend-close", CLICKORTOUCH, function () {
      var $legend = $(CONTAINER + " .tg-legend");
      $legend.fadeOut(300, function () { $legend.remove(); });
    })
    .delegate(".tg-legend-all", CLICKORTOUCH, function () {
      $(CONTAINER + " .tg-legend li").each(function () {
        $(this).removeClass("tg-legend-icon-selected");
      });
    
      MED.setFilters({origin:"legend", icon: "all"});
    })
    .delegate(".tg-timeline-start", CLICKORTOUCH, function() {
      var tid = $(this).data("timeline_id");
      MED.focusTimeline(tid);
    })
    .delegate(".tg-prev", CLICKORTOUCH, function() {
      MED.gotoPreviousEvent();
    })
    .delegate(".tg-next", CLICKORTOUCH, function() {
      MED.gotoNextEvent();
    })
    .delegate(".tg-pres-start", CLICKORTOUCH, function() {
      me.startPresentation();
    })
    .delegate(".pres-info-bt", CLICKORTOUCH, function () {
      me.presentationModal();
    })  
    .delegate(".tg-pres-header h2", CLICKORTOUCH, function () {
      me.startPresentation();
      me.presentationModal();
    })  
    
    
    .css("height", $(PL).height());
    
  
  
  
  $(".tg-zoom-in").bind(CLICKORTOUCH, function() {
    MED.zoom(-1);
  });
  
  
  $(".tg-zoom-out").bind(CLICKORTOUCH, function() {
    MED.zoom(1);
  });
  
  $(".tg-title-prev-events").live("click", function() {
    MED.gotoPreviousEvent(true);
  });
    
  $(".tg-title-next-events").live("click", function() {
    MED.gotoNextEvent(true);
  });
    
    
  $(window).resize(_.throttle(function() {
    MED.resize();
  }, 700));
  
  
    
  // END CONTAINER CHAIN
  
  
  MED.base_font_size = options.base_font_size;
  
  if (options.show_footer == false) {
    $(this._views.FOOTER).css("display", "none");
  }
  
  this.dimensions = MED.dimensions = this.getWidgetDimensions();
  
  
  // distance from bottom of container (not vertically from ticks)
  // for timelines to be by default; but if a timeline has a "top" value,
  // it's position will be set according to that
  this.initTimelineVOffset = this.dimensions.container.height - (this.dimensions.footer.height + this.dimensions.tick.height + 18);
  
  
  // INITIAL CONSTRUCTION
  this.buildSlider();
  this.setupFilter();
  
  this.setPanButton($(".timeglider-pan-right"),-30);
  this.setPanButton($(".timeglider-pan-left"),30);
  
  $(this._views.TRUCK)
  
    // doubleclicking will be used by authoring mode
    .bind('dblclick', function(e) {
      MED.registerUIEvent({name:"dblclick", event:e});    
    })
    
    
    .bind('mousewheel', function(event, delta) {
      
      var vec = (delta < 0) ? Math.floor(delta): Math.ceil(delta);
      var dir = -1 * vec;
      
      MED.mouseWheelChange(dir);
            
      return false;    
    }); // end TRUCK EVENTS
  
  
  function registerTicksSpeed () {
    //!TODO: for gliding
  }
  
  $(TICKS)
    .draggable({ axis: 'x',
    
    start: function(event, ui) {
      me.eventUnHover();
    },
    
    cancel:".tg-modal",
    
    drag: function(event, ui) {
      t1Left = Math.floor($(this).position().left);
      
      MED.setTicksOffset(t1Left);
      
      ticksSpeed = t1Left - t2Left;
      t2Left = t1Left;
      
      
      // to keep dragging limited to
      // timeline scope, set "constrain_to_data"
      // to true in main widget options
      var dsState = me.dragScopeState;
      
      
      
      if (options.constrain_to_data && MED.activeTimelines.length == 1) {
        
        var $tb = $(".titleBar");     
        var tbPos = $tb.data("lef");
        var ctr = me.dimensions.container.centerx;
        
        var evts = MED.timelineCollection.get(MED.activeTimelines[0]).get("events").length;
        
        // at least 2 events to constrain the timeline
        if (evts > 1) {
        
          if (dsState.state == "over-left") {
            // set timeline left side to center of frame
            var newPos = (-1 * tbPos) + (ctr-1);
            $(TICKS).css("left", newPos);
            me.dragScopeState = {state:"okay"};
            me.registerDragging();
            return false;
            
          } else if (dsState.state == "over-right") {
            // set timeline right side to center of frame
            var newPos = ((-1 * tbPos) + (ctr-1)) - ($tb.width() - 4);
            $(TICKS).css("left", newPos);
            me.dragScopeState = {state:"okay"};
            me.registerDragging();
            return false;
          }
        
        }
      }
      
      return true;
      
    },
  
    stop: function(event, ui) {
      
      me.resetTicksHandle();
      me.registerDragging();
      me.registerTitles();
      me.registerPrevNext();
    }
    
  }) // end draggable
  .delegate(CONTAINER + " .timeglider-timeline-event", CLICKORTOUCH, function () {  // EVENT CLICK
    // Code added by ndg8f for Shanti (2013-01)
    // If open modals is greater than the maxnumber set, close the first one before opening a new one
    var openModals = $('.timeglider-ev-modal');
    if(openModals.length >= me.max_modals) {
      $(openModals[0]).find('.tg-close-button').click();
    }
    var $ev = $(this);
    
    me.eventUnHover($ev);
    
    var eid = $ev.attr("id"); 
    var ev = MED.eventCollection.get(eid).attributes;
        
    if (timeglider.mode == "authoring") {
      // authoring will have its own handler
    
    
    // "presentation" mode or 
    // "basic" mode
    } else {
      // custom callback for an event
      if (ev.click_callback) {
            
            try {
              var ccarr = ev.click_callback.split(".");
              var cclen = ccarr.length;
              
              if (cclen == 1) {
                // fn
                window[ccarr[0]](ev);
              } else if (cclen == 2) {
                // ns.fn
                window[ccarr[0]][ccarr[1]](ev);
              } else if (cclen == 3) {
  
                window[ccarr[0]][ccarr[1]][ccarr[2]](ev);
                
              }
            
            } catch (e) {
              debug.log(ev.click_callback + " method cannot be found", e);
            }
      
      // no custom callback ��just regular old modal
      } else {
            me.eventModal(eid, $ev);
      }
      
    } // end if/else for authoring
    
  })  
  
  .delegate(".timeglider-timeline-event", "mouseover", function () { 
    
    me.eventUnHover();
    var ev = MED.eventCollection.get($(this).attr("id")).attributes;
    me.eventHover($(this), ev);
  })
  .delegate(".timeglider-timeline-event", "mouseout", function () { 

    var ev = MED.eventCollection.get($(this).attr("id")).attributes;
    me.eventUnHover($(this));
  })
  
  .delegate(".tg-event-collapsed", "hover", function () { 

    // var title = MED.eventCollection.get($(this).attr("id")).attributes.title;
    // debug.trace("collapsed, title:" + title, "note");
     
  });
  // END TICKS CHAIN!!
  
  
  // TODO: make function displayCenterline()
  // TODO: simply append a centerline template rather than .css'ing it!
  me.resizeElements();
  
  
  /* PUB-SUB "LISTENERS" SUBSCRIBERS */
 
  $.subscribe(container_name + ".mediator.ticksOffsetChange", function () {
    
    me.tickHangies();
    me.registerDragging();
    me.registerTitles();
    
  });
  
  $.subscribe(container_name + ".mediator.focusToEvent", function () {
    // mediator takes care of focusing date
    var ev = MED.focusedEvent;
  });
  
  
  $.subscribe(container_name + ".mediator.imageLaneHeightSetUi", function () {
    me.setImageLaneHandle(); 
    
  });
  
  


  $.subscribe(container_name + ".mediator.zoomLevelChange", function () {
    
    me.tickNum = 0;
    me.leftside = 0;
    
    var zl = MED.getZoomLevel();
    
    // if the slider isn't already at the given value change in
    $(me._views.SLIDER).slider("value", me.invSliderVal(zl));
    
    me.displayZoomLevel(zl);
    
    me.castTicks("zoomLevelChange");
    
  });
  
  
  $.subscribe(container_name + ".viewer.rendered", function () {
    // do things necessary after view has been
    // if you want to hide either titles or icons:
    // $(".timeglider-event-icon").hide();
    // $(".timeglider-event-title").hide();
    me.registerPrevNext();
  });

  
  
  /// This happens on a TOTAL REFRESH of 
  /// ticks, as when zooming; panning will load
  /// events of active timelines per tick 
  $.subscribe(container_name + ".mediator.ticksReadySignal", function (b) {
    if (MED.ticksReady === true) {
      me.freshTimelines();
    } 
  });
  
  
  /*
      Renews the timeline at current focus/zoom, but with
      possibly different timeline/legend/etc parameters
      ! The only view method that responds directly to a model refresh()
  */
  $.subscribe(container_name + ".mediator.refreshSignal", function () {
    
      me.tickNum = 0;
      me.leftside = 0;
    
    me.castTicks("refreshSignal");
  });


  // adding to or removing from ticksArray
  // DORMANT: necessary?
  $.subscribe(container_name + ".mediator.ticksArrayChange", function () {
    // empty for now    
  });
  
  
  
  $.subscribe(container_name + ".mediator.scopeChange", function() {
    
    var scope = MED.getScope();
    var tbounds = scope.timelineBounds;
    var focus = scope.focusDateSec;
    
    if (focus > tbounds.last) {
      // past right end of timeline(s): stop leftward drag
      me.dragScopeState = {state:"over-right"};
    } else if (focus < tbounds.first) {
      // over left end of timeline(s): stop rightward drag
      me.dragScopeState = {state:"over-left"};
    } else {
      me.dragScopeState = {state:"okay"};
    }
    
    if (MED.scopeChanges  == 1) {
      // first scope change after initial load
      me.initiateNavigation();
    }
    
    MED.scopeChanges++;
  });
  
  
  
  // listen for focus date change
  // mainly if date is zipped-to rather than dragged
  $.subscribe(container_name + ".mediator.focusDateChange", function () {
    me.displayFocusDate();
  });
  
  
  // CREATE TIMELINES MENU
  $.subscribe(container_name + ".mediator.timelineDataLoaded", function (arg) {
    
    
    if (MED.singleTimelineID) {   
      me.setupSingleTimeline();
      } else {
        // We might need a "presentation" layer here
        me.buildTimelineMenu(MED.timelineCollection);
        
        if (timeglider.mode == "presentation") {
          me.setupPresentation();
        }
      }

    me.buildSettingsMenu();

      $(".timeglider-loading").fadeOut(500);  
            
  });
  

  $.subscribe(container_name + ".mediator.activeTimelinesChange", function () {
    
    $(me._views.TIMELINE_MENU_UL + " li").each(function () {
      
        var id = $(this).data("timeline_id");
          if (_.indexOf(MED.activeTimelines, id) != -1) {
          $(this).addClass("activeTimeline");
        } else { 
          $(this).removeClass("activeTimeline");  
        } 
        }); // end each 
  });
  
  
  $.subscribe(container_name + ".mediator.filterChange", function () {
      // refresh is done inside MED -- no need to refresh here
  });
  /* END PUB-SUB SUBSCRIBERS */

  
  
  $.subscribe(container_name + ".mediator.resize", function () {
    me.resize();
  });
  
  
  
  
  
  /// TESTING /////
  
  //// GESTURES  ////
  /* !!TODO    Still a FAIL in iPad ----     
  PRIVATE/SCOPED IN CLOSURE, THESE ARE UN-TESTABLE
  */
  function gestureChange (e) {
    e.preventDefault ();
    if (MED.gesturing === false) {
      MED.gesturing = true;
      MED.gestureStartZoom = MED.getZoomLevel();
    }
    var target = e.target;
    // constant spatial converter value
    //$("#output").append("<br>start zoom:" + MED.gestureStartZoom);
  
    // This basically works, but it's funky still....
    var g = Math.ceil(MED.gestureStartZoom / (e.scale / 2));
  
    //$("#output").append("<br>new gest zoom:" + g);
  
    MED.setZoomLevel(g);
  }
  
  
  function gestureEnd (e) {
    MED.gesturing = false;
  }
  
  if ($.support.touch) {   
    // alert("widget:" + WIDGET_ID);
    $("#" + WIDGET_ID).addTouch();
  
    var tgcompnt = document.getElementById(WIDGET_ID);
  
    tgcompnt.addEventListener("gesturestart", function (e) {
      e.preventDefault();
      $("#output").append("<br>gesture zoom:" + MED.getZoomLevel());
    }, false);
    
    tgcompnt.addEventListener("gestureend", function (e) {
      e.preventDefault();
      $("#output").append("<br>gesture end:" + MED.getZoomLevel());
    }, false);
    
    
    tgcompnt.addEventListener("gesturechange", function (e) {
      e.preventDefault();
      
      gestureChange(e);
      //var gLeft = e.touches.item(0).pageX;
      //var gRight = e.touches.item(1).pageX;
      // debug.log("scale of e:" + e.scale)
      
      // var gLeft = "l", gRight = "r";
      // $("#output").append("[" + gLeft + ":" + gRight + "]");
            
    }, false);
      
  } // end if ($.support.touch)

}



tg.TG_TimelinePlayer.prototype = {


  resize: function() {
    
    var new_height = $(PL).height();
    $(CONTAINER).height(new_height);
    
    // measure stuff
    this.dimensions = this.getWidgetDimensions();
    MED.setDimensions(this.dimensions);
    
    // use measurements to resize various things
    this.resizeElements();
    
    MED.refresh();
  
  },
  
  
  getWidgetDimensions : function () {
      
      var c = $(CONTAINER),
        w = c.width(),
        wc = Math.floor(w / 2) + 1,
        h = c.height(),
        hc = Math.floor(h/2),
        t_height = this.tick_height,
        lft = c.position().left,
        offset = c.offset(),
        f_height = (options.show_footer == true) ? $(this._views.FOOTER).outerHeight() : 0,
        t_top = h - f_height - t_height,
        // objects to return
        ticks_ht = h-(f_height+t_height);
        
        head_ht = $(".tg-widget-header").outerHeight();
              
        var container = {"width":w, "height":h, "centerx":wc, "centery":hc, "left": lft, "offset": offset},
          ticks = {"height":ticks_ht},
          tick = {"top":t_top, "height":t_height},
          header = {"height":head_ht},
          footer = {"height":f_height};
      
        return {container:container, ticks:ticks, tick:tick, header:header, footer:footer};
      
  },
  
  
  
  initiateNavigation: function() {
    var me = this;
    
    $(".tg-single-timeline-header .tg-timeline-start").fadeIn();
    $(".tg-single-timeline-header h2").live("click", function() {
      me.timelineModal(MED.singleTimelineID);
      MED.focusTimeline(MED.singleTimelineID);
      
    });
  },

  
  displayZoomLevel : function() {
    
    var me=this, 
      zl = MED.getZoomLevel();
    
    if (zl > 0) {
      if (options.display_zoom_level == true) {
        $(me._views.ZOOM_DISPLAY).text(zl);
      }
      }
  },
  
  
  displayFocusDate: _.throttle(function () {
    // this is expensive for real-time dragging...
    // without throttle, leads to crashing in Firefox
    var fd = MED.getFocusDate();
    
    //var sc = MED.getScope();
    //$(this._views.LEFT_DATE).text(sc.left_sec);
    //$(this._views.RIGHT_DATE).text(sc.right_sec);
    
    $(this._views.FOCUS_DATE).find("span").text(fd.format("d MMM yyyy", false));
    
    
  
  }, 300),
  
  
    
  
  /**
  * setPanButton
  * @param $sel {jquery dom selector} the button to be assigned
  * @parm vel {Number} positive for moving to the right, negative for moving left
  *
  *
  */
  setPanButton : function ($sel, vel) {
       var me = this,
           _int = 33; // 33/1000 second interval
       $($sel).live("mousedown", function () {
          me.intervalMachine("pan", {type:"set", fn: me.pan, args:[vel], intvl:_int});  })
        .live("mouseup", function () {
          me.intervalMachine("pan", {type:"clear", fn: me.pan, callback: "resetTicksHandle"});  })
        .live("mouseout", function () {
          me.intervalMachine("pan", {type:"clear", fn: me.pan, callback: "resetTicksHandle"});  });
    },
  
  
  
  /* 
  * intervalMachine
  * param name {String} JS interval ref. name
  * @param info {Object} 
  *     type: clear | set
  *     fn: function to call on interval
  *     callback: function to invoke upon clearing
  *     eg: {type:"clear", fn: me.pan, callback: "resetTicksHandle"}
  *
  *
  *  PLUGIN CANDIDATE!
  
  */
  intervalMachine : function (name, info) {
    var me=this;
    if (info.type === "clear") {
      clearInterval(intervals[name]);
      
      if (info.callback) {
        me[info.callback]();
      }
      
    } else {
      // run it 
      intervals[name] = setInterval(function () {
            info.fn.apply(me, info.args);
          }, info.intvl);
    }
  },


  invSliderVal : function(v) {
    return Math.abs(v - 101);
  },
  
  
  
  /*
  * pan
  * @param dir {Number}
  * simply moves the ticks one way or another
  * To work properly, it needs a resetTicksHandle() callback;
  * Using this with intervalMachine()
  */
  pan : function (dir) {

    var d = dir || 20,
      $t = $(TICKS),
      newPos = $t.position().left + d;
        
    $t.css({left:newPos});
    
    MED.setTicksOffset(newPos);
    
  },
  

  registerTitles : function () {
    
    var toff, w, tw, sw, pos, titx, 
      $elem, $env, env, $tb, $ti, relPos, tbWidth,
      mo = $(CONTAINER).offset().left,
      trackTB = true;
      

    $(CONTAINER + " .timeglider-event-spanning").each(
      function() {
          // !TODO  needs optimizing of DOM "touching"
          var $spev = $(this);
        toff = $spev.offset().left - mo;
        $elem = $spev.find(".timeglider-event-title");
        tw = $elem.outerWidth();
        sw = $elem.siblings(".timeglider-event-spanner").outerWidth();
        
        // if the span is wider than the title element
        if (sw > tw) {
          // if the offset is to the left of the frame
          if (toff < 0) {
            var dif = sw-tw;
            if (Math.abs(toff) < dif) {
              $elem.css({marginLeft:(-1 * toff) + 5});
            } else {
              // keep it aligned right if the right side is poking in
              $elem.css({marginLeft:(sw - tw) - 5});
            }
          // otherwise just keep it aligned on the left side of the span
          } else {
            $elem.css({marginLeft:5});
          }
        } 
        // is offscreen == false: $(this).removeClass('timeglider-event-offscreen')
      }
    );

    // IE 7,8 not able to find the .titleBar element below
    // while this .each is happening. Performance in .find()?
    // This hack just turns off the titleBar tracking... :(
    if ($.msie && parseInt($.version) <9) {
     trackTB = false;
    }
    
    // if (trackTB === true) {
    $(CONTAINER + " .tg-timeline-envelope").each(
        function () {
          // !TODO  needs optimizing of DOM "touching"
          $env = $(this);
          env = $env.offset().left - mo;
          $tb = $env.find(".titleBar");
                  
          // `pos` is a pre-cached $tb.position().left;
          // rather than calculating position here, it's
          // grabbing a cached value stored in element data()
          pos = $tb.data("lef");
          
          relPos = -1 * (pos + env);
          
          $ti = $tb.find(".timeline-title");
          // if it's pushed left of the window
          
          
          if ( (relPos > 0) ) {
            var dif = $tb.width()-$ti.width();
            if (relPos < dif) {
              $ti.css({marginLeft:relPos + 5});
            } else {
              $ti.css({marginLeft:dif - 5});
            }
          }  else {
            $ti.css({marginLeft:5});
          }
        
        }
    ); 

  }, // end register titles
  
  
  registerDragging : function () {
      /* 
      startSec --> the seconds-value of the
      initial focus date on landing @ zoom level
    */
    // !TODO: See if we can throttle this to be only
    // once every 100ms....
    var startSec = MED.startSec,
      tickPos = $(TICKS).position().left,
      secPerPx = MED.getZoomInfo().spp;
      
      /*
      debug.log(MED.getFocusDate().ye);
    
      debug.log("RD.startSec:", startSec);
      debug.log("RD.tickPos:", tickPos);
      debug.log("RD.secPerPx", secPerPx);
      */
            
    var newSec = startSec - (tickPos * secPerPx);
      
      //debug.log("RD.newSec:", newSec);
    
    var newD = new TG_Date(newSec);
      
      //debug.log("RD.newD.ye", newD.ye);
      
    MED.setFocusDate(newD);
    
    // remove this???
    this.displayFocusDate();
  },
  
  
  registerPrevNext: function() {
  
    var scope = MED.getScope();
    
    var cw = this.dimensions.container.width,
      btw = 0;
    
    $(CONTAINER + " .tg-title-next-events").each(function () {
      $bt = $(this);
      btw = 28;
      $bt.css("left", (cw - btw) + "px");

    });
  },
  
  
  
  
  /* FILTER BOX SETUP */
  setupFilter : function () {
  
    var me = this, 
      $bt = $(me._views.FILTER_BT),
      $filter = $.tmpl(me._templates.filter_modal,{}).appendTo(me._views.CONTAINER);
    
    $filter.position({
                  my: "right bottom",
                  at: "right top",
                  of: $(me._views.FILTER_BT),
                  offset: "-8, -30"
              }).css("z-index", me.ztop++).hide();
        
        
        $(CONTAINER)
      .delegate(".timeglider-filter-box .tg-close-button", "click", function () {
      $filter.fadeOut();
    })              
              
      
    $(me._views.FILTER_BT).bind("click", function() { 
    
      $filter.fadeIn();

            var $bt = $(this), fbox = me._views.FILTER_BOX;

      // If it's never been opened, apply actions to the buttons, etc
      if (me.filterBoxActivated == false) {

        me.filterBoxActivated =true;
        
        var $filter_apply = $(fbox + " .timeglider-filter-apply"),
        $filter_close = $(".timeglider-filter-box .tg-close-button"),
        $filter_clear = $(fbox + " .timeglider-filter-clear"),
        incl = "", excl = "";
        
        // set up listeners
        $filter_apply.bind("click", function () {
        incl = $(fbox + " .timeglider-filter-include").val();
        excl = $(fbox + " .timeglider-filter-exclude").val();
        MED.setFilters({origin:"clude", include:incl, exclude:excl});
        $(fbox).toggleClass("tg-display-block");
        });
        
        $filter_close.bind("click", function () {
        $(fbox).toggleClass("tg-display-none");
        });
        
        $filter_clear.bind("click", function () {
        MED.setFilters({origin:"clude", include:'', exclude:''});
        $(fbox + " .timeglider-filter-include").val('');
        $(fbox + " .timeglider-filter-exclude").val('');
        $(fbox).toggleClass("tg-display-block");
        });
              
      } // end if filterBoxActivated

        }); // end FILTER_BT click
        
        



  }, // end setupFilter
  

  
    
  buildTimelineMenu : function () {

    var me=this;
    var $menu;
    // var $menu_bt = $(me._views.TIMELINE_LIST_BT);
  
    var $menu_bt = $(me._views.FOOTER).append("<div class='timeglider-footer-button timeglider-list-bt'></div>")
    
    if ($(me._views.TIMELINE_MENU)[0]) {
      $(me._views.TIMELINE_MENU).remove()
    } 
    
    var $menu= $.tmpl(me._templates.timeline_list_modal,{}).appendTo(me._views.CONTAINER);          
    // each timeline's <li> item in menu
    var menuItem = Backbone.View.extend({
    
      initialize: function (){
        this.model.bind('change', this.render, this);
      },
      
      tagName: "li",
      className: "timeglider-timeline-list-item",
      template: "${title}",
      
      events: {
        "click": "toggleTimeline"
      },
      
      toggleTimeline : function() {
        MED.toggleTimeline(this.model.get("id"));
      },
      
      render: function() {
        var tid = this.model.get("id");
        $(this.el).html($.tmpl(this.template, this.model.attributes)).data("timeline_id", tid)
        return this;
      }
  
    });
    
      
    $(me._views.TIMELINE_MENU_UL).html("");
         
      _.each(MED.timelineCollection.models, function(model){
  
        $(me._views.TIMELINE_MENU_UL).append(new menuItem({model:model}).render().el);      
      });
        
    

      $menu.position({
              my: "right bottom",
              at: "right top",
              of: $(me._views.TIMELINE_LIST_BT),
              offset: "-8, -30"
      }).hide();
      
      
      $(CONTAINER)
      .delegate(".timeglider-timeline-menu .tg-close-button", "click", function () {
      $menu.fadeOut();
    })
    .delegate(this._views.TIMELINE_LIST_BT, "click", function() {
        $menu.fadeIn();
      })
      

  },
  
  
  
  getTimezonePulldown: function(id, sel){
    
    var html = "<select name='timezone' id='" + id + "'>",
      seld = false, selstr = "selected";
    
    $.map(TG_Date.timezones, function(tz){ 
    
      if (sel == tz.offset && seld == false) {
        selstr = "selected";
        seld = true;
        
      } else {
        selstr = "";
      }
      
      html += "<option value='" + tz.offset + "' " + selstr + ">" + tz.name + "</option>";
        
    });
    
    html += "</select>";
    return html;
    
  },
  
  
  
  
  buildSettingsMenu: function () {
      
    var me = this;
    
    var $s = $.tmpl(me._templates.settings_modal,{}).appendTo(me._views.CONTAINER);
  
    var tz_menu = this.getTimezonePulldown("timeglider-settings-timezone", MED.timeOffset.string);
    
    $s.find(".timeglider-settings-timezone")
      .append('<p>Make changes below, then click on "save". More settings options to come!</p>')
      .append('<span class="settings-label">timezone:</span> ' + tz_menu)
      .append("<p style='clear:both'>&nbsp;</p><div class='btn success' id='timeglider-settings-save'>save</div>");
      

    $s.position({
              my: "right bottom",
              at: "right top",
              of: $(me._views.SETTINGS_BT),
              offset: "-8, -30"
      }).hide();
      
      $(CONTAINER)
      .delegate(".timeglider-settings-modal .tg-close-button", "click", function () {
      $s.fadeOut();
    })
    .delegate(this._views.SETTINGS_BT, "click", function() {
        $s.fadeIn();
      })
      .delegate("#timeglider-settings-save", "click", function() {
        // get timezone
        var tz_off = $(CONTAINER + " #timeglider-settings-timezone").val();
        MED.setTimeoffset(tz_off);      
      });
      
  },
  
  
  
  setupSingleTimeline: function() {
  
    var me = this,
      tid = MED.singleTimelineID,
      timeline = MED.timelineCollection.get(tid),
      title = "<h2>" + timeline.get("title") + "</h2>";
      
      inf = (timeline.get("description")) ? "<li id='info' class='timeline-info-bt' data-timeline_id='" + tid + "'>info</li>":"",
      
      leg = (timeline.get("hasLegend")) ? "<li id='legend' class='tg-legend-bt' data-timeline_id='" + tid + "'>legend</li>":"",
      
      tools = ""; // "<a id='tools' class='tools-bt noselect'>tools</a>",
      
      tmpl = "<div class='tg-widget-header tg-single-timeline-header'>" + title + "<ul>" + inf + leg + "<li class='tg-timeline-start' data-timeline_id='" + tid + "'>start</li></ul>" + tools + "</div>";
      

    $st = $(tmpl).appendTo(CONTAINER);
    
    me.singleTitleHeight = $st.outerHeight();
    
    
    if (timeline.get("hasImageLane")) {
      
      me.buildImageLane();
      
            
    } // end if has imagelane
    
    // adjusts the zoom slider away from the timeline bar at top
    $(me._views.SLIDER_CONTAINER).css("top", me.singleTitleHeight + 4);
    
      
      me.timelineModal(tid);
      
      
      if (timeline.get("hasLegend")) {
        setTimeout(function() {
          me.legendModal(tid);
        }, 500);
      }
      
    
  },
  
  

    
  //////// MODALS 
  presentationModal : function () {
      
      var me = this;
      
      if (MED.presentation.description) {
      var ch = me.dimensions.container.height,
        modal = new this.presInfoModal({model:MED.presentation});

      var header_ht = 28;
      
      
      $modal = $(modal.render().el)
        .appendTo($(".timeglider-container"))
        .position({
          my: "left top",
          at: "left top",
          of: $(".timeglider-container"),
          offset: "16, 42", // left, top
          collision: "fit fit"
        })
        .css({"z-index":me.ztop++, "max-height":ch-64});
      
      if ($.jScrollPane) {
        $(".jscroll").jScrollPane();
      }
      
    }

    
  },



  startPresentation: function() {
  
    var me = this,
      pres = MED.presentation;
      
    MED.gotoDateZoom(pres.focus_date.dateStr, pres.initial_zoom);
  },
  
  
  setupPresentation: function() {
  
    var me = this,
      pres = MED.presentation;
          
    var title = "<h2 class='no-select'>" + pres.title + "</h2>",

      inf = (pres.description) ? "<li id='info' class='pres-info-bt'>info</li>":"",
      
      leg = (pres.legend) ? "<li id='legend' class='tg-legend-bt'>legend</li>":"",
      
      tools = "", // "<a id='tools' class='tools-bt noselect'>tools</a>",
      
      tmpl = "<div class='tg-widget-header tg-pres-header'>" + title + "<ul>" + inf + leg + "<li class='tg-pres-start'>start</li></ul>" + tools + "</div>",
        
      $st = $(tmpl).appendTo(CONTAINER);
      // end vars
      me.getWidgetDimensions();
      
      
      me.singleTitleHeight = $st.outerHeight();
    
    
      if (pres.image_lane_height) {
        me.buildImageLane();  
      } // end if has imagelane
    
      // adjusts the zoom slider away from the timeline bar at top
      $(me._views.SLIDER_CONTAINER).css("top", me.singleTitleHeight + 4);
    
      me.startPresentation();       
        
      if (pres.open_modal && pres.description) {
        me.presentationModal();
      }
  },
  


  
    buildImageLane: function() {
    
      var me = this,
        $imageLane = $("<div class='tg-image-lane-pull'><div title='This is the image lane!' class='tg-image-lane-bg'></div></div>").appendTo(CONTAINER);
      
      $imageLane.draggable({

        axis:"y",
        containment: "parent",
        drag: function () {
          var $pull = $(this);
          var ypos = $pull.position().top;
          
          if (ypos > 400) {
            $pull.css("top", 400);
            return false;
          } else if (ypos < 5) {
            $pull.css("top", 5);
            return false;
          }
        },
        stop:function() { 
          MED.setImageLaneHeight($(this).position().top - me.singleTitleHeight, true, false);
        }
      });

      me.setImageLaneHandle();

    },
    
    
    
    /*
     * setImageLaneHandle
     * gets image_lane_height from MED and sets image lane
     * UI remotely (not from dragging, but from timeline/pres props)
    */
    setImageLaneHandle: function () {
      
      var me = this;
      var newHt = parseInt(MED.image_lane_height, 10) + parseInt(me.singleTitleHeight, 10);
            
      $(".tg-image-lane-pull").css("top", newHt + "px");
    },
  
  
  
  /* 
    Zoom slider is inverted value-wise from the normal jQuery UI slider
    so we need to feed in and take out inverse values with invSliderVal()            
  */

  buildSlider : function () {
  
    var me = this,
      iz = MED.getZoomLevel();
    
    if (options.min_zoom == options.max_zoom) {
      // With a single zoom level, hide the zoom controller
      $(this._views.SLIDER_CONTAINER).css("display", "none");
          
    } else {
      
      if (options.display_zoom_level == true) {
          var $zl = $("<div>").appendTo(this._views.SLIDER_CONTAINER).addClass("timeglider-zoomlevel-display");
        $zl.html('&nbsp;');
        
        }
      
      var me = this,
        init_zoom = me.invSliderVal(iz),
            hZoom = MED.max_zoom,
        lZoom = MED.min_zoom,
        sHeight = (1 + hZoom - lZoom) * 3;
  
      $(this._views.SLIDER)
        .css({"height":sHeight})
        .slider({ 
          steps: 100,
          handle: $('.knob'),
          animate:300,
          orientation: 'vertical',
          
          // "min" here is really the _highest_ zoom value @ upside down
          min:me.invSliderVal(hZoom),
          
          // "max" actually takes (i  nverse value of) low zoom level
          max:me.invSliderVal(lZoom),
          
          value:init_zoom,
          
          start: function (e, ui) {
          // show zoom level legend
          me.sliderActive = true;
          },
          
          stop: function (e, ui) {
          // hide zoom level legend
          me.sliderActive = false;
          },
          
          change: function(e,ui){
            // i.e. on-release handler
              // possibly load throttled back events
            }, 

          slide: function(e, ui) {
            // sets model zoom level to INVERSE of slider value
            MED.setZoomLevel(me.invSliderVal(ui.value));
          }
        }); // end .slider()
        
        
      
      } // end--if min_zoom == max_zoom 
  },
  

  
  /*
  * usage: timeline event hovering, modal display
  *
  */
  
  getEventDateLine: function(ev) {
    var startDateF = "<span class='timeglider-dateline-startdate'>" + ev.startdateObj.format('', true, MED.timeOffset) + "</span>",
        endDateF = "";
      
      if (ev.span == true) {
         endDateF = " &ndash; <span class='timeglider-dateline-enddate'>" + ev.enddateObj.format('', true, MED.timeOffset) + "</span>";
      }
      
      return startDateF + endDateF;

  },


  
  eventHover : function ($ev, ev) {
    
    if (typeof MED.options.eventHover == "function") {
      
      MED.options.eventHover($ev, ev);
    
    } else {
        
        var me = this, 
            $hov = $(".timeglider-event-hover-info"),
            title = "",
            date_line = "";       

          $ev.append("<div class='tg-event-hoverline'></div>").addClass("tg-event-hovered");
                
        if (ev.date_display == "no") {
          date_line = "";
        } else {
          date_line = me.getEventDateLine(ev);
        }
        
        if ($ev.hasClass("tg-event-collapsed") || $ev.hasClass("tg-event-overflow")) {
          title = "<div>" + ev.title + "</div>";
        } else {
          title = "";
        }
      
      if (title || date_line) {
        $hov.position({
          my: "left top",
              at: "left bottom",
              of: $ev,
              offset: "1, 4",
              collision: "flip flip"}
        )
          .html(title + date_line)
        }
    }
  },

  
  eventUnHover : function ($ev) {
    var $ev = $ev || "";
    
    if (typeof MED.options.eventUnHover == "function") {
      MED.options.eventUnHover($ev);
    } else {
      $(".timeglider-event-hover-info").css("left", "-1000px");
      $(".timeglider-timeline-event").removeClass("tg-event-hovered");
      if ($ev) {
        $ev.find(".tg-event-hoverline").remove();
      }
    }
  },
  
  
    
  clearTicks : function () {
    this.leftside = 0;
    this.tickNum = 0;
    
    $(TICKS)
      .css("left", 0);
      // .html("<div class='timeglider-handle'></div>");
    
    // remove everything but HANDLE, which
    // needs to stay so that gesturing (pinching to zoom)
    // doesn't lose its target
    $(CONTAINER + " .tg-timeline-envelope").remove();
    $(CONTAINER + " .timeglider-tick").remove();
    
    
  },


  /* 
    The initial drawing of a full set of ticks, starting in the 
    middle with a single, date-focused div with type:"init", after which
    a left-right alternating loop fills out the width of the current frame
  */
  castTicks : function (orig) {
          
    this.clearTicks();
    
    var zLevel = MED.getZoomLevel(),
      fDate = MED.getFocusDate(),
      zInfo = MED.getZoomInfo(),
      tickWidth = zInfo.width,
      twTotal = 0,
      ctr = this.dimensions.container.centerx,
      // determine how many are necessary to fill (overfill) container
      nTicks = Math.ceil(this.dimensions.container.width / tickWidth) + 4,
      leftright = 'l';

    if (typeof zInfo.width == "number") {
    
      MED.setTicksReady(false);
      
      // INITIAL TICK added  in center according to focus date provided
      
      this.addTick({"type":"init", "focus_date":fDate});
      
      // ALTERNATING L & R ticks
      for (var i=1; i<=nTicks; i +=1) {
        this.addTick({"type":leftright});
        // switch l and r for alternating layout action
        leftright = (leftright == "l") ? "r" : "l";
      }
      
      MED.setTicksReady(true);
      
      this.displayFocusDate();
    
    }
  },
  
  
  getTickTop: function () {

    var tttype = typeof MED.options.tick_top;
    if (tttype == "number") {
      // default number, zero for ticks at top
      return MED.options.tick_top;
    } else if (tttype == "function") {
      // could be a custom setter function
      return MED.options.tick_top(this.dimensions);
    } else {
      // at the bottom
      return parseInt(this.dimensions.tick.top);
    }

  },
  
  
  
  /*
  * @param info {object} --object--> 
  *                     type: init|l|r 
  *                     focusDate: date object for init type
  */                      
  addTick: function (info) {
    
    var me = this,       mDays = 0,      dist = 0,        pos = 0,       
      tperu = 0,       serial = 0,     shiftLeft = 0,   ctr = 0,  
      tid = "",        tickHtml = "",  sub_label = "",  label = {}, 
      $tickDiv = {},   tInfo = {},     pack = {},       mInfo = {},
      sub_labels = "", sub_labels_arr = [], oeClass = '',
      
      tickUnit = MED.getZoomInfo().unit,
      tickWidth = MED.getZoomInfo().width,
      focusDate = MED.getFocusDate(),
      tick_top = me.getTickTop(), 
      serial = MED.addToTicksArray({type:info.type, unit:tickUnit}, focusDate);
      // end vars comma list

    // adjust tick-width for months (mo)
      if (tickUnit == "mo") {
        // starts with default tickWidth set for 28 days: How many px, days to add?
        mInfo = TG_Date.getMonthAdj(serial, tickWidth);
        tickWidth = mInfo.width;
        mDays = mInfo.days;
      
      } 

    // tickNum has been reset to zero by refresh/zoom
    this.tickNum ++;
    
    if (info.type == "init") {
      
      shiftLeft = this.tickOffsetFromDate(MED.getZoomInfo(), MED.getFocusDate(), tickWidth);
      
      pos = Math.ceil(this.dimensions.container.centerx + shiftLeft);
      $(TICKS).data("init-left", pos);
      // both and left and right sides are defined
      // here because it is the first tick on screen      
      this.leftside = pos;
      this.rightside = (pos + tickWidth);
      
      
    } else if (info.type == "l") {
      pos = Math.floor(this.leftside - tickWidth);
      this.leftside = pos;
    } else if (info.type == "r") {
      pos = Math.floor(this.rightside);
      this.rightside += tickWidth;
    }
    
    // turn this into a function...
    MED.getTickBySerial(serial).width = tickWidth;
    MED.getTickBySerial(serial).left = pos;
    
    oeClass = (serial % 2 == 0) ? "tg-even-tick": "tg-odd-tick";

    tid = this._views.PLACE + "_" + tickUnit + "_" + serial + "-" + this.tickNum;

    $tickDiv= $("<div class='timeglider-tick " + oeClass + "' id='" + tid + "'><div class='tg-tick-body'><div class='tg-tick-leftline'></div><div class='timeglider-tick-label'></div><div class='tg-tick-label-bottom'></div></div>")
      .appendTo(TICKS);
    
    
    $tickDiv.css({width:tickWidth, left:pos, top:tick_top, zIndex:0});
            
    // GET TICK DIVS FOR unit AND width
    tInfo = this.getTickMarksInfo({unit:tickUnit, width:tickWidth});
    // if there's a value for month-days, us it, or use
    // tperu = (mDays > 0) ? mDays : tInfo.tperu;
    tperu = mDays || tInfo.tperu;       
      
    dist = tickWidth / tperu;
    
      // Add tick-lines or times when divisions are spaced wider than 5
    
    if (dist > 8) {
    
      // As of Jan 29, 2012, no more Raphael!
      
      var c, l, xd, stk = '', sl4hd = 0,
        ht = 10, downset = 20, hr_info = {}, ampm = '',
        lpos = 0; 
      
      for (l = 0; l < tperu; l++) {
      
        sub_label = "&nbsp;";
        
        
        if (dist > 16) {
        
          if (tickUnit == "da") {
            // hours starting with 0
            sub_label = me.getHourLabelFromHour(l, dist);
            
          } else  if (tickUnit == "mo") {
            // days starting with 1
            sub_label = l + 1;
          } else if (tickUnit == "ye") {
            if (dist > 30){
              // Jan, Feb, Mar...
              sub_label = "&nbsp;" + TG_Date.monthNamesAbbr[l+1];
            } else {
              // month abbrevs: J, F, M...
              sub_label = "&nbsp;" + TG_Date.monthNamesLet[l+1];
            }
          } else if (tickUnit == "de") {
            if (dist > 54){
              sub_label = (serial *10) + l;
            }
          } else if (tickUnit == "ce") {
            if (dist > 38){
              sub_label = ((serial *10) + l) * 10;
            }
          }
          
          
        } else {
          // less than 16
          sub_label = "";
        }
        
        
        sub_labels_arr.push("<div class='timeglider-tick-sub-label " + tickUnit + "' style='left:" + lpos + "px;width:" + dist + "px'>" + sub_label + "</div>");
        
        
        
                
        lpos += dist;
      }
      
      if (serial < 0) {
        sub_labels_arr.reverse();
      }
      
      sub_labels = sub_labels_arr.join("");
          
    } else {
      sub_labels = "";
    }// end dist > 5  if there's enough space between tickmarks
      
    // add hours gathered in loop above
    if (sub_labels) {
      $tickDiv.append("<div class='tg-tick-sublabel-group' style='width:" + (tickWidth + 10) + "px;'>" + sub_labels + "</div>");
      } 
    
    pack = {"unit":tickUnit, "width":tickWidth, "serial":serial};
      
    label = this.getDateLabelForTick(pack);
    
    // In order to gather whether an outlier span is 
    // occuring on drag-right (the right side of a span)
    // we need some seconds...  
      
    pack.seconds = this.getTickSeconds[tickUnit](pack.serial);
    
    // DO OTHER STUFF TO THE TICK, MAKE THE LABEL AN ACTIONABLE ELEMENT
    // SHOULD APPEND WHOLE LABEL + TICKLINES HERE
    
    $tickDiv.find(".timeglider-tick-label").text(label);
    
    var lb_offset = (MED.options.show_footer) ? 46 : 14;
    var ht = this.dimensions.container.height - lb_offset;
    
    $tickDiv.find(".tg-tick-label-bottom").text(label).css("top", ht);
    
    return pack;
    
    /* end addTick */
  }, 
  
  
  resizeElements: function () {
    var me = this,
    // measurements have just been taken...
      cx = me.dimensions.container.centerx,
      ch = me.dimensions.container.height,
      cw = me.dimensions.container.width,
      fh = me.dimensions.footer.height,
      th = me.dimensions.tick.height,
      $C = $(this._views.CENTERLINE),
      $D = $(this._views.DATE),
      dleft = cx - ($D.width() / 2);
          
    if (MED.options.show_centerline === true) {
      $C.css({"height":ch, "left": cx});
    } else {
      $C.css({"display":"none"});
    }
        
    var ticks_ht = ch-(fh+th);
    $(this._views.TICKS).css("height", ticks_ht);
    if (ch < 500 || cw < 500 ) {
      $(".timeglider-slider").css("display", "none");
    } else {
      $(".timeglider-slider").css("display", "block");
    }
    
    $D.css({"left":dleft});

  },
  
  /* 
   * @param pack {Object} `unit` and `serial`
   */
  getTickSeconds: {
    da: function(ser) {
      var s = ser * 86400,
        e = s + 86400;
      return {start:s, end:e}; 
    },
    mo: function(ser) {
      var s = ser * 2629800,
        e = s + 2629800;
      return {start:s, end:e}; 
    },
    ye: function(ser) {
      var s = ser * 31540000,
        e = s + 31540000;
      return {start:s, end:e}; 
    }, 
    de: function(ser) {
      var s = ser * 315400000,
        e = s + 315400000;
      return {start:s, end:e};
    },
    ce: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    },
    thou: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    },
    tenthou: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    },
    hundredthou: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    },
    mill: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    },
    tenmill: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    },
    hundredmill: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    },
    bill: function(ser) {
      var s = ser * 3154000000,
        e = s + 3154000000;
      return {start:s, end:e};
    }
    
  },
  
  
  getHourLabelFromHour : function (h24, width) {
    
    var ampm = "", htxt = h24, bagels = "", sublabel = "", sl4hd = 0;

    if (width < 16) {
      // no room for anything; will just be ticks
      return '';
    } else {
      
      if (h24 > 12) {
        htxt = h24-12;
      } else if (h24 == 0) {
        htxt = 12;
      }   
            
      if (width > 30) { 
        ampm = (h24 > 11) ? " pm" : " am";
      } 
      
      if (width > 200) {
        sl4hd = width/4 - 4;
        
        return "<div class='minutes' style='width:" + sl4hd + "px'>" + htxt + ":00 " + ampm + "</div>"
        + "<div class='minutes' style='width:" + sl4hd + "px'>" + htxt + ":15 " + ampm + "</div>"
        + "<div class='minutes' style='width:" + sl4hd + "px'>" + htxt + ":30 " + ampm + "</div>"
        + "<div class='minutes' style='width:" + sl4hd + "px'>" + htxt + ":45 " + ampm + "</div>";
        
      } else {
        bagels = (width > 60) ? ":00" : "";
        return htxt + bagels + ampm;
      }
    }

  },

  
  /* provides addTick() info for marks and for adj width for month or year */
  getTickMarksInfo : function (obj) {
    var tperu;
    switch (obj.unit) {
      case "da": 
        tperu = 24; 
        break;
      case "mo": 
        // this is adjusted for different months later
        tperu = 30; 
        break;
      case "ye": 
        tperu = 12; 
        break;
      default: tperu = 10; 
    }
  
    return {"tperu":tperu};
  },
  
  /*
  *  getDateLabelForTick
  *  determines label for date unit in "ruler"
  *  @param obj {object} carries these values:
                         {"unit":tickUnit, "width":tickWidth, "serial":serial}
  *
  */
  getDateLabelForTick : function  (obj) {
  
    var i, me=this, ser = obj.serial, tw = obj.width;
  
    switch(obj.unit) {

      case "bill":
        if (ser == 0) {
          return "1";
        } else if (ser > 0) {
          return (ser) + " billion";
        } else {
          return (ser) + " b.y. bce";
        }
      break;
        
        
      case "hundredmill":
        if (ser == 0) {
          return "1";
        } else if (ser > 0) {
          return (ser) + "00 million";
        } else {
          return (ser) + "00 m.y. bce";
        }
      break;
        
        
      case "tenmill":
        if (ser == 0) {
          return "1";
        } else if (ser > 0) {
          return (ser) + "0 million";
        } else {
          return (ser) + "0 m.y. bce";
        }
      break;
        
            
      case "mill":
        if (ser == 0) {
          return "1";
        } else if (ser > 0) {
          return (ser) + " million";
        } else {
          return (ser) + " m.y. bce";
        }
      break;
          
                
      case "hundredthou":
        if (ser == 0) {
          return "1";
        } else if (ser > 0) {
          return (ser) + "00,000";
        } else {
          return (ser) + "00,000 bce";
        }
      break;
      
              
      case "tenthou":
        if (ser == 0) {
          return "1";
        } else if (ser > 0) {
          return (ser) + "0,000";
        } else {
          return (ser) + "0,000 bce";
        }
      break;
   
      case "thou": 
        if (ser == 0) {
          return "1" + "(" + ser + ")";
        } else if (ser > 0) {
          return (ser) + "000";
        } else {
          return (ser) + "000 bce";
        }
      break;
  
      case "ce": 
        if (ser == 0) {
          return "1" + "(" + ser + ")";
        } else if (ser > 0) {
          return (ser) + "00";
        } else {
          return (ser) + "00 bce";
        }
      break;
          
              
      case "de": 
        if (ser > 120){
          return (ser * 10) + "s";
        } else {
          return (ser * 10);
        }
      break;
      
      case "ye": 
        return ser; 
      break;
      
      case "mo": 
        
        i = TG_Date.getDateFromMonthNum(ser);
        
        if (tw < 120) {
          return TG_Date.monthNamesAbbr[i.mo] + " " + i.ye; 
        } else {
          return TG_Date.monthNames[i.mo] + ", " + i.ye; 
        }
      break;
        
        
      case "da": 
      
        // COSTLY: test performance here on dragging
        i = new TG_Date(TG_Date.getDateFromRD(ser));
        
        if (tw < 120) {
          return TG_Date.monthNamesAbbr[i.mo] + " " + i.da + ", " + i.ye;
        } else {
          return TG_Date.monthNames[i.mo] + " " + i.da + ", " + i.ye;
        }
      break;
    
      default: return obj.unit + ":" + ser + ":" + tw;
    }
    
  },

    /*
     *  tickHangies
     *  When dragging the interface, we detect when to add a new
     *  tick on left or right side: whether the outer tick has
     *  come within a 100px margin of the left or right of the frame
     *
     */
  tickHangies : function () {
    var tPos = $(TICKS).position().left,
        lHangie = this.leftside + tPos,
        rHangie = this.rightside + tPos - this.dimensions.container.width,
        tickPack, added = false,
        me = this;
    
    if (lHangie > -100) {
      tickPack = this.addTick({"type":"l"});
      me.appendTimelines(tickPack, "left");
    } else if (rHangie < 100) {
      tickPack = this.addTick({"type":"r"});
      me.appendTimelines(tickPack, "right");
    }
  },
  

  /* tickUnit, fd */
  tickOffsetFromDate : function (zoominfo, fdate, tickwidth) {
        
    // switch unit, calculate width gain or loss.... or just loss!
    var w = tickwidth,
        u = zoominfo.unit, p, prop;

    switch (u) {
      case "da": 
        // @4:30        4/24                30 / 1440
        //              .1666                .0201
        prop = ((fdate.ho) / 24) + ((fdate.mi) / 1440);
        p = w * prop;
        break;

      case "mo":
        
        var mdn = TG_Date.getMonthDays(fdate.mo, fdate.ye);
         
        prop = ((fdate.da -1) / mdn) + (fdate.ho / (24 * mdn)) + (fdate.mi / (1440 * mdn));
        p = w * prop;
        break;

      case "ye":
        prop = (((fdate.mo - 1) * 30) + fdate.da) / 365;
        p = w * prop;
        break;

      case "de": 
        // 
        // 1995
        prop = ((fdate.ye % 10) / 10) + (fdate.mo / 120);
        p = w * prop;
        break;

      case "ce": 
        prop = ((fdate.ye % 100) / 100) + (fdate.mo / 1200);
        p = w * prop;
        break;
      
      case "thou": 
        prop = ((fdate.ye % 1000) / 1000); 
        p = w * prop;
        break;

      case "tenthou":  
      
        prop = ((fdate.ye % 10000) / 10000); 
        p = w * prop;
        break;

      case "hundredthou": 
      
        prop = ((fdate.ye % 100000) / 100000);
        p = w * prop;
        break;
        
      case "mill": 
      
        prop = ((fdate.ye % 1000000) / 1000000);
        p = w * prop;
        break;
        
      case "tenmill": 
      
        prop = ((fdate.ye % 10000000) / 10000000);
        p = w * prop;
        break;
        
      case "hundredmill": 
      
        prop = ((fdate.ye % 100000000) / 10000000);
        p = w * prop;
        break;
        
      case "bill": 
      
        prop = ((fdate.ye % 1000000000) / 1000000000);
        p = w * prop;
        break;

      default: p=0;

    }

    return -1 * p;
  },
  
  
    resetTicksHandle : function () {
    $(this._views.HANDLE).offset({"left":$(CONTAINER).offset().left});
  },
  

  easeOutTicks : function() {
      
      if (Math.abs(ticksSpeed) > 5) {
        // This works, but isn't great:offset fails to register
        // for new tim as it ends animation...
        
        $(TICKS).animate({left: '+=' + (3 * ticksSpeed)}, 1000, "easeOutQuad", function() {
          debug.trace("stopping easing", "note")
        });
      }
    
  },
  


  /*
  @param    obj with { tick  |  timeline }
  @return   array of event ids 
  This is per-timeline...
  */
  getTimelineEventsByTick : function (obj) {
             
    var unit = obj.tick.unit,
      serial = obj.tick.serial,
      hash = MED.eventCollection.getTimelineHash(obj.timeline.timeline_id);
        
      if (hash[unit][serial] && hash[unit][serial].length > 0) {
        // looking for an array of events...
        return hash[unit][serial];
      } else {
        return [];
      }

  },
  
  
  passesFilters : function (ev, zoomLevel) {
    var ret = true,
      ev_icon = "",
      ei = "", ea = [], e, titl, desc,
      ii = "", ia = [], da = [], i;
    
    // MASTER FILTER BY THRESHOLD
    if  ((zoomLevel < ev.low_threshold) || (zoomLevel > ev.high_threshold)) {
      return false;
    }
    
    // KEYWORDS FOR SHOWING THIS EVENT
    if (MED.filters.imp_min && MED.filters.imp_min > 1) {
      if (ev.importance < MED.filters.imp_min) { return false; }
    }
    
    if (MED.filters.imp_max && MED.filters.imp_max < 100) {
      if (ev.importance > MED.filters.imp_max) { return false; }
    } 
    
    // KEYWORDS FOR SHOWING THIS EVENT
    if (MED.filters.title) {
      titl = MED.filters.title;
      ia = titl.split(",");
      ret = false;
      // cycle through comma separated include keywords
      for (i=0; i<ia.length; i++) {
        ii = new RegExp($.trim(ia[i]), "i");
        if (ev.title.match(ii)) { ret = true; }
      }
    } 
    
    // KEYWORDS FOR SHOWING THIS EVENT
    if (MED.filters.description) {
      desr = MED.filters.description;
      da = desr.split(",");
      ret = false;
      // cycle through comma separated include keywords
      for (i=0; i<da.length; i++) {
        ii = new RegExp($.trim(da[i]), "i");
        if (ev.description.match(ii)) { ret = true; }
      }
    } 
      
    
    if (MED.filters.exclude) {
      var excl = MED.filters.exclude;
      ea = excl.split(",");
      for (e=0; e<ea.length; e++) {
        ei = new RegExp($.trim(ea[e]), "i");
        if (ev.title.match(ei) || ev.description.match(ei)) { ret = false; }
      }
    }
    
    // LEGEND FILTER
    if (MED.filters.legend.length > 0) {
      ev_icon = ev.icon;
      if (_.indexOf(MED.filters.legend, ev_icon) == -1) {
        // if it's not in the legend list
        ret = false;
      }
    }
    
    // TAGS FILTER
    if (MED.filters.tags.length > 0) {
      if (ev.tags) {
        ret = false;
        ev_tags = ev.tags.split(",");
        _.each(ev_tags, function(tag) {
          tag = $.trim(tag);
          if (_.indexOf(MED.filters.tags, tag) !== -1) {
            ret = true;
          }
        });
      } else {
        // event has no tags at all..
        ret = false;
      }
    }
    
    // CUSTOM FILTER
    if (MED.filters.custom && typeof MED.filters.custom == "function") {
      ret = MED.filters.custom(ev);
    }
    
    
    /////////////
    
    return ret;
  },
  
  
  
  /*
  ADDING EVENTS ON INITIAL SWEEP!
  invoked upon a fresh sweep of entire container, having added a set of ticks
    --- occurs on expand/collapse
    --- ticks are created afresh
  */
  freshTimelines : function () {

    var me = this,
      t, i, tl, tlView, tlModel, tu, ts, tick, tE, tl_ht, t_f, t_l,
      active = MED.activeTimelines,
      ticks = MED.ticksArray,
      borg = '',
      $title, $ev, $tl,
      evid, ev,
      stuff = '', 
      cx = me.dimensions.container.centerx,
      cw = me.dimensions.container.width,
      foSec = MED.getFocusDate().sec,
      zi = MED.getZoomInfo(),
      spp = zi.spp,
      zl = zi.level,
      tickUnit = zi.unit,
      tArr = [],
      idArr = [],
      // left and right scope
      half = Math.floor(spp * (cw/2)),
      lsec = foSec - half,
      rsec = foSec + half,
      tz_offset = 0, tbwidth = 0,
      spanin,
      legend_label = "",
      spanins = [],
      expCol, tl_top=0,
      cht = me.dimensions.container.height,
      ceiling = 0,
      ticks_ht = me.dimensions.ticks.height;
      
    
    /////////////////////////////////////////
    
    /* 
    var testDate = MED.getFocusDate();
    
    var tdFocus = Math.floor(testDate.sec);
    
    var tickSec = me.getTickSeconds['da'](testDate.rd);
    debug.log("testDate gts obj:", tdFocus - tickSec.start);
    */
    
    //////////////////////////////////////////
    $.publish(container_name + ".viewer.rendering");
    
    for (var a=0; a<active.length; a++) {
      
      idArr = [];
      
      // FOR EACH _ACTIVE_ TIMELINE...
      tlModel = MED.timelineCollection.get(active[a]);

      tl = tlModel.attributes;
    
      tl.visibleEvents = [];
            
      expCol = tl.display;
      
      // TODO establish the 120 below in some kind of constant!
      // meanwhile: tl_top is the starting height of a loaded timeline 
      tl_bottom = (tl.bottom) ? stripPx(tl.bottom) : 30;  
      if (tl_bottom < 30) tl_bottom = 30; 
      
      tl_top = ticks_ht - tl_bottom;  
          
      tlView = new tg.TG_TimelineView({model:tlModel});
      
      tz_offset = MED.timeOffset.seconds / spp;
            
          $tl = $(tlView.render().el).appendTo(TICKS);
        
        $title = $tl.find(".titleBar");
        // this is the individual (named) timeline, not the entire interface
        
        
      // if a single timeline, set images to the bottom
      var tbh = $title.outerHeight();
      
      me.room = tl_top; // (cht - (Math.abs(tl_top) + tbh)) - (me.dimensions.footer.height + me.dimensions.tick.height);
      
      
        $tl.draggable({
          axis:"y",
          handle:".titleBar", 
          
          stop: function () {
            
            
            var posi = $(this).position();
            
            // chrome doesn't allow access the new bottom
            var new_bottom = (ticks_ht - stripPx($(this).css("top"))) -1;
            
            if (new_bottom < 24) {
              $(this).css("bottom", 24);
              new_bottom = 24;
            }
            
            var tid = $(this).attr("id");
            
            // if we've dragged the timeline up or down
            // reset its .top value and refresh, mainly
            // to reset ceiling (+/visible) properties
            var tl = MED.timelineCollection.get(tid);
            tl.set({bottom:new_bottom});
                        
            // if a single timeline, set images to the bottom
            var tbh = $title.outerHeight();
            
            me.room = me.dimensions.ticks.height - new_bottom;
      
            MED.refresh();  
          }
        })
        .css({"bottom":tl_bottom, "left": tz_offset});

      
      
      if (typeof tl.bounds != "undefined") {
        
        t_f = cx + ((tl.bounds.first - foSec) / spp);
        t_l = cx + ((tl.bounds.last - foSec) / spp);
      } else {
        // if no events, we have to make this up
        t_f = cx;
        t_l = cx + 300;
      }
      
      tbwidth = Math.floor(t_l - t_f);
            
      var tmax = 1000000;
      var farl = -1 * (tmax - 2000);
      
      // browsers have a maximum width for divs before
      // they konk out... if we get to a high point, we
      // can truncate the div, but have to make sure to
      // equally adjust the left position if the right
      // end of the div is needing to be placed in-screen
      // whew.
      if (tbwidth > tmax) {
        var dif = tbwidth - tmax;
        tbwidth = tmax;
        if (t_f < farl) {
          t_f = t_f + dif;
        }
      } 

      $title.css({"top":tl_ht, "left":t_f, "width":tbwidth}).data({"lef":t_f, "wid":tbwidth});

      /// for initial sweep display, setup fresh borg for organizing events
      if (expCol == "expanded") { tl.borg = borg = new timeglider.TG_Org(); }
 
      //cycle through ticks for hashed events
      for (var tx=0; tx<ticks.length; tx++) {
        tArr = this.getTimelineEventsByTick({tick:ticks[tx], timeline:tl});
          idArr = _.union(idArr, tArr); 
      }
            
      tl.visibleEvents = idArr;
      
      // detect if there are boundless spans (bridging, no start/end points)
    
      _.each(tl.spans, function (spanin) {
        
        if (_.indexOf(idArr, spanin.id) === -1) {
                    
          if ((spanin.start < lsec && spanin.end > rsec) 
           || (spanin.end < rsec && spanin.end > lsec)) {
  
                // adds to beginning to prioritize
                idArr.unshift(spanin.id);
                tl.visibleEvents.push(spanin.id);
                
            }
            
          }
          
      });
      
      
      // clean out dupes with _.uniq
      stuff = this.compileTickEventsAsHtml(tl, _.uniq(idArr), 0, "sweep", tickUnit);
      
      
      // future planning for scrollable overflow
      if (options.event_overflow == "scroll") {
        
        ceiling = 0;
        
      } else {
        
        //!TODO: does ANY timeline have an image lane??
        if (tl.inverted) {
          ceiling = tl_bottom - 16;
          
          
        } else {
          ceiling = (tl.hasImageLane || tg.mode == "authoring") ? (tl_top - MED.image_lane_height) - me.singleTitleHeight : tl_top - me.singleTitleHeight ;
        
        }
        
              
      }
      
      // var beforeStuff = +new Date();
      
      var onIZoom = (tl.initial_zoom == MED.getZoomLevel());
      
      
      if (expCol == "expanded") {
        stuff = borg.getHTML({tickScope:"sweep", ceiling:ceiling, onIZoom:onIZoom, inverted:tl.inverted, dimensions: MED.dimensions.container});
        tl.borg = borg.getBorg();
      } 
      
      if (stuff != "undefined") { $tl.append(stuff.html); }
      
      // var afterStuff = +new Date();  
      setTimeout( function() {
        me.registerEventImages($tl);
      }, 3);
      
    }// end for each timeline
    
    // initial title shift since it's not on-drag
    me.registerTitles();
    
    
    setTimeout(function () { me.applyFilterActions(); }, 300);
    
    $.publish(container_name + ".viewer.rendered");
    
  }, // ends freshTimelines()

  
  
  /*
  * appendTimelines
  * @param tick {Object} contains serial, time-unit, and more info
  */
  appendTimelines : function (tick, side) {
          
      var active = MED.activeTimelines, 
        idArr = [],
          $tl, tl, f, 
          stuff = "", diff = 0,
          ceiling = 0,
          me = this;
      
      $.publish(container_name + ".viewer.rendering");
      
      for (var a=0; a<active.length; a++) {
        
        tl = MED.timelineCollection.get(active[a]).attributes;

        // get the events from timeline model hash
        idArr = this.getTimelineEventsByTick({tick:tick, timeline:tl});
        
        tl.visibleEvents = _.union(tl.visibleEvents, idArr);
        
        tl_top = (tl.top) ? stripPx(tl.top) : (me.initTimelineVOffset); 
        
        // we need to see if the right end of a long span
        // is present in the newly added tick
        if (side == "left") {
          
          _.each(tl.spans, function (spanin) {
            
            //var diff = tick.seconds.start - spanin.end;
            if (spanin.end < tick.seconds.end && spanin.end > tick.seconds.start) {
              
              
                //not already in array
                if (_.indexOf(tl.visibleEvents, spanin.id) === -1) {
                    // add to beginning to prioritize
                    idArr.unshift(spanin.id);
                    tl.visibleEvents.push(spanin.id);
                  }
              }
          
          });
      
        } 
        
        // this either puts it into the timeline's borg object
        // or, if compressed, creates HTML for compressed version.
        // stuff here would be null if expanded...
        stuff = this.compileTickEventsAsHtml(tl, idArr, tick.serial, "append", tick.unit);
        
        // TODO: make 56 below part of layout constants collection
        if (options.event_overflow == "scroll") {
          ceiling = 0;
        } else {
          ceiling = (tl.hasImageLane) ? (tl_top - MED.image_lane_height) - me.singleTitleHeight : tl_top;
        }
      
    
        var onIZoom = (tl.initial_zoom == MED.getZoomLevel());
        
        // borg it if it's expanded.
        if (tl.display == "expanded"){ 
          // tl.top is the ceiling
          stuff = tl.borg.getHTML({tickScope:tick.serial, ceiling:ceiling, onIZoom:onIZoom, inverted:tl.inverted}); 
        }
      
        var $vu = $(CONTAINER + " .tg-timeline-envelope#" + tl.id);
        
        $vu.append(stuff.html);
        
        
        this.registerEventImages($tl);
          
      } // end for() in active timelines
      
      // this needs to be delayed because the append usually 
      // happens while dragging, which already brings the 
      // browser to the processor limits; make timeout time
      // below larger if things are crashing : )
      setTimeout(function () { me.applyFilterActions(); }, 500);
      
      $.publish(container_name + ".viewer.rendered");
        
  }, // end appendTimelines()
  
  
  
  
  
  // events array, MED, tl, borg, 
  // "sweep" vs tick.serial  (or fresh/append)
  /*
   *
   * @param btype {String} "sweep" || "append"
   *
   *
  */
  compileTickEventsAsHtml : function (tl, idArr, tick_serial, btype, tickUnit) {
      
      
    var me=this,
      posx = 0,
      cx = this.dimensions.container.centerx,
      expCol = tl.display,
      ht = 0,
      stuff = "",
      foSec = MED.startSec, 
      zi = MED.getZoomInfo(),
      spp = zi.spp,
      zl = zi.level,
      buffer = 16, 
      img_ht = 0, 
      img_wi = 0,
      borg = tl.borg || "",
      ev = {},
      font_ht = 0,
      shape = {},
      colTop = 0,
      impq,
      block_arg = "sweep"; // default for initial load
      
      
    if (borg) tl.borg.clearFresh();
      
    
    var isBig = function(tu) {
      if (tu == "da" || tu == "mo" || tu == "ye" || tu == "de" || tu == "ce" || tu == "thou"){
        return false;
      } else {
        return true;
      }
    };
          
    if (btype == "append") {
          block_arg = tick_serial;
    }
    
    for (var i=0; i<idArr.length; i++) {

    // BBONE
        ev = MED.eventCollection.get(idArr[i]).attributes;

        if (this.passesFilters(ev, zl) === true) {
          
          // the larger units (>=thou) have have an error
          // in their placement from long calculations;
          // we can compensate for them here...
          var adjust = (isBig(tickUnit)) ? .99795 : 1;
          var ev_sds = ev.startdateObj.sec * adjust;
              
          posx = cx + ((ev_sds - foSec) / spp);
          
            
          if (expCol == "expanded") {
        
        impq = (tl.size_importance === true || tl.size_importance === 1) ? tg.scaleToImportance(ev.importance, zl) : 1;

            ev.width = (ev.titleWidth * impq) + buffer;
            ev.fontsize = MED.base_font_size * impq;
            ev.left = posx;
        ev.spanwidth = 0;
        
        if (ev.span == true) {          
          ev.spanwidth = ((ev.enddateObj.sec - ev.startdateObj.sec) / spp);
          if (ev.spanwidth > ev.width) { ev.width = ev.spanwidth + buffer; }
        } 
  
          img_ht = 0;
          
          font_ht = Math.ceil(ev.fontsize);
          
        ev.height = (font_ht + 4);
            ev.top = (ht - font_ht);
            ev.bottom = 0;
          
          
        if (ev.image && ev.image.display_class == "inline") {
          
                  
          var img_scale = (ev.image.scale || 100) / 100;
          img_ht = (img_scale * ev.image.height) + 2;
          img_wi = (img_scale * ev.image.width) + 2;
          // !TODO 
          // THIS NEEDS TO BE REVERSABLE WITH POLARITY
          
          ev.shape = {
            "img_ht":img_ht, 
            "img_wi":img_wi, 
            "title": "shape",
            "top": (ev.top - (img_ht + 8)), 
            "bottom": ev.bottom, 
            "left": ev.left, 
            "right":ev.left + (img_wi + 8)
          };
          
          
        } else {
          ev.shape = "";
        }
        
                
              // block_arg is either "sweep" for existing ticks
              // or the serial number of the tick being added by dragging
            borg.addBlock(ev, block_arg);
          
          // end expanded state
          
          } else if (expCol == "collapsed") {
              if (tl.inverted) {
                colTop = 4;
              } else {
                colTop = ht - 20;
              }
              
              colIcon = (ev.icon) ? tg.icon_folder + ev.icon: tg.icon_folder + "circle_white.png";
              
            stuff += "<div id='" + ev.id + 
            "' class='timeglider-timeline-event tg-event-collapsed' style='top:" + 
            colTop + "px;left:" + posx + "px'><img src='" + colIcon + "'></div>";
          }
        } // end if it passes filters

      }
      
      if (expCol == "collapsed") {
        return {html:stuff};
      } else {
        // if expanded, "stuff" is
        // being built into the borg
        return "";
      }

  },
  
  
  /*
  *  registerEventImages
  *  Events can have classes applied to their images; these routines
  *  take care of doing non-css-driven positioning after the layout
  *  has finished placing events in the tick sphere.
  *
  *
  */
  registerEventImages : function ($timeline) {
    var me = this,
      laneHt = MED.image_lane_height,
      padding = 4,
      laneMax = 400,
      stht = this.singleTitleHeight;

      if (laneHt > laneMax) { laneHt = laneMax; }
 
      
    $(CONTAINER + " .timeglider-event-image-lane").each(
        function () {
                    
          var $div = $(this),
            imgHt = laneHt - (padding/2),
            $img = $(this).find("img"),
            imax = parseInt($div.data("max_height"), 10) || laneMax;

          if (imax < imgHt) {
            imgHt = imax;
          }
        
        if (imgHt > 10) {

          $div.css({"display":"block"})
          .position({
                my: "top",
              at: "top",
              of: $(CONTAINER),
              offset: "0, " + (stht + padding)
              })
              .css({left:0});
          
          $img.css("height", imgHt - (padding));
        } else {
          $div.css({"display":"none"});
        }
         }
      );

  
  },

  applyFilterActions: function() {
    
    var fa = MED.filterActions,
      collection = MED.eventCollection.models,
      ev_id;
  
    if (!_.isEmpty(fa)) {

      // For performance reasons, having just
      // one filter function is probably smart : )
      _.each(fa, function (f) {
        // filter:actionFilter, fn:actionFunction
        
        _.each(collection, function (ev) {
          if (f.filter(ev)) {
            ev_id = ev.get("id");
            // it's passed the filter, so run it through
            // the action function
            f.fn($(".timeglider-timeline-event#" + ev_id));
          }
        });
        
      })
    } 
    
  },
  
  
  expandCollapseTimeline : function (id) {
    var tl = MED.timelineCollection.get(id).attributes;
    if (tl.display == "expanded") {
      tl.display = "collapsed";
    } else {
      tl.display = "expanded";
    }
    MED.refresh();
  },
  
  
  invertTimeline : function (id) {
    var tl = MED.timelineCollection.get(id).attributes;
    if (tl.inverted == false) {
      tl.inverted = true;
    } else {
      tl.inverted = false;
    }
    MED.refresh();
  },
  
  
  
    //////// MODALS 
  timelineModal : function (id) {
            
    $(".tg-timeline-modal").remove();
    
    var me = this,
      tl = MED.timelineCollection.get(id);

    if (tl.get("description")) {
      var ch = me.dimensions.container.height,
        modal = new this.timelineInfoModal({model:tl}),
        header_ht = me.dimensions.header.height;
      
      $modal = $(modal.render().el)
        .appendTo("body")
        .position({
          my: "left top",
          at: "left top",
          of: $(".timeglider-container"),
          offset: "16," + (header_ht + 8), // left, top
          collision: "fit fit"
        })
        .css({"z-index":me.ztop++, "max-height":ch-64});
      
      if (MED.singleTimelineID) {
        $modal.find("h4").hide();
      }

      if ($.jScrollPane) {
        $(".jscroll").jScrollPane();
      }
    
    }
    
  },
  
  
  /*
   * Generates a horizontal menu of all links
   * in the event's link_json array
  */  
  createEventLinksMenu : function (linkage) {
    
    
    if (!linkage) return "";
    
    var html = '', l = 0, lUrl = "", lLab="";
    
    if (typeof(linkage) == "string") {
      // single url string for link: use "link"
      html = "<li><a href='" + linkage + "' target='_blank'>link</a></li>"
    } else if (typeof(linkage) == "object"){
      // array of links with labels and urls
      for (l=0; l<linkage.length; l++) {
        lUrl = linkage[l].url;
        lLab = linkage[l].label;
        html += "<li><a href='" + lUrl + "' target='_blank'>" + lLab + "</a></li>"
        }
    }
    return html;
  },
  
  /** 
   * Event Modal (eventmodal) Function: Creates Popup for Event (comment added by ndg) 
   */
  
  eventModal : function (eid, $event) {
  
    // remove if same event already has modal opened
    $(CONTAINER + " #" + eid + "_modal").remove();
    
    var me = this,
      map_view = false, 
      video_view=false, 
      map = "", map_options = {}, $modal, llar=[], mapZoom = 0,
      
      ev = MED.eventCollection.get(eid).attributes,
      
      // modal type: first check event, then timeline-wide option
      modal_type = ev.modal_type || options.event_modal.type;
            
      var ev_img = (ev.image && ev.image.src) ? "<img src='" + ev.image.src + "'>" : "",
      
      links = this.createEventLinksMenu(ev.link),
        
      templ_obj = { 
      	id:ev.id, // added by ndg to get template to include id
        title:ev.title,
        description:ev.description,
        link:ev.link,
        dateline: me.getEventDateLine(ev),
        links:links,
        image:ev_img
      }
      
      if (ev.video) { 
        templ_obj.video = ev.video;
        modal_type = "full";
        video_view = true;
        templ_obj.video = ev.video;
      } else if (ev.map && ev.map.latlong) {
        map_view = true;
        modal_type = "full";
        
      // if the embed size is small
      // ndg upped length from 1200 to 2000 for SHIVA
      } else if ((ev.description.length > 2000) || (me.dimensions.container.width < 500)) {
        modal_type = "full";
      }
      
            // return false;
      switch (modal_type) {
      
        case "full":
          
          $modal = $.tmpl(me._templates.event_modal_full,templ_obj);
            // full modal with scrim, etc
            var pad = 32;
            
              $modal
              .appendTo(CONTAINER)
                .position({
                  my: "left top",
                  at: "left top",
                  of: (CONTAINER),
                  offset:"0, 0",
                  collision: "none none"
                   });

            
                var ch = me.dimensions.container.height;
                var cw = me.dimensions.container.width;
                var $panel = $modal.find(".tg-full_modal_panel");
            var pw = cw - 64;
            var ph = ch - 64;
            var iw = 0;
            

                
              $panel.css({
                "width":pw,
                "height":ph,
                  "top":"32px",
                "left":"32px"
              });
              
              var $pp = $panel.find("p")[0];
              var pph = ph-120;
              
              
                if (map_view == true) {
                
                
                  $map = $("<div id='map_modal_map' class='tg-modal_map'></div>").prependTo($pp);
                  
                  mapZoom = ev.map.zoom || 12;
                  var llarr = String(ev.map.latlong).split(",");
                  
                  var map_ll = new google.maps.LatLng(parseFloat(llarr[0]), parseFloat(llarr[1]));
            map_options = {
              zoom:mapZoom,
              center: map_ll,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map($("#map_modal_map")[0], map_options);
            
            // if there are markers provided in the map:
            
            if (ev.map.markers) {
            
              for (var i=0; i<ev.map.markers.length; i++) {
                var marker = ev.map.markers[i];
                  var image = new google.maps.MarkerImage(marker.image,
                  new google.maps.Size(24, 32),
                  new google.maps.Point(0,0),
                  new google.maps.Point(0, 32)); // "plant" origin is lower left
                
                  var loc = marker.latlong.split(",");
                  
                  var llobj = new google.maps.LatLng(loc[0], loc[1]);
              
                  var marker = new google.maps.Marker({
                      position: llobj,
                      map: map,
                      icon: marker.icon,
                      title: marker.title,
                      zIndex:marker.zIndex
                  });
              }
            }
    
    
                } else if (video_view == true) {
                  
                  // var $insert = $modal.find("p");
                  
                  
                  $vid = $("<div class='tg-modal-video'><iframe frameborder='0' src='" + ev.video + "'></iframe></div>").prependTo(".tg-full_modal-body");
                  
                  $vid.find("iframe").css("height", $vid.width() * .66)
                  
                  
                }
                
              
            
            if (ev.image) {
            
              if (ev.image.width < pw/3) {
                // small image
                iw = ev.image.width;
                $panel.find("p img").css("width", iw);
              }
              
              
            } 
            
              
              if ($pp.height() > pph) {
                $pp.css({"height":pph, "overflow-y":"scroll"});
              }
              
              
  
          
        break;
        
      
        
        
        
        case "link-iframe":
          // show the link (i.e. Wikipedia, etc) in an iframe
          
          $modal = $.tmpl(me._templates.event_modal_iframe,templ_obj);
          $modal
            .appendTo(TICKS)
            .css("z-index", me.ztop++)
            .position({
              my: "center top",
              at: "center top",
              of: $(CONTAINER),
              offset: "0, 32", // left, top
              collision: "flip fit"
          })
              .hover(function () { $(this).css("z-index", me.ztop++); });
              
        
        break;
        
        
        default:
          
          // !TODO: 
          // abstract this into a common positioning function
          // for any of the small modals...
          // $event.parent()
          $modal = $.tmpl(me._templates.event_modal_small,templ_obj).appendTo($event.parent()); 
          // added code below to replace escaped markup with valid tags (ndg, 2013-03-28)
          var ihtml = $modal[0].innerHTML;
          ihtml = ihtml.replace(/&lt;(\/?[^&]+)&gt;/g, "<$1>");
          $modal[0].innerHTML = ihtml;
          var pad = 8;
          var arrow_class = "", tb_class = "", lr_class = "";
          
          var ev_left = $event.position().left;
          var ev_top = $event.position().top;
              
          var modal_ht = $modal.outerHeight();
          var modal_wi = $modal.outerWidth();
          
          var co_off = me.dimensions.container.offset;
          var ev_off = $event.offset();
         
          
          var extra_top = (MED.timelineCollection.length == 1) ? 24: 0;

          var top_set = 0;
          if (ev_off.top - co_off.top < (modal_ht + (pad + extra_top))) {
            // position modal below the event
            top_set = ev_top + $event.height() + 8;
            tb_class = "top";
          } else {
            // all is good: position above
            top_set = ev_top - (modal_ht + 12);
            tb_class = "bottom";
          }
          
          var ev_rel = ev_off.left - co_off.left;
          var farthest = me.dimensions.container.width - (modal_wi + pad);
          
          if (ev_rel < pad) {
            // shift to the left
            ev_left += Math.abs(ev_rel) + pad;
            lr_class = "left";
          } else if (ev_rel > farthest) {
            // it's too far off to the right
            ev_left -= (ev_rel - farthest);
            lr_class = "right";
          } else {
            lr_class = "left";
          }
          arrow_class = "arrow-" + tb_class + "-" + lr_class;
          
          // Not clear on how positioning works but below is added by ndg (2013-06-03)
          // If top_set is positive, modal appears mostly off the timeline so subtract modal height;
          if (top_set > -1 * (modal_ht / 2)) { top_set = top_set - modal_ht; }
          // Prevent from going too far up and off the top (ndg)
          if (top_set < 0 && (top_set + $event.parent().offset().top) < 0) { top_set = -1 * $event.parent().offset().top + 30; }

          $modal.css({
              "z-index": me.ztop++,
              "top":top_set,
              "left":ev_left
          });
          
          // Adding code to make modal draggable (ndg)
          $modal.draggable({cancel : 'div.tg-ev-modal-description'});
              
      
     } // eof switch
  }, // eof eventModal
  
  
  
  legendModal : function (id) {
      // only one legend at a time ??
      $(".tg-timeline-modal").remove();
      
      var me=this,
        leg = MED.timelineCollection.get(id).attributes.legend,
          l=0, 
          icon = "", 
          title = "", 
          html = "",
          i_sel = "";
      
      for (l=0; l < leg.length; l++) {
        icon = options.icon_folder + leg[l].icon;
        title = leg[l].title;       
        html += "<li><img class='tg-legend-icon' src='" + icon + "'><span class='legend-info'>" + title + "</span></li>";
         
      }
     
      var templ_obj = {id:id, legend_list:html};
      
      // remove existing legend
      $(CONTAINER + " .tg-legend").remove();
        
      $.tmpl(me._templates.legend_modal,templ_obj)
        .appendTo(CONTAINER)
        .css("z-index", me.ztop++)
          .toggleClass("tg-display-none")
          .position({
        my: "right top",
        at: "right top",
        of: $(CONTAINER),
        offset: "-72, 32", // left, top
        collision: "fit fit"
          });
      
      i_sel = CONTAINER + " .legend-info, " + CONTAINER + " .tg-legend-icon";
        
        $(i_sel).bind("mouseup", function(e) { 
          // if dragged, return false...
            var $legend_item = $(e.target).parent(); 
            var icon = ($legend_item.children("img").attr("src"));
            $(this).parent().toggleClass("tg-legend-icon-selected");
            MED.setFilters({origin:"legend", icon: icon}); 
        });

  },
  
  
  
  parseHTMLTable : function(table_id) {
    var obj = {},
    now = +new Date(),
    keys = [];

    $('#' + table_id).find('tr').each(function(i){
      ////////// each..
      var children = $(this).children(),
      row_obj;

      if ( i === 0 ) {
        keys = children.map(function(){
          return $(this).attr( 'class' ).replace( /^.*?\btg-(\S+)\b.*?$/, '$1' );
          }).get();

        } else {
          row_obj = {};

          children.each(function(i){
            row_obj[ keys[i] ] = $(this).text();
          });

          obj[ 'prefix' + now++ ] = row_obj;
        }
        /////////
      });
      return obj;
      
  }

} // end VIEW prototype


  
tg.TG_TimelineView = Backbone.View.extend({

  initialize: function (t) {
  
    var me=this;
    
    this.mediator = t.model.get("mediator");
    
    this.model.bind('change:title', function () {
      $(me.el).find(".timeline-title-span").text(me.model.get("title"));
    });
    
    if (this.mediator.timelineCollection.length > 1 || tg.mode == "authoring") {
      this.titleBar = "fullBar";
    } else {
      this.titleBar = "hiddenBar";  
    }
          
    this.model.bind('destroy', this.remove, this);
  },
  

    tagName:  "div",
    
    events: {
      "click .timeline-title-span" : "titleClick"
    },
    
    className: "tg-timeline-envelope",
    
    
  getTemplate: function() {
    
    var tmpl = "",
      env_bts = "",
      env_b = "",
      inverted = "";
      
      
    if (this.model.get("inverted")) {
      inverted = " timeline-inverted";
      
    } else {
      inverted = "";
    } 
      
    
    if (this.titleBar == "fullBar") {
    
      tmpl = "<div class='titleBar'>"
          + "<div class='timeline-title" + inverted + "'>"
              + "<span class='timeline-title-span'>";
              
              
              
              
          env_bts = "<div class='tg-env-buttons'>";
          
          // INFO BUTTON
          if (this.model.get("description")) {
            env_bts += "<div class='tg-env-button tg-env-info timeline-info-bt' data-timeline_id='${id}'></div>";
          }
          
          // LEGEND BUTTON
          if (this.model.get("hasLegend")) {
            env_bts += "<div class='tg-env-button tg-env-legend tg-legend-bt' data-timeline_id='${id}'></div>";
          }
          
          // MAY WANT TO SUPPRESS THESE
          
          // INVERT BUTTON
          env_bts += "<div class='tg-env-button tg-env-invert tg-invert-bt' data-timeline_id='${id}'></div>";
          
      // EXPAND BUTTON
          env_bts += "<div class='tg-env-button tg-env-expcol tg-expcol-bt' data-timeline_id='${id}'></div>"; 
          
          env_bts += "</div>";
          
                    
      env_b = (timeglider.mode == "preview" || timeglider.mode == "publish") ? env_bts : "";      
      
      tmpl += env_b + "${title}</span></div></div>";
      
      
    } else if (this.titleBar == "imageBar") {
      tmpl = "<div class='titleBar imageBar'></div>";
    } else {
      tmpl = "<div class='titleBar tg-display-none'></div>";
    }
  
    return tmpl;  
  },

    render: function() {
      
      var me = this;
    var id = me.model.get("id");
    var title = me.model.get("title");
    
    var _template = me.getTemplate();
    
    var state_class = this.model.get("inverted") ? "inverted" : "straight-up";
  
    $(this.el)
      .html($.tmpl(_template, this.model.attributes))
      .attr("id", this.model.get("id"))
      .addClass(state_class);
    
    
    
        return this;
    },


    setText: function() {
      /*
      var text = this.model.get('text');
      this.$('.todo-text').text(text);
      this.input = this.$('.todo-input');
      */
    },


    titleClick: function() {
      MED.timelineTitleClick(this.model.get("id"));
    },


    remove: function() {
      $(this.el).remove();
    }


    //clear: function() {
    //  this.model.destroy();
    //}

});

/*
      zoomTree
      ****************
      there's no zoom level of 0, so we create an empty element @ 0

      This could eventually be a more flexible system so that a 1-100 
      value-scale could apply not to "5 hours to 10 billion years", but 
      rather to 1 month to 10 years. For now, it's static according to 
      a "universal" system.
*/

tg.zoomTree = [
    {},
    {unit:"da", width:35000,level:1, label:"30 minutes"},
    {unit:"da", width:17600,level:2, label:"1 hour"},
    {unit:"da", width:8800,level:3, label:"2 hours"},
    {unit:"da", width:4400,level:4, label:"5 hours"},
    {unit:"da", width:2200, level:5, label:"10 hours"},
    {unit:"da", width:1100, level:6, label:"1 DAY"},
    {unit:"da", width:550, level:7, label:"40 hours"},
    {unit:"da", width:432, level:8, label:"2 days"},
    {unit:"da", width:343, level:9, label:"2.5 days"},
    {unit:"da", width:272, level:10, label:"3 days"},
    {unit:"da", width:216, level:11, label:"4 days"},
    {unit:"da", width:171, level:12, label:"5 days"},
    {unit:"da", width:136, level:13, label:"1 WEEK"},
    {unit:"da", width:108, level:14, label:"8 days"},
    /* 108 * 30 = equiv to a 3240 month */
    {unit:"mo", width:2509, level:15, label:"10 days"},
    {unit:"mo", width:1945, level:16, label:"2 WEEKS"},
    {unit:"mo", width:1508, level:17, label:"18 days"},
    {unit:"mo", width:1169, level:18, label:"3 weeks"},
    {unit:"mo", width:913, level:19, label:"1 MONTH"},
    {unit:"mo", width:719, level:20, label:"5 weeks"},
    {unit:"mo", width:566, level:21, label:"6 weeks"},
    {unit:"mo", width:453, level:22, label:"2 MONTHS"},
    
    
    {unit:"mo", width:362, level:23, label:"10 weeks"},
    {unit:"mo", width:290, level:24, label:"3 MONTHS"},
    {unit:"mo", width:232, level:25, label:"4 months"},
    {unit:"mo", width:186, level:26, label:"5 months"},
    {unit:"mo", width:148, level:27, label:"6 MONTHS"},
    {unit:"mo", width:119, level:28, label:"7 months"},
    {unit:"mo", width:95,  level:29, label:"9 months"},
    {unit:"mo", width:76,  level:30, label:"1 YEAR"},
    /* 76 * 12 = equiv to a 912 year */
    {unit:"ye", width:723, level:31, label:"15 months"},
    {unit:"ye", width:573, level:32, label:"18 months"},
    {unit:"ye", width:455, level:33, label:"2 YEARS"},
    {unit:"ye", width:361, level:34, label:"2.5 years"},
    {unit:"ye", width:286, level:35, label:"3 years"},
    {unit:"ye", width:227, level:36, label:"4 years"},
    {unit:"ye", width:179, level:37, label:"5 years"},
    {unit:"ye", width:142, level:38, label:"6 years"},
    {unit:"ye", width:113,  level:39, label:"8 years"},
    {unit:"ye", width:89,  level:40, label:"10 years"},
    {unit:"de", width:705, level:41, label:"13 years"},
    {unit:"de", width:559, level:42, label:"16 years"},
    {unit:"de", width:443, level:43, label:"20 years"},

    {unit:"de", width:302, level:44, label:"25 years"},
    {unit:"de", width:240, level:45, label:"30 years"},
    {unit:"de", width:190, level:46, label:"40 years"},
    {unit:"de", width:150, level:47, label:"50 years"},
    {unit:"de", width:120, level:48, label:"65 years"},
    {unit:"de", width:95,  level:49, label:"80 years"},
    {unit:"de", width:76,  level:50, label:"100 YEARS"},
    {unit:"ce", width:600, level:51, label:"130 years"},
    {unit:"ce", width:480, level:52, label:"160 years"},
    {unit:"ce", width:381, level:53, label:"200 YEARS"},
    {unit:"ce", width:302, level:54, label:"250 years"},
    {unit:"ce", width:240, level:55, label:"300 years"},
    {unit:"ce", width:190, level:56, label:"400 years"},
    {unit:"ce", width:150, level:57, label:"500 YEARS"},
    {unit:"ce", width:120, level:58, label:"600 years"},
    {unit:"ce", width:95,  level:59, label:"1000 YEARS"},
    {unit:"ce", width:76,  level:60, label:"1100 years"},
    {unit:"thou", width:603, level:61, label:"1500 years"},
    
    {unit:"thou", width:478, level:62, label:"2000 years"},
    {unit:"thou", width:379, level:63, label:"2500 years"},
    {unit:"thou", width:301, level:64, label:"3000 years"},
    {unit:"thou", width:239, level:65, label:"4000 years"},
    {unit:"thou", width:190, level:66, label:"5000 YEARS"},
    {unit:"thou", width:150, level:67, label:"6000 years"},
    {unit:"thou", width:120, level:68, label:"7500 years"},
    {unit:"thou", width:95, level:69, label:"10,000 YEARS"},
    {unit:"thou", width:76,  level:70, label:"12,000 years"},
    {unit:"tenthou", width:603, level:71, label:"15,000 years"},
    {unit:"tenthou", width:358, level:72, label:"25,000 years"},
    {unit:"tenthou", width:213, level:73, label:"40,000 years"},
    {unit:"tenthou", width:126, level:74, label:"70,000 years"},
    {unit:"tenthou", width:76, level:75, label:"100,000 YEARS"},
    {unit:"hundredthou", width:603, level:76, label:"150,000 years"},
    {unit:"hundredthou", width:358, level:77, label:"250,000 years"},
    {unit:"hundredthou", width:213, level:78, label:"400,000 years"},
    {unit:"hundredthou", width:126, level:79, label:"700,000 years"},
    {unit:"hundredthou", width:76,  level:80, label:"1 million years"},
    {unit:"mill", width:603, level:81, label:"1.5 million years"},
    {unit:"mill", width:358, level:82, label:"3 million years"},
    {unit:"mill", width:213, level:83, label:"4 million years"},
    {unit:"mill", width:126, level:84, label:"6 million years"},
    {unit:"mill", width:76, level:85, label:"10 million years"},
    {unit:"tenmill", width:603, level:86, label:"15 million years"},
    {unit:"tenmill", width:358, level:87, label:"25 million years"},
    {unit:"tenmill", width:213, level:88, label:"40 million years"},
    {unit:"tenmill", width:126, level:89, label:"70 million years"},
    {unit:"tenmill", width:76,  level:90, label:"100 million years"},
    {unit:"hundredmill", width:603, level:91, label:"120 million years"},
    {unit:"hundredmill", width:358, level:92, label:"200 million years"},
    {unit:"hundredmill", width:213, level:93, label:"300 million years"},
    {unit:"hundredmill", width:126, level:94, label:"500 million years"},
    {unit:"hundredmill", width:76, level:95, label:"1 billion years"},
    {unit:"bill", width:603, level:96, label:"15 million years"},
    {unit:"bill", width:358, level:97, label:"30 million years"},
    {unit:"bill", width:213, level:98, label:"50 million years"},
    {unit:"bill", width:126, level:99, label:"80 million years"},
    {unit:"bill", width:76,  level:100, label:"100 billion years"}
    ];

    // immediately invokes to create extra information in zoom tree
    //
    tg.calculateSecPerPx = function (zt) {
        for (var z=1; z<zt.length; z++) {
          var zl = zt[z];
          var sec = 0;
          switch(zl.unit) {
            case "da": sec =          86400; break;
            case "mo": sec =          2419200; break; // assumes only 28 days per 
            case "ye": sec =          31536000; break;
            case "de": sec =          315360000; break;
            case "ce": sec =          3153600000; break;
            case "thou": sec =        31536000000; break;
            case "tenthou": sec =     315360000000; break;
            case "hundredthou": sec = 3153600000000; break;
            case "mill": sec =        31536000000000; break;
            case "tenmill": sec =     315360000000000; break;
            case "hundredmill": sec = 3153600000000000; break;
            case "bill": sec =        31536000000000000; break;
          }
          // generate hash for seconds per pixel
          zl.spp = Math.round(sec / parseInt(zl.width));
          
        }

    // call it right away to establish values
}(tg.zoomTree); // end of zoomTree
    
    
/* a div with id of "hiddenDiv" has to be pre-loaded */
tg.getStringWidth  = function (str) {
  
  var $ms = $("#timeglider-measure-span");
  $ms.css("font-size", MED.base_font_size);
  
    if (str) {
      // for good measure, make it a touch larger
    return $ms.html(str).width() + MED.base_font_size;
  } else {
    return false;
  }
};


    
tg.scaleToImportance = function(imp, zoom_level) {
    // flash version: return ((importance - zoomLev) * 4.5) + 100;
    // 100 being 1:1 or 12 px

    // first basic version: return imp / zoo;
    
    return (((imp - zoom_level) * 4.5) + 100) / 100;
},
  
  
  
        
String.prototype.removeWhitespace = function () {
  var rg = new RegExp( "\\n", "g" )
  return this.replace(rg, "");
}



if (debug) {
  // adding a screen display for anything needed
  debug.trace = function (stuff, goes) {
    $("#" + goes).text(stuff);
  }
}


tg.googleMapsInit = function () {
  // debug.log("initializing google maps...")
}

tg.googleMapsLoaded = false;
tg.googleMapsLoad = function () {

  
  if (tg.googleMapsLoaded == false) {
  
    var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&' +
          'callback=timeglider.googleMapsInit';
      document.body.appendChild(script);
      
      tg.googleMapsLoaded = true;
  }
  
}



})(timeglider);

/*
 * Timeglider for Javascript / jQuery 
 * http://timeglider.com/jquery
 *
 * Copyright 2011, Mnemograph LLC
 * Licensed under Timeglider Dual License
 * http://timeglider.com/jquery/?p=license
 *
 */

/*******************************
  TIMELINE MEDIATOR
  � handles timeline behavior, 
  � reflects state back to view
  � owns the timeline and event data models

********************************/
(function(tg){
  
  
var MED = {},
  TG_Date = tg.TG_Date,
  options = {},
  $ = jQuery,
  $container = {},
  container_name = '';
      
      

tg.TG_Mediator = function (wopts, $el) {
  
    this.options = options = wopts;
    
    $container = $el;
    
    container_name = wopts.base_namespace + "#" + $container.attr("id");

    // these relate to the display ------ not individual timeline attributes
    this._focusDate = {};
    this._zoomInfo = {};
    this._zoomLevel = 0;
    
    this.ticksReady = false;
    this.ticksArray = [];
    this.startSec = 0;
    this.activeTimelines = [];
    this.max_zoom = options.max_zoom;
    this.min_zoom = options.min_zoom;
    
    this.icon_folder = tg.icon_folder = options.icon_folder || "images/timeglider/icons/";
    // setting this without setTimeoffset to avoid refresh();
    this.timeOffset = TG_Date.getTimeOffset(options.timezone);
    
    this.base_font_size = 12;
  
    this.fixed_zoom = (this.max_zoom == this.min_zoom) ? true : false;
    this.gesturing = false;
    this.gestureStartZoom = 0;
    this.gestureStartScale = 0; // .999 etc reduced to 1 to 100
    this.filters = {include:"", exclude:"", legend:[], tags:[]};
    
    // 
    this.filterActions = {};

  this.loadedSources = [];
    this.timelineCollection = new tg.TG_TimelineCollection;
    this.eventCollection = new tg.TG_EventCollection;
    
    this.imagesSized = 0;
    this.imagesToSize = 0;
    this.timelineDataLoaded = false,
    
    this.image_lane_height = 0;
    
    
    // this.setZoomLevel(options.initial_zoom);
    this.initial_timelines = [];
    this.initial_timeline_id = options.initial_timeline_id || "";
    this.sole_timeline_id = "";
    
    this.dimensions = {};
    
    this.focusedEvent = '';
    
    this.singleTimelineID = 0;
    this.scopeChanges = 0;
    
    if (options.max_zoom === options.min_zoom) {
      this.fixed_zoom = options.min_zoom;
    }
    
    if (options.main_map) {
      this.main_map = options.main_map;
      timeglider.mapping.setMap(this.main_map, this);
    }

    MED = this;

} // end mediator head
    
    

  tg.TG_Mediator.prototype = {
  
  
    // clears the events and timelines collections
    emptyData: function() {
      this.eventCollection.reset({});
      this.timelineCollection.reset({});
    },
    
    
    focusToEvent: function(ev, callback){
      // !TODO open event, bring to zoom
      this.focusedEvent = ev;
      this.gotoDateZoom(ev.startdateObj.dateStr)
      $.publish(container_name + ".mediator.focusToEvent");
      
      if (typeof callback == "function") {
        callback(ev);
      }
    },
    
    /*
     * filterBy
     * @param type {String} tags|include|exclude|legend
     * @param content {String} content to be filtered, i.e. keyword, etc
     *
     */
    filterBy: function(type, content){
      // !TODO open event, bring to zoom
      var fObj = {origin:type};
      fObj[type] = content;
      this.setFilters(fObj);
    },
    
    
    setImageLaneHeight: function(new_height, ref, set_ui) {
      this.image_lane_height = new_height;
      
      if (set_ui) {
        $.publish(container_name + ".mediator.imageLaneHeightSetUi");
      }
      
      if (ref) {
        this.refresh();
      }
      
      
    },
    

      /* PUBLIC METHODS MEDIATED BY $.widget front */
      gotoDateZoom: function (fdStr, zoom) {
          var fd = new TG_Date(fdStr),
              zl = false;
          this.setFocusDate(fd);
          
          // setting zoom _does_ refresh automatically
          if (zoom) { 
            var zl = this.setZoomLevel(zoom);
          };
          
          if (!zoom || zl == false) { 
            this.refresh(); 
          }
          
          $.publish(container_name + ".mediator.scopeChange");
      },
      
      
      zoom : function (n) {
        var new_zoom = this.getZoomLevel() + parseInt(n);
        this.setZoomLevel(new_zoom);
      },
      
      
      focusTimeline: function(timeline_id) {
        var tl = this.timelineCollection.get(timeline_id);
        var fd = tl.get("focus_date");
        var zl = tl.get("initial_zoom");
        
        this.gotoDateZoom(fd, zl);
        
      },
      
      
      
      loadPresentation: function(presentation_object) {
        
        var me = this,
          po = presentation_object,
          tls = po.timelines,
          tid = "",
          active = [],
          inverted = 0,
          bottom = 0,
          display = "expanded",
          real_tl = {};
        
        if (po.timelines.length > 0) {
          
          _.each(tls, function(tl) {
            if (tl.open == 1) {
              tid = tl.timeline_id;
              active.push(tid);
              bottom = tl.bottom || 30;
              display = tl.display || "expanded";
              inverted = tl.inverted || 0;
              
              real_tl = me.timelineCollection.get(tid);
              real_tl.set({"inverted":inverted, "display":display, "bottom":bottom});
            }
          });         
          
          me.setFocusDate(new tg.TG_Date(po.focus_date));
          me.activeTimelines = active;
          me.setZoomLevel(po.initial_zoom);
        
        me.setImageLaneHeight(po.image_lane_height || 0, false, true);
        
        
        me.refresh();
        
        

        } else {
          // WTF no timelines 
          alert("There are no timelines in this presentation...");
          return false;
        }
      },  
      
      
      getScope : function () {
      
      var zi = this.getZoomInfo(),
        fd = this.getFocusDate(),
        tBounds = this.getActiveTimelinesBounds(),
        focusDateSec = Math.round(fd.sec),
        focus_unix_seconds = tg.TG_Date.TGSecToUnixSec(focusDateSec),
        width = this.dimensions.container.width,
        half_width = width/2,
        spp = Math.round(zi.spp),
      
        // calculate milliseconds from focus date seconds
        // and dimensions of the timeline frame
        left_ms = (focus_unix_seconds - (half_width * spp)) * 1000,
        focus_ms = focus_unix_seconds * 1000,
        right_ms = (focus_unix_seconds + (half_width * spp)) * 1000,
        
        left_sec = focusDateSec - (half_width * spp),
        right_sec = focusDateSec + (half_width * spp);
        
      return {
        "spp": spp, 
        "width": width,
        "focusDateSec": focusDateSec,
        "timelines": this.activeTimelines,
        "timelineBounds": tBounds,
        "container": $container,
        "left_sec":left_sec,
        "right_sec":right_sec,
        // unix milliseconds!
        "leftMS":left_ms,
        "rightMS":right_ms,
        "focusMS":focus_ms
      }
      
      },
      
      
      /*
       * fitToContainer
       * Considers the time-width of the current timeline(s) and
       * finds the best zoom level to fit all events in one view
      */
      fitToContainer: function() {
        
        var bds = this.getActiveTimelinesBounds();
        var seconds_wide = bds.last - bds.first;
        var middle_sec = (bds.first + bds.last) / 2;
        var width = this.dimensions.container.width;
        
        var z = _.find(tg.zoomTree, function (zl) {
          return seconds_wide/zl.spp < width;
        });

        this.gotoDateZoom(middle_sec, z.level);
          
      },
      
      
      resize: function () {
        $.publish(container_name + ".mediator.resize");
      },
      

      addFilterAction: function(actionName, actionFilter, actionFunction) {
        this.filterActions[actionName] = {filter:actionFilter, fn:actionFunction};
        this.refresh();
      },
      
      removeFilterAction: function(actionName) {
        delete this.filterActions[actionName];
        this.refresh();
      },
      
      
      getEventByID: function(id, prop) {
        var evob = this.eventCollection.get(id).attributes;
        
        if (prop && evob.hasOwnProperty(prop)) {
          return evob[prop];
        } else {
          return evob;
        }
      },
      
      
      
      /*
       * getPastEvents
       * Get an array of all events prior to focus date
       *
      */ 
    getPastEvents: function(visible_only) {
        var me=this,
          scope = this.getScope();

        if (scope.timelineBounds.first < scope.focusDateSec) {
          // send back all events prior to focus
          var flred = _.filter(this.eventCollection.models, function(ev) {
            var visf = (visible_only) ? me.isEventVisible(ev): true;
 
            return (visf && ev.get("startdateObj").sec < scope.focusDateSec);
          });
          
          
          return flred;
          
        } else {
          return false;
        }
    },
  
      gotoPreviousEvent: function() {
        var me=this,
          backEvents = this.getPastEvents(true);
        
      if (backEvents) {
        var cb = function(ev) {
          $(".timeglider-timeline-event").removeClass("tg-event-selected");
          $(".timeglider-timeline-event#" + ev.id).addClass("tg-event-selected");
        }
          this.focusToEvent(_.last(backEvents).attributes, cb);
        } else {
          return false;
        }
      },
    
    
    
      
      /*
       * getFutureEvents
       * Get an array of all events forward of focus date
       *
      */ 
      getFutureEvents: function (visible_only) {
        var me=this,
          scope = this.getScope();
  
        if (scope.timelineBounds.last > scope.focusDateSec) {
        
          return _.filter(this.eventCollection.models, function(ev) {
            var visf = (visible_only) ? me.isEventVisible(ev): true;
            return (visf && ev.get("startdateObj").sec > scope.focusDateSec);
          });
   
          
        } else {
          return false;
        }
      },
      
    gotoNextEvent: function() {
      var me = this,
        fwdEvents = this.getFutureEvents(true);
      if (fwdEvents) {
        var cb = function(ev) {
          $(".timeglider-timeline-event").removeClass("tg-event-selected");
          $(".timeglider-timeline-event#" + ev.id).addClass("tg-event-selected");
        }
        this.focusToEvent(_.first(fwdEvents).attributes, cb);
      } else {
        return false;
      }
    },
      
     
     
    isEventVisible: function(ev) {
      
      var z = this._zoomLevel;
      if (z <= ev.get("high_threshold") && z >= ev.get("low_threshold") ) { 
        // debug.log("vis: ", ev.get("title")); // 
        return true;
      } else {
        // debug.log("nOt Vis: ", ev.get("title")); // 
        return false;
      }
      
    },
    
    

      
      /* 
       * adjustNowEvents
       * Keeps events with "keepCurrent" set to "start" or "end" up to
       * date with current time, useful for real-time timelines with
       * sensitive auto-adjusting event times. Automatically searches
       * all events in the collection.
       * NO PARAMS
       *
       */
      adjustNowEvents: function() {
        
        var refresh = false,
          kC = "",
          dd = "";
        
        _.each(this.eventCollection.models, function(ev) {
          if (ev.get("keepCurrent")) {
            
            kC = ev.get("keepCurrent"),
            dd = ev.get("date_display");
            
            if (kC == "start") {
              ev.set({"startdateObj":new TG_Date("today", dd)});
            } else if (kC == "end") {
              ev.set({"enddateObj":new TG_Date("today", dd)});
            }
            
            ev.reIndex();
            
            refresh = true;
        
          }
        });
      
        if (refresh) {
          this.refresh();
        }
      },
      
      
      
      
      
      /*
       * addEvent
       * @param new_event {Object} is a simple tg event object
       *        with .startdate and .enddate as ISO8601 strings,
       *        and would accept other TG_Event attribs
       *  
       * @return the new (Backbone) Model for the event
       *
      */
      addEvent: function(new_event) {
        
      
      new_event.startdateObj = new tg.TG_Date(new_event.startdate);
      
      var enddate = new_event.enddate || new_event.startdate;
      
      new_event.enddateObj = new tg.TG_Date(enddate);

      new_event.mediator = this;
      
      new_event.cache = {
        timelines:new_event.timelines,
        startdateObj:new_event.startdateObj,
        enddateObj:new_event.enddateObj,
        span:true
      }
      
      var new_model = new tg.TG_Event(new_event);
      this.eventCollection.add(new_model);
      
      // incorporates TG_Event into hashes, re-evaluates
      // timeline start/end points
      new_model.reIndex();
      
      
      this.refresh();
      
        $.publish(container_name + ".mediator.addEvent"); 
        
        return new_model;
      
      },
      
      /*
       * updateEvent
       * @param event_edits {Object} is a 
       *  
       * @return the new (Backbone) Model for the event
       *
      */
      updateEvent:function (event_edits) {
        if (!event_edits.id) {
          alert("error: you need a valid id set on the object in updateEvent()");
          return false;
        }
        
        var ev = this.eventCollection.get(event_edits.id);
        
        ev.set(event_edits);
        
        // re-index if dates have changed
        if (event_edits.startdateObject || event_edits.enddateObject) {
          ev.reIndex();
        }

        this.refresh();
        
        $.publish(container_name + ".mediator.updateEvent"); 
        
        return ev;

      },
      
      
      /*
       * Gets the bounds for 1+ timelines in view
       */
      getActiveTimelinesBounds: function() {
        
        var active = this.activeTimelines,
          tl = {},
          startSec = 99999999999,
          endSec = 0;
        
        for (var t=0; t<active.length; t++) {
          tl = this.timelineCollection.get(active[t]);
          startSec = (tl.get("bounds").first < startSec) ? tl.get("bounds").first : startSec;
          endSec = (tl.get("bounds").last > endSec) ? tl.get("bounds").last : endSec;
        }
        
      return {"first":startSec, "last":endSec};
      
      },
      
      
      
      
    removeFromActive: function (timeline_id) {
      var active = _.indexOf(this.activeTimelines,timeline_id);
      
      // if it's in the active array
      if (active != -1) {
      this.activeTimelines.splice(active,1);
      return true;
    } else {
      return false;
    }
    
    },
    
    
    
  /*
  * loadTimelineData
  * @param src {object} object OR json data to be parsed for loading
  * !TODO: create option for XML?
  */
  loadTimelineData : function (src, callback) {
    var M = this; // model ref
    // Allow to pass in either the url for the data or the data itself.

    if (src) {
      // if we've not loaded it already!
      if (_.indexOf(M.loadedSources, src) == -1) {
      
          if (typeof src === "object") {

          // OBJECT (already loaded, created)
          M.parseTimelineData(src, callback);
            
          } else if (src.substr(0,1) == "#") {
          // TABLE
          var tableData = [M.getTableTimelineData(src)];
          M.parseTimelineData(tableData, callback);
            
          } else {
            // FROM NEW JSON
  
              $.getJSON(src, function (data) {
              
                if (data.error) {
                
                  if (data.password_required == 1) {
                    
                    // set up a password field!
                    alert("This presentation requires a password. Here at Timeglider, we're rebuilding our presentation system. Come back soon!");
                    
                  } else {
                    // some other kind of error
                    alert(data.error);
                  }
                  
                  
                  return false;
                } else {
                  M.parseTimelineData(data, callback);
                }
            
              });
      
          }// end [obj vs remote]
          
          
          M.loadedSources.push(src);
        
        
        } 
    
    
    } else {
      // NO INITIAL DATA:
      // That's cool. We still build the timeline
      // focusdate has been set to today
      // !AUTH: USED IN AUTHORING MODE
      this.timelineDataLoaded = true;
      this.setZoomLevel(Math.floor((this.max_zoom + this.min_zoom) / 2));
      this.tryLoading();
      
    }
  
  },
  
  
  // click coming from marker on Google map
  mapMarkerClick: function(ev) {
    this.focusToEvent(ev);
  },
  
  getTimelineCollection: function() {
    return this.timelineCollection;
  },
  
  timelineTitleClick: function(timeline_id) {
    $.publish(container_name + ".mediator.timelineTitleClick", {timeline_id:timeline_id});
  },
    
    
  /*
  *  getTableTimelineData
  *  @param table_id {string} the html/DOM id of the table
  *  @return timeline data object ready for parsing
  *
  */
  getTableTimelineData : function (table_id) {
  
    var tl = {},
        now = 0,
        keys = [], field, value,
          event_id = '',
          $table = $(table_id);
  
      // timeline head
      tl.id = table_id.substr(1);    
      tl.title = $table.attr("title") || "untitled";
      tl.description = $table.attr("description") || "";
      tl.focus_date = $table.attr("focus_date") || TG_Date.getToday();
      tl.initial_zoom = $table.attr("initial_zoom") || 20;
      tl.events = [];
  
    $table.find('tr').each(function(i){
  
          var children = $(this).children(),
            row_obj;
  
          // first row -- <th> or <td>, gather the field names
          if ( i === 0 ) {
  
            keys = children.map(function(){
                // using "tg-*" map each column to the corresponding data
                return $(this).attr( 'class' ).replace( /^.*?\btg-(\S+)\b.*?$/, '$1' );
            }).get();
  
          } else {
        // i.e. an event
            row_obj = {};
  
        children.each(function(i){
          field = keys[i];
          
          if (field == "description"){
            value = $(this).html();
          } else {
            value = $(this).text();
          }
          
          // TODO: VALIDATE EVENT STUFF HERE
  
          row_obj[ field ] = value;
        });
        event_id = 'ev_' + now++;
        row_obj.id = event_id;
            tl.events.push(row_obj);
  
          } // end if-else i===0
  }); // end .each()
  
      $table.css("display", "none");
      return tl;
  },
  
  
  runLoadedTimelineCallback: function(callback, data) {
    
    var args = callback.args || "";
    callback.fn(args, data);
    
    if (callback.display) {
      //debug.log("callback DISPLAY true...");
      this.showSingleTimeline(data[0].id);
    } else if (callback.toggle) {
      //debug.log("callback TOGGLE true...");
      this.toggleTimeline(data[0].id);
    }
    
  },
  
 
  /*
  * parseTimelineData
  * @param data {object} Multiple (1+) timelines object 
  * derived from data in loadTimelineData
  */
  parseTimelineData : function (json, callback) {
      
    var data = "",
      me = this;
    if (typeof json.presentation == "string") {
      
      timeglider.mode = "presentation";
      
      data = json.timelines;
      
      // get presentation info
      me.initial_timelines = json.initial_timelines;
      
      // ALSO, LEGEND
      me.presentation = {
        title:json.title,
        description:json.description,
        open_modal:json.open_modal,
        focus_date:new tg.TG_Date(json.focus_date),
        initial_zoom:json.initial_zoom
      }
    
    } else {
      data = json;
    }

    var M = this,
      ct = 0,
      dl = data.length, 
      ti = {}, 
      ondeck = {};
  
    for (var i=0; i<dl;i++) {
    
      ondeck = data[i];
      ondeck.mediator = M;
          
      ti = new tg.TG_Timeline(ondeck).toJSON(); // the timeline
          
      if (ti.id.length > 0) {
        ct++;
        M.swallowTimeline(ti);
      }
      
  
    }
    
    // TYPICALLY A SECONDARY (user-called from page) LOAD
    // WHICH MIGHT HAVE CUSTOMIZD CALLBACK ACTIONS...
    
    if (callback && (typeof callback.fn == "function" || typeof callback == "function")) {
      
      
      if (typeof callback == "function") {
        callback = {fn:callback};
      }
      
      // $.publish(container_name + ".mediator.timelineDataLoaded");

      setTimeout(function() {
        M.runLoadedTimelineCallback(callback, data);
      }, 100);
      
      if (callback.display || callback.toggle) {
        return false;
      }

    } 
  

    if (ct === 0) {
      alert("ERROR loading data: Check JSON with jsonLint");
    } else {
      this.timelineDataLoaded = true;
      this.tryLoading();
    }
  
  },
  
  
  
  
  /*
  *  tryLoading
  *  Sees if all criteria for proceeding to display the loaded data
  *  are complete: data, image sizeing and others
  *
  */
  tryLoading : function () {
    
    var a = (this.imagesSized == this.imagesToSize),
        b = (this.timelineDataLoaded == true);
  
    
    if (a && b) {
        
        this.setInitialTimelines();
            
        if (this.timelineCollection.length == 1) {  
            
        // IF SINGLE TIMELINE
        tl = MED.timelineCollection.at(0);
        this.singleTimelineID = tl.get("id");
      }
      
      
      $.publish(container_name + ".mediator.timelineDataLoaded");
      
      
      }
        
    
  },
  
  


    /* Makes an indexed array of timelines */
    swallowTimeline : function (obj) {

    this.sole_timeline_id = obj.id;
    this.timelineCollection.add(obj);
      
    // MAY NOT NEED THIS WITH Backbone Collection change-binding
    // $.publish(container_name + ".mediator.timelineListChangeSignal");
    },
    



    /* 
    now loads multiple initial timelines: make sure
    to set the "top" attributes of timelines to make sure
    they don't overlap when initially loaded
    */
    setInitialTimelines : function () {
        
    var me = this;
    
    // PART I
    // What are the initially loaded timelines (ids) ?
      
    if (me.initial_timelines.length > 0) {
      debug.log("initial_timelines:", me.initial_timelines);
      
      me.activeTimelines = me.initial_timelines;      
    
    } else {      
      // initial timelines set by widget settings
      var initial_timelines = me.initial_timeline_id,
      first_focus_id = "";
      
      // i.e. it's an array
          if (typeof initial_timelines == "object") {
            // set first timeline in array as one to focus on
            first_focus_id = this.initial_timeline_id[0];
            // make all specified ids active
            _.each(initial_timelines, function (id) {
              me.activeTimelines.push(id);
            });
            
          } else if (initial_timelines.length > 0){
            // not an array: a string would be single id or ""
            first_focus_id = this.initial_timeline_id || this.sole_timeline_id;
            me.activeTimelines = [first_focus_id];
          } else if (this.timelineCollection.length > 0) {
            // in case there is no initial id
            first_focus_id = this.timelineCollection.pluck("id")[0];
            me.activeTimelines = [first_focus_id];
          }
      }
      
      // PART II
      // Set the timeline up according to initial_timeline
      // or single timeline or presentation
        
      
        if (timeglider.mode == "presentation") {
          
          // do nothing??
          
        } else if (timeglider.mode == "authoring") {
          // no timelines loaded right away
          me.setZoomLevel(40);
          
        } else if (first_focus_id) {
        
          // we need to wait just a bit...
      setTimeout(function () { 
        
        // timeline on which to focus is first/only
        var tl = me.timelineCollection.get(first_focus_id);
        var tl_fd = tl.get("focusDateObj");
      
        me.setFocusDate(tl_fd);
      
        // resetting zoomLevel will refresh
        me.setZoomLevel(tl.get("initial_zoom"));
        
      }, 500);
      
    } else {
      // could be no timelines to load
      me.setZoomLevel(40);
    }
      
    }, 


  refresh : function () {
    $.publish(container_name + ".mediator.refreshSignal");       
    },

    
    setTicksReady : function (bool) {
        this.ticksReady = bool;
        
        this.startSec = this._focusDate.sec;
                
        if (bool === true) { 
          $.publish(container_name + ".mediator.ticksReadySignal");
        }
   
    },

    
    
     /*
    *  setTimeoffset
    *  @param offset [String] eg: "-07:00"
    *      
    */
    setTimeoffset : function (offsetStr) {
        this.timeOffset = TG_Date.getTimeOffset(offsetStr);
        this.refresh();
    },
    
    
    // timezone hours/minutes ofset
    getTimeoffset : function () {
        return this.timeOffset;
    },
    
    
    /*
    *  setTimeoffset
    *  @param offset [String] eg: "-07:00"
    *      
    */
    setDimensions : function (d) {
      // added by ndg for Shanti (11/13/12) to record new height ration with old heigth
      // to spread or collapse events as vertical height is changed
      if(typeof(this.dimensions == "object") && typeof(d) == "object" && d.container.height > 500) {
        d.container.ratio = d.container.height / 500;
      } else {
        d.container.ratio = 1;
      }
       this.dimensions = d;
        // debug.log("dimensions:", d);
    },
      
    /*
    *  setFocusDate
    *  @param fd [TG_Date instance]
    *      
    */
    setFocusDate : function (fd) {
     
    if (fd != this._focusDate) {
      this._focusDate = fd; 
        }
    },
    
    getFocusDate : function () {
        return this._focusDate;
    },
      
      
    
    /*
    * getZoomLevel
    * @return {Number} zoom level number from 1 to 100
    *
    *
    *
    */
    getZoomLevel : function () {
        return parseInt(this._zoomLevel);
    },
    
    
        
    mouseWheelChange: function(dir) {
    
      var zl = this.getZoomLevel();
    this.setZoomLevel(zl += dir);
    
    $.publish(container_name + ".mediator.mouseWheelChange");
    
    },


  /* 
  *  setZoomLevel
  *  This in turn sets other zoomInfo attributes : width, label, tickWidth
  *  Other zoom info comes from the zoomTree array
  *  @param z ==> integer from 1-100
  *  
  */
  setZoomLevel : function (z) {
      
     if (z < 1) { z = 1; }
      
      
    if (z==1 || (z <= this.max_zoom && z >= this.min_zoom)) {
    
      // focusdate has to come first for combined zoom+focusdate switch
      this.startSec = this._focusDate.sec;

      if (z != this._zoomLevel) {
          this._zoomLevel = z;
          this._zoomInfo = tg.zoomTree[z];
          $.publish(container_name + ".mediator.zoomLevelChange");
          $.publish(container_name + ".mediator.scopeChange");
          return true
      } else {
          return false;
      }
      // end min/max check
    } else { return false; }
  
  }, 


  /*
  *  getZoomInfo
  *  @return obj {Object} with 
  *          zoomLevel (Number), label (String), tickWidth (Number), unit (String)
  *
  */
  getZoomInfo : function () {
    return this._zoomInfo;
  },
  
  
  
  /* 
   * from click etc. on page, what is the date?
   */
  getDateFromOffset: function (dp_x) {
    var me = this,
      ctnr = me.dimensions.container,
      Cw = ctnr.width,
        Cx = dp_x - (ctnr.offset.left),
        offMid = Cx - Cw/2,
        secPerPx = me.getZoomInfo().spp,
        fdSec = me.getFocusDate().sec,
      dcSec = Math.floor(fdSec + (offMid * secPerPx));
      
      return new TG_Date(dcSec);
  },
  
  
  // incoming: {name:"dblclick", event:e, dimensions:me.dimensions}
  registerUIEvent: function (info) {
    var me = this;
    switch(info.name) {
      case "dblclick": case "dbltap":
      // info comes with 
        
        var clickDate = me.getDateFromOffset(info.event.pageX);
        ////////////////////////////
        
        $.publish(container_name + ".mediator.dblclick", {date:clickDate});
        
      break;
    }
  },
        
        
        
  /*
  *  setFilters
  *  @param obj {Object} containing: 
  *         origin ("clude", "legend", "tags"), include (Str), exclude (Str), legend (Obj)
  *
  */
    setFilters : function (obj) {
    
      var me = this;
      
    switch (obj.origin) {
    
      case "clude":
        this.filters.include = obj.include;
        this.filters.exclude = obj.exclude;
      break;
            
      
      case "tags":
        if (obj.tags) {
          this.filters.tags = obj.tags.split(",");
        } else {
          this.filters.tags = [];
        }
      break;
      
      
      case "legend":
        
        // subtract the icons folder URL...
        // starting icon with "shapes/" etc.
        var icon = obj.icon.replace(me.options.icon_folder, "");
  
        if (icon == "all") {
          this.filters.legend = [];
          $.publish(container_name + ".mediator.legendAll");
        } else {
                    
          if (_.indexOf(this.filters.legend, icon) == -1) {
            this.filters.legend.push(icon);
          } else {
            // remove it
            var fol = this.filters.legend;
            var fr = [];
            fr = $.grep(fol, function (a) { return a != icon; });
            this.filters.legend = fr;
          }
        
         } // end if/else for "clear"
          
      break;
      
      
      case "custom": 
        if (obj.action == "add") {
          this.filters.custom = obj.fn;
          // debug.log("this.filters.custom:", this.filters.custom);
        } else {
          delete this.filters.custom;
        }
      break;
    
    } // end switch
      
      
        $.publish(container_name + ".mediator.filtersChange"); 
        // $.publish(container_name + ".mediator.scopeChange");
        
           
        this.refresh();
  },
         

  getTicksOffset : function () {
    return this._ticksOffset;
  },


  setTicksOffset : function (newOffset) {
    // This triggers changing the focus date
    // main listener hub for date focus and tick-appending
    this._ticksOffset = newOffset;
    
    // In other words, ticks are being dragged!
    $.publish(container_name + ".mediator.ticksOffsetChange");
    $.publish(container_name + ".mediator.scopeChange");
  },



  /*
  *  getTickBySerial
  *  @param serial {Number} serial date unit number (rata die, monthnum, year, etc)
  *
  *  @return {Object} info about _existing_ displayed tick
  *
  */
  getTickBySerial : function (serial) {
    var ta = this.ticksArray,
    tal = ta.length;
    for (var t=0; t<tal; t++) {
      var tick = ta[t];
      if (tick.serial == serial) { return tick; }
    }
    return false;
  },



  /*
  *  addToTicksArray
  *  @param obj {Object} 
  *     serial: #initial tick
  *     type:init|l|r
  *     unit:ye | mo | da | etc
  *     width: #px
  *     left: #px
  *  @param focusDate {TG_Date}
  *    used for initial tick; others set off init
  */
  addToTicksArray : function (obj, focusDate) {
    
    // var ser = 0;
    
    if (obj.type == "init") {
      // CENTER
      obj.serial = TG_Date.getTimeUnitSerial(focusDate, obj.unit);
      this.ticksArray = [obj];
    } else if (obj.type == "l") {
      // LEFT
      obj.serial = this.ticksArray[0].serial - 1;
      this.ticksArray.unshift(obj);
    } else {
      // RIGHT SIDE
      obj.serial = this.ticksArray[this.ticksArray.length -1].serial + 1;
      this.ticksArray.push(obj);
    }
    
    // this.ticksArrayChange.broadcast();
    $.publish(container_name + ".mediator.ticksArrayChange");
    
    return obj.serial;
  },


  showSingleTimeline: function(id) {
    this.activeTimelines = [];
    this.toggleTimeline(id);
    
  },


  toggleTimeline : function (id) {
    
    // patch until we have better multi-timeline support
    // this is a true "toggle" in that it clears visible
    // timelines and loads the new timeline by id

    var tl = this.timelineCollection.get(id).attributes;
    
    var refresh = false;
        
    var active = _.indexOf(this.activeTimelines, id);
    
  
    if (active == -1) {
      // timeline not active ---- bring it on
      this.activeTimelines.push(id);

      // timeline focus_date is ISO-8601 basic;
      // interface focusdate needs a TG_Date()
      var tl_fd = new TG_Date(tl.focus_date);
      
      // setting FD does NOT refresh
      this.setFocusDate(tl_fd);
      
      // resetting zoomLevel will refresh
      this.setZoomLevel(tl.initial_zoom);
      
      if (tl.initial_zoom == this.getZoomLevel()) {
        refresh = true;
      }
      
    
    } else {
      // it's active, remove it
      this.activeTimelines.splice(active,1);
      refresh = true;
    }
    
    if (refresh) {
      this.refresh();
    }
    
    $.publish(container_name + ".mediator.activeTimelinesChange");
  
  },
           
  /*
  *  reportImageSize
  *  @param img {Object} has "id" of event, "src", "width" and "height" at least
  *  
  *  This information is reported from TG_Timeline as data is loading. Since image
  *  size gathering sidetracks from data loading, there's a 
  */
  reportImageSize : function (img) {
   
    var ev = MED.eventCollection.get(img.id);
    
    if (ev.has("image")) {
      if (!img.error) {
        ev.attributes.image.width = img.width;
        ev.attributes.image.height = img.height;
      } else {
        ev.attributes.image = {};
        debug.log("WHOOPS: MISSING IMAGE: " + img.src);
      }
    
      this.imagesSized++;
    
      if (this.imagesSized == this.imagesToSize) {
        // if there are images, this would usually be
        // the last step before proceeding
        this.tryLoading();
      }
    }
  }

  

///// end model prototype object
}; 
        
        
tg.getLowHigh = function (arr) {
  
  var sorted = _.sortBy(arr, function(g){ return parseInt(g); });
  
  return {"low":_.first(sorted), "high":_.last(sorted)}

};
        
tg.updatePageStyles = function (sel, style) {
  var stdef = $('style').text();
  var stylestr = ' {';
  if(typeof(style) == 'object') {
    for(var s in style) {
      stylestr += s + ": " + style[s] + '!important; ';
    }
  } else if ($.trim(style) != ''){
    stylestr += style + '!important;' + "\n";
  }
  stylestr += ' } ';

  if(stdef.indexOf(sel) > 0 ) {
    var regex = RegExp(sel + '[^\}]+\}');
    stdef = stdef.replace(regex, sel + stylestr);
  }  else {
    stdef += ' ' + sel + stylestr;
  }
  $("style").text(stdef);
};
        
tg.validateOptions = function (widget_settings) { 
  
  this.optionsMaster = { 
    initial_focus:{type:"date"}, 
    timezone:{type:"timezone"},
      editor:{type:"string"}, 
      backgroundColor:{type:"color"}, 
      backgroundImage:{type:"color"}, 
      min_zoom:{type:"number", min:1, max:100}, 
      max_zoom:{type:"number", min:1, max:100}, 
      initial_zoom:{type:"number", min:1, max:100}, 
      show_centerline:{type:"boolean"}, 
      display_zoom_level:{type:"boolean"}, 
      data_source:{type:"url"}, 
      basic_fontsize:{type:"number", min:9, max:100}, 
      mouse_wheel:{type:"string", possible:["zoom","pan"]}, 
      initial_timeline_id:{type:"mixed"},
      icon_folder:{type:"string"},
      max_modals:{type:"number"},
      show_footer:{type:"boolean"},
      display_zoom_level:{type:"boolean"},
      constrain_to_data:{type:"boolean"},
      boost:{type:"number", min:0, max:99},
      event_modal:{type:"object"},
      event_overflow:{type:"string"}
    }
    
  // msg: will be return value: validates when empty 
  // change lb to <br> if the error is returned in HTML (vs alert())
  var me = this, msg = "", lb = "\n";

  $.each(widget_settings, function(key, value) { 

    if (me.optionsMaster[key]) {

      switch (me.optionsMaster[key].type) {
        case "string": 
          if (typeof value != "string") { msg += (key + " needs to be a string." + lb); }
          if (me.optionsMaster[key].possible) {
            if (_.indexOf(me.optionsMaster[key].possible, value) == -1) {
              msg += (key + " must be: " + me.optionsMaster[key].possible.join(" or "));
            }
          }
        break;

        case "number":
          if (typeof value != "number") { msg += (value + " needs to be a number." + lb); }
          if (me.optionsMaster[key].min) {
            if (value < me.optionsMaster[key].min) {
              msg += (key + " must be greater than or equal to " + me.optionsMaster[key].min + lb);
            }
          }

          if (me.optionsMaster[key].max) {
            if (value > me.optionsMaster[key].max) {
              msg += (key + " must be less than or equal to " + me.optionsMaster[key].max + lb);
            }
          }
        break;

        case "date":
          // TODO validate a date string using TG_Date...
        break;
        
        case "timezone":
          
          var cities = ["New York", "Denver", "Chicago", "Los Angeles"];
          var pattern = /[+|-]?[0-9]+:[0-9]+/;
            if ((_.indexOf(cities, value) == -1) && (value.match(pattern) == -1)) { 
              msg += ("The timezone is not formatted properly");
            }
            
        break;

        case "boolean":
          if (typeof value != "boolean") msg += (value + " needs to be a boolean." + lb);
        break;

        case "url":
          // TODO test for pattern for url....
        break;

        case "color":
          /// TODO test for pattern for color, including "red", "orange", etc
        break;

        case "mixed":
          /// TODO test for pattern for color, including "red", "orange", etc
        break;
      }
    }
  }); // end each

  return msg;

};

        
       
})(timeglider);

/*
 * Timeglider for Javascript / jQuery 
 * http://timeglider.com/jquery
 *
 * Copyright 2011, Mnemograph LLC
 * Licensed under Timeglider Dual License
 * http://timeglider.com/jquery/?p=license
 *
/*

*         DEPENDENCIES: 
                        rafael.js
                        ba-tinyPubSub
                        jquery
                        jquery ui (and css)
                        jquery.mousewheel
                        jquery.ui.ipad
                        
                        TG_Date.js
                        TG_Timeline.js
                        TG_TimelineView.js
                        TG_Mediator.js
                        TG_Org.js
                        Timeglider.css
*
*/




(function($){
  /**
  * The main jQuery widget factory for Timeglider
  */
  
  var timelinePlayer, 
    tg = timeglider, 
    MED,
    TG_Date = timeglider.TG_Date;
    
  tg.bcolors = '';
  tg.fcolors = '';
  
  $.widget( "timeglider.timeline", {
    
    // defaults!
    options : { 
      base_namespace:"tg",
      timezone:"-04:00",
      initial_focus:tg.TG_Date.getToday(), 
      editor:'none', 
      min_zoom : 1, 
      max_zoom : 100, 
      show_centerline:true, 
      data_source:"", 
      culture:"en",
      base_font_size:16, 
      mouse_wheel: "zoom", // !TODO | pan 
      initial_timeline_id:'',
      icon_folder:'images/timeglider/icons/',
      image_lane_height: 32,
      show_footer:true,
      display_zoom_level:false,
      constrain_to_data:true,
      boost:0,
      tick_top:'', 
      event_modal:{href:'', type:'default'},
      event_overflow:"plus",  // plus | scroll,
      loaded: null
    },
    
    _create : function () {
    
      this._id = $(this.element).attr("id");
      /*
      Anatomy:
      *
      *  -container: main frame of entire timeline
      *  -centerline
      *  -truck: entire movable (left-right) container
      *  -ticks: includes "ruler" as well as events
      *  -handle: the grabbable part of the truck which 
      *           self-adjusts to center
      *  -slider-container: wrapper for zoom slider
      *  -slider: jQuery UI vertical slider
      *  -timeline-menu
      *
      *  -measure-span: utility div for measuring text lengths
      *
      *  -footer: (not shown) gets added dynamically unless
      *           options indicate otherwise
      */
      // no need for template here as no data being passed
      var MAIN_TEMPLATE = "<div class='timeglider-container'>"
        + "<div class='timeglider-loading'><div>loading</div></div>"
        + "<div class='timeglider-centerline'></div>"
        
        + "<div class='timeglider-truck' id='tg-truck'>"
        + "<div class='timeglider-ticks noselect'>"
        + "<div class='timeglider-handle'></div>"
        
        + "</div>"
        + "</div>"
        
        + "<div class='timeglider-slider-container noselect'>"
        + "<div class='tg-slider-plusminus tg-slider-plus tg-zoom-in'></div>"
        + "<div class='timeglider-slider'></div>"
        + "<div class='tg-slider-plusminus tg-slider-minus tg-zoom-out'></div>"
        + "<div class='timeglider-pan-buttons'>"
        + "<div class='timeglider-pan-left'></div><div class='timeglider-pan-right'></div>"
        + "</div>"
        + "</div>"
        
        + "<div class='tg-scrim'></div>"
        
        
        + "<div class='timeglider-footer'>"
        + "<div class='timeglider-logo' style='background-image: none;'>Courtesy of <a href='https://timeglider.com/' target='_blank' style='color: white'>Timeglider</a></div>" 
        
        + "<div class='tg-footer-center'>"
        + "<div class='tg-prev tg-prevnext'><a>prev</a></div>"
        + "<div class='tg-date-display noselect'><div class='tg-date-display-arrow'></div><span></span></div>"
        + "<div class='tg-next tg-prevnext'><a>next</a></div>"
        + "</div>"
        
              
        + " <div class='timeglider-footer-button timeglider-filter-bt' style='display: none;'></div>"
        + " <div class='timeglider-footer-button timeglider-settings-bt' style='display: none;'></div>"
        + "</div>"
        + "<div class='timeglider-event-hover-info'></div>"
        + "</div><span id='timeglider-measure-span'></span>";
      
      this.element.html(MAIN_TEMPLATE);
    
    }, // eof _create()
    
    /**
    * takes the created template and inserts functionality
    *  from Mediator and View constructors
    *
    *
    */
    _init : function () {
      
      // validateOptions should come out as empty string
      var optionsCheck = timeglider.validateOptions(this.options);
      
      if (optionsCheck == "") {
      
        tg.TG_Date.setCulture(this.options.culture);
        MED = new tg.TG_Mediator(this.options, this.element);
        timelinePlayer = new tg.TG_TimelinePlayer(this, MED);
        
        this.player = timelinePlayer;
        
        // after timelinePlayer is created this stuff can be done
        MED.setFocusDate(new TG_Date(this.options.initial_focus));
        MED.loadTimelineData(this.options.data_source, this.options.loaded);
        
        // Timeline events HTML 5 Messaging: 1. center date changed (timeline drag), 2. event clicked
        // Added by ndg for SHIVA
       $('.timeglider-ticks').bind('drag',function() {
          var scope = MED.getScope();
          shivaLib.SendShivaMessage("ShivaTime=move", scope.focusMS + "|" + scope.leftMS + "|" + scope.rightMS);
        });
        // binds opening event modals to messaging ndg added for SHIVA
        $('.timeglider-timeline-event').live('click', function() {
           var teid = ($(this).attr('id').split('-')).pop();
           shivaLib.SendShivaMessage("ShivaTime=click" , teid);
         });
      } else {
        alert("Rats. There's a problem with your widget settings:" + optionsCheck);
      }
    },
  
    
    /** 
    *********  PUBLIC METHODS ***************
    *
    */
    
    /* 
    * goTo
    * sends timeline to a specific date and, optionally, zoom
    * @param d {String} ISO8601 date: 'YYYY-MM-DD HH:MM:SS'
    * @param z {Number} zoom level to change to; optional
    */
    goTo : function (d, z) {
      
      if (d == "next") {
        MED.gotoNextEvent();
      } else if (d == "previous") {
        MED.gotoPreviousEvent();
      } else {
        MED.gotoDateZoom(d,z);
      } 
      
      return this;
    },
    
    refresh : function () {
      MED.refresh();
      return this;
    },
    
    resize : function () {
      timelinePlayer.resize();
      return this;
    },
    
    // Added by ndg8f for use within SHIVA framework and manager
    // This function checks which options have been changed and if the options that have been changed are 'style' based options
    // it adjusts the page styles and returns true, indicating the timeline does not have to be rebuilt
    // otherwise returns false.
    setOptions : function (tlopts, set, events) {
      var otemp = $.extend({},tlopts);
      // optsEqual is a function to check whether a style option is being set if so do not reload timeline, just change the styles
      // if #cp_colorbar is visible then colorpicker is open and an option is being set so do the same
      var optsTheSame = this.optsEquals(otemp);
      
      if (optsTheSame && set != true) {
        return false;
      }
      
      // Header
      if ($('.tg-widget-header h2').eq(0).text() != tlopts.title) {
        $('.tg-widget-header h2').text(tlopts.title);
      }

      // Description
      if ($('.tg-timeline-description').eq(0).text() != tlopts.description) {
        $('.tg-timeline-description').eq(0).text(tlopts.description);
      }
           
      
      // Height and width 
      if(tlopts.width != $(this.element).eq(0).width() || tlopts.height != $(this.element).eq(0).height() ) {
        var con = '#' + $(this.element).attr('id');
        $(this.element).css('width', tlopts.width + "px");
        $(this.element).css('height', tlopts.height + "px");
      }
      
      // Whether or not to Show Zoom
      if(tlopts.display_zoom_level == 'true' && $('.timeglider-slider-container').is(':hidden')) {
        $('.timeglider-slider-container').show();
        shivaLib.SendShivaMessage('ScrollLeft');
      } 
      if (tlopts.display_zoom_level == 'false' && !$('.timeglider-slider-container').is(':hidden')) { 
        $('.timeglider-slider-container').hide();
      }
      
      // Image lane height
      if (tlopts.imglane_height != MED.image_lane_height) {
		MED.setImageLaneHeight(tlopts.imglane_height * 1);
		MED.refresh();
		timelinePlayer.setImageLaneHandle();
      }
      
      // Font face
      var ff = $('.timeglider-event-title').css('font-family');
      if(tlopts.font_name != '' && String($('.timeglider-event-title').css('font-family')).indexOf(tlopts.font_name) == -1) {
        setTimeout(function() {
          $('#containerDiv *, .tg-modal *').css('font-family',tlopts.font_name);
        }, 200);
      }
      
      // Font Color
      //  1 = main area font, 2 = header fonts for timeline and modals, 3 = text of modals
      if(tlopts.fontColors != '') {
        var fstyles =  {
          'main': '.timeglider-event-title',
          'head': '.tg-widget-header h2, .tg-modal h4', 
          'popup': '.tg-ev-modal-description, .tg-modal p, .tg-modal td',
          'links': '.tg-single-timeline-header ul li, .timeglider-ev-modal ul.timeglider-ev-modal-links li a'
        };

        var fcolors = tlopts.fontColors.replace(/,$/,'').split(',');
        for (var i in fcolors) {
          var pts = fcolors[i].split('=');
          var type = pts[0];
          var sel = fstyles[type];
          var newcolor = ('#' + pts[1]).replace('##','#');
          var prescolor = $(sel.split(',')[0]).css('color');
          if(typeof(prescolor) == "undefined" || prescolor == '' || prescolor.colorToHex() != newcolor) {
            $(sel).css({ 'color' : newcolor });
            tg.updatePageStyles(sel, { 'color' : newcolor });
            fstyles[type] = 'done';
          } else if (prescolor.colorToHex() == newcolor) {
            fstyles[type] = 'done';
          }
        }
        
        // remove any colors newly eliminated from choices.
        for (var t in fstyles) {
          if(fstyles[t] != 'done') {
            $(fstyles[t]).css({ 'color' : '' });
            tg.updatePageStyles(fstyles[t], '');
          }
        }
      }
      
      // Background Color
      // 1 = main background, 2 = event spans, 3 = header, footer, and zoom controls, 
      // 4 = modal boxes, 5 =  image lange, 6 = tick lane
      // E.g. "main=ff0000,eventspan=ff6000,head=ffbf00,popup=20ff00,imagelane=0040ff,ticklane=8000ff,"
      if (tlopts.backgroundColors != '') {
        var bstyles = {
          'main': '#tg-truck', 
          'eventspan': '.timeglider-event-spanner', 
          'head': '.tg-widget-header, .tg-widget-header h2, .timeglider-footer, .timeglider-slider-container', 
          'popup': '.timeglider-ev-modal, .timeglider-ev-modal *, .tg-timeline-modal', 
          'imagelane': '.tg-image-lane-bg', 
          'ticklane': '.tg-tick-body',
          'popuplink': '.timeglider-ev-modal-links li a',
          'none': ''
        };
        
        var bcolors = tlopts.backgroundColors.replace(/,$/,'').split(',');
        for (var i in bcolors) { 
          var pts = bcolors[i].split('=');
          var type = pts[0];
          var sel = bstyles[type];
          var newcolor = ('#' + pts[1]).replace('##','#');
          var prescolor = $(sel.split(',')[0]).css('background-color');
          if(typeof(prescolor) == "undefined" || prescolor == '' || prescolor.colorToHex() != newcolor) { 
              if(type == 'main') {
                $(sel).css({ 'background-color' : newcolor, 'background-image' : 'none' });
                $('.timeglider-container').css({ 'background-color' : newcolor, 'background-image' : 'none' });
              } else if (type == 'eventspan' || type == 'popup' || type == 'ticklane') {
                tg.updatePageStyles(sel, { 'background-color' : newcolor });
              } else {
                $(sel).css({ 'background-color' : newcolor });
                //tg.updatePageStyles('.tg-single-timeline-header h2', {'background' : 'transparent'});
              }
          }
          bstyles[type] = 'done';  // register this "type" as being done. If not "done", then it's css color will be removed below
        }
        
        for (var t in bstyles) {
          if(bstyles[t] != 'done') {
            $(bstyles[t]).css({ 'background-color' : ''});
          }
        }
      }
      
      // Adjust number of Modals
      tlopts.max_modals = parseInt(tlopts.max_modals);
      if(timelinePlayer.max_modals != tlopts.max_modals) {
        timelinePlayer.max_modals = tlopts.max_modals;
      }
      
      // Show Hide Description
      tlopts.show_desc = (tlopts.show_desc == 'true'); // convert to boolean
      if(tlopts.show_desc) {
        setTimeout(function() {
          $('li#info').click();
        }, 100);
      } else {
        setTimeout(function() {
          $('div.tg-timeline-modal li.tg-close').click();
        }, 100);
      }
      
      // Show Hide Footer
      tlopts.show_footer = (tlopts.show_footer == 'true');
      if(tlopts.show_footer) {
        setTimeout(function() {
          $('.timeglider-footer').show();
         /* var ch = $('.timeglider-container').height();
          $('.timeglider-container').height(ch + 25);*/
        }, 200);
      } else {
        setTimeout(function() {
          $('.timeglider-footer').hide();
          var ch = $('#containerDiv .timeglider-container').height();
          $('#containerDiv .timeglider-container').height(ch - 25);
        }, 800);
      }
      return true;  // return true that an on-the-fly option has been changed so timeline is not redrawn.
    },
    
    // checks the the style options subset of options sent and returns true if they are the same as previously set
    //  so if this returns true, it means only the style options have changed and we should NOT reload timeline
    optsEquals : function(o) {
      // the name of the options to be checked. All others ignored
      var optionsChecked = "title:description:width:height:display_zoom_level:fontColors:backgroundColors:max_modals:imglane_height:show_desc:show_footer:display_zoom_level:";
      for(var p in o) {
        if(optionsChecked.indexOf(p + ":") == -1) {
          delete o[p];
        }
      }
      var opts = propsToString(o);
      if(typeof(this.opts) == "undefined" || this.opts != opts ) {
        this.opts = opts;
        return false;
      } else {
        return true;
      }
    },
    
    // Creates a hash of event types normalizing the name into a lowercase key with dashes instead of spaces
    registerEvents : function(events) {
      var etypes = new Object();
      for (var i in events) {
        var e = events[i];
        if(typeof(e.type) == "string" && $.trim(e.type) != '') {
          var types = e.type.split(/,\s*/);
          for(var i in types) {
            var typeid = $.trim(types[i]).toLowerCase().replace(/\s/g,'-');
            if(typeof(etypes[typeid]) == "undefined") {
              etypes[typeid] = types[i];
            }
          }
        }
      }
      
      this.etypes = etypes;
    },
    
    // Writes the control box for turning on and off events by their type. 
    // checkboxes toggle events on and off based on type-classes added on line 3788
    // calls toggleEvents() function
    eventList : function() {
      
      var list = '<div id="etypelist" class="tg-modal timeglider-ev-modal ui-draggable" style="width: 200px; z-index: 1002; top: 40px; left: 260px; color: white; display: none;">' +
      '<div id="typesclose" class="tg-close-button tg-close-button-remove">x</div><div class="dateline"><span class="timeglider-dateline-startdate">Event Types</span></div><div class="tg-ev-modal-description"><table>';
      var evals = [];
      var p = 0;
      for(var i in this.etypes) {
        p++;
        evals.push([this.etypes[i],i]);
      }
      evals.sort();
  
      if( p > 0 ) {
        $('#etyplist, #typelistlinkitem').remove();
        for(var n in evals) {
           list += '<tr><td>' + evals[n][0] + 
              '</td><td><input id="etype-' + evals[n][1] + '" type="checkbox" checked="checked" onclick="toggleEvents(\'' + evals[n][1] + '\');"/></td></tr>';
        }
        list += '</table></div></div>';
        $('.tg-single-timeline-header ul').append('<li id="typelistlinkitem"><a onclick="$(\'#etypelist\').toggle();">types</a></li>');
        $('body').append(list);
        $('#typesclose').click(function() {
          $('#etypelist').hide();
        });
        
        window.checkevint = setInterval(checkEventVisibility, 10);
      }
    },
    
    setFocusDate : function(date) {
      MED.setFocusDate(new TG_Date(date));
      this.refresh();
    },
    
    filterBy : function (type, content) {
      MED.filterBy(type, content);
      return this;
    },

    addFilterAction: function (name, filterFunction, actionFunction) {
      MED.addFilterAction(name, filterFunction, actionFunction);
      return this;
    },
    
    removeFilterAction: function (name) {
      MED.removeFilterAction(name); 
      return this;
    },
    
    getMediator : function () {
      return MED;
    },
    
    
    
    /*
     * getEventByID
     * By passing just an id, this returns the whole event object
     * (or the attributes of the Backbone model)
     * By adding a property such as "title", you can just get one property
     * @param id {String} The event id, as it was passed in JSON data
     * @param prop {String} optional property name string in case you 
     *        only want that one property
    */
    getEventByID : function (id, prop) {
      return MED.getEventByID(id, prop);
    },
    
        
    updateEvent: function (model_object) {
      return MED.updateEvent(model_object);
    },
    
    /**
     * Added by ndg on (1/24/2013) to update event data with a json object sent by html 5 messaging 
     * 
     *  Not yet tested
     **/
    updateEventData: function(data, center_date) {
      // Process data which is an array of arrays (table-model with header row) into a JSON object
        events = {}
        var cols=data[0].length;   // Number of fields
        for (i=1;i<data.length;++i) {  // For each event
          o={};        // Fresh obj
          for (j=0;j<cols;++j)       // For each value
            o[data[0][j]]=data[i][j];  // Key value pair
          events[i]=o;       // Add to array
        }
        if (typeof(center_date) != "undefined" && center_date != "") {
          MED.setFocusDate(new TG_Date(center_date));
        }
        MED.loadTimelineData(events, this.options.loaded);
    },
    
    /*
     * focusToEvent
     * By passing just an id, this returns the whole event object
     * (or the attributes of the Backbone model)
     * By adding a property such as "title", you can just get one property
     * @param id {String} The event id, as it was passed in JSON data
     * @param prop {String} optional property name string in case you 
     *        only want that one property
    */
    focusToEvent : function (event_id) {
      var ev = MED.getEventByID(event_id);
      MED.focusToEvent(ev);
      
      return this;
    },
    
        
    getScope : function () {
      return MED.getScope();
    },
    
    
        
    fitToContainer : function () {
      MED.fitToContainer();
      
      return this;
    },
    
    
    
    /*
     * adjustNowEvents
     * keeps ongoing events current to the latest time
     * For this to work, events need a property in them
     * that looks like this:
     *    "keepCurrent": "start"
     *    OR
     *    "keepCurrent": "end"
     * The "start" value would update the startdate to be the 
     * current time and if start & end are the same, it would
     * update both;  the "end" value would update the enddate
     * only, creating a "leading edge" event with a continuous
     * "still happening" state
     */
    adjustNowEvents : function () {
      return MED.adjustNowEvents();
    },
    
    
    /*
     * addEvent
     * adds and event to any of the existing, loaded timelines
     * @param new_event {Object} simple TG event
              including: .id, .title, .startdate
              (as simple ISO8601 string)
     *
     */
    addEvent : function (new_event) {
      return MED.addEvent(new_event);
    },
    
    
    /**
    * zoom
    * zooms the timeline in or out, adding an amount, often 1 or -1
    *
    * @param n {number|string}
    *          numerical: -1 (or less) for zooming in, 1 (or more) for zooming out
    *          string:    "in" is the same as -1, "out" the same as 1
    */
    zoom : function (n) {
    
      switch(n) {
        case "in": n = -1; break;
        case "out": n = 1; break;
      }
      // non-valid zoom levels
      if (n > 99 || n < -99) { return false; }
      
      MED.zoom(n);
      this.refresh();
      return this;
    },
    
    
    /**
    * loadTimeline
    * basic wrapper for Mediator loadTimeline
    * callback_object includes:
    *     .fn = function that will be called
    *     .args = arguments Object that can be passed
    *     .display = boolean, set to true to swap in just
                     the first timeline loaded; otherwise
                     it will load but won't immediately display
    *     (fn also has timeline(s) available as "data" in 2nd arg)
    *               
    * 
    */
    loadTimeline : function (src, callback_object) {
      MED.loadedSources = [];
      MED.options.data_source[0].description = src[0].description;
      MED.loadTimelineData(src, callback_object);
      
      return this;
    },
    
    
    
    /**
    *  panButton
    *  sets a pan action on an element for mousedown and mouseup|mouseover
    *  
    *
    */
    panButton : function (sel, vel) {
      var _vel = 0;
      switch(vel) {
        case "left": _vel = 30; break;
        case "right": _vel = -30; break;
        default: _vel = vel; break;
      }
      timelinePlayer.setPanButton(sel, _vel);
    },
    
    
    /**
    * destroy 
    * wipes out everything
    */
    destroy : function () {
      $.Widget.prototype.destroy.apply(this, arguments);
      $(this.element).html("");
    }
  
  }); // end widget process

})(jQuery);

// adding rgb to hex function to string

String.prototype.colorToHex = function() {
  if (this.substr(0, 1) === '#') {
      return this;
  }
  var digits = /(.*?)rgb[a]?\((\d+), (\d+), (\d+)\)/.exec(this);
  if(digits == null) { return this;}
  var red = parseInt(digits[2]);
  var green = parseInt(digits[3]);
  var blue = parseInt(digits[4]);
  
  var rgb = blue | (green << 8) | (red << 16);
  return digits[1] + '#' + rgb.toString(16);
}

function propsToString(o) {
  var out = ''; 
  for(var p in o) { 
    if(p != "join") { 
      out += p + ":" + eval('o.' + p) + "::";
    } 
  } 
  return out.substr(0, out.length - 2);
}

// Toggle events based on classes with event type (classes created line 3788)
// Added by ndg for SHIVA 2013-01-31
function toggleEvents(type) {
  var tstr = '.etype-' + type;
  checkEventType(tstr);
  // If showing a previously hidden event, need to refresh the timeline
  if ($('#etype' + type).attr('checked') == "checked") {
    $('#' + shivaLib.container).timeline("refresh");
  }
}

function checkEventType(t) {
  $(t).each(function() {
    if(typeof($(this).attr('class')) == "string") {
      var classes = $(this).attr('class').split(/\s/);
      var hidden = true;
      for(var n in classes) {
        if(classes[n].indexOf('etype-') > -1) {
          if($('#' + classes[n]).attr('checked') == "checked") {
            hidden = false;
          }
        }
      }
      if(hidden) { $(this).hide(); } else { $(this).show(); }
    }
  });
}

// function to check event periodically initiated with setInterval when type list is created
function checkEventVisibility() {
 $("#etypelist input[type=checkbox]").each(function() {
      var tpid = $(this).attr('id');
      toggleEvents(tpid.replace('etype-',''));
  });
} 
