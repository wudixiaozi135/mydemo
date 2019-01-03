/**
 * Created by xiaoding on 2018/11/27
 * 地图画布
 */
class MapTileCanvas extends egret.DisplayObjectContainer
{
	tileColumn: number;
	tileRow: number;
	mapData: any;
	mapId: number;
	gridW: number;
	gridH: number;
	pixWidth: number;
	pixHeight: number;
	mapTiles: {};
	viewRect: egret.Rectangle;
	VIEW_MAP_ENLARGE: number = 3;
	private lastRect = new egret.Rectangle();

	constructor()
	{
		super();
		this.cacheAsBitmap = true;
		this.touchEnabled = false;
		this.touchChildren = false;
	}

	initData(mapCfg: any): void
	{
		this.mapData = {};
		this.mapTiles = {};
		this.resetLastRect();

		let column: number = this.tileColumn = mapCfg.column;
		let row: number = this.tileRow = mapCfg.row;
		let mapId: number = this.mapId = mapCfg.mapId;
		let gridW: number = this.gridW = mapCfg.w;
		let gridH: number = this.gridH = mapCfg.h;
		this.pixWidth = mapCfg.pixWidth;
		this.pixHeight = mapCfg.pixHeight;

		let mapData = this.mapData;
		for (let i = 0; i < row; i++)
		{
			for (let j = 0; j < column; j++)
			{
				mapData[this.makeKey(i, j)] = {mapId: mapId, row: i, column: j, w: gridW, h: gridH};
			}
		}
	}

	update(viewPort: egret.Rectangle)
	{
		if (!viewPort) return;

		let lastRect = this.lastRect;
		if (lastRect)
		{
			let gridW = this.gridW;
			let gridH = this.gridH;
			let xPos: number = viewPort.x;
			let yPos: number = viewPort.y;
			let w: number = viewPort.width;
			let h: number = viewPort.height;
			let enlarge = this.VIEW_MAP_ENLARGE;
			let row: number = this.tileRow;
			let col: number = this.tileColumn;

			let topLeftTile = this.pixelToTile(xPos, yPos);
			let bottomRightTile = new egret.Point();
			let bx: number = (xPos + w) / gridW >> 0;
			let by: number = (yPos + h) / gridH >> 0;
			bottomRightTile.x = (xPos + w) % gridW != 0 ? bx : bx - 1;
			bottomRightTile.y = (yPos + h) % gridH != 0 ? by : by - 1;

			let imageTile: MapTile;
			let mapData = this.mapData;
			let imageTiles = this.mapTiles;
			let key: string;

			if (Math.abs(topLeftTile.x - lastRect.x) >= 1 || Math.abs(topLeftTile.y - lastRect.y) >= 1 || Math.abs(bottomRightTile.x - lastRect.right) >= 1 || Math.abs(bottomRightTile.y - lastRect.bottom) >= 1)
			{
				let i: number, j: number;
				if (lastRect.x != -1 && lastRect.y != -1)
				{
					for (i = lastRect.x - enlarge; i <= lastRect.right + enlarge; ++i)
					{
						for (j = lastRect.y - enlarge; j <= lastRect.bottom + enlarge; ++j)
						{
							if (i >= 0 && j >= 0 && j < row && i < col &&
								(i < topLeftTile.x - enlarge ||
									i > bottomRightTile.x + enlarge ||
									j < topLeftTile.y - enlarge ||
									j > bottomRightTile.y + enlarge))
							{

								key = this.makeKey(j, i);
								imageTile = imageTiles[key];
								if (imageTile)
								{
									imageTile.outViewpoint();
									delete imageTiles[key];
								}
							}
						}
					}
				}

				for (i = topLeftTile.x - enlarge; i <= bottomRightTile.x + enlarge; ++i)
				{
					for (j = topLeftTile.y - enlarge; j <= bottomRightTile.y + enlarge; ++j)
					{
						if (i >= 0 && j >= 0 && j < row && i < col &&
							(i < lastRect.x - enlarge ||
								i > lastRect.right ||
								j < lastRect.y - enlarge ||
								j > lastRect.bottom))
						{
							key = this.makeKey(j, i);
							imageTile = imageTiles[key];
							if (!imageTile)
							{
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
	}

	resetLastRect()
	{
		let lastRect = this.lastRect;
		if (lastRect)
		{
			lastRect.x = lastRect.y = -1;
			lastRect.width = lastRect.height = 0;
		}
	}

	pixelToTile(pixelX: number, pixelY: number): egret.Point
	{
		var tileX: number = pixelX / this.gridW >> 0;
		var tileY: number = pixelY / this.gridH >> 0;
		var point = new egret.Point(tileX, tileY);
		return point;
	}

	makeKey(row: number, column: number): string
	{
		return row + "_" + column;
	}

	/**释放资源*/
	disposeRes()
	{
		if (this.mapTiles)
		{
			let tile: any;
			let mapTiles = this.mapTiles;
			for (let key in mapTiles)
			{
				tile = mapTiles[key];
				if (tile)
				{
					tile.destroy();
					tile = null;
				}
			}
			this.mapTiles = [];
		}
	}

	/**析构*/
	dispose()
	{
		this.cacheAsBitmap = false;
		this.disposeRes();
		this.mapData = null;
		this.mapTiles = null;
	}
}