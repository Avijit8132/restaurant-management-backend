const leadRoutes = require("../routes/lead.routes.js");
const constants = require("../constants/global.js");
const sql = require("./db.js");
let schema = "";
function init(schema_name) {
  this.schema = schema_name;
}

const selectByIdQuery = (schema_name, filter, order) => {
  let query = `select lead.*,
                        CONCAT(cu.firstname, ' ' , cu.lastname) AS createdbyname, 
                        CONCAT(mu.firstname, ' ' , mu.lastname) AS lastmodifiedbyname, 
                        CONCAT(owner.firstname, ' ' , owner.lastname) AS ownername,
                        COALESCE(json_agg(DISTINCT  areadetails.*) FILTER (WHERE areadetails IS NOT NULL), NULL) AS areadetails,
                        COALESCE(json_agg(DISTINCT heightdetails.*) FILTER (WHERE heightdetails IS NOT NULL), NULL) AS heightdetails
                      FROM ${schema_name}.lead
                      LEFT JOIN public.user cu ON cu.Id = ${schema_name}.lead.createdbyid
                      LEFT JOIN public.user mu ON mu.Id = ${schema_name}.lead.lastmodifiedbyid
                      LEFT JOIN public.user owner ON owner.Id = ${schema_name}.lead.ownerid
                      LEFT JOIN ${schema_name}.propertydetails areadetails ON ${schema_name}.lead.id = areadetails.propertyid 
                      AND areadetails.type = 'area'
                    LEFT JOIN ${schema_name}.propertydetails heightdetails ON ${schema_name}.lead.id = heightdetails.propertyid 
                      AND heightdetails.type = 'height'
                 `;
  console.log("query *==>", query);

  if (filter) {
    query = query + " WHERE " + filter;
  }
  query += ` group by lead.id, cu.firstname, cu.lastname, mu.firstname, mu.lastname, owner.firstname, owner.lastname`;

  if (order) {
    query = query + " ORDER BY " + order;
  }
  return query;
};

