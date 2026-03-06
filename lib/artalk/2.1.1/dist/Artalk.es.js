var main = '';

class User {
  data;
  constructor(conf) {
    const localUser = JSON.parse(window.localStorage.getItem("ArtalkUser") || "{}");
    this.data = {
      nick: localUser.nick || "",
      email: localUser.email || "",
      link: localUser.link || "",
      token: localUser.token || "",
      isAdmin: localUser.isAdmin || false
    };
  }
  save() {
    window.localStorage.setItem("ArtalkUser", JSON.stringify(this.data));
  }
  checkHasBasicUserInfo() {
    return !!this.data.nick && !!this.data.email;
  }
}

class Context {
  cid;
  $root;
  conf;
  user;
  eventList = [];
  constructor(rootEl, conf) {
    this.cid = +new Date();
    this.$root = rootEl;
    this.conf = conf;
    this.user = new User(this.conf);
    this.$root.setAttribute("atk-run-id", this.cid.toString());
  }
  on(name, handler, scope = "internal") {
    this.eventList.push({ name, handler, scope });
  }
  off(name, handler, scope = "internal") {
    this.eventList = this.eventList.filter((evt) => {
      if (handler)
        return !(evt.name === name && evt.handler === handler && evt.scope === scope);
      return !(evt.name === name && evt.scope === scope);
    });
  }
  trigger(name, payload, scope) {
    this.eventList.filter((evt) => evt.name === name && (scope ? evt.scope === scope : true)).map((evt) => evt.handler).forEach((handler) => handler(payload));
  }
}

const Emoji = {
	inputType: "emoji",
	container: [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"😂",
		"😊",
		"😉",
		"👀",
		"😌",
		"😍",
		"😘",
		"😋",
		"😜",
		"😝",
		"😎",
		"😏",
		"😒",
		"😟",
		"😕",
		"😖",
		"😫",
		"😩",
		"😠",
		"😲",
		"😵",
		"😳",
		"😱",
		"😨",
		"😢",
		"😭",
		"😷",
		"✋",
		"✌️",
		"👊",
		"👋",
		"👏",
		"👍",
		"👎",
		"❤️",
		"🎉",
		"🚀"
	]
};
var emoticons = {
	"颜表情": {
	inputType: "emoticon",
	container: {
		Hi: "|´・ω・)ノ",
		"开心": "ヾ(≧∇≦*)ゝ",
		"星星眼": "(☆ω☆)",
		"掀桌": "（╯‵□′）╯︵┴─┴",
		"流口水": "￣﹃￣",
		"捂脸": "(/ω＼)",
		"给跪": "∠( ᐛ 」∠)＿",
		"哈？": "(๑•̀ㅁ•́ฅ)",
		"斜眼": "→_→",
		"加油": "୧(๑•̀⌄•́๑)૭",
		"有木有WiFi": "٩(ˊᗜˋ*)و",
		"前方高能预警": "(ノ°ο°)ノ",
		"纳尼": "(´இ皿இ｀)",
		"吓死惹": "⌇●﹏●⌇",
		"已阅留爪": "(ฅ´ω`ฅ)",
		"去吧大师球": "(╯°A°)╯︵○○○",
		"太萌惹": "φ(￣∇￣o)",
		"咦咦咦": "ヾ(´･ ･｀｡)ノ\"",
		"气呼呼": "( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃",
		"我受到了惊吓": "(ó﹏ò｡)",
		"什么鬼": "Σ(っ °Д °;)っ",
		"摸摸头": "( ,,´･ω･)ﾉ\"(´っω･｀｡)",
		"无奈": "╮(╯▽╰)╭ ",
		"脸红": "o(*////▽////*)q ",
		"悲哀": "＞﹏＜",
		"静静地看着你": "( ๑´•ω•) \"(ㆆᴗㆆ)",
		"不要哇": "(｡•ˇ‸ˇ•｡)"
	}
},
	Emoji: Emoji,
	"滑稽": {
	inputType: "image",
	container: {
		"原味稽": "https://i.loli.net/2019/02/01/5c53d26b7ae13.png",
		"还是算了": "https://i.loli.net/2020/04/30/riySFlu75fJdG4p.png",
		"蓝纹稽": "https://i.loli.net/2020/04/30/jyh5IVzpqXsHuvU.jpg",
		"随稽应变": "https://i.loli.net/2017/02/05/5896e6ec1d528.jpg",
		"蠕动": "https://i.loli.net/2017/02/05/5896e9712a3c1.gif",
		"束手无稽": "https://i.loli.net/2020/04/30/dF8sTOpgomj7qf5.jpg",
		"微笑默叹以为妙绝": "https://i.loli.net/2019/02/01/5c53daa84f24a.png",
		"喝嘤料": "https://i.loli.net/2019/02/01/5c53d63d8c6af.jpg",
		"暗中观察": "https://i.loli.net/2019/02/01/5c53dd21a2e7b.jpg",
		"高兴": "https://i.loli.net/2019/02/01/5c53d1b9e5f38.jpg",
		"惊稽": "https://i.loli.net/2019/02/01/5c53d1e2ad89f.jpg",
		"可这和我的帅有什么关系": "https://i.loli.net/2017/02/05/5896ece29a8e0.jpg",
		"狱稽": "https://i.loli.net/2020/04/30/cUEQrVYGFiDjqhy.jpg",
		"梆": "https://i.loli.net/2020/04/30/TlAGjm6IvJSMVpq.jpg",
		"吃鱼摆摆": "https://i.loli.net/2017/02/05/5896ec2cb7f39.gif",
		"跃跃欲试 3": "https://i.loli.net/2017/02/05/5896ece2ac5a2.gif",
		"突然滑稽": "https://i.loli.net/2019/02/01/5c53cf2a457f1.jpg",
		"扶墙怂": "https://i.loli.net/2017/02/05/5896ece2ab57a.jpg",
		"阔以": "https://i.loli.net/2020/04/30/7EYyq1TcBKa3eQ2.jpg",
		"不得行": "https://i.loli.net/2020/04/30/KoqBGauX7TEfeyn.jpg",
		"少儿不宜": "https://i.loli.net/2020/04/30/nt2ZWRozUNjBxAK.jpg",
		"稽日可期": "https://i.loli.net/2020/04/30/FmfYcoMJesi2Ddq.jpg",
		"哎": "https://i.loli.net/2020/04/30/ps7PTIANgSErqnU.jpg",
		"别看丢人": "https://i.loli.net/2019/02/01/5c53d4f89ea29.jpg",
		"地稽 2": "https://i.loli.net/2019/02/01/5c53dbae85687.jpg",
		"地稽": "https://i.loli.net/2020/04/30/BnTMX35EPxleVmA.jpg",
		"老阔有点扣": "https://i.loli.net/2020/04/30/fhDXbA9T1zJPlKk.gif",
		"啊哈哈": "https://i.loli.net/2019/02/01/5c53dc2947d84.jpg",
		"无稽可奈": "https://i.loli.net/2020/04/30/UyxTzB2fS3LtH7Q.jpg",
		"老实巴交": "https://i.loli.net/2020/04/30/7DgSoyqwtYBxchE.jpg",
		"紧张": "https://i.loli.net/2017/02/05/5896e8a408253.jpg",
		"摇摆稽": "https://i.loli.net/2019/02/01/5c53d1904dcb2.gif",
		"又不是不能用": "https://i.loli.net/2019/02/01/5c53ce897ab55.jpg",
		"一时滑稽": "https://i.loli.net/2019/02/01/5c53d5d28e22c.jpg",
		"无法接受": "https://i.loli.net/2019/02/01/5c53cee8422fc.jpg",
		"嘤雄豪稽": "https://i.loli.net/2020/04/30/sbtw6o7iKaM4Nmq.jpg",
		"相视双稽": "https://i.loli.net/2019/02/01/5c53d5a093149.jpg",
		"稽皮发麻": "https://i.loli.net/2017/02/05/5896ece2a019f.jpg",
		"地稽 3": "https://i.loli.net/2019/02/01/5c53dbe510bcf.jpg",
		"地稽委屈": "https://i.loli.net/2019/02/01/5c53d76e250da.jpg",
		"地稽抚摸": "https://i.loli.net/2020/04/30/cavZ6nNzMPimLy7.gif",
		"地稽捶打": "https://i.loli.net/2020/04/30/vFVPynXaHR5sitk.gif",
		"绝望": "https://i.loli.net/2019/02/01/5c53dc0ba2303.jpg",
		"气稽败坏": "https://i.loli.net/2019/02/01/5c53d216f3c60.jpg",
		"当场去世": "https://i.loli.net/2020/04/30/sogxHMTFWbE2lrP.jpg",
		"喝酒": "https://i.loli.net/2019/02/01/5c53d78c3f4a5.jpg",
		"老衲摆摊算命": "https://i.loli.net/2017/02/05/5896ece29d8a5.gif",
		"老哥，稳": "https://i.loli.net/2017/02/05/5896ece29ebb0.jpg",
		"自闭稽": "https://i.loli.net/2019/02/01/5c53d6603ee24.jpg",
		"无话可说": "https://i.loli.net/2019/02/01/5c53d6a77b7e4.jpg",
		"跃跃欲试": "https://i.loli.net/2017/02/05/5896e9710dfd5.jpg",
		"跃跃欲试 2": "https://i.loli.net/2019/02/01/5c53dcc057350.jpg",
		"满脑子骚操作": "https://i.loli.net/2020/04/30/xJXcUtO2BryHAsa.gif",
		"稽之舞": "https://i.loli.net/2019/02/01/5c53de1a4d14d.gif",
		"将稽就稽": "https://i.loli.net/2020/04/30/KVwf8qCrZts6WOT.gif"
	}
}
};

const defaultConf = {
  el: "",
  pageKey: "",
  server: "",
  site: "",
  placeholder: "\u952E\u5165\u5185\u5BB9...",
  noComment: "\u300C\u6B64\u65F6\u65E0\u58F0\u80DC\u6709\u58F0\u300D",
  sendBtn: "\u53D1\u9001\u8BC4\u8BBA",
  darkMode: false,
  emoticons,
  vote: true,
  voteDown: false,
  uaBadge: true,
  flatMode: "auto",
  maxNesting: 3,
  gravatar: {
    default: "mp",
    mirror: "https://sdn.geekzu.org/avatar/"
  },
  pagination: {
    pageSize: 15,
    readMore: true,
    autoLoad: true
  },
  heightLimit: {
    content: 200,
    children: 300
  },
  reqTimeout: 15e3,
  versionCheck: true
};

class Component {
  $el;
  ctx;
  conf;
  constructor(ctx) {
    this.ctx = ctx;
    this.conf = ctx.conf;
  }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var marked$1 = {exports: {}};

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

(function (module, exports) {
(function(root) {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: /^ {0,3}(`{3,}|~{3,})([^`~\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  nptable: noop,
  table: noop,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d{1,9}\.)/;
block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} +')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}|~{3,})[^`\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});

/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */

block.pedantic = merge({}, block.normal, {
  html: edit(
    '^ *(?:comment *(?:\\n|\\s*$)'
    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  fences: noop, // fences not supported
  paragraph: edit(block.normal._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' *#{1,6} *[^\n]')
    .replace('lheading', block.lheading)
    .replace('blockquote', ' {0,3}>')
    .replace('|fences', '')
    .replace('|list', '')
    .replace('|html', '')
    .getRegex()
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = Object.create(null);
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.pedantic) {
    this.rules = block.pedantic;
  } else if (this.options.gfm) {
    this.rules = block.gfm;
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, '');
  var next,
      loose,
      cap,
      bull,
      b,
      item,
      listStart,
      listItems,
      t,
      space,
      i,
      tag,
      l,
      isordered,
      istask,
      ischecked;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      var lastToken = this.tokens[this.tokens.length - 1];
      src = src.substring(cap[0].length);
      // An indented code block cannot interrupt a paragraph.
      if (lastToken && lastToken.type === 'paragraph') {
        lastToken.text += '\n' + cap[0].trimRight();
      } else {
        cap = cap[0].replace(/^ {4}/gm, '');
        this.tokens.push({
          type: 'code',
          codeBlockStyle: 'indented',
          text: !this.options.pedantic
            ? rtrim(cap, '\n')
            : cap
        });
      }
      continue;
    }

    // fences
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2] ? cap[2].trim() : cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (cap = this.rules.nptable.exec(src)) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(item.cells[i], item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];
      isordered = bull.length > 1;

      listStart = {
        type: 'list_start',
        ordered: isordered,
        start: isordered ? +bull : '',
        loose: false
      };

      this.tokens.push(listStart);

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      listItems = [];
      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) */, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull.length > 1 ? b.length === 1
            : (b.length > 1 || (this.options.smartLists && b !== bull))) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        if (loose) {
          listStart.loose = true;
        }

        // Check for task list items
        istask = /^\[[ xX]\] /.test(item);
        ischecked = undefined;
        if (istask) {
          ischecked = item[1] !== ' ';
          item = item.replace(/^\[[ xX]\] +/, '');
        }

        t = {
          type: 'list_item_start',
          task: istask,
          checked: ischecked,
          loose: loose
        };

        listItems.push(t);
        this.tokens.push(t);

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      if (listStart.loose) {
        l = listItems.length;
        i = 0;
        for (; i < l; i++) {
          listItems[i].loose = true;
        }
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
      tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
      if (!this.tokens.links[tag]) {
        this.tokens.links[tag] = {
          href: cap[2],
          title: cap[3]
        };
      }
      continue;
    }

    // table (gfm)
    if (cap = this.rules.table.exec(src)) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(
            item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
            item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2].charAt(0) === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: '^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
};

// list of punctuation marks from common mark spec
// without ` and ] to workaround Rule 17 (inline code blocks/links)
inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag)
  .replace('comment', block._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
});

inline.gfm.url = edit(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this.options.pedantic) {
    this.rules = inline.pedantic;
  } else if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = '',
      link,
      text,
      href,
      title,
      cap,
      prevCapZero;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(cap[1]);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = true;
      } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = false;
      }

      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      var lastParenIndex = findClosingBracket(cap[2], '()');
      if (lastParenIndex > -1) {
        var linkLen = 4 + cap[1].length + lastParenIndex;
        cap[2] = cap[2].substring(0, lastParenIndex);
        cap[0] = cap[0].substring(0, linkLen).trim();
        cap[3] = '';
      }
      src = src.substring(cap[0].length);
      this.inLink = true;
      href = cap[2];
      if (this.options.pedantic) {
        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        } else {
          title = '';
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : '';
      }
      href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
      out += this.outputLink(cap, {
        href: InlineLexer.escapes(href),
        title: InlineLexer.escapes(title)
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(this.mangle(cap[1]));
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      src = src.substring(cap[0].length);
      out += this.renderer.link(href, null, text);
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      if (this.inRawBlock) {
        out += this.renderer.text(this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]);
      } else {
        out += this.renderer.text(escape(this.smartypants(cap[0])));
      }
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

InlineLexer.escapes = function(text) {
  return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = link.href,
      title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = '',
      l = text.length,
      i = 0,
      ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || marked.defaults;
}

Renderer.prototype.code = function(code, infostring, escaped) {
  var lang = (infostring || '').match(/\S*/)[0];
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw, slugger) {
  if (this.options.headerIds) {
    return '<h'
      + level
      + ' id="'
      + this.options.headerPrefix
      + slugger.slug(raw)
      + '">'
      + text
      + '</h'
      + level
      + '>\n';
  }
  // ignore IDs
  return '<h' + level + '>' + text + '</h' + level + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.checkbox = function(checked) {
  return '<input '
    + (checked ? 'checked="" ' : '')
    + 'disabled="" type="checkbox"'
    + (this.options.xhtml ? ' /' : '')
    + '> ';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  if (body) body = '<tbody>' + body + '</tbody>';

  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + body
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' align="' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }
  var out = '<a href="' + escape(href) + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }

  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * TextRenderer
 * returns only the textual part of the token
 */

function TextRenderer() {}

// no need for block level renderers

TextRenderer.prototype.strong =
TextRenderer.prototype.em =
TextRenderer.prototype.codespan =
TextRenderer.prototype.del =
TextRenderer.prototype.text = function(text) {
  return text;
};

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
};

TextRenderer.prototype.br = function() {
  return '';
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
  this.slugger = new Slugger();
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, { renderer: new TextRenderer() })
  );
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  this.token = this.tokens.pop();
  return this.token;
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text)),
        this.slugger);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
          i,
          row,
          cell,
          j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';
      var loose = this.token.loose;
      var checked = this.token.checked;
      var task = this.token.task;

      if (this.token.task) {
        body += this.renderer.checkbox(checked);
      }

      while (this.next().type !== 'list_item_end') {
        body += !loose && this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }
      return this.renderer.listitem(body, task, checked);
    }
    case 'html': {
      // TODO parse inline content if parameter markdown=1
      return this.renderer.html(this.token.text);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
    default: {
      var errMsg = 'Token with "' + this.token.type + '" type was not found.';
      if (this.options.silent) {
        console.log(errMsg);
      } else {
        throw new Error(errMsg);
      }
    }
  }
};

/**
 * Slugger generates header id
 */

function Slugger() {
  this.seen = {};
}

/**
 * Convert string to unique id
 */

Slugger.prototype.slug = function(value) {
  var slug = value
    .toLowerCase()
    .trim()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
    .replace(/\s/g, '-');

  if (this.seen.hasOwnProperty(slug)) {
    var originalSlug = slug;
    do {
      this.seen[originalSlug]++;
      slug = originalSlug + '-' + this.seen[originalSlug];
    } while (this.seen.hasOwnProperty(slug));
  }
  this.seen[slug] = 0;

  return slug;
};

/**
 * Helpers
 */

function escape(html, encode) {
  if (encode) {
    if (escape.escapeTest.test(html)) {
      return html.replace(escape.escapeReplace, function(ch) { return escape.replacements[ch]; });
    }
  } else {
    if (escape.escapeTestNoEncode.test(html)) {
      return html.replace(escape.escapeReplaceNoEncode, function(ch) { return escape.replacements[ch]; });
    }
  }

  return html;
}

