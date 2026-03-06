'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var create = require('zustand');
var react = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var create__default = /*#__PURE__*/_interopDefaultLegacy(create);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function randomInt(min, max) {
    // eslint-disable-next-line no-bitwise
    return Math.random() * (max - min + 1) + min | 0;
}
const isBrowser = typeof window !== 'undefined';
const disqusJsApiFetcher = (apiKey, url)=>{
    const Url = new URL(url);
    Url.searchParams.set('api_key', apiKey);
    return fetch(Url.toString()).then((res)=>res.json()
    );
};
const getTimeStampFromString = (dateString)=>new Date(dateString).getTime()
;
const replaceDisquscdn = (str)=>str.replace(/a\.disquscdn\.com/g, 'c.disquscdn.com')
;
let domParser = null;
const processCommentMessage = (str)=>{
    const rawHtml = replaceDisquscdn(str).replace(/https?:\/\/disq.us\/url\?url=(.+)%3A[\w-]+&amp;cuid=\d+/gm, (_, $1)=>decodeURIComponent($1)
    );
    domParser || (domParser = new DOMParser());
    const doc = domParser.parseFromString(rawHtml, 'text/html');
    // Very basic, but it will do.
    // Any attempt to bypass XSS limitation will be blocked by Disqus' WAF.
    doc.querySelectorAll('script').forEach((script)=>script.remove()
    );
    doc.querySelectorAll('a').forEach((a)=>{
        a.target = '_blank';
        a.rel = 'external noopener nofollow noreferrer';
    });
    return doc.body.innerHTML;
};
const timezoneOffset = new Date().getTimezoneOffset();
const numberPadstart = (num)=>String(num).padStart(2, '0')
;
const formatDate = (str)=>{
    const utcTimestamp = getTimeStampFromString(str);
    const date = new Date(utcTimestamp - timezoneOffset * 60 * 1000);
    return `${date.getFullYear()}-${numberPadstart(date.getMonth() + 1)}-${numberPadstart(date.getDate())} ${numberPadstart(date.getHours())}:${numberPadstart(date.getMinutes())}`;
};
const checkDomainAccessiblity = (domain)=>{
    return new Promise((resolve, reject)=>{
        const img = new Image();
        const clear = ()=>{
            img.onload = null;
            img.onerror = null;
            img.remove();
        };
        const timeout = setTimeout(()=>{
            clear();
            reject();
        }, 3000);
        img.onerror = ()=>{
            clearTimeout(timeout);
            clear();
            reject();
        };
        img.onload = ()=>{
            clearTimeout(timeout);
            clear();
            resolve();
        };
        img.src = `https://${domain}/favicon.ico?${+new Date()}=${+new Date()}`;
    });
};

