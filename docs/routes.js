const routes = [{
    path: '/ens/:search?/:topic?',
    component: ENSSearch,
    name: 'ENSSearch',
    props: true,
  }, {
    path: '/enssales/:search?/:topic?',
    component: ENSSales,
    name: 'ENSSales',
    props: true,
  }, {
    path: '/cryptopunks/:search?/:topic?',
    component: CryptoPunks,
    name: 'CryptoPunks',
    props: true,
  }, {
    path: '/nfts/:search?/:topic?',
    component: NFTs,
    name: 'NFTs',
    props: true,
  }, {
    path: '/config',
    component: Config,
    name: 'Config',
  }, {
    path: '*',
    component: Welcome,
    name: ''
  }
];