escape.escapeTest = /[&<>"']/;
escape.escapeReplace = /[&<>"']/g;
escape.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || '';
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}

function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1,
      target,
      key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  var row = tableRow.replace(/\|/g, function(match, offset, str) {
        var escaped = false,
            curr = offset;
        while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
        if (escaped) {
          // odd number of slashes means | is escaped
          // so we leave it alone
          return '|';
        } else {
          // add space before unescaped |
          return ' |';
        }
      }),
      cells = row.split(/ \|/),
      i = 0;

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

// Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
// /c*$/ is vulnerable to REDOS.
// invert: Remove suffix of non-c chars instead. Default falsey.
function rtrim(str, c, invert) {
  if (str.length === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  var suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < str.length) {
    var currChar = str.charAt(str.length - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.substr(0, str.length - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  var level = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
  }
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    checkSanitizeDeprecation(opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.getDefaults = function() {
  return {
    baseUrl: null,
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: new Renderer(),
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    xhtml: false
  };
};

marked.defaults = marked.getDefaults();

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.Slugger = Slugger;

marked.parse = marked;

{
  module.exports = marked;
}
})();
}(marked$1));

var libMarked = marked$1.exports;

var hanabi$1 = {exports: {}};

(function (module, exports) {
(function (global, factory) {
  module.exports = factory() ;
}(commonjsGlobal, (function () {
function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$1 = createCommonjsModule(function (module) {

var comment = module.exports = function () {
	return new RegExp('(?:' + comment.line().source + ')|(?:' + comment.block().source + ')', 'gm');
};

comment.line = function () {
	return /(?:^|\s)\/\/(.+?)$/gm;
};

comment.block = function () {
	return /\/\*([\S\s]*?)\*\//gm;
};
});

var defaultColors = ['23AC69', '91C132', 'F19726', 'E8552D', '1AAB8E', 'E1147F', '2980C1', '1BA1E6', '9FA0A0', 'F19726', 'E30B20', 'E30B20', 'A3338B'];

var index = function (input, ref) {
  if ( ref === void 0 ) ref = {};
  var colors = ref.colors; if ( colors === void 0 ) colors = defaultColors;

  var index = 0;
  var cache = {};
  var wordRe = /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/;
  var leftAngleRe = /</;

  var re = new RegExp(("(" + (wordRe.source) + "|" + (leftAngleRe.source) + ")|(" + (index$1().source) + ")"), 'gmi');
  return input
  .replace(re, function (m, word, cm) {
    if (cm) {
      return toComment(cm)
    }

    if (word === '<') {
      return '&lt;'
    }
    var color;
    if (cache[word]) {
      color = cache[word];
    } else {
      color = colors[index];
      cache[word] = color;
    }

    var out = "<span style=\"color: #" + color + "\">" + word + "</span>";
    index = ++index % colors.length;
    return out
  })
};

function toComment(cm) {
  return ("<span style=\"color: slategray\">" + cm + "</span>")
}

return index;

})));
}(hanabi$1));

var hanabi = hanabi$1.exports;

function createElement(htmlStr = "") {
  const div = document.createElement("div");
  div.innerHTML = htmlStr.trim();
  return div.firstElementChild || div;
}
function getHeight(el) {
  return parseFloat(getComputedStyle(el, null).height.replace("px", ""));
}
function htmlEncode(str) {
  const temp = document.createElement("div");
  temp.innerText = str;
  const output = temp.innerHTML;
  return output;
}
function getQueryParam(name) {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  };
}
function padWithZeros(vNumber, width) {
  let numAsString = vNumber.toString();
  while (numAsString.length < width) {
    numAsString = `0${numAsString}`;
  }
  return numAsString;
}
function dateFormat(date) {
  const vDay = padWithZeros(date.getDate(), 2);
  const vMonth = padWithZeros(date.getMonth() + 1, 2);
  const vYear = padWithZeros(date.getFullYear(), 2);
  return `${vYear}-${vMonth}-${vDay}`;
}
function timeAgo(date) {
  try {
    const oldTime = date.getTime();
    const currTime = new Date().getTime();
    const diffValue = currTime - oldTime;
    const days = Math.floor(diffValue / (24 * 3600 * 1e3));
    if (days === 0) {
      const leave1 = diffValue % (24 * 3600 * 1e3);
      const hours = Math.floor(leave1 / (3600 * 1e3));
      if (hours === 0) {
        const leave2 = leave1 % (3600 * 1e3);
        const minutes = Math.floor(leave2 / (60 * 1e3));
        if (minutes === 0) {
          const leave3 = leave2 % (60 * 1e3);
          const seconds = Math.round(leave3 / 1e3);
          return `${seconds} \u79D2\u524D`;
        }
        return `${minutes} \u5206\u949F\u524D`;
      }
      return `${hours} \u5C0F\u65F6\u524D`;
    }
    if (days < 0)
      return "\u521A\u521A";
    if (days < 8) {
      return `${days} \u5929\u524D`;
    }
    return dateFormat(date);
  } catch (error) {
    console.error(error);
    return " - ";
  }
}
function getGravatarURL(ctx, emailMD5) {
  return `${(ctx.conf.gravatar?.mirror || "").replace(/\/$/, "")}/${emailMD5}?d=${encodeURIComponent(ctx.conf.gravatar?.default || "")}&s=80`;
}
function versionCompare(a, b) {
  const pa = a.split(".");
  const pb = b.split(".");
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb)
      return 1;
    if (nb > na)
      return -1;
    if (!Number.isNaN(na) && Number.isNaN(nb))
      return 1;
    if (Number.isNaN(na) && !Number.isNaN(nb))
      return -1;
  }
  return 0;
}
let markedInstance = null;
function marked(ctx, src) {
  if (!markedInstance) {
    const renderer = new libMarked.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
      const html = linkRenderer.call(renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };
    const nMarked = libMarked;
    nMarked.setOptions({
      renderer,
      highlight: (code) => hanabi(code),
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: true,
      smartLists: true,
      smartypants: true,
      xhtml: false
    });
    markedInstance = nMarked;
  }
  return markedInstance(src);
}

function showLoading(parentElem) {
  if (parentElem instanceof Context)
    parentElem = parentElem.$root;
  let $loading = parentElem.querySelector(".atk-loading");
  if (!$loading) {
    $loading = createElement(`<div class="atk-loading atk-fade-in" style="display: none;">
      <div class="atk-loading-spinner">
        <svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>
      </div>
    </div>`);
    parentElem.appendChild($loading);
  }
  $loading.style.display = "";
  const $spinner = $loading.querySelector(".atk-loading-spinner");
  if ($spinner) {
    $spinner.style.display = "none";
    window.setTimeout(() => {
      $spinner.style.display = "";
    }, 500);
  }
}
function hideLoading(parentElem) {
  if (parentElem instanceof Context)
    parentElem = parentElem.$root;
  const $loading = parentElem.querySelector(".atk-loading");
  if ($loading)
    $loading.style.display = "none";
}
function isVisible(el, viewport = document.documentElement) {
  const viewportHeight = viewport.clientHeight;
  const docViewTop = viewport.scrollTop;
  const docViewBottom = docViewTop + viewportHeight;
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top + docViewTop;
  const elemBottom = elemTop + rect.height;
  return elemBottom <= docViewBottom;
}
function scrollIntoView(elem, enableAnim = true) {
  const top = getOffset(elem).top + getHeight(elem) / 2 - document.documentElement.clientHeight / 2;
  if (enableAnim) {
    window.scroll({
      top: top > 0 ? top : 0,
      left: 0
    });
  } else {
    window.scroll(0, top > 0 ? top : 0);
  }
}
function showNotify(wrapElem, msg, type) {
  const colors = { s: "#57d59f", e: "#ff6f6c", w: "#ffc721", i: "#2ebcfc" };
  const timeout = 3e3;
  const notifyElem = createElement(`<div class="atk-notify atk-fade-in" style="background-color: ${colors[type]}"><span class="atk-notify-content"></span></div>`);
  const notifyContentEl = notifyElem.querySelector(".atk-notify-content");
  notifyContentEl.innerHTML = htmlEncode(msg).replace("\n", "<br/>");
  wrapElem.appendChild(notifyElem);
  const notifyRemove = () => {
    notifyElem.classList.add("atk-fade-out");
    setTimeout(() => {
      notifyElem.remove();
    }, 200);
  };
  let timeoutFn;
  {
    timeoutFn = window.setTimeout(() => {
      notifyRemove();
    }, timeout);
  }
  notifyElem.addEventListener("click", () => {
    notifyRemove();
    window.clearTimeout(timeoutFn);
  });
}
function playFadeAnim(elem, after, type = "in") {
  elem.classList.add(`atk-fade-${type}`);
  const onAnimEnded = () => {
    elem.classList.remove(`atk-fade-${type}`);
    elem.removeEventListener("animationend", onAnimEnded);
    if (after)
      after();
  };
  elem.addEventListener("animationend", onAnimEnded);
}
function playFadeInAnim(elem, after) {
  playFadeAnim(elem, after, "in");
}
function setError(parentElem, html, title = '<span class="atk-error-title">Artalk Error</span>') {
  if (parentElem instanceof Context)
    parentElem = parentElem.$root;
  let elem = parentElem.querySelector(".atk-error-layer");
  if (html === null) {
    if (elem !== null)
      elem.remove();
    return;
  }
  if (!elem) {
    elem = createElement(`<div class="atk-error-layer">${title}<span class="atk-error-text"></span></div>`);
    parentElem.appendChild(elem);
  }
  const errorTextEl = elem.querySelector(".atk-error-text");
  errorTextEl.innerHTML = "";
  if (html === null)
    return;
  if (html instanceof HTMLElement) {
    errorTextEl.appendChild(html);
  } else {
    errorTextEl.innerText = html;
  }
}
function getScrollBarWidth() {
  const inner = document.createElement("p");
  inner.style.width = "100%";
  inner.style.height = "200px";
  const outer = document.createElement("div");
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let w2 = inner.offsetWidth;
  if (w1 === w2)
    w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return w1 - w2;
}

class Layer extends Component {
  name;
  $wrap;
  $mask;
  maskClickHideEnable = true;
  bodyStyleOrgOverflow = "";
  bodyStyleOrgPaddingRight = "";
  constructor(ctx, name, el) {
    super(ctx);
    this.name = name;
    const { $wrap, $mask } = GetLayerWrap(ctx);
    this.$wrap = $wrap;
    this.$mask = $mask;
    this.$el = this.$wrap.querySelector(`[data-layer-name="${name}"].atk-layer-item`);
    if (this.$el === null) {
      if (!el) {
        this.$el = createElement();
        this.$el.classList.add("atk-layer-item");
      } else {
        this.$el = el;
      }
    }
    this.$el.setAttribute("data-layer-name", name);
    this.$el.style.display = "none";
    this.$wrap.append(this.$el);
  }
  getName() {
    return this.name;
  }
  getWrapEl() {
    return this.$wrap;
  }
  getEl() {
    return this.$el;
  }
  static hideTimeoutList = [];
  show() {
    Layer.hideTimeoutList.forEach((item) => {
      clearTimeout(item);
    });
    Layer.hideTimeoutList = [];
    this.$wrap.style.display = "block";
    this.$mask.style.display = "block";
    this.$mask.classList.add("atk-fade-in");
    this.$el.style.display = "";
    this.$mask.onclick = () => {
      if (this.maskClickHideEnable)
        this.hide();
    };
    this.bodyStyleOrgOverflow = document.body.style.overflow;
    this.bodyStyleOrgPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    const bpr = parseInt(window.getComputedStyle(document.body, null).getPropertyValue("padding-right"), 10);
    document.body.style.paddingRight = `${getScrollBarWidth() + bpr || 0}px`;
  }
  hide() {
    Layer.hideTimeoutList.push(window.setTimeout(() => {
      this.$wrap.style.display = "none";
      document.body.style.overflow = this.bodyStyleOrgOverflow;
      document.body.style.paddingRight = this.bodyStyleOrgPaddingRight;
    }, 450));
    this.$wrap.classList.add("atk-fade-out");
    Layer.hideTimeoutList.push(window.setTimeout(() => {
      this.$wrap.style.display = "none";
      this.$wrap.classList.remove("atk-fade-out");
    }, 200));
    this.$el.style.display = "none";
  }
  setMaskClickHide(enable) {
    this.maskClickHideEnable = enable;
  }
  disposeNow() {
    document.body.style.overflow = "";
    this.$el.remove();
    this.checkCleanLayer();
  }
  dispose() {
    this.hide();
    this.$el.remove();
    this.checkCleanLayer();
  }
  checkCleanLayer() {
    if (this.getWrapEl().querySelectorAll(".atk-layer-item").length === 0) {
      this.$wrap.style.display = "none";
    }
  }
}
function GetLayerWrap(ctx) {
  let $wrap = document.querySelector(`.atk-layer-wrap#ctx-${ctx.cid}`);
  if (!$wrap) {
    $wrap = createElement(`<div class="atk-layer-wrap" id="ctx-${ctx.cid}" style="display: none;"><div class="atk-layer-mask"></div></div>`);
    document.body.appendChild($wrap);
  }
  const $mask = $wrap.querySelector(".atk-layer-mask");
  return { $wrap, $mask };
}

class Dialog {
  $el;
  $content;
  $actions;
  constructor(contentEl) {
    this.$el = createElement(`<div class="atk-layer-dialog-wrap">
        <div class="atk-layer-dialog">
          <div class="atk-layer-dialog-content"></div>
          <div class="atk-layer-dialog-actions"></div>
        </div>
      </div>`);
    this.$actions = this.$el.querySelector(".atk-layer-dialog-actions");
    this.$content = this.$el.querySelector(".atk-layer-dialog-content");
    this.$content.appendChild(contentEl);
    return this;
  }
  setYes(handler) {
    const btn = createElement('<button data-action="confirm">\u786E\u5B9A</button>');
    btn.onclick = this.onBtnClick(handler);
    this.$actions.appendChild(btn);
    return this;
  }
  setNo(handler) {
    const btn = createElement('<button data-action="cancel">\u53D6\u6D88</button>');
    btn.onclick = this.onBtnClick(handler);
    this.$actions.appendChild(btn);
    return this;
  }
  onBtnClick(handler) {
    return (evt) => {
      const re = handler(evt.currentTarget, this);
      if (re === void 0 || re === true) {
        this.$el.remove();
      }
    };
  }
}

async function Fetch(ctx, input, init, timeout) {
  if (ctx.user.data.token) {
    const requestHeaders = new Headers();
    requestHeaders.set("Authorization", `Bearer ${ctx.user.data.token}`);
    init.headers = requestHeaders;
  }
  try {
    let resp;
    if (typeof timeout !== "number" && ctx.conf.reqTimeout === 0 || timeout === 0) {
      resp = await fetch(input, init);
    } else {
      resp = await timeoutPromise(timeout || ctx.conf.reqTimeout || 15e3, fetch(input, init));
    }
    if (!resp.ok && resp.status !== 401)
      throw new Error(`\u8BF7\u6C42\u54CD\u5E94 ${resp.status}`);
    let json = await resp.json();
    const recall = (resolve, reject) => {
      Fetch(ctx, input, init).then((d) => {
        resolve(d);
      }).catch((err) => {
        reject(err);
      });
    };
    if (json.data && json.data.need_captcha) {
      json = await new Promise((resolve, reject) => {
        ctx.trigger("checker-captcha", {
          imgData: json.data.img_data,
          onSuccess: () => {
            recall(resolve, reject);
          },
          onCancel: () => {
            reject(json);
          }
        });
      });
    } else if (json.data && json.data.need_login || resp.status === 401) {
      json = await new Promise((resolve, reject) => {
        ctx.trigger("checker-admin", {
          onSuccess: () => {
            recall(resolve, reject);
          },
          onCancel: () => {
            reject(json);
          }
        });
      });
    }
    if (!json.success)
      throw json;
    return json;
  } catch (err) {
    console.error(err);
    if (err instanceof TypeError)
      throw new Error(`\u7F51\u7EDC\u9519\u8BEF`);
    throw err;
  }
}
async function POST(ctx, url, data) {
  const init = {
    method: "POST"
  };
  if (data)
    init.body = ToFormData(data);
  const json = await Fetch(ctx, url, init);
  return json.data || {};
}
async function GET(ctx, url, data) {
  const json = await Fetch(ctx, url + (data ? `?${new URLSearchParams(data)}` : ""), {
    method: "GET"
  });
  return json.data || {};
}
function ToFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, String(object[key])));
  return formData;
}
function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("\u8BF7\u6C42\u8D85\u65F6"));
    }, ms);
    promise.then((res) => {
      clearTimeout(timeoutId);
      resolve(res);
    }, (err) => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
}

class Api {
  ctx;
  baseURL;
  constructor(ctx) {
    this.ctx = ctx;
    this.baseURL = ctx.conf.server;
  }
  get(offset, type, flatMode, paramsEditor) {
    const params = {
      page_key: this.ctx.conf.pageKey,
      site_name: this.ctx.conf.site || "",
      limit: this.ctx.conf.pagination?.pageSize || 15,
      offset
    };
    if (type)
      params.type = type;
    if (flatMode)
      params.flat_mode = flatMode;
    if (this.ctx.user.checkHasBasicUserInfo()) {
      params.name = this.ctx.user.data.nick;
      params.email = this.ctx.user.data.email;
    }
    if (paramsEditor)
      paramsEditor(params);
    return POST(this.ctx, `${this.baseURL}/get`, params);
  }
  async add(comment) {
    const params = {
      name: comment.nick,
      email: comment.email,
      link: comment.link,
      content: comment.content,
      rid: comment.rid,
      page_key: this.ctx.conf.pageKey,
      page_title: this.ctx.conf.pageTitle || ""
    };
    if (this.ctx.conf.site)
      params.site_name = this.ctx.conf.site;
    const data = await POST(this.ctx, `${this.baseURL}/add`, params);
    return data.comment;
  }
  async commentEdit(data) {
    const params = {
      ...data
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/comment-edit`, params);
    return d.comment;
  }
  commentDel(commentID, siteName) {
    const params = {
      id: String(commentID),
      site_name: siteName || ""
    };
    return POST(this.ctx, `${this.baseURL}/admin/comment-del`, params);
  }
  async login(name, email, password) {
    const params = {
      name,
      email,
      password
    };
    if (this.ctx.conf.site)
      params.site_name = this.ctx.conf.site;
    const data = await POST(this.ctx, `${this.baseURL}/login`, params);
    return data.token;
  }
  userGet(name, email) {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const params = {
      name,
      email,
      site_name: this.ctx.conf.site || ""
    };
    const req = Fetch(this.ctx, `${this.baseURL}/user-get`, {
      method: "POST",
      body: ToFormData(params),
      signal
    }).then((json) => ({
      user: json.data.user,
      is_login: json.data.is_login,
      unread: json.data.unread || [],
      unread_count: json.data.unread_count || 0
    }));
    return {
      req,
      abort: () => {
        ctrl.abort();
      }
    };
  }
  async pageGet(siteName, offset, limit) {
    const params = {
      site_name: siteName || "",
      offset: offset || 0,
      limit: limit || 15
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/page-get`, params);
    return d;
  }
  async pageEdit(data) {
    const params = {
      id: data.id,
      key: data.key,
      title: data.title,
      admin_only: data.admin_only,
      site_name: data.site_name || this.ctx.conf.site
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/page-edit`, params);
    return d.page;
  }
  pageDel(pageKey, siteName) {
    const params = {
      key: String(pageKey),
      site_name: siteName || ""
    };
    return POST(this.ctx, `${this.baseURL}/admin/page-del`, params);
  }
  async pageFetch(id) {
    const params = {
      id
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/page-fetch`, params);
    return d.page;
  }
  async siteGet() {
    const params = {};
    const d = await POST(this.ctx, `${this.baseURL}/admin/site-get`, params);
    return d.sites;
  }
  async siteAdd(name, urls) {
    const params = {
      name,
      urls
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/site-add`, params);
    return d.site;
  }
  async siteEdit(data) {
    const params = {
      id: data.id,
      name: data.name || "",
      urls: data.urls || ""
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/site-edit`, params);
    return d.site;
  }
  siteDel(id, delContent = false) {
    const params = { id, del_content: delContent };
    return POST(this.ctx, `${this.baseURL}/admin/site-del`, params);
  }
  async export() {
    const d = await Fetch(this.ctx, `${this.baseURL}/admin/export`, { method: "POST" }, 0);
    return d.data?.data || "";
  }
  async vote(targetID, type) {
    const params = {
      site_name: this.ctx.conf.site || "",
      target_id: targetID,
      type
    };
    if (this.ctx.user.checkHasBasicUserInfo()) {
      params.name = this.ctx.user.data.nick;
      params.email = this.ctx.user.data.email;
    }
    const data = await POST(this.ctx, `${this.baseURL}/vote`, params);
    return data;
  }
  markRead(notifyKey, readAll = false) {
    const params = {
      site_name: this.ctx.conf.site || "",
      notify_key: notifyKey
    };
    if (readAll) {
      delete params.notify_key;
      params.read_all = true;
      params.name = this.ctx.user.data.nick;
      params.email = this.ctx.user.data.email;
    }
    return POST(this.ctx, `${this.baseURL}/mark-read`, params);
  }
  async captchaGet() {
    const data = await GET(this.ctx, `${this.baseURL}/captcha/refresh`);
    return data.img_data || "";
  }
  async captchaCheck(value) {
    const data = await GET(this.ctx, `${this.baseURL}/captcha/check`, { value });
    return data.img_data || "";
  }
}