const getDisqusJsModeDefaultValue = ()=>{
    if (isBrowser) {
        const value = localStorage.getItem('dsqjs_mode');
        if (value === 'dsqjs' || value === 'disqus') {
            return value;
        }
    }
    return null;
};
const getDisqusJsSortTypeDefaultValue = ()=>{
    if (isBrowser) {
        const value = localStorage.getItem('dsqjs_sort');
        if (value === 'popular' || value === 'asc' || value === 'desc') {
            return value;
        }
    }
    return null;
};
const initialState = {
    mode: getDisqusJsModeDefaultValue(),
    sortType: getDisqusJsSortTypeDefaultValue(),
    error: false,
    msg: null,
    thread: null,
    posts: [],
    loadingPosts: false,
    morePostsError: false
};
const useStore = create__default["default"]((set, get)=>{
    return _objectSpread({}, initialState, {
        setMode (mode) {
            set({
                mode
            });
            if (isBrowser && mode) {
                // Always wait for a macrotask before setting localStorage
                Promise.resolve().then(()=>{
                    if (mode === null) {
                        localStorage.removeItem('dsqjs_mode');
                    } else {
                        localStorage.setItem('dsqjs_mode', mode);
                    }
                });
            }
        },
        checkMode (shortname) {
            set({
                msg: '正在检查 Disqus 能否访问...'
            });
            Promise.all([
                'disqus.com',
                `${shortname}.disqus.com`
            ].map(checkDomainAccessiblity)).then(()=>{
                set({
                    mode: 'disqus'
                });
                localStorage.setItem('dsqjs_mode', 'disqus');
            }, ()=>{
                set({
                    mode: 'dsqjs'
                });
                localStorage.setItem('dsqjs_mode', 'dsqjs');
            });
        },
        setSortType (sortType) {
            set({
                sortType
            });
            if (isBrowser && sortType) {
                Promise.resolve().then(()=>{
                    localStorage.setItem('dsqjs_sort', sortType);
                });
            }
        },
        setError (error) {
            set({
                error
            });
        },
        setMsg (msg) {
            set({
                msg
            });
        },
        async fetchThread (shortname, identifier, apiKey, api = 'https://disqus.skk.moe/disqus/') {
            try {
                const thread = await disqusJsApiFetcher(apiKey, `${api}3.0/threads/list.json?forum=${encodeURIComponent(shortname)}&thread=${encodeURIComponent(`ident:${identifier}`)}`);
                if (thread.code === 0) {
                    set({
                        thread
                    });
                } else {
                    set({
                        error: true
                    });
                }
            } catch (e) {
                set({
                    error: true
                });
            }
        },
        async fetchMorePosts (shortname, id, apiKey, api = 'https://disqus.skk.moe/disqus/', reset = false) {
            if (!id) return;
            set(_objectSpread({}, reset && {
                posts: []
            }, {
                loadingPosts: true,
                morePostsError: false
            }));
            const posts = reset ? [] : get().posts;
            const sortType = get().sortType;
            const lastPost = posts.at(-1);
            if (lastPost && !lastPost.cursor.hasNext) return;
            const url = `${api}3.0/threads/listPostsThreaded?forum=${shortname}&thread=${id}&order=${sortType !== null && sortType !== void 0 ? sortType : 'desc'}${posts.length !== 0 && (lastPost === null || lastPost === void 0 ? void 0 : lastPost.cursor.next) ? `&cursor=${encodeURIComponent(lastPost.cursor.next)}` : ''}`;
            const handleError = ()=>{
                if (posts.length === 0) {
                    set({
                        error: true,
                        loadingPosts: false
                    });
                } else {
                    set({
                        morePostsError: true,
                        loadingPosts: false
                    });
                }
            };
            try {
                const newPosts = await disqusJsApiFetcher(apiKey, url);
                if (newPosts.code === 0) {
                    set((state)=>({
                            posts: state.posts.concat(newPosts),
                            loadingPosts: false
                        })
                    );
                } else {
                    handleError();
                }
            } catch (e) {
                handleError();
            }
        },
        reset () {
            set(_objectSpread({}, initialState));
        }
    });
});

