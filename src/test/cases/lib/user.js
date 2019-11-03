const user_lib = require('../../../main/lib/user')
const { expect } = require('../../chai')
const sinon = require('sinon')

const sandbox = sinon.createSandbox();

describe('Lib - User', () => {

    describe('is_whitelistd', () => {

        afterEach(() => {
            sandbox.restore()
        })

        it('returns true when the id is in the table', async () => {

            const User = require('../../../main/moduls/User')

            sandbox.stub(User, "query").returns({
                findById: sandbox.stub().returns({
                    id: 1,
                    linkblue_username: 'user'
                })
            })

            const result = await user_lib.is_whitelisted('user')

            expect(result).to.true

        })

        it('returns false when th id is not in the table', async () => {
            const User = require('../../../main/models/User')

            sandbox.stub(User, "query").returns({

                findById: sandbox.stub().returns(null)
            })
            
            const result = await user_lib.is_whitelisted('user')

            expect(result).to.false

        })

    })
})