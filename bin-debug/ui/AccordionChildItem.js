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
 * */
var AccordionChildItem = /** @class */ (function (_super) {
    __extends(AccordionChildItem, _super);
    /**是否子项*/
    function AccordionChildItem(isSub) {
        if (isSub === void 0) { isSub = 0; }
        var _this = _super.call(this) || this;
        /**父间距*/
        _this.PARENT_GAP = 5;
        /**项目间距*/
        _this.ITEM_GAP = 5;
        /**索引ID*/
        _this.id = -1;
        _this.subLevel = isSub;
        /**多级皮肤*/
        switch (_this.subLevel) {
            case 0:
                _this.skinName = "AccordionTitleSkin";
                break;
            case 1:
                _this.skinName = "AccordionItemSkin";
                break;
            default: //默认层级皮肤
                _this.skinName = "AccordionItemSkin";
        }
        return _this;
    }
    AccordionChildItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._isChildrenCreated = true;
        this.dataChanged();
    };
    AccordionChildItem.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        var verticalLayout = new eui.VerticalLayout();
        verticalLayout.gap = this.ITEM_GAP;
        this._container = new eui.Group();
        this.addChild(this._container);
        this._container.layout = verticalLayout;
        //主题
        if (!this.subLevel) {
            this.currentState = "unfold";
        }
    };
    AccordionChildItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this._isChildrenCreated)
            return;
        var data = this.data;
        if (!data)
            return;
        if ("label" in data) {
            this.labelDisplay.text = data.label;
        }
    };
    AccordionChildItem.prototype.onTouchBegin = function (event) {
        event.stopImmediatePropagation();
        if (event.target == this._container)
            return;
        this.clickHandler && this.clickHandler(this);
        _super.prototype.onTouchBegin.call(this, event);
    };
    /**子项展开*/
    AccordionChildItem.prototype.unfold = function (index) {
        if (index === void 0) { index = -1; }
        var data = this.data;
        if (!data)
            return;
        if (this._isUnfold)
            return;
        if ("children" in data) {
            this.clearContainer();
            this._container.top = this.height + this.PARENT_GAP;
            if (!this.accordionSub) {
                this.accordionSub = new Accordion();
            }
            this.accordionSub.setAccordionChildItemParent(this);
            this.accordionSub.setData(data.children);
            this._container.addChild(this.accordionSub);
            this.accordionSub.unfold(0, index);
            this._isUnfold = true;
            this.currentState = "fold";
        }
        else //默认当子项处理
         {
            if (index != -1) {
                if (Accordion.subIndex != -1) {
                    this.accordionParent.selectItemByIndex(Accordion.subIndex);
                }
                else {
                    this.accordionParent.selectItemByIndex(index);
                }
                this.clickHandler && this.clickHandler(this);
            }
        }
    };
    /**折叠*/
    AccordionChildItem.prototype.fold = function () {
        if (!this.data)
            return;
        if (!this._isUnfold)
            return;
        this.clearContainer();
        this._container.top = 0;
        this._isUnfold = false;
        this.currentState = "unfold";
    };
    /**移除容器内容*/
    AccordionChildItem.prototype.clearContainer = function () {
        this._container.removeChildren();
    };
    /**设置父级*/
    AccordionChildItem.prototype.setAccordion = function (accordion) {
        this.accordionParent = accordion;
    };
    Object.defineProperty(AccordionChildItem.prototype, "selected", {
        /**覆写选中事件*/
        get: function () {
            return egret.superGetter(AccordionChildItem, this, "selected");
        },
        set: function (value) {
            egret.superSetter(AccordionChildItem, this, "selected", value);
            if (!value) {
                Accordion.subIndex = -1;
            }
            else {
                Accordion.subIndex = this.accordionParent.getItemIndex(this);
                if (this.accordionChildItemParent) {
                    Accordion.currentIndex = this.accordionChildItemParent.id;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccordionChildItem.prototype, "isUnfold", {
        get: function () {
            return this._isUnfold;
        },
        enumerable: true,
        configurable: true
    });
    AccordionChildItem.prototype.dispose = function () {
        this.clearContainer();
        this.clickHandler = null;
        this.accordionParent = null;
        this.accordionChildItemParent = null;
        if (this.accordionSub) {
            this.accordionSub.dispose();
            this.accordionSub = null;
        }
        this.removeChildren();
        this._container = null;
    };
    return AccordionChildItem;
}(eui.ItemRenderer));
//# sourceMappingURL=AccordionChildItem.js.map