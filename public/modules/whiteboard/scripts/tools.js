
// - - - - - [SHAPE] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

	/**
	 * Base class for drawing shapes
	 *
	 * @class Shape
	 * @constructor
	 * @param canvas {DOMCanvasElement}
	 */
	var Shape = function( canvas ){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	};
		/**
		 * @class Shape
		 * @property startX {Number}
		 */
		Shape.prototype.startX = 0;
		/**
		 * @class Shape
		 * @property startY {Number}
		 */
		Shape.prototype.startY = 0;
		/**
		 * @class Shape
		 * @property canvas {DOMCanvasElement}
		 */
		Shape.prototype.canvas = null;
		/**
		 * @class Shape
		 * @property startX {CanvasRenderingContext2D}
		 */
		Shape.prototype.context = null;
		/**
		 * @class Shape
		 * @property color {String}
		 */
		Shape.prototype.color = "#000000";
		/**
		 * @class Shape
		 * @property width {Number}
		 */
		Shape.prototype.stroke = 1;
		/**
		 * @class Shape
		 * @property points {Array}
		 */
		Shape.prototype.points = [];
		/**
		 * @class Shape
		 * @property before {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Shape.prototype.before = function(event,x,y){
			this.startX = x;
			this.startY = y;
		};
		/**
		 * @class Shape
		 * @property draw {Function}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Shape.prototype.draw = function(event,x,y){};
		/**
		 * @class Shape
		 * @property after {Function}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Shape.prototype.after = function(event,x,y){};
		/**
		 * @class Shape
		 * @property redraw {Function}
		 * @argument object {Object}
		 */
		Shape.prototype.redraw = function(object){};
		/**
		 * @class Shape
		 * @property offset {Function}
		 * @argument object {Object}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Shape.prototype.offset = function(object,x,y){
			return object;
		};

// - - - - - [LINE] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	/**
	 * Line tool, draw a line.
	 *
	 * @class Line
	 * @constructor
	 * @param canvas {DOMCanvasElement}
	 */
	var Line = function( canvas ){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	};
		Line.prototype.__proto__ = Shape.prototype;
		/**
		 * @class Line
		 * @property before {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Line.prototype.draw = function(event,x,y){ 
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = "rgb(220,220,220)";
			this.context.moveTo(this.startX,this.startY);
			this.context.lineTo(x,y);
			this.context.stroke();
		};
		/**
		 * @class Line
		 * @property after {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Line.prototype.after = function(event,x,y){
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = this.color;
			this.context.moveTo(this.startX,this.startY);
			this.context.lineTo(x,y);
			this.context.stroke();

			return {
				type: "line",
				startX:this.startX,
				startY:this.startY,
				points: [{x:x, y:y}],
				color: this.color,
				stroke: this.stroke,
				time: Date.now()
			};			
		}
		/**
		 * @class Line
		 * @property redraw {Function}
		 * @argument object {Object}
		 */
		Line.prototype.redraw = function(object){
			this.context.beginPath();
			this.context.lineWidth = object.stroke;
			this.context.strokeStyle = object.color;
			this.context.moveTo(object.startX,object.startY);
			this.context.lineTo(object.points[0].x,object.points[0].y);
			this.context.stroke();			
		};

		/**
		 * @class Line
		 * @property offset {Function}
		 * @argument object {Object}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Line.prototype.offset = function(object,x,y){
			return object;
		};

// - - - - - [CIRCLE] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	/**
	 * Cricle tool, draw a circle.
	 *
	 * @class Circle
	 * @constructor
	 * @param canvas {DOMCanvasElement}
	 */
	var Circle = function( canvas ){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	};
		Circle.prototype.__proto__ = Shape.prototype;

		/**
		 * @class Circle
		 * @property before {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Circle.prototype.draw = function(event,x,y){
			var radius = Math.sqrt( 
				Math.pow( y-this.startY ,2) + 
				Math.pow( x-this.startX ,2) 
			);
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = "rgb(220,220,220)";
			this.context.arc(this.startX, this.startY, radius, 0 , 2 * Math.PI, false);
			this.context.stroke();
		};
		/**
		 * @class Circle
		 * @property after {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Circle.prototype.after = function(event,x,y){
			var radius = Math.sqrt( 
				Math.pow( y-this.startY ,2) + 
				Math.pow( x-this.startX ,2) 
			);
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = this.color;
			this.context.arc(this.startX, this.startY, radius, 0 , 2 * Math.PI, false);
			this.context.stroke();
			return {
				type: "circle",
				startX:this.startX,
				startY:this.startY,
				points: [{x:this.startX,y:this.startY,r:radius}],
				color: this.color,
				stroke: this.stroke,
				time: Date.now()
			};			
		}
		/**
		 * @class Circle
		 * @property redraw {Function}
		 * @argument object {Object}
		 */
		Circle.prototype.redraw = function(object){
			this.context.beginPath();
			this.context.lineWidth = object.stroke;
			this.context.strokeStyle = object.color;
			this.context.arc(object.points[0].x, object.points[0].y, object.points[0].r, 0 , 2 * Math.PI, false);
			this.context.stroke();			
		}

