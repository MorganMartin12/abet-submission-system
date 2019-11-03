const course_portfolio = require('../../../course.js')
const { expect } = require('../../chai')
const sinon = require('sinon')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

describe('Course route', () => {
    describe('Course view',() => {
        afterEach(()=>{
            sandbox.restore()
        })
        
    })
    describe('Course-New',()=> {
        afterEach(()=>{
            sandbox.restore()
            it('First page loads and submits'), async () => {
                chai.request(app)
                .get('/course/new')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                 }); 
            }
        }) 
    })
})
