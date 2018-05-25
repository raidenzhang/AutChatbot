'use strict';
const request = require('request');
const config = require('./config');
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {

    readAllColors: function(callback) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client
                .query(
                    'SELECT color FROM public.courses',
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            callback([]);
                        } else {
                            let courses = [];
                            for (let i = 0; i < result.rows.length; i++) {
                                courses.push(result.rows[i]['number']);
                            }
                            callback(courses);
                        };
                    });
        });
        pool.end();
    },


    readUserColor: function(callback, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client
                .query(
                    'SELECT course FROM public.user_courses WHERE fb_id=$1',
                    [userId],
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            callback('');
                        } else {
                            callback(result.rows[0]['courses']);
                        };
                    });

        });
        pool.end();
    },

    updateUserColor: function(course, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }

            let sql1 = `SELECT course FROM user_courses WHERE fb_id='${userId}' LIMIT 1`;
            client
                .query(sql1,
                    function(err, result) {
                        if (err) {
                            console.log('Query error: ' + err);
                        } else {
                            let sql;
                            if (result.rows.length === 0) {
                                sql = 'INSERT INTO public.user_courses (course, fb_id) VALUES ($1, $2)';
                            } else {
                                sql = 'UPDATE public.user_courses SET course=$1 WHERE fb_id=$2';
                            }
                            client.query(sql,
                            [
                                course,
                                userId
                            ]);
                        }
                    }
                    );


        });
        pool.end();
    }


}
