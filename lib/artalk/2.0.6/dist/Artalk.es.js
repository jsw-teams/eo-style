var main = '';

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
  rootEl;
  conf;
  user;
  eventList = [];
  constructor(rootEl, conf) {
    this.cid = +new Date();
    this.rootEl = rootEl;
    this.conf = conf;
    this.user = new User(this.conf);
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

function showLoading(parentElem) {
  if (parentElem instanceof Context)
    parentElem = parentElem.rootEl;
  let loadingEl = parentElem.querySelector(".atk-loading");
  if (!loadingEl) {
    loadingEl = createElement(`
        <div class="atk-loading" style="display: none;">
          <div class="atk-loading-spinner">
          <svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>
          </div>
          </div>`);
    parentElem.appendChild(loadingEl);
  }
  loadingEl.style.display = "";
}
function hideLoading(parentElem) {
  if (parentElem instanceof Context)
    parentElem = parentElem.rootEl;
  const loadingEl = parentElem.querySelector(".atk-loading");
  if (loadingEl)
    loadingEl.style.display = "none";
}
function isVisible(elem) {
  const docViewTop = window.scrollY;
  const docViewBottom = docViewTop + document.documentElement.clientHeight;
  const elemTop = getOffset(elem).top;
  const elemBottom = elemTop + elem.offsetHeight;
  return elemBottom <= docViewBottom && elemTop >= docViewTop;
}
function scrollIntoView(elem, enableAnim = true) {
  if (isVisible(elem))
    return;
  const top = getOffset(elem).top + getHeight(elem) / 2 - document.documentElement.clientHeight / 2;
  if (enableAnim) {
    window.scroll({
      top: top > 0 ? top : 0,
      left: 0,
      behavior: "smooth"
    });
  } else {
    window.scroll(0, top > 0 ? top : 0);
  }
}
function buildDialog(html, onConfirm, onCancel) {
  const dialogElem = createElement(`<div class="atk-layer-dialog-wrap">
      <div class="atk-layer-dialog">
      <div class="atk-layer-dialog-content"></div>
      <div class="atk-layer-dialog-action">
      </div>`);
  const actionElem = dialogElem.querySelector(".atk-layer-dialog-action");
  const onclick = (f) => (evt) => {
    const returnVal = f(evt.currentTarget);
    if (returnVal === void 0 || returnVal === true) {
      dialogElem.remove();
    }
  };
  if (typeof onConfirm === "function") {
    const btn = createElement('<button data-action="confirm">\u786E\u5B9A</button>');
    btn.onclick = onclick(onConfirm);
    actionElem.appendChild(btn);
  }
  if (typeof onCancel === "function") {
    const btn = createElement('<button data-action="cancel">\u53D6\u6D88</button>');
    btn.onclick = onclick(onCancel);
    actionElem.appendChild(btn);
  }
  dialogElem.querySelector(".atk-layer-dialog-content").appendChild(html);
  return dialogElem;
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
    parentElem = parentElem.rootEl;
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

class Component {
  el;
  ctx;
  conf;
  constructor(ctx) {
    this.ctx = ctx;
    this.conf = ctx.conf;
  }
}

const Constant = {
  DARK_MODE_CLASSNAME: "atk-dark-mode"
};

function GetLayerWrap(ctx) {
  let wrapEl = document.querySelector(`.atk-layer-wrap#ctx-${ctx.cid}`);
  if (!wrapEl) {
    wrapEl = createElement(`<div class="atk-layer-wrap" id="ctx-${ctx.cid}" style="display: none;"><div class="atk-layer-mask"></div></div>`);
    document.body.appendChild(wrapEl);
  }
  const maskEl = wrapEl.querySelector(".atk-layer-mask");
  if (wrapEl) {
    if (ctx.conf.darkMode) {
      wrapEl.classList.add(Constant.DARK_MODE_CLASSNAME);
    } else {
      wrapEl.classList.remove(Constant.DARK_MODE_CLASSNAME);
    }
  }
  return { wrapEl, maskEl };
}
function BuildLayer(ctx, name, el) {
  return new Layer(ctx, name, el);
}
class Layer extends Component {
  name;
  wrapEl;
  maskEl;
  maskClickHideEnable = true;
  constructor(ctx, name, el) {
    super(ctx);
    this.name = name;
    const { wrapEl, maskEl } = GetLayerWrap(ctx);
    this.wrapEl = wrapEl;
    this.maskEl = maskEl;
    this.el = this.wrapEl.querySelector(`[data-layer-name="${name}"].atk-layer-item`);
    if (this.el === null) {
      if (!el) {
        this.el = createElement();
        this.el.classList.add("atk-layer-item");
      } else {
        this.el = el;
      }
    }
    this.el.setAttribute("data-layer-name", name);
    this.el.style.display = "none";
    this.wrapEl.append(this.el);
  }
  getName() {
    return this.name;
  }
  getWrapEl() {
    return this.wrapEl;
  }
  getEl() {
    return this.el;
  }
  static hideTimeoutList = [];
  show() {
    Layer.hideTimeoutList.forEach((item) => {
      clearTimeout(item);
    });
    Layer.hideTimeoutList = [];
    this.wrapEl.style.display = "block";
    this.maskEl.style.display = "block";
    this.maskEl.classList.add("atk-fade-in");
    this.el.style.display = "";
    this.maskEl.onclick = () => {
      if (this.maskClickHideEnable)
        this.hide();
    };
    document.body.style.overflow = "hidden";
  }
  hide() {
    Layer.hideTimeoutList.push(window.setTimeout(() => {
      this.wrapEl.style.display = "none";
      document.body.style.overflow = "";
    }, 450));
    this.wrapEl.classList.add("atk-fade-out");
    Layer.hideTimeoutList.push(window.setTimeout(() => {
      this.wrapEl.style.display = "none";
      this.wrapEl.classList.remove("atk-fade-out");
    }, 200));
    this.el.style.display = "none";
  }
  setMaskClickHide(enable) {
    this.maskClickHideEnable = enable;
  }
  disposeNow() {
    document.body.style.overflow = "";
    this.el.remove();
    this.checkCleanLayer();
  }
  dispose() {
    this.hide();
    this.el.remove();
    this.checkCleanLayer();
  }
  checkCleanLayer() {
    if (this.getWrapEl().querySelectorAll(".atk-layer-item").length === 0) {
      this.wrapEl.style.display = "none";
    }
  }
}

async function Fetch(ctx, input, init) {
  if (ctx.user.data.token) {
    const requestHeaders = new Headers();
    requestHeaders.set("Authorization", `Bearer ${ctx.user.data.token}`);
    init.headers = requestHeaders;
  }
  try {
    const resp = await timeoutPromise(ctx.conf.reqTimeout || 15e3, fetch(input, init));
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
      limit: this.ctx.conf.readMore?.pageSize || 15,
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
  async pageGet(siteName) {
    const params = {
      site_name: siteName || ""
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/page-get`, params);
    return d.pages;
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
  async siteEdit(id, data) {
    const params = {
      id,
      name: data.name,
      urls: data.urls
    };
    const d = await POST(this.ctx, `${this.baseURL}/admin/site-edit`, params);
    return d.site;
  }
  siteDel(id, delContent = false) {
    const params = { id, del_content: delContent };
    return POST(this.ctx, `${this.baseURL}/admin/site-del`, params);
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
    return data?.vote_num || 0;
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

const AdminChecker = {
  request: (that, inputVal) => {
    const data = {
      name: that.user.data.nick,
      email: that.user.data.email,
      password: inputVal
    };
    return new Api(that.ctx).login(data.name, data.email, data.password);
  },
  body: () => createElement("<span>\u6572\u5165\u5BC6\u7801\u6765\u9A8C\u8BC1\u7BA1\u7406\u5458\u8EAB\u4EFD\uFF1A</span>"),
  onSuccess: (that, userToken, inputVal, formEl) => {
    that.user.data.isAdmin = true;
    that.user.data.token = userToken;
    that.user.save();
    that.ctx.trigger("user-changed", that.ctx.user.data);
    that.ctx.trigger("list-reload");
  },
  onError: (that, err, inputVal, formEl) => {
  }
};
const CaptchaChecker = {
  request: (that, inputVal) => new Api(that.ctx).captchaCheck(inputVal),
  body: (that) => {
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
  onSuccess: (that, msg, data, inputVal, formEl) => {
    that.submitCaptchaVal = inputVal;
  },
  onError: (that, err, inputVal, formEl) => {
    formEl.querySelector(".atk-captcha-img").click();
  }
};
class Checker {
  ctx;
  user;
  submitCaptchaVal;
  submitCaptchaImgData;
  constructor(ctx) {
    this.ctx = ctx;
    this.user = ctx.user;
    this.ctx.on("checker-captcha", (conf) => {
      if (conf.imgData) {
        this.submitCaptchaImgData = conf.imgData;
      }
      this.check("captcha", conf);
    });
    this.ctx.on("checker-admin", (conf) => {
      this.check("admin", conf);
    });
  }
  check(name, conf) {
    const checker = {
      admin: AdminChecker,
      captcha: CaptchaChecker
    }[name];
    const layer = BuildLayer(this.ctx, `checker-${new Date().getTime()}`);
    layer.setMaskClickHide(false);
    layer.show();
    const formEl = createElement();
    formEl.appendChild(checker.body(this));
    const input = createElement(`<input id="check" type="${name === "admin" ? "password" : "text"}" required placeholder="">`);
    formEl.appendChild(input);
    setTimeout(() => {
      input.focus();
    }, 80);
    input.onkeyup = (evt) => {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        evt.preventDefault();
        layer.getEl().querySelector('button[data-action="confirm"]').click();
      }
    };
    let btnRawText;
    const dialogEl = buildDialog(formEl, (btnElem) => {
      const inputVal = input.value.trim();
      if (!btnRawText) {
        btnRawText = btnElem.innerText;
      }
      const btnTextSet = (btnText) => {
        btnElem.innerText = btnText;
        btnElem.classList.add("error");
      };
      const btnTextRestore = () => {
        btnElem.innerText = btnRawText || "";
        btnElem.classList.remove("error");
      };
      btnElem.innerText = "\u52A0\u8F7D\u4E2D...";
      checker.request(this, inputVal).then((data) => {
        layer.disposeNow();
        if (checker.onSuccess)
          checker.onSuccess(this, data, inputVal, formEl);
        if (conf.onSuccess)
          conf.onSuccess(inputVal, dialogEl);
      }).catch((err) => {
        btnTextSet(String(err.msg || String(err)));
        if (checker.onError)
          checker.onError(this, err, inputVal, formEl);
        const tf = setTimeout(() => {
          btnTextRestore();
        }, 3e3);
        input.onfocus = () => {
          btnTextRestore();
          clearTimeout(tf);
        };
      });
      return false;
    }, () => {
      layer.disposeNow();
      if (conf.onCancel)
        conf.onCancel();
      return false;
    });
    layer.getEl().append(dialogEl);
    if (conf.onMount)
      conf.onMount(dialogEl);
  }
}

var editor = '';

var EditorHTML = "<div class=\"atk-editor\">\n  <div class=\"atk-editor-header\">\n    <input name=\"nick\" placeholder=\"昵称\" class=\"atk-nick\" type=\"text\" required=\"required\">\n    <input name=\"email\" placeholder=\"邮箱\" class=\"atk-email\" type=\"email\" required=\"required\">\n    <input name=\"link\" placeholder=\"网址 (https://)\" class=\"atk-link\" type=\"url\">\n  </div>\n  <div class=\"atk-editor-textarea-wrap\">\n    <div class=\"atk-close-comment\" style=\"display: none;\"><span>仅管理员可评论</span></div>\n    <textarea id=\"atk-editor-textarea\" class=\"atk-editor-textarea\" placeholder=\"\"></textarea>\n  </div>\n  <div class=\"atk-editor-plug-wrap\" style=\"display: none;\"></div>\n  <div class=\"atk-editor-bottom\">\n    <div class=\"atk-editor-bottom-part atk-left atk-editor-plug-switcher-wrap\"></div>\n    <div class=\"atk-editor-bottom-part atk-right\">\n      <button type=\"button\" class=\"atk-send-btn\"></button>\n    </div>\n  </div>\n  <div class=\"atk-editor-notify-wrap\"></div>\n</div>\n";

var EmoticonsPlug$1 = '';

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
  el;
  emoticons;
  listWrapEl;
  typesEl;
  initEl() {
    this.el = createElement(`<div class="atk-editor-plug-emoticons"></div>`);
    this.listWrapEl = createElement(`<div class="atk-emoticons-list-wrap"></div>`);
    this.el.append(this.listWrapEl);
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
    this.el.append(this.typesEl);
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
    return this.el;
  }
  changeListHeight() {
  }
  onShow() {
    setTimeout(() => {
      this.changeListHeight();
    }, 30);
  }
  onHide() {
    this.el.parentElement.style.height = "";
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

var PreviewPlug$1 = '';

class PreviewPlug extends EditorPlug {
  el;
  binded = false;
  constructor(editor) {
    super(editor);
    this.initEl();
  }
  initEl() {
    this.el = createElement('<div class="atk-editor-plug-preview"></div>');
    this.binded = false;
  }
  getName() {
    return "preview";
  }
  getBtnHtml() {
    return '\u9884\u89C8 <i title="Markdown is supported"><svg class="markdown" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg></i>';
  }
  getEl() {
    return this.el;
  }
  onShow() {
    this.updateContent();
    if (!this.binded) {
      const event = () => {
        this.updateContent();
      };
      this.editor.textareaEl.addEventListener("input", event);
      this.editor.textareaEl.addEventListener("change", event);
      this.binded = true;
    }
  }
  onHide() {
  }
  updateContent() {
    if (this.el.style.display !== "none") {
      this.el.innerHTML = this.editor.getContentMarked();
    }
  }
}

class Editor extends Component {
  LOADABLE_PLUG_LIST = [EmoticonsPlug, PreviewPlug];
  plugList = {};
  el;
  headerEl;
  textareaWrapEl;
  textareaEl;
  closeCommentEl;
  plugWrapEl;
  bottomEl;
  bottomPartLeftEl;
  plugSwitcherWrapEl;
  bottomPartRightEl;
  submitBtn;
  notifyWrapEl;
  replyComment = null;
  sendReplyEl = null;
  get user() {
    return this.ctx.user;
  }
  constructor(ctx) {
    super(ctx);
    this.el = createElement(EditorHTML);
    this.headerEl = this.el.querySelector(".atk-editor-header");
    this.textareaWrapEl = this.el.querySelector(".atk-editor-textarea-wrap");
    this.textareaEl = this.el.querySelector(".atk-editor-textarea");
    this.closeCommentEl = this.el.querySelector(".atk-close-comment");
    this.plugWrapEl = this.el.querySelector(".atk-editor-plug-wrap");
    this.bottomEl = this.el.querySelector(".atk-editor-bottom");
    this.bottomPartLeftEl = this.el.querySelector(".atk-editor-bottom-part.atk-left");
    this.plugSwitcherWrapEl = this.el.querySelector(".atk-editor-plug-switcher-wrap");
    this.bottomPartRightEl = this.el.querySelector(".atk-editor-bottom-part.atk-right");
    this.submitBtn = this.el.querySelector(".atk-send-btn");
    this.notifyWrapEl = this.el.querySelector(".atk-editor-notify-wrap");
    this.initLocalStorage();
    this.initHeader();
    this.initTextarea();
    this.initEditorPlug();
    this.initBottomPart();
    this.ctx.on("editor-open", () => this.open());
    this.ctx.on("editor-close", () => this.close());
    this.ctx.on("editor-reply", (commentData) => this.setReply(commentData));
    this.ctx.on("editor-show-loading", () => showLoading(this.el));
    this.ctx.on("editor-hide-loading", () => hideLoading(this.el));
    this.ctx.on("editor-notify", (f) => this.showNotify(f.msg, f.type));
  }
  initLocalStorage() {
    const localContent = window.localStorage.getItem("ArtalkContent") || "";
    if (localContent.trim() !== "") {
      this.showNotify("\u5DF2\u81EA\u52A8\u6062\u590D", "i");
      this.setContent(localContent);
    }
    this.textareaEl.addEventListener("input", () => {
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
    const inputEl = this.headerEl.querySelector(`[name="${field}"]`);
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
    this.textareaEl.placeholder = this.ctx.conf.placeholder || "";
    this.textareaEl.addEventListener("keydown", (e) => {
      const keyCode = e.keyCode || e.which;
      if (keyCode === 9) {
        e.preventDefault();
        this.insertContent("	");
      }
    });
    this.textareaEl.addEventListener("input", (evt) => {
      this.adjustTextareaHeight();
    });
  }
  adjustTextareaHeight() {
    const diff = this.textareaEl.offsetHeight - this.textareaEl.clientHeight;
    this.textareaEl.style.height = "0px";
    this.textareaEl.style.height = `${this.textareaEl.scrollHeight + diff}px`;
  }
  openedPlugName = null;
  initEditorPlug() {
    this.plugList = {};
    this.plugWrapEl.innerHTML = "";
    this.plugWrapEl.style.display = "none";
    this.openedPlugName = null;
    this.plugSwitcherWrapEl.innerHTML = "";
    this.LOADABLE_PLUG_LIST.forEach((PlugObj) => {
      const plug = new PlugObj(this);
      this.plugList[plug.getName()] = plug;
      const btnElem = createElement(`<span class="atk-editor-action atk-editor-plug-switcher">${plug.getBtnHtml()}</span>`);
      this.plugSwitcherWrapEl.appendChild(btnElem);
      btnElem.addEventListener("click", () => {
        this.plugSwitcherWrapEl.querySelectorAll(".active").forEach((item) => item.classList.remove("active"));
        if (plug.getName() === this.openedPlugName) {
          plug.onHide();
          this.plugWrapEl.style.display = "none";
          this.openedPlugName = null;
          return;
        }
        if (this.plugWrapEl.querySelector(`[data-plug-name="${plug.getName()}"]`) === null) {
          const plugEl = plug.getEl();
          plugEl.setAttribute("data-plug-name", plug.getName());
          plugEl.style.display = "none";
          this.plugWrapEl.appendChild(plugEl);
        }
        Array.from(this.plugWrapEl.children).forEach((plugItemEl) => {
          const plugItemName = plugItemEl.getAttribute("data-plug-name");
          if (plugItemName === plug.getName()) {
            plugItemEl.style.display = "";
            this.plugList[plugItemName].onShow();
          } else {
            plugItemEl.style.display = "none";
            this.plugList[plugItemName].onHide();
          }
        });
        this.plugWrapEl.style.display = "";
        this.openedPlugName = plug.getName();
        btnElem.classList.add("active");
      });
    });
  }
  closePlug() {
    this.plugWrapEl.innerHTML = "";
    this.plugWrapEl.style.display = "none";
    this.openedPlugName = null;
  }
  insertContent(val) {
    if (document.selection) {
      this.textareaEl.focus();
      document.selection.createRange().text = val;
      this.textareaEl.focus();
    } else if (this.textareaEl.selectionStart || this.textareaEl.selectionStart === 0) {
      const sStart = this.textareaEl.selectionStart;
      const sEnd = this.textareaEl.selectionEnd;
      const sT = this.textareaEl.scrollTop;
      this.setContent(this.textareaEl.value.substring(0, sStart) + val + this.textareaEl.value.substring(sEnd, this.textareaEl.value.length));
      this.textareaEl.focus();
      this.textareaEl.selectionStart = sStart + val.length;
      this.textareaEl.selectionEnd = sStart + val.length;
      this.textareaEl.scrollTop = sT;
    } else {
      this.textareaEl.focus();
      this.textareaEl.value += val;
    }
  }
  setContent(val) {
    this.textareaEl.value = val;
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
    return this.textareaEl.value || "";
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
    this.sendReplyEl = null;
  }
  setReply(commentData) {
    if (this.replyComment !== null) {
      this.cancelReply();
    }
    if (this.sendReplyEl === null) {
      this.sendReplyEl = createElement('<div class="atk-send-reply-wrap"><div class="atk-send-reply">\u56DE\u590D <span class="atk-text"></span><span class="atk-cancel" title="\u53D6\u6D88 AT">\xD7</span></div></div>');
      this.sendReplyEl.querySelector(".atk-text").innerText = `@${commentData.nick}`;
      this.sendReplyEl.addEventListener("click", () => {
        this.cancelReply();
      });
      this.textareaWrapEl.prepend(this.sendReplyEl);
    }
    this.replyComment = commentData;
    scrollIntoView(this.el);
    this.textareaEl.focus();
  }
  cancelReply() {
    if (this.sendReplyEl !== null) {
      this.sendReplyEl.remove();
      this.sendReplyEl = null;
    }
    this.replyComment = null;
  }
  initSubmit() {
    this.submitBtn.innerText = this.ctx.conf.sendBtn || "Send";
    this.submitBtn.addEventListener("click", (evt) => {
      evt.currentTarget;
      this.submit();
    });
  }
  async submit() {
    if (this.getContent().trim() === "") {
      this.textareaEl.focus();
      return;
    }
    this.ctx.trigger("editor-submit");
    showLoading(this.el);
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
      hideLoading(this.el);
    }
  }
  showNotify(msg, type) {
    showNotify(this.notifyWrapEl, msg, type);
  }
  close() {
    this.closeCommentEl.style.display = "";
    if (!this.user.data.isAdmin) {
      this.textareaEl.style.display = "none";
      this.closePlug();
      this.bottomEl.style.display = "none";
    } else {
      this.textareaEl.style.display = "";
      this.bottomEl.style.display = "";
    }
  }
  open() {
    this.closeCommentEl.style.display = "none";
    this.textareaEl.style.display = "";
    this.bottomEl.style.display = "";
  }
}

var list = '';

var ListHTML = "<div class=\"atk-list\">\n  <div class=\"atk-list-header\">\n    <div class=\"atk-comment-count\">\n      <span class=\"atk-comment-count-num\">0</span>\n      条评论\n    </div>\n    <div class=\"atk-right-action\">\n      <span data-action=\"admin-close-comment\" class=\"atk-hide\" atk-only-admin-show>关闭评论</span>\n      <span data-action=\"open-admin-panel\" class=\"atk-hide atk-on\" atk-only-admin-show>控制台</span>\n      <span data-action=\"open-sidebar\" class=\"atk-hide atk-on\">\n        <span class=\"atk-unread-badge\" style=\"display: none;\"></span>\n        通知中心\n      </span>\n    </div>\n  </div>\n  <div class=\"atk-list-body\"></div>\n  <div class=\"atk-list-footer\">\n    <div class=\"atk-copyright\"></div>\n  </div>\n</div>\n";

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

var CommentHTML = "<div class=\"atk-comment-wrap\" data-comment-id=\"\">\n  <div class=\"atk-comment\">\n\n    <div class=\"atk-avatar\">\n      <a target=\"_blank\"><img src=\"\"></a>\n    </div>\n\n    <div class=\"atk-comment-main\">\n\n      <div class=\"atk-header\">\n        <span class=\"atk-nick\"><a target=\"_blank\"></a></span>\n        <span class=\"atk-badge\"></span>\n        <span class=\"atk-date\"></span>\n        <span class=\"atk-ua ua-browser\"></span>\n        <span class=\"atk-ua ua-os\"></span>\n      </div>\n\n      <div class=\"atk-body\">\n        <div class=\"atk-content\"></div>\n      </div>\n\n      <div class=\"atk-footer\">\n        <div class=\"atk-comment-actions\"></div>\n      </div>\n\n    </div>\n\n  </div>\n</div>\n";

class Comment extends Component {
  data;
  mainEl;
  bodyEl;
  contentEl;
  childrenEl;
  actionsEl;
  parent;
  nestedNum;
  maxNestingNum;
  children = [];
  replyTo;
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
  renderElem() {
    this.el = createElement(CommentHTML);
    this.mainEl = this.el.querySelector(".atk-comment-main");
    this.bodyEl = this.el.querySelector(".atk-body");
    this.contentEl = this.bodyEl.querySelector(".atk-content");
    this.actionsEl = this.el.querySelector(".atk-comment-actions");
    this.childrenEl = null;
    if (this.unread)
      this.el.classList.add("atk-unread");
    else
      this.el.classList.remove("atk-unread");
    if (this.openable) {
      this.el.classList.add("atk-openable");
    } else {
      this.el.classList.remove("atk-openable");
    }
    this.el.addEventListener("click", (evt) => {
      if (this.openable && this.openURL) {
        evt.preventDefault();
        window.open(this.openURL);
      }
      if (this.openEvt)
        this.openEvt();
    });
    this.el.setAttribute("data-comment-id", `${this.data.id}`);
    this.el.querySelector(".atk-avatar a").setAttribute("href", this.data.link);
    this.el.querySelector(".atk-avatar img").setAttribute("src", this.getGravatarUrl());
    const nickEl = this.el.querySelector(".atk-nick > a");
    nickEl.innerText = this.data.nick;
    nickEl.href = this.data.link;
    const badgeEl = this.el.querySelector(".atk-badge");
    if (this.data.badge_name) {
      badgeEl.innerText = this.data.badge_name;
      if (this.data.badge_color)
        badgeEl.style.backgroundColor = this.data.badge_color;
    } else {
      badgeEl.remove();
    }
    const dateEL = this.el.querySelector(".atk-date");
    dateEL.innerText = this.getDateFormatted();
    dateEL.setAttribute("data-atk-comment-date", String(+new Date(this.data.date)));
    this.el.querySelector(".atk-ua.ua-browser").innerText = this.getUserUaBrowser();
    this.el.querySelector(".atk-ua.ua-os").innerText = this.getUserUaOS();
    if (!this.data.is_collapsed) {
      this.contentEl.innerHTML = this.getContentMarked();
    } else {
      this.contentEl.classList.add("atk-hide", "atk-type-collapsed");
      const collapsedInfoEl = createElement(`
      <div class="atk-collapsed">
        <span class="atk-text">\u8BE5\u8BC4\u8BBA\u5DF2\u88AB\u7CFB\u7EDF\u6216\u7BA1\u7406\u5458\u6298\u53E0</span>
        <span class="atk-show-btn">\u67E5\u770B\u5185\u5BB9</span>
      </div>`);
      this.bodyEl.insertAdjacentElement("beforeend", collapsedInfoEl);
      const contentShowBtn = collapsedInfoEl.querySelector(".atk-show-btn");
      contentShowBtn.addEventListener("click", (e) => {
        if (this.contentEl.classList.contains("atk-hide")) {
          this.contentEl.innerHTML = this.getContentMarked();
          this.contentEl.classList.remove("atk-hide");
          playFadeInAnim(this.contentEl);
          contentShowBtn.innerHTML = "\u6536\u8D77\u5185\u5BB9";
        } else {
          this.contentEl.innerHTML = "";
          this.contentEl.classList.add("atk-hide");
          contentShowBtn.innerHTML = "\u67E5\u770B\u5185\u5BB9";
        }
        e.stopPropagation();
      });
    }
    if (this.replyTo) {
      const replyToEl = createElement(`
      <div class="atk-reply-to">
        <div class="atk-meta">\u56DE\u590D <span class="atk-nick"></span>:</div>
        <div class="atk-content"></div>
      </div>`);
      replyToEl.querySelector(".atk-nick").innerText = `@${this.replyTo.nick}`;
      let replyContent = marked(this.ctx, this.replyTo.content);
      if (this.replyTo.is_collapsed)
        replyContent = "[\u5DF2\u6298\u53E0]";
      replyToEl.querySelector(".atk-content").innerHTML = replyContent;
      this.bodyEl.prepend(replyToEl);
    }
    if (this.data.is_pending) {
      const pendingEl = createElement(`<div class="atk-pending">\u5BA1\u6838\u4E2D\uFF0C\u4EC5\u672C\u4EBA\u53EF\u89C1\u3002</div>`);
      this.bodyEl.prepend(pendingEl);
    }
    this.initActionBtn();
    if (this.afterRender)
      this.afterRender();
    return this.el;
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
  refreshUI() {
    const originalEl = this.el;
    const newEl = this.renderElem();
    originalEl.replaceWith(newEl);
    this.playFadeInAnim();
    this.eachComment(this.children, (child) => {
      child.parent?.getChildrenEl().appendChild(child.renderElem());
      child.playFadeInAnim();
    });
    this.ctx.trigger("comments-loaded");
  }
  initActionBtn() {
    const voteBtnUp = createElement(`<span></span>`);
    const voteBtnDown = createElement(`<span></span>`);
    this.actionsEl.append(voteBtnUp);
    this.actionsEl.append(voteBtnDown);
    const refreshVote = () => {
      voteBtnUp.innerText = `\u8D5E\u540C (${this.data.vote_up || 0})`;
      voteBtnDown.innerText = `\u53CD\u5BF9 (${this.data.vote_down || 0})`;
    };
    refreshVote();
    voteBtnUp.onclick = (e) => {
      e.stopPropagation();
      new Api(this.ctx).vote(this.data.id, "comment_up").then((num) => {
        this.data.vote_up = num;
        refreshVote();
      }).catch((err) => {
        window.alert(`\u6295\u7968\u5931\u8D25\uFF1A${err.msg || String(err)}`);
      });
    };
    voteBtnDown.onclick = (e) => {
      e.stopPropagation();
      new Api(this.ctx).vote(this.data.id, "comment_down").then((num) => {
        this.data.vote_down = num;
        refreshVote();
      }).catch((err) => {
        window.alert(`\u6295\u7968\u5931\u8D25\uFF1A${err.msg || String(err)}`);
      });
    };
    if (this.data.is_allow_reply) {
      const replyBtn = createElement(`<span data-atk-action="comment-reply">\u56DE\u590D</span>`);
      this.actionsEl.append(replyBtn);
      replyBtn.addEventListener("click", (e) => {
        this.ctx.trigger("editor-reply", this.data);
        e.stopPropagation();
      });
    }
    const collapseBtn = createElement(`<span atk-only-admin-show>${this.data.is_collapsed ? "\u53D6\u6D88\u6298\u53E0" : "\u6298\u53E0"}</span>`);
    this.actionsEl.append(collapseBtn);
    collapseBtn.addEventListener("click", (e) => {
      this.adminEdit("collapsed", collapseBtn);
      e.stopPropagation();
    });
    const pendingBtn = createElement(`<span atk-only-admin-show>${this.data.is_pending ? "\u5F85\u5BA1" : "\u5DF2\u5BA1"}</span>`);
    this.actionsEl.append(pendingBtn);
    pendingBtn.addEventListener("click", (e) => {
      this.adminEdit("pending", pendingBtn);
      e.stopPropagation();
    });
    const delBtn = createElement(`<span atk-only-admin-show>\u5220\u9664</span>`);
    this.actionsEl.append(delBtn);
    delBtn.addEventListener("click", (e) => {
      this.adminDelete(delBtn);
      e.stopPropagation();
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
    if (this.childrenEl === null) {
      if (this.nestedNum < this.maxNestingNum) {
        this.childrenEl = createElement('<div class="atk-comment-children"></div>');
        this.mainEl.appendChild(this.childrenEl);
      } else if (this.parent) {
        this.childrenEl = this.parent.getChildrenEl();
      }
    }
    return this.childrenEl;
  }
  getParent() {
    return this.parent;
  }
  getEl() {
    return this.el;
  }
  getData() {
    return this.data;
  }
  getGravatarUrl() {
    return `${this.ctx.conf.gravatar?.cdn || ""}${this.data.email_encrypted}?d=${encodeURIComponent(this.ctx.conf.defaultAvatar || "")}&s=80`;
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
    playFadeInAnim(this.el);
  }
  adminEdit(type, btnElem) {
    if (btnElem.classList.contains("atk-in-process"))
      return;
    const btnTextOrg = btnElem.innerText;
    btnElem.classList.add("atk-in-process");
    btnElem.innerText = "\u4FEE\u6539\u4E2D...";
    if (type === "collapsed") {
      this.data.is_collapsed = !this.data.is_collapsed;
    } else if (type === "pending") {
      this.data.is_pending = !this.data.is_pending;
    }
    new Api(this.ctx).commentEdit(this.data).then((comment) => {
      btnElem.classList.remove("atk-in-process");
      this.data = comment;
      this.refreshUI();
      playFadeInAnim(this.bodyEl);
      this.ctx.trigger("list-refresh-ui");
    }).catch((err) => {
      console.error(err);
      btnElem.classList.add("atk-error");
      btnElem.innerText = "\u4FEE\u6539\u5931\u8D25";
      setTimeout(() => {
        btnElem.innerText = btnTextOrg;
        btnElem.classList.remove("atk-error");
        btnElem.classList.remove("atk-in-process");
      }, 2e3);
    });
  }
  onDelete;
  adminDelete(btnElem) {
    if (btnElem.classList.contains("atk-in-process"))
      return;
    const btnClicked = Number(btnElem.getAttribute("data-btn-clicked") || 1);
    if (btnClicked < 2) {
      if (btnClicked === 1) {
        const btnTextOrg2 = btnElem.innerText;
        btnElem.innerText = "\u786E\u8BA4\u5220\u9664";
        setTimeout(() => {
          btnElem.innerText = btnTextOrg2;
          btnElem.setAttribute("data-btn-clicked", "");
        }, 2e3);
        btnElem.setAttribute("data-btn-clicked", String(btnClicked + 1));
      }
      return;
    }
    const btnTextOrg = btnElem.innerText;
    btnElem.classList.add("atk-in-process");
    btnElem.innerText = "\u5220\u9664\u4E2D...";
    new Api(this.ctx).commentDel(this.data.id, this.data.site_name).then(() => {
      btnElem.innerText = btnTextOrg;
      btnElem.classList.remove("atk-in-process");
      if (this.onDelete)
        this.onDelete(this);
    }).catch((e) => {
      console.error(e);
      btnElem.classList.add("atk-error");
      btnElem.innerText = "\u5220\u9664\u5931\u8D25";
      setTimeout(() => {
        btnElem.innerText = btnTextOrg;
        btnElem.classList.remove("atk-error");
        btnElem.classList.remove("atk-in-process");
      }, 2e3);
    });
  }
  setUnread(val) {
    this.unread = val;
    if (this.unread)
      this.el.classList.add("atk-unread");
    else
      this.el.classList.remove("atk-unread");
  }
  setOpenURL(url) {
    if (!url) {
      this.openable = false;
      this.el.classList.remove("atk-openable");
    }
    this.openable = true;
    this.openURL = url;
    this.el.classList.add("atk-openable");
  }
}

class ListLite extends Component {
  el;
  commentsWrapEl;
  comments = [];
  data;
  pageSize = 15;
  offset = 0;
  type;
  readMoreEl;
  readMoreLoadingEl;
  readMoreTextEl;
  noCommentText;
  renderComment;
  paramsEditor;
  onAfterLoad;
  isLoading = false;
  isFirstLoad = true;
  flatMode;
  unread = [];
  unreadHighlight = false;
  constructor(ctx) {
    super(ctx);
    this.el = createElement(`
    <div class="atk-list-lite">
      <div class="atk-list-comments-wrap"></div>
      <div class="atk-list-read-more" style="display: none;">
        <div class="atk-loading-icon" style="display: none;"></div>
        <span class="atk-text">\u67E5\u770B\u66F4\u591A</span>
      </div>
    </div>
    `);
    this.commentsWrapEl = this.el.querySelector(".atk-list-comments-wrap");
    this.pageSize = this.conf.readMore ? this.conf.readMore.pageSize || this.pageSize : this.pageSize;
    this.readMoreEl = this.el.querySelector(".atk-list-read-more");
    this.readMoreLoadingEl = this.readMoreEl.querySelector(".atk-loading-icon");
    this.readMoreTextEl = this.readMoreEl.querySelector(".atk-text");
    this.readMoreEl.addEventListener("click", () => {
      this.readMore();
    });
    this.noCommentText = this.conf.noComment || "\u65E0\u8BC4\u8BBA";
    setInterval(() => {
      this.el.querySelectorAll("[data-atk-comment-date]").forEach((el) => {
        const date = el.getAttribute("data-atk-comment-date");
        el.innerText = timeAgo(new Date(Number(date)));
      });
    }, 30 * 1e3);
    this.ctx.on("unread-update", (data) => this.updateUnread(data.notifies));
  }
  async reqComments(offset = 0) {
    if (offset === 0) {
      this.clearComments();
    }
    this.isLoading = true;
    this.ctx.trigger("comments-load");
    if (offset === 0)
      showLoading(this.el);
    else
      this.readMoreBtnSetLoading(true);
    const hideLoading$1 = () => {
      this.isLoading = false;
      if (offset === 0)
        hideLoading(this.el);
      else
        this.readMoreBtnSetLoading(false);
    };
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
      this.onLoad(listData);
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
  onLoad(data) {
    this.data = data;
    setError(this.el, null);
    this.importComments(data.comments);
    if (this.hasMoreComments) {
      this.showReadMoreBtn();
    } else {
      this.hideReadMoreBtn();
    }
    if (this.isFirstLoad && this.hasMoreComments) {
      this.initScrollBottomAutoLoad();
    }
    this.ctx.trigger("unread-update", { notifies: data.unread || [] });
    this.isFirstLoad = false;
  }
  onError(msg) {
    msg = String(msg);
    console.error(msg);
    if (this.isFirstLoad) {
      const errEl = createElement(`<span>${msg}\uFF0C\u65E0\u6CD5\u83B7\u53D6\u8BC4\u8BBA\u5217\u8868\u6570\u636E<br/></span>`);
      const retryBtn = createElement('<span style="cursor:pointer;">\u70B9\u51FB\u91CD\u65B0\u83B7\u53D6</span>');
      retryBtn.onclick = () => {
        this.reqComments(0);
      };
      errEl.appendChild(retryBtn);
      const adminBtn = createElement('<span atk-only-admin-show> | <span style="cursor:pointer;">\u6253\u5F00\u63A7\u5236\u53F0</span></span>');
      adminBtn.onclick = () => {
        this.ctx.trigger("sidebar-show", { viewName: "admin" });
      };
      if (!this.ctx.user.data.isAdmin) {
        adminBtn.classList.add("atk-hide");
      }
      errEl.appendChild(adminBtn);
      setError(this.el, errEl);
    } else {
      this.readMoreBtnShowErr(`${msg} \u83B7\u53D6\u5931\u8D25`);
    }
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
        childC.renderElem();
        parentC.putChild(childC);
        queryImportChildren(childC);
      });
    };
    if (!this.flatMode) {
      rawData.filter((o) => o.rid === 0).forEach((rootCommentData) => {
        if (rootCommentData.is_collapsed)
          rootCommentData.is_allow_reply = false;
        const rootComment = this.createComment(rootCommentData);
        rootComment.renderElem();
        this.comments.push(rootComment);
        this.commentsWrapEl.appendChild(rootComment.getEl());
        rootComment.playFadeInAnim();
        queryImportChildren(rootComment);
      });
    } else {
      rawData.forEach((commentData) => {
        this.putCommentFlatMode(commentData, rawData, "append");
      });
    }
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
    comment.renderElem();
    if (insertMode === "append") {
      this.comments.push(comment);
    } else {
      this.comments.unshift(comment);
    }
    if (commentItem.visible) {
      if (insertMode === "append") {
        this.commentsWrapEl.appendChild(comment.getEl());
      } else {
        this.commentsWrapEl.prepend(comment.getEl());
      }
      comment.playFadeInAnim();
    }
  }
  insertComment(commentData) {
    if (!this.flatMode) {
      const comment = this.createComment(commentData);
      comment.renderElem();
      if (commentData.rid !== 0) {
        this.findComment(commentData.rid)?.putChild(comment);
      } else {
        this.commentsWrapEl.prepend(comment.getEl());
        this.comments.unshift(comment);
      }
      scrollIntoView(comment.getEl());
      comment.playFadeInAnim();
    } else {
      this.putCommentFlatMode(commentData, this.comments.map((c) => c.data), "prepend");
    }
    if (this.data)
      this.data.total += 1;
    this.refreshUI();
    this.ctx.trigger("comments-loaded");
  }
  refreshUI() {
    const noComment = this.comments.length <= 0;
    let noCommentEl = this.commentsWrapEl.querySelector(".atk-list-no-comment");
    if (noComment) {
      if (!noCommentEl) {
        noCommentEl = createElement('<div class="atk-list-no-comment"></div>');
        this.commentsWrapEl.appendChild(noCommentEl);
        noCommentEl.innerHTML = this.noCommentText;
      }
    }
    if (!noComment && noCommentEl)
      noCommentEl.remove();
    this.ctx.trigger("check-admin-show-el");
  }
  getListCommentCount() {
    if (!this.data || !this.data.total)
      return 0;
    return Number(this.data.total || "0");
  }
  get hasMoreComments() {
    if (!this.data)
      return false;
    return this.data.total_parents > this.offset + this.pageSize;
  }
  async readMore() {
    const offset = this.offset + this.pageSize;
    await this.reqComments(offset);
  }
  showReadMoreBtn() {
    this.readMoreEl.style.display = "";
  }
  hideReadMoreBtn() {
    this.readMoreEl.style.display = "none";
  }
  readMoreBtnSetLoading(isLoading) {
    this.readMoreLoadingEl.style.display = isLoading ? "" : "none";
    this.readMoreTextEl.style.display = isLoading ? "none" : "";
  }
  readMoreBtnShowErr(errMsg) {
    this.readMoreBtnSetLoading(false);
    const readMoreTextOrg = this.readMoreTextEl.innerText;
    this.readMoreTextEl.innerText = errMsg;
    this.readMoreEl.classList.add("atk-err");
    setTimeout(() => {
      this.readMoreTextEl.innerText = readMoreTextOrg;
      this.readMoreEl.classList.remove("atk-err");
    }, 2e3);
  }
  initScrollBottomAutoLoad() {
    if (!this.conf.readMore)
      return;
    if (!this.conf.readMore.autoLoad)
      return;
    document.addEventListener("scroll", () => {
      const targetEl = this.el.querySelector(".atk-list-comments-wrap > .atk-comment-wrap:nth-last-child(3)");
      if (!targetEl)
        return;
      if (!this.hasMoreComments)
        return;
      if (this.isLoading)
        return;
      if (isVisible(targetEl)) {
        this.readMore();
      }
    });
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
  }
  clearComments() {
    this.commentsWrapEl.innerHTML = "";
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
    const needUpdate = versionCompare(needVersion, "2.0.6") === 1;
    if (needUpdate) {
      const errEl = createElement(`<div>\u524D\u7AEF Artalk \u7248\u672C\u5DF2\u8FC7\u65F6\uFF0C\u8BF7\u66F4\u65B0\u4EE5\u83B7\u5F97\u5B8C\u6574\u4F53\u9A8C<br/>\u82E5\u60A8\u662F\u7AD9\u70B9\u7BA1\u7406\u5458\uFF0C\u8BF7\u524D\u5F80 \u201C<a href="https://artalk.js.org/" target="_blank">\u5B98\u65B9\u6587\u6863</a>\u201D \u83B7\u53D6\u5E2E\u52A9<br/><br/><span style="color: var(--at-color-meta);">\u524D\u7AEF\u7248\u672C ${"2.0.6"}\uFF0C\u9700\u6C42\u7248\u672C >= ${needVersion}</span><br/><br/></div>`);
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
  closeCommentBtnEl;
  openSidebarBtnEl;
  openAdminPanelBtnEl;
  unreadBadgeEl;
  constructor(ctx) {
    super(ctx);
    const el = createElement(ListHTML);
    el.querySelector(".atk-list-body").append(this.el);
    this.el = el;
    this.flatMode = this.ctx.conf.flatMode || false;
    this.initListActionBtn();
    this.el.querySelector(".atk-copyright").innerHTML = `Powered By <a href="https://artalk.js.org" target="_blank" title="Artalk v${"2.0.6"}">Artalk</a>`;
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
  refreshUI() {
    super.refreshUI();
    this.el.querySelector(".atk-comment-count-num").innerText = String(this.getListCommentCount());
    if (!!this.ctx.user.data.nick && !!this.ctx.user.data.email) {
      this.openSidebarBtnEl.classList.remove("atk-hide");
    } else {
      this.openSidebarBtnEl.classList.add("atk-hide");
    }
    this.ctx.trigger("check-admin-show-el");
    if (!!this.data && !!this.data.page && this.data.page.admin_only === true) {
      this.ctx.trigger("editor-close");
      this.closeCommentBtnEl.innerHTML = "\u6253\u5F00\u8BC4\u8BBA";
    } else {
      this.ctx.trigger("editor-open");
      this.closeCommentBtnEl.innerHTML = "\u5173\u95ED\u8BC4\u8BBA";
    }
  }
  onLoad(data) {
    super.onLoad(data);
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
    const comment = this.findComment(commentId);
    if (!comment) {
      if (this.hasMoreComments) {
        await this.readMore();
      }
    }
    if (!comment)
      return;
    scrollIntoView(comment.getEl(), false);
    setTimeout(() => {
      comment.getEl().classList.add("atk-flash-once");
      const notifyKey = getQueryParam("atk_notify_key");
      if (notifyKey) {
        new Api(this.ctx).markRead(notifyKey).then(() => {
          this.unread = this.unread.filter((o) => o.comment_id !== comment.data.id);
          this.ctx.trigger("unread-update", {
            notifies: this.unread
          });
        });
      }
    }, 800);
  }
  initListActionBtn() {
    this.openSidebarBtnEl = this.el.querySelector('[data-action="open-sidebar"]');
    this.openSidebarBtnEl.addEventListener("click", () => {
      this.ctx.trigger("sidebar-show", { viewName: "message" });
    });
    this.openAdminPanelBtnEl = this.el.querySelector('[data-action="open-admin-panel"]');
    this.openAdminPanelBtnEl.addEventListener("click", () => {
      this.ctx.trigger("sidebar-show", { viewName: "admin" });
    });
    this.closeCommentBtnEl = this.el.querySelector('[data-action="admin-close-comment"]');
    this.closeCommentBtnEl.addEventListener("click", () => {
      if (!this.data)
        return;
      this.data.page.admin_only = !this.data.page.admin_only;
      this.adminPageEditSave();
    });
    this.unreadBadgeEl = this.el.querySelector(".atk-unread-badge");
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
      this.unreadBadgeEl.innerText = `${Number(count || 0)}`;
      this.unreadBadgeEl.style.display = "block";
    } else {
      this.unreadBadgeEl.style.display = "none";
    }
  }
}

var sidebar = '';

var SidebarHTML = "<div class=\"atk-sidebar\">\n  <div class=\"atk-sidebar-inner\">\n    <div class=\"atk-sidebar-title-wrap\"><span class=\"atk-title-item atk-active\"></span></div>\n    <div class=\"atk-sidebar-close\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg></div>\n    <div class=\"atk-sidebar-actions\"></div>\n    <div class=\"atk-sidebar-content\"></div>\n  </div>\n</div>\n";

class SidebarView extends Component {
  constructor(ctx) {
    super(ctx);
    this.el = createElement(`<div class="atk-sidebar-view"></div>`);
  }
  name = "";
  title = this.name;
  actions = {};
  activeAction;
  adminOnly = false;
  init() {
  }
  switch(action) {
  }
}

class MessageView extends SidebarView {
  name = "message";
  title = "\u901A\u77E5\u4E2D\u5FC3";
  actions = {
    mentions: "\u63D0\u53CA",
    all: "\u5168\u90E8",
    mine: "\u6211\u7684",
    pending: "\u5F85\u5BA1"
  };
  activeAction = "";
  list;
  type = "mentions";
  init() {
    this.list = CreateCommentList(this.ctx);
    this.el.innerHTML = "";
    this.el.append(this.list.el);
    this.activeAction = this.type;
    this.switch(this.type);
  }
  switch(action) {
    if (!this.list)
      return;
    this.type = action;
    this.list.type = action;
    this.list.isFirstLoad = true;
    this.list.reqComments();
  }
}
function CreateCommentList(ctx) {
  const list = new ListLite(ctx);
  list.flatMode = true;
  list.unreadHighlight = true;
  list.noCommentText = '<div class="atk-sidebar-no-content">\u65E0\u5185\u5BB9</div>';
  list.renderComment = (comment) => {
    comment.setOpenURL(`${comment.data.page_key}#atk-comment-${comment.data.id}`);
  };
  return list;
}

class AdminView extends SidebarView {
  name = "admin";
  title = "\u63A7\u5236\u53F0";
  actions = {
    comment: "\u8BC4\u8BBA",
    page: "\u9875\u9762",
    site: "\u7AD9\u70B9",
    setting: "\u914D\u7F6E"
  };
  activeAction = "";
  adminOnly = true;
  cListInstance;
  get cList() {
    if (!this.cListInstance)
      this.cListInstance = CreateCommentList(this.ctx);
    return this.cListInstance;
  }
  constructor(ctx) {
    super(ctx);
    this.el = createElement(`<div class="atk-msg-center"></div>`);
  }
  init() {
    this.activeAction = "comment";
    this.switch("comment");
  }
  switch(action) {
    this.el.innerHTML = "";
    if (action === "comment") {
      this.initCommentList();
    } else if (action === "page") {
      this.initPageList();
    } else if (action === "site") {
      this.initSiteList();
    } else if (action === "setting") {
      this.initSetting();
    }
  }
  async initSiteFilterBar(clickEvt) {
    const sitesData = await new Api(this.ctx).siteGet();
    const siteItems = [
      { name: "__ATK_SITE_ALL", label: "\u5168\u90E8\u7AD9\u70B9" }
    ];
    if (sitesData)
      sitesData.forEach((site) => {
        siteItems.push({ name: site.name, label: site.name });
      });
    const filterBarEl = BuildFilterBar(siteItems, (item) => clickEvt(item));
    return filterBarEl;
  }
  async initCommentList() {
    const el = createElement('<div class="atk-admin-comment-list"></div>');
    el.append(this.cList.el);
    const reqComments = (type, siteName) => {
      if (!this.cList)
        return;
      this.cList.type = `admin_${type}`;
      this.cList.isFirstLoad = true;
      this.cList.paramsEditor = (params) => {
        params.site_name = siteName;
      };
      this.cList.reqComments();
    };
    let loaded = false;
    const curt = { typeName: "all", siteName: "" };
    const typeFilterBarEl = BuildFilterBar([
      { name: "all", label: "\u5168\u90E8" },
      { name: "pending", label: "\u5F85\u5BA1" }
    ], (item) => {
      if (!loaded)
        return;
      curt.typeName = item.name;
      reqComments(curt.typeName, curt.siteName);
    });
    el.prepend(typeFilterBarEl);
    const siteFilterBarEl = await this.initSiteFilterBar((item) => {
      curt.siteName = item.name;
      reqComments(curt.typeName, curt.siteName);
    });
    el.prepend(siteFilterBarEl);
    loaded = true;
    this.el.innerHTML = "";
    this.el.append(el);
  }
  async initPageList() {
    const el = createElement('<div class="atk-admin-page-list"></div>');
    const pListEl = createElement(`<div class="atk-sidebar-list"></div>`);
    el.append(pListEl);
    const siteFilterBarEl = await this.initSiteFilterBar((item) => {
      this.reqPages(pListEl, item.name);
    });
    el.prepend(siteFilterBarEl);
    this.el.innerHTML = "";
    this.el.append(el);
  }
  async reqPages(pListEl, siteName) {
    pListEl.innerHTML = "";
    const pages = await new Api(this.ctx).pageGet(siteName);
    if (!pages) {
      pListEl.innerHTML = '<div class="atk-sidebar-no-content">\u65E0\u5185\u5BB9</div>';
      return;
    }
    pages.forEach((page) => {
      const pageItemEl = createElement(`
      <div class="atk-item">
      <div class="atk-title"></div>
      <div class="atk-sub"></div>
      <div class="atk-actions">
        <div class="atk-item" data-action="page-edit-title">\u4FEE\u6539\u6807\u9898</div>
        <div class="atk-item" data-action="page-fetch">\u83B7\u53D6\u6807\u9898</div>
        <div class="atk-item" data-action="page-edit-key">\u4FEE\u6539 KEY</div>
        <div class="atk-item" data-action="page-admin-only"></div>
        <div class="atk-item" data-action="page-del">\u5220\u9664</div>
      </div>
      </div>`);
      pListEl.append(pageItemEl);
      pageItemEl.setAttribute("data-page-id", String(page.id));
      const titleEl = pageItemEl.querySelector(".atk-title");
      const keyEl = pageItemEl.querySelector(".atk-sub");
      titleEl.innerText = page.title || page.key;
      keyEl.innerText = page.key;
      titleEl.onclick = () => {
        window.open(`${page.url}`);
      };
      keyEl.onclick = () => {
        window.open(`${page.url}`);
      };
      const adminOnlyBtn = pageItemEl.querySelector('[data-action="page-admin-only"]');
      const renderAdminOnlyBtn = () => {
        adminOnlyBtn.innerText = page.admin_only ? "\u4EC5\u7BA1\u7406\u5458\u53EF\u8BC4" : "\u6240\u6709\u4EBA\u53EF\u8BC4";
      };
      renderAdminOnlyBtn();
      adminOnlyBtn.onclick = (e) => {
        e.stopPropagation();
        page.admin_only = !page.admin_only;
        new Api(this.ctx).pageEdit(page).then((p) => {
          page = p;
          renderAdminOnlyBtn();
        });
      };
      const editTitleBtn = pageItemEl.querySelector('[data-action="page-edit-title"]');
      editTitleBtn.onclick = () => {
        const val = window.prompt("\u4FEE\u6539\u6807\u9898\uFF1A", page.title);
        if (val !== null) {
          page.title = val;
          new Api(this.ctx).pageEdit(page).then(() => {
            this.reqPages(pListEl, siteName);
          }).catch((err) => {
            window.alert(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
          });
        }
      };
      const fetchBtn = pageItemEl.querySelector('[data-action="page-fetch"]');
      fetchBtn.onclick = () => {
        const btnOrgTxt = fetchBtn.innerText;
        fetchBtn.innerText = "\u83B7\u53D6\u4E2D...";
        new Api(this.ctx).pageFetch(page.id).then((p) => {
          page = p;
          pageItemEl.querySelector(".atk-title").innerText = p.title;
        }).catch((err) => {
          window.alert(`\u83B7\u53D6\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
        }).finally(() => {
          fetchBtn.innerText = btnOrgTxt;
        });
      };
      const editKeyBtn = pageItemEl.querySelector('[data-action="page-edit-key"]');
      editKeyBtn.onclick = () => {
        const val = window.prompt("\u4FEE\u6539 Key\uFF1A", page.key);
        if (val !== null) {
          page.key = val;
          new Api(this.ctx).pageEdit(page).then(() => {
            this.reqPages(pListEl, siteName);
          }).catch((err) => {
            window.alert(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
          });
        }
      };
      const delBtn = pageItemEl.querySelector('[data-action="page-del"]');
      delBtn.onclick = () => {
        const del = () => {
          new Api(this.ctx).pageDel(page.key, page.site_name).then(() => {
            pageItemEl.remove();
          }).catch((err) => {
            window.alert(`\u5220\u9664\u5931\u8D25 ${String(err)}`);
          });
        };
        if (window.confirm(`\u786E\u8BA4\u5220\u9664\u9875\u9762 "${page.title || page.key}"\uFF1F\u5C06\u4F1A\u5220\u9664\u6240\u6709\u76F8\u5173\u6570\u636E`))
          del();
      };
    });
  }
  async initSiteList() {
    const el = createElement('<div class="atk-site-list"></div>');
    const sListEl = createElement(`
    <div class="atk-sidebar-list">
      <div class="atk-site-add atk-form-inline-wrap">
        <input type="text" name="siteAdd_name" placeholder="Name..." />
        <input type="text" name="siteAdd_urls" placeholder="URL..." />
        <button name="siteAdd_submit">Add</button>
      </div>
    </div>
    `);
    el.append(sListEl);
    const siteAddNameEl = sListEl.querySelector('[name="siteAdd_name"]');
    const siteAddUrlsEl = sListEl.querySelector('[name="siteAdd_urls"]');
    sListEl.querySelector('[name="siteAdd_submit"]').onclick = () => {
      const name = siteAddNameEl.value.trim();
      const urls = siteAddUrlsEl.value.trim();
      if (name === "") {
        siteAddNameEl.focus();
        return;
      }
      new Api(this.ctx).siteAdd(name, urls).then(() => {
        this.initSiteList();
      }).catch((err) => {
        window.alert(`\u521B\u5EFA\u5931\u8D25\uFF1A${err.msg || ""}`);
      });
    };
    const sites = await new Api(this.ctx).siteGet();
    if (!sites) {
      el.append(createElement('<div class="atk-sidebar-no-content">\u65E0\u5185\u5BB9</div>'));
      return;
    }
    sites.forEach((site) => {
      const siteItemEl = createElement(`
      <div class="atk-item">
      <div class="atk-title"></div>
      <div class="atk-sub"></div>
      <div class="atk-actions">
        <div class="atk-item" data-action="site-rename">\u91CD\u547D\u540D</div>
        <div class="atk-item" data-action="site-edit-urls">\u4FEE\u6539 URL</div>
        <div class="atk-item" data-action="site-del">\u5220\u9664</div>
      </div>
      </div>`);
      sListEl.append(siteItemEl);
      siteItemEl.setAttribute("data-site-id", String(site.id));
      const nameEl = siteItemEl.querySelector(".atk-title");
      const urlsEl = siteItemEl.querySelector(".atk-sub");
      nameEl.innerText = site.name || site.first_url;
      nameEl.onclick = () => {
        window.open(`${site.first_url}`);
      };
      if (site.urls) {
        site.urls.forEach((u) => {
          const urlItemEl = createElement('<span style="margin-right: 10px;" />');
          urlItemEl.innerText = u;
          urlItemEl.onclick = () => {
            window.open(`${u}`);
          };
          urlsEl.append(urlItemEl);
        });
      }
      const delBtn = siteItemEl.querySelector('[data-action="site-del"]');
      delBtn.onclick = () => {
        const del = () => {
          new Api(this.ctx).siteDel(site.id, true).then(() => {
            siteItemEl.remove();
          }).catch((err) => {
            window.alert(`\u5220\u9664\u5931\u8D25 ${String(err)}`);
          });
        };
        if (window.confirm(`\u786E\u8BA4\u5220\u9664\u7AD9\u70B9 "${site.name || site.first_url}"\uFF1F\u5C06\u4F1A\u5220\u9664\u6240\u6709\u76F8\u5173\u6570\u636E`))
          del();
      };
      const editUrlsBtn = siteItemEl.querySelector('[data-action="site-edit-urls"]');
      editUrlsBtn.onclick = () => {
        const val = window.prompt("\u4FEE\u6539 URL (\u591A\u4E2A URL \u7528\u9017\u53F7\u9694\u5F00):", site.urls_raw);
        if (val !== null) {
          new Api(this.ctx).siteEdit(site.id, { name: site.name, urls: val }).then(() => {
            this.initSiteList();
          }).catch((err) => {
            window.alert(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
          });
        }
      };
      const renameBtn = siteItemEl.querySelector('[data-action="site-rename"]');
      renameBtn.onclick = () => {
        const val = window.prompt("\u7F16\u8F91\u7AD9\u70B9\u540D\u79F0\uFF1A", site.name);
        if (val !== null) {
          new Api(this.ctx).siteEdit(site.id, { name: val, urls: site.urls_raw }).then(() => {
            this.initSiteList();
          }).catch((err) => {
            window.alert(`\u4FEE\u6539\u5931\u8D25\uFF1A${err.msg || "\u672A\u77E5\u9519\u8BEF"}`);
          });
        }
      };
    });
    this.el.innerHTML = "";
    this.el.append(el);
  }
  initSetting() {
    const el = createElement('<div class="atk-admin-setting"></div>');
    const settingEl = createElement(`
    <div class="atk-setting">
    <div class="atk-log-wrap" style="display: none;">
      <div class="atk-log-back-btn">\u8FD4\u56DE</div>
      <div class="atk-log"></div>
    </div>
    <div class="atk-group atk-importer atk-form-wrap">
    <div class="atk-title">\u5BFC\u5165\u8BC4\u8BBA\u6570\u636E</div>
    <div class="atk-label">\u6570\u636E\u7C7B\u578B</div>
    <select name="importer_dataType">
      <option value="artrans">Artrans (\u6570\u636E\u884C\u56CA)</option>
      <option value="artalk_v1">Artalk v1 (PHP \u65E7\u7248)</option>
      <option value="typecho">Typecho</option>
      <option value="wordpress">WordPress</option>
      <option value="disqus">Disqus</option>
      <option value="commento">Commento</option>
      <option value="valine">Valine</option>
      <option value="twikoo">Twikoo</option>
    </select>
    <input type="file" name="importer_dataFile" accept="text/plain,.json" />
    <div class="atk-label">\u76EE\u6807\u7AD9\u70B9\u540D</div>
    <input type="text" name="importer_siteName" />
    <div class="atk-label">\u76EE\u6807\u7AD9\u70B9 URL</div>
    <input type="text" name="importer_siteUrl" />
    <div class="atk-label">\u542F\u52A8\u53C2\u6570</div>
    <textarea name="importer_payload"></textarea>
    <span class="atk-desc">\u542F\u52A8\u53C2\u6570\u8BF7\u67E5\u9605\uFF1A\u201C<a href="https://artalk.js.org/guide/transfer.html" target="_blank">\u6587\u6863 \xB7 \u6570\u636E\u642C\u5BB6</a>\u201D</span>
    <button class="atk-btn" name="importer_submit">\u5BFC\u5165</button>
    </div>
    </div>`);
    el.append(settingEl);
    const formWrapEl = settingEl.querySelector(".atk-form-wrap");
    const logWrapEl = settingEl.querySelector(".atk-log-wrap");
    const logEl = logWrapEl.querySelector(".atk-log");
    const logBackBtnEl = logWrapEl?.querySelector(".atk-log-back-btn");
    logBackBtnEl.onclick = () => {
      logWrapEl.style.display = "none";
      formWrapEl.style.display = "";
    };
    const impDataTypeEl = settingEl.querySelector('[name="importer_dataType"]');
    const impDataFileEl = settingEl.querySelector('[name="importer_dataFile"]');
    const impSiteNameEl = settingEl.querySelector('[name="importer_siteName"]');
    const impSiteUrlEl = settingEl.querySelector('[name="importer_siteUrl"]');
    const impPayloadEl = settingEl.querySelector('[name="importer_payload"]');
    impDataTypeEl.onchange = () => {
      if (["typecho"].includes(impDataTypeEl.value)) {
        impDataFileEl.style.display = "none";
      } else {
        impDataFileEl.style.display = "";
      }
    };
    const impSubmitEl = settingEl.querySelector('[name="importer_submit"]');
    impSubmitEl.onclick = () => {
      const dataType = impDataTypeEl.value.trim();
      const siteName = impSiteNameEl.value.trim();
      const siteUrl = impSiteUrlEl.value.trim();
      const payload = impPayloadEl.value.trim();
      if (dataType === "") {
        window.alert("\u8BF7\u9009\u62E9\u6570\u636E\u7C7B\u578B");
        return;
      }
      const createImportSession = (data) => {
        logWrapEl.style.display = "";
        formWrapEl.style.display = "none";
        const frameName = `f_${+new Date()}`;
        const frame = document.createElement("iframe");
        frame.className = "atk-iframe";
        frame.name = frameName;
        logEl.innerHTML = "";
        logEl.append(frame);
        const formEl = document.createElement("form");
        formEl.style.display = "none";
        formEl.setAttribute("method", "post");
        formEl.setAttribute("action", `${this.ctx.conf.server}/admin/artransfer`);
        formEl.setAttribute("target", frameName);
        let pJSON = {};
        if (payload) {
          try {
            pJSON = JSON.parse(payload);
          } catch (err) {
            window.alert(`Payload JSON \u683C\u5F0F\u6709\u8BEF\uFF1A${String(err)}`);
          }
          if (pJSON instanceof Object) {
            window.alert(`Payload \u9700\u4E3A JSON \u5BF9\u8C61`);
          }
        }
        if (siteName)
          pJSON.t_name = siteName;
        if (siteUrl)
          pJSON.t_url = siteUrl;
        if (data)
          pJSON.json_data = data;
        const formParams = {
          type: dataType,
          payload: JSON.stringify(pJSON),
          token: this.ctx.user.data.token || ""
        };
        Object.entries(formParams).forEach(([key, val]) => {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.value = val;
          formEl.appendChild(hiddenField);
        });
        logWrapEl.append(formEl);
        formEl.submit();
        formEl.remove();
      };
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result);
        createImportSession(data);
      };
      if (impDataFileEl.files?.length) {
        reader.readAsText(impDataFileEl.files[0]);
        return;
      }
      createImportSession();
    };
    this.el.innerHTML = "";
    this.el.append(el);
  }
}
function BuildFilterBar(items, clickEvt) {
  const filterBarEl = createElement(`<div class="atk-filter-bar"></div>`);
  items.forEach((item) => {
    const itemEl = createElement(`<span></span>`);
    filterBarEl.append(itemEl);
    itemEl.innerText = item.label;
    itemEl.addEventListener("click", () => {
      clickEvt(item);
      filterBarEl.querySelectorAll(".atk-active").forEach((el) => el.classList.remove("atk-active"));
      itemEl.classList.add("atk-active");
    });
  });
  filterBarEl.firstChild.click();
  return filterBarEl;
}

class Sidebar extends Component {
  el;
  layer;
  actionsEl;
  contentEl;
  titleWrapEl;
  view;
  action;
  isFirstShow = true;
  viewInstances = {};
  registerViews = [
    MessageView,
    AdminView
  ];
  constructor(ctx) {
    super(ctx);
    this.el = createElement(SidebarHTML);
    this.contentEl = this.el.querySelector(".atk-sidebar-content");
    this.titleWrapEl = this.el.querySelector(".atk-sidebar-title-wrap");
    this.actionsEl = this.el.querySelector(".atk-sidebar-actions");
    this.el.querySelector(".atk-sidebar-close").addEventListener("click", () => {
      this.hide();
    });
    this.ctx.on("sidebar-show", (payload) => this.show(payload?.viewName));
    this.ctx.on("sidebar-hide", () => this.hide());
    this.registerViews.forEach((View) => {
      const viewInstance = new View(this.ctx);
      this.viewInstances[viewInstance.name] = viewInstance;
      viewInstance.el.classList.add(`atk-sidebar-view-${viewInstance.name}`);
      const titleEl = createElement(`
      <span class="atk-title-item" data-name="${viewInstance.name}">${viewInstance.title}</span>
      `);
      if (viewInstance.adminOnly) {
        titleEl.setAttribute("atk-only-admin-show", "");
        if (!this.ctx.user.data.isAdmin)
          titleEl.classList.add("atk-hide");
      }
      this.titleWrapEl.append(titleEl);
      titleEl.addEventListener("click", () => {
        this.switchView(viewInstance);
      });
    });
  }
  show(viewName) {
    this.el.style.transform = "";
    this.layer = BuildLayer(this.ctx, "sidebar", this.el);
    this.layer.show();
    this.contentEl.scrollTo(0, 0);
    setTimeout(() => {
      this.el.style.transform = "translate(0, 0)";
    }, 20);
    if (viewName) {
      this.switchViewByName(viewName);
    }
    if (this.isFirstShow) {
      if (!viewName)
        this.switchViewByName("message");
      this.isFirstShow = false;
    }
  }
  hide() {
    this.el.style.transform = "";
    this.layer?.dispose();
  }
  switchViewByName(viewName) {
    if (!this.viewInstances[viewName]) {
      console.error(`\u672A\u627E\u5230 view: ${viewName}`);
      return;
    }
    this.switchView(this.viewInstances[viewName]);
  }
  switchView(view) {
    this.view = view;
    const titleEl = this.titleWrapEl.querySelector(`[data-name=${view.name}]`);
    this.titleWrapEl.querySelector(".atk-active").innerText = view.title;
    this.titleWrapEl.querySelectorAll(".atk-title-item").forEach((item) => {
      if (!item.classList.contains("atk-active"))
        item.style.display = "";
    });
    titleEl.style.display = "none";
    view.init();
    this.contentEl.innerHTML = "";
    this.contentEl.append(view.el);
    this.actionsEl.innerHTML = "";
    Object.entries(view.actions).forEach(([name, label]) => {
      const actionItemEl = createElement(`<span class="atk-action-item">${label}</span>`);
      this.actionsEl.append(actionItemEl);
      if (view.activeAction === name)
        actionItemEl.classList.add("atk-active");
      actionItemEl.addEventListener("click", () => {
        view.switch(name);
        view.activeAction = name;
        this.actionsEl.querySelectorAll(".atk-active").forEach((item) => {
          item.classList.remove("atk-active");
        });
        actionItemEl.classList.add("atk-active");
      });
    });
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

const defaultOpts = {
  el: "",
  placeholder: "\u6765\u554A\uFF0C\u5FEB\u6D3B\u554A ( \u309C- \u309C)",
  noComment: "\u5FEB\u6765\u6210\u4E3A\u7B2C\u4E00\u4E2A\u8BC4\u8BBA\u7684\u4EBA\u5427~",
  sendBtn: "\u53D1\u9001\u8BC4\u8BBA",
  defaultAvatar: "mp",
  pageKey: "",
  server: "",
  site: "",
  emoticons,
  gravatar: {
    cdn: "https://sdn.geekzu.org/avatar/"
  },
  darkMode: false,
  reqTimeout: 15e3,
  flatMode: false,
  maxNesting: 3,
  versionCheck: true
};
class Artalk {
  ctx;
  conf;
  el;
  contextID = new Date().getTime();
  checker;
  editor;
  list;
  sidebar;
  comments = [];
  constructor(conf) {
    this.conf = { ...defaultOpts, ...conf };
    this.conf.server = this.conf.server.replace(/\/$/, "");
    if (!this.conf.pageKey) {
      this.conf.pageKey = window.location.href.split("#")[0];
    }
    try {
      const el = document.querySelector(this.conf.el);
      if (el === null) {
        throw Error(`Sorry, Target element "${this.conf.el}" was not found.`);
      }
      this.el = el;
    } catch (e) {
      console.error(e);
      throw new Error("Artalk config `el` error");
    }
    this.ctx = new Context(this.el, this.conf);
    this.el.classList.add("artalk");
    this.el.setAttribute("atk-run-id", this.contextID.toString());
    if (this.el.innerHTML.trim() !== "")
      this.el.innerHTML = "";
    this.initDarkMode();
    this.checker = new Checker(this.ctx);
    this.editor = new Editor(this.ctx);
    this.list = new List(this.ctx);
    this.sidebar = new Sidebar(this.ctx);
    this.el.appendChild(this.editor.el);
    this.el.appendChild(this.list.el);
    this.el.appendChild(this.sidebar.el);
    this.list.reqComments();
    window.addEventListener("hashchange", () => {
      this.list.checkGoToCommentByUrlHash();
    });
    this.ctx.on("check-admin-show-el", () => {
      const items = [];
      this.el.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => items.push(item));
      const { wrapEl: layerWrapEl } = GetLayerWrap(this.ctx);
      if (layerWrapEl)
        layerWrapEl.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => items.push(item));
      items.forEach((itemEl) => {
        if (this.ctx.user.data.isAdmin)
          itemEl.classList.remove("atk-hide");
        else
          itemEl.classList.add("atk-hide");
      });
    });
    this.ctx.on("user-changed", () => {
      this.ctx.trigger("check-admin-show-el");
      this.ctx.trigger("list-refresh-ui");
    });
  }
  initDarkMode() {
    if (this.conf.darkMode) {
      this.el.classList.add(Constant.DARK_MODE_CLASSNAME);
    } else {
      this.el.classList.remove(Constant.DARK_MODE_CLASSNAME);
    }
    const { wrapEl: layerWrapEl } = GetLayerWrap(this.ctx);
    if (layerWrapEl) {
      if (this.conf.darkMode) {
        layerWrapEl.classList.add(Constant.DARK_MODE_CLASSNAME);
      } else {
        layerWrapEl.classList.remove(Constant.DARK_MODE_CLASSNAME);
      }
    }
  }
  setDarkMode(darkMode) {
    this.ctx.conf.darkMode = darkMode;
    this.initDarkMode();
  }
  openDarkMode() {
    this.setDarkMode(true);
  }
  closeDarkMode() {
    this.setDarkMode(false);
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
