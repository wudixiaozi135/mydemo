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
 * Created by xiaoding on 2018/6/7 0007.
 */
/**
 * 图文混排类
 * */
var ImgTxtGroup = /** @class */ (function (_super) {
    __extends(ImgTxtGroup, _super);
    function ImgTxtGroup(maxW, fontSize) {
        if (maxW === void 0) { maxW = 415; }
        if (fontSize === void 0) { fontSize = 26; }
        var _this = _super.call(this) || this;
        /**表情正则*/
        _this.EMOTION_REG = /\\[A-Za-z]/;
        //vip
        _this.EMBED_TAG_REG = /<(\w+)[^>]*?\/>/g;
        _this.content = "";
        /**表情索引差值 A-Z*/
        _this.EMOTION_INDEX = 64;
        /**表情索引差值 a-z*/
        _this.EMOTION_INDEX_2 = 70;
        /**行间距*/
        _this.LINE_SPACE = 3;
        _this._stroke = 0;
        _this._strokeColor = 0;
        _this._lineSpacing = 0;
        _this._fontSize = fontSize;
        _this._maxW = maxW;
        _this.width = _this.height = NaN;
        _this.sourceTxt = new eui.Label();
        _this.sourceTxt.lineSpacing = _this.LINE_SPACE;
        _this.sourceTxt.size = fontSize;
        // this.sourceTxt.border = true;
        // this.sourceTxt.borderColor = 0xffffff;
        _this.sourceTxt.width = maxW;
        _this.sourceTxt.multiline = true;
        _this.sourceTxt.wordWrap = false;
        _this.sourceTxt.textAlign = "left";
        _this.sourceTxt.textColor = 0x502916;
        _this.sourceTxt.fontFamily = "Microsoft YaHei";
        _this.addChild(_this.sourceTxt);
        _this.container = new eui.Group();
        _this.addChild(_this.container);
        _this.container.touchEnabled = false;
        _this.container.touchChildren = false;
        _this.helpTxt = new egret.TextField();
        _this.helpTxt.fontFamily = "Microsoft YaHei";
        _this.helpTxt.size = fontSize;
        _this.helpTxt.lineSpacing = _this.LINE_SPACE;
        _this.helpTxt.multiline = true;
        _this.helpTxt.wordWrap = false;
        _this.helpTxt.textAlign = "left";
        _this.helpTxt.width = maxW;
        return _this;
    }
    Object.defineProperty(ImgTxtGroup.prototype, "maxW", {
        get: function () {
            return this._maxW;
        },
        set: function (value) {
            this._maxW = value;
            if (this.helpTxt) {
                this.helpTxt.width = value;
            }
            if (this.sourceTxt) {
                this.sourceTxt.width = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImgTxtGroup.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        set: function (value) {
            this._fontSize = value;
            if (this.helpTxt) {
                this.helpTxt.size = value;
            }
            if (this.sourceTxt) {
                this.sourceTxt.size = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImgTxtGroup.prototype, "stroke", {
        get: function () {
            return this._stroke;
        },
        set: function (value) {
            this._stroke = value;
            if (this.helpTxt) {
                this.helpTxt.stroke = value;
            }
            if (this.sourceTxt) {
                this.sourceTxt.stroke = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImgTxtGroup.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        set: function (value) {
            this._strokeColor = value;
            if (this.helpTxt) {
                this.helpTxt.strokeColor = value;
            }
            if (this.sourceTxt) {
                this.sourceTxt.strokeColor = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImgTxtGroup.prototype, "lineSpacing", {
        get: function () {
            return this._lineSpacing;
        },
        set: function (value) {
            this._lineSpacing = value;
            if (this.helpTxt) {
                this.helpTxt.lineSpacing = value;
            }
            if (this.sourceTxt) {
                this.sourceTxt.lineSpacing = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**解析内容*/
    ImgTxtGroup.prototype.parser = function (source) {
        this.content = "";
        this.sourceTxt.text = "";
        this.helpTxt.text = "";
        this.container.removeChildren();
        var regs = [this.EMOTION_REG, this.EMBED_TAG_REG];
        var matchAttReg = /((\w+)\s*=\s'*(.*?)')/g;
        for (var i = 0; i < regs.length; i++) {
            var waitEmotionData = []; //表情基本信息
            var EMOTION_REG = regs[i];
            while (true) {
                var results = EMOTION_REG.exec(source);
                if (!results) {
                    this.content += source;
                    this.sourceTxt.textFlow = (new egret.HtmlTextParser).parser(this.content);
                    this.sourceTxt.validateNow();
                    break;
                }
                var value;
                var atts = results[0].match(matchAttReg);
                if (atts && atts.length > 0) {
                    atts = atts[0].split("=");
                }
                if (atts && atts.length > 1) {
                    value = atts[1];
                }
                var charValue = results[0].charCodeAt(1);
                if (charValue >= "a".charCodeAt(0) && charValue <= "z".charCodeAt(0)) {
                    charValue = charValue - this.EMOTION_INDEX_2;
                }
                else if (charValue >= "A".charCodeAt(0) && charValue <= "Z".charCodeAt(0)) {
                    charValue = charValue - this.EMOTION_INDEX;
                }
                var idx = results.index;
                var matchStr = results.input.substring(0, idx); //匹配内容
                this.content += matchStr;
                source = results.input.substring(idx + 2); //剩余文本
                //用跟表情大小相同的字号  中文空格 代替表情
                this.content += "<font size = '" + this._fontSize + "'>\u3000</font>";
                this.helpTxt.textFlow = new egret.HtmlTextParser().parser(this.content);
                var line = this.helpTxt.numLines;
                var lineArr = this.helpTxt.$getLinesArr();
                var lineObj = void 0;
                if (lineArr) {
                    lineObj = lineArr[line - 1];
                }
                if (!lineObj) {
                    //为空时默认
                    lineObj = { width: this.helpTxt.textWidth, height: this.helpTxt.textHeight };
                }
                waitEmotionData.push({
                    id: charValue,
                    posX: lineObj.width - this.helpTxt.size,
                    posY: (line - 1) * (lineObj.height + this.helpTxt.lineSpacing)
                });
            }
            if (waitEmotionData) {
                var emotionIndex = void 0;
                for (var _i = 0, waitEmotionData_1 = waitEmotionData; _i < waitEmotionData_1.length; _i++) {
                    var element = waitEmotionData_1[_i];
                    var img = new eui.Image();
                    emotionIndex = (element.id % 33) || 33; //最大索引
                    img.source = "ui_emotion_json.emotion_" + emotionIndex;
                    img.width = img.height = this._fontSize;
                    this.container.addChild(img);
                    img.x = element.posX;
                    img.y = element.posY;
                }
            }
        }
        this.height = this.sourceTxt.height;
    };
    /**析构*/
    ImgTxtGroup.prototype.dispose = function () {
        this.removeChildren();
        this.sourceTxt = null;
        this.helpTxt = null;
    };
    return ImgTxtGroup;
}(eui.Group));
//# sourceMappingURL=ImgTxtGroup.js.map