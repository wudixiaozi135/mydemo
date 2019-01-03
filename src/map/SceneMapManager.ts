/**
 * Created by xiaoding on 2018/12/29
 */
class SceneMapManager
{
	private static _instance: SceneMapManager;

	private mapCanvas: MapTileCanvas;

	private mapDic: any;
	private mapCfgs: any[];

	private stageW: number;
	private stageH: number;

	private viewRect: egret.Rectangle;

	private TileW: number = 256;
	private TileH: number = 256;


	static getInstance(): SceneMapManager
	{
		if (!SceneMapManager._instance)
		{
			SceneMapManager._instance = new SceneMapManager();
		}
		return SceneMapManager._instance;
	}

	init(mapCanvas: MapTileCanvas): void
	{
		this.mapDic = {};
		this.mapCfgs = [];
		this.mapCanvas = mapCanvas;

		this.viewRect = new egret.Rectangle(-1, -1, 0, 0);


		let mapUrl: string = "https://resh5.zzcq.lzgame.top/h10/487/map/maps.json";
		RES.getResByUrl(mapUrl, this.onLoadMapCom, this, RES.ResourceItem.TYPE_JSON);
	}

	private onLoadMapCom(data: any, url: string)
	{
		let arr = [];
		for (let key in data)
		{
			let param = data[key];
			param.mapId = key;
			arr.push(param);
			this.mapDic[key] = param;
		}
		this.mapCfgs = arr;
	}

	switchMap(mapId: string)
	{
		let mapCfg;
		if (!mapId)
		{
			mapCfg = this.mapCfgs[Math.random() * this.mapCfgs.length >> 0];
		} else
		{
			mapCfg = this.mapDic[mapId];
		}

		let obj: any = {};
		obj.mapId = mapCfg.mapId;
		obj.w = this.TileW;
		obj.h = this.TileH;
		obj.column = (mapCfg.pixWidth + obj.w - 1) / obj.w >> 0;
		obj.row = (mapCfg.pixHeight + obj.h - 1) / obj.h >> 0;
		obj.pixWidth = mapCfg.pixWidth;
		obj.pixHeight = mapCfg.pixHeight;

		this.mapCanvas.initData(obj);
		this.mapCanvas.update(this.viewRect);
	}

	resize(sw: number, sh: number)
	{
		this.stageW = sw;
		this.stageH = sh;

		if (this.mapCanvas)
		{
			this.viewRect.x = 0;
			this.viewRect.y = 0;
			this.viewRect.width = sw;
			this.viewRect.height = sh;
			this.mapCanvas.update(this.viewRect);
		}
	}
}