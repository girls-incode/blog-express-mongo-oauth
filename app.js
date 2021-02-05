import express from 'express';
import dotenv from 'dotenv';
import connDB from './config/db.js';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import googlePassport from './config/passport.js';
import router from './routes/index.js';
import authRouter from './routes/auth.js';
import storiesRouter from './routes/stories.js';
import exphbs from 'express-handlebars';
import swaggerJSDoc  from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import connMongo from 'connect-mongo';
import methodOverride from 'method-override';
import { formatDate, truncate, stripTags, editIcon, select} from './helpers/display.js';

dotenv.config({ path: './config/config.env' });
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

const MongoStore = connMongo(session);
mongoose.set('useFindAndModify', false);

const swaggerDefinition = {
    info: {
        title: 'Blog',
        version: '1.0.0',
        description: 'Your life memories',
        license: {
            name: 'MIT',
            url: 'http://girlsincode.com',
        },
        contact: {
            name: 'girlsincode',
            url: 'http://girlsincode.com',
            email: 'hola@girlsincode.com',
        },
    },
    host: 'localhost:'+PORT,
    basePath: '/',
};
const options = {
    swaggerDefinition,
    apis: [path.resolve(__dirname, 'app.js')],
};
const swaggerSpec = swaggerJSDoc(options);

googlePassport(passport);

connDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
);

// app.get('/swagger.json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
// });

app.engine('.hbs', exphbs(
    {
        helpers: {
            editIcon,
            formatDate,
            select,
            stripTags,
            truncate,
        },
        defaultLayout: 'main',
        extname: '.hbs'
    }));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'blogsess',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.loggedUser = req.user || null;
    console.log('loggedUser', req.user);
    next()
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
app.use('/auth', authRouter);
app.use('/stories', storiesRouter);

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}...`));

