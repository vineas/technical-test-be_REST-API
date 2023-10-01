const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { selectAllJobs, searchJobs, createJobs, selectJobs, updateJobs, countData, findUUID } = require("../model/jobs");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");

let jobsController = {

    getSearchJobs: async (req, res) => {
        try {
          const searchTerm  = req.query.keyword;
          const result = await searchJobs(searchTerm );
          commonHelper.response(res, result.rows, 200, "get data success");
        } catch (error) {
          console.log(error);
        }
      },

    getAllJobs: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 100;
            const offset = (page - 1) * limit;
            const sortby = req.query.sortby || 'jobs_id';
            const sort = req.query.sort || "DESC";
            let result = await selectAllJobs({ limit, offset, sortby, sort });
            const {
                rows: [count],
            } = await countData();
            const totalData = parseInt(count.count);
            const totalPage = Math.ceil(totalData / limit);
            const pagination = {
                currentPage: page,
                limit: limit,
                totalData: totalData,
                totalPage: totalPage,
            };
            commonHelper.response(
                res,
                result.rows,
                200,
                "get data success",
                pagination
            );
        } catch (error) {
            console.log(error);
        }
    },

    getDetailJobs: async (req, res) => {
        const jobs_id = String(req.params.id);
        selectJobs(jobs_id)
            .then((result) =>
                commonHelper.response(res, result.rows, 200, "get data success")
            )
            .catch((err) => res.send(err));
    },

    jobsCreate: async (req, res) => {
        const { jobs_name, jobs_location, jobs_type, jobs_description } =
            req.body;
        // const {
        //   rows: [count],
        // } = await countData();
        const jobs_id = uuidv4();
        const data = {
            jobs_id,
            jobs_name,
            jobs_location,
            jobs_type,
            jobs_description
        };
        console.log(data);
        createJobs(data)
            .then((result) =>
                commonHelper.response(res, result.rows, 201, "Create ProJobsduct Success")
            )
            .catch((err) => res.send(err));
    },

    jobsUpdate: async (req, res) => {
        try {
            const { jobs_name, jobs_location, jobs_type, jobs_description } =
                req.body;
            const jobs_id = String(req.params.id);
            const { rowCount } = await findUUID(jobs_id);
            if (!rowCount) {
                return next(createError(403, "ID is Not Found"));
            }
            const data = {
                jobs_id,
                jobs_name,
                jobs_location,
                jobs_type,
                jobs_description
            };
            console.log(data);
            updateJobs(data)
                .then((result) =>
                    commonHelper.response(res, result.rows, 200, "Jobs updated")
                )
                .catch((err) => res.send(err));
        } catch (error) {
            console.log(error);
        }
    },

    RefreshToken: (req, res) => {
        const refreshToken = req.body.RefreshToken
        const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT)
        const payload = {
            users_email: decoded.users_email,
        }
        const result = {
            token: authHelper.generateToken(payload),
            refreshToken: authHelper.refreshToken(payload)
        }
        commonHelper.response(res, result, 200, "Token is Already generate");


    }
};

module.exports = jobsController;