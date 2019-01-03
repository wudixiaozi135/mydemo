/**
 * Created by xiaoding on 2018/11/27
 */
class GameConfig
{
	static RES: string = "resource/assets/";

	static getMapRes(url: string): string
	{
		let subKey: string = "map/" + url + ".jpg";
		let dic = window["verData"];
		if (subKey in dic)
		{
			return "https://resh5.zzcq.lzgame.top/h10/" + dic[subKey] + "/" + subKey;
		}
		return "https://resh5.zzcq.lzgame.top/h10/0/" + subKey;
	}

	static getSoundRes(url: string)
	{
		return GameConfig.RES + "sound/" + url + ".mp3";
	}
}
