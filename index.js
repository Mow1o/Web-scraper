const PORT = process.env.PORT || 8080
const express = require('express') /* package */
const axios = require('axios') /* package */
const cheerio = require('cheerio') /*package */

const app = express()

const lehdet = [
    {
        name: 'Hesari',
        address: 'https://www.hs.fi/politiikka/',
        base: 'https://www.hs.fi'
    },
    {
        name: 'Aamulehti',
        address: 'https://www.aamulehti.fi/',
        base: 'https://www.aamulehti.fi'
    },
    {
        name: 'Iltasanomat',
        address: 'https://www.is.fi/',
        base: 'https://www.is.fi'
    },
    {
        name: 'IUltalehti',
        address: 'https://www.iltalehti.fi/',
        base: 'https://www.iltalehti.fi'
    },
    {
        name: 'Turun-sanomat',
        address: 'https://www.ts.fi/',
        base: 'https://www.ts.fi'
    },
    {
        name: 'Lapinkansa',
        address: 'https://www.lapinkansa.fi/',
        base: 'https://www.lapinkansa.fi'
    },

]

const articles = []




lehdet.forEach(lehti => {
    axios.get(lehti.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Venäjä")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: lehti.base + url,
                    source: lehti.name

                })

            })


        })
})

/* home */
app.get('/', (req, res) => {
    res.json('Welcome to my venäjä uutiset API')
})

/* news base */
app.get('/news', (req, res) => {
    res.json(articles)
})


/* get news by writing newspaper name after url */

app.get('/news/:lehtiId', (req, res) => {
    const lehtiId = req.params.lehtiId

    const lehtiAddress = lehdet.filter(lehti => lehti.name === lehtiId)[0].address
    const lehtiBase = lehdet.filter(lehti => lehti.name == lehtiId)[0].base

    axios.get(lehtiAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Venäjä")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: lehtiBase + url,
                    source: lehtiId

                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

