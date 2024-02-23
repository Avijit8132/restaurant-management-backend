const sql = require("./db.js");

let schema = "";

function init(schema_name) {
  this.schema = schema_name;
}

async function create(newBooking, userid) {
  delete newBooking.id;

  const result = await sql.query(
    `INSERT INTO ${this.schema}.booking 
     (tableid, contactid, status, numberofperson, lastmodifiedbyid, createdbyid, createddate, lastmodifieddate)  
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      newBooking.tableid,
      newBooking.contactid,
      newBooking.status,
      newBooking.numberofperson,
      userid,
      userid,
      newBooking.createddate,
      newBooking.lastmodifieddate
    ]
  );

  if (result.rows.length > 0) {
    return { id: result.rows[0].id, ...newBooking };
  }

  return null;
}

async function findById(id) {
  const query = `
    SELECT 
      b.*, 
      t.name AS table_name,
      CONCAT(contact.firstname, ' ', contact.lastname, ' - ', contact.phone) AS contact_name
    FROM 
      ${this.schema}.booking b
    INNER JOIN 
      ${this.schema}.contact contact ON contact.id = b.contactid 
    INNER JOIN 
      ${this.schema}.table t ON t.id = b.tableid
    WHERE 
      b.id = $1`;
  const result = await sql.query(query, [id]);

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  return null;
}


async function findAll() {
  const query =  ` SELECT 
  ${this.schema}.booking.*, 
  CONCAT(contact.firstname, ' ', contact.lastname, ' - ', contact.phone) AS contact_name,
  tbl.name AS table_name
FROM 
${this.schema}.booking 
INNER JOIN 
${this.schema}.contact contact ON contact.id = ${this.schema}.booking.contactid 
INNER JOIN 
${this.schema}.table tbl ON tbl.id = ${this.schema}.booking.tableid;`
  const result = await sql.query(query);
  return result.rows;
}


async function updateById(id, newBooking, userid) {
    console.log('===Model Booking Update====');
    delete newBooking.id;
    newBooking['lastmodifiedbyid'] = userid;
  
    const query = buildUpdateQuery(id, newBooking, this.schema);
    
    // Extract the values from newBooking object
    const colValues = Object.keys(newBooking).map(key => newBooking[key]);
  
    // Add the id parameter at the end of colValues array
    colValues.push(id);
  
    console.log('query:', query);
    console.log('colValues:', colValues);
  
    const result = await sql.query(query, colValues);
    if (result.rowCount > 0) {
      return { "id": id, ...newBooking };
    }
    return null;
  }
  
  
async function deleteBooking(id) {
  const result = await sql.query(
    `DELETE FROM ${this.schema}.booking WHERE id = $1`,
    [id]
  );

  if (result.rowCount > 0) return "Success";
  return null;
}

// function buildUpdateQuery(id, cols, schema) {
//   let query = [`UPDATE ${schema}.booking SET`];

//   const set = [];
//   Object.keys(cols).forEach((key, i) => {
//     set.push(`${key} = ($${i + 1})`);
//   });
//   query.push(set.join(", "));

//   query.push("WHERE id = $");
//   query.push(id);

//   return query.join(" ");
// }
function buildUpdateQuery(id, cols, schema) {
    // Setup static beginning of query
    var query = `UPDATE ${schema}.booking SET`;
  
    // Create another array storing each set command
    // and assigning a number value for parameterized query
    var set = [];
    Object.keys(cols).forEach(function (key, i) {
      set.push(`${key} = $${i + 1}`); 
    });
    query += ` ${set.join(', ')}`;
  
    // Add the WHERE statement to look up by id
    query += ` WHERE id = $${Object.keys(cols).length + 1}`;
  
    // Return a complete query string
    return query;
  }
  

module.exports = {
  init,
  findById,
  updateById,
  findAll,
  create,
  deleteBooking
};