const CaptchaChecker = {
  request(that, inputVal) {
    return new Api(that.ctx).captchaCheck(inputVal);
  },
  body(that) {
    const elem = createElement(`<span><img class="atk-captcha-img" src="${that.submitCaptchaImgData || ""}" alt="\u9A8C\u8BC1\u7801">\u6572\u5165\u9A8C\u8BC1\u7801\u7EE7\u7EED\uFF1A</span>`);
    elem.querySelector(".atk-captcha-img").onclick = () => {
      const imgEl = elem.querySelector(".atk-captcha-img");
      new Api(that.ctx).captchaGet().then((imgData) => {
        imgEl.setAttribute("src", imgData);
      }).catch((err) => {
        console.error("\u9A8C\u8BC1\u7801\u83B7\u53D6\u5931\u8D25 ", err);
      });
    };
    return elem;
  },
  onSuccess(that, data, inputVal, formEl) {
    that.submitCaptchaVal = inputVal;
  },
  onError(that, err, inputVal, formEl) {
    formEl.querySelector(".atk-captcha-img").click();
  }
};

const AdminChecker = {
  inputType: "password",
  request(that, inputVal) {
    const data = {
      name: that.ctx.user.data.nick,
      email: that.ctx.user.data.email,
      password: inputVal
    };
    return new Api(that.ctx).login(data.name, data.email, data.password);
  },
  body() {
    return createElement("<span>\u6572\u5165\u5BC6\u7801\u6765\u9A8C\u8BC1\u7BA1\u7406\u5458\u8EAB\u4EFD\uFF1A</span>");
  },
  onSuccess(that, userToken, inputVal, formEl) {
    that.ctx.user.data.isAdmin = true;
    that.ctx.user.data.token = userToken;
    that.ctx.user.save();
    that.ctx.trigger("user-changed", that.ctx.user.data);
    that.ctx.trigger("list-reload");
  },
  onError(that, err, inputVal, formEl) {
  }
};

class CheckerLauncher {
  ctx;
  launched = [];
  submitCaptchaVal;
  submitCaptchaImgData;
  constructor(ctx) {
    this.ctx = ctx;
    this.initEventBind();
  }
  initEventBind() {
    this.ctx.on("checker-captcha", (conf) => {
      if (conf.imgData) {
        this.submitCaptchaImgData = conf.imgData;
      }
      this.fire(CaptchaChecker, conf);
    });
    this.ctx.on("checker-admin", (conf) => {
      this.fire(AdminChecker, conf);
    });
  }
  fire(checker, payload) {
    if (this.launched.includes(checker))
      return;
    this.launched.push(checker);
    const layer = new Layer(this.ctx, `checker-${new Date().getTime()}`);
    layer.setMaskClickHide(false);
    layer.show();
    const formEl = createElement();
    formEl.appendChild(checker.body(this));
    const input = createElement(`<input id="check" type="${checker.inputType || "text"}" autocomplete="off" required placeholder="">`);
    formEl.appendChild(input);
    setTimeout(() => input.focus(), 80);
    input.onkeyup = (evt) => {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        evt.preventDefault();
        layer.getEl().querySelector('button[data-action="confirm"]').click();
      }
    };
    let btnTextOrg;
    const dialog = new Dialog(formEl);
    dialog.setYes((btnEl) => {
      const inputVal = input.value.trim();
      if (!btnTextOrg)
        btnTextOrg = btnEl.innerText;
      const btnTextSet = (btnText) => {
        btnEl.innerText = btnText;
        btnEl.classList.add("error");
      };
      const btnTextRestore = () => {
        btnEl.innerText = btnTextOrg || "";
        btnEl.classList.remove("error");
      };
      btnEl.innerText = "\u52A0\u8F7D\u4E2D...";
      checker.request(this, inputVal).then((data) => {
        this.done(checker, layer);
        if (checker.onSuccess)
          checker.onSuccess(this, data, inputVal, formEl);
        if (payload.onSuccess)
          payload.onSuccess(inputVal, dialog.$el);
      }).catch((err) => {
        btnTextSet(String(err.msg || String(err)));
        if (checker.onError)
          checker.onError(this, err, inputVal, formEl);
        const tf = setTimeout(() => btnTextRestore(), 3e3);
        input.onfocus = () => {
          btnTextRestore();
          clearTimeout(tf);
        };
      });
      return false;
    });
    dialog.setNo(() => {
      this.done(checker, layer);
      if (payload.onCancel)
        payload.onCancel();
      return false;
    });
    layer.getEl().append(dialog.$el);
    if (payload.onMount)
      payload.onMount(dialog.$el);
  }
  done(checker, layer) {
    layer.disposeNow();
    this.launched = this.launched.filter((c) => c !== checker);
  }
}

var editor = '';

var EditorHTML = "<div class=\"atk-editor\">\n  <div class=\"atk-editor-header\">\n    <input name=\"nick\" placeholder=\"昵称\" class=\"atk-nick\" type=\"text\" required=\"required\">\n    <input name=\"email\" placeholder=\"邮箱\" class=\"atk-email\" type=\"email\" required=\"required\">\n    <input name=\"link\" placeholder=\"网址 (https://)\" class=\"atk-link\" type=\"url\">\n  </div>\n  <div class=\"atk-editor-textarea-wrap\">\n    <div class=\"atk-close-comment\" style=\"display: none;\"><span>仅管理员可评论</span></div>\n    <textarea id=\"atk-editor-textarea\" class=\"atk-editor-textarea\" placeholder=\"\"></textarea>\n  </div>\n  <div class=\"atk-editor-plug-wrap\" style=\"display: none;\"></div>\n  <div class=\"atk-editor-bottom\">\n    <div class=\"atk-editor-bottom-part atk-left atk-editor-plug-switcher-wrap\"></div>\n    <div class=\"atk-editor-bottom-part atk-right\">\n      <button type=\"button\" class=\"atk-send-btn\"></button>\n    </div>\n  </div>\n  <div class=\"atk-editor-notify-wrap\"></div>\n</div>\n";

var emoticonsPlug = '';

class EditorPlug {
  editor;
  ctx;
  constructor(editor) {
    this.editor = editor;
    this.ctx = editor.ctx;
  }
}

