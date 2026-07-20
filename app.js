  const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const app = express();

// Set up multer for file uploads
// Trip image storage
const tripStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/trips/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const tripUpload = multer({ storage: tripStorage });

// Attraction image storage
const attractionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/attractions/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const attractionUpload = multer({ storage: attractionStorage });

// Activity image storage
const activityStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/itineraries/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const activityUpload = multer({ storage: activityStorage });

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'RP738964$',
//     database: 'c237_supermarketdb'
//   });

// [C237-025] Database connection to Azure MySQL Database
const connection = mysql.createConnection({
    host: 'c237-annie-mysql.mysql.database.azure.com',
    user: 'c237_025',
    password: 'c237025@2026!',
    database: 'c237_025_ca2team2',
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');
//  enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({
    extended: false
}));

//TO DO: Insert code for Session Middleware below 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(flash());

// Middleware to check if user is logged in
const checkAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'Please log in to view this resource');
        res.redirect('/login');
    }
};

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.session.user.role === 'admin') {
        return next();
    } else {
        req.flash('error', 'Access denied');
        res.redirect('/trips');
    }
};

// Middleware for form validation
const validateRegistration = (req, res, next) => {
    const { username, email, password, address, contact, role } = req.body;

    if (!username || !email || !password || !address || !contact || !role) {
        return res.status(400).send('All fields are required.');
    }

    if (password.length < 6) {
        req.flash('error', 'Password should be at least 6 or more characters long');
        req.flash('formData', req.body);
        return res.redirect('/register');
    }
    next();
};

// Define routes
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/adminDashboard', checkAuthenticated, checkAdmin, (req, res) => {
    const attractionSql = 'SELECT COUNT(*) AS totalAttractions FROM attractions';
    const tripSql = 'SELECT COUNT(*) AS totalTrips FROM trips';
    const userSql = "SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'admin'";

    connection.query(attractionSql, (err1, attractionResult) => {
        if (err1) throw err1;

        connection.query(tripSql, (err2, tripResult) => {
            if (err2) throw err2;

            connection.query(userSql, (err3, userResult) => {
                if (err3) throw err3;

                res.render('adminDashboard', {
                    user: req.session.user,
                    totalAttractions: attractionResult[0].totalAttractions,
                    totalTrips: tripResult[0].totalTrips,
                    totalUsers: userResult[0].totalUsers
                });
            });
        });
    });
});

app.get('/register', (req, res) => {
    res.render('register', { messages: req.flash('error'), user: req.session.user, formData: {} });
});

app.post('/register', validateRegistration, (req, res) => {

    const { username, email, password, address, contact, role } = req.body;

    const sql = 'INSERT INTO users (username, email, password, address, contact, role) VALUES (?, ?, SHA1(?), ?, ?, ?)';
    connection.query(sql, [username, email, password, address, contact, role], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login', { messages: req.flash('success'), errors: req.flash('error'), user: req.session.user });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/login');
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND password = SHA1(?)';

    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            // Successful login
            req.session.user = results[0];

            req.flash('success', 'Login successful!');

            if (req.session.user.role == 'user') {
                res.redirect('/trips');
            } else {
                res.redirect('/adminDashboard');
            }

        } else {
            // Invalid credentials
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    });
});

app.get('/trips', checkAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM trips WHERE userId = ?';

    // Fetch trips data from SQL
    connection.query(sql, [req.session.user.id], (error, results) => {
        if (error) throw error;
        res.render('tripList', { user: req.session.user, trips: results });
    });
});

app.get('/trip/:id', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;
    const sql = 'SELECT * FROM trips WHERE tripId = ?';

    connection.query(sql, [tripId], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.render('tripDetails', { trip: results[0], user: req.session.user });
        } else {
            res.status(404).send('Trip not found');
        }
    });
});

app.get('/addTrip', checkAuthenticated, (req, res) => {
    res.render('addTrip', { user: req.session.user });
});

app.post('/addTrip',
    tripUpload.fields([
        { name: 'image1' },
        { name: 'image2' },
        { name: 'image3' }
    ]),

    (req, res) => {
        const { tripName, country, city, startDate, endDate, budget, status } = req.body;

        let image1;
        let image2;
        let image3;

        if (req.files.image1) {
            image1 = req.files.image1[0].filename;
        } else {
            image1 = null;
        }

        if (req.files.image2) {
            image2 = req.files.image2[0].filename;
        } else {
            image2 = null;
        }

        if (req.files.image3) {
            image3 = req.files.image3[0].filename;
        } else {
            image3 = null;
        }

        const sql = 'INSERT INTO trips (userId, tripName, country, city, startDate, endDate, budget, image1, image2, image3, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        connection.query(sql, [req.session.user.id, tripName, country, city, startDate, endDate, budget, image1, image2, image3, status], (error, results) => {
            if (error) {
                console.error("Error adding trip:", error);
                res.status(500).send('Error adding trip');
            } else {
                res.redirect('/trips');
            }
        });
    });

