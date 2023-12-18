var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
var INITIAL_PAGE_INDEX = 0;
var addedPageLength = {
    0: 0,
};
var throttle = function (callback, delay) {
    var timer;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!timer) {
            timer = setTimeout(function () {
                callback.apply(void 0, args);
                timer = undefined;
            }, delay);
        }
    };
};
var pageMap = {};
var requestedPageMap = {};
var InfiniteScroll = function (_a) {
    var children = _a.children, getProducts = _a.getProducts, maxPage = _a.maxPage, productCountPerPage = _a.productCountPerPage, setVisibleProductList = _a.setProductList, _b = _a.fetchingByProductListRowIndex, fetchingByProductListRowIndex = _b === void 0 ? 3 : _b, _c = _a.productCountPerRow, productCountPerRow = _c === void 0 ? 1 : _c, flexDirection = _a.flexDirection, productWidth = _a.productWidth, _d = _a.productHeight, productHeight = _d === void 0 ? window.innerHeight / 4 : _d;
    var startRowIndex = 0;
    var visibleRowLength = productCountPerPage / productCountPerRow;
    var visibleListCapacity = visibleRowLength * productCountPerRow;
    var maximumRowLength = maxPage * visibleRowLength;
    var lastStartRowIndex = maximumRowLength - visibleRowLength;
    var LOADING_PRODUCT_LIST = Array.from({ length: visibleListCapacity }, function () { return ({}); });
    var _e = useState(0), paddingTop = _e[0], setPaddingTop = _e[1];
    var _f = useState(productHeight * (maximumRowLength - visibleRowLength)), paddingBottom = _f[0], setPaddingBottom = _f[1];
    var initialize = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var initialData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getProducts(INITIAL_PAGE_INDEX)];
                case 1:
                    initialData = _a.sent();
                    pageMap[INITIAL_PAGE_INDEX] = initialData;
                    if (!document.documentElement.scrollTop) {
                        setVisibleProductList(initialData);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [getProducts, setVisibleProductList]);
    var setVisibleProductListByStartRowIndex = useCallback(function () {
        var newStartIndex = startRowIndex * productCountPerRow;
        var newLastIndex = (startRowIndex + visibleRowLength - 1) * productCountPerRow;
        var currentFirstIndexPage = Math.floor(newStartIndex / visibleListCapacity);
        var currentLastIndexPage = Math.floor(newLastIndex / visibleListCapacity);
        var startIndexPerPage = newStartIndex - visibleListCapacity * currentFirstIndexPage;
        if (!pageMap[currentFirstIndexPage] && pageMap[currentLastIndexPage]) {
            setVisibleProductList(__spreadArray(__spreadArray([], LOADING_PRODUCT_LIST, true), pageMap[currentLastIndexPage], true).slice(startIndexPerPage, startIndexPerPage + visibleListCapacity));
        }
        else if (pageMap[currentFirstIndexPage] &&
            !pageMap[currentLastIndexPage]) {
            setVisibleProductList(__spreadArray(__spreadArray([], pageMap[currentFirstIndexPage], true), LOADING_PRODUCT_LIST, true).slice(startIndexPerPage, startIndexPerPage + visibleListCapacity));
        }
        else if (!pageMap[currentFirstIndexPage] &&
            !pageMap[currentLastIndexPage]) {
            setVisibleProductList(LOADING_PRODUCT_LIST);
        }
        else {
            setVisibleProductList(__spreadArray(__spreadArray([], pageMap[currentFirstIndexPage], true), pageMap[currentLastIndexPage], true).slice(startIndexPerPage, startIndexPerPage + visibleListCapacity));
        }
    }, [
        LOADING_PRODUCT_LIST,
        productCountPerRow,
        setVisibleProductList,
        startRowIndex,
        visibleListCapacity,
        visibleRowLength,
    ]);
    var getStartRowIndex = useCallback(function (scrollTop) {
        if (scrollTop <= addedPageLength[INITIAL_PAGE_INDEX] + productHeight ||
            scrollTop < 0) {
            return INITIAL_PAGE_INDEX;
        }
        var startRowIndex = Math.floor((scrollTop - addedPageLength[INITIAL_PAGE_INDEX]) / productHeight);
        if (startRowIndex > lastStartRowIndex) {
            startRowIndex = lastStartRowIndex;
        }
        return startRowIndex;
    }, [lastStartRowIndex, productHeight]);
    var handleScrollLayout = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var scrollTop, newPaddingTop, newPaddingBottom;
        return __generator(this, function (_a) {
            scrollTop = e.target.scrollingElement.scrollTop;
            startRowIndex = getStartRowIndex(scrollTop - productHeight * fetchingByProductListRowIndex);
            newPaddingTop = productHeight * startRowIndex;
            newPaddingBottom = productHeight * (maximumRowLength - visibleRowLength) - newPaddingTop;
            setPaddingTop(newPaddingTop);
            setPaddingBottom(newPaddingBottom);
            setVisibleProductListByStartRowIndex();
            return [2 /*return*/];
        });
    }); };
    var handleScrollFetch = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var scrollTop, startRowIndexAtScrollEnd, newStartIndex, newLastIndex, currentFirstIndexPage, currentLastIndexPage, startIndexPerPage, tempProductList, _a, _b, _c, _d, newVisibleProductList;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    scrollTop = e.target.scrollingElement.scrollTop;
                    startRowIndexAtScrollEnd = getStartRowIndex(scrollTop - productHeight * fetchingByProductListRowIndex);
                    newStartIndex = startRowIndex * productCountPerRow;
                    newLastIndex = (startRowIndex + visibleRowLength - 1) * productCountPerRow;
                    currentFirstIndexPage = Math.floor(newStartIndex / visibleListCapacity);
                    currentLastIndexPage = Math.floor(newLastIndex / visibleListCapacity);
                    startIndexPerPage = newStartIndex - visibleListCapacity * currentFirstIndexPage;
                    tempProductList = [];
                    if (!(!pageMap[currentFirstIndexPage] && pageMap[currentLastIndexPage])) return [3 /*break*/, 4];
                    if (!!requestedPageMap[currentFirstIndexPage]) return [3 /*break*/, 2];
                    requestedPageMap[currentFirstIndexPage] = true;
                    _a = pageMap;
                    _b = currentFirstIndexPage;
                    return [4 /*yield*/, getProducts(currentFirstIndexPage)];
                case 1:
                    _a[_b] = _f.sent();
                    return [3 /*break*/, 3];
                case 2: return [2 /*return*/];
                case 3: return [3 /*break*/, 11];
                case 4:
                    if (!(pageMap[currentFirstIndexPage] &&
                        !pageMap[currentLastIndexPage])) return [3 /*break*/, 8];
                    if (!!requestedPageMap[currentLastIndexPage]) return [3 /*break*/, 6];
                    requestedPageMap[currentLastIndexPage] = true;
                    _c = pageMap;
                    _d = currentLastIndexPage;
                    return [4 /*yield*/, getProducts(currentLastIndexPage)];
                case 5:
                    _c[_d] = _f.sent();
                    return [3 /*break*/, 7];
                case 6: return [2 /*return*/];
                case 7: return [3 /*break*/, 11];
                case 8:
                    if (!(!pageMap[currentFirstIndexPage] &&
                        !pageMap[currentLastIndexPage])) return [3 /*break*/, 11];
                    if (!(!requestedPageMap[currentFirstIndexPage] &&
                        !requestedPageMap[currentLastIndexPage])) return [3 /*break*/, 10];
                    requestedPageMap[currentFirstIndexPage] = true;
                    requestedPageMap[currentLastIndexPage] = true;
                    return [4 /*yield*/, Promise.all([
                            getProducts(currentFirstIndexPage),
                            getProducts(currentLastIndexPage),
                        ])];
                case 9:
                    _e = _f.sent(), pageMap[currentFirstIndexPage] = _e[0], pageMap[currentLastIndexPage] = _e[1];
                    return [3 /*break*/, 11];
                case 10: return [2 /*return*/];
                case 11:
                    if (currentFirstIndexPage !== currentLastIndexPage) {
                        tempProductList = __spreadArray(__spreadArray([], pageMap[currentFirstIndexPage], true), pageMap[currentLastIndexPage], true);
                        newVisibleProductList = tempProductList.slice(startIndexPerPage, startIndexPerPage + visibleListCapacity);
                        tempProductList = newVisibleProductList;
                    }
                    else {
                        tempProductList = pageMap[currentFirstIndexPage];
                    }
                    if (startRowIndexAtScrollEnd === startRowIndex) {
                        setVisibleProductListByStartRowIndex();
                    }
                    else {
                        handleScrollFetch(e);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        var throttleHandleScrollFetch = throttle(handleScrollFetch, 500);
        var throttleHandleScrollLayout = throttle(handleScrollLayout, 0);
        document.addEventListener("scroll", throttleHandleScrollLayout);
        document.addEventListener("scroll", throttleHandleScrollFetch);
        initialize();
        return function () {
            document.removeEventListener("scroll", throttleHandleScrollLayout);
            document.removeEventListener("scroll", throttleHandleScrollFetch);
        };
    }, []);
    return (_jsx("div", { style: { height: productHeight * maximumRowLength }, children: _jsx("div", { style: {
                display: "flex",
                flexDirection: flexDirection,
                flexWrap: "wrap",
                paddingTop: paddingTop,
                paddingBottom: paddingBottom,
            }, children: React.Children.map(children, function (child) { return (_jsx("div", { style: {
                    width: productWidth,
                    height: productHeight,
                    flex: "0 1 ".concat(100 / productCountPerRow, "%"),
                }, children: React.cloneElement(child, { key: child.key }) })); }) }) }));
};
export default InfiniteScroll;
