

// - - - - - [APPLICATION] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	document.addEventListener("DOMContentLoaded",function(event){
		/*
		document.addEventListener("keydown",function(event){
			console.log(event);
			if(event.keyCode == 83 && event.metaKey == true){ //SAVE
				event.preventDefault();
				console.info("SAVE");
			}
			if(event.keyCode == 85 && event.metaKey == true){ //UNDO
				event.preventDefault();
				console.info("UNDO");
			}
		},false);
		*/

		//CANVAS
		//	create main canvas Object
		var canvasElement = document.createElement("canvas");
			canvasElement.width = 600;
			canvasElement.height = 400;
			canvasElement.classList.add("canvas");



		//MANAGERS
		//	We need two managers, one for the canvas object,
		//	it will manage the drawing history as well as all
		//	tools.
		//	The other manager will manage the templates, save
		//	them and reload as well as drawing them and place
		//	in a list.
		var mainManager = new CanvasManager(canvasElement);
		var templateManager = new TemplateManager();
		//var layerManager = new LayerManager( canvasElement.width, canvasElement.height );


		//STATE
		//	manage the state of the application
		var drawmode = false;
		var currentTool = mainManager.tools.line;

			/**
			 * @event {ContextMenu}
			 */
			canvasElement.addEventListener("contextmenu",function(event){ 
				event.preventDefault();
			},false);
			/**
			 * @event {MouseDown}
			 */
			canvasElement.addEventListener("mousedown",function(event){
				event.preventDefault();
				drawmode = true;
				var x = event.offsetX || 
						event.pageX - event.target.offsetLeft;
				var y = event.offsetY || 
						event.pageY - event.target.offsetTop;
				currentTool.before(event,x,y,mainManager.history);
			},false);
			/**
			 * @event {MouseMove}
			 */
			canvasElement.addEventListener("mousemove",function(event){
				event.preventDefault();
				if(drawmode){
					mainManager.redraw();
					var x = event.offsetX || 
							event.pageX - event.target.offsetLeft;
					var y = event.offsetY || 
							event.pageY - event.target.offsetTop;
					currentTool.draw(event,x,y);
				}
			},false);
			/**
			 * @event {MouseUp}
			 */
			canvasElement.addEventListener("mouseup",function(event){
				event.preventDefault();
				drawmode = false;
				var x = event.offsetX || 
						event.pageX - event.target.offsetLeft;
				var y = event.offsetY || 
						event.pageY - event.target.offsetTop;

				mainManager.push( currentTool.after(event,x,y) );

			},false);
			/**
			 * For mobile devices
			 * @event {TouchStart}
			 */
			canvasElement.addEventListener("touchstart",function(event){
				event.preventDefault();
				var x = event.touches[0].offsetX || 
						event.touches[0].pageX - event.touches[0].target.offsetLeft;
				var y = event.touches[0].offsetY || 
						event.touches[0].pageY - event.touches[0].target.offsetTop;
				currentTool.before(event,x,y,mainManager.history);
			},false);
			/**
			 * For mobile devices
			 * @event {TouchMove}
			 */
			canvasElement.addEventListener("touchmove",function(event){
				event.preventDefault();
				mainManager.redraw();
				var x = event.touches[0].offsetX || 
						event.touches[0].pageX - event.touches[0].target.offsetLeft;
				var y = event.touches[0].offsetY || 
						event.touches[0].pageY - event.touches[0].target.offsetTop;
				currentTool.draw(event,x,y);
			},false);
			/**
			 * For mobile devices
			 * @event {TouchEnd}
			 */
			canvasElement.addEventListener("touchend",function(event){
				//event.preventDefault();
				var x = event.changedTouches[0].offsetX || 
						event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft;
				var y = event.changedTouches[0].offsetY || 
						event.changedTouches[0].pageY - event.changedTouches[0].target.offsetTop;
				mainManager.push( currentTool.after(event,x,y) );			
			},false);
			/**
			 * @event {DragOver}
			 */
			canvasElement.addEventListener("dragover",function(event){
				event.preventDefault();
				return false;
			},false);
			/**
			 * @event {DragEnter}
			 */
			canvasElement.addEventListener("dragenter",function(event){
				event.preventDefault();
				return false;
			},false);
			/**
			 * @event {Drop}
			 */
			canvasElement.addEventListener("drop",function(event){
				event.preventDefault();
				var id = event.dataTransfer.getData('Text');
				var storageItem = localStorage.getItem(id);
				var itemObject = JSON.parse(storageItem);
					
				mainManager.mergeHistory(itemObject.data);
				mainManager.redraw();
				return false;
			},false);

		//CONTROLLS
		//	all the buttons that are used to
		//	controll the application.
		var controllsContainer = document.createElement("ul");
			controllsContainer.classList.add("controls");
		var constrollsCollection = [
			//NEW / OPEN / SAVE
			(function(){
				var listItem = document.createElement("li");
				var listItemContent = document.createElement("ul");
				//reset	
				listItemContent.appendChild(
					(function(){
						var newListItem = document.createElement("li");
						var newListButton = document.createElement("button");
							newListButton.setAttribute("title","New Document");
							newListButton.classList.add("btn");
							newListButton.classList.add("new");
							newListButton.appendChild( document.createTextNode("New") );
							newListButton.addEventListener("click",function(event){
								event.preventDefault();
								mainManager.history = [];
								mainManager.redraw();
							},false);
							newListItem.appendChild(newListButton);
						return newListItem;
					})()
				);
				//open
				listItemContent.appendChild(
					(function(){
						var openListItem = document.createElement("li");
						var openListButton = document.createElement("button");
							openListButton.appendChild( document.createTextNode("Open...") );
							openListButton.classList.add("btn");
							openListButton.classList.add("open");
							openListButton.setAttribute("title","Open...");
							openListButton.addEventListener("click",function(event){
								event.preventDefault();

								var inputElement = document.createElement("input");
									inputElement.type = "file";
									inputElement.addEventListener("change",function(event){
										var reader = new FileReader();
											reader.addEventListener('load',function(event){
												try{
													var object = JSON.parse(event.target.result);
													canvasElement.width = object.width;
													canvasElement.height = object.height;
													mainManager.history = object.data;
													mainManager.redraw();
												}catch(e){
													console.error(e);
												}
											},false);
											reader.readAsText(event.target.files[0]);
									},false);
									inputElement.click();

							},false);
							openListItem.appendChild(openListButton);
						return openListItem;
					})()
				);
				//save
				listItemContent.appendChild(
					(function(){
						var saveListItem = document.createElement("li");
						var saveListButton = document.createElement("button");
							saveListButton.classList.add("btn");
							saveListButton.classList.add("save");
							saveListButton.setAttribute("title","Save...");
							saveListButton.appendChild( document.createTextNode("Save") );

							saveListButton.addEventListener("click",function(event){
								event.preventDefault();
								
								var win = window.open("","file");
									win.document.open();
									win.document.write(JSON.stringify(
										{
											width: canvasElement.width,
											height: canvasElement.height,
											data: mainManager.history
										}
									));
									win.document.close();
								
								var can = window.open( mainManager.canvas.toDataURL(), "imahge" );
							},false);
							saveListItem.appendChild(saveListButton);
						return saveListItem;
					})());
				//save to template
				listItemContent.appendChild(
					(function(){
						var saveListItem = document.createElement("li");
						var saveListButton = document.createElement("button");
							saveListButton.classList.add("btn");
							saveListButton.classList.add("save-template");
							saveListButton.setAttribute("title","Save to Template...");
							saveListButton.appendChild( document.createTextNode("Save to template") );
							saveListButton.addEventListener("click",function(){
								templateManager.drawItem(
									templateManager.save(mainManager.history,canvasElement.width,canvasElement.height)
								);
							},false);
							saveListItem.appendChild(saveListButton);
						return saveListItem;
					})()
				);
				listItem.appendChild(listItemContent);
				return listItem;
			})(),
			//UNDO
			(function(){
				var listItem = document.createElement("li");
				var listItemContent = document.createElement("ul");
					listItemContent.appendChild(
						(function(){
							var undoListItem = document.createElement("li");
							var undoListButton = document.createElement("button");
								undoListButton.classList.add("btn");
								undoListButton.classList.add("undo");
								undoListButton.setAttribute("title","Undo");
								undoListButton.appendChild( document.createTextNode("Undo") );
								undoListButton.addEventListener("click",function(){
									mainManager.history.pop();
									mainManager.redraw();
								},false);
								undoListItem.appendChild(undoListButton);
							return undoListItem;
						})()
					);
					listItemContent.appendChild(
						(function(){
							var redoListItem = document.createElement("li");
							var redoListButton = document.createElement("button");
								redoListButton.classList.add("btn");
								redoListButton.classList.add("redo");
								redoListButton.setAttribute("title","Redo");
								redoListButton.appendChild( document.createTextNode("Redo") );
								redoListButton.addEventListener("click",function(){
									//@todo implement
								},false);
								redoListItem.appendChild(redoListButton);
							return redoListItem;
						})()
					);
					listItem.appendChild(listItemContent);
				return listItem;		
			})(),
			//DRAWING TOOLS
			(function(){
				var listItem = document.createElement("li");
				var listItemContent = document.createElement("ul");
				var clearSelected = function(){
					var list = listItemContent.getElementsByClassName("selected");
						for(var i=0;i<list.length;i++){
							list[i].classList.remove("selected");
						}
				};
				//line
				listItemContent.appendChild(
					(function(){
						var lineListItem = document.createElement("li");
						var lineListButton = document.createElement("button");
							lineListButton.classList.add("btn");
							lineListButton.classList.add("line");
							lineListButton.classList.add("selected");
							lineListButton.setAttribute("title","Line");
							lineListButton.addEventListener("click",function(event){
								event.preventDefault();
								clearSelected();
								event.target.classList.add("selected");
								mainManager.tools.line.color = currentTool.color;
								mainManager.tools.line.stroke = currentTool.stroke;
								currentTool = mainManager.tools.line;
							},false);
							lineListButton.appendChild( document.createTextNode("Line") );
							lineListItem.appendChild(lineListButton);

						return lineListItem;
					})()
				);
				//circle
				listItemContent.appendChild(
					(function(){
						var circleListItem = document.createElement("li");
						var circleListButton = document.createElement("button");
							circleListButton.classList.add("btn");
							circleListButton.classList.add("circle");
							circleListButton.setAttribute("title","Circle");
							circleListButton.addEventListener("click",function(event){
								event.preventDefault();
								clearSelected();
								event.target.classList.add("selected");
								mainManager.tools.circle.color = currentTool.color;
								mainManager.tools.circle.stroke = currentTool.stroke;
								currentTool = mainManager.tools.circle;
							},false);
							circleListButton.appendChild( document.createTextNode("Circle") );
							circleListItem.appendChild(circleListButton);
						return circleListItem;
					})()
				);
				//rectangle
				listItemContent.appendChild(
					(function(){
						var rectListItem = document.createElement("li");
						var rectListButton = document.createElement("button");
							rectListButton.classList.add("btn");
							rectListButton.classList.add("rectangle");
							rectListButton.setAttribute("title","Rectangle");
							rectListButton.addEventListener("click",function(event){
								event.preventDefault();
								clearSelected();
								event.target.classList.add("selected");
								mainManager.tools.rectangle.color = currentTool.color;
								mainManager.tools.rectangle.stroke = currentTool.stroke;
								currentTool = mainManager.tools.rectangle;						
							},false);
							rectListButton.appendChild( document.createTextNode("Rectangle") );
							rectListItem.appendChild(rectListButton);
						return rectListItem;
					})()
				);
				//pen
				listItemContent.appendChild(
					(function(){
						var penListItem = document.createElement("li");
						var penListButton = document.createElement("button");
							penListButton.classList.add("btn");
							penListButton.classList.add("pen");
							penListButton.setAttribute("title","Pen");
							penListButton.addEventListener("click",function(event){
								event.preventDefault();
								clearSelected();
								event.target.classList.add("selected");
								mainManager.tools.pen.color = currentTool.color;
								mainManager.tools.pen.stroke = currentTool.stroke;
								currentTool = mainManager.tools.pen;						
							},false);
							penListButton.appendChild( document.createTextNode("Pen") );
							penListItem.appendChild(penListButton);
						return penListItem;
					})()
				);
				//text
				listItemContent.appendChild(
					(function(){
						var textListItem = document.createElement("li");
						var textListButton = document.createElement("button");
							textListButton.classList.add("btn");
							textListButton.classList.add("text");
							textListButton.setAttribute("title","Text");
							textListButton.addEventListener("click",function(event){
								event.preventDefault();
								clearSelected();
								event.target.classList.add("selected");
								mainManager.tools.text.color = currentTool.color;
								mainManager.tools.text.stroke = currentTool.stroke;
								currentTool = mainManager.tools.text;						
							},false);
							textListButton.appendChild( document.createTextNode("Text") );
							textListItem.appendChild(textListButton);
						return textListItem;
					})()
				);
				//eraser
				listItemContent.appendChild(
					(function(){
						var eraserListItem = document.createElement("li");
						var eraseListButton = document.createElement("button");
							eraseListButton.classList.add("btn");
							eraseListButton.classList.add("erase");
							eraseListButton.setAttribute("title","Erase");
							eraseListButton.appendChild( document.createTextNode("Erase") );
							eraseListButton.addEventListener("click",function(event){
								event.preventDefault();
								clearSelected();
								event.target.classList.add("selected");
								mainManager.tools.eraser.color = currentTool.color;
								mainManager.tools.eraser.stroke = currentTool.stroke;
								currentTool = mainManager.tools.eraser;						
							},false);
							eraserListItem.appendChild(eraseListButton);
						return eraserListItem;
					})()
				);
				listItem.appendChild(listItemContent);
				return listItem
			})(),
			//COLOR PICKER TOOL
			(function(){
				var colorListItem = document.createElement("li");
				var colorListButton = document.createElement("input");
					colorListButton.setAttribute("type","color");

					//FALLBACK
					//	fallback for browser that don't support
					//	input[type=color] elements
					if(colorListButton.type !== "color"){
						colorListButton = document.createElement("select");
						[
							{key:"Black",value:"#000000"},
							{key:"White",value:"#FFFFFF"},
							{key:"Red",value:"#FF0000"},
							{key:"Green",value:"#00FF00"},
							{key:"Blue",value:"#0000FF"},
						].forEach(function(item){
							var opt = document.createElement("option");
								opt.value = item.value;
								opt.appendChild( document.createTextNode(item.key) )
								colorListButton.appendChild(opt);
						});
					}

					colorListButton.addEventListener("change",function(event){
						event.preventDefault();
						currentTool.color = event.target.value;
					},false);
					colorListItem.appendChild(colorListButton);
				return colorListItem;
			})(),
			//STROKE PICKER TOOL
			(function(){
				var metrics = document.createElement("span");
					metrics.appendChild( document.createTextNode("1") );
				var strokeListItem = document.createElement("li");
					strokeListButton = document.createElement("input");
					strokeListButton.setAttribute("type","range");
					strokeListButton.setAttribute("min",1);
					strokeListButton.setAttribute("max",10);
					strokeListButton.value = 1;
				//FALLBACK
				//	if the browser doesn't have support for input[type=range] he will
				//	fallback to input[type=text], in that case it is better to listen
				//	for KeyUp event, else we will listen for Change event.
				var eventType = (strokeListButton.type == "range")
					? "change" : "keyup" ;
					strokeListButton.addEventListener(eventType,function(event){
						event.preventDefault();
						currentTool.stroke = parseInt(event.target.value);
						metrics.innerText = parseInt(event.target.value);
					},false);

					strokeListItem.appendChild(strokeListButton);
					strokeListItem.appendChild(metrics);
				return strokeListItem;
			})(),
		].forEach(function(item,index,collection){
			controllsContainer.appendChild(item);
		});

		
		//ADD TO HTML
		//	add the HTML elements to the document.
		var mainWrapper = document.getElementById("whiteboard-container");
		mainWrapper.appendChild(controllsContainer);			
		mainWrapper.appendChild(canvasElement);
		mainWrapper.appendChild(templateManager.build());

	},false);