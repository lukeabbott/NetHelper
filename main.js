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
