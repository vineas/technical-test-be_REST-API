const Pool = require("../config/db");

const selectAllUsers = () => {
  return Pool.query(`SELECT * FROM users `)
}


const createUsers = (data) => {
  const { users_id, users_email, users_passwordHash, users_fullname } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO users(users_id, users_fullname, users_email, users_password) VALUES('${users_id}', '${users_fullname}', '${users_email}','${users_passwordHash}')`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findEmail = (users_email) =>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT * FROM users WHERE users_email='${users_email}'`,(error,result)=>{
    if(!error){
      resolve(result)
    }else{
      reject(error)
    }
  })
  )
}
module.exports = {
  selectAllUsers,
  createUsers,
  findEmail
};