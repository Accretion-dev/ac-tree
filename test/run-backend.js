const testConfig = require('./test-config.json')
// import backend from 'vue-selenium-unittest/backend.js'
import backend from 'vue-selenium-unittest/src/backend.js'
let normalKeys = '~!@#$%^&*()_+|}{POIUYTREWQASDFGHJKL:"?><MNBVCXZ"}'+"`1234567890-=\\][poiuytrewqasdfghjkl;'/.,mnbvcxz'"

let tests = {
  async all ({name, driver, Test, Key, By, until, Button, Origin}) {
    let keys = Object.keys(tests).filter(_ => _ !== 'all' && _ !== 'demo')
    for (let key of keys) {
      await tests[key]({name, driver, Test, Key, By, until, Button, Origin})
    }
  },
  demo: async ({name, driver, Test, Key, By, until, Button, Origin}) => {
    let data, keys, input
    let rootSelector = "#stretch"
    let interval = 0
    let app = await driver.findElement({id: 'app'})
    t = Test.block({name, rootSelector})
    await t.init()
    await t.initScroll()
    let root = await driver.findElement(By.css(rootSelector))
    let inputs = await root.findElements({tagName: 'input'})
    t.changeComment('test stretch (input and delete)', 500)
    input = inputs[0]
    await t.actions({actions: [], interval})

    t.changeComment('all done',500)
    t.changeComment('')
  },
  stretch: async ({name, driver, Test, Key, By, until, Button, Origin}) => {
    let data, keys, input
    let rootSelector = "#stretch"
    let interval = 0
    let app = await driver.findElement({id: 'app'})
    t = Test.block({name, rootSelector})
    await t.init()
    await t.initScroll()
    let root = await driver.findElement(By.css(rootSelector))
    let inputs = await root.findElements(By.css('.ac-input-input'))
    t.changeComment('test stretch (input and delete)', 500)
    input = inputs[0]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [
      '!@#$%^&*()_',
      [Key.CONTROL, Key.ENTER],
      '+<>1234567890',
      [Key.CONTROL, Key.ENTER],
      '-=qwertyuiop[]\'\"'
    ], interval})
    keys = [...Array(20).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions: keys, interval})

    input = inputs[1]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [
      '!@#$%^&*()_',
      [Key.CONTROL, Key.ENTER],
      '+<>1234567890',
      [Key.CONTROL, Key.ENTER],
      '-=qwertyuiop[]\'\"'
    ], interval})
    keys = [...Array(30).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions: keys, interval})

    input = inputs[2]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [
      '!@#$%^&*()_',
      '+<>1234567890',
      '-=qwertyuiop[]\'\"'
    ], interval})
    keys = [...Array(35).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions: keys, interval})

    t.changeComment('test tab and shift+tab to go next and previous', 500)
    input = inputs[0]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.TAB, Key.TAB], interval: 300, delay: 200})
    await t.actions({actions: [[Key.SHIFT, Key.TAB], [Key.SHIFT, Key.TAB]], interval: 300, delay: 200})

    t.changeComment('click input with text will select all', 500)
    input = inputs[1]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[2]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[0]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    t.changeComment('clean up', 500)
    await t.actions({actions: [Key.TAB, Key.BACK_SPACE]})

    t.changeComment('all done',500)
    t.changeComment('')
  },
}

let t = new backend({options: testConfig, tests})
t.init()
