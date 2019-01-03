/**
 * Created by xiaoding on 2018/10/10 0017.
 * 手风琴控件  不可同时使用两个控件(使用共享数据原因)
 *@example
 *
 var treeData =[
 {
	label: "红宝石",
	children: [
		{label: "神装",children: [{label: "二级红宝石", sub: 1}, {label: "三级红宝石", sub: 1}]},
		{label: "地装",children: [{label: "二级地装红宝石", sub: 1}, {label: "三级地装红宝石", sub: 1}]},
		{label: "人装",children: [{label: "二级人装红宝石", sub: 1}, {label: "三级人装红宝石", sub: 1}]}
	],
 },
 {
	label: "蓝宝石",
	children: [{label: "二级蓝宝石", sub: 1}, {label: "三级蓝宝石", sub: 1}, {label: "四级蓝宝石", sub: 1}]
 },
 {
	label: "绿宝石",
	children: [{label: "二级绿宝石", sub: 1}, {label: "三级绿宝石", sub: 1},{sub: 1, label: "四级绿宝石"}, {label: "五级绿宝石", sub: 1}]
 }
 ];
 Accordion.reset();
 let accordion = new Accordion();
 this.addChild(accordion);
 accordion.setData(treeData);
 accordion.unfold(1, 1);
 Accordion.clickChangeHandler = this.onChange.bind(this);//参数 data:any
 *
 * */
class Accordion extends eui.Group
{
	private _verticalLayout: eui.VerticalLayout;

	private _data: any[];

	private _isChildrenCreated: boolean;

	private _childrenList: AccordionChildItem[];

	/**根级子项*/
	accordionChildParent: AccordionChildItem;

	/**静态所有子项*/
	static accordionChildItems: AccordionChildItem[] = [];
	/**主索引*/
	static currentIndex: number = -1;
	/**子索引*/
	static subIndex: number = -1;
	/**单击事件*/
	static clickChangeHandler: Function;

	constructor()
	{
		super();
		this.touchThrough = false;
		this.touchEnabled = false;
		this.touchChildren = true;
		this._childrenList = [];
	}

	protected createChildren(): void
	{
		super.createChildren();
		this._verticalLayout = new eui.VerticalLayout();
		this.layout = this._verticalLayout;
		this._isChildrenCreated = true;
	}

	protected childrenCreated(): void
	{
		super.childrenCreated();
		if (this._data)
		{
			this.setData(this._data);
		}
	}

	/**设置数据*/
	setData(data: any[])
	{
		this._data = data;
		if (!this._isChildrenCreated) return;
		this.clearChildren();

		data.forEach((e, i) => {
			let child: AccordionChildItem = new AccordionChildItem(e.sub);
			child.id = i;
			child.accordionChildItemParent = this.accordionChildParent;
			this.addChild(child);
			child.setAccordion(this);
			child.data = e;
			child.clickHandler = this.accordionChildClick.bind(this);
			this._childrenList[i] = child;
			e.sub && Accordion.accordionChildItems.push(child);
		}, this);
	}

	/**点击触发*/
	private accordionChildClick(target: AccordionChildItem): void
	{
		//非子项
		if (!target.subLevel)
		{
			if (target.isUnfold)
			{
				target.fold();
			} else
			{
				target.unfold(Accordion.currentIndex != target.id ? -1 : Accordion.subIndex);
			}
		} else
		{
			//子项取消所有
			this.cancelItemSelect(target);
			target.selected = true;
		}
		Accordion.clickChangeHandler && Accordion.clickChangeHandler(target.data);
	}

	/**清除子对象*/
	private clearChildren()
	{
		this._childrenList.forEach(e => {
			let index = Accordion.accordionChildItems.indexOf(e);
			e.dispose();
			index != -1 && Accordion.accordionChildItems.splice(index, 1);
		});
		this.removeChildren();
		this._childrenList = [];
	}


	/**展开
	 * @param index 主项
	 * @param subIndex 字项
	 * */
	unfold(index: number = 0, subIndex: number = -1)
	{
		this._childrenList[index] && this._childrenList[index].unfold(subIndex);
	}

	/**取消子项选中*/
	cancelItemSelect(excludeItem?: AccordionChildItem)
	{
		Accordion.accordionChildItems && Accordion.accordionChildItems.forEach(e => excludeItem != e && (e.selected = false));
	}

	/**设置选项*/
	selectItemByIndex(index: number)
	{
		this._childrenList[index] && (!this._childrenList[index].selected && (this._childrenList[index].selected = true));
	}

	/**获取索引位置 从0开始*/
	getItemIndex(child)
	{
		return this._childrenList.indexOf(child);
	}

	/**设置字对象父类*/
	setAccordionChildItemParent(childRoot: AccordionChildItem)
	{
		this.accordionChildParent = childRoot;
	}

	/**重置共享数据*/
	static reset()
	{
		Accordion.accordionChildItems = [];
		Accordion.currentIndex = -1;
		Accordion.subIndex = -1;
		Accordion.clickChangeHandler = null;
	}

	/**销毁*/
	dispose()
	{
		Accordion.reset();
		this._verticalLayout = null;
		this._data = null;
		this.accordionChildParent = null;
		this.clearChildren();
	}
}