// - - - - - [RECTANGLE] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	/**
	 * Rectangle tool, draw a rectangle.
	 *
	 * @class Rectangle
	 * @constructor
	 * @param canvas {DOMCanvasElement}
	 */
	var Rectangle = function( canvas ){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	};
		Rectangle.prototype.__proto__ = Shape.prototype;

		/**
		 * @class Rectangle
		 * @property before {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Rectangle.prototype.draw = function(event,x,y){
			var dx = x - this.startX;
			var dy = y - this.startY;
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = "rgb(220,220,220)";
			if(event.shiftKey){
				this.context.rect(this.startX, this.startY, dx, dx);
			}else{
				this.context.rect(this.startX, this.startY, dx, dy);
			}
			this.context.stroke();
		};
		/**
		 * @class Rectangle
		 * @property after {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Rectangle.prototype.after = function(event,x,y){
			var dx = x - this.startX;
			var dy = y - this.startY;
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = this.color;
			if(event.shiftKey){
				this.context.rect(this.startX, this.startY, dx, dx);
			}else{
				this.context.rect(this.startX, this.startY, dx, dy);
			}
			this.context.stroke();
			return {
				type: "rectangle",
				points: [this.startX,this.startY,dx, (event.shiftKey)?dx:dy],
				color: this.color,
				stroke: this.stroke,
				time: Date.now()
			};			
		}
		/**
		 * @class Rectangle
		 * @property redraw {Function}
		 * @argument object {Object}
		 */
		Rectangle.prototype.redraw = function(object){
			this.context.beginPath();
			this.context.lineWidth = object.stroke;
			this.context.strokeStyle = object.color;
			this.context.rect(object.points[0], object.points[1], object.points[2], object.points[3]);
			this.context.stroke();			
		}

// - - - - - [PEN] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	/**
	 * Pen tool, draw a freehand line.
	 *
	 * @class Pen
	 * @constructor
	 * @param canvas {DOMCanvasElement}
	 */
	var Pen = function( canvas ){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	};
		Pen.prototype.__proto__ = Shape.prototype;

		/**
		 * @class Pen
		 * @property before {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Pen.prototype.draw = function(event,x,y){
			var self = this;
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = "rgb(220,220,220)";
			this.context.moveTo(this.startX, this.startY);
			this.points.forEach(function(item,index,collection){
				self.context.lineTo(item.x,item.y);
			});
			this.context.lineTo(x,y);
			this.points.push( {x:x,y:y} );
			this.context.stroke();
		};
		/**
		 * @class Pen
		 * @property after {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Pen.prototype.after = function(event,x,y){
			var self = this;
			this.context.beginPath();
			this.context.lineWidth = this.stroke;
			this.context.strokeStyle = this.color;
			this.context.moveTo(this.startX, this.startY);
			this.points.forEach(function(item,index,collection){
				self.context.lineTo(item.x,item.y);
			});
			this.context.lineTo(x,y);
			this.points.push( {x:x,y:y} );
			this.context.stroke();
			var clone = this.points.slice(0);
			this.points = [];

			return {
				type: "pen",
				x:this.startX,
				y:this.startY,
				points: clone,
				color: this.color,
				stroke: this.stroke,
				time: Date.now(),
				top: {x:0,y:0},
				bottom: {x:0,y:0}
			};			
		}
		/**
		 * @class Pen
		 * @property redraw {Function}
		 * @argument object {Object}
		 */
		Pen.prototype.redraw = function(object){
			var self = this;
			this.context.beginPath();
			this.context.lineWidth = object.stroke;
			this.context.strokeStyle = object.color;
			this.context.moveTo(object.x, object.y);
			object.points.forEach(function(item,index,collection){
				self.context.lineTo(item.x,item.y);
			});
			this.context.stroke();			
		}

