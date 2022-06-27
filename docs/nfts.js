const NFTs = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">
        <b-card no-body class="p-0 mt-1">
          <b-tabs card align="left" no-body v-model="settings.tabIndex" active-tab-class="m-0 p-0">
            <b-tab title="Mint Monitor" @click="updateURL('mintmonitor');">
            </b-tab>
            <!--
            <b-tab title="Approvals" @click="updateURL('approvals');">
            </b-tab>
            -->
          </b-tabs>

          <b-card-body class="m-0 p-1">
            <!-- Main Toolbar -->
            <div class="d-flex flex-wrap m-0 p-0">
              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateMintMonitorFilter('searchString', $event)" debounce="600" v-b-popover.hover.bottom="'Poweruser regex, or simple search string'" placeholder="🔍 {regex|addy}"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" :value="filter.searchString" @change="updateFilter('searchString', $event)" debounce="600" v-b-popover.hover.bottom="'Poweruser regex, or simple search string'" placeholder="🔍 {regex}"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1" style="max-width: 150px;">
                <b-form-input type="text" size="sm" :value="filter.searchAccounts" @change="updateFilter('searchAccounts', $event)" debounce="600" v-b-popover.hover.bottom="'List of account search strings'" placeholder="🔍 0x12... ..."></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1" style="max-width: 80px;">
                <b-form-input type="text" size="sm" :value="filter.priceFrom" @change="updateFilter('priceFrom', $event)" debounce="600" v-b-popover.hover.bottom="'Price from, ETH'" placeholder="min"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1">
                -
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1" style="max-width: 80px;">
                <b-form-input type="text" size="sm" :value="filter.priceTo" @change="updateFilter('priceTo', $event)" debounce="600" v-b-popover.hover.bottom="'Price to, ETH'" placeholder="max"></b-form-input>
              </div>

              <div class="mt-1 flex-grow-1">
              </div>

              <div v-if="settings.tabIndex == 0" class="mt-1 pr-1">
                <b-button size="sm" @click="monitorMints('scanLatest')" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary" style="min-width: 80px; ">Scan Latest 100 Blocks</b-button>
              </div>

              <div class="mt-1 flex-grow-1">
              </div>

              <div v-if="settings.tabIndex == 0" class="mt-1 pl-1" style="max-width: 100px;">
                <b-form-input type="text" size="sm" :value="filter.startBlockNumber" @change="updateMintMonitorFilter('startBlockNumber', $event)" debounce="600" v-b-popover.hover.bottom="'Block number from'" placeholder="from"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1">
                -
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1" style="max-width: 100px;">
                <b-form-input type="text" size="sm" :value="filter.endBlockNumber" @change="updateMintMonitorFilter('endBlockNumber', $event)" debounce="600" v-b-popover.hover.bottom="'Block number to'" placeholder="to"></b-form-input>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                <b-button size="sm" @click="monitorMints('scan')" :disabled="sync.inProgress || !powerOn || network.chainId != 1 || filter.startBlockNumber == null || filter.endBlockNumber == null" variant="primary" style="min-width: 80px; ">Scan</b-button>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1 pl-1">
                <b-link size="sm" :to="getURL"><font size="-1">Share</font></b-link>
              </div>

              <div v-if="settings.tabIndex == 1" class="mt-1 pr-1">
                <b-button size="sm" @click="monitorMints('partial')" :disabled="sync.inProgress || !powerOn || network.chainId != 1" variant="primary" style="min-width: 80px; ">Scan</b-button>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-input-group class="mb-2" style="height: 0;">
                  <template #append>
                    <b-button size="sm" :pressed.sync="settings.syncToolbar" variant="outline-primary" v-b-popover.hover.bottom="'Sync settings'"><span v-if="settings.syncToolbar"><b-icon-gear-fill shift-v="+1" font-scale="1.0"></b-icon-gear-fill></span><span v-else><b-icon-gear shift-v="+1" font-scale="1.0"></b-icon-gear></span></b-button>
                  </template>
                  <b-button v-if="!sync.inProgress" size="sm" @click="loadSales('partial')" variant="primary" v-b-popover.hover.bottom="'Partial Sync'" style="min-width: 80px; ">Sync</b-button>
                  <b-button v-if="sync.inProgress" size="sm" @click="halt" variant="primary" v-b-popover.hover.bottom="'Halt'" style="min-width: 80px; ">Syncing</b-button>
                </b-input-group>
              </div>
              <div class="mt-1 pr-1 flex-grow-1">
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-button size="sm" @click="exportSales" :disabled="filteredSortedSales.length == 0" variant="link" v-b-popover.hover.bottom="'Export to CSV for easy import into a spreadsheet'">Export</b-button>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-form-select size="sm" v-model="settings.sortOption" :options="sortOptions" v-b-popover.hover.bottom="'Yeah. Sort'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <font size="-2" v-b-popover.hover.bottom="formatTimestamp(earliestEntry) + ' to ' + formatTimestamp(latestEntry)">{{ filteredSortedSales.length }}</font>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1 pr-1">
                <b-pagination size="sm" v-model="settings.currentPage" :total-rows="filteredSortedSales.length" :per-page="settings.pageSize" style="height: 0;"></b-pagination>
              </div>
              <div v-if="settings.tabIndex == 10" class="mt-1">
                <b-form-select size="sm" v-model="settings.pageSize" :options="pageSizes" v-b-popover.hover.bottom="'Page size'"></b-form-select>
              </div>
              <div v-if="settings.tabIndex == 0" class="mt-1">
                <b-form-select size="sm" v-model="settings.activityMaxItems" :options="activityMaxItemsOptions" v-b-popover.hover.bottom="'Max items to display'"></b-form-select>
              </div>
            </div>

            <!-- Sync Toolbar -->
            <div v-if="settings.syncToolbar" class="d-flex flex-wrap m-0 p-0 pb-1">
              <div class="mt-1 pr-1">
                <b-form-select size="sm" :value="config.period" @change="updateConfig('period', $event)" :options="periods" :disabled="sync.inProgress" v-b-popover.hover.bottom="'Sales history period'"></b-form-select>
              </div>
              <div class="mt-2" style="width: 300px;">
                <b-progress height="1.5rem" :max="sync.daysExpected" :label="'((sync.daysInCache/sync.daysExpected)*100).toFixed(2) + %'" show-progress :animated="sync.inProgress" :variant="sync.inProgress ? 'success' : 'secondary'" v-b-popover.hover.bottom="formatTimestampAsDate(sync.from) + ' - ' + formatTimestampAsDate(sync.to) + '. Click on the Sync(ing) button to (un)pause'">
                  <b-progress-bar :value="sync.daysInCache">
                    {{ (sync.processing ? (sync.processing + ' - ') : '') + sync.daysInCache + '/' + sync.daysExpected + ' ' + ((sync.daysInCache / sync.daysExpected) * 100).toFixed(0) + '%' }}
                  </b-progress-bar>
                </b-progress>
              </div>
              <div class="mt-1 flex-grow-1">
              </div>
              <div class="mt-1 pr-1" style="max-width: 150px;">
                <b-button size="sm" @click="loadSales('clearCache')" variant="primary" v-b-popover.hover.bottom="'Reset application data'">Clear Local Cache</b-button>
              </div>
            </div>

            <b-alert size="sm" :show="!powerOn || network.chainId != 1" variant="primary" class="m-0 mt-1">
              Please connect to the Ethereum mainnet with a web3-enabled browser. Click the [Power] button on the top right.
            </b-alert>

            <!-- Mint Monitor -->
            <div v-if="settings.tabIndex == 0">
              <b-alert size="sm" :show="powerOn && network.chainId == 1" dismissible variant="danger" class="m-0 mt-1">
                Be careful when interacting with unverified contracts and signing messages on dodgy websites!
              </b-alert>

              <b-table small striped hover :fields="collectionsFields" :items="collectionsData" table-class="w-100" class="m-1 p-1">
                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(contract)="data">
                  <b-button :id="'popover-target-' + data.item.contract" variant="link" class="m-0 p-0">
                    {{ getContractOrCollection(data.item.contract) }}
                  </b-button>
                  <b-popover :target="'popover-target-' + data.item.contract" placement="right">
                    <template #title>{{ getContractOrCollection(data.item.contract) }}</template>
                    <b-link :href="'https://etherscan.io/address/' + data.item.contract + '#code'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Contract Code
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/token/' + data.item.contract" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Transfers
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/token/' + data.item.contract + '#balances'" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Holders
                    </b-link>
                    <br />
                    <b-link :href="'https://etherscan.io/token/tokenholderchart/' + data.item.contract" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                      Etherscan - Holders Chart
                    </b-link>
                  </b-popover>
                </template>
                <template #cell(mints)="data">
                  {{ data.item.mints }}
                </template>
                <template #cell(tokens)="data">
                  <span v-for="(transfer, transferIndex) in data.item.transfers.slice(0, settings.activityMaxItems)">
                    <b-button :id="'popover-target-' + data.item.contract + '-' + transfer.tokenId" variant="link" class="m-0 p-0">
                      <span v-if="transfer.contract == '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'">
                        <b-img :width="'100%'" :src="'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + transfer.tokenId + '/image'">
                        </b-img>
                      </span>
                      <span v-else>
                        {{ getTokenIdString(transfer.tokenId) }}
                      </span>
                    </b-button>
                    <b-popover :target="'popover-target-' + data.item.contract + '-' + transfer.tokenId" placement="right">
                      <template #title>{{ getContractOrCollection(data.item.contract) }}</template>
                      <b-link :href="'https://opensea.io/assets/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in opensea.io'" target="_blank">
                        OpenSea
                      </b-link>
                      <br />
                      <b-link :href="'https://looksrare.org/collections/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in looksrare.org'" target="_blank">
                        LooksRare
                      </b-link>
                      <br />
                      <b-link :href="'https://x2y2.io/eth/' + data.item.contract + '/' + transfer.tokenId" v-b-popover.hover.bottom="'View in x2y2.io'" target="_blank">
                        X2Y2
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/tx/' + transfer.txHash" v-b-popover.hover.bottom="'View in Etherscan.io'" target="_blank">
                        Etherscan - Tx
                      </b-link>
                      <br />
                      <b-link :href="'https://opensea.io/' + transfer.to" v-b-popover.hover.bottom="'View mintoor in OS'" target="_blank">
                        OpenSea - Mintoor Account
                      </b-link>
                      <br />
                      <b-link :href="'https://etherscan.io/address/' + transfer.to" v-b-popover.hover.bottom="'View mintoor in Etherscan.io'" target="_blank">
                        Etherscan - Mintoor Account
                      </b-link>
                    </b-popover>
                  </span>
                </template>
              </b-table>
            </div>

            <!--
            <b-table small striped hover :fields="fields" :items="transfers" table-class="w-100" class="m-2 p-2">
              <template #cell(blockNumber)="data">
                <b-link :href="'https://etherscan.io/block/' + data.item.blockNumber" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                  {{ data.item.blockNumber }}
                </b-link>
              </template>
              <template #cell(contract)="data">
                <b-link :href="'https://etherscan.io/address/' + data.item.contract + '#code'" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                  {{ getContractOrCollection(data.item.contract) }}
                </b-link>
              </template>
              <template #cell(from)="data">
                <b-link :href="'https://opensea.io/' + data.item.from" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                  {{ data.item.from.substring(0, 12) }}
                </b-link>
              </template>
              <template #cell(to)="data">
                <b-link :href="'https://opensea.io/' + data.item.to" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                  {{ data.item.to.substring(0, 12) }}
                </b-link>
              </template>
              <template #cell(tokenId)="data">
                <b-link :href="'https://opensea.io/assets/' + data.item.contract + '/' + data.item.tokenId" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                  {{ getTokenIdString(data.item.tokenId) }}
                </b-link>
              </template>
              <template #cell(txHash)="data">
                <b-link :href="'https://etherscan.io/tx/' + data.item.txHash" v-b-popover.hover.bottom="'View in Etherscan'" target="_blank">
                  {{ data.item.txHash.substring(0, 12) }}
                </b-link>
              </template>
            </b-table>
            -->

            <!-- Listing -->
            <b-table v-if="settings.tabIndex == 10" small striped hover :fields="salesFields" :items="pagedFilteredSortedSales" table-class="w-auto" class="m-2 p-2">
              <template #cell(timestamp)="data">
                {{ formatTimestamp(data.item.timestamp) }}
              </template>
              <template #cell(name)="data">
                <b-link :id="'popover-target-name-' + data.index">
                  {{ data.item.name }}
                </b-link>
                <b-popover :target="'popover-target-name-' + data.index" placement="right">
                  <template #title>{{ encodeURIComponent(data.item.name.substring(0, 64)) }}:</template>
                  <b-link :href="'https://app.ens.domains/name/' + data.item.name" v-b-popover.hover="'View in app.ens.domains'" target="_blank">
                    ENS
                  </b-link>
                  <br />
                  <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in opensea.io'" target="_blank">
                    OpenSea
                  </b-link>
                  <br />
                  <b-link :href="'https://looksrare.org/collections/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                    LooksRare
                  </b-link>
                  <br />
                  <b-link :href="'https://x2y2.io/eth/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/' + data.item.tokenId" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                    X2Y2
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://etherscan.io/enslookup-search?search=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    EtherScan
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://duckduckgo.com/?q=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in duckduckgo.com'" target="_blank">
                    DuckDuckGo
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://www.google.com/search?q=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in google.com'" target="_blank">
                    Google
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://twitter.com/search?q=' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in twitter.com'" target="_blank">
                    Twitter
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://wikipedia.org/wiki/' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in wikipedia.org'" target="_blank">
                    Wikipedia
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://en.wiktionary.org/wiki/' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in wiktionary.org'" target="_blank">
                    Wiktionary
                  </b-link>
                  <br />
                  <b-link v-if="data.item.name" :href="'https://thesaurus.yourdictionary.com/' + data.item.name.replace('.eth', '')" v-b-popover.hover="'Search name in thesaurus.yourdictionary.com'" target="_blank">
                    Thesaurus
                  </b-link>
                </b-popover>
              </template>
              <template #cell(from)="data">
                <b-link :id="'popover-target-from-' + data.index">
                  {{ data.item.from.substring(0, 12) }}
                </b-link>
                <b-popover :target="'popover-target-from-' + data.index" placement="right">
                  <template #title>From: {{ data.item.from.substring(0, 12) }}:</template>
                  <b-link :href="'https://opensea.io/' + data.item.from" v-b-popover.hover="'View in opensea.io'" target="_blank">
                    OpenSea
                  </b-link>
                  <br />
                  <b-link :href="'https://looksrare.org/accounts/' + data.item.from" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                    LooksRare
                  </b-link>
                  <br />
                  <b-link :href="'https://x2y2.io/user/' + data.item.from + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                    X2Y2
                  </b-link>
                  <br />
                  <b-link :href="'https://etherscan.io/address/' + data.item.from" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    EtherScan
                  </b-link>
                </b-popover>
              </template>
              <template #cell(to)="data">
                <b-link :id="'popover-target-to-' + data.index">
                  {{ data.item.to.substring(0, 12) }}
                </b-link>
                <b-popover :target="'popover-target-to-' + data.index" placement="right">
                  <template #title>From: {{ data.item.to.substring(0, 12) }}:</template>
                  <b-link :href="'https://opensea.io/' + data.item.to" v-b-popover.hover="'View in opensea.io'" target="_blank">
                    OpenSea
                  </b-link>
                  <br />
                  <b-link :href="'https://looksrare.org/accounts/' + data.item.to" v-b-popover.hover="'View in looksrare.org'" target="_blank">
                    LooksRare
                  </b-link>
                  <br />
                  <b-link :href="'https://x2y2.io/user/' + data.item.to + '/items'" v-b-popover.hover="'View in x2y2.io'" target="_blank">
                    X2Y2
                  </b-link>
                  <br />
                  <b-link :href="'https://etherscan.io/address/' + data.item.to" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                    EtherScan
                  </b-link>
                </b-popover>
              </template>
              <template #cell(txHash)="data">
                <b-link :href="'https://etherscan.io/tx/' + data.item.txHash" v-b-popover.hover="'View in etherscan.io'" target="_blank">
                  {{ data.item.txHash.substring(0, 12) }}
                </b-link>
              </template>
              <template #cell(price)="data">
                {{ data.item.price }}
              </template>
              <template #cell(priceUSD)="data">
                {{ priceUSD(data.item.price, data.item.timestamp) }}
              </template>
            </b-table>

            <div v-if="settings.tabIndex == 20">
              <b-row>
                <b-col cols="7">
                  <div v-if="true">
                    <b-card body-class="m-2 p-1" header-class="p-1" class="mt-2 mr-1" style="height: 550px;">
                      <template #header>
                        <h6 class="mb-0">ENS Daily Activity</h6>
                      </template>
                      <apexchart :options="dailyChartOptions" :series="dailyChartData" class="w-100"></apexchart>
                    </b-card>
                  </div>
                  <div v-if="true">
                      <b-card body-class="m-2 p-1" header-class="p-1" class="mt-2 mr-1" style="height: 550px;">
                        <template #header>
                          <h6 class="mb-0">ENS Activity</h6>
                        </template>
                        <apexchart :options="chartOptions" :series="chartData" class="w-100"></apexchart>
                      </b-card>
                  </div>
                </b-col>
                <b-col cols="5">
                  <b-card body-class="m-0 p-0" header-class="p-1 px-3" class="mt-2" style="height: 550px;">
                    <template #header>
                      <h6 class="mb-0">Sales For Selected Day</h6>
                    </template>
                    <p v-if="dailyChartSelectedItems.length == 0" class="mt-2 p-2">
                      Click on a daily column to view the sales for the day
                    </p>
                    <font size="-2">
                    <!-- <b-table v-if="dailyChartSelectedItems.length > 0" small fixed striped sticky-header="500px" :items="dailyChartSelectedItems" head-variant="light"> -->
                      <b-table v-if="dailyChartSelectedItems.length > 0" small fixed striped sticky-header="500px" :fields="dailyChartSelectedItemsFields" :items="dailyChartSelectedItems" head-variant="light">
                        <template #cell(name)="data">
                          <b-link :href="'https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/' + data.item.tokenId" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                            {{ (data.item.name && data.item.name.length > 20) ? (data.item.name.substr(0, 17) + '...') : data.item.name }}
                          </b-link>
                        </template>
                        <template #cell(from)="data">
                          <b-link :href="'https://opensea.io/' + data.item.from" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                            {{ data.item.from.substring(0, 6) }}
                          </b-link>
                        </template>
                        <template #cell(to)="data">
                          <b-link :href="'https://opensea.io/' + data.item.to" v-b-popover.hover.bottom="'View in OS'" target="_blank">
                            {{ data.item.to.substring(0, 6) }}
                          </b-link>
                        </template>
                        <template #cell(timestamp)="data">
                          {{ formatTimestamp(data.item.timestamp) }}
                        </template>
                        <template #cell(txHash)="data">
                          <b-link :href="'https://etherscan.io/tx/' + data.item.txHash" v-b-popover.hover.bottom="'View in Etherscan'" target="_blank">
                            {{ data.item.txHash.substring(0, 8) }}
                          </b-link>
                        </template>
                      </b-table>
                    </font>
                  </b-card>
                </b-col>
              </b-row>
            </div>
          </b-card-body>
        </b-card>
      </b-card>
    </div>
  `,
  props: ['tab', 'blocks', 'search'],
  data: function() {
    return {
      count: 0,
      reschedule: true,

      settings: {
        tabIndex: 0,
        syncToolbar: false,
        sortOption: 'latestsale',
        // randomise: false,
        pageSize: 100,
        currentPage: 1,
        activityMaxItems: 50,
      },

      dailyChartSelectedItems: [],

      sortOptions: [
        { value: 'nameasc', text: 'Name Ascending' },
        { value: 'namedsc', text: 'Name Descending' },
        { value: 'priceasc', text: 'Price Ascending' },
        { value: 'pricedsc', text: 'Price Descending' },
        { value: 'latestsale', text: 'Latest Sale' },
        { value: 'earliestsale', text: 'Earliest Sale' },
        // { value: 'random', text: 'Random' },
      ],

      pageSizes: [
        { value: 10, text: '10' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 2500, text: '2.5k' },
        { value: 10000, text: '10k' },
      ],

      periods: [
        { value: { term: 7, termType: "days" }, text: '1 Week' },
        { value: { term: 14, termType: "days" }, text: '2 Weeks' },
        { value: { term: 1, termType: "month" }, text: '1 Month' },
        { value: { term: 2, termType: "month" }, text: '2 Months' },
        { value: { term: 3, termType: "month" }, text: '3 Months' },
        { value: { term: 1, termType: "year" }, text: '1 Year' },
      ],

      collectionsFields: [
        { key: 'index', label: '#', thStyle: 'width: 5%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'contract', label: 'Contract', thStyle: 'width: 25%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'mints', label: 'Mints', thStyle: 'width: 5%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', thStyle: 'width: 65%;' },
      ],

      activityMaxItemsOptions: [
        { value: 10, text: '10' },
        { value: 50, text: '50' },
        { value: 100, text: '100' },
        { value: 500, text: '500' },
        { value: 1000, text: '1k' },
        { value: 10000, text: '10k' },
      ],

      fields: [
        { key: 'blockNumber', label: 'Block #', thStyle: 'width: 15%;' },
        { key: 'contract', label: 'Contract', thStyle: 'width: 40%;' },
        // { key: 'from', label: 'From', thStyle: 'width: 15%;' },
        { key: 'to', label: 'Mintoor', thStyle: 'width: 20%;' },
        { key: 'tokenId', label: 'Token Id', thStyle: 'width: 15%;' },
        { key: 'txHash', label: 'Tx', thStyle: 'width: 15%;' },
      ],

      salesFields: [
        { key: 'timestamp', label: 'Timestamp', thStyle: 'width: 20%;' },
        { key: 'name', label: 'Name', thStyle: 'width: 20%;' },
        { key: 'from', label: 'From', thStyle: 'width: 15%;' },
        { key: 'to', label: 'To', thStyle: 'width: 15%;' },
        { key: 'price', label: 'ETH', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'priceUSD', label: 'USD', thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'orderSide', label: 'OrderSide', thStyle: 'width: 5%;' },
        { key: 'txHash', label: 'Tx', thStyle: 'width: 15%;' },
      ],

      dailyChartSelectedItemsFields: [
        { key: 'name', label: 'Name', thStyle: 'width: 30%;', sortable: true },
        { key: 'from', label: 'From', thStyle: 'width: 10%;', sortable: true },
        { key: 'to', label: 'To', thStyle: 'width: 10%;', sortable: true },
        { key: 'price', label: 'Price', thStyle: 'width: 10%;', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'timestamp', label: 'Timestamp', thStyle: 'width: 25%;', sortable: true },
        { key: 'txHash', label: 'Tx', thStyle: 'width: 15%;', sortable: true },
      ],

      chartOptions: {
        chart: {
          // height: 280,
          // width: 280,
          type: "scatter",
          zoom: {
            type: 'xy',
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          custom: ({series, seriesIndex, dataPointIndex, w}) => {
            return '<div class="arrow_box" style="background-color: #ffffff">' +
                '<span>' +
                  w.config.series[seriesIndex].data[dataPointIndex][3] + ' ' +
        //         '<img src="images/punks/punk' + w.config.series[seriesIndex].data[dataPointIndex][3].toString().padStart(4, '0') + '.png"></img>' +
                series[seriesIndex][dataPointIndex] + 'e' +
        //         w.config.series[seriesIndex].data[dataPointIndex][3] +
                '</span>' +
              '</div>'
          }
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          // min: this.chartYaxisMin,
          // max: this.chartYaxisMax,
          labels: {
            formatter: value => parseFloat(value),
          },
        },
      },

      dailyChartOptions: {
        chart: {
          // height: 280,
          // width: 280,
          type: "line",
          zoom: {
            type: 'xy',
          },
          // animations: {
          //   initialAnimation: {
          //     enabled: false,
          //   }
          // },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              // console.log("dailyChartSelectedItems: " + JSON.stringify(this.dailyChartSelectedItems));
              // console.log(JSON.stringify(config.dataPointIndex) + " " + JSON.stringify(config.w.config.series[0].data[config.dataPointIndex]));
              this.dailyChartSelectedItems = config.w.config.series[0].data[config.dataPointIndex].items;
              // console.log("dailyChartSelectedItems: " + JSON.stringify(this.dailyChartSelectedItems));
            },
          },
        },
        stroke: {
          width: [0, 2, 5],
          curve: 'smooth'
        },
        fill: {
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
          }
        },
        markers: {
          size: 0
        },
        dataLabels: {
          enabled: false,
        },
        // fill: {
        //   type: 'gradient',
        // },
        // title: {
        //   text: '3D Bubble Chart'
        // },
        // tooltip: {
        //   custom: ({series, seriesIndex, dataPointIndex, w}) => {
        //     return '<div class="arrow_box" style="background-color: #ffffff">' +
        //       '<span>BLAH' +
        //   // //       '<img src="images/punks/punk' + w.config.series[seriesIndex].data[dataPointIndex][3].toString().padStart(4, '0') + '.png"></img>' +
        //   //       series[seriesIndex][dataPointIndex] + 'e' +
        //   // //       w.config.series[seriesIndex].data[dataPointIndex][3] +
        //         '</span>' +
        //       '</div>'
        //   }
        // },
        xaxis: {
          // tickAmount: 12,
          type: 'datetime',
          // labels: {
          //   rotate: 0,
          // }
        },
        yaxis: [
          {
            // seriesName: '# Sales',
            title: {
              text: "# Sales",
              // style: {
              //   color: '#00E396',
              // }
            },
            // min: this.chartYaxisMin,
            // max: this.chartYaxisMax,
            labels: {
              formatter: value => parseFloat(value),
            },
          },
          {
            // seriesName: 'Average Sale',
            title: {
              text: "Average ETH",
              // style: {
              //   color: '#00E396',
              // }
            },
            // min: this.chartYaxisMin,
            // max: this.chartYaxisMax,
            labels: {
              formatter: value => parseFloat(value),
            },
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: '#FEB019'
            },
          },
          {
            // seriesName: 'Average Sale',
            title: {
              text: "Average USD",
              // style: {
              //   color: '#00E396',
              // }
            },
            // min: this.chartYaxisMin,
            // max: this.chartYaxisMax,
            labels: {
              formatter: value => parseFloat(value),
            },
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: '#FEB019'
            },
          }
        ],
      },

    }
  },
  computed: {
    powerOn() {
      return store.getters['connection/powerOn'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    network() {
      return store.getters['connection/network'];
    },
    config() {
      return store.getters['nfts/config'];
    },
    filter() {
      return store.getters['nfts/filter'];
    },
    sync() {
      return store.getters['nfts/sync'];
    },
    transfers() {
      return store.getters['nfts/transfers'];
    },
    collections() {
      return store.getters['nfts/collections'];
    },
    sales() {
      return store.getters['nfts/sales'];
    },
    exchangeRates() {
      return store.getters['nfts/exchangeRates'];
    },
    earliestEntry() {
      let timestamp = null;
      for (const sale of this.sales) {
        if (timestamp == null || timestamp > sale.timestamp) {
          timestamp = sale.timestamp;
        }
      }
      return timestamp;
    },
    latestEntry() {
      let timestamp = null;
      for (const sale of this.sales) {
        if (timestamp == null || timestamp < sale.timestamp) {
          timestamp = sale.timestamp;
        }
      }
      return timestamp;
    },
    filteredSortedSales() {
      let results = this.sales;
      if (this.settings.sortOption == 'nameasc') {
        results.sort((a, b) => ('' + a.name).localeCompare(b.name));
      } else if (this.settings.sortOption == 'namedsc') {
        results.sort((a, b) => ('' + b.name).localeCompare(a.name));
      } else if (this.settings.sortOption == 'priceasc') {
        results.sort((a, b) => {
          if (a.price == b.price) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return a.price - b.price;
          }
        });
      } else if (this.settings.sortOption == 'pricedsc') {
        results.sort((a, b) => {
          if (a.price == b.price) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return b.price - a.price;
          }
        });
      } else if (this.settings.sortOption == 'latestsale') {
        results.sort((a, b) => {
          if (a.timestamp == b.timestamp) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return b.timestamp - a.timestamp;
          }
        });
      } else if (this.settings.sortOption == 'earliestsale') {
        results.sort((a, b) => {
          if (a.timestamp == b.timestamp) {
            return ('' + a.name).localeCompare(b.name);
          } else {
            return a.timestamp - b.timestamp;
          }
        });
      }
      return results;
    },
    pagedFilteredSortedSales() {
      return this.filteredSortedSales.slice((this.settings.currentPage - 1) * this.settings.pageSize, this.settings.currentPage * this.settings.pageSize);
    },
    accounts() {
      const sellers = {};
      const buyers = {};
      for (const sale of this.sales.slice(0, 10)) {
        console.log("sale: " + JSON.stringify(sale));
        if (!(sale.from in sellers)) {
          sellers[sale.from] = { count: 1, total: sale.price, items: [sale] };
        } else {
          sellers[sale.from].count++;
          sellers[sale.from].total = parseFloat(sellers[sale.from].total) + sale.price;
          sellers[sale.from].items.push(sale);
        }
        if (!(sale.to in buyers)) {
          buyers[sale.to] = { count: 1, total: sale.price, items: [sale] };
        } else {
          buyers[sale.to].count++;
          buyers[sale.to].total = parseFloat(buyers[sale.to].total) + sale.price;
          buyers[sale.to].items.push(sale);
        }
      }
      const sellersData = [];
      for (const [account, value] of Object.entries(sellers)) {
        const average = value.total / value.count;
        sellersData.push({ account: account, count: value.count, total: value.total, average: average, items: value.items });
        console.log("seller: " + account + " count: " + value.count + ", total: " + value.total);
      }
      sellersData.sort((a, b) => {
        return b.total - a.total;
      });
      const buyersData = [];
      for (const [account, value] of Object.entries(buyers)) {
        const average = value.total / value.count;
        buyersData.push({ account: account, count: value.count, total: value.total, average: average, items: value.items });
        console.log("buyer: " + account + " count: " + value.count + ", total: " + value.total);
      }
      buyersData.sort((a, b) => {
        return b.total - a.total;
      });
      return { sellers: sellersData, buyers: buyersData };
    },
    chartData() {
      const results = [];
      const data = [];
      for (const sale of this.sales) {
        data.push([sale.timestamp * 1000, sale.price, 6, sale.name]);
      }
      results.push({ name: "Sales", data: data });
      return results;
    },
    dailyData() {
      const collator = {};
      for (const sale of this.sales) {
        const bucket = moment.unix(sale.timestamp).utc().startOf('day').unix();
        if (!(bucket in collator)) {
          collator[bucket] = { count: 1, total: sale.price, items: [sale] };
        } else {
          collator[bucket].count++;
          collator[bucket].total = parseFloat(collator[bucket].total) + sale.price;
          collator[bucket].items.push(sale);
        }
      }
      const results = [];
      for (const [bucket, value] of Object.entries(collator)) {
        const average = value.total / value.count;
        results.push({ timestamp: bucket, count: value.count, total: value.total, average: average, items: value.items });
        // console.log("bucket: " + bucket + " " + moment.unix(bucket).utc().format() + " count: " + value.count + ", total: " + value.total);
      }
      results.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
      return results;
    },
    dailyChartData() {
      const counts = [];
      const averages = [];
      const averagesUSD = [];
      for (const day of this.dailyData) {
        counts.push({ x: day.timestamp * 1000, y: day.count, items: day.items });
        averages.push({ x: day.timestamp * 1000, y: day.average });
        averagesUSD.push({ x: day.timestamp * 1000, y: day.average * this.exchangeRates[day.timestamp] });
      }
      return [
        {
          name: '# Sales',
          type: 'column',
          data: counts,
        }, {
          name: 'Average ETH',
          type: 'area',
          data: averages,
        }, {
          name: 'Average USD',
          type: 'area',
          data: averagesUSD,
        }
      ];
    },
    collectionsData() {
      const searchStrings = this.filter.searchString && this.filter.searchString.length > 0 && this.filter.searchString.split(/[, \t\n]+/).map(s => s.toLowerCase().trim()) || null;
      const results = [];
      for (const [contract, collection] of Object.entries(this.collections)) {
        let include = true;
        const symbol = collection.symbol.toLowerCase();
        const name = collection.name.toLowerCase();
        if (searchStrings != null) {
          let found = false;
          for (searchString of searchStrings) {
            if (contract.includes(searchString) || symbol.includes(searchString) || name.includes(searchString)) {
              found = true;
              break;
            }
          }
          if (!found) {
            include = false;
          }
        }
        if (include) {
          results.push({ contract, collection, mints: collection.transfers && collection.transfers.length || null, transfers: collection.transfers });
        }
      }
      results.sort((a, b) => {
        if (a.mints == b.mints) {
          const namea = this.collections && this.collections[a.contract].name || '';
          const nameb = this.collections && this.collections[b.contract].name || '';
          return ('' + namea).localeCompare(nameb);
        } else {
          return b.mints - a.mints;
        }
      });
      return results;
    },
    getURL() {
      let url = '/nfts/mintmonitor/';
      const startBlockNumber = this.filter.startBlockNumber && parseInt(this.filter.startBlockNumber.toString().replace(/,/g, '')) || null;
      const endBlockNumber = this.filter.endBlockNumber && parseInt(this.filter.endBlockNumber.toString().replace(/,/g, '')) || null;
      if (startBlockNumber != null && endBlockNumber != null) {
        if (startBlockNumber == endBlockNumber) {
          url = url + startBlockNumber + '/';
        } else {
          url = url + startBlockNumber + '-' + endBlockNumber + '/';
        }
      } else {
        url = url + '/';
      }
      if (this.filter.searchString != null && this.filter.searchString.length > 0) {
        url = url + this.filter.searchString;
      }
      return url;
    },
  },
  methods: {
    getContractOrCollection(address) {
      if (this.collections && (address in this.collections)) {
        const collection = this.collections[address];
        return collection.symbol + ' - ' + collection.name + (collection.totalSupply > 0 ? (' (' + collection.totalSupply + ')') : '');
      }
      return address.substring(0, 12);
    },
    getTokenIdString(tokenId) {
      const str = tokenId.toString();
      if (str.length > 13) {
        return str.substring(0, 10) + '...';
      }
      return str;
    },
    updateURL(where) {
      this.$router.push('/nfts/' + where);
    },
    formatETH(e) {
      try {
        return e ? ethers.utils.commify(ethers.utils.formatEther(e)) : null;
      } catch (err) {
      }
      return e.toFixed(9);
    },
    formatTimestamp(ts) {
      if (ts != null) {
        return new Date(ts * 1000).toLocaleString();
      }
      return null;
    },
    formatTimestampAsDate(ts) {
      if (ts != null) {
        return moment.unix(ts).utc().format("MMMDD");
      }
      return null;
    },
    priceUSD(price, timestamp) {
      const bucket = moment.unix(timestamp).utc().startOf('day').unix();
      const exchangeRate = this.exchangeRates[bucket];
      return ethers.utils.commify(parseFloat(price * exchangeRate).toFixed(0));
    },
    updateConfig(field, config) {
      // logInfo("NFTs", "updateConfig: " + field + " => " + JSON.stringify(config));
      const configUpdate = {};
      configUpdate[field] = config;
      store.dispatch('nfts/updateConfig', configUpdate);
    },
    updateMintMonitorFilter(field, filter) {
      logInfo("NFTs", "updateMintMonitorFilter: " + field + " => " + JSON.stringify(filter));
      const filterUpdate = {};
      filterUpdate[field] = filter;
      store.dispatch('nfts/updateMintMonitorFilter', filterUpdate);
    },
    updateFilter(field, filter) {
      // logInfo("NFTs", "updateFilter: " + field + " => " + JSON.stringify(filter));
      const filterUpdate = {};
      filterUpdate[field] = filter;
      store.dispatch('nfts/updateFilter', filterUpdate);
    },
    async monitorMints(syncMode) {
      // logInfo("NFTs", "loadSales - syncMode: " + syncMode);
      store.dispatch('nfts/monitorMints', { syncMode, configUpdate: null, filterUpdate: null });
    },
    async loadSales(syncMode) {
      // logInfo("NFTs", "loadSales - syncMode: " + syncMode);
      store.dispatch('ensSales/loadSales', syncMode);
    },
    async halt() {
      store.dispatch('ensSales/halt');
    },
    exportSales() {
      const rows = [
          ["Timestamp", "Name", "Length", "From", "To", "Price", "Tx"],
      ];
      const timestamp = new Date(parseInt((new Date).getTime()/1000)*1000).toISOString().replace('T', '-').replaceAll(':', '-').replace('.000Z', '');
      for (const result of this.filteredSortedSales) {
        rows.push([
          new Date(parseInt(result.timestamp) * 1000).toISOString().replace('T', ' ').replace('.000Z', ''),
          result.name,
          result.name && result.name.replace(".eth", "").length || null,
          result.from,
          result.to,
          result.price,
          result.txHash,
        ]);
      }
      let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "aenus_enssales_export-" + timestamp + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data with the specified file name
    },
    async timeoutCallback() {
      logDebug("NFTs", "timeoutCallback() count: " + this.count);

      this.count++;
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 15000);
      }
    },
  },
  beforeDestroy() {
    logDebug("NFTs", "beforeDestroy()");
  },
  mounted() {
    logInfo("NFTs", "mounted() $route: " + JSON.stringify(this.$route.params) + ", props['tab']: " + this.tab + ", props['blocks']: " + this.blocks + ", props['search']: " + this.search);
    if (this.tab == "mintmonitor") {
      this.settings.tabIndex = 0;
      let startBlockNumber = null;
      let endBlockNumber = null;
      if (this.blocks != null) {
        if (new RegExp('^[0-9,]+$').test(this.blocks)) {
          startBlockNumber = this.blocks;
          endBlockNumber = this.blocks;
        } else if (new RegExp('^[0-9,]+\s*\-\s*[0-9,]+$').test(this.blocks)) {
          startBlockNumber = this.blocks.replace(/\s*\-.*$/, '');
          endBlockNumber = this.blocks.replace(/^.*\-\s*/, '');
        }
        const filterUpdate = {};
        filterUpdate['startBlockNumber'] = parseInt(startBlockNumber);
        filterUpdate['endBlockNumber'] = parseInt(endBlockNumber);
        filterUpdate['searchString'] = this.search;
        setTimeout(function() {
          store.dispatch('nfts/monitorMints', { syncMode: 'scan', configUpdate: null, filterUpdate: filterUpdate });
        }, 1000);
      }
    } else if (this.tab == "approvals") {
      this.settings.tabIndex = 1;
    }

    this.reschedule = true;
    logDebug("NFTs", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const nftsModule = {
  namespaced: true,
  state: {
    constants: {
      reservoirSalesV3BatchSize: 50,
      currency: 'USD',
    },
    config: {
      period: { term: 1, termType: "month" },
      lookback: 100,
    },
    filter: {
      searchString: null,
      startBlockNumber: null,
      endBlockNumber: null,
      searchAccounts: null,
      priceFrom: null,
      priceTo: null,
    },
    sync: {
      inProgress: false,
      error: false,
      now: null,
      from: null,
      to: null,
      daysExpected: null,
      daysInCache: null,
      processing: null,
    },
    transfers: [],
    collections: {},
    sales: [],
    exchangeRates: {},
    halt: false,
    params: null,
    db: {
      name: "aenusenssalesdb",
      version: 1,
      definition: {
        sales: '[chainId+contract+tokenId],chainId,contract,tokenId,name,from,to,price,timestamp',
      },
    },
  },
  getters: {
    config: state => state.config,
    filter: state => state.filter,
    sync: state => state.sync,
    transfers: state => state.transfers,
    collections: state => state.collections,
    sales: state => state.sales,
    exchangeRates: state => state.exchangeRates,
    params: state => state.params,
  },
  mutations: {
    // --- loadSales() ---
    async loadSales(state, { syncMode, configUpdate, filterUpdate }) {
      // --- loadSales() functions start ---
      function processRegistrations(registrations) {
        const results = {};
        for (const registration of registrations) {
          const tokenId = new BigNumber(registration.domain.labelhash.substring(2), 16).toFixed(0);
          results[tokenId] = registration.domain.name;
        }
        return results;
      }
      async function fetchNamesByTokenIds(tokenIds) {
        const data = await fetch(ENSSUBGRAPHURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: ENSSUBGRAPHBBYTOKENIDSQUERY,
            variables: { tokenIds: tokenIds },
          })
        }).then(handleErrors)
          .then(response => response.json())
          .then(data => processRegistrations(data.data.registrations))
          .catch(function(error) {
             console.log("ERROR fetchNamesByTokenIds: " + error);
             state.sync.error = true;
             data = [];
          });
        // console.log(JSON.stringify(data, null, 2));
        return data;
      }
      async function processSales(data) {
        const searchForNamesByTokenIds = data.sales
          .map(sale => sale.token.tokenId)
          .map(tokenId => "0x" + new BigNumber(tokenId, 10).toString(16));
        const namesByTokenIds = await fetchNamesByTokenIds(searchForNamesByTokenIds);
        const saleRecords = [];
        if (!state.sync.error) {
          let count = 0;
          const chainId = (store.getters['connection/network'] && store.getters['connection/network'].chainId) || 1;
          for (const sale of data.sales) {
            // if (count == 0) {
            //   logInfo("nftsModule", "mutations.loadSales().processSales() " + new Date(sale.timestamp * 1000).toLocaleString() + " " + (sale.token.name ? sale.token.name : "(null)") + ", price: " + sale.price + ", from: " + sale.from.substr(0, 10) + ", to: " + sale.to.substr(0, 10));
            // }
            const name = namesByTokenIds[sale.token.tokenId] ? namesByTokenIds[sale.token.tokenId] : sale.token.name;
            saleRecords.push({
              chainId: chainId,
              contract: ENSADDRESS,
              tokenId: sale.token.tokenId,
              name: name,
              from: sale.from,
              to: sale.to,
              price: sale.price,
              timestamp: sale.timestamp,
              tokenId: sale.token.tokenId,
              txHash: sale.txHash,
              data: sale,
            });
            count++;
          }
          await db0.sales.bulkPut(saleRecords).then (function() {
          }).catch(function(error) {
            console.log("error: " + error);
          });
        }
        return saleRecords.length;
      }
      // async function fetchSales(startTimestamp, endTimestamp) {
      //   logInfo("nftsModule", "mutations.loadSales().fetchSales() - " + startTimestamp.toLocaleString() + " - " + endTimestamp.toLocaleString());
      //   const url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&limit=" + state.config.reservoirSalesV3BatchSize + "&startTimestamp=" + parseInt(startTimestamp / 1000) + "&endTimestamp="+ parseInt(endTimestamp / 1000);
      //   let continuation = null;
      //   do {
      //     let url1;
      //     if (continuation == null) {
      //       url1 = url;
      //     } else {
      //       url1 = url + "&continuation=" + continuation;
      //     }
      //     const data = await fetch(url1)
      //       .then(response => response.json());
      //     await processSales(data);
      //     continuation = data.continuation;
      //   } while (continuation != null);
      // }
      async function updateDBFromAPI() {
        logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI()");
        const earliestEntry = await db0.sales.orderBy("timestamp").first();
        const earliestDate = earliestEntry ? earliestEntry.timestamp : null;
        const latestEntry = await db0.sales.orderBy("timestamp").last();
        const latestDate = latestEntry ? latestEntry.timestamp : null;
        logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI() - earliestDate: " +
          (earliestDate == null ? null : (moment.unix(earliestDate).utc().format() + " (" + earliestDate + ")")) + ", latestDate: " +
          (latestDate == null ? null : (moment.unix(latestDate).utc().format() + " (" + latestDate + ")"))
        );

        let to = state.sync.now;
        let from = state.sync.to;
        let dates;
        try {
          dates = JSON.parse(localStorage.ensSalesDates);
        } catch (e) {
          dates = {};
        };
        const sales = {};
        while (to > state.sync.from && !state.halt) {
          let totalRecords = 0;
          if (!(from in dates)) {
            let processFrom = from;
            const processTo = to;
            if (processFrom == state.sync.to) {
              if (processFrom < latestDate) {
                processFrom = latestDate;
              }
            }
            let continuation = null;
            do {
              let url = "https://api.reservoir.tools/sales/v3?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" +
                "&limit=" + state.constants.reservoirSalesV3BatchSize +
                "&startTimestamp=" + processFrom +
                "&endTimestamp="+ processTo +
                (continuation != null ? "&continuation=" + continuation : '');
              // logInfo("nftsModule", "mutations.loadSales() - url: " + url);
              // logInfo("nftsModule", "mutations.loadSales() - Retrieving records for " + new Date(processFrom).toLocaleString() + " to " + new Date(processTo).toLocaleString());
              const data = await fetch(url)
                .then(handleErrors)
                .then(response => response.json())
                .catch(function(error) {
                   console.log("ERROR - updateDBFromAPI: " + error);
                   state.sync.error = true;
                   return [];
                });
              let numberOfRecords = state.sync.error ? 0 : await processSales(data);
              totalRecords += numberOfRecords;
              continuation = data.continuation;
              state.sync.processing = moment.unix(processFrom).utc().format("DDMMM") + ': ' + totalRecords;
            } while (continuation != null && !state.halt && !state.sync.error);
            if (from != state.sync.to && !state.halt) {
              dates[from] = true;
            }
            if (totalRecords > 0) {
              logInfo("nftsModule", "mutations.loadSales() - Retrieved " +  totalRecords + " record(s) for " + moment.unix(processFrom).utc().format() + " to " + moment.unix(processTo).utc().format());
            } else {
              logInfo("nftsModule", "mutations.loadSales() - Nothing new");
            }
          }
          to = from;
          from = moment.unix(from).utc().subtract(1, 'day').unix();
          localStorage.ensSalesDates = JSON.stringify(dates);
          state.sync.daysInCache = Object.keys(dates).length;
        }
        logInfo("nftsModule", "mutations.loadSales() - processed dates: " + JSON.stringify(Object.keys(dates)));
      }
      async function fetchExchangeRates() {
        // TODO: Use toTs={timestamp} when > 2000 days - https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
        const days = parseInt((new Date() - new Date("2017-07-22")) / (24 * 60 * 60 * 1000));
        const url = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=" + state.constants.currency + "&limit=" + days;
        logInfo("cryptoPunksModule", "mutations.loadPunks().fetchLatestEvents() url: " + url);
        const data = await fetch(url)
          .then(handleErrors)
          .then(response => response.json())
          .catch(function(error) {
             console.log("ERROR - fetchExchangeRates: " + error);
             state.sync.error = true;
             return null;
          });
        const results = {};
        if (data) {
          for (day of data.Data.Data) {
            results[day.time] = day.close;
          }
        }
        return results;
      }
      async function refreshResultsFromDB() {
        const regex = state.filter.searchString != null && state.filter.searchString.length > 0 ? new RegExp(state.filter.searchString, 'i') : null;
        const searchAccounts = state.filter.searchAccounts ? state.filter.searchAccounts.split(/[, \t\n]+/).map(s => s.trim().toLowerCase()) : null;
        const priceFrom = state.filter.priceFrom && parseFloat(state.filter.priceFrom) > 0 ? parseFloat(state.filter.priceFrom) : null;
        const priceTo = state.filter.priceTo && parseFloat(state.filter.priceTo) > 0 ? parseFloat(state.filter.priceTo) : null;
        const salesFromDB = await db0.sales.orderBy("timestamp").reverse().toArray();
        const saleRecords = [];
        let count = 0;
        for (const sale of salesFromDB) {
          let include = true;
          const name = sale.name && sale.name.replace('.eth', '') || null;
          if (regex && !regex.test(name)) {
            include = false;
          }
          if (include && searchAccounts != null) {
            let found = false;
            for (searchAccount of searchAccounts) {
              if (sale.from.includes(searchAccount) || sale.to.includes(searchAccount)) {
                found = true;
                break;
              }
            }
            if (!found) {
              include = false;
            }
          }
          if (include && priceFrom != null) {
            if (sale.price < priceFrom) {
              include = false;
            }
          }
          if (include && priceTo != null) {
            if (sale.price > priceTo) {
              include = false;
            }
          }
          if (include) {
            saleRecords.push({
              name: sale.name,
              from: sale.from,
              to: sale.to,
              price: sale.price,
              orderSide: sale.data.orderSide,
              timestamp: sale.timestamp,
              tokenId: sale.tokenId,
              txHash: sale.txHash,
            });
            count++;
          }
        }
        state.sales = saleRecords;
      }
      // --- loadSales() functions end ---

      // --- loadSales() start ---
      logInfo("nftsModule", "mutations.loadSales() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));

      if (syncMode == 'clearCache' || !('ensSalesConfig' in localStorage)) {
        state.config = { period: { term: 1, termType: "month" } };
      } else {
        state.config = JSON.parse(localStorage.ensSalesConfig);
      }
      if (configUpdate != null) {
        console.log("config before: " + JSON.stringify(state.config));
        console.log("updating config with: " + JSON.stringify(configUpdate));
        state.config = { ...state.config, ...configUpdate };
        console.log("config after: " + JSON.stringify(state.config));
        localStorage.ensSalesConfig = JSON.stringify(state.config);
      }

      if (syncMode == 'clearCache') {
        logInfo("nftsModule", "mutations.loadSales() - deleting db");
        Dexie.delete(state.db.name);
        delete localStorage['ensSalesDates'];
        delete localStorage['ensSalesConfig'];
      }

      if (syncMode != 'updateFilter') {
        const now = moment().unix();
        const to = moment.unix(now).utc().startOf('day').unix();
        const from = moment.unix(to).utc().subtract(state.config.period.term, state.config.period.termType).unix();
        logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI() - to: " + moment.unix(to).utc().format() + " (" + to + ")");
        logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI() - from: " + moment.unix(from).utc().format() + " (" + from + ")");
        const days = moment.unix(to).utc().diff(moment.unix(from).utc(), "days");
        logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI() - days: " + days);
        const daysInCache = ('ensSalesDates' in localStorage) ? Object.keys(JSON.parse(localStorage.ensSalesDates)).length : 0;
        logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI() - daysInCache: " + daysInCache);

        state.sync = {
          inProgress: true,
          error: false,
          now: now,
          from: from,
          to: to,
          daysExpected: days,
          daysInCache: daysInCache,
          processing: null,
        };
      }

      if (filterUpdate != null) {
        console.log("filter before: " + JSON.stringify(state.filter));
        console.log("updating filter with: " + JSON.stringify(filterUpdate));
        state.filter = { ...state.filter, ...filterUpdate };
        console.log("filter after: " + JSON.stringify(state.filter));
      }

      if (filterUpdate == null) {
        state.exchangeRates = await fetchExchangeRates();
        logInfo("nftsModule", "mutations.loadSales() exchangeRates: " + JSON.stringify(state.exchangeRates).substring(0, 60) + " ...");
      }

      const db0 = new Dexie(state.db.name);
      db0.version(state.db.version).stores(state.db.definition);

      if (syncMode != 'clearCache' && syncMode != 'updateFilter' && syncMode != 'mounted') {
        // logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI() - from: " + moment.unix(state.sync.from).utc().format() + " (" + state.sync.from + ")");
        db0.transaction('rw', db0.sales, function* () {
          var deleteCount = yield db0.sales.where("timestamp").below(state.sync.from).delete();
          logInfo("nftsModule", "mutations.loadSales().updateDBFromAPI() - deleted " + deleteCount + " old records before " +  moment.unix(state.sync.from).utc().format("YYYY-MM-DD"));
          if ('ensSalesDates' in localStorage) {
            try {
              const ensSalesDates = JSON.parse(localStorage.ensSalesDates);
              Object.keys(ensSalesDates).forEach(function (timestamp) {
                if (timestamp < state.sync.from) {
                  delete ensSalesDates[timestamp];
                }
              });
              localStorage.ensSalesDates = JSON.stringify(ensSalesDates);
              state.sync.daysInCache = Object.keys(ensSalesDates).length;
            } catch (e) {
              console.log("Error updating ensSalesDates")
            }
          }
        }).catch (e => {
          console.error (e);
        });
      }
      if (syncMode != 'clearCache' && syncMode != 'updateFilter' && syncMode != 'mounted') {
        await updateDBFromAPI();
      }
      await refreshResultsFromDB();
      state.sync.inProgress = false;
      state.sync.processing = null;
      state.halt = false;

      db0.close();
    },

    // --- monitorMints() ---
    async monitorMints(state, { syncMode, configUpdate, filterUpdate }) {
      // --- monitorMints() start ---
      logInfo("nftsModule", "mutations.monitorMints() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlock("latest");
        const blockNumber = block.number;

        const transfers = [];
        const contractsCollator = {};

        if (filterUpdate != null) {
          console.log("filter before: " + JSON.stringify(state.filter));
          console.log("updating filter with: " + JSON.stringify(filterUpdate));
          state.filter = { ...state.filter, ...filterUpdate };
          console.log("filter after: " + JSON.stringify(state.filter));
        }

        let startBlockNumber = null;
        let endBlockNumber = null;
        if (syncMode == 'scan') {
          startBlockNumber = parseInt(state.filter.startBlockNumber.toString().replace(/,/g, ''));
          endBlockNumber = parseInt(state.filter.endBlockNumber.toString().replace(/,/g, ''));
        } else if (syncMode == 'scanLatest') {
          startBlockNumber = blockNumber - state.config.lookback;
          endBlockNumber = blockNumber;
          state.filter.startBlockNumber = ethers.utils.commify(startBlockNumber);
          state.filter.endBlockNumber = ethers.utils.commify(endBlockNumber);
        }
        if (startBlockNumber != null && startBlockNumber <= endBlockNumber) {
          state.sync.inProgress = true;
          const batchSize = 25;
          let toBlock = endBlockNumber;
          do {
            let fromBlock = toBlock - batchSize;
            if (fromBlock < startBlockNumber) {
              fromBlock = startBlockNumber;
            }
            // console.log("fromBlock: " + fromBlock + ", toBlock: " + toBlock);
            const filter = {
              // address: CRYPTOPUNKSMARKETADDRESS, // [NIXADDRESS, weth.address],
              fromBlock: fromBlock,
              toBlock: toBlock,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
                '0x0000000000000000000000000000000000000000000000000000000000000000', // Null address
                null
              ],
            };
            const events = await provider.getLogs(filter);
            // console.log("monitorMints - events: " + JSON.stringify(events.slice(0, 1)));
            for (const event of events) {
              if (!event.removed && event.topics.length == 4) {
                const contract = event.address.toLowerCase();
                const tokenId = event.topics[3] || event.data || null;
                const bnTokenId = tokenId == null ? null : ethers.BigNumber.from(tokenId);
                if (!(contract in contractsCollator)) {
                  contractsCollator[contract] = [];
                }
                const transfer = {
                  contract: contract,
                  from: ADDRESS0,
                  to: '0x' + event.topics[2].substring(26, 66),
                  tokenId: bnTokenId,
                  blockNumber: event.blockNumber,
                  logIndex: event.logIndex,
                  txHash: event.transactionHash,
                };
                transfers.push(transfer);
                contractsCollator[contract].push(transfer);
              }
            }
            toBlock -= batchSize;
          } while (toBlock > startBlockNumber);
          transfers.sort((a, b) => {
            if (a.blockNumber == b.blockNumber) {
              return b.logIndex - a.logIndex;
            } else {
              return b.blockNumber - a.blockNumber;
            }
          });
          state.transfers = transfers;
          // Collections
          const erc721Helper = new ethers.Contract(ERC721HELPERADDRESS, ERC721HELPERABI, provider);
          const contracts = Object.keys(contractsCollator);
          let tokenInfo = null;
          const collections = {};
          try {
            tokenInfo = await erc721Helper.tokenInfo(contracts);
            for (let i = 0; i < contracts.length; i++) {
              contractsCollator[contracts[i]].sort((a, b) => {
                if (a.blockNumber == b.blockNumber) {
                  return b.logIndex - a.logIndex;
                } else {
                  return b.blockNumber - a.blockNumber;
                }
              });
              collections[contracts[i]] = {
                status: ethers.BigNumber.from(tokenInfo[0][i]).toString(),
                symbol: tokenInfo[1][i],
                name: tokenInfo[2][i],
                totalSupply: ethers.BigNumber.from(tokenInfo[3][i]).toString(),
                transfers: contractsCollator[contracts[i]],
              };
            }
            if ('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' in contractsCollator) {
              collections['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] = { status: 'todo', symbol: 'ENS', name: 'Ethereum Name Service', totalSupply: 'lots', transfers: contractsCollator['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'] || [] };
            }
          } catch (e) {
            console.log("ERROR - Not ERC-721");
          }
          state.collections = collections;
        }
        state.sync.inProgress = false;
      }
    },

    halt(state) {
      state.halt = true;
    },
  },
  actions: {
    updateMintMonitorFilter(context, filterUpdate) {
      logInfo("nftsModule", "filterUpdates.updateMintMonitorFilter() - filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('monitorMints', { syncMode: 'updateFilter', configUpdate: null, filterUpdate });
    },
    updateFilter(context, filterUpdate) {
      // logInfo("nftsModule", "filterUpdates.updateFilter() - filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('loadSales', { syncMode: 'updateFilter', configUpdate: null, filterUpdate });
    },
    updateConfig(context, configUpdate) {
      // logInfo("nftsModule", "configUpdates.updateConfig() - configUpdate: " + JSON.stringify(configUpdate));
      context.commit('loadSales', { syncMode: 'updateConfig', configUpdate, filterUpdate: null });
    },
    monitorMints(context, { syncMode, configUpdate, filterUpdate }) {
      logInfo("nftsModule", "actions.monitorMints() - syncMode: " + syncMode + ", configUpdate: " + JSON.stringify(configUpdate) + ", filterUpdate: " + JSON.stringify(filterUpdate));
      context.commit('monitorMints', { syncMode: syncMode, configUpdate: configUpdate, filterUpdate: filterUpdate } );
    },
    loadSales(context, syncMode) {
      // logInfo("nftsModule", "actions.loadSales() - syncMode: " + syncMode);
      context.commit('loadSales', { syncMode: syncMode, configUpdate: null, filterUpdate: null } );
    },
    halt(context) {
      context.commit('halt');
    },
  },
};
