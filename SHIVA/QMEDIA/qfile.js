///////////////////////////////////////////////////////////////////////////////////////////////
//  QMEDIA FILE SYSTEM
///////////////////////////////////////////////////////////////////////////////////////////////
	
	
	function QmediaFile(host, version) 										// CONSTRUCTOR
	{
		qmf=this;																// Point to obj
		this.host=host;															// Get host
		this.version=version;													// Get version
		this.email=this.GetCookie("email");										// Get email from cookie
		this.curFile="";														// Current file
		this.password=this.GetCookie("password");								// Password
		this.butsty=" style='border-radius:10px;color#666;padding-left:6px;padding-right:6px' ";	// Button styling
		this.deleting=false;													// Not deleting
	}
	
	QmediaFile.prototype.Load=function() 									//	LOAD FILE
	{
		var str="<br/>"
		str+="If you want to load only projects you have created, type your email address. To load any project, leave it blank. If you want to load a private project, you will need to type in its password. The email is not required.<br>"
		str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
		str+="<tr><td><b>Email</b></td><td><input"+this.butsty+"type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
		str+="<tr><td><b>Password&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
		str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
		str+="<button"+this.butsty+"id='logBut'>Login</button>";	
		str+="<button"+this.butsty+"id='cancelBut'>Cancel</button></div>";	
		this.ShowLightBox("Login",str);
		var _this=this;															// Save context
		
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	
		$("#logBut").button().click(function() {								// LOGIN BUTTON
			_this.ListFiles();													// Get list of files
			});
	}	

	QmediaFile.prototype.Delete=function(undelete) 							//	DELETE FILE
	{
		var str="<br/>"
		str+="Type your email address and password.<br>"
		str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
		str+="<tr><td><b>Email</b></td><td><input"+this.butsty+"type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
		str+="<tr><td><b>Password&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
		str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
		str+="<button"+this.butsty+"id='logBut'>Login</button>";	
		str+="<button"+this.butsty+"id='cancelBut'>Cancel</button></div>";	
		this.ShowLightBox("Login",str);
		var _this=this;															// Save context
		
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	
		$("#logBut").button().click(function() {								// LOGIN BUTTON
			_this.ListFiles( undelete ? "undelete" : "delete"	);				// Get list of files
			});
	}	

	QmediaFile.prototype.Save=function(saveAs) 								//	SAVE FILE TO DB
	{
		var str="<br/>"
		if (saveAs)																// If save as...
			curShow=this.curFile="";											// Force a new file to be made
		str+="Type your email address. To load any project. Type in a password to protect it. Set the private checkbox if you want to make the project private only to you. <br>"
		str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
		str+="<tr><td><b>Email</b><span style='color:#990000'> *</span></td><td><input"+this.butsty+"type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
		str+="<tr><td><b>Password</b><span style='color:#990000'> *</span>&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
		str+="<tr><td><b>Private?&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='checkbox' id='private'/></td></tr>";
		str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
		str+="<button"+this.butsty+"id='saveBut'>Save</button>";	
		str+="<button"+this.butsty+"id='cancelBut'>Cancel</button></div>";	
		this.ShowLightBox("Save project",str);
		var _this=this;															// Save context
		
		$("#saveBut").button().click(function() {								// SAVE BUTTON
			var dat={};
			_this.password=$("#password").val();								// Get current password
			if (_this.password)													// If a password
				_this.password=_this.password.replace(/#/g,"@");				// #'s are a no-no, replace with @'s	
			_this.email=$("#email").val();										// Get current email
			var pri= $("#private").prop("checked") ? 1 : 0						// Get private
			
			if (!_this.password && !_this.email) 								// Missing both
				 return _this.LightBoxAlert("Need email and password");			// Quit with alert
			else if (!_this.password) 											// Missing password
				 return _this.LightBoxAlert("Need password");					// Quit with alert
			else if (!_this.email) 												// Missing email
				 return _this.LightBoxAlert("Need email");						// Quit with alert

			_this.SetCookie("password",_this.password,7);						// Save cookie
			_this.SetCookie("email",_this.email,7);								// Save cookie
			$("#lightBoxDiv").remove();											// Close
			var url=_this.host+"saveshow.php";									// Base file
			dat["id"]=curShow;													// Add id
			dat["email"]=_this.email;											// Add email
			dat["password"]=_this.password;										// Add password
			dat["ver"]=_this.version;											// Add version
			dat["private"]=pri;													// Add private
			dat["script"]="LoadShow("+JSON.stringify(curJson,null,'\t')+")";	// Add jsonp-wrapped script
			if (curJson.title)													// If a title	
				dat["title"]=AddEscapes(curJson.title);							// Add title
			else if ((qmf.version == 1) && curJson[0]) {						// If ME
				str=curJson[0].title.replace(/<.*?>/g,"");						// Remove all tags
				str=str.replace(/[\r|\n]/g,"");									// No CR/LFs
				dat["title"]=AddEscapes(str);		 							// Add title
				}
			$.ajax({ url:url,dataType:'text',type:"POST",crossDomain:true,data:dat,  // Post data
				success:function(d) { 			
					if (d == -1) 												// Error
				 		AlertBox("Error","Sorry, there was an error saving that project.(1)");		
					else if (d == -2) 											// Error
				 		AlertBox("Error","Sorry, there was an error saving that project. (2)");		
					else if (d == -3) 											// Error
				 		AlertBox("Wrong password","Sorry, the password for this project does not match the one you supplied.");	
				 	else if (d == -4) 											// Error
				 		AlertBox("Error","Sorry, there was an error updating that project. (4)");		
				 	else if (!isNaN(d)){										// Success if a number
				 		curShow=this.curFile=d;									// Set current file
						Sound("ding");											// Ding
						Draw();												// Redraw menu
						}
					},
				error:function(xhr,status,error) { trace(error) },				// Show error
				});		
			});
	
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	}
	
	QmediaFile.prototype.LoadFile=function(id) 								//	LOAD A FILE FROM DB
	{
		id=id.substr(3);														// Strip off prefix
		$("#lightBoxDiv").remove();												// Close
		var url=this.host+"loadshow.php";										// Base file
		url+="?id="+id;															// Add id
		if (this.password)														// If a password spec'd
			url+="&password="+this.password;									// Add to query line
		this.curFile=id;														// Set as current file
		$.ajax({ url:url, dataType:'jsonp'});									// Get data and pass to LoadProject() in Edit
	}	
		
	QmediaFile.prototype.DeleteFile=function(id, status) 					//	FLAG A FILE AS  DELETED/ UN-DELETED IN DB
	{
		var dat={};
		id=id.substr(3);														// Strip off prefix
		$("#lightBoxDiv").remove();												// Close
		var url=this.host+"saveshow.php";										// Base file
		dat["id"]=id;															// Add id
		dat["password"]=this.password;											// Add password
		dat["deleted"]=status;													// Delete or undelete (1=delete, 0=undelete)
		$.ajax({ url:url,dataType:'text',type:"POST",crossDomain:true,data:dat, // Post data
				success:function(d) { 			
				if (d == -3) 	AlertBox("Wrong password","Sorry, the password for this project does not match the one you supplied.");	
				else			Sound("ding");
				}
		});																		// Get data and pass to LoadProject()
	}	

	QmediaFile.prototype.ListFiles=function(deleting) 						//	LIST PROJECTS IN DB
	{
		this.email=$("#email").val();											// Get current email
		this.password=$("#password").val();										// Get current password
		if (this.password)														// If a password
			this.password=this.password.replace(/#/g,"@");						// #'s are a no-no, replace with @'s	
		if (deleting) {
			if (!this.password && !this.email) 									// Missing both
				 return this.LightBoxAlert("Need email and password");			// Quit with alert
			else if (!this.password) 											// Missing password
				 return this.LightBoxAlert("Need password");					// Quit with alert
			else if (!this.email) 												// Missing email
				 return this.LightBoxAlert("Need email");						// Quit with alert
			}
		this.SetCookie("password",this.password,7);								// Save cookie
		this.SetCookie("email",this.email,7);									// Save cookie
		this.deleting=deleting;													// Deleting status
		var url=this.host+"listshow.php?ver="+this.version;						// Base file
		if (this.email)															// If email
			url+="&email="+this.email;											// Add email and deleted to query line
		url+="&deleted=";														// Add to query line
		url+=(deleting == "undelete") ? 1 : 0									// Add deleted status
		$.ajax({ url:url, dataType:'jsonp', complete:function() { Sound('click'); } });	// Get data and pass qmfListFiles()
	}
	
	function qmfListFiles(files)											// CALLBACK TO List()
	{
		var trsty=" style='height:20px;cursor:pointer' onMouseOver='this.style.backgroundColor=\"#dee7f1\"' ";
		trsty+="onMouseOut='this.style.backgroundColor=\"#f8f8f8\"' onclick='";
		if (qmf.deleting == "delete")		 trsty+="qmf.DeleteFile(this.id,1)'";	// Delete
		else if (qmf.deleting == "undelete") trsty+="qmf.DeleteFile(this.id,0)'";	// Undelete
		else								 trsty+="qmf.LoadFile(this.id)'";		// Load
		qmf.password=$("#password").val();										// Get current password
		if (qmf.password)														// If a password
			qmf.password=qmf.password.replace(/#/g,"@");						// #'s are a no-no, replace with @'s	
		qmf.SetCookie("password",qmf.password,7);								// Save cookie
		qmf.email=$("#email").val();											// Get current email
		qmf.SetCookie("email",qmf.email,7);										// Save cookie
		$("#lightBoxDiv").remove();												// Close old one
		str="<br>Choose project from the list below.<br>"
		str+="<br><div style='width:100%;max-height:300px;overflow-y:auto'>";
		str+="<table style='font-size:12px;width:100%;padding:0px;border-collapse:collapse;'>";
		str+="<tr></td><td><b>Title </b></td><td><b>Date&nbsp;&&nbsp;time</b></td><td><b>&nbsp;&nbsp;&nbspId</b></tr>";
		str+="<tr><td colspan='3'><hr></td></tr>";
		for (var i=0;i<files.length;++i) 										// For each file
			str+="<tr id='qmf"+files[i].id+"' "+trsty+"><td>"+files[i].title+"</td><td>"+files[i].date.substr(5,11)+"</td><td align=right>"+files[i].id+"</td></tr>";
		str+="</table></div><div style='font-size:12px;text-align:right'><br>";	
		str+=" <button"+qmf.butsty+"id='cancelBut'>Cancel</button></div>";	
		
		if (qmf.deleting)														// If deleting
			qmf.ShowLightBox("Delete a project",str);							// Show lightbox
		else																	// Loading
			qmf.ShowLightBox("Load a project",str);								// Show lightbox
		this.deleting=false;													// Done deleting
		
		
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
						
		$("#loadBut").button().click(function() {								// LOAD BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UNDO / REDO
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function Do(name)														// SAVE SHOW IN SESSION STORAGE
	{
		var o={};
 		o.date=new Date().toString().substr(0,21);								// Get date
		o.script=JSON.stringify(curJson);										// Stringify
		o.name="Preview save";													// Normal preview save
		if (name == "bookmark") {												// If a bookmark
			GetTextBox("Set a bookmark", "Type the name of the bookmark you want to save the current project under. This bookmark will disappear when the browser is refreshed","",
				function(b) {  													// On entry
					o.name=b; 													// Save name
					sessionStorage.setItem("do-"+sessionStorage.length,JSON.stringify(o));	// Add new do												
					});									
			}
		else
			sessionStorage.setItem("do-"+sessionStorage.length,JSON.stringify(o));	// Add new do												
	}
	
	function Undo()
	{
		var i,o;
		var trsty="style='height:20px;cursor:pointer' onMouseOver='this.style.backgroundColor=\"#dee7f1\"'";
		trsty+="onMouseOut='this.style.backgroundColor=\"#f8f8f8\"'";
		$("#lightBoxDiv").remove();												// Close old one
		str="<br>Choose an undo to load from the list below:<br>";				// Prompt
		str+="<br><div style='width:100%;max-height:300px;overflow-y:auto'>";	// Div start
		str+="<table style='font-size:12px;width:100%;padding:0px;border-collapse:collapse;'>";	// Table start
		str+="<tr><td><b>Date</b></td><td><b>Name</b></tr>";					// Header
		str+="<tr><td colspan='2'><hr></td></tr>";								// Line
		var undos=[];
		for (i=0;i<sessionStorage.length;++i) {									// For each undo saved
			o=$.parseJSON(sessionStorage.getItem(sessionStorage.key(i)));		// Get undo from local storage
			o.id=i;																// Add id
			undos.push(o);														// dd to array
			}	
		undos.sort(function(a,b) { return b.date > a.date });					// Sort by time, latest first
		for (i=0;i<undos.length;++i) 											// For each undo
			str+="<tr id='und"+undos[i].id+"' "+trsty+"><td>"+undos[i].date+"</td><td>"+undos[i].name+"</td></tr>";
		str+="</table></div><div style='font-size:12px;text-align:right'><br>";	// End table
		str+=" <button"+qmf.butsty+"id='cancelBut'>Cancel</button></div>";		// Add button
		qmf.ShowLightBox("Load an undo",str);									// Show lightbox
	
		for (i=0;i<sessionStorage.length;++i) 									// For each undo
			$("#und"+i).click(function() {										// CANCEL BUTTON
				var key=sessionStorage.key(this.id.substr(3));					// Get key for undo
				var o=$.parseJSON(sessionStorage.getItem(key));					// Get undo from local storage
				curJson=$.parseJSON(o.script);									// Set curJson
				Draw(curPane);													// Show page
				Sound("ding");													// Ding
				$("#lightBoxDiv").remove();										// Close
				});
	
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			Sound("delete");													// Delete sound
			$("#lightBoxDiv").remove();											// Close
			});
						
	}


///////////////////////////////////////////////////////////////////////////////////////////////
//  HELPERS
///////////////////////////////////////////////////////////////////////////////////////////////

	
	QmediaFile.prototype.SetCookie=function(cname, cvalue, exdays)			// SET COOKIE
	{
		var d=new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	
	QmediaFile.prototype.GetCookie=function(cname) {						// GET COOKIE
		var name=cname+"=",c;
		var ca=document.cookie.split(';');
		for (var i=0;i<ca.length;i++)  {
		  c=ca[i].trim();
		  if (c.indexOf(name) == 0) 
		  	return c.substring(name.length,c.length);
		  }
		return "";
	}

	QmediaFile.prototype.ShowLightBox=function(title, content)				// LIGHTBOX
	{
		var str="<div id='lightBoxDiv' style='position:fixed;width:100%;height:100%;";	
		str+="background:url(images/overlay.png) repeat;top:0px;left:0px';</div>";
		$("body").append(str);														
		var	width=500;
		var x=$("#lightBoxDiv").width()/2-250;
		if (this.version == 1) 
			x=Math.max(x,950)
		var y=$("#lightBoxDiv").height()/2-200;
		if (this.xPos != undefined)
			x=this.xPos;
		str="<div id='lightBoxIntDiv' class='unselectable' style='position:absolute;padding:16px;width:400px;font-size:12px";
		str+=";border-radius:12px;z-index:2003;"
		str+="border:1px solid; left:"+x+"px;top:"+y+"px;background-color:#f8f8f8'>";
		str+="<img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span id='lightBoxTitle' style='font-size:18px;text-shadow:1px 1px #ccc'><b>"+title+"</b></span>";
		str+="<div id='lightContentDiv'>"+content+"</div>";					
		$("#lightBoxDiv").append(str);	
		$("#lightBoxDiv").css("z-index",2500);						
	}
	
	QmediaFile.prototype.LightBoxAlert=function(msg) 						//	SHOW LIGHTBOX ALERT
	{
		Sound("delete");														// Delete sound
		$("#lightBoxTitle").html("<span style='color:#990000'>"+msg+"</span>");	// Put new
	}
	
	function MakeColorDot(title, name, color)								// MAKE COLORPICKER DOT
	{
		var str=title+"&nbsp;&nbsp;<div id='"+name+"' "; 
		str+="style='vertical-align:-2px;display:inline-block;height:12px;width:12px;border-radius:12px;border:1px ";
		if (!color || (color == -1)  || (color == "none")) 	
			str+="dashed #000;background-color:#fff"; 	
		else
			str+="solid #000;background-color:"+color; 	
		str+="' onclick='ColorPicker(\""+name+"\")'>";
		str+="</div>";
		return str;
	}		
	
	function ColorPicker(name, transCol) 									//	DRAW COLORPICKER
	{
		if (!transCol)															// If no transparent color set
			transCol="";														// Use null
		$("#colorPickerDiv").remove();											// Remove old one
		var x=$("#"+name).offset().left+10;										// Get left
		var y=$("#"+name).offset().top+10;										// Top
		var	str="<div id='colorPickerDiv' style='position:absolute;left:"+x+"px;top:"+y+"px;width:160px;height:225px;z-index:100;border-radius:12px;background-color:#eee'>";
		$("body").append("</div>"+str);											// Add palette to dialog
		$("#colorPickerDiv").draggable();										// Make it draggable
		str="<p style='text-shadow:1px 1px white' align='center'><b>Choose a new color</b></p>";
		str+="<img src='colorpicker.gif' style='position:absolute;left:5px;top:28px' />";
		str+="<input id='shivaDrawColorInput' type='text' style='position:absolute;left:22px;top:29px;width:96px;background:transparent;border:none;'>";
		$("#colorPickerDiv").html(str);											// Fill div
		$("#colorPickerDiv").on("click",onColorPicker);							// Mouseup listener
	
		function onColorPicker(e) {
			
			var col;
			var cols=["000000","444444","666666","999999","CCCCCC","EEEEEE","E7E7E7","FFFFFF",
					  "FF0000","FF9900","FFFF00","00FF00","00FFFF","0000FF","9900FF","FF00FF",	
					  "F4CCCC","FCE5CD","FFF2CC","D9EAD3","D0E0E3","CFE2F3","D9D2E9","EDD1DC",
					  "EA9999","F9CB9C","FFE599","BED7A8","A2C4C9","9FC5E8","B4A7D6","D5A6BD",
					  "E06666","F6B26B","FFD966","9C347D","76A5AF","6FA8DC","8E7CC3","C27BA0",
					  "CC0000","E69138","F1C232","6AA84F","45818E","3D85C6","674EA7","A64D79",
					  "990000","B45F06","BF9000","38761D","134F5C","0B5394","351C75","741B47",
					  "660000","783F04","7F6000","274E13","0C343D","073763","20124D","4C1130"
					 ];
			var x=e.pageX-this.offsetLeft;										// Offset X from page
			var y=e.pageY-this.offsetTop;										// Y
			if ((x < 102) && (y < 45))											// In text area
				return;															// Quit
			$("#colorPickerDiv").off("click",this.onColorPicker);				// Remove mouseup listener
			if ((x > 102) && (x < 133) && (y < 48))	{							// In OK area
				if ($("#shivaDrawColorInput").val())							// If something there
					col="#"+$("#shivaDrawColorInput").val();					// Get value
				else															// Blank
					x=135;														// Force a quit
				}
			$("#colorPickerDiv").remove();										// Remove
			if ((x > 133) && (y < 48)) 											// In quit area
				return;															// Return
			if (y > 193) 														// In trans area
				col=transCol;													// Set trans
			else if (y > 48) {													// In color grid
				x=Math.floor((x-14)/17);										// Column
				y=Math.floor((y-51)/17);										// Row
				col="#"+cols[x+(y*8)];											// Get color
				}
			if (col == transCol)												// No color 
				$("#"+name).css({ "border":"1px dashed #000","background-color":"#fff" }); 	// Set dot
			else				
				$("#"+name).css({ "border":"1px solid #000","background-color":col }); 		// Set dot
			$("#"+name).data(name,col);											// Set color
		}

	}
	
	function Sound(sound, mode)												// PLAY SOUND
	{	
		var snd=new Audio();
		if (!snd.canPlayType("audio/mpeg") || (snd.canPlayType("audio/mpeg") == "maybe")) 
			snd=new Audio(sound+".ogg");
		else	
			snd=new Audio(sound+".mp3");
		if (mode != "init")
			snd.play();
	}

	function AlertBox(title, content, callback)								// ALERT BOX
	{
		$("#alertBoxDiv").remove();												// Remove any old ones
		Sound("delete");														// Delete sound
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>"+title+"</b></span></p>";
		str+="<div style='font-size:14px;margin:16px'>"+content+"</div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons:{"OK": function() { $(this).remove(); if (callback) callback(); }}});	
		if (qmf.version == 1)	
			$("#alertBoxDiv").dialog("option","position",{ my:"center", at:"right center", of:window });
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
  		$(".ui-button").css({"border-radius":"30px","outline":"none"});
	}

	function ConfirmBox(content, callback)									// COMFIRM BOX
	{
		Sound("delete");														// Delete sound
		$("#alertBoxDiv").remove();												// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>Are you sure?</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>"+content+"</div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons: {
					            	"Yes": function() { $(this).remove(); callback() },
					            	"No":  function() { $(this).remove(); }
									}});	
		if (qmf.version == 1)	
			$("#alertBoxDiv").dialog("option","position",{ my:"center", at:"right center", of:window });
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function GetTextBox(title, content, def, callback)					// GET TEXT LINE BOX
	{
		Sound("click");														// Ding sound
		$("#alertBoxDiv").remove();											// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span id='gtBoxTi'style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>"+title+"</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>"+content;
		str+="<p><input class='is' type='text' id='gtBoxTt' value='"+def+"'></p></div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons: {
					            	"OK": 		function() { callback($("#gtBoxTt").val()); $(this).remove(); },
					            	"Cancel":  	function() { $(this).remove(); }
									}});	
		if (qmf.version == 1)	
			$("#alertBoxDiv").dialog("option","position",{ my:"center", at:"right center", of:window });
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function GetSelectBox(title, content, def, options, callback)		// GET OPTION FROM SELECT MENU
	{
		Sound("click");														// Ding sound
		$("#alertBoxDiv").remove();											// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span id='gtBoxTi'style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>"+title+"</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>"+content;
		str+="<p>"+MakeSelect('gtBoxTt',false,options,def)+"</p></div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:300, buttons: {
					            	"OK": 		function() { callback($("#gtBoxTt").val()); $(this).remove(); },
					            	"Cancel":  	function() { $(this).remove(); }
									}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function GetHTMLEditor(val, callback)									// CALL HTML EDITOR
	{
		$("#alertBoxDiv").remove();												// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#000099'><b>HTML editor</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>";
		str+="<textarea id='htbx' style='width:100%'>";
		if (val)
			str+=val;
		str+="</textarea>";
		$("#alertBoxDiv").append(str+"</div>");	
		CKEDITOR.replace("htbx");
 		$("#alertBoxDiv").dialog({ width:550, buttons: {
	    	"OK": 		function() { 
	    					var s=CKEDITOR.instances.htbx.getData().replace(/[\n|\r]/g,"").replace(/"/g,"&quot;").replace(/&quot;/g,"\"");
	    					callback(s);										// Send to callback	
		    				$(this).remove();									// Remove dialog
		    				},
			"Cancel":  	function() { $(this).remove(); }
							}
			});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
	}

	function GetFlickrImage(callback)										// GET FLICKR IMAGE
	{
		$("#alertBoxDiv").remove();												// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#000099'><b>Get Flickr Image</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>";
		str+="<br><br><div style='display:inline-block;width:300px;max-height:200px;overflow-y:auto;background-color:#f8f8f8;padding:8px;border:1px solid #999;border-radius:8px'>";		// Scrollable container
		str+="<table id='collectTable' style='font-size:13px;width:100%;padding:0px;border-collapse:collapse;'>";	// Add table
		str+="<tr><td><b>Collection</b></td><td width='20'></td></tr>";			// Add header
		str+="<tr><td colspan='2'><hr></td></tr>";								// Add rule
		str+="</table></div>&nbsp;&nbsp;&nbsp;"									// End table
	
		str+="<div style='vertical-align:top;display:inline-block;width:300px;max-height:200px;overflow-y:auto;background-color:#f8f8f8;padding:8px;border:1px solid #999;border-radius:8px'>";		// Scrollable container
		str+="<dl id='setTable' style='font-size:13px;margin-top:2px;margin-bottom:2px'>";		// Add table
		str+="<dt><b>Set</b></dt>";												// Add header
		str+="<dt><hr></dt>";													// Add rule
		str+="</dl></div><div style='font-size:12px'<br><p><hr></p>";			// End table
	
		$("#alertBoxDiv").append(str+"</div>");	
		$("#alertBoxDiv").dialog({ width:800, buttons: {
					            	"Done":  function() { $(this).remove(); }
									}});	
		if (qmf.version == 1)	
			$("#alertBoxDiv").dialog("option","position",{ my:"center", at:"right center", of:window });
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function GetFlickrImage(callback, mapMode)								// GET FLICKR IMAGE
	{
		var apiKey="edc6ee9196af0ad174e8dd2141434de3";
		var trsty=" style='cursor:pointer;background-color:#f8f8f8' onMouseOver='this.style.backgroundColor=\"#dee7f1\"' onMouseOut='this.style.backgroundColor=\"#f8f8f8\"'";
		var cols,photos,str;
		var curCollection=0,curSet;
		
		$("#alertBoxDiv").remove();												// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		str="<p><img src='";													// Image start
		if (mapMode)	str+="img/MapScholarLogo.png' width='32";				// Use MPS logo
		else			str+="images/qlogo32.png";								// Qmedia logo
		str+="' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#000099'><b>Get Image from Flickr</b></span><p>";
		str+="<p style='text-align:right'>Flickr user name: <input id='idName' type='text' value='"+qmf.GetCookie('flickr')+"' style='width:100px' class='is'> &nbsp;<button id='getBut' class='bs'>Get</button></p>";
		str+="<div style='display:inline-block;width:365px;height:120px;overflow-y:auto;background-color:#f8f8f8;padding:8px;border:1px solid #999;border-radius:8px'>";		// Scrollable container
		str+="<table id='collectTable' style='font-size:11px;width:100%;padding:0px;border-collapse:collapse;'>";	// Add table
		str+="<tr><td><b>Collection</b></td><td width='20'></td></tr>";			// Add header
		str+="<tr><td colspan='2'><hr></td></tr>";								// Add rule
		str+="</table></div>&nbsp;&nbsp;&nbsp;"									// End table
	
		str+="<div style='vertical-align:top;display:inline-block;width:365px;height:120px;overflow-y:auto;background-color:#f8f8f8;padding:8px;border:1px solid #999;border-radius:8px'>";		// Scrollable container
		str+="<dl id='setTable' style='font-size:11px;margin-top:2px;margin-bottom:2px'>";		// Add table
		str+="<dt><b>Set</b></dt>";												// Add header
		str+="<dt><hr></dt>";													// Add rule
		str+="</dl></div><br><br>";												// End table
	
		str+="<div id='picGal' style='width:100%px;height:300px;overflow-y:auto;background-color:#f8f8f8;padding:8px;border:1px solid #999;border-radius:8px'>";		// Scrollable container
		str+="</div>";

		$("#alertBoxDiv").append(str+"</div>");	
		$("#alertBoxDiv").dialog({ width:800, buttons: {
					            	"OK": 		function() { callback($("#ftbx").val()); $(this).remove(); },
					            	"Cancel":  	function() { $(this).remove(); }
									}});	
		if (qmf.version == 1)	
			$("#alertBoxDiv").dialog("option","position",{ my:"center", at:"right center", of:window });
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
  		
 		$("#getBut").on("click",function() {									// ON GET CONTENT BUTTON
	   		cols=[];															// Reset array of collections
			Sound("click");														// Click
			var id=$("#idName").val();											// ID name
 			var url="https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&format=rest&api_key="+apiKey+"&username="+id;
	 		qmf.SetCookie("flickr",id,7);										// Save cookie
 			$.ajax({ type:"GET", url:url, dataType:"xml",						// Call REST to get user id
  				success: function(xml){											// Om XML
	   				if ($(xml).find("err").length) {							// If an error tag
	   					$("#picGal").html("<p style='text-align:center;color:990000'><b>"+$(xml).find("err").attr("msg")+"</b></p>");
	   					return;													// Quit
	   					}
  	   				id=$(xml).find("user").attr("id");							// Get id
		 			GetContent(id);												// Get content from Flickr via user id
					}});														// Ajax get id end
 			});																	// Click end

	
	function GetContent(userId) 												// GET CONTENT
	{
		var i=0,o,oo;
		var url="https://api.flickr.com/services/rest/?method=flickr.collections.getTree&format=rest&api_key="+apiKey+"&user_id="+userId;
		$.ajax({ type:"GET", url:url, dataType:"xml",								// Call REST to get user tree	
			success: function(xml) {												// On XML
				$("#collectTable tr:gt(1)").remove();								// Remove all rows
				$("#setTable tr").remove();											// Remove all rows
				$("#picGal").html("<p style='text-align:center'><b>Choose collection to view</b></p>");
				$(xml).find("collection").each( function() {						// For each collection
					o={};															// New obj
					o.sets=[];														// Array of sets
					o.id=$(this).attr("id");										// Get id
					o.title=$(this).attr("title");									// Get title
					$(this).find("set").each( function() {							// For each set
						oo={};														// New obj
						oo.id=$(this).attr("id");									// Get set id
						oo.title=$(this).attr("title");								// Get set title
						o.sets.push(oo);											// Add set
						});
					cols.push(o);													// Add collection to array
				});
			
			url="https://api.flickr.com/services/rest/?method=flickr.photosets.getList&format=rest&api_key="+apiKey+"&user_id="+userId;
			$.ajax({ type:"GET", url:url, dataType:"xml",							// Call REST to get user tree	
				success: function(xml) {											// On XML
					o={};															// New obj
					o.sets=[];														// Array of sets
					o.title="All";													// Get title
					$(xml).find("photoset").each( function() {						// For each set
						oo={};														// New obj
						oo.id=$(this).attr("id");									// Get set id
						oo.title=$(this).text().split("\n")[1];						// Get set title
						o.sets.push(oo);											// Add set
						});
					if (o.sets.length)												// If some sets
						cols.push(o);												// Add to array
					
					for (i=0;i<cols.length;++i)	{									// For each collection
			 			str="<tr id='fda"+i+"' "+trsty+">";							// Row
						str+="<td>"+cols[i].title+"</td>"; 							// Add name
						$("#collectTable").append(str);								// Add row														
					
						$("#fda"+i).on("click", function() {						// On collection click
							Sound("click");											// Click
							$("#picGal").html("<p style='text-align:center'><b>Choose set to view</b></p>");
							$("#ida"+curCollection).css({"color":"#000000","font-weight":"normal"});	// Uncolor last
							curCollection=this.id.substr(3);						// Set cur collection
							$("#ida"+curCollection).css({"color":"#990000","font-weight":"bold"});		// Color current
							ChooseCollection(curCollection);						// Show current collection
							});														// End collection click
						}
				}});																// Ajax get sets end
 			
 	
			}});																	// Ajax get tree end	
	}


	function ChooseCollection(id) 											// CHOOSE A COLLECTION
 	{
		var o=cols[curCollection];												// Point at collection
		$("#setTable tr").remove();												// Remove all rows
		for (var j=0;j<o.sets.length;++j) {										// For each set			
 			str="<tr id='ids"+j+"' "+trsty+">";									// Row
			str+="<td>"+o.sets[j].title+"</td>"; 								// Add name
			$("#setTable").append(str);											// Add row
			
			$("#ids"+j).on("click", function() { 								// On set click
				Sound("click");													// Click
				$("#ids"+curSet).css({"color":"#000000","font-weight":"normal"});	// Uncolor last
				curSet=this.id.substr(3);										// Cur set
				$("#ids"+curSet).css({"color":"#990000","font-weight":"bold"});	// Color current
				ChooseSet(this.id.substr(3));									// Show current set
				});																// End set click
			}	
	}
 
	function ChooseSet(id) 													// CHOOSE A SET
 	{
		var i,j=0,str="",oo,t;
		id=cols[curCollection].sets[id].id;										// Get set id
		var url="https://api.flickr.com/services/rest/?method=flickr.photosets.getphotos&format=rest&api_key="+apiKey+"&photoset_id="+id;
		$.ajax({ type:"GET", url:url, dataType:"xml",							// Call REST to get list of photos
			success: function(xml) {											// On XML
				photos=[];														// New photo array
				$(xml).find("photo").each( function() {							// For each set
					oo={};														// New obj
					oo.id=$(this).attr("id");									// Get id
					oo.secret=$(this).attr("secret");							// Get secret
					oo.farm=$(this).attr("farm");								// Get farm
					oo.server=$(this).attr("server");							// Get server
					oo.title=$(this).attr("title");								// Get title
					photos.push(oo);											// Add photo to array
					t=oo.title;													// Copy title				   								
					str+="<div id='idp"+(j++)+"' style='width:83px;border:1px solid #ccc;padding:4px;display:inline-block;text-align:center;font-size:9px;margin:6px;";
					str+="cursor:pointer;background-color:#f8f8f8' onMouseOver='this.style.backgroundColor=\"#dee7f1\"' onMouseOut='this.style.backgroundColor=\"#f8f8f8\"'>";
					str+="<img title='"+oo.title+"' src='https://farm"+oo.farm+".staticflickr.com/"+oo.server+"/"+oo.id+"_"+oo.secret+"_s.jpg'><br>";
					str+="<div style='padding-top:4px;overflow:hidden'>"+oo.title.substr(0,Math.min(oo.title.length,15))+"</div></div>";
					});
				$("#picGal").html(str);											// Add to gallery
				for (i=0;i<photos.length;++i) {									// For each pic
					$("#idp"+i).on("click", function(){							// ON PHOTO CLICK
						Sound("click");											// Click
						ChoosePhoto(this.id.substr(3));							// Preview and choose photo
						});														// End photo click
					}
				}});															// Ajax get photos end
	}

	function ChoosePhoto(id) 												// PREVIEW AND CHOOSE PHOTO SIZES
 	{
		var o,sizes=[],i;
		var url="https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=rest&api_key="+apiKey+"&photo_id="+photos[id].id;
		$.ajax({ type:"GET", url:url, dataType:"xml",							// Call REST to get sizes
			success: function(xml) {											// On XML
				$(xml).find("size").each( function() {							// For each size
					o={};														// New obj
					o.source=$(this).attr("source");							// Get source
					o.label=$(this).attr("label");								// Get label
					if (o.label == "Medium") 									// If medium pic
						str="<img style='border:1px solid #666' src='"+o.source+"' height='294'>";	// Image
					sizes.push(o);												// Add size to array
					});
							
				var t=$("#picGal").position().top+10;								// Gallery top
				str+="<div style='position:absolute;top:"+t+"px;left:550px;width:232px;text-align:right;'>";
//				str+="<div style='font-size:12px;padding:8px;display:inline-block'><b>"+photos[id].title+"</b><br></div>";		
				str+="<span style='font-size:11px'><i>Choose size: </i> </span>";		
				for (i=0;i<sizes.length;++i) {									// For each size
					if (mapMode)												// If making for MapScholar
						str+=sizes[i].label+"<input type='checkbox' id='fdx"+i+"'><br>";
					else														// Regular buttons			
						str+="<button style='margin-bottom:5px' class='bs' id='fdx"+i+"'>"+sizes[i].label+"</button><br>"
					}
				if (mapMode)													// If making for MapScholar
					str+="<br><textarea style='width:200px' id='ftbx'></textarea><br>";		// Holder for image names
				$("#picGal").html(str+"</div>");								// Fill gallery
				for (i=0;i<sizes.length;++i)									// For each size
					$("#fdx"+i).on("click", function() {						// On button click
						Sound("click");											// Click
						if (mapMode) {											// If making for MapScholar
							str="";												// Clear
							for (var j=0;j<sizes.length;++j)					// For each size
								if ($("#fdx"+j).prop("checked"))				// If checked
									str+=sizes[j].source+"\t";					// Add
							$("#ftbx").val(str);								// Set it							
							return;												// Quit
							}
						callback(sizes[this.id.substr(3)].source);				// Send url to cb
						$("#alertBoxDiv").remove();								// Close dialog
						});
			}});																// Ajax get sizes end
	  	}
	}																			// End closure function

	function AddEscapes(str)												// ESCAPE TEXT STRING
	{
		if (str) {																// If a string
			str=""+str;															// Force as string
			str=str.replace(/"/g,"\\\"");										// " to \"
			str=str.replace(/'/g,"\\\'");										// ' to \'
			}
		return str;																// Return escaped string
	}
	
	function trace(msg, p1, p2, p3, p4)										// CONSOLE 
	{
		if (p4 != undefined)
			console.log(msg,p1,p2,p3,p4);
		else if (p3 != undefined)
			console.log(msg,p1,p2,p3);
		else if (p2 != undefined)
			console.log(msg,p1,p2);
		else if (p1 != undefined)
			console.log(msg,p1);
		else
			console.log(msg);
	}
