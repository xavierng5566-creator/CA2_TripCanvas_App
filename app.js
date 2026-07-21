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
function parseDateOnly(value) {
    if (value instanceof Date) {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function buildTripDays(startDate, endDate) {
    const start = parseDateOnly(startDate);
    const end = parseDateOnly(endDate);

    if (!start || !end) {
        return [];
    }

    const days = [];
    const current = new Date(start);

    while (current <= end) {
        const dayDate = new Date(current);
        days.push({
            dayNumber: days.length + 1,
            label: dayDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            dateValue: `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`
        });

        current.setDate(current.getDate() + 1);
    }

    if (days.length === 0) {
        days.push({
            dayNumber: 1,
            label: 'Trip Day 1',
            dateValue: start.toISOString().split('T')[0]
        });
    }

    return days;
}

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

    connection.query(`
        CREATE TABLE IF NOT EXISTS itinerary_entries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tripId INT NOT NULL,
            dayNumber INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            timeSlot VARCHAR(50),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tripId) REFERENCES trips(tripId) ON DELETE CASCADE
        )
    `, (tableErr) => {
        if (tableErr) {
            console.error('Error creating itinerary_entries table:', tableErr);
        } else {
            console.log('Itinerary table ready');
            connection.query('ALTER TABLE itinerary_entries ADD COLUMN sortOrder INT NOT NULL DEFAULT 1', () => {
                // The column may already exist when the application is restarted.
            });
        }
    });
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

app.get('/planner/:id', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;

    const tripSql = 'SELECT * FROM trips WHERE tripId = ?';
    connection.query(tripSql, [tripId], (error, tripResults) => {
        if (error) throw error;

        if (tripResults.length === 0) {
            return res.status(404).send('Trip not found');
        }

        const trip = tripResults[0];
        const days = buildTripDays(trip.startDate, trip.endDate);

        const itemSql = 'SELECT * FROM itinerary_entries WHERE tripId = ? ORDER BY dayNumber ASC, sortOrder ASC, id ASC';
        connection.query(itemSql, [tripId], (itemError, itineraryItems) => {
            if (itemError) throw itemError;

            res.render('planner', {
                trip,
                days,
                items: itineraryItems,
                user: req.session.user,
                editItem: null,
                viewItem: null
            });
        });
    });
});

app.get('/planner/:id/add', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;

    const tripSql = 'SELECT * FROM trips WHERE tripId = ?';
    connection.query(tripSql, [tripId], (error, tripResults) => {
        if (error) throw error;
        if (tripResults.length === 0) return res.status(404).send('Trip not found');

        const trip = tripResults[0];
        const days = buildTripDays(trip.startDate, trip.endDate);

        res.render('addPlan', {
            trip,
            days,
            user: req.session.user
        });
    });
});

app.post('/planner/:id/add', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;
    const { dayNumber, title, description, timeSlot } = req.body;

    if (!title) {
        req.flash('error', 'Title is required');
        return res.redirect(`/planner/${tripId}/add`);
    }

    const selectedDay = parseInt(dayNumber, 10) || 1;
    connection.query('SELECT COALESCE(MAX(sortOrder), 0) + 1 AS nextOrder FROM itinerary_entries WHERE tripId = ? AND dayNumber = ?', [tripId, selectedDay], (orderErr, orderRows) => {
        if (orderErr) return res.status(500).send('Error creating plan order');
        const sql = 'INSERT INTO itinerary_entries (tripId, dayNumber, title, description, timeSlot, sortOrder) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(sql, [tripId, selectedDay, title, description, timeSlot, orderRows[0].nextOrder], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding itinerary item');
        } else {
            res.redirect(`/planner/${tripId}`);
        }
        });
    });
});

app.get('/planner/:id/edit/:itemId', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;
    const itemId = req.params.itemId;

    const tripSql = 'SELECT * FROM trips WHERE tripId = ?';
    connection.query(tripSql, [tripId], (error, tripResults) => {
        if (error) throw error;
        if (tripResults.length === 0) return res.status(404).send('Trip not found');

        const trip = tripResults[0];
        const days = buildTripDays(trip.startDate, trip.endDate);

        const itemSql = 'SELECT * FROM itinerary_entries WHERE id = ? AND tripId = ?';
        connection.query(itemSql, [itemId, tripId], (itemError, itemResults) => {
            if (itemError) throw itemError;

                const itemSqlAll = 'SELECT * FROM itinerary_entries WHERE tripId = ? ORDER BY dayNumber ASC, sortOrder ASC, id ASC';
            connection.query(itemSqlAll, [tripId], (allErr, itineraryItems) => {
                if (allErr) throw allErr;

                if (itemResults.length === 0) {
                    return res.status(404).send('Plan not found');
                }

                res.render('editPlan', {
                    trip,
                    days,
                    item: itemResults[0],
                    user: req.session.user
                });
            });
        });
    });
});