class EmoticonsPlug extends EditorPlug {
  constructor(editor) {
    super(editor);
    this.editor = editor;
    this.emoticons = this.ctx.conf.emoticons;
    this.initEl();
  }
  $el;
  emoticons;
  listWrapEl;
  typesEl;
  initEl() {
    this.$el = createElement(`<div class="atk-editor-plug-emoticons"></div>`);
    this.listWrapEl = createElement(`<div class="atk-emoticons-list-wrap"></div>`);
    this.$el.append(this.listWrapEl);
    Object.entries(this.emoticons).forEach(([key, item]) => {
      const emoticonsEl = createElement(`<div class="atk-emoticons-list" style="display: none;"></div>`);
      this.listWrapEl.append(emoticonsEl);
      emoticonsEl.setAttribute("data-key", key);
      emoticonsEl.setAttribute("data-input-type", item.inputType);
      Object.entries(item.container).forEach(([name, content]) => {
        const itemEl = createElement(`<span class="atk-emoticons-item"></span>`);
        emoticonsEl.append(itemEl);
        itemEl.setAttribute("title", name);
        itemEl.setAttribute("data-content", content);
        if (item.inputType === "image") {
          const imgEl = document.createElement("img");
          imgEl.src = content;
          imgEl.alt = name;
          itemEl.append(imgEl);
        } else {
          itemEl.innerText = content;
        }
      });
    });
    this.typesEl = createElement(`<div class="atk-emoticons-types"></div>`);
    this.$el.append(this.typesEl);
    Object.entries(this.emoticons).forEach(([key, item]) => {
      const itemEl = createElement("<span />");
      this.typesEl.append(itemEl);
      itemEl.setAttribute("data-key", key);
      itemEl.innerText = key;
    });
    this.typesEl.querySelectorAll("span").forEach((btn) => {
      btn.addEventListener("click", (evt) => {
        const btnEl = evt.currentTarget;
        const key = btnEl.getAttribute("data-key");
        if (key)
          this.openType(key);
      });
    });
    if (Object.keys(this.emoticons).length > 0)
      this.openType(Object.keys(this.emoticons)[0]);
    this.listWrapEl.querySelectorAll(".atk-emoticons-item").forEach((item) => {
      item.onclick = (evt) => {
        const elem = evt.currentTarget;
        const inputType = elem.closest(".atk-emoticons-list").getAttribute("data-input-type");
        const title = elem.getAttribute("title");
        const content = elem.getAttribute("data-content");
        if (inputType === "image") {
          this.editor.insertContent(`:[${title}]`);
        } else {
          this.editor.insertContent(content || "");
        }
      };
    });
  }
  openType(key) {
    Array.from(this.listWrapEl.children).forEach((item) => {
      const el = item;
      if (el.getAttribute("data-key") !== key) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
    this.typesEl.querySelectorAll("span.active").forEach((item) => item.classList.remove("active"));
    this.typesEl.querySelector(`span[data-key="${key}"]`)?.classList.add("active");
    this.changeListHeight();
  }
  getName() {
    return "emoticons";
  }
  getBtnHtml() {
    return "\u8868\u60C5";
  }
  getEl() {
    return this.$el;
  }
  changeListHeight() {
  }
  onShow() {
    setTimeout(() => {
      this.changeListHeight();
    }, 30);
  }
  onHide() {
    this.$el.parentElement.style.height = "";
  }
  transEmoticonImageText(text) {
    Object.entries(this.emoticons).forEach(([grpName, grp]) => {
      if (grp.inputType !== "image")
        return;
      Object.entries(grp.container).forEach(([name, imgSrc]) => {
        text = text.split(`:[${name}]`).join(`![${name}](${imgSrc}) `);
      });
    });
    return text;
  }
}

var previewPlug = '';

class PreviewPlug extends EditorPlug {
  $el;
  binded = false;
  constructor(editor) {
    super(editor);
    this.initEl();
  }
  initEl() {
    this.$el = createElement('<div class="atk-editor-plug-preview"></div>');
    this.binded = false;
  }
  getName() {
    return "preview";
  }
  getBtnHtml() {
    return '\u9884\u89C8 <i title="Markdown is supported"><svg class="markdown" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg></i>';
  }
  getEl() {
    return this.$el;
  }
  onShow() {
    this.updateContent();
    if (!this.binded) {
      const event = () => {
        this.updateContent();
      };
      this.editor.$textarea.addEventListener("input", event);
      this.editor.$textarea.addEventListener("change", event);
      this.binded = true;
    }
  }
  onHide() {
  }
  updateContent() {
    if (this.$el.style.display !== "none") {
      this.$el.innerHTML = this.editor.getContentMarked();
    }
  }
}

class Editor extends Component {
  LOADABLE_PLUG_LIST = [EmoticonsPlug, PreviewPlug];
  plugList = {};
  $header;
  $textareaWrap;
  $textarea;
  $closeComment;
  $plugWrap;
  $bottom;
  $bottomPartLeft;
  $plugSwitcherWrap;
  $bottomPartRight;
  $submitBtn;
  $notifyWrap;
  replyComment = null;
  $sendReply = null;
  get user() {
    return this.ctx.user;
  }
  constructor(ctx) {
    super(ctx);
    this.$el = createElement(EditorHTML);
    this.$header = this.$el.querySelector(".atk-editor-header");
    this.$textareaWrap = this.$el.querySelector(".atk-editor-textarea-wrap");
    this.$textarea = this.$el.querySelector(".atk-editor-textarea");
    this.$closeComment = this.$el.querySelector(".atk-close-comment");
    this.$plugWrap = this.$el.querySelector(".atk-editor-plug-wrap");
    this.$bottom = this.$el.querySelector(".atk-editor-bottom");
    this.$bottomPartLeft = this.$el.querySelector(".atk-editor-bottom-part.atk-left");
    this.$plugSwitcherWrap = this.$el.querySelector(".atk-editor-plug-switcher-wrap");
    this.$bottomPartRight = this.$el.querySelector(".atk-editor-bottom-part.atk-right");
    this.$submitBtn = this.$el.querySelector(".atk-send-btn");
    this.$notifyWrap = this.$el.querySelector(".atk-editor-notify-wrap");
    this.initLocalStorage();
    this.initHeader();
    this.initTextarea();
    this.initEditorPlug();
    this.initBottomPart();
    this.ctx.on("editor-open", () => this.open());
    this.ctx.on("editor-close", () => this.close());
    this.ctx.on("editor-reply", (commentData) => this.setReply(commentData));
    this.ctx.on("editor-show-loading", () => showLoading(this.$el));
    this.ctx.on("editor-hide-loading", () => hideLoading(this.$el));
    this.ctx.on("editor-notify", (f) => this.showNotify(f.msg, f.type));
  }
  initLocalStorage() {
    const localContent = window.localStorage.getItem("ArtalkContent") || "";
    if (localContent.trim() !== "") {
      this.showNotify("\u5DF2\u81EA\u52A8\u6062\u590D", "i");
      this.setContent(localContent);
    }
    this.$textarea.addEventListener("input", () => {
      this.saveContent();
    });
  }
  initHeader() {
    Object.keys(this.user.data).forEach((field) => {
      const inputEl = this.getInputEl(field);
      if (inputEl && inputEl instanceof HTMLInputElement) {
        inputEl.value = this.user.data[field] || "";
        inputEl.addEventListener("input", () => this.onHeaderInputChanged(field, inputEl));
      }
    });
  }
  getInputEl(field) {
    const inputEl = this.$header.querySelector(`[name="${field}"]`);
    return inputEl;
  }
  queryUserInfo = {
    timeout: null,
    abortFunc: null
  };
  onHeaderInputChanged(field, inputEl) {
    this.user.data[field] = inputEl.value.trim();
    if (field === "nick" || field === "email") {
      this.user.data.token = "";
      this.user.data.isAdmin = false;
      if (this.queryUserInfo.timeout !== null)
        window.clearTimeout(this.queryUserInfo.timeout);
      if (this.queryUserInfo.abortFunc !== null)
        this.queryUserInfo.abortFunc();
      this.queryUserInfo.timeout = window.setTimeout(() => {
        this.queryUserInfo.timeout = null;
        const { req, abort } = new Api(this.ctx).userGet(this.user.data.nick, this.user.data.email);
        this.queryUserInfo.abortFunc = abort;
        req.then((data) => {
          if (!data.is_login) {
            this.user.data.token = "";
            this.user.data.isAdmin = false;
          }
          this.ctx.trigger("unread-update", { notifies: data.unread });
          if (this.user.checkHasBasicUserInfo() && !data.is_login && data.user && data.user.is_admin) {
            this.showLoginDialog();
          }
          if (data.user && data.user.link) {
            this.user.data.link = data.user.link;
            this.getInputEl("link").value = data.user.link;
          }
        }).finally(() => {
          this.queryUserInfo.abortFunc = null;
        });
      }, 400);
    }
    this.saveUser();
  }
  showLoginDialog() {
    this.ctx.trigger("checker-admin", {
      onSuccess: () => {
      }
    });
  }
  saveUser() {
    this.user.save();
    this.ctx.trigger("user-changed", this.ctx.user.data);
  }
  saveContent() {
    window.localStorage.setItem("ArtalkContent", this.getContentOriginal().trim());
  }
  initTextarea() {
    this.$textarea.placeholder = this.ctx.conf.placeholder || "";
    this.$textarea.addEventListener("keydown", (e) => {
      const keyCode = e.keyCode || e.which;
      if (keyCode === 9) {
        e.preventDefault();
        this.insertContent("	");
      }
    });
    this.$textarea.addEventListener("input", (evt) => {
      this.adjustTextareaHeight();
    });
  }
  adjustTextareaHeight() {
    const diff = this.$textarea.offsetHeight - this.$textarea.clientHeight;
    this.$textarea.style.height = "0px";
    this.$textarea.style.height = `${this.$textarea.scrollHeight + diff}px`;
  }
  openedPlugName = null;
  initEditorPlug() {
    this.plugList = {};
    this.$plugWrap.innerHTML = "";
    this.$plugWrap.style.display = "none";
    this.openedPlugName = null;
    this.$plugSwitcherWrap.innerHTML = "";
    this.LOADABLE_PLUG_LIST.forEach((PlugObj) => {
      const plug = new PlugObj(this);
      this.plugList[plug.getName()] = plug;
      const btnElem = createElement(`<span class="atk-editor-action atk-editor-plug-switcher">${plug.getBtnHtml()}</span>`);
      this.$plugSwitcherWrap.appendChild(btnElem);
      btnElem.addEventListener("click", () => {
        this.$plugSwitcherWrap.querySelectorAll(".active").forEach((item) => item.classList.remove("active"));
        if (plug.getName() === this.openedPlugName) {
          plug.onHide();
          this.$plugWrap.style.display = "none";
          this.openedPlugName = null;
          return;
        }
        if (this.$plugWrap.querySelector(`[data-plug-name="${plug.getName()}"]`) === null) {
          const plugEl = plug.getEl();
          plugEl.setAttribute("data-plug-name", plug.getName());
          plugEl.style.display = "none";
          this.$plugWrap.appendChild(plugEl);
        }
        Array.from(this.$plugWrap.children).forEach((plugItemEl) => {
          const plugItemName = plugItemEl.getAttribute("data-plug-name");
          if (plugItemName === plug.getName()) {
            plugItemEl.style.display = "";
            this.plugList[plugItemName].onShow();
          } else {
            plugItemEl.style.display = "none";
            this.plugList[plugItemName].onHide();
          }
        });
        this.$plugWrap.style.display = "";
        this.openedPlugName = plug.getName();
        btnElem.classList.add("active");
      });
    });
  }
  closePlug() {
    this.$plugWrap.innerHTML = "";
    this.$plugWrap.style.display = "none";
    this.openedPlugName = null;
  }
  insertContent(val) {
    if (document.selection) {
      this.$textarea.focus();
      document.selection.createRange().text = val;
      this.$textarea.focus();
    } else if (this.$textarea.selectionStart || this.$textarea.selectionStart === 0) {
      const sStart = this.$textarea.selectionStart;
      const sEnd = this.$textarea.selectionEnd;
      const sT = this.$textarea.scrollTop;
      this.setContent(this.$textarea.value.substring(0, sStart) + val + this.$textarea.value.substring(sEnd, this.$textarea.value.length));
      this.$textarea.focus();
      this.$textarea.selectionStart = sStart + val.length;
      this.$textarea.selectionEnd = sStart + val.length;
      this.$textarea.scrollTop = sT;
    } else {
      this.$textarea.focus();
      this.$textarea.value += val;
    }
  }
  setContent(val) {
    this.$textarea.value = val;
    this.saveContent();
    if (!!this.plugList && !!this.plugList.preview) {
      this.plugList.preview.updateContent();
    }
    this.adjustTextareaHeight();
  }
  clearEditor() {
    this.setContent("");
    this.cancelReply();
  }
  getContent() {
    let content = this.getContentOriginal();
    if (this.plugList && this.plugList.emoticons) {
      const emoticonsPlug = this.plugList.emoticons;
      content = emoticonsPlug.transEmoticonImageText(content);
    }
    return content;
  }
  getContentOriginal() {
    return this.$textarea.value || "";
  }
  getContentMarked() {
    return marked(this.ctx, this.getContent());
  }
  initBottomPart() {
    this.initReply();
    this.initSubmit();
  }
  initReply() {
    this.replyComment = null;
    this.$sendReply = null;
  }
  setReply(commentData) {
    if (this.replyComment !== null) {
      this.cancelReply();
    }
    if (this.$sendReply === null) {
      this.$sendReply = createElement('<div class="atk-send-reply-wrap"><div class="atk-send-reply">\u56DE\u590D <span class="atk-text"></span><span class="atk-cancel" title="\u53D6\u6D88 AT">\xD7</span></div></div>');
      this.$sendReply.querySelector(".atk-text").innerText = `@${commentData.nick}`;
      this.$sendReply.addEventListener("click", () => {
        this.cancelReply();
      });
      this.$textareaWrap.prepend(this.$sendReply);
    }
    this.replyComment = commentData;
    scrollIntoView(this.$el);
    this.$textarea.focus();
  }
  cancelReply() {
    if (this.$sendReply !== null) {
      this.$sendReply.remove();
      this.$sendReply = null;
    }
    this.replyComment = null;
  }
  initSubmit() {
    this.$submitBtn.innerText = this.ctx.conf.sendBtn || "Send";
    this.$submitBtn.addEventListener("click", (evt) => {
      evt.currentTarget;
      this.submit();
    });
  }
  async submit() {
    if (this.getContent().trim() === "") {
      this.$textarea.focus();
      return;
    }
    this.ctx.trigger("editor-submit");
    showLoading(this.$el);
    try {
      const nComment = await new Api(this.ctx).add({
        content: this.getContent(),
        nick: this.user.data.nick,
        email: this.user.data.email,
        link: this.user.data.link,
        rid: this.replyComment === null ? 0 : this.replyComment.id
      });
      this.ctx.trigger("list-insert", nComment);
      this.clearEditor();
      this.ctx.trigger("editor-submitted");
    } catch (err) {
      console.error(err);
      this.showNotify(`\u8BC4\u8BBA\u5931\u8D25\uFF0C${err.msg || String(err)}`, "e");
    } finally {
      hideLoading(this.$el);
    }
  }
  showNotify(msg, type) {
    showNotify(this.$notifyWrap, msg, type);
  }
  close() {
    this.$closeComment.style.display = "";
    if (!this.user.data.isAdmin) {
      this.$textarea.style.display = "none";
      this.closePlug();
      this.$bottom.style.display = "none";
    } else {
      this.$textarea.style.display = "";
      this.$bottom.style.display = "";
    }
  }
  open() {
    this.$closeComment.style.display = "none";
    this.$textarea.style.display = "";
    this.$bottom.style.display = "";
  }
}

var list = '';

var ListHTML = "<div class=\"atk-list\">\n  <div class=\"atk-list-header\">\n    <div class=\"atk-comment-count\">\n      <span class=\"atk-comment-count-num\">0</span>\n      条评论\n    </div>\n    <div class=\"atk-right-action\">\n      <span data-action=\"admin-close-comment\" class=\"atk-hide\" atk-only-admin-show>关闭评论</span>\n      <span data-action=\"open-sidebar\" class=\"atk-hide atk-on\">\n        <span class=\"atk-unread-badge\" style=\"display: none;\"></span>\n        通知中心\n      </span>\n    </div>\n  </div>\n  <div class=\"atk-list-body\"></div>\n  <div class=\"atk-list-footer\">\n    <div class=\"atk-copyright\"></div>\n  </div>\n</div>\n";

var comment = '';

/* eslint-disable */
var win = window || {};
var nav = navigator || {};
function Detect (userAgent) {
  var u = userAgent || nav.userAgent;
  var _this = this;

  var match = {
    // 内核
    Trident: u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
    Presto: u.indexOf('Presto') > -1,
    WebKit: u.indexOf('AppleWebKit') > -1,
    Gecko: u.indexOf('Gecko/') > -1,
    // 浏览器
    Safari: u.indexOf('Safari') > -1,
    Chrome: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
    IE: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
    Edge: u.indexOf('Edge') > -1,
    Firefox: u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
    'Firefox Focus': u.indexOf('Focus') > -1,
    Chromium: u.indexOf('Chromium') > -1,
    Opera: u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
    Vivaldi: u.indexOf('Vivaldi') > -1,
    Yandex: u.indexOf('YaBrowser') > -1,
    Kindle: u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
    360: u.indexOf('360EE') > -1 || u.indexOf('360SE') > -1,
    UC: u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
    QQBrowser: u.indexOf('QQBrowser') > -1,
    QQ: u.indexOf('QQ/') > -1,
    Baidu: u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
    Maxthon: u.indexOf('Maxthon') > -1,
    Sogou: u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
    LBBROWSER: u.indexOf('LBBROWSER') > -1,
    '2345Explorer': u.indexOf('2345Explorer') > -1,
    TheWorld: u.indexOf('TheWorld') > -1,
    XiaoMi: u.indexOf('MiuiBrowser') > -1,
    Quark: u.indexOf('Quark') > -1,
    Qiyu: u.indexOf('Qiyu') > -1,
    Wechat: u.indexOf('MicroMessenger') > -1,
    Taobao: u.indexOf('AliApp(TB') > -1,
    Alipay: u.indexOf('AliApp(AP') > -1,
    Weibo: u.indexOf('Weibo') > -1,
    Douban: u.indexOf('com.douban.frodo') > -1,
    Suning: u.indexOf('SNEBUY-APP') > -1,
    iQiYi: u.indexOf('IqiyiApp') > -1,
    // 系统或平台
    Windows: u.indexOf('Windows') > -1,
    Linux: u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
    'Mac OS': u.indexOf('Macintosh') > -1,
    Android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
    Ubuntu: u.indexOf('Ubuntu') > -1,
    FreeBSD: u.indexOf('FreeBSD') > -1,
    Debian: u.indexOf('Debian') > -1,
    'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
    BlackBerry: u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
    MeeGo: u.indexOf('MeeGo') > -1,
    Symbian: u.indexOf('Symbian') > -1,
    iOS: u.indexOf('like Mac OS X') > -1,
    'Chrome OS': u.indexOf('CrOS') > -1,
    WebOS: u.indexOf('hpwOS') > -1,
    // 设备
    Mobile: u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
    Tablet: u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1
  };
  // 修正
  if (match.Mobile) {
    match.Mobile = !(u.indexOf('iPad') > -1);
  } else if (win.showModalDialog && win.chrome) {
    match['360'] = true;
  }
  // 基本信息
  var hash = {
    engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
    browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
    os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
    device: ['Mobile', 'Tablet']
  };
  _this.device = 'PC';
  _this.language = (function () {
    var g = (nav.browserLanguage || nav.language);
    var arr = g.split('-');
    if (arr[1]) {
      arr[1] = arr[1].toUpperCase();
    }
    return arr.join('_')
  })();
  for (var s in hash) {
    for (var i = 0; i < hash[s].length; i++) {
      var value = hash[s][i];
      if (match[value]) {
        _this[s] = value;
      }
    }
  }
  // 系统版本信息
  var osVersion = {
    Windows: function () {
      var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
      var hash = {
        6.4: '10',
        6.3: '8.1',
        6.2: '8',
        6.1: '7',
        '6.0': 'Vista',
        5.2: 'XP',
        5.1: 'XP',
        '5.0': '2000'
      };
      return hash[v] || v
    },
    Android: function () {
      return u.replace(/^.*Android ([\d.]+);.*$/, '$1')
    },
    iOS: function () {
      return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.')
    },
    Debian: function () {
      return u.replace(/^.*Debian\/([\d.]+).*$/, '$1')
    },
    'Windows Phone': function () {
      return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2')
    },
    'Mac OS': function () {
      return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.')
    },
    WebOS: function () {
      return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1')
    }
  };
  _this.osVersion = '';
  if (osVersion[_this.os]) {
    _this.osVersion = osVersion[_this.os]();
    if (_this.osVersion === u) {
      _this.osVersion = '';
    }
  }
  // 浏览器版本信息
  var version = {
    Safari: function () {
      return u.replace(/^.*Version\/([\d.]+).*$/, '$1')
    },
    Chrome: function () {
      return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1')
    },
    IE: function () {
      return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1')
    },
    Edge: function () {
      return u.replace(/^.*Edge\/([\d.]+).*$/, '$1')
    },
    Firefox: function () {
      return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1')
    },
    'Firefox Focus': function () {
      return u.replace(/^.*Focus\/([\d.]+).*$/, '$1')
    },
    Chromium: function () {
      return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1')
    },
    Opera: function () {
      return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1')
    },
    Vivaldi: function () {
      return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1')
    },
    Yandex: function () {
      return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1')
    },
    Kindle: function () {
      return u.replace(/^.*Version\/([\d.]+).*$/, '$1')
    },
    Maxthon: function () {
      return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1')
    },
    QQBrowser: function () {
      return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1')
    },
    QQ: function () {
      return u.replace(/^.*QQ\/([\d.]+).*$/, '$1')
    },
    Baidu: function () {
      return u.replace(/^.*BIDUBrowser[\s/]([\d.]+).*$/, '$1')
    },
    UC: function () {
      return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1')
    },
    Sogou: function () {
      return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1')
    },
    '2345Explorer': function () {
      return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1')
    },
    TheWorld: function () {
      return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1')
    },
    XiaoMi: function () {
      return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1')
    },
    Quark: function () {
      return u.replace(/^.*Quark\/([\d.]+).*$/, '$1')
    },
    Qiyu: function () {
      return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1')
    },
    Wechat: function () {
      return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1')
    },
    Taobao: function () {
      return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1')
    },
    Alipay: function () {
      return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1')
    },
    Weibo: function () {
      return u.replace(/^.*weibo__([\d.]+).*$/, '$1')
    },
    Douban: function () {
      return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1')
    },
    Suning: function () {
      return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1')
    },
    iQiYi: function () {
      return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1')
    }
  };
  _this.version = '';
  if (version[_this.browser]) {
    _this.version = version[_this.browser]();
    if (_this.version === u) {
      _this.version = '';
    }
  }

  // 简化版本号
  /* if (_this.osVersion.indexOf('.')) {
    _this.osVersion = _this.osVersion.substring(0, _this.osVersion.indexOf('.'))
  } */
  if (_this.version.indexOf('.')) {
    _this.version = _this.version.substring(0, _this.version.indexOf('.'));
  }

  // 修正
  if (_this.browser === 'Edge') {
    _this.engine = 'EdgeHTML';
  } else if (_this.browser === 'Chrome' && parseInt(_this.version) > 27) {
    _this.engine = 'Blink';
  } else if (_this.browser === 'Opera' && parseInt(_this.version) > 12) {
    _this.engine = 'Blink';
  } else if (_this.browser === 'Yandex') {
    _this.engine = 'Blink';
  } else if (_this.browser === undefined) {
    _this.browser = 'Unknow App';
  }
}
function detectFactory (u) {
  return new Detect(u)
}

var CommentHTML = "<div class=\"atk-comment-wrap\" data-comment-id=\"\">\n  <div class=\"atk-comment\">\n\n    <div class=\"atk-avatar\"></div>\n\n    <div class=\"atk-comment-main\">\n\n      <div class=\"atk-header\">\n        <span class=\"atk-nick\"></span>\n        <span class=\"atk-badge\"></span>\n        <span class=\"atk-date\"></span>\n      </div>\n\n      <div class=\"atk-body\">\n        <div class=\"atk-content\"></div>\n      </div>\n\n      <div class=\"atk-footer\">\n        <div class=\"atk-comment-actions\"></div>\n      </div>\n\n    </div>\n\n  </div>\n</div>\n";

class ActionBtn {
  conf;
  $el;
  isLoading = false;
  msgRecTimer;
  msgRecTimerFunc;
  get isMessaging() {
    return !!this.msgRecTimer;
  }
  isConfirming = false;
  confirmRecTimer;
  constructor(conf) {
    this.$el = createElement(`<span class="atk-common-action-btn"></span>`);
    this.conf = typeof conf !== "object" ? { text: conf } : conf;
    this.$el.innerText = this.getText();
    if (this.conf.adminOnly)
      this.$el.setAttribute("atk-only-admin-show", "");
  }
  appendTo(dom) {
    dom.append(this.$el);
    return this;
  }
  getText() {
    return typeof this.conf.text === "string" ? this.conf.text : this.conf.text();
  }
  setClick(func) {
    this.$el.onclick = (e) => {
      e.stopPropagation();
      if (this.isLoading) {
        return;
      }
      if (this.conf.confirm && !this.isMessaging) {
        const confirmRestore = () => {
          this.isConfirming = false;
          this.$el.classList.remove("atk-btn-confirm");
          this.$el.innerText = this.getText();
        };
        if (!this.isConfirming) {
          this.isConfirming = true;
          this.$el.classList.add("atk-btn-confirm");
          this.$el.innerText = this.conf.confirmText || "\u786E\u8BA4\u64CD\u4F5C";
          this.confirmRecTimer = window.setTimeout(() => confirmRestore(), 5e3);
          return;
        }
        if (this.confirmRecTimer)
          window.clearTimeout(this.confirmRecTimer);
        confirmRestore();
      }
      if (this.msgRecTimer) {
        this.fireMsgRecTimer();
        this.clearMsgRecTimer();
        return;
      }
      func();
    };
  }
  updateText(text) {
    if (text)
      this.conf.text = text;
    this.setLoading(false);
    this.$el.innerText = this.getText();
  }
  setLoading(value = true, loadingText) {
    if (this.isLoading === value)
      return;
    this.isLoading = value;
    if (value) {
      this.$el.classList.add("atk-btn-loading");
      this.$el.innerText = loadingText || "\u52A0\u8F7D\u4E2D...";
    } else {
      this.$el.classList.remove("atk-btn-loading");
      this.$el.innerText = this.getText();
    }
  }
  setError(text) {
    this.setMsg(text, "atk-btn-error");
  }
  setWarn(text) {
    this.setMsg(text, "atk-btn-warn");
  }
  setSuccess(text) {
    this.setMsg(text, "atk-btn-success");
  }
  setMsg(text, className, duringTime, after) {
    this.setLoading(false);
    if (className)
      this.$el.classList.add(className);
    this.$el.innerText = text;
    this.setMsgRecTimer(() => {
      this.$el.innerText = this.getText();
      if (className)
        this.$el.classList.remove(className);
      if (after)
        after();
    }, duringTime || 2500);
  }
  setMsgRecTimer(func, duringTime) {
    this.fireMsgRecTimer();
    this.clearMsgRecTimer();
    this.msgRecTimerFunc = func;
    this.msgRecTimer = window.setTimeout(() => {
      func();
      this.clearMsgRecTimer();
    }, duringTime);
  }
  fireMsgRecTimer() {
    if (this.msgRecTimerFunc)
      this.msgRecTimerFunc();
  }
  clearMsgRecTimer() {
    if (this.msgRecTimer)
      window.clearTimeout(this.msgRecTimer);
    this.msgRecTimer = void 0;
    this.msgRecTimerFunc = void 0;
  }
}

class Comment extends Component {
  data;
  $main;
  $header;
  $body;
  $content;
  $children;
  $actions;
  voteBtnUp;
  voteBtnDown;
  parent;
  nestedNum;
  maxNestingNum;
  children = [];
  replyTo;
  $replyTo;
  afterRender;
  unread = false;
  openable = false;
  openURL;
  openEvt;
  constructor(ctx, data) {
    super(ctx);
    this.maxNestingNum = ctx.conf.maxNesting || 3;
    this.data = { ...data };
    this.data.date = this.data.date.replace(/-/g, "/");
    this.parent = null;
    this.nestedNum = 1;
  }
  render() {
    this.$el = createElement(CommentHTML);
    this.$main = this.$el.querySelector(".atk-comment-main");
    this.$header = this.$el.querySelector(".atk-header");
    this.$body = this.$el.querySelector(".atk-body");
    this.$content = this.$body.querySelector(".atk-content");
    this.$actions = this.$el.querySelector(".atk-comment-actions");
    this.$children = null;
    this.$el.setAttribute("data-comment-id", `${this.data.id}`);
    this.renderCheckUnread();
    this.renderCheckClickable();
    this.renderAvatar();
    this.renderHeader();
    this.renderContent();
    this.renderReplyTo();
    this.renderPending();
    this.renderActionBtn();
    if (this.afterRender)
      this.afterRender();
    return this.$el;
  }
  renderCheckUnread() {
    if (this.unread)
      this.$el.classList.add("atk-unread");
    else
      this.$el.classList.remove("atk-unread");
  }
  renderCheckClickable() {
    if (this.openable) {
      this.$el.classList.add("atk-openable");
    } else {
      this.$el.classList.remove("atk-openable");
    }
    this.$el.addEventListener("click", (evt) => {
      if (this.openable && this.openURL) {
        evt.preventDefault();
        window.open(this.openURL);
      }
      if (this.openEvt)
        this.openEvt();
    });
  }
  renderAvatar() {
    const $avatar = this.$el.querySelector(".atk-avatar");
    const $avatarImg = createElement("<img />");
    $avatarImg.src = this.getGravatarUrl();
    if (this.data.link) {
      const $avatarA = createElement('<a target="_blank"></a>');
      $avatarA.href = this.data.link;
      $avatarA.append($avatarImg);
      $avatar.append($avatarA);
    } else {
      $avatar.append($avatarImg);
    }
  }
  renderHeader() {
    const $nick = this.$el.querySelector(".atk-nick");
    if (this.data.link) {
      const $nickA = createElement('<a target="_blank"></a>');
      $nickA.innerText = this.data.nick;
      $nickA.href = this.data.link;
      $nick.append($nickA);
    } else {
      $nick.innerText = this.data.nick;
    }
    const $badge = this.$el.querySelector(".atk-badge");
    if (this.data.badge_name) {
      $badge.innerText = this.data.badge_name;
      if (this.data.badge_color)
        $badge.style.backgroundColor = this.data.badge_color;
    } else {
      $badge.remove();
    }
    const $date = this.$el.querySelector(".atk-date");
    $date.innerText = this.getDateFormatted();
    $date.setAttribute("data-atk-comment-date", String(+new Date(this.data.date)));
    if (this.conf.uaBadge) {
      const $uaWrap = createElement(`<span class="atk-ua-wrap"></span>`);
      const $uaBrowser = createElement(`<span class="atk-ua ua-browser"></span>`);
      const $usOS = createElement(`<span class="atk-ua ua-os"></span>`);
      $uaBrowser.innerText = this.getUserUaBrowser();
      $usOS.innerText = this.getUserUaOS();
      $uaWrap.append($uaBrowser);
      $uaWrap.append($usOS);
      this.$header.append($uaWrap);
    }
  }
  renderContent() {
    if (!this.data.is_collapsed) {
      this.$content.innerHTML = this.getContentMarked();
      return;
    }
    this.$content.classList.add("atk-hide", "atk-type-collapsed");
    const collapsedInfoEl = createElement(`
      <div class="atk-collapsed">
        <span class="atk-text">\u8BE5\u8BC4\u8BBA\u5DF2\u88AB\u7CFB\u7EDF\u6216\u7BA1\u7406\u5458\u6298\u53E0</span>
        <span class="atk-show-btn">\u67E5\u770B\u5185\u5BB9</span>
      </div>`);
    this.$body.insertAdjacentElement("beforeend", collapsedInfoEl);
    const contentShowBtn = collapsedInfoEl.querySelector(".atk-show-btn");
    contentShowBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.$content.classList.contains("atk-hide")) {
        this.$content.innerHTML = this.getContentMarked();
        this.$content.classList.remove("atk-hide");
        playFadeInAnim(this.$content);
        contentShowBtn.innerHTML = "\u6536\u8D77\u5185\u5BB9";
      } else {
        this.$content.innerHTML = "";
        this.$content.classList.add("atk-hide");
        contentShowBtn.innerHTML = "\u67E5\u770B\u5185\u5BB9";
      }
    });
  }
  renderReplyTo() {
    if (!this.replyTo)
      return;
    this.$replyTo = createElement(`
      <div class="atk-reply-to">
        <div class="atk-meta">\u56DE\u590D <span class="atk-nick"></span>:</div>
        <div class="atk-content"></div>
      </div>`);
    this.$replyTo.querySelector(".atk-nick").innerText = `@${this.replyTo.nick}`;
    let replyContent = marked(this.ctx, this.replyTo.content);
    if (this.replyTo.is_collapsed)
      replyContent = "[\u5DF2\u6298\u53E0]";
    this.$replyTo.querySelector(".atk-content").innerHTML = replyContent;
    this.$body.prepend(this.$replyTo);
  }
  renderPending() {
    if (!this.data.is_pending)
      return;
    const pendingEl = createElement(`<div class="atk-pending">\u5BA1\u6838\u4E2D\uFF0C\u4EC5\u672C\u4EBA\u53EF\u89C1\u3002</div>`);
    this.$body.prepend(pendingEl);
  }
  renderActionBtn() {
    if (this.ctx.conf.vote) {
      this.voteBtnUp = new ActionBtn(() => `\u8D5E\u540C (${this.data.vote_up || 0})`).appendTo(this.$actions);
      this.voteBtnUp.setClick(() => {
        this.vote("up");
      });
      if (this.ctx.conf.voteDown) {
        this.voteBtnDown = new ActionBtn(() => `\u53CD\u5BF9 (${this.data.vote_down || 0})`).appendTo(this.$actions);
        this.voteBtnDown.setClick(() => {
          this.vote("down");
        });
      }
    }
    if (this.data.is_allow_reply) {
      const replyBtn = createElement(`<span data-atk-action="comment-reply">\u56DE\u590D</span>`);
      this.$actions.append(replyBtn);
      replyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.ctx.trigger("editor-reply", this.data);
      });
    }
    const collapseBtn = new ActionBtn({
      text: () => this.data.is_collapsed ? "\u53D6\u6D88\u6298\u53E0" : "\u6298\u53E0",
      adminOnly: true
    });
    collapseBtn.appendTo(this.$actions);
    collapseBtn.setClick(() => {
      this.adminEdit("collapsed", collapseBtn);
    });
    const pendingBtn = new ActionBtn({
      text: () => this.data.is_pending ? "\u5F85\u5BA1" : "\u5DF2\u5BA1",
      adminOnly: true
    });
    pendingBtn.appendTo(this.$actions);
    pendingBtn.setClick(() => {
      this.adminEdit("pending", pendingBtn);
    });
    const delBtn = new ActionBtn({
      text: "\u5220\u9664",
      confirm: true,
      confirmText: "\u786E\u8BA4\u5220\u9664",
      adminOnly: true
    });
    delBtn.appendTo(this.$actions);
    delBtn.setClick(() => {
      this.adminDelete(delBtn);
    });
  }
  refreshUI() {
    const originalEl = this.$el;
    const newEl = this.render();
    originalEl.replaceWith(newEl);
    this.playFadeInAnim();
    this.eachComment(this.children, (child) => {
      child.parent?.getChildrenEl().appendChild(child.render());
      child.playFadeInAnim();
    });
    this.ctx.trigger("comments-loaded");
  }
  eachComment(commentList, action) {
    if (commentList.length === 0)
      return;
    commentList.every((item) => {
      if (action(item, commentList) === false)
        return false;
      this.eachComment(item.getChildren(), action);
      return true;
    });
  }
  getIsRoot() {
    return this.parent === null;
  }
  getChildren() {
    return this.children;
  }
  putChild(childC) {
    childC.parent = this;
    childC.nestedNum = this.nestedNum + 1;
    this.children.push(childC);
    this.getChildrenEl().appendChild(childC.getEl());
    childC.playFadeInAnim();
  }
  getChildrenEl() {
    if (this.$children === null) {
      if (this.nestedNum < this.maxNestingNum) {
        this.$children = createElement('<div class="atk-comment-children"></div>');
        this.$main.appendChild(this.$children);
      } else if (this.parent) {
        this.$children = this.parent.getChildrenEl();
      }
    }
    return this.$children;
  }
  getParent() {
    return this.parent;
  }
  getEl() {
    return this.$el;
  }
  getData() {
    return this.data;
  }
  getGravatarUrl() {
    return getGravatarURL(this.ctx, this.data.email_encrypted);
  }
  getContentMarked() {
    return marked(this.ctx, this.data.content);
  }
  getDateFormatted() {
    return timeAgo(new Date(this.data.date));
  }
  getUserUaBrowser() {
    const info = detectFactory(this.data.ua);
    return `${info.browser} ${info.version}`;
  }
  getUserUaOS() {
    const info = detectFactory(this.data.ua);
    return `${info.os} ${info.osVersion}`;
  }
  playFadeInAnim() {
    playFadeInAnim(this.$el);
  }
  vote(type) {
    const actionBtn = type === "up" ? this.voteBtnUp : this.voteBtnDown;
    new Api(this.ctx).vote(this.data.id, `comment_${type}`).then((v) => {
      this.data.vote_up = v.up;
      this.data.vote_down = v.down;
      this.voteBtnUp?.updateText();
      this.voteBtnDown?.updateText();
    }).catch((err) => {
      actionBtn?.setError(`\u6295\u7968\u5931\u8D25`);
      console.log(err);
    });
  }
  adminEdit(type, btnElem) {
    if (btnElem.isLoading)
      return;
    btnElem.setLoading(true, "\u4FEE\u6539\u4E2D...");
    const modify = { ...this.data };
    if (type === "collapsed") {
      modify.is_collapsed = !modify.is_collapsed;
    } else if (type === "pending") {
      modify.is_pending = !modify.is_pending;
    }
    new Api(this.ctx).commentEdit(modify).then((comment) => {
      btnElem.setLoading(false);
      this.data = comment;
      this.refreshUI();
      playFadeInAnim(this.$body);
      this.ctx.trigger("list-refresh-ui");
    }).catch((err) => {
      console.error(err);
      btnElem.setError("\u4FEE\u6539\u5931\u8D25");
    });
  }
  onDelete;
  adminDelete(btnElem) {
    if (btnElem.isLoading)
      return;
    btnElem.setLoading(true, "\u5220\u9664\u4E2D...");
    new Api(this.ctx).commentDel(this.data.id, this.data.site_name).then(() => {
      btnElem.setLoading(false);
      if (this.onDelete)
        this.onDelete(this);
    }).catch((e) => {
      console.error(e);
      btnElem.setError("\u5220\u9664\u5931\u8D25");
    });
  }
  setUnread(val) {
    this.unread = val;
    if (this.unread)
      this.$el.classList.add("atk-unread");
    else
      this.$el.classList.remove("atk-unread");
  }
  setOpenURL(url) {
    if (!url) {
      this.openable = false;
      this.$el.classList.remove("atk-openable");
    }
    this.openable = true;
    this.openURL = url;
    this.$el.classList.add("atk-openable");
  }
  checkMoreHide($target, allowHeight = 300) {
    if (!$target)
      return;
    let $hideMoreOpenBtn = $target?.querySelector(".atk-more-hide-open-btn");
    const removeHideMore = () => {
      $target.classList.remove("atk-comment-more-hide");
      if ($hideMoreOpenBtn)
        $hideMoreOpenBtn.remove();
      $target.style.height = "";
      $target.style.overflow = "";
    };
    if (getHeight($target) > allowHeight) {
      $target.classList.add("atk-comment-more-hide");
      $target.style.height = `${allowHeight}px`;
      $target.style.overflow = "hidden";
      if (!$hideMoreOpenBtn) {
        $hideMoreOpenBtn = createElement(`<div class="atk-more-hide-open-btn">\u9605\u8BFB\u66F4\u591A</span>`);
        $hideMoreOpenBtn.onclick = (e) => {
          e.stopPropagation();
          removeHideMore();
        };
        $target.append($hideMoreOpenBtn);
      }
    }
  }
}