// Route to render the addAttraction page, accessible only to authenticated admin users
app.get('/addAttraction', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('addAttraction', { user: req.session.user });
});

app.post('/addAttraction', checkAuthenticated, checkAdmin,
    attractionUpload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]),

    (req, res) => {
        const { name, country, city, category, description } = req.body;

        let image1;
        let image2;
        let image3;

        if (req.files.image1) {
            image1 = req.files.image1[0].filename;
        } else {
            image1 = null;
        }

        if (req.files.image2) {
            image2 = req.files.image2[0].filename;
        } else {
            image2 = null;
        }

        if (req.files.image3) {
            image3 = req.files.image3[0].filename;
        } else {
            image3 = null;
        }

        const sql = `INSERT INTO attractions (name, country, city, category, description, image1, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(sql, [name, country, city, category, description, image1, image2, image3], (error, results) => {
            if (error) {
                console.error("Error adding attraction:", error);
                res.status(500).send("Error adding attraction");
            } else {
                res.redirect('/attractions');
            }
        });
    });

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/updateTrip/:id', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;
    const sql = 'SELECT * FROM trips WHERE tripId = ?';

    // Fetch data from MySQL based on the trip ID
    connection.query(sql, [tripId], (error, results) => {
        if (error) throw error;

        // Check if any trip with the given ID was found
        if (results.length > 0) {
            // Render HTML page with the trip data
            res.render('updateTrip', { trip: results[0], user: req.session.user });
        } else {
            // If no trip with the given ID was found, render a 404 page or handle it accordingly
            res.status(404).send('Trip not found');
        }
    });
});

app.post('/updateTrip/:id', tripUpload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]), (req, res) => {
        const tripId = req.params.id;

        // Extract trip data from the request body
        const { tripName, country, city, startDate, endDate, budget, status} = req.body;

        let image1 = req.body.currentImage1 || null;    //retrieve current image filenames
        let image2 = req.body.currentImage2 || null;
        let image3 = req.body.currentImage3 || null;

        if (req.files.image1) {                     //if new image is uploaded
            image1 = req.files.image1[0].filename;  // set image to be new image filename
        }

        if (req.files.image2) {
            image2 = req.files.image2[0].filename;
        }

        if (req.files.image3) {
            image3 = req.files.image3[0].filename;
        }

        const sql = `UPDATE trips SET tripName=?, country=?, city=?, startDate=?, endDate=?, budget=?, image1=?, image2=?, image3=?, status=? WHERE tripId=?`;
        // Insert the new image into the database
        connection.query(sql, [tripName, country, city, startDate, endDate, budget, image1, image2, image3, status, tripId], (error) => {
            if (error) {
                // Handle any error that occurs during the database operation
                console.error(error);
                res.status(500).send("Error updating trip");
            } else {
                // Send a success response
                res.redirect('/trips');
            }
        });
    });
    
app.get('/updateAttraction/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const attractionId = req.params.id;
    const sql = 'SELECT * FROM attractions WHERE attractionId = ?';

    // Fetch data from MySQL based on the attraction ID
    connection.query(sql, [attractionId], (error, results) => {
        if (error) throw error;

        // Check if any attraction with the given ID was found
        if (results.length > 0) {
            // Render HTML page with the attraction data
            res.render('updateAttraction', { attraction: results[0], user: req.session.user });
        } else {
            // If no attraction with the given ID was found, render a 404 page or handle it accordingly
            res.status(404).send('Attraction not found');
        }
    });
});

app.post('/updateAttraction/:id', checkAuthenticated, checkAdmin, attractionUpload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]), (req, res) => {
    const attractionId = req.params.id;
    const { name, country, city, category, description } = req.body;

    // Keep existing images if no new image is uploaded
    let image1 = req.body.currentImage1 || null;
    let image2 = req.body.currentImage2 || null;
    let image3 = req.body.currentImage3 || null;

    // Replace images if new ones are uploaded
    if (req.files.image1) {
        image1 = req.files.image1[0].filename;
    }

    if (req.files.image2) {
        image2 = req.files.image2[0].filename;
    }

    if (req.files.image3) {
        image3 = req.files.image3[0].filename;
    }

    const sql = `UPDATE attractions SET name=?, country=?, city=?, category=?, description=?, image1=?, image2=?, image3=? WHERE attractionId=?`;
    // Insert the new image(s) into the database
    connection.query(sql, [name, country, city, category, description, image1, image2, image3, attractionId], (error) => {
        if(error) {
            console.error(error);
            res.status(500).send("Error updating attraction");
        } else {
            res.redirect('/attractions');
        }
    });
});

app.get('/deleteTrip/:id', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;

    connection.query('DELETE FROM trips WHERE tripId = ?', [tripId], (error, results) => {
        if (error) {
            console.error("Error deleting trip:", error);
            res.status(500).send('Error deleting trip');
        } else {
            res.redirect('/trips');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

// [C237-025] Database connection to Azure MySQL Database