/**
 * Created by xiaoding on 2018/6/7 0007.
 */
/**
 * 图文混排类
 * */
class ImgTxtGroup extends eui.Group
{
	private _maxW: number;
	/**表情正则*/
	EMOTION_REG: RegExp = /\\[A-Za-z]/;

	//vip
	EMBED_TAG_REG: RegExp = /<(\w+)[^>]*?\/>/g;

	/**辅助文本*/
	helpTxt: egret.TextField;
	content: string = "";
	sourceTxt: eui.Label;

	/**表情索引差值 A-Z*/
	EMOTION_INDEX: number = 64;

	/**表情索引差值 a-z*/
	EMOTION_INDEX_2: number = 70;

	/**行间距*/
	LINE_SPACE: number = 3;

	/**字号*/
	private _fontSize: number;

	container: eui.Group;

	private _stroke: number = 0;
	private _strokeColor: number = 0;
	private _lineSpacing: number = 0;

	constructor(maxW: number = 415, fontSize: number = 26)
	{
		super();
		this._fontSize = fontSize;
		this._maxW = maxW;
		this.width = this.height = NaN;

		this.sourceTxt = new eui.Label();
		this.sourceTxt.lineSpacing = this.LINE_SPACE;
		this.sourceTxt.size = fontSize;
		// this.sourceTxt.border = true;
		// this.sourceTxt.borderColor = 0xffffff;
		this.sourceTxt.width = maxW;
		this.sourceTxt.multiline = true;
		this.sourceTxt.wordWrap = false;
		this.sourceTxt.textAlign = "left";
		this.sourceTxt.textColor = 0x502916;
		this.sourceTxt.fontFamily = "Microsoft YaHei";
		this.addChild(this.sourceTxt);

		this.container = new eui.Group();
		this.addChild(this.container);
		this.container.touchEnabled = false;
		this.container.touchChildren = false;
		this.helpTxt = new egret.TextField();
		this.helpTxt.fontFamily = "Microsoft YaHei";
		this.helpTxt.size = fontSize;
		this.helpTxt.lineSpacing = this.LINE_SPACE;
		this.helpTxt.multiline = true;
		this.helpTxt.wordWrap = false;
		this.helpTxt.textAlign = "left";
		this.helpTxt.width = maxW;
	}


	get maxW(): number
	{
		return this._maxW;
	}

	set maxW(value: number)
	{
		this._maxW = value;
		if (this.helpTxt)
		{
			this.helpTxt.width = value;
		}
		if (this.sourceTxt)
		{
			this.sourceTxt.width = value;
		}
	}

	get fontSize(): number
	{
		return this._fontSize;
	}

	set fontSize(value: number)
	{
		this._fontSize = value;
		if (this.helpTxt)
		{
			this.helpTxt.size = value;
		}
		if (this.sourceTxt)
		{
			this.sourceTxt.size = value;
		}
	}


	get stroke(): number
	{
		return this._stroke;
	}

	set stroke(value: number)
	{
		this._stroke = value;
		if (this.helpTxt)
		{
			this.helpTxt.stroke = value;
		}
		if (this.sourceTxt)
		{
			this.sourceTxt.stroke = value;
		}
	}

	get strokeColor(): number
	{
		return this._strokeColor;
	}

	set strokeColor(value: number)
	{
		this._strokeColor = value;

		if (this.helpTxt)
		{
			this.helpTxt.strokeColor = value;
		}
		if (this.sourceTxt)
		{
			this.sourceTxt.strokeColor = value;
		}
	}

	get lineSpacing(): number
	{
		return this._lineSpacing;
	}

	set lineSpacing(value: number)
	{
		this._lineSpacing = value;

		if (this.helpTxt)
		{
			this.helpTxt.lineSpacing = value;
		}
		if (this.sourceTxt)
		{
			this.sourceTxt.lineSpacing = value;
		}
	}

	/**解析内容*/
	parser(source: string): void
	{
		this.content = "";
		this.sourceTxt.text = "";
		this.helpTxt.text = "";
		this.container.removeChildren();

		var regs = [this.EMOTION_REG, this.EMBED_TAG_REG];

		let matchAttReg = /((\w+)\s*=\s'*(.*?)')/g;

		for (var i = 0; i < regs.length; i++)
		{
			let waitEmotionData = [];//表情基本信息
			let EMOTION_REG = regs[i];
			while (true)
			{
				let results: any = EMOTION_REG.exec(source);
				if (!results)
				{
					this.content += source;
					this.sourceTxt.textFlow = (new egret.HtmlTextParser).parser(this.content);
					this.sourceTxt.validateNow();
					break;
				}

				var value: string;
				var atts = results[0].match(matchAttReg);
				if (atts && atts.length > 0)
				{
					atts = atts[0].split("=");
				}
				if (atts && atts.length > 1)
				{
					value = atts[1];
				}

				let charValue: number = results[0].charCodeAt(1);
				if (charValue >= "a".charCodeAt(0) && charValue <= "z".charCodeAt(0))
				{
					charValue = charValue - this.EMOTION_INDEX_2;
				} else if (charValue >= "A".charCodeAt(0) && charValue <= "Z".charCodeAt(0))
				{
					charValue = charValue - this.EMOTION_INDEX;
				}

				let idx: number = results.index;
				let matchStr: string = results.input.substring(0, idx);//匹配内容
				this.content += matchStr;
				source = results.input.substring(idx + 2);//剩余文本

				//用跟表情大小相同的字号  中文空格 代替表情
				this.content += `<font size = '${this._fontSize}'>　</font>`;
				this.helpTxt.textFlow = new egret.HtmlTextParser().parser(this.content);

				let line: number = this.helpTxt.numLines;
				let lineArr = this.helpTxt.$getLinesArr();
				let lineObj: any;
				if (lineArr)
				{
					lineObj = lineArr[line - 1];
				}
				if (!lineObj)
				{
					//为空时默认
					lineObj = {width: this.helpTxt.textWidth, height: this.helpTxt.textHeight};
				}

				waitEmotionData.push({
					id: charValue,
					posX: lineObj.width - this.helpTxt.size,
					posY: (line - 1) * (lineObj.height + this.helpTxt.lineSpacing)
				});
			}

			if (waitEmotionData)
			{
				let emotionIndex: number;
				for (let element of waitEmotionData)
				{
					let img: eui.Image = new eui.Image();
					emotionIndex = (element.id % 33) || 33;//最大索引
					img.source = "ui_emotion_json.emotion_" + emotionIndex;
					img.width = img.height = this._fontSize;
					this.container.addChild(img);
					img.x = element.posX;
					img.y = element.posY;
				}
			}

		}

		this.height = this.sourceTxt.height;
	}

	/**析构*/
	dispose(): void
	{
		this.removeChildren();
		this.sourceTxt = null;
		this.helpTxt = null;
	}
}