app.post('/planner/:id/edit/:itemId', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;
    const itemId = req.params.itemId;
    const { dayNumber, title, description, timeSlot, sortOrder } = req.body;

    const sql = 'UPDATE itinerary_entries SET dayNumber = ?, title = ?, description = ?, timeSlot = ?, sortOrder = ? WHERE id = ? AND tripId = ?';
    connection.query(sql, [parseInt(dayNumber, 10) || 1, title, description, timeSlot, Math.max(1, parseInt(sortOrder, 10) || 1), itemId, tripId], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating itinerary item');
        } else {
            res.redirect(`/planner/${tripId}`);
        }
    });
});

app.get('/planner/:id/view/:itemId', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;
    const itemId = req.params.itemId;

    const tripSql = 'SELECT * FROM trips WHERE tripId = ?';
    connection.query(tripSql, [tripId], (error, tripResults) => {
        if (error) throw error;
        if (tripResults.length === 0) return res.status(404).send('Trip not found');

        const trip = tripResults[0];
        const days = buildTripDays(trip.startDate, trip.endDate);

        const itemSql = 'SELECT * FROM itinerary_entries WHERE id = ? AND tripId = ?';
        connection.query(itemSql, [itemId, tripId], (itemError, itemResults) => {
            if (itemError) throw itemError;

                const itemSqlAll = 'SELECT * FROM itinerary_entries WHERE tripId = ? ORDER BY dayNumber ASC, sortOrder ASC, id ASC';
            connection.query(itemSqlAll, [tripId], (allErr, itineraryItems) => {
                if (allErr) throw allErr;

                res.render('planner', {
                    trip,
                    days,
                    items: itineraryItems,
                    user: req.session.user,
                    editItem: null,
                    viewItem: itemResults[0] || null
                });
            });
        });
    });
});

app.get('/planner/:id/delete/:itemId', checkAuthenticated, (req, res) => {
    const tripId = req.params.id;
    const itemId = req.params.itemId;

    const sql = 'DELETE FROM itinerary_entries WHERE id = ? AND tripId = ?';
    connection.query(sql, [itemId, tripId], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting itinerary item');
        } else {
            res.redirect(`/planner/${tripId}`);
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

app.get('/attractions', checkAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM attractions';

    // Fetch attractions data from SQL
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.render('attractionList', { user: req.session.user, attractions: results });
    });
});

app.get('/attraction/:id', checkAuthenticated, (req, res) => {
    const attractionId = req.params.id;
    const sql = 'SELECT * FROM attractions WHERE attractionId = ?';

    connection.query(sql, [attractionId], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.render('attractionDetails', { user: req.session.user, attraction: results[0] });
        }
        else {
            res.status(404).send('Attraction not found');
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

// ================= CHECKLIST ROUTES =================

// Category options for the checklist item dropdown
const CHECKLIST_CATEGORIES = [
    'Documents',
    'Clothing',
    'Footwear',
    'Toiletries',
    'Electronics',
    'Health & Safety',
    'Money & Cards',
    'Miscellaneous'
];

// GET /checklist - pick which trip's checklist to view
app.get('/checklist', checkAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM trips WHERE userId = ?';

    connection.query(sql, [req.session.user.id], (error, trips) => {
        if (error) throw error;
        res.render('checklist', {
            user: req.session.user,
            trips: trips,
            messages: req.flash('success'),
            errors: req.flash('error')
        });
    });
});

// GET /checklist/:tripId - view/manage checklist items for a trip
app.get('/checklist/:tripId', checkAuthenticated, (req, res) => {
    const tripId = req.params.tripId;
    const tripSql = 'SELECT * FROM trips WHERE tripId = ? AND userId = ?';

    connection.query(tripSql, [tripId, req.session.user.id], (error, trips) => {
        if (error) throw error;

        if (trips.length === 0) {
            req.flash('error', 'Trip not found.');
            return res.redirect('/checklist');
        }

        const itemsSql = 'SELECT * FROM checklists WHERE tripId = ? ORDER BY category, itemName';

        connection.query(itemsSql, [tripId], (error, items) => {
            if (error) throw error;
            res.render('checklistItems', {
                user: req.session.user,
                trip: trips[0],
                items: items,
                categories: CHECKLIST_CATEGORIES,
                messages: req.flash('success'),
                errors: req.flash('error')
            });
        });
    });
});

// POST /checklist/:tripId/add - add a new checklist item to a trip
app.post('/checklist/:tripId/add', checkAuthenticated, (req, res) => {
    const tripId = req.params.tripId;
    const { itemName, category } = req.body;

    if (!itemName || !category) {
        req.flash('error', 'Item name and category are required.');
        return res.redirect('/checklist/' + tripId);
    }

    // Make sure the trip belongs to the logged in user
    const tripSql = 'SELECT * FROM trips WHERE tripId = ? AND userId = ?';
    connection.query(tripSql, [tripId, req.session.user.id], (error, trips) => {
        if (error) throw error;

        if (trips.length === 0) {
            req.flash('error', 'Trip not found.');
            return res.redirect('/checklist');
        }

        const sql = 'INSERT INTO checklists (tripId, itemName, category) VALUES (?, ?, ?)';
        connection.query(sql, [tripId, itemName, category], (error) => {
            if (error) {
                console.error('Error adding checklist item:', error);
                req.flash('error', 'Error adding checklist item.');
            } else {
                req.flash('success', 'Item added to checklist.');
            }
            res.redirect('/checklist/' + tripId);
        });
    });
});

// POST /checklist/:tripId/toggle/:checklistId - quick toggle packed status
// Called via fetch() from the client, so it replies with JSON instead of redirecting -
// this is what lets the "Packed" checkbox update without a full page reload.
app.post('/checklist/:tripId/toggle/:checklistId', checkAuthenticated, (req, res) => {
    const { tripId, checklistId } = req.params;

    const sql = `SELECT c.isPacked FROM checklists c
                 INNER JOIN trips t ON c.tripId = t.tripId
                 WHERE c.checklistId = ? AND c.tripId = ? AND t.userId = ?`;

    connection.query(sql, [checklistId, tripId, req.session.user.id], (error, results) => {
        if (error) {
            console.error('Error toggling checklist item:', error);
            return res.status(500).json({ success: false });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false });
        }

        const newStatus = results[0].isPacked ? 0 : 1;
        connection.query('UPDATE checklists SET isPacked = ? WHERE checklistId = ?', [newStatus, checklistId], (error) => {
            if (error) {
                console.error('Error toggling checklist item:', error);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true, isPacked: newStatus });
        });
    });
});

