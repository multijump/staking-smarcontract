'use strict'

const BSC = 56
const NETWORK = 1
let pairList = []
let sortField = ''
let sortDirection = ''

window.onload = function () {
  console.log('onLoad!')
  window.events.initHook = initHook
  window.triggers.onLoad = [...(window.triggers.onLoad || []), 'initHook']

  window.variables.farm = {}
  window.triggers.networkChanged = [
    ...(window.triggers.networkChanged || []),
    'onNetworkChanged',
  ]
  window.events.initFarm = initFarm
  window.triggers.selectAccount = [
    ...(window.triggers.selectAccount || []),
    'initFarm',
  ]
  // window.events.updateFarm = updateFarm;
  window.events.onNetworkChanged = onNetworkChanged
  window.events.onStakeMaxAmount = onStakeMaxAmount
  window.events.onStakeInput = onStakeInput
  window.events.onStake = onStake

  $(document).on('click', '.btn-harvest-now', function (e) {
    e.preventDefault()
    const pid = $(this).attr('data-id')
    const earning = $(this)
      .closest('.cell-earned__text')
      .find('p')
      .attr('data-value')
    harvestNow(pid, earning)
  })

  $(document).on('click', '.btn-approve-staking', function (e) {
    e.preventDefault()

    const address = $(this).attr('data-address')
    const name = $(this).attr('data-name')
    approveStaking(address, name)
  })

  $(document).on('click', '.farm-table-header-apy', function (e) {
    e.preventDefault()
    onSort('apy')
  })

  $(document).on('click', '.farm-table-header-liquidity', function (e) {
    e.preventDefault()
    onSort('liquidity')
  })

  $(document).on('click', '.farm-table-header-staked', function (e) {
    e.preventDefault()
    onSort('staked')
  })

  // if (!window.variables.NETWORK) {
  //   initFarm();
  // }
  initFarm()
}

function initHook() {
  window.hooks.forEach(createHook)
}

function initFarm() {
  console.log('initFarm')

  initData(function (pools) {
    pools = pools.filter(pool => pool.maxStake > 0)
    console.log(pools)
    const { NETWORK, CONTRACT_ERC20_ABI } = window.variables
    Promise.all(pools.map(pool => {
      const tokenContract = new web3.eth.Contract(
        CONTRACT_ERC20_ABI,
        toChecksumAddress(pool.token)
      )
      return Promise.all([
        Promise.resolve(pool.token),
        call(tokenContract.methods.name)(),
        call(tokenContract.methods.decimals)(),
        call(tokenContract.methods.symbol)(),
      ])
    }))
      .then(result => {
        const tokenList = result.map(token => {
          return {
            address: token[0],
            decimals: token[2],
            logoURI: null,
            name: token[1],
            symbol: token[3],
          };
        })

        window.variables.TOKEN_LIST[NETWORK] = tokenList
        tokenList.map(token => {
          window.variables.PAIR_TOKEN_CONTRACTS[toChecksumAddress(token.address)] = new web3.eth.Contract(
            window.variables.CONTRACT_ERC20_ABI,
            toChecksumAddress(token.address)
          )
        })

        window.variables.farm.POOLS = pools.filter(pool => {
          return tokenList.find(token => toChecksumAddress(token.address) === toChecksumAddress(pool.token)) ? true : false
        });
        window.variables.farm.USERS = []
        window.variables.farm.ALLOWANCES = []

        updateFarm()
        refreshFarm()
      })
      .catch(error => {
        console.log('===---=== ', error)
      })
  })
}

function updateFarm() {
  if (window.variables.farm.POOLS) {
    initUserData(function () {
      farmTableRender()
    })
  }
}

function refreshFarm() {
  setTimeout(function () {
    updateFarm()
    refreshFarm()
  }, 30000)
}

function onNetworkChanged() {
  $('#farm-table-body .farm-item').remove()
  $('#loading').show()
  $('#no-pools').hide()
}

