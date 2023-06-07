const mysql = require('mysql');

// SQL connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//  view users - Page
exports.view = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);

    // use the connection
    connection.query(
      'SELECT * FROM user WHERE status = "active"',
      (err, data) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          let removedUser = req.query.removed;

          res.render('home', { data, removedUser });
        } else {
          console.log(err);
        }
        console.log('Data from user table: \n', data);
      }
    );
  });
};

// Find a user - DB
exports.find = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);

    let searchTerm = req.body.search;
    console.log(searchTerm);

    // use the connection
    connection.query(
      'SELECT * FROM user WHERE status = "active" AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)',
      ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'],
      (err, data) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('home', { data });
        } else {
          console.log(err);
        }
        console.log('Data from user table: \n', data);
      }
    );
  });
};

// Add new user - Page
exports.addForm = (req, res) => {
  res.render('add-user');
};

// Add new user - DB
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  console.log('create form:', req.body);

  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);

    let searchTerm = req.body.search;
    console.log(searchTerm);

    // use the connection
    connection.query(
      'INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',
      [first_name, last_name, email, phone, comments],
      (err, data) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('add-user', { alert: 'User added successfully.' });
        } else {
          console.log(err);
        }
        console.log('Data from user table: \n', data);
      }
    );
  });
};

// Edit user - Page
exports.editForm = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);

    // use the connection

    connection.query(
      'SELECT * FROM user WHERE id = ? ',
      [req.params.id],
      (err, data) => {
        // when done with the connection, release it
        connection.release();
        if (!err) {
          res.render('edit-user', {
            data,
          });
        } else {
          console.log(err);
        }
        console.log('Data from user table: \n', data);
      }
    );
  });
};

// Edit user - DB
exports.edit = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);

    // use the connection

    connection.query(
      'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?,comments = ? WHERE id = ? ',
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, data) => {
        // when done with the connection, release it
        connection.release();
        if (!err) {
          // Connect to DB
          pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);

            // use the connection

            connection.query(
              'SELECT * FROM user WHERE id = ? ',
              [req.params.id],
              (err, data) => {
                // when done with the connection, release it
                connection.release();
                if (!err) {
                  res.render('edit-user', {
                    data,
                    alert: `${first_name} updated successfully.`,
                  });
                } else {
                  console.log(err);
                }
                console.log('Data from user table: \n', data);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log('Data from user table: \n', data);
      }
    );
  });
};

// Delete User - DB - you can change status to smth like delete or permanently delete the record

// Delete from DB
// exports.delete = (req, res) => {
//   // Connect to DB
//   pool.getConnection((err, connection) => {
//     if (err) throw err; // not connected
//     console.log('Connected as ID ' + connection.threadId);

//     // use the connection
//     connection.query(
//       'DELETE FROM user WHERE id = ?',
//       [req.params.id],
//       (err, data) => {
//         // when done with the connection, release it
//         connection.release();
//         if (!err) {
//           res.redirect('/');
//         } else {
//           console.log(err);
//         }
//         console.log('Data from user table: \n', data);
//       }
//     );
//   });
// };

// Change status - DB
exports.delete = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected

    // use the connection
    connection.query(
      'UPDATE user SET status = ? WHERE id = ?',
      ['removed', req.params.id],
      (err, data) => {
        // when done with the connection, release it
        connection.release();
        if (!err) {
          let removedUser = encodeURIComponent('User successfully removed.');
          res.redirect('/?removed=' + removedUser);
        } else {
          console.log(err);
        }
        console.log('Data from user table: \n', data);
      }
    );
  });
};

// View user - PAGE
exports.viewUser = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);

    // use the connection
    connection.query(
      'SELECT * FROM user WHERE id = ?',
      [req.params.id],
      (err, data) => {
        // when done with the connection, release it
        connection.release();

        if (!err) {
          res.render('view-user', { data });
        } else {
          console.log(err);
        }
        console.log('Data from user table: \n', data);
      }
    );
  });
};
