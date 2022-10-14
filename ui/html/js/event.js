"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _slicedToArray(e,r){return _arrayWithHoles(e)||_iterableToArrayLimit(e,r)||_unsupportedIterableToArray(e,r)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,r){if(e){if("string"==typeof e)return _arrayLikeToArray(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(e,r):void 0}}function _arrayLikeToArray(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function _iterableToArrayLimit(e,r){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],n=!0,o=!1,a=void 0;try{for(var i,l=e[Symbol.iterator]();!(n=(i=l.next()).done)&&(t.push(i.value),!r||t.length!==r);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==l.return||l.return()}finally{if(o)throw a}}return t}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function triggerEvent(e){if(window.events[e]){for(var r,t=arguments.length,n=new Array(1<t?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];(r=window.events)[e].apply(r,n.concat(_toConsumableArray(window.triggers[e]||[])))}}window.events={onLoad:function(){console.log("app loaded"),triggerEvent("restoreSession");for(var e=arguments.length,r=new Array(e),t=0;t<e;t++)r[t]=arguments[t];r.forEach(triggerEvent)},connect:function(e){switch(Number(e)){case 1:case 2:$(".web3modal-provider-wrapper:nth-child(".concat(e,")")).click(),localStorage.setItem("last_try",e)}},restoreSession:function(){localStorage.getItem("last_connect")?setTimeout(function(){onConnect("1"===localStorage.getItem("last_connect")?window.ethereum:null),triggerEvent("connect",localStorage.getItem("last_connect"))}):window.ethereum&&onConnect(window.ethereum)},selectAccount:function(e,r){var t=0<arguments.length&&void 0!==e?e:"",n=1<arguments.length?r:void 0;$(".connect-btn span").text(shortenAddr(t)),(!window.variables.ACCOUNT&&t||window.variables.ACCOUNT&&!t)&&($(".user-connected").toggleClass("hidden"),t&&localStorage.getItem("last_try")&&localStorage.setItem("last_connect",localStorage.getItem("last_try"))),window.variables.ACCOUNT=t,window.variables.NETWORK!==n.networkId&&configNetwork(n.networkId);var o=window.variables,a=o.ACCOUNT,i=o.NETWORK;initTokenContracts();for(var l=arguments.length,c=new Array(2<l?l-2:0),s=2;s<l;s++)c[s-2]=arguments[s];a&&i&&c.forEach(triggerEvent)},networkChanged:function(){console.log("Network changed",window.variables.NETWORK);for(var e=arguments.length,r=new Array(e),t=0;t<e;t++)r[t]=arguments[t];r.forEach(triggerEvent)},searchChanged:function(e){try{if(!e||!e.startsWith("0x"))return;var r=window.variables,t=r.NETWORK,n=r.CONTRACT_ERC20_ABI,i=toChecksumAddress(e);if((window.variables.TOKEN_LIST[t]||[]).find(function(e){return e.address===i}))return;var o=new web3.eth.Contract(n,i),l="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/".concat(i,"/logo.png");Promise.all([call(o.methods.symbol)(),call(o.methods.name)(),call(o.methods.decimals)(),urlCheck(l)]).then(function(e){var r=_slicedToArray(e,4),t=r[0],n=r[1],o=r[2],a=r[3];services.tokenSuggest({address:i,decimals:Number(o),logoURI:a?l:"images/swap/error.svg",name:n,symbol:t})}).catch(console.log)}catch(e){console.log(e)}},logout:function(){onDisconnect()}},window.triggers={};