function initData(callback) {
  console.log(window.variables)
  if (window.variables.FACTORY_CONTRACT) {
    Promise.all([getPools()])
      .then(function ([pools]) {
        callback(pools)
      })
      .catch(console.log)
  }
}

function initUserData(callback) {
  const {
    ACCOUNT,
    farm: { POOLS },
  } = window.variables
  if (!ACCOUNT) return

  Promise.all([
    ACCOUNT ? getPoolUser(ACCOUNT) : Promise.resolve([]),
    ACCOUNT && POOLS ? getAllowances(ACCOUNT, POOLS) : Promise.resolve([]),
  ])
    .then(([users, allowances]) => {
      console.log('allowances : ', allowances)
      console.log('users : ', users)
      window.variables.farm.USERS = users
      window.variables.farm.ALLOWANCES = allowances
      callback()
    })
    .catch(console.log)
}

function farmTableRender() {
  const users = window.variables.farm.USERS || []
  const allowances = window.variables.farm.ALLOWANCES || []
  const assets =
    window.variables.TOKEN_LIST[window.variables.NETWORK || NETWORK]
  const { POOLS } = window.variables.farm

  if (POOLS.length > 0) {
    $('#farm-table-body .farm-item').remove()
    POOLS.forEach((pair) => {
      const token = assets.find(
        (asset) => asset.address.toLowerCase() == pair.token,
      )
      const pairName = `${token.name}`
      const pairSymbol = `${token.symbol}`
      const stakedAmount = pair.balance

      let reward =
        allowances[pair.token] && allowances[pair.token].reward
          ? allowances[pair.token].reward
          : '0.00'
      const rewardRext =
        !allowances[pair.token] ||
        (allowances[pair.token] && !allowances[pair.token].reward)
          ? 'No rewards'
          : 'Harvest Now'

      let stakeBtn = ''
      let unStakeBtn = ''

      if (
        (!allowances[pair.token] ||
          (allowances[pair.token] && !allowances[pair.token].allowance)) &&
        new BigNumber(pair ? (pair?.balance || 0) / 1e18 : '0.00').isZero()
      ) {
        stakeBtn = `<a class="btn btn-link btn-approve-staking" href="#" data-address="${pair.token}" data-name="${pairSymbol}">Approve Staking</a>`
      } else {
        stakeBtn = `<a class="btn btn-link js-popup-open"
                        href="#stake_asset"
                        data-id="${pair.id}"
                        data-address="${pair.token}"
                        data-name="${pairSymbol}"
                        data-type="stake"
                        data-amount="${allowances[pair.token].balance}"
                        data-max-amount="${pair.maxStake}"
                        data-current-staked="${new BigNumber(
                          users ? (users[pair.id]?.amount || 0) / 1e18 : 0,
                        )}"
                        data-title="Deposit">Stake</a>`
      }

      if (
        !new BigNumber(
          users ? (users[pair.id]?.amount || 0) / 1e18 : 0,
        ).isZero()
      ) {
        unStakeBtn = `<a class="btn btn-link js-popup-open"
                          href="#stake_asset"
                          data-id="${pair.id}"
                          data-address="${pair.token}"
                          data-name="${pairSymbol}"
                          data-type="unstake"
                          data-amount="${
                            new BigNumber(users[pair.id]?.amount)
                              .div(1e18)
                              .toString(10) || 0
                          }"
                          data-title="Withdraw">UnStake</a>`
      }

      const existingTR = $('#farm-table-body').find(`#pair-${pairSymbol}`)
      if (!existingTR.length) {
        let harvestBtn = ''
        if (
          !allowances[pair.token] ||
          (allowances[pair.token] && !allowances[pair.token].reward)
        ) {
          harvestBtn = `
            <div id="pair-${pairSymbol}-earned-desc" class="descr">
              ${rewardRext}
            </div>
          `
        } else {
          harvestBtn = `
            <div id="pair-${pairSymbol}-earned-desc" class="earn-descr">
              <a class="btn btn-lbiege btn-harvest-now" href="#" data-id="${pair.id}">${rewardRext}</a>
            </div>
          `
        }

        let actionTD = `<td id="pair-${pairSymbol}-actions" class="td-btns"></td>`
        if (window.variables.NETWORK) {
          actionTD = `<td id="pair-${pairSymbol}-actions" class="td-btns">
            ${stakeBtn}
            ${unStakeBtn}
          </td>`
        }

        const firstIconUrl =
          assets.find(
            (asset) =>
              toChecksumAddress(asset.address) ===
              toChecksumAddress(pair.token),
          )?.logoURI || `images/defaultAsset.svg`

        // render tr to tbody
        $('#loading').hide()
        $('#no-pools').hide()
        $('#farm-table-body').append(`
          <tr id="pair-${pairSymbol}" class="farm-item">
            <td>
              <div class="cell-title">Farm : </div>
              <div class="cell-farms">
                <div class="cell-farms__icons">
                  <div class="first-icon">
                    <img src="${firstIconUrl}" alt="${pairSymbol}">
                  </div>
                </div>
                <div class="cell-farms__text">
                  <p>${pairName}</p>
                  <div class="descr">${pairSymbol}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="cell-title">Yield(per $1,000) : </div>
              <div class="cell-yield">
                <div class="cell-yield__text">
                  <p>${formatNumber(
                    pair.secondaryTokensPerDay / 1e18,
                    2,
                  )} SHARD/Day</p>
                </div>
              </div>
            </td>
            <td class="${
              pair.roiPerYear * 100 >= 0 ? 'td-apy-raised' : 'td-apy-down'
            }">
              <div class="cell-title">APY : </div>
              <div class="td-apy-raised--value">
                <span>${pair.maxStake / 1e18} ${pairSymbol}</span>
              </div>
            </td>
            <td class="farm-liquidity">
              <div class="cell-title">Liquidity : </div>
              <div class="farm-liquidity-value">
                ${new BigNumber(
                  users ? (users[pair.id]?.amount || 0) / 1e18 : '0.00',
                )}  ${pairSymbol}
              </div>
            </td>
            <td>
              <div class="cell-title">Earned : </div>
              <div class="cell-earned">
                <div class="cell-earned__text">
                  <p id="pair-${pairSymbol}-earned-title" data-value="${reward}">${formatNumber(
          reward,
        )} SHARD</p>
                  ${harvestBtn}
                </div>
              </div>
            </td>
            ${actionTD}
          </tr>
        `)
      } else {
        // Update the earned values
        existingTR
          .find(`#pair-${pairSymbol}-earned-title`)
          .text(`${formatNumber(reward)} SHARD`)
        existingTR.find(`#pair-${pairSymbol}-earned-desc`).empty()
        if (
          !allowances[pair.token] ||
          (allowances[pair.token] && !allowances[pair.token].reward)
        ) {
          existingTR
            .find(`#pair-${pairSymbol}-earned-desc`)
            .text(`${rewardRext}`)
          existingTR
            .find(`#pair-${pairSymbol}-earned-desc`)
            .removeClass('earn-descr')
            .addClass('descr')
        } else {
          existingTR
            .find(`#pair-${pairSymbol}-earned-desc`)
            .removeClass('descr')
            .addClass('earn-descr')
          existingTR.find(`#pair-${pairSymbol}-earned-desc`).append(`
            <a class="btn btn-lbiege btn-harvest-now" href="#" data-id="${pair.id}">${rewardRext}</a>
          `)
        }
        existingTR.find(`#pair-${pairSymbol}-actions`).empty()
        existingTR.find(`#pair-${pairSymbol}-actions`).append(`
          ${stakeBtn}
          ${unStakeBtn}
        `)
      }
    })
  } else {
    $('#loading').hide()
    $('#no-pools').show()
  }
}

