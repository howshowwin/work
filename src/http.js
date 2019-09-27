var express = require('express');
var app = express();


const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const url = require('url')
const multer = require('multer')
const upload = multer({ dest: 'tmp_uploads' })
const fs = require('fs')
const admin1 = require(__dirname + '/admin/admin1')
const session = require('express-session')
const moment = require('moment-timezone')
const mysql = require('mysql')
const bluebird = require('bluebird')
const cors = require("cors")
const db = mysql.createConnection({
    host: "localhost",
    user: "god",
    password: "111",
    database: "handmade_admin"
})
db.connect()
bluebird.promisifyAll(db)
app.use(cors())


app.get('/try-dbcc', (req, res) => {
    const sql = "SELECT * FROM `vendor` WHERE `principal` LIKE ? "; //LIMIT 0, 5
    db.query(sql, ["%%"], (error, results, fields) => {
        // console.log(error);
        console.log(results);
        // console.log(fields);
        // res.json(results);

        for (let r of results) {
            r.created_at = moment(r.created_at).format('YYYY-MM-DD');
        }


        res.render('try-db', {
            rows: results

        });
        // console.log(rows)
    });
    //res.send('ok');
});




app.get('/try-dbcc/:page?', (req, res) => {
    let page = req.params.page || 1
    let perPage = 5
    const output = {}
    db.queryAsync("SELECT COUNT(1) total FROM `vendor`")
        .then(result => {
            output.alldate = result[0].total
            return db.queryAsync(`SELECT * FROM vendor LIMIT ${(page-1)*perPage},${perPage}`)
        })
        .then(result=>{
            output.rows =result
            res.json(output)
        })
        .catch(error => {
            console.log(error)
            res.send(error)
        }
        )


})







app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());












app.get('/try-upload', (req, res) => {
    res.render("try-upload")
})

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: "jiroejoiw",
    cookie: {
        maxAge: 1200000
    }


}))
app.get('/try-session', (request, response) => {
    request.session.my_view = request.session.my_view || 0
    request.session.my_view++
    response.json({
        guest: "dickk",
        view: request.session.my_view
    })

})


app.get('/try-moment', (req, res) => {
    const myfmt = 'YYYY-MM-DD HH:mm:ss'
    const exp = req.session.cookie.expires
    const mo1 = moment(exp)
    const mo2 = moment(new Date())
    res.contentType('text/plain')
    res.write(exp + '\n')
    res.write('台北' + mo1.format(myfmt) + '\n')
    res.write('台北' + mo1.tz("Asia/Tokyo").format(myfmt) + '\n')
    res.write('台北' + mo2.format(myfmt) + '\n')
    res.write('台北' + mo2.tz("Asia/Tokyo").format(myfmt) + '\n')
    res.end(JSON.stringify(req.session))


})


app.get('/try-sess', (request, response) => {
    request.session.views = request.session.views || 0
    request.session.views++
    response.json({
        guest: "dickk",
        view: request.session.views
    })

})


app.post('/try-upload', upload.single('avatar'), (req, res) => {
    // console.log(req.file)
    // res.send('jio')
    if (req.file && req.file.originalname) {
        switch (req.file.mimetype) {
            case "image/jpg":
            case "image/png":
            case "image/jpeg":
                fs.createReadStream(req.file.path)
                    .pipe(
                        fs.createWriteStream("./public/img/" + req.file.originalname)
                    )

                break;
            default:


        }
    } else {


    }
    res.render('try-upload', {
        result: true,
        name: req.body.name,
        avatar: "/img/" + req.file.originalname
    })
})
admin1(app)
app.use(require(__dirname + '/admin/admin2'))
app.use('/amm', require(__dirname + "/admin/admin3"))



app.set('view engine', 'ejs');

app.use(express.static('public'))

app.get('/try-post-form', (request, response) => {
    response.render('try-post-form');
})
app.post('/try-post-form', urlencodedParser, (request, response) => {
    response.render('try-post-form', request.body)
})



app.get('/try-post-form-2', (request, response) => {
    response.send("GET")
})
app.post('/try-post-form-2', (request, response) => {
    response.json(request.body);
})
app.put('/try-post-form-2', (request, response) => {
    response.send("put")

})



app.get('/my-params1/:action/:id', (req, res) => {
    res.json(req.params)
})

app.get('/my-params2/:action?/:id?', (req, res) => {
    res.json(req.params)
})

app.get('/my-params3/*/*?', (req, res) => {
    res.json(req.params)
})

app.get(/^\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res) => {
    let str = req.url.slice(1);
    str = str.split('-').join('')
    // str = str.slice(0,10)
    str = str.split("?")[0]
    res.send('phone:' + str)
})

app.get('/qs-ts', function (request, response) {
    const urlparts = url.parse(request.url, true);
    console.log(urlparts);
    response.render('qs-ts', {
        urlparts: urlparts.query
    })

})
app.get('/', function (request, response) {
    response.render('home', { name: "shoaoooo" })
})
app.get('/test', function (request, response) {
    const data1 = require('./../data/test.json')
    response.render('test', {
        test: data1
    })
})
app.use((request, response) => {
    response.type('text/plain');
    response.status(404);
    response.send("ㄉ ㄉㄉㄉ")
})
app.listen(3000, function () {
    console.log("lp33U酪乳")
})