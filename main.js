const express = require('express')
const port = process.env.PORT || 3000
const app = express()
const io = require('./socket/controler')(app)

app.engine('ejs', require('express-ejs-extend'))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
