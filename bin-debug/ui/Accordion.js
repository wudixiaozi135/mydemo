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
var Accordion = /** @class */ (function (_super) {
    __extends(Accordion, _super);
    function Accordion() {
        var _this = _super.call(this) || this;
        _this.touchThrough = false;
        _this.touchEnabled = false;
        _this.touchChildren = true;
        _this._childrenList = [];
        return _this;
    }
    Accordion.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this._verticalLayout = new eui.VerticalLayout();
        this.layout = this._verticalLayout;
        this._isChildrenCreated = true;
    };
    Accordion.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        if (this._data) {
            this.setData(this._data);
        }
    };
    /**设置数据*/
    Accordion.prototype.setData = function (data) {
        var _this = this;
        this._data = data;
        if (!this._isChildrenCreated)
            return;
        this.clearChildren();
        data.forEach(function (e, i) {
            var child = new AccordionChildItem(e.sub);
            child.id = i;
            child.accordionChildItemParent = _this.accordionChildParent;
            _this.addChild(child);
            child.setAccordion(_this);
            child.data = e;
            child.clickHandler = _this.accordionChildClick.bind(_this);
            _this._childrenList[i] = child;
            e.sub && Accordion.accordionChildItems.push(child);
        }, this);
    };
    /**点击触发*/
    Accordion.prototype.accordionChildClick = function (target) {
        //非子项
        if (!target.subLevel) {
            if (target.isUnfold) {
                target.fold();
            }
            else {
                target.unfold(Accordion.currentIndex != target.id ? -1 : Accordion.subIndex);
            }
        }
        else {
            //子项取消所有
            this.cancelItemSelect(target);
            target.selected = true;
        }
        Accordion.clickChangeHandler && Accordion.clickChangeHandler(target.data);
    };
    /**清除子对象*/
    Accordion.prototype.clearChildren = function () {
        this._childrenList.forEach(function (e) {
            var index = Accordion.accordionChildItems.indexOf(e);
            e.dispose();
            index != -1 && Accordion.accordionChildItems.splice(index, 1);
        });
        this.removeChildren();
        this._childrenList = [];
    };
    /**展开
     * @param index 主项
     * @param subIndex 字项
     * */
    Accordion.prototype.unfold = function (index, subIndex) {
        if (index === void 0) { index = 0; }
        if (subIndex === void 0) { subIndex = -1; }
        this._childrenList[index] && this._childrenList[index].unfold(subIndex);
    };
    /**取消子项选中*/
    Accordion.prototype.cancelItemSelect = function (excludeItem) {
        Accordion.accordionChildItems && Accordion.accordionChildItems.forEach(function (e) { return excludeItem != e && (e.selected = false); });
    };
    /**设置选项*/
    Accordion.prototype.selectItemByIndex = function (index) {
        this._childrenList[index] && (!this._childrenList[index].selected && (this._childrenList[index].selected = true));
    };
    /**获取索引位置 从0开始*/
    Accordion.prototype.getItemIndex = function (child) {
        return this._childrenList.indexOf(child);
    };
    /**设置字对象父类*/
    Accordion.prototype.setAccordionChildItemParent = function (childRoot) {
        this.accordionChildParent = childRoot;
    };
    /**重置共享数据*/
    Accordion.reset = function () {
        Accordion.accordionChildItems = [];
        Accordion.currentIndex = -1;
        Accordion.subIndex = -1;
        Accordion.clickChangeHandler = null;
    };
    /**销毁*/
    Accordion.prototype.dispose = function () {
        Accordion.reset();
        this._verticalLayout = null;
        this._data = null;
        this.accordionChildParent = null;
        this.clearChildren();
    };
    /**静态所有子项*/
    Accordion.accordionChildItems = [];
    /**主索引*/
    Accordion.currentIndex = -1;
    /**子索引*/
    Accordion.subIndex = -1;
    return Accordion;
}(eui.Group));
//# sourceMappingURL=Accordion.js.map