const sql = require("./db.js");

let schema = "";
function init(schema_name) {
  this.schema = schema_name;
}


async function findAllWithPdf() {
  let query = `
    SELECT 
      property.name AS "inventoryname",
      json_agg(json_build_object(
        'id', file.id,
        'filetitle', file.title,
        'filetype', file.filetype,
        'filesize', file.filesize,
        'createddate', file.createddate,
        'createdbyid', file.createdbyid,
        'description', file.description,
        'lastmodifieddate', file.lastmodifieddate,
        'lastmodifiedbyid', file.lastmodifiedbyid,
        'documenttype', file.documenttype,
        'filepic', file.filepic,
        'filepath', file.filepath,
        'sectionintemplate', file.sectionintemplate,
        'ispdf', file.ispdf
      )) AS "PdfFiles"
    FROM ${this.schema}.property
    INNER JOIN ${this.schema}.file ON file.parentid = property.id AND file.ispdf = true
    GROUP BY property.id
    ORDER BY property.name ASC;
  `;

  const result = await sql.query(query);
  console.log('result model*==>', result);

  return result.rows
}

//.................................................create.....................................
async function create(newFile, userid) {
  console.log("newFile", newFile);
  delete newFile.id;
  const result = await sql.query(
    `INSERT INTO ${this.schema}.file ( title, filetype, filesize, description, parentid, documenttype, createdbyid, lastmodifiedbyid, sectionintemplate, ispdf)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      newFile.title,
      newFile.filetype,
      newFile.filesize,
      newFile.description,
      newFile.parentid,
      newFile.documenttype,
      userid,
      userid,
      newFile.sectionintemplate,
      newFile.ispdf == true || newFile.ispdf == 'true' ? true : false
    ]
  );
  console.log('result.rows :>> ', result.rows);
  if (result.rows.length > 0) {
    return result.rows[0]
  }

  return null;
}

//.............................................find By Id....................................

async function findById(id) {
  //const result = await sql.query(`SELECT * FROM file WHERE id = $1`,[id]);
  let query = "SELECT fl.*, ";
  query += " concat(cu.firstname, ' ' , cu.lastname) createdbyname,  ";
  query += " concat(mu.firstname, ' ' , mu.lastname) lastmodifiedbyname  ";
  query += ` FROM ${this.schema}.file fl `;
  query += " INNER JOIN public.user cu ON cu.Id = fl.createdbyid ";
  query += " INNER JOIN public.user mu ON mu.Id = fl.lastmodifiedbyid ";
  const result = await sql.query(query + "WHERE fl.id = $1 AND fl.ispdf = false ", [id]);

  if (result.rows.length > 0) return result.rows[0];

  return null;
}

//.............................................find By PrentId.................................

async function findByParentId(id, ispdf = false) {
  //const result = await sql.query(`SELECT * FROM file WHERE parentid = $1`,[id]);
  let query = "SELECT fl.*, ";
  query += " concat(cu.firstname, ' ' , cu.lastname) createdbyname,  ";
  query += " concat(mu.firstname, ' ' , mu.lastname) lastmodifiedbyname  ";
  query += ` FROM ${this.schema}.file fl `;
  query += " INNER JOIN public.user cu ON cu.Id = fl.createdbyid ";
  query += " INNER JOIN public.user mu ON mu.Id = fl.lastmodifiedbyid ";
  console.log(
    "query +  WHERE fl.parentid = $1:",
    query + "WHERE fl.parentid = $1"
  );
  const result = await sql.query(query + "WHERE fl.parentid = $1  AND fl.ispdf = $2 ", [id, ispdf]);

  console.log('result:', result.rows);
  if (result.rows.length > 0)
    // return result.rows[0];
    return result.rows;

  return null;
}

async function findByParentpic(id,type) {
  //const result = await sql.query(`SELECT * FROM file WHERE parentid = $1`,[id]);
  let query = `SELECT *
               FROM ${this.schema}.file`;
  const result = await sql.query(
    query +
      ` WHERE documenttype = $1 AND parentid = $2 AND fl.ispdf = false ORDER BY createddate DESC LIMIT 1 `,
    [type, id]
  );
 
  if (result.rows.length > 0) {
    const lastRecord = result.rows[0];
    return lastRecord;
  }

  return null;
}

//.............................................fetch all file.................................

async function findAll(title) {
  /*let query = "SELECT * FROM file";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;

  
  }*/

  console.log("====fetch all file model====");
  let query = "SELECT fl.*, ";
  query += " concat(cu.firstname, ' ' , cu.lastname) createdbyname,  ";
  query += " concat(mu.firstname, ' ' , mu.lastname) lastmodifiedbyname  ";
  query += ` FROM ${this.schema}.file fl `;
  query += " INNER JOIN public.user cu ON cu.Id = fl.createdbyid ";
  query += " INNER JOIN public.user mu ON mu.Id = fl.lastmodifiedbyid ";
  query += " WHERE fl.ispdf = false ";
  query += " ORDER BY createddate DESC ";

  const result = await sql.query(query);
  console.log('rows:===>', result.rows);
  return result.rows;
}

//.............................................Update file.................................

async function updateById(id, newFile) {
  delete newFile.id;
  const query = buildUpdateQuery(id, newFile, this.schema);
  // Turn req.body into an array of values
  var colValues = Object.keys(newFile).map(function (key) {
    return newFile[key];
  });

  //console.log('query:', query);
  const result = await sql.query(query, colValues);
  if (result.rowCount > 0) {
    return { id: id, ...newFile };
  }
  return null;
}

//.............................................delete file by Id.................................

async function deleteFile(id) {
  const result = await sql.query(
    `DELETE FROM ${this.schema}.file WHERE id = $1`,
    [id]
  );

  if (result.rowCount > 0) return "Success";
  return null;
}

function buildUpdateQuery(id, cols, schema) {
  // Setup static beginning of query
  var query = [`UPDATE ${schema}.file`];
  query.push("SET");

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(key + " = ($" + (i + 1) + ")");
  });
  query.push(set.join(", "));

  // Add the WHERE statement to look up by id
  query.push("WHERE id = '" + id + "'");

  // Return a complete query string
  return query.join(" ");
}

module.exports = {
  findById,
  findByParentId,
  findByParentpic,
  create,
  updateById,
  deleteFile,
  findAll,
  findAllWithPdf,
  init,
};
