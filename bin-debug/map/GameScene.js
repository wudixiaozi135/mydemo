var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by xiaoding on 2018/12/29
 */
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this) || this;
        _this.lastPos = new egret.Point();
        _this.targetPos = new egret.Point();
        _this.speed = 10;
        return _this;
    }
    GameScene.prototype.init = function () {
        this.touchEnabled = true;
        var mapLayer = new MapTileCanvas();
        mapLayer.touchChildren = false;
        mapLayer.touchEnabled = true;
        this.addChild(mapLayer);
        this.mapCanvas = mapLayer;
        var entityLayer = new egret.DisplayObjectContainer();
        this.addChild(entityLayer);
        entityLayer.touchChildren = false;
        entityLayer.touchEnabled = false;
        this.entityLayer = entityLayer;
        var sp = new egret.Shape();
        sp.graphics.clear();
        sp.graphics.beginFill(0xff0000);
        sp.graphics.drawRect(0, 0, 10, 10);
        this.entityLayer.addChild(sp);
        this.player = sp;
        SceneMapManager.getInstance().init(mapLayer);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDown, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnter, this);
    };
    GameScene.prototype.onMouseDown = function (ev) {
        if (ev.target != this.mapCanvas)
            return;
        if (this.targetPos.x == ev.localX && this.targetPos.y == ev.localY)
            return;
        this.targetPos.setTo(ev.localX, ev.localY);
    };
    GameScene.prototype.onEnter = function (e) {
        if (!this.player)
            return;
        var targetP = this.targetPos;
        var lastP = this.lastPos;
        var player = this.player;
        var mapCanvas = this.mapCanvas;
        var container = this;
        var speed = this.speed;
        if (!mapCanvas || !mapCanvas.viewRect || !player || !targetP || !lastP)
            return;
        var pW = mapCanvas.pixWidth;
        var pH = mapCanvas.pixHeight;
        if (isNaN(pW) || isNaN(pH))
            return;
        var column = targetP.x / mapCanvas.gridW >> 0;
        var row = targetP.y / mapCanvas.gridH >> 0;
        if (column >= mapCanvas.tileColumn)
            return;
        if (row >= mapCanvas.tileRow)
            return;
        var scrollRect = this.mapCanvas.viewRect;
        var halfRectX = scrollRect.width >> 1;
        var halfRectY = scrollRect.height >> 1;
        var result;
        if (Math.abs(targetP.x - player.x) > speed) {
            result = targetP.x - player.x;
            player.x += result > 0 ? speed : -speed;
        }
        if (Math.abs(targetP.y - player.y) > speed) {
            result = targetP.y - player.y;
            player.y += result > 0 ? speed : -speed;
        }
        if (scrollRect.x + halfRectX - speed > player.x) {
            scrollRect.x = player.x - halfRectX + speed;
        }
        else if (scrollRect.x + halfRectX + speed < player.x) {
            scrollRect.x = player.x - halfRectX - speed;
        }
        if (scrollRect.y + halfRectY - speed > player.y) {
            scrollRect.y = player.y - halfRectY + speed;
        }
        else if (scrollRect.y + halfRectY + speed < player.y) {
            scrollRect.y = player.y - halfRectY - speed;
        }
        if (scrollRect.x < 0) {
            scrollRect.x = 0;
        }
        if (scrollRect.x + scrollRect.width > pW) {
            scrollRect.x = pW - scrollRect.width;
        }
        if (scrollRect.y < 0) {
            scrollRect.y = 0;
        }
        if (scrollRect.y + scrollRect.height > pH) {
            scrollRect.y = pH - scrollRect.height;
        }
        mapCanvas.update(scrollRect);
        container.x = -scrollRect.x;
        container.y = -scrollRect.y;
    };
    return GameScene;
}(egret.Sprite));
//# sourceMappingURL=GameScene.js.map