// get vue component
function init () {
  console.log('hah')
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })
}

init()