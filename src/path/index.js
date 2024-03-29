const idGame = require("../schema/idgame");
const goal = require("../schema/goal")
const post = require("../common/public/post");
const put = require("../common/public/put");
const checkUpdateTime = require('../middleware/checkUpdateTime');
const checkUserConfirmation = require('../middleware/checkUserConfirmation');
const { addAction, deleteAllActions } = require('../service/actionService');
const deleteItem = require("../common/public/delete");

const Path = [
	{
		router: "/idgame",
		schema: idGame,
		populates: [],
		isAdmin: false,
		isLogin: false,
		fieldSearch: [],
		allowPublic: false
	},
	{
		router: "/goals",
		schema: goal,
		populates: [],
		isAdmin: false,
		isLogin: false,
		fieldSearch: ["idGame", "target"],
		allowPublic: false,
		routerMore: (app, action, item) => {
			app.post(`${item.router}`, action.nextFun, async (req, res) => {
				const postData = req.body;
				delete postData.likes;
				addAction({
					id: "post",
					method: "post"
				})
				post(req, res, item.schema, item.populates)
			})
			app.put(`${item.router}/:id`, checkUserConfirmation, checkUpdateTime, action.nextFun, async (req, res) => {
				const updateData = req.body;
				delete updateData.likes;
				updateData.status = 2;
				delete updateData.idUser;
				delete updateData.idGame;
				addAction({
					id: req.params.id,
					method: "put"
				})
				put(req, res, item.schema, item.populates)
			})
			app.delete(`${item.router}`, checkUserConfirmation, checkUpdateTime, action.nextFun, async (req, res) => {
				addAction({
					id: req.body.id,
					method: "delete"
				})
				req.body.ids = [req.body.id];
				deleteItem(req, res, item.schema, item.populates)
			})
			app.post(`${item.router}/:goalId/like`, action.nextFun, async (req, res) => {
				const goalId = req.params.goalId;
				try {
					const goal = await item.schema.findById(goalId);
					if (!goal) {
						return res.status(404).json({ message: 'Mục tiêu không tồn tại' });
					}
					goal.likes += 1;
					await goal.save();
					res.json({ message: 'Tăng like thành công', goal });
				} catch (error) {
					res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
				}
			})
			app.get(`${item.router}/random`, action.nextFun, async (req, res) => {
				const userId = req.query.userId;
				if (!userId) {
					return res.status(400).send({ message: 'UserID is required' });
				}

				try {
					const count = await item.schema.countDocuments({ idUser: { $ne: userId } });
					const random = Math.floor(Math.random() * count);
					const goal = await item.schema.findOne({ idUser: { $ne: userId } }).skip(random);

					if (goal) {
						res.send(goal);
					} else {
						res.status(404).send({ message: 'No goals found' });
					}
				} catch (error) {
					console.error(error);
					res.status(500).send({ message: 'Server error' });
				}
			})
			app.patch(`${item.router}/updateStatus`, action.nextFun, async (req, res) => {
				try {
					const updatedGoals = await item.schema.updateMany({ status: 2 }, { $set: { status: 3 } });
					res.json({
						message: 'Goals updated successfully',
						updatedGoals
					});
				} catch (error) {
					res.status(500).json({ message: 'Error updating goals', error });
				}
			})
			app.patch(`${item.router}/doneBuild`, action.nextFun, async (req, res) => {
				try {
					const updatedGoals = await item.schema.updateMany({ status: 3 }, { $set: { status: 1 } });
					const deleteAction = await deleteAllActions();
					res.json({
						message: 'Goals done Build',
						updatedGoals
					});
				} catch (error) {
					res.status(500).json({ message: 'Error updating goals', error });
				}
			})
		}
	}
]

module.exports = Path;