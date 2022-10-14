"use strict";function ownKeys(t,e){var r,n=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)),n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach(function(e){_defineProperty(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _objectWithoutProperties(e,t){if(null==e)return{};var r,n=_objectWithoutPropertiesLoose(e,t);if(Object.getOwnPropertySymbols)for(var o=Object.getOwnPropertySymbols(e),a=0;a<o.length;a++)r=o[a],0<=t.indexOf(r)||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r]);return n}function _objectWithoutPropertiesLoose(e,t){if(null==e)return{};for(var r,n={},o=Object.keys(e),a=0;a<o.length;a++)r=o[a],0<=t.indexOf(r)||(n[r]=e[r]);return n}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function _iterableToArrayLimit(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==c.return||c.return()}finally{if(o)throw a}}return r}}function _arrayWithHoles(e){if(Array.isArray(e))return e}var web3,provider,web3Modal,netId,Web3Modal=window.Web3Modal.default,WalletConnectProvider=window.WalletConnectProvider.default,EvmChains=window.evmChains;function onDisconnect(){console.log("Killing the wallet connection",provider),provider.close&&(provider.close(),web3Modal.clearCachedProvider(),provider=null),triggerEvent("selectAccount",null)}function init(){provider&&onDisconnect(),web3Modal=new Web3Modal({cacheProvider:!1,providerOptions:{injected:{id:1,display:{name:"Metamask"},package:null},walletconnect:{id:2,package:WalletConnectProvider,display:{name:"Trust Wallet"},options:{infuraId:"8043bb2cf99347b1bfadfb233c5325c0"}}},disableInjectedProvider:!1})}function fetchAccountData(){web3=new Web3(provider),Promise.all([netId?Promise.resolve(0):web3.eth.getChainId(),web3.eth.getAccounts()]).then(function(e){var t=_slicedToArray(e,2),r=t[0],n=t[1],o=netId?Promise.resolve(0):EvmChains.getChain(r);triggerEvent("selectAccount",n[0],netId?{networkId:netId}:o),setup(),load()}).catch(console.log)}function refreshAccountData(){fetchAccountData()}function onConnect(e){var t=e?Promise.resolve(e):web3Modal.connect();netId=e?window.ethereum.networkVersion?+window.ethereum.networkVersion:+window.ethereum.chainId:0,t.then(function(e){(provider=e).on&&(provider.on("accountsChanged",function(e){fetchAccountData()}),provider.on("chainChanged",function(e){netId=0,fetchAccountData()})),refreshAccountData(),$("button.js-popup-close").click()}).catch(function(e){console.log("Could not get a wallet connection",e),$("button.js-popup-close").click()})}function setup(){}function initTokenContracts(){window.variables.FACTORY_CONTRACT=new web3.eth.Contract(window.variables.CONTRACT_FACTORY_ABI,window.variables.CONTRACT_FACTORY_ADDRESS),window.variables.PAIR_TOKEN_CONTRACTS={},window.variables.SHARD_CONTRACT=new web3.eth.Contract(window.variables.CONTRACT_SHARD_ABI,window.variables.CONTRACT_SHARD_ADDRESS)}function registerToken(e){var t=e.address,r=_objectWithoutProperties(e,["address"]),n=window.variables.CONTRACT_ERC20_ABI;window.variables.TOKEN_CONTRACTS[t]=_objectSpread(_objectSpread({},r),{},{contract:new web3.eth.Contract(n,t)})}var balanceTimer=null,call=function(n,o){return function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return o?new Promise(function(e){return n.apply(void 0,t).call().then(e).catch(function(){return e(null)})}):n.apply(void 0,t).call()}},send=function(a){return function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t.pop(),o=a.apply(void 0,t);return{estimate:function(){return o.estimateGas(n)},send:function(){return o.send(n)},transaction:o}}};function getContractInfo(){var e=window.variables.ACCOUNT;e&&web3.eth.getBalance(e).then(function(e){window.variables.BALANCE=web3.utils.fromWei(e),triggerEvent("fetchBalance")}).catch(console.log)}function getTokenInfo(){var o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:window.variables.ZERO,e=window.variables,t=e.ACCOUNT,r=e.TOKEN_CONTRACTS[o],a=(r=void 0===r?{}:r).contract,i=r.symbol,c=_objectWithoutProperties(r,["contract","symbol"]),n=e.CONTRACT_ROUTER_ADDRESS,l=c.decimals,s=void 0===l?18:l;return Promise.all([a?call(a.methods.balanceOf)(t):web3.eth.getBalance(t),a?call(a.methods.allowance)(t,n):Promise.resolve(!0)]).then(function(e){var t=_slicedToArray(e,2),r=t[0],n=t[1];return[fromWei(new BigNumber(r),s),!a||!fromWei(new BigNumber(n),s).isZero(),_objectSpread(_objectSpread({},c),{},{symbol:i||BASE_SYMBOL,address:o})]})}function load(){balanceTimer&&clearInterval(balanceTimer),balanceTimer=setInterval(function(){getContractInfo()},6e4),getContractInfo()}var networks={56:{chainId:"0x38",chainName:"Binance Smart Chain",nativeCurrency:{name:"BNB",symbol:"BNB",decimals:18},rpcUrls:["https://bsc-dataseed.binance.org"],blockExplorerUrls:["https://bscscan.com/"]}};function changeNetworkRequest(e){networks[e]&&web3.currentProvider.request({method:"wallet_addEthereumChain",params:[networks[e]]})}init();