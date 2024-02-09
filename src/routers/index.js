const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary").v2;

const Path = require("../path");

const getList = require("../common/public/getList");
const getId = require("../common/public/getId");
const post = require("../common/public/post");
const put = require("../common/public/put");
const deleteItem = require("../common/public/delete");
const increaseView = require("../common/public/increaseView");

// login 
const register = require("../common/login/register");
const login = require("../common/login/login");
const protected = require("../common/login/protected");

// Function
const confirm = require("../common/confirm");

const { isAdmin, verifyToken } = require("../middleware/jwt")

const { PERMISSION } = require("../contants/permission");
const { JWT_SECRET } = require("../contants/jwt");
const { SALTROUNDS } = require("../contants/bcrypt");
const pageViewSchema = require('../schema/pageView');
const userSchema = require("../schema/users");
const idGameSchema = require("../schema/idgame");

const AccountAdmin = {
	username: "Phuchoa",
	age: 22,
	password: "admin",
	email: "phuchoa1202@gmail.com",
	permission: PERMISSION.admin
}

function route(app) {
	app.get("/", (req, res) => {
		res.send("hello")
	})

	// Upload File 
	app.post(`/images/upload`, async (req, res) => {
		const { name, url } = req.body;
		await cloudinary.uploader.upload(url, { public_id: name },
			function (error, result) {
				if (result) {
					const module_obj = {
						public_id: result.public_id,
						width: result.width,
						height: result.height,
						format: result.format,
						url: result.url,
					};

					req.body = {
						...req.body,
						...module_obj
					}

					post(req, res, imageSchema, [])
				} else {
					res.json({ payload: "error" });
				}
			}
		);
	})

	Path.forEach(item => {
		const { router, isAdmin, isLogin, allowPublic } = item;

		const nextFun = confirm({ isAdmin, isLogin });

		if (item.routerMore) {
			item.routerMore(app, { nextFun }, item);
		}

		app.get(`${item.router}`, nextFun, (req, res) => {
			getList(req, res, item.schema, item.populates, item.fieldSearch)
		})
		app.get(`${router}/:id`, nextFun, (req, res) => {
			getId(req, res, item.schema, item.populates)
		})
		app.post(`${router}`, nextFun, (req, res) => {
			post(req, res, item.schema, item.populates)
		})
		app.put(`${router}/:id`, nextFun, (req, res) => {
			put(req, res, item.schema, item.populates)
		})
		app.delete(`${router}`, nextFun, (req, res) => {
			deleteItem(req, res, item.schema)
		})

		// Public
		if (allowPublic) {
			app.get(`/public${item.router}`, (req, res) => {
				getList(req, res, item.schema, item.populates)
			})
			app.get(`/public${router}/:id`, (req, res) => {
				getId(req, res, item.schema, item.populates)
			})
			app.put(`/public${router}/:id/increaseView`, (req, res) => {
				increaseView(req, res, item.schema)
			})
		}
	})

	// Tạo tài khoản Admin 
	// app.post('/registerAdmin', async (req, res) => {
	// 	const token = jwt.sign(AccountAdmin, JWT_SECRET);
	// 	const hashedPassword = bcrypt.hashSync(AccountAdmin.password, SALTROUNDS);

	//     AccountAdmin.token = token;
	// 	AccountAdmin.password = hashedPassword;

	// 	const user = await userSchema.create(AccountAdmin);
	// 	res.status(201).json(user);
	// })
	// JSON Web Tokens
	app.post('/stats', async (req, res) => {
		const result = await pageViewSchema.findOneAndUpdate({}, { $inc: { views: 1 } }, { new: true, upsert: true });
		const count = await idGameSchema.countDocuments();
		res.json({
			result,
			count
		});
	});
	app.post('/register', isAdmin, register)
	app.post('/login', login)
	app.post('/protected', verifyToken, protected)
	app.post('/profile', verifyToken, protected)
}
module.exports = route;