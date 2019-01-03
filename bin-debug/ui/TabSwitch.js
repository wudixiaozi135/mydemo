/**
 * Created by xiaoding on 2018/11/17
 */
var TabSwitch = /** @class */ (function () {
    function TabSwitch(subViewClass, container) {
        this.subViewClass = subViewClass;
        this.subViews = [];
        this.container = container;
    }
    Object.defineProperty(TabSwitch.prototype, "selectIndex", {
        get: function () {
            return this._selectIndex;
        },
        set: function (value) {
            if (this._selectIndex != value) {
                this._selectIndex = value;
                var subView;
                if (this.subViews) {
                    for (var i = 0, len = this.subViews.length; i < len; i++) {
                        subView = this.subViews[i];
                        if (subView.isShow) {
                            subView.parent && subView.parent.removeChild(subView);
                            subView.onHide();
                        }
                    }
                }
                subView = this.subViews[value];
                if (!subView) {
                    var funcClass = this.subViewClass[value];
                    if (funcClass) {
                        this.subViews[value] = (subView = new funcClass());
                    }
                }
                if (!subView)
                    return;
                if (this.viewDatas) {
                    subView.data = this.viewDatas[value];
                }
                subView.onShow();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置所有显示对象数据
     * */
    TabSwitch.prototype.setData = function (datas) {
        this.viewDatas = datas;
        var index = this.selectIndex;
        if (index != -1) {
            var view = this.subViews[index];
            if (view) {
                view.data = datas[index];
            }
        }
    };
    /**
     * 更新子对对象
     * */
    TabSwitch.prototype.updateView = function (index) {
        var view = this.subViews[index];
        if (view) {
            view.update();
        }
    };
    /**析构*/
    TabSwitch.prototype.dispose = function () {
        if (this.subViews) {
            this.subViews.forEach(function (e) { return e.onDispose(); });
            this.subViews = null;
        }
        this.subViewClass = null;
        this.container = null;
        this.viewDatas = null;
    };
    return TabSwitch;
}());
//# sourceMappingURL=TabSwitch.js.map