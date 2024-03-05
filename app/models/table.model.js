const sql = require("./db.js");

let schema = "";

function init(schema_name) {
  this.schema = schema_name;
}

async function create(newTable, userid) {
  console.log('-----create task model--------');
  delete newTable.id;
  console.log("this.schema", this.schema);

  const result = await sql.query(
    `INSERT INTO ${this.schema}.table
     (name,occupancy, status, description, lastmodifiedbyid, createdbyid)  
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [newTable.name,newTable.occupancy, newTable.status, newTable.description, userid, userid]
  );

  if (result.rows.length > 0) {
    return { id: result.rows[0].id, ...newTable };
  }

  return null;
}

async function findById(id) {
  console.log("id ", id);

  const result = await sql.query(`SELECT * FROM ${this.schema}.table WHERE id = $1`, [id]);

  console.log("Rows ", result.rows);
  if (result.rows.length > 0)
    return result.rows[0];

  return null;
};

async function findAll() {
  const result = await sql.query(`SELECT * FROM ${this.schema}.table ORDER BY createddate ASC`);
  console.log('rows:===>', result.rows);
  return result.rows;
};


async function updateById(id, newTable, userid) {
  console.log('===Model Table Update====');
  delete newTable.id;
  newTable['lastmodifiedbyid'] = userid;

  const query = buildUpdateQuery(id, newTable, this.schema);
  
  // Turn newContact into an array of values
  var colValues = Object.values(newTable);
  colValues.push(id); // Add id parameter for WHERE clause

  console.log('query:', query);
  const result = await sql.query(query, colValues);
  if (result.rowCount > 0) {
    return { "id": id, ...newTable };
  }
  return null;
}

async function deleteTable(id) {
  const result = await sql.query(`DELETE FROM ${this.schema}.table WHERE id = $1`, [id]);

  if (result.rowCount > 0)
    return "Success"
  return null;
};

function buildUpdateQuery(id, cols, schema) {
  // Setup static beginning of query
  var query = [`UPDATE ${schema}.table SET`];

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(`${key} = ($${i + 1})`); 
  });
  query.push(set.join(', '));

  // Add the WHERE statement to look up by id
  query.push('WHERE id = $' + (Object.keys(cols).length + 1));

  // Return a complete query string
  return query.join(' ');
}


module.exports = { init, findById, updateById, findAll, create, deleteTable };
