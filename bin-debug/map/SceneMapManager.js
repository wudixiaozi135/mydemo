/**
 * Created by xiaoding on 2018/12/29
 */
var SceneMapManager = /** @class */ (function () {
    function SceneMapManager() {
        this.TileW = 256;
        this.TileH = 256;
    }
    SceneMapManager.getInstance = function () {
        if (!SceneMapManager._instance) {
            SceneMapManager._instance = new SceneMapManager();
        }
        return SceneMapManager._instance;
    };
    SceneMapManager.prototype.init = function (mapCanvas) {
        this.mapDic = {};
        this.mapCfgs = [];
        this.mapCanvas = mapCanvas;
        this.viewRect = new egret.Rectangle(-1, -1, 0, 0);
        var mapUrl = "https://resh5.zzcq.lzgame.top/h10/487/map/maps.json";
        RES.getResByUrl(mapUrl, this.onLoadMapCom, this, RES.ResourceItem.TYPE_JSON);
    };
    SceneMapManager.prototype.onLoadMapCom = function (data, url) {
        var arr = [];
        for (var key in data) {
            var param = data[key];
            param.mapId = key;
            arr.push(param);
            this.mapDic[key] = param;
        }
        this.mapCfgs = arr;
    };
    SceneMapManager.prototype.switchMap = function (mapId) {
        var mapCfg;
        if (!mapId) {
            mapCfg = this.mapCfgs[Math.random() * this.mapCfgs.length >> 0];
        }
        else {
            mapCfg = this.mapDic[mapId];
        }
        var obj = {};
        obj.mapId = mapCfg.mapId;
        obj.w = this.TileW;
        obj.h = this.TileH;
        obj.column = (mapCfg.pixWidth + obj.w - 1) / obj.w >> 0;
        obj.row = (mapCfg.pixHeight + obj.h - 1) / obj.h >> 0;
        obj.pixWidth = mapCfg.pixWidth;
        obj.pixHeight = mapCfg.pixHeight;
        this.mapCanvas.initData(obj);
        this.mapCanvas.update(this.viewRect);
    };
    SceneMapManager.prototype.resize = function (sw, sh) {
        this.stageW = sw;
        this.stageH = sh;
        if (this.mapCanvas) {
            this.viewRect.x = 0;
            this.viewRect.y = 0;
            this.viewRect.width = sw;
            this.viewRect.height = sh;
            this.mapCanvas.update(this.viewRect);
        }
    };
    return SceneMapManager;
}());
//# sourceMappingURL=SceneMapManager.js.map