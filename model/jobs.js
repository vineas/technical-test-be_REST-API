const Pool = require("../config/db");

const selectAllJobs = ({ limit, offset, sort, sortby }) => {
    return Pool.query(
        `SELECT * FROM jobs ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
    );
};

const selectJobs = (jobs_id) => {
    return Pool.query(`SELECT * FROM jobs WHERE jobs_id = '${jobs_id}'`)
}

const createJobs = (data) => {
    const {
        jobs_id,
        jobs_name,
        jobs_location,
        jobs_type,
        jobs_description
    } = data;
    return new Promise((resolve, reject) =>
        Pool.query(
            `INSERT INTO jobs(jobs_id, jobs_name, jobs_location, jobs_type, jobs_description) VALUES('${jobs_id}', '${jobs_name}', '${jobs_location}','${jobs_type}', '${jobs_description}')`,
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

const updateJobs = (data) => {
    const {
        jobs_id,
        jobs_name,
        jobs_location,
        jobs_type,
        jobs_description
    } = data;
    return Pool.query(`UPDATE jobs SET 
    jobs_name='${jobs_name}', 
    jobs_location=${jobs_location}, 
    jobs_type=${jobs_type}, 
    jobs_description ='${jobs_description}', 
    WHERE jobs_id='${jobs_id}'`);
}

const deleteJobs = (jobs_id) => {
    return Pool.query(`DELETE FROM jobs WHERE jobs_id='${jobs_id}'`);
}

const countData = () => {
    return Pool.query('SELECT COUNT(*) FROM jobs')
}

const findJobs = (users_email) => {
    // return new Promise((resolve, reject) =>
    //     Pool.query(`SELECT * FROM users WHERE users_email='${users_email}'`, (error, result) => {
    //         if (!error) {
    //             resolve(result)
    //         } else {
    //             reject(error)
    //         }
    //     })
    // )
}

const searchJobs = (jobs_name) => {
    return Pool.query('SELECT * FROM jobs WHERE jobs_name ILIKE $1', [`%${jobs_name}%`]);
}


module.exports = {
    selectAllJobs,
    selectJobs,
    createJobs,
    updateJobs,
    deleteJobs,
    countData,
    searchJobs,
    findJobs
};