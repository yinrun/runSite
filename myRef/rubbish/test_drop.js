var Demos       = [];
var nDemos      = 8;

// Demo variables
// iMouseDown represents the current mouse button state: up or down
/*
lMouseState represents the previous mouse button state so that we can
check for button clicks and button releases:

if(iMouseDown && !lMouseState) // button just clicked!
if(!iMouseDown && lMouseState) // button just released!
*/
var mouseOffset = null;
var iMouseDown  = false;
var lMouseState = false;
var dragObject  = null;

// Demo 0 variables
var DragDrops   = [];
var curTarget   = null;
var lastTarget  = null;
var dragHelper  = null;
var tempDiv     = null;
var rootParent  = null;
var rootSibling = null;
var nImg        = new Image();

nImg.src        = 'images/drag_drop_poof.gif';

// Demo1 variables
var D1Target    = null;

Number.prototype.NaN0=function(){return isNaN(this)?0:this;}

function CreateDragContainer(){
	/*
	Create a new "Container Instance" so that items from one "Set" can not
	be dragged into items from another "Set"
	*/
	var cDrag        = DragDrops.length;
	DragDrops[cDrag] = [];

	/*
	Each item passed to this function should be a "container".  Store each
	of these items in our current container
	*/
	for(var i=0; i<arguments.length; i++){
		var cObj = arguments[i];
		DragDrops[cDrag].push(cObj);
		cObj.setAttribute('DropObj', cDrag);

		/*
		Every top level item in these containers should be draggable.  Do this
		by setting the DragObj attribute on each item and then later checking
		this attribute in the mouseMove function
		*/
		for(var j=0; j<cObj.childNodes.length; j++){

			// Firefox puts in lots of #text nodes...skip these
			if(cObj.childNodes[j].nodeName=='#text') continue;

			cObj.childNodes[j].setAttribute('DragObj', cDrag);
		}
	}
}

function getPosition(e){
	var left = 0;
	var top  = 0;
	while (e.offsetParent){
		left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
		top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);
		e     = e.offsetParent;
	}


	left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
	top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);

	return {x:left, y:top};

}

function mouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function writeHistory(object, message){
	if(!object || !object.parentNode || !object.parentNode.getAttribute) return;
	var historyDiv = object.parentNode.getAttribute('history');
	if(historyDiv){
		historyDiv = document.getElementById(historyDiv);
		historyDiv.appendChild(document.createTextNode(object.id+': '+message));
		historyDiv.appendChild(document.createElement('BR'));

		historyDiv.scrollTop += 50;
	}
}