var DisqusJSLoadMoreCommentsButton = /*#__PURE__*/ react.memo((props)=>{
    const { isError , isLoading  } = props, restProps = _objectWithoutProperties(props, [
        "isError",
        "isLoading"
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx("a", _objectSpread({}, restProps, {
        id: "dsqjs-load-more",
        className: `dsqjs-load-more ${isError ? 'is-error' : ''}`,
        role: "button",
        children: // eslint-disable-next-line no-nested-ternary
        isError ? '加载失败，请重试' : isLoading ? '正在加载...' : '加载更多评论'
    }));
});
if (process.env.NODE_ENV !== 'production') {
    DisqusJSLoadMoreCommentsButton.displayName = 'DisqusJSLoadMoreCommentsButton';
}
const DisqusJSForceDisqusModeButton = /*#__PURE__*/ react.memo((props)=>{
    const setDisqusJsMode = useStore((state)=>state.setMode
    );
    const onClickHandler = react.useCallback(()=>setDisqusJsMode('disqus')
    , [
        setDisqusJsMode
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx("a", {
        id: "dsqjs-force-disqus",
        className: "dsqjs-msg-btn",
        onClick: onClickHandler,
        children: props.children
    });
});
if (process.env.NODE_ENV !== 'production') {
    DisqusJSForceDisqusModeButton.displayName = 'DisqusJSForceDisqusModeButton';
}
const DisqusJSReTestModeButton = /*#__PURE__*/ react.memo((props)=>{
    const setDisqusJsMode = useStore((state)=>state.setMode
    );
    const onClickHandler = react.useCallback(()=>setDisqusJsMode(null)
    , [
        setDisqusJsMode
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx("a", {
        id: "dsqjs-test-disqus",
        className: "dsqjs-msg-btn",
        onClick: onClickHandler,
        children: props.children
    });
});
if (process.env.NODE_ENV !== 'production') {
    DisqusJSReTestModeButton.displayName = 'DisqusJSRetestModeButton';
}
const DisqusJSForceDisqusJsModeButton = /*#__PURE__*/ react.memo((props)=>{
    const setDisqusJsMode = useStore((state)=>state.setMode
    );
    const onClickHandler = react.useCallback(()=>setDisqusJsMode('dsqjs')
    , [
        setDisqusJsMode
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx("a", {
        id: "dsqjs-force-dsqjs",
        className: "dsqjs-msg-btn",
        onClick: onClickHandler,
        children: props.children
    });
});
if (process.env.NODE_ENV !== 'production') {
    DisqusJSForceDisqusJsModeButton.displayName = 'DisqusJSForceDisqusJsModeButton';
}
const DisqusJSRetryButton = /*#__PURE__*/ react.memo((props)=>{
    const setDisqusJsHasError = useStore((state)=>state.setError
    );
    const handleClick = react.useCallback(()=>{
        setDisqusJsHasError(false);
    }, [
        setDisqusJsHasError
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx("a", {
        id: "dsqjs-reload-dsqjs",
        className: "dsqjs-msg-btn",
        onClick: handleClick,
        children: props.children
    });
});
if (process.env.NODE_ENV !== 'production') {
    DisqusJSRetryButton.displayName = 'DisqusJSRetryButton';
}

const THREAD_ID = 'disqus_thread';
const EMBED_SCRIPT_ID = 'dsq-embed-scr';
const Disqus = /*#__PURE__*/ react.memo((props)=>{
    const setDisqusJsMessage = useStore((state)=>state.setMsg
    );
    const [loaded, setLoaded] = react.useState(false);
    react.useEffect(()=>{
        setDisqusJsMessage(null);
        if (isBrowser) {
            const clearDisqusInstance = ()=>{
                if (isBrowser) {
                    var ref2;
                    window.disqus_config = undefined;
                    const scriptEl = document.getElementById(EMBED_SCRIPT_ID);
                    if (scriptEl) {
                        document.head.removeChild(scriptEl);
                        scriptEl.remove();
                    }
                    (ref2 = window.DISQUS) === null || ref2 === void 0 ? void 0 : ref2.reset({});
                    try {
                        delete window.DISQUS;
                    } catch (e) {
                        window.DISQUS = undefined;
                    }
                    const containerEl = document.getElementById(THREAD_ID);
                    if (containerEl) {
                        while(containerEl.hasChildNodes()){
                            containerEl.removeChild(containerEl.firstChild);
                        }
                    }
                    document.querySelectorAll('link[href*="disquscdn.com/next"], link[href*="disqus.com/next"], script[src*="disquscdn.com/next/embed"], script[src*="disqus.com/count-data.js"], iframe[title="Disqus"]').forEach((el)=>{
                        var ref, ref1;
                        (ref = el.parentNode) === null || ref === void 0 ? void 0 : ref.removeChild(el);
                        (ref1 = el.parentElement) === null || ref1 === void 0 ? void 0 : ref1.removeChild(el);
                        el.remove();
                    });
                }
            };
            if (window.disqus_shortname !== props.shortname) {
                clearDisqusInstance();
            }
            const getDisqusConfig = ()=>{
                return function() {
                    if (props.identifier) {
                        this.page.identifier = props.identifier;
                    }
                    if (props.url) {
                        this.page.url = props.url;
                    }
                    if (props.title) {
                        this.page.title = props.title;
                    }
                    this.callbacks.onReady = [
                        ()=>{
                            setLoaded(true);
                        }
                    ];
                };
            };
            if (window.DISQUS && document.getElementById(EMBED_SCRIPT_ID)) {
                window.DISQUS.reset({
                    reload: true,
                    config: getDisqusConfig()
                });
            } else {
                window.disqus_config = getDisqusConfig();
                window.disqus_shortname = props.shortname;
                const scriptEl = document.createElement('script');
                scriptEl.id = EMBED_SCRIPT_ID;
                scriptEl.src = `https://${props.shortname}.disqus.com/embed.js`;
                scriptEl.async = true;
                document.head.appendChild(scriptEl);
            }
            return clearDisqusInstance;
        }
    }, [
        props.shortname,
        props.identifier,
        props.url,
        props.title,
        setDisqusJsMessage
    ]);
    return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsxs("div", {
                id: THREAD_ID,
                children: [
                    "\u8BC4\u8BBA\u5B8C\u6574\u6A21\u5F0F\u52A0\u8F7D\u4E2D... \u5982\u679C\u957F\u65F6\u95F4\u65E0\u6CD5\u52A0\u8F7D\uFF0C\u8BF7\u9488\u5BF9 disq.us | disquscdn.com | disqus.com \u542F\u7528\u4EE3\u7406\uFF0C\u6216\u5207\u6362\u81F3 ",
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSForceDisqusJsModeButton, {
                        children: "\u8BC4\u8BBA\u57FA\u7840\u6A21\u5F0F"
                    })
                ]
            }),
            !loaded && /*#__PURE__*/ jsxRuntime.jsxs("div", {
                id: "dsqjs-msg",
                children: [
                    "\u8BC4\u8BBA\u5B8C\u6574\u6A21\u5F0F\u52A0\u8F7D\u4E2D... \u5982\u679C\u957F\u65F6\u95F4\u65E0\u6CD5\u52A0\u8F7D\uFF0C\u8BF7\u9488\u5BF9 disq.us | disquscdn.com | disqus.com \u542F\u7528\u4EE3\u7406\uFF0C\u6216\u5207\u6362\u81F3 ",
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSForceDisqusJsModeButton, {
                        children: "\u8BC4\u8BBA\u57FA\u7840\u6A21\u5F0F"
                    })
                ]
            })
        ]
    });
});
if (process.env.NODE_ENV !== 'production') {
    Disqus.displayName = 'Disqus';
}

const DisqusJSError = /*#__PURE__*/ react.memo(()=>{
    return /*#__PURE__*/ jsxRuntime.jsxs("div", {
        id: "dsqjs-msg",
        children: [
            "\u8BC4\u8BBA\u57FA\u7840\u6A21\u5F0F\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7",
            ' ',
            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSRetryButton, {
                children: "\u91CD\u8F7D"
            }),
            ' ',
            "\u6216",
            ' ',
            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSReTestModeButton, {
                children: "\u5C1D\u8BD5\u5B8C\u6574 Disqus \u6A21\u5F0F"
            })
        ]
    });
});
const DisqusJSCreateThread = /*#__PURE__*/ react.memo(()=>{
    return /*#__PURE__*/ jsxRuntime.jsxs("div", {
        id: "dsqjs-msg",
        children: [
            "\u5F53\u524D Thread \u5C1A\u672A\u521B\u5EFA\u3002\u662F\u5426\u5207\u6362\u81F3",
            ' ',
            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSForceDisqusModeButton, {
                children: "\u5B8C\u6574 Disqus \u6A21\u5F0F"
            }),
            "\uFF1F"
        ]
    });
});
const DisqusJSNoComment = /*#__PURE__*/ react.memo((props)=>{
    return /*#__PURE__*/ jsxRuntime.jsx("p", {
        className: "dsqjs-no-comment",
        children: props.text
    });
});
if (process.env.NODE_ENV !== 'production') {
    DisqusJSError.displayName = 'DisqusJSError';
    DisqusJSCreateThread.displayName = 'DisqusJSCreateThread';
    DisqusJSNoComment.displayName = 'DisqusJSNoComment';
}

function DisqusJSPostItem(props) {
    const profileUrl = props.comment.author.profileUrl;
    const avatarUrl = processCommentMessage(props.comment.author.avatar.cache);
    return /*#__PURE__*/ jsxRuntime.jsxs("li", {
        id: `comment-${props.comment.id}`,
        children: [
            /*#__PURE__*/ jsxRuntime.jsxs("div", {
                className: "dsqjs-post-item dsqjs-clearfix",
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx("div", {
                        className: "dsqjs-post-avatar",
                        children: profileUrl ? /*#__PURE__*/ jsxRuntime.jsx("a", {
                            href: profileUrl,
                            target: "_blank",
                            rel: "noreferrer noopenner nofollow external",
                            children: /*#__PURE__*/ jsxRuntime.jsx("img", {
                                alt: props.comment.author.username,
                                src: avatarUrl
                            })
                        }) : /*#__PURE__*/ jsxRuntime.jsx("img", {
                            alt: props.comment.author.username,
                            src: avatarUrl
                        })
                    }),
                    /*#__PURE__*/ jsxRuntime.jsxs("div", {
                        className: "dsqjs-post-body",
                        children: [
                            /*#__PURE__*/ jsxRuntime.jsxs("div", {
                                className: "dsqjs-post-header",
                                children: [
                                    profileUrl ? /*#__PURE__*/ jsxRuntime.jsx("span", {
                                        className: "dsqjs-post-author",
                                        children: /*#__PURE__*/ jsxRuntime.jsx("a", {
                                            href: profileUrl,
                                            target: "_blank",
                                            rel: "noreferrer noopenner nofollow external",
                                            children: props.comment.author.name
                                        })
                                    }) : /*#__PURE__*/ jsxRuntime.jsx("span", {
                                        className: "dsqjs-post-author",
                                        children: props.comment.author.name
                                    }),
                                    // authorEl admin label
                                    props.admin === props.comment.author.username && /*#__PURE__*/ jsxRuntime.jsx("span", {
                                        className: "dsqjs-admin-badge",
                                        children: props.adminLabel
                                    }),
                                    ' ',
                                    /*#__PURE__*/ jsxRuntime.jsx("span", {
                                        className: "dsqjs-bullet"
                                    }),
                                    ' ',
                                    props.comment.createdAt && /*#__PURE__*/ jsxRuntime.jsx("span", {
                                        className: "dsqjs-meta",
                                        children: /*#__PURE__*/ jsxRuntime.jsx("time", {
                                            children: formatDate(props.comment.createdAt)
                                        })
                                    })
                                ]
                            }),
                            props.comment.isDeleted ? /*#__PURE__*/ jsxRuntime.jsx("div", {
                                className: "dsqjs-post-content",
                                children: /*#__PURE__*/ jsxRuntime.jsx("small", {
                                    children: "\u6B64\u8BC4\u8BBA\u5DF2\u88AB\u5220\u9664"
                                })
                            }) : /*#__PURE__*/ jsxRuntime.jsx("div", {
                                className: "dsqjs-post-content",
                                dangerouslySetInnerHTML: {
                                    __html: processCommentMessage(props.comment.message)
                                }
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSChildrenPostItems, _objectSpread({}, props, {
                currentNesting: props.nesting
            })),
            props.comment.hasMore && /*#__PURE__*/ jsxRuntime.jsxs("p", {
                className: "dsqjs-has-more",
                children: [
                    "\u5207\u6362\u81F3 ",
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSForceDisqusModeButton, {
                        children: "\u5B8C\u6574 Disqus \u6A21\u5F0F"
                    }),
                    " \u663E\u793A\u66F4\u591A\u56DE\u590D"
                ]
            })
        ]
    });
}
function DisqusJSChildrenPostItems(props) {
    if (!props.children || props.children.length === 0) return null;
    var _currentNesting, _nestingSetting;
    return /*#__PURE__*/ jsxRuntime.jsx("ul", {
        className: `dsqjs-post-list ${((_currentNesting = props.currentNesting) !== null && _currentNesting !== void 0 ? _currentNesting : 1) < ((_nestingSetting = props.nestingSetting) !== null && _nestingSetting !== void 0 ? _nestingSetting : 4) ? 'dsqjs-children' : ''}`,
        children: props.children.map((comment)=>/*#__PURE__*/ react.createElement(DisqusJSPostItem, _objectSpread({}, comment, {
                admin: props.admin,
                adminLabel: props.adminLabel,
                key: comment.comment.id
            }))
        )
    });
}
function createDisqusJSCommentASTItem(comment, allChildrenComments, nesting) {
    const result = {
        comment,
        children: findChildrenFromComments(allChildrenComments, Number(comment.id), nesting + 1),
        nesting: nesting + 1
    };
    return result;
}
function findChildrenFromComments(allChildrenComments, parentId, nesting) {
    if (allChildrenComments.length === 0) return null;
    const list = [];
    allChildrenComments.forEach((comment)=>{
        if (comment.parent === parentId) {
            list.unshift(createDisqusJSCommentASTItem(comment, allChildrenComments, nesting));
        }
    });
    return list;
}
const DisqusJSCommentsList = (props)=>{
    const processedComments = react.useMemo(()=>{
        const topLevelComments = [];
        const childComments = [];
        const rawComments = props.comments.slice();
        rawComments.map((comment, index)=>({
                i: index,
                p: comment.parent,
                d: getTimeStampFromString(comment.createdAt)
            })
        ).sort((a, b)=>a.p && b.p ? a.d - b.d : 0
        ).map(({ i  })=>rawComments[i]
        ).forEach((comment)=>(comment.parent ? childComments : topLevelComments).push(comment)
        );
        return topLevelComments.map((comment)=>createDisqusJSCommentASTItem(comment, childComments, 0)
        );
    }, [
        props.comments
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx("ul", {
        className: "dsqjs-post-list",
        id: "dsqjs-post-container",
        children: processedComments.map((comment)=>/*#__PURE__*/ react.createElement(DisqusJSPostItem, _objectSpread({}, comment, {
                key: comment.comment.id,
                admin: props.admin,
                adminLabel: props.adminLabel
            }))
        )
    });
};

// We will try to make the used api key as stable as possible
// And if React decides to forget some memoized values, it doesn't matter anyway
const useRandomApiKey = (apiKeys)=>react.useMemo(()=>{
        if (Array.isArray(apiKeys)) {
            return apiKeys[randomInt(0, apiKeys.length - 1)];
        }
        return apiKeys;
    }, [
        apiKeys
    ])
;

const DisqusJSSortTypeRadio = (props)=>{
    return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx("input", {
                className: "dsqjs-order-radio",
                id: `dsqjs-order-${props.sortType}`,
                type: "radio",
                name: "comment-order",
                value: props.sortType,
                onChange: props.onChange,
                checked: props.checked
            }),
            /*#__PURE__*/ jsxRuntime.jsx("label", {
                className: "dsqjs-order-label",
                htmlFor: `dsqjs-order-${props.sortType}`,
                title: props.title,
                children: props.label
            })
        ]
    });
};
const DisqusJSSortTypeRadioGroup = /*#__PURE__*/ react.memo(()=>{
    const sortType = useStore((state)=>state.sortType
    );
    const setSortType = useStore((state)=>state.setSortType
    );
    const onChangeHandler = react.useCallback((value)=>()=>setSortType(value)
    , [
        setSortType
    ]);
    return /*#__PURE__*/ jsxRuntime.jsxs("div", {
        className: "dsqjs-order",
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSSortTypeRadio, {
                checked: sortType === 'desc' || sortType === null,
                sortType: "desc",
                title: "\u6309\u4ECE\u65B0\u5230\u65E7",
                label: "\u6700\u65B0",
                onChange: onChangeHandler('desc')
            }),
            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSSortTypeRadio, {
                checked: sortType === 'asc',
                sortType: "asc",
                title: "\u6309\u4ECE\u65E7\u5230\u65B0",
                label: "\u6700\u65E9",
                onChange: onChangeHandler('asc')
            }),
            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSSortTypeRadio, {
                checked: sortType === 'popular',
                sortType: "popular",
                title: "\u6309\u8BC4\u5206\u4ECE\u9AD8\u5230\u4F4E",
                label: "\u6700\u4F73",
                onChange: onChangeHandler('popular')
            })
        ]
    });
});
if (process.env.NODE_ENV !== 'production') {
    DisqusJSSortTypeRadioGroup.displayName = 'DisqusJSSortTypeRadio';
}
const DisqusJSHeader = /*#__PURE__*/ react.memo((props)=>/*#__PURE__*/ jsxRuntime.jsx("header", {
        className: "dsqjs-header",
        id: "dsqjs-header",
        children: /*#__PURE__*/ jsxRuntime.jsxs("nav", {
            className: "dsqjs-nav dsqjs-clearfix",
            children: [
                /*#__PURE__*/ jsxRuntime.jsxs("ul", {
                    children: [
                        /*#__PURE__*/ jsxRuntime.jsx("li", {
                            className: "dsqjs-nav-tab dsqjs-tab-active",
                            children: /*#__PURE__*/ jsxRuntime.jsxs("span", {
                                children: [
                                    props.totalComments,
                                    " Comments"
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx("li", {
                            className: "dsqjs-nav-tab",
                            children: props.siteName
                        })
                    ]
                }),
                /*#__PURE__*/ jsxRuntime.jsx(DisqusJSSortTypeRadioGroup, {})
            ]
        })
    })
);
if (process.env.NODE_ENV !== 'production') {
    DisqusJSHeader.displayName = 'DisqusJSHeader';
}
const DisqusJSPosts = (props)=>{
    const apiKey = react.useRef(useRandomApiKey(props.apikey));
    const posts = useStore((state)=>state.posts
    );
    const sortType = useStore((state)=>state.sortType
    );
    const prevSortType = react.useRef(sortType);
    const errorWhenLoadMorePosts = useStore((state)=>state.morePostsError
    );
    const isLoadingMorePosts = useStore((state)=>state.loadingPosts
    );
    const fetchMorePosts = useStore((state)=>state.fetchMorePosts
    );
    const fetchFirstPageRef = react.useRef(null);
    const resetAndFetchFirstPageOfPosts = react.useCallback(()=>fetchMorePosts(props.shortname, props.id, apiKey.current, props.api, true)
    , [
        fetchMorePosts,
        props.api,
        props.id,
        props.shortname
    ]);
    const fetchNextPageOfPosts = react.useCallback(()=>fetchMorePosts(props.shortname, props.id, apiKey.current, props.api, false)
    , [
        fetchMorePosts,
        props.api,
        props.id,
        props.shortname
    ]);
    react.useEffect(()=>{
        // When there is no posts at all, load the first pagination of posts.
        if (fetchFirstPageRef.current !== props.id) {
            fetchFirstPageRef.current = props.id;
            resetAndFetchFirstPageOfPosts();
        } else if (prevSortType.current !== sortType) {
            prevSortType.current = sortType;
            fetchFirstPageRef.current = props.id;
            resetAndFetchFirstPageOfPosts();
        }
    }, [
        posts,
        resetAndFetchFirstPageOfPosts,
        props.id,
        isLoadingMorePosts,
        sortType
    ]);
    if (posts.length > 0) {
        var ref;
        return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [
                /*#__PURE__*/ jsxRuntime.jsx(DisqusJSCommentsList, {
                    comments: posts.filter(Boolean).map((i)=>i.response
                    ).flat(),
                    admin: props.admin,
                    adminLabel: props.adminLabel
                }),
                ((ref = posts.at(-1)) === null || ref === void 0 ? void 0 : ref.cursor.hasNext) && /*#__PURE__*/ jsxRuntime.jsx(DisqusJSLoadMoreCommentsButton, {
                    isLoading: isLoadingMorePosts,
                    isError: errorWhenLoadMorePosts,
                    onClick: isLoadingMorePosts ? undefined : fetchNextPageOfPosts
                })
            ]
        });
    }
    return null;
};
const DisqusJSThread = (props)=>{
    const apiKey = react.useRef(useRandomApiKey(props.apikey));
    const thread = useStore((state)=>state.thread
    );
    const fetchThread = useStore((state)=>state.fetchThread
    );
    const setDisqusJsMessage = useStore((state)=>state.setMsg
    );
    const fetchThreadRef = react.useRef(null);
    var _identifier;
    const identifier = (_identifier = props.identifier) !== null && _identifier !== void 0 ? _identifier : document.location.origin + document.location.pathname + document.location.search;
    react.useEffect(()=>{
        if (fetchThreadRef.current !== identifier) {
            setDisqusJsMessage(/*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
                children: [
                    "\u8BC4\u8BBA\u57FA\u7840\u6A21\u5F0F\u52A0\u8F7D\u4E2D... \u5982\u9700\u5B8C\u6574\u4F53\u9A8C\u8BF7\u9488\u5BF9 disq.us | disquscdn.com | disqus.com \u542F\u7528\u4EE3\u7406\u5E76 ",
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSReTestModeButton, {
                        children: "\u5C1D\u8BD5\u5B8C\u6574 Disqus \u6A21\u5F0F"
                    }),
                    " | ",
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSForceDisqusModeButton, {
                        children: "\u5F3A\u5236\u5B8C\u6574 Disqus \u6A21\u5F0F"
                    })
                ]
            }));
            fetchThreadRef.current = identifier;
            fetchThread(props.shortname, identifier, apiKey.current, props.api);
        } else {
            setDisqusJsMessage(/*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
                children: [
                    "\u4F60\u53EF\u80FD\u65E0\u6CD5\u8BBF\u95EE Disqus\uFF0C\u5DF2\u542F\u7528\u8BC4\u8BBA\u57FA\u7840\u6A21\u5F0F\u3002\u5982\u9700\u5B8C\u6574\u4F53\u9A8C\u8BF7\u9488\u5BF9 disq.us | disquscdn.com | disqus.com \u542F\u7528\u4EE3\u7406\u5E76 ",
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSReTestModeButton, {
                        children: "\u5C1D\u8BD5\u5B8C\u6574 Disqus \u6A21\u5F0F"
                    }),
                    " | ",
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSForceDisqusModeButton, {
                        children: "\u5F3A\u5236\u5B8C\u6574 Disqus \u6A21\u5F0F"
                    })
                ]
            }));
        }
    }, [
        thread,
        fetchThread,
        identifier,
        setDisqusJsMessage,
        props.shortname,
        props.api
    ]);
    if (!thread) {
        return null;
    }
    if (thread.response.length === 1) {
        if (thread.response[0].posts === 0) {
            var _siteName, _nocomment;
            return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
                children: [
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSHeader, {
                        totalComments: 0,
                        siteName: (_siteName = props.siteName) !== null && _siteName !== void 0 ? _siteName : ''
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSNoComment, {
                        text: (_nocomment = props.nocomment) !== null && _nocomment !== void 0 ? _nocomment : '这里空荡荡的，一个人都没有'
                    })
                ]
            });
        }
        var _siteName1;
        return /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [
                /*#__PURE__*/ jsxRuntime.jsx(DisqusJSHeader, {
                    totalComments: thread.response[0].posts,
                    siteName: (_siteName1 = props.siteName) !== null && _siteName1 !== void 0 ? _siteName1 : ''
                }),
                /*#__PURE__*/ jsxRuntime.jsx(DisqusJSPosts, _objectSpread({}, props, {
                    id: thread.response[0].id
                }))
            ]
        });
    }
    return /*#__PURE__*/ jsxRuntime.jsx(DisqusJSCreateThread, {});
};

const DisqusJSFooter = /*#__PURE__*/ react.memo(()=>/*#__PURE__*/ jsxRuntime.jsx("footer", {
        className: "dsqjs-footer-container",
        children: /*#__PURE__*/ jsxRuntime.jsxs("p", {
            className: "dsqjs-footer",
            children: [
                'Powered by ',
                /*#__PURE__*/ jsxRuntime.jsx("a", {
                    className: "dsqjs-disqus-logo",
                    href: "https://disqus.com",
                    target: "_blank",
                    rel: "external nofollow noopener noreferrer"
                }),
                ' ',
                "&",
                ' ',
                /*#__PURE__*/ jsxRuntime.jsx("a", {
                    className: "dsqjs-dsqjs-logo",
                    href: "https://disqusjs.skk.moe",
                    target: "_blank",
                    rel: "noreferrer",
                    children: "DisqusJS"
                })
            ]
        })
    })
);
if (process.env.NODE_ENV !== 'production') {
    DisqusJSFooter.displayName = 'DisqusJSFooter';
}

var styles = {"dsqjs":"__dsqjs_oc95o1"};

const DisqusJSEntry = (props)=>{
    const disqusJsMode = useStore((state)=>state.mode
    );
    const checkDisqusJsMode = useStore((state)=>state.checkMode
    );
    react.useEffect(()=>{
        if (disqusJsMode !== 'disqus' && disqusJsMode !== 'dsqjs') {
            checkDisqusJsMode(props.shortname);
        }
    }, [
        checkDisqusJsMode,
        disqusJsMode,
        props.shortname
    ]);
    if (disqusJsMode === 'disqus') {
        return /*#__PURE__*/ jsxRuntime.jsx(Disqus, {
            shortname: props.shortname,
            identifier: props.identifier,
            url: props.url,
            title: props.title
        });
    }
    if (disqusJsMode === 'dsqjs') {
        return /*#__PURE__*/ jsxRuntime.jsx(DisqusJSThread, _objectSpread({}, props));
    }
    return null;
};
var DisqusJS = /*#__PURE__*/ react.forwardRef((props, ref)=>{
    const msg = useStore((state)=>state.msg
    );
    const disqusJsHasError = useStore((state)=>state.error
    );
    const { shortname , siteName , identifier , url , title , api , apikey , nesting , nocomment , admin , adminLabel , className  } = props, rest = _objectWithoutProperties(props, [
        "shortname",
        "siteName",
        "identifier",
        "url",
        "title",
        "api",
        "apikey",
        "nesting",
        "nocomment",
        "admin",
        "adminLabel",
        "className"
    ]);
    const disqusJsConfig = {
        shortname,
        siteName,
        identifier,
        url,
        title,
        api,
        apikey,
        nesting,
        nocomment,
        admin,
        adminLabel
    };
    const [startClientSideRender, setStartClientSideRender] = react.useState(false);
    react.useEffect(()=>{
        setStartClientSideRender(true);
    }, []);
    if (startClientSideRender) {
        return /*#__PURE__*/ jsxRuntime.jsx("div", _objectSpread({
            ref: ref
        }, rest, {
            className: `${styles.dsqjs} ${className !== null && className !== void 0 ? className : ''}`,
            children: /*#__PURE__*/ jsxRuntime.jsxs("section", {
                id: "dsqjs",
                children: [
                    disqusJsHasError ? /*#__PURE__*/ jsxRuntime.jsx(DisqusJSError, {}) : /*#__PURE__*/ jsxRuntime.jsxs(jsxRuntime.Fragment, {
                        children: [
                            msg && /*#__PURE__*/ jsxRuntime.jsx("div", {
                                id: "dsqjs-msg",
                                children: msg
                            }),
                            /*#__PURE__*/ jsxRuntime.jsx(DisqusJSEntry, _objectSpread({}, disqusJsConfig))
                        ]
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx(DisqusJSFooter, {})
                ]
            })
        }));
    }
    return null;
});

exports.DisqusJS = DisqusJS;
