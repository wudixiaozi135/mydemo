/**
 * 地图的平铺块
 */
class MapTile extends egret.Bitmap
{
	private _cfg: any;
	private _layer: egret.DisplayObjectContainer;
	private _thumb: egret.Bitmap;
	private _isDestroyed: boolean = false;
	private _hasStart: boolean = false;
	private _isInViewPoint: boolean = false;

	/**
	 * 构造函数
	 * @param cfg        地图背景配置
	 * @param layer        地图块图层
	 * @param maskCfg    地图蒙板配置
	 * @param maskLayer    蒙板块图层
	 * @param thumb        缩略图
	 */
	constructor(cfg: any, layer: egret.DisplayObjectContainer, thumb: egret.Bitmap = null)
	{
		super();
		this._cfg = cfg;
		this._layer = layer;
		this._thumb = thumb;
	}

	public get cfg(): any
	{
		return this._cfg;
	}

	public get url(): string
	{
		//https://resh5.zzcq.lzgame.top/h10/241/map/map002/image/2_7.jpg
		let cfg = this._cfg;
		var url = cfg.mapId + "/image/" + cfg.row + "_" + (cfg.column);
		return GameConfig.getMapRes(url);
	}

	/**
	 * 进入地图可视范围内
	 */
	public inViewpoint(): void
	{
		if (this._isInViewPoint) return;
		this._isInViewPoint = true;

		!this._hasStart && egret.callLater(this.startLoad, this);

		!this.parent && this._layer.addChild(this);

		if (this._thumb && !this._thumb.parent)
		{
			this._layer.addChild(this._thumb);
		}

		let data = this._cfg;
		if (data)
		{
			let targetX: number = data.column * data.w;
			let targetY: number = data.row * data.h;
			if (this.x != targetX)
			{
				this.x = targetX;
			}
			if (this.y != targetY)
			{
				this.y = targetY;
			}
		}
	}

	/**
	 * 离开可视范围
	 */
	public outViewpoint(): void
	{
		if (!this._isInViewPoint) return;
		this._isInViewPoint = false;

		this.parent && this.parent.removeChild(this);
		if (this._thumb && this._thumb.parent)
		{
			this._thumb.parent.removeChild(this._thumb);
		}
	}

	private startLoad(): void
	{
		this._hasStart = true;
		RES.getResByUrl(this.url, this.onLoadImage, this, RES.ResourceItem.TYPE_IMAGE);
	}

	private onLoadImage(image: egret.Texture, url: string): void
	{
		this.texture = image;
		if (this._thumb)
		{
			egret.Tween.get(this._thumb).to({alpha: 0}, 100).call(this.destroyThumb, this);
			this.destroyThumb();
		}
	}

	/**
	 * 销毁马赛克
	 */
	private destroyThumb(): void
	{
		let thumb = this._thumb;
		if (thumb)
		{
			if (thumb.parent)
			{
				thumb.parent.removeChild(thumb);
			}
			if (thumb.texture)
			{
				thumb.texture.dispose();
				thumb.texture = null;
			}
			this._thumb = null;
		}
	}

	/**
	 * 析构地图块
	 */
	public destroy(): void
	{
		if (this._isDestroyed) return;

		this.outViewpoint();
		this.destroyThumb();

		if (this._hasStart)
		{
			this.texture = null;
			this._hasStart = false;
			RES.destroyRes(this.url);
		}
		this._cfg = null;
		this._layer = null;
		this._isDestroyed = true;
	}
}