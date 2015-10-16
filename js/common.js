function addClass(elem, val) {
	if (!elem.className) {
		elem.className = val;
	} else {
		newClassName = elem.className;
		newClassName += " ";
		newClassName += val;
		elem.className = newClassName;
	}
}

function removeElement(elem) {
	var parentElement = elem.parentNode;
	if (parentElement) {
		parentElement.removeChild(elem);
	}
}

function getClass(elem, className) {
    if (document.getElementsByClassName) {   
		return document.getElementsByClassName(className);
    }
    else {
        var elem = document.getElementsByTagName(elem);
        var elemAll = [];
        for (var i=0; i<elem.length; i++) {
            if (elem[i].className == className) {
                elemAll[elemAll.length] = elem[i];
            }
        }
        return elemAll;
    }
}

function addEvent(obj, evt, func) {
	if (obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if (obj.attachEvent) {
		obj.attachEvent("on" + evt, func);
	}
}

function getStyle(elem, tarCss) {
	var arr;
	var style;
	if (elem.currentStyle) {
		arr = elem.currentStyle;
	} else {
		arr = window.getComputedStyle(elem, null);
	}
	style = arr[tarCss];
	return style;
}

function addLoadEvent(func) {
	var oldOnload = window.onload;
	if (typeof(oldOnload) != "function") {
		window.onload = func;
	} else {
		window.onload = function() {
			oldOnload();
			func();
		}
	}
}