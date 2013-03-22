

// - - - - - [CANVAS MANAGER] - - - - - - - - - - - - - - - - - - - - - - - - - - -

	/**
	 * Class that manages a canvas object and the
	 * drawing tools that can work on that canvas
	 * object
	 *
	 * @class CanvasManager
	 * @constructor
	 */
	var CanvasManager = function( canvasElement ){
		this.canvas = canvasElement;
		this.context = this.canvas.getContext("2d");
		this.tools = {
			line: 	new Line(this.canvas),
			circle: new Circle(this.canvas),
			pen: 	new Pen(this.canvas),
			text: 	new Text(this.canvas),
			eraser: new Eraser(this.canvas),
			rectangle: new Rectangle(this.canvas)
		}
	};
		/**
		 * Called before redraw
		 * @class CanvasManager
		 * @property before {Function}
		 */
		CanvasManager.prototype.before = function(){};
		/**
		 * Called after redraw
		 * @class CanvasManager
		 * @property after {Function}
		 */
		CanvasManager.prototype.after = function(){};

		/**
		 * @class CanvasManager
		 * @property history {Array}
		 */
		CanvasManager.prototype.history = [];		

		/**
		 * @class CanvasManager
		 * @property canvas {DOMCanvasElement}
		 */
		CanvasManager.prototype.canvas = null;

		/**
		 * @class CanvasManager
		 * @property context {CanvasRenderingContext2D}
		 */
		CanvasManager.prototype.context = null;

		/**
		 * @class CanvasManager
		 * @property tools {Object}
		 */
		CanvasManager.prototype.tools = {};

		/**
		 * Add object to the history.
		 *
		 * @class CanvasManager
		 * @property push {Function}
		 * @argument object {Object}
		 */
		CanvasManager.prototype.push = function(object){
			this.history.push(object);
		};

		/**
		 * @class CanvasManager
		 * @property mergeHistory {Function}
		 */
		CanvasManager.prototype.redraw = function(){
			var self = this;
			this.before.call(this);
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

			this.history.forEach(function(item,index,collection){
				switch(item.type){
					case 'line':
						self.tools.line.redraw(item);
					break;
					case 'circle':
						self.tools.circle.redraw(item);
					break;
					case 'pen':
						self.tools.pen.redraw(item);
					break;
					case 'text':
						self.tools.text.redraw(item);
					break;
					case 'eraser':
						self.tools.eraser.redraw(item);
					break;
					case 'rectangle':
						self.tools.rectangle.redraw(item);
					break;
					default:
					break;
				}	
			});
			this.after.call(this);
		};

		/**
		 * If you have an array of drawing data,
		 * and you are lazy, you can use this function
		 * to add it to the manager's history. Now you don't
		 * have to write a forEach statement.
		 * @class CanvasManager
		 * @property mergeHistory {Function}
		 * @argument collection {Array}
		 */
		CanvasManager.prototype.mergeHistory = function(collection){
			var self = this;
			collection.forEach(function(item,index,collection){
				self.history.push(item);
			});
		};



// - - - - - [TEMPLATE MANAGER] - - - - - - - - - - - - - - - - - - - - - - - - - -

	/**
	 * Manage templaes
	 *
	 * @class TemplateManager
	 * @constructor
	 */
	var TemplateManager = function(){};

		/**
		 * @class TemplateManager
		 * @property container {DOMListElement}
		 */
		TemplateManager.prototype.container = null;

		/**
		 * @class TemplateManager
		 * @property build {Function}
		 */
		TemplateManager.prototype.build = function(){
			this.container = document.createElement("ul");
			this.container.classList.add("template-list");
			for(var i in window.localStorage){
				this.drawItem(i);
			}
			return this.container;		
		};

		/**
		 * @class TemplateManager
		 * @property save {Function}
		 * @argument data {Array}
		 * @argument width {Number}
		 * @argument heihgt {Number}
		 */
		TemplateManager.prototype.save = function(data,width,height){
			var key = Date.now();
			localStorage.setItem(
				key,
				JSON.stringify( {
					width:width, 
					height:height, 
					data:data
				} )
			);	
			return key;		
		};
		/**
		 * @class TemplateManager
		 * @property drawItem {Function}
		 * @argument data {Array}
		 * @argument width {String}
		 */
		TemplateManager.prototype.drawItem = function(id) {
			try{
				var object = JSON.parse(localStorage.getItem(id));
				var templateListItem = document.createElement("li");
				var tmpCanvas = document.createElement("canvas");
					tmpCanvas.width = object.width;
					tmpCanvas.height = object.height;

				var canvasManager = new CanvasManager(tmpCanvas);
					canvasManager.history = object.data;
					canvasManager.redraw();

				var image = new Image();
					image.id = id;
					image.width = object.width;
					image.height = object.height;
					image.src = tmpCanvas.toDataURL("image/png");
					image.addEventListener("dragstart",function(event){
						event.dataTransfer.setData('Text', this.id);
					},false);
				var removeElement = document.createElement("a");
					removeElement.href = "#";
					removeElement.appendChild( document.createTextNode("x") );
					removeElement.addEventListener("click",function(event){
						event.preventDefault();
						localStorage.removeItem(id);
						event.target.parentNode.remove(templateListItem);
					},false);
					templateListItem.appendChild(image);
					templateListItem.appendChild(removeElement);
				this.container.appendChild(templateListItem);
				
			}catch(e){
				console.error(e);
			}
		};