function harvestNow(pid, earning) {
  runHarvest([pid, earning], function (result, error) {
    if (error) {
      console.log(error)
    } else {
      // console.log(result);
    }
  })
}

function approveStaking(pairAddress, name) {
  runApproveStaking(pairAddress, name, function (result, error) {
    if (error) {
      console.log(error)
    } else {
      // console.log(result);
    }
  })
}

function onStake(e) {
  const form = $(document.forms.stake)
  let amount = new BigNumber(form.find('input#available_amount').val())
  const availableAmount = new BigNumber(form.find('a.js-input-max-balance').attr('data-value'))
  const type = form.find('#current_stake_type').val()
  const pid = form.find('#current_pool_id').val()
  const pairName = form.find('#current_pool_pair_name').val()
  const pairMaxStake = form.find('#current_pool_pair_max').val()
  const pairCurrentStaked = form.find('#current_pool_pair_current').val()
  const maxAmount = new BigNumber(pairMaxStake / 1e18).minus(pairCurrentStaked);

  if ((amount.gt(new BigNumber(0)) &&
    amount.lte(availableAmount) &&
    amount.lte(maxAmount) &&
    pid &&
    type === "stake") ||
    (amount.gt(new BigNumber(0)) &&
    amount.lte(availableAmount) &&
    pid &&
    type === "unstake")) {
    runStake(pid, amount.toString(10), pairName, type, function (result, error) {
      if (error) {
        console.log(error)
      }
    })
  } else if (type === "stake") {
    if (maxAmount.isZero()) {
      form.find('#stake_asset_alert').text('Exceed max stake amount. You cannot stake anymore.');
    } else if (amount.gt(maxAmount) && maxAmount.lte(availableAmount)) {
      form.find('#stake_asset_alert').text(`Exceed max stake amount. You can stake only ${maxAmount.toString(10)} ${pairName} now.`);
    } else if (amount.gt(availableAmount) && maxAmount.gt(availableAmount)) {
      form.find('#stake_asset_alert').text(`Exceed max stake amount. You can stake only ${availableAmount.toString(10)} ${pairName} now.`);
    }
  } else {
    form.find('#stake_asset_alert').text(`Exceed unstake amount. You can unstake only ${availableAmount.toString(10)} ${pairName} now.`);
  }
}

