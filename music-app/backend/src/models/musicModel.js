const db = require('../db');

const Music = {
  getAll: (callback) => db.query('SELECT * FROM music', callback),
  getById: (id, callback) => db.query('SELECT * FROM music WHERE id = ?', [id], callback),
  add: (data, callback) => db.query('INSERT INTO music SET ?', data, callback),
  update: (id, data, callback) => db.query('UPDATE music SET ? WHERE id = ?', [data, id], callback),
  delete: (id, callback) => db.query('DELETE FROM music WHERE id = ?', [id], callback),

  getByName: (nama_lagu, callback) =>
    db.query('SELECT * FROM music WHERE nama_lagu = ?', [nama_lagu], callback),
  


};

module.exports = Music;
