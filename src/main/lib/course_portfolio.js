const Portfolio = require('../models/CoursePortfolio/index')
const Artifact = require('../models/CoursePortfolio/Artifact/index')
var SLOPort = require('../models/CoursePortfolio/StudentLearningOutcome.js')
var SLO = require('../models/StudentLearningOutcome/index')
const Eval= require('../models/CoursePortfolio/Artifact/Evaluation') 
module.exports.new = async ({
	department_id,
	course_number,
	instructor,
	semester,
	year,
	num_students,
	student_learning_outcomes,
	section
}) => {

const portfolios = await Portfolio.query()
num = portfolios.length+1
await Portfolio.query().insert({
	id:num,
	course_id: parseInt(course_number),
	instructor_id: instructor,
	semester_term_id: parseInt(semester),
	year: parseInt(year),
	num_students: parseInt(num_students),
	section: parseInt(section),
})
for ( const i of student_learning_outcomes){
	const sloId = await SLO.query().alias('slo').where('slo.index',parseInt(i))
	const sloPorts = await SLOPort.query()
	await SLOPort.query().insert({
		id:sloPorts.length+1,
		portfolio_id: num,
		slo_id: sloId[0].id
	})
	for(j =0;  j<3; j++){
		var arts = await Artifact.query()
		await Artifact.query().insert({
			id: arts.length+1,
			index:j+1,
			portfolio_slo_id: sloPorts.length+1,
			name:"_unset_"
	
		})
		for(k=1;k<6;k++){
		const Evals = await Eval.query()
		await Eval.query().insert({
			id:Evals.length+1,
			artifact_id:arts.length+1,
			evaluation_index: k,
			student_index: k,
			evaluation:JSON.stringify([
				{
					metric: 1,
					value: 6
				},
				{
					metric: 2,
					value: 6
				},
				{
					metric: 3,
					value: 6
				},
				{
					metric: 4,
					value: 6
				},
				{
					metric: 5,
					value: 6
				}

			])
		})
	}
}
}


return {
	id: num
};
}


module.exports.get = async (portfolio_id) => {
	let raw_portfolio = await Portfolio.query()
		.eager({
			course: {
				department: true
			},
			instructor: true,
			semester: true,
			outcomes: {
				slo: {
					metrics: true
				},
				artifacts: {
					evaluations: true
				}
			}
		})
		.findById(portfolio_id)

	let portfolio = {
		portfolio_id: raw_portfolio.id,
		course_id: raw_portfolio.course_id,
		instructor: raw_portfolio.instructor,
		num_students: raw_portfolio.num_students,
		outcomes: [],
		course: {
			department: raw_portfolio.course.department.identifier,
			number: raw_portfolio.course.number,
			section: raw_portfolio.section,
			semester: raw_portfolio.semester.value,
			year: raw_portfolio.year
		},

	}

	for (let i in raw_portfolio.outcomes) {
		portfolio.outcomes.push(Object.assign({
			artifacts: raw_portfolio.outcomes[i].artifacts
		}, raw_portfolio.outcomes[i].slo))
	}

	return portfolio
}

module.exports.update = async (info,portfolio_id) =>{
	var portfolio= await this.get(portfolio_id)
	const artifactValue = parseInt(Object.keys(info)[0].match(/[0-9](?=-)/)[0])
	var updateArtifact = portfolio.outcomes[0].artifacts[artifactValue-1]
	console.log(updateArtifact.evaluations)
	for(i=0; i<5;i++){
		for(j=0;j<5;j++){
			updateArtifact.evaluations[i].evaluation[j].value=parseInt(Object.values(info)[j][i])
		}
			//updateArtifact.evaluations[i].evaluation = JSON.stringify(updateArtifact.evaluations[i].evaluation)
			updateArtifact.evaluations[i].file = ''
			await Eval.query().update({artifact_id:updateArtifact.id,evaluation_index:i,student_index:i,evaluation:updateArtifact.evaluations[i].evaluation}).where('id',updateArtifact.evaluations[i].id)

	}

	console.log(updateArtifact)
	//await Artifact.query().upsertGraph(updateArtifact)

}