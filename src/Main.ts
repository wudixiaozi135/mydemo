class Main extends eui.UILayer
{
	protected createChildren(): void
	{
		egret.ImageLoader.crossOrigin = "*";
		super.createChildren();

		egret.lifecycle.addLifecycleListener((context) => {
			// custom lifecycle plugin
		})

		egret.lifecycle.onPause = () => {
			// egret.ticker.pause();

			egret.ticker.resume();

		}

		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
		}

		//inject the custom material parser
		//注入自定义的素材解析器
		let assetAdapter = new AssetAdapter();
		egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
		egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


		this.runGame().catch(e => {
		})
	}

	private async runGame()
	{
		await this.loadResource()
		this.createGameScene();
	}

	private async loadResource()
	{
		try
		{
			const loadingView = new LoadingUI();
			this.stage.addChild(loadingView);

			await RES.loadConfig("default.res.json", "http://192.168.1.92/resource/");
			await this.loadTheme();
			await RES.loadGroup("preload", 0, loadingView);
			this.stage.removeChild(loadingView);
		} catch (e)
		{
			console.error(e);
		}
	}

	private loadTheme()
	{
		return new Promise((resolve, reject) => {
			// load skin theme configuration file, you can manually modify the file. And replace the default skin.
			//加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
			let theme = new eui.Theme("resource/default.thm.json", this.stage);
			theme.addEventListener(eui.UIEvent.COMPLETE, () => {
				resolve();
			}, this);

		})
	}

	/**
	 * 创建场景界面
	 * Create scene interface
	 */
	protected createGameScene(): void
	{
		RES.getResByUrl("https://resh5.zzcq.lzgame.top/h10//536/536.json", (data, url) => {
			window["verData"] = data;
			this.loadVerComplete();
		}, this, RES.ResourceItem.TYPE_JSON);


		let btn = new eui.Button();
		btn.horizontalCenter = 0;
		btn.top = 10;
		btn.label = "Switch";
		this.addChild(btn);
		btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			SceneMapManager.getInstance().switchMap(null);
		}, this);

		this.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
	}

	private loadVerComplete()
	{
		let gameScene = new GameScene();
		this.addChildAt(gameScene, 0);
		gameScene.init();
		this.onStageResize();
	}


	private onStageResize()
	{
		SceneMapManager.getInstance().resize(this.stage.stageWidth, this.stage.stageHeight);
	}
}