var pagination = '';

class Pagination {
  conf;
  total;
  $el;
  $input;
  inputTimer;
  $prevBtn;
  $nextBtn;
  page = 1;
  get pageSize() {
    return this.conf.pageSize || 15;
  }
  get offset() {
    return this.pageSize * (this.page - 1);
  }
  get maxPage() {
    return Math.ceil(this.total / this.pageSize);
  }
  constructor(total, conf) {
    this.total = total;
    this.conf = conf;
    this.$el = createElement(`<div class="atk-pagination-wrap">
        <div class="atk-pagination">
          <div class="atk-btn atk-btn-prev">Prev</div>
          <input type="text" class="atk-input" />
          <div class="atk-btn atk-btn-next">Next</div>
        </div>
      </div>`);
    this.$input = this.$el.querySelector(".atk-input");
    this.$input.value = `${this.page}`;
    this.$input.oninput = () => this.input();
    this.$input.onkeydown = (e) => this.keydown(e);
    this.$prevBtn = this.$el.querySelector(".atk-btn-prev");
    this.$nextBtn = this.$el.querySelector(".atk-btn-next");
    this.$prevBtn.onclick = () => this.prev();
    this.$nextBtn.onclick = () => this.next();
    this.checkDisabled();
  }
  update(offset, total) {
    this.page = Math.ceil(offset / this.pageSize) + 1;
    this.total = total;
    this.setInput(this.page);
    this.checkDisabled();
  }
  setInput(page) {
    this.$input.value = `${page}`;
  }
  input(now = false) {
    window.clearTimeout(this.inputTimer);
    const value = this.$input.value.trim();
    const modify = () => {
      if (value === "") {
        this.setInput(this.page);
        return;
      }
      let page = Number(value);
      if (Number.isNaN(page)) {
        this.setInput(this.page);
        return;
      }
      if (page < 1) {
        this.setInput(this.page);
        return;
      }
      if (page > this.maxPage) {
        this.setInput(this.maxPage);
        page = this.maxPage;
      }
      this.change(page);
    };
    if (!now)
      this.inputTimer = window.setTimeout(() => modify(), 800);
    else
      modify();
  }
  prev() {
    const page = this.page - 1;
    if (page < 1) {
      return;
    }
    this.change(page);
  }
  next() {
    const page = this.page + 1;
    if (page > this.maxPage) {
      return;
    }
    this.change(page);
  }
  change(page) {
    this.page = page;
    this.conf.onChange(this.offset);
    this.setInput(page);
    this.checkDisabled();
  }
  checkDisabled() {
    if (this.page + 1 > this.maxPage) {
      this.$nextBtn.classList.add("atk-disabled");
    } else {
      this.$nextBtn.classList.remove("atk-disabled");
    }
    if (this.page - 1 < 1) {
      this.$prevBtn.classList.add("atk-disabled");
    } else {
      this.$prevBtn.classList.remove("atk-disabled");
    }
  }
  keydown(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 38) {
      const page = Number(this.$input.value) + 1;
      if (page > this.maxPage) {
        return;
      }
      this.setInput(page);
      this.input();
    } else if (keyCode === 40) {
      const page = Number(this.$input.value) - 1;
      if (page < 1) {
        return;
      }
      this.setInput(page);
      this.input();
    } else if (keyCode === 13) {
      this.input(true);
    }
  }
  setLoading(isLoading) {
    if (isLoading)
      showLoading(this.$el);
    else
      hideLoading(this.$el);
  }
}

class ReadMoreBtn {
  conf;
  $el;
  $loading;
  $text;
  constructor(conf) {
    this.conf = conf;
    this.$el = createElement(`<div class="atk-list-read-more" style="display: none;">
      <div class="atk-list-read-more-inner">
        <div class="atk-loading-icon" style="display: none;"></div>
        <span class="atk-text">\u67E5\u770B\u66F4\u591A</span>
      </div>
    </div>`);
    this.$loading = this.$el.querySelector(".atk-loading-icon");
    this.$text = this.$el.querySelector(".atk-text");
    this.$el.onclick = () => this.click();
  }
  click() {
    this.conf.onClick();
  }
  show() {
    this.$el.style.display = "";
  }
  hide() {
    this.$el.style.display = "none";
  }
  setLoading(isLoading) {
    this.$loading.style.display = isLoading ? "" : "none";
    this.$text.style.display = isLoading ? "none" : "";
  }
  showErr(errMsg) {
    this.setLoading(false);
    this.$text.innerText = errMsg;
    this.$el.classList.add("atk-err");
    window.setTimeout(() => {
      this.$text.innerText = "\u67E5\u770B\u66F4\u591A";
      this.$el.classList.remove("atk-err");
    }, 2e3);
  }
}

