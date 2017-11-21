var initData = {
  urls: [
    {
      title: 'Inventory Item',
      url: '/app/common/item/item.nl?id='
    },
    {
      title: 'Transaction',
      url: '/app/accounting/transactions/transaction.nl?id='
    },
    {
      title: 'Item Selection Map',
      url: '/app/common/custom/custrecordentry.nl?rectype=2408&id='
    },
    {
      title: 'Product Property',
      url: '/app/common/custom/custrecordentry.nl?rectype=2407&id='
    },
    {
      title: 'Selection Mod',
      url: '/app/common/custom/custrecordentry.nl?rectype=2409&id='
    },
    {
      title: 'Step',
      url: '/app/common/custom/custrecordentry.nl?rectype=2406&id='
    }
  ],
  baseUrl: 'https://system.na2.netsuite.com'
}

export { initData }
