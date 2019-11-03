
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../main/app');

chai.use(chaiHttp);
chai.should();
describe("Course.js", () => {
    describe("GET /Course", () => {
        // Test to get all students record
        it("should get the portfolio page", (done) => {
             chai.request(app)
                 .get('/course')
                 .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
         })
    })
    describe("/course/new", () => {
        it("should get the new page", (done) => {
             chai.request(app)
                 .get('/course/new')
                 .end((err, res) => {
                     res.should.have.status(200);
                     done();
                  });
         })
         it("Should post the new page to select department", (done) => {
             const department = true; 
             chai.request(app)
             .post('/course/new')
             .end((err,res) => {
                res.should.have.status(200)
                done();
             })
         })
         it("Should error if post is blank", (done) => {
           let post = { 
               department:1,
               course_submit:true
           }
            chai.request(app)
            .post('/course/new')
            .send(post)
            .end((err,res) => {
               res.should.have.status(400)
               done();
            })
        })
        it("Should accept a new post", (done) => {
           let post = {
                course_submit:true,
                id:10,
                course_id:1,
                instructor_id:1,
                semester_term_id:1,
                section:1,
                num_students:50,
                year:2019
           }           
            chai.request(app)
            .post('/course/new')
            .send(post)
            .end((err,res) => {
               console.log(res)
               res.should.have.status(200)
               
               done();
            })
        })

    })
})

