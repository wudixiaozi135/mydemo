/**
 * Created by xiaoding on 2018/11/17
 */
class TabSwitch
{
	private _selectIndex: number;
	private subViewClass: any[];
	private container: egret.DisplayObjectContainer;

	private subViews: IStackView[];

	private viewDatas: any[];

	constructor(subViewClass: Function[], container: egret.DisplayObjectContainer)
	{
		this.subViewClass = subViewClass;
		this.subViews = [];
		this.container = container;
	}

	get selectIndex(): number
	{
		return this._selectIndex;
	}

	set selectIndex(value: number)
	{
		if (this._selectIndex != value)
		{
			this._selectIndex = value;

			var subView: IStackView;
			if (this.subViews)
			{
				for (var i = 0, len = this.subViews.length; i < len; i++)
				{
					subView = this.subViews[i];
					if (subView.isShow)
					{
						subView.parent && subView.parent.removeChild(subView);
						subView.onHide();
					}
				}
			}

			subView = this.subViews[value];
			if (!subView)
			{
				var funcClass = this.subViewClass[value];
				if (funcClass)
				{
					this.subViews[value] = (subView = new funcClass());
				}
			}
			if (!subView) return;
			if (this.viewDatas)
			{
				subView.data = this.viewDatas[value];
			}
			subView.onShow();
		}
	}

	/**
	 * 设置所有显示对象数据
	 * */
	setData(datas: any[]): void
	{
		this.viewDatas = datas;

		var index: number = this.selectIndex;
		if (index != -1)
		{
			var view = this.subViews[index];
			if (view)
			{
				view.data = datas[index];
			}
		}
	}

	/**
	 * 更新子对对象
	 * */
	updateView(index: number): void
	{
		var view = this.subViews[index];
		if (view)
		{
			view.update();
		}
	}

	/**析构*/
	dispose()
	{
		if (this.subViews)
		{
			this.subViews.forEach(e => e.onDispose());
			this.subViews = null;
		}
		this.subViewClass = null;
		this.container = null;
		this.viewDatas = null;
	}
}

interface IStackView extends eui.Component
{
	isShow: boolean;

	data: any;

	update(): void;

	onShow(): void;

	onHide(): void;

	onDispose(): void;
}