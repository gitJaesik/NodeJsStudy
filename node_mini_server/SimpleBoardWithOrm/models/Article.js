module.exports = (seq, Seq) => {
	return seq.define("article", {
		title : {
			type : Seq.STRING,
			allowNull : false,
			validate : {
				len : [6,32]
			}
		},
		text : {
			type : Seq.TEXT,
			allowNull : false,
			validate : {
				notEmpty : {
					msg : "put someting"
				}
			}
		}
	}, {
		classMethods: {
			relate : (models) => {
				models.Article.belongsTo(models.User);
			}
		}
	});
};