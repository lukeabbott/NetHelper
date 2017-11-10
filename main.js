document.addEventListener('keypress', function (e) {
  var key = e.which || e.keyCode
  if (key === 13) { // 13 is enter
    if (!e.target.classList.contains('page-choice')) {
      return
    }
    var chosenPage = 'https://' + e.target.getAttribute('data-url') + e.target.value
    browser.tabs.create({
      url: chosenPage
    })
  }
})

var urls = [
  {
    title: 'Inv Item',
    url: 'system.na2.netsuite.com/app/common/item/item.nl?id='
  },
  {
    title: 'Transaction',
    url: '/app/accounting/transactions/transaction.nl?id='
  },
  {
    title: 'ISM',
    url: '/app/common/custom/custrecordentry.nl?rectype=2408&id='
  },
  {
    title: 'Property',
    url: '/app/common/custom/custrecordentry.nl?rectype=2407&id='
  },
  {
    title: 'SM',
    url: '/app/common/custom/custrecordentry.nl?rectype=2409&id='
  },
  {
    title: 'Step',
    url: '/app/common/custom/custrecordentry.nl?rectype=2406&id='
  }
]
