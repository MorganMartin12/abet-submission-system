
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../main/app');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

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
        afterEach(() => {
            sandbox.restore()
        })
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
                course_submit:'Create',
                course_number:'1',
                instructor_id:1,
                semester:'3',
                course_section:'1',
                num_students:'50',
                course_year:'2019'
           }
           var course_portfolio_lib = require('../../main/lib/course_portfolio')
            sandbox.stub(course_portfolio_lib, "new").returns({id:1})           
            chai.request(app)
            .post('/course/new')
            .send(post)
            .end((err,res) => {
               res.should.have.status(200)
               done();
            })
        })

    })
    describe("course/id", () => {
        afterEach(() => {
            sandbox.restore()
        })
        it("should get the edit page", (done) => {
            chai.request(app)
                .get('/course/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                 });
        })
        it("should post on submission page", (done) => {
            var course_portfolio_lib = require('../../main/lib/course_portfolio')
            sandbox.stub(course_portfolio_lib, "update").returns(null) 
            chai.request(app)
                .post('/course/30')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                 });
        })
    })
})

