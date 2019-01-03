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
 * 地图的平铺块
 */
var MapTile = /** @class */ (function (_super) {
    __extends(MapTile, _super);
    /**
     * 构造函数
     * @param cfg        地图背景配置
     * @param layer        地图块图层
     * @param maskCfg    地图蒙板配置
     * @param maskLayer    蒙板块图层
     * @param thumb        缩略图
     */
    function MapTile(cfg, layer, thumb) {
        if (thumb === void 0) { thumb = null; }
        var _this = _super.call(this) || this;
        _this._isDestroyed = false;
        _this._hasStart = false;
        _this._isInViewPoint = false;
        _this._cfg = cfg;
        _this._layer = layer;
        _this._thumb = thumb;
        return _this;
    }
    Object.defineProperty(MapTile.prototype, "cfg", {
        get: function () {
            return this._cfg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapTile.prototype, "url", {
        get: function () {
            //https://resh5.zzcq.lzgame.top/h10/241/map/map002/image/2_7.jpg
            var cfg = this._cfg;
            var url = cfg.mapId + "/image/" + cfg.row + "_" + (cfg.column);
            return GameConfig.getMapRes(url);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 进入地图可视范围内
     */
    MapTile.prototype.inViewpoint = function () {
        if (this._isInViewPoint)
            return;
        this._isInViewPoint = true;
        !this._hasStart && egret.callLater(this.startLoad, this);
        !this.parent && this._layer.addChild(this);
        if (this._thumb && !this._thumb.parent) {
            this._layer.addChild(this._thumb);
        }
        var data = this._cfg;
        if (data) {
            var targetX = data.column * data.w;
            var targetY = data.row * data.h;
            if (this.x != targetX) {
                this.x = targetX;
            }
            if (this.y != targetY) {
                this.y = targetY;
            }
        }
    };
    /**
     * 离开可视范围
     */
    MapTile.prototype.outViewpoint = function () {
        if (!this._isInViewPoint)
            return;
        this._isInViewPoint = false;
        this.parent && this.parent.removeChild(this);
        if (this._thumb && this._thumb.parent) {
            this._thumb.parent.removeChild(this._thumb);
        }
    };
    MapTile.prototype.startLoad = function () {
        this._hasStart = true;
        RES.getResByUrl(this.url, this.onLoadImage, this, RES.ResourceItem.TYPE_IMAGE);
    };
    MapTile.prototype.onLoadImage = function (image, url) {
        this.texture = image;
        if (this._thumb) {
            egret.Tween.get(this._thumb).to({ alpha: 0 }, 100).call(this.destroyThumb, this);
            this.destroyThumb();
        }
    };
    /**
     * 销毁马赛克
     */
    MapTile.prototype.destroyThumb = function () {
        var thumb = this._thumb;
        if (thumb) {
            if (thumb.parent) {
                thumb.parent.removeChild(thumb);
            }
            if (thumb.texture) {
                thumb.texture.dispose();
                thumb.texture = null;
            }
            this._thumb = null;
        }
    };
    /**
     * 析构地图块
     */
    MapTile.prototype.destroy = function () {
        if (this._isDestroyed)
            return;
        this.outViewpoint();
        this.destroyThumb();
        if (this._hasStart) {
            this.texture = null;
            this._hasStart = false;
            RES.destroyRes(this.url);
        }
        this._cfg = null;
        this._layer = null;
        this._isDestroyed = true;
    };
    return MapTile;
}(egret.Bitmap));
//# sourceMappingURL=MapTile.js.map