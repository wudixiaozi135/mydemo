/**
 * Created by xiaoding on 2018/12/29
 */
class GameScene extends egret.Sprite
{
	private mapCanvas: MapTileCanvas;

	private entityLayer: egret.DisplayObjectContainer;


	private player: egret.Shape;

	private lastPos: egret.Point = new egret.Point();
	private targetPos: egret.Point = new egret.Point();
	private speed: number = 10;

	constructor()
	{
		super();
	}

	init()
	{
		this.touchEnabled = true;
		let mapLayer = new MapTileCanvas();
		mapLayer.touchChildren = false;
		mapLayer.touchEnabled = true;

		this.addChild(mapLayer);
		this.mapCanvas = mapLayer;

		let entityLayer = new egret.DisplayObjectContainer();
		this.addChild(entityLayer);
		entityLayer.touchChildren = false;
		entityLayer.touchEnabled = false;
		this.entityLayer = entityLayer;

		let sp = new egret.Shape();
		sp.graphics.clear();
		sp.graphics.beginFill(0xff0000);
		sp.graphics.drawRect(0, 0, 10, 10);
		this.entityLayer.addChild(sp);
		this.player = sp;

		SceneMapManager.getInstance().init(mapLayer);

		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDown, this);
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnter, this);
	}

	private onMouseDown(ev: egret.TouchEvent)
	{
		if (ev.target != this.mapCanvas) return;
		if (this.targetPos.x == ev.localX && this.targetPos.y == ev.localY) return;
		this.targetPos.setTo(ev.localX, ev.localY);
	}

	private onEnter(e: egret.Event)
	{
		if (!this.player) return;
		let targetP = this.targetPos;
		let lastP = this.lastPos;
		let player = this.player;
		let mapCanvas = this.mapCanvas;
		let container = this;
		let speed = this.speed;

		if (!mapCanvas || !mapCanvas.viewRect || !player || !targetP || !lastP) return;

		let pW: number = mapCanvas.pixWidth;
		let pH: number = mapCanvas.pixHeight;
		if (isNaN(pW) || isNaN(pH)) return;

		let column: number = targetP.x / mapCanvas.gridW >> 0;
		let row: number = targetP.y / mapCanvas.gridH >> 0;

		if (column >= mapCanvas.tileColumn) return;
		if (row >= mapCanvas.tileRow) return;

		let scrollRect = this.mapCanvas.viewRect;
		let halfRectX: number = scrollRect.width >> 1;
		let halfRectY: number = scrollRect.height >> 1;

		let result: number;
		if (Math.abs(targetP.x - player.x) > speed)
		{
			result = targetP.x - player.x;
			player.x += result > 0 ? speed : -speed;
		}

		if (Math.abs(targetP.y - player.y) > speed)
		{
			result = targetP.y - player.y;
			player.y += result > 0 ? speed : -speed;
		}

		if (scrollRect.x + halfRectX - speed > player.x)
		{
			scrollRect.x = player.x - halfRectX + speed;

		} else if (scrollRect.x + halfRectX + speed < player.x)
		{
			scrollRect.x = player.x - halfRectX - speed;
		}

		if (scrollRect.y + halfRectY - speed > player.y)
		{
			scrollRect.y = player.y - halfRectY + speed;
		} else if (scrollRect.y + halfRectY + speed < player.y)
		{
			scrollRect.y = player.y - halfRectY - speed;
		}

		if (scrollRect.x < 0)
		{
			scrollRect.x = 0;
		}

		if (scrollRect.x + scrollRect.width > pW)
		{
			scrollRect.x = pW - scrollRect.width;
		}

		if (scrollRect.y < 0)
		{
			scrollRect.y = 0;
		}

		if (scrollRect.y + scrollRect.height > pH)
		{
			scrollRect.y = pH - scrollRect.height;
		}
		mapCanvas.update(scrollRect);
		container.x = -scrollRect.x;
		container.y = -scrollRect.y;
	}
}