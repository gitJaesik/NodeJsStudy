module.exports = (seq, Seq) => {
  return seq.define("blog", {
    user_id: {
    	type: Seq.STRING,
    	allowNull: false,
    	validate: {notEmpty: true}
    },
    password: {
    	type: Seq.STRING,
    	allowNull: false,
    	validate: {notEmpty: true}
    },
    name: {
    	type: Seq.STRING,
    	allowNull: false,
    	validate: {notEmpty: true}
    },
    facebook_url: {
    	type: Seq.STRING,
    	validate: {isUrl: true}
    },
    email: {
    	type: Seq.STRING,
    	allowNull: false,
    	validate: {isEmail: true}
    },
    lat: {
        type: Seq.DOUBLE
    },
    lang: {
        type: Seq.DOUBLE
    },
    fax: {
    	type: Seq.STRING,
    	validate: {
    		is: /^[-+0-9]+$/
    	}
    },
    phone: {
    	type: Seq.STRING,
    	validate: {
    		is: /^[-+0-9]+$/
    	}
    },
    contact_text: {
    	type: Seq.TEXT
    }
  }, {
    classMethods: {
      relate: (models) => {
        models.Blog.hasOne(models.Post, {as: 'aboutPost', foreignKey:'fk_about_post_id'});
        models.Blog.hasOne(models.File, {as: 'logoFile', foreignKey:'fk_logo_file_id'});

      }
    }
  });
};