class ListLite extends Component {
  $parent;
  $commentsWrap;
  comments = [];
  data;
  pageSize = 15;
  offset = 0;
  type;
  noCommentText;
  renderComment;
  paramsEditor;
  onAfterLoad;
  isLoading = false;
  isFirstLoad = true;
  flatMode;
  pageMode = "pagination";
  pagination;
  readMoreBtn;
  autoLoadScrollEvent;
  autoLoadListenerAt;
  unread = [];
  unreadHighlight = false;
  constructor(ctx, $parent) {
    super(ctx);
    this.$parent = $parent;
    this.$el = createElement(`<div class="atk-list-lite">
      <div class="atk-list-comments-wrap"></div>
    </div>`);
    this.$commentsWrap = this.$el.querySelector(".atk-list-comments-wrap");
    this.pageSize = this.conf.pagination ? this.conf.pagination.pageSize || this.pageSize : this.pageSize;
    this.noCommentText = this.conf.noComment || "\u65E0\u8BC4\u8BBA";
    window.setInterval(() => {
      this.$el.querySelectorAll("[data-atk-comment-date]").forEach((el) => {
        const date = el.getAttribute("data-atk-comment-date");
        el.innerText = timeAgo(new Date(Number(date)));
      });
    }, 30 * 1e3);
    this.ctx.on("unread-update", (data) => this.updateUnread(data.notifies));
  }
  async reqComments(offset = 0) {
    if (offset === 0 && this.pageMode !== "pagination") {
      this.clearAllComments();
    }
    const showLoading$1 = () => {
      this.isLoading = true;
      if (offset === 0)
        showLoading(this.$el);
      else if (this.pageMode === "read-more")
        this.readMoreBtn.setLoading(true);
      else if (this.pageMode === "pagination")
        this.pagination.setLoading(true);
    };
    const hideLoading$1 = () => {
      this.isLoading = false;
      if (offset === 0)
        hideLoading(this.$el);
      else if (this.pageMode === "read-more")
        this.readMoreBtn.setLoading(false);
      else if (this.pageMode === "pagination")
        this.pagination.setLoading(false);
    };
    showLoading$1();
    this.ctx.trigger("comments-load");
    let listData;
    try {
      listData = await new Api(this.ctx).get(offset, this.type, this.flatMode, this.paramsEditor);
    } catch (e) {
      this.onError(e.msg || String(e));
      throw e;
    } finally {
      hideLoading$1();
    }
    if (this.ctx.conf.versionCheck) {
      const needUpdate = this.apiVersionCheck(listData.api_version || {});
      if (needUpdate)
        return;
    }
    this.offset = offset;
    try {
      this.onLoad(listData, offset);
      if (this.onAfterLoad) {
        this.onAfterLoad(listData);
      }
    } catch (e) {
      this.onError(String(e));
      throw e;
    } finally {
      hideLoading$1();
    }
  }
  onLoad(data, offset) {
    setError(this.$el, null);
    if (this.pageMode === "pagination") {
      this.clearAllComments();
    }
    this.data = data;
    this.importComments(data.comments);
    if (this.isFirstLoad) {
      this.onLoadInit();
    }
    if (this.pageMode === "pagination") {
      this.pagination.update(offset, this.data?.total_parents || 0);
    }
    if (this.pageMode === "read-more") {
      if (this.hasMoreComments)
        this.readMoreBtn.show();
      else
        this.readMoreBtn.hide();
    }
    this.ctx.trigger("unread-update", { notifies: data.unread || [] });
    this.isFirstLoad = false;
  }
  onLoadInit() {
    if (this.autoLoadScrollEvent) {
      const at = this.autoLoadListenerAt || document;
      at.removeEventListener("scroll", this.autoLoadScrollEvent);
    }
    if (this.pageMode === "read-more") {
      const readMoreBtn = new ReadMoreBtn({
        pageSize: this.pageSize,
        total: 0,
        onClick: async () => {
          const offset = this.offset + this.pageSize;
          await this.reqComments(offset);
        }
      });
      if (this.readMoreBtn)
        this.readMoreBtn.$el.replaceWith(readMoreBtn.$el);
      else
        this.$el.append(readMoreBtn.$el);
      this.readMoreBtn = readMoreBtn;
      if (this.conf.pagination?.autoLoad) {
        this.autoLoadScrollEvent = () => {
          if (this.pageMode !== "read-more")
            return;
          if (!this.hasMoreComments)
            return;
          if (this.isLoading)
            return;
          const $target = this.$el.querySelector(".atk-list-comments-wrap > .atk-comment-wrap:nth-last-child(3)");
          if (!$target)
            return;
          if (isVisible($target, this.autoLoadListenerAt)) {
            this.readMoreBtn.click();
          }
        };
        const at = this.autoLoadListenerAt || document;
        at.addEventListener("scroll", this.autoLoadScrollEvent);
      }
    } else if (this.pageMode === "pagination") {
      const pagination = new Pagination(this.parentCommentsCount, {
        pageSize: this.pageSize,
        onChange: async (offset) => {
          await this.reqComments(offset);
          if (this.$parent) {
            let topPos = 0;
            if (!this.autoLoadListenerAt && this.$parent) {
              topPos = getOffset(this.$parent).top;
            }
            const at = this.autoLoadListenerAt || window;
            at.scroll({
              top: topPos,
              left: 0
            });
          }
        }
      });
      if (this.pagination)
        this.pagination.$el.replaceWith(pagination.$el);
      else
        this.$el.append(pagination.$el);
      this.pagination = pagination;
    }
  }
  onError(msg) {
    msg = String(msg);
    console.error(msg);
    if (this.isFirstLoad || this.pageMode === "pagination") {
      const errEl = createElement(`<span>${msg}\uFF0C\u65E0\u6CD5\u83B7\u53D6\u8BC4\u8BBA\u5217\u8868\u6570\u636E<br/></span>`);
      const retryBtn = createElement('<span style="cursor:pointer;">\u70B9\u51FB\u91CD\u65B0\u83B7\u53D6</span>');
      retryBtn.onclick = () => {
        this.reqComments(this.offset);
      };
      errEl.appendChild(retryBtn);
      const adminBtn = createElement('<span atk-only-admin-show> | <span style="cursor:pointer;">\u6253\u5F00\u63A7\u5236\u53F0</span></span>');
      adminBtn.onclick = () => {
        this.ctx.trigger("sidebar-show");
      };
      if (!this.ctx.user.data.isAdmin) {
        adminBtn.classList.add("atk-hide");
      }
      errEl.appendChild(adminBtn);
      setError(this.$el, errEl);
    } else {
      this.readMoreBtn?.showErr(`\u83B7\u53D6\u5931\u8D25`);
    }
  }
  refreshUI() {
    const noComment = this.comments.length <= 0;
    let noCommentEl = this.$commentsWrap.querySelector(".atk-list-no-comment");
    if (noComment) {
      if (!noCommentEl) {
        noCommentEl = createElement('<div class="atk-list-no-comment"></div>');
        this.$commentsWrap.appendChild(noCommentEl);
        noCommentEl.innerHTML = this.noCommentText;
      }
    }
    if (!noComment && noCommentEl)
      noCommentEl.remove();
    this.ctx.trigger("check-admin-show-el");
  }
  createComment(data) {
    const comment = new Comment(this.ctx, data);
    comment.afterRender = () => {
      if (this.renderComment)
        this.renderComment(comment);
    };
    comment.onDelete = (c) => {
      this.deleteComment(c);
      this.refreshUI();
    };
    return comment;
  }
  importComments(rawData) {
    const queryImportChildren = (parentC) => {
      const children = rawData.filter((o) => o.rid === parentC.data.id);
      if (children.length === 0)
        return;
      children.forEach((itemData) => {
        itemData.is_allow_reply = parentC.data.is_allow_reply;
        const childC = this.createComment(itemData);
        childC.render();
        parentC.putChild(childC);
        queryImportChildren(childC);
      });
    };
    if (!this.flatMode) {
      rawData.filter((o) => o.rid === 0).forEach((rootCommentData) => {
        if (rootCommentData.is_collapsed)
          rootCommentData.is_allow_reply = false;
        const rootComment = this.createComment(rootCommentData);
        rootComment.render();
        this.comments.push(rootComment);
        this.$commentsWrap.appendChild(rootComment.getEl());
        rootComment.playFadeInAnim();
        queryImportChildren(rootComment);
      });
    } else {
      rawData.forEach((commentData) => {
        this.putCommentFlatMode(commentData, rawData, "append");
      });
    }
    this.eachComment(this.comments, (c) => {
      this.checkMoreHide(c);
    });
    this.refreshUI();
    this.ctx.trigger("comments-loaded");
  }
  putCommentFlatMode(commentItem, comments, insertMode) {
    if (commentItem.is_collapsed)
      commentItem.is_allow_reply = false;
    const comment = this.createComment(commentItem);
    if (commentItem.rid !== 0) {
      const rComment = comments.find((o) => o.id === commentItem.rid);
      if (rComment)
        comment.replyTo = rComment;
    }
    comment.render();
    if (insertMode === "append") {
      this.comments.push(comment);
    } else {
      this.comments.unshift(comment);
    }
    if (commentItem.visible) {
      if (insertMode === "append") {
        this.$commentsWrap.appendChild(comment.getEl());
      } else {
        this.$commentsWrap.prepend(comment.getEl());
      }
      comment.playFadeInAnim();
    }
    this.checkMoreHide(comment);
  }
  insertComment(commentData) {
    if (!this.flatMode) {
      const comment = this.createComment(commentData);
      comment.render();
      if (commentData.rid !== 0) {
        this.findComment(commentData.rid)?.putChild(comment);
      } else {
        this.$commentsWrap.prepend(comment.getEl());
        this.comments.unshift(comment);
      }
      scrollIntoView(comment.getEl());
      comment.playFadeInAnim();
      this.checkMoreHide(comment);
    } else {
      this.putCommentFlatMode(commentData, this.comments.map((c) => c.data), "prepend");
    }
    if (this.data)
      this.data.total += 1;
    this.refreshUI();
    this.ctx.trigger("comments-loaded");
  }
  checkMoreHide(c) {
    const childrenH = this.ctx.conf.heightLimit?.children;
    const contentH = this.ctx.conf.heightLimit?.content;
    const isChildrenLimit = typeof childrenH === "number" && childrenH > 0;
    const isContentLimit = typeof contentH === "number" && contentH > 0;
    if (isChildrenLimit && c.getIsRoot()) {
      c.checkMoreHide(c.$children, childrenH || 300);
    }
    if (isContentLimit) {
      c.checkMoreHide(c.$content, contentH || 200);
      if (c.$replyTo)
        c.checkMoreHide(c.$replyTo, contentH || 200);
    }
  }
  get commentsCount() {
    return Number(this.data?.total) || 0;
  }
  get parentCommentsCount() {
    return Number(this.data?.total_parents) || 0;
  }
  get hasMoreComments() {
    if (!this.data)
      return false;
    return this.data.total_parents > this.offset + this.pageSize;
  }
  eachComment(commentList, action) {
    if (commentList.length === 0)
      return;
    commentList.every((item) => {
      if (action(item, commentList) === false)
        return false;
      this.eachComment(item.getChildren(), action);
      return true;
    });
  }
  findComment(id, src) {
    if (!src)
      src = this.comments;
    let comment = null;
    this.eachComment(src, (item) => {
      if (item.data.id === id) {
        comment = item;
        return false;
      }
      return true;
    });
    return comment;
  }
  getCommentCount() {
    let count = 0;
    this.eachComment(this.comments, () => {
      count++;
    });
    return count;
  }
  deleteComment(comment) {
    let findComment;
    if (typeof comment === "number") {
      findComment = this.findComment(comment);
      if (!findComment)
        throw Error(`\u672A\u627E\u5230\u8BC4\u8BBA ${comment}`);
    } else
      findComment = comment;
    findComment.getEl().remove();
    this.eachComment(this.comments, (item, levelList) => {
      if (item === findComment) {
        levelList.splice(levelList.indexOf(item), 1);
        return false;
      }
      return true;
    });
    this.refreshUI();
  }
  clearAllComments() {
    this.$commentsWrap.innerHTML = "";
    this.data = void 0;
    this.comments = [];
  }
  updateUnread(notifies) {
    this.unread = notifies;
    if (this.unreadHighlight) {
      this.eachComment(this.comments, (comment) => {
        const notify = this.unread.find((o) => o.comment_id === comment.data.id);
        if (notify) {
          comment.setUnread(true);
          comment.setOpenURL(notify.read_link);
          comment.openEvt = () => {
            this.unread = this.unread.filter((o) => o.comment_id !== comment.data.id);
            this.ctx.trigger("unread-update", {
              notifies: this.unread
            });
          };
        } else {
          comment.setUnread(false);
        }
      });
    }
  }
  apiVersionCheck(versionData) {
    const needVersion = versionData?.fe_min_version || "0.0.0";
    const needUpdate = versionCompare(needVersion, "2.1.1") === 1;
    if (needUpdate) {
      const errEl = createElement(`<div>\u524D\u7AEF Artalk \u7248\u672C\u5DF2\u8FC7\u65F6\uFF0C\u8BF7\u66F4\u65B0\u4EE5\u83B7\u5F97\u5B8C\u6574\u4F53\u9A8C<br/>\u82E5\u60A8\u662F\u7AD9\u70B9\u7BA1\u7406\u5458\uFF0C\u8BF7\u524D\u5F80 \u201C<a href="https://artalk.js.org/" target="_blank">\u5B98\u65B9\u6587\u6863</a>\u201D \u83B7\u53D6\u5E2E\u52A9<br/><br/><span style="color: var(--at-color-meta);">\u524D\u7AEF\u7248\u672C ${"2.1.1"}\uFF0C\u9700\u6C42\u7248\u672C >= ${needVersion}</span><br/><br/></div>`);
      const ignoreBtn = createElement('<span style="cursor:pointer;">\u5FFD\u7565</span>');
      ignoreBtn.onclick = () => {
        setError(this.ctx, null);
        this.ctx.conf.versionCheck = false;
        this.reqComments(0);
      };
      errEl.append(ignoreBtn);
      setError(this.ctx, errEl, '<span class="atk-warn-title">Artalk Warn</span>');
    }
    return needUpdate;
  }
}

class List extends ListLite {
  $closeCommentBtn;
  $openSidebarBtn;
  $unreadBadge;
  constructor(ctx) {
    const el = createElement(ListHTML);
    super(ctx, el);
    el.querySelector(".atk-list-body").append(this.$el);
    this.$el = el;
    let flatMode = false;
    if (this.ctx.conf.flatMode === "auto") {
      if (window.matchMedia("(max-width: 768px)").matches)
        flatMode = true;
    } else if (this.ctx.conf.flatMode === true) {
      flatMode = true;
    }
    this.flatMode = flatMode;
    this.pageMode = this.conf.pagination?.readMore ? "read-more" : "pagination";
    this.initListActionBtn();
    this.$el.querySelector(".atk-copyright").innerHTML = `Powered By <a href="https://artalk.js.org" target="_blank" title="Artalk v${"2.1.1"}">Artalk</a>`;
    this.ctx.on("list-reload", () => this.reqComments(0));
    this.ctx.on("list-refresh-ui", () => this.refreshUI());
    this.ctx.on("list-import", (data) => this.importComments(data));
    this.ctx.on("list-insert", (data) => this.insertComment(data));
    this.ctx.on("list-delete", (comment) => this.deleteComment(comment.id));
    this.ctx.on("list-update", (updateData) => {
      updateData(this.data);
      this.refreshUI();
    });
    this.ctx.on("unread-update", (data) => this.showUnreadBadge(data.notifies?.length || 0));
  }
  initListActionBtn() {
    this.$openSidebarBtn = this.$el.querySelector('[data-action="open-sidebar"]');
    this.$closeCommentBtn = this.$el.querySelector('[data-action="admin-close-comment"]');
    this.$unreadBadge = this.$el.querySelector(".atk-unread-badge");
    this.$openSidebarBtn.addEventListener("click", () => {
      this.ctx.trigger("sidebar-show");
    });
    this.$closeCommentBtn.addEventListener("click", () => {
      if (!this.data)
        return;
      this.data.page.admin_only = !this.data.page.admin_only;
      this.adminPageEditSave();
    });
  }
  refreshUI() {
    super.refreshUI();
    this.$el.querySelector(".atk-comment-count-num").innerText = String(this.commentsCount);
    if (!!this.ctx.user.data.nick && !!this.ctx.user.data.email) {
      this.$openSidebarBtn.classList.remove("atk-hide");
    } else {
      this.$openSidebarBtn.classList.add("atk-hide");
    }
    this.ctx.trigger("check-admin-show-el");
    this.$openSidebarBtn.innerText = !this.ctx.user.data.isAdmin ? "\u901A\u77E5\u4E2D\u5FC3" : "\u63A7\u5236\u4E2D\u5FC3";
    if (!!this.data && !!this.data.page && this.data.page.admin_only === true) {
      this.ctx.trigger("editor-close");
      this.$closeCommentBtn.innerHTML = "\u6253\u5F00\u8BC4\u8BBA";
    } else {
      this.ctx.trigger("editor-open");
      this.$closeCommentBtn.innerHTML = "\u5173\u95ED\u8BC4\u8BBA";
    }
  }
  onLoad(data, offset) {
    super.onLoad(data, offset);
    this.checkGoToCommentByUrlHash();
  }
  async checkGoToCommentByUrlHash() {
    let commentId = Number(getQueryParam("atk_comment"));
    if (!commentId) {
      const match = window.location.hash.match(/#atk-comment-([0-9]+)/);
      if (!match || !match[1] || Number.isNaN(Number(match[1])))
        return;
      commentId = Number(match[1]);
    }
    if (!commentId)
      return;
    const notifyKey = getQueryParam("atk_notify_key");
    if (notifyKey) {
      new Api(this.ctx).markRead(notifyKey).then(() => {
        this.unread = this.unread.filter((o) => o.comment_id !== commentId);
        this.ctx.trigger("unread-update", {
          notifies: this.unread
        });
      });
    }
    const comment = this.findComment(commentId);
    if (!comment)
      return;
    scrollIntoView(comment.getEl(), false);
    window.setTimeout(() => {
      comment.getEl().classList.add("atk-flash-once");
    }, 800);
  }
  adminPageEditSave() {
    if (!this.data || !this.data.page)
      return;
    this.ctx.trigger("editor-show-loading");
    new Api(this.ctx).pageEdit(this.data.page).then((page) => {
      if (this.data)
        this.data.page = { ...page };
      this.refreshUI();
    }).catch((err) => {
      this.ctx.trigger("editor-notify", { msg: `\u4FEE\u6539\u9875\u9762\u6570\u636E\u5931\u8D25\uFF1A${err.msg || String(err)}`, type: "e" });
    }).finally(() => {
      this.ctx.trigger("editor-hide-loading");
    });
  }
  showUnreadBadge(count) {
    if (count > 0) {
      this.$unreadBadge.innerText = `${Number(count || 0)}`;
      this.$unreadBadge.style.display = "block";
    } else {
      this.$unreadBadge.style.display = "none";
    }
  }
}

var sidebar = '';

/* eslint-disable */

// https://stackoverflow.com/questions/14733374/how-to-generate-an-md5-file-hash-in-javascript-node-js#answer-33486055
var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e);}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return (d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

var SidebarHTML = "<div class=\"atk-sidebar\">\n  <div class=\"atk-sidebar-inner\">\n    <div class=\"atk-sidebar-header\">\n      <span class=\"atk-avatar\">\n        <span class=\"atk-site-logo\"></span>\n      </span>\n      <span class=\"atk-menu\">\n        <span class=\"atk-item atk-active atk-sidebar-title\">控制中心</span>\n      </span>\n      <div class=\"atk-sidebar-close\"><i class=\"atk-icon atk-icon-close\"></i></div>\n    </div>\n    <div class=\"atk-sidebar-nav\">\n      <div class=\"akt-curt-view-btn\">\n        <div class=\"atk-icon\"><span></span><span></span><span></span></div>\n        <div class=\"atk-text\"></div>\n      </div>\n      <div class=\"atk-tabs\"></div>\n      <div class=\"atk-tabs atk-views\" style=\"display: none;\"></div>\n    </div>\n    <div class=\"atk-sidebar-view-wrap\"></div>\n  </div>\n</div>\n";

class SidebarView extends Component {
  static viewName = "";
  static viewTitle = "";
  static viewAdminOnly = false;
  viewTabs = {};
  viewActiveTab = "";
  $parent;
  constructor(ctx, $parent) {
    super(ctx);
    this.$parent = $parent;
    this.$el = createElement(`<div class="atk-sidebar-view"></div>`);
  }
  mount(siteName) {
  }
  switchTab(tab, siteName) {
  }
}

class MessageView extends SidebarView {
  static viewName = "comments";
  static viewTitle = "\u8BC4\u8BBA";
  viewTabs = {};
  viewActiveTab = "";
  list;
  mount(siteName) {
    if (this.ctx.user.data.isAdmin) {
      this.viewTabs = {
        admin_all: "\u5168\u90E8",
        admin_pending: "\u5F85\u5BA1",
        all: "\u4E2A\u4EBA"
      };
      this.viewActiveTab = "admin_all";
    } else {
      this.viewTabs = {
        mentions: "\u63D0\u53CA",
        all: "\u5168\u90E8",
        mine: "\u6211\u7684",
        pending: "\u5F85\u5BA1"
      };
      this.viewActiveTab = "mentions";
    }
    this.list = new ListLite(this.ctx, this.$el);
    this.list.flatMode = true;
    this.list.unreadHighlight = true;
    this.list.autoLoadListenerAt = this.$parent;
    this.list.pageMode = "pagination";
    this.list.noCommentText = '<div class="atk-sidebar-no-content">\u65E0\u5185\u5BB9</div>';
    this.list.renderComment = (comment) => {
      comment.setOpenURL(`${comment.data.page_key}#atk-comment-${comment.data.id}`);
    };
    this.list.paramsEditor = (params) => {
      params.site_name = siteName;
    };
    this.$el.innerHTML = "";
    this.$el.append(this.list.$el);
    this.switchTab(this.viewActiveTab, siteName);
  }
  switchTab(tab, siteName) {
    this.viewActiveTab = tab;
    this.list.type = tab;
    this.list.isFirstLoad = true;
    this.list.paramsEditor = (params) => {
      params.site_name = siteName;
    };
    this.list.reqComments();
    return true;
  }
}

var pageList = '';

var itemTextEditor = '';

class ItemTextEditor {
  conf;
  $el;
  $input;
  $yesBtn;
  $noBtn;
  value = "";
  allowSubmit = true;
  constructor(conf) {
    this.conf = conf;
    this.$el = createElement(`<div class="atk-item-text-editor-layer">
      <div class="atk-edit-form">
        <input class="atk-main-input" type="text" placeholder="\u8F93\u5165\u5185\u5BB9..." autocomplete="off" autofocus>
      </div>
      <div class="atk-actions">
        <div class="atk-item atk-yes-btn">
          <i class="atk-icon atk-icon-yes"></i>
        </div>
        <div class="atk-item atk-no-btn">
          <i class="atk-icon atk-icon-no"></i>
        </div>
      </div>
    </div>`);
    this.$input = this.$el.querySelector(".atk-main-input");
    this.$yesBtn = this.$el.querySelector(".atk-yes-btn");
    this.$noBtn = this.$el.querySelector(".atk-no-btn");
    this.$input.value = conf.initValue || "";
    this.value = conf.initValue || "";
    if (this.conf.placeholder)
      this.$input.placeholder = this.conf.placeholder;
    this.$input.oninput = () => this.onInput();
    this.$input.onkeyup = (evt) => {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        evt.preventDefault();
        this.submit();
      }
    };
    window.setTimeout(() => this.$input.focus(), 80);
    this.$yesBtn.onclick = () => {
      this.submit();
    };
    this.$noBtn.onclick = () => {
      this.cancel();
    };
  }
  appendTo(parentDOM) {
    parentDOM.append(this.$el);
    return this;
  }
  onInput() {
    this.value = this.$input.value;
    if (this.conf.validator) {
      const ok = this.conf.validator(this.value);
      this.setAllowSubmit(ok);
      if (!ok) {
        this.$input.classList.add("atk-invalid");
      } else {
        this.$input.classList.remove("atk-invalid");
      }
    }
  }
  setAllowSubmit(allow) {
    if (this.allowSubmit === allow)
      return;
    this.allowSubmit = allow;
    if (!allow) {
      this.$yesBtn.classList.add(".atk-disabled");
    } else {
      this.$yesBtn.classList.remove(".atk-disabled");
    }
  }
  async submit() {
    if (!this.allowSubmit)
      return;
    if (this.conf.onYes) {
      let isContinue;
      if (this.conf.onYes instanceof (async () => {
      }).constructor) {
        isContinue = await this.conf.onYes(this.value);
      } else {
        isContinue = this.conf.onYes(this.value);
      }
      if (isContinue === void 0 || isContinue === true) {
        this.closeEditor();
      }
    } else {
      this.closeEditor();
    }
  }
  async cancel() {
    if (this.conf.onNo) {
      let isContinue;
      if (this.conf.onNo instanceof (async () => {
      }).constructor) {
        isContinue = await this.conf.onNo();
      } else {
        isContinue = this.conf.onNo();
      }
      if (isContinue === void 0 || isContinue === true) {
        this.closeEditor();
      }
    } else {
      this.closeEditor();
    }
  }
  closeEditor() {
    this.$el.remove();
  }
}