//....................................... create lead.........................................
async function create(newLead, userid) {
  console.log('newLead *==>',newLead)
  //console.log('newLead areadetails*==>',newLead.areadetails)
  //console.log('newLead heightdetails*==>',newLead.heightdetails)

  delete newLead.id;

  const result = await sql.query(
    `INSERT INTO ${this.schema}.lead (
      firstname, lastname,  salutation, designation, email, phone, alternatephone, office, 
      clientstreet, clientcity, clientstate, clientcountry, clientpincode, clientcalloption, clientcalloptionemail, 
      clientcalloptionname, clientcalloptionmobile, clientcalloptiondate, clientcalloptionremark, clientcalloptionratepersqfeet, 
      clientcalloptionbrokerage, transactiontype, typeofclient, vertical, verticaltype, subverticaltype, zone, state, city, 
      areavaluein, areafrom, areato, numberofcarortruckparking, type, otherlocations, otherdetails, budgetrangein, 
      budgetrangefrom, budgetrangeto, areaorlocationbrief, carpetarea, heightrangein, heightfrom, heightto, floorfrom, 
      floorto, completiondate, frontage, currentleadcity, actions, ilid, client, currentleadstate, area, acmanagername, 
      memberoffice, acmanageremail, acmanagerphone, ilcloseddate, ilcreateddate, comments, ownerid, lastmodifiedbyid, 
      createdbyid, leadsource, leadstage, thirdparty, company, frontagein, acmanagerdetails, leadcreateddate, noofdocksvalue,
      noofwashroomsvalue,openareaunit,openareavalue,  closeareaunit,  closeareavalue,rentalunit, rentalvalue,clienttype
    )  
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 
      $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, 
      $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56,
      $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70,$71,$72,$73,$74,$75,$76,$77,$78,$79,$80
    ) RETURNING *`,
    [
      newLead.firstname,
      newLead.lastname,
      newLead.salutation,
      newLead.designation,
      newLead.email,
      newLead.phone,
      newLead.alternatephone,
      newLead.office,
      newLead.clientstreet,
      newLead.clientcity,
      newLead.clientstate,
      newLead.clientcountry,
      newLead.clientpincode,
      newLead.clientcalloption,
      newLead.clientcalloptionemail,
      newLead.clientcalloptionname,
      newLead.clientcalloptionmobile,
      newLead.clientcalloptiondate,
      newLead.clientcalloptionremark,
      newLead.clientcalloptionratepersqfeet,
      newLead.clientcalloptionbrokerage,
      newLead.transactiontype,
      newLead.typeofclient,
      newLead.vertical,
      newLead.verticaltype,
      newLead.subverticaltype,
      newLead.zone,
      newLead.state,
      newLead.city,
      newLead.areavaluein,
      newLead.areafrom,
      newLead.areato,
      newLead.numberofcarortruckparking,
      newLead.type,
      newLead.otherlocations,
      newLead.otherdetails,
      newLead.budgetrangein,
      newLead.budgetrangefrom,
      newLead.budgetrangeto,
      newLead.areaorlocationbrief,
      newLead.carpetarea,
      newLead.heightrangein,
      newLead.heightfrom,
      newLead.heightto,
      newLead.floorfrom,
      newLead.floorto,
      newLead.completiondate,
      newLead.frontage,
      newLead.currentleadcity,
      newLead.actions,
      newLead.ilid,
      newLead.client,
      newLead.currentleadstate,
      newLead.area,
      newLead.acmanagername,
      newLead.memberoffice,
      newLead.acmanageremail,
      newLead.acmanagerphone,
      newLead.ilcloseddate,
      newLead.ilcreateddate,
      newLead.comments,
      newLead.ownerid,
      userid,
      userid,
      newLead.leadsource,
      newLead.leadstage,
      newLead.thirdparty,
      newLead.company,
      newLead.frontagein,
      newLead.acmanagerdetails,
      newLead.leadcreateddate,
      newLead.noofdocksvalue,
      newLead.noofwashroomsvalue,
      newLead.openareaunit,
      newLead.openareavalue,
      newLead.closeareaunit,
      newLead.closeareavalue,
      newLead.rentalunit,
      newLead.rentalvalue,
      newLead.clienttype,
    ]
  );
  if (result.rows.length > 0) {
    const LeadId = result.rows[0].id;

    const detailsArray = [...newLead.areadetails, ...newLead.heightdetails];
    console.log("detailsArray *==>", detailsArray);

    // Insert property details with LeadId as the parentId
    const propertyDetailsPromises = detailsArray?.map(async (details) => {
      console.log("inside map");
      console.log("details *==>", details);
      details.propertyid = LeadId;
      const propertyDetailsQuery = buildInsertQuery(
        details,
        this.schema,
        "propertydetails"
      );
      //console.log('propertyDetailsQuery *==>',propertyDetailsQuery);
      const propertyDetailsResult = await sql.query(
        propertyDetailsQuery.query,
        propertyDetailsQuery.values
      );
      //console.log("propertyDetailsResult *==>", propertyDetailsResult.rows);

      return propertyDetailsResult.rows[0];
    });
    console.log("propertyDetailsPromises *==>", propertyDetailsPromises);

    const propertyDetailsResults = await Promise.all(propertyDetailsPromises);
    console.log("propertyDetailsResults *==>", propertyDetailsResults);

    await sql.query("COMMIT");

    let lead = result.rows[0];
    console.log("lead *==>", lead);
    const areadetails = propertyDetailsResults.filter(
      (detail) => detail.type === "area"
    );
    console.log("areadetails *==>", areadetails);
    const heightdetails = propertyDetailsResults.filter(
      (detail) => detail.type === "height"
    );
    console.log("heightdetails *==>", heightdetails);

    const response = {
      ...lead,
      areadetails,
      heightdetails,
    };
    console.log("response *==>", response);
    return response;
  }

  // if (result.rows.length > 0) {
  //   return result.rows[0]
  // }

  return null;
}

function buildInsertQuery(data, schema_name, table_name) {
  const columns = Object.keys(data);
  const placeholders = columns.map((col, index) => `$${index + 1}`);

  const insertQuery = `INSERT INTO ${schema_name}.${table_name} (${columns.join(
    ", "
  )}) VALUES (${placeholders.join(", ")}) RETURNING *`;

  return {
    query: insertQuery,
    values: columns.map((col) => data[col]),
  };
}

