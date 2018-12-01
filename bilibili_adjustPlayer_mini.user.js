// ==UserScript==
// @name        哔哩哔哩（bilibili.com）播放器调整Mini
// @namespace   Weidi Deng
// @author      Weidi Deng
// @license     GPL-3.0-or-later
// @homepageURL https://github.com/WeidiDeng/bilibili_adjustPlayer
// @include     http*://www.bilibili.com/video/av*
// @include     http*://www.bilibili.com/watchlater/*
// @include     http*://www.bilibili.com/bangumi/play/ep*
// @include     http*://www.bilibili.com/bangumi/play/ss*
// @include     http*://bangumi.bilibili.com/anime/*/play*
// @include     http*://bangumi.bilibili.com/movie/*
// @exclude     http*://bangumi.bilibili.com/movie/
// @description 调整B站播放器设置。
// @version     0.3
// @run-at      document-end
// ==/UserScript==
(function() {
    'use strict';
    var adjustPlayer = {
        hideDanmuku: function(newPlayer) {
            if (newPlayer) {
                var controlBtn = querySelectorFromIframe('.bilibili-player-video-sendbar .bilibili-player-video-danmaku-root .bilibili-player-video-danmaku-switch > input');
                if (controlBtn !== null) {
                    doClick(controlBtn);
                }
            } else {
                var controlBtn = querySelectorFromIframe('.bilibili-player-video-control > div[name="ctlbar_danmuku_on"] i');
                if (controlBtn !== null) {
                    doClick(controlBtn);
                }
            }
            console.log("hide danmuku");
        },
        hideExtra: function(newPlayer) {
            var sendbar = querySelectorFromIframe('.bilibili-player-video-sendbar');
            if (sendbar !== null) {
                var css = [
                    '.bilibili-player-video-sendbar { display: none }'
                ]
                if (!newPlayer) {
                    var message = querySelectorFromIframe('.bilibili-player-video-message')
                    if (message !== null) {
                        css.push('.bilibili-player-video-message { display: none }')
                    }
                }
                var node = document.createElement('style');
                node.type = 'text/css';
                node.id = 'adjustPlayerAutoHideExtra';
                node.appendChild(document.createTextNode(css.join('')));
                querySelectorFromIframe('.player').appendChild(node);
            }
        },
        autoNextPlist: function(video) {
            video.addEventListener("ended", function() {
                var nextBtn = querySelectorFromIframe('.bilibili-player-video-btn-next');
                if (nextBtn !== null) {
                    doClick(nextBtn);
                }
            })
        },
        init: function() {
            //修复后台打开视频页面脚本加载失效
            var documentState = document.visibilityState;
            if (documentState === "visible") {
                //总计时器
                var timerCount = 0;
                var timer = window.setInterval(function callback() {
                    var player = isPlayer();
                    if (player === "html5Player") {

                        var stardustPlayer = document.querySelector('#entryOld');
                        if (stardustPlayer === null) {
                            var newPlayer = false;
                            console.log('旧版播放器页面\n');
                        } else {
                            var newPlayer = true;
                            console.log('新版播放器页面\n');
                        }

                        var readyState = querySelectorFromIframe('.bilibili-player-video-panel');
                        var video = querySelectorFromIframe('.bilibili-player-video video');
                        if (video !== null && readyState !== null) {
                            if (readyState.getAttribute('style') !== null && readyState.getAttribute('style').search("display: none;") !== -1) {
                                try {
                                    window.setTimeout(function() {
                                        adjustPlayer.hideDanmuku(newPlayer);
                                        adjustPlayer.hideExtra(newPlayer);
                                        adjustPlayer.autoNextPlist(video);
                                    }, 1000);
                                    reloadPList.init();
                                    clearInterval(timer);
                                    console.log('adjustPlayer:\nhtml5Player init success');
                                } catch (e) {
                                    clearInterval(timer);
                                    console.log('adjustPlayer:\nhtml5Player init error\n' + e);
                                }
                            }
                        } else {
                            //console.log(timerCount);
                            timerCount++;
                            if (timerCount >= 120) {
                                timerCount = 0;
                                clearInterval(timer);
                                console.log('adjustPlayer:\n html5Player init error: not find video');
                            }
                        }
                    } else {
                        //console.log(timerCount);
                        timerCount++;
                        if (timerCount >= 120) {
                            timerCount = 0;
                            clearInterval(timer);
                            console.log('adjustPlayer:\n html5Player init error: timeout');
                        }
                    }
                }, 800);
            } else if (documentState === "hidden") {
                //修复后台打开视频页面脚本加载失效
                var hidden, visibilityChange;
                if (typeof document.hidden !== "undefined") {
                    hidden = "hidden";
                    visibilityChange = "visibilitychange";
                } else if (typeof document.msHidden !== "undefined") {
                    hidden = "msHidden";
                    visibilityChange = "msvisibilitychange";
                } else if (typeof document.webkitHidden !== "undefined") {
                    hidden = "webkitHidden";
                    visibilityChange = "webkitvisibilitychange";
                }

                function visibilitychangeEvent() {
                    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
                        console.log("adjustPlayer:\n nonsupport the Page Visibility API.");
                    } else {
                        if (document.visibilityState === "visible") {
                            adjustPlayer.init();
                            document.removeEventListener(visibilityChange, visibilitychangeEvent, false);
                        }
                    }
                }
                document.addEventListener(visibilityChange, visibilitychangeEvent, false);
            } else {
                console.log("adjustPlayer:\n nonsupport the Page Visibility API.");
            }
        },
        reload: function() {
            //修复后台打开视频页面脚本加载失效
            var documentState = document.visibilityState;
            if (documentState === "visible") {
                //总计时器
                var timerCount = 0;
                var timer = window.setInterval(function callback() {
                    var player = isPlayer();
                    if (player === "html5Player") {

                        var stardustPlayer = document.querySelector('#entryOld');
                        if (stardustPlayer === null) {
                            var newPlayer = false;
                            console.log('旧版播放器页面\n');
                        } else {
                            var newPlayer = true;
                            console.log('新版播放器页面\n');
                        }

                        var readyState = querySelectorFromIframe('.bilibili-player-video-panel');
                        var video = querySelectorFromIframe('.bilibili-player-video video');
                        if (video !== null && readyState !== null) {
                            if (readyState.getAttribute('style') !== null && readyState.getAttribute('style').search("display: none;") !== -1) {
                                try {
                                    window.setTimeout(function() {
                                        adjustPlayer.autoNextPlist(video);
                                    }, 1000);
                                    reloadPList.init();
                                    clearInterval(timer);
                                    console.log('adjustPlayer:\nhtml5Player reload success');
                                } catch (e) {
                                    clearInterval(timer);
                                    console.log('adjustPlayer:\nhtml5Player reload error\n' + e);
                                }
                            }
                        } else {
                            //console.log(timerCount);
                            timerCount++;
                            if (timerCount >= 120) {
                                timerCount = 0;
                                clearInterval(timer);
                                console.log('adjustPlayer:\n html5Player reload error: not find video');
                            }
                        }
                    } else {
                        //console.log(timerCount);
                        timerCount++;
                        if (timerCount >= 120) {
                            timerCount = 0;
                            clearInterval(timer);
                            console.log('adjustPlayer:\n html5Player reload error: timeout');
                        }
                    }
                }, 800);
            } else if (documentState === "hidden") {
                //修复后台打开视频页面脚本加载失效
                var hidden, visibilityChange;
                if (typeof document.hidden !== "undefined") {
                    hidden = "hidden";
                    visibilityChange = "visibilitychange";
                } else if (typeof document.msHidden !== "undefined") {
                    hidden = "msHidden";
                    visibilityChange = "msvisibilitychange";
                } else if (typeof document.webkitHidden !== "undefined") {
                    hidden = "webkitHidden";
                    visibilityChange = "webkitvisibilitychange";
                }

                function visibilitychangeEvent() {
                    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
                        console.log("adjustPlayer:\n nonsupport the Page Visibility API.");
                    } else {
                        if (document.visibilityState === "visible") {
                            adjustPlayer.init();
                            document.removeEventListener(visibilityChange, visibilitychangeEvent, false);
                        }
                    }
                }
                document.addEventListener(visibilityChange, visibilitychangeEvent, false);
            } else {
                console.log("adjustPlayer:\n nonsupport the Page Visibility API.");
            }
        }
    };

    var reloadPList = {
        getPListId: function(href) {
            var id;
            if (typeof href !== 'undefined') {
                id = href.match(/p=\d*/g) || href.match(/#page=\d*/g) || href.match(/ep\d*/g) || href.match(/ss\d*#\d*/g) || href.match(/watchlater\/#\/av\d*\/p\d*/g) || href.match(/av\d*/g);
                if (id !== null) {
                    id = id[0].replace(/\D/g, '');
                } else {
                    id = '';
                }
            }
            return id;
        },
        init: function() {
            (function(history) {
                var pushState = history.pushState;
                history.pushState = function(state) {
                    if (typeof history.onpushstate == "function") {
                        history.onpushstate({ state: state });
                    }
                    return pushState.apply(history, arguments);
                };
            })(window.history);

            var pListId = reloadPList.getPListId(location.href);
            window.adjustPlayerCurrentPListId = pListId;

            window.onpopstate = history.onpushstate = function() {
                var reloadTimer = null;
                clearTimeout(this.reloadTimer);
                this.reloadTimer =
                    window.setTimeout(function() {
                        var newPlistId, oldPListId;
                        newPlistId = reloadPList.getPListId(location.href);
                        oldPListId = window.adjustPlayerCurrentPListId;
                        console.log('reloadPList:\nnewPlistId:' + newPlistId + "\noldPListId:" + oldPListId);
                        adjustPlayer.reload();
                    }, 200);
            }
        }
    };

    function querySelectorFromIframe(obj) {
        var iframePlayer = document.querySelector('iframe.bilibiliHtml5Player');
        if (iframePlayer !== null) {
            return iframePlayer.contentWindow.document.body.querySelector(obj);
        } else {
            return document.querySelector(obj);
        }
    };

    function isPlayer() {
        var html5Player = querySelectorFromIframe('.bilibili-player-video video');
        if (html5Player !== null) {
            return "html5Player";
        } else {
            return "unknownPlayer";
        }
    };

    function doClick(obj) {
        if (obj !== null) {
            if (obj.click) {
                obj.click();
            } else {
                var evt = document.createEvent('Event');
                evt.initEvent('click', true, true);
                obj.dispatchEvent(evt);
            }
        }
    };

    adjustPlayer.init();
})();