class PageList extends Component {
  $editor;
  $inputer;
  pages = [];
  constructor(ctx) {
    super(ctx);
    this.$el = createElement(`<div class="atk-page-list"></div>`);
  }
  clearAll() {
    this.pages = [];
    this.$el.innerHTML = "";
  }
  importPages(pages) {
    this.pages.push(...pages);
    pages.forEach((page) => {
      const $page = this.renderPage(page);
      this.$el.append($page);
    });
  }
  renderPage(page) {
    const $page = createElement(`<div class="atk-page-item">
        <div class="atk-page-main">
          <div class="atk-title"></div>
          <div class="atk-sub"></div>
        </div>
        <div class="atk-page-actions">
          <div class="atk-item atk-edit-btn">
            <i class="atk-icon atk-icon-edit"></i>
          </div>
        </div>
      </div>`);
    const $main = $page.querySelector(".atk-page-main");
    const $title = $main.querySelector(".atk-title");
    const $sub = $main.querySelector(".atk-sub");
    const $editBtn = $page.querySelector(".atk-edit-btn");
    $title.innerText = page.title;
    $sub.innerText = page.url || page.key;
    $editBtn.onclick = () => this.showEditor(page, $page);
    return $page;
  }
  showEditor(page, $page) {
    this.closeEditor();
    this.$editor = createElement(`<div class="atk-page-edit-layer">
      <div class="atk-page-main-actions">
        <div class="atk-item atk-title-edit-btn">\u6807\u9898\u4FEE\u6539</div>
        <div class="atk-item atk-key-edit-btn">KEY \u53D8\u66F4</div>
        <div class="atk-item atk-admin-only-btn"></div>
      </div>
      <div class="atk-page-actions">
        <div class="atk-item atk-sync-btn">
          <i class="atk-icon atk-icon-sync"></i>
        </div>
        <div class="atk-item atk-del-btn">
          <i class="atk-icon atk-icon-del"></i>
        </div>
        <div class="atk-item atk-close-btn">
          <i class="atk-icon atk-icon-close"></i>
        </div>
      </div>
    </div>`);
    $page.prepend(this.$editor);
    const $titleEditBtn = this.$editor.querySelector(".atk-title-edit-btn");
    const $keyEditBtn = this.$editor.querySelector(".atk-key-edit-btn");
    const $adminOnlyBtn = this.$editor.querySelector(".atk-admin-only-btn");
    const $syncBtn = this.$editor.querySelector(".atk-sync-btn");
    const $delBtn = this.$editor.querySelector(".atk-del-btn");
    const $closeBtn = this.$editor.querySelector(".atk-close-btn");
    const showLoading$1 = () => {
      showLoading(this.$editor);
    };
    const hideLoading$1 = () => {
      hideLoading(this.$editor);
    };
    const showError = (msg) => {
      window.alert(msg);
    };
    $closeBtn.onclick = () => this.closeEditor();
    const openTextEditor = (key) => {
      const textEditor = new ItemTextEditor({
        initValue: page[key] || "",
        onYes: async (val) => {
          showLoading(textEditor.$el);
          let p;
          try {
            p = await new Api(this.ctx).pageEdit({ ...page, [key]: val });
          } catch (err) {
            showError(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
            console.error(err);
            return false;
          } finally {
            hideLoading(textEditor.$el);
          }
          $page.replaceWith(this.renderPage(p));
          return true;
        }
      });
      textEditor.appendTo(this.$editor);
    };
    $titleEditBtn.onclick = () => openTextEditor("title");
    $keyEditBtn.onclick = () => openTextEditor("key");
    const adminOnlyActionBtn = new ActionBtn({
      text: () => {
        $adminOnlyBtn.classList.remove("atk-green", "atk-yellow");
        $adminOnlyBtn.classList.add(!page.admin_only ? "atk-green" : "atk-yellow");
        return !page.admin_only ? "\u6240\u6709\u4EBA\u53EF\u8BC4" : "\u7BA1\u7406\u5458\u53EF\u8BC4";
      }
    }).appendTo($adminOnlyBtn);
    $adminOnlyBtn.onclick = async () => {
      showLoading$1();
      let p;
      try {
        p = await new Api(this.ctx).pageEdit({ ...page, admin_only: !page.admin_only });
      } catch (err) {
        showError(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
        console.log(err);
        return;
      } finally {
        hideLoading$1();
      }
      page.admin_only = p.admin_only;
      adminOnlyActionBtn.updateText();
    };
    $syncBtn.onclick = async () => {
      showLoading$1();
      let p;
      try {
        p = await new Api(this.ctx).pageFetch(page.id);
      } catch (err) {
        showError(`\u540C\u6B65\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
        console.log(err);
        return;
      } finally {
        hideLoading$1();
      }
      $page.replaceWith(this.renderPage(p));
    };
    $delBtn.onclick = () => {
      const del = async () => {
        showLoading$1();
        try {
          await new Api(this.ctx).pageDel(page.key, page.site_name);
        } catch (err) {
          console.log(err);
          showError(`\u5220\u9664\u5931\u8D25 ${String(err)}`);
          return;
        } finally {
          hideLoading$1();
        }
        $page.remove();
      };
      if (window.confirm(`\u786E\u8BA4\u5220\u9664\u9875\u9762 "${page.title || page.key}"\uFF1F\u5C06\u4F1A\u5220\u9664\u6240\u6709\u76F8\u5173\u6570\u636E`))
        del();
    };
  }
  closeEditor() {
    if (!this.$editor)
      return;
    this.$editor.remove();
  }
}

const PAGE_SIZE = 20;
class PagesView extends SidebarView {
  static viewName = "pages";
  static viewTitle = "\u9875\u9762";
  static viewAdminOnly = true;
  viewTabs = {};
  viewActiveTab = "";
  pageList;
  pagination;
  mount(siteName) {
    if (!this.pageList) {
      this.pageList = new PageList(this.ctx);
      this.$el.append(this.pageList.$el);
    }
    this.switchTab(this.viewActiveTab, siteName);
  }
  switchTab(tab, siteName) {
    this.reqPages(siteName, 0);
  }
  async reqPages(siteName, offset) {
    this.pageList.clearAll();
    this.$el.parentNode?.scrollTo(0, 0);
    showLoading(this.$el);
    const data = await new Api(this.ctx).pageGet(siteName, offset, PAGE_SIZE);
    this.pageList.importPages(data.pages || []);
    hideLoading(this.$el);
    if (!this.pagination) {
      this.pagination = new Pagination(data.total, {
        pageSize: PAGE_SIZE,
        onChange: (o) => {
          this.reqPages(siteName, o);
        }
      });
      this.$el.append(this.pagination.$el);
    }
    if (this.pagination && offset === 0)
      this.pagination.update(offset, data.total);
  }
}

var siteList = '';

class SiteList extends Component {
  sites = [];
  $header;
  $headerTitle;
  $headerActions;
  $rowsWrap;
  $editor;
  activeSite = "";
  $add;
  constructor(ctx) {
    super(ctx);
    this.$el = createElement(`<div class="atk-site-list">
      <div class="atk-header">
        <div class="atk-title"></div>
        <div class="atk-actions">
          <div class="atk-item atk-site-add-btn"><i class="atk-icon atk-icon-plus"></i></div>
        </div>
      </div>
      <div class="atk-site-rows-wrap"></div>
    </div>`);
    this.$header = this.$el.querySelector(".atk-header");
    this.$headerTitle = this.$header.querySelector(".atk-title");
    this.$headerActions = this.$header.querySelector(".atk-actions");
    this.$rowsWrap = this.$el.querySelector(".atk-site-rows-wrap");
    this.$headerTitle.innerText = `\u5171 0 \u4E2A\u7AD9\u70B9`;
    const $addBtn = this.$headerActions.querySelector(".atk-site-add-btn");
    $addBtn.onclick = () => {
      this.closeEditor();
      this.showAdd();
    };
  }
  loadSites(sites) {
    this.sites = sites;
    this.activeSite = "";
    this.$rowsWrap.innerHTML = "";
    this.$headerTitle.innerText = `\u5171 0 \u4E2A\u7AD9\u70B9`;
    let $row;
    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];
      if (i % 4 === 0) {
        $row = createElement('<div class="atk-site-row">');
        this.$rowsWrap.append($row);
      }
      const $site = this.renderSite(site, $row);
      $row.append($site);
    }
    this.$headerTitle.innerText = `\u5171 ${sites.length} \u4E2A\u7AD9\u70B9`;
  }
  renderSite(site, $row) {
    const $site = createElement(`<div class="atk-site-item">
        <div class="atk-site-logo"></div>
        <div class="atk-site-name"></div>
      </div>`);
    const $siteLogo = $site.querySelector(".atk-site-logo");
    const $siteName = $site.querySelector(".atk-site-name");
    const setActive = () => {
      $site.classList.add("atk-active");
    };
    $siteLogo.innerText = site.name.substr(0, 1);
    $siteName.innerText = site.name;
    $site.onclick = () => {
      this.closeEditor();
      this.closeAdd();
      setActive();
      this.showEditor(site, $site, $row);
    };
    if (this.activeSite === site.name) {
      setActive();
    }
    return $site;
  }
  showEditor(site, $site, $row) {
    this.activeSite = site.name;
    this.$editor = createElement(`
    <div class="atk-site-edit">
    <div class="atk-header">
      <div class="atk-site-info">
        <span class="atk-site-name"></span>
        <span class="atk-site-urls"></span>
      </div>
      <div class="atk-close-btn">
        <i class="atk-icon atk-icon-close"></i>
      </div>
    </div>
    <div class="atk-main">
      <div class="atk-site-text-actions">
        <div class="atk-item atk-rename-btn">\u91CD\u547D\u540D</div>
        <div class="atk-item atk-edit-url-btn">\u4FEE\u6539 URL</div>
        <!--<div class="atk-item atk-export-btn">\u5BFC\u51FA</div>
        <div class="atk-item atk-import-btn">\u5BFC\u5165</div>-->
      </div>
      <div class="atk-site-btn-actions">
        <div class="atk-item atk-del-btn">
          <i class="atk-icon atk-icon-del"></i>
        </div>
      </div>
    </div>
    </div>`);
    $row.before(this.$editor);
    const $siteName = this.$editor.querySelector(".atk-site-name");
    const $siteUrls = this.$editor.querySelector(".atk-site-urls");
    const $closeBtn = this.$editor.querySelector(".atk-close-btn");
    $closeBtn.onclick = () => this.closeEditor();
    const update = (s) => {
      site = s;
      $siteName.innerText = site.name;
      $siteName.onclick = () => {
        if (site.first_url)
          window.open(site.first_url);
      };
      $siteUrls.innerHTML = "";
      site.urls?.forEach((u) => {
        const $item = createElement('<span class="atk-url-item"></span>');
        $siteUrls.append($item);
        $item.innerText = (u || "").replace(/\/$/, "");
        $item.onclick = () => {
          window.open(u);
        };
      });
    };
    update(site);
    const $main = this.$editor.querySelector(".atk-main");
    const $actions = this.$editor.querySelector(".atk-site-text-actions");
    const $renameBtn = $actions.querySelector(".atk-rename-btn");
    const $editUrlBtn = $actions.querySelector(".atk-edit-url-btn");
    const $delBtn = this.$editor.querySelector(".atk-del-btn");
    const showLoading$1 = () => {
      showLoading(this.$editor);
    };
    const hideLoading$1 = () => {
      hideLoading(this.$editor);
    };
    const showError = (msg) => {
      window.alert(msg);
    };
    const openTextEditor = (key) => {
      let initValue = site[key] || "";
      if (key === "urls")
        initValue = site.urls_raw || "";
      const textEditor = new ItemTextEditor({
        initValue,
        onYes: async (val) => {
          showLoading(textEditor.$el);
          let s;
          try {
            s = await new Api(this.ctx).siteEdit({ ...site, [key]: val });
          } catch (err) {
            showError(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
            console.error(err);
            return false;
          } finally {
            hideLoading(textEditor.$el);
          }
          $site.replaceWith(this.renderSite(s, $row));
          update(s);
          return true;
        }
      });
      textEditor.appendTo($main);
    };
    $renameBtn.onclick = () => openTextEditor("name");
    $editUrlBtn.onclick = () => openTextEditor("urls");
    $delBtn.onclick = () => {
      const del = async () => {
        showLoading$1();
        try {
          await new Api(this.ctx).siteDel(site.id, true);
        } catch (err) {
          console.log(err);
          showError(`\u5220\u9664\u5931\u8D25 ${String(err)}`);
          return;
        } finally {
          hideLoading$1();
        }
        this.closeEditor();
        $site.remove();
        this.sites = this.sites.filter((s) => s.name !== site.name);
      };
      if (window.confirm(`\u786E\u8BA4\u5220\u9664\u7AD9\u70B9 "${site.name}"\uFF1F\u5C06\u4F1A\u5220\u9664\u6240\u6709\u76F8\u5173\u6570\u636E`))
        del();
    };
  }
  closeEditor() {
    if (!this.$editor)
      return;
    this.$editor.remove();
    this.$rowsWrap.querySelectorAll(".atk-site-item").forEach((e) => e.classList.remove("atk-active"));
    this.activeSite = "";
  }
  showAdd() {
    this.closeAdd();
    this.$add = createElement(`
    <div class="atk-site-add">
    <div class="atk-header">
      <div class="atk-title">\u65B0\u589E\u7AD9\u70B9</div>
      <div class="atk-close-btn">
        <i class="atk-icon atk-icon-close"></i>
      </div>
    </div>
    <div class="atk-form">
      <input type="text" name="AtkSiteName" placeholder="\u7AD9\u70B9\u540D\u79F0" autocomplete="off">
      <input type="text" name="AtkSiteUrls" placeholder="\u7AD9\u70B9 URL\uFF08\u591A\u4E2A\u7528\u9017\u53F7\u9694\u5F00\uFF09" autocomplete="off">
      <button class="atk-btn" name="AtkSubmit">\u521B\u5EFA</button>
    </div>
    </div>`);
    this.$header.after(this.$add);
    const $closeBtn = this.$add.querySelector(".atk-close-btn");
    $closeBtn.onclick = () => this.closeAdd();
    const $siteName = this.$add.querySelector('[name="AtkSiteName"]');
    const $siteUrls = this.$add.querySelector('[name="AtkSiteUrls"]');
    const $submitBtn = this.$add.querySelector('[name="AtkSubmit"]');
    $submitBtn.onclick = async () => {
      const siteName = $siteName.value.trim();
      const siteUrls = $siteUrls.value.trim();
      if (siteName === "") {
        $siteName.focus();
        return;
      }
      showLoading(this.$add);
      let s;
      try {
        s = await new Api(this.ctx).siteAdd(siteName, siteUrls);
      } catch (err) {
        window.alert(`\u521B\u5EFA\u5931\u8D25\uFF1A${err.msg || ""}`);
        console.error(err);
        return;
      } finally {
        hideLoading(this.$add);
      }
      this.sites.push(s);
      this.loadSites(this.sites);
      this.closeAdd();
    };
    const keyDown = (evt) => {
      if (evt.key === "Enter") {
        $submitBtn.click();
      }
    };
    $siteName.onkeyup = (evt) => keyDown(evt);
    $siteUrls.onkeyup = (evt) => keyDown(evt);
  }
  closeAdd() {
    this.$add?.remove();
  }
}

class SitesView extends SidebarView {
  static viewName = "sites";
  static viewTitle = "\u7AD9\u70B9";
  static viewAdminOnly = true;
  viewTabs = {};
  viewActiveTab = "";
  siteList;
  constructor(ctx) {
    super(ctx);
    this.$el = createElement(`<div class="atk-sidebar-view"></div>`);
  }
  mount(siteName) {
    if (!this.siteList) {
      this.siteList = new SiteList(this.ctx);
      this.$el.append(this.siteList.$el);
    }
    this.reqSites();
  }
  switchTab(tab, siteName) {
    this.reqSites();
  }
  async reqSites() {
    const sites = await new Api(this.ctx).siteGet();
    this.siteList.loadSites(sites);
  }
}

class TransferView extends SidebarView {
  \u00DF;
  static viewName = "transfer";
  static viewTitle = "\u8FC1\u79FB";
  static viewAdminOnly = true;
  viewTabs = {
    "import": "\u5BFC\u5165",
    "export": "\u5BFC\u51FA"
  };
  viewActiveTab = "import";
  mount(siteName) {
    this.switchTab("import", siteName);
  }
  switchTab(tab, siteName) {
    if (tab === "import") {
      this.initImport();
    } else if (tab === "export") {
      this.initExport();
      return false;
    }
    return true;
  }
  initImport() {
    this.$el.innerHTML = `<div class="atk-log-wrap" style="display: none;">
      <div class="atk-log-back-btn">\u8FD4\u56DE</div>
      <div class="atk-log"></div>
    </div>
    <div class="atk-form">
    <div class="atk-label">\u6570\u636E\u7C7B\u578B</div>
    <select name="AtkDataType">
      <option value="artrans">Artrans (\u6570\u636E\u884C\u56CA)</option>
      <option value="artalk_v1">Artalk v1 (PHP \u65E7\u7248)</option>
      <option value="typecho">Typecho</option>
      <option value="wordpress">WordPress</option>
      <option value="disqus">Disqus</option>
      <option value="commento">Commento</option>
      <option value="valine">Valine</option>
      <option value="twikoo">Twikoo</option>
    </select>
    <div class="atk-label atk-data-file-label">\u6570\u636E\u6587\u4EF6</div>
    <input type="file" name="AtkDataFile" accept="text/plain,.json">
    <div class="atk-label">\u76EE\u6807\u7AD9\u70B9\u540D</div>
    <input type="text" name="AtkSiteName" placeholder="\u8F93\u5165\u5185\u5BB9..." autocomplete="off">
    <div class="atk-label">\u76EE\u6807\u7AD9\u70B9 URL</div>
    <input type="text" name="AtkSiteURL" placeholder="\u8F93\u5165\u5185\u5BB9..." autocomplete="off">
    <div class="atk-label">\u542F\u52A8\u53C2\u6570\uFF08\u53EF\u9009\uFF09</div>
    <textarea name="AtkPayload"></textarea>
    <span class="atk-desc">\u542F\u52A8\u53C2\u6570\u67E5\u9605\uFF1A\u201C<a href="https://artalk.js.org/guide/transfer.html" target="_blank">\u6587\u6863 \xB7 \u6570\u636E\u642C\u5BB6</a>\u201D</span>
    <button class="atk-btn" name="AtkSubmit">\u5BFC\u5165</button>
    </div>`;
    const $form = this.$el.querySelector(".atk-form");
    const $dataType = $form.querySelector('[name="AtkDataType"]');
    const $dataFile = $form.querySelector('[name="AtkDataFile"]');
    const $dataFileLabel = $form.querySelector(".atk-data-file-label");
    const $siteName = $form.querySelector('[name="AtkSiteName"]');
    const $siteURL = $form.querySelector('[name="AtkSiteURL"]');
    const $payload = $form.querySelector('[name="AtkPayload"]');
    const $submitBtn = $form.querySelector('[name="AtkSubmit"]');
    const setError = (msg) => window.alert(msg);
    $dataType.onchange = () => {
      if (["typecho"].includes($dataType.value)) {
        $dataFile.style.display = "none";
        $dataFileLabel.style.display = "none";
      } else {
        $dataFile.style.display = "";
        $dataFileLabel.style.display = "";
      }
    };
    $submitBtn.onclick = () => {
      const dataType = $dataType.value.trim();
      const siteName = $siteName.value.trim();
      const siteURL = $siteURL.value.trim();
      const payload = $payload.value.trim();
      if (dataType === "") {
        setError("\u8BF7\u9009\u62E9\u6570\u636E\u7C7B\u578B");
        return;
      }
      let rData = {};
      if (payload) {
        try {
          rData = JSON.parse(payload);
        } catch (err) {
          setError(`Payload JSON \u683C\u5F0F\u6709\u8BEF\uFF1A${String(err)}`);
          return;
        }
        if (rData instanceof Object) {
          setError(`Payload \u9700\u4E3A JSON \u5BF9\u8C61`);
          return;
        }
      }
      if (siteName)
        rData.t_name = siteName;
      if (siteURL)
        rData.t_url = siteURL;
      const createSession = (dataStr) => {
        const $logWrap = this.$el.querySelector(".atk-log-wrap");
        const $log = $logWrap.querySelector(".atk-log");
        const $backBtn = this.$el.querySelector(".atk-log-back-btn");
        $logWrap.style.display = "";
        $form.style.display = "none";
        $backBtn.onclick = () => {
          $logWrap.style.display = "none";
          $form.style.display = "";
        };
        if (dataStr)
          rData.json_data = dataStr;
        const frameName = `f_${+new Date()}`;
        const $frame = document.createElement("iframe");
        $frame.className = "atk-iframe";
        $frame.name = frameName;
        $log.innerHTML = "";
        $log.append($frame);
        const formParams = {
          type: dataType,
          payload: JSON.stringify(rData),
          token: this.ctx.user.data.token || ""
        };
        const $formTmp = document.createElement("form");
        $formTmp.style.display = "none";
        $formTmp.setAttribute("method", "post");
        $formTmp.setAttribute("action", `${this.ctx.conf.server}/admin/import`);
        $formTmp.setAttribute("target", frameName);
        Object.entries(formParams).forEach(([key, val]) => {
          const $inputTmp = document.createElement("input");
          $inputTmp.setAttribute("type", "hidden");
          $inputTmp.setAttribute("name", key);
          $inputTmp.value = val;
          $formTmp.appendChild($inputTmp);
        });
        $logWrap.append($formTmp);
        $formTmp.submit();
        $formTmp.remove();
      };
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result);
        createSession(data);
      };
      if ($dataFile.files?.length) {
        reader.readAsText($dataFile.files[0]);
      } else {
        createSession();
      }
    };
  }
  async initExport() {
    showLoading(this.$el);
    try {
      const d = await new Api(this.ctx).export();
      this.download(`artrans-${this.getYmdHisFilename()}.json`, d);
    } catch (err) {
      console.log(err);
      window.alert(`${String(err)}`);
      return;
    } finally {
      hideLoading(this.$el);
    }
  }
  download(filename, text) {
    const el = document.createElement("a");
    el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(text)}`);
    el.setAttribute("download", filename);
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }
  getYmdHisFilename() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}${month}${day}-${hours}${padWithZeros(minutes, 2)}${padWithZeros(seconds, 2)}`;
  }
}

class SiteListFloater {
  ctx;
  conf;
  $el;
  sites = [];
  $sites;
  constructor(ctx, conf) {
    this.ctx = ctx;
    this.conf = conf;
    this.$el = createElement(`<div class="atk-site-list-floater" style="display: none;">
      <div class="atk-sites"></div>
    </div>`);
    this.$sites = this.$el.querySelector(".atk-sites");
  }
  async load(selectedSite) {
    this.$sites.innerHTML = "";
    const renderSiteItem = (siteName, siteLogo, siteTarget, onclick) => {
      const $site = createElement(`<div class="atk-site-item">
          <div class="atk-site-logo"></div>
          <div class="atk-site-name"></div>
        </div>`);
      $site.onclick = !onclick ? () => this.switch(siteTarget || siteName) : () => onclick();
      $site.setAttribute("data-name", siteTarget || siteName);
      const $siteLogo = $site.querySelector(".atk-site-logo");
      const $siteName = $site.querySelector(".atk-site-name");
      $siteLogo.innerText = siteLogo;
      $siteName.innerText = siteName;
      if (selectedSite === (siteTarget || siteName))
        $site.classList.add("atk-active");
      this.$sites.append($site);
    };
    renderSiteItem("\u6240\u6709\u7AD9\u70B9", "_", "__ATK_SITE_ALL");
    const sites = await new Api(this.ctx).siteGet();
    sites.forEach((site) => {
      renderSiteItem(site.name, site.name.substr(0, 1));
    });
    renderSiteItem("\u7AD9\u70B9\u7BA1\u7406", "+", "", () => {
      this.conf.onClickSitesViewBtn();
      this.hide();
    });
  }
  switch(siteName) {
    if (this.conf.onSwitchSite(siteName) === false) {
      return;
    }
    this.$sites.querySelectorAll(".atk-site-item").forEach((e) => {
      if (e.getAttribute("data-name") !== siteName) {
        e.classList.remove("atk-active");
      } else {
        e.classList.add("atk-active");
      }
    });
    this.hide();
  }
  outsideChecker;
  show($trigger) {
    this.$el.style.display = "";
    if ($trigger) {
      this.outsideChecker = (evt) => {
        const isClickInside = $trigger.contains(evt.target) || this.$el.contains(evt.target);
        if (!isClickInside) {
          this.hide();
        }
      };
      document.addEventListener("click", this.outsideChecker);
    }
  }
  hide() {
    this.$el.style.display = "none";
    if (this.outsideChecker)
      document.removeEventListener("click", this.outsideChecker);
  }
}

const DEFAULT_VIEW = "comments";
const REGISTER_VIEWS = [
  MessageView,
  PagesView,
  SitesView,
  TransferView
];
class Sidebar extends Component {
  layer;
  $header;
  $headerMenu;
  $title;
  $avatar;
  $siteLogo;
  $closeBtn;
  $nav;
  $curtViewBtn;
  $curtViewBtnIcon;
  $curtViewBtnText;
  $navTabs;
  $navViews;
  $viewWrap;
  siteSwitcher;
  get isAdmin() {
    return this.ctx.user.data.isAdmin;
  }
  curtSite;
  curtView = DEFAULT_VIEW;
  get curtViewInstance() {
    return this.curtView ? this.viewInstances[this.curtView] : void 0;
  }
  curtTab;
  viewInstances = {};
  viewSwitcherShow = false;
  constructor(ctx) {
    super(ctx);
    this.$el = createElement(SidebarHTML);
    this.$header = this.$el.querySelector(".atk-sidebar-header");
    this.$headerMenu = this.$header.querySelector(".atk-menu");
    this.$title = this.$header.querySelector(".atk-sidebar-title");
    this.$avatar = this.$header.querySelector(".atk-avatar");
    this.$closeBtn = this.$header.querySelector(".atk-sidebar-close");
    this.$nav = this.$el.querySelector(".atk-sidebar-nav");
    this.$curtViewBtn = this.$nav.querySelector(".akt-curt-view-btn");
    this.$curtViewBtnIcon = this.$curtViewBtn.querySelector(".atk-icon");
    this.$curtViewBtnText = this.$curtViewBtn.querySelector(".atk-text");
    this.$navTabs = this.$nav.querySelector(".atk-tabs");
    this.$navViews = this.$nav.querySelector(".atk-views");
    this.$viewWrap = this.$el.querySelector(".atk-sidebar-view-wrap");
    this.initViewSwitcher();
    this.$closeBtn.onclick = () => {
      this.hide();
    };
    this.ctx.on("sidebar-show", () => this.show());
    this.ctx.on("sidebar-hide", () => this.hide());
    this.ctx.on("user-changed", () => {
      this.firstShow = true;
    });
  }
  initViewSwitcher() {
    this.$curtViewBtn.onclick = () => {
      this.toggleViewSwitcher();
    };
    this.$navViews.innerHTML = "";
    REGISTER_VIEWS.forEach((view) => {
      const $item = createElement(`<div class="atk-tab-item"></div>`);
      this.$navViews.append($item);
      $item.setAttribute("data-name", view.viewName);
      $item.innerText = view.viewTitle;
      if (view.viewName === this.curtView) {
        $item.classList.add("atk-active");
        this.$curtViewBtnText.innerText = view.viewTitle;
      }
      $item.onclick = () => {
        this.switchView(view.viewName);
        this.toggleViewSwitcher();
      };
    });
  }
  toggleViewSwitcher() {
    if (!this.viewSwitcherShow) {
      this.$navViews.style.display = "";
      this.$navTabs.style.display = "none";
      this.$curtViewBtnIcon.classList.add("atk-arrow");
    } else {
      this.$navViews.style.display = "none";
      this.$navTabs.style.display = "";
      this.$curtViewBtnIcon.classList.remove("atk-arrow");
    }
    this.viewSwitcherShow = !this.viewSwitcherShow;
  }
  firstShow = true;
  async show() {
    this.$el.style.transform = "";
    this.layer = new Layer(this.ctx, "sidebar", this.$el);
    this.layer.show();
    this.$viewWrap.scrollTo(0, 0);
    setTimeout(() => {
      this.$el.style.transform = "translate(0, 0)";
    }, 20);
    if (this.firstShow) {
      if (this.isAdmin) {
        this.$title.innerText = "\u63A7\u5236\u4E2D\u5FC3";
        this.$curtViewBtn.style.display = "";
        if (!this.siteSwitcher) {
          this.siteSwitcher = new SiteListFloater(this.ctx, {
            onSwitchSite: (siteName) => {
              this.switchSite(siteName);
            },
            onClickSitesViewBtn: () => {
              this.switchView("sites");
            }
          });
          this.$viewWrap.before(this.siteSwitcher.$el);
          this.$avatar.onclick = (evt) => {
            if (!this.isAdmin)
              return;
            this.siteSwitcher?.show(evt.target);
          };
        }
        this.curtSite = this.conf.site;
        showLoading(this.$el);
        try {
          await this.siteSwitcher.load(this.curtSite);
        } catch (err) {
          const $err = createElement(`<span>\u52A0\u8F7D\u5931\u8D25\uFF1A${err.msg || "\u7F51\u7EDC\u9519\u8BEF"}<br/></span>`);
          const $retryBtn = createElement('<span style="cursor:pointer;">\u70B9\u51FB\u91CD\u65B0\u83B7\u53D6</span>');
          $err.appendChild($retryBtn);
          $retryBtn.onclick = () => {
            setError(this.$el, null);
            this.show();
          };
          setError(this.$el, $err);
          return;
        } finally {
          hideLoading(this.$el);
        }
        this.$avatar.innerHTML = "";
        this.$siteLogo = createElement('<div class="atk-site-logo"></div>');
        this.$siteLogo.innerText = (this.curtSite || "").substr(0, 1);
        this.$avatar.append(this.$siteLogo);
      } else {
        this.$title.innerText = "\u901A\u77E5\u4E2D\u5FC3";
        this.$curtViewBtn.style.display = "none";
        this.curtSite = this.conf.site;
        const $avatarImg = document.createElement("img");
        $avatarImg.src = getGravatarURL(this.ctx, MD5(this.ctx.user.data.email.toLowerCase()));
        this.$avatar.innerHTML = "";
        this.$avatar.append($avatarImg);
      }
      this.switchView(DEFAULT_VIEW);
      this.firstShow = false;
    }
  }
  hide() {
    this.$el.style.transform = "";
    this.layer?.dispose();
  }
  switchView(viewName) {
    let view = this.viewInstances[viewName];
    if (!view) {
      const View = REGISTER_VIEWS.find((o) => o.viewName === viewName);
      view = new View(this.ctx, this.$viewWrap);
      this.viewInstances[viewName] = view;
    }
    view.mount(this.curtSite);
    this.curtView = viewName;
    this.curtTab = view.viewActiveTab;
    this.$curtViewBtnText.innerText = view.constructor.viewTitle;
    this.$navViews.querySelectorAll(".atk-tab-item").forEach((e) => {
      if (e.getAttribute("data-name") === viewName) {
        e.classList.add("atk-active");
      } else {
        e.classList.remove("atk-active");
      }
    });
    this.loadViewTabs(view);
    this.$viewWrap.innerHTML = "";
    this.$viewWrap.append(view.$el);
    this.$viewWrap.classList.forEach((c) => {
      if (c.startsWith("atk-view-name-"))
        this.$viewWrap.classList.remove(c);
    });
    this.$viewWrap.classList.add(`atk-view-name-${view.constructor.viewName}`);
  }
  loadViewTabs(view) {
    this.$navTabs.innerHTML = "";
    Object.entries(view.viewTabs).forEach(([tabName, label]) => {
      const $tab = createElement(`<div class="atk-tab-item"></div>`);
      this.$navTabs.append($tab);
      $tab.innerText = label;
      if (view.viewActiveTab === tabName)
        $tab.classList.add("atk-active");
      $tab.onclick = () => {
        if (view.switchTab(tabName, this.curtSite) === false) {
          return;
        }
        this.$navTabs.querySelectorAll(".atk-active").forEach((e) => e.classList.remove("atk-active"));
        $tab.classList.add("atk-active");
        this.curtTab = tabName;
      };
    });
  }
  switchSite(siteName) {
    this.curtSite = siteName;
    const curtView = this.curtViewInstance;
    curtView?.switchTab(this.curtTab, siteName);
    if (this.$siteLogo)
      this.$siteLogo.innerText = this.curtSite.substr(0, 1);
  }
}

class Artalk {
  ctx;
  conf;
  $root;
  checkerLauncher;
  editor;
  list;
  sidebar;
  constructor(customConf) {
    this.conf = { ...defaultConf, ...customConf };
    this.conf.server = this.conf.server.replace(/\/$/, "");
    if (!this.conf.pageKey) {
      this.conf.pageKey = `${window.location.protocol}//'${window.location.host}/${window.location.pathname}`;
    }
    try {
      const $root = document.querySelector(this.conf.el);
      if (!$root)
        throw Error(`Sorry, target element "${this.conf.el}" was not found.`);
      this.$root = $root;
    } catch (e) {
      console.error(e);
      throw new Error("Please check your Artalk `el` config.");
    }
    this.ctx = new Context(this.$root, this.conf);
    this.$root.classList.add("artalk");
    this.$root.innerHTML = "";
    this.initDarkMode();
    this.checkerLauncher = new CheckerLauncher(this.ctx);
    this.editor = new Editor(this.ctx);
    this.$root.appendChild(this.editor.$el);
    this.list = new List(this.ctx);
    this.$root.appendChild(this.list.$el);
    this.sidebar = new Sidebar(this.ctx);
    this.$root.appendChild(this.sidebar.$el);
    this.list.reqComments();
    this.initEventBind();
  }
  initEventBind() {
    window.addEventListener("hashchange", () => {
      this.list.checkGoToCommentByUrlHash();
    });
    this.ctx.on("check-admin-show-el", () => {
      const items = [];
      this.$root.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => items.push(item));
      const { $wrap: $layerWrap } = GetLayerWrap(this.ctx);
      if ($layerWrap)
        $layerWrap.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => items.push(item));
      items.forEach(($item) => {
        if (this.ctx.user.data.isAdmin)
          $item.classList.remove("atk-hide");
        else
          $item.classList.add("atk-hide");
      });
    });
    this.ctx.on("user-changed", () => {
      this.ctx.trigger("check-admin-show-el");
      this.ctx.trigger("list-refresh-ui");
    });
  }
  initDarkMode() {
    const darkModeClassName = "atk-dark-mode";
    if (this.conf.darkMode) {
      this.$root.classList.add(darkModeClassName);
    } else {
      this.$root.classList.remove(darkModeClassName);
    }
    const { $wrap: $layerWrap } = GetLayerWrap(this.ctx);
    if ($layerWrap) {
      if (this.conf.darkMode) {
        $layerWrap.classList.add(darkModeClassName);
      } else {
        $layerWrap.classList.remove(darkModeClassName);
      }
    }
  }
  setDarkMode(darkMode) {
    this.ctx.conf.darkMode = darkMode;
    this.initDarkMode();
  }
  on(name, handler) {
    this.ctx.on(name, handler, "external");
  }
  off(name, handler) {
    this.ctx.off(name, handler, "external");
  }
  trigger(name, payload) {
    this.ctx.trigger(name, payload, "external");
  }
}

export { Artalk as default };
