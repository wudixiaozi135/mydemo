/**
 * Created by xiaoding on 2018/10/10 0017.
 * */
class AccordionChildItem extends eui.ItemRenderer
{
	private labelDisplay: eui.Label;

	private _container: eui.Group;

	private _isChildrenCreated: boolean;

	/**是否展开*/
	private _isUnfold: boolean;

	/**子级0是根级 1，2，3*/
	subLevel: number;
	/**父级*/
	accordionParent: Accordion;

	/**子级*/
	accordionSub: Accordion;

	/**父间距*/
	PARENT_GAP: number = 5;

	/**项目间距*/
	ITEM_GAP: number = 5;

	/**索引ID*/
	id: number = -1;

	clickHandler: Function;

	/**子项根级*/
	accordionChildItemParent: AccordionChildItem;

	/**是否子项*/
	constructor(isSub: number = 0)
	{
		super();
		this.subLevel = isSub;
		/**多级皮肤*/
		switch (this.subLevel)
		{
			case 0:
				this.skinName = "AccordionTitleSkin";
				break;
			case 1:
				this.skinName = "AccordionItemSkin";
				break;
			default://默认层级皮肤
				this.skinName = "AccordionItemSkin";
		}
	}

	protected childrenCreated(): void
	{
		super.childrenCreated();
		this._isChildrenCreated = true;
		this.dataChanged();
	}

	protected createChildren(): void
	{
		super.createChildren();
		let verticalLayout = new eui.VerticalLayout();
		verticalLayout.gap = this.ITEM_GAP;
		this._container = new eui.Group();
		this.addChild(this._container);
		this._container.layout = verticalLayout;

		//主题
		if (!this.subLevel)
		{
			this.currentState = "unfold";
		}
	}

	protected dataChanged(): void
	{
		super.dataChanged();
		if (!this._isChildrenCreated) return;
		let data = this.data;
		if (!data) return;

		if ("label" in data)
		{
			this.labelDisplay.text = data.label;
		}
	}

	protected onTouchBegin(event: egret.TouchEvent): void
	{
		event.stopImmediatePropagation();
		if (event.target == this._container) return;

		this.clickHandler && this.clickHandler(this);
		super.onTouchBegin(event);
	}

	/**子项展开*/
	unfold(index: number = -1)
	{
		let data = this.data;
		if (!data) return;
		if (this._isUnfold) return;

		if ("children" in data)
		{
			this.clearContainer();
			this._container.top = this.height + this.PARENT_GAP;

			if (!this.accordionSub)
			{
				this.accordionSub = new Accordion();
			}
			this.accordionSub.setAccordionChildItemParent(this);
			this.accordionSub.setData(data.children);
			this._container.addChild(this.accordionSub);
			this.accordionSub.unfold(0, index);

			this._isUnfold = true;
			this.currentState = "fold";
		} else//默认当子项处理
		{
			if (index != -1)
			{
				if (Accordion.subIndex != -1)
				{
					this.accordionParent.selectItemByIndex(Accordion.subIndex);
				} else
				{
					this.accordionParent.selectItemByIndex(index);
				}
				this.clickHandler && this.clickHandler(this);
			}
		}
	}

	/**折叠*/
	fold()
	{
		if (!this.data) return;
		if (!this._isUnfold) return;

		this.clearContainer();
		this._container.top = 0;
		this._isUnfold = false;
		this.currentState = "unfold";
	}

	/**移除容器内容*/
	private clearContainer()
	{
		this._container.removeChildren();
	}

	/**设置父级*/
	setAccordion(accordion: Accordion)
	{
		this.accordionParent = accordion;
	}

	/**覆写选中事件*/
	get selected()
	{
		return egret.superGetter(AccordionChildItem, this, "selected");
	}

	set selected(value)
	{
		egret.superSetter(AccordionChildItem, this, "selected", value);

		if (!value)
		{
			Accordion.subIndex = -1;
		} else
		{
			Accordion.subIndex = this.accordionParent.getItemIndex(this);

			if (this.accordionChildItemParent)
			{
				Accordion.currentIndex = this.accordionChildItemParent.id;
			}
		}
	}

	get isUnfold(): boolean
	{
		return this._isUnfold;
	}

	dispose()
	{
		this.clearContainer();
		this.clickHandler = null;
		this.accordionParent = null;
		this.accordionChildItemParent = null;
		if (this.accordionSub)
		{
			this.accordionSub.dispose();
			this.accordionSub = null;
		}
		this.removeChildren();
		this._container = null;
	}
}