function onStakeMaxAmount(e) {
  const form = $(document.forms.stake)
  const type = form.find('#current_stake_type').val()
  const availableAmount = new BigNumber(form.find('a.js-input-max-balance').attr('data-value'))

  form.find('#stake_asset_alert').text('');

  if (type === "stake") {
    const pairMaxStake = form.find('#current_pool_pair_max').val()
    const pairCurrentStaked = form.find('#current_pool_pair_current').val()
    const maxAmount = new BigNumber(pairMaxStake / 1e18).minus(pairCurrentStaked);

    if (availableAmount.gt(maxAmount)) {
      form
        .find('input#available_amount')
        .val(
          maxAmount
            .dp(18, 1)
            .toString(10),
        )
    } else {
      form
        .find('input#available_amount')
        .val(
          availableAmount
            .dp(18, 1)
            .toString(10),
        )
    }
  } else {
    form
      .find('input#available_amount')
      .val(
        availableAmount
          .dp(18, 1)
          .toString(10),
      )
  }
}

function onStakeInput(e) {
  const form = $(document.forms.stake)
  form.find('#stake_asset_alert').text('');
  const availableAmount = new BigNumber(form.find('a.js-input-max-balance').attr('data-value'))

  if (new BigNumber(e.target.value).gt(availableAmount)) {
    $(form).find('.js-confirm-btn').prop('disabled', true)
  } else {
    $(form).find('.js-confirm-btn').prop('disabled', false)
  }
}

function isNumber(value) {
  return typeof value === 'number' && isFinite(value)
}
