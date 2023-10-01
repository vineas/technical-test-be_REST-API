create type jobsType as enum('Full Time','Part Time');

CREATE TABLE
    jobs(
        jobs_id VARCHAR PRIMARY KEY,
        jobs_name VARCHAR NOT NULL,
        jobs_location VARCHAR NOT NULL,
        jobs_type jobsType,
        jobs_description VARCHAR
    );

