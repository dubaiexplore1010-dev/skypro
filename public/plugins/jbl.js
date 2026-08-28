;(function (u, B) {
  typeof exports == "object" && typeof module < "u"
    ? B(exports)
    : typeof define == "function" && define.amd
      ? define(["exports"], B)
      : ((u = typeof globalThis < "u" ? globalThis : u || self), B((u.JBLWebSocket = {})))
})(this, function (u) {
  "use strict"
  var B = null
  const O = {
      sendHealthStream: () => {
        let t = {}
        t.router = "getHealthStream"
        let e = l.getWebSocket()
        e.readyState === WebSocket.OPEN
          ? l.sendMsg(JSON.stringify(t))
          : e.addEventListener("open", function (n) {
              l.sendMsg(JSON.stringify(t))
            })
      },
      setHealthFun: t => {
        B = t
      },
      getHealthFun: t => {
        B(t)
      },
      getHealthCallbakfun: t => B
    },
    b = t => t !== null && typeof t < "u",
    C = t => {
      let e = ""
      return (
        t.indexOf("//") > -1
          ? t.indexOf(".ourdvsss.com") > -1
            ? (e = t.split("/")[0] + "//" + t.split("/")[3])
            : (e = t.split("/")[0] + "//" + t.split("/")[2])
          : (e = t.split("/")[0]),
        (e = e.split("?")[0]),
        e
      )
    },
    xt = t => {
      var e
      return (e = t.split(".m3u8")[0]), e
    },
    Ge = (t, e) => {
      e.time = new Date().getTime()
      let n = JSON.stringify(e)
      localStorage.setItem(t, n)
    },
    Et = "wss://web.analysiscloud.info/m1uudG5uIU/?project=",
    Dt = "https://web.analysiscloud.info/ccu/m1uudG5uIU/config",
    Bt = "https://web.analysiscloud.info/ccu/m1uudG5uIU/upsert",
    Ot = "https://web.analysiscloud.info/ccu/m1uudG5uIU/get"
  var ie = null,
    ue = {},
    de = null
  const Ae = t => {
      ;(ie = t), Xe(window.location.hostname, "x", navigator.appVersion, "", ""), Ke()
    },
    Jt = () =>
      fetch(Dt)
        .then(t => t.json())
        .then(t => {
          Ae(t)
        })
        .catch(t => console.error(t)),
    Ke = () => {
      if ((Ve(), ie.streamTest_enable != 1)) {
        console.log("streamTest is disabled")
        return
      }
      de = setInterval(() => {
        try {
          let t = ue
          if (t.uid)
            fetch(Bt, { method: "POST", body: JSON.stringify(t) }).catch(e =>
              console.error(e)
            )
          else return
        } catch {}
      }, ie.streamTest_interval * 6e4)
    },
    Ve = () => {
      b(de) && (clearInterval(de), (de = null))
    },
    Xe = (t, e, n, o, s) => {
      let r = {}
      ;(r = {}),
        (r.projectName = l.getProject()),
        (r.serverId = t),
        (r.uid = e),
        (r.device = n),
        (r.streamName = o),
        (r.cdnName = s),
        (r.updateTime = new Date().getTime()),
        (ue = r)
    },
    L = {
      ccu_config: ie,
      getInfo: () => ue,
      setConfig: Ae,
      restart: Jt,
      start: Ke,
      stop: Ve,
      upsert: Xe,
      remove: () => {
        let t = {}
        ;(t.updateTime = new Date().getTime()), (ue = t)
      }
    }
  var h = {},
    g = {},
    K = null
  const Ht = t => (
      qe(),
      (g.enable = t.apiTest_enable),
      (g.timeout = t.apiTest_timeout),
      !g.enable || g.enable != 1 || !g.timeout
        ? (console.log("apiTest is disabled"),
          console.log(g.enable),
          console.log(g.timeout),
          !1)
        : ((K = setInterval(() => {
            Ye()
          }, g.timeout)),
          !0)
    ),
    Mt = () => {
      ;(g.enable = 0), (h = {}), qe()
    },
    qe = () => {
      b(K) && (clearInterval(K), (K = null))
    },
    Ft = (t, e, n) => {
      if ((g.enable && g.enable != 1) || O.getHealthCallbakfun() != null) return
      let o = t.split("?")[0]
      h[o] || (h[o] = Qe(o))
      let s = h[o]
      ;(e = Number(e)),
        (s.maxSpeed = s.maxSpeed > e ? s.maxSpeed : e),
        (s.minSpeed = s.minSpeed < e ? s.minSpeed : e),
        (s.avgSpeed = (s.avgSpeed * s.urlCount + e) / ++s.urlCount),
        (s.totalSize += Number(n))
    },
    jt = t => {
      if ((g.enable && g.enable != 1) || O.getHealthCallbakfun() != null) return
      let e = t.split("?")[0]
      h[e] || (h[e] = Qe(e))
      let n = h[e]
      n.cacheCount++
    },
    Ut = (t, e) => {
      if ((g.enable && g.enable != 1) || O.getHealthCallbakfun() != null) return
      let n = t.split("?")[0]
      h[n] || (h[n] = zt(n))
      let o = h[n]
      if (e != null) {
        let s =
          (e == null ? void 0 : e.status) +
          "@@@" +
          ((e == null ? void 0 : e.name) == null ? "" : e.name) +
          "@@@" +
          e.statusText
        o.failMessage.add(s)
      }
      o.failCount++
    },
    Ye = () => {
      let t = h
      if (((h = {}), O.getHealthCallbakfun() != null)) return
      let e = {},
        n = Object.keys(t).map(s => t[s])
      n.forEach(s => {
        s.failMessage != null && (s.failMessage = Array.from(s.failMessage))
      }),
        (e.router = "apiTestInfo"),
        (e.data = {})
      for (var o = 0; o < n.length; o += 10)
        (e.data.info = n.slice(o, o + 10)), l.sendMsg(JSON.stringify(e))
    },
    Qe = t => {
      let e = {},
        n = L.getInfo()
      return (
        (e.server = n.serverId ? n.serverId : ""),
        (e.domain = window.location.hostname),
        (e.apiUrl = t),
        (e.xfIp = ""),
        (e.urlCount = 0),
        (e.cacheCount = 0),
        (e.failCount = 0),
        (e.maxSpeed = 0),
        (e.minSpeed = 1 / 0),
        (e.avgSpeed = 0),
        (e.totalSize = 0),
        e
      )
    },
    zt = t => {
      let e = {},
        n = L.getInfo()
      return (
        (e.server = n.serverId ? n.serverId : ""),
        (e.domain = window.location.hostname),
        (e.apiUrl = t),
        (e.xfIp = ""),
        (e.urlCount = 0),
        (e.cacheCount = 0),
        (e.failCount = 0),
        (e.maxSpeed = 0),
        (e.minSpeed = 1 / 0),
        (e.avgSpeed = 0),
        (e.totalSize = 0),
        (e.failMessage = new Set()),
        e
      )
    },
    Wt = (t, e, n) => {
      let o = {}
      ;(o.router = "apiTestInfo"), (o.data = {})
      let s = {},
        r = L.getInfo()
      ;(s.server = r.serverId ? r.serverId : ""),
        (s.domain = window.location.hostname),
        (s.apiUrl = window.location.hostname + "/" + t),
        (s.xfIp = t),
        (s.urlCount = 1),
        (s.cacheCount = 0),
        (s.failCount = 0),
        (s.maxSpeed = e),
        (s.minSpeed = e),
        (s.avgSpeed = e),
        (s.totalSize = n || 0),
        (o.data.info = [s]),
        l.sendMsg(JSON.stringify(o))
    }
  function Rt() {
    return h
  }
  const i = {
    api_map: h,
    api_config: g,
    api_taskId: K,
    getApiTestInfo: Rt,
    setJBLConfig: Ht,
    stop: Mt,
    record: Ft,
    recordCache: jt,
    recordfail: Ut,
    sendData: Ye,
    sendWebSiteLog: Wt
  }
  var I = {},
    V = {},
    J = !0,
    X = !0,
    v = {},
    y = null,
    W = 0,
    q = "",
    H = ""
  const fe = () => {
      ;(I.router = "hlsTestInfo"), (I.data = {}), (I.data.info = [])
    },
    Ze = () => {
      ;(V.router = "hlsTsInfo"), (V.data = {}), (V.data.info = [])
    },
    Pt = t => {
      let e = document.createElement("video")
      if (((e.muted = !0), !Hls.isSupported()))
        return (
          console.log(
            "Your Browser does not support MediaSourceExtension / MP4 mediasource"
          ),
          !1
        )
      let n = 0,
        o = 0,
        s = !1,
        r = new Hls()
      return (
        r.loadSource(t),
        (r.autoLevelCapping = 0),
        r.attachMedia(e),
        r.on(Hls.Events.MEDIA_ATTACHED, (a, d) => {
          e.play()
        }),
        r.on(Hls.Events.FRAG_BUFFERED, function (a, d) {
          try {
            ;(n += d.stats.loading.end - d.stats.loading.start), o++
          } catch (p) {
            console.error(p)
          }
        }),
        r.on(Hls.Events.ERROR, (a, d) => {
          s = !0
        }),
        new Promise(a => {
          setTimeout(() => {
            let d = Number(n / o).toFixed(2),
              p = { url: t, error_status: s, ms: d }
            r.destroy(), a(p)
          }, 6e3)
        })
      )
    },
    Gt = (t, e) => {
      t == null ||
        t == null ||
        (y != null && clearInterval(y),
        v.timeout != null &&
          (y = setInterval(() => {
            ;(J = !0), (X = !0)
          }, v.timeout)),
        q != e && ((q = e), (H = "")),
        (J = !0),
        (X = !0),
        t.on("hlsFragLoading", tt),
        t.on("hlsLevelUpdated", nt),
        t.on("hlsError", et),
        t.on("hlsFragBuffered", st))
    },
    et = (t, e) => {
      if (!J) return
      J = !1
      let n = {}
      ;(n.domain = H == "" ? C(e.context.url) : H),
        (n.channelName = q),
        (n.msTime = 0.1),
        (n.speed = 0),
        (n.size = 0),
        (n.urlCount = 1),
        (n.totalSize = W.toFixed(3)),
        fe(),
        I.data.info.push(n),
        ce(JSON.stringify(I))
    },
    tt = (t, e) => {
      let n = C(e.frag.url)
      n != H && H != "" && ot(H), (H = n)
    },
    nt = (t, e) => {
      let n = e.details.fragments[e.details.fragments.length - 1],
        o = n.baseurl,
        s = xt(o),
        r = n.relurl.split("?")[0],
        a = { m3u8url: s, relurl: r }
      X && ((X = !1), Ze(), V.data.info.push(a), rt(JSON.stringify(V)))
    },
    st = (t, e) => {
      W += e.stats.total / 1024
      try {
        let n
        e.stats.tbuffered
          ? (n = e.stats.tbuffered - e.stats.trequest)
          : (n = e.stats.loading.end - e.stats.loading.start)
        let o = Math.round((8 * e.stats.total) / n),
          s = (e.frag.duration * 1e3) / n,
          r = (o / 1e3).toFixed(2),
          a = {}
        if (
          ((a.domain = C(e.frag.url)),
          (a.channelName = q),
          (a.speed = r),
          (a.size = (e.stats.total / 1024).toFixed(3)),
          (a.totalSize = W.toFixed(3)),
          (a.msTime = s.toFixed(3)),
          (a.urlCount = 0),
          !J)
        )
          return
        ;(J = !1), fe(), I.data.info.push(a), ce(JSON.stringify(I))
      } catch (n) {
        console.log(n)
      }
    },
    ot = t => {
      let e = {}
      ;(e.domain = t),
        (e.channelName = q),
        (e.msTime = 0.1),
        (e.speed = 0),
        (e.size = 0),
        (e.urlCount = 1),
        (e.totalSize = W.toFixed(3)),
        fe(),
        I.data.info.push(e),
        ce(JSON.stringify(I))
    },
    ce = t => {
      if (!v.enable || v.enable != 1) {
        console.log("hlsTest is disabled"), (W = 0)
        return
      }
      l.sendMsg(t) && (W = 0)
    },
    rt = t => {
      if (!v.enable || v.enable != 1) {
        console.log("hlsTs is disabled")
        return
      }
      l.sendMsg(t)
    },
    ge = {
      init: fe,
      ts_init: Ze,
      createHls: Pt,
      testSpeedToHlsjs: Gt,
      listenError: et,
      listenUrl: tt,
      listenM3U8: nt,
      speedTest: st,
      sendPunishment: ot,
      sendData: ce,
      sendTsData: rt,
      setJBLConfig: t => {
        ;(v.enable = t.hlsTest_enable),
          (v.timeout = t.hlsTest_timeout),
          y != null && clearInterval(y),
          v.timeout != null &&
            (y = setInterval(() => {
              ;(J = !0), (X = !0)
            }, v.timeout))
      },
      stop: () => {
        ;(v.enable = 0), b(y) && (clearInterval(y), (y = null))
      }
    }
  var k = {},
    Ce = {},
    Y = "",
    _ = {},
    me = !1,
    M = null,
    pe = 0,
    At = 0,
    Q = 0,
    Z = 0,
    F = 0,
    Le = 0,
    R = ""
  const ke = () => {
      ;(k.router = "flvTestInfo"), (k.data = {}), (k.data.info = []), (Q = 0), (Z = 0)
    },
    Kt = (t, e) => {
      t == null ||
        t == null ||
        (M != null && clearInterval(M),
        _.timeout != null &&
          (M = setInterval(() => {
            me = !0
          }, _.timeout)),
        Y != e && ((Y = e), (R = "")),
        ke(),
        (F = 0),
        (Ce = t),
        Ce.on("statistics_info", lt))
    },
    at = t => {
      let e = C(t.url)
      e != R && R != "" && it(R), (R = e)
    },
    lt = t => {
      at(t)
      let e = e,
        n = 0
      if (e.buffered.length > 0) {
        let s = 0
        e.buffered.end(0) >= pe && (s = e.buffered.end(0) - pe),
          s != 0 && ((Q += s), Z++),
          (pe = e.buffered.end(0))
      }
      let o = e._transmuxer._controller._ioctl._currentRange.to / 1024
      if (((Le = o - F), Q != 0 && Z != 0 && (n = Q / Z), !_.enable || _.enable != 1)) {
        console.log("flvTest is disabled")
        return
      }
      if (me && !(t.speed == null || t.speed == 0))
        try {
          let s = ((t.speed / 1024) * 8).toFixed(1),
            r = {}
          ;(r.domain = C(t.url)),
            (r.speed = s),
            F == 0 ? (r.totalSize = o) : (r.totalSize = o - F),
            (F = o),
            (r.msTime = n.toFixed(3)),
            (r.channelName = Y),
            (me = !1),
            ke(),
            k.data.info.push(r),
            _e(JSON.stringify(k))
        } catch (s) {
          console.log(s)
        }
    },
    it = t => {
      let e = {}
      ;(e.domain = t),
        (e.channelName = Y),
        (e.msTime = 0.1),
        (e.speed = 0),
        (e.size = 0),
        (e.urlCount = 1),
        (e.totalSize = Le.toFixed(3)),
        ke(),
        (F = 0),
        k.data.info.push(e),
        _e(JSON.stringify(k))
    },
    _e = t => {
      l.sendMsg(t)
    },
    Ne = {
      flvSpeedInfo: k,
      flvPlayer: Ce,
      channelName: Y,
      config: _,
      flag: me,
      taskId: M,
      oldBuffer: pe,
      oldDroppedFrames: At,
      totalDuration: Q,
      count: Z,
      totalSize: F,
      change_size: Le,
      uUrl: R,
      testSpeedToFlvjs: Kt,
      listenUrl: at,
      speedTest: lt,
      sendPunishment: it,
      sendData: _e,
      setJBLConfig: t => {
        ;(_.enable = t.hlsTest_enable), (_.timeout = t.hlsTest_timeout)
      },
      stop: () => {
        ;(_.enable = 0), b(M) && (clearInterval(M), (M = null))
      }
    }
  var N = {},
    f = {},
    ee = "",
    T = {},
    be = !1,
    j = null,
    he = 0,
    w = { url: "", channelName: "", buffered: 0, oldBuffer: 0, newBuffer: 0 },
    Vt = 0,
    ve = 0,
    $e = 0,
    $ = 0,
    Se = 0,
    x = ""
  const Te = () => {
      ;(N.router = "flvTestInfo"), (N.data = {}), (N.data.info = []), (ve = 0), ($e = 0)
    },
    Xt = (t, e) => {
      t == null ||
        t == null ||
        (j != null && clearInterval(j),
        T.timeout != null &&
          (j = setInterval(() => {
            be = !0
          }, T.timeout)),
        ee != e && ((ee = e), (x = "")),
        Te(),
        (w = { url: "", channelName: e, buffered: 0, oldBuffer: 0, newBuffer: 0 }),
        (Se = $),
        ($ = 0),
        (f = t),
        f.on("Exception", n => {
          ;(w.buffered = -1), te(x)
        }),
        f.on("error", n => {
          ;(w.buffered = -1), te(x)
        }),
        f.on("loading_complete", n => {
          ;(w.buffered = -1), te(x)
        }),
        f.on("media_info", n => {
          f._transmuxer != null &&
            f._transmuxer.on("media_segment", (o, s) => {
              let r = s.data.byteLength
              $ += r
            }),
            f._decompressor != null &&
              f._decompressor.on("media_segment", (o, s) => {
                let r = s.transfer.reduce((a, d) => a + d.byteLength, 0)
                $ += r
              })
        }),
        f.on("statistics_info", Yt))
    },
    qt = t => {
      let e = C(t.url)
      ;(w.url = e), e != x && x != "" && te(x), (x = e)
    },
    Yt = t => {
      if ((qt(t), f.buffered.length > 0)) {
        let e = 0
        f.buffered.end(0) >= he && (e = f.buffered.end(0) - he),
          (ve += e),
          $e++,
          (w.buffered = f.buffered.end(0) - f.currentTime),
          (w.newBuffer = e),
          (w.oldBuffer = f.buffered.end(0)),
          (he = f.buffered.end(0))
      }
      if (!T.enable || T.enable != 1) {
        Te(), ($ = 0), (Se = 0), console.log("mpegTest is disabled")
        return
      }
      if (be && !(t.speed == null || t.speed == 0))
        try {
          let e = $ / (T.timeout / 1e3),
            n = ve / (T.timeout / 1e3),
            o = {}
          ;(o.domain = C(t.url)),
            (o.speed = e),
            (o.totalSize = ($ / 1024).toFixed(3)),
            ($ = 0),
            (o.msTime = n.toFixed(3)),
            (o.channelName = ee),
            (be = !1),
            Te(),
            N.data.info.push(o),
            xe(JSON.stringify(N))
        } catch (e) {
          console.log(e)
        }
    },
    Qt = () => w,
    te = (t, e) => {
      let n = {}
      ;(n.domain = C(t)),
        (n.channelName = ee),
        (n.msTime = 0.1),
        (n.speed = 0),
        (n.size = 0),
        (n.urlCount = 1),
        (n.errCode = e || 0),
        (n.totalSize = (Se / 1024).toFixed(3)),
        Te(),
        (Se = 0),
        N.data.info.push(n),
        xe(JSON.stringify(N))
    },
    xe = t => {
      l.sendMsg(t)
    },
    ne = {
      mpegSpeedInfo: N,
      mpegPlayer: f,
      channelName: ee,
      config: T,
      flag: be,
      taskId: j,
      oldBuffer: he,
      bufferInfo: w,
      oldDroppedFrames: Vt,
      totalDuration: ve,
      count: $e,
      testSpeedTompegjs: Xt,
      getBuffer: Qt,
      sendPunishment: te,
      sendData: xe,
      showLog: (t, e, n) => {
        console.info("flag: ", n),
          console.info("Url: ", t.url),
          console.info("SeepData: ", e)
      },
      setJBLConfig: t => {
        ;(T.enable = t.hlsTest_enable), (T.timeout = t.hlsTest_timeout)
      },
      stop: () => {
        ;(T.enable = 0), b(j) && (clearInterval(j), (j = null))
      }
    }
  var U = null,
    Zt = '{"router":"heartbeat"}',
    P = 0,
    Ee = {}
  const en = t => {
    console.info(t.heartbeat_timeout), (Ee = t), (P = 0)
  }
  function tn() {
    b(U) && (clearInterval(U), (U = null)),
      (U = setInterval(() => {
        try {
          if (((P += 1), l.getWebSocket() === null)) {
            ;(P = 0), l.createWebSocket(l.getProject(), l.getChannel())
            return
          }
          if (P >= 3) {
            ;(P = 0),
              b(l.getWebSocket()) && l.getWebSocket().close(),
              l.setWebSocket(null)
            return
          }
          b(l.getWebSocket()) &&
            l.getWebSocket().readyState === WebSocket.OPEN &&
            l.getWebSocket().send(Zt)
        } catch {}
      }, Ee.heartbeat_timeout))
  }
  function nn() {
    b(U) && (clearInterval(U), (U = null))
  }
  function sn(t) {
    P = t
  }
  const we = { config: Ee, setCount: sn, setConfig: en, start: tn, close: nn }
  var se = 0,
    De = [],
    on = 102400,
    Be = null,
    ut = !1,
    Oe = {}
  const rn = t => {
      Oe = t
    },
    an = () => {
      if (ut) {
        dt()
        return
      }
      let t = {}
      ;(t.router = "getDomainSetting"), ae(JSON.stringify(t))
    },
    ln = t => {
      ;(De = t), Me(), oe(), (ut = !0)
    },
    dt = () => {
      Me(), oe()
    },
    oe = () => {
      if (Oe.bestLineTest_enable != 1) {
        console.log("bestLineTest is disabled")
        return
      }
      se++,
        (Be = window.setTimeout(() => {
          let t = {}
          ;(t.router = "bestLineInfo"),
            (t.data = {}),
            (t.data.info = []),
            Je(se, t, De, De.length, 0)
        }, Oe.bestLineTest_timeout))
    },
    Je = (t, e, n, o, s) => {
      if (n.length <= 0) return
      let r = n[s]
      s++
      let a = null,
        d = null,
        p = new Image()
      ;(p.onload = () => {
        try {
          d = new Date().getTime()
          let E = (d - a) / 1e3,
            m = r.lastIndexOf("/"),
            S = r.lastIndexOf("."),
            D = r.substring(m + 1, S)
          D = isNaN(D) ? on : D
          let In = ((((D * 8) / E).toFixed(4) / 1024).toFixed(4) / 1024).toFixed(4),
            Pe = {}
          ;(Pe.domain = r), (Pe.speed = In), e.data.info.push(Pe)
          let yn = d - a
          i.record(r, yn, 0)
        } catch {
          let m = {
            name: "baseLineTest Error",
            status: "5xx",
            statusText: "baseLineTest Error"
          }
          i.recordfail(r, m)
        }
        He(t, e, n, o, s)
      }),
        (p.onerror = (E, m) => {
          let S = {
            name: "baseLineTest Error",
            status: "5xx",
            statusText: "baseLineTest Error"
          }
          i.recordfail(r, S), He(t, e, n, o, s)
        }),
        (a = new Date().getTime())
      let z = "?ts=" + a
      p.src = r + z
    },
    He = (t, e, n, o, s) => {
      t == se &&
        (o == s && e.data.info.length > 0
          ? ae(JSON.stringify(e)) && t == se && oe()
          : o == s && t == se
            ? oe()
            : Je(t, e, n, o, s))
    },
    Me = () => {
      b(Be) && clearTimeout(Be)
    },
    Ie = {
      setJBLConfig: rn,
      start: an,
      receive: ln,
      restart: dt,
      run: oe,
      check: Je,
      next: He,
      stop: Me
    }
  var G = { result: {} },
    re = []
  const ft = (t, e, n) => {
      let o = {}
      ;(o.type = t), (o.group = e), (o.lines = n)
      let s = {}
      ;(s.router = "getGroupResult"), (s.data = o)
      let r = l.getWebSocket()
      r != null &&
        (r.readyState === WebSocket.OPEN
          ? (l.sendMsg(JSON.stringify(s)),
            re.filter(d => d.type == t && d.group == e).length == 0 && re.push(o))
          : r.addEventListener("open", function (a) {
              l.sendMsg(JSON.stringify(s)),
                re.filter(p => p.type == t && p.group == e).length == 0 && re.push(o)
            }))
    },
    A = {
      groupResultObj: G,
      setGroupInfo: ft,
      resetGroupDataLine: async () => {
        re.forEach(async t => {
          ft(t.type, t.group, t.lines)
        })
      },
      getGroupData: async (t, e, n) => {
        let o = l.getProject(),
          s = {}
        ;(s.project = o), (s.type = e), (s.group = n)
        let r = localStorage.getItem("group_best_line"),
          a = JSON.parse(r)
        if (a != null && new Date().getTime() - a.time < 6e4)
          return (G.result = a.result), G
        let d = new URL(Ot),
          p = {}
        try {
          let z = 800,
            E = new AbortController(),
            m = E.signal
          const S = setTimeout(() => E.abort(), z)
          Object.keys(s).forEach(Re => d.searchParams.append(Re, s[Re]))
          let D = d.href,
            ye = await fetch(D, { signal: m })
          clearTimeout(S)
          let le = await ye.json()
          ;(p[le.name] = le.value),
            Ge("group_best_line", G),
            (G.result[e + "_" + n] = le.value == null ? "" : le.value)
        } catch (z) {
          console.error(z), (G.result[e + "_" + n] = "")
        }
      }
    }
  var c = null,
    Fe = "",
    je = "",
    ct = "",
    gt = !1,
    Ue = {}
  const un = t => {
      ;(ct = t.socketUrl), t.webSocket
    },
    dn = () => c,
    fn = t => {
      c = t
    },
    cn = () => Fe,
    gn = () => je,
    mn = () => Ue,
    mt = () => {
      let t = {}
      ;(t.router = "getHlsConfigSetting"), ae(JSON.stringify(t))
      let e = {}
      ;(e.router = "getResourceUrl"),
        (e.data = {}),
        (e.data.chname = je),
        ae(JSON.stringify(e))
    },
    pn = async (t, e) => {
      ;(Fe = t), (je = e)
      let n = ct + Fe
      if ((console.log("JBL Version:v20240709-1 " + n), b(c)))
        return console.log("jbl connection exists, do nothing"), null
      if ("WebSocket" in window) c = new WebSocket(n)
      else return console.log("jbl webSocket is not supported"), null
      return (
        (c.onerror = () => (
          console.warn("jbl webSocket error"), b(c) && c.close(), null
        )),
        (c.onopen = () => (
          console.log("jbl webSocket connected"), mt(), A.resetGroupDataLine(), null
        )),
        (c.onmessage = o => {
          we.setCount(0)
          var s = JSON.parse(o.data)
          switch (s.router) {
            case "getResourceUrl":
              Ue.result = s.data
              break
            case "getDomainSetting":
              Ie.receive(s.data)
              break
            case "getHealthStream":
              O.getHealthFun(s.data), i.stop()
              break
            case "getGroupResult":
              ;(A.groupResultObj.result[s.data.name] = s.data.value),
                Ge("group_best_line", A.groupResultObj)
              break
            case "getHlsConfigSetting":
              let r = s.data
              i.setJBLConfig(r),
                L.setConfig(r),
                we.setConfig(r),
                we.start(),
                Ie.setJBLConfig(r),
                Ie.start(),
                ge.setJBLConfig(r),
                Ne.setJBLConfig(r),
                ne.setJBLConfig(r)
              break
          }
        }),
        (c.onclose = () => (
          i.stop(),
          ge.stop(),
          Ne.stop(),
          ne.stop(),
          Ie.stop(),
          console.log("jbl webSocket closed"),
          b(c) && c.close(),
          (c = null),
          gt || L.restart(),
          null
        )),
        (window.onbeforeunload = () => {
          try {
            ;(gt = !0), L.stop(), we.close(), c.close()
          } catch {}
        }),
        c
      )
    },
    ae = t =>
      b(c) ? (c.send(t), !0) : (console.log("webSocket doesn't exist, do nothing"), !1),
    l = {
      resourceUrlObj: Ue,
      getResourceUrlObj: mn,
      getWebSocket: dn,
      setWebSocket: fn,
      getProject: cn,
      getChannel: gn,
      getConfigData: mt,
      sendMsg: ae,
      createWebSocket: pn,
      setSocketConfig: un
    }
  function bn() {
    var t = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function () {
      t.apply(this, arguments)
      let e = new Date().getTime(),
        n = arguments[1]
      this.addEventListener("progress", function (s) {
        this.prvdownloaded = s.loaded
      }),
        this.addEventListener("load", function () {
          if (this.status >= 200 && this.status < 300) {
            let s = new Date().getTime() - e
            this.prvdownloaded == null ? (this.prvdownloaded = 0) : this.prvdownloaded,
              i.record(n, s, this.prvdownloaded)
          } else if (this.status >= 400 && this.status < 500) {
            let s = { status: this.status, statusText: this.statusText }
            i.recordfail(n, s)
          } else if (this.status >= 500) {
            let s = { status: this.status, statusText: this.statusText }
            i.recordfail(n, s)
          }
        })
      const o = function () {
        let s = { name: "Network Error", status: "5xx", statusText: "Network Error" }
        i.recordfail(n, s)
      }
      this.addEventListener("error", o), this.addEventListener("timeout", o)
    }
  }
  function hn(t, e) {
    t.fetch = function () {
      let n = new Date().getTime(),
        o = arguments[0].url == null ? arguments[0] : arguments[0].url,
        s = arguments[1] == null ? {} : arguments[1],
        r = e.apply(this, arguments),
        p = o.split("?")[0].split("/").pop()
      return (s.signal != null || s.signal != null) &&
        p != null &&
        p.indexOf(".flv") != -1
        ? r
        : new Promise((z, E) => {
            r.then(
              m => (
                m.ok
                  ? m
                      .clone()
                      .arrayBuffer()
                      .then(D => {
                        let ye = new Date().getTime() - n
                        m.status == 200 && i.record(o, ye, D.byteLength)
                      })
                  : i.recordfail(o, m),
                z(m)
              )
            ).catch(m => {
              let S = {}
              return (
                m.name != "AbortError" &&
                  ((S.name = m.name),
                  (S.status = "5xx"),
                  (S.statusText = "Network Error"),
                  i.recordfail(o, S)),
                E(m)
              )
            })
          })
    }
  }
  function vn() {
    window.addEventListener("load", () => {
      var t = performance.getEntriesByType("resource")
      t.forEach(function (e) {
        let n = e.responseStatus
        if (n >= 200 && n <= 299)
          e.transferSize === 0 && e.encodedBodySize === 0 && e.decodedBodySize === 0
            ? i.recordCache(e.name)
            : i.record(e.name, e.duration.toFixed(4), e.transferSize)
        else if (n >= 400 && n <= 599) {
          let o = {
            name: "window load Error",
            status: n,
            statusText: "window load Error"
          }
          i.recordfail(e.name, o)
        } else i.record(e.name, e.duration.toFixed(4), e.transferSize)
      })
    })
  }
  function Sn() {
    window.addEventListener("beforeunload", () => {
      i.sendData()
    })
  }
  function pt(t) {
    ;(t.startTime = new Date().getTime()),
      (t.onload = function () {
        var e = new Date().getTime(),
          n = e - t.startTime
        i.record(t.src, n, 0), (t.onload = null)
      }),
      (t.onerror = function () {
        let e = { name: "iframe Error", status: "5xx", statusText: "iframe Error" }
        i.recordfail(t.src, e)
      })
  }
  function Tn() {
    document.addEventListener("DOMContentLoaded", function () {
      for (var t = document.getElementsByTagName("iframe"), e = 0; e < t.length; e++)
        pt(t[e])
      var n = new MutationObserver(function (o) {
        o.forEach(function (s) {
          if (s.type == "childList")
            for (var r = 0; r < s.addedNodes.length; r++) {
              var a = s.addedNodes[r]
              a.tagName == "IFRAME" && pt(a)
            }
        })
      })
      n.observe(document.body, { childList: !0, subtree: !0 })
    })
  }
  const ze = { load: vn, beforeunload: Sn, contentLoaded: Tn }
  bn(), hn(window, window.fetch), ze.load(), ze.beforeunload(), ze.contentLoaded()
  var We = ""
  l.setSocketConfig({ socketUrl: Et, webSocket: null })
  const bt = (t, e) => ((We = t), l.createWebSocket(We, e)),
    ht = async (t, e) => {
      O.setHealthFun(e), await l.createWebSocket(t, ""), O.sendHealthStream()
    },
    vt = (t, e, n, o, s) => {
      L.upsert(t, e, n, o, s)
    },
    St = () => {
      L.remove()
    },
    Tt = (t, e, n) => {
      i.sendWebSiteLog(t, e, n)
    },
    wt = (t, e, n) => {
      A.setGroupInfo(t, e, n)
    },
    It = async (t, e) => (await A.getGroupData(We, t, e), A.groupResultObj),
    yt = (t, e) => {
      ge.testSpeedToHlsjs(t, e)
    },
    Ct = t => ge.createHls(t),
    Lt = (t, e) => {
      Ne.testSpeedToFlvjs(t, e)
    },
    kt = (t, e) => {
      ne.testSpeedTompegjs(t, e)
    },
    _t = (t, e) => {
      ne.sendPunishment(t, e)
    },
    Nt = () => ne.getBuffer(),
    $t = () => l.resourceUrlObj,
    wn = {
      connect: bt,
      getHealthStream: ht,
      upsert: vt,
      remove: St,
      sendWebLog: Tt,
      testLine: wt,
      getGroupResult: It,
      testHls: yt,
      testSpeedHls: Ct,
      testFlv: Lt,
      testMpeg: kt,
      sendMpegErrCode: _t,
      getMpegBuffer: Nt,
      getResourceUrl: $t
    }
  ;(u.connect = bt),
    (u.default = wn),
    (u.getGroupResult = It),
    (u.getHealthStream = ht),
    (u.getMpegBuffer = Nt),
    (u.getResourceUrl = $t),
    (u.remove = St),
    (u.sendMpegErrCode = _t),
    (u.sendWebLog = Tt),
    (u.testFlv = Lt),
    (u.testHls = yt),
    (u.testLine = wt),
    (u.testMpeg = kt),
    (u.testSpeedHls = Ct),
    (u.upsert = vt),
    Object.defineProperties(u, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: "Module" }
    })
})
