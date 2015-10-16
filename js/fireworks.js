	document.body.appendChild(c);
	// 设置canvas大小
	var W, H;
	var lastTime = 0;
	c.width = W = window.innerWidth;
	c.height = H = window.innerHeight - oGameInfo.clientHeight + 100;
	
	// 烟花爆炸
	function fireworks(x, y) {
		var timer = null;
		// 生成烟花的一个花瓣
		function createPT(x, y, r, g, b) {
			return {
				x: x,
				y: y,
				r: r,
				g: g,
				b: b,
				// 轨迹
				trace: [],
				dx: rnd(20) - 10,
				dy: rnd(10) - 7,
				life: 15,
				// 移动
				move: function() {
					this.dx *= 0.95;
					this.dy *= 0.95;
					this.dy += 0.3;
					this.x += this.dx;
					this.y += this.dy;
					this.trace.push([this.x, this.y]);
					// 设置轨迹（花瓣）长度
					if (this.trace.length > 6) {
						this.trace.shift();
					}
					this.life--;
				}
			};
		}
		
		// 总烟花
		var Booms = [];
		// 在x,y位置创建一个烟花
		function createBoom(x, y) {
			var boom = [],
			r = rnd(255) | 0,
			g = rnd(255) | 0,
			b = rnd(255) | 0;
			for(var i = 0; i < rnd(6) + 14; i++) {
				boom.push(createPT(x, y, r, g, b));
			}
			Booms.push(boom);
		}
		
		timer = setInterval(function() {
			console.log(1);
			cvs.clearRect(0, 0, W, H);
			// 烟花
			for (var n = 0; n < Booms.length; n++) {
				var boom = Booms[n];
				for (var i = 0; i < boom.length; i++) {
					var single = boom[i];
					single.move();
					drawTrace(single.trace, single.r, single.g, single.b);
					// 花瓣生存周期结束就消失
					if (single.life <= 0) {
						boom.splice(i, 1);
					}
				}
				// 一个烟花包含的花瓣数为零，则消失
				if (!Booms[n].length) {
					Booms.splice(n, 1);
					clearInterval(timer);
					cvs.clearRect(0, 0, W, H);
				}
			}
			if (new Date() - lastTime < 680) return;
			lastTime = new Date();
			createBoom(x, y);
		}, 20);
		
		// 随机数
		function rnd(n) {
			return (n || 1) * Math.random();
		}
		
		// 画轨迹
		function drawTrace(trace, r, g, b) {
			cvs.save();
			for (var i = 0; i < trace.length; i++) {
				cvs.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.4 + ')';
				cvs.lineWidth = Math.min(i + 1, 4) * 2;
				cvs.beginPath();
				cvs.moveTo(trace[i][0], trace[i][1]);
				for (var j = i + 1; j < trace.length; j++) {
					cvs.lineTo(trace[j][0], trace[j][1]);
				}
				cvs.stroke();
			}
			cvs.restore();
		}
	};