// //....................................... create lead from the FB Ads............................................
// async function createFB(newLead, userid) {
//   //delete newLead.id;
//   console.log("===model area==")
//   try {
//     const { legacyid, pageid, formid, adid, status, FULL_NAME, EMAIL, PHONE } =
//       newLead

//     var firstName = FULL_NAME.split(" ").slice(0, -1).join(" ")
//     var lastName = FULL_NAME.split(" ").slice(-1).join(" ")

//     const result = await sql.query(
//       `INSERT INTO ${this.schema}.lead (firstname, lastname, email, phone, pageid, formid, adid, status, legacyid, leadsource, ownerid, createdbyid, lastmodifiedbyid)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
//       [
//         firstName,
//         lastName,
//         EMAIL,
//         PHONE,
//         pageid,
//         formid,
//         adid,
//         status,
//         legacyid,
//         "Facebook",
//         userid,
//         userid,
//         userid,
//       ]
//     )
//     if (result.rows.length > 0) {
//       return { id: result.rows[0].id, ...newLead }
//     }
//   } catch (error) {
//     console.log("===model==" + JSON.stringify(error))
//   }

//   return null
// }
//.....................................find lead by id........................................
async function findById(id) {
  console.log("id *==>", id);
  let filter = ` lead.id = '${id}'`;
  console.log("filter *==>", filter);
  console.log("this schema *==>", this.schema);

  let itemQuery = selectByIdQuery(this.schema, filter);
  console.log("itemQuery *==>", itemQuery);

  try {
    const result = await sql.query(itemQuery);
    if (result.rows.length > 0) {
      console.log("result.rows[0]", result.rows[0]);
      return result.rows[0];
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

//.....................................find lead by ownerId....................................
async function findByOwnerId(id) {
  //console.log("id ", id);
  //const result = await sql.query(`SELECT * FROM lead WHERE ownerid = $1`,[id]);
  let query = `SELECT ${this.schema}.lead.*,  concat(cu.firstname, ' ' , cu.lastname) createdbyname, concat(mu.firstname, ' ' , mu.lastname) lastmodifiedbyname, concat(owner.firstname, ' ' , owner.lastname) ownername  FROM ${this.schema}.lead `;
  query += ` INNER JOIN public.user cu ON cu.Id = ${this.schema}.lead.createdbyid `;
  query += ` INNER JOIN public.user mu ON mu.Id = ${this.schema}.lead.lastmodifiedbyid `;
  query += ` LEFT JOIN public.user owner ON owner.Id = ${this.schema}.lead.ownerid `;

  const result = await sql.query(query + " WHERE lead.ownerid = $1", [id]);
  if (result.rows.length > 0) return result.rows;

  return null;
}

//.......................................find all lead................................
async function findAll(title) {
  let itemQuery;
  if (title) {
    itemQuery = selectByIdQuery(
      this.schema,
      `lead.title LIKE '%${title}%'`,
      `createddate DESC `
    );
    console.log("itemQuery*==>", itemQuery);
  } else {
    itemQuery = selectByIdQuery(this.schema, undefined, `createddate DESC `);
  }
  const result = await sql.query(itemQuery);
  return result.rows;
}

//..............................................Update Lead................................
async function updateById(
  id,
  newLead,
  newAreaDetails,
  newHeightDetails,
  userid
) {
  console.log("newAreaDetails *==>", newAreaDetails);
  console.log("newHeightDetails *==>", newHeightDetails);

  delete newLead.id;
  newLead["lastmodifiedbyid"] = userid;
  const query = buildUpdateQuery(id, newLead, this.schema);
  // Turn req.body into an array of values
  var colValues = Object.keys(newLead).map(function (key) {
    return newLead[key];
  });

  console.log("query:", query, newAreaDetails);

  let tempPropDetailsResult = [];
  console.log("q -", query);
  console.log("colValues", colValues);
  const result = await sql.query(query, colValues);
  console.log("result *==>", result);

  if (result.rowCount > 0) {
    console.log("rows *==>", result.rows);
    const detailsArray = [...newAreaDetails, ...newHeightDetails];
    console.log("detailsArray *==>", detailsArray);

    const propertyDetailsPromises = detailsArray.map(async (details) => {
      console.log("details *==>", details);
      details.propertyid = id;
      if (details.id) {
        const propertyDetailsQuery = buildUpdateQuery(
          details.id,
          details,
          this.schema,
          "propertydetails"
        );

        console.log("Property details update query:", propertyDetailsQuery);
        console.log(
          "Property details update values:",
          propertyDetailsQuery.values
        );
        var colval = Object.keys(details).map(function (key) {
          return details[key];
        });
        console.log("colval", colval);
        const propertyDetailsResult = await sql.query(
          propertyDetailsQuery,
          colval
        );

        tempPropDetailsResult.push(propertyDetailsResult.rows[0]);

        return propertyDetailsResult.rows[0] || {}; // Return an empty object if propertyDetailsResult.rows[0] is null
      } else {
        const propertyDetailsQuery = buildInsertQuery(
          details,
          this.schema,
          "propertydetails"
        );
        const propertyDetailsResult = await sql.query(
          propertyDetailsQuery.query,
          propertyDetailsQuery.values
        );
        return propertyDetailsResult.rows[0] || {};
      }
    });

    const propertyDetailsResults = await Promise.all(propertyDetailsPromises);


    let lead = result.rows[0];
    console.log("property *==>", lead);
    const areadetails = propertyDetailsResults.filter(
      (detail) => detail.type === "area"
    );
    console.log("areadetails *==>", areadetails);
    const heightdetails = propertyDetailsResults.filter(
      (detail) => detail.type === "height"
    );
    console.log("heightdetails *==>", heightdetails);

    const response = {
      ...newLead,
      areadetails,
      heightdetails,
    };
    console.log("response *==>", response);
    return response;
  }
  return null;
}

//.....................................................Delete lead...........................
async function deleteLead(id) {
  const result = await sql.query(
    `DELETE FROM ${this.schema}.lead WHERE id = $1`,
    [id]
  );

  if (result.rowCount > 0) return "Success";
  return null;
}

function buildUpdateQuery(id, cols, schema, tableName) {
  // Setup static beginning of query\
  delete cols.id;
  var query = [`UPDATE ${schema}.${tableName || "lead"} `];
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

function prepareMailForNewLead(newLead) {
  let email = {
    to: newLead.owneremail,
    subject: "New Lead Assigned to you",
    body: ` Hi ${newLead.ownername} <br/><br/>
            A new lead <a href="${constants.DEPLOYED_HOST}/leads/${newLead.id}" target="_blank">${newLead.firstname} ${newLead.lastname}</a> is created for you. <br/>
            Please contact asap <br/><br/>
            Thanks<br/>
            Admin
            Name: ${newLead.createdbyname}
            Company: Sthapatya Leasing`,
  };
  return email;
}

// //....................................... Interested Property Create Lead .........................................
// async function interestedPropertyCreateLead(newLead) {
//   console.log("newLead ", this.schema, newLead)
//   delete newLead.id

//   const result = await sql.query(
//     `INSERT INTO ${this.schema}.lead (firstname, lastname, email, phone, propertyid, ownerid, createdbyid , lastmodifiedbyid, leadsource, status)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
//     [
//       newLead.firstname,
//       newLead.lastname,
//       newLead.email,
//       newLead.phone,
//       newLead.propertyid,
//       "90a036a5-2b40-4adc-bd27-e6ec5011a96f",
//       "90a036a5-2b40-4adc-bd27-e6ec5011a96f",
//       "90a036a5-2b40-4adc-bd27-e6ec5011a96f",
//       "Web",
//       "Open - Not Contacted",
//     ]
//   )
//   if (result.rows.length > 0) {
//     return { id: result.rows[0].id, ...newLead }
//   }

//   return null
// }

module.exports = {
  init,
  findById,
  updateById,
  findAll,
  create,
  deleteLead,
  findByOwnerId,
  // createFB,
  prepareMailForNewLead,
  // interestedPropertyCreateLead,
};
