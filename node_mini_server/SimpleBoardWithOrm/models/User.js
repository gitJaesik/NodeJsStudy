module.exports = (seq, Seq) => {
	return seq.define("user", {
		username : {
			type : Seq.STRING,
			allowNull : false,
			validate : {
				len : [2, 16]
			}
		},
		password : {
			type : Seq.STRING,
			allowNull : false,
			validate : {
				len : [2, 16]
			}
		}
	}, {
		classMethods : {
			relate : (models) => {
				models.User.hasMany(models.Article);
			}
		}
	});
};