// - - - - - [TEXT] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	/**
	 * Text tool, to write text
	 *
	 * @class Text
	 * @constructor
	 * @param canvas {DOMCanvasElement}
	 */
	var Text = function( canvas ){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	};
		Text.prototype.__proto__ = Shape.prototype;

		/**
		 * @class Shape
		 * @property value {String}
		 */
		Text.prototype.value = "";

		/**
		 * @class Text
		 * @property before {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Text.prototype.draw = function(event,x,y){
		};
		/**
		 * @class Text
		 * @property after {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Text.prototype.after = function(event,x,y){
			this.value = prompt("Enter text");
			this.context.fillText(this.value, this.startX, this.startY);
			return {
				type: "text",
				value: this.value,
				points: [this.startX,this.startY],
				color: this.color,
				stroke: this.stroke,
				time: Date.now()
			};			
		}
		/**
		 * @class Text
		 * @property redraw {Function}
		 * @argument object {Object}
		 */
		Text.prototype.redraw = function(object){
			this.context.fillText(object.value, object.points[0], object.points[0]);
		}

// - - - - - [ERASER] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	/**
	 * Eraser tool, to remove parts of drawing
	 *
	 * @class Pen
	 * @constructor
	 * @param canvas {DOMCanvasElement}
	 */
	var Eraser = function( canvas ){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	};
		Eraser.prototype.__proto__ = Shape.prototype;

		/**
		 * @class Eraser
		 * @property before {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 */
		Eraser.prototype.draw = function(event,x,y){
			var self = this;
			//this.context.beginPath();
			//this.context.moveTo(this.startX, this.startY);
			this.points.forEach(function(item,index,collection){
				self.context.clearRect(item.x,item.y,this.stroke,this.stroke);
			});
			this.context.clearRect(x,y,this.stroke,this.stroke);
			this.points.push( {x:x,y:y} );
			this.context.stroke();
		};
		/**
		 * @class Eraser
		 * @property after {Function}
		 * @argument event {Event}
		 * @argument x {Number}
		 * @argument y {Number}
		 * @returns {Object}
		 */
		Eraser.prototype.after = function(event,x,y){
			var self = this;
			//this.context.beginPath();

			//this.context.moveTo(this.startX, this.startY);
			this.points.forEach(function(item,index,collection){
				self.context.clearRect(item.x,item.y,this.stroke,this.stroke);
			});
			this.context.clearRect(x,y,this.stroke,this.stroke);
			this.points.push( {x:x,y:y} );
			this.context.stroke();
			var clone = this.points.slice(0);
			this.points = [];

			return {
				type: "eraser",
				x:this.startX,
				y:this.startY,
				points: clone,
				color: this.color,
				stroke: this.stroke,
				time: Date.now()
			};			
		}
		/**
		 * @class Eraser
		 * @property redraw {Function}
		 * @argument object {Object}
		 */
		Eraser.prototype.redraw = function(object){
			var self = this;
			//this.context.beginPath();
			//this.context.moveTo(object.x, object.y);
			object.points.forEach(function(item,index,collection){
				self.context.clearRect(item.x,item.y,object.stroke,object.stroke);
			});
			this.context.stroke();			
		}
