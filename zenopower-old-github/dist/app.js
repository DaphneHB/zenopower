(() => {
  // src/hey.js
  var SimpleEmitter = class {
    constructor() {
      this.events = {};
    }
    /**
     * Register an event handler for a given event.
     * @param {string} event - The name of the event.
     * @param {Function} handler - The callback function to handle the event.
     */
    on(event, handler) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(handler);
    }
    /**
     * Unregister an event handler for a given event.
     * @param {string} event - The name of the event.
     * @param {Function} handler - The callback function to remove.
     */
    off(event, handler) {
      if (!this.events[event]) return;
      this.events[event] = this.events[event].filter((h) => h !== handler);
    }
    /**
     * Emit an event, calling all registered handlers.
     * @param {string} event - The name of the event.
     * @param {*} data - The data to pass to the event handlers.
     */
    emit(event, data) {
      if (!this.events[event]) return;
      this.events[event].forEach((handler) => handler(data));
    }
  };
  var State = class _State {
    /**
     * @type {SimpleEmitter}
     * @static
     * @private
     */
    static emitter = new SimpleEmitter();
    /**
     * @type {Object}
     * @static
     * @private
     */
    static state = {};
    /**
     * Create a proxy for an object to enable nested reactivity.
     * @param {Object} obj - The object to create a proxy for.
     * @returns {Proxy} - The proxied object.
     * @private
     */
    static createProxy(obj) {
      return new Proxy(obj, {
        set: function(target, property, value, receiver) {
          _State.emitter.emit(property, value);
          return Reflect.set(target, property, value, receiver);
        }
      });
    }
    /**
     * @type {Proxy}
     * @static
     * @private
     */
    static proxy = new Proxy(_State.state, {
      set: function(target, property, value, receiver) {
        if (typeof value === "object" && value !== null) {
          value = _State.createProxy(value);
        }
        _State.emitter.emit(property, value);
        return Reflect.set(target, property, value, receiver);
      }
    });
    /**
     * Register an event handler for a given event.
     * @param {string} event - The name of the event.
     * @param {Function} handler - The callback function to handle the event.
     */
    static on(event, handler) {
      this.emitter.on(event, handler);
    }
    /**
     * Unregister an event handler for a given event.
     * @param {string} event - The name of the event.
     * @param {Function} handler - The callback function to remove.
     */
    static off(event, handler) {
      this.emitter.off(event, handler);
    }
  };
  var proxyHandler = {
    /**
     * Proxy handler to intercept property access.
     * @param {Object} target - The target object.
     * @param {string|symbol} property - The name of the property to get.
     * @returns {*} - The value of the property.
     */
    get(target, property) {
      if (property in State) {
        return State[property].bind(State);
      }
      return target[property];
    },
    /**
     * Proxy handler to intercept property setting.
     * @param {Object} target - The target object.
     * @param {string|symbol} property - The name of the property to set.
     * @param {*} value - The new value of the property.
     * @param {Object} receiver - The proxy or object that initially received the request.
     * @returns {boolean} - True if the property was set successfully, false otherwise.
     */
    set(target, property, value, receiver) {
      return Reflect.set(State.proxy, property, value, receiver);
    }
  };
  var hey_default = new Proxy(State.proxy, proxyHandler);

  // node_modules/.pnpm/gsap@3.12.7/node_modules/gsap/gsap-core.js
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  };
  var _defaults = {
    duration: 0.5,
    overwrite: false,
    delay: 0
  };
  var _suppressOverwrites;
  var _reverting;
  var _context;
  var _bigNum = 1e8;
  var _tinyNum = 1 / _bigNum;
  var _2PI = Math.PI * 2;
  var _HALF_PI = _2PI / 4;
  var _gsID = 0;
  var _sqrt = Math.sqrt;
  var _cos = Math.cos;
  var _sin = Math.sin;
  var _isString = function _isString2(value) {
    return typeof value === "string";
  };
  var _isFunction = function _isFunction2(value) {
    return typeof value === "function";
  };
  var _isNumber = function _isNumber2(value) {
    return typeof value === "number";
  };
  var _isUndefined = function _isUndefined2(value) {
    return typeof value === "undefined";
  };
  var _isObject = function _isObject2(value) {
    return typeof value === "object";
  };
  var _isNotFalse = function _isNotFalse2(value) {
    return value !== false;
  };
  var _windowExists = function _windowExists2() {
    return typeof window !== "undefined";
  };
  var _isFuncOrString = function _isFuncOrString2(value) {
    return _isFunction(value) || _isString(value);
  };
  var _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {
  };
  var _isArray = Array.isArray;
  var _strictNumExp = /(?:-?\.?\d|\.)+/gi;
  var _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g;
  var _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g;
  var _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi;
  var _relExp = /[+-]=-?[.\d]+/;
  var _delimitedValueExp = /[^,'"\[\]\s]+/gi;
  var _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i;
  var _globalTimeline;
  var _win;
  var _coreInitted;
  var _doc;
  var _globals = {};
  var _installScope = {};
  var _coreReady;
  var _install = function _install2(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap;
  };
  var _missingPlugin = function _missingPlugin2(property, value) {
    return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
  };
  var _warn = function _warn2(message, suppress) {
    return !suppress && console.warn(message);
  };
  var _addGlobal = function _addGlobal2(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
  };
  var _emptyFunc = function _emptyFunc2() {
    return 0;
  };
  var _startAtRevertConfig = {
    suppressEvents: true,
    isStart: true,
    kill: false
  };
  var _revertConfigNoKill = {
    suppressEvents: true,
    kill: false
  };
  var _revertConfig = {
    suppressEvents: true
  };
  var _reservedProps = {};
  var _lazyTweens = [];
  var _lazyLookup = {};
  var _lastRenderedFrame;
  var _plugins = {};
  var _effects = {};
  var _nextGCFrame = 30;
  var _harnessPlugins = [];
  var _callbackNames = "";
  var _harness = function _harness2(targets) {
    var target = targets[0], harnessPlugin, i;
    _isObject(target) || _isFunction(target) || (targets = [targets]);
    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i = _harnessPlugins.length;
      while (i-- && !_harnessPlugins[i].targetTest(target)) {
      }
      harnessPlugin = _harnessPlugins[i];
    }
    i = targets.length;
    while (i--) {
      targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
    }
    return targets;
  };
  var _getCache = function _getCache2(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap;
  };
  var _getProperty = function _getProperty2(target, property, v) {
    return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
  };
  var _forEachName = function _forEachName2(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  };
  var _round = function _round2(value) {
    return Math.round(value * 1e5) / 1e5 || 0;
  };
  var _roundPrecise = function _roundPrecise2(value) {
    return Math.round(value * 1e7) / 1e7 || 0;
  };
  var _parseRelative = function _parseRelative2(start, value) {
    var operator = value.charAt(0), end = parseFloat(value.substr(2));
    start = parseFloat(start);
    return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
  };
  var _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
    var l = toFind.length, i = 0;
    for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l; ) {
    }
    return i < l;
  };
  var _lazyRender = function _lazyRender2() {
    var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
    _lazyLookup = {};
    _lazyTweens.length = 0;
    for (i = 0; i < l; i++) {
      tween = a[i];
      tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
    }
  };
  var _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
    _lazyTweens.length && !_reverting && _lazyRender();
    animation.render(time, suppressEvents, force || _reverting && time < 0 && (animation._initted || animation._startAt));
    _lazyTweens.length && !_reverting && _lazyRender();
  };
  var _numericIfPossible = function _numericIfPossible2(value) {
    var n = parseFloat(value);
    return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
  };
  var _passThrough = function _passThrough2(p) {
    return p;
  };
  var _setDefaults = function _setDefaults2(obj, defaults2) {
    for (var p in defaults2) {
      p in obj || (obj[p] = defaults2[p]);
    }
    return obj;
  };
  var _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
    return function(obj, defaults2) {
      for (var p in defaults2) {
        p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults2[p]);
      }
    };
  };
  var _merge = function _merge2(base, toMerge) {
    for (var p in toMerge) {
      base[p] = toMerge[p];
    }
    return base;
  };
  var _mergeDeep = function _mergeDeep2(base, toMerge) {
    for (var p in toMerge) {
      p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
    }
    return base;
  };
  var _copyExcluding = function _copyExcluding2(obj, excluding) {
    var copy6 = {}, p;
    for (p in obj) {
      p in excluding || (copy6[p] = obj[p]);
    }
    return copy6;
  };
  var _inheritDefaults = function _inheritDefaults2(vars) {
    var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent || parent._dp;
      }
    }
    return vars;
  };
  var _arraysMatch = function _arraysMatch2(a1, a2) {
    var i = a1.length, match = i === a2.length;
    while (match && i-- && a1[i] === a2[i]) {
    }
    return i < 0;
  };
  var _addLinkedListItem = function _addLinkedListItem2(parent, child, firstProp, lastProp, sortBy) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = parent[lastProp], t;
    if (sortBy) {
      t = child[sortBy];
      while (prev && prev[sortBy] > t) {
        prev = prev._prev;
      }
    }
    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }
    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }
    child._prev = prev;
    child.parent = child._dp = parent;
    return child;
  };
  var _removeLinkedListItem = function _removeLinkedListItem2(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = child._prev, next = child._next;
    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }
    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }
    child._next = child._prev = child.parent = null;
  };
  var _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
    child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
    child._act = 0;
  };
  var _uncache = function _uncache2(animation, child) {
    if (animation && (!child || child._end > animation._dur || child._start < 0)) {
      var a = animation;
      while (a) {
        a._dirty = 1;
        a = a.parent;
      }
    }
    return animation;
  };
  var _recacheAncestors = function _recacheAncestors2(animation) {
    var parent = animation.parent;
    while (parent && parent.parent) {
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }
    return animation;
  };
  var _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
    return tween._startAt && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
  };
  var _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
  };
  var _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
    return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
  };
  var _animationCycle = function _animationCycle2(tTime, cycleDuration) {
    var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
    return tTime && whole === tTime ? whole - 1 : whole;
  };
  var _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
    return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
  };
  var _setEnd = function _setEnd2(animation) {
    return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
  };
  var _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
    var parent = animation._dp;
    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
      _setEnd(animation);
      parent._dirty || _uncache(parent, animation);
    }
    return animation;
  };
  var _postAddChecks = function _postAddChecks2(timeline2, child) {
    var t;
    if (child._time || !child._dur && child._initted || child._start < timeline2._time && (child._dur || !child.add)) {
      t = _parentToChildTotalTime(timeline2.rawTime(), child);
      if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
        child.render(t, true);
      }
    }
    if (_uncache(timeline2, child)._dp && timeline2._initted && timeline2._time >= timeline2._dur && timeline2._ts) {
      if (timeline2._dur < timeline2.duration()) {
        t = timeline2;
        while (t._dp) {
          t.rawTime() >= 0 && t.totalTime(t._tTime);
          t = t._dp;
        }
      }
      timeline2._zTime = -_tinyNum;
    }
  };
  var _addToTimeline = function _addToTimeline2(timeline2, child, position, skipChecks) {
    child.parent && _removeFromParent(child);
    child._start = _roundPrecise((_isNumber(position) ? position : position || timeline2 !== _globalTimeline ? _parsePosition(timeline2, position, child) : timeline2._time) + child._delay);
    child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
    _addLinkedListItem(timeline2, child, "_first", "_last", timeline2._sort ? "_start" : 0);
    _isFromOrFromStart(child) || (timeline2._recent = child);
    skipChecks || _postAddChecks(timeline2, child);
    timeline2._ts < 0 && _alignPlayhead(timeline2, timeline2._tTime);
    return timeline2;
  };
  var _scrollTrigger = function _scrollTrigger2(animation, trigger) {
    return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
  };
  var _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
    _initTween(tween, time, tTime);
    if (!tween._initted) {
      return 1;
    }
    if (!force && tween._pt && !_reverting && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
      _lazyTweens.push(tween);
      tween._lazy = [tTime, suppressEvents];
      return 1;
    }
  };
  var _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
    var parent = _ref.parent;
    return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent));
  };
  var _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
    var data = _ref2.data;
    return data === "isFromStart" || data === "isStart";
  };
  var _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
    var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = _animationCycle(tTime, repeatDelay);
      tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
      if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
        prevRatio = 1 - ratio;
        tween.vars.repeatRefresh && tween._initted && tween.invalidate();
      }
    }
    if (ratio !== prevRatio || _reverting || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
        return;
      }
      prevIteration = tween._zTime;
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
      suppressEvents || (suppressEvents = totalTime && !prevIteration);
      tween.ratio = ratio;
      tween._from && (ratio = 1 - ratio);
      tween._time = 0;
      tween._tTime = tTime;
      pt = tween._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
      tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
      tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        ratio && _removeFromParent(tween, 1);
        if (!suppressEvents && !_reverting) {
          _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
          tween._prom && tween._prom();
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime;
    }
  };
  var _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
    var child;
    if (time > prevTime) {
      child = animation._first;
      while (child && child._start <= time) {
        if (child.data === "isPause" && child._start > prevTime) {
          return child;
        }
        child = child._next;
      }
    } else {
      child = animation._last;
      while (child && child._start >= time) {
        if (child.data === "isPause" && child._start < prevTime) {
          return child;
        }
        child = child._prev;
      }
    }
  };
  var _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
    var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
    totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
    animation._dur = dur;
    animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
    totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
    animation.parent && _setEnd(animation);
    skipUncache || _uncache(animation.parent, animation);
    return animation;
  };
  var _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
    return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
  };
  var _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc,
    totalDuration: _emptyFunc
  };
  var _parsePosition = function _parsePosition2(animation, position, percentAnimation) {
    var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur, i, offset, isPercent;
    if (_isString(position) && (isNaN(position) || position in labels)) {
      offset = position.charAt(0);
      isPercent = position.substr(-1) === "%";
      i = position.indexOf("=");
      if (offset === "<" || offset === ">") {
        i >= 0 && (position = position.replace(/=/, ""));
        return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
      }
      if (i < 0) {
        position in labels || (labels[position] = clippedDuration);
        return labels[position];
      }
      offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
      if (isPercent && percentAnimation) {
        offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
      }
      return i > 1 ? _parsePosition2(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
    }
    return position == null ? clippedDuration : +position;
  };
  var _createTweenType = function _createTweenType2(type, params2, timeline2) {
    var isLegacy = _isNumber(params2[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params2[varsIndex], irVars, parent;
    isLegacy && (vars.duration = params2[1]);
    vars.parent = timeline2;
    if (type) {
      irVars = vars;
      parent = timeline2;
      while (parent && !("immediateRender" in irVars)) {
        irVars = parent.vars.defaults || {};
        parent = _isNotFalse(parent.vars.inherit) && parent.parent;
      }
      vars.immediateRender = _isNotFalse(irVars.immediateRender);
      type < 2 ? vars.runBackwards = 1 : vars.startAt = params2[varsIndex - 1];
    }
    return new Tween(params2[0], vars, params2[varsIndex + 1]);
  };
  var _conditionalReturn = function _conditionalReturn2(value, func) {
    return value || value === 0 ? func(value) : func;
  };
  var _clamp = function _clamp2(min, max, value) {
    return value < min ? min : value > max ? max : value;
  };
  var getUnit = function getUnit2(value, v) {
    return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
  };
  var clamp = function clamp2(min, max, value) {
    return _conditionalReturn(value, function(v) {
      return _clamp(min, max, v);
    });
  };
  var _slice = [].slice;
  var _isArrayLike = function _isArrayLike2(value, nonEmpty) {
    return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
  };
  var _flatten = function _flatten2(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }
    return ar.forEach(function(value) {
      var _accumulator;
      return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
    }) || accumulator;
  };
  var toArray = function toArray2(value, scope, leaveStrings) {
    return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
  };
  var selector = function selector2(value) {
    value = toArray(value)[0] || _warn("Invalid scope") || {};
    return function(v) {
      var el = value.current || value.nativeElement || value;
      return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
    };
  };
  var shuffle = function shuffle2(a) {
    return a.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var distribute = function distribute2(v) {
    if (_isFunction(v)) {
      return v;
    }
    var vars = _isObject(v) ? v : {
      each: v
    }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
    if (_isString(from)) {
      ratioX = ratioY = {
        center: 0.5,
        edges: 0.5,
        end: 1
      }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }
    return function(i, target, a) {
      var l = (a || vars).length, distances = cache[l], originX, originY, x, y, d, j, max, min, wrapAt;
      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];
        if (!wrapAt) {
          max = -_bigNum;
          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {
          }
          wrapAt < l && wrapAt--;
        }
        distances = cache[l] = [];
        originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt;
        originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - 0.5 : from / wrapAt | 0;
        max = 0;
        min = _bigNum;
        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX;
          y = originY - (j / wrapAt | 0);
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
          d > max && (max = d);
          d < min && (min = d);
        }
        from === "random" && shuffle(distances);
        distances.max = max - min;
        distances.min = min;
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
        distances.b = l < 0 ? base - l : base;
        distances.u = getUnit(vars.amount || vars.each) || 0;
        ease = ease && l < 0 ? _invertEase(ease) : ease;
      }
      l = (distances[i] - distances.min) / distances.max || 0;
      return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
    };
  };
  var _roundModifier = function _roundModifier2(v) {
    var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
    return function(raw) {
      var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
      return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
    };
  };
  var snap = function snap2(snapTo, value) {
    var isArray = _isArray(snapTo), radius, is2D;
    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum;
      if (snapTo.values) {
        snapTo = toArray(snapTo.values);
        if (is2D = !_isNumber(snapTo[0])) {
          radius *= radius;
        }
      } else {
        snapTo = _roundModifier(snapTo.increment);
      }
    }
    return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function(raw) {
      is2D = snapTo(raw);
      return Math.abs(is2D - raw) <= radius ? is2D : raw;
    } : function(raw) {
      var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum, closest = 0, i = snapTo.length, dx, dy;
      while (i--) {
        if (is2D) {
          dx = snapTo[i].x - x;
          dy = snapTo[i].y - y;
          dx = dx * dx + dy * dy;
        } else {
          dx = Math.abs(snapTo[i] - x);
        }
        if (dx < min) {
          min = dx;
          closest = i;
        }
      }
      closest = !radius || min <= radius ? snapTo[closest] : raw;
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
    });
  };
  var random = function random2(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
      return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
    });
  };
  var pipe = function pipe2() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }
    return function(value) {
      return functions.reduce(function(v, f) {
        return f(v);
      }, value);
    };
  };
  var unitize = function unitize2(func, unit) {
    return function(value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  };
  var normalize = function normalize2(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  };
  var _wrapArray = function _wrapArray2(a, wrapper, value) {
    return _conditionalReturn(value, function(index) {
      return a[~~wrapper(index)];
    });
  };
  var wrap = function wrap2(min, max, value) {
    var range = max - min;
    return _isArray(min) ? _wrapArray(min, wrap2(0, min.length), max) : _conditionalReturn(value, function(value2) {
      return (range + (value2 - min) % range) % range + min;
    });
  };
  var wrapYoyo = function wrapYoyo2(min, max, value) {
    var range = max - min, total = range * 2;
    return _isArray(min) ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max) : _conditionalReturn(value, function(value2) {
      value2 = (total + (value2 - min) % total) % total || 0;
      return min + (value2 > range ? total - value2 : value2);
    });
  };
  var _replaceRandom = function _replaceRandom2(value) {
    var prev = 0, s = "", i, nums, end, isArray;
    while (~(i = value.indexOf("random(", prev))) {
      end = value.indexOf(")", i);
      isArray = value.charAt(i + 7) === "[";
      nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
      s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
      prev = end + 1;
    }
    return s + value.substr(prev, value.length - prev);
  };
  var mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin, outRange = outMax - outMin;
    return _conditionalReturn(value, function(value2) {
      return outMin + ((value2 - inMin) / inRange * outRange || 0);
    });
  };
  var interpolate = function interpolate2(start, end, progress, mutate) {
    var func = isNaN(start + end) ? 0 : function(p2) {
      return (1 - p2) * start + p2 * end;
    };
    if (!func) {
      var isString2 = _isString(start), master = {}, p, i, interpolators, l, il;
      progress === true && (mutate = 1) && (progress = null);
      if (isString2) {
        start = {
          p: start
        };
        end = {
          p: end
        };
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = [];
        l = start.length;
        il = l - 2;
        for (i = 1; i < l; i++) {
          interpolators.push(interpolate2(start[i - 1], start[i]));
        }
        l--;
        func = function func2(p2) {
          p2 *= l;
          var i2 = Math.min(il, ~~p2);
          return interpolators[i2](p2 - i2);
        };
        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start);
      }
      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, "get", end[p]);
        }
        func = function func2(p2) {
          return _renderPropTweens(p2, master) || (isString2 ? start.p : start);
        };
      }
    }
    return _conditionalReturn(progress, func);
  };
  var _getLabelInDirection = function _getLabelInDirection2(timeline2, fromTime, backward) {
    var labels = timeline2.labels, min = _bigNum, p, distance2, label;
    for (p in labels) {
      distance2 = labels[p] - fromTime;
      if (distance2 < 0 === !!backward && distance2 && min > (distance2 = Math.abs(distance2))) {
        label = p;
        min = distance2;
      }
    }
    return label;
  };
  var _callback = function _callback2(animation, type, executeLazyFirst) {
    var v = animation.vars, callback = v[type], prevContext = _context, context3 = animation._ctx, params2, scope, result;
    if (!callback) {
      return;
    }
    params2 = v[type + "Params"];
    scope = v.callbackScope || animation;
    executeLazyFirst && _lazyTweens.length && _lazyRender();
    context3 && (_context = context3);
    result = params2 ? callback.apply(scope, params2) : callback.call(scope);
    _context = prevContext;
    return result;
  };
  var _interrupt = function _interrupt2(animation) {
    _removeFromParent(animation);
    animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting);
    animation.progress() < 1 && _callback(animation, "onInterrupt");
    return animation;
  };
  var _quickTween;
  var _registerPluginQueue = [];
  var _createPlugin = function _createPlugin2(config3) {
    if (!config3) return;
    config3 = !config3.name && config3["default"] || config3;
    if (_windowExists() || config3.headless) {
      var name = config3.name, isFunc = _isFunction(config3), Plugin = name && !isFunc && config3.init ? function() {
        this._props = [];
      } : config3, instanceDefaults = {
        init: _emptyFunc,
        render: _renderPropTweens,
        add: _addPropTween,
        kill: _killPropTweensOf,
        modifier: _addPluginModifier,
        rawVars: 0
      }, statics = {
        targetTest: 0,
        get: 0,
        getSetter: _getSetter,
        aliases: {},
        register: 0
      };
      _wake();
      if (config3 !== Plugin) {
        if (_plugins[name]) {
          return;
        }
        _setDefaults(Plugin, _setDefaults(_copyExcluding(config3, instanceDefaults), statics));
        _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config3, statics)));
        _plugins[Plugin.prop = name] = Plugin;
        if (config3.targetTest) {
          _harnessPlugins.push(Plugin);
          _reservedProps[name] = 1;
        }
        name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
      }
      _addGlobal(name, Plugin);
      config3.register && config3.register(gsap, Plugin, PropTween);
    } else {
      _registerPluginQueue.push(config3);
    }
  };
  var _255 = 255;
  var _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0]
  };
  var _hue = function _hue2(h, m1, m2) {
    h += h < 0 ? 1 : h > 1 ? -1 : 0;
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0;
  };
  var splitColor = function splitColor2(v, toHSL, forceAlpha) {
    var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r, g, b, h, s, l, max, min, d, wasHSL;
    if (!a) {
      if (v.substr(-1) === ",") {
        v = v.substr(0, v.length - 1);
      }
      if (_colorLookup[v]) {
        a = _colorLookup[v];
      } else if (v.charAt(0) === "#") {
        if (v.length < 6) {
          r = v.charAt(1);
          g = v.charAt(2);
          b = v.charAt(3);
          v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
        }
        if (v.length === 9) {
          a = parseInt(v.substr(1, 6), 16);
          return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
        }
        v = parseInt(v.substr(1), 16);
        a = [v >> 16, v >> 8 & _255, v & _255];
      } else if (v.substr(0, 3) === "hsl") {
        a = wasHSL = v.match(_strictNumExp);
        if (!toHSL) {
          h = +a[0] % 360 / 360;
          s = +a[1] / 100;
          l = +a[2] / 100;
          g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
          r = l * 2 - g;
          a.length > 3 && (a[3] *= 1);
          a[0] = _hue(h + 1 / 3, r, g);
          a[1] = _hue(h, r, g);
          a[2] = _hue(h - 1 / 3, r, g);
        } else if (~v.indexOf("=")) {
          a = v.match(_numExp);
          forceAlpha && a.length < 4 && (a[3] = 1);
          return a;
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent;
      }
      a = a.map(Number);
    }
    if (toHSL && !wasHSL) {
      r = a[0] / _255;
      g = a[1] / _255;
      b = a[2] / _255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
      }
      a[0] = ~~(h + 0.5);
      a[1] = ~~(s * 100 + 0.5);
      a[2] = ~~(l * 100 + 0.5);
    }
    forceAlpha && a.length < 4 && (a[3] = 1);
    return a;
  };
  var _colorOrderData = function _colorOrderData2(v) {
    var values = [], c = [], i = -1;
    v.split(_colorExp).forEach(function(v2) {
      var a = v2.match(_numWithUnitExp) || [];
      values.push.apply(values, a);
      c.push(i += a.length + 1);
    });
    values.c = c;
    return values;
  };
  var _formatColors = function _formatColors2(s, toHSL, orderMatchData) {
    var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
    if (!colors) {
      return s;
    }
    colors = colors.map(function(color) {
      return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
    });
    if (orderMatchData) {
      d = _colorOrderData(s);
      c = orderMatchData.c;
      if (c.join(result) !== d.c.join(result)) {
        shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
        l = shell.length - 1;
        for (; i < l; i++) {
          result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
        }
      }
    }
    if (!shell) {
      shell = s.split(_colorExp);
      l = shell.length - 1;
      for (; i < l; i++) {
        result += shell[i] + colors[i];
      }
    }
    return result + shell[l];
  };
  var _colorExp = function() {
    var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
    for (p in _colorLookup) {
      s += "|" + p + "\\b";
    }
    return new RegExp(s + ")", "gi");
  }();
  var _hslExp = /hsl[a]?\(/;
  var _colorStringFilter = function _colorStringFilter2(a) {
    var combined = a.join(" "), toHSL;
    _colorExp.lastIndex = 0;
    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a[1] = _formatColors(a[1], toHSL);
      a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
      return true;
    }
  };
  var _tickerActive;
  var _ticker = function() {
    var _getTime = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners2 = [], _id, _req, _raf, _self, _delta, _i, _tick = function _tick2(v) {
      var elapsed = _getTime() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
      (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
      _lastUpdate += elapsed;
      time = _lastUpdate - _startTime;
      overlap = time - _nextTime;
      if (overlap > 0 || manual) {
        frame = ++_self.frame;
        _delta = time - _self.time * 1e3;
        _self.time = time = time / 1e3;
        _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
        dispatch = 1;
      }
      manual || (_id = _req(_tick2));
      if (dispatch) {
        for (_i = 0; _i < _listeners2.length; _i++) {
          _listeners2[_i](time, _delta, frame, v);
        }
      }
    };
    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1e3 / (fps || 60));
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists()) {
            _win = _coreInitted = window;
            _doc = _win.document || {};
            _globals.gsap = gsap;
            (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
            _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});
            _registerPluginQueue.forEach(_createPlugin);
          }
          _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
          _id && _self.sleep();
          _req = _raf || function(f) {
            return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
          };
          _tickerActive = 1;
          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || Infinity;
        _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
      },
      fps: function fps(_fps) {
        _gap = 1e3 / (_fps || 240);
        _nextTime = _self.time * 1e3 + _gap;
      },
      add: function add4(callback, once, prioritize) {
        var func = once ? function(t, d, f, v) {
          callback(t, d, f, v);
          _self.remove(func);
        } : callback;
        _self.remove(callback);
        _listeners2[prioritize ? "unshift" : "push"](func);
        _wake();
        return func;
      },
      remove: function remove(callback, i) {
        ~(i = _listeners2.indexOf(callback)) && _listeners2.splice(i, 1) && _i >= i && _i--;
      },
      _listeners: _listeners2
    };
    return _self;
  }();
  var _wake = function _wake2() {
    return !_tickerActive && _ticker.wake();
  };
  var _easeMap = {};
  var _customEaseExp = /^[\d.\-M][\d.\-,\s]/;
  var _quotesExp = /["']/g;
  var _parseObjectInString = function _parseObjectInString2(value) {
    var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length, index, val, parsedVal;
    for (; i < l; i++) {
      val = split[i];
      index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
      key = val.substr(index + 1).trim();
    }
    return obj;
  };
  var _valueInParentheses = function _valueInParentheses2(value) {
    var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
    return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
  };
  var _configEaseFromString = function _configEaseFromString2(name) {
    var split = (name + "").split("("), ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
  };
  var _invertEase = function _invertEase2(ease) {
    return function(p) {
      return 1 - ease(1 - p);
    };
  };
  var _propagateYoyoEase = function _propagateYoyoEase2(timeline2, isYoyo) {
    var child = timeline2._first, ease;
    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase2(child, isYoyo);
      } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
        if (child.timeline) {
          _propagateYoyoEase2(child.timeline, isYoyo);
        } else {
          ease = child._ease;
          child._ease = child._yEase;
          child._yEase = ease;
          child._yoyo = isYoyo;
        }
      }
      child = child._next;
    }
  };
  var _parseEase = function _parseEase2(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  };
  var _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut2(p) {
        return 1 - easeIn(1 - p);
      };
    }
    if (easeInOut === void 0) {
      easeInOut = function easeInOut2(p) {
        return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
      };
    }
    var ease = {
      easeIn,
      easeOut,
      easeInOut
    }, lowercaseName;
    _forEachName(names, function(name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
      for (var p in ease) {
        _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
      }
    });
    return ease;
  };
  var _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
    return function(p) {
      return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2;
    };
  };
  var _configElastic = function _configElastic2(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
    }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);
    p2 = _2PI / p2;
    ease.config = function(amplitude2, period2) {
      return _configElastic2(type, amplitude2, period2);
    };
    return ease;
  };
  var _configBack = function _configBack2(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }
    var easeOut = function easeOut2(p) {
      return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
    }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);
    ease.config = function(overshoot2) {
      return _configBack2(type, overshoot2);
    };
    return ease;
  };
  _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i) {
    var power = i < 5 ? i + 1 : i;
    _insertEase(name + ",Power" + (power - 1), i ? function(p) {
      return Math.pow(p, power);
    } : function(p) {
      return p;
    }, function(p) {
      return 1 - Math.pow(1 - p, power);
    }, function(p) {
      return p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
    });
  });
  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
  _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
  (function(n, c) {
    var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n * (p -= 2.25 / c) * p + 0.9375 : n * Math.pow(p - 2.625 / c, 2) + 0.984375;
    };
    _insertEase("Bounce", function(p) {
      return 1 - easeOut(1 - p);
    }, easeOut);
  })(7.5625, 2.75);
  _insertEase("Expo", function(p) {
    return Math.pow(2, 10 * (p - 1)) * p + p * p * p * p * p * p * (1 - p);
  });
  _insertEase("Circ", function(p) {
    return -(_sqrt(1 - p * p) - 1);
  });
  _insertEase("Sine", function(p) {
    return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
  });
  _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1;
      }
      var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
      return function(p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
      };
    }
  };
  _defaults.ease = _easeMap["quad.out"];
  _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
    return _callbackNames += name + "," + name + "Params,";
  });
  var GSCache = function GSCache2(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter;
  };
  var Animation = /* @__PURE__ */ function() {
    function Animation2(vars) {
      this.vars = vars;
      this._delay = +vars.delay || 0;
      if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
      }
      this._ts = 1;
      _setDuration(this, +vars.duration, 1, 1);
      this.data = vars.data;
      if (_context) {
        this._ctx = _context;
        _context.data.push(this);
      }
      _tickerActive || _ticker.wake();
    }
    var _proto = Animation2.prototype;
    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
        this._delay = value;
        return this;
      }
      return this._delay;
    };
    _proto.duration = function duration(value) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
    };
    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur;
      }
      this._dirty = 0;
      return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
    };
    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake();
      if (!arguments.length) {
        return this._tTime;
      }
      var parent = this._dp;
      if (parent && parent.smoothChildTiming && this._ts) {
        _alignPlayhead(this, _totalTime);
        !parent._dp || parent.parent || _postAddChecks(parent, this);
        while (parent && parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true);
          }
          parent = parent.parent;
        }
        if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
          _addToTimeline(this._dp, this, this._start - this._delay);
        }
      }
      if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
        this._ts || (this._pTime = _totalTime);
        _lazySafeRender(this, _totalTime, suppressEvents);
      }
      return this;
    };
    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
    };
    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    };
    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
    };
    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
    };
    _proto.timeScale = function timeScale(value, suppressEvents) {
      if (!arguments.length) {
        return this._rts === -_tinyNum ? 0 : this._rts;
      }
      if (this._rts === value) {
        return this;
      }
      var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
      this._rts = +value || 0;
      this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
      this.totalTime(_clamp(-Math.abs(this._delay), this._tDur, tTime), suppressEvents !== false);
      _setEnd(this);
      return _recacheAncestors(this);
    };
    _proto.paused = function paused(value) {
      if (!arguments.length) {
        return this._ps;
      }
      if (this._ps !== value) {
        this._ps = value;
        if (value) {
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
          this._ts = this._act = 0;
        } else {
          _wake();
          this._ts = this._rts;
          this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
        }
      }
      return this;
    };
    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        this._start = value;
        var parent = this.parent || this._dp;
        parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
        return this;
      }
      return this._start;
    };
    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    };
    _proto.rawTime = function rawTime(wrapRepeats) {
      var parent = this.parent || this._dp;
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
    };
    _proto.revert = function revert(config3) {
      if (config3 === void 0) {
        config3 = _revertConfig;
      }
      var prevIsReverting = _reverting;
      _reverting = config3;
      if (this._initted || this._startAt) {
        this.timeline && this.timeline.revert(config3);
        this.totalTime(-0.01, config3.suppressEvents);
      }
      this.data !== "nested" && config3.kill !== false && this.kill();
      _reverting = prevIsReverting;
      return this;
    };
    _proto.globalTime = function globalTime(rawTime) {
      var animation = this, time = arguments.length ? rawTime : animation.rawTime();
      while (animation) {
        time = animation._start + time / (Math.abs(animation._ts) || 1);
        animation = animation._dp;
      }
      return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
    };
    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value === Infinity ? -2 : value;
        return _onUpdateTotalDuration(this);
      }
      return this._repeat === -2 ? Infinity : this._repeat;
    };
    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        var time = this._time;
        this._rDelay = value;
        _onUpdateTotalDuration(this);
        return time ? this.time(time) : this;
      }
      return this._rDelay;
    };
    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value;
        return this;
      }
      return this._yoyo;
    };
    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
    };
    _proto.restart = function restart(includeDelay, suppressEvents) {
      this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
      this._dur || (this._zTime = -_tinyNum);
      return this;
    };
    _proto.play = function play(from, suppressEvents) {
      from != null && this.seek(from, suppressEvents);
      return this.reversed(false).paused(false);
    };
    _proto.reverse = function reverse(from, suppressEvents) {
      from != null && this.seek(from || this.totalDuration(), suppressEvents);
      return this.reversed(true).paused(false);
    };
    _proto.pause = function pause(atTime, suppressEvents) {
      atTime != null && this.seek(atTime, suppressEvents);
      return this.paused(true);
    };
    _proto.resume = function resume() {
      return this.paused(false);
    };
    _proto.reversed = function reversed(value) {
      if (arguments.length) {
        !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
        return this;
      }
      return this._rts < 0;
    };
    _proto.invalidate = function invalidate() {
      this._initted = this._act = 0;
      this._zTime = -_tinyNum;
      return this;
    };
    _proto.isActive = function isActive() {
      var parent = this.parent || this._dp, start = this._start, rawTime;
      return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
    };
    _proto.eventCallback = function eventCallback(type, callback, params2) {
      var vars = this.vars;
      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type];
        } else {
          vars[type] = callback;
          params2 && (vars[type + "Params"] = params2);
          type === "onUpdate" && (this._onUpdate = callback);
        }
        return this;
      }
      return vars[type];
    };
    _proto.then = function then(onFulfilled) {
      var self = this;
      return new Promise(function(resolve) {
        var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve2() {
          var _then = self.then;
          self.then = null;
          _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
          resolve(f);
          self.then = _then;
        };
        if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
          _resolve();
        } else {
          self._prom = _resolve;
        }
      });
    };
    _proto.kill = function kill() {
      _interrupt(this);
    };
    return Animation2;
  }();
  _setDefaults(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: null,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0,
    _ps: false,
    _rts: 1
  });
  var Timeline = /* @__PURE__ */ function(_Animation) {
    _inheritsLoose(Timeline2, _Animation);
    function Timeline2(vars, position) {
      var _this;
      if (vars === void 0) {
        vars = {};
      }
      _this = _Animation.call(this, vars) || this;
      _this.labels = {};
      _this.smoothChildTiming = !!vars.smoothChildTiming;
      _this.autoRemoveChildren = !!vars.autoRemoveChildren;
      _this._sort = _isNotFalse(vars.sortChildren);
      _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
      vars.reversed && _this.reverse();
      vars.paused && _this.paused(true);
      vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
      return _this;
    }
    var _proto2 = Timeline2.prototype;
    _proto2.to = function to(targets, vars, position) {
      _createTweenType(0, arguments, this);
      return this;
    };
    _proto2.from = function from(targets, vars, position) {
      _createTweenType(1, arguments, this);
      return this;
    };
    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      _createTweenType(2, arguments, this);
      return this;
    };
    _proto2.set = function set6(targets, vars, position) {
      vars.duration = 0;
      vars.parent = this;
      _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
      vars.immediateRender = !!vars.immediateRender;
      new Tween(targets, vars, _parsePosition(this, position), 1);
      return this;
    };
    _proto2.call = function call(callback, params2, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params2), position);
    };
    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition(this, position));
      return this;
    };
    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1;
      _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
    };
    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars;
      _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
    };
    _proto2.render = function render3(totalTime, suppressEvents, force) {
      var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
      this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
      if (tTime !== this._tTime || force || crossingStart) {
        if (prevTime !== this._time && dur) {
          tTime += this._time - prevTime;
          totalTime += this._time - prevTime;
        }
        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = !timeScale;
        if (crossingStart) {
          dur || (prevTime = this._zTime);
          (totalTime || !suppressEvents) && (this._zTime = totalTime);
        }
        if (this._repeat) {
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && totalTime < 0) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration);
          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            prevIteration = _roundPrecise(tTime / cycleDuration);
            iteration = ~~prevIteration;
            if (iteration && iteration === prevIteration) {
              time = dur;
              iteration--;
            }
            time > dur && (time = dur);
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
          if (yoyo && iteration & 1) {
            time = dur - time;
            isYoyo = 1;
          }
          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
            iteration < prevIteration && (rewinding = !rewinding);
            prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
            this._lock = 1;
            this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
            this._tTime = tTime;
            !suppressEvents && this.parent && _callback(this, "onRepeat");
            this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
            if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
              return this;
            }
            dur = this._dur;
            tDur = this._tDur;
            if (doesWrap) {
              this._lock = 2;
              prevTime = rewinding ? dur : -1e-4;
              this.render(prevTime, true);
              this.vars.repeatRefresh && !isYoyo && this.invalidate();
            }
            this._lock = 0;
            if (!this._ts && !prevPaused) {
              return this;
            }
            _propagateYoyoEase(this, isYoyo);
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
          if (pauseTween) {
            tTime -= time - (time = pauseTween._start);
          }
        }
        this._tTime = tTime;
        this._time = time;
        this._act = !timeScale;
        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1;
          this._zTime = totalTime;
          prevTime = 0;
        }
        if (!prevTime && time && !suppressEvents && !iteration) {
          _callback(this, "onStart");
          if (this._tTime !== tTime) {
            return this;
          }
        }
        if (time >= prevTime && totalTime >= 0) {
          child = this._first;
          while (child) {
            next = child._next;
            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = -_tinyNum);
                break;
              }
            }
            child = next;
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time;
          while (child) {
            next = child._prev;
            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting && (child._initted || child._startAt));
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                break;
              }
            }
            child = next;
          }
        }
        if (pauseTween && !suppressEvents) {
          this.pause();
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
          if (this._ts) {
            this._start = prevStart;
            _setEnd(this);
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
        if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
          if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
            if (!this._lock) {
              (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
              if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
                _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
                this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
              }
            }
          }
        }
      }
      return this;
    };
    _proto2.add = function add4(child, position) {
      var _this2 = this;
      _isNumber(position) || (position = _parsePosition(this, position, child));
      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(function(obj) {
            return _this2.add(obj, position);
          });
          return this;
        }
        if (_isString(child)) {
          return this.addLabel(child, position);
        }
        if (_isFunction(child)) {
          child = Tween.delayedCall(0, child);
        } else {
          return this;
        }
      }
      return this !== child ? _addToTimeline(this, child, position) : this;
    };
    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = true;
      }
      if (tweens === void 0) {
        tweens = true;
      }
      if (timelines === void 0) {
        timelines = true;
      }
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum;
      }
      var a = [], child = this._first;
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            tweens && a.push(child);
          } else {
            timelines && a.push(child);
            nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
          }
        }
        child = child._next;
      }
      return a;
    };
    _proto2.getById = function getById2(id) {
      var animations = this.getChildren(1, 1, 1), i = animations.length;
      while (i--) {
        if (animations[i].vars.id === id) {
          return animations[i];
        }
      }
    };
    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child);
      }
      if (_isFunction(child)) {
        return this.killTweensOf(child);
      }
      child.parent === this && _removeLinkedListItem(this, child);
      if (child === this._recent) {
        this._recent = this._last;
      }
      return _uncache(this);
    };
    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime;
      }
      this._forcing = 1;
      if (!this._dp && this._ts) {
        this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
      }
      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
      this._forcing = 0;
      return this;
    };
    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position);
      return this;
    };
    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label];
      return this;
    };
    _proto2.addPause = function addPause(position, callback, params2) {
      var t = Tween.delayedCall(0, callback || _emptyFunc, params2);
      t.data = "isPause";
      this._hasPause = 1;
      return _addToTimeline(this, t, _parsePosition(this, position));
    };
    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition(this, position);
      while (child) {
        if (child._start === position && child.data === "isPause") {
          _removeFromParent(child);
        }
        child = child._next;
      }
    };
    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
      while (i--) {
        _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
      }
      return this;
    };
    _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
      var a = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber(onlyActive), children;
      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
            a.push(child);
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children);
        }
        child = child._next;
      }
      return a;
    };
    _proto2.tweenTo = function tweenTo(position, vars) {
      vars = vars || {};
      var tl = this, endTime = _parsePosition(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults({
        ease: vars.ease || "none",
        lazy: false,
        immediateRender: false,
        time: endTime,
        overwrite: "auto",
        duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
        onStart: function onStart() {
          tl.pause();
          if (!initted) {
            var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
            tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
            initted = 1;
          }
          _onStart && _onStart.apply(tween, onStartParams || []);
        }
      }, vars));
      return immediateRender ? tween.render(0) : tween;
    };
    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults({
        startAt: {
          time: _parsePosition(this, fromPosition)
        }
      }, vars));
    };
    _proto2.recent = function recent() {
      return this._recent;
    };
    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time;
      }
      return _getLabelInDirection(this, _parsePosition(this, afterTime));
    };
    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time;
      }
      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
    };
    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
    };
    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0;
      }
      var child = this._first, labels = this.labels, p;
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount;
          child._end += amount;
        }
        child = child._next;
      }
      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount;
          }
        }
      }
      return _uncache(this);
    };
    _proto2.invalidate = function invalidate(soft) {
      var child = this._first;
      this._lock = 0;
      while (child) {
        child.invalidate(soft);
        child = child._next;
      }
      return _Animation.prototype.invalidate.call(this, soft);
    };
    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = true;
      }
      var child = this._first, next;
      while (child) {
        next = child._next;
        this.remove(child);
        child = next;
      }
      this._dp && (this._time = this._tTime = this._pTime = 0);
      includeLabels && (this.labels = {});
      return _uncache(this);
    };
    _proto2.totalDuration = function totalDuration(value) {
      var max = 0, self = this, child = self._last, prevStart = _bigNum, prev, start, parent;
      if (arguments.length) {
        return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
      }
      if (self._dirty) {
        parent = self.parent;
        while (child) {
          prev = child._prev;
          child._dirty && child.totalDuration();
          start = child._start;
          if (start > prevStart && self._sort && child._ts && !self._lock) {
            self._lock = 1;
            _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
          } else {
            prevStart = start;
          }
          if (start < 0 && child._ts) {
            max -= start;
            if (!parent && !self._dp || parent && parent.smoothChildTiming) {
              self._start += start / self._ts;
              self._time -= start;
              self._tTime -= start;
            }
            self.shiftChildren(-start, false, -Infinity);
            prevStart = 0;
          }
          child._end > max && child._ts && (max = child._end);
          child = prev;
        }
        _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
        self._dirty = 0;
      }
      return self._tDur;
    };
    Timeline2.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
        _lastRenderedFrame = _ticker.frame;
      }
      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120;
        var child = _globalTimeline._first;
        if (!child || !child._ts) {
          if (_config.autoSleep && _ticker._listeners.length < 2) {
            while (child && !child._ts) {
              child = child._next;
            }
            child || _ticker.sleep();
          }
        }
      }
    };
    return Timeline2;
  }(Animation);
  _setDefaults(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });
  var _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop, start, end, setter, stringFilter, funcParam) {
    var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";
    if (hasRandom = ~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }
    if (stringFilter) {
      a = [start, end];
      stringFilter(a, target, prop);
      start = a[0];
      end = a[1];
    }
    startNums = start.match(_complexStringNumExp) || [];
    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0];
      chunk = end.substring(index, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }
      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0;
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0
        };
        index = _complexStringNumExp.lastIndex;
      }
    }
    pt.c = index < end.length ? end.substring(index, end.length) : "";
    pt.fp = funcParam;
    if (_relExp.test(end) || hasRandom) {
      pt.e = 0;
    }
    this._pt = pt;
    return pt;
  };
  var _addPropTween = function _addPropTween2(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
    _isFunction(end) && (end = end(index || 0, target, targets));
    var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (end.charAt(1) === "=") {
        pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
        if (pt || pt === 0) {
          end = pt;
        }
      }
    }
    if (!optional || parsedStart !== end || _forceAllPropTweens) {
      if (!isNaN(parsedStart * end) && end !== "") {
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
        funcParam && (pt.fp = funcParam);
        modifier && pt.modifier(modifier, this, target);
        return this._pt = pt;
      }
      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
    }
  };
  var _processVars = function _processVars2(vars, index, target, targets, tween) {
    _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
    if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
    }
    var copy6 = {}, p;
    for (p in vars) {
      copy6[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
    }
    return copy6;
  };
  var _checkPlugin = function _checkPlugin2(property, vars, tween, index, target, targets) {
    var plugin, pt, ptLookup, i;
    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
        i = plugin._props.length;
        while (i--) {
          ptLookup[plugin._props[i]] = pt;
        }
      }
    }
    return plugin;
  };
  var _overwritingTween;
  var _forceAllPropTweens;
  var _initTween = function _initTween2(tween, time, tTime) {
    var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl = tween.timeline, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
    tl && (!keyframes || !ease) && (ease = "none");
    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }
    tween._from = !tl && !!vars.runBackwards;
    if (!tl || keyframes && !vars.stagger) {
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop];
      cleanVars = _copyExcluding(vars, _reservedProps);
      if (prevStartAt) {
        prevStartAt._zTime < 0 && prevStartAt.progress(1);
        time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
        prevStartAt._lazy = 0;
      }
      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
          data: "isStart",
          overwrite: false,
          parent,
          immediateRender: true,
          lazy: !prevStartAt && _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate: onUpdate && function() {
            return _callback(tween, "onUpdate");
          },
          stagger: 0
        }, startAt)));
        tween._startAt._dp = 0;
        tween._startAt._sat = tween;
        time < 0 && (_reverting || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
        if (immediateRender) {
          if (dur && time <= 0 && tTime <= 0) {
            time && (tween._zTime = time);
            return;
          }
        }
      } else if (runBackwards && dur) {
        if (!prevStartAt) {
          time && (immediateRender = false);
          p = _setDefaults({
            overwrite: false,
            data: "isFromStart",
            //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
            lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
            immediateRender,
            //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
            stagger: 0,
            parent
            //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
          }, cleanVars);
          harnessVars && (p[harness.prop] = harnessVars);
          _removeFromParent(tween._startAt = Tween.set(targets, p));
          tween._startAt._dp = 0;
          tween._startAt._sat = tween;
          time < 0 && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
          tween._zTime = time;
          if (!immediateRender) {
            _initTween2(tween._startAt, _tinyNum, _tinyNum);
          } else if (!time) {
            return;
          }
        }
      }
      tween._pt = tween._ptCache = 0;
      lazy = dur && _isNotFalse(lazy) || lazy && !dur;
      for (i = 0; i < targets.length; i++) {
        target = targets[i];
        gsData = target._gsap || _harness(targets)[i]._gsap;
        tween._ptLookup[i] = ptLookup = {};
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
        index = fullTargets === targets ? i : fullTargets.indexOf(target);
        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
          plugin._props.forEach(function(name) {
            ptLookup[name] = pt;
          });
          plugin.priority && (hasPriority = 1);
        }
        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              plugin.priority && (hasPriority = 1);
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
            }
          }
        }
        tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween;
          _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
          overwritten = !tween.parent;
          _overwritingTween = 0;
        }
        tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
      }
      hasPriority && _sortPropTweensByPriority(tween);
      tween._onInit && tween._onInit(tween);
    }
    tween._onUpdate = onUpdate;
    tween._initted = (!tween._op || tween._pt) && !overwritten;
    keyframes && time <= 0 && tl.render(_bigNum, true, true);
  };
  var _updatePropTweens = function _updatePropTweens2(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
    var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
    if (!ptCache) {
      ptCache = tween._ptCache[property] = [];
      lookup = tween._ptLookup;
      i = tween._targets.length;
      while (i--) {
        pt = lookup[i][property];
        if (pt && pt.d && pt.d._pt) {
          pt = pt.d._pt;
          while (pt && pt.p !== property && pt.fp !== property) {
            pt = pt._next;
          }
        }
        if (!pt) {
          _forceAllPropTweens = 1;
          tween.vars[property] = "+=0";
          _initTween(tween, time);
          _forceAllPropTweens = 0;
          return skipRecursion ? _warn(property + " not eligible for reset") : 1;
        }
        ptCache.push(pt);
      }
    }
    i = ptCache.length;
    while (i--) {
      rootPT = ptCache[i];
      pt = rootPT._pt || rootPT;
      pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
      pt.c = value - pt.s;
      rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
      rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
    }
  };
  var _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy6, p, i, aliases;
    if (!propertyAliases) {
      return vars;
    }
    copy6 = _merge({}, vars);
    for (p in propertyAliases) {
      if (p in copy6) {
        aliases = propertyAliases[p].split(",");
        i = aliases.length;
        while (i--) {
          copy6[aliases[i]] = copy6[p];
        }
      }
    }
    return copy6;
  };
  var _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
    var ease = obj.ease || easeEach || "power1.inOut", p, a;
    if (_isArray(obj)) {
      a = allProps[prop] || (allProps[prop] = []);
      obj.forEach(function(value, i) {
        return a.push({
          t: i / (obj.length - 1) * 100,
          v: value,
          e: ease
        });
      });
    } else {
      for (p in obj) {
        a = allProps[p] || (allProps[p] = []);
        p === "ease" || a.push({
          t: parseFloat(prop),
          v: obj[p],
          e: ease
        });
      }
    }
  };
  var _parseFuncOrString = function _parseFuncOrString2(value, tween, i, target, targets) {
    return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
  };
  var _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert";
  var _staggerPropsToSkip = {};
  _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
    return _staggerPropsToSkip[name] = 1;
  });
  var Tween = /* @__PURE__ */ function(_Animation2) {
    _inheritsLoose(Tween2, _Animation2);
    function Tween2(targets, vars, position, skipInherit) {
      var _this3;
      if (typeof vars === "number") {
        position.duration = vars;
        vars = position;
        position = null;
      }
      _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
      var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults2 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets), tl, i, copy6, l, p, curTarget, staggerFunc, staggerVarsToMerge;
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
      _this3._ptLookup = [];
      _this3._overwrite = overwrite;
      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars;
        tl = _this3.timeline = new Timeline({
          data: "nested",
          defaults: defaults2 || {},
          targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
        });
        tl.kill();
        tl.parent = tl._dp = _assertThisInitialized(_this3);
        tl._start = 0;
        if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
          l = parsedTargets.length;
          staggerFunc = stagger && distribute(stagger);
          if (_isObject(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                staggerVarsToMerge || (staggerVarsToMerge = {});
                staggerVarsToMerge[p] = stagger[p];
              }
            }
          }
          for (i = 0; i < l; i++) {
            copy6 = _copyExcluding(vars, _staggerPropsToSkip);
            copy6.stagger = 0;
            yoyoEase && (copy6.yoyoEase = yoyoEase);
            staggerVarsToMerge && _merge(copy6, staggerVarsToMerge);
            curTarget = parsedTargets[i];
            copy6.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
            copy6.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
            if (!stagger && l === 1 && copy6.delay) {
              _this3._delay = delay = copy6.delay;
              _this3._start += delay;
              copy6.delay = 0;
            }
            tl.to(curTarget, copy6, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
            tl._ease = _easeMap.none;
          }
          tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
        } else if (keyframes) {
          _inheritDefaults(_setDefaults(tl.vars.defaults, {
            ease: "none"
          }));
          tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
          var time = 0, a, kf, v;
          if (_isArray(keyframes)) {
            keyframes.forEach(function(frame) {
              return tl.to(parsedTargets, frame, ">");
            });
            tl.duration();
          } else {
            copy6 = {};
            for (p in keyframes) {
              p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy6, keyframes.easeEach);
            }
            for (p in copy6) {
              a = copy6[p].sort(function(a2, b) {
                return a2.t - b.t;
              });
              time = 0;
              for (i = 0; i < a.length; i++) {
                kf = a[i];
                v = {
                  ease: kf.e,
                  duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
                };
                v[p] = kf.v;
                tl.to(parsedTargets, v, time);
                time += v.duration;
              }
            }
            tl.duration() < duration && tl.to({}, {
              duration: duration - tl.duration()
            });
          }
        }
        duration || _this3.duration(duration = tl.duration());
      } else {
        _this3.timeline = 0;
      }
      if (overwrite === true && !_suppressOverwrites) {
        _overwritingTween = _assertThisInitialized(_this3);
        _globalTimeline.killTweensOf(parsedTargets);
        _overwritingTween = 0;
      }
      _addToTimeline(parent, _assertThisInitialized(_this3), position);
      vars.reversed && _this3.reverse();
      vars.paused && _this3.paused(true);
      if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
        _this3._tTime = -_tinyNum;
        _this3.render(Math.max(0, -delay) || 0);
      }
      scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
      return _this3;
    }
    var _proto3 = Tween2.prototype;
    _proto3.render = function render3(totalTime, suppressEvents, force) {
      var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline2, yoyoEase;
      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force);
      } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
        time = tTime;
        timeline2 = this.timeline;
        if (this._repeat) {
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && isNegative) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration);
          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            prevIteration = _roundPrecise(tTime / cycleDuration);
            iteration = ~~prevIteration;
            if (iteration && iteration === prevIteration) {
              time = dur;
              iteration--;
            } else if (time > dur) {
              time = dur;
            }
          }
          isYoyo = this._yoyo && iteration & 1;
          if (isYoyo) {
            yoyoEase = this._yEase;
            time = dur - time;
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          if (time === prevTime && !force && this._initted && iteration === prevIteration) {
            this._tTime = tTime;
            return this;
          }
          if (iteration !== prevIteration) {
            timeline2 && this._yEase && _propagateYoyoEase(timeline2, isYoyo);
            if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
              this._lock = force = 1;
              this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
            }
          }
        }
        if (!this._initted) {
          if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
            this._tTime = 0;
            return this;
          }
          if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
            return this;
          }
          if (dur !== this._dur) {
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._tTime = tTime;
        this._time = time;
        if (!this._act && this._ts) {
          this._act = 1;
          this._lazy = 0;
        }
        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
        if (this._from) {
          this.ratio = ratio = 1 - ratio;
        }
        if (time && !prevTime && !suppressEvents && !iteration) {
          _callback(this, "onStart");
          if (this._tTime !== tTime) {
            return this;
          }
        }
        pt = this._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        timeline2 && timeline2.render(totalTime < 0 ? totalTime : timeline2._dur * timeline2._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
        if (this._onUpdate && !suppressEvents) {
          isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
          _callback(this, "onUpdate");
        }
        this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
          (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
          if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }
      return this;
    };
    _proto3.targets = function targets() {
      return this._targets;
    };
    _proto3.invalidate = function invalidate(soft) {
      (!soft || !this.vars.runBackwards) && (this._startAt = 0);
      this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
      this._ptLookup = [];
      this.timeline && this.timeline.invalidate(soft);
      return _Animation2.prototype.invalidate.call(this, soft);
    };
    _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
      _tickerActive || _ticker.wake();
      this._ts || this.play();
      var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
      this._initted || _initTween(this, time);
      ratio = this._ease(time / this._dur);
      if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
        return this.resetTo(property, value, start, startIsRelative, 1);
      }
      _alignPlayhead(this, 0);
      this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
      return this.render(0);
    };
    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = "all";
      }
      if (!targets && (!vars || vars === "all")) {
        this._lazy = this._pt = 0;
        this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting);
        return this;
      }
      if (this.timeline) {
        var tDur = this.timeline.totalDuration();
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
        this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
        return this;
      }
      var parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
      if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
        vars === "all" && (this._pt = 0);
        return _interrupt(this);
      }
      overwrittenProps = this._op = this._op || [];
      if (vars !== "all") {
        if (_isString(vars)) {
          p = {};
          _forEachName(vars, function(name) {
            return p[name] = 1;
          });
          vars = p;
        }
        vars = _addAliasesToVars(parsedTargets, vars);
      }
      i = parsedTargets.length;
      while (i--) {
        if (~killingTargets.indexOf(parsedTargets[i])) {
          curLookup = propTweenLookup[i];
          if (vars === "all") {
            overwrittenProps[i] = vars;
            props = curLookup;
            curOverwriteProps = {};
          } else {
            curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
            props = vars;
          }
          for (p in props) {
            pt = curLookup && curLookup[p];
            if (pt) {
              if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                _removeLinkedListItem(this, pt, "_pt");
              }
              delete curLookup[p];
            }
            if (curOverwriteProps !== "all") {
              curOverwriteProps[p] = 1;
            }
          }
        }
      }
      this._initted && !this._pt && firstPT && _interrupt(this);
      return this;
    };
    Tween2.to = function to(targets, vars) {
      return new Tween2(targets, vars, arguments[2]);
    };
    Tween2.from = function from(targets, vars) {
      return _createTweenType(1, arguments);
    };
    Tween2.delayedCall = function delayedCall(delay, callback, params2, scope) {
      return new Tween2(callback, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params2,
        onReverseCompleteParams: params2,
        callbackScope: scope
      });
    };
    Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
      return _createTweenType(2, arguments);
    };
    Tween2.set = function set6(targets, vars) {
      vars.duration = 0;
      vars.repeatDelay || (vars.repeat = 0);
      return new Tween2(targets, vars);
    };
    Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive);
    };
    return Tween2;
  }(Animation);
  _setDefaults(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });
  _forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
    Tween[name] = function() {
      var tl = new Timeline(), params2 = _slice.call(arguments, 0);
      params2.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params2);
    };
  });
  var _setterPlain = function _setterPlain2(target, property, value) {
    return target[property] = value;
  };
  var _setterFunc = function _setterFunc2(target, property, value) {
    return target[property](value);
  };
  var _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
    return target[property](data.fp, value);
  };
  var _setterAttribute = function _setterAttribute2(target, property, value) {
    return target.setAttribute(property, value);
  };
  var _getSetter = function _getSetter2(target, property) {
    return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
  };
  var _renderPlain = function _renderPlain2(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
  };
  var _renderBoolean = function _renderBoolean2(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  };
  var _renderComplexString = function _renderComplexString2(ratio, data) {
    var pt = data._pt, s = "";
    if (!ratio && data.b) {
      s = data.b;
    } else if (ratio === 1 && data.e) {
      s = data.e;
    } else {
      while (pt) {
        s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
        pt = pt._next;
      }
      s += data.c;
    }
    data.set(data.t, data.p, s, data);
  };
  var _renderPropTweens = function _renderPropTweens2(ratio, data) {
    var pt = data._pt;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
  };
  var _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
    var pt = this._pt, next;
    while (pt) {
      next = pt._next;
      pt.p === property && pt.modifier(modifier, tween, target);
      pt = next;
    }
  };
  var _killPropTweensOf = function _killPropTweensOf2(property) {
    var pt = this._pt, hasNonDependentRemaining, next;
    while (pt) {
      next = pt._next;
      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, "_pt");
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1;
      }
      pt = next;
    }
    return !hasNonDependentRemaining;
  };
  var _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  };
  var _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
    var pt = parent._pt, next, pt2, first, last;
    while (pt) {
      next = pt._next;
      pt2 = first;
      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next;
      }
      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt;
      } else {
        first = pt;
      }
      if (pt._next = pt2) {
        pt2._prev = pt;
      } else {
        last = pt;
      }
      pt = next;
    }
    parent._pt = first;
  };
  var PropTween = /* @__PURE__ */ function() {
    function PropTween2(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target;
      this.s = start;
      this.c = change;
      this.p = prop;
      this.r = renderer || _renderPlain;
      this.d = data || this;
      this.set = setter || _setterPlain;
      this.pr = priority || 0;
      this._next = next;
      if (next) {
        next._prev = this;
      }
    }
    var _proto4 = PropTween2.prototype;
    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set;
      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target;
      this.tween = tween;
    };
    return PropTween2;
  }();
  _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(name) {
    return _reservedProps[name] = 1;
  });
  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults,
    autoRemoveChildren: true,
    id: "root",
    smoothChildTiming: true
  });
  _config.stringFilter = _colorStringFilter;
  var _media = [];
  var _listeners = {};
  var _emptyArray = [];
  var _lastMediaTime = 0;
  var _contextID = 0;
  var _dispatch = function _dispatch2(type) {
    return (_listeners[type] || _emptyArray).map(function(f) {
      return f();
    });
  };
  var _onMediaChange = function _onMediaChange2() {
    var time = Date.now(), matches2 = [];
    if (time - _lastMediaTime > 2) {
      _dispatch("matchMediaInit");
      _media.forEach(function(c) {
        var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
        for (p in queries) {
          match = _win.matchMedia(queries[p]).matches;
          match && (anyMatch = 1);
          if (match !== conditions[p]) {
            conditions[p] = match;
            toggled = 1;
          }
        }
        if (toggled) {
          c.revert();
          anyMatch && matches2.push(c);
        }
      });
      _dispatch("matchMediaRevert");
      matches2.forEach(function(c) {
        return c.onMatch(c, function(func) {
          return c.add(null, func);
        });
      });
      _lastMediaTime = time;
      _dispatch("matchMedia");
    }
  };
  var Context = /* @__PURE__ */ function() {
    function Context2(func, scope) {
      this.selector = scope && selector(scope);
      this.data = [];
      this._r = [];
      this.isReverted = false;
      this.id = _contextID++;
      func && this.add(func);
    }
    var _proto5 = Context2.prototype;
    _proto5.add = function add4(name, func, scope) {
      if (_isFunction(name)) {
        scope = func;
        func = name;
        name = _isFunction;
      }
      var self = this, f = function f2() {
        var prev = _context, prevSelector = self.selector, result;
        prev && prev !== self && prev.data.push(self);
        scope && (self.selector = selector(scope));
        _context = self;
        result = func.apply(self, arguments);
        _isFunction(result) && self._r.push(result);
        _context = prev;
        self.selector = prevSelector;
        self.isReverted = false;
        return result;
      };
      self.last = f;
      return name === _isFunction ? f(self, function(func2) {
        return self.add(null, func2);
      }) : name ? self[name] = f : f;
    };
    _proto5.ignore = function ignore(func) {
      var prev = _context;
      _context = null;
      func(this);
      _context = prev;
    };
    _proto5.getTweens = function getTweens() {
      var a = [];
      this.data.forEach(function(e) {
        return e instanceof Context2 ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
      });
      return a;
    };
    _proto5.clear = function clear() {
      this._r.length = this.data.length = 0;
    };
    _proto5.kill = function kill(revert, matchMedia2) {
      var _this4 = this;
      if (revert) {
        (function() {
          var tweens = _this4.getTweens(), i2 = _this4.data.length, t;
          while (i2--) {
            t = _this4.data[i2];
            if (t.data === "isFlip") {
              t.revert();
              t.getChildren(true, true, false).forEach(function(tween) {
                return tweens.splice(tweens.indexOf(tween), 1);
              });
            }
          }
          tweens.map(function(t2) {
            return {
              g: t2._dur || t2._delay || t2._sat && !t2._sat.vars.immediateRender ? t2.globalTime(0) : -Infinity,
              t: t2
            };
          }).sort(function(a, b) {
            return b.g - a.g || -Infinity;
          }).forEach(function(o) {
            return o.t.revert(revert);
          });
          i2 = _this4.data.length;
          while (i2--) {
            t = _this4.data[i2];
            if (t instanceof Timeline) {
              if (t.data !== "nested") {
                t.scrollTrigger && t.scrollTrigger.revert();
                t.kill();
              }
            } else {
              !(t instanceof Tween) && t.revert && t.revert(revert);
            }
          }
          _this4._r.forEach(function(f) {
            return f(revert, _this4);
          });
          _this4.isReverted = true;
        })();
      } else {
        this.data.forEach(function(e) {
          return e.kill && e.kill();
        });
      }
      this.clear();
      if (matchMedia2) {
        var i = _media.length;
        while (i--) {
          _media[i].id === this.id && _media.splice(i, 1);
        }
      }
    };
    _proto5.revert = function revert(config3) {
      this.kill(config3 || {});
    };
    return Context2;
  }();
  var MatchMedia = /* @__PURE__ */ function() {
    function MatchMedia2(scope) {
      this.contexts = [];
      this.scope = scope;
      _context && _context.data.push(this);
    }
    var _proto6 = MatchMedia2.prototype;
    _proto6.add = function add4(conditions, func, scope) {
      _isObject(conditions) || (conditions = {
        matches: conditions
      });
      var context3 = new Context(0, scope || this.scope), cond = context3.conditions = {}, mq, p, active;
      _context && !context3.selector && (context3.selector = _context.selector);
      this.contexts.push(context3);
      func = context3.add("onMatch", func);
      context3.queries = conditions;
      for (p in conditions) {
        if (p === "all") {
          active = 1;
        } else {
          mq = _win.matchMedia(conditions[p]);
          if (mq) {
            _media.indexOf(context3) < 0 && _media.push(context3);
            (cond[p] = mq.matches) && (active = 1);
            mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
          }
        }
      }
      active && func(context3, function(f) {
        return context3.add(null, f);
      });
      return this;
    };
    _proto6.revert = function revert(config3) {
      this.kill(config3 || {});
    };
    _proto6.kill = function kill(revert) {
      this.contexts.forEach(function(c) {
        return c.kill(revert, true);
      });
    };
    return MatchMedia2;
  }();
  var _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      args.forEach(function(config3) {
        return _createPlugin(config3);
      });
    },
    timeline: function timeline(vars) {
      return new Timeline(vars);
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive);
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      _isString(target) && (target = toArray(target)[0]);
      var getter = _getCache(target || {}).get, format = unit ? _passThrough : _numericIfPossible;
      unit === "native" && (unit = "");
      return !target ? target : !property ? function(property2, unit2, uncache2) {
        return format((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit2, uncache2));
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray(target);
      if (target.length > 1) {
        var setters = target.map(function(t) {
          return gsap.quickSetter(t, property, unit);
        }), l = setters.length;
        return function(value) {
          var i = l;
          while (i--) {
            setters[i](value);
          }
        };
      }
      target = target[0] || {};
      var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
        var p2 = new Plugin();
        _quickTween._pt = 0;
        p2.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
        p2.render(1, p2);
        _quickTween._pt && _renderPropTweens(1, _quickTween);
      } : cache.set(target, p);
      return Plugin ? setter : function(value) {
        return setter(target, p, unit ? value + unit : value, cache, 1);
      };
    },
    quickTo: function quickTo(target, property, vars) {
      var _setDefaults22;
      var tween = gsap.to(target, _setDefaults((_setDefaults22 = {}, _setDefaults22[property] = "+=0.1", _setDefaults22.paused = true, _setDefaults22.stagger = 0, _setDefaults22), vars || {})), func = function func2(value, start, startIsRelative) {
        return tween.resetTo(property, value, start, startIsRelative);
      };
      func.tween = tween;
      return func;
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, true).length > 0;
    },
    defaults: function defaults(value) {
      value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
      return _mergeDeep(_defaults, value || {});
    },
    config: function config2(value) {
      return _mergeDeep(_config, value || {});
    },
    registerEffect: function registerEffect(_ref3) {
      var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults2 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
      (plugins || "").split(",").forEach(function(pluginName) {
        return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
      });
      _effects[name] = function(targets, vars, tl) {
        return effect(toArray(targets), _setDefaults(vars || {}, defaults2), tl);
      };
      if (extendTimeline) {
        Timeline.prototype[name] = function(targets, vars, position) {
          return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
        };
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease);
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id);
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {};
      }
      var tl = new Timeline(vars), child, next;
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
      _globalTimeline.remove(tl);
      tl._dp = 0;
      tl._time = tl._tTime = _globalTimeline._time;
      child = _globalTimeline._first;
      while (child) {
        next = child._next;
        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay);
        }
        child = next;
      }
      _addToTimeline(_globalTimeline, tl, 0);
      return tl;
    },
    context: function context(func, scope) {
      return func ? new Context(func, scope) : _context;
    },
    matchMedia: function matchMedia(scope) {
      return new MatchMedia(scope);
    },
    matchMediaRefresh: function matchMediaRefresh() {
      return _media.forEach(function(c) {
        var cond = c.conditions, found, p;
        for (p in cond) {
          if (cond[p]) {
            cond[p] = false;
            found = 1;
          }
        }
        found && c.revert();
      }) || _onMediaChange();
    },
    addEventListener: function addEventListener(type, callback) {
      var a = _listeners[type] || (_listeners[type] = []);
      ~a.indexOf(callback) || a.push(callback);
    },
    removeEventListener: function removeEventListener(type, callback) {
      var a = _listeners[type], i = a && a.indexOf(callback);
      i >= 0 && a.splice(i, 1);
    },
    utils: {
      wrap,
      wrapYoyo,
      distribute,
      random,
      snap,
      normalize,
      getUnit,
      clamp,
      splitColor,
      toArray,
      selector,
      mapRange,
      pipe,
      unitize,
      interpolate,
      shuffle
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween,
      globals: _addGlobal,
      Tween,
      Timeline,
      Animation,
      getCache: _getCache,
      _removeLinkedListItem,
      reverting: function reverting() {
        return _reverting;
      },
      context: function context2(toAdd) {
        if (toAdd && _context) {
          _context.data.push(toAdd);
          toAdd._ctx = _context;
        }
        return _context;
      },
      suppressOverwrites: function suppressOverwrites(value) {
        return _suppressOverwrites = value;
      }
    }
  };
  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
    return _gsap[name] = Tween[name];
  });
  _ticker.add(Timeline.updateRoot);
  _quickTween = _gsap.to({}, {
    duration: 0
  });
  var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
    var pt = plugin._pt;
    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next;
    }
    return pt;
  };
  var _addModifiers = function _addModifiers2(tween, modifiers) {
    var targets = tween._targets, p, i, pt;
    for (p in modifiers) {
      i = targets.length;
      while (i--) {
        pt = tween._ptLookup[i][p];
        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            pt = _getPluginPropTween(pt, p);
          }
          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
        }
      }
    }
  };
  var _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
    return {
      name,
      rawVars: 1,
      //don't pre-process function-based values or "random()" strings.
      init: function init4(target, vars, tween) {
        tween._onInit = function(tween2) {
          var temp, p;
          if (_isString(vars)) {
            temp = {};
            _forEachName(vars, function(name2) {
              return temp[name2] = 1;
            });
            vars = temp;
          }
          if (modifier) {
            temp = {};
            for (p in vars) {
              temp[p] = modifier(vars[p]);
            }
            vars = temp;
          }
          _addModifiers(tween2, vars);
        };
      }
    };
  };
  var gsap = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      var p, pt, v;
      this.tween = tween;
      for (p in vars) {
        v = target.getAttribute(p) || "";
        pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
        pt.op = p;
        pt.b = v;
        this._props.push(p);
      }
    },
    render: function render(ratio, data) {
      var pt = data._pt;
      while (pt) {
        _reverting ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
        pt = pt._next;
      }
    }
  }, {
    name: "endArray",
    init: function init2(target, value) {
      var i = value.length;
      while (i--) {
        this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
  Tween.version = Timeline.version = gsap.version = "3.12.7";
  _coreReady = 1;
  _windowExists() && _wake();
  var Power0 = _easeMap.Power0;
  var Power1 = _easeMap.Power1;
  var Power2 = _easeMap.Power2;
  var Power3 = _easeMap.Power3;
  var Power4 = _easeMap.Power4;
  var Linear = _easeMap.Linear;
  var Quad = _easeMap.Quad;
  var Cubic = _easeMap.Cubic;
  var Quart = _easeMap.Quart;
  var Quint = _easeMap.Quint;
  var Strong = _easeMap.Strong;
  var Elastic = _easeMap.Elastic;
  var Back = _easeMap.Back;
  var SteppedEase = _easeMap.SteppedEase;
  var Bounce = _easeMap.Bounce;
  var Sine = _easeMap.Sine;
  var Expo = _easeMap.Expo;
  var Circ = _easeMap.Circ;

  // node_modules/.pnpm/gsap@3.12.7/node_modules/gsap/CSSPlugin.js
  var _win2;
  var _doc2;
  var _docElement;
  var _pluginInitted;
  var _tempDiv;
  var _tempDivStyler;
  var _recentSetterPlugin;
  var _reverting2;
  var _windowExists3 = function _windowExists4() {
    return typeof window !== "undefined";
  };
  var _transformProps = {};
  var _RAD2DEG = 180 / Math.PI;
  var _DEG2RAD = Math.PI / 180;
  var _atan2 = Math.atan2;
  var _bigNum2 = 1e8;
  var _capsExp = /([A-Z])/g;
  var _horizontalExp = /(left|right|width|margin|padding|x)/i;
  var _complexExp = /[\s,\(]\S/;
  var _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  };
  var _renderCSSProp = function _renderCSSProp2(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
  };
  var _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
  };
  var _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
    return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
  };
  var _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
  };
  var _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  };
  var _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  };
  var _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
    return target.style[property] = value;
  };
  var _setterCSSProp = function _setterCSSProp2(target, property, value) {
    return target.style.setProperty(property, value);
  };
  var _setterTransform = function _setterTransform2(target, property, value) {
    return target._gsap[property] = value;
  };
  var _setterScale = function _setterScale2(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value;
  };
  var _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  };
  var _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  };
  var _transformProp = "transform";
  var _transformOriginProp = _transformProp + "Origin";
  var _saveStyle = function _saveStyle2(property, isNotCSS) {
    var _this = this;
    var target = this.target, style = target.style, cache = target._gsap;
    if (property in _transformProps && style) {
      this.tfm = this.tfm || {};
      if (property !== "transform") {
        property = _propertyAliases[property] || property;
        ~property.indexOf(",") ? property.split(",").forEach(function(a) {
          return _this.tfm[a] = _get(target, a);
        }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property);
        property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
      } else {
        return _propertyAliases.transform.split(",").forEach(function(p) {
          return _saveStyle2.call(_this, p, isNotCSS);
        });
      }
      if (this.props.indexOf(_transformProp) >= 0) {
        return;
      }
      if (cache.svg) {
        this.svgo = target.getAttribute("data-svg-origin");
        this.props.push(_transformOriginProp, isNotCSS, "");
      }
      property = _transformProp;
    }
    (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
  };
  var _removeIndependentTransforms = function _removeIndependentTransforms2(style) {
    if (style.translate) {
      style.removeProperty("translate");
      style.removeProperty("scale");
      style.removeProperty("rotate");
    }
  };
  var _revertStyle = function _revertStyle2() {
    var props = this.props, target = this.target, style = target.style, cache = target._gsap, i, p;
    for (i = 0; i < props.length; i += 3) {
      if (!props[i + 1]) {
        props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
      } else if (props[i + 1] === 2) {
        target[props[i]](props[i + 2]);
      } else {
        target[props[i]] = props[i + 2];
      }
    }
    if (this.tfm) {
      for (p in this.tfm) {
        cache[p] = this.tfm[p];
      }
      if (cache.svg) {
        cache.renderTransform();
        target.setAttribute("data-svg-origin", this.svgo || "");
      }
      i = _reverting2();
      if ((!i || !i.isStart) && !style[_transformProp]) {
        _removeIndependentTransforms(style);
        if (cache.zOrigin && style[_transformOriginProp]) {
          style[_transformOriginProp] += " " + cache.zOrigin + "px";
          cache.zOrigin = 0;
          cache.renderTransform();
        }
        cache.uncache = 1;
      }
    }
  };
  var _getStyleSaver = function _getStyleSaver2(target, properties) {
    var saver = {
      target,
      props: [],
      revert: _revertStyle,
      save: _saveStyle
    };
    target._gsap || gsap.core.getCache(target);
    properties && target.style && target.nodeType && properties.split(",").forEach(function(p) {
      return saver.save(p);
    });
    return saver;
  };
  var _supports3D;
  var _createElement = function _createElement2(type, ns) {
    var e = _doc2.createElementNS ? _doc2.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc2.createElement(type);
    return e && e.style ? e : _doc2.createElement(type);
  };
  var _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
    var cs = getComputedStyle(target);
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
  };
  var _prefixes = "O,Moz,ms,Ms,Webkit".split(",");
  var _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
    var e = element || _tempDiv, s = e.style, i = 5;
    if (property in s && !preferPrefix) {
      return property;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    while (i-- && !(_prefixes[i] + property in s)) {
    }
    return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
  };
  var _initCore = function _initCore2() {
    if (_windowExists3() && window.document) {
      _win2 = window;
      _doc2 = _win2.document;
      _docElement = _doc2.documentElement;
      _tempDiv = _createElement("div") || {
        style: {}
      };
      _tempDivStyler = _createElement("div");
      _transformProp = _checkPropPrefix(_transformProp);
      _transformOriginProp = _transformProp + "Origin";
      _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
      _supports3D = !!_checkPropPrefix("perspective");
      _reverting2 = gsap.core.reverting;
      _pluginInitted = 1;
    }
  };
  var _getReparentedCloneBBox = function _getReparentedCloneBBox2(target) {
    var owner = target.ownerSVGElement, svg = _createElement("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), clone2 = target.cloneNode(true), bbox;
    clone2.style.display = "block";
    svg.appendChild(clone2);
    _docElement.appendChild(svg);
    try {
      bbox = clone2.getBBox();
    } catch (e) {
    }
    svg.removeChild(clone2);
    _docElement.removeChild(svg);
    return bbox;
  };
  var _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
    var i = attributesArray.length;
    while (i--) {
      if (target.hasAttribute(attributesArray[i])) {
        return target.getAttribute(attributesArray[i]);
      }
    }
  };
  var _getBBox = function _getBBox2(target) {
    var bounds, cloned;
    try {
      bounds = target.getBBox();
    } catch (error) {
      bounds = _getReparentedCloneBBox(target);
      cloned = 1;
    }
    bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target));
    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
      y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
      width: 0,
      height: 0
    } : bounds;
  };
  var _isSVG = function _isSVG2(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
  };
  var _removeProperty = function _removeProperty2(target, property) {
    if (property) {
      var style = target.style, first2Chars;
      if (property in _transformProps && property !== _transformOriginProp) {
        property = _transformProp;
      }
      if (style.removeProperty) {
        first2Chars = property.substr(0, 2);
        if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
          property = "-" + property;
        }
        style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        style.removeAttribute(property);
      }
    }
  };
  var _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
    var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
    plugin._pt = pt;
    pt.b = beginning;
    pt.e = end;
    plugin._props.push(property);
    return pt;
  };
  var _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1
  };
  var _nonStandardLayouts = {
    grid: 1,
    flex: 1
  };
  var _convertToUnit = function _convertToUnit2(target, property, value, unit) {
    var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent, cache, isSVG;
    if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue;
    }
    curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
    isSVG = target.getCTM && _isSVG(target);
    if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
      px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
      return _round(toPercent ? curValue / px * amount : curValue / 100 * px);
    }
    style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
    parent = unit !== "rem" && ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }
    if (!parent || parent === _doc2 || !parent.appendChild) {
      parent = _doc2.body;
    }
    cache = parent._gsap;
    if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) {
      return _round(curValue / cache.width * amount);
    } else {
      if (toPercent && (property === "height" || property === "width")) {
        var v = target.style[property];
        target.style[property] = amount + unit;
        px = target[measureProperty];
        v ? target.style[property] = v : _removeProperty(target, property);
      } else {
        (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
        parent === target && (style.position = "static");
        parent.appendChild(_tempDiv);
        px = _tempDiv[measureProperty];
        parent.removeChild(_tempDiv);
        style.position = "absolute";
      }
      if (horizontal && toPercent) {
        cache = _getCache(parent);
        cache.time = _ticker.time;
        cache.width = parent[measureProperty];
      }
    }
    return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
  };
  var _get = function _get2(target, property, unit, uncache) {
    var value;
    _pluginInitted || _initCore();
    if (property in _propertyAliases && property !== "transform") {
      property = _propertyAliases[property];
      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }
    if (_transformProps[property] && property !== "transform") {
      value = _parseTransform(target, uncache);
      value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
    } else {
      value = target.style[property];
      if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
        value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
      }
    }
    return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
  };
  var _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop, start, end) {
    if (!start || start === "none") {
      var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
      if (s && s !== start) {
        prop = p;
        start = s;
      } else if (prop === "borderColor") {
        start = _getComputedProperty(target, "borderTopColor");
      }
    }
    var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";
    if (end === "auto") {
      startValue = target.style[prop];
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
    }
    a = [start, end];
    _colorStringFilter(a);
    start = a[0];
    end = a[1];
    startValues = start.match(_numWithUnitExp) || [];
    endValues = end.match(_numWithUnitExp) || [];
    if (endValues.length) {
      while (result = _numWithUnitExp.exec(end)) {
        endValue = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
          color = 1;
        }
        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _numWithUnitExp.lastIndex - endUnit.length;
          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit;
            if (index === end.length) {
              end += endUnit;
              pt.e += endUnit;
            }
          }
          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          }
          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            s: startNum,
            c: endNum - startNum,
            m: color && color < 4 || prop === "zIndex" ? Math.round : 0
          };
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : "";
    } else {
      pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
    }
    _relExp.test(end) && (pt.e = 0);
    this._pt = pt;
    return pt;
  };
  var _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  };
  var _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
    var split = value.split(" "), x = split[0], y = split[1] || "50%";
    if (x === "top" || x === "bottom" || y === "left" || y === "right") {
      value = x;
      x = y;
      y = value;
    }
    split[0] = _keywordToPercent[x] || x;
    split[1] = _keywordToPercent[y] || y;
    return split.join(" ");
  };
  var _renderClearProps = function _renderClearProps2(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t, style = target.style, props = data.u, cache = target._gsap, prop, clearTransforms, i;
      if (props === "all" || props === true) {
        style.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i = props.length;
        while (--i > -1) {
          prop = props[i];
          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
          }
          _removeProperty(target, prop);
        }
      }
      if (clearTransforms) {
        _removeProperty(target, _transformProp);
        if (cache) {
          cache.svg && target.removeAttribute("transform");
          style.scale = style.rotate = style.translate = "none";
          _parseTransform(target, 1);
          cache.uncache = 1;
          _removeIndependentTransforms(style);
        }
      }
    }
  };
  var _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
        pt.u = endValue;
        pt.pr = -10;
        pt.tween = tween;
        plugin._props.push(property);
        return 1;
      }
    }
    /* className feature (about 0.4kb gzipped).
    , className(plugin, target, property, endValue, tween) {
    	let _renderClassName = (ratio, data) => {
    			data.css.render(ratio, data.css);
    			if (!ratio || ratio === 1) {
    				let inline = data.rmv,
    					target = data.t,
    					p;
    				target.setAttribute("class", ratio ? data.e : data.b);
    				for (p in inline) {
    					_removeProperty(target, p);
    				}
    			}
    		},
    		_getAllStyles = (target) => {
    			let styles = {},
    				computed = getComputedStyle(target),
    				p;
    			for (p in computed) {
    				if (isNaN(p) && p !== "cssText" && p !== "length") {
    					styles[p] = computed[p];
    				}
    			}
    			_setDefaults(styles, _parseTransform(target, 1));
    			return styles;
    		},
    		startClassList = target.getAttribute("class"),
    		style = target.style,
    		cssText = style.cssText,
    		cache = target._gsap,
    		classPT = cache.classPT,
    		inlineToRemoveAtEnd = {},
    		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
    		changingVars = {},
    		startVars = _getAllStyles(target),
    		transformRelated = /(transform|perspective)/i,
    		endVars, p;
    	if (classPT) {
    		classPT.r(1, classPT.d);
    		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
    	}
    	target.setAttribute("class", data.e);
    	endVars = _getAllStyles(target, true);
    	target.setAttribute("class", startClassList);
    	for (p in endVars) {
    		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
    			changingVars[p] = endVars[p];
    			if (!style[p] && style[p] !== "0") {
    				inlineToRemoveAtEnd[p] = 1;
    			}
    		}
    	}
    	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
    	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
    		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
    	}
    	_parseTransform(target, true); //to clear the caching of transforms
    	data.css = new gsap.plugins.css();
    	data.css.init(target, changingVars, tween);
    	plugin._props.push(...data.css._props);
    	return 1;
    }
    */
  };
  var _identity2DMatrix = [1, 0, 0, 1, 0, 0];
  var _rotationalProperties = {};
  var _isNullTransform = function _isNullTransform2(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  };
  var _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
    var matrixString = _getComputedProperty(target, _transformProp);
    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
  };
  var _getMatrix = function _getMatrix2(target, force2D) {
    var cache = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix;
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
      temp = style.display;
      style.display = "block";
      parent = target.parentNode;
      if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
        addedToDOM = 1;
        nextSibling = target.nextElementSibling;
        _docElement.appendChild(target);
      }
      matrix = _getComputedTransformMatrixAsArray(target);
      temp ? style.display = temp : _removeProperty(target, "display");
      if (addedToDOM) {
        nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
      }
    }
    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
  };
  var _applySVGOrigin = function _applySVGOrigin2(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    var cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant2, x, y;
    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
    } else if (matrix !== _identity2DMatrix && (determinant2 = a * d - b * c)) {
      x = xOrigin * (d / determinant2) + yOrigin * (-c / determinant2) + (c * ty - d * tx) / determinant2;
      y = xOrigin * (-b / determinant2) + yOrigin * (a / determinant2) - (a * ty - b * tx) / determinant2;
      xOrigin = x;
      yOrigin = y;
    }
    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }
    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp] = "0px 0px";
    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
    }
    target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
  };
  var _parseTransform = function _parseTransform2(target, uncache) {
    var cache = target._gsap || new GSCache(target);
    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }
    var style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective2, xOrigin, yOrigin, matrix, angle2, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective2 = 0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    if (cs.translate) {
      if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
        style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
      }
      style.scale = style.rotate = style.translate = "none";
    }
    matrix = _getMatrix(target, cache.svg);
    if (cache.svg) {
      if (cache.uncache) {
        t2 = target.getBBox();
        origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
        t1 = "";
      } else {
        t1 = !uncache && target.getAttribute("data-svg-origin");
      }
      _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
    }
    xOrigin = cache.xOrigin || 0;
    yOrigin = cache.yOrigin || 0;
    if (matrix !== _identity2DMatrix) {
      a = matrix[0];
      b = matrix[1];
      c = matrix[2];
      d = matrix[3];
      x = a12 = matrix[4];
      y = a22 = matrix[5];
      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b);
        scaleY = Math.sqrt(d * d + c * c);
        rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
        skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
        skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c);
          y -= yOrigin - (xOrigin * b + yOrigin * d);
        }
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x = matrix[12];
        y = matrix[13];
        z = matrix[14];
        angle2 = _atan2(a32, a33);
        rotationX = angle2 * _RAD2DEG;
        if (angle2) {
          cos = Math.cos(-angle2);
          sin = Math.sin(-angle2);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        }
        angle2 = _atan2(-c, a33);
        rotationY = angle2 * _RAD2DEG;
        if (angle2) {
          cos = Math.cos(-angle2);
          sin = Math.sin(-angle2);
          t1 = a * cos - a13 * sin;
          t2 = b * cos - a23 * sin;
          t3 = c * cos - a33 * sin;
          a43 = d * sin + a43 * cos;
          a = t1;
          b = t2;
          c = t3;
        }
        angle2 = _atan2(b, a);
        rotation = angle2 * _RAD2DEG;
        if (angle2) {
          cos = Math.cos(angle2);
          sin = Math.sin(angle2);
          t1 = a * cos + b * sin;
          t2 = a12 * cos + a22 * sin;
          b = b * cos - a * sin;
          a22 = a22 * cos - a12 * sin;
          a = t1;
          a12 = t2;
        }
        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }
        scaleX = _round(Math.sqrt(a * a + b * b + c * c));
        scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
        angle2 = _atan2(a12, a22);
        skewX = Math.abs(angle2) > 2e-4 ? angle2 * _RAD2DEG : 0;
        perspective2 = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }
      if (cache.svg) {
        t1 = target.getAttribute("transform");
        cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
        t1 && target.setAttribute("transform", t1);
      }
    }
    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }
    uncache = uncache || cache.uncache;
    cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
    cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
    cache.z = z + px;
    cache.scaleX = _round(scaleX);
    cache.scaleY = _round(scaleY);
    cache.rotation = _round(rotation) + deg;
    cache.rotationX = _round(rotationX) + deg;
    cache.rotationY = _round(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective2 + px;
    if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
      style[_transformOriginProp] = _firstTwoOnly(origin);
    }
    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _config.force3D;
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  };
  var _firstTwoOnly = function _firstTwoOnly2(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  };
  var _addPxTranslate = function _addPxTranslate2(target, start, value) {
    var unit = getUnit(start);
    return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
  };
  var _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;
    _renderCSSTransforms(ratio, cache);
  };
  var _zeroDeg = "0deg";
  var _zeroPx = "0px";
  var _endParenthesis = ") ";
  var _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache) {
    var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle2 = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle2), a33 = Math.cos(angle2), cos;
      angle2 = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle2);
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
      y = _addPxTranslate(target, y, -Math.sin(angle2) * -zOrigin);
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
    }
    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }
    if (xPercent || yPercent) {
      transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
    }
    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
    }
    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }
    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }
    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }
    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }
    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }
    target.style[_transformProp] = transforms || "translate(0, 0)";
  };
  var _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache) {
    var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);
    if (skewY) {
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }
    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;
      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;
        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }
      a11 = _round(a11);
      a21 = _round(a21);
      a12 = _round(a12);
      a22 = _round(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }
    if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
      tx = _convertToUnit(target, "x", x, "px");
      ty = _convertToUnit(target, "y", y, "px");
    }
    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }
    if (xPercent || yPercent) {
      temp = target.getBBox();
      tx = _round(tx + xPercent / 100 * temp.width);
      ty = _round(ty + yPercent / 100 * temp.height);
    }
    temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
    target.setAttribute("transform", temp);
    forceCSS && (target.style[_transformProp] = temp);
  };
  var _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
    var cap = 360, isString2 = _isString(endValue), endNum = parseFloat(endValue) * (isString2 && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
    if (isString2) {
      direction = endValue.split("_")[1];
      if (direction === "short") {
        change %= cap;
        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }
      if (direction === "cw" && change < 0) {
        change = (change + cap * _bigNum2) % cap - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = (change - cap * _bigNum2) % cap - ~~(change / cap) * cap;
      }
    }
    plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
    pt.e = finalValue;
    pt.u = "deg";
    plugin._props.push(property);
    return pt;
  };
  var _assign = function _assign2(target, source) {
    for (var p in source) {
      target[p] = source[p];
    }
    return target;
  };
  var _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
    var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
    if (startCache.svg) {
      startValue = target.getAttribute("transform");
      target.setAttribute("transform", "");
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      _removeProperty(target, _transformProp);
      target.setAttribute("transform", startValue);
    } else {
      startValue = getComputedStyle(target)[_transformProp];
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      style[_transformProp] = startValue;
    }
    for (p in _transformProps) {
      startValue = startCache[p];
      endValue = endCache[p];
      if (startValue !== endValue && exclude.indexOf(p) < 0) {
        startUnit = getUnit(startValue);
        endUnit = getUnit(endValue);
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
        plugin._pt.u = endUnit || 0;
        plugin._props.push(p);
      }
    }
    _assign(endCache, startCache);
  };
  _forEachName("padding,margin,Width,Radius", function(name, index) {
    var t = "Top", r = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function(side) {
      return index < 2 ? name + side : "border" + side + name;
    });
    _specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
      var a, vars;
      if (arguments.length < 4) {
        a = props.map(function(prop) {
          return _get(plugin, prop, property);
        });
        vars = a.join(" ");
        return vars.split(a[0]).length === 5 ? a[0] : vars;
      }
      a = (endValue + "").split(" ");
      vars = {};
      props.forEach(function(prop, i) {
        return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
      });
      plugin.init(target, vars, tween);
    };
  });
  var CSSPlugin = {
    name: "css",
    register: _initCore,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType;
    },
    init: function init3(target, vars, tween, index, targets) {
      var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps;
      _pluginInitted || _initCore();
      this.styles = this.styles || _getStyleSaver(target);
      inlineProps = this.styles.props;
      this.tween = tween;
      for (p in vars) {
        if (p === "autoRound") {
          continue;
        }
        endValue = vars[p];
        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue;
        }
        type = typeof endValue;
        specialProp = _specialProps[p];
        if (type === "function") {
          endValue = endValue.call(tween, index, target, targets);
          type = typeof endValue;
        }
        if (type === "string" && ~endValue.indexOf("random(")) {
          endValue = _replaceRandom(endValue);
        }
        if (specialProp) {
          specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
        } else if (p.substr(0, 2) === "--") {
          startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
          endValue += "";
          _colorExp.lastIndex = 0;
          if (!_colorExp.test(startValue)) {
            startUnit = getUnit(startValue);
            endUnit = getUnit(endValue);
          }
          endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
          this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
          props.push(p);
          inlineProps.push(p, 0, style[p]);
        } else if (type !== "undefined") {
          if (startAt && p in startAt) {
            startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
            _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
            getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
            (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
          } else {
            startValue = _get(target, p);
          }
          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
          relative && (endValue = endValue.substr(2));
          endNum = parseFloat(endValue);
          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                startNum = 0;
              }
              inlineProps.push("visibility", 0, style.visibility);
              _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
            }
            if (p !== "scale" && p !== "transform") {
              p = _propertyAliases[p];
              ~p.indexOf(",") && (p = p.split(",")[0]);
            }
          }
          isTransformRelated = p in _transformProps;
          if (isTransformRelated) {
            this.styles.save(p);
            if (!transformPropTween) {
              cache = target._gsap;
              cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
              smooth = vars.smoothOrigin !== false && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
              transformPropTween.dep = 1;
            }
            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
              this._pt.u = 0;
              props.push("scaleY", p);
              p += "X";
            } else if (p === "transformOrigin") {
              inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
              endValue = _convertKeywordsToPercentages(endValue);
              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this);
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
              }
              continue;
            } else if (p === "svgOrigin") {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this);
              continue;
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
              continue;
            } else if (p === "smoothOrigin") {
              _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
              continue;
            } else if (p === "force3D") {
              cache[p] = endValue;
              continue;
            } else if (p === "transform") {
              _addRawTransformPTs(this, endValue, target);
              continue;
            }
          } else if (!(p in style)) {
            p = _checkPropPrefix(p) || p;
          }
          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
            startUnit = (startValue + "").substr((startNum + "").length);
            endNum || (endNum = 0);
            endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
            startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;
            if (startUnit !== endUnit && endUnit !== "%") {
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning;
            }
          } else if (!(p in style)) {
            if (p in target) {
              this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
            } else if (p !== "parseTransform") {
              _missingPlugin(p, endValue);
              continue;
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
          }
          isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : typeof target[p] === "function" ? inlineProps.push(p, 2, target[p]()) : inlineProps.push(p, 1, startValue || target[p]));
          props.push(p);
        }
      }
      hasPriority && _sortPropTweensByPriority(this);
    },
    render: function render2(ratio, data) {
      if (data.tween._time || !_reverting2()) {
        var pt = data._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
      } else {
        data.styles.revert();
      }
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      var p = _propertyAliases[property];
      p && p.indexOf(",") < 0 && (property = p);
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
    },
    core: {
      _removeProperty,
      _getMatrix
    }
  };
  gsap.utils.checkPrefix = _checkPropPrefix;
  gsap.core.getStyleSaver = _getStyleSaver;
  (function(positionAndScale, rotation, others, aliases) {
    var all = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
      _transformProps[name] = 1;
    });
    _forEachName(rotation, function(name) {
      _config.units[name] = "deg";
      _rotationalProperties[name] = 1;
    });
    _propertyAliases[all[13]] = positionAndScale + "," + rotation;
    _forEachName(aliases, function(name) {
      var split = name.split(":");
      _propertyAliases[split[1]] = all[split[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
  _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
    _config.units[name] = "px";
  });
  gsap.registerPlugin(CSSPlugin);

  // node_modules/.pnpm/gsap@3.12.7/node_modules/gsap/index.js
  var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;
  var TweenMaxWithCSS = gsapWithCSS.core.Tween;

  // src/gsap.js
  var ANIMATION = {
    page: {
      duration: 1.2,
      ease: "expo.out"
    },
    load: {
      duration: 0.6,
      ease: "linear",
      delay: 0.5
    }
  };
  var def = {
    duration: 1,
    ease: "expo.out"
  };
  gsapWithCSS.defaults(def);
  var gsap_default = gsapWithCSS;

  // src/util/observe.js
  var Observe = class {
    /**
     * Creates an instance of Observe.
     * @param {Object} options - The options object.
     * @param {HTMLElement} options.element - The element to observe.
     * @param {Object} [options.config] - The IntersectionObserver configuration options.
     * @param {HTMLElement} [options.config.root=null] - The element that is used as the viewport for checking visibility of the target.
     * @param {string} [options.config.margin='10px'] - Margin around the root element.
     * @param {number} [options.config.threshold=0] - A threshold of 0.0 means that the target will be visible when it intersects with the root element.
     * @param {boolean} [options.config.autoStart=false] - Whether to start observing the element automatically.
     * @param {string} [options.addClass] - The CSS class to add to the element when it is in view.
     * @param {Object} [options.cb] - The callback functions to execute when the element is in or out of view.
     * @param {Function} [options.cb.in] - The function to execute when the element is in view.
     * @param {Function} [options.cb.out] - The function to execute when the element is out of view.
     */
    constructor(element, { config: config3, addClass, cb } = {}) {
      this.element = element;
      this.config = {
        root: null,
        margin: "10px",
        threshold: 0,
        autoStart: false,
        ...config3
      };
      if (cb) this.cb = cb;
      if (addClass !== void 0) this.addClass = addClass;
      this.init();
      if (this.config.autoStart) this.start();
    }
    init() {
      this.in = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.isIn();
            }
          });
        },
        {
          root: this.config.root,
          rootMargin: this.config.margin,
          threshold: this.config.threshold
        }
      );
      this.out = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              this.isOut();
            }
          });
        },
        {
          root: this.config.root,
          rootMargin: "0px",
          threshold: 0
        }
      );
    }
    start() {
      this.in.observe(this.element);
      this.out.observe(this.element);
    }
    stop() {
      this.in.unobserve(this.element);
      this.out.unobserve(this.element);
    }
    isIn() {
      if (this.cb?.in) this.cb.in();
      if (this.addClass) this.element.classList.add(this.addClass);
    }
    isOut() {
      if (this.cb?.out) this.cb.out();
      if (this.addClass) this.element.classList.remove(this.addClass);
    }
  };

  // src/modules/nav.js
  var Nav = class {
    wrapper = document.querySelector("[data-nav='w']");
    links = [...document.querySelectorAll("[data-nav='link']")];
    anchor = [...document.querySelectorAll("[data-nav='anchor']")];
    anchorTarget = document.querySelector("[data-s='news']");
    logolink = document.querySelector("[data-nav='logo']");
    shouldScrollToAnchor = false;
    isTop = true;
    constructor() {
      this.input = this.wrapper.querySelector("input");
      hey_default.on("PAGE", (page) => this.handleColor(page));
      hey_default.on("LOAD", (state) => this.onLoad(state));
      this.handleColor(hey_default.PAGE);
      queueMicrotask(() => {
        App.scroll.subscribe(this.onScroll);
        this.anchor.forEach((anchor) => {
          anchor.onclick = () => this.handleAnchorClick();
        });
      });
    }
    onScroll = (e) => {
      if (e.progress < 0.01) {
        if (!this.isTop) {
          this.isTop = true;
          this.wrapper.classList.remove("scrolled");
        }
      } else {
        if (this.isTop) {
          this.isTop = false;
          this.wrapper.classList.add("scrolled");
        }
      }
    };
    onLoad(state) {
      switch (state) {
        case "screen":
          gsap_default.to(this.wrapper, {
            autoAlpha: 1,
            duration: ANIMATION.load.duration,
            ease: ANIMATION.load.ease,
            delay: ANIMATION.load.delay
          });
          break;
        default:
          break;
      }
    }
    handleAnchorClick() {
      if (hey_default.PAGE === "home") {
        this.input.checked = false;
        App.scroll.scrollTo(this.anchorTarget, {
          offset: -50
        });
        this.anchor.forEach((anchor) => {
          anchor.classList.add("w--current");
        });
      } else {
        this.anchor[0].querySelector("a").click();
        this.shouldScrollToAnchor = true;
      }
    }
    createNewsHomeObserver() {
      if (this.observe) {
        this.observe.stop();
        this.observe = null;
      }
      const el = document.querySelector("[data-s='news']");
      if (!el) return;
      this.observe = new Observe(el, {
        config: {
          autoStart: true
        },
        cb: {
          in: () => {
            this.anchor.forEach((anchor) => {
              anchor.classList.add("w--current");
            });
            this.links[0].classList.remove("w--current");
            this.links[2].classList.remove("w--current");
          },
          out: () => {
            this.anchor.forEach((anchor) => {
              anchor.classList.remove("w--current");
            });
            this.links[0].classList.add("w--current");
            this.links[2].classList.add("w--current");
          }
        }
      });
    }
    handleColor(page) {
      this.input.checked = false;
      this.createNewsHomeObserver();
      if (page === "home") {
        this.links[0].href = this.links[0].href + "#top";
        this.links[2].href = this.links[2].href + "#top";
        this.logolink.href = this.logolink.href + "#top";
      } else {
        this.links[0].href = this.links[0].href.replace("#top", "");
        this.links[2].href = this.links[2].href.replace("#top", "");
        this.logolink.href = this.logolink.href.replace("#top", "");
      }
      const footerLink = document.querySelector("[data-ftlink='anchor']");
      const newsLink = document.querySelector("[data-nslink='anchor']");
      footerLink.onclick = () => this.handleAnchorClick();
      if (newsLink) newsLink.onclick = () => this.handleAnchorClick();
      this.anchorTarget = document.querySelector("[data-s='news']");
      if (this.shouldScrollToAnchor) {
        setTimeout(
          () => App.scroll.scrollTo(this.anchorTarget, {
            duration: 2.2,
            offset: -50
            // immediate: true,
          }),
          300
        );
        this.shouldScrollToAnchor = false;
      }
      if (page === "news") {
        this.anchor.forEach((anchor) => {
          anchor.classList.add("w--current");
        });
      } else {
        this.anchor.forEach((anchor) => {
          anchor.classList.remove("w--current");
        });
      }
      this.links.forEach((link) => {
        let pathName = new URL(link.href).pathname;
        if (pathName === "/") pathName = "/home";
        if (pathName === "/" + page) {
          link.classList.add("w--current");
        } else {
          link.classList.remove("w--current");
        }
      });
      if (page !== "home") {
        this.wrapper.classList.add("dark");
      } else {
        this.wrapper.classList.remove("dark");
      }
    }
  };

  // node_modules/.pnpm/embla-carousel@8.5.2/node_modules/embla-carousel/esm/embla-carousel.esm.js
  function isNumber(subject) {
    return typeof subject === "number";
  }
  function isString(subject) {
    return typeof subject === "string";
  }
  function isBoolean(subject) {
    return typeof subject === "boolean";
  }
  function isObject(subject) {
    return Object.prototype.toString.call(subject) === "[object Object]";
  }
  function mathAbs(n) {
    return Math.abs(n);
  }
  function mathSign(n) {
    return Math.sign(n);
  }
  function deltaAbs(valueB, valueA) {
    return mathAbs(valueB - valueA);
  }
  function factorAbs(valueB, valueA) {
    if (valueB === 0 || valueA === 0) return 0;
    if (mathAbs(valueB) <= mathAbs(valueA)) return 0;
    const diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
    return mathAbs(diff / valueB);
  }
  function roundToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
  }
  function arrayKeys(array) {
    return objectKeys(array).map(Number);
  }
  function arrayLast(array) {
    return array[arrayLastIndex(array)];
  }
  function arrayLastIndex(array) {
    return Math.max(0, array.length - 1);
  }
  function arrayIsLastIndex(array, index) {
    return index === arrayLastIndex(array);
  }
  function arrayFromNumber(n, startAt = 0) {
    return Array.from(Array(n), (_, i) => startAt + i);
  }
  function objectKeys(object) {
    return Object.keys(object);
  }
  function objectsMergeDeep(objectA, objectB) {
    return [objectA, objectB].reduce((mergedObjects, currentObject) => {
      objectKeys(currentObject).forEach((key) => {
        const valueA = mergedObjects[key];
        const valueB = currentObject[key];
        const areObjects = isObject(valueA) && isObject(valueB);
        mergedObjects[key] = areObjects ? objectsMergeDeep(valueA, valueB) : valueB;
      });
      return mergedObjects;
    }, {});
  }
  function isMouseEvent(evt, ownerWindow) {
    return typeof ownerWindow.MouseEvent !== "undefined" && evt instanceof ownerWindow.MouseEvent;
  }
  function Alignment(align, viewSize) {
    const predefined = {
      start,
      center,
      end
    };
    function start() {
      return 0;
    }
    function center(n) {
      return end(n) / 2;
    }
    function end(n) {
      return viewSize - n;
    }
    function measure(n, index) {
      if (isString(align)) return predefined[align](n);
      return align(viewSize, n, index);
    }
    const self = {
      measure
    };
    return self;
  }
  function EventStore() {
    let listeners2 = [];
    function add4(node, type, handler, options = {
      passive: true
    }) {
      let removeListener;
      if ("addEventListener" in node) {
        node.addEventListener(type, handler, options);
        removeListener = () => node.removeEventListener(type, handler, options);
      } else {
        const legacyMediaQueryList = node;
        legacyMediaQueryList.addListener(handler);
        removeListener = () => legacyMediaQueryList.removeListener(handler);
      }
      listeners2.push(removeListener);
      return self;
    }
    function clear() {
      listeners2 = listeners2.filter((remove) => remove());
    }
    const self = {
      add: add4,
      clear
    };
    return self;
  }
  function Animations(ownerDocument, ownerWindow, update, render3) {
    const documentVisibleHandler = EventStore();
    const fixedTimeStep = 1e3 / 60;
    let lastTimeStamp = null;
    let accumulatedTime = 0;
    let animationId = 0;
    function init4() {
      documentVisibleHandler.add(ownerDocument, "visibilitychange", () => {
        if (ownerDocument.hidden) reset();
      });
    }
    function destroy() {
      stop();
      documentVisibleHandler.clear();
    }
    function animate(timeStamp) {
      if (!animationId) return;
      if (!lastTimeStamp) {
        lastTimeStamp = timeStamp;
        update();
        update();
      }
      const timeElapsed = timeStamp - lastTimeStamp;
      lastTimeStamp = timeStamp;
      accumulatedTime += timeElapsed;
      while (accumulatedTime >= fixedTimeStep) {
        update();
        accumulatedTime -= fixedTimeStep;
      }
      const alpha = accumulatedTime / fixedTimeStep;
      render3(alpha);
      if (animationId) {
        animationId = ownerWindow.requestAnimationFrame(animate);
      }
    }
    function start() {
      if (animationId) return;
      animationId = ownerWindow.requestAnimationFrame(animate);
    }
    function stop() {
      ownerWindow.cancelAnimationFrame(animationId);
      lastTimeStamp = null;
      accumulatedTime = 0;
      animationId = 0;
    }
    function reset() {
      lastTimeStamp = null;
      accumulatedTime = 0;
    }
    const self = {
      init: init4,
      destroy,
      start,
      stop,
      update,
      render: render3
    };
    return self;
  }
  function Axis(axis, contentDirection) {
    const isRightToLeft = contentDirection === "rtl";
    const isVertical = axis === "y";
    const scroll = isVertical ? "y" : "x";
    const cross2 = isVertical ? "x" : "y";
    const sign = !isVertical && isRightToLeft ? -1 : 1;
    const startEdge = getStartEdge();
    const endEdge = getEndEdge();
    function measureSize(nodeRect) {
      const {
        height,
        width
      } = nodeRect;
      return isVertical ? height : width;
    }
    function getStartEdge() {
      if (isVertical) return "top";
      return isRightToLeft ? "right" : "left";
    }
    function getEndEdge() {
      if (isVertical) return "bottom";
      return isRightToLeft ? "left" : "right";
    }
    function direction(n) {
      return n * sign;
    }
    const self = {
      scroll,
      cross: cross2,
      startEdge,
      endEdge,
      measureSize,
      direction
    };
    return self;
  }
  function Limit(min = 0, max = 0) {
    const length3 = mathAbs(min - max);
    function reachedMin(n) {
      return n < min;
    }
    function reachedMax(n) {
      return n > max;
    }
    function reachedAny(n) {
      return reachedMin(n) || reachedMax(n);
    }
    function constrain(n) {
      if (!reachedAny(n)) return n;
      return reachedMin(n) ? min : max;
    }
    function removeOffset(n) {
      if (!length3) return n;
      return n - length3 * Math.ceil((n - max) / length3);
    }
    const self = {
      length: length3,
      max,
      min,
      constrain,
      reachedAny,
      reachedMax,
      reachedMin,
      removeOffset
    };
    return self;
  }
  function Counter(max, start, loop) {
    const {
      constrain
    } = Limit(0, max);
    const loopEnd = max + 1;
    let counter = withinLimit(start);
    function withinLimit(n) {
      return !loop ? constrain(n) : mathAbs((loopEnd + n) % loopEnd);
    }
    function get() {
      return counter;
    }
    function set6(n) {
      counter = withinLimit(n);
      return self;
    }
    function add4(n) {
      return clone2().set(get() + n);
    }
    function clone2() {
      return Counter(max, get(), loop);
    }
    const self = {
      get,
      set: set6,
      add: add4,
      clone: clone2
    };
    return self;
  }
  function DragHandler(axis, rootNode, ownerDocument, ownerWindow, target, dragTracker, location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, baseFriction, watchDrag) {
    const {
      cross: crossAxis,
      direction
    } = axis;
    const focusNodes = ["INPUT", "SELECT", "TEXTAREA"];
    const nonPassiveEvent = {
      passive: false
    };
    const initEvents = EventStore();
    const dragEvents = EventStore();
    const goToNextThreshold = Limit(50, 225).constrain(percentOfView.measure(20));
    const snapForceBoost = {
      mouse: 300,
      touch: 400
    };
    const freeForceBoost = {
      mouse: 500,
      touch: 600
    };
    const baseSpeed = dragFree ? 43 : 25;
    let isMoving = false;
    let startScroll = 0;
    let startCross = 0;
    let pointerIsDown = false;
    let preventScroll = false;
    let preventClick = false;
    let isMouse = false;
    function init4(emblaApi) {
      if (!watchDrag) return;
      function downIfAllowed(evt) {
        if (isBoolean(watchDrag) || watchDrag(emblaApi, evt)) down(evt);
      }
      const node = rootNode;
      initEvents.add(node, "dragstart", (evt) => evt.preventDefault(), nonPassiveEvent).add(node, "touchmove", () => void 0, nonPassiveEvent).add(node, "touchend", () => void 0).add(node, "touchstart", downIfAllowed).add(node, "mousedown", downIfAllowed).add(node, "touchcancel", up).add(node, "contextmenu", up).add(node, "click", click, true);
    }
    function destroy() {
      initEvents.clear();
      dragEvents.clear();
    }
    function addDragEvents() {
      const node = isMouse ? ownerDocument : rootNode;
      dragEvents.add(node, "touchmove", move, nonPassiveEvent).add(node, "touchend", up).add(node, "mousemove", move, nonPassiveEvent).add(node, "mouseup", up);
    }
    function isFocusNode(node) {
      const nodeName = node.nodeName || "";
      return focusNodes.includes(nodeName);
    }
    function forceBoost() {
      const boost = dragFree ? freeForceBoost : snapForceBoost;
      const type = isMouse ? "mouse" : "touch";
      return boost[type];
    }
    function allowedForce(force, targetChanged) {
      const next = index.add(mathSign(force) * -1);
      const baseForce = scrollTarget.byDistance(force, !dragFree).distance;
      if (dragFree || mathAbs(force) < goToNextThreshold) return baseForce;
      if (skipSnaps && targetChanged) return baseForce * 0.5;
      return scrollTarget.byIndex(next.get(), 0).distance;
    }
    function down(evt) {
      const isMouseEvt = isMouseEvent(evt, ownerWindow);
      isMouse = isMouseEvt;
      preventClick = dragFree && isMouseEvt && !evt.buttons && isMoving;
      isMoving = deltaAbs(target.get(), location.get()) >= 2;
      if (isMouseEvt && evt.button !== 0) return;
      if (isFocusNode(evt.target)) return;
      pointerIsDown = true;
      dragTracker.pointerDown(evt);
      scrollBody.useFriction(0).useDuration(0);
      target.set(location);
      addDragEvents();
      startScroll = dragTracker.readPoint(evt);
      startCross = dragTracker.readPoint(evt, crossAxis);
      eventHandler.emit("pointerDown");
    }
    function move(evt) {
      const isTouchEvt = !isMouseEvent(evt, ownerWindow);
      if (isTouchEvt && evt.touches.length >= 2) return up(evt);
      const lastScroll = dragTracker.readPoint(evt);
      const lastCross = dragTracker.readPoint(evt, crossAxis);
      const diffScroll = deltaAbs(lastScroll, startScroll);
      const diffCross = deltaAbs(lastCross, startCross);
      if (!preventScroll && !isMouse) {
        if (!evt.cancelable) return up(evt);
        preventScroll = diffScroll > diffCross;
        if (!preventScroll) return up(evt);
      }
      const diff = dragTracker.pointerMove(evt);
      if (diffScroll > dragThreshold) preventClick = true;
      scrollBody.useFriction(0.3).useDuration(0.75);
      animation.start();
      target.add(direction(diff));
      evt.preventDefault();
    }
    function up(evt) {
      const currentLocation = scrollTarget.byDistance(0, false);
      const targetChanged = currentLocation.index !== index.get();
      const rawForce = dragTracker.pointerUp(evt) * forceBoost();
      const force = allowedForce(direction(rawForce), targetChanged);
      const forceFactor = factorAbs(rawForce, force);
      const speed = baseSpeed - 10 * forceFactor;
      const friction = baseFriction + forceFactor / 50;
      preventScroll = false;
      pointerIsDown = false;
      dragEvents.clear();
      scrollBody.useDuration(speed).useFriction(friction);
      scrollTo.distance(force, !dragFree);
      isMouse = false;
      eventHandler.emit("pointerUp");
    }
    function click(evt) {
      if (preventClick) {
        evt.stopPropagation();
        evt.preventDefault();
        preventClick = false;
      }
    }
    function pointerDown() {
      return pointerIsDown;
    }
    const self = {
      init: init4,
      destroy,
      pointerDown
    };
    return self;
  }
  function DragTracker(axis, ownerWindow) {
    const logInterval = 170;
    let startEvent;
    let lastEvent;
    function readTime(evt) {
      return evt.timeStamp;
    }
    function readPoint(evt, evtAxis) {
      const property = evtAxis || axis.scroll;
      const coord = `client${property === "x" ? "X" : "Y"}`;
      return (isMouseEvent(evt, ownerWindow) ? evt : evt.touches[0])[coord];
    }
    function pointerDown(evt) {
      startEvent = evt;
      lastEvent = evt;
      return readPoint(evt);
    }
    function pointerMove(evt) {
      const diff = readPoint(evt) - readPoint(lastEvent);
      const expired = readTime(evt) - readTime(startEvent) > logInterval;
      lastEvent = evt;
      if (expired) startEvent = evt;
      return diff;
    }
    function pointerUp(evt) {
      if (!startEvent || !lastEvent) return 0;
      const diffDrag = readPoint(lastEvent) - readPoint(startEvent);
      const diffTime = readTime(evt) - readTime(startEvent);
      const expired = readTime(evt) - readTime(lastEvent) > logInterval;
      const force = diffDrag / diffTime;
      const isFlick = diffTime && !expired && mathAbs(force) > 0.1;
      return isFlick ? force : 0;
    }
    const self = {
      pointerDown,
      pointerMove,
      pointerUp,
      readPoint
    };
    return self;
  }
  function NodeRects() {
    function measure(node) {
      const {
        offsetTop,
        offsetLeft,
        offsetWidth,
        offsetHeight
      } = node;
      const offset = {
        top: offsetTop,
        right: offsetLeft + offsetWidth,
        bottom: offsetTop + offsetHeight,
        left: offsetLeft,
        width: offsetWidth,
        height: offsetHeight
      };
      return offset;
    }
    const self = {
      measure
    };
    return self;
  }
  function PercentOfView(viewSize) {
    function measure(n) {
      return viewSize * (n / 100);
    }
    const self = {
      measure
    };
    return self;
  }
  function ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects) {
    const observeNodes = [container].concat(slides);
    let resizeObserver;
    let containerSize;
    let slideSizes = [];
    let destroyed = false;
    function readSize(node) {
      return axis.measureSize(nodeRects.measure(node));
    }
    function init4(emblaApi) {
      if (!watchResize) return;
      containerSize = readSize(container);
      slideSizes = slides.map(readSize);
      function defaultCallback(entries) {
        for (const entry of entries) {
          if (destroyed) return;
          const isContainer = entry.target === container;
          const slideIndex = slides.indexOf(entry.target);
          const lastSize = isContainer ? containerSize : slideSizes[slideIndex];
          const newSize = readSize(isContainer ? container : slides[slideIndex]);
          const diffSize = mathAbs(newSize - lastSize);
          if (diffSize >= 0.5) {
            emblaApi.reInit();
            eventHandler.emit("resize");
            break;
          }
        }
      }
      resizeObserver = new ResizeObserver((entries) => {
        if (isBoolean(watchResize) || watchResize(emblaApi, entries)) {
          defaultCallback(entries);
        }
      });
      ownerWindow.requestAnimationFrame(() => {
        observeNodes.forEach((node) => resizeObserver.observe(node));
      });
    }
    function destroy() {
      destroyed = true;
      if (resizeObserver) resizeObserver.disconnect();
    }
    const self = {
      init: init4,
      destroy
    };
    return self;
  }
  function ScrollBody(location, offsetLocation, previousLocation, target, baseDuration, baseFriction) {
    let scrollVelocity = 0;
    let scrollDirection = 0;
    let scrollDuration = baseDuration;
    let scrollFriction = baseFriction;
    let rawLocation = location.get();
    let rawLocationPrevious = 0;
    function seek() {
      const displacement = target.get() - location.get();
      const isInstant = !scrollDuration;
      let scrollDistance = 0;
      if (isInstant) {
        scrollVelocity = 0;
        previousLocation.set(target);
        location.set(target);
        scrollDistance = displacement;
      } else {
        previousLocation.set(location);
        scrollVelocity += displacement / scrollDuration;
        scrollVelocity *= scrollFriction;
        rawLocation += scrollVelocity;
        location.add(scrollVelocity);
        scrollDistance = rawLocation - rawLocationPrevious;
      }
      scrollDirection = mathSign(scrollDistance);
      rawLocationPrevious = rawLocation;
      return self;
    }
    function settled() {
      const diff = target.get() - offsetLocation.get();
      return mathAbs(diff) < 1e-3;
    }
    function duration() {
      return scrollDuration;
    }
    function direction() {
      return scrollDirection;
    }
    function velocity() {
      return scrollVelocity;
    }
    function useBaseDuration() {
      return useDuration(baseDuration);
    }
    function useBaseFriction() {
      return useFriction(baseFriction);
    }
    function useDuration(n) {
      scrollDuration = n;
      return self;
    }
    function useFriction(n) {
      scrollFriction = n;
      return self;
    }
    const self = {
      direction,
      duration,
      velocity,
      seek,
      settled,
      useBaseFriction,
      useBaseDuration,
      useFriction,
      useDuration
    };
    return self;
  }
  function ScrollBounds(limit, location, target, scrollBody, percentOfView) {
    const pullBackThreshold = percentOfView.measure(10);
    const edgeOffsetTolerance = percentOfView.measure(50);
    const frictionLimit = Limit(0.1, 0.99);
    let disabled = false;
    function shouldConstrain() {
      if (disabled) return false;
      if (!limit.reachedAny(target.get())) return false;
      if (!limit.reachedAny(location.get())) return false;
      return true;
    }
    function constrain(pointerDown) {
      if (!shouldConstrain()) return;
      const edge = limit.reachedMin(location.get()) ? "min" : "max";
      const diffToEdge = mathAbs(limit[edge] - location.get());
      const diffToTarget = target.get() - location.get();
      const friction = frictionLimit.constrain(diffToEdge / edgeOffsetTolerance);
      target.subtract(diffToTarget * friction);
      if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
        target.set(limit.constrain(target.get()));
        scrollBody.useDuration(25).useBaseFriction();
      }
    }
    function toggleActive(active) {
      disabled = !active;
    }
    const self = {
      shouldConstrain,
      constrain,
      toggleActive
    };
    return self;
  }
  function ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance) {
    const scrollBounds = Limit(-contentSize + viewSize, 0);
    const snapsBounded = measureBounded();
    const scrollContainLimit = findScrollContainLimit();
    const snapsContained = measureContained();
    function usePixelTolerance(bound, snap3) {
      return deltaAbs(bound, snap3) <= 1;
    }
    function findScrollContainLimit() {
      const startSnap = snapsBounded[0];
      const endSnap = arrayLast(snapsBounded);
      const min = snapsBounded.lastIndexOf(startSnap);
      const max = snapsBounded.indexOf(endSnap) + 1;
      return Limit(min, max);
    }
    function measureBounded() {
      return snapsAligned.map((snapAligned, index) => {
        const {
          min,
          max
        } = scrollBounds;
        const snap3 = scrollBounds.constrain(snapAligned);
        const isFirst = !index;
        const isLast = arrayIsLastIndex(snapsAligned, index);
        if (isFirst) return max;
        if (isLast) return min;
        if (usePixelTolerance(min, snap3)) return min;
        if (usePixelTolerance(max, snap3)) return max;
        return snap3;
      }).map((scrollBound) => parseFloat(scrollBound.toFixed(3)));
    }
    function measureContained() {
      if (contentSize <= viewSize + pixelTolerance) return [scrollBounds.max];
      if (containScroll === "keepSnaps") return snapsBounded;
      const {
        min,
        max
      } = scrollContainLimit;
      return snapsBounded.slice(min, max);
    }
    const self = {
      snapsContained,
      scrollContainLimit
    };
    return self;
  }
  function ScrollLimit(contentSize, scrollSnaps, loop) {
    const max = scrollSnaps[0];
    const min = loop ? max - contentSize : arrayLast(scrollSnaps);
    const limit = Limit(min, max);
    const self = {
      limit
    };
    return self;
  }
  function ScrollLooper(contentSize, limit, location, vectors) {
    const jointSafety = 0.1;
    const min = limit.min + jointSafety;
    const max = limit.max + jointSafety;
    const {
      reachedMin,
      reachedMax
    } = Limit(min, max);
    function shouldLoop(direction) {
      if (direction === 1) return reachedMax(location.get());
      if (direction === -1) return reachedMin(location.get());
      return false;
    }
    function loop(direction) {
      if (!shouldLoop(direction)) return;
      const loopDistance = contentSize * (direction * -1);
      vectors.forEach((v) => v.add(loopDistance));
    }
    const self = {
      loop
    };
    return self;
  }
  function ScrollProgress(limit) {
    const {
      max,
      length: length3
    } = limit;
    function get(n) {
      const currentLocation = n - max;
      return length3 ? currentLocation / -length3 : 0;
    }
    const self = {
      get
    };
    return self;
  }
  function ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll) {
    const {
      startEdge,
      endEdge
    } = axis;
    const {
      groupSlides
    } = slidesToScroll;
    const alignments = measureSizes().map(alignment.measure);
    const snaps = measureUnaligned();
    const snapsAligned = measureAligned();
    function measureSizes() {
      return groupSlides(slideRects).map((rects) => arrayLast(rects)[endEdge] - rects[0][startEdge]).map(mathAbs);
    }
    function measureUnaligned() {
      return slideRects.map((rect) => containerRect[startEdge] - rect[startEdge]).map((snap3) => -mathAbs(snap3));
    }
    function measureAligned() {
      return groupSlides(snaps).map((g) => g[0]).map((snap3, index) => snap3 + alignments[index]);
    }
    const self = {
      snaps,
      snapsAligned
    };
    return self;
  }
  function SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes) {
    const {
      groupSlides
    } = slidesToScroll;
    const {
      min,
      max
    } = scrollContainLimit;
    const slideRegistry = createSlideRegistry();
    function createSlideRegistry() {
      const groupedSlideIndexes = groupSlides(slideIndexes);
      const doNotContain = !containSnaps || containScroll === "keepSnaps";
      if (scrollSnaps.length === 1) return [slideIndexes];
      if (doNotContain) return groupedSlideIndexes;
      return groupedSlideIndexes.slice(min, max).map((group, index, groups) => {
        const isFirst = !index;
        const isLast = arrayIsLastIndex(groups, index);
        if (isFirst) {
          const range = arrayLast(groups[0]) + 1;
          return arrayFromNumber(range);
        }
        if (isLast) {
          const range = arrayLastIndex(slideIndexes) - arrayLast(groups)[0] + 1;
          return arrayFromNumber(range, arrayLast(groups)[0]);
        }
        return group;
      });
    }
    const self = {
      slideRegistry
    };
    return self;
  }
  function ScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector) {
    const {
      reachedAny,
      removeOffset,
      constrain
    } = limit;
    function minDistance(distances) {
      return distances.concat().sort((a, b) => mathAbs(a) - mathAbs(b))[0];
    }
    function findTargetSnap(target) {
      const distance2 = loop ? removeOffset(target) : constrain(target);
      const ascDiffsToSnaps = scrollSnaps.map((snap3, index2) => ({
        diff: shortcut(snap3 - distance2, 0),
        index: index2
      })).sort((d1, d2) => mathAbs(d1.diff) - mathAbs(d2.diff));
      const {
        index
      } = ascDiffsToSnaps[0];
      return {
        index,
        distance: distance2
      };
    }
    function shortcut(target, direction) {
      const targets = [target, target + contentSize, target - contentSize];
      if (!loop) return target;
      if (!direction) return minDistance(targets);
      const matchingTargets = targets.filter((t) => mathSign(t) === direction);
      if (matchingTargets.length) return minDistance(matchingTargets);
      return arrayLast(targets) - contentSize;
    }
    function byIndex(index, direction) {
      const diffToSnap = scrollSnaps[index] - targetVector.get();
      const distance2 = shortcut(diffToSnap, direction);
      return {
        index,
        distance: distance2
      };
    }
    function byDistance(distance2, snap3) {
      const target = targetVector.get() + distance2;
      const {
        index,
        distance: targetSnapDistance
      } = findTargetSnap(target);
      const reachedBound = !loop && reachedAny(target);
      if (!snap3 || reachedBound) return {
        index,
        distance: distance2
      };
      const diffToSnap = scrollSnaps[index] - targetSnapDistance;
      const snapDistance = distance2 + shortcut(diffToSnap, 0);
      return {
        index,
        distance: snapDistance
      };
    }
    const self = {
      byDistance,
      byIndex,
      shortcut
    };
    return self;
  }
  function ScrollTo(animation, indexCurrent, indexPrevious, scrollBody, scrollTarget, targetVector, eventHandler) {
    function scrollTo(target) {
      const distanceDiff = target.distance;
      const indexDiff = target.index !== indexCurrent.get();
      targetVector.add(distanceDiff);
      if (distanceDiff) {
        if (scrollBody.duration()) {
          animation.start();
        } else {
          animation.update();
          animation.render(1);
          animation.update();
        }
      }
      if (indexDiff) {
        indexPrevious.set(indexCurrent.get());
        indexCurrent.set(target.index);
        eventHandler.emit("select");
      }
    }
    function distance2(n, snap3) {
      const target = scrollTarget.byDistance(n, snap3);
      scrollTo(target);
    }
    function index(n, direction) {
      const targetIndex = indexCurrent.clone().set(n);
      const target = scrollTarget.byIndex(targetIndex.get(), direction);
      scrollTo(target);
    }
    const self = {
      distance: distance2,
      index
    };
    return self;
  }
  function SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus) {
    const focusListenerOptions = {
      passive: true,
      capture: true
    };
    let lastTabPressTime = 0;
    function init4(emblaApi) {
      if (!watchFocus) return;
      function defaultCallback(index) {
        const nowTime = (/* @__PURE__ */ new Date()).getTime();
        const diffTime = nowTime - lastTabPressTime;
        if (diffTime > 10) return;
        eventHandler.emit("slideFocusStart");
        root.scrollLeft = 0;
        const group = slideRegistry.findIndex((group2) => group2.includes(index));
        if (!isNumber(group)) return;
        scrollBody.useDuration(0);
        scrollTo.index(group, 0);
        eventHandler.emit("slideFocus");
      }
      eventStore.add(document, "keydown", registerTabPress, false);
      slides.forEach((slide, slideIndex) => {
        eventStore.add(slide, "focus", (evt) => {
          if (isBoolean(watchFocus) || watchFocus(emblaApi, evt)) {
            defaultCallback(slideIndex);
          }
        }, focusListenerOptions);
      });
    }
    function registerTabPress(event) {
      if (event.code === "Tab") lastTabPressTime = (/* @__PURE__ */ new Date()).getTime();
    }
    const self = {
      init: init4
    };
    return self;
  }
  function Vector1D(initialValue) {
    let value = initialValue;
    function get() {
      return value;
    }
    function set6(n) {
      value = normalizeInput(n);
    }
    function add4(n) {
      value += normalizeInput(n);
    }
    function subtract3(n) {
      value -= normalizeInput(n);
    }
    function normalizeInput(n) {
      return isNumber(n) ? n : n.get();
    }
    const self = {
      get,
      set: set6,
      add: add4,
      subtract: subtract3
    };
    return self;
  }
  function Translate(axis, container) {
    const translate3 = axis.scroll === "x" ? x : y;
    const containerStyle = container.style;
    let previousTarget = null;
    let disabled = false;
    function x(n) {
      return `translate3d(${n}px,0px,0px)`;
    }
    function y(n) {
      return `translate3d(0px,${n}px,0px)`;
    }
    function to(target) {
      if (disabled) return;
      const newTarget = roundToTwoDecimals(axis.direction(target));
      if (newTarget === previousTarget) return;
      containerStyle.transform = translate3(newTarget);
      previousTarget = newTarget;
    }
    function toggleActive(active) {
      disabled = !active;
    }
    function clear() {
      if (disabled) return;
      containerStyle.transform = "";
      if (!container.getAttribute("style")) container.removeAttribute("style");
    }
    const self = {
      clear,
      to,
      toggleActive
    };
    return self;
  }
  function SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, location, slides) {
    const roundingSafety = 0.5;
    const ascItems = arrayKeys(slideSizesWithGaps);
    const descItems = arrayKeys(slideSizesWithGaps).reverse();
    const loopPoints = startPoints().concat(endPoints());
    function removeSlideSizes(indexes, from) {
      return indexes.reduce((a, i) => {
        return a - slideSizesWithGaps[i];
      }, from);
    }
    function slidesInGap(indexes, gap) {
      return indexes.reduce((a, i) => {
        const remainingGap = removeSlideSizes(a, gap);
        return remainingGap > 0 ? a.concat([i]) : a;
      }, []);
    }
    function findSlideBounds(offset) {
      return snaps.map((snap3, index) => ({
        start: snap3 - slideSizes[index] + roundingSafety + offset,
        end: snap3 + viewSize - roundingSafety + offset
      }));
    }
    function findLoopPoints(indexes, offset, isEndEdge) {
      const slideBounds = findSlideBounds(offset);
      return indexes.map((index) => {
        const initial = isEndEdge ? 0 : -contentSize;
        const altered = isEndEdge ? contentSize : 0;
        const boundEdge = isEndEdge ? "end" : "start";
        const loopPoint = slideBounds[index][boundEdge];
        return {
          index,
          loopPoint,
          slideLocation: Vector1D(-1),
          translate: Translate(axis, slides[index]),
          target: () => location.get() > loopPoint ? initial : altered
        };
      });
    }
    function startPoints() {
      const gap = scrollSnaps[0];
      const indexes = slidesInGap(descItems, gap);
      return findLoopPoints(indexes, contentSize, false);
    }
    function endPoints() {
      const gap = viewSize - scrollSnaps[0] - 1;
      const indexes = slidesInGap(ascItems, gap);
      return findLoopPoints(indexes, -contentSize, true);
    }
    function canLoop() {
      return loopPoints.every(({
        index
      }) => {
        const otherIndexes = ascItems.filter((i) => i !== index);
        return removeSlideSizes(otherIndexes, viewSize) <= 0.1;
      });
    }
    function loop() {
      loopPoints.forEach((loopPoint) => {
        const {
          target,
          translate: translate3,
          slideLocation
        } = loopPoint;
        const shiftLocation = target();
        if (shiftLocation === slideLocation.get()) return;
        translate3.to(shiftLocation);
        slideLocation.set(shiftLocation);
      });
    }
    function clear() {
      loopPoints.forEach((loopPoint) => loopPoint.translate.clear());
    }
    const self = {
      canLoop,
      clear,
      loop,
      loopPoints
    };
    return self;
  }
  function SlidesHandler(container, eventHandler, watchSlides) {
    let mutationObserver;
    let destroyed = false;
    function init4(emblaApi) {
      if (!watchSlides) return;
      function defaultCallback(mutations) {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            emblaApi.reInit();
            eventHandler.emit("slidesChanged");
            break;
          }
        }
      }
      mutationObserver = new MutationObserver((mutations) => {
        if (destroyed) return;
        if (isBoolean(watchSlides) || watchSlides(emblaApi, mutations)) {
          defaultCallback(mutations);
        }
      });
      mutationObserver.observe(container, {
        childList: true
      });
    }
    function destroy() {
      if (mutationObserver) mutationObserver.disconnect();
      destroyed = true;
    }
    const self = {
      init: init4,
      destroy
    };
    return self;
  }
  function SlidesInView(container, slides, eventHandler, threshold) {
    const intersectionEntryMap = {};
    let inViewCache = null;
    let notInViewCache = null;
    let intersectionObserver;
    let destroyed = false;
    function init4() {
      intersectionObserver = new IntersectionObserver((entries) => {
        if (destroyed) return;
        entries.forEach((entry) => {
          const index = slides.indexOf(entry.target);
          intersectionEntryMap[index] = entry;
        });
        inViewCache = null;
        notInViewCache = null;
        eventHandler.emit("slidesInView");
      }, {
        root: container.parentElement,
        threshold
      });
      slides.forEach((slide) => intersectionObserver.observe(slide));
    }
    function destroy() {
      if (intersectionObserver) intersectionObserver.disconnect();
      destroyed = true;
    }
    function createInViewList(inView) {
      return objectKeys(intersectionEntryMap).reduce((list, slideIndex) => {
        const index = parseInt(slideIndex);
        const {
          isIntersecting
        } = intersectionEntryMap[index];
        const inViewMatch = inView && isIntersecting;
        const notInViewMatch = !inView && !isIntersecting;
        if (inViewMatch || notInViewMatch) list.push(index);
        return list;
      }, []);
    }
    function get(inView = true) {
      if (inView && inViewCache) return inViewCache;
      if (!inView && notInViewCache) return notInViewCache;
      const slideIndexes = createInViewList(inView);
      if (inView) inViewCache = slideIndexes;
      if (!inView) notInViewCache = slideIndexes;
      return slideIndexes;
    }
    const self = {
      init: init4,
      destroy,
      get
    };
    return self;
  }
  function SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow) {
    const {
      measureSize,
      startEdge,
      endEdge
    } = axis;
    const withEdgeGap = slideRects[0] && readEdgeGap;
    const startGap = measureStartGap();
    const endGap = measureEndGap();
    const slideSizes = slideRects.map(measureSize);
    const slideSizesWithGaps = measureWithGaps();
    function measureStartGap() {
      if (!withEdgeGap) return 0;
      const slideRect = slideRects[0];
      return mathAbs(containerRect[startEdge] - slideRect[startEdge]);
    }
    function measureEndGap() {
      if (!withEdgeGap) return 0;
      const style = ownerWindow.getComputedStyle(arrayLast(slides));
      return parseFloat(style.getPropertyValue(`margin-${endEdge}`));
    }
    function measureWithGaps() {
      return slideRects.map((rect, index, rects) => {
        const isFirst = !index;
        const isLast = arrayIsLastIndex(rects, index);
        if (isFirst) return slideSizes[index] + startGap;
        if (isLast) return slideSizes[index] + endGap;
        return rects[index + 1][startEdge] - rect[startEdge];
      }).map(mathAbs);
    }
    const self = {
      slideSizes,
      slideSizesWithGaps,
      startGap,
      endGap
    };
    return self;
  }
  function SlidesToScroll(axis, viewSize, slidesToScroll, loop, containerRect, slideRects, startGap, endGap, pixelTolerance) {
    const {
      startEdge,
      endEdge,
      direction
    } = axis;
    const groupByNumber = isNumber(slidesToScroll);
    function byNumber(array, groupSize) {
      return arrayKeys(array).filter((i) => i % groupSize === 0).map((i) => array.slice(i, i + groupSize));
    }
    function bySize(array) {
      if (!array.length) return [];
      return arrayKeys(array).reduce((groups, rectB, index) => {
        const rectA = arrayLast(groups) || 0;
        const isFirst = rectA === 0;
        const isLast = rectB === arrayLastIndex(array);
        const edgeA = containerRect[startEdge] - slideRects[rectA][startEdge];
        const edgeB = containerRect[startEdge] - slideRects[rectB][endEdge];
        const gapA = !loop && isFirst ? direction(startGap) : 0;
        const gapB = !loop && isLast ? direction(endGap) : 0;
        const chunkSize = mathAbs(edgeB - gapB - (edgeA + gapA));
        if (index && chunkSize > viewSize + pixelTolerance) groups.push(rectB);
        if (isLast) groups.push(array.length);
        return groups;
      }, []).map((currentSize, index, groups) => {
        const previousSize = Math.max(groups[index - 1] || 0);
        return array.slice(previousSize, currentSize);
      });
    }
    function groupSlides(array) {
      return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array);
    }
    const self = {
      groupSlides
    };
    return self;
  }
  function Engine(root, container, slides, ownerDocument, ownerWindow, options, eventHandler) {
    const {
      align,
      axis: scrollAxis,
      direction,
      startIndex,
      loop,
      duration,
      dragFree,
      dragThreshold,
      inViewThreshold,
      slidesToScroll: groupSlides,
      skipSnaps,
      containScroll,
      watchResize,
      watchSlides,
      watchDrag,
      watchFocus
    } = options;
    const pixelTolerance = 2;
    const nodeRects = NodeRects();
    const containerRect = nodeRects.measure(container);
    const slideRects = slides.map(nodeRects.measure);
    const axis = Axis(scrollAxis, direction);
    const viewSize = axis.measureSize(containerRect);
    const percentOfView = PercentOfView(viewSize);
    const alignment = Alignment(align, viewSize);
    const containSnaps = !loop && !!containScroll;
    const readEdgeGap = loop || !!containScroll;
    const {
      slideSizes,
      slideSizesWithGaps,
      startGap,
      endGap
    } = SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow);
    const slidesToScroll = SlidesToScroll(axis, viewSize, groupSlides, loop, containerRect, slideRects, startGap, endGap, pixelTolerance);
    const {
      snaps,
      snapsAligned
    } = ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll);
    const contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps);
    const {
      snapsContained,
      scrollContainLimit
    } = ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance);
    const scrollSnaps = containSnaps ? snapsContained : snapsAligned;
    const {
      limit
    } = ScrollLimit(contentSize, scrollSnaps, loop);
    const index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop);
    const indexPrevious = index.clone();
    const slideIndexes = arrayKeys(slides);
    const update = ({
      dragHandler,
      scrollBody: scrollBody2,
      scrollBounds,
      options: {
        loop: loop2
      }
    }) => {
      if (!loop2) scrollBounds.constrain(dragHandler.pointerDown());
      scrollBody2.seek();
    };
    const render3 = ({
      scrollBody: scrollBody2,
      translate: translate3,
      location: location2,
      offsetLocation: offsetLocation2,
      previousLocation: previousLocation2,
      scrollLooper,
      slideLooper,
      dragHandler,
      animation: animation2,
      eventHandler: eventHandler2,
      scrollBounds,
      options: {
        loop: loop2
      }
    }, alpha) => {
      const shouldSettle = scrollBody2.settled();
      const withinBounds = !scrollBounds.shouldConstrain();
      const hasSettled = loop2 ? shouldSettle : shouldSettle && withinBounds;
      if (hasSettled && !dragHandler.pointerDown()) {
        animation2.stop();
        eventHandler2.emit("settle");
      }
      if (!hasSettled) eventHandler2.emit("scroll");
      const interpolatedLocation = location2.get() * alpha + previousLocation2.get() * (1 - alpha);
      offsetLocation2.set(interpolatedLocation);
      if (loop2) {
        scrollLooper.loop(scrollBody2.direction());
        slideLooper.loop();
      }
      translate3.to(offsetLocation2.get());
    };
    const animation = Animations(ownerDocument, ownerWindow, () => update(engine), (alpha) => render3(engine, alpha));
    const friction = 0.68;
    const startLocation = scrollSnaps[index.get()];
    const location = Vector1D(startLocation);
    const previousLocation = Vector1D(startLocation);
    const offsetLocation = Vector1D(startLocation);
    const target = Vector1D(startLocation);
    const scrollBody = ScrollBody(location, offsetLocation, previousLocation, target, duration, friction);
    const scrollTarget = ScrollTarget(loop, scrollSnaps, contentSize, limit, target);
    const scrollTo = ScrollTo(animation, index, indexPrevious, scrollBody, scrollTarget, target, eventHandler);
    const scrollProgress = ScrollProgress(limit);
    const eventStore = EventStore();
    const slidesInView = SlidesInView(container, slides, eventHandler, inViewThreshold);
    const {
      slideRegistry
    } = SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes);
    const slideFocus = SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus);
    const engine = {
      ownerDocument,
      ownerWindow,
      eventHandler,
      containerRect,
      slideRects,
      animation,
      axis,
      dragHandler: DragHandler(axis, root, ownerDocument, ownerWindow, target, DragTracker(axis, ownerWindow), location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, friction, watchDrag),
      eventStore,
      percentOfView,
      index,
      indexPrevious,
      limit,
      location,
      offsetLocation,
      previousLocation,
      options,
      resizeHandler: ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects),
      scrollBody,
      scrollBounds: ScrollBounds(limit, offsetLocation, target, scrollBody, percentOfView),
      scrollLooper: ScrollLooper(contentSize, limit, offsetLocation, [location, offsetLocation, previousLocation, target]),
      scrollProgress,
      scrollSnapList: scrollSnaps.map(scrollProgress.get),
      scrollSnaps,
      scrollTarget,
      scrollTo,
      slideLooper: SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, offsetLocation, slides),
      slideFocus,
      slidesHandler: SlidesHandler(container, eventHandler, watchSlides),
      slidesInView,
      slideIndexes,
      slideRegistry,
      slidesToScroll,
      target,
      translate: Translate(axis, container)
    };
    return engine;
  }
  function EventHandler() {
    let listeners2 = {};
    let api;
    function init4(emblaApi) {
      api = emblaApi;
    }
    function getListeners(evt) {
      return listeners2[evt] || [];
    }
    function emit(evt) {
      getListeners(evt).forEach((e) => e(api, evt));
      return self;
    }
    function on(evt, cb) {
      listeners2[evt] = getListeners(evt).concat([cb]);
      return self;
    }
    function off(evt, cb) {
      listeners2[evt] = getListeners(evt).filter((e) => e !== cb);
      return self;
    }
    function clear() {
      listeners2 = {};
    }
    const self = {
      init: init4,
      emit,
      off,
      on,
      clear
    };
    return self;
  }
  var defaultOptions = {
    align: "center",
    axis: "x",
    container: null,
    slides: null,
    containScroll: "trimSnaps",
    direction: "ltr",
    slidesToScroll: 1,
    inViewThreshold: 0,
    breakpoints: {},
    dragFree: false,
    dragThreshold: 10,
    loop: false,
    skipSnaps: false,
    duration: 25,
    startIndex: 0,
    active: true,
    watchDrag: true,
    watchResize: true,
    watchSlides: true,
    watchFocus: true
  };
  function OptionsHandler(ownerWindow) {
    function mergeOptions(optionsA, optionsB) {
      return objectsMergeDeep(optionsA, optionsB || {});
    }
    function optionsAtMedia(options) {
      const optionsAtMedia2 = options.breakpoints || {};
      const matchedMediaOptions = objectKeys(optionsAtMedia2).filter((media) => ownerWindow.matchMedia(media).matches).map((media) => optionsAtMedia2[media]).reduce((a, mediaOption) => mergeOptions(a, mediaOption), {});
      return mergeOptions(options, matchedMediaOptions);
    }
    function optionsMediaQueries(optionsList) {
      return optionsList.map((options) => objectKeys(options.breakpoints || {})).reduce((acc, mediaQueries) => acc.concat(mediaQueries), []).map(ownerWindow.matchMedia);
    }
    const self = {
      mergeOptions,
      optionsAtMedia,
      optionsMediaQueries
    };
    return self;
  }
  function PluginsHandler(optionsHandler) {
    let activePlugins = [];
    function init4(emblaApi, plugins) {
      activePlugins = plugins.filter(({
        options
      }) => optionsHandler.optionsAtMedia(options).active !== false);
      activePlugins.forEach((plugin) => plugin.init(emblaApi, optionsHandler));
      return plugins.reduce((map2, plugin) => Object.assign(map2, {
        [plugin.name]: plugin
      }), {});
    }
    function destroy() {
      activePlugins = activePlugins.filter((plugin) => plugin.destroy());
    }
    const self = {
      init: init4,
      destroy
    };
    return self;
  }
  function EmblaCarousel(root, userOptions, userPlugins) {
    const ownerDocument = root.ownerDocument;
    const ownerWindow = ownerDocument.defaultView;
    const optionsHandler = OptionsHandler(ownerWindow);
    const pluginsHandler = PluginsHandler(optionsHandler);
    const mediaHandlers = EventStore();
    const eventHandler = EventHandler();
    const {
      mergeOptions,
      optionsAtMedia,
      optionsMediaQueries
    } = optionsHandler;
    const {
      on,
      off,
      emit
    } = eventHandler;
    const reInit = reActivate;
    let destroyed = false;
    let engine;
    let optionsBase = mergeOptions(defaultOptions, EmblaCarousel.globalOptions);
    let options = mergeOptions(optionsBase);
    let pluginList = [];
    let pluginApis;
    let container;
    let slides;
    function storeElements() {
      const {
        container: userContainer,
        slides: userSlides
      } = options;
      const customContainer = isString(userContainer) ? root.querySelector(userContainer) : userContainer;
      container = customContainer || root.children[0];
      const customSlides = isString(userSlides) ? container.querySelectorAll(userSlides) : userSlides;
      slides = [].slice.call(customSlides || container.children);
    }
    function createEngine(options2) {
      const engine2 = Engine(root, container, slides, ownerDocument, ownerWindow, options2, eventHandler);
      if (options2.loop && !engine2.slideLooper.canLoop()) {
        const optionsWithoutLoop = Object.assign({}, options2, {
          loop: false
        });
        return createEngine(optionsWithoutLoop);
      }
      return engine2;
    }
    function activate(withOptions, withPlugins) {
      if (destroyed) return;
      optionsBase = mergeOptions(optionsBase, withOptions);
      options = optionsAtMedia(optionsBase);
      pluginList = withPlugins || pluginList;
      storeElements();
      engine = createEngine(options);
      optionsMediaQueries([optionsBase, ...pluginList.map(({
        options: options2
      }) => options2)]).forEach((query) => mediaHandlers.add(query, "change", reActivate));
      if (!options.active) return;
      engine.translate.to(engine.location.get());
      engine.animation.init();
      engine.slidesInView.init();
      engine.slideFocus.init(self);
      engine.eventHandler.init(self);
      engine.resizeHandler.init(self);
      engine.slidesHandler.init(self);
      if (engine.options.loop) engine.slideLooper.loop();
      if (container.offsetParent && slides.length) engine.dragHandler.init(self);
      pluginApis = pluginsHandler.init(self, pluginList);
    }
    function reActivate(withOptions, withPlugins) {
      const startIndex = selectedScrollSnap();
      deActivate();
      activate(mergeOptions({
        startIndex
      }, withOptions), withPlugins);
      eventHandler.emit("reInit");
    }
    function deActivate() {
      engine.dragHandler.destroy();
      engine.eventStore.clear();
      engine.translate.clear();
      engine.slideLooper.clear();
      engine.resizeHandler.destroy();
      engine.slidesHandler.destroy();
      engine.slidesInView.destroy();
      engine.animation.destroy();
      pluginsHandler.destroy();
      mediaHandlers.clear();
    }
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      mediaHandlers.clear();
      deActivate();
      eventHandler.emit("destroy");
      eventHandler.clear();
    }
    function scrollTo(index, jump, direction) {
      if (!options.active || destroyed) return;
      engine.scrollBody.useBaseFriction().useDuration(jump === true ? 0 : options.duration);
      engine.scrollTo.index(index, direction || 0);
    }
    function scrollNext(jump) {
      const next = engine.index.add(1).get();
      scrollTo(next, jump, -1);
    }
    function scrollPrev(jump) {
      const prev = engine.index.add(-1).get();
      scrollTo(prev, jump, 1);
    }
    function canScrollNext() {
      const next = engine.index.add(1).get();
      return next !== selectedScrollSnap();
    }
    function canScrollPrev() {
      const prev = engine.index.add(-1).get();
      return prev !== selectedScrollSnap();
    }
    function scrollSnapList() {
      return engine.scrollSnapList;
    }
    function scrollProgress() {
      return engine.scrollProgress.get(engine.location.get());
    }
    function selectedScrollSnap() {
      return engine.index.get();
    }
    function previousScrollSnap() {
      return engine.indexPrevious.get();
    }
    function slidesInView() {
      return engine.slidesInView.get();
    }
    function slidesNotInView() {
      return engine.slidesInView.get(false);
    }
    function plugins() {
      return pluginApis;
    }
    function internalEngine() {
      return engine;
    }
    function rootNode() {
      return root;
    }
    function containerNode() {
      return container;
    }
    function slideNodes() {
      return slides;
    }
    const self = {
      canScrollNext,
      canScrollPrev,
      containerNode,
      internalEngine,
      destroy,
      off,
      on,
      emit,
      plugins,
      previousScrollSnap,
      reInit,
      rootNode,
      scrollNext,
      scrollPrev,
      scrollProgress,
      scrollSnapList,
      scrollTo,
      selectedScrollSnap,
      slideNodes,
      slidesInView,
      slidesNotInView
    };
    activate(userOptions, userPlugins);
    setTimeout(() => eventHandler.emit("init"), 0);
    return self;
  }
  EmblaCarousel.globalOptions = void 0;

  // src/modules/slider.js
  var Slider = class {
    options = { loop: true };
    btns = [...document.querySelector("[data-embla='btns']").children];
    constructor(el) {
      this.el = el;
      this.api = EmblaCarousel(this.el, this.options);
      this.checkEnabled();
      this.btns.forEach((btn, i) => {
        btn.onclick = () => {
          i === 0 ? this.api.scrollPrev() : this.api.scrollNext();
        };
      });
    }
    checkEnabled() {
      if (this.api.canScrollNext()) {
        this.btns[1].classList.remove("disabled");
      } else {
        this.btns[1].classList.add("disabled");
      }
      if (this.api.canScrollPrev()) {
        this.btns[0].classList.remove("disabled");
      } else {
        this.btns[0].classList.add("disabled");
      }
    }
    destroy() {
      this.btns.forEach((btn) => btn.onclick = null);
      this.api.destroy();
    }
  };

  // src/modules/dropdowns.js
  var Dropdowns = class {
    current = 0;
    constructor(el) {
      this.el = el;
      this.items = [...this.el.children];
      this.items.forEach((item, i) => {
        item.querySelector("input").onchange = this.onChange.bind(this, i);
      });
      this.items[0].querySelector("input").checked = true;
    }
    onChange(i, e) {
      if (this.current !== null) {
        this.items[this.current].querySelector("input").checked = false;
      }
      this.current = i;
    }
    destroy() {
      this.items.forEach((item) => {
        item.querySelector("input").onchange = null;
      });
    }
  };

  // src/modules/partners.js
  var Partners = class {
    constructor(el) {
      this.el = el;
      this.hovers = [...this.el.querySelectorAll("[data-partners='hover']")];
      this.imgs = [...this.el.querySelectorAll("[data-partners='img']")];
      this.imgs.forEach((img, i) => {
        img.style.zIndex = -0;
      });
      this.hovers.forEach((hover, i) => {
        hover.onmouseenter = () => {
          this.imgs.forEach((img) => {
            img.style.zIndex = 0;
          });
          this.imgs[i].style.zIndex = 10;
        };
        hover.onmouseleave = () => {
          this.imgs.forEach((img, i2) => {
            img.style.zIndex = 0;
          });
        };
      });
    }
    destroy() {
      this.hovers.forEach((hover) => {
        hover.onmouseenter = null;
      });
    }
  };

  // src/modules/openings.js
  var Openings = class {
    constructor(el) {
      this.el = el;
      const urls = document.querySelectorAll("[data-url]");
      urls.forEach((item, i) => {
        item.href = item.href + item.dataset.url;
      });
      this.filters = [
        ...this.el.querySelectorAll(
          '[data-filter="locations"] , [data-filter="department"]'
        )
      ];
      this.filterData = {
        locations: [],
        departments: []
      };
      this.items = [...this.el.querySelectorAll("[data-filter='item']")].map(
        (it, i) => {
          const location = it.querySelector("[data-filter-location]").textContent;
          const dept = it.dataset.dept;
          if (!this.filterData.locations.includes(location)) {
            this.filterData.locations.push(location);
          }
          if (!this.filterData.departments.includes(dept)) {
            if (dept.length > 0) {
              this.filterData.departments.push(dept);
            }
          }
          return {
            item: it,
            location,
            index: i
          };
        }
      );
      this.filterData.locations.forEach((loc) => {
        const el2 = this.filters[0].children[1].children[0].cloneNode(true);
        el2.textContent = loc;
        this.filters[0].children[1].appendChild(el2);
        el2.onclick = () => this.filterItems("locations", loc);
      });
      this.filterData.departments.forEach((dept) => {
        const el2 = this.filters[1].children[1].children[0].cloneNode(true);
        el2.textContent = dept;
        this.filters[1].children[1].appendChild(el2);
        el2.onclick = () => this.filterItems("departments", dept);
      });
      this.filters[0].children[1].children[0].onclick = () => this.filterItems("locations", "all");
      this.filters[1].children[1].children[0].onclick = () => this.filterItems("departments", "all");
      this.filters.forEach((filter) => {
        filter.onclick = (e) => {
          e.stopPropagation();
          filter.classList.toggle("active");
          this.handleClickOut();
        };
      });
    }
    handleClickOut = () => {
      document.body.onclick = () => {
        this.filters.forEach((filter) => {
          filter.classList.remove("active");
          document.body.onclick = null;
        });
      };
    };
    filterItems(filter, data) {
      if (filter === "locations") {
        this.filters[1].children[0].children[0].textContent = "ALL DEPARTMENTS";
        this.items.forEach((it) => {
          if (data === "all") {
            it.item.style.display = "flex";
            this.filters[0].children[0].children[0].textContent = "ALL LOCATIONS";
          } else {
            it.item.style.display = it.location === data ? "flex" : "none";
            this.filters[0].children[0].children[0].textContent = data;
          }
        });
      } else {
        this.filters[0].children[0].children[0].textContent = "ALL LOCATIONS";
        this.items.forEach((it) => {
          if (data === "all") {
            it.item.style.display = "flex";
            this.filters[1].children[0].children[0].textContent = "ALL DEPARTMENTS";
          } else {
            it.item.style.display = it.item.dataset.dept === data ? "flex" : "none";
            this.filters[1].children[0].children[0].textContent = data;
          }
        });
      }
    }
    destroy() {
      this.filterData.forEach((filter) => {
        filter.onclick = null;
      });
      this.filters.forEach((filter) => {
        filter.onclick = null;
      });
    }
  };

  // src/modules/submit.js
  var Submit = class {
    field = document.querySelector('[data-newsletter="field"]');
    constructor(el) {
      this.el = el;
      this.receiver = [...this.el.querySelectorAll("input")];
      hey_default.on("PAGE", () => this.init());
      this.init();
    }
    init = () => {
      if (this.field) {
        this.field.onchange = null;
      }
      const fld = document.querySelector('[data-newsletter="field"]');
      const sub = document.querySelector('[data-newsletter="subscribe"]');
      const error = document.querySelector('[data-error="msg"]');
      if (fld) {
        fld.oninput = () => {
          this.receiver[0].value = fld.value;
        };
      }
      if (sub) {
        sub.onclick = (e) => {
          e.preventDefault();
          if (this.checkValidEmail()) {
            this.receiver[1].click();
            this.handleSuccess(sub);
          } else {
            error.style.display = "block";
            setTimeout(() => {
              error.style.display = "none";
            }, 3e3);
          }
        };
        this.el.onsubmit = (e) => {
          e.preventDefault();
          if (this.checkValidEmail()) {
            this.receiver[1].click();
            this.handleSuccess(sub);
          } else {
            error.style.display = "block";
            setTimeout(() => {
              error.style.display = "none";
            }, 3e3);
          }
        };
      }
    };
    checkValidEmail = () => {
      const email = this.receiver[0].value;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
    handleSuccess(sub) {
      const parent = sub.parentElement.parentElement;
      parent.style.display = "none";
      parent.nextElementSibling.style.display = "block";
    }
    // onChange() {
    //   console.log("submit change");
    // }
  };

  // src/modules/dark.js
  var Dark = class {
    wrapper = document.body;
    constructor() {
      hey_default.on("PAGE", () => this.handlePage());
      this.handlePage();
    }
    handlePage() {
      if (this.observer) {
        this.observer.stop();
        this.observer = null;
        this.wrapper.classList.remove("darksection");
      }
      const section = document.querySelector(`[data-color="dark"]`);
      if (section) {
        this.observer = new Observe(section, {
          config: {
            threshold: 0,
            autoStart: true
          },
          cb: {
            in: () => {
              this.wrapper.classList.add("darksection");
            },
            out: () => {
              this.wrapper.classList.remove("darksection");
            }
          }
        });
      }
    }
  };

  // src/modules/anchor.js
  var Anchor = class {
    constructor(el) {
      this.el = el;
      this.target = el.getAttribute("data-anchor");
      this.el.onclick = () => {
        App.scroll.to(document.getElementById(this.target));
      };
    }
    destroy() {
      console.log("destroy");
    }
  };

  // src/modules/dom.js
  var lib = [
    {
      selector: '[data-a="char"],[data-a="word"],[data-a="line"]',
      class: Text
    },
    {
      selector: '[data-embla="wrapper"]',
      class: Slider
    },
    {
      selector: '[data-tabs="w"]',
      class: Dropdowns
    },
    {
      selector: '[data-partners="w"]',
      class: Partners
    },
    {
      selector: '[data-openings="w"]',
      class: Openings
    },
    {
      selector: '[data-submit="w"]',
      class: Submit
    },
    {
      selector: "[data-anchor]",
      class: Anchor
    }
  ];
  var Dom = class {
    wrapper = document.querySelector("[data-taxi]");
    dark = new Dark();
    nav = new Nav();
    constructor() {
      this.create();
      hey_default.on("LOAD", (state) => {
        switch (state) {
          case "full":
            this.onLoad();
            break;
          case "screen":
            this.onFirstLoad();
            break;
          default:
            break;
        }
      });
    }
    resize() {
    }
    render(t) {
      this.children.forEach((child) => {
        if (child.render) child.render();
      });
    }
    get _children() {
      const arr = lib.map((item) => {
        const { selector: selector3, class: Class } = item;
        const elements = [...document.querySelectorAll(selector3)];
        if (elements.length === 0) return null;
        return elements.map((element) => new Class(element));
      });
      return arr;
    }
    create() {
      this.children = this._children.flat().filter((child) => child !== null);
      this.start();
    }
    start() {
      this.children.forEach((child) => {
        if (child.start) child.start();
      });
    }
    destroy() {
      this.children.forEach((child) => {
        if (child.destroy) child.destroy();
      });
    }
    /* -- Lifecycle */
    onFirstLoad() {
      gsap_default.to(this.wrapper, {
        autoAlpha: 1,
        duration: ANIMATION.load.duration,
        ease: ANIMATION.load.ease,
        delay: ANIMATION.load.delay
      });
    }
    onLoad() {
    }
    /* --  Pages */
    async transitionOut(page) {
      this.destroy();
      await gsap_default.to(this.wrapper, { autoAlpha: 0, duration: 0.5 });
    }
    async transitionIn(page) {
      this.create();
      await gsap_default.to(this.wrapper, { autoAlpha: 1, duration: 0.5, delay: 0.2 });
    }
  };

  // src/modules/viewport.js
  var Viewport = class {
    constructor() {
      this.resize();
    }
    resize() {
      document.documentElement.style.setProperty(
        "--100vh",
        `${window.innerHeight}px`
      );
    }
  };

  // node_modules/.pnpm/lenis@1.1.19/node_modules/lenis/dist/lenis.mjs
  var version = "1.1.19";
  function clamp3(min, input, max) {
    return Math.max(min, Math.min(input, max));
  }
  function lerp(x, y, t) {
    return (1 - t) * x + t * y;
  }
  function damp(x, y, lambda, deltaTime) {
    return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
  }
  function modulo(n, d) {
    return (n % d + d) % d;
  }
  var Animate = class {
    isRunning = false;
    value = 0;
    from = 0;
    to = 0;
    currentTime = 0;
    // These are instanciated in the fromTo method
    lerp;
    duration;
    easing;
    onUpdate;
    /**
     * Advance the animation by the given delta time
     *
     * @param deltaTime - The time in seconds to advance the animation
     */
    advance(deltaTime) {
      if (!this.isRunning) return;
      let completed = false;
      if (this.duration && this.easing) {
        this.currentTime += deltaTime;
        const linearProgress = clamp3(0, this.currentTime / this.duration, 1);
        completed = linearProgress >= 1;
        const easedProgress = completed ? 1 : this.easing(linearProgress);
        this.value = this.from + (this.to - this.from) * easedProgress;
      } else if (this.lerp) {
        this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
        if (Math.round(this.value) === this.to) {
          this.value = this.to;
          completed = true;
        }
      } else {
        this.value = this.to;
        completed = true;
      }
      if (completed) {
        this.stop();
      }
      this.onUpdate?.(this.value, completed);
    }
    /** Stop the animation */
    stop() {
      this.isRunning = false;
    }
    /**
     * Set up the animation from a starting value to an ending value
     * with optional parameters for lerping, duration, easing, and onUpdate callback
     *
     * @param from - The starting value
     * @param to - The ending value
     * @param options - Options for the animation
     */
    fromTo(from, to, { lerp: lerp22, duration, easing, onStart, onUpdate }) {
      this.from = this.value = from;
      this.to = to;
      this.lerp = lerp22;
      this.duration = duration;
      this.easing = easing;
      this.currentTime = 0;
      this.isRunning = true;
      onStart?.();
      this.onUpdate = onUpdate;
    }
  };
  function debounce(callback, delay) {
    let timer;
    return function(...args) {
      let context3 = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = void 0;
        callback.apply(context3, args);
      }, delay);
    };
  }
  var Dimensions = class {
    constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
      this.wrapper = wrapper;
      this.content = content;
      if (autoResize) {
        this.debouncedResize = debounce(this.resize, debounceValue);
        if (this.wrapper instanceof Window) {
          window.addEventListener("resize", this.debouncedResize, false);
        } else {
          this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
          this.wrapperResizeObserver.observe(this.wrapper);
        }
        this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
        this.contentResizeObserver.observe(this.content);
      }
      this.resize();
    }
    width = 0;
    height = 0;
    scrollHeight = 0;
    scrollWidth = 0;
    // These are instanciated in the constructor as they need information from the options
    debouncedResize;
    wrapperResizeObserver;
    contentResizeObserver;
    destroy() {
      this.wrapperResizeObserver?.disconnect();
      this.contentResizeObserver?.disconnect();
      if (this.wrapper === window && this.debouncedResize) {
        window.removeEventListener("resize", this.debouncedResize, false);
      }
    }
    resize = () => {
      this.onWrapperResize();
      this.onContentResize();
    };
    onWrapperResize = () => {
      if (this.wrapper instanceof Window) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      } else {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;
      }
    };
    onContentResize = () => {
      if (this.wrapper instanceof Window) {
        this.scrollHeight = this.content.scrollHeight;
        this.scrollWidth = this.content.scrollWidth;
      } else {
        this.scrollHeight = this.wrapper.scrollHeight;
        this.scrollWidth = this.wrapper.scrollWidth;
      }
    };
    get limit() {
      return {
        x: this.scrollWidth - this.width,
        y: this.scrollHeight - this.height
      };
    }
  };
  var Emitter = class {
    events = {};
    /**
     * Emit an event with the given data
     * @param event Event name
     * @param args Data to pass to the event handlers
     */
    emit(event, ...args) {
      let callbacks = this.events[event] || [];
      for (let i = 0, length3 = callbacks.length; i < length3; i++) {
        callbacks[i]?.(...args);
      }
    }
    /**
     * Add a callback to the event
     * @param event Event name
     * @param cb Callback function
     * @returns Unsubscribe function
     */
    on(event, cb) {
      this.events[event]?.push(cb) || (this.events[event] = [cb]);
      return () => {
        this.events[event] = this.events[event]?.filter((i) => cb !== i);
      };
    }
    /**
     * Remove a callback from the event
     * @param event Event name
     * @param callback Callback function
     */
    off(event, callback) {
      this.events[event] = this.events[event]?.filter((i) => callback !== i);
    }
    /**
     * Remove all event listeners and clean up
     */
    destroy() {
      this.events = {};
    }
  };
  var LINE_HEIGHT = 100 / 6;
  var listenerOptions = { passive: false };
  var VirtualScroll = class {
    constructor(element, options = { wheelMultiplier: 1, touchMultiplier: 1 }) {
      this.element = element;
      this.options = options;
      window.addEventListener("resize", this.onWindowResize, false);
      this.onWindowResize();
      this.element.addEventListener("wheel", this.onWheel, listenerOptions);
      this.element.addEventListener(
        "touchstart",
        this.onTouchStart,
        listenerOptions
      );
      this.element.addEventListener(
        "touchmove",
        this.onTouchMove,
        listenerOptions
      );
      this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
    }
    touchStart = {
      x: 0,
      y: 0
    };
    lastDelta = {
      x: 0,
      y: 0
    };
    window = {
      width: 0,
      height: 0
    };
    emitter = new Emitter();
    /**
     * Add an event listener for the given event and callback
     *
     * @param event Event name
     * @param callback Callback function
     */
    on(event, callback) {
      return this.emitter.on(event, callback);
    }
    /** Remove all event listeners and clean up */
    destroy() {
      this.emitter.destroy();
      window.removeEventListener("resize", this.onWindowResize, false);
      this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
      this.element.removeEventListener(
        "touchstart",
        this.onTouchStart,
        listenerOptions
      );
      this.element.removeEventListener(
        "touchmove",
        this.onTouchMove,
        listenerOptions
      );
      this.element.removeEventListener(
        "touchend",
        this.onTouchEnd,
        listenerOptions
      );
    }
    /**
     * Event handler for 'touchstart' event
     *
     * @param event Touch event
     */
    onTouchStart = (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: 0,
        y: 0
      };
      this.emitter.emit("scroll", {
        deltaX: 0,
        deltaY: 0,
        event
      });
    };
    /** Event handler for 'touchmove' event */
    onTouchMove = (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
      const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: deltaX,
        y: deltaY
      };
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    };
    onTouchEnd = (event) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event
      });
    };
    /** Event handler for 'wheel' event */
    onWheel = (event) => {
      let { deltaX, deltaY, deltaMode } = event;
      const multiplierX = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.width : 1;
      const multiplierY = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.height : 1;
      deltaX *= multiplierX;
      deltaY *= multiplierY;
      deltaX *= this.options.wheelMultiplier;
      deltaY *= this.options.wheelMultiplier;
      this.emitter.emit("scroll", { deltaX, deltaY, event });
    };
    onWindowResize = () => {
      this.window = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };
  };
  var Lenis = class {
    _isScrolling = false;
    // true when scroll is animating
    _isStopped = false;
    // true if user should not be able to scroll - enable/disable programmatically
    _isLocked = false;
    // same as isStopped but enabled/disabled when scroll reaches target
    _preventNextNativeScrollEvent = false;
    _resetVelocityTimeout = null;
    __rafID = null;
    /**
     * Whether or not the user is touching the screen
     */
    isTouching;
    /**
     * The time in ms since the lenis instance was created
     */
    time = 0;
    /**
     * User data that will be forwarded through the scroll event
     *
     * @example
     * lenis.scrollTo(100, {
     *   userData: {
     *     foo: 'bar'
     *   }
     * })
     */
    userData = {};
    /**
     * The last velocity of the scroll
     */
    lastVelocity = 0;
    /**
     * The current velocity of the scroll
     */
    velocity = 0;
    /**
     * The direction of the scroll
     */
    direction = 0;
    /**
     * The options passed to the lenis instance
     */
    options;
    /**
     * The target scroll value
     */
    targetScroll;
    /**
     * The animated scroll value
     */
    animatedScroll;
    // These are instanciated here as they don't need information from the options
    animate = new Animate();
    emitter = new Emitter();
    // These are instanciated in the constructor as they need information from the options
    dimensions;
    // This is not private because it's used in the Snap class
    virtualScroll;
    constructor({
      wrapper = window,
      content = document.documentElement,
      eventsTarget = wrapper,
      smoothWheel = true,
      syncTouch = false,
      syncTouchLerp = 0.075,
      touchInertiaMultiplier = 35,
      duration,
      // in seconds
      easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: lerp22 = 0.1,
      infinite = false,
      orientation = "vertical",
      // vertical, horizontal
      gestureOrientation = "vertical",
      // vertical, horizontal, both
      touchMultiplier = 1,
      wheelMultiplier = 1,
      autoResize = true,
      prevent,
      virtualScroll,
      overscroll = true,
      autoRaf = false,
      anchors = false,
      __experimental__naiveDimensions = false
    } = {}) {
      window.lenisVersion = version;
      if (!wrapper || wrapper === document.documentElement) {
        wrapper = window;
      }
      this.options = {
        wrapper,
        content,
        eventsTarget,
        smoothWheel,
        syncTouch,
        syncTouchLerp,
        touchInertiaMultiplier,
        duration,
        easing,
        lerp: lerp22,
        infinite,
        gestureOrientation,
        orientation,
        touchMultiplier,
        wheelMultiplier,
        autoResize,
        prevent,
        virtualScroll,
        overscroll,
        autoRaf,
        anchors,
        __experimental__naiveDimensions
      };
      this.dimensions = new Dimensions(wrapper, content, { autoResize });
      this.updateClassName();
      this.targetScroll = this.animatedScroll = this.actualScroll;
      this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false);
      this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, {
        capture: true
      });
      if (this.options.anchors && this.options.wrapper === window) {
        this.options.wrapper.addEventListener(
          "click",
          this.onClick,
          false
        );
      }
      this.options.wrapper.addEventListener(
        "pointerdown",
        this.onPointerDown,
        false
      );
      this.virtualScroll = new VirtualScroll(eventsTarget, {
        touchMultiplier,
        wheelMultiplier
      });
      this.virtualScroll.on("scroll", this.onVirtualScroll);
      if (this.options.autoRaf) {
        this.__rafID = requestAnimationFrame(this.raf);
      }
    }
    /**
     * Destroy the lenis instance, remove all event listeners and clean up the class name
     */
    destroy() {
      this.emitter.destroy();
      this.options.wrapper.removeEventListener(
        "scroll",
        this.onNativeScroll,
        false
      );
      this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, {
        capture: true
      });
      this.options.wrapper.removeEventListener(
        "pointerdown",
        this.onPointerDown,
        false
      );
      if (this.options.anchors && this.options.wrapper === window) {
        this.options.wrapper.removeEventListener(
          "click",
          this.onClick,
          false
        );
      }
      this.virtualScroll.destroy();
      this.dimensions.destroy();
      this.cleanUpClassName();
      if (this.__rafID) {
        cancelAnimationFrame(this.__rafID);
      }
    }
    on(event, callback) {
      return this.emitter.on(event, callback);
    }
    off(event, callback) {
      return this.emitter.off(event, callback);
    }
    onScrollEnd = (e) => {
      if (!(e instanceof CustomEvent)) {
        if (this.isScrolling === "smooth" || this.isScrolling === false) {
          e.stopPropagation();
        }
      }
    };
    dispatchScrollendEvent = () => {
      this.options.wrapper.dispatchEvent(
        new CustomEvent("scrollend", {
          bubbles: this.options.wrapper === window,
          // cancelable: false,
          detail: {
            lenisScrollEnd: true
          }
        })
      );
    };
    setScroll(scroll) {
      if (this.isHorizontal) {
        this.options.wrapper.scrollTo({ left: scroll, behavior: "instant" });
      } else {
        this.options.wrapper.scrollTo({ top: scroll, behavior: "instant" });
      }
    }
    onClick = (event) => {
      const path = event.composedPath();
      const anchor = path.find(
        (node) => node instanceof HTMLAnchorElement && node.getAttribute("href")?.startsWith("#")
      );
      if (anchor) {
        const id = anchor.getAttribute("href");
        if (id) {
          const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
          this.scrollTo(id, options);
        }
      }
    };
    onPointerDown = (event) => {
      if (event.button === 1) {
        this.reset();
      }
    };
    onVirtualScroll = (data) => {
      if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false)
        return;
      const { deltaX, deltaY, event } = data;
      this.emitter.emit("virtual-scroll", { deltaX, deltaY, event });
      if (event.ctrlKey) return;
      if (event.lenisStopPropagation) return;
      const isTouch = event.type.includes("touch");
      const isWheel = event.type.includes("wheel");
      this.isTouching = event.type === "touchstart" || event.type === "touchmove";
      const isClickOrTap = deltaX === 0 && deltaY === 0;
      const isTapToStop = this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked;
      if (isTapToStop) {
        this.reset();
        return;
      }
      const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
      if (isClickOrTap || isUnknownGesture) {
        return;
      }
      let composedPath = event.composedPath();
      composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
      const prevent = this.options.prevent;
      if (!!composedPath.find(
        (node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel"))
      ))
        return;
      if (this.isStopped || this.isLocked) {
        event.preventDefault();
        return;
      }
      const isSmooth = this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel;
      if (!isSmooth) {
        this.isScrolling = "native";
        this.animate.stop();
        event.lenisStopPropagation = true;
        return;
      }
      let delta = deltaY;
      if (this.options.gestureOrientation === "both") {
        delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      } else if (this.options.gestureOrientation === "horizontal") {
        delta = deltaX;
      }
      if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) {
        event.lenisStopPropagation = true;
      }
      event.preventDefault();
      const isSyncTouch = isTouch && this.options.syncTouch;
      const isTouchEnd = isTouch && event.type === "touchend";
      const hasTouchInertia = isTouchEnd && Math.abs(delta) > 5;
      if (hasTouchInertia) {
        delta = this.velocity * this.options.touchInertiaMultiplier;
      }
      this.scrollTo(this.targetScroll + delta, {
        programmatic: false,
        ...isSyncTouch ? {
          lerp: hasTouchInertia ? this.options.syncTouchLerp : 1
          // immediate: !hasTouchInertia,
        } : {
          lerp: this.options.lerp,
          duration: this.options.duration,
          easing: this.options.easing
        }
      });
    };
    /**
     * Force lenis to recalculate the dimensions
     */
    resize() {
      this.dimensions.resize();
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.emit();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    onNativeScroll = () => {
      if (this._resetVelocityTimeout !== null) {
        clearTimeout(this._resetVelocityTimeout);
        this._resetVelocityTimeout = null;
      }
      if (this._preventNextNativeScrollEvent) {
        this._preventNextNativeScrollEvent = false;
        return;
      }
      if (this.isScrolling === false || this.isScrolling === "native") {
        const lastScroll = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll;
        this.lastVelocity = this.velocity;
        this.velocity = this.animatedScroll - lastScroll;
        this.direction = Math.sign(
          this.animatedScroll - lastScroll
        );
        if (!this.isStopped) {
          this.isScrolling = "native";
        }
        this.emit();
        if (this.velocity !== 0) {
          this._resetVelocityTimeout = setTimeout(() => {
            this.lastVelocity = this.velocity;
            this.velocity = 0;
            this.isScrolling = false;
            this.emit();
          }, 400);
        }
      }
    };
    reset() {
      this.isLocked = false;
      this.isScrolling = false;
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.lastVelocity = this.velocity = 0;
      this.animate.stop();
    }
    /**
     * Start lenis scroll after it has been stopped
     */
    start() {
      if (!this.isStopped) return;
      this.reset();
      this.isStopped = false;
    }
    /**
     * Stop lenis scroll
     */
    stop() {
      if (this.isStopped) return;
      this.reset();
      this.isStopped = true;
    }
    /**
     * RequestAnimationFrame for lenis
     *
     * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
     */
    raf = (time) => {
      const deltaTime = time - (this.time || time);
      this.time = time;
      this.animate.advance(deltaTime * 1e-3);
      if (this.options.autoRaf) {
        this.__rafID = requestAnimationFrame(this.raf);
      }
    };
    /**
     * Scroll to a target value
     *
     * @param target The target value to scroll to
     * @param options The options for the scroll
     *
     * @example
     * lenis.scrollTo(100, {
     *   offset: 100,
     *   duration: 1,
     *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
     *   lerp: 0.1,
     *   onStart: () => {
     *     console.log('onStart')
     *   },
     *   onComplete: () => {
     *     console.log('onComplete')
     *   },
     * })
     */
    scrollTo(target, {
      offset = 0,
      immediate = false,
      lock = false,
      duration = this.options.duration,
      easing = this.options.easing,
      lerp: lerp22 = this.options.lerp,
      onStart,
      onComplete,
      force = false,
      // scroll even if stopped
      programmatic = true,
      // called from outside of the class
      userData
    } = {}) {
      if ((this.isStopped || this.isLocked) && !force) return;
      if (typeof target === "string" && ["top", "left", "start"].includes(target)) {
        target = 0;
      } else if (typeof target === "string" && ["bottom", "right", "end"].includes(target)) {
        target = this.limit;
      } else {
        let node;
        if (typeof target === "string") {
          node = document.querySelector(target);
        } else if (target instanceof HTMLElement && target?.nodeType) {
          node = target;
        }
        if (node) {
          if (this.options.wrapper !== window) {
            const wrapperRect = this.rootElement.getBoundingClientRect();
            offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
          }
          const rect = node.getBoundingClientRect();
          target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
        }
      }
      if (typeof target !== "number") return;
      target += offset;
      target = Math.round(target);
      if (this.options.infinite) {
        if (programmatic) {
          this.targetScroll = this.animatedScroll = this.scroll;
        }
      } else {
        target = clamp3(0, target, this.limit);
      }
      if (target === this.targetScroll) {
        onStart?.(this);
        onComplete?.(this);
        return;
      }
      this.userData = userData ?? {};
      if (immediate) {
        this.animatedScroll = this.targetScroll = target;
        this.setScroll(this.scroll);
        this.reset();
        this.preventNextNativeScrollEvent();
        this.emit();
        onComplete?.(this);
        this.userData = {};
        requestAnimationFrame(() => {
          this.dispatchScrollendEvent();
        });
        return;
      }
      if (!programmatic) {
        this.targetScroll = target;
      }
      this.animate.fromTo(this.animatedScroll, target, {
        duration,
        easing,
        lerp: lerp22,
        onStart: () => {
          if (lock) this.isLocked = true;
          this.isScrolling = "smooth";
          onStart?.(this);
        },
        onUpdate: (value, completed) => {
          this.isScrolling = "smooth";
          this.lastVelocity = this.velocity;
          this.velocity = value - this.animatedScroll;
          this.direction = Math.sign(this.velocity);
          this.animatedScroll = value;
          this.setScroll(this.scroll);
          if (programmatic) {
            this.targetScroll = value;
          }
          if (!completed) this.emit();
          if (completed) {
            this.reset();
            this.emit();
            onComplete?.(this);
            this.userData = {};
            requestAnimationFrame(() => {
              this.dispatchScrollendEvent();
            });
            this.preventNextNativeScrollEvent();
          }
        }
      });
    }
    preventNextNativeScrollEvent() {
      this._preventNextNativeScrollEvent = true;
      requestAnimationFrame(() => {
        this._preventNextNativeScrollEvent = false;
      });
    }
    /**
     * The root element on which lenis is instanced
     */
    get rootElement() {
      return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    /**
     * The limit which is the maximum scroll value
     */
    get limit() {
      if (this.options.__experimental__naiveDimensions) {
        if (this.isHorizontal) {
          return this.rootElement.scrollWidth - this.rootElement.clientWidth;
        } else {
          return this.rootElement.scrollHeight - this.rootElement.clientHeight;
        }
      } else {
        return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
      }
    }
    /**
     * Whether or not the scroll is horizontal
     */
    get isHorizontal() {
      return this.options.orientation === "horizontal";
    }
    /**
     * The actual scroll value
     */
    get actualScroll() {
      const wrapper = this.options.wrapper;
      return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
    }
    /**
     * The current scroll value
     */
    get scroll() {
      return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    /**
     * The progress of the scroll relative to the limit
     */
    get progress() {
      return this.limit === 0 ? 1 : this.scroll / this.limit;
    }
    /**
     * Current scroll state
     */
    get isScrolling() {
      return this._isScrolling;
    }
    set isScrolling(value) {
      if (this._isScrolling !== value) {
        this._isScrolling = value;
        this.updateClassName();
      }
    }
    /**
     * Check if lenis is stopped
     */
    get isStopped() {
      return this._isStopped;
    }
    set isStopped(value) {
      if (this._isStopped !== value) {
        this._isStopped = value;
        this.updateClassName();
      }
    }
    /**
     * Check if lenis is locked
     */
    get isLocked() {
      return this._isLocked;
    }
    set isLocked(value) {
      if (this._isLocked !== value) {
        this._isLocked = value;
        this.updateClassName();
      }
    }
    /**
     * Check if lenis is smooth scrolling
     */
    get isSmooth() {
      return this.isScrolling === "smooth";
    }
    /**
     * The class name applied to the wrapper element
     */
    get className() {
      let className = "lenis";
      if (this.isStopped) className += " lenis-stopped";
      if (this.isLocked) className += " lenis-locked";
      if (this.isScrolling) className += " lenis-scrolling";
      if (this.isScrolling === "smooth") className += " lenis-smooth";
      return className;
    }
    updateClassName() {
      this.cleanUpClassName();
      this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
    }
    cleanUpClassName() {
      this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
    }
  };

  // src/util/easings.js
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  // src/modules/scroll.js
  var lenisDefault = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
  function handleEditor(onEditorView = null) {
    const webflowLs = localStorage.getItem("WebflowEditor");
    if (!Webflow) return;
    if (Webflow.env("editor") !== void 0 || webflowLs !== null) {
      if (onEditorView !== null) onEditorView();
      console.log("Webflow Editor View");
      return true;
    } else {
      return false;
    }
  }
  var Scroll = class extends Lenis {
    constructor() {
      super({
        wrapper: document.querySelector(".w"),
        duration: 1,
        smoothWheel: false,
        easing: lenisDefault,
        orientation: "vertical",
        smoothTouch: false,
        syncTouch: false,
        touchMultiplier: 1
      });
      this.isActive = true;
      this.callbacks = [];
      this.init();
      window.sscroll = this;
      queueMicrotask(() => this.scrollTo(0, { offset: 0, immediate: true }));
      handleEditor(() => this.destroy());
    }
    init() {
      this.y = window.scrollY;
      this.max = window.innerHeight;
      this.speed = 0;
      this.percent = this.y / (document.body.scrollHeight - window.innerHeight);
      this.on("scroll", ({ scroll, limit, velocity, progress }) => {
        this.y = scroll || 0;
        this.max = limit || window.innerHeight;
        this.speed = velocity || 0;
        this.percent = progress || 0;
        this.callbackRaf();
      });
    }
    to(target) {
      this.scrollTo(target, {
        offset: 0,
        duration: 0.8,
        easing: easeOutExpo,
        immediate: false
      });
    }
    top() {
      this.scrollTo(0, {
        offset: 0,
        immediate: true
      });
    }
    // resize() {}
    render(t) {
      if (!this.isActive) return;
      this.raf(t);
    }
    set active(value) {
      this.isActive = value;
    }
    callbackRaf() {
      this.callbacks.forEach((cb) => cb.callback(this));
    }
    subscribe(callback, id = Symbol()) {
      this.callbacks.push({ callback, id });
      return this.unsubscribe.bind(this, id);
    }
    unsubscribe(id) {
      this.callbacks = this.callbacks.filter((cb) => cb.id !== id);
    }
    unsunbscribeAll() {
      this.callbacks = [];
    }
  };

  // node_modules/.pnpm/selector-set@1.1.5/node_modules/selector-set/selector-set.next.js
  function SelectorSet() {
    if (!(this instanceof SelectorSet)) {
      return new SelectorSet();
    }
    this.size = 0;
    this.uid = 0;
    this.selectors = [];
    this.selectorObjects = {};
    this.indexes = Object.create(this.indexes);
    this.activeIndexes = [];
  }
  var docElem = window.document.documentElement;
  var matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector;
  SelectorSet.prototype.matchesSelector = function(el, selector3) {
    return matches.call(el, selector3);
  };
  SelectorSet.prototype.querySelectorAll = function(selectors, context3) {
    return context3.querySelectorAll(selectors);
  };
  SelectorSet.prototype.indexes = [];
  var idRe = /^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
  SelectorSet.prototype.indexes.push({
    name: "ID",
    selector: function matchIdSelector(sel) {
      var m;
      if (m = sel.match(idRe)) {
        return m[0].slice(1);
      }
    },
    element: function getElementId(el) {
      if (el.id) {
        return [el.id];
      }
    }
  });
  var classRe = /^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
  SelectorSet.prototype.indexes.push({
    name: "CLASS",
    selector: function matchClassSelector(sel) {
      var m;
      if (m = sel.match(classRe)) {
        return m[0].slice(1);
      }
    },
    element: function getElementClassNames(el) {
      var className = el.className;
      if (className) {
        if (typeof className === "string") {
          return className.split(/\s/);
        } else if (typeof className === "object" && "baseVal" in className) {
          return className.baseVal.split(/\s/);
        }
      }
    }
  });
  var tagRe = /^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
  SelectorSet.prototype.indexes.push({
    name: "TAG",
    selector: function matchTagSelector(sel) {
      var m;
      if (m = sel.match(tagRe)) {
        return m[0].toUpperCase();
      }
    },
    element: function getElementTagName(el) {
      return [el.nodeName.toUpperCase()];
    }
  });
  SelectorSet.prototype.indexes["default"] = {
    name: "UNIVERSAL",
    selector: function() {
      return true;
    },
    element: function() {
      return [true];
    }
  };
  var Map2;
  if (typeof window.Map === "function") {
    Map2 = window.Map;
  } else {
    Map2 = function() {
      function Map3() {
        this.map = {};
      }
      Map3.prototype.get = function(key) {
        return this.map[key + " "];
      };
      Map3.prototype.set = function(key, value) {
        this.map[key + " "] = value;
      };
      return Map3;
    }();
  }
  var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
  function parseSelectorIndexes(allIndexes, selector3) {
    allIndexes = allIndexes.slice(0).concat(allIndexes["default"]);
    var allIndexesLen = allIndexes.length, i, j, m, dup, rest = selector3, key, index, indexes = [];
    do {
      chunker.exec("");
      if (m = chunker.exec(rest)) {
        rest = m[3];
        if (m[2] || !rest) {
          for (i = 0; i < allIndexesLen; i++) {
            index = allIndexes[i];
            if (key = index.selector(m[1])) {
              j = indexes.length;
              dup = false;
              while (j--) {
                if (indexes[j].index === index && indexes[j].key === key) {
                  dup = true;
                  break;
                }
              }
              if (!dup) {
                indexes.push({ index, key });
              }
              break;
            }
          }
        }
      }
    } while (m);
    return indexes;
  }
  function findByPrototype(ary, proto) {
    var i, len, item;
    for (i = 0, len = ary.length; i < len; i++) {
      item = ary[i];
      if (proto.isPrototypeOf(item)) {
        return item;
      }
    }
  }
  SelectorSet.prototype.logDefaultIndexUsed = function() {
  };
  SelectorSet.prototype.add = function(selector3, data) {
    var obj, i, indexProto, key, index, objs, selectorIndexes, selectorIndex, indexes = this.activeIndexes, selectors = this.selectors, selectorObjects = this.selectorObjects;
    if (typeof selector3 !== "string") {
      return;
    }
    obj = {
      id: this.uid++,
      selector: selector3,
      data
    };
    selectorObjects[obj.id] = obj;
    selectorIndexes = parseSelectorIndexes(this.indexes, selector3);
    for (i = 0; i < selectorIndexes.length; i++) {
      selectorIndex = selectorIndexes[i];
      key = selectorIndex.key;
      indexProto = selectorIndex.index;
      index = findByPrototype(indexes, indexProto);
      if (!index) {
        index = Object.create(indexProto);
        index.map = new Map2();
        indexes.push(index);
      }
      if (indexProto === this.indexes["default"]) {
        this.logDefaultIndexUsed(obj);
      }
      objs = index.map.get(key);
      if (!objs) {
        objs = [];
        index.map.set(key, objs);
      }
      objs.push(obj);
    }
    this.size++;
    selectors.push(selector3);
  };
  SelectorSet.prototype.remove = function(selector3, data) {
    if (typeof selector3 !== "string") {
      return;
    }
    var selectorIndexes, selectorIndex, i, j, k, selIndex, objs, obj, indexes = this.activeIndexes, selectors = this.selectors = [], selectorObjects = this.selectorObjects, removedIds = {}, removeAll = arguments.length === 1;
    selectorIndexes = parseSelectorIndexes(this.indexes, selector3);
    for (i = 0; i < selectorIndexes.length; i++) {
      selectorIndex = selectorIndexes[i];
      j = indexes.length;
      while (j--) {
        selIndex = indexes[j];
        if (selectorIndex.index.isPrototypeOf(selIndex)) {
          objs = selIndex.map.get(selectorIndex.key);
          if (objs) {
            k = objs.length;
            while (k--) {
              obj = objs[k];
              if (obj.selector === selector3 && (removeAll || obj.data === data)) {
                objs.splice(k, 1);
                removedIds[obj.id] = true;
              }
            }
          }
          break;
        }
      }
    }
    for (i in removedIds) {
      delete selectorObjects[i];
      this.size--;
    }
    for (i in selectorObjects) {
      selectors.push(selectorObjects[i].selector);
    }
  };
  function sortById(a, b) {
    return a.id - b.id;
  }
  SelectorSet.prototype.queryAll = function(context3) {
    if (!this.selectors.length) {
      return [];
    }
    var matches2 = {}, results = [];
    var els = this.querySelectorAll(this.selectors.join(", "), context3);
    var i, j, len, len2, el, m, match, obj;
    for (i = 0, len = els.length; i < len; i++) {
      el = els[i];
      m = this.matches(el);
      for (j = 0, len2 = m.length; j < len2; j++) {
        obj = m[j];
        if (!matches2[obj.id]) {
          match = {
            id: obj.id,
            selector: obj.selector,
            data: obj.data,
            elements: []
          };
          matches2[obj.id] = match;
          results.push(match);
        } else {
          match = matches2[obj.id];
        }
        match.elements.push(el);
      }
    }
    return results.sort(sortById);
  };
  SelectorSet.prototype.matches = function(el) {
    if (!el) {
      return [];
    }
    var i, j, k, len, len2, len3, index, keys, objs, obj, id;
    var indexes = this.activeIndexes, matchedIds = {}, matches2 = [];
    for (i = 0, len = indexes.length; i < len; i++) {
      index = indexes[i];
      keys = index.element(el);
      if (keys) {
        for (j = 0, len2 = keys.length; j < len2; j++) {
          if (objs = index.map.get(keys[j])) {
            for (k = 0, len3 = objs.length; k < len3; k++) {
              obj = objs[k];
              id = obj.id;
              if (!matchedIds[id] && this.matchesSelector(el, obj.selector)) {
                matchedIds[id] = true;
                matches2.push(obj);
              }
            }
          }
        }
      }
    }
    return matches2.sort(sortById);
  };

  // node_modules/.pnpm/@unseenco+e@2.4.0/node_modules/@unseenco/e/src/utils.js
  var eventTypes = {};
  var listeners = {};
  var nonBubblers = ["mouseenter", "mouseleave", "pointerenter", "pointerleave", "blur", "focus"];
  function makeBusStack(event) {
    if (listeners[event] === void 0) {
      listeners[event] = /* @__PURE__ */ new Set();
    }
  }
  function triggerBus(event, args) {
    if (listeners[event]) {
      listeners[event].forEach((cb) => {
        cb(...args);
      });
    }
  }
  function maybeRunQuerySelector(el) {
    return typeof el === "string" ? document.querySelectorAll(el) : el;
  }
  function handleDelegation(e) {
    let matches2 = traverse(eventTypes[e.type], e.target);
    if (matches2.length) {
      for (let i = 0; i < matches2.length; i++) {
        for (let i2 = 0; i2 < matches2[i].stack.length; i2++) {
          if (nonBubblers.indexOf(e.type) !== -1) {
            addDelegateTarget(e, matches2[i].delegatedTarget);
            if (e.target === matches2[i].delegatedTarget) {
              matches2[i].stack[i2].data(e);
            }
          } else {
            addDelegateTarget(e, matches2[i].delegatedTarget);
            matches2[i].stack[i2].data(e);
          }
        }
      }
    }
  }
  function traverse(listeners2, target) {
    const queue = [];
    let node = target;
    do {
      if (node.nodeType !== 1) {
        break;
      }
      const matches2 = listeners2.matches(node);
      if (matches2.length) {
        queue.push({ delegatedTarget: node, stack: matches2 });
      }
    } while (node = node.parentElement);
    return queue;
  }
  function addDelegateTarget(event, delegatedTarget) {
    Object.defineProperty(event, "currentTarget", {
      configurable: true,
      enumerable: true,
      get: () => delegatedTarget
    });
  }
  function clone(object) {
    const copy6 = {};
    for (const key in object) {
      copy6[key] = [...object[key]];
    }
    return copy6;
  }

  // node_modules/.pnpm/@unseenco+e@2.4.0/node_modules/@unseenco/e/src/e.js
  var E = class {
    /**
     * Binds all provided methods to a provided context.
     *
     * @param {object} context
     * @param {string[]} [methods] Optional.
     */
    bindAll(context3, methods) {
      if (!methods) {
        methods = Object.getOwnPropertyNames(Object.getPrototypeOf(context3));
      }
      for (let i = 0; i < methods.length; i++) {
        context3[methods[i]] = context3[methods[i]].bind(context3);
      }
    }
    /**
     * Bind event to a string, NodeList, or element.
     *
     * @param {string} event
     * @param {string|NodeList|NodeListOf<Element>|HTMLElement|HTMLElement[]|Window|Document|function} el
     * @param {*} [callback]
     * @param {{}|boolean} [options]
     */
    on(event, el, callback, options) {
      const events = event.split(" ");
      for (let i = 0; i < events.length; i++) {
        if (typeof el === "function" && callback === void 0) {
          makeBusStack(events[i]);
          listeners[events[i]].add(el);
          continue;
        }
        if (el.nodeType && el.nodeType === 1 || el === window || el === document) {
          el.addEventListener(events[i], callback, options);
          continue;
        }
        el = maybeRunQuerySelector(el);
        for (let n = 0; n < el.length; n++) {
          el[n].addEventListener(events[i], callback, options);
        }
      }
    }
    /**
     * Add a delegated event.
     *
     * @param {string} event
     * @param {string|NodeList|HTMLElement|Element} delegate
     * @param {*} [callback]
     */
    delegate(event, delegate, callback) {
      const events = event.split(" ");
      for (let i = 0; i < events.length; i++) {
        let map2 = eventTypes[events[i]];
        if (map2 === void 0) {
          map2 = new SelectorSet();
          eventTypes[events[i]] = map2;
          if (nonBubblers.indexOf(events[i]) !== -1) {
            document.addEventListener(events[i], handleDelegation, true);
          } else {
            document.addEventListener(events[i], handleDelegation);
          }
        }
        map2.add(delegate, callback);
      }
    }
    /**
     * Remove a callback from a DOM element, or one or all Bus events.
     *
     * @param {string} event
     * @param {string|NodeList|HTMLElement|Element|Window|undefined} [el]
     * @param {*} [callback]
     * @param {{}|boolean} [options]
     */
    off(event, el, callback, options) {
      const events = event.split(" ");
      for (let i = 0; i < events.length; i++) {
        if (el === void 0) {
          listeners[events[i]]?.clear();
          continue;
        }
        if (typeof el === "function") {
          makeBusStack(events[i]);
          listeners[events[i]].delete(el);
          continue;
        }
        const map2 = eventTypes[events[i]];
        if (map2 !== void 0) {
          map2.remove(el, callback);
          if (map2.size === 0) {
            delete eventTypes[events[i]];
            if (nonBubblers.indexOf(events[i]) !== -1) {
              document.removeEventListener(events[i], handleDelegation, true);
            } else {
              document.removeEventListener(events[i], handleDelegation);
            }
            continue;
          }
        }
        if (el.removeEventListener !== void 0) {
          el.removeEventListener(events[i], callback, options);
          continue;
        }
        el = maybeRunQuerySelector(el);
        for (let n = 0; n < el.length; n++) {
          el[n].removeEventListener(events[i], callback, options);
        }
      }
    }
    /**
     * Emit a Bus event.
     *
     * @param {string} event
     * @param {...*} args
     */
    emit(event, ...args) {
      triggerBus(event, args);
    }
    /**
     * Return a clone of the delegated event stack for debugging.
     *
     * @returns {Object.<string, array>}
     */
    debugDelegated() {
      return JSON.parse(JSON.stringify(eventTypes));
    }
    /**
     * Return a clone of the bus event stack for debugging.
     *
     * @returns {Object.<string, array>}
     */
    debugBus() {
      return clone(listeners);
    }
    /**
     * Checks if a given bus event has listeners.
     *
     * @param {string} event
     * @returns {boolean}
     */
    hasBus(event) {
      return this.debugBus().hasOwnProperty(event);
    }
  };
  var instance = new E();
  var e_default = instance;

  // node_modules/.pnpm/@unseenco+taxi@1.8.0/node_modules/@unseenco/taxi/src/helpers.js
  var parser = new DOMParser();
  function parseDom(html) {
    return typeof html === "string" ? parser.parseFromString(html, "text/html") : html;
  }
  function processUrl(url) {
    const details = new URL(url, window.location.origin);
    const normalized = details.hash.length ? url.replace(details.hash, "") : null;
    return {
      hasHash: details.hash.length > 0,
      pathname: details.pathname.replace(/\/+$/, ""),
      host: details.host,
      search: details.search,
      raw: url,
      href: normalized || details.href
    };
  }
  function reloadElement(node, elementType) {
    node.parentNode.replaceChild(duplicateElement(node, elementType), node);
  }
  function appendElement(node, elementType) {
    const target = node.parentNode.tagName === "HEAD" ? document.head : document.body;
    target.appendChild(duplicateElement(node, elementType));
  }
  function duplicateElement(node, elementType) {
    const replacement = document.createElement(elementType);
    for (let k = 0; k < node.attributes.length; k++) {
      const attr = node.attributes[k];
      replacement.setAttribute(attr.nodeName, attr.nodeValue);
    }
    if (node.innerHTML) {
      replacement.innerHTML = node.innerHTML;
    }
    return replacement;
  }

  // node_modules/.pnpm/@unseenco+taxi@1.8.0/node_modules/@unseenco/taxi/src/Transition.js
  var Transition = class {
    /**
     * @param {{wrapper: HTMLElement}} props
     */
    constructor({ wrapper }) {
      this.wrapper = wrapper;
    }
    /**
     * @param {{ from: HTMLElement|Element, trigger: string|HTMLElement|false }} props
     * @return {Promise<void>}
     */
    leave(props) {
      return new Promise((resolve) => {
        this.onLeave({ ...props, done: resolve });
      });
    }
    /**
     * @param {{ to: HTMLElement|Element, trigger: string|HTMLElement|false }} props
     * @return {Promise<void>}
     */
    enter(props) {
      return new Promise((resolve) => {
        this.onEnter({ ...props, done: resolve });
      });
    }
    /**
     * Handle the transition leaving the previous page.
     * @param {{from: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
     */
    onLeave({ from, trigger, done }) {
      done();
    }
    /**
     * Handle the transition entering the next page.
     * @param {{to: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
     */
    onEnter({ to, trigger, done }) {
      done();
    }
  };

  // node_modules/.pnpm/@unseenco+taxi@1.8.0/node_modules/@unseenco/taxi/src/Renderer.js
  var Renderer = class {
    /**
     * @param {{content: HTMLElement|Element, page: Document|Node, title: string, wrapper: Element}} props
     */
    constructor({ content, page, title, wrapper }) {
      this._contentString = content.outerHTML;
      this._DOM = null;
      this.page = page;
      this.title = title;
      this.wrapper = wrapper;
      this.content = this.wrapper.lastElementChild;
    }
    onEnter() {
    }
    onEnterCompleted() {
    }
    onLeave() {
    }
    onLeaveCompleted() {
    }
    initialLoad() {
      this.onEnter();
      this.onEnterCompleted();
    }
    update() {
      document.title = this.title;
      this.wrapper.appendChild(this._DOM.firstElementChild);
      this.content = this.wrapper.lastElementChild;
      this._DOM = null;
    }
    createDom() {
      if (!this._DOM) {
        this._DOM = document.createElement("div");
        this._DOM.innerHTML = this._contentString;
      }
    }
    remove() {
      this.wrapper.firstElementChild.remove();
    }
    /**
     * Called when transitioning into the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<null>}
     */
    enter(transition, trigger) {
      return new Promise((resolve) => {
        this.onEnter();
        transition.enter({ trigger, to: this.content }).then(() => {
          this.onEnterCompleted();
          resolve();
        });
      });
    }
    /**
     * Called when transitioning away from the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @param {boolean} removeOldContent
     * @return {Promise<null>}
     */
    leave(transition, trigger, removeOldContent) {
      return new Promise((resolve) => {
        this.onLeave();
        transition.leave({ trigger, from: this.content }).then(() => {
          if (removeOldContent) {
            this.remove();
          }
          this.onLeaveCompleted();
          resolve();
        });
      });
    }
  };

  // node_modules/.pnpm/@unseenco+taxi@1.8.0/node_modules/@unseenco/taxi/src/RouteStore.js
  var RouteStore = class {
    /**
     * @type {Map<string, Map<string, string>>}
     */
    data = /* @__PURE__ */ new Map();
    /**
     * @type {Map<string, RegExp>}
     */
    regexCache = /* @__PURE__ */ new Map();
    /**
     *
     * @param {string} fromPattern
     * @param {string} toPattern
     * @param {string} transition
     */
    add(fromPattern, toPattern, transition) {
      if (!this.data.has(fromPattern)) {
        this.data.set(fromPattern, /* @__PURE__ */ new Map());
        this.regexCache.set(fromPattern, new RegExp(`^${fromPattern}$`));
      }
      this.data.get(fromPattern).set(toPattern, transition);
      this.regexCache.set(toPattern, new RegExp(`^${toPattern}$`));
    }
    /**
     *
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} currentUrl
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} nextUrl
     * @return {string|null}
     */
    findMatch(currentUrl, nextUrl) {
      for (const [fromPattern, potentialMatches] of this.data) {
        if (currentUrl.pathname.match(this.regexCache.get(fromPattern))) {
          for (const [toPattern, transition] of potentialMatches) {
            if (nextUrl.pathname.match(this.regexCache.get(toPattern))) {
              return transition;
            }
          }
          break;
        }
      }
      return null;
    }
  };

  // node_modules/.pnpm/@unseenco+taxi@1.8.0/node_modules/@unseenco/taxi/src/Core.js
  var IN_PROGRESS = "A transition is currently in progress";
  var Core = class {
    isTransitioning = false;
    /**
     * @type {CacheEntry|null}
     */
    currentCacheEntry = null;
    /**
     * @type {Map<string, CacheEntry>}
     */
    cache = /* @__PURE__ */ new Map();
    /**
     * @private
     * @type {Map<string, Promise>}
     */
    activePromises = /* @__PURE__ */ new Map();
    /**
     * @param {{
     * 		links?: string,
     * 		removeOldContent?: boolean,
     * 		allowInterruption?: boolean,
     * 		bypassCache?: boolean,
     * 		enablePrefetch?: boolean,
     * 		renderers?: Object.<string, typeof Renderer>,
     * 		transitions?: Object.<string, typeof Transition>,
     * 		reloadJsFilter?: boolean|function(HTMLElement): boolean,
     * 		reloadCssFilter?: boolean|function(HTMLLinkElement): boolean
     * }} parameters
     */
    constructor(parameters = {}) {
      const {
        links = "a[href]:not([target]):not([href^=\\#]):not([data-taxi-ignore])",
        removeOldContent = true,
        allowInterruption = false,
        bypassCache = false,
        enablePrefetch = true,
        renderers = {
          default: Renderer
        },
        transitions = {
          default: Transition
        },
        reloadJsFilter = (element) => element.dataset.taxiReload !== void 0,
        reloadCssFilter = (element) => true
        //element.dataset.taxiReload !== undefined
      } = parameters;
      this.renderers = renderers;
      this.transitions = transitions;
      this.defaultRenderer = this.renderers.default || Renderer;
      this.defaultTransition = this.transitions.default || Transition;
      this.wrapper = document.querySelector("[data-taxi]");
      this.reloadJsFilter = reloadJsFilter;
      this.reloadCssFilter = reloadCssFilter;
      this.removeOldContent = removeOldContent;
      this.allowInterruption = allowInterruption;
      this.bypassCache = bypassCache;
      this.enablePrefetch = enablePrefetch;
      this.cache = /* @__PURE__ */ new Map();
      this.isPopping = false;
      this.attachEvents(links);
      this.currentLocation = processUrl(window.location.href);
      this.cache.set(this.currentLocation.href, this.createCacheEntry(document.cloneNode(true), window.location.href));
      this.currentCacheEntry = this.cache.get(this.currentLocation.href);
      this.currentCacheEntry.renderer.initialLoad();
    }
    /**
     * @param {string} renderer
     */
    setDefaultRenderer(renderer) {
      this.defaultRenderer = this.renderers[renderer];
    }
    /**
     * @param {string} transition
     */
    setDefaultTransition(transition) {
      this.defaultTransition = this.transitions[transition];
    }
    /**
     * Registers a route into the RouteStore
     *
     * @param {string} fromPattern
     * @param {string} toPattern
     * @param {string} transition
     */
    addRoute(fromPattern, toPattern, transition) {
      if (!this.router) {
        this.router = new RouteStore();
      }
      this.router.add(fromPattern, toPattern, transition);
    }
    /**
     * Prime the cache for a given URL
     *
     * @param {string} url
     * @param {boolean} [preloadAssets]
     * @return {Promise}
     */
    preload(url, preloadAssets = false) {
      url = processUrl(url).href;
      if (!this.cache.has(url)) {
        return this.fetch(url, false).then(async (response) => {
          this.cache.set(url, this.createCacheEntry(response.html, response.url));
          if (preloadAssets) {
            this.cache.get(url).renderer.createDom();
          }
        }).catch((err) => console.warn(err));
      }
      return Promise.resolve();
    }
    /**
     * Updates the HTML cache for a given URL.
     * If no URL is passed, then cache for the current page is updated.
     * Useful when adding/removing content via AJAX such as a search page or infinite loader.
     *
     * @param {string} [url]
     */
    updateCache(url) {
      const key = processUrl(url || window.location.href).href;
      if (this.cache.has(key)) {
        this.cache.delete(key);
      }
      this.cache.set(key, this.createCacheEntry(document.cloneNode(true), key));
    }
    /**
     * Clears the cache for a given URL.
     * If no URL is passed, then cache for the current page is cleared.
     *
     * @param {string} [url]
     */
    clearCache(url) {
      const key = processUrl(url || window.location.href).href;
      if (this.cache.has(key)) {
        this.cache.delete(key);
      }
    }
    /**
     * @param {string} url
     * @param {string|false} [transition]
     * @param {string|false|HTMLElement} [trigger]
     * @return {Promise<void|Error>}
     */
    navigateTo(url, transition = false, trigger = false) {
      return new Promise((resolve, reject) => {
        if (!this.allowInterruption && this.isTransitioning) {
          reject(new Error(IN_PROGRESS));
          return;
        }
        this.isTransitioning = true;
        this.isPopping = true;
        this.targetLocation = processUrl(url);
        this.popTarget = window.location.href;
        const TransitionClass = new (this.chooseTransition(transition))({ wrapper: this.wrapper });
        let navigationPromise;
        if (this.bypassCache || !this.cache.has(this.targetLocation.href) || this.cache.get(this.targetLocation.href).skipCache) {
          const fetched = this.fetch(this.targetLocation.href).then((response) => {
            this.cache.set(this.targetLocation.href, this.createCacheEntry(response.html, response.url));
            this.cache.get(this.targetLocation.href).renderer.createDom();
          }).catch((err) => {
            window.location.href = url;
          });
          navigationPromise = this.beforeFetch(this.targetLocation, TransitionClass, trigger).then(async () => {
            return fetched.then(async () => {
              return await this.afterFetch(this.targetLocation, TransitionClass, this.cache.get(this.targetLocation.href), trigger);
            });
          });
        } else {
          this.cache.get(this.targetLocation.href).renderer.createDom();
          navigationPromise = this.beforeFetch(this.targetLocation, TransitionClass, trigger).then(async () => {
            return await this.afterFetch(this.targetLocation, TransitionClass, this.cache.get(this.targetLocation.href), trigger);
          });
        }
        navigationPromise.then(() => {
          resolve();
        });
      });
    }
    /**
     * Add an event listener.
     * @param {string} event
     * @param {any} callback
     */
    on(event, callback) {
      e_default.on(event, callback);
    }
    /**
     * Remove an event listener.
     * @param {string} event
     * @param {any} [callback]
     */
    off(event, callback) {
      e_default.off(event, callback);
    }
    /**
     * @private
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
     * @param {Transition} TransitionClass
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<void>}
     */
    beforeFetch(url, TransitionClass, trigger) {
      e_default.emit("NAVIGATE_OUT", {
        from: this.currentCacheEntry,
        trigger
      });
      return new Promise((resolve) => {
        this.currentCacheEntry.renderer.leave(TransitionClass, trigger, this.removeOldContent).then(() => {
          if (trigger !== "popstate") {
            window.history.pushState({}, "", url.raw);
          }
          resolve();
        });
      });
    }
    /**
     * @private
     * @param {{ raw: string, href: string, host: string, hasHash: boolean, pathname: string }} url
     * @param {Transition} TransitionClass
     * @param {CacheEntry} entry
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<void>}
     */
    afterFetch(url, TransitionClass, entry, trigger) {
      this.currentLocation = url;
      this.popTarget = this.currentLocation.href;
      return new Promise((resolve) => {
        entry.renderer.update();
        e_default.emit("NAVIGATE_IN", {
          from: this.currentCacheEntry,
          to: entry,
          trigger
        });
        if (this.reloadJsFilter) {
          this.loadScripts(entry.scripts);
        }
        if (this.reloadCssFilter) {
          this.loadStyles(entry.styles);
        }
        if (trigger !== "popstate" && url.href !== entry.finalUrl) {
          window.history.replaceState({}, "", entry.finalUrl);
        }
        entry.renderer.enter(TransitionClass, trigger).then(() => {
          e_default.emit("NAVIGATE_END", {
            from: this.currentCacheEntry,
            to: entry,
            trigger
          });
          this.currentCacheEntry = entry;
          this.isTransitioning = false;
          this.isPopping = false;
          resolve();
        });
      });
    }
    /**
     * Load up scripts from the target page if needed
     *
     * @param {HTMLElement[]} cachedScripts
     */
    loadScripts(cachedScripts) {
      const newScripts = [...cachedScripts];
      const currentScripts = Array.from(document.querySelectorAll("script")).filter(this.reloadJsFilter);
      for (let i = 0; i < currentScripts.length; i++) {
        for (let n = 0; n < newScripts.length; n++) {
          if (currentScripts[i].outerHTML === newScripts[n].outerHTML) {
            reloadElement(currentScripts[i], "SCRIPT");
            newScripts.splice(n, 1);
            break;
          }
        }
      }
      for (const script of newScripts) {
        appendElement(script, "SCRIPT");
      }
    }
    /**
     * Load up styles from the target page if needed
     *
     * @param {Array<HTMLLinkElement|HTMLStyleElement>} cachedStyles
     */
    loadStyles(cachedStyles) {
      const currentStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(this.reloadCssFilter);
      const currentInlineStyles = Array.from(document.querySelectorAll("style")).filter(this.reloadCssFilter);
      const newInlineStyles = cachedStyles.filter((el) => {
        if (!el.href) {
          return true;
        } else if (!currentStyles.find((link) => link.href === el.href)) {
          document.body.append(el);
          return false;
        }
      });
      for (let i = 0; i < currentInlineStyles.length; i++) {
        for (let n = 0; n < newInlineStyles.length; n++) {
          if (currentInlineStyles[i].outerHTML === newInlineStyles[n].outerHTML) {
            reloadElement(currentInlineStyles[i], "STYLE");
            newInlineStyles.splice(n, 1);
            break;
          }
        }
      }
      for (const style of newInlineStyles) {
        appendElement(style, "STYLE");
      }
    }
    /**
     * @private
     * @param {string} links
     */
    attachEvents(links) {
      e_default.delegate("click", links, this.onClick);
      e_default.on("popstate", window, this.onPopstate);
      if (this.enablePrefetch) {
        e_default.delegate("mouseenter focus", links, this.onPrefetch);
      }
    }
    /**
     * @private
     * @param {MouseEvent} e
     */
    onClick = (e) => {
      if (!(e.metaKey || e.ctrlKey)) {
        const target = processUrl(e.currentTarget.href);
        this.currentLocation = processUrl(window.location.href);
        if (this.currentLocation.host !== target.host) {
          return;
        }
        if (this.currentLocation.href !== target.href || this.currentLocation.hasHash && !target.hasHash) {
          e.preventDefault();
          this.navigateTo(target.raw, e.currentTarget.dataset.transition || false, e.currentTarget).catch((err) => console.warn(err));
          return;
        }
        if (!this.currentLocation.hasHash && !target.hasHash) {
          e.preventDefault();
        }
      }
    };
    /**
     * @private
     * @return {void|boolean}
     */
    onPopstate = () => {
      const target = processUrl(window.location.href);
      if (target.pathname === this.currentLocation.pathname && target.search === this.currentLocation.search && !this.isPopping) {
        return false;
      }
      if (!this.allowInterruption && (this.isTransitioning || this.isPopping)) {
        window.history.pushState({}, "", this.popTarget);
        console.warn(IN_PROGRESS);
        return false;
      }
      if (!this.isPopping) {
        this.popTarget = window.location.href;
      }
      this.isPopping = true;
      this.navigateTo(window.location.href, false, "popstate");
    };
    /**
     * @private
     * @param {MouseEvent} e
     */
    onPrefetch = (e) => {
      const target = processUrl(e.currentTarget.href);
      if (this.currentLocation.host !== target.host) {
        return;
      }
      this.preload(e.currentTarget.href, false);
    };
    /**
     * @private
     * @param {string} url
     * @param {boolean} [runFallback]
     * @return {Promise<{html: Document, url: string}>}
     */
    fetch(url, runFallback = true) {
      if (this.activePromises.has(url)) {
        return this.activePromises.get(url);
      }
      const request = new Promise((resolve, reject) => {
        let resolvedUrl;
        fetch(url, {
          mode: "same-origin",
          method: "GET",
          headers: { "X-Requested-With": "Taxi" },
          credentials: "same-origin"
        }).then((response) => {
          if (!response.ok) {
            reject("Taxi encountered a non 2xx HTTP status code");
            if (runFallback) {
              window.location.href = url;
            }
          }
          resolvedUrl = response.url;
          return response.text();
        }).then((htmlString) => {
          resolve({ html: parseDom(htmlString), url: resolvedUrl });
        }).catch((err) => {
          reject(err);
          if (runFallback) {
            window.location.href = url;
          }
        }).finally(() => {
          this.activePromises.delete(url);
        });
      });
      this.activePromises.set(url, request);
      return request;
    }
    /**
     * @private
     * @param {string|false} transition
     * @return {Transition|function}
     */
    chooseTransition(transition) {
      if (transition) {
        return this.transitions[transition];
      }
      const routeTransition = this.router?.findMatch(this.currentLocation, this.targetLocation);
      if (routeTransition) {
        return this.transitions[routeTransition];
      }
      return this.defaultTransition;
    }
    /**
     * @private
     * @param {Document|Node} page
     * @param {string} url
     * @return {CacheEntry}
     */
    createCacheEntry(page, url) {
      const content = page.querySelector("[data-taxi-view]");
      const Renderer3 = content.dataset.taxiView.length ? this.renderers[content.dataset.taxiView] : this.defaultRenderer;
      if (!Renderer3) {
        console.warn(`The Renderer "${content.dataset.taxiView}" was set in the data-taxi-view of the requested page, but not registered in Taxi.`);
      }
      return {
        page,
        content,
        finalUrl: url,
        skipCache: content.hasAttribute("data-taxi-nocache"),
        scripts: this.reloadJsFilter ? Array.from(page.querySelectorAll("script")).filter(this.reloadJsFilter) : [],
        styles: this.reloadCssFilter ? Array.from(page.querySelectorAll('link[rel="stylesheet"], style')).filter(this.reloadCssFilter) : [],
        title: page.title,
        renderer: new Renderer3({
          wrapper: this.wrapper,
          title: page.title,
          content,
          page
        })
      };
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/functions/Vec3Func.js
  function length(a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  function multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  function distance(a, b) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function squaredDistance(a, b) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  function normalize3(out, a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function cross(out, a, b) {
    let ax = a[0], ay = a[1], az = a[2];
    let bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp2(out, a, b, t) {
    let ax = a[0];
    let ay = a[1];
    let az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  function smoothLerp(out, a, b, decay, dt) {
    const exp = Math.exp(-decay * dt);
    let ax = a[0];
    let ay = a[1];
    let az = a[2];
    out[0] = b[0] + (ax - b[0]) * exp;
    out[1] = b[1] + (ay - b[1]) * exp;
    out[2] = b[2] + (az - b[2]) * exp;
    return out;
  }
  function transformMat4(out, a, m) {
    let x = a[0], y = a[1], z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  function scaleRotateMat4(out, a, m) {
    let x = a[0], y = a[1], z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
    return out;
  }
  function transformMat3(out, a, m) {
    let x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  function transformQuat(out, a, q) {
    let x = a[0], y = a[1], z = a[2];
    let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    let uvx = qy * z - qz * y;
    let uvy = qz * x - qx * z;
    let uvz = qx * y - qy * x;
    let uuvx = qy * uvz - qz * uvy;
    let uuvy = qz * uvx - qx * uvz;
    let uuvz = qx * uvy - qy * uvx;
    let w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  var angle = /* @__PURE__ */ function() {
    const tempA = [0, 0, 0];
    const tempB = [0, 0, 0];
    return function(a, b) {
      copy(tempA, a);
      copy(tempB, b);
      normalize3(tempA, tempA);
      normalize3(tempB, tempB);
      let cosine = dot(tempA, tempB);
      if (cosine > 1) {
        return 0;
      } else if (cosine < -1) {
        return Math.PI;
      } else {
        return Math.acos(cosine);
      }
    };
  }();
  function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/Vec3.js
  var Vec3 = class _Vec3 extends Array {
    constructor(x = 0, y = x, z = x) {
      super(x, y, z);
      return this;
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    get z() {
      return this[2];
    }
    set x(v) {
      this[0] = v;
    }
    set y(v) {
      this[1] = v;
    }
    set z(v) {
      this[2] = v;
    }
    set(x, y = x, z = x) {
      if (x.length) return this.copy(x);
      set(this, x, y, z);
      return this;
    }
    copy(v) {
      copy(this, v);
      return this;
    }
    add(va, vb) {
      if (vb) add(this, va, vb);
      else add(this, this, va);
      return this;
    }
    sub(va, vb) {
      if (vb) subtract(this, va, vb);
      else subtract(this, this, va);
      return this;
    }
    multiply(v) {
      if (v.length) multiply(this, this, v);
      else scale(this, this, v);
      return this;
    }
    divide(v) {
      if (v.length) divide(this, this, v);
      else scale(this, this, 1 / v);
      return this;
    }
    inverse(v = this) {
      inverse(this, v);
      return this;
    }
    // Can't use 'length' as Array.prototype uses it
    len() {
      return length(this);
    }
    distance(v) {
      if (v) return distance(this, v);
      else return length(this);
    }
    squaredLen() {
      return squaredLength(this);
    }
    squaredDistance(v) {
      if (v) return squaredDistance(this, v);
      else return squaredLength(this);
    }
    negate(v = this) {
      negate(this, v);
      return this;
    }
    cross(va, vb) {
      if (vb) cross(this, va, vb);
      else cross(this, this, va);
      return this;
    }
    scale(v) {
      scale(this, this, v);
      return this;
    }
    normalize() {
      normalize3(this, this);
      return this;
    }
    dot(v) {
      return dot(this, v);
    }
    equals(v) {
      return exactEquals(this, v);
    }
    applyMatrix3(mat3) {
      transformMat3(this, this, mat3);
      return this;
    }
    applyMatrix4(mat4) {
      transformMat4(this, this, mat4);
      return this;
    }
    scaleRotateMatrix4(mat4) {
      scaleRotateMat4(this, this, mat4);
      return this;
    }
    applyQuaternion(q) {
      transformQuat(this, this, q);
      return this;
    }
    angle(v) {
      return angle(this, v);
    }
    lerp(v, t) {
      lerp2(this, this, v, t);
      return this;
    }
    smoothLerp(v, decay, dt) {
      smoothLerp(this, this, v, decay, dt);
      return this;
    }
    clone() {
      return new _Vec3(this[0], this[1], this[2]);
    }
    fromArray(a, o = 0) {
      this[0] = a[o];
      this[1] = a[o + 1];
      this[2] = a[o + 2];
      return this;
    }
    toArray(a = [], o = 0) {
      a[o] = this[0];
      a[o + 1] = this[1];
      a[o + 2] = this[2];
      return a;
    }
    transformDirection(mat4) {
      const x = this[0];
      const y = this[1];
      const z = this[2];
      this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
      this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
      this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
      return this.normalize();
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/Geometry.js
  var tempVec3 = /* @__PURE__ */ new Vec3();
  var ID = 1;
  var ATTR_ID = 1;
  var isBoundsWarned = false;
  var Geometry = class {
    constructor(gl, attributes = {}) {
      if (!gl.canvas) console.error("gl not passed as first argument to Geometry");
      this.gl = gl;
      this.attributes = attributes;
      this.id = ID++;
      this.VAOs = {};
      this.drawRange = { start: 0, count: 0 };
      this.instancedCount = 0;
      this.gl.renderer.bindVertexArray(null);
      this.gl.renderer.currentGeometry = null;
      this.glState = this.gl.renderer.state;
      for (let key in attributes) {
        this.addAttribute(key, attributes[key]);
      }
    }
    addAttribute(key, attr) {
      this.attributes[key] = attr;
      attr.id = ATTR_ID++;
      attr.size = attr.size || 1;
      attr.type = attr.type || (attr.data.constructor === Float32Array ? this.gl.FLOAT : attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT);
      attr.target = key === "index" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
      attr.normalized = attr.normalized || false;
      attr.stride = attr.stride || 0;
      attr.offset = attr.offset || 0;
      attr.count = attr.count || (attr.stride ? attr.data.byteLength / attr.stride : attr.data.length / attr.size);
      attr.divisor = attr.instanced || 0;
      attr.needsUpdate = false;
      attr.usage = attr.usage || this.gl.STATIC_DRAW;
      if (!attr.buffer) {
        this.updateAttribute(attr);
      }
      if (attr.divisor) {
        this.isInstanced = true;
        if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
          console.warn("geometry has multiple instanced buffers of different length");
          return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
        }
        this.instancedCount = attr.count * attr.divisor;
      } else if (key === "index") {
        this.drawRange.count = attr.count;
      } else if (!this.attributes.index) {
        this.drawRange.count = Math.max(this.drawRange.count, attr.count);
      }
    }
    updateAttribute(attr) {
      const isNewBuffer = !attr.buffer;
      if (isNewBuffer) attr.buffer = this.gl.createBuffer();
      if (this.glState.boundBuffer !== attr.buffer) {
        this.gl.bindBuffer(attr.target, attr.buffer);
        this.glState.boundBuffer = attr.buffer;
      }
      if (isNewBuffer) {
        this.gl.bufferData(attr.target, attr.data, attr.usage);
      } else {
        this.gl.bufferSubData(attr.target, 0, attr.data);
      }
      attr.needsUpdate = false;
    }
    setIndex(value) {
      this.addAttribute("index", value);
    }
    setDrawRange(start, count) {
      this.drawRange.start = start;
      this.drawRange.count = count;
    }
    setInstancedCount(value) {
      this.instancedCount = value;
    }
    createVAO(program) {
      this.VAOs[program.attributeOrder] = this.gl.renderer.createVertexArray();
      this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
      this.bindAttributes(program);
    }
    bindAttributes(program) {
      program.attributeLocations.forEach((location, { name, type }) => {
        if (!this.attributes[name]) {
          console.warn(`active attribute ${name} not being supplied`);
          return;
        }
        const attr = this.attributes[name];
        this.gl.bindBuffer(attr.target, attr.buffer);
        this.glState.boundBuffer = attr.buffer;
        let numLoc = 1;
        if (type === 35674) numLoc = 2;
        if (type === 35675) numLoc = 3;
        if (type === 35676) numLoc = 4;
        const size = attr.size / numLoc;
        const stride = numLoc === 1 ? 0 : numLoc * numLoc * 4;
        const offset = numLoc === 1 ? 0 : numLoc * 4;
        for (let i = 0; i < numLoc; i++) {
          this.gl.vertexAttribPointer(location + i, size, attr.type, attr.normalized, attr.stride + stride, attr.offset + i * offset);
          this.gl.enableVertexAttribArray(location + i);
          this.gl.renderer.vertexAttribDivisor(location + i, attr.divisor);
        }
      });
      if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
    }
    draw({ program, mode = this.gl.TRIANGLES }) {
      if (this.gl.renderer.currentGeometry !== `${this.id}_${program.attributeOrder}`) {
        if (!this.VAOs[program.attributeOrder]) this.createVAO(program);
        this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
        this.gl.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
      }
      program.attributeLocations.forEach((location, { name }) => {
        const attr = this.attributes[name];
        if (attr.needsUpdate) this.updateAttribute(attr);
      });
      let indexBytesPerElement = 2;
      if (this.attributes.index?.type === this.gl.UNSIGNED_INT) indexBytesPerElement = 4;
      if (this.isInstanced) {
        if (this.attributes.index) {
          this.gl.renderer.drawElementsInstanced(
            mode,
            this.drawRange.count,
            this.attributes.index.type,
            this.attributes.index.offset + this.drawRange.start * indexBytesPerElement,
            this.instancedCount
          );
        } else {
          this.gl.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
        }
      } else {
        if (this.attributes.index) {
          this.gl.drawElements(
            mode,
            this.drawRange.count,
            this.attributes.index.type,
            this.attributes.index.offset + this.drawRange.start * indexBytesPerElement
          );
        } else {
          this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
        }
      }
    }
    getPosition() {
      const attr = this.attributes.position;
      if (attr.data) return attr;
      if (isBoundsWarned) return;
      console.warn("No position buffer data found to compute bounds");
      return isBoundsWarned = true;
    }
    computeBoundingBox(attr) {
      if (!attr) attr = this.getPosition();
      const array = attr.data;
      const stride = attr.size;
      if (!this.bounds) {
        this.bounds = {
          min: new Vec3(),
          max: new Vec3(),
          center: new Vec3(),
          scale: new Vec3(),
          radius: Infinity
        };
      }
      const min = this.bounds.min;
      const max = this.bounds.max;
      const center = this.bounds.center;
      const scale5 = this.bounds.scale;
      min.set(Infinity);
      max.set(-Infinity);
      for (let i = 0, l = array.length; i < l; i += stride) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];
        min.x = Math.min(x, min.x);
        min.y = Math.min(y, min.y);
        min.z = Math.min(z, min.z);
        max.x = Math.max(x, max.x);
        max.y = Math.max(y, max.y);
        max.z = Math.max(z, max.z);
      }
      scale5.sub(max, min);
      center.add(min, max).divide(2);
    }
    computeBoundingSphere(attr) {
      if (!attr) attr = this.getPosition();
      const array = attr.data;
      const stride = attr.size;
      if (!this.bounds) this.computeBoundingBox(attr);
      let maxRadiusSq = 0;
      for (let i = 0, l = array.length; i < l; i += stride) {
        tempVec3.fromArray(array, i);
        maxRadiusSq = Math.max(maxRadiusSq, this.bounds.center.squaredDistance(tempVec3));
      }
      this.bounds.radius = Math.sqrt(maxRadiusSq);
    }
    remove() {
      for (let key in this.VAOs) {
        this.gl.renderer.deleteVertexArray(this.VAOs[key]);
        delete this.VAOs[key];
      }
      for (let key in this.attributes) {
        this.gl.deleteBuffer(this.attributes[key].buffer);
        delete this.attributes[key];
      }
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/Program.js
  var ID2 = 1;
  var arrayCacheF32 = {};
  var Program = class {
    constructor(gl, {
      vertex: vertex2,
      fragment: fragment2,
      uniforms = {},
      transparent = false,
      cullFace = gl.BACK,
      frontFace = gl.CCW,
      depthTest = true,
      depthWrite = true,
      depthFunc = gl.LEQUAL
    } = {}) {
      if (!gl.canvas) console.error("gl not passed as first argument to Program");
      this.gl = gl;
      this.uniforms = uniforms;
      this.id = ID2++;
      if (!vertex2) console.warn("vertex shader not supplied");
      if (!fragment2) console.warn("fragment shader not supplied");
      this.transparent = transparent;
      this.cullFace = cullFace;
      this.frontFace = frontFace;
      this.depthTest = depthTest;
      this.depthWrite = depthWrite;
      this.depthFunc = depthFunc;
      this.blendFunc = {};
      this.blendEquation = {};
      this.stencilFunc = {};
      this.stencilOp = {};
      if (this.transparent && !this.blendFunc.src) {
        if (this.gl.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      }
      this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
      this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      this.program = gl.createProgram();
      gl.attachShader(this.program, this.vertexShader);
      gl.attachShader(this.program, this.fragmentShader);
      this.setShaders({ vertex: vertex2, fragment: fragment2 });
    }
    setShaders({ vertex: vertex2, fragment: fragment2 }) {
      if (vertex2) {
        this.gl.shaderSource(this.vertexShader, vertex2);
        this.gl.compileShader(this.vertexShader);
        if (this.gl.getShaderInfoLog(this.vertexShader) !== "") {
          console.warn(`${this.gl.getShaderInfoLog(this.vertexShader)}
Vertex Shader
${addLineNumbers(vertex2)}`);
        }
      }
      if (fragment2) {
        this.gl.shaderSource(this.fragmentShader, fragment2);
        this.gl.compileShader(this.fragmentShader);
        if (this.gl.getShaderInfoLog(this.fragmentShader) !== "") {
          console.warn(`${this.gl.getShaderInfoLog(this.fragmentShader)}
Fragment Shader
${addLineNumbers(fragment2)}`);
        }
      }
      this.gl.linkProgram(this.program);
      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        return console.warn(this.gl.getProgramInfoLog(this.program));
      }
      this.uniformLocations = /* @__PURE__ */ new Map();
      let numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
      for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
        let uniform = this.gl.getActiveUniform(this.program, uIndex);
        this.uniformLocations.set(uniform, this.gl.getUniformLocation(this.program, uniform.name));
        const split = uniform.name.match(/(\w+)/g);
        uniform.uniformName = split[0];
        uniform.nameComponents = split.slice(1);
      }
      this.attributeLocations = /* @__PURE__ */ new Map();
      const locations = [];
      const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
      for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
        const attribute = this.gl.getActiveAttrib(this.program, aIndex);
        const location = this.gl.getAttribLocation(this.program, attribute.name);
        if (location === -1) continue;
        locations[location] = attribute.name;
        this.attributeLocations.set(attribute, location);
      }
      this.attributeOrder = locations.join("");
    }
    setBlendFunc(src, dst, srcAlpha, dstAlpha) {
      this.blendFunc.src = src;
      this.blendFunc.dst = dst;
      this.blendFunc.srcAlpha = srcAlpha;
      this.blendFunc.dstAlpha = dstAlpha;
      if (src) this.transparent = true;
    }
    setBlendEquation(modeRGB, modeAlpha) {
      this.blendEquation.modeRGB = modeRGB;
      this.blendEquation.modeAlpha = modeAlpha;
    }
    setStencilFunc(func, ref, mask) {
      this.stencilRef = ref;
      this.stencilFunc.func = func;
      this.stencilFunc.ref = ref;
      this.stencilFunc.mask = mask;
    }
    setStencilOp(stencilFail, depthFail, depthPass) {
      this.stencilOp.stencilFail = stencilFail;
      this.stencilOp.depthFail = depthFail;
      this.stencilOp.depthPass = depthPass;
    }
    applyState() {
      if (this.depthTest) this.gl.renderer.enable(this.gl.DEPTH_TEST);
      else this.gl.renderer.disable(this.gl.DEPTH_TEST);
      if (this.cullFace) this.gl.renderer.enable(this.gl.CULL_FACE);
      else this.gl.renderer.disable(this.gl.CULL_FACE);
      if (this.blendFunc.src) this.gl.renderer.enable(this.gl.BLEND);
      else this.gl.renderer.disable(this.gl.BLEND);
      if (this.cullFace) this.gl.renderer.setCullFace(this.cullFace);
      this.gl.renderer.setFrontFace(this.frontFace);
      this.gl.renderer.setDepthMask(this.depthWrite);
      this.gl.renderer.setDepthFunc(this.depthFunc);
      if (this.blendFunc.src) this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
      this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
      if (this.stencilFunc.func || this.stencilOp.stencilFail) this.gl.renderer.enable(this.gl.STENCIL_TEST);
      else this.gl.renderer.disable(this.gl.STENCIL_TEST);
      this.gl.renderer.setStencilFunc(this.stencilFunc.func, this.stencilFunc.ref, this.stencilFunc.mask);
      this.gl.renderer.setStencilOp(this.stencilOp.stencilFail, this.stencilOp.depthFail, this.stencilOp.depthPass);
    }
    use({ flipFaces = false } = {}) {
      let textureUnit = -1;
      const programActive = this.gl.renderer.state.currentProgram === this.id;
      if (!programActive) {
        this.gl.useProgram(this.program);
        this.gl.renderer.state.currentProgram = this.id;
      }
      this.uniformLocations.forEach((location, activeUniform) => {
        let uniform = this.uniforms[activeUniform.uniformName];
        for (const component of activeUniform.nameComponents) {
          if (!uniform) break;
          if (component in uniform) {
            uniform = uniform[component];
          } else if (Array.isArray(uniform.value)) {
            break;
          } else {
            uniform = void 0;
            break;
          }
        }
        if (!uniform) {
          return warn(`Active uniform ${activeUniform.name} has not been supplied`);
        }
        if (uniform && uniform.value === void 0) {
          return warn(`${activeUniform.name} uniform is missing a value parameter`);
        }
        if (uniform.value.texture) {
          textureUnit = textureUnit + 1;
          uniform.value.update(textureUnit);
          return setUniform(this.gl, activeUniform.type, location, textureUnit);
        }
        if (uniform.value.length && uniform.value[0].texture) {
          const textureUnits = [];
          uniform.value.forEach((value) => {
            textureUnit = textureUnit + 1;
            value.update(textureUnit);
            textureUnits.push(textureUnit);
          });
          return setUniform(this.gl, activeUniform.type, location, textureUnits);
        }
        setUniform(this.gl, activeUniform.type, location, uniform.value);
      });
      this.applyState();
      if (flipFaces) this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
    }
    remove() {
      this.gl.deleteProgram(this.program);
    }
  };
  function setUniform(gl, type, location, value) {
    value = value.length ? flatten(value) : value;
    const setValue = gl.renderer.state.uniformLocations.get(location);
    if (value.length) {
      if (setValue === void 0 || setValue.length !== value.length) {
        gl.renderer.state.uniformLocations.set(location, value.slice(0));
      } else {
        if (arraysEqual(setValue, value)) return;
        setValue.set ? setValue.set(value) : setArray(setValue, value);
        gl.renderer.state.uniformLocations.set(location, setValue);
      }
    } else {
      if (setValue === value) return;
      gl.renderer.state.uniformLocations.set(location, value);
    }
    switch (type) {
      case 5126:
        return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
      // FLOAT
      case 35664:
        return gl.uniform2fv(location, value);
      // FLOAT_VEC2
      case 35665:
        return gl.uniform3fv(location, value);
      // FLOAT_VEC3
      case 35666:
        return gl.uniform4fv(location, value);
      // FLOAT_VEC4
      case 35670:
      // BOOL
      case 5124:
      // INT
      case 35678:
      // SAMPLER_2D
      case 36306:
      // U_SAMPLER_2D
      case 35680:
      // SAMPLER_CUBE
      case 36289:
        return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
      // SAMPLER_CUBE
      case 35671:
      // BOOL_VEC2
      case 35667:
        return gl.uniform2iv(location, value);
      // INT_VEC2
      case 35672:
      // BOOL_VEC3
      case 35668:
        return gl.uniform3iv(location, value);
      // INT_VEC3
      case 35673:
      // BOOL_VEC4
      case 35669:
        return gl.uniform4iv(location, value);
      // INT_VEC4
      case 35674:
        return gl.uniformMatrix2fv(location, false, value);
      // FLOAT_MAT2
      case 35675:
        return gl.uniformMatrix3fv(location, false, value);
      // FLOAT_MAT3
      case 35676:
        return gl.uniformMatrix4fv(location, false, value);
    }
  }
  function addLineNumbers(string) {
    let lines = string.split("\n");
    for (let i = 0; i < lines.length; i++) {
      lines[i] = i + 1 + ": " + lines[i];
    }
    return lines.join("\n");
  }
  function flatten(a) {
    const arrayLen = a.length;
    const valueLen = a[0].length;
    if (valueLen === void 0) return a;
    const length3 = arrayLen * valueLen;
    let value = arrayCacheF32[length3];
    if (!value) arrayCacheF32[length3] = value = new Float32Array(length3);
    for (let i = 0; i < arrayLen; i++) value.set(a[i], i * valueLen);
    return value;
  }
  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0, l = a.length; i < l; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  function setArray(a, b) {
    for (let i = 0, l = a.length; i < l; i++) {
      a[i] = b[i];
    }
  }
  var warnCount = 0;
  function warn(message) {
    if (warnCount > 100) return;
    console.warn(message);
    warnCount++;
    if (warnCount > 100) console.warn("More than 100 program warnings - stopping logs.");
  }

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/Renderer.js
  var tempVec32 = /* @__PURE__ */ new Vec3();
  var ID3 = 1;
  var Renderer2 = class {
    constructor({
      canvas = document.createElement("canvas"),
      width = 300,
      height = 150,
      dpr = 1,
      alpha = false,
      depth = true,
      stencil = false,
      antialias = false,
      premultipliedAlpha = false,
      preserveDrawingBuffer = false,
      powerPreference = "default",
      autoClear = true,
      webgl = 2
    } = {}) {
      const attributes = { alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer, powerPreference };
      this.dpr = dpr;
      this.alpha = alpha;
      this.color = true;
      this.depth = depth;
      this.stencil = stencil;
      this.premultipliedAlpha = premultipliedAlpha;
      this.autoClear = autoClear;
      this.id = ID3++;
      if (webgl === 2) this.gl = canvas.getContext("webgl2", attributes);
      this.isWebgl2 = !!this.gl;
      if (!this.gl) this.gl = canvas.getContext("webgl", attributes);
      if (!this.gl) console.error("unable to create webgl context");
      this.gl.renderer = this;
      this.setSize(width, height);
      this.state = {};
      this.state.blendFunc = { src: this.gl.ONE, dst: this.gl.ZERO };
      this.state.blendEquation = { modeRGB: this.gl.FUNC_ADD };
      this.state.cullFace = false;
      this.state.frontFace = this.gl.CCW;
      this.state.depthMask = true;
      this.state.depthFunc = this.gl.LEQUAL;
      this.state.premultiplyAlpha = false;
      this.state.flipY = false;
      this.state.unpackAlignment = 4;
      this.state.framebuffer = null;
      this.state.viewport = { x: 0, y: 0, width: null, height: null };
      this.state.textureUnits = [];
      this.state.activeTextureUnit = 0;
      this.state.boundBuffer = null;
      this.state.uniformLocations = /* @__PURE__ */ new Map();
      this.state.currentProgram = null;
      this.extensions = {};
      if (this.isWebgl2) {
        this.getExtension("EXT_color_buffer_float");
        this.getExtension("OES_texture_float_linear");
      } else {
        this.getExtension("OES_texture_float");
        this.getExtension("OES_texture_float_linear");
        this.getExtension("OES_texture_half_float");
        this.getExtension("OES_texture_half_float_linear");
        this.getExtension("OES_element_index_uint");
        this.getExtension("OES_standard_derivatives");
        this.getExtension("EXT_sRGB");
        this.getExtension("WEBGL_depth_texture");
        this.getExtension("WEBGL_draw_buffers");
      }
      this.getExtension("WEBGL_compressed_texture_astc");
      this.getExtension("EXT_texture_compression_bptc");
      this.getExtension("WEBGL_compressed_texture_s3tc");
      this.getExtension("WEBGL_compressed_texture_etc1");
      this.getExtension("WEBGL_compressed_texture_pvrtc");
      this.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
      this.vertexAttribDivisor = this.getExtension("ANGLE_instanced_arrays", "vertexAttribDivisor", "vertexAttribDivisorANGLE");
      this.drawArraysInstanced = this.getExtension("ANGLE_instanced_arrays", "drawArraysInstanced", "drawArraysInstancedANGLE");
      this.drawElementsInstanced = this.getExtension("ANGLE_instanced_arrays", "drawElementsInstanced", "drawElementsInstancedANGLE");
      this.createVertexArray = this.getExtension("OES_vertex_array_object", "createVertexArray", "createVertexArrayOES");
      this.bindVertexArray = this.getExtension("OES_vertex_array_object", "bindVertexArray", "bindVertexArrayOES");
      this.deleteVertexArray = this.getExtension("OES_vertex_array_object", "deleteVertexArray", "deleteVertexArrayOES");
      this.drawBuffers = this.getExtension("WEBGL_draw_buffers", "drawBuffers", "drawBuffersWEBGL");
      this.parameters = {};
      this.parameters.maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
      this.parameters.maxAnisotropy = this.getExtension("EXT_texture_filter_anisotropic") ? this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
    }
    setSize(width, height) {
      this.width = width;
      this.height = height;
      this.gl.canvas.width = width * this.dpr;
      this.gl.canvas.height = height * this.dpr;
      if (!this.gl.canvas.style) return;
      Object.assign(this.gl.canvas.style, {
        width: width + "px",
        height: height + "px"
      });
    }
    setViewport(width, height, x = 0, y = 0) {
      if (this.state.viewport.width === width && this.state.viewport.height === height) return;
      this.state.viewport.width = width;
      this.state.viewport.height = height;
      this.state.viewport.x = x;
      this.state.viewport.y = y;
      this.gl.viewport(x, y, width, height);
    }
    setScissor(width, height, x = 0, y = 0) {
      this.gl.scissor(x, y, width, height);
    }
    enable(id) {
      if (this.state[id] === true) return;
      this.gl.enable(id);
      this.state[id] = true;
    }
    disable(id) {
      if (this.state[id] === false) return;
      this.gl.disable(id);
      this.state[id] = false;
    }
    setBlendFunc(src, dst, srcAlpha, dstAlpha) {
      if (this.state.blendFunc.src === src && this.state.blendFunc.dst === dst && this.state.blendFunc.srcAlpha === srcAlpha && this.state.blendFunc.dstAlpha === dstAlpha)
        return;
      this.state.blendFunc.src = src;
      this.state.blendFunc.dst = dst;
      this.state.blendFunc.srcAlpha = srcAlpha;
      this.state.blendFunc.dstAlpha = dstAlpha;
      if (srcAlpha !== void 0) this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);
      else this.gl.blendFunc(src, dst);
    }
    setBlendEquation(modeRGB, modeAlpha) {
      modeRGB = modeRGB || this.gl.FUNC_ADD;
      if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha) return;
      this.state.blendEquation.modeRGB = modeRGB;
      this.state.blendEquation.modeAlpha = modeAlpha;
      if (modeAlpha !== void 0) this.gl.blendEquationSeparate(modeRGB, modeAlpha);
      else this.gl.blendEquation(modeRGB);
    }
    setCullFace(value) {
      if (this.state.cullFace === value) return;
      this.state.cullFace = value;
      this.gl.cullFace(value);
    }
    setFrontFace(value) {
      if (this.state.frontFace === value) return;
      this.state.frontFace = value;
      this.gl.frontFace(value);
    }
    setDepthMask(value) {
      if (this.state.depthMask === value) return;
      this.state.depthMask = value;
      this.gl.depthMask(value);
    }
    setDepthFunc(value) {
      if (this.state.depthFunc === value) return;
      this.state.depthFunc = value;
      this.gl.depthFunc(value);
    }
    setStencilMask(value) {
      if (this.state.stencilMask === value) return;
      this.state.stencilMask = value;
      this.gl.stencilMask(value);
    }
    setStencilFunc(func, ref, mask) {
      if (this.state.stencilFunc === func && this.state.stencilRef === ref && this.state.stencilFuncMask === mask) return;
      this.state.stencilFunc = func || this.gl.ALWAYS;
      this.state.stencilRef = ref || 0;
      this.state.stencilFuncMask = mask || 0;
      this.gl.stencilFunc(func || this.gl.ALWAYS, ref || 0, mask || 0);
    }
    setStencilOp(stencilFail, depthFail, depthPass) {
      if (this.state.stencilFail === stencilFail && this.state.stencilDepthFail === depthFail && this.state.stencilDepthPass === depthPass) return;
      this.state.stencilFail = stencilFail;
      this.state.stencilDepthFail = depthFail;
      this.state.stencilDepthPass = depthPass;
      this.gl.stencilOp(stencilFail, depthFail, depthPass);
    }
    activeTexture(value) {
      if (this.state.activeTextureUnit === value) return;
      this.state.activeTextureUnit = value;
      this.gl.activeTexture(this.gl.TEXTURE0 + value);
    }
    bindFramebuffer({ target = this.gl.FRAMEBUFFER, buffer = null } = {}) {
      if (this.state.framebuffer === buffer) return;
      this.state.framebuffer = buffer;
      this.gl.bindFramebuffer(target, buffer);
    }
    getExtension(extension, webgl2Func, extFunc) {
      if (webgl2Func && this.gl[webgl2Func]) return this.gl[webgl2Func].bind(this.gl);
      if (!this.extensions[extension]) {
        this.extensions[extension] = this.gl.getExtension(extension);
      }
      if (!webgl2Func) return this.extensions[extension];
      if (!this.extensions[extension]) return null;
      return this.extensions[extension][extFunc].bind(this.extensions[extension]);
    }
    sortOpaque(a, b) {
      if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
      } else if (a.program.id !== b.program.id) {
        return a.program.id - b.program.id;
      } else if (a.zDepth !== b.zDepth) {
        return a.zDepth - b.zDepth;
      } else {
        return b.id - a.id;
      }
    }
    sortTransparent(a, b) {
      if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
      }
      if (a.zDepth !== b.zDepth) {
        return b.zDepth - a.zDepth;
      } else {
        return b.id - a.id;
      }
    }
    sortUI(a, b) {
      if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
      } else if (a.program.id !== b.program.id) {
        return a.program.id - b.program.id;
      } else {
        return b.id - a.id;
      }
    }
    getRenderList({ scene, camera, frustumCull, sort }) {
      let renderList = [];
      if (camera && frustumCull) camera.updateFrustum();
      scene.traverse((node) => {
        if (!node.visible) return true;
        if (!node.draw) return;
        if (frustumCull && node.frustumCulled && camera) {
          if (!camera.frustumIntersectsMesh(node)) return;
        }
        renderList.push(node);
      });
      if (sort) {
        const opaque = [];
        const transparent = [];
        const ui = [];
        renderList.forEach((node) => {
          if (!node.program.transparent) {
            opaque.push(node);
          } else if (node.program.depthTest) {
            transparent.push(node);
          } else {
            ui.push(node);
          }
          node.zDepth = 0;
          if (node.renderOrder !== 0 || !node.program.depthTest || !camera) return;
          node.worldMatrix.getTranslation(tempVec32);
          tempVec32.applyMatrix4(camera.projectionViewMatrix);
          node.zDepth = tempVec32.z;
        });
        opaque.sort(this.sortOpaque);
        transparent.sort(this.sortTransparent);
        ui.sort(this.sortUI);
        renderList = opaque.concat(transparent, ui);
      }
      return renderList;
    }
    render({ scene, camera, target = null, update = true, sort = true, frustumCull = true, clear }) {
      if (target === null) {
        this.bindFramebuffer();
        this.setViewport(this.width * this.dpr, this.height * this.dpr);
      } else {
        this.bindFramebuffer(target);
        this.setViewport(target.width, target.height);
      }
      if (clear || this.autoClear && clear !== false) {
        if (this.depth && (!target || target.depth)) {
          this.enable(this.gl.DEPTH_TEST);
          this.setDepthMask(true);
        }
        if (this.stencil || (!target || target.stencil)) {
          this.enable(this.gl.STENCIL_TEST);
          this.setStencilMask(255);
        }
        this.gl.clear(
          (this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0)
        );
      }
      if (update) scene.updateMatrixWorld();
      if (camera) camera.updateMatrixWorld();
      const renderList = this.getRenderList({ scene, camera, frustumCull, sort });
      renderList.forEach((node) => {
        node.draw({ camera });
      });
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/functions/Vec4Func.js
  function copy2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  function set2(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  function scale2(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  function normalize4(out, a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    let w = a[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  function dot2(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/functions/QuatFunc.js
  function identity(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    let s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  function multiply2(out, a, b) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function rotateX(out, a, rad) {
    rad *= 0.5;
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  function rotateY(out, a, rad) {
    rad *= 0.5;
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let by = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  function rotateZ(out, a, rad) {
    rad *= 0.5;
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bz = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  function slerp(out, a, b, t) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > 1e-6) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function invert(out, a) {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    let dot4 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    let invDot = dot4 ? 1 / dot4 : 0;
    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
  }
  function fromMat3(out, m) {
    let fTrace = m[0] + m[4] + m[8];
    let fRoot;
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      let i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      let j = (i + 1) % 3;
      let k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }
  function fromEuler(out, euler, order = "YXZ") {
    let sx = Math.sin(euler[0] * 0.5);
    let cx = Math.cos(euler[0] * 0.5);
    let sy = Math.sin(euler[1] * 0.5);
    let cy = Math.cos(euler[1] * 0.5);
    let sz = Math.sin(euler[2] * 0.5);
    let cz = Math.cos(euler[2] * 0.5);
    if (order === "XYZ") {
      out[0] = sx * cy * cz + cx * sy * sz;
      out[1] = cx * sy * cz - sx * cy * sz;
      out[2] = cx * cy * sz + sx * sy * cz;
      out[3] = cx * cy * cz - sx * sy * sz;
    } else if (order === "YXZ") {
      out[0] = sx * cy * cz + cx * sy * sz;
      out[1] = cx * sy * cz - sx * cy * sz;
      out[2] = cx * cy * sz - sx * sy * cz;
      out[3] = cx * cy * cz + sx * sy * sz;
    } else if (order === "ZXY") {
      out[0] = sx * cy * cz - cx * sy * sz;
      out[1] = cx * sy * cz + sx * cy * sz;
      out[2] = cx * cy * sz + sx * sy * cz;
      out[3] = cx * cy * cz - sx * sy * sz;
    } else if (order === "ZYX") {
      out[0] = sx * cy * cz - cx * sy * sz;
      out[1] = cx * sy * cz + sx * cy * sz;
      out[2] = cx * cy * sz - sx * sy * cz;
      out[3] = cx * cy * cz + sx * sy * sz;
    } else if (order === "YZX") {
      out[0] = sx * cy * cz + cx * sy * sz;
      out[1] = cx * sy * cz + sx * cy * sz;
      out[2] = cx * cy * sz - sx * sy * cz;
      out[3] = cx * cy * cz - sx * sy * sz;
    } else if (order === "XZY") {
      out[0] = sx * cy * cz - cx * sy * sz;
      out[1] = cx * sy * cz - sx * cy * sz;
      out[2] = cx * cy * sz + sx * sy * cz;
      out[3] = cx * cy * cz + sx * sy * sz;
    }
    return out;
  }
  var copy3 = copy2;
  var set3 = set2;
  var dot3 = dot2;
  var normalize5 = normalize4;

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/Quat.js
  var Quat = class extends Array {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      super(x, y, z, w);
      this.onChange = () => {
      };
      this._target = this;
      const triggerProps = ["0", "1", "2", "3"];
      return new Proxy(this, {
        set(target, property) {
          const success = Reflect.set(...arguments);
          if (success && triggerProps.includes(property)) target.onChange();
          return success;
        }
      });
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    get z() {
      return this[2];
    }
    get w() {
      return this[3];
    }
    set x(v) {
      this._target[0] = v;
      this.onChange();
    }
    set y(v) {
      this._target[1] = v;
      this.onChange();
    }
    set z(v) {
      this._target[2] = v;
      this.onChange();
    }
    set w(v) {
      this._target[3] = v;
      this.onChange();
    }
    identity() {
      identity(this._target);
      this.onChange();
      return this;
    }
    set(x, y, z, w) {
      if (x.length) return this.copy(x);
      set3(this._target, x, y, z, w);
      this.onChange();
      return this;
    }
    rotateX(a) {
      rotateX(this._target, this._target, a);
      this.onChange();
      return this;
    }
    rotateY(a) {
      rotateY(this._target, this._target, a);
      this.onChange();
      return this;
    }
    rotateZ(a) {
      rotateZ(this._target, this._target, a);
      this.onChange();
      return this;
    }
    inverse(q = this._target) {
      invert(this._target, q);
      this.onChange();
      return this;
    }
    conjugate(q = this._target) {
      conjugate(this._target, q);
      this.onChange();
      return this;
    }
    copy(q) {
      copy3(this._target, q);
      this.onChange();
      return this;
    }
    normalize(q = this._target) {
      normalize5(this._target, q);
      this.onChange();
      return this;
    }
    multiply(qA, qB) {
      if (qB) {
        multiply2(this._target, qA, qB);
      } else {
        multiply2(this._target, this._target, qA);
      }
      this.onChange();
      return this;
    }
    dot(v) {
      return dot3(this._target, v);
    }
    fromMatrix3(matrix3) {
      fromMat3(this._target, matrix3);
      this.onChange();
      return this;
    }
    fromEuler(euler, isInternal) {
      fromEuler(this._target, euler, euler.order);
      if (!isInternal) this.onChange();
      return this;
    }
    fromAxisAngle(axis, a) {
      setAxisAngle(this._target, axis, a);
      this.onChange();
      return this;
    }
    slerp(q, t) {
      slerp(this._target, this._target, q, t);
      this.onChange();
      return this;
    }
    fromArray(a, o = 0) {
      this._target[0] = a[o];
      this._target[1] = a[o + 1];
      this._target[2] = a[o + 2];
      this._target[3] = a[o + 3];
      this.onChange();
      return this;
    }
    toArray(a = [], o = 0) {
      a[o] = this[0];
      a[o + 1] = this[1];
      a[o + 2] = this[2];
      a[o + 3] = this[3];
      return a;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/functions/Mat4Func.js
  var EPSILON = 1e-6;
  function copy4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function set4(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function identity2(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function invert2(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function determinant(a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply3(out, a, b) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a, v) {
    let x = v[0], y = v[1], z = v[2];
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  function scale3(out, a, v) {
    let x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function rotate(out, a, rad, axis) {
    let x = axis[0], y = axis[1], z = axis[2];
    let len = Math.hypot(x, y, z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;
    if (Math.abs(len) < EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  function getScaling(out, mat) {
    let m11 = mat[0];
    let m12 = mat[1];
    let m13 = mat[2];
    let m21 = mat[4];
    let m22 = mat[5];
    let m23 = mat[6];
    let m31 = mat[8];
    let m32 = mat[9];
    let m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }
  function getMaxScaleOnAxis(mat) {
    let m11 = mat[0];
    let m12 = mat[1];
    let m13 = mat[2];
    let m21 = mat[4];
    let m22 = mat[5];
    let m23 = mat[6];
    let m31 = mat[8];
    let m32 = mat[9];
    let m33 = mat[10];
    const x = m11 * m11 + m12 * m12 + m13 * m13;
    const y = m21 * m21 + m22 * m22 + m23 * m23;
    const z = m31 * m31 + m32 * m32 + m33 * m33;
    return Math.sqrt(Math.max(x, y, z));
  }
  var getRotation = /* @__PURE__ */ function() {
    const temp = [1, 1, 1];
    return function(out, mat) {
      let scaling = temp;
      getScaling(scaling, mat);
      let is1 = 1 / scaling[0];
      let is2 = 1 / scaling[1];
      let is3 = 1 / scaling[2];
      let sm11 = mat[0] * is1;
      let sm12 = mat[1] * is2;
      let sm13 = mat[2] * is3;
      let sm21 = mat[4] * is1;
      let sm22 = mat[5] * is2;
      let sm23 = mat[6] * is3;
      let sm31 = mat[8] * is1;
      let sm32 = mat[9] * is2;
      let sm33 = mat[10] * is3;
      let trace = sm11 + sm22 + sm33;
      let S = 0;
      if (trace > 0) {
        S = Math.sqrt(trace + 1) * 2;
        out[3] = 0.25 * S;
        out[0] = (sm23 - sm32) / S;
        out[1] = (sm31 - sm13) / S;
        out[2] = (sm12 - sm21) / S;
      } else if (sm11 > sm22 && sm11 > sm33) {
        S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
        out[3] = (sm23 - sm32) / S;
        out[0] = 0.25 * S;
        out[1] = (sm12 + sm21) / S;
        out[2] = (sm31 + sm13) / S;
      } else if (sm22 > sm33) {
        S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
        out[3] = (sm31 - sm13) / S;
        out[0] = (sm12 + sm21) / S;
        out[1] = 0.25 * S;
        out[2] = (sm23 + sm32) / S;
      } else {
        S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
        out[3] = (sm12 - sm21) / S;
        out[0] = (sm31 + sm13) / S;
        out[1] = (sm23 + sm32) / S;
        out[2] = 0.25 * S;
      }
      return out;
    };
  }();
  function decompose(srcMat, dstRotation, dstTranslation, dstScale) {
    let sx = length([srcMat[0], srcMat[1], srcMat[2]]);
    const sy = length([srcMat[4], srcMat[5], srcMat[6]]);
    const sz = length([srcMat[8], srcMat[9], srcMat[10]]);
    const det = determinant(srcMat);
    if (det < 0) sx = -sx;
    dstTranslation[0] = srcMat[12];
    dstTranslation[1] = srcMat[13];
    dstTranslation[2] = srcMat[14];
    const _m1 = srcMat.slice();
    const invSX = 1 / sx;
    const invSY = 1 / sy;
    const invSZ = 1 / sz;
    _m1[0] *= invSX;
    _m1[1] *= invSX;
    _m1[2] *= invSX;
    _m1[4] *= invSY;
    _m1[5] *= invSY;
    _m1[6] *= invSY;
    _m1[8] *= invSZ;
    _m1[9] *= invSZ;
    _m1[10] *= invSZ;
    getRotation(dstRotation, _m1);
    dstScale[0] = sx;
    dstScale[1] = sy;
    dstScale[2] = sz;
  }
  function compose(dstMat, srcRotation, srcTranslation, srcScale) {
    const te = dstMat;
    const x = srcRotation[0], y = srcRotation[1], z = srcRotation[2], w = srcRotation[3];
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    const sx = srcScale[0], sy = srcScale[1], sz = srcScale[2];
    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;
    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;
    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;
    te[12] = srcTranslation[0];
    te[13] = srcTranslation[1];
    te[14] = srcTranslation[2];
    te[15] = 1;
    return te;
  }
  function fromQuat(out, q) {
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function perspective(out, fovy, aspect, near, far) {
    let f = 1 / Math.tan(fovy / 2);
    let nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
  }
  function ortho(out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  function targetTo(out, eye, target, up) {
    let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len === 0) {
      z2 = 1;
    } else {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }
    let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len === 0) {
      if (upz) {
        upx += 1e-6;
      } else if (upy) {
        upz += 1e-6;
      } else {
        upy += 1e-6;
      }
      x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
      len = x0 * x0 + x1 * x1 + x2 * x2;
    }
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  function add3(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  function subtract2(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/Mat4.js
  var Mat4 = class extends Array {
    constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
      super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
      return this;
    }
    get x() {
      return this[12];
    }
    get y() {
      return this[13];
    }
    get z() {
      return this[14];
    }
    get w() {
      return this[15];
    }
    set x(v) {
      this[12] = v;
    }
    set y(v) {
      this[13] = v;
    }
    set z(v) {
      this[14] = v;
    }
    set w(v) {
      this[15] = v;
    }
    set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      if (m00.length) return this.copy(m00);
      set4(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
      return this;
    }
    translate(v, m = this) {
      translate(this, m, v);
      return this;
    }
    rotate(v, axis, m = this) {
      rotate(this, m, v, axis);
      return this;
    }
    scale(v, m = this) {
      scale3(this, m, typeof v === "number" ? [v, v, v] : v);
      return this;
    }
    add(ma, mb) {
      if (mb) add3(this, ma, mb);
      else add3(this, this, ma);
      return this;
    }
    sub(ma, mb) {
      if (mb) subtract2(this, ma, mb);
      else subtract2(this, this, ma);
      return this;
    }
    multiply(ma, mb) {
      if (!ma.length) {
        multiplyScalar(this, this, ma);
      } else if (mb) {
        multiply3(this, ma, mb);
      } else {
        multiply3(this, this, ma);
      }
      return this;
    }
    identity() {
      identity2(this);
      return this;
    }
    copy(m) {
      copy4(this, m);
      return this;
    }
    fromPerspective({ fov, aspect, near, far } = {}) {
      perspective(this, fov, aspect, near, far);
      return this;
    }
    fromOrthogonal({ left, right, bottom, top, near, far }) {
      ortho(this, left, right, bottom, top, near, far);
      return this;
    }
    fromQuaternion(q) {
      fromQuat(this, q);
      return this;
    }
    setPosition(v) {
      this.x = v[0];
      this.y = v[1];
      this.z = v[2];
      return this;
    }
    inverse(m = this) {
      invert2(this, m);
      return this;
    }
    compose(q, pos, scale5) {
      compose(this, q, pos, scale5);
      return this;
    }
    decompose(q, pos, scale5) {
      decompose(this, q, pos, scale5);
      return this;
    }
    getRotation(q) {
      getRotation(q, this);
      return this;
    }
    getTranslation(pos) {
      getTranslation(pos, this);
      return this;
    }
    getScaling(scale5) {
      getScaling(scale5, this);
      return this;
    }
    getMaxScaleOnAxis() {
      return getMaxScaleOnAxis(this);
    }
    lookAt(eye, target, up) {
      targetTo(this, eye, target, up);
      return this;
    }
    determinant() {
      return determinant(this);
    }
    fromArray(a, o = 0) {
      this[0] = a[o];
      this[1] = a[o + 1];
      this[2] = a[o + 2];
      this[3] = a[o + 3];
      this[4] = a[o + 4];
      this[5] = a[o + 5];
      this[6] = a[o + 6];
      this[7] = a[o + 7];
      this[8] = a[o + 8];
      this[9] = a[o + 9];
      this[10] = a[o + 10];
      this[11] = a[o + 11];
      this[12] = a[o + 12];
      this[13] = a[o + 13];
      this[14] = a[o + 14];
      this[15] = a[o + 15];
      return this;
    }
    toArray(a = [], o = 0) {
      a[o] = this[0];
      a[o + 1] = this[1];
      a[o + 2] = this[2];
      a[o + 3] = this[3];
      a[o + 4] = this[4];
      a[o + 5] = this[5];
      a[o + 6] = this[6];
      a[o + 7] = this[7];
      a[o + 8] = this[8];
      a[o + 9] = this[9];
      a[o + 10] = this[10];
      a[o + 11] = this[11];
      a[o + 12] = this[12];
      a[o + 13] = this[13];
      a[o + 14] = this[14];
      a[o + 15] = this[15];
      return a;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/functions/EulerFunc.js
  function fromRotationMatrix(out, m, order = "YXZ") {
    if (order === "XYZ") {
      out[1] = Math.asin(Math.min(Math.max(m[8], -1), 1));
      if (Math.abs(m[8]) < 0.99999) {
        out[0] = Math.atan2(-m[9], m[10]);
        out[2] = Math.atan2(-m[4], m[0]);
      } else {
        out[0] = Math.atan2(m[6], m[5]);
        out[2] = 0;
      }
    } else if (order === "YXZ") {
      out[0] = Math.asin(-Math.min(Math.max(m[9], -1), 1));
      if (Math.abs(m[9]) < 0.99999) {
        out[1] = Math.atan2(m[8], m[10]);
        out[2] = Math.atan2(m[1], m[5]);
      } else {
        out[1] = Math.atan2(-m[2], m[0]);
        out[2] = 0;
      }
    } else if (order === "ZXY") {
      out[0] = Math.asin(Math.min(Math.max(m[6], -1), 1));
      if (Math.abs(m[6]) < 0.99999) {
        out[1] = Math.atan2(-m[2], m[10]);
        out[2] = Math.atan2(-m[4], m[5]);
      } else {
        out[1] = 0;
        out[2] = Math.atan2(m[1], m[0]);
      }
    } else if (order === "ZYX") {
      out[1] = Math.asin(-Math.min(Math.max(m[2], -1), 1));
      if (Math.abs(m[2]) < 0.99999) {
        out[0] = Math.atan2(m[6], m[10]);
        out[2] = Math.atan2(m[1], m[0]);
      } else {
        out[0] = 0;
        out[2] = Math.atan2(-m[4], m[5]);
      }
    } else if (order === "YZX") {
      out[2] = Math.asin(Math.min(Math.max(m[1], -1), 1));
      if (Math.abs(m[1]) < 0.99999) {
        out[0] = Math.atan2(-m[9], m[5]);
        out[1] = Math.atan2(-m[2], m[0]);
      } else {
        out[0] = 0;
        out[1] = Math.atan2(m[8], m[10]);
      }
    } else if (order === "XZY") {
      out[2] = Math.asin(-Math.min(Math.max(m[4], -1), 1));
      if (Math.abs(m[4]) < 0.99999) {
        out[0] = Math.atan2(m[6], m[5]);
        out[1] = Math.atan2(m[8], m[0]);
      } else {
        out[0] = Math.atan2(-m[9], m[10]);
        out[1] = 0;
      }
    }
    return out;
  }

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/Euler.js
  var tmpMat4 = /* @__PURE__ */ new Mat4();
  var Euler = class extends Array {
    constructor(x = 0, y = x, z = x, order = "YXZ") {
      super(x, y, z);
      this.order = order;
      this.onChange = () => {
      };
      this._target = this;
      const triggerProps = ["0", "1", "2"];
      return new Proxy(this, {
        set(target, property) {
          const success = Reflect.set(...arguments);
          if (success && triggerProps.includes(property)) target.onChange();
          return success;
        }
      });
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    get z() {
      return this[2];
    }
    set x(v) {
      this._target[0] = v;
      this.onChange();
    }
    set y(v) {
      this._target[1] = v;
      this.onChange();
    }
    set z(v) {
      this._target[2] = v;
      this.onChange();
    }
    set(x, y = x, z = x) {
      if (x.length) return this.copy(x);
      this._target[0] = x;
      this._target[1] = y;
      this._target[2] = z;
      this.onChange();
      return this;
    }
    copy(v) {
      this._target[0] = v[0];
      this._target[1] = v[1];
      this._target[2] = v[2];
      this.onChange();
      return this;
    }
    reorder(order) {
      this._target.order = order;
      this.onChange();
      return this;
    }
    fromRotationMatrix(m, order = this.order) {
      fromRotationMatrix(this._target, m, order);
      this.onChange();
      return this;
    }
    fromQuaternion(q, order = this.order, isInternal) {
      tmpMat4.fromQuaternion(q);
      this._target.fromRotationMatrix(tmpMat4, order);
      if (!isInternal) this.onChange();
      return this;
    }
    fromArray(a, o = 0) {
      this._target[0] = a[o];
      this._target[1] = a[o + 1];
      this._target[2] = a[o + 2];
      return this;
    }
    toArray(a = [], o = 0) {
      a[o] = this[0];
      a[o + 1] = this[1];
      a[o + 2] = this[2];
      return a;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/Transform.js
  var Transform = class {
    constructor() {
      this.parent = null;
      this.children = [];
      this.visible = true;
      this.matrix = new Mat4();
      this.worldMatrix = new Mat4();
      this.matrixAutoUpdate = true;
      this.worldMatrixNeedsUpdate = false;
      this.position = new Vec3();
      this.quaternion = new Quat();
      this.scale = new Vec3(1);
      this.rotation = new Euler();
      this.up = new Vec3(0, 1, 0);
      this.rotation._target.onChange = () => this.quaternion.fromEuler(this.rotation, true);
      this.quaternion._target.onChange = () => this.rotation.fromQuaternion(this.quaternion, void 0, true);
    }
    setParent(parent, notifyParent = true) {
      if (this.parent && parent !== this.parent) this.parent.removeChild(this, false);
      this.parent = parent;
      if (notifyParent && parent) parent.addChild(this, false);
    }
    addChild(child, notifyChild = true) {
      if (!~this.children.indexOf(child)) this.children.push(child);
      if (notifyChild) child.setParent(this, false);
    }
    removeChild(child, notifyChild = true) {
      if (!!~this.children.indexOf(child)) this.children.splice(this.children.indexOf(child), 1);
      if (notifyChild) child.setParent(null, false);
    }
    updateMatrixWorld(force) {
      if (this.matrixAutoUpdate) this.updateMatrix();
      if (this.worldMatrixNeedsUpdate || force) {
        if (this.parent === null) this.worldMatrix.copy(this.matrix);
        else this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
        this.worldMatrixNeedsUpdate = false;
        force = true;
      }
      for (let i = 0, l = this.children.length; i < l; i++) {
        this.children[i].updateMatrixWorld(force);
      }
    }
    updateMatrix() {
      this.matrix.compose(this.quaternion, this.position, this.scale);
      this.worldMatrixNeedsUpdate = true;
    }
    traverse(callback) {
      if (callback(this)) return;
      for (let i = 0, l = this.children.length; i < l; i++) {
        this.children[i].traverse(callback);
      }
    }
    decompose() {
      this.matrix.decompose(this.quaternion._target, this.position, this.scale);
      this.rotation.fromQuaternion(this.quaternion);
    }
    lookAt(target, invert4 = false) {
      if (invert4) this.matrix.lookAt(this.position, target, this.up);
      else this.matrix.lookAt(target, this.position, this.up);
      this.matrix.getRotation(this.quaternion._target);
      this.rotation.fromQuaternion(this.quaternion);
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/Camera.js
  var tempMat4 = /* @__PURE__ */ new Mat4();
  var tempVec3a = /* @__PURE__ */ new Vec3();
  var tempVec3b = /* @__PURE__ */ new Vec3();
  var Camera = class extends Transform {
    constructor(gl, { near = 0.1, far = 100, fov = 45, aspect = 1, left, right, bottom, top, zoom = 1 } = {}) {
      super();
      Object.assign(this, { near, far, fov, aspect, left, right, bottom, top, zoom });
      this.projectionMatrix = new Mat4();
      this.viewMatrix = new Mat4();
      this.projectionViewMatrix = new Mat4();
      this.worldPosition = new Vec3();
      this.type = left || right ? "orthographic" : "perspective";
      if (this.type === "orthographic") this.orthographic();
      else this.perspective();
    }
    perspective({ near = this.near, far = this.far, fov = this.fov, aspect = this.aspect } = {}) {
      Object.assign(this, { near, far, fov, aspect });
      this.projectionMatrix.fromPerspective({ fov: fov * (Math.PI / 180), aspect, near, far });
      this.type = "perspective";
      return this;
    }
    orthographic({
      near = this.near,
      far = this.far,
      left = this.left || -1,
      right = this.right || 1,
      bottom = this.bottom || -1,
      top = this.top || 1,
      zoom = this.zoom
    } = {}) {
      Object.assign(this, { near, far, left, right, bottom, top, zoom });
      left /= zoom;
      right /= zoom;
      bottom /= zoom;
      top /= zoom;
      this.projectionMatrix.fromOrthogonal({ left, right, bottom, top, near, far });
      this.type = "orthographic";
      return this;
    }
    updateMatrixWorld() {
      super.updateMatrixWorld();
      this.viewMatrix.inverse(this.worldMatrix);
      this.worldMatrix.getTranslation(this.worldPosition);
      this.projectionViewMatrix.multiply(this.projectionMatrix, this.viewMatrix);
      return this;
    }
    updateProjectionMatrix() {
      if (this.type === "perspective") {
        return this.perspective();
      } else {
        return this.orthographic();
      }
    }
    lookAt(target) {
      super.lookAt(target, true);
      return this;
    }
    // Project 3D coordinate to 2D point
    project(v) {
      v.applyMatrix4(this.viewMatrix);
      v.applyMatrix4(this.projectionMatrix);
      return this;
    }
    // Unproject 2D point to 3D coordinate
    unproject(v) {
      v.applyMatrix4(tempMat4.inverse(this.projectionMatrix));
      v.applyMatrix4(this.worldMatrix);
      return this;
    }
    updateFrustum() {
      if (!this.frustum) {
        this.frustum = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
      }
      const m = this.projectionViewMatrix;
      this.frustum[0].set(m[3] - m[0], m[7] - m[4], m[11] - m[8]).constant = m[15] - m[12];
      this.frustum[1].set(m[3] + m[0], m[7] + m[4], m[11] + m[8]).constant = m[15] + m[12];
      this.frustum[2].set(m[3] + m[1], m[7] + m[5], m[11] + m[9]).constant = m[15] + m[13];
      this.frustum[3].set(m[3] - m[1], m[7] - m[5], m[11] - m[9]).constant = m[15] - m[13];
      this.frustum[4].set(m[3] - m[2], m[7] - m[6], m[11] - m[10]).constant = m[15] - m[14];
      this.frustum[5].set(m[3] + m[2], m[7] + m[6], m[11] + m[10]).constant = m[15] + m[14];
      for (let i = 0; i < 6; i++) {
        const invLen = 1 / this.frustum[i].distance();
        this.frustum[i].multiply(invLen);
        this.frustum[i].constant *= invLen;
      }
    }
    frustumIntersectsMesh(node, worldMatrix = node.worldMatrix) {
      if (!node.geometry.attributes.position) return true;
      if (!node.geometry.bounds || node.geometry.bounds.radius === Infinity) node.geometry.computeBoundingSphere();
      if (!node.geometry.bounds) return true;
      const center = tempVec3a;
      center.copy(node.geometry.bounds.center);
      center.applyMatrix4(worldMatrix);
      const radius = node.geometry.bounds.radius * worldMatrix.getMaxScaleOnAxis();
      return this.frustumIntersectsSphere(center, radius);
    }
    frustumIntersectsSphere(center, radius) {
      const normal = tempVec3b;
      for (let i = 0; i < 6; i++) {
        const plane = this.frustum[i];
        const distance2 = normal.copy(plane).dot(center) + plane.constant;
        if (distance2 < -radius) return false;
      }
      return true;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/functions/Mat3Func.js
  function fromMat4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
  }
  function fromQuat2(out, q) {
    let x = q[0], y = q[1], z = q[2], w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;
    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;
    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;
    return out;
  }
  function copy5(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  function set5(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
  }
  function identity3(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }
  function invert3(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2];
    let a10 = a[3], a11 = a[4], a12 = a[5];
    let a20 = a[6], a21 = a[7], a22 = a[8];
    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  function multiply4(out, a, b) {
    let a00 = a[0], a01 = a[1], a02 = a[2];
    let a10 = a[3], a11 = a[4], a12 = a[5];
    let a20 = a[6], a21 = a[7], a22 = a[8];
    let b00 = b[0], b01 = b[1], b02 = b[2];
    let b10 = b[3], b11 = b[4], b12 = b[5];
    let b20 = b[6], b21 = b[7], b22 = b[8];
    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  function translate2(out, a, v) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a10;
    out[4] = a11;
    out[5] = a12;
    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
  }
  function rotate2(out, a, rad) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;
    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;
    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
  }
  function scale4(out, a, v) {
    let x = v[0], y = v[1];
    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];
    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  function normalFromMat4(out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
  }

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/Mat3.js
  var Mat3 = class extends Array {
    constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
      super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
      return this;
    }
    set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      if (m00.length) return this.copy(m00);
      set5(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
      return this;
    }
    translate(v, m = this) {
      translate2(this, m, v);
      return this;
    }
    rotate(v, m = this) {
      rotate2(this, m, v);
      return this;
    }
    scale(v, m = this) {
      scale4(this, m, v);
      return this;
    }
    multiply(ma, mb) {
      if (mb) {
        multiply4(this, ma, mb);
      } else {
        multiply4(this, this, ma);
      }
      return this;
    }
    identity() {
      identity3(this);
      return this;
    }
    copy(m) {
      copy5(this, m);
      return this;
    }
    fromMatrix4(m) {
      fromMat4(this, m);
      return this;
    }
    fromQuaternion(q) {
      fromQuat2(this, q);
      return this;
    }
    fromBasis(vec3a, vec3b, vec3c) {
      this.set(vec3a[0], vec3a[1], vec3a[2], vec3b[0], vec3b[1], vec3b[2], vec3c[0], vec3c[1], vec3c[2]);
      return this;
    }
    inverse(m = this) {
      invert3(this, m);
      return this;
    }
    getNormalMatrix(m) {
      normalFromMat4(this, m);
      return this;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/Mesh.js
  var ID4 = 0;
  var Mesh = class extends Transform {
    constructor(gl, { geometry, program, mode = gl.TRIANGLES, frustumCulled = true, renderOrder = 0 } = {}) {
      super();
      if (!gl.canvas) console.error("gl not passed as first argument to Mesh");
      this.gl = gl;
      this.id = ID4++;
      this.geometry = geometry;
      this.program = program;
      this.mode = mode;
      this.frustumCulled = frustumCulled;
      this.renderOrder = renderOrder;
      this.modelViewMatrix = new Mat4();
      this.normalMatrix = new Mat3();
      this.beforeRenderCallbacks = [];
      this.afterRenderCallbacks = [];
    }
    onBeforeRender(f) {
      this.beforeRenderCallbacks.push(f);
      return this;
    }
    onAfterRender(f) {
      this.afterRenderCallbacks.push(f);
      return this;
    }
    draw({ camera } = {}) {
      if (camera) {
        if (!this.program.uniforms.modelMatrix) {
          Object.assign(this.program.uniforms, {
            modelMatrix: { value: null },
            viewMatrix: { value: null },
            modelViewMatrix: { value: null },
            normalMatrix: { value: null },
            projectionMatrix: { value: null },
            cameraPosition: { value: null }
          });
        }
        this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
        this.program.uniforms.cameraPosition.value = camera.worldPosition;
        this.program.uniforms.viewMatrix.value = camera.viewMatrix;
        this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
        this.normalMatrix.getNormalMatrix(this.modelViewMatrix);
        this.program.uniforms.modelMatrix.value = this.worldMatrix;
        this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
        this.program.uniforms.normalMatrix.value = this.normalMatrix;
      }
      this.beforeRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
      let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;
      this.program.use({ flipFaces });
      this.geometry.draw({ mode: this.mode, program: this.program });
      this.afterRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/Texture.js
  var emptyPixel = new Uint8Array(4);
  function isPowerOf2(value) {
    return (value & value - 1) === 0;
  }
  var ID5 = 1;
  var Texture = class {
    constructor(gl, {
      image,
      target = gl.TEXTURE_2D,
      type = gl.UNSIGNED_BYTE,
      format = gl.RGBA,
      internalFormat = format,
      wrapS = gl.CLAMP_TO_EDGE,
      wrapT = gl.CLAMP_TO_EDGE,
      wrapR = gl.CLAMP_TO_EDGE,
      generateMipmaps = target === (gl.TEXTURE_2D || gl.TEXTURE_CUBE_MAP),
      minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
      magFilter = gl.LINEAR,
      premultiplyAlpha = false,
      unpackAlignment = 4,
      flipY = target == (gl.TEXTURE_2D || gl.TEXTURE_3D) ? true : false,
      anisotropy = 0,
      level = 0,
      width,
      // used for RenderTargets or Data Textures
      height = width,
      length: length3 = 1
    } = {}) {
      this.gl = gl;
      this.id = ID5++;
      this.image = image;
      this.target = target;
      this.type = type;
      this.format = format;
      this.internalFormat = internalFormat;
      this.minFilter = minFilter;
      this.magFilter = magFilter;
      this.wrapS = wrapS;
      this.wrapT = wrapT;
      this.wrapR = wrapR;
      this.generateMipmaps = generateMipmaps;
      this.premultiplyAlpha = premultiplyAlpha;
      this.unpackAlignment = unpackAlignment;
      this.flipY = flipY;
      this.anisotropy = Math.min(anisotropy, this.gl.renderer.parameters.maxAnisotropy);
      this.level = level;
      this.width = width;
      this.height = height;
      this.length = length3;
      this.texture = this.gl.createTexture();
      this.store = {
        image: null
      };
      this.glState = this.gl.renderer.state;
      this.state = {};
      this.state.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
      this.state.magFilter = this.gl.LINEAR;
      this.state.wrapS = this.gl.REPEAT;
      this.state.wrapT = this.gl.REPEAT;
      this.state.anisotropy = 0;
    }
    bind() {
      if (this.glState.textureUnits[this.glState.activeTextureUnit] === this.id) return;
      this.gl.bindTexture(this.target, this.texture);
      this.glState.textureUnits[this.glState.activeTextureUnit] = this.id;
    }
    update(textureUnit = 0) {
      const needsUpdate = !(this.image === this.store.image && !this.needsUpdate);
      if (needsUpdate || this.glState.textureUnits[textureUnit] !== this.id) {
        this.gl.renderer.activeTexture(textureUnit);
        this.bind();
      }
      if (!needsUpdate) return;
      this.needsUpdate = false;
      if (this.flipY !== this.glState.flipY) {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
        this.glState.flipY = this.flipY;
      }
      if (this.premultiplyAlpha !== this.glState.premultiplyAlpha) {
        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
        this.glState.premultiplyAlpha = this.premultiplyAlpha;
      }
      if (this.unpackAlignment !== this.glState.unpackAlignment) {
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
        this.glState.unpackAlignment = this.unpackAlignment;
      }
      if (this.minFilter !== this.state.minFilter) {
        this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
        this.state.minFilter = this.minFilter;
      }
      if (this.magFilter !== this.state.magFilter) {
        this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
        this.state.magFilter = this.magFilter;
      }
      if (this.wrapS !== this.state.wrapS) {
        this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.wrapS);
        this.state.wrapS = this.wrapS;
      }
      if (this.wrapT !== this.state.wrapT) {
        this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.wrapT);
        this.state.wrapT = this.wrapT;
      }
      if (this.wrapR !== this.state.wrapR) {
        this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_R, this.wrapR);
        this.state.wrapR = this.wrapR;
      }
      if (this.anisotropy && this.anisotropy !== this.state.anisotropy) {
        this.gl.texParameterf(this.target, this.gl.renderer.getExtension("EXT_texture_filter_anisotropic").TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropy);
        this.state.anisotropy = this.anisotropy;
      }
      if (this.image) {
        if (this.image.width) {
          this.width = this.image.width;
          this.height = this.image.height;
        }
        if (this.target === this.gl.TEXTURE_CUBE_MAP) {
          for (let i = 0; i < 6; i++) {
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.level, this.internalFormat, this.format, this.type, this.image[i]);
          }
        } else if (ArrayBuffer.isView(this.image)) {
          if (this.target === this.gl.TEXTURE_2D) {
            this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.image);
          } else if (this.target === this.gl.TEXTURE_2D_ARRAY || this.target === this.gl.TEXTURE_3D) {
            this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, this.image);
          }
        } else if (this.image.isCompressedTexture) {
          for (let level = 0; level < this.image.length; level++) {
            this.gl.compressedTexImage2D(this.target, level, this.internalFormat, this.image[level].width, this.image[level].height, 0, this.image[level].data);
          }
        } else {
          if (this.target === this.gl.TEXTURE_2D) {
            this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
          } else {
            this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, this.image);
          }
        }
        if (this.generateMipmaps) {
          if (!this.gl.renderer.isWebgl2 && (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height))) {
            this.generateMipmaps = false;
            this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
            this.minFilter = this.gl.LINEAR;
          } else {
            this.gl.generateMipmap(this.target);
          }
        }
        this.onUpdate && this.onUpdate();
      } else {
        if (this.target === this.gl.TEXTURE_CUBE_MAP) {
          for (let i = 0; i < 6; i++) {
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
          }
        } else if (this.width) {
          if (this.target === this.gl.TEXTURE_2D) {
            this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
          } else {
            this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, null);
          }
        } else {
          this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
        }
      }
      this.store.image = this.image;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/core/RenderTarget.js
  var RenderTarget = class {
    constructor(gl, {
      width = gl.canvas.width,
      height = gl.canvas.height,
      target = gl.FRAMEBUFFER,
      color = 1,
      // number of color attachments
      depth = true,
      stencil = false,
      depthTexture = false,
      wrapS = gl.CLAMP_TO_EDGE,
      wrapT = gl.CLAMP_TO_EDGE,
      wrapR = gl.CLAMP_TO_EDGE,
      minFilter = gl.LINEAR,
      magFilter = minFilter,
      type = gl.UNSIGNED_BYTE,
      format = gl.RGBA,
      internalFormat = format,
      unpackAlignment,
      premultiplyAlpha
    } = {}) {
      this.gl = gl;
      this.width = width;
      this.height = height;
      this.depth = depth;
      this.stencil = stencil;
      this.buffer = this.gl.createFramebuffer();
      this.target = target;
      this.gl.renderer.bindFramebuffer(this);
      this.textures = [];
      const drawBuffers = [];
      for (let i = 0; i < color; i++) {
        this.textures.push(
          new Texture(gl, {
            width,
            height,
            wrapS,
            wrapT,
            wrapR,
            minFilter,
            magFilter,
            type,
            format,
            internalFormat,
            unpackAlignment,
            premultiplyAlpha,
            flipY: false,
            generateMipmaps: false
          })
        );
        this.textures[i].update();
        this.gl.framebufferTexture2D(
          this.target,
          this.gl.COLOR_ATTACHMENT0 + i,
          this.gl.TEXTURE_2D,
          this.textures[i].texture,
          0
          /* level */
        );
        drawBuffers.push(this.gl.COLOR_ATTACHMENT0 + i);
      }
      if (drawBuffers.length > 1) this.gl.renderer.drawBuffers(drawBuffers);
      this.texture = this.textures[0];
      if (depthTexture && (this.gl.renderer.isWebgl2 || this.gl.renderer.getExtension("WEBGL_depth_texture"))) {
        this.depthTexture = new Texture(gl, {
          width,
          height,
          minFilter: this.gl.NEAREST,
          magFilter: this.gl.NEAREST,
          format: this.stencil ? this.gl.DEPTH_STENCIL : this.gl.DEPTH_COMPONENT,
          internalFormat: gl.renderer.isWebgl2 ? this.stencil ? this.gl.DEPTH24_STENCIL8 : this.gl.DEPTH_COMPONENT16 : this.gl.DEPTH_COMPONENT,
          type: this.stencil ? this.gl.UNSIGNED_INT_24_8 : this.gl.UNSIGNED_INT
        });
        this.depthTexture.update();
        this.gl.framebufferTexture2D(
          this.target,
          this.stencil ? this.gl.DEPTH_STENCIL_ATTACHMENT : this.gl.DEPTH_ATTACHMENT,
          this.gl.TEXTURE_2D,
          this.depthTexture.texture,
          0
          /* level */
        );
      } else {
        if (depth && !stencil) {
          this.depthBuffer = this.gl.createRenderbuffer();
          this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
          this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
          this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer);
        }
        if (stencil && !depth) {
          this.stencilBuffer = this.gl.createRenderbuffer();
          this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.stencilBuffer);
          this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.STENCIL_INDEX8, width, height);
          this.gl.framebufferRenderbuffer(this.target, this.gl.STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.stencilBuffer);
        }
        if (depth && stencil) {
          this.depthStencilBuffer = this.gl.createRenderbuffer();
          this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthStencilBuffer);
          this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, width, height);
          this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.depthStencilBuffer);
        }
      }
      this.gl.renderer.bindFramebuffer({ target: this.target });
    }
    setSize(width, height) {
      if (this.width === width && this.height === height) return;
      this.width = width;
      this.height = height;
      this.gl.renderer.bindFramebuffer(this);
      for (let i = 0; i < this.textures.length; i++) {
        this.textures[i].width = width;
        this.textures[i].height = height;
        this.textures[i].needsUpdate = true;
        this.textures[i].update();
        this.gl.framebufferTexture2D(
          this.target,
          this.gl.COLOR_ATTACHMENT0 + i,
          this.gl.TEXTURE_2D,
          this.textures[i].texture,
          0
          /* level */
        );
      }
      if (this.depthTexture) {
        this.depthTexture.width = width;
        this.depthTexture.height = height;
        this.depthTexture.needsUpdate = true;
        this.depthTexture.update();
        this.gl.framebufferTexture2D(
          this.target,
          this.gl.DEPTH_ATTACHMENT,
          this.gl.TEXTURE_2D,
          this.depthTexture.texture,
          0
          /* level */
        );
      } else {
        if (this.depthBuffer) {
          this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
          this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
        }
        if (this.stencilBuffer) {
          this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.stencilBuffer);
          this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.STENCIL_INDEX8, width, height);
        }
        if (this.depthStencilBuffer) {
          this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthStencilBuffer);
          this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, width, height);
        }
      }
      this.gl.renderer.bindFramebuffer({ target: this.target });
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/math/Vec4.js
  var Vec4 = class extends Array {
    constructor(x = 0, y = x, z = x, w = x) {
      super(x, y, z, w);
      return this;
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    get z() {
      return this[2];
    }
    get w() {
      return this[3];
    }
    set x(v) {
      this[0] = v;
    }
    set y(v) {
      this[1] = v;
    }
    set z(v) {
      this[2] = v;
    }
    set w(v) {
      this[3] = v;
    }
    set(x, y = x, z = x, w = x) {
      if (x.length) return this.copy(x);
      set2(this, x, y, z, w);
      return this;
    }
    copy(v) {
      copy2(this, v);
      return this;
    }
    normalize() {
      normalize4(this, this);
      return this;
    }
    multiply(v) {
      scale2(this, this, v);
      return this;
    }
    dot(v) {
      return dot2(this, v);
    }
    fromArray(a, o = 0) {
      this[0] = a[o];
      this[1] = a[o + 1];
      this[2] = a[o + 2];
      this[3] = a[o + 3];
      return this;
    }
    toArray(a = [], o = 0) {
      a[o] = this[0];
      a[o + 1] = this[1];
      a[o + 2] = this[2];
      a[o + 3] = this[3];
      return a;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/extras/Plane.js
  var Plane = class _Plane extends Geometry {
    constructor(gl, { width = 1, height = 1, widthSegments = 1, heightSegments = 1, attributes = {} } = {}) {
      const wSegs = widthSegments;
      const hSegs = heightSegments;
      const num = (wSegs + 1) * (hSegs + 1);
      const numIndices = wSegs * hSegs * 6;
      const position = new Float32Array(num * 3);
      const normal = new Float32Array(num * 3);
      const uv = new Float32Array(num * 2);
      const index = numIndices > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
      _Plane.buildPlane(position, normal, uv, index, width, height, 0, wSegs, hSegs);
      Object.assign(attributes, {
        position: { size: 3, data: position },
        normal: { size: 3, data: normal },
        uv: { size: 2, data: uv },
        index: { data: index }
      });
      super(gl, attributes);
    }
    static buildPlane(position, normal, uv, index, width, height, depth, wSegs, hSegs, u = 0, v = 1, w = 2, uDir = 1, vDir = -1, i = 0, ii = 0) {
      const io = i;
      const segW = width / wSegs;
      const segH = height / hSegs;
      for (let iy = 0; iy <= hSegs; iy++) {
        let y = iy * segH - height / 2;
        for (let ix = 0; ix <= wSegs; ix++, i++) {
          let x = ix * segW - width / 2;
          position[i * 3 + u] = x * uDir;
          position[i * 3 + v] = y * vDir;
          position[i * 3 + w] = depth / 2;
          normal[i * 3 + u] = 0;
          normal[i * 3 + v] = 0;
          normal[i * 3 + w] = depth >= 0 ? 1 : -1;
          uv[i * 2] = ix / wSegs;
          uv[i * 2 + 1] = 1 - iy / hSegs;
          if (iy === hSegs || ix === wSegs) continue;
          let a = io + ix + iy * (wSegs + 1);
          let b = io + ix + (iy + 1) * (wSegs + 1);
          let c = io + ix + (iy + 1) * (wSegs + 1) + 1;
          let d = io + ix + iy * (wSegs + 1) + 1;
          index[ii * 6] = a;
          index[ii * 6 + 1] = b;
          index[ii * 6 + 2] = d;
          index[ii * 6 + 3] = b;
          index[ii * 6 + 4] = c;
          index[ii * 6 + 5] = d;
          ii++;
        }
      }
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/extras/Triangle.js
  var Triangle = class extends Geometry {
    constructor(gl, { attributes = {} } = {}) {
      Object.assign(attributes, {
        position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
      });
      super(gl, attributes);
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/extras/NormalProgram.js
  var vertex = (
    /* glsl */
    `
    precision highp float;
    precision highp int;

    attribute vec3 position;
    attribute vec3 normal;

    uniform mat3 normalMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec3 vNormal;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`
  );
  var fragment = (
    /* glsl */
    `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;

    void main() {
        gl_FragColor.rgb = normalize(vNormal);
        gl_FragColor.a = 1.0;
    }
`
  );
  function NormalProgram(gl) {
    return new Program(gl, {
      vertex,
      fragment,
      cullFace: false
    });
  }

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/extras/GLTFAnimation.js
  var tmpVec3A = /* @__PURE__ */ new Vec3();
  var tmpVec3B = /* @__PURE__ */ new Vec3();
  var tmpVec3C = /* @__PURE__ */ new Vec3();
  var tmpVec3D = /* @__PURE__ */ new Vec3();
  var tmpQuatA = /* @__PURE__ */ new Quat();
  var tmpQuatB = /* @__PURE__ */ new Quat();
  var tmpQuatC = /* @__PURE__ */ new Quat();
  var tmpQuatD = /* @__PURE__ */ new Quat();
  var GLTFAnimation = class {
    constructor(data, weight = 1) {
      this.data = data;
      this.elapsed = 0;
      this.weight = weight;
      this.loop = true;
      this.startTime = data.reduce((a, { times }) => Math.min(a, times[0]), Infinity);
      this.endTime = data.reduce((a, { times }) => Math.max(a, times[times.length - 1]), 0);
      this.duration = this.endTime - this.startTime;
    }
    update(totalWeight = 1, isSet) {
      const weight = isSet ? 1 : this.weight / totalWeight;
      const elapsed = !this.duration ? 0 : (this.loop ? this.elapsed % this.duration : Math.min(this.elapsed, this.duration - 1e-3)) + this.startTime;
      this.data.forEach(({ node, transform, interpolation, times, values }) => {
        if (!this.duration) {
          let val = tmpVec3A;
          let size2 = 3;
          if (transform === "quaternion") {
            val = tmpQuatA;
            size2 = 4;
          }
          val.fromArray(values, 0);
          if (size2 === 4) node[transform].slerp(val, weight);
          else node[transform].lerp(val, weight);
          return;
        }
        const prevIndex = Math.max(
          1,
          times.findIndex((t) => t > elapsed)
        ) - 1;
        const nextIndex = prevIndex + 1;
        let alpha = (elapsed - times[prevIndex]) / (times[nextIndex] - times[prevIndex]);
        if (interpolation === "STEP") alpha = 0;
        let prevVal = tmpVec3A;
        let prevTan = tmpVec3B;
        let nextTan = tmpVec3C;
        let nextVal = tmpVec3D;
        let size = 3;
        if (transform === "quaternion") {
          prevVal = tmpQuatA;
          prevTan = tmpQuatB;
          nextTan = tmpQuatC;
          nextVal = tmpQuatD;
          size = 4;
        }
        if (interpolation === "CUBICSPLINE") {
          prevVal.fromArray(values, prevIndex * size * 3 + size * 1);
          prevTan.fromArray(values, prevIndex * size * 3 + size * 2);
          nextTan.fromArray(values, nextIndex * size * 3 + size * 0);
          nextVal.fromArray(values, nextIndex * size * 3 + size * 1);
          prevVal = this.cubicSplineInterpolate(alpha, prevVal, prevTan, nextTan, nextVal);
          if (size === 4) prevVal.normalize();
        } else {
          prevVal.fromArray(values, prevIndex * size);
          nextVal.fromArray(values, nextIndex * size);
          if (size === 4) prevVal.slerp(nextVal, alpha);
          else prevVal.lerp(nextVal, alpha);
        }
        if (size === 4) node[transform].slerp(prevVal, weight);
        else node[transform].lerp(prevVal, weight);
      });
    }
    cubicSplineInterpolate(t, prevVal, prevTan, nextTan, nextVal) {
      const t2 = t * t;
      const t3 = t2 * t;
      const s2 = 3 * t2 - 2 * t3;
      const s3 = t3 - t2;
      const s0 = 1 - s2;
      const s1 = s3 - t2 + t;
      for (let i = 0; i < prevVal.length; i++) {
        prevVal[i] = s0 * prevVal[i] + s1 * (1 - t) * prevTan[i] + s2 * nextVal[i] + s3 * t * nextTan[i];
      }
      return prevVal;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/extras/GLTFSkin.js
  var tempMat42 = /* @__PURE__ */ new Mat4();
  var identity4 = /* @__PURE__ */ new Mat4();
  var GLTFSkin = class extends Mesh {
    constructor(gl, { skeleton, geometry, program, mode = gl.TRIANGLES } = {}) {
      super(gl, { geometry, program, mode });
      this.skeleton = skeleton;
      this.program = program;
      this.createBoneTexture();
    }
    createBoneTexture() {
      if (!this.skeleton.joints.length) return;
      const size = Math.max(4, Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.skeleton.joints.length * 4)) / Math.LN2)));
      this.boneMatrices = new Float32Array(size * size * 4);
      this.boneTextureSize = size;
      this.boneTexture = new Texture(this.gl, {
        image: this.boneMatrices,
        generateMipmaps: false,
        type: this.gl.FLOAT,
        internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA32F : this.gl.RGBA,
        minFilter: this.gl.NEAREST,
        magFilter: this.gl.NEAREST,
        flipY: false,
        width: size
      });
    }
    updateUniforms() {
      this.skeleton.joints.forEach((bone, i) => {
        tempMat42.multiply(bone.worldMatrix, bone.bindInverse);
        this.boneMatrices.set(tempMat42, i * 16);
      });
      this.boneTexture.needsUpdate = true;
      this.program.uniforms.boneTexture.value = this.boneTexture;
      this.program.uniforms.boneTextureSize.value = this.boneTextureSize;
    }
    draw({ camera } = {}) {
      if (!this.program.uniforms.boneTexture) {
        Object.assign(this.program.uniforms, {
          boneTexture: { value: this.boneTexture },
          boneTextureSize: { value: this.boneTextureSize }
        });
      }
      this.updateUniforms();
      const _worldMatrix = this.worldMatrix;
      this.worldMatrix = identity4;
      super.draw({ camera });
      this.worldMatrix = _worldMatrix;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/extras/InstancedMesh.js
  var InstancedMesh = class extends Mesh {
    constructor(...args) {
      super(...args);
      this.frustumCulled = false;
      this.isInstancedMesh = true;
    }
    addFrustumCull() {
      this.instanceTransforms = null;
      this.instanceLightmapScaleOffset = null;
      this.totalInstanceCount = 0;
      this.frustumCullFunction = null;
      this.instanceRenderList = null;
      if (!this.geometry.attributes.instanceMatrix)
        console.error(`mesh ${this.name ? `"${this.name}" ` : ``}missing instanceMatrix attribute; unable to frustum cull`);
      const matrixData = this.geometry.attributes.instanceMatrix.data;
      this.instanceTransforms = [];
      for (let i = 0, j = 0; i < matrixData.length; i += 16, j++) {
        const transform = new Transform();
        transform.index = j;
        transform.matrix.fromArray(matrixData, i);
        transform.decompose();
        this.instanceTransforms.push(transform);
        transform.setParent(this.parent);
      }
      this.totalInstanceCount = this.instanceTransforms.length;
      if (!!this.geometry.attributes.lightmapScaleOffset) {
        const lightmapData = this.geometry.attributes.lightmapScaleOffset.data;
        for (let i = 0, j = 0; i < lightmapData.length; i += 4, j++) {
          this.instanceTransforms[j].lightmapData = new Vec4().fromArray(lightmapData, i);
        }
      }
      this.frustumCullFunction = ({ camera }) => {
        this.instanceRenderList = [];
        this.instanceTransforms.forEach((transform) => {
          if (!camera.frustumIntersectsMesh(this, transform.worldMatrix)) return;
          this.instanceRenderList.push(transform);
        });
        this.instanceRenderList.forEach((transform, i) => {
          transform.matrix.toArray(this.geometry.attributes.instanceMatrix.data, i * 16);
          if (transform.lightmapData) {
            transform.lightmapData.toArray(this.geometry.attributes.lightmapScaleOffset.data, i * 4);
            this.geometry.attributes.lightmapScaleOffset.needsUpdate = true;
          }
        });
        this.geometry.instancedCount = this.instanceRenderList.length;
        this.geometry.attributes.instanceMatrix.needsUpdate = true;
      };
      this.onBeforeRender(this.frustumCullFunction);
    }
    removeFrustumCull() {
      this.offBeforeRender(this.frustumCullFunction);
      this.geometry.instancedCount = this.totalInstanceCount;
      this.instanceTransforms.forEach((transform, i) => {
        transform.matrix.toArray(this.geometry.attributes.instanceMatrix.data, i * 16);
        if (transform.lightmapData) {
          transform.lightmapData.toArray(this.geometry.attributes.lightmapScaleOffset.data, i * 4);
          this.geometry.attributes.lightmapScaleOffset.needsUpdate = true;
        }
      });
      this.geometry.attributes.instanceMatrix.needsUpdate = true;
    }
  };

  // node_modules/.pnpm/ogl@1.0.10/node_modules/ogl/src/extras/GLTFLoader.js
  var TYPE_ARRAY = {
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array,
    "image/jpeg": Uint8Array,
    "image/png": Uint8Array
  };
  var TYPE_SIZE = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16
  };
  var ATTRIBUTES = {
    POSITION: "position",
    NORMAL: "normal",
    TANGENT: "tangent",
    TEXCOORD_0: "uv",
    TEXCOORD_1: "uv2",
    COLOR_0: "color",
    WEIGHTS_0: "skinWeight",
    JOINTS_0: "skinIndex"
  };
  var TRANSFORMS = {
    translation: "position",
    rotation: "quaternion",
    scale: "scale"
  };
  var GLTFLoader = class {
    static setBasisManager(manager) {
      this.basisManager = manager;
    }
    static async load(gl, src) {
      const dir = src.split("/").slice(0, -1).join("/") + "/";
      const desc = await this.parseDesc(src);
      return this.parse(gl, desc, dir);
    }
    static async parse(gl, desc, dir) {
      if (desc.asset === void 0 || desc.asset.version[0] < 2) console.warn("Only GLTF >=2.0 supported. Attempting to parse.");
      if (desc.extensionsRequired?.includes("KHR_texture_basisu") && !this.basisManager)
        console.warn("KHR_texture_basisu extension required but no manager supplied. Use .setBasisManager()");
      const buffers = await this.loadBuffers(desc, dir);
      gl.renderer.bindVertexArray(null);
      const bufferViews = this.parseBufferViews(gl, desc, buffers);
      const images = await this.parseImages(gl, desc, dir, bufferViews);
      const textures = this.parseTextures(gl, desc, images);
      const materials = this.parseMaterials(gl, desc, textures);
      const skins = this.parseSkins(gl, desc, bufferViews);
      const meshes = this.parseMeshes(gl, desc, bufferViews, materials, skins);
      const [nodes, cameras] = this.parseNodes(gl, desc, meshes, skins, images);
      this.populateSkins(skins, nodes);
      const animations = this.parseAnimations(gl, desc, nodes, bufferViews);
      const scenes = this.parseScenes(desc, nodes);
      const scene = scenes[desc.scene];
      const lights = this.parseLights(gl, desc, nodes, scenes);
      for (let i = nodes.length; i >= 0; i--) if (!nodes[i]) nodes.splice(i, 1);
      return {
        json: desc,
        buffers,
        bufferViews,
        cameras,
        images,
        textures,
        materials,
        meshes,
        nodes,
        lights,
        animations,
        scenes,
        scene
      };
    }
    static parseDesc(src) {
      if (!src.match(/\.glb/)) {
        return fetch(src).then((res) => res.json());
      } else {
        return fetch(src).then((res) => res.arrayBuffer()).then((glb) => this.unpackGLB(glb));
      }
    }
    // From https://github.com/donmccurdy/glTF-Transform/blob/e4108cc/packages/core/src/io/io.ts#L32
    static unpackGLB(glb) {
      const header = new Uint32Array(glb, 0, 3);
      if (header[0] !== 1179937895) {
        throw new Error("Invalid glTF asset.");
      } else if (header[1] !== 2) {
        throw new Error(`Unsupported glTF binary version, "${header[1]}".`);
      }
      const jsonChunkHeader = new Uint32Array(glb, 12, 2);
      const jsonByteOffset = 20;
      const jsonByteLength = jsonChunkHeader[0];
      if (jsonChunkHeader[1] !== 1313821514) {
        throw new Error("Unexpected GLB layout.");
      }
      const jsonText = new TextDecoder().decode(glb.slice(jsonByteOffset, jsonByteOffset + jsonByteLength));
      const json = JSON.parse(jsonText);
      if (jsonByteOffset + jsonByteLength === glb.byteLength) return json;
      const binaryChunkHeader = new Uint32Array(glb, jsonByteOffset + jsonByteLength, 2);
      if (binaryChunkHeader[1] !== 5130562) {
        throw new Error("Unexpected GLB layout.");
      }
      const binaryByteOffset = jsonByteOffset + jsonByteLength + 8;
      const binaryByteLength = binaryChunkHeader[0];
      const binary = glb.slice(binaryByteOffset, binaryByteOffset + binaryByteLength);
      json.buffers[0].binary = binary;
      return json;
    }
    // Threejs GLTF Loader https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/GLTFLoader.js#L1085
    static resolveURI(uri, dir) {
      if (typeof uri !== "string" || uri === "") return "";
      if (/^https?:\/\//i.test(dir) && /^\//.test(uri)) {
        dir = dir.replace(/(^https?:\/\/[^\/]+).*/i, "$1");
      }
      if (/^(https?:)?\/\//i.test(uri)) return uri;
      if (/^data:.*,.*$/i.test(uri)) return uri;
      if (/^blob:.*$/i.test(uri)) return uri;
      return dir + uri;
    }
    static loadBuffers(desc, dir) {
      if (!desc.buffers) return null;
      return Promise.all(
        desc.buffers.map((buffer) => {
          if (buffer.binary) return buffer.binary;
          const uri = this.resolveURI(buffer.uri, dir);
          return fetch(uri).then((res) => res.arrayBuffer());
        })
      );
    }
    static parseBufferViews(gl, desc, buffers) {
      if (!desc.bufferViews) return null;
      const bufferViews = desc.bufferViews.map((o) => Object.assign({}, o));
      desc.meshes && desc.meshes.forEach(({ primitives }) => {
        primitives.forEach(({ attributes, indices }) => {
          for (let attr in attributes) bufferViews[desc.accessors[attributes[attr]].bufferView].isAttribute = true;
          if (indices === void 0) return;
          bufferViews[desc.accessors[indices].bufferView].isAttribute = true;
          bufferViews[desc.accessors[indices].bufferView].target = gl.ELEMENT_ARRAY_BUFFER;
        });
      });
      desc.accessors.forEach(({ bufferView: i, componentType }) => {
        bufferViews[i].componentType = componentType;
      });
      desc.images && desc.images.forEach(({ uri, bufferView: i, mimeType }) => {
        if (i === void 0) return;
        bufferViews[i].mimeType = mimeType;
      });
      bufferViews.forEach(
        ({
          buffer: bufferIndex,
          // required
          byteOffset = 0,
          // optional
          byteLength,
          // required
          byteStride,
          // optional
          target = gl.ARRAY_BUFFER,
          // optional, added above for elements
          name,
          // optional
          extensions,
          // optional
          extras,
          // optional
          componentType,
          // optional, added from accessor above
          mimeType,
          // optional, added from images above
          isAttribute
        }, i) => {
          bufferViews[i].data = buffers[bufferIndex].slice(byteOffset, byteOffset + byteLength);
          if (!isAttribute) return;
          const buffer = gl.createBuffer();
          gl.bindBuffer(target, buffer);
          gl.renderer.state.boundBuffer = buffer;
          gl.bufferData(target, bufferViews[i].data, gl.STATIC_DRAW);
          bufferViews[i].buffer = buffer;
        }
      );
      return bufferViews;
    }
    static parseImages(gl, desc, dir, bufferViews) {
      if (!desc.images) return null;
      return Promise.all(
        desc.images.map(async ({ uri, bufferView: bufferViewIndex, mimeType, name }) => {
          if (mimeType === "image/ktx2") {
            const { data } = bufferViews[bufferViewIndex];
            const image2 = await this.basisManager.parseTexture(data);
            return image2;
          }
          const image = new Image();
          image.name = name;
          if (uri) {
            image.src = this.resolveURI(uri, dir);
          } else if (bufferViewIndex !== void 0) {
            const { data } = bufferViews[bufferViewIndex];
            const blob = new Blob([data], { type: mimeType });
            image.src = URL.createObjectURL(blob);
          }
          image.ready = new Promise((res) => {
            image.onload = () => res();
          });
          return image;
        })
      );
    }
    static parseTextures(gl, desc, images) {
      if (!desc.textures) return null;
      return desc.textures.map((textureInfo) => this.createTexture(gl, desc, images, textureInfo));
    }
    static createTexture(gl, desc, images, { sampler: samplerIndex, source: sourceIndex, name, extensions, extras }) {
      if (sourceIndex === void 0 && !!extensions) {
        if (extensions.KHR_texture_basisu) sourceIndex = extensions.KHR_texture_basisu.source;
      }
      const image = images[sourceIndex];
      if (image.texture) return image.texture;
      const options = {
        flipY: false,
        wrapS: gl.REPEAT,
        // Repeat by default, opposed to OGL's clamp by default
        wrapT: gl.REPEAT
      };
      const sampler = samplerIndex !== void 0 ? desc.samplers[samplerIndex] : null;
      if (sampler) {
        ["magFilter", "minFilter", "wrapS", "wrapT"].forEach((prop) => {
          if (sampler[prop]) options[prop] = sampler[prop];
        });
      }
      if (image.isBasis) {
        options.image = image;
        options.internalFormat = image.internalFormat;
        if (image.isCompressedTexture) {
          options.generateMipmaps = false;
          if (image.length > 1) this.minFilter = gl.NEAREST_MIPMAP_LINEAR;
        }
        const texture2 = new Texture(gl, options);
        texture2.name = name;
        image.texture = texture2;
        return texture2;
      }
      const texture = new Texture(gl, options);
      texture.name = name;
      image.texture = texture;
      image.ready.then(() => {
        texture.image = image;
      });
      return texture;
    }
    static parseMaterials(gl, desc, textures) {
      if (!desc.materials) return null;
      return desc.materials.map(
        ({
          name,
          extensions,
          extras,
          pbrMetallicRoughness = {},
          normalTexture,
          occlusionTexture,
          emissiveTexture,
          emissiveFactor = [0, 0, 0],
          alphaMode = "OPAQUE",
          alphaCutoff = 0.5,
          doubleSided = false
        }) => {
          const {
            baseColorFactor = [1, 1, 1, 1],
            baseColorTexture,
            metallicFactor = 1,
            roughnessFactor = 1,
            metallicRoughnessTexture
            //   extensions,
            //   extras,
          } = pbrMetallicRoughness;
          if (baseColorTexture) {
            baseColorTexture.texture = textures[baseColorTexture.index];
          }
          if (normalTexture) {
            normalTexture.texture = textures[normalTexture.index];
          }
          if (metallicRoughnessTexture) {
            metallicRoughnessTexture.texture = textures[metallicRoughnessTexture.index];
          }
          if (occlusionTexture) {
            occlusionTexture.texture = textures[occlusionTexture.index];
          }
          if (emissiveTexture) {
            emissiveTexture.texture = textures[emissiveTexture.index];
          }
          return {
            name,
            extensions,
            extras,
            baseColorFactor,
            baseColorTexture,
            metallicFactor,
            roughnessFactor,
            metallicRoughnessTexture,
            normalTexture,
            occlusionTexture,
            emissiveTexture,
            emissiveFactor,
            alphaMode,
            alphaCutoff,
            doubleSided
          };
        }
      );
    }
    static parseSkins(gl, desc, bufferViews) {
      if (!desc.skins) return null;
      return desc.skins.map(
        ({
          inverseBindMatrices,
          // optional
          skeleton,
          // optional
          joints
          // required
          // name,
          // extensions,
          // extras,
        }) => {
          return {
            inverseBindMatrices: this.parseAccessor(inverseBindMatrices, desc, bufferViews),
            skeleton,
            joints
          };
        }
      );
    }
    static parseMeshes(gl, desc, bufferViews, materials, skins) {
      if (!desc.meshes) return null;
      return desc.meshes.map(
        ({
          primitives,
          // required
          weights,
          // optional
          name,
          // optional
          extensions,
          // optional
          extras = {}
          // optional - will get merged with node extras
        }, meshIndex) => {
          let numInstances = 0;
          let skinIndices = [];
          let isLightmap = false;
          desc.nodes && desc.nodes.forEach(({ mesh, skin, extras: extras2 }) => {
            if (mesh === meshIndex) {
              numInstances++;
              if (skin !== void 0) skinIndices.push(skin);
              if (extras2 && extras2.lightmap_scale_offset) isLightmap = true;
            }
          });
          let isSkin = !!skinIndices.length;
          if (isSkin) {
            primitives = skinIndices.map((skinIndex) => {
              return this.parsePrimitives(gl, primitives, desc, bufferViews, materials, 1, isLightmap).map(({ geometry, program, mode }) => {
                const mesh = new GLTFSkin(gl, { skeleton: skins[skinIndex], geometry, program, mode });
                mesh.name = name;
                mesh.extras = extras;
                if (extensions) mesh.extensions = extensions;
                mesh.frustumCulled = false;
                return mesh;
              });
            });
            primitives.instanceCount = 0;
            primitives.numInstances = numInstances;
          } else {
            primitives = this.parsePrimitives(gl, primitives, desc, bufferViews, materials, numInstances, isLightmap).map(({ geometry, program, mode }) => {
              const meshConstructor = geometry.attributes.instanceMatrix ? InstancedMesh : Mesh;
              const mesh = new meshConstructor(gl, { geometry, program, mode });
              mesh.name = name;
              mesh.extras = extras;
              if (extensions) mesh.extensions = extensions;
              mesh.numInstances = numInstances;
              return mesh;
            });
          }
          return {
            primitives,
            weights,
            name
          };
        }
      );
    }
    static parsePrimitives(gl, primitives, desc, bufferViews, materials, numInstances, isLightmap) {
      return primitives.map(
        ({
          attributes,
          // required
          indices,
          // optional
          material: materialIndex,
          // optional
          mode = 4,
          // optional
          targets,
          // optional
          extensions,
          // optional
          extras
          // optional
        }) => {
          const program = new NormalProgram(gl);
          if (materialIndex !== void 0) {
            program.gltfMaterial = materials[materialIndex];
          }
          const geometry = new Geometry(gl);
          if (extras) geometry.extras = extras;
          if (extensions) geometry.extensions = extensions;
          for (let attr in attributes) {
            geometry.addAttribute(ATTRIBUTES[attr], this.parseAccessor(attributes[attr], desc, bufferViews));
          }
          if (indices !== void 0) {
            geometry.addAttribute("index", this.parseAccessor(indices, desc, bufferViews));
          }
          if (numInstances > 1) {
            geometry.addAttribute("instanceMatrix", {
              instanced: 1,
              size: 16,
              data: new Float32Array(numInstances * 16)
            });
          }
          if (isLightmap) {
            geometry.addAttribute("lightmapScaleOffset", {
              instanced: 1,
              size: 4,
              data: new Float32Array(numInstances * 4)
            });
          }
          return {
            geometry,
            program,
            mode
          };
        }
      );
    }
    static parseAccessor(index, desc, bufferViews) {
      const {
        bufferView: bufferViewIndex,
        // optional
        byteOffset = 0,
        // optional
        componentType,
        // required
        normalized = false,
        // optional
        count,
        // required
        type,
        // required
        min,
        // optional
        max,
        // optional
        sparse
        // optional
        // name, // optional
        // extensions, // optional
        // extras, // optional
      } = desc.accessors[index];
      const {
        data,
        // attached in parseBufferViews
        buffer,
        // replaced to be the actual GL buffer
        byteOffset: bufferByteOffset = 0,
        // byteLength, // applied in parseBufferViews
        byteStride = 0,
        target
        // name,
        // extensions,
        // extras,
      } = bufferViews[bufferViewIndex];
      const size = TYPE_SIZE[type];
      const TypeArray = TYPE_ARRAY[componentType];
      const elementBytes = TypeArray.BYTES_PER_ELEMENT;
      const componentStride = byteStride / elementBytes;
      const isInterleaved = !!byteStride && componentStride !== size;
      let filteredData;
      if (isInterleaved) {
        const typedData = new TypeArray(data, byteOffset);
        filteredData = new TypeArray(count * size);
        for (let i = 0; i < count; i++) {
          const start = componentStride * i;
          const end = start + size;
          filteredData.set(typedData.slice(start, end), i * size);
        }
      } else {
        filteredData = new TypeArray(data, byteOffset, count * size);
      }
      return {
        data: filteredData,
        size,
        type: componentType,
        normalized,
        buffer,
        stride: byteStride,
        offset: byteOffset,
        count,
        min,
        max
      };
    }
    static parseNodes(gl, desc, meshes, skins, images) {
      if (!desc.nodes) return null;
      const cameras = [];
      const nodes = desc.nodes.map(
        ({
          camera,
          // optional
          children,
          // optional
          skin: skinIndex,
          // optional
          matrix,
          // optional
          mesh: meshIndex,
          // optional
          rotation,
          // optional
          scale: scale5,
          // optional
          translation,
          // optional
          weights,
          // optional
          name,
          // optional
          extensions,
          // optional
          extras
          // optional
        }) => {
          const isCamera = camera !== void 0;
          const node = isCamera ? new Camera(gl) : new Transform();
          if (isCamera) {
            const cameraOpts = desc.cameras[camera];
            if (cameraOpts.type === "perspective") {
              const { yfov: fov, znear: near, zfar: far } = cameraOpts.perspective;
              node.perspective({ fov: fov * (180 / Math.PI), near, far });
            } else {
              const { xmag, ymag, znear: near, zfar: far } = cameraOpts.orthographic;
              node.orthographic({ near, far, left: -xmag, right: xmag, top: -ymag, bottom: ymag });
            }
            cameras.push(node);
          }
          if (name) node.name = name;
          if (extras) node.extras = extras;
          if (extensions) node.extensions = extensions;
          if (extras && extras.lightmapTexture !== void 0) {
            extras.lightmapTexture.texture = this.createTexture(gl, desc, images, { source: extras.lightmapTexture.index });
          }
          if (matrix) {
            node.matrix.copy(matrix);
            node.decompose();
          } else {
            if (rotation) node.quaternion.copy(rotation);
            if (scale5) node.scale.copy(scale5);
            if (translation) node.position.copy(translation);
            node.updateMatrix();
          }
          let isInstanced = false;
          let isFirstInstance = true;
          let isInstancedMatrix = false;
          let isSkin = skinIndex !== void 0;
          if (meshIndex !== void 0) {
            if (isSkin) {
              meshes[meshIndex].primitives[meshes[meshIndex].primitives.instanceCount].forEach((mesh) => {
                if (extras) Object.assign(mesh.extras, extras);
                mesh.setParent(node);
              });
              meshes[meshIndex].primitives.instanceCount++;
              if (meshes[meshIndex].primitives.instanceCount === meshes[meshIndex].primitives.numInstances) {
                delete meshes[meshIndex].primitives.numInstances;
                delete meshes[meshIndex].primitives.instanceCount;
              }
            } else {
              meshes[meshIndex].primitives.forEach((mesh) => {
                if (extras) Object.assign(mesh.extras, extras);
                if (mesh.geometry.isInstanced) {
                  isInstanced = true;
                  if (!mesh.instanceCount) {
                    mesh.instanceCount = 0;
                  } else {
                    isFirstInstance = false;
                  }
                  if (mesh.geometry.attributes.instanceMatrix) {
                    isInstancedMatrix = true;
                    node.matrix.toArray(mesh.geometry.attributes.instanceMatrix.data, mesh.instanceCount * 16);
                  }
                  if (mesh.geometry.attributes.lightmapScaleOffset) {
                    mesh.geometry.attributes.lightmapScaleOffset.data.set(extras.lightmap_scale_offset, mesh.instanceCount * 4);
                  }
                  mesh.instanceCount++;
                  if (mesh.instanceCount === mesh.numInstances) {
                    delete mesh.numInstances;
                    delete mesh.instanceCount;
                    if (mesh.geometry.attributes.instanceMatrix) {
                      mesh.geometry.attributes.instanceMatrix.needsUpdate = true;
                    }
                    if (mesh.geometry.attributes.lightmapScaleOffset) {
                      mesh.geometry.attributes.lightmapScaleOffset.needsUpdate = true;
                    }
                  }
                }
                if (isInstanced) {
                  if (isFirstInstance) mesh.setParent(node);
                } else {
                  mesh.setParent(node);
                }
              });
            }
          }
          if (isInstancedMatrix) {
            if (!isFirstInstance) return null;
            node.matrix.identity();
            node.decompose();
          }
          return node;
        }
      );
      desc.nodes.forEach(({ children = [] }, i) => {
        children.forEach((childIndex) => {
          if (!nodes[childIndex]) return;
          nodes[childIndex].setParent(nodes[i]);
        });
      });
      meshes.forEach(({ primitives }, i) => {
        primitives.forEach((primitive, i2) => {
          if (primitive.isInstancedMesh) primitive.addFrustumCull();
        });
      });
      return [nodes, cameras];
    }
    static populateSkins(skins, nodes) {
      if (!skins) return;
      skins.forEach((skin) => {
        skin.joints = skin.joints.map((i, index) => {
          const joint = nodes[i];
          joint.skin = skin;
          joint.bindInverse = new Mat4(...skin.inverseBindMatrices.data.slice(index * 16, (index + 1) * 16));
          return joint;
        });
        if (skin.skeleton) skin.skeleton = nodes[skin.skeleton];
      });
    }
    static parseAnimations(gl, desc, nodes, bufferViews) {
      if (!desc.animations) return null;
      return desc.animations.map(
        ({
          channels,
          // required
          samplers,
          // required
          name
          // optional
          // extensions, // optional
          // extras,  // optional
        }, animationIndex) => {
          const data = channels.map(
            ({
              sampler: samplerIndex,
              // required
              target
              // required
              // extensions, // optional
              // extras, // optional
            }) => {
              const {
                input: inputIndex,
                // required
                interpolation = "LINEAR",
                output: outputIndex
                // required
                // extensions, // optional
                // extras, // optional
              } = samplers[samplerIndex];
              const {
                node: nodeIndex,
                // optional - TODO: when is it not included?
                path
                // required
                // extensions, // optional
                // extras, // optional
              } = target;
              const node = nodes[nodeIndex];
              const transform = TRANSFORMS[path];
              const times = this.parseAccessor(inputIndex, desc, bufferViews).data;
              const values = this.parseAccessor(outputIndex, desc, bufferViews).data;
              if (!node.animations) node.animations = [];
              if (!node.animations.includes(animationIndex)) node.animations.push(animationIndex);
              return {
                node,
                transform,
                interpolation,
                times,
                values
              };
            }
          );
          return {
            name,
            animation: new GLTFAnimation(data)
          };
        }
      );
    }
    static parseScenes(desc, nodes) {
      if (!desc.scenes) return null;
      return desc.scenes.map(
        ({
          nodes: nodesIndices = [],
          name,
          // optional
          extensions,
          extras
        }) => {
          const scene = nodesIndices.reduce((map2, i) => {
            if (nodes[i]) map2.push(nodes[i]);
            return map2;
          }, []);
          scene.extras = extras;
          return scene;
        }
      );
    }
    static parseLights(gl, desc, nodes, scenes) {
      const lights = {
        directional: [],
        point: [],
        spot: []
      };
      scenes.forEach((scene) => scene.forEach((node) => node.updateMatrixWorld()));
      const lightsDescArray = desc.extensions?.KHR_lights_punctual?.lights || [];
      nodes.forEach((node) => {
        if (!node?.extensions?.KHR_lights_punctual) return;
        const lightIndex = node.extensions.KHR_lights_punctual.light;
        const lightDesc = lightsDescArray[lightIndex];
        const light = {
          name: lightDesc.name || "",
          color: { value: new Vec3().set(lightDesc.color || 1) }
        };
        if (lightDesc.intensity !== void 0) light.color.value.multiply(lightDesc.intensity);
        switch (lightDesc.type) {
          case "directional":
            light.direction = { value: new Vec3(0, 0, 1).transformDirection(node.worldMatrix) };
            break;
          case "point":
            light.position = { value: new Vec3().applyMatrix4(node.worldMatrix) };
            light.distance = { value: lightDesc.range };
            light.decay = { value: 2 };
            break;
          case "spot":
            Object.assign(light, lightDesc);
            break;
        }
        lights[lightDesc.type].push(light);
      });
      return lights;
    }
  };

  // src/gl/camera.js
  var Cam = class extends Camera {
    constructor(gl, { fov = 25 }) {
      super();
      this.gl = gl;
      this.fov = fov;
    }
    get fovInRad() {
      return this.fov * Math.PI / 180;
    }
    getViewSize(ratio) {
      const height = Math.abs(this.position.z * Math.tan(this.fovInRad / 2) * 2);
      return { w: height * ratio, h: height };
    }
  };

  // src/gl/screen/vertex.vert
  var vertex_default = "#define MPI 3.1415926538\n#define MTAU 6.28318530718\n\nattribute vec2 uv;\nattribute vec2 position;\nvarying vec2 v_uv;\n\nvoid main() {\n  vec2 pos = position;\n\n  gl_Position = vec4(pos, 0, 1);\n  v_uv = uv;\n}\n";

  // src/gl/screen/fragment.frag
  var fragment_default = "precision highp float;\nconst vec3 BLUE_DARK = vec3(0.0, 0.0, 0.5);\nconst vec3 BLUE_LIGHT = vec3(0.0, 0.0, 1.0);\n//	Simplex 3D Noise\n//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)\n//\nvec4 permute(vec4 x) {\n    return mod(((x * 34.0) + 1.0) * x, 289.0);\n}\nvec4 taylorInvSqrt(vec4 r) {\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat simplex3d(vec3 v) {\n    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\n    // First corner\n    vec3 i = floor(v + dot(v, C.yyy));\n    vec3 x0 = v - i + dot(i, C.xxx);\n\n    // Other corners\n    vec3 g = step(x0.yzx, x0.xyz);\n    vec3 l = 1.0 - g;\n    vec3 i1 = min(g.xyz, l.zxy);\n    vec3 i2 = max(g.xyz, l.zxy);\n\n    //  x0 = x0 - 0. + 0.0 * C\n    vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n    vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n    vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n    // Permutations\n    i = mod(i, 289.0);\n    vec4 p = permute(permute(permute(\n                    i.z + vec4(0.0, i1.z, i2.z, 1.0))\n                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n                + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\n    // Gradients\n    // ( N*N points uniformly over a square, mapped onto an octahedron.)\n    float n_ = 1.0 / 7.0; // N=7\n    vec3 ns = n_ * D.wyz - D.xzx;\n\n    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,N*N)\n\n    vec4 x_ = floor(j * ns.z);\n    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)\n\n    vec4 x = x_ * ns.x + ns.yyyy;\n    vec4 y = y_ * ns.x + ns.yyyy;\n    vec4 h = 1.0 - abs(x) - abs(y);\n\n    vec4 b0 = vec4(x.xy, y.xy);\n    vec4 b1 = vec4(x.zw, y.zw);\n\n    vec4 s0 = floor(b0) * 2.0 + 1.0;\n    vec4 s1 = floor(b1) * 2.0 + 1.0;\n    vec4 sh = -step(h, vec4(0.0));\n\n    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n    vec3 p0 = vec3(a0.xy, h.x);\n    vec3 p1 = vec3(a0.zw, h.y);\n    vec3 p2 = vec3(a1.xy, h.z);\n    vec3 p3 = vec3(a1.zw, h.w);\n\n    //Normalise gradients\n    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n    p0 *= norm.x;\n    p1 *= norm.y;\n    p2 *= norm.z;\n    p3 *= norm.w;\n\n    // Mix final noise value\n    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n    m = m * m;\n    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),\n                dot(p2, x2), dot(p3, x3)));\n}\n\n\nuniform float u_time;\nuniform vec3 u_color_dark1;\nuniform vec3 u_color_dark2;\nuniform vec3 u_color_light1;\nuniform vec3 u_color_light2;\nuniform float u_a_dark;\nuniform sampler2D u_sparkle;\n\nvarying vec2 v_uv;\nuniform vec2 u_a_mouse;\n\nconst vec2 light_focus = vec2(0.75, 0.5);\n\nuniform float u_BG_POWER;\n\nvoid main() {\n    float ns = smoothstep(0., 1., simplex3d(vec3(v_uv * 1. + u_time, u_time * 1.5)));\n    float ho_grad = smoothstep(0.5, 1., v_uv.x + ns);\n\n\n    float dist = distance(v_uv, vec2(0., .7));\n    dist = smoothstep(0.1, 1., dist);\n    float grad = ns * dist;\n\n    vec3 col1 = mix(u_color_dark1 * 1.2, u_color_dark2,  grad);\n    vec3 col2 = mix(u_color_light1, u_color_light2, grad);\n\n    vec3 color = mix(col2 * u_BG_POWER, col1, u_a_dark);\n\n\n    // sparkle texture\n    vec4 sparkle = texture2D(u_sparkle, v_uv);\n    color = mix(color, sparkle.rgb, sparkle.a);\n\n\n\n    \n\n    \n    gl_FragColor.rgb = color;\n    // gl_FragColor.rgb = vec3(grad);\n    gl_FragColor.a = 1.0;\n}\n";

  // src/util/math.js
  function lerp4(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }
  function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  function clamp4(min, max, num) {
    return Math.min(Math.max(num, min), max);
  }

  // src/gl/sparkle/vertex.vert
  var vertex_default2 = "#define MPI 3.1415926538\n#define MTAU 6.28318530718\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec3 a_posmod;\nattribute float a_random;\nattribute vec4 a_id;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat3 normalMatrix;\n\nuniform float u_time;\n\nvarying vec3 v_normal;\nvarying vec2 v_uv;\nvarying float v_random;\n// varying vec4 v_id;\n\n//	Simplex 3D Noise\n//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)\n//\nvec4 permute(vec4 x) {\n    return mod(((x * 34.0) + 1.0) * x, 289.0);\n}\nvec4 taylorInvSqrt(vec4 r) {\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat simplex3d(vec3 v) {\n    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\n    // First corner\n    vec3 i = floor(v + dot(v, C.yyy));\n    vec3 x0 = v - i + dot(i, C.xxx);\n\n    // Other corners\n    vec3 g = step(x0.yzx, x0.xyz);\n    vec3 l = 1.0 - g;\n    vec3 i1 = min(g.xyz, l.zxy);\n    vec3 i2 = max(g.xyz, l.zxy);\n\n    //  x0 = x0 - 0. + 0.0 * C\n    vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n    vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n    vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n    // Permutations\n    i = mod(i, 289.0);\n    vec4 p = permute(permute(permute(\n                    i.z + vec4(0.0, i1.z, i2.z, 1.0))\n                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n                + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\n    // Gradients\n    // ( N*N points uniformly over a square, mapped onto an octahedron.)\n    float n_ = 1.0 / 7.0; // N=7\n    vec3 ns = n_ * D.wyz - D.xzx;\n\n    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,N*N)\n\n    vec4 x_ = floor(j * ns.z);\n    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)\n\n    vec4 x = x_ * ns.x + ns.yyyy;\n    vec4 y = y_ * ns.x + ns.yyyy;\n    vec4 h = 1.0 - abs(x) - abs(y);\n\n    vec4 b0 = vec4(x.xy, y.xy);\n    vec4 b1 = vec4(x.zw, y.zw);\n\n    vec4 s0 = floor(b0) * 2.0 + 1.0;\n    vec4 s1 = floor(b1) * 2.0 + 1.0;\n    vec4 sh = -step(h, vec4(0.0));\n\n    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n    vec3 p0 = vec3(a0.xy, h.x);\n    vec3 p1 = vec3(a0.zw, h.y);\n    vec3 p2 = vec3(a1.xy, h.z);\n    vec3 p3 = vec3(a1.zw, h.w);\n\n    //Normalise gradients\n    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n    p0 *= norm.x;\n    p1 *= norm.y;\n    p2 *= norm.z;\n    p3 *= norm.w;\n\n    // Mix final noise value\n    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n    m = m * m;\n    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),\n                dot(p2, x2), dot(p3, x3)));\n}\n\n\nvoid main() {\n  vec3 pos = position;\n  float ns = simplex3d(vec3(pos.x + u_time, pos.y, pos.z));\n  pos *= vec3(.1);\n\n  float time_mult = u_time * (a_random * 2. + 1.) * .02;\n  vec3 posmod = a_posmod;\n  float multi = 1.;\n  float multi_time = 2.;\n\n  posmod.x += sin(time_mult * multi_time + v_random + posmod.x * .7) * multi;\n  posmod.y += sin(time_mult * multi_time + v_random + posmod.y * .2) * multi;\n  posmod.z += sin(time_mult * multi_time + v_random + posmod.z * .5) * multi;\n  \n  pos += posmod;\n  pos *= 4.;\n  \n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n\n  v_normal = normalize(normalMatrix * normal);\n  v_uv = uv;\n  v_random = a_random;\n\n}\n";

  // src/gl/sparkle/fragment.frag
  var fragment_default2 = "precision highp float;\n\nvarying vec3 v_normal;\nvarying vec2 v_uv;\nvarying vec4 v_color;\n// varying vec4 v_id;\n\nvarying float v_random;\n\nuniform float u_time;\nuniform float u_a_scroll;\n\n\n\nvoid main() {\n    float dist = distance(v_uv, vec2(0.5));\n    float alpha = 1.0 - smoothstep(0., 0.5, dist);\n\n    float color = smoothstep(0.8, 0.1, dist);\n\n    alpha *= (v_random * 0.5 + 0.5 + sin(u_time * 3. + v_random * 10.)) * .5 - u_a_scroll ;\n    \n\n    gl_FragColor.rgb = vec3(color);\n    gl_FragColor.a = alpha * .4;\n    \n}\n";

  // src/gl/sparkle/index.js
  var Sparkle = class extends Mesh {
    constructor(gl, num = 70, { attribs } = {}) {
      if (!attribs) attribs = new Plane(gl).attributes;
      super(gl, {
        geometry: new Geometry(gl, {
          ...attribs,
          ...calcAttributes(num)
        }),
        program: new Program2(gl)
      });
      const scale5 = 0.1;
      this.scale.set(scale5, scale5, scale5);
      hey_default.on("PAGE", (page) => this.pageChange(page));
      this.pageChange(hey_default.PAGE);
    }
    pageChange(page) {
      if (page === "home") {
        this.visible = true;
      } else {
        this.visible = false;
      }
    }
    resize() {
    }
    render(t) {
      this.program.time = t;
    }
  };
  var Program2 = class extends Program {
    constructor(gl, options = {}) {
      super(gl, {
        vertex: vertex_default2,
        fragment: fragment_default2,
        transparent: true,
        cullFace: null,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          u_time: { value: 0 },
          u_a_scroll: { value: 0 }
        }
      });
    }
    set time(t) {
      this.uniforms.u_time.value = t;
      let val = Gl.scene.bg.track ? Gl.scene.bg.track.value : 0;
      this.uniforms.u_a_scroll.value = val;
    }
  };
  function calcAttributes(num) {
    let idA = new Float32Array(num * 4);
    let posmodA = new Float32Array(num * 3);
    let randomA = new Float32Array(num * 1);
    for (let i = 0; i < num; i += 1) {
      let id = i + 1;
      idA.set(
        [
          (id >> 0 & 255) / 255,
          (id >> 8 & 255) / 255,
          (id >> 16 & 255) / 255,
          (id >> 24 & 255) / 255
        ],
        i * 4
      );
      posmodA.set(
        [
          Math.random() * 5 - 2.5,
          Math.random() * 5 - 2.5,
          Math.random() * 5 - 2.5
        ],
        i * 3
      );
      randomA.set([Math.random() * 4], i);
    }
    return {
      a_id: { instanced: 1, size: 4, data: idA },
      a_random: { instanced: 1, size: 1, data: randomA },
      a_posmod: { instanced: 1, size: 3, data: posmodA }
    };
  }

  // src/util/clientRect.js
  var clientRect = (element) => {
    const bounds = element.getBoundingClientRect();
    const scroll = App.scroll.y;
    return {
      // screen
      top: bounds.top + scroll,
      bottom: bounds.bottom + scroll,
      width: bounds.width,
      height: bounds.height,
      left: bounds.left,
      right: bounds.right,
      wh: window.innerHeight,
      ww: window.innerWidth,
      offset: bounds.top + scroll
      // centery: bounds.top + scroll + bounds.height / 2, // check if correct
      // centerx: bounds.left + bounds.width / 2, // check if correct
    };
  };

  // src/util/track.js
  var Track = class extends Observe {
    constructor({ element, config: config3, cb, addClass }) {
      super({ element, config: config3, cb, addClass });
      this.element = element;
      this.config = {
        bounds: [0, 1],
        top: "bottom",
        bottom: "top",
        ...config3
      };
      this.value = 0;
      this.resize();
      this.scrollUnsub = App.scroll.subscribe(this.#render.bind(this));
    }
    resize() {
      this.bounds = computeBounds(this.element, this.config);
    }
    #render() {
      this.value = clamp4(
        0,
        1,
        map(
          App.scroll.y,
          // value
          this.bounds.top,
          // low1
          this.bounds.bottom,
          // high1
          this.config.bounds[0],
          this.config.bounds[1]
          // low2, high2
        )
      );
      if (this.render) this.render(this.value);
    }
    destroy() {
      this.stop();
      this.in.disconnect();
      this.out.disconnect();
      this.scrollUnsub();
    }
  };
  function computeBounds(el, config3) {
    const bounds = clientRect(el);
    switch (config3.top) {
      case "top":
        bounds.top = bounds.top;
        break;
      case "center":
        bounds.top = bounds.top - bounds.wh / 2;
        break;
      case "bottom":
        bounds.top = bounds.top - bounds.wh;
        break;
    }
    switch (config3.bottom) {
      case "top":
        bounds.bottom = bounds.bottom;
        break;
      case "center":
        bounds.bottom = bounds.bottom - bounds.wh / 2;
        break;
      case "bottom":
        bounds.bottom = bounds.bottom - bounds.wh;
        break;
    }
    return { ...bounds };
  }

  // node_modules/.pnpm/lil-gui@0.20.0/node_modules/lil-gui/dist/lil-gui.esm.js
  var Controller = class _Controller {
    constructor(parent, object, property, className, elementType = "div") {
      this.parent = parent;
      this.object = object;
      this.property = property;
      this._disabled = false;
      this._hidden = false;
      this.initialValue = this.getValue();
      this.domElement = document.createElement(elementType);
      this.domElement.classList.add("controller");
      this.domElement.classList.add(className);
      this.$name = document.createElement("div");
      this.$name.classList.add("name");
      _Controller.nextNameID = _Controller.nextNameID || 0;
      this.$name.id = `lil-gui-name-${++_Controller.nextNameID}`;
      this.$widget = document.createElement("div");
      this.$widget.classList.add("widget");
      this.$disable = this.$widget;
      this.domElement.appendChild(this.$name);
      this.domElement.appendChild(this.$widget);
      this.domElement.addEventListener("keydown", (e) => e.stopPropagation());
      this.domElement.addEventListener("keyup", (e) => e.stopPropagation());
      this.parent.children.push(this);
      this.parent.controllers.push(this);
      this.parent.$children.appendChild(this.domElement);
      this._listenCallback = this._listenCallback.bind(this);
      this.name(property);
    }
    /**
     * Sets the name of the controller and its label in the GUI.
     * @param {string} name
     * @returns {this}
     */
    name(name) {
      this._name = name;
      this.$name.textContent = name;
      return this;
    }
    /**
     * Pass a function to be called whenever the value is modified by this controller.
     * The function receives the new value as its first parameter. The value of `this` will be the
     * controller.
     *
     * For function controllers, the `onChange` callback will be fired on click, after the function
     * executes.
     * @param {Function} callback
     * @returns {this}
     * @example
     * const controller = gui.add( object, 'property' );
     *
     * controller.onChange( function( v ) {
     * 	console.log( 'The value is now ' + v );
     * 	console.assert( this === controller );
     * } );
     */
    onChange(callback) {
      this._onChange = callback;
      return this;
    }
    /**
     * Calls the onChange methods of this controller and its parent GUI.
     * @protected
     */
    _callOnChange() {
      this.parent._callOnChange(this);
      if (this._onChange !== void 0) {
        this._onChange.call(this, this.getValue());
      }
      this._changed = true;
    }
    /**
     * Pass a function to be called after this controller has been modified and loses focus.
     * @param {Function} callback
     * @returns {this}
     * @example
     * const controller = gui.add( object, 'property' );
     *
     * controller.onFinishChange( function( v ) {
     * 	console.log( 'Changes complete: ' + v );
     * 	console.assert( this === controller );
     * } );
     */
    onFinishChange(callback) {
      this._onFinishChange = callback;
      return this;
    }
    /**
     * Should be called by Controller when its widgets lose focus.
     * @protected
     */
    _callOnFinishChange() {
      if (this._changed) {
        this.parent._callOnFinishChange(this);
        if (this._onFinishChange !== void 0) {
          this._onFinishChange.call(this, this.getValue());
        }
      }
      this._changed = false;
    }
    /**
     * Sets the controller back to its initial value.
     * @returns {this}
     */
    reset() {
      this.setValue(this.initialValue);
      this._callOnFinishChange();
      return this;
    }
    /**
     * Enables this controller.
     * @param {boolean} enabled
     * @returns {this}
     * @example
     * controller.enable();
     * controller.enable( false ); // disable
     * controller.enable( controller._disabled ); // toggle
     */
    enable(enabled = true) {
      return this.disable(!enabled);
    }
    /**
     * Disables this controller.
     * @param {boolean} disabled
     * @returns {this}
     * @example
     * controller.disable();
     * controller.disable( false ); // enable
     * controller.disable( !controller._disabled ); // toggle
     */
    disable(disabled = true) {
      if (disabled === this._disabled) return this;
      this._disabled = disabled;
      this.domElement.classList.toggle("disabled", disabled);
      this.$disable.toggleAttribute("disabled", disabled);
      return this;
    }
    /**
     * Shows the Controller after it's been hidden.
     * @param {boolean} show
     * @returns {this}
     * @example
     * controller.show();
     * controller.show( false ); // hide
     * controller.show( controller._hidden ); // toggle
     */
    show(show = true) {
      this._hidden = !show;
      this.domElement.style.display = this._hidden ? "none" : "";
      return this;
    }
    /**
     * Hides the Controller.
     * @returns {this}
     */
    hide() {
      return this.show(false);
    }
    /**
     * Changes this controller into a dropdown of options.
     *
     * Calling this method on an option controller will simply update the options. However, if this
     * controller was not already an option controller, old references to this controller are
     * destroyed, and a new controller is added to the end of the GUI.
     * @example
     * // safe usage
     *
     * gui.add( obj, 'prop1' ).options( [ 'a', 'b', 'c' ] );
     * gui.add( obj, 'prop2' ).options( { Big: 10, Small: 1 } );
     * gui.add( obj, 'prop3' );
     *
     * // danger
     *
     * const ctrl1 = gui.add( obj, 'prop1' );
     * gui.add( obj, 'prop2' );
     *
     * // calling options out of order adds a new controller to the end...
     * const ctrl2 = ctrl1.options( [ 'a', 'b', 'c' ] );
     *
     * // ...and ctrl1 now references a controller that doesn't exist
     * assert( ctrl2 !== ctrl1 )
     * @param {object|Array} options
     * @returns {Controller}
     */
    options(options) {
      const controller = this.parent.add(this.object, this.property, options);
      controller.name(this._name);
      this.destroy();
      return controller;
    }
    /**
     * Sets the minimum value. Only works on number controllers.
     * @param {number} min
     * @returns {this}
     */
    min(min) {
      return this;
    }
    /**
     * Sets the maximum value. Only works on number controllers.
     * @param {number} max
     * @returns {this}
     */
    max(max) {
      return this;
    }
    /**
     * Values set by this controller will be rounded to multiples of `step`. Only works on number
     * controllers.
     * @param {number} step
     * @returns {this}
     */
    step(step) {
      return this;
    }
    /**
     * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
     * like `step()`. Only works on number controllers.
     * @example
     * gui.add( object, 'property' ).listen().decimals( 4 );
     * @param {number} decimals
     * @returns {this}
     */
    decimals(decimals) {
      return this;
    }
    /**
     * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
     * @param {boolean} listen
     * @returns {this}
     */
    listen(listen = true) {
      this._listening = listen;
      if (this._listenCallbackID !== void 0) {
        cancelAnimationFrame(this._listenCallbackID);
        this._listenCallbackID = void 0;
      }
      if (this._listening) {
        this._listenCallback();
      }
      return this;
    }
    _listenCallback() {
      this._listenCallbackID = requestAnimationFrame(this._listenCallback);
      const curValue = this.save();
      if (curValue !== this._listenPrevValue) {
        this.updateDisplay();
      }
      this._listenPrevValue = curValue;
    }
    /**
     * Returns `object[ property ]`.
     * @returns {any}
     */
    getValue() {
      return this.object[this.property];
    }
    /**
     * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
     * @param {any} value
     * @returns {this}
     */
    setValue(value) {
      if (this.getValue() !== value) {
        this.object[this.property] = value;
        this._callOnChange();
        this.updateDisplay();
      }
      return this;
    }
    /**
     * Updates the display to keep it in sync with the current value. Useful for updating your
     * controllers when their values have been modified outside of the GUI.
     * @returns {this}
     */
    updateDisplay() {
      return this;
    }
    load(value) {
      this.setValue(value);
      this._callOnFinishChange();
      return this;
    }
    save() {
      return this.getValue();
    }
    /**
     * Destroys this controller and removes it from the parent GUI.
     */
    destroy() {
      this.listen(false);
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1);
      this.parent.$children.removeChild(this.domElement);
    }
  };
  var BooleanController = class extends Controller {
    constructor(parent, object, property) {
      super(parent, object, property, "boolean", "label");
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "checkbox");
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      this.$widget.appendChild(this.$input);
      this.$input.addEventListener("change", () => {
        this.setValue(this.$input.checked);
        this._callOnFinishChange();
      });
      this.$disable = this.$input;
      this.updateDisplay();
    }
    updateDisplay() {
      this.$input.checked = this.getValue();
      return this;
    }
  };
  function normalizeColorString(string) {
    let match, result;
    if (match = string.match(/(#|0x)?([a-f0-9]{6})/i)) {
      result = match[2];
    } else if (match = string.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) {
      result = parseInt(match[1]).toString(16).padStart(2, 0) + parseInt(match[2]).toString(16).padStart(2, 0) + parseInt(match[3]).toString(16).padStart(2, 0);
    } else if (match = string.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) {
      result = match[1] + match[1] + match[2] + match[2] + match[3] + match[3];
    }
    if (result) {
      return "#" + result;
    }
    return false;
  }
  var STRING = {
    isPrimitive: true,
    match: (v) => typeof v === "string",
    fromHexString: normalizeColorString,
    toHexString: normalizeColorString
  };
  var INT = {
    isPrimitive: true,
    match: (v) => typeof v === "number",
    fromHexString: (string) => parseInt(string.substring(1), 16),
    toHexString: (value) => "#" + value.toString(16).padStart(6, 0)
  };
  var ARRAY = {
    isPrimitive: false,
    // The arrow function is here to appease tree shakers like esbuild or webpack.
    // See https://esbuild.github.io/api/#tree-shaking
    match: (v) => Array.isArray(v),
    fromHexString(string, target, rgbScale = 1) {
      const int = INT.fromHexString(string);
      target[0] = (int >> 16 & 255) / 255 * rgbScale;
      target[1] = (int >> 8 & 255) / 255 * rgbScale;
      target[2] = (int & 255) / 255 * rgbScale;
    },
    toHexString([r, g, b], rgbScale = 1) {
      rgbScale = 255 / rgbScale;
      const int = r * rgbScale << 16 ^ g * rgbScale << 8 ^ b * rgbScale << 0;
      return INT.toHexString(int);
    }
  };
  var OBJECT = {
    isPrimitive: false,
    match: (v) => Object(v) === v,
    fromHexString(string, target, rgbScale = 1) {
      const int = INT.fromHexString(string);
      target.r = (int >> 16 & 255) / 255 * rgbScale;
      target.g = (int >> 8 & 255) / 255 * rgbScale;
      target.b = (int & 255) / 255 * rgbScale;
    },
    toHexString({ r, g, b }, rgbScale = 1) {
      rgbScale = 255 / rgbScale;
      const int = r * rgbScale << 16 ^ g * rgbScale << 8 ^ b * rgbScale << 0;
      return INT.toHexString(int);
    }
  };
  var FORMATS = [STRING, INT, ARRAY, OBJECT];
  function getColorFormat(value) {
    return FORMATS.find((format) => format.match(value));
  }
  var ColorController = class extends Controller {
    constructor(parent, object, property, rgbScale) {
      super(parent, object, property, "color");
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "color");
      this.$input.setAttribute("tabindex", -1);
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      this.$text = document.createElement("input");
      this.$text.setAttribute("type", "text");
      this.$text.setAttribute("spellcheck", "false");
      this.$text.setAttribute("aria-labelledby", this.$name.id);
      this.$display = document.createElement("div");
      this.$display.classList.add("display");
      this.$display.appendChild(this.$input);
      this.$widget.appendChild(this.$display);
      this.$widget.appendChild(this.$text);
      this._format = getColorFormat(this.initialValue);
      this._rgbScale = rgbScale;
      this._initialValueHexString = this.save();
      this._textFocused = false;
      this.$input.addEventListener("input", () => {
        this._setValueFromHexString(this.$input.value);
      });
      this.$input.addEventListener("blur", () => {
        this._callOnFinishChange();
      });
      this.$text.addEventListener("input", () => {
        const tryParse = normalizeColorString(this.$text.value);
        if (tryParse) {
          this._setValueFromHexString(tryParse);
        }
      });
      this.$text.addEventListener("focus", () => {
        this._textFocused = true;
        this.$text.select();
      });
      this.$text.addEventListener("blur", () => {
        this._textFocused = false;
        this.updateDisplay();
        this._callOnFinishChange();
      });
      this.$disable = this.$text;
      this.updateDisplay();
    }
    reset() {
      this._setValueFromHexString(this._initialValueHexString);
      return this;
    }
    _setValueFromHexString(value) {
      if (this._format.isPrimitive) {
        const newValue = this._format.fromHexString(value);
        this.setValue(newValue);
      } else {
        this._format.fromHexString(value, this.getValue(), this._rgbScale);
        this._callOnChange();
        this.updateDisplay();
      }
    }
    save() {
      return this._format.toHexString(this.getValue(), this._rgbScale);
    }
    load(value) {
      this._setValueFromHexString(value);
      this._callOnFinishChange();
      return this;
    }
    updateDisplay() {
      this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale);
      if (!this._textFocused) {
        this.$text.value = this.$input.value.substring(1);
      }
      this.$display.style.backgroundColor = this.$input.value;
      return this;
    }
  };
  var FunctionController = class extends Controller {
    constructor(parent, object, property) {
      super(parent, object, property, "function");
      this.$button = document.createElement("button");
      this.$button.appendChild(this.$name);
      this.$widget.appendChild(this.$button);
      this.$button.addEventListener("click", (e) => {
        e.preventDefault();
        this.getValue().call(this.object);
        this._callOnChange();
      });
      this.$button.addEventListener("touchstart", () => {
      }, { passive: true });
      this.$disable = this.$button;
    }
  };
  var NumberController = class extends Controller {
    constructor(parent, object, property, min, max, step) {
      super(parent, object, property, "number");
      this._initInput();
      this.min(min);
      this.max(max);
      const stepExplicit = step !== void 0;
      this.step(stepExplicit ? step : this._getImplicitStep(), stepExplicit);
      this.updateDisplay();
    }
    decimals(decimals) {
      this._decimals = decimals;
      this.updateDisplay();
      return this;
    }
    min(min) {
      this._min = min;
      this._onUpdateMinMax();
      return this;
    }
    max(max) {
      this._max = max;
      this._onUpdateMinMax();
      return this;
    }
    step(step, explicit = true) {
      this._step = step;
      this._stepExplicit = explicit;
      return this;
    }
    updateDisplay() {
      const value = this.getValue();
      if (this._hasSlider) {
        let percent = (value - this._min) / (this._max - this._min);
        percent = Math.max(0, Math.min(percent, 1));
        this.$fill.style.width = percent * 100 + "%";
      }
      if (!this._inputFocused) {
        this.$input.value = this._decimals === void 0 ? value : value.toFixed(this._decimals);
      }
      return this;
    }
    _initInput() {
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "text");
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (isTouch) {
        this.$input.setAttribute("type", "number");
        this.$input.setAttribute("step", "any");
      }
      this.$widget.appendChild(this.$input);
      this.$disable = this.$input;
      const onInput = () => {
        let value = parseFloat(this.$input.value);
        if (isNaN(value)) return;
        if (this._stepExplicit) {
          value = this._snap(value);
        }
        this.setValue(this._clamp(value));
      };
      const increment = (delta) => {
        const value = parseFloat(this.$input.value);
        if (isNaN(value)) return;
        this._snapClampSetValue(value + delta);
        this.$input.value = this.getValue();
      };
      const onKeyDown = (e) => {
        if (e.key === "Enter") {
          this.$input.blur();
        }
        if (e.code === "ArrowUp") {
          e.preventDefault();
          increment(this._step * this._arrowKeyMultiplier(e));
        }
        if (e.code === "ArrowDown") {
          e.preventDefault();
          increment(this._step * this._arrowKeyMultiplier(e) * -1);
        }
      };
      const onWheel = (e) => {
        if (this._inputFocused) {
          e.preventDefault();
          increment(this._step * this._normalizeMouseWheel(e));
        }
      };
      let testingForVerticalDrag = false, initClientX, initClientY, prevClientY, initValue, dragDelta;
      const DRAG_THRESH = 5;
      const onMouseDown = (e) => {
        initClientX = e.clientX;
        initClientY = prevClientY = e.clientY;
        testingForVerticalDrag = true;
        initValue = this.getValue();
        dragDelta = 0;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };
      const onMouseMove = (e) => {
        if (testingForVerticalDrag) {
          const dx = e.clientX - initClientX;
          const dy = e.clientY - initClientY;
          if (Math.abs(dy) > DRAG_THRESH) {
            e.preventDefault();
            this.$input.blur();
            testingForVerticalDrag = false;
            this._setDraggingStyle(true, "vertical");
          } else if (Math.abs(dx) > DRAG_THRESH) {
            onMouseUp();
          }
        }
        if (!testingForVerticalDrag) {
          const dy = e.clientY - prevClientY;
          dragDelta -= dy * this._step * this._arrowKeyMultiplier(e);
          if (initValue + dragDelta > this._max) {
            dragDelta = this._max - initValue;
          } else if (initValue + dragDelta < this._min) {
            dragDelta = this._min - initValue;
          }
          this._snapClampSetValue(initValue + dragDelta);
        }
        prevClientY = e.clientY;
      };
      const onMouseUp = () => {
        this._setDraggingStyle(false, "vertical");
        this._callOnFinishChange();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      const onFocus = () => {
        this._inputFocused = true;
      };
      const onBlur = () => {
        this._inputFocused = false;
        this.updateDisplay();
        this._callOnFinishChange();
      };
      this.$input.addEventListener("input", onInput);
      this.$input.addEventListener("keydown", onKeyDown);
      this.$input.addEventListener("wheel", onWheel, { passive: false });
      this.$input.addEventListener("mousedown", onMouseDown);
      this.$input.addEventListener("focus", onFocus);
      this.$input.addEventListener("blur", onBlur);
    }
    _initSlider() {
      this._hasSlider = true;
      this.$slider = document.createElement("div");
      this.$slider.classList.add("slider");
      this.$fill = document.createElement("div");
      this.$fill.classList.add("fill");
      this.$slider.appendChild(this.$fill);
      this.$widget.insertBefore(this.$slider, this.$input);
      this.domElement.classList.add("hasSlider");
      const map2 = (v, a, b, c, d) => {
        return (v - a) / (b - a) * (d - c) + c;
      };
      const setValueFromX = (clientX) => {
        const rect = this.$slider.getBoundingClientRect();
        let value = map2(clientX, rect.left, rect.right, this._min, this._max);
        this._snapClampSetValue(value);
      };
      const mouseDown = (e) => {
        this._setDraggingStyle(true);
        setValueFromX(e.clientX);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", mouseUp);
      };
      const mouseMove = (e) => {
        setValueFromX(e.clientX);
      };
      const mouseUp = () => {
        this._callOnFinishChange();
        this._setDraggingStyle(false);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
      };
      let testingForScroll = false, prevClientX, prevClientY;
      const beginTouchDrag = (e) => {
        e.preventDefault();
        this._setDraggingStyle(true);
        setValueFromX(e.touches[0].clientX);
        testingForScroll = false;
      };
      const onTouchStart = (e) => {
        if (e.touches.length > 1) return;
        if (this._hasScrollBar) {
          prevClientX = e.touches[0].clientX;
          prevClientY = e.touches[0].clientY;
          testingForScroll = true;
        } else {
          beginTouchDrag(e);
        }
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
      };
      const onTouchMove = (e) => {
        if (testingForScroll) {
          const dx = e.touches[0].clientX - prevClientX;
          const dy = e.touches[0].clientY - prevClientY;
          if (Math.abs(dx) > Math.abs(dy)) {
            beginTouchDrag(e);
          } else {
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
          }
        } else {
          e.preventDefault();
          setValueFromX(e.touches[0].clientX);
        }
      };
      const onTouchEnd = () => {
        this._callOnFinishChange();
        this._setDraggingStyle(false);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      };
      const callOnFinishChange = this._callOnFinishChange.bind(this);
      const WHEEL_DEBOUNCE_TIME = 400;
      let wheelFinishChangeTimeout;
      const onWheel = (e) => {
        const isVertical = Math.abs(e.deltaX) < Math.abs(e.deltaY);
        if (isVertical && this._hasScrollBar) return;
        e.preventDefault();
        const delta = this._normalizeMouseWheel(e) * this._step;
        this._snapClampSetValue(this.getValue() + delta);
        this.$input.value = this.getValue();
        clearTimeout(wheelFinishChangeTimeout);
        wheelFinishChangeTimeout = setTimeout(callOnFinishChange, WHEEL_DEBOUNCE_TIME);
      };
      this.$slider.addEventListener("mousedown", mouseDown);
      this.$slider.addEventListener("touchstart", onTouchStart, { passive: false });
      this.$slider.addEventListener("wheel", onWheel, { passive: false });
    }
    _setDraggingStyle(active, axis = "horizontal") {
      if (this.$slider) {
        this.$slider.classList.toggle("active", active);
      }
      document.body.classList.toggle("lil-gui-dragging", active);
      document.body.classList.toggle(`lil-gui-${axis}`, active);
    }
    _getImplicitStep() {
      if (this._hasMin && this._hasMax) {
        return (this._max - this._min) / 1e3;
      }
      return 0.1;
    }
    _onUpdateMinMax() {
      if (!this._hasSlider && this._hasMin && this._hasMax) {
        if (!this._stepExplicit) {
          this.step(this._getImplicitStep(), false);
        }
        this._initSlider();
        this.updateDisplay();
      }
    }
    _normalizeMouseWheel(e) {
      let { deltaX, deltaY } = e;
      if (Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta) {
        deltaX = 0;
        deltaY = -e.wheelDelta / 120;
        deltaY *= this._stepExplicit ? 1 : 10;
      }
      const wheel = deltaX + -deltaY;
      return wheel;
    }
    _arrowKeyMultiplier(e) {
      let mult = this._stepExplicit ? 1 : 10;
      if (e.shiftKey) {
        mult *= 10;
      } else if (e.altKey) {
        mult /= 10;
      }
      return mult;
    }
    _snap(value) {
      let offset = 0;
      if (this._hasMin) {
        offset = this._min;
      } else if (this._hasMax) {
        offset = this._max;
      }
      value -= offset;
      value = Math.round(value / this._step) * this._step;
      value += offset;
      value = parseFloat(value.toPrecision(15));
      return value;
    }
    _clamp(value) {
      if (value < this._min) value = this._min;
      if (value > this._max) value = this._max;
      return value;
    }
    _snapClampSetValue(value) {
      this.setValue(this._clamp(this._snap(value)));
    }
    get _hasScrollBar() {
      const root = this.parent.root.$children;
      return root.scrollHeight > root.clientHeight;
    }
    get _hasMin() {
      return this._min !== void 0;
    }
    get _hasMax() {
      return this._max !== void 0;
    }
  };
  var OptionController = class extends Controller {
    constructor(parent, object, property, options) {
      super(parent, object, property, "option");
      this.$select = document.createElement("select");
      this.$select.setAttribute("aria-labelledby", this.$name.id);
      this.$display = document.createElement("div");
      this.$display.classList.add("display");
      this.$select.addEventListener("change", () => {
        this.setValue(this._values[this.$select.selectedIndex]);
        this._callOnFinishChange();
      });
      this.$select.addEventListener("focus", () => {
        this.$display.classList.add("focus");
      });
      this.$select.addEventListener("blur", () => {
        this.$display.classList.remove("focus");
      });
      this.$widget.appendChild(this.$select);
      this.$widget.appendChild(this.$display);
      this.$disable = this.$select;
      this.options(options);
    }
    options(options) {
      this._values = Array.isArray(options) ? options : Object.values(options);
      this._names = Array.isArray(options) ? options : Object.keys(options);
      this.$select.replaceChildren();
      this._names.forEach((name) => {
        const $option = document.createElement("option");
        $option.textContent = name;
        this.$select.appendChild($option);
      });
      this.updateDisplay();
      return this;
    }
    updateDisplay() {
      const value = this.getValue();
      const index = this._values.indexOf(value);
      this.$select.selectedIndex = index;
      this.$display.textContent = index === -1 ? value : this._names[index];
      return this;
    }
  };
  var StringController = class extends Controller {
    constructor(parent, object, property) {
      super(parent, object, property, "string");
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "text");
      this.$input.setAttribute("spellcheck", "false");
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      this.$input.addEventListener("input", () => {
        this.setValue(this.$input.value);
      });
      this.$input.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          this.$input.blur();
        }
      });
      this.$input.addEventListener("blur", () => {
        this._callOnFinishChange();
      });
      this.$widget.appendChild(this.$input);
      this.$disable = this.$input;
      this.updateDisplay();
    }
    updateDisplay() {
      this.$input.value = this.getValue();
      return this;
    }
  };
  var stylesheet = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "\u2195";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "\u25BE";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "\u25B8";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "\u2713";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;
  function _injectStyles(cssContent) {
    const injected = document.createElement("style");
    injected.innerHTML = cssContent;
    const before = document.querySelector("head link[rel=stylesheet], head style");
    if (before) {
      document.head.insertBefore(injected, before);
    } else {
      document.head.appendChild(injected);
    }
  }
  var stylesInjected = false;
  var GUI = class _GUI {
    /**
     * Creates a panel that holds controllers.
     * @example
     * new GUI();
     * new GUI( { container: document.getElementById( 'custom' ) } );
     *
     * @param {object} [options]
     * @param {boolean} [options.autoPlace=true]
     * Adds the GUI to `document.body` and fixes it to the top right of the page.
     *
     * @param {HTMLElement} [options.container]
     * Adds the GUI to this DOM element. Overrides `autoPlace`.
     *
     * @param {number} [options.width=245]
     * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
     * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`.
     *
     * @param {string} [options.title=Controls]
     * Name to display in the title bar.
     *
     * @param {boolean} [options.closeFolders=false]
     * Pass `true` to close all folders in this GUI by default.
     *
     * @param {boolean} [options.injectStyles=true]
     * Injects the default stylesheet into the page if this is the first GUI.
     * Pass `false` to use your own stylesheet.
     *
     * @param {number} [options.touchStyles=true]
     * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
     *
     * @param {GUI} [options.parent]
     * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
     */
    constructor({
      parent,
      autoPlace = parent === void 0,
      container,
      width,
      title = "Controls",
      closeFolders = false,
      injectStyles = true,
      touchStyles = true
    } = {}) {
      this.parent = parent;
      this.root = parent ? parent.root : this;
      this.children = [];
      this.controllers = [];
      this.folders = [];
      this._closed = false;
      this._hidden = false;
      this.domElement = document.createElement("div");
      this.domElement.classList.add("lil-gui");
      this.$title = document.createElement("button");
      this.$title.classList.add("title");
      this.$title.setAttribute("aria-expanded", true);
      this.$title.addEventListener("click", () => this.openAnimated(this._closed));
      this.$title.addEventListener("touchstart", () => {
      }, { passive: true });
      this.$children = document.createElement("div");
      this.$children.classList.add("children");
      this.domElement.appendChild(this.$title);
      this.domElement.appendChild(this.$children);
      this.title(title);
      if (this.parent) {
        this.parent.children.push(this);
        this.parent.folders.push(this);
        this.parent.$children.appendChild(this.domElement);
        return;
      }
      this.domElement.classList.add("root");
      if (touchStyles) {
        this.domElement.classList.add("allow-touch-styles");
      }
      if (!stylesInjected && injectStyles) {
        _injectStyles(stylesheet);
        stylesInjected = true;
      }
      if (container) {
        container.appendChild(this.domElement);
      } else if (autoPlace) {
        this.domElement.classList.add("autoPlace");
        document.body.appendChild(this.domElement);
      }
      if (width) {
        this.domElement.style.setProperty("--width", width + "px");
      }
      this._closeFolders = closeFolders;
    }
    /**
     * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
     * @example
     * gui.add( object, 'property' );
     * gui.add( object, 'number', 0, 100, 1 );
     * gui.add( object, 'options', [ 1, 2, 3 ] );
     *
     * @param {object} object The object the controller will modify.
     * @param {string} property Name of the property to control.
     * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
     * selectable values for a dropdown.
     * @param {number} [max] Maximum value for number controllers.
     * @param {number} [step] Step value for number controllers.
     * @returns {Controller}
     */
    add(object, property, $1, max, step) {
      if (Object($1) === $1) {
        return new OptionController(this, object, property, $1);
      }
      const initialValue = object[property];
      switch (typeof initialValue) {
        case "number":
          return new NumberController(this, object, property, $1, max, step);
        case "boolean":
          return new BooleanController(this, object, property);
        case "string":
          return new StringController(this, object, property);
        case "function":
          return new FunctionController(this, object, property);
      }
      console.error(`gui.add failed
	property:`, property, `
	object:`, object, `
	value:`, initialValue);
    }
    /**
     * Adds a color controller to the GUI.
     * @example
     * params = {
     * 	cssColor: '#ff00ff',
     * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
     * 	customRange: [ 0, 127, 255 ],
     * };
     *
     * gui.addColor( params, 'cssColor' );
     * gui.addColor( params, 'rgbColor' );
     * gui.addColor( params, 'customRange', 255 );
     *
     * @param {object} object The object the controller will modify.
     * @param {string} property Name of the property to control.
     * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
     * need to set this to 255 if your colors are too bright.
     * @returns {Controller}
     */
    addColor(object, property, rgbScale = 1) {
      return new ColorController(this, object, property, rgbScale);
    }
    /**
     * Adds a folder to the GUI, which is just another GUI. This method returns
     * the nested GUI so you can add controllers to it.
     * @example
     * const folder = gui.addFolder( 'Position' );
     * folder.add( position, 'x' );
     * folder.add( position, 'y' );
     * folder.add( position, 'z' );
     *
     * @param {string} title Name to display in the folder's title bar.
     * @returns {GUI}
     */
    addFolder(title) {
      const folder = new _GUI({ parent: this, title });
      if (this.root._closeFolders) folder.close();
      return folder;
    }
    /**
     * Recalls values that were saved with `gui.save()`.
     * @param {object} obj
     * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
     * @returns {this}
     */
    load(obj, recursive = true) {
      if (obj.controllers) {
        this.controllers.forEach((c) => {
          if (c instanceof FunctionController) return;
          if (c._name in obj.controllers) {
            c.load(obj.controllers[c._name]);
          }
        });
      }
      if (recursive && obj.folders) {
        this.folders.forEach((f) => {
          if (f._title in obj.folders) {
            f.load(obj.folders[f._title]);
          }
        });
      }
      return this;
    }
    /**
     * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
     * recall these values.
     * @example
     * {
     * 	controllers: {
     * 		prop1: 1,
     * 		prop2: 'value',
     * 		...
     * 	},
     * 	folders: {
     * 		folderName1: { controllers, folders },
     * 		folderName2: { controllers, folders }
     * 		...
     * 	}
     * }
     *
     * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
     * @returns {object}
     */
    save(recursive = true) {
      const obj = {
        controllers: {},
        folders: {}
      };
      this.controllers.forEach((c) => {
        if (c instanceof FunctionController) return;
        if (c._name in obj.controllers) {
          throw new Error(`Cannot save GUI with duplicate property "${c._name}"`);
        }
        obj.controllers[c._name] = c.save();
      });
      if (recursive) {
        this.folders.forEach((f) => {
          if (f._title in obj.folders) {
            throw new Error(`Cannot save GUI with duplicate folder "${f._title}"`);
          }
          obj.folders[f._title] = f.save();
        });
      }
      return obj;
    }
    /**
     * Opens a GUI or folder. GUI and folders are open by default.
     * @param {boolean} open Pass false to close.
     * @returns {this}
     * @example
     * gui.open(); // open
     * gui.open( false ); // close
     * gui.open( gui._closed ); // toggle
     */
    open(open = true) {
      this._setClosed(!open);
      this.$title.setAttribute("aria-expanded", !this._closed);
      this.domElement.classList.toggle("closed", this._closed);
      return this;
    }
    /**
     * Closes the GUI.
     * @returns {this}
     */
    close() {
      return this.open(false);
    }
    _setClosed(closed) {
      if (this._closed === closed) return;
      this._closed = closed;
      this._callOnOpenClose(this);
    }
    /**
     * Shows the GUI after it's been hidden.
     * @param {boolean} show
     * @returns {this}
     * @example
     * gui.show();
     * gui.show( false ); // hide
     * gui.show( gui._hidden ); // toggle
     */
    show(show = true) {
      this._hidden = !show;
      this.domElement.style.display = this._hidden ? "none" : "";
      return this;
    }
    /**
     * Hides the GUI.
     * @returns {this}
     */
    hide() {
      return this.show(false);
    }
    openAnimated(open = true) {
      this._setClosed(!open);
      this.$title.setAttribute("aria-expanded", !this._closed);
      requestAnimationFrame(() => {
        const initialHeight = this.$children.clientHeight;
        this.$children.style.height = initialHeight + "px";
        this.domElement.classList.add("transition");
        const onTransitionEnd = (e) => {
          if (e.target !== this.$children) return;
          this.$children.style.height = "";
          this.domElement.classList.remove("transition");
          this.$children.removeEventListener("transitionend", onTransitionEnd);
        };
        this.$children.addEventListener("transitionend", onTransitionEnd);
        const targetHeight = !open ? 0 : this.$children.scrollHeight;
        this.domElement.classList.toggle("closed", !open);
        requestAnimationFrame(() => {
          this.$children.style.height = targetHeight + "px";
        });
      });
      return this;
    }
    /**
     * Change the title of this GUI.
     * @param {string} title
     * @returns {this}
     */
    title(title) {
      this._title = title;
      this.$title.textContent = title;
      return this;
    }
    /**
     * Resets all controllers to their initial values.
     * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
     * @returns {this}
     */
    reset(recursive = true) {
      const controllers = recursive ? this.controllersRecursive() : this.controllers;
      controllers.forEach((c) => c.reset());
      return this;
    }
    /**
     * Pass a function to be called whenever a controller in this GUI changes.
     * @param {function({object:object, property:string, value:any, controller:Controller})} callback
     * @returns {this}
     * @example
     * gui.onChange( event => {
     * 	event.object     // object that was modified
     * 	event.property   // string, name of property
     * 	event.value      // new value of controller
     * 	event.controller // controller that was modified
     * } );
     */
    onChange(callback) {
      this._onChange = callback;
      return this;
    }
    _callOnChange(controller) {
      if (this.parent) {
        this.parent._callOnChange(controller);
      }
      if (this._onChange !== void 0) {
        this._onChange.call(this, {
          object: controller.object,
          property: controller.property,
          value: controller.getValue(),
          controller
        });
      }
    }
    /**
     * Pass a function to be called whenever a controller in this GUI has finished changing.
     * @param {function({object:object, property:string, value:any, controller:Controller})} callback
     * @returns {this}
     * @example
     * gui.onFinishChange( event => {
     * 	event.object     // object that was modified
     * 	event.property   // string, name of property
     * 	event.value      // new value of controller
     * 	event.controller // controller that was modified
     * } );
     */
    onFinishChange(callback) {
      this._onFinishChange = callback;
      return this;
    }
    _callOnFinishChange(controller) {
      if (this.parent) {
        this.parent._callOnFinishChange(controller);
      }
      if (this._onFinishChange !== void 0) {
        this._onFinishChange.call(this, {
          object: controller.object,
          property: controller.property,
          value: controller.getValue(),
          controller
        });
      }
    }
    /**
     * Pass a function to be called when this GUI or its descendants are opened or closed.
     * @param {function(GUI)} callback
     * @returns {this}
     * @example
     * gui.onOpenClose( changedGUI => {
     * 	console.log( changedGUI._closed );
     * } );
     */
    onOpenClose(callback) {
      this._onOpenClose = callback;
      return this;
    }
    _callOnOpenClose(changedGUI) {
      if (this.parent) {
        this.parent._callOnOpenClose(changedGUI);
      }
      if (this._onOpenClose !== void 0) {
        this._onOpenClose.call(this, changedGUI);
      }
    }
    /**
     * Destroys all DOM elements and event listeners associated with this GUI.
     */
    destroy() {
      if (this.parent) {
        this.parent.children.splice(this.parent.children.indexOf(this), 1);
        this.parent.folders.splice(this.parent.folders.indexOf(this), 1);
      }
      if (this.domElement.parentElement) {
        this.domElement.parentElement.removeChild(this.domElement);
      }
      Array.from(this.children).forEach((c) => c.destroy());
    }
    /**
     * Returns an array of controllers contained by this GUI and its descendents.
     * @returns {Controller[]}
     */
    controllersRecursive() {
      let controllers = Array.from(this.controllers);
      this.folders.forEach((f) => {
        controllers = controllers.concat(f.controllersRecursive());
      });
      return controllers;
    }
    /**
     * Returns an array of folders contained by this GUI and its descendents.
     * @returns {GUI[]}
     */
    foldersRecursive() {
      let folders = Array.from(this.folders);
      this.folders.forEach((f) => {
        folders = folders.concat(f.foldersRecursive());
      });
      return folders;
    }
  };

  // src/util/gui.js
  window.gui = new GUI();
  gui.params = {
    // progress: 0,
    bgPower: 0.9,
    // lightColor1: "#D9E5EF",
    lightColor1: "#bccedd",
    lightColor2: "#c4dce5"
  };
  var visible = false;
  gui.hide();
  if (visible) {
    gui.show();
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "G" && e.shiftKey) {
      if (visible) {
        gui.hide();
        visible = false;
      } else {
        gui.show();
        visible = true;
      }
    }
  });
  gui.add(gui.params, "bgPower", 0, 1, 0.01);
  gui.add(gui.params, "lightColor1");
  gui.add(gui.params, "lightColor2");

  // src/gl/screen/index.js
  var GRADIENT = {
    dark1: 857371,
    dark2: 7447472,
    light1: 16251644,
    light2: 12901605
  };
  function getSize() {
    return {
      width: Gl.vp.w * Gl.vp.dpr(),
      height: Gl.vp.h * Gl.vp.dpr()
    };
  }
  var Screen = class extends Mesh {
    target = new RenderTarget(Gl.gl, getSize());
    a = {
      dark: hey_default.PAGE === "home" ? 1 : 0
    };
    constructor(gl) {
      super(gl, { geometry: new Triangle(gl), program: new Program3(gl) });
      this.sparkle = new Sparkle(gl, 10);
      hey_default.on("PAGE", (page) => this.pageChange(page));
      this.pageChange(hey_default.PAGE);
    }
    resize() {
      this.track?.resize();
      this.target = new RenderTarget(Gl.gl, getSize());
    }
    render(t) {
      this.program.time = t * 0.2;
      this.program.uniforms.u_a_dark.value = clamp4(
        0,
        1,
        this.a.dark - this.track?.value || 0
      );
      this.sparkle?.render(t);
      if (this.sparkle) {
        Gl.renderer.render({
          scene: this.sparkle,
          camera: Gl.camera,
          target: this.target
        });
        this.program.uniforms.u_sparkle.value = this.target.texture;
      }
      if (window.gui && visible) {
        this.program.uniforms.u_color_light1.value = hexToVec3String(
          window.gui.params.lightColor1
        );
        this.program.uniforms.u_color_light2.value = hexToVec3String(
          window.gui.params.lightColor2
        );
        this.program.uniforms.u_BG_POWER.value = window.gui.params.bgPower;
      }
    }
    /* lifecycle */
    pageChange(page) {
      if (page === "news" || page === "career") {
        this.a.dark = 0;
      }
      gsap_default.to(this.a, {
        dark: page === "home" ? 1 : 0,
        duration: ANIMATION.page.duration,
        ease: ANIMATION.page.ease
      });
      const track = document.querySelector("[data-track='gradient']");
      if (track) {
        this.track = new Track({
          element: track,
          config: {
            bottom: "bottom"
          }
        });
      } else {
        if (this.track) {
          this.track.destroy();
        }
      }
    }
  };
  var Program3 = class extends Program {
    constructor(gl) {
      super(gl, {
        vertex: vertex_default,
        fragment: fragment_default,
        transparent: false,
        cullFace: null,
        uniforms: {
          u_time: { value: 0 },
          u_color_dark1: { value: hexToVec3(GRADIENT.dark1) },
          u_color_dark2: { value: hexToVec3(GRADIENT.dark2) },
          u_color_light1: { value: hexToVec3(GRADIENT.light1) },
          u_color_light2: { value: hexToVec3(GRADIENT.light2) },
          u_BG_POWER: { value: 0.9 },
          u_a_dark: { value: 0.5 },
          u_a_mouse: { value: [0, 0] },
          u_sparkle: { value: new Texture(gl) }
        },
        depthTest: false
      });
    }
    set time(t) {
      this.uniforms.u_time.value = t;
      this.uniforms.u_a_mouse.value = [Gl.mouse.ex, Gl.mouse.ey];
    }
  };
  function hexToVec3(hex) {
    return [
      (hex >> 16 & 255) / 255,
      (hex >> 8 & 255) / 255,
      (hex & 255) / 255
    ];
  }
  function hexToVec3String(hex) {
    return [
      parseInt(hex.substring(1, 3), 16) / 255,
      parseInt(hex.substring(3, 5), 16) / 255,
      parseInt(hex.substring(5, 7), 16) / 255
    ];
  }

  // src/gl/battery/vertex.vert
  var vertex_default3 = "#define MPI 3.1415926538\n#define MTAU 6.28318530718\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\nattribute vec4 color;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat3 normalMatrix;\n\nuniform float u_time;\n\nvarying vec3 v_normal;\nvarying vec2 v_uv;\nvarying vec2 v_uv2;\n\nvarying vec3 v_view;\n// varying vec4 v_color;\n\n\n\n\n\nvoid main() {\n  vec3 pos = position;\n\n  vec4 transformed = modelViewMatrix * vec4(pos, 1.0);\n  gl_Position = projectionMatrix * transformed;\n\n  v_view = normalize(- transformed.xyz);\n\n  // v_normal = normal;\n  v_normal = normalize(normalMatrix * normal);\n  v_uv = uv;\n  v_uv2 = uv2;\n}\n";

  // src/gl/battery/fragment.frag
  var fragment_default3 = "precision highp float;\n\nuniform sampler2D u_mtc;\nuniform sampler2D u_mtc2;\n\nuniform sampler2D u_light;\nuniform sampler2D u_light2;\nuniform sampler2D dirty_mask;\n\nvarying vec3 v_normal;\nvarying vec2 v_uv;\nvarying vec2 v_uv2;\n// varying vec4 v_color;\n\nvarying vec3 v_view;\n\nuniform float u_a_illuminate;\n\nconst vec3 col_blue = vec3(0.16470588235294117, 0.19607843137254902, 0.25098039215686274);\n\n\nvoid main() {\n\n    // * matcap uvs\n    vec3 x = normalize( vec3(v_view.z, 0., -v_view.x));\n    vec3 y = cross(v_view, x);\n    vec2 fakeUv = vec2( dot(x, v_normal), dot(y, v_normal)) * .495 + .5;\n\n    vec3 base_color = mix(col_blue * .2, vec3(0.), step(.5, v_uv2.x));\n    // vec3 dirty = texture2D(dirty_mask, v_uv).rgb;\n    \n    // * matcap\n    vec3 mtc1 = texture2D(u_mtc, fakeUv).rgb + base_color;\n    vec3 mtc2 = texture2D(u_mtc2, fakeUv).rgb + base_color;\n    vec3 mtc = mix(mtc1, mtc2, (u_a_illuminate * .5 + .5));\n\n\n\n\n    // * light\n    vec3 light = mix(\n        texture2D(u_light, v_uv).rgb,\n        texture2D(u_light2, v_uv).rgb,\n        u_a_illuminate * .4\n    );\n\n    vec3 color = (mtc * light) * 1.5;\n\n    gl_FragColor.rgb = color;\n    // gl_FragColor.rgb = dirty;\n    // gl_FragColor.rgb = vec3(step(.5, v_uv2.x), 0., 0.);\n    gl_FragColor.a = 1.0;\n}\n";

  // src/gl/battery/index.js
  var Battery = class extends Transform {
    a = {
      baseY: 0,
      markY: 0,
      scale: [1, 1]
    };
    constructor(gl, mark = null) {
      super();
      this.gl = gl;
      this.mark = mark;
      this.create();
      hey_default.on("PAGE", (page) => this.pageChange(page));
      hey_default.on("PAGE_OUT", (page) => this.pageOut(page));
      this.pageChange();
      setTimeout(() => {
        if (this.mark) this.getTracking();
        this.resize();
      }, 100);
    }
    async create() {
      this.battery = new BatteryModel(this.gl);
      this.resize();
      this.battery.setParent(this);
    }
    // handleScroll() {}
    render(t) {
      this.battery?.render(t);
      this.rotation.x = Gl.mouse.ey * 0.3;
      this.rotation.y = Gl.mouse.ex * 0.3;
      this.rotation.z = -Math.PI / 4 * 0.5;
      if (this.mark) {
        this.position.y = App.scroll.y * Gl.vp.viewRatio + this.a.markY;
      } else {
        const Yadjust = App.isMobile ? 0 : -0.15;
        this.position.y = App.scroll.y * Gl.vp.viewRatio + this.a.baseY + Yadjust;
      }
      if (Gl.scene.bg.track) {
        this.battery.program.uniforms.u_a_illuminate.value = Gl.scene.bg.track.value;
      }
    }
    getTracking() {
      if (!this.markItem) return;
      queueMicrotask(() => {
        let { top, height } = this.markItem.getBoundingClientRect();
        top += height / 2 - window.innerHeight / 2;
        this.a.markY = (-top - App.scroll.y) * Gl.vp.viewRatio;
      });
    }
    resize() {
      setTimeout(() => {
        if (this.mark && this.markItem) this.getTracking();
        if (!App.isMobile) {
          const hsize = Gl.vp.viewSize.w / 3.5;
          this.position.x = Gl.vp.viewSize.w / 5;
          this.scale.set(hsize, hsize, hsize);
        } else {
          const hsize = Gl.vp.viewSize.w / 2.5;
          const mobileScale = 1.5;
          this.position.x = 0;
          this.scale.set(
            hsize * mobileScale,
            hsize * mobileScale,
            hsize * mobileScale
          );
          this.a.baseY = -Gl.vp.viewSize.h / 4;
        }
        queueMicrotask(() => {
          this.battery?.resize();
          this.track?.resize();
        });
      }, 10);
    }
    pageChange(page) {
      const track = document.querySelector("[data-track='gradient']");
      if (this.mark) {
        this.markItem = document.querySelector(this.mark);
        if (this.markItem) {
          this.getTracking();
        }
      }
      setTimeout(() => {
        if (track) {
          this.track = new Track({
            element: track,
            config: {
              top: "top",
              bottom: "top"
            }
          });
          setTimeout(() => {
            this.track.resize();
          }, 10);
        }
      });
    }
    pageOut() {
      if (this.track) {
        this.track.destroy();
        this.track = null;
      }
    }
  };
  var BatteryModel = class extends Mesh {
    constructor(gl) {
      super(gl, {
        geometry: Gl.scene.assets.model.scenes[0][0].children[0].geometry,
        program: new Program4(gl),
        frustumCulled: false
      });
      this.scale.set(0, 0, 0);
      hey_default.on("LOAD", (state) => this.pageChange(hey_default.PAGE));
      hey_default.on("PAGE", (page) => this.pageChange(page));
      hey_default.on("PAGE_OUT", (page) => this.animateOut(page));
    }
    animateIn() {
      gsap_default.to(this.scale, {
        x: 1,
        y: 1,
        z: 1,
        delay: 0.2
      });
      gsap_default.to(this.position, {
        y: 0,
        delay: 0.2
      });
    }
    async animateOut() {
      await gsap_default.to(this.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.4
      });
      gsap_default.set(this.position, {
        y: -Gl.vp.viewSize.h
      });
    }
    pageChange(page) {
      if (page === "home") {
        this.animateIn();
      }
    }
    resize() {
    }
    render(t) {
      this.program.time = t;
    }
  };
  var Program4 = class extends Program {
    constructor(gl) {
      super(gl, {
        vertex: vertex_default3,
        fragment: fragment_default3,
        transparent: true,
        cullFace: null,
        uniforms: {
          u_time: { value: 0 },
          u_mtc: { value: Gl.scene.assets.matcap },
          u_mtc2: { value: Gl.scene.assets.matcap2 },
          u_light: { value: Gl.scene.assets.light },
          u_light2: { value: Gl.scene.assets.light2 },
          // dirty_mask: { value: Gl.scene.assets.dirty_mask },
          u_a_illuminate: { value: 0 }
        }
      });
    }
    set time(t) {
      this.uniforms.u_time.value = t;
    }
  };

  // src/gl/util/model-loader.js
  async function loadModel(gl, path) {
    return GLTFLoader.load(gl, path);
  }

  // src/gl/util/texture-loader.js
  async function loadTexture(gl, path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const texture = new Texture(gl, { image: img });
        texture.flipY = false;
        resolve(texture);
      };
    });
  }

  // src/assets/index.js
  var URL2 = "https://cdn.jsdelivr.net/gh/Wonderstruckxyz/zenopower@main/build/";
  var assets = {
    //   img: null,
    matcap: URL2 + "metal1.png",
    matcap2: URL2 + "metal4.png",
    model: URL2 + "zeno4.glb",
    light: URL2 + "light1.png",
    light2: URL2 + "light4.png"
    // dirty_mask: URL + "dirty_mask.jpg",
  };

  // src/gl/util/loader.js
  async function loadAssets(gl, opt = null) {
    const assets2 = opt || assets;
    const promises = [];
    const names = [];
    for (const key in assets2) {
      const asset = assets2[key];
      const extension = asset.split(".").pop();
      if (extension === "glb" || extension === "gltf") {
        promises.push(loadModel(gl, asset));
      } else if (extension === "jpg" || extension === "png" || extension === "webp" || extension === "jpeg") {
        promises.push(loadTexture(gl, asset));
      }
      names.push(key);
    }
    const loaded = await Promise.all(promises);
    const result = names.reduce((acc, key, index) => {
      acc[key] = loaded[index];
      return acc;
    }, {});
    return result;
  }

  // src/gl/_scene.js
  var Scene = class extends Transform {
    isOn = true;
    constructor(gl, data = {}) {
      super();
      this.gl = gl;
      queueMicrotask(() => this.create(data));
    }
    async load() {
      this.assets = await loadAssets(this.gl);
    }
    async create() {
      this.bg = new Screen(this.gl);
      this.bg.setParent(this);
      hey_default.LOAD = "screen";
      console.time("::load");
      await this.load();
      this.battery = new Battery(this.gl);
      this.battery.setParent(this);
      this.trackBattery = new Battery(this.gl, "[data-mark='battery']");
      this.trackBattery.setParent(this);
      console.timeEnd("::load");
      hey_default.LOAD = "full";
      if (hey_default.MOBILE) {
        this.trackBattery.visible = false;
      }
      hey_default.on("MOBILE", (mobile) => {
        if (mobile) {
          this.trackBattery.visible = false;
        } else {
          this.trackBattery.visible = true;
        }
      });
    }
    render(t) {
      if (!this.isOn) return;
      this.bg?.render(t);
      this.battery?.render(t);
      this.trackBattery?.render(t);
    }
    resize(vp) {
      this.bg?.resize(vp);
      this.battery?.resize(vp);
      this.trackBattery?.resize(vp);
    }
  };

  // src/gl/gl.js
  var params = {
    clearColor: [0, 0, 0, 0]
  };
  var Gl = class {
    static time = 0;
    static mouse = { x: 0, y: 0, ex: 0, ey: 0 };
    static {
      this.vp = {
        container: document.querySelector('[data-gl="c"]'),
        w: window.innerWidth,
        h: window.innerHeight,
        aspect: () => {
          return this.vp.w / this.vp.h;
        },
        dpr: () => {
          return Math.min(window.devicePixelRatio, 2);
        }
      };
      this.renderer = new Renderer2({
        dpr: this.vp.dpr(),
        antialias: true,
        alpha: true
      });
      this.gl = this.renderer.gl;
      this.gl.clearColor(...params.clearColor);
      this.vp.container.appendChild(this.gl.canvas);
      this.camera = new Cam(this.gl, {});
      this.camera.position.set(0, 0, 5);
      this.scene = new Scene(this.gl);
      this.time = 0;
      handleResize(this.vp.container, this.resize.bind(this));
      this.initEvents();
    }
    static initEvents() {
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.clientX / this.vp.w;
        this.mouse.y = 1 - e.clientY / this.vp.h;
      });
    }
    static render() {
      this.time += 5e-3;
      this.mouse.ex = lerp4(this.mouse.ex, this.mouse.x, 0.05);
      this.mouse.ey = lerp4(this.mouse.ey, this.mouse.y, 0.05);
      this.controls?.update();
      this.scene?.render(this.time);
      this.renderer.render({
        scene: this.scene,
        camera: this.camera
      });
    }
    static resize({ width, height }) {
      this.vp.w = width;
      this.vp.h = height;
      this.vp.viewSize = this.camera.getViewSize(this.vp.aspect());
      this.vp.viewRatio = this.vp.viewSize.w / this.vp.w;
      this.renderer.setSize(this.vp.w, this.vp.h);
      this.camera.perspective({
        aspect: this.vp.aspect()
      });
      this.scene.resize(this.vp);
    }
    static get px() {
      console.log("px");
    }
    /** -- Lifecycle */
    static async transitionIn() {
    }
    static async transitionOut() {
    }
  };
  function handleResize(container, cb) {
    new ResizeObserver((entry) => cb(entry[0].contentRect)).observe(container);
  }

  // src/modules/pages.js
  var hit = false;
  async function queryCareers() {
    if (hit) return;
    if (hey_default.PAGE !== "career") return;
    hit = true;
    const resp = await fetch("https://zenopower.vercel.app/api/sync");
  }
  var Pages = class extends Core {
    current = document.querySelector("[data-page]").dataset.page;
    anchorClicked = false;
    constructor() {
      super({
        links: "a:not([target]):not([href^=\\#]):not([data-taxi-ignore])",
        removeOldContent: true,
        allowInterruption: false,
        bypassCache: false,
        transitions: {
          default: Tra
        }
      });
      hey_default.PAGE = this.current;
      this.initAnchorLinks();
      queryCareers();
    }
    async transitionOut(page) {
      hey_default.PAGE_OUT = page.dataset.page;
      await Promise.allSettled([
        App.dom.transitionOut(page),
        Gl.transitionOut(page)
      ]);
      App.scroll.top();
    }
    initAnchorLinks() {
      this.anchorlinks = [...document.querySelectorAll("[data-anchorlink]")];
      this.anchorlinks.forEach((anchorlink) => {
        anchorlink.addEventListener("click", (e) => {
          this.anchorClicked = anchorlink.dataset.anchorlink;
        });
      });
    }
    async transitionIn(page) {
      this.current = page.dataset.page;
      hey_default.PAGE = this.current;
      queryCareers();
      await Promise.allSettled([
        App.dom.transitionIn(page),
        Gl.transitionIn(page)
      ]);
      if (this.anchorClicked) {
        const id = document.getElementById(this.anchorClicked);
        App.scroll.to(id);
        this.anchorClicked = false;
      }
      this.initAnchorLinks();
    }
  };
  var Tra = class {
    constructor({ wrapper }) {
      this.wrapper = wrapper;
    }
    leave(props) {
      return new Promise((resolve) => {
        this.onLeave({ ...props, done: resolve });
      });
    }
    enter(props) {
      return new Promise((resolve) => {
        this.onEnter({ ...props, done: resolve });
      });
    }
    onLeave({ from, trigger, done }) {
      App.pages.transitionOut(from).then(() => done());
    }
    onEnter({ to, trigger, done }) {
      App.pages.transitionIn(to).then(() => done());
    }
  };

  // src/util/queries.js
  function isTablet() {
    let check = false;
    (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      ))
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  // src/app.js
  var App = class {
    static body = document.querySelector("body");
    static viewport = new Viewport();
    static time = 0;
    static scroll = new Scroll();
    static pages = new Pages();
    static dom = new Dom();
    static gl = new Gl();
    static isMobile = isTablet();
    static {
      this.initEvents();
      gsap_default.ticker.add((t) => this.render(t));
    }
    static initEvents() {
      new ResizeObserver((entry) => this.resize(entry[0])).observe(this.body);
    }
    static resize({ contentRect }) {
      this.isMobile = isTablet();
      hey_default.MOBILE = this.isMobile;
      this.viewport?.resize();
      this.dom?.resize();
      Resizer?.resize();
    }
    static render(t) {
      this.scroll?.render(t * 1e3);
      this.dom?.render();
      Gl?.render(this.scroll.y);
    }
    /* Events */
  };
  var Resizer = class {
    static body = document.querySelector("body");
    static sub = [];
    static add(fn, id = Symbol()) {
      this.sub.push({
        id,
        fn
      });
      return this.remove(id);
    }
    static remove(id) {
      this.sub = this.sub.filter((s) => s.id !== id);
    }
    static resize() {
      this.sub.forEach((s) => s.fn());
    }
  };
  var Raf = class {
    static sub = [];
    static add(fn, id = Symbol()) {
      this.sub.push({
        id,
        fn
      });
      return this.remove(id);
    }
    static remove(id) {
      this.sub = this.sub.filter((s) => s.id !== id);
    }
    static render(t) {
      this.sub.forEach((s) => s.fn(t));
    }
  };
})();
/*! Bundled license information:

gsap/gsap-core.js:
  (*!
   * GSAP 3.12.7
   * https://gsap.com
   *
   * @license Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.12.7
   * https://gsap.com
   *
   * Copyright 2008-2025, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)

lil-gui/dist/lil-gui.esm.js:
  (**
   * lil-gui
   * https://lil-gui.georgealways.com
   * @version 0.20.0
   * @author George Michael Brower
   * @license MIT
   *)
*/
//# sourceMappingURL=app.js.map
