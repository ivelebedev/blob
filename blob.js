const app = new PIXI.Application({ antialias: true, transparent: true, width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

const init = ((app, width, height, blur) => {
	
	const container = new PIXI.Container();
	app.stage.addChild(container);
	
	container.x = 0;
	container.y = 0;
	container.width = width;
	container.height = height;
	container.pivot.x = container.width / 2;
	container.pivot.y = container.height / 2;

	const blurFilter = new PIXI.filters.BlurFilter();
	blurFilter.blur = blur.size;
	blurFilter.quality = blur.quality;
	container.filters = [blurFilter];
	
	return container;
})

const createBlobs = ((count, radius, radiusCoef, positionCoef, size) => {
	
	let objects = [];
	
	for(var i=0;i<6;i++) {
		let obj = {
			circle: new PIXI.Graphics(),
			itemAngle: 0,
			radiusX: radius+Math.random()*radiusCoef,
			radiusY: radius+Math.random()*radiusCoef
		}
		obj.circle.lineStyle(0); 
		obj.circle.beginFill(0xDE3249, 1);
		obj.circle.drawCircle(Math.random()*positionCoef, Math.random()*positionCoef, size);
		obj.circle.endFill();

		container.addChild(obj.circle);
		objects.push(obj);
	}
	
	return objects;
})

const container = init(app, 100, 100, { size: 20, quality: 8});
const objects = createBlobs(6, 10, 20, 40, 40);

app.ticker.add(() => {
	
	const mouseposition = app.renderer.plugins.interaction.mouse.global;

	speed = 5;
	
	var difY = mouseposition.y - container.y;
	var difX = mouseposition.x - container.x;

		
	for(var i=0;i<objects.length;i++) {
		objects[i].circle.x = Math.cos(objects[i].itemAngle) * objects[i].radiusX;
		objects[i].circle.y = Math.sin(objects[i].itemAngle) * objects[i].radiusY;
		
		if(i % 2 == 0) {
			objects[i].itemAngle -= 0.01;
		} else {
			objects[i].itemAngle += 0.01;
		}
	}
	
	var radians = Math.atan2(difY, difX);
	var speedX = speed * Math.cos(radians);
	var speedY = speed * Math.sin(radians);
	container.x = (Math.abs(difX) < speedX) ? mouseposition.x : (container.x + speedX);
	container.y = (Math.abs(difY) < speedY) ? mouseposition.y : (container.y + speedY);
});