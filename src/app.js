const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const path = require('path')
const express = require('express')
//to work with partials
const hbs = require('hbs')

const app = express()

//enable to set port on Heroku
const port = process.env.PORT || 3000

//---------Define paths for Express config
const publicDirectoryPath = (path.join(__dirname, '../public'))
//by default, hbs fiels are stored in ../views
//necessary if the hbs files are not stored in the ../views directory
const viewsPath = path.join(__dirname, '../templates/views')
//partials
const partialsPath = path.join(__dirname, '../templates/partials')

//---------Set up handlebars engine and views location
//use hbs(handlebars) as the default view engine
//for dynamic content rendering
app.set('view engine', 'hbs')
//necessary if the hbs files are not stored in the ../views directory
app.set('views', viewsPath)
//partials
hbs.registerPartials(partialsPath)

//----------Set up static directory to serve
app.use(express.static(publicDirectoryPath))

//----------Set up hbs router
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Handlebars'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'The Witcher'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is the documentation for the Weather App',
        name: 'Micky'
    })
})

//customize server to serve up the public folder
app.use(express.static(publicDirectoryPath))
//app.com or app.com/index.html
//app.com/about.html
//app.com/help.html

//app.com/weather
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Please provide an address!"
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        if (res.error) {
           return res.send({ res })
        }

        forecast(latitude, longitude, (error, data) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: data,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    console.log(req.query)

    // must provide search term
    // one response is allowed
    // return --> make sure the coding after this statement is not executed
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }
    res.send({
        "products": []
    })
})


//404 handler
//match anything starting */help/ that has not been matched
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error',
        errorText: 'Help article not found',
        name: 'none'
    })
})

//404 handler
//match anything that has not been matched
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error',
        errorText: 'Page not found',
        name: 'none'
    })
})

//start the server
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})