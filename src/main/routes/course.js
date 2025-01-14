var express = require('express');
var mustache = require('../common/mustache')
var html = require('../common/html')
var course_portfolio_lib = require('../lib/course_portfolio')
var Portfolio = require('../models/CoursePortfolio/index')
var router = express.Router();


const Department = require('../models/Department')
const TermType = require('../models/TermType')

const course_manage_page = async (res, course_id) => {
	const portfolio = await course_portfolio_lib.get(course_id)
	let course_info = {
		student_learning_outcomes: portfolio.outcomes
	};

	res.render('base_template', {
		title: 'CS498 Course Portfolio',
		body: mustache.render('course/manage', course_info)
	})
}

const course_new_page = async (res, department = false) => {
	
	const departments = await Department.query().select()
	const semesters = await (await TermType.query()
		.findById('semester'))
		.$relatedQuery('terms')
	let student_learning_outcomes = false

	if (department) {
		student_learning_outcomes = await (await Department.query().findById(department))
			.$relatedQuery('student_learning_outcomes')
	}

	res.render('base_template', {
		title: 'New Course Portfolio',
		body: mustache.render('course/new', {
			departments,
			department,
			student_learning_outcomes,
			semesters
		})
	})
}

/* GET course home page */
router.route('/')
	.get(html.auth_wrapper(async (req, res, next) => {
		const portfolios = await Portfolio.query()
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
				},

			})			
		for(var i = 0; i < portfolios.length;i++){
			var completed = 0;
			var total = 0;

			for(var j = 0; j < portfolios[i].outcomes.length; j++){
				for (var k = 0; k < portfolios[i].outcomes[j].artifacts.length; k++){
					for (var l = 0; l < portfolios[i].outcomes[j].artifacts[k].evaluations.length; l++){
						total++;
						if(portfolios[i].outcomes[j].artifacts[k].evaluations[l].file != null){
							completed++;
						}
					}
				}
			}
		
			portfolios[i].completed = completed;
			portfolios[i].total = total;
			portfolios[i].Semester = portfolios[i].semester.value;
			
			
		}


		res.render('base_template', {
			title: 'Course Portfolios',
			body: mustache.render('course/index',{
			portfolios
			
			})
		})
	}))

/* GET course page */
router.route('/:id')
	.get(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			await course_new_page(res)
		} else {
			await course_manage_page(res, req.params.id)
		}
	}))
	.post(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			if (req.body.course_submit) {
				
				const course_portfolio = await course_portfolio_lib.new({
					department_id: req.body.department,
					course_number: req.body.course_number,
					instructor: 1,
					semester: req.body.semester,
					year: req.body.course_year,
					num_students: req.body.num_students,
					student_learning_outcomes: Object.entries(req.body)
						.filter(entry => entry[0].startsWith('slo_') && entry[1] === 'on')
						.map(entry => entry[0].split('_')[1]),
					section: req.body.course_section
				})

				res.redirect(302, `/course/${course_portfolio.id}`)
			} else {
				await course_new_page(res, req.body.department)
			}
		} else {
			await course_portfolio_lib.update(req.body,req.params.id)
			await course_manage_page(res, req.params.id)
		}
	}))

module.exports = router;
