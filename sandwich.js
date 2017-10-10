/*
main canvas
canvas to hold drawn base shape (for card) ctx1
canvas to create back cardboard image ctx2
canvas to create front cardboard image ctx3
canvas for paint ctx6
canvas for makers ctx7
*/

var colors = [
'#fd0045','#fe0000','#fd5900',
'#fad300','#a8fc00','#009efa',
'#7f00fe','#000000','#ffffff'
];


var paint = false;
var cardImg;
var cardIntImg;

var STATE_DRAW 		= 1;
var STATE_ERASE 	= 2;

var STATE_CARD 		= 1;
var STATE_PAINT 	= 2;
var STATE_MARKER 	= 3;

var CANVAS_SIZE 	= 400;
var CARD_SIZE		= 20;
var PAINT_SIZE		= 20;
var MARKER_SIZE		= 5;
var ERASE_SIZE		= 20;

var drawState 		= STATE_DRAW;
var offscreen;

var paintColor 		= '#0000FF';
var markerColor 	= '#000000';
var toolState 		= STATE_CARD;

var paintNum		= 0;
var markerNum 		= 7;

var toolDisplay;

var PAINT_ALPHA 	= 0.4;

var offset;

function setColor(num)
{
	if (toolState == STATE_MARKER)
	{
		markerNum = num-1;
	}
	else
	{
		paintNum = num-1;
	}

	var imgEl;
	for (var i=1; i < 10; i++)
	{
		imgEl = document.getElementById('color'+i);
		imgEl.className = 'pencil';	
	}

	imgEl = document.getElementById('color'+num);
	imgEl.className += ' selected';		
}

function toggleErase()
{
	var eraser = document.getElementById('eraser');
	if (drawState == STATE_DRAW)
	{
		drawState = STATE_ERASE;
		eraser.className = 'selected';
	}
	else
	{
		drawState = STATE_DRAW;
		eraser.className = 'tool';
	}


}

function init()
{

	toolDisplay = document.getElementById('toolName');
	offscreen = document.getElementById('offscreen');

	shapeCanvas = new DrawSurf();
	shapeCanvas.setSize(CANVAS_SIZE);
	shapeCanvas.addToPage(offscreen);

	backCardCanvas = new DrawSurf();
	backCardCanvas.setSize(CANVAS_SIZE);
	backCardCanvas.addToPage(offscreen);

	cardCanvas = new DrawSurf();
	cardCanvas.setSize(CANVAS_SIZE);
	cardCanvas.addToPage(offscreen);

	paintCanvas = new DrawSurf();
	paintCanvas.setSize(CANVAS_SIZE);
	paintCanvas.addToPage(offscreen);

	markerCanvas = new DrawSurf();
	markerCanvas.setSize(CANVAS_SIZE);
	markerCanvas.addToPage(offscreen);

	mainCanvas = new DrawSurf('canvasMain');
	console.log(mainCanvas);

	offset = getPosition(document.getElementById('canvasMain'));

	document.onmousedown = mouseDown;
	document.onmousemove = mouseMove;
	document.onmouseup = mouseUp;
	document.onkeydown = keyDown;

	cardImg = new Image();
	cardIntImg = new Image();
	cardImg.src = 'cardboard.jpg';
	cardIntImg.src = 'card2.jpg';
}

function keyDown(e)
{
	console.log(e);
	switch (e.keyCode)
	{
		case 32:
		{
			if (drawState == STATE_DRAW) 
			{
				drawState = STATE_ERASE;
			}
			else 
			{
				drawState = STATE_DRAW;
			}
			console.log(drawState);
		}
		break;
		case 83:
		{
			setTool(STATE_PAINT);
			// toolState = STATE_PAINT;
		}
		break;
		case 65:
		{
			setTool(STATE_CARD);
			// toolState = STATE_CARD;
		}
		break;
		case 68:
		{
			setTool(STATE_MARKER);
			// toolState = STATE_MARKER;
		}
		break;
		default:
		break;
	}
}

function setTool(which)
{
	toolState = which;
	if (which == STATE_PAINT)
	{
		setColor(paintNum+1);
	}
	if (which == STATE_MARKER)
	{
		setColor(markerNum+1);
	}

	var toolEl;

	for (var i=1; i<4; i++)
	{
		toolEl = document.getElementById('tool' + i);
		toolEl.className = 'tool';
	}

	toolEl = document.getElementById('tool' + toolState);
	toolEl.className = 'selected';

}

function mouseDown(e)
{
	// console.log(e);
	paint = true;
	drawLine(e.clientX - offset.x, e.clientY - offset.y, true);
}

function mouseMove(e)
{
	if (paint)
	{
		x = e.clientX - offset.x;
		y = e.clientY - offset.y;
		if ((x < 0 || x > CANVAS_SIZE+10) || (y < 10 || y > CANVAS_SIZE+10))
		{
			paint = false;
			return;
		}
		drawLine(x,y, false);
		updateComposite();
	}
}

function mouseUp(e)
{
	paint = false;
}

function drawLine(x, y, start)
{
	ctx = shapeCanvas.ctx;

	switch (toolState)
	{
		case STATE_CARD:
		{
			ctx = shapeCanvas.ctx;
			ctx.lineWidth = CARD_SIZE;			
		}
		break;
		case STATE_PAINT:
		{
			ctx = paintCanvas.ctx;
			ctx.strokeStyle = colors[paintNum];
			ctx.lineWidth = PAINT_SIZE;			
		}
		break;
		case STATE_MARKER:
		{
			ctx = markerCanvas.ctx;
			ctx.strokeStyle = colors[markerNum]; 
			ctx.lineWidth = MARKER_SIZE;
			if (drawState == STATE_ERASE)
			{
				ctx.lineWidth = ERASE_SIZE;
			}			
		}
		break;
		default:
		break;

	}
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	if (start)
	{
		ctx.beginPath();
		ctx.moveTo(x,y);
	}

	if (drawState == STATE_DRAW)
	{	
		ctx.globalCompositeOperation = 'source-over';
	}
	else
	{
		ctx.globalCompositeOperation = 'destination-out';
	}
	ctx.lineTo(x, y);
	ctx.stroke();
}

function updateComposite()
{
	// create background shape	
	backCardCanvas.clearSurf();
	backCardCanvas.setComposite('source-over');
	backCardCanvas.drawImg(shapeCanvas.can, 0, 0);
	backCardCanvas.setComposite('source-atop');
	backCardCanvas.drawImg(cardIntImg, 0, 0);

	// create foreground shape
	cardCanvas.clearSurf();
	cardCanvas.setAlpha(1);
	cardCanvas.setComposite('source-over');
	cardCanvas.drawImg(shapeCanvas.can, 0, 0);
	cardCanvas.setComposite('source-atop');
	cardCanvas.drawImg(cardImg, 0, 0);

	// add paint and marker to cardboard
	cardCanvas.setAlpha(PAINT_ALPHA);
	cardCanvas.setComposite('source-atop');
	cardCanvas.drawImg(paintCanvas.can, 0, 0);
	cardCanvas.setAlpha(1);
	cardCanvas.drawImg(markerCanvas.can, 0, 0);

	// combine two images
	mainCanvas.clearSurf();
	mainCanvas.setComposite('source-over');
	mainCanvas.drawImg(backCardCanvas.can, -5, -5);
	mainCanvas.drawImg(cardCanvas.can, 0, 0);
}

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

init();


