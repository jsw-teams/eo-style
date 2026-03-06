(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DisqusJS = factory());
})(this, (function () { 'use strict';

  var n$1,l$1,u$1,i$1,o$3,r$2,f$1,e$1,c$1={},s$1=[],a$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,h$1=Array.isArray;function v$1(n,l){for(var u in l)n[u]=l[u];return n}function p$1(n){var l=n.parentNode;l&&l.removeChild(n);}function y(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n$1.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return d$1(l,f,i,o,null)}function d$1(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u$1:r};return null==r&&null!=l$1.vnode&&l$1.vnode(f),f}function k$2(n){return n.children}function b$1(n,l){this.props=n,this.context=l;}function g$2(n,l){if(null==l)return n.__?g$2(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?g$2(n):null}function m$1(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return m$1(n)}}function w$2(n){(!n.__d&&(n.__d=!0)&&i$1.push(n)&&!x$1.__r++||o$3!==l$1.debounceRendering)&&((o$3=l$1.debounceRendering)||r$2)(x$1);}function x$1(){var n,l,u,t,o,r,e,c,s;for(i$1.sort(f$1);n=i$1.shift();)n.__d&&(l=i$1.length,t=void 0,o=void 0,r=void 0,c=(e=(u=n).__v).__e,(s=u.__P)&&(t=[],o=[],(r=v$1({},e)).__v=e.__v+1,L$1(s,e,r,u.__n,void 0!==s.ownerSVGElement,null!=e.__h?[c]:null,t,null==c?g$2(e):c,e.__h,o),M(t,e,o),e.__e!=c&&m$1(e)),i$1.length>l&&i$1.sort(f$1));x$1.__r=0;}function P(n,l,u,t,i,o,r,f,e,a,v){var p,y,_,b,g,m,w,x,P,S,H=0,I=t&&t.__k||s$1,T=I.length,j=T,z=l.length;for(u.__k=[],p=0;p<z;p++)null!=(b=u.__k[p]=null==(b=l[p])||"boolean"==typeof b||"function"==typeof b?null:"string"==typeof b||"number"==typeof b||"bigint"==typeof b?d$1(null,b,null,null,b):h$1(b)?d$1(k$2,{children:b},null,null,null):b.__b>0?d$1(b.type,b.props,b.key,b.ref?b.ref:null,b.__v):b)&&(b.__=u,b.__b=u.__b+1,-1===(x=A(b,I,w=p+H,j))?_=c$1:(_=I[x]||c$1,I[x]=void 0,j--),L$1(n,b,_,i,o,r,f,e,a,v),g=b.__e,(y=b.ref)&&_.ref!=y&&(_.ref&&O(_.ref,null,b),v.push(y,b.__c||g,b)),null!=g&&(null==m&&(m=g),S=!(P=_===c$1||null===_.__v)&&x===w,P?-1==x&&H--:x!==w&&(x===w+1?(H++,S=!0):x>w?j>z-w?(H+=x-w,S=!0):H--:H=x<w&&x==w-1?x-w:0),w=p+H,S=S||x==p&&!P,"function"!=typeof b.type||x===w&&_.__k!==b.__k?"function"==typeof b.type||S?void 0!==b.__d?(e=b.__d,b.__d=void 0):e=g.nextSibling:e=$$1(n,g,e):e=C$1(b,e,n),"function"==typeof u.type&&(u.__d=e)));for(u.__e=m,p=T;p--;)null!=I[p]&&("function"==typeof u.type&&null!=I[p].__e&&I[p].__e==u.__d&&(u.__d=I[p].__e.nextSibling),q$2(I[p],I[p]));}function C$1(n,l,u){for(var t,i=n.__k,o=0;i&&o<i.length;o++)(t=i[o])&&(t.__=n,l="function"==typeof t.type?C$1(t,l,u):$$1(u,t.__e,l));return l}function S(n,l){return l=l||[],null==n||"boolean"==typeof n||(h$1(n)?n.some(function(n){S(n,l);}):l.push(n)),l}function $$1(n,l,u){return null==u||u.parentNode!==n?n.insertBefore(l,null):l==u&&null!=l.parentNode||n.insertBefore(l,u),l.nextSibling}function A(n,l,u,t){var i=n.key,o=n.type,r=u-1,f=u+1,e=l[u];if(null===e||e&&i==e.key&&o===e.type)return u;if(t>(null!=e?1:0))for(;r>=0||f<l.length;){if(r>=0){if((e=l[r])&&i==e.key&&o===e.type)return r;r--;}if(f<l.length){if((e=l[f])&&i==e.key&&o===e.type)return f;f++;}}return -1}function H$1(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||T$2(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||T$2(n,o,l[o],u[o],t);}function I$1(n,l,u){"-"===l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||a$1.test(l)?u:u+"px";}function T$2(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||I$1(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||I$1(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t||n.addEventListener(l,o?z$1:j$1,o):n.removeEventListener(l,o?z$1:j$1,o);else if("dangerouslySetInnerHTML"!==l){if(i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!==l&&"height"!==l&&"href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&"rowSpan"!==l&&"colSpan"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!==l[4]?n.removeAttribute(l):n.setAttribute(l,u));}}function j$1(n){return this.l[n.type+!1](l$1.event?l$1.event(n):n)}function z$1(n){return this.l[n.type+!0](l$1.event?l$1.event(n):n)}function L$1(n,u,t,i,o,r,f,e,c,s){var a,p,y,d,_,g,m,w,x,C,S,$,A,H,I,T=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,r=[e]),(a=l$1.__b)&&a(u);try{n:if("function"==typeof T){if(w=u.props,x=(a=T.contextType)&&i[a.__c],C=a?x?x.props.value:a.__:i,t.__c?m=(p=u.__c=t.__c).__=p.__E:("prototype"in T&&T.prototype.render?u.__c=p=new T(w,C):(u.__c=p=new b$1(w,C),p.constructor=T,p.render=B$2),x&&x.sub(p),p.props=w,p.state||(p.state={}),p.context=C,p.__n=i,y=p.__d=!0,p.__h=[],p._sb=[]),null==p.__s&&(p.__s=p.state),null!=T.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=v$1({},p.__s)),v$1(p.__s,T.getDerivedStateFromProps(w,p.__s))),d=p.props,_=p.state,p.__v=u,y)null==T.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else {if(null==T.getDerivedStateFromProps&&w!==d&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(w,C),!p.__e&&(null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(w,p.__s,C)||u.__v===t.__v)){for(u.__v!==t.__v&&(p.props=w,p.state=p.__s,p.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u);}),S=0;S<p._sb.length;S++)p.__h.push(p._sb[S]);p._sb=[],p.__h.length&&f.push(p);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(w,p.__s,C),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(d,_,g);});}if(p.context=C,p.props=w,p.__P=n,p.__e=!1,$=l$1.__r,A=0,"prototype"in T&&T.prototype.render){for(p.state=p.__s,p.__d=!1,$&&$(u),a=p.render(p.props,p.state,p.context),H=0;H<p._sb.length;H++)p.__h.push(p._sb[H]);p._sb=[];}else do{p.__d=!1,$&&$(u),a=p.render(p.props,p.state,p.context),p.state=p.__s;}while(p.__d&&++A<25);p.state=p.__s,null!=p.getChildContext&&(i=v$1(v$1({},i),p.getChildContext())),y||null==p.getSnapshotBeforeUpdate||(g=p.getSnapshotBeforeUpdate(d,_)),P(n,h$1(I=null!=a&&a.type===k$2&&null==a.key?a.props.children:a)?I:[I],u,t,i,o,r,f,e,c,s),p.base=u.__e,u.__h=null,p.__h.length&&f.push(p),m&&(p.__E=p.__=null);}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=N$1(t.__e,u,t,i,o,r,f,c,s);(a=l$1.diffed)&&a(u);}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l$1.__e(n,u,t);}}function M(n,u,t){for(var i=0;i<t.length;i++)O(t[i],t[++i],t[++i]);l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function N$1(l,u,t,i,o,r,f,e,s){var a,v,y,d=t.props,_=u.props,k=u.type,b=0;if("svg"===k&&(o=!0),null!=r)for(;b<r.length;b++)if((a=r[b])&&"setAttribute"in a==!!k&&(k?a.localName===k:3===a.nodeType)){l=a,r[b]=null;break}if(null==l){if(null===k)return document.createTextNode(_);l=o?document.createElementNS("http://www.w3.org/2000/svg",k):document.createElement(k,_.is&&_),r=null,e=!1;}if(null===k)d===_||e&&l.data===_||(l.data=_);else {if(r=r&&n$1.call(l.childNodes),v=(d=t.props||c$1).dangerouslySetInnerHTML,y=_.dangerouslySetInnerHTML,!e){if(null!=r)for(d={},b=0;b<l.attributes.length;b++)d[l.attributes[b].name]=l.attributes[b].value;(y||v)&&(y&&(v&&y.__html==v.__html||y.__html===l.innerHTML)||(l.innerHTML=y&&y.__html||""));}if(H$1(l,_,d,o,e),y)u.__k=[];else if(P(l,h$1(b=u.props.children)?b:[b],u,t,i,o&&"foreignObject"!==k,r,f,r?r[0]:t.__k&&g$2(t,0),e,s),null!=r)for(b=r.length;b--;)null!=r[b]&&p$1(r[b]);e||("value"in _&&void 0!==(b=_.value)&&(b!==l.value||"progress"===k&&!b||"option"===k&&b!==d.value)&&T$2(l,"value",b,d.value,!1),"checked"in _&&void 0!==(b=_.checked)&&b!==l.checked&&T$2(l,"checked",b,d.checked,!1));}return l}function O(n,u,t){try{"function"==typeof n?n(u):n.current=u;}catch(n){l$1.__e(n,t);}}function q$2(n,u,t){var i,o;if(l$1.unmount&&l$1.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||O(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(n){l$1.__e(n,u);}i.base=i.__P=null,n.__c=void 0;}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&q$2(i[o],u,t||"function"!=typeof n.type);t||null==n.__e||p$1(n.__e),n.__=n.__e=n.__d=void 0;}function B$2(n,l,u){return this.constructor(n,u)}function D$1(u,t,i){var o,r,f,e;l$1.__&&l$1.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],e=[],L$1(t,u=(!o&&i||t).__k=y(k$2,null,[u]),r||c$1,c$1,void 0!==t.ownerSVGElement,!o&&i?[i]:r?null:t.firstChild?n$1.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o,e),M(f,u,e);}function G(n,l){var u={__c:l="__cC"+e$1++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(function(n){n.__e=!0,w$2(n);});},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n$1=s$1.slice,l$1={__e:function(n,l,u,t){for(var i,o,r;l=l.__;)if((i=l.__c)&&!i.__)try{if((o=i.constructor)&&null!=o.getDerivedStateFromError&&(i.setState(o.getDerivedStateFromError(n)),r=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),r=i.__d),r)return i.__E=i}catch(l){n=l;}throw n}},u$1=0,b$1.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=v$1({},this.state),"function"==typeof n&&(n=n(v$1({},u),this.props)),n&&v$1(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),w$2(this));},b$1.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w$2(this));},b$1.prototype.render=k$2,i$1=[],r$2="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,f$1=function(n,l){return n.__v.__b-l.__v.__b},x$1.__r=0,e$1=0;

  var t,r$1,u,i,o$2=0,f=[],c=[],e=l$1.__b,a=l$1.__r,v=l$1.diffed,l=l$1.__c,m=l$1.unmount;function d(t,u){l$1.__h&&l$1.__h(r$1,t,o$2||u),o$2=0;var i=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({__V:c}),i.__[t]}function h(n){return o$2=1,s(B$1,n)}function s(n,u,i){var o=d(t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):B$1(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r$1,!r$1.u)){var f=function(n,t,r){if(!o.__c.__H)return !0;var u=o.__c.__H.__.filter(function(n){return n.__c});if(u.every(function(n){return !n.__N}))return !c||c.call(this,n,t,r);var i=!1;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0);}}),!(!i&&o.__c.props===n)&&(!c||c.call(this,n,t,r))};r$1.u=!0;var c=r$1.shouldComponentUpdate,e=r$1.componentWillUpdate;r$1.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u;}e&&e.call(this,n,t,r);},r$1.shouldComponentUpdate=f;}return o.__N||o.__}function p(u,i){var o=d(t++,3);!l$1.__s&&z(o.__H,i)&&(o.__=u,o.i=i,r$1.__H.__h.push(o));}function _$1(n){return o$2=5,F$1(function(){return {current:n}},[])}function F$1(n,r){var u=d(t++,7);return z(u.__H,r)?(u.__V=n(),u.i=r,u.__h=n,u.__V):u.__}function T$1(n,t){return o$2=8,F$1(function(){return n},t)}function q$1(n){var u=r$1.context[n.__c],i=d(t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value):n.__}function b(){for(var t;t=f.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(k$1),t.__H.__h.forEach(w$1),t.__H.__h=[];}catch(r){t.__H.__h=[],l$1.__e(r,t.__v);}}l$1.__b=function(n){r$1=null,e&&e(n);},l$1.__r=function(n){a&&a(n),t=0;var i=(r$1=n.__c).__H;i&&(u===r$1?(i.__h=[],r$1.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=c,n.__N=n.i=void 0;})):(i.__h.forEach(k$1),i.__h.forEach(w$1),i.__h=[],t=0)),u=r$1;},l$1.diffed=function(t){v&&v(t);var o=t.__c;o&&o.__H&&(o.__H.__h.length&&(1!==f.push(o)&&i===l$1.requestAnimationFrame||((i=l$1.requestAnimationFrame)||j)(b)),o.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==c&&(n.__=n.__V),n.i=void 0,n.__V=c;})),u=r$1=null;},l$1.__c=function(t,r){r.some(function(t){try{t.__h.forEach(k$1),t.__h=t.__h.filter(function(n){return !n.__||w$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],l$1.__e(u,t.__v);}}),l&&l(t,r);},l$1.unmount=function(t){m&&m(t);var r,u=t.__c;u&&u.__H&&(u.__H.__.forEach(function(n){try{k$1(n);}catch(n){r=n;}}),u.__H=void 0,r&&l$1.__e(r,u.__v));};var g$1="function"==typeof requestAnimationFrame;function j(n){var t,r=function(){clearTimeout(u),g$1&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);g$1&&(t=requestAnimationFrame(r));}function k$1(n){var t=r$1,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r$1=t;}function w$1(n){var t=r$1;n.__c=n.__(),r$1=t;}function z(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function B$1(n,t){return "function"==typeof t?t(n):t}

  function g(n,t){for(var e in t)n[e]=t[e];return n}function C(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function w(n){this.props=n;}function x(n,e){function r(n){var t=this.props.ref,r=t==n.ref;return !r&&t&&(t.call?t(null):t.current=null),e?!e(this.props,n)||!r:C(this.props,n)}function u(e){return this.shouldComponentUpdate=r,y(n,e)}return u.displayName="Memo("+(n.displayName||n.name)+")",u.prototype.isReactComponent=!0,u.__f=!0,u}(w.prototype=new b$1).isPureReactComponent=!0,w.prototype.shouldComponentUpdate=function(n,t){return C(this.props,n)||C(this.state,t)};var R=l$1.__b;l$1.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),R&&R(n);};var N="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function k(n){function t(t){var e=g({},t);return delete e.ref,n(e,t.ref||null)}return t.$$typeof=N,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var T=l$1.__e;l$1.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);T(n,t,e,r);};var I=l$1.unmount;function L(n,t,e){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),n.__c.__H=null),null!=(n=g({},n)).__c&&(n.__c.__P===e&&(n.__c.__P=t),n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return L(n,t,e)})),n}function U(n,t,e){return n&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return U(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.insertBefore(n.__e,n.__d),n.__c.__e=!0,n.__c.__P=e)),n}function D(){this.__u=0,this.t=null,this.__b=null;}function F(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function V(){this.u=null,this.o=null;}l$1.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&!0===n.__h&&(n.type=null),I&&I(n);},(D.prototype=new b$1).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=F(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(l):l());};e.__R=i;var l=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=U(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__a:r.__b=null});t=r.t.pop();)t.forceUpdate();}},c=!0===t.__h;r.__u++||c||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i);},D.prototype.componentWillUnmount=function(){this.t=[];},D.prototype.render=function(n,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=L(this.__b,r,o.__O=o.__P);}this.__b=null;}var i=e.__a&&y(k$2,null,n.fallback);return i&&(i.__h=null),[y(k$2,null,e.__a?null:n.children),i]};var W=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2];}};(V.prototype=new b$1).__a=function(n){var t=this,e=F(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),W(t,n,r)):u();};e?e(o):o();}},V.prototype.render=function(n){this.u=null,this.o=new Map;var t=S(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},V.prototype.componentDidUpdate=V.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){W(n,e,t);});};var B="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,H=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Z=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,Y=/[A-Z0-9]/g,$="undefined"!=typeof document,q=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/:/fil|che|ra/).test(n)};b$1.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(b$1.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:n});}});});var K=l$1.event;function Q(){}function X(){return this.cancelBubble}function nn(){return this.defaultPrevented}l$1.event=function(n){return K&&(n=K(n)),n.persist=Q,n.isPropagationStopped=X,n.isDefaultPrevented=nn,n.nativeEvent=n};var en={enumerable:!1,configurable:!0,get:function(){return this.class}},rn=l$1.vnode;l$1.vnode=function(n){"string"==typeof n.type&&function(n){var t=n.props,e=n.type,u={};for(var o in t){var i=t[o];if(!("value"===o&&"defaultValue"in t&&null==i||$&&"children"===o&&"noscript"===e||"class"===o||"className"===o)){var l=o.toLowerCase();"defaultValue"===o&&"value"in t&&null==t.value?o="value":"download"===o&&!0===i?i="":"ondoubleclick"===l?o="ondblclick":"onchange"!==l||"input"!==e&&"textarea"!==e||q(t.type)?"onfocus"===l?o="onfocusin":"onblur"===l?o="onfocusout":Z.test(o)?o=l:-1===e.indexOf("-")&&H.test(o)?o=o.replace(Y,"-$&").toLowerCase():null===i&&(i=void 0):l=o="oninput","oninput"===l&&u[o=l]&&(o="oninputCapture"),u[o]=i;}}"select"==e&&u.multiple&&Array.isArray(u.value)&&(u.value=S(t.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value);})),"select"==e&&null!=u.defaultValue&&(u.value=S(t.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value;})),t.class&&!t.className?(u.class=t.class,Object.defineProperty(u,"className",en)):(t.className&&!t.class||t.class&&t.className)&&(u.class=u.className=t.className),n.props=u;}(n),n.$$typeof=B,rn&&rn(n);};var un=l$1.__r;l$1.__r=function(n){un&&un(n),n.__c;};var on=l$1.diffed;l$1.diffed=function(n){on&&on(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value);};

  var _=0;function o$1(o,e,n,t,f,l){var s,u,a={};for(u in e)"ref"==u?s=e[u]:a[u]=e[u];var i={type:o,props:a,key:n,ref:s,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--_,__source:f,__self:l};if("function"==typeof o&&(s=o.defaultProps))for(u in s)void 0===a[u]&&(a[u]=s[u]);return l$1.vnode&&l$1.vnode(i),i}

  let r=()=>{let[r,l]=h(!1);return p(()=>{l(!0);},[]),r};

  const DisqusJSFooter = /*#__PURE__*/ x(()=>/*#__PURE__*/ o$1("footer", {
          className: "dsqjs-footer-container",
          children: /*#__PURE__*/ o$1("p", {
              className: "dsqjs-footer",
              children: [
                  'Powered by ',
                  /*#__PURE__*/ o$1("a", {
                      className: "dsqjs-disqus-logo",
                      href: "https://disqus.com",
                      target: "_blank",
                      rel: "external nofollow noopener noreferrer"
                  }),
                  ' ',
                  "&",
                  ' ',
                  /*#__PURE__*/ o$1("a", {
                      className: "dsqjs-dsqjs-logo",
                      href: "https://disqusjs.skk.moe",
                      target: "_blank",
                      rel: "noreferrer",
                      children: "DisqusJS"
                  })
              ]
          })
      }));

  var styles = {"dsqjs":"__dsqjs_oc95o1"};

  let o=()=>{};

  function n(n){let m=G(n),l=G(o);return [e=>{let{children:t}=e,[i,c]=h(n);return o$1(m.Provider,{value:i,children:o$1(l.Provider,{value:c,children:t})})},()=>q$1(m),()=>q$1(l),m]}

  const getDisqusJsModeDefaultValue = ()=>{
      if (typeof window !== 'undefined') {
          const value = localStorage.getItem('dsqjs_mode');
          if (value === 'dsqjs' || value === 'disqus') {
              return value;
          }
      }
      return null;
  };
  const [ModeProvider, useMode, useSetModeState] = n(getDisqusJsModeDefaultValue());
  const useSetMode = ()=>{
      const setDisqusJsMode = useSetModeState();
      return T$1((mode)=>{
          setDisqusJsMode(mode);
          void Promise.resolve(()=>{
              if (mode !== null) {
                  localStorage.setItem('dsqjs_mode', mode);
              } else {
                  localStorage.removeItem('dsqjs_mode');
              }
          });
      }, [
          setDisqusJsMode
      ]);
  };

  const [HasErrorProvider, useHasError, useSetHasError] = n(false);

  const DisqusJSLoadMoreCommentsButton = /*#__PURE__*/ x(({ isError, isLoading, ...restProps })=>{
      const text = F$1(()=>{
          if (isError) {
              return '加载失败，请重试';
          }
          if (isLoading) {
              return '正在加载...';
          }
          return '加载更多评论';
      }, [
          isError,
          isLoading
      ]);
      return /*#__PURE__*/ o$1("a", {
          ...restProps,
          id: "dsqjs-load-more",
          className: `dsqjs-load-more ${isError ? 'is-error' : ''}`,
          role: "button",
          children: text
      });
  });
  const DisqusJSForceDisqusModeButton = /*#__PURE__*/ x(({ children })=>{
      const setDisqusJsMode = useSetMode();
      return /*#__PURE__*/ o$1("a", {
          id: "dsqjs-force-disqus",
          className: "dsqjs-msg-btn",
          onClick: ()=>setDisqusJsMode('disqus'),
          children: children
      });
  });
  const DisqusJSReTestModeButton = /*#__PURE__*/ x(({ children })=>{
      const setDisqusJsMode = useSetMode();
      return /*#__PURE__*/ o$1("a", {
          id: "dsqjs-test-disqus",
          className: "dsqjs-msg-btn",
          onClick: ()=>setDisqusJsMode(null),
          children: children
      });
  });
  const DisqusJSForceDisqusJsModeButton = /*#__PURE__*/ x(({ children })=>{
      const setDisqusJsMode = useSetMode();
      return /*#__PURE__*/ o$1("a", {
          id: "dsqjs-force-dsqjs",
          className: "dsqjs-msg-btn",
          onClick: ()=>setDisqusJsMode('dsqjs'),
          children: children
      });
  });
  const DisqusJSRetryButton = /*#__PURE__*/ x(({ children })=>{
      const setDisqusJsHasError = useSetHasError();
      return /*#__PURE__*/ o$1("a", {
          id: "dsqjs-reload-dsqjs",
          className: "dsqjs-msg-btn",
          onClick: ()=>setDisqusJsHasError(false),
          children: children
      });
  });

  const [MessageProvider, useMessage, useSetMessage] = n(null);

  const THREAD_ID = 'disqus_thread';
  const EMBED_SCRIPT_ID = 'dsq-embed-scr';
  const Disqus = /*#__PURE__*/ x(({ shortname, identifier, url, title })=>{
      const setMsg = useSetMessage();
      const [loaded, setLoaded] = h(false);
      p(()=>{
          setMsg(null);
          if (typeof window !== 'undefined') {
              const clearDisqusInstance = ()=>{
                  if (typeof window !== 'undefined') {
                      window.disqus_config = undefined;
                      const scriptEl = document.getElementById(EMBED_SCRIPT_ID);
                      if (scriptEl) {
                          document.head.removeChild(scriptEl);
                          scriptEl.remove();
                      }
                      window.DISQUS?.reset({});
                      try {
                          delete window.DISQUS;
                      } catch  {
                          window.DISQUS = undefined;
                      }
                      const containerEl = document.getElementById(THREAD_ID);
                      if (containerEl) {
                          while(containerEl.hasChildNodes()){
                              if (containerEl.firstChild) {
                                  containerEl.firstChild.remove();
                              }
                          }
                      }
                      document.querySelectorAll('link[href*="disquscdn.com/next"], link[href*="disqus.com/next"], script[src*="disquscdn.com/next/embed"], script[src*="disqus.com/count-data.js"], iframe[title="Disqus"]').forEach((el)=>el.remove());
                  }
              };
              if (window.disqus_shortname !== shortname) {
                  clearDisqusInstance();
              }
              const getDisqusConfig = ()=>{
                  return function() {
                      if (identifier) {
                          this.page.identifier = identifier;
                      }
                      if (url) {
                          this.page.url = url;
                      }
                      if (title) {
                          this.page.title = title;
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
                  window.disqus_shortname = shortname;
                  const scriptEl = document.createElement('script');
                  scriptEl.id = EMBED_SCRIPT_ID;
                  scriptEl.src = `https://${shortname}.disqus.com/embed.js`;
                  scriptEl.async = true;
                  document.head.appendChild(scriptEl);
              }
              return clearDisqusInstance;
          }
      }, [
          shortname,
          identifier,
          url,
          title,
          setMsg
      ]);
      return /*#__PURE__*/ o$1(k$2, {
          children: [
              /*#__PURE__*/ o$1("div", {
                  id: THREAD_ID,
                  children: [
                      "评论完整模式加载中... 如果长时间无法加载，请针对 disq.us | disquscdn.com | disqus.com 启用代理，或切换至",
                      ' ',
                      /*#__PURE__*/ o$1(DisqusJSForceDisqusJsModeButton, {
                          children: "评论基础模式"
                      })
                  ]
              }),
              !loaded && /*#__PURE__*/ o$1("div", {
                  id: "dsqjs-msg",
                  children: [
                      "评论完整模式加载中... 如果长时间无法加载，请针对 disq.us | disquscdn.com | disqus.com 启用代理，或切换至",
                      ' ',
                      /*#__PURE__*/ o$1(DisqusJSForceDisqusJsModeButton, {
                          children: "评论基础模式"
                      })
                  ]
              })
          ]
      });
  });

  const DisqusJSError = /*#__PURE__*/ x(()=>/*#__PURE__*/ o$1("div", {
          id: "dsqjs-msg",
          children: [
              "评论基础模式加载失败，请",
              ' ',
              /*#__PURE__*/ o$1(DisqusJSRetryButton, {
                  children: "重载"
              }),
              ' ',
              "或",
              ' ',
              /*#__PURE__*/ o$1(DisqusJSReTestModeButton, {
                  children: "尝试完整 Disqus 模式"
              })
          ]
      }));
  const DisqusJSCreateThread = /*#__PURE__*/ x(()=>/*#__PURE__*/ o$1("div", {
          id: "dsqjs-msg",
          children: [
              "当前 Thread 尚未创建。是否切换至",
              ' ',
              /*#__PURE__*/ o$1(DisqusJSForceDisqusModeButton, {
                  children: "完整 Disqus 模式"
              }),
              "？"
          ]
      }));
  const DisqusJSNoComment = /*#__PURE__*/ x(({ text })=>/*#__PURE__*/ o$1("p", {
          className: "dsqjs-no-comment",
          children: text
      }));

  function randomInt(min, max) {
      // eslint-disable-next-line no-bitwise -- performance
      return Math.random() * (max - min + 1) + min | 0;
  }
  const disqusJsApiFetcher = (apiKey, url)=>{
      const Url = new URL(url);
      Url.searchParams.set('api_key', apiKey);
      return fetch(Url.href).then((res)=>res.json());
  };
  const getTimeStampFromString = (dateString)=>new Date(dateString).getTime();
  let domParser = null;
  const processCommentMessage = (str)=>{
      const rawHtml = str.replace(/a\.disquscdn\.com/g, 'c.disquscdn.com').replace(/https?:\/\/disq.us\/url\?url=(.+)%3A[\w-]+&amp;cuid=\d+/gm, (_, $1)=>decodeURIComponent($1));
      domParser ||= new DOMParser();
      const doc = domParser.parseFromString(rawHtml, 'text/html');
      // Very basic, but it will do.
      // Any attempt to bypass XSS limitation will be blocked by Disqus' WAF.
      doc.querySelectorAll('script').forEach((script)=>script.remove());
      doc.querySelectorAll('a').forEach((a)=>{
          a.target = '_blank';
          a.rel = 'external noopener nofollow noreferrer';
      });
      return doc.body.innerHTML;
  };
  const timezoneOffset = new Date().getTimezoneOffset();
  const numberPadstart = (num)=>String(num).padStart(2, '0');
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

  const ConfigContext = /*#__PURE__*/ G(null);
  const ConfigProvider = ConfigContext.Provider;
  const useConfig = ()=>{
      const config = q$1(ConfigContext);
      if (!config) {
          throw new TypeError('<ConfigProvider /> is missing');
      }
      return config;
  };

  function DisqusJSPostItem({ comment, children, nesting }) {
      const { admin, adminLabel } = useConfig();
      const profileUrl = comment.author.profileUrl;
      const avatarUrl = processCommentMessage(comment.author.avatar.cache);
      const imgEl = /*#__PURE__*/ o$1("img", {
          alt: comment.author.username,
          src: avatarUrl
      });
      return /*#__PURE__*/ o$1("li", {
          id: `comment-${comment.id}`,
          children: [
              /*#__PURE__*/ o$1("div", {
                  className: "dsqjs-post-item dsqjs-clearfix",
                  children: [
                      /*#__PURE__*/ o$1("div", {
                          className: "dsqjs-post-avatar",
                          children: profileUrl ? /*#__PURE__*/ o$1("a", {
                              href: profileUrl,
                              target: "_blank",
                              rel: "noreferrer noopenner nofollow external",
                              children: imgEl
                          }) : imgEl
                      }),
                      /*#__PURE__*/ o$1("div", {
                          className: "dsqjs-post-body",
                          children: [
                              /*#__PURE__*/ o$1("div", {
                                  className: "dsqjs-post-header",
                                  children: [
                                      profileUrl ? /*#__PURE__*/ o$1("span", {
                                          className: "dsqjs-post-author",
                                          children: /*#__PURE__*/ o$1("a", {
                                              href: profileUrl,
                                              target: "_blank",
                                              rel: "noreferrer noopenner nofollow external",
                                              children: comment.author.name
                                          })
                                      }) : /*#__PURE__*/ o$1("span", {
                                          className: "dsqjs-post-author",
                                          children: comment.author.name
                                      }),
                                      // authorEl admin label
                                      admin === comment.author.username && /*#__PURE__*/ o$1("span", {
                                          className: "dsqjs-admin-badge",
                                          children: adminLabel
                                      }),
                                      ' ',
                                      /*#__PURE__*/ o$1("span", {
                                          className: "dsqjs-bullet"
                                      }),
                                      ' ',
                                      comment.createdAt && /*#__PURE__*/ o$1("span", {
                                          className: "dsqjs-meta",
                                          children: /*#__PURE__*/ o$1("time", {
                                              children: formatDate(comment.createdAt)
                                          })
                                      })
                                  ]
                              }),
                              comment.isDeleted ? /*#__PURE__*/ o$1("div", {
                                  className: "dsqjs-post-content",
                                  children: /*#__PURE__*/ o$1("small", {
                                      children: "此评论已被删除"
                                  })
                              }) : /*#__PURE__*/ o$1("div", {
                                  className: "dsqjs-post-content",
                                  dangerouslySetInnerHTML: {
                                      __html: processCommentMessage(comment.message)
                                  }
                              })
                          ]
                      })
                  ]
              }),
              /*#__PURE__*/ o$1(DisqusJSChildrenPostItems, {
                  children: children,
                  nesting: nesting
              }),
              comment.hasMore && /*#__PURE__*/ o$1("p", {
                  className: "dsqjs-has-more",
                  children: [
                      "切换至 ",
                      /*#__PURE__*/ o$1(DisqusJSForceDisqusModeButton, {
                          children: "完整 Disqus 模式"
                      }),
                      " 显示更多回复"
                  ]
              })
          ]
      });
  }
  function DisqusJSChildrenPostItems({ children, nesting: currentNesting = 1 }) {
      const { nesting: nestingSetting = 4 } = useConfig();
      if (!children || children.length === 0) return null;
      return /*#__PURE__*/ o$1("ul", {
          className: `dsqjs-post-list ${currentNesting < nestingSetting ? 'dsqjs-children' : ''}`,
          children: children.map((comment)=>/*#__PURE__*/ y(DisqusJSPostItem, {
                  ...comment,
                  key: comment.comment.id
              }))
      });
  }
  function createDisqusJSCommentASTItem(comment, allChildrenComments, nesting) {
      return {
          comment,
          children: findChildrenFromComments(allChildrenComments, Number(comment.id), nesting + 1),
          nesting: nesting + 1
      };
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
  const DisqusJSCommentsList = ({ comments })=>{
      const processedComments = F$1(()=>{
          const topLevelComments = [];
          const childComments = [];
          comments.map((comment, i)=>({
                  i,
                  p: comment.parent,
                  d: getTimeStampFromString(comment.createdAt)
              })).sort((a, b)=>a.p && b.p ? a.d - b.d : 0).forEach(({ i })=>{
              (comments[i].parent ? childComments : topLevelComments).push(comments[i]);
          });
          return topLevelComments.map((comment)=>createDisqusJSCommentASTItem(comment, childComments, 0));
      }, [
          comments
      ]);
      return /*#__PURE__*/ o$1("ul", {
          className: "dsqjs-post-list",
          id: "dsqjs-post-container",
          children: processedComments.map((comment)=>/*#__PURE__*/ y(DisqusJSPostItem, {
                  ...comment,
                  key: comment.comment.id
              }))
      });
  };

  // We will try to make the used api key as stable as possible
  // And if React decides to forget some memoized values, it doesn't matter anyway
  const useRandomApiKey = (apiKeys)=>F$1(()=>{
          if (Array.isArray(apiKeys)) {
              return apiKeys[randomInt(0, apiKeys.length - 1)];
          }
          return apiKeys;
      }, [
          apiKeys
      ]);

  const getDisqusJsSortTypeDefaultValue = ()=>{
      if (typeof window !== 'undefined') {
          const value = localStorage.getItem('dsqjs_sort');
          if (value === 'popular' || value === 'asc' || value === 'desc') {
              return value;
          }
      }
      return null;
  };
  const [SortTypeProvider, useSortType, useSetSortType] = n(getDisqusJsSortTypeDefaultValue());

  const DisqusJSSortTypeRadio = ({ sortType, onChange, checked, title, label })=>{
      return /*#__PURE__*/ o$1(k$2, {
          children: [
              /*#__PURE__*/ o$1("input", {
                  className: "dsqjs-order-radio",
                  id: `dsqjs-order-${sortType}`,
                  type: "radio",
                  name: "comment-order",
                  value: sortType,
                  onChange: onChange,
                  checked: checked
              }),
              /*#__PURE__*/ o$1("label", {
                  className: "dsqjs-order-label",
                  htmlFor: `dsqjs-order-${sortType}`,
                  title: title,
                  children: label
              })
          ]
      });
  };
  const DisqusJSSortTypeRadioGroup = /*#__PURE__*/ x(()=>{
      const sortType = useSortType();
      const setSortType = useSetSortType();
      return /*#__PURE__*/ o$1("div", {
          className: "dsqjs-order",
          children: [
              /*#__PURE__*/ o$1(DisqusJSSortTypeRadio, {
                  checked: sortType === 'desc' || sortType === null,
                  sortType: "desc",
                  title: "按从新到旧",
                  label: "最新",
                  onChange: T$1(()=>setSortType('desc'), [
                      setSortType
                  ])
              }),
              /*#__PURE__*/ o$1(DisqusJSSortTypeRadio, {
                  checked: sortType === 'asc',
                  sortType: "asc",
                  title: "按从旧到新",
                  label: "最早",
                  onChange: T$1(()=>setSortType('asc'), [
                      setSortType
                  ])
              }),
              /*#__PURE__*/ o$1(DisqusJSSortTypeRadio, {
                  checked: sortType === 'popular',
                  sortType: "popular",
                  title: "按评分从高到低",
                  label: "最佳",
                  onChange: T$1(()=>setSortType('popular'), [
                      setSortType
                  ])
              })
          ]
      });
  });
  const DisqusJSHeader = /*#__PURE__*/ x(({ totalComments, siteName })=>/*#__PURE__*/ o$1("header", {
          className: "dsqjs-header",
          id: "dsqjs-header",
          children: /*#__PURE__*/ o$1("nav", {
              className: "dsqjs-nav dsqjs-clearfix",
              children: [
                  /*#__PURE__*/ o$1("ul", {
                      children: [
                          /*#__PURE__*/ o$1("li", {
                              className: "dsqjs-nav-tab dsqjs-tab-active",
                              children: /*#__PURE__*/ o$1("span", {
                                  children: [
                                      totalComments,
                                      " Comments"
                                  ]
                              })
                          }),
                          /*#__PURE__*/ o$1("li", {
                              className: "dsqjs-nav-tab",
                              children: siteName
                          })
                      ]
                  }),
                  /*#__PURE__*/ o$1(DisqusJSSortTypeRadioGroup, {})
              ]
          })
      }));
  const DisqusJSPosts = ({ id })=>{
      const { apikey, shortname, api } = useConfig();
      const apiKey = _$1(useRandomApiKey(apikey));
      const [posts, setPosts] = h([]);
      const setError = useSetHasError();
      const sortType = useSortType();
      const prevSortType = _$1(sortType);
      const [isLoadingMorePosts, setIsLoadingMorePosts] = h(false);
      const [errorWhenLoadMorePosts, setErrorWhenLoadingMorePosts] = h(false);
      const fetchMorePosts = T$1(async (reset = false)=>{
          if (!id) return;
          setIsLoadingMorePosts(true);
          setErrorWhenLoadingMorePosts(false);
          const lastPost = reset ? null : posts[posts.length - 1];
          if (lastPost && !lastPost.cursor.hasNext) return;
          const url = `${api}3.0/threads/listPostsThreaded?forum=${shortname}&thread=${id}&order=${sortType ?? 'desc'}${posts.length !== 0 && lastPost?.cursor.next ? `&cursor=${encodeURIComponent(lastPost.cursor.next)}` : ''}`;
          const handleError = ()=>{
              if (reset) {
                  setError(true);
                  setIsLoadingMorePosts(false);
              } else {
                  setErrorWhenLoadingMorePosts(true);
                  setIsLoadingMorePosts(false);
              }
          };
          try {
              const newPosts = await disqusJsApiFetcher(apiKey.current, url);
              if (newPosts.code === 0) {
                  setPosts((prevPosts)=>(reset ? [] : prevPosts).concat(newPosts));
                  setIsLoadingMorePosts(false);
              } else {
                  handleError();
              }
          } catch  {
              handleError();
          }
      }, [
          id,
          posts,
          api,
          shortname,
          sortType,
          setError
      ]);
      const fetchFirstPageRef = _$1(null);
      const resetAndFetchFirstPageOfPosts = T$1(()=>fetchMorePosts(true), [
          fetchMorePosts
      ]);
      const fetchNextPageOfPosts = T$1(()=>fetchMorePosts(false), [
          fetchMorePosts
      ]);
      p(()=>{
          // When there is no posts at all, load the first pagination of posts.
          if (fetchFirstPageRef.current !== id) {
              fetchFirstPageRef.current = id;
              void resetAndFetchFirstPageOfPosts();
          } else if (prevSortType.current !== sortType) {
              prevSortType.current = sortType;
              fetchFirstPageRef.current = id;
              void resetAndFetchFirstPageOfPosts();
          }
      }, [
          posts,
          resetAndFetchFirstPageOfPosts,
          id,
          isLoadingMorePosts,
          sortType
      ]);
      const comments = F$1(()=>posts.filter(Boolean).map((i)=>i.response).flat(), [
          posts
      ]);
      if (posts.length > 0) {
          return /*#__PURE__*/ o$1(k$2, {
              children: [
                  /*#__PURE__*/ o$1(DisqusJSCommentsList, {
                      comments: comments
                  }),
                  posts[posts.length - 1]?.cursor.hasNext && /*#__PURE__*/ o$1(DisqusJSLoadMoreCommentsButton, {
                      isLoading: isLoadingMorePosts,
                      isError: errorWhenLoadMorePosts,
                      onClick: isLoadingMorePosts ? undefined : fetchNextPageOfPosts
                  })
              ]
          });
      }
      return null;
  };
  const DisqusJSThread = ()=>{
      const { apikey: $apikey, identifier: $identifier, shortname, api, siteName, nocomment } = useConfig();
      const apiKey = _$1(useRandomApiKey($apikey));
      const [thread, setThread] = h(null);
      const setError = useSetHasError();
      const identifier = $identifier ?? document.location.origin + document.location.pathname + document.location.search;
      const fetchThread = T$1(async ()=>{
          try {
              const thread = await disqusJsApiFetcher(apiKey.current, `${api}3.0/threads/list.json?forum=${encodeURIComponent(shortname)}&thread=${encodeURIComponent(`ident:${identifier}`)}`);
              if (thread.code === 0) {
                  setThread(thread);
              } else {
                  setError(true);
              }
          } catch  {
              setError(true);
          }
      }, [
          api,
          apiKey,
          identifier,
          setError,
          setThread,
          shortname
      ]);
      const setMsg = useSetMessage();
      const fetchThreadRef = _$1(null);
      p(()=>{
          const actionElement = /*#__PURE__*/ o$1(k$2, {
              children: [
                  /*#__PURE__*/ o$1(DisqusJSReTestModeButton, {
                      children: "尝试完整 Disqus 模式"
                  }),
                  " | ",
                  /*#__PURE__*/ o$1(DisqusJSForceDisqusModeButton, {
                      children: "强制完整 Disqus 模式"
                  })
              ]
          });
          if (fetchThreadRef.current !== identifier) {
              setMsg(/*#__PURE__*/ o$1(k$2, {
                  children: [
                      "评论基础模式加载中... 如需完整体验请针对 disq.us | disquscdn.com | disqus.com 启用代理并",
                      ' ',
                      actionElement
                  ]
              }));
              fetchThreadRef.current = identifier;
              void fetchThread();
          } else {
              setMsg(/*#__PURE__*/ o$1(k$2, {
                  children: [
                      "你可能无法访问 Disqus，已启用评论基础模式。如需完整体验请针对 disq.us | disquscdn.com | disqus.com 启用代理并",
                      ' ',
                      actionElement
                  ]
              }));
          }
      }, [
          thread,
          fetchThread,
          identifier,
          setMsg,
          shortname,
          api
      ]);
      if (!thread) {
          return null;
      }
      if (thread.response.length !== 1) {
          return /*#__PURE__*/ o$1(DisqusJSCreateThread, {});
      }
      const matchedThread = thread.response[0];
      const totalComments = matchedThread.posts;
      return /*#__PURE__*/ o$1(k$2, {
          children: [
              /*#__PURE__*/ o$1(DisqusJSHeader, {
                  totalComments: totalComments,
                  siteName: siteName ?? ''
              }),
              totalComments === 0 ? /*#__PURE__*/ o$1(DisqusJSNoComment, {
                  text: nocomment ?? '这里空荡荡的，一个人都没有'
              }) : /*#__PURE__*/ o$1(DisqusJSPosts, {
                  id: matchedThread.id
              })
          ]
      });
  };

  const DisqusJSEntry = ()=>{
      const setMsg = useSetMessage();
      const mode = useMode();
      const setMode = useSetMode();
      const { shortname, identifier, url, title } = useConfig();
      p(()=>{
          let cancel = false;
          if (mode === 'disqus' || mode === 'dsqjs') {
              return;
          }
          setMsg('正在检查 Disqus 能否访问...');
          Promise.all([
              'disqus.com',
              `${shortname}.disqus.com`
          ].map(checkDomainAccessiblity)).then(()=>{
              if (!cancel) {
                  setMode('disqus');
              }
          }).catch(()=>{
              if (!cancel) {
                  setMode('dsqjs');
              }
          });
          return ()=>{
              cancel = true;
          };
      }, [
          mode,
          setMode,
          setMsg,
          shortname
      ]);
      const disqusJsHasError = useHasError();
      const msg = useMessage();
      if (disqusJsHasError) {
          return /*#__PURE__*/ o$1(DisqusJSError, {});
      }
      return /*#__PURE__*/ o$1(k$2, {
          children: [
              msg && /*#__PURE__*/ o$1("div", {
                  id: "dsqjs-msg",
                  children: msg
              }),
              mode === 'disqus' && /*#__PURE__*/ o$1(Disqus, {
                  shortname: shortname,
                  identifier: identifier,
                  url: url,
                  title: title
              }),
              mode === 'dsqjs' && /*#__PURE__*/ o$1(DisqusJSThread, {})
          ]
      });
  };

  const DisqusJS$1 = /*#__PURE__*/ k(({ shortname, siteName, identifier, url, title, api, apikey, nesting, nocomment, admin, adminLabel, className, ...rest }, ref)=>{
      if (r()) {
          return /*#__PURE__*/ o$1("div", {
              ref: ref,
              ...rest,
              className: `${styles.dsqjs} ${className ?? ''}`,
              children: /*#__PURE__*/ o$1(ConfigProvider, {
                  value: {
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
                  },
                  children: /*#__PURE__*/ o$1(ModeProvider, {
                      children: /*#__PURE__*/ o$1(SortTypeProvider, {
                          children: /*#__PURE__*/ o$1(HasErrorProvider, {
                              children: /*#__PURE__*/ o$1(MessageProvider, {
                                  children: /*#__PURE__*/ o$1("section", {
                                      id: "dsqjs",
                                      children: [
                                          /*#__PURE__*/ o$1(DisqusJSEntry, {}),
                                          /*#__PURE__*/ o$1(DisqusJSFooter, {})
                                      ]
                                  })
                              })
                          })
                      })
                  })
              })
          });
      }
      return null;
  });

  class DisqusJS {
      config;
      container;
      constructor(config){
          this.config = config;
      }
      render(el) {
          let container;
          if (el) {
              if (typeof el === 'string') {
                  container = document.querySelector(el);
              } else {
                  container = el;
              }
          } else {
              container = document.getElementById('disqusjs');
          }
          if (container) {
              this.container = container;
              D$1(/*#__PURE__*/ o$1(DisqusJS$1, {
                  ...this.config
              }), container);
          }
      }
      destroy() {
          if (this.container) {
              // https://github.com/preactjs/preact/blob/40f7c6592b4ed96fe9c6615e43e3d9815e566291/compat/src/index.js#L67-L78
              D$1(null, this.container);
          }
      }
  }

  return DisqusJS;

}));
