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
 * Created by xiaoding on 2018/11/27
 * 地图画布
 */
var MapTileCanvas = /** @class */ (function (_super) {
    __extends(MapTileCanvas, _super);
    function MapTileCanvas() {
        var _this = _super.call(this) || this;
        _this.VIEW_MAP_ENLARGE = 3;
        _this.lastRect = new egret.Rectangle();
        _this.cacheAsBitmap = true;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    MapTileCanvas.prototype.initData = function (mapCfg) {
        this.mapData = {};
        this.mapTiles = {};
        this.resetLastRect();
        var column = this.tileColumn = mapCfg.column;
        var row = this.tileRow = mapCfg.row;
        var mapId = this.mapId = mapCfg.mapId;
        var gridW = this.gridW = mapCfg.w;
        var gridH = this.gridH = mapCfg.h;
        this.pixWidth = mapCfg.pixWidth;
        this.pixHeight = mapCfg.pixHeight;
        var mapData = this.mapData;
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < column; j++) {
                mapData[this.makeKey(i, j)] = { mapId: mapId, row: i, column: j, w: gridW, h: gridH };
            }
        }
    };
    MapTileCanvas.prototype.update = function (viewPort) {
        if (!viewPort)
            return;
        var lastRect = this.lastRect;
        if (lastRect) {
            var gridW = this.gridW;
            var gridH = this.gridH;
            var xPos = viewPort.x;
            var yPos = viewPort.y;
            var w = viewPort.width;
            var h = viewPort.height;
            var enlarge = this.VIEW_MAP_ENLARGE;
            var row = this.tileRow;
            var col = this.tileColumn;
            var topLeftTile = this.pixelToTile(xPos, yPos);
            var bottomRightTile = new egret.Point();
            var bx = (xPos + w) / gridW >> 0;
            var by = (yPos + h) / gridH >> 0;
            bottomRightTile.x = (xPos + w) % gridW != 0 ? bx : bx - 1;
            bottomRightTile.y = (yPos + h) % gridH != 0 ? by : by - 1;
            var imageTile = void 0;
            var mapData = this.mapData;
            var imageTiles = this.mapTiles;
            var key = void 0;
            if (Math.abs(topLeftTile.x - lastRect.x) >= 1 || Math.abs(topLeftTile.y - lastRect.y) >= 1 || Math.abs(bottomRightTile.x - lastRect.right) >= 1 || Math.abs(bottomRightTile.y - lastRect.bottom) >= 1) {
                var i = void 0, j = void 0;
                if (lastRect.x != -1 && lastRect.y != -1) {
                    for (i = lastRect.x - enlarge; i <= lastRect.right + enlarge; ++i) {
                        for (j = lastRect.y - enlarge; j <= lastRect.bottom + enlarge; ++j) {
                            if (i >= 0 && j >= 0 && j < row && i < col &&
                                (i < topLeftTile.x - enlarge ||
                                    i > bottomRightTile.x + enlarge ||
                                    j < topLeftTile.y - enlarge ||
                                    j > bottomRightTile.y + enlarge)) {
                                key = this.makeKey(j, i);
                                imageTile = imageTiles[key];
                                if (imageTile) {
                                    imageTile.outViewpoint();
                                    delete imageTiles[key];
                                }
                            }
                        }
                    }
                }
                for (i = topLeftTile.x - enlarge; i <= bottomRightTile.x + enlarge; ++i) {
                    for (j = topLeftTile.y - enlarge; j <= bottomRightTile.y + enlarge; ++j) {
                        if (i >= 0 && j >= 0 && j < row && i < col &&
                            (i < lastRect.x - enlarge ||
                                i > lastRect.right ||
                                j < lastRect.y - enlarge ||
                                j > lastRect.bottom)) {
                            key = this.makeKey(j, i);
                            imageTile = imageTiles[key];
                            if (!imageTile) {
                                imageTiles[key] = imageTile = new MapTile(mapData[key], this);
                            }
                            imageTile.inViewpoint();
                        }
                    }
                }
            }
            lastRect.x = topLeftTile.x;
            lastRect.y = topLeftTile.y;
            lastRect.width = bottomRightTile.x - topLeftTile.x;
            lastRect.height = bottomRightTile.y - topLeftTile.y;
        }
        this.viewRect = viewPort;
    };
    MapTileCanvas.prototype.resetLastRect = function () {
        var lastRect = this.lastRect;
        if (lastRect) {
            lastRect.x = lastRect.y = -1;
            lastRect.width = lastRect.height = 0;
        }
    };
    MapTileCanvas.prototype.pixelToTile = function (pixelX, pixelY) {
        var tileX = pixelX / this.gridW >> 0;
        var tileY = pixelY / this.gridH >> 0;
        var point = new egret.Point(tileX, tileY);
        return point;
    };
    MapTileCanvas.prototype.makeKey = function (row, column) {
        return row + "_" + column;
    };
    /**释放资源*/
    MapTileCanvas.prototype.disposeRes = function () {
        if (this.mapTiles) {
            var tile = void 0;
            var mapTiles = this.mapTiles;
            for (var key in mapTiles) {
                tile = mapTiles[key];
                if (tile) {
                    tile.destroy();
                    tile = null;
                }
            }
            this.mapTiles = [];
        }
    };
    /**析构*/
    MapTileCanvas.prototype.dispose = function () {
        this.cacheAsBitmap = false;
        this.disposeRes();
        this.mapData = null;
        this.mapTiles = null;
    };
    return MapTileCanvas;
}(egret.DisplayObjectContainer));
//# sourceMappingURL=MapTileCanvas.js.map