// GET /checklist/edit/:checklistId - show edit form for a checklist item
app.get('/checklist/edit/:checklistId', checkAuthenticated, (req, res) => {
    const checklistId = req.params.checklistId;
    const sql = `SELECT c.*, t.tripName, t.userId FROM checklists c
                 INNER JOIN trips t ON c.tripId = t.tripId
                 WHERE c.checklistId = ?`;

    connection.query(sql, [checklistId], (error, results) => {
        if (error) throw error;

        if (results.length === 0 || results[0].userId !== req.session.user.id) {
            req.flash('error', 'Checklist item not found.');
            return res.redirect('/checklist');
        }

        res.render('editChecklist', { user: req.session.user, item: results[0], categories: CHECKLIST_CATEGORIES });
    });
});

// POST /checklist/edit/:checklistId - update a checklist item
app.post('/checklist/edit/:checklistId', checkAuthenticated, (req, res) => {
    const checklistId = req.params.checklistId;
    const { itemName, category, tripId } = req.body;
    const isPacked = req.body.isPacked ? 1 : 0;

    // Make sure this checklist item belongs to a trip owned by the logged in user
    const checkSql = `SELECT t.userId FROM checklists c
                       INNER JOIN trips t ON c.tripId = t.tripId
                       WHERE c.checklistId = ? AND c.tripId = ?`;

    connection.query(checkSql, [checklistId, tripId], (error, results) => {
        if (error) throw error;

        if (results.length === 0 || results[0].userId !== req.session.user.id) {
            req.flash('error', 'Checklist item not found.');
            return res.redirect('/checklist');
        }

        const sql = 'UPDATE checklists SET itemName = ?, category = ?, isPacked = ? WHERE checklistId = ?';
        connection.query(sql, [itemName, category, isPacked, checklistId], (error) => {
            if (error) {
                console.error('Error updating checklist item:', error);
                req.flash('error', 'Error updating checklist item.');
            } else {
                req.flash('success', 'Checklist item updated.');
            }
            res.redirect('/checklist/' + tripId);
        });
    });
});

// GET /checklist/delete/:tripId/:checklistId - delete a checklist item
app.get('/checklist/delete/:tripId/:checklistId', checkAuthenticated, (req, res) => {
    const { tripId, checklistId } = req.params;

    const checkSql = `SELECT t.userId FROM checklists c
                       INNER JOIN trips t ON c.tripId = t.tripId
                       WHERE c.checklistId = ? AND c.tripId = ?`;

    connection.query(checkSql, [checklistId, tripId], (error, results) => {
        if (error) throw error;

        if (results.length === 0 || results[0].userId !== req.session.user.id) {
            req.flash('error', 'Checklist item not found.');
            return res.redirect('/checklist');
        }

        connection.query('DELETE FROM checklists WHERE checklistId = ?', [checklistId], (error) => {
            if (error) {
                console.error('Error deleting checklist item:', error);
                req.flash('error', 'Error deleting checklist item.');
            } else {
                req.flash('success', 'Checklist item deleted.');
            }
            res.redirect('/checklist/' + tripId);
        });
    });
});

app.get('/deleteAttraction/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const attractionId = req.params.id;

    connection.query('DELETE FROM attractions WHERE attractionId = ?', [attractionId], (error, results) => {
        if(error) {
            console.error("Error deleting attraction:", error);
            res.status(500).send('Error deleting attraction');
        } else {
            res.redirect('/attractions');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));






