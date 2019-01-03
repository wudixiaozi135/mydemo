/**
 * Created by xiaoding on 2018/11/27
 */
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.getMapRes = function (url) {
        var subKey = "map/" + url + ".jpg";
        var dic = window["verData"];
        if (subKey in dic) {
            return "https://resh5.zzcq.lzgame.top/h10/" + dic[subKey] + "/" + subKey;
        }
        return "https://resh5.zzcq.lzgame.top/h10/0/" + subKey;
    };
    GameConfig.getSoundRes = function (url) {
        return GameConfig.RES + "sound/" + url + ".mp3";
    };
    GameConfig.RES = "resource/assets/";
    return GameConfig;
}());
//# sourceMappingURL=GameConfig.js.map