function getMouseOffset(target, ev){
	ev = ev || window.event;

	var docPos    = getPosition(target);
	var mousePos  = mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

function mouseMove(ev){
	ev         = ev || window.event;

	/*
	We are setting target to whatever item the mouse is currently on

	Firefox uses event.target here, MSIE uses event.srcElement
	*/
	var target   = ev.target || ev.srcElement;
	var mousePos = mouseCoords(ev);

	if(Demos[0] || Demos[4]){
		// mouseOut event - fires if the item the mouse is on has changed
		if(lastTarget && (target!==lastTarget)){
			writeHistory(lastTarget, 'Mouse Out Fired');

			// reset the classname for the target element
			var origClass = lastTarget.getAttribute('origClass');
			if(origClass) lastTarget.className = origClass;
		}

		/*
		dragObj is the grouping our item is in (set from the createDragContainer function).
		if the item is not in a grouping we ignore it since it can't be dragged with this
		script.
		*/
		var dragObj = target.getAttribute('DragObj');

		 // if the mouse was moved over an element that is draggable
		if(dragObj!=null){

			// mouseOver event - Change the item's class if necessary
			if(target!=lastTarget){
				writeHistory(target, 'Mouse Over Fired');

				var oClass = target.getAttribute('overClass');
				if(oClass){
					target.setAttribute('origClass', target.className);
					target.className = oClass;
				}
			}

			// if the user is just starting to drag the element
			if(iMouseDown && !lMouseState){
				writeHistory(target, 'Start Dragging');

				// mouseDown target
				curTarget     = target;

				// Record the mouse x and y offset for the element
				rootParent    = curTarget.parentNode;
				rootSibling   = curTarget.nextSibling;

				mouseOffset   = getMouseOffset(target, ev);

				// We remove anything that is in our dragHelper DIV so we can put a new item in it.
				for(var i=0; i<dragHelper.childNodes.length; i++) dragHelper.removeChild(dragHelper.childNodes[i]);

				// Make a copy of the current item and put it in our drag helper.
				dragHelper.appendChild(curTarget.cloneNode(true));
				dragHelper.style.display = 'block';

				// set the class on our helper DIV if necessary
				var dragClass = curTarget.getAttribute('dragClass');
				if(dragClass){
					dragHelper.firstChild.className = dragClass;
				}

				// disable dragging from our helper DIV (it's already being dragged)
				dragHelper.firstChild.removeAttribute('DragObj');

				/*
				Record the current position of all drag/drop targets related
				to the element.  We do this here so that we do not have to do
				it on the general mouse move event which fires when the mouse
				moves even 1 pixel.  If we don't do this here the script
				would run much slower.
				*/
				var dragConts = DragDrops[dragObj];


				
			}
		}

		// If we get in here we are dragging something
		if(curTarget){
			// move our helper div to wherever the mouse is (adjusted by mouseOffset)
			dragHelper.style.top  = mousePos.y - mouseOffset.y;
			dragHelper.style.left = mousePos.x - mouseOffset.x;

			var dragConts  = DragDrops[curTarget.getAttribute('DragObj')];
			alert(dragConts.getAttribute('id'));
			var activeCont = null;

			var xPos = mousePos.x - mouseOffset.x + (parseInt(curTarget.getAttribute('startWidth')) /2);
			var yPos = mousePos.y - mouseOffset.y + (parseInt(curTarget.getAttribute('startHeight'))/2);


		}

		// track the current mouse state so we can compare against it next time
		lMouseState = iMouseDown;

		// mouseMove target
		lastTarget  = target;
	}

}

function mouseUp(ev){



	dragObject = null;

	iMouseDown = false;
}

function mouseDown(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;

	iMouseDown = true;
	if(Demos[0] || Demos[4]){
		if(lastTarget){
			writeHistory(lastTarget, 'Mouse Down Fired');
		}
	}
	if(target.onmousedown || target.getAttribute('DragObj')){
		return false;
	}
}


document.onmousemove = mouseMove;
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp;

window.onload = function(){
	for(var i=0; i<nDemos; i++){
		Demos[i] = document.getElementById('Demo'+i);
	}

	if(Demos[0]){
		CreateDragContainer(document.getElementById('DragContainer1'), document.getElementById('DragContainer2'), document.getElementById('DragContainer3'));
		CreateDragContainer(document.getElementById('DragContainer7'));
		CreateDragContainer(document.getElementById('DragContainer8'));
	}
	if(Demos[4]){
		CreateDragContainer(document.getElementById('DragContainer4'));
	}
	if(Demos[0] || Demos[4]){
		// Create our helper object that will show the item while dragging
		dragHelper = document.createElement('DIV');
		dragHelper.style.cssText = 'position:absolute;display:none;';

		document.body.appendChild(dragHelper);
	}
	if(Demos[1]){
		makeDraggable(document.getElementById('DragImage1'));
		makeDraggable(document.getElementById('DragImage2'));
		makeDraggable(document.getElementById('DragImage3'));
		makeDraggable(document.getElementById('DragImage4'));
	}
	if(Demos[5]){
		makeDraggable(document.getElementById('DragImage5'));
		makeDraggable(document.getElementById('DragImage6'));
		makeDraggable(document.getElementById('DragImage7'));
		makeDraggable(document.getElementById('DragImage8'));
	}
	if(Demos[6]){
		makeDraggable(document.getElementById('DragImage9'));
		makeDraggable(document.getElementById('DragImage10'));
		makeDraggable(document.getElementById('DragImage11'));
		makeDraggable(document.getElementById('DragImage12'));

		addDropTarget(document.getElementById('DragImage9'),  'TrashImage1');
		addDropTarget(document.getElementById('DragImage10'), 'TrashImage1');
		addDropTarget(document.getElementById('DragImage11'), 'TrashImage1');
		addDropTarget(document.getElementById('DragImage12'), 'TrashImage1');
	}
	if(Demos[3]){
		makeClickable(document.getElementById('ClickImage1'));
		makeClickable(document.getElementById('ClickImage2'));
		makeClickable(document.getElementById('ClickImage3'));
		makeClickable(document.getElementById('ClickImage4'));
	}
}