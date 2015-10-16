var gameTime = 30;				// 选择的游戏时间，初始化为30s
var thisGameTime = 30;			// 本次游戏时间备份
var gameTimeDown = 30;			// 倒计时
var gameLevel = 1;				// 选择的游戏难度，初始化为1
var datas = new Array();		// 字母与出现位置交替存储
var timeInterval1;				// 控制动画间隔
var downTimeInterval = 3000;	// 两次动画的间隔时间
var timeInterval2;				// 控制游戏倒计时
var count = 0;					// 分数
var downHeight;					// 下落高度
var downTime = 6000;			// 完成一次下落时间

var oSelect = document.getElementById("select");
var oGameInfo = document.getElementById("gameInfo");
var oMain = document.getElementById("main");
var oBox = getClass("div", "box")[0];

var c = document.getElementsByTagName("canvas")[0];
var cvs = c.getContext("2d");

/*------字母下落------*/
function letterShow() {
	var oData = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
					"M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	var oImage = ["media/images/1.png", "media/images/2.png", "media/images/3.png", 
					"media/images/4.png", "media/images/5.png", "media/images/6.png", "media/images/7.png"];
	var temp = [];
	for(var i=0; i<gameLevel; i++) {
		var divs = parseInt(Math.random()*7)+1;
		for(var j=0; j<temp.length; j++) {
			if (temp[j] === divs) {
				return false;
			}
		}
		temp.push(divs);
	}
	for(var i=0; i<gameLevel; i++) {
		var letter = parseInt(Math.random()*26);
		var currentImage = oImage[parseInt(Math.random()*6)+1];
		datas.push(letter);					// 存储字母
		datas.push(temp[i]);				// 存储出现位置
		var oDivs = document.createElement("div");
		oDivs.style.backgroundImage = "url(" + currentImage + ")";
		addClass(oDivs, "divPop"+temp[i]);
		var divsContent = document.createTextNode(oData[letter]);
		oDivs.appendChild(divsContent);
		oMain.appendChild(oDivs);
		animate(oDivs, (downTime/downHeight));
	}
}
function animate(oDivs, time) {
	var interval = setInterval(function() {
		if ((oDivs.offsetTop >= downHeight) || (gameTimeDown < 0)) {
			clearInterval(interval);
			oDivs.style.display = "none";
			removeElement(oDivs);
			var popVal = parseInt((oDivs.className).replace(/[^0-9]/ig, ""));
			var pos = datas.indexOf(popVal);
			datas.splice(pos-1, 2);
			return;
		} else {
			oDivs.style.top = oDivs.offsetTop + 1 + "px";
		}
	}, time);
}

/*------键盘操作------*/
document.onkeydown = function keydown(evt) {
	evt = evt || window.event;
	var key = evt.charCode || evt.keyCode;
	keyBoard(key);
}
function keyBoard(key) {
	if (key == 13) {
		return true;
	}
	for (var j=0; j<datas.length; j=j+2) {
		if (key == datas[j] + 65) {
			var elem = getClass("div", "divPop"+datas[j+1])[0];
			var x = parseInt(getStyle(elem, "left")) + 50;
			var y = parseInt(getStyle(elem, "top")) + 20;
			elem.style.display = "none";
			removeElement(elem);
			datas.splice(j, 2);
			fireworks(x, y);
			count += 10;
			gameScoreShow();
			pass();
			break;
		}
	}
}

/*------过关判断------*/
var p = 1;
var index = 1.1;
function pass() {
	if (count >= (gameTime * 1000 / downTimeInterval * gameLevel * 0.6 * 10)) {
		if (downTime < 1100) {
			alert("恭喜你，完成此难度所有关卡！");
			document.location.reload();
		} else {
			clearInterval(timeInterval1);
			setTimeout(function() {
				alert("恭喜你，现在进入下一关...");
				count = 0;
				gameScoreShow();
				clearInterval(timer);
			}, 800);
			gameTimeDown = gameTime;
			downTime /= Math.pow(index, p);
			timeInterval1 = setInterval(letterShow, downTimeInterval);
			p++;
		}
	} else {
		return;
	}
}

/*------倒计时显示------*/
function gameTimeShow() {
	var timeShow = document.getElementById("timeShow");
	if (timeShow) {
		if (gameTimeDown < 0) {
			clearInterval(timeInterval2);		// 时间到，停止计时
			timeOver();
		} else {
			timeShow.removeChild(timeShow.childNodes[0]);
			timeShow.appendChild(document.createTextNode(gameTimeDown));
			gameTimeDown--;
		}
	}
}

/*------时间到------*/
function timeOver() {
	clearInterval(timeInterval1);		// 时间到，停止下次动画
	alert("游戏结束，得分：" + count);
	// 恢复初始化
	document.location.reload();
}

/*------游戏难度显示------*/
function gameLevelShow() {
	var levelShow = document.getElementById("levelShow");
	levelShow.removeChild(levelShow.childNodes[0]);
	levelShow.appendChild(document.createTextNode(gameLevel));
}

/*------分数显示------*/
function gameScoreShow() {
	var scoreShow = document.getElementById("scoreShow");
	scoreShow.removeChild(scoreShow.childNodes[0]);
	scoreShow.appendChild(document.createTextNode(count));
}

/*------菜单选择弹窗------*/
function popup(popupName) {
	popupName.style.display = "block";
	// 当前窗口
	windowWidth = window.innerWidth;	// 1366
	windowHeight = window.innerHeight;	// 变化
	// 弹窗
	popupHeight = popupName.clientHeight;
	popupWidth = popupName.clientWidth;
	// 弹窗定位
	popupName.style.left = (windowWidth - popupWidth) / 2;
	popupName.style.top = (windowHeight - popupHeight) / 2;
	// 可下滑实际高度
	downHeight = oMain.style.height = window.innerHeight - oGameInfo.clientHeight + 100;
}

/*------点击开始游戏------*/
function gameStart() {
	var startGame = getClass("a", "button")[2];
	addEvent(startGame, "click", function() {
		menuClose();
		letterShow();
		timeInterval1 = setInterval(letterShow, downTimeInterval);	// 动画开始
		timeInterval2 = setInterval(gameTimeShow, 1000);			// 倒计时开始
	});
}
addLoadEvent(gameStart);

/*------点击结束游戏------*/
function gameEnd() {
	var exitButton = document.getElementById("exitButton");
	addEvent(exitButton, "click", function() {
		var ok = confirm("是否确认退出？退出将关闭浏览器！");
		if (ok) {
			window.opener = null;
			window.open('', '_self');
			window.close();
		} else {
			return;
		}
	});	
}
addLoadEvent(gameEnd);

/*------点击暂停游戏------*/
function gamePause() {
	var pauseButton = document.getElementById("pauseButton");
	addEvent(pauseButton, "click", function() {
		clearInterval(timeInterval1);
		var ok = confirm("游戏暂停！是否继续？取消将关闭浏览器！");
		if (ok) {
			timeInterval1 = setInterval(letterShow, downTimeInterval);	// 动画开始
			return;
		} else {
			window.opener = null;
			window.open('', '_self');
			window.close();
		}
	});
}

/*------显示菜单------*/
function menuShow() {
	// 菜单定位
	popup(oBox);
	// 遮罩层
	var bg = document.createElement("div");
	bg.setAttribute("id", "mybg");
	document.body.appendChild(bg);
}
addLoadEvent(menuShow);

/*------关闭菜单与遮罩------*/
function menuClose() {
	var mybg = document.getElementById("mybg");
	document.body.removeChild(mybg);
	oSelect.style.display = "none";
	oBox.style.display = "none";
}

/*------音乐暂停播放/轮播------*/
function musicControl() {
	var oMusic = ["media/music/夜的钢琴曲五.mp3", "media/music/Always with me.mp3", 
				"media/music/卡农.mp3", "media/music/River Flows In You.mp3", "media/music/1945.mp3", ];
	var audio = document.getElementsByTagName("audio")[0];
	// 控制暂停
	function playOrStop() {
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}
	var musicControl = getClass("a", "button")[0];
	var musicCtrl = oGameInfo.getElementsByTagName("li")[0];
	addEvent(musicControl, "click", playOrStop);
	addEvent(musicCtrl, "click", playOrStop);
	// 控制轮播
	var i = parseInt(Math.random()*5);
	audio.src = oMusic[i];
	addEvent(audio, "ended", function (){
		if (i == oMusic.length) {
			i = 0;
		}
		i++;
		audio.src = oMusic[i];
		audio.play();
	});
	audio.play();
}
addLoadEvent(musicControl);

/*------游戏配置------*/
function configure() {
	// 游戏配置按钮
	var conf = getClass("a", "button")[1];
	addEvent(conf, "click", function() {
		oBox.style.display = "none";
		popup(oSelect);
	});	
	// 保存配置
	var confirmButton = document.getElementById("confirm");
	addEvent(confirmButton, "click", function() {
		oSelect.style.display = "none";
		popup(oBox);
	});
	var selects = document.getElementsByTagName("select");
	// 游戏时间选择
	var select1 = selects[0];
	addEvent(select1, "click", function() {
		for (var i=0; i<select1.length; i++) {
			if (select1[i].selected) {
				gameTime = select1[i].text;
				gameTimeDown = gameTime;
				thisGameTime = gameTime;
				window.localStorage.setItem("gameTime", gameTime);
			}
		}
	});
	// 下落个数选择
	var select2 = selects[1];
	addEvent(select2, "click", function() {
		for (var i=0; i<select2.length; i++) {
			if (select2[i].selected) {
				gameLevel = select2[i].text;
				window.localStorage.setItem("gameLevel", gameLevel);
			}
		}
		gameLevelShow();
	});
	// 增长指数选择
	var select3 = selects[2];
	addEvent(select3, "click", function() {
		for(var i=0; i<select3.length; i++) {
			if (select3[i].selected) {
				index = select3[i].text;
				window.localStorage.setItem("index", index);
			}
		}
	});
	// 下落速度选择
	var select4 = selects[3];
	addEvent(select4, "click", function() {
		for(var i=0; i<select4.length; i++) {
			if (select4[i].selected) {
				switch(select4[i].text) {
					case "快速": downTimeInterval = 3000; break;
					case "中速": downTimeInterval = 4500; break;
					case "慢速": downTimeInterval = 6000; break;
					default: return false;
				}
				window.localStorage.setItem("downTimeInterval", downTimeInterval);
			}
		}
	});
}
addLoadEvent(configure);

function cookieData() {
	var lastTime = window.localStorage.getItem("gameTime");
	var lastLevel = window.localStorage.getItem("gameLevel");
	var lastIndex = window.localStorage.getItem("index");
	var lastInterval = window.localStorage.getItem("downTimeInterval");
	if (lastTime) {
		gameTime = lastTime;
		gameTimeDown = gameTime;
	}
	if (lastLevel) {
		gameLevel = lastLevel;
	}
	if (lastIndex) {
		index = lastIndex;
	}
	if (lastInterval) {
		downTimeInterval = lastInterval;
	}
}
addLoadEvent(cookieData);