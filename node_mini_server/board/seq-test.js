const Seq = require('sequelize');
const seq = new Seq('study', 'root', 'oooo');

var User = seq.define('user', {
  name: Seq.STRING,
  email: {
    type: Seq.STRING,
    allowNull: false,
    validate: {
        isEmail: true
    }
  },
  userid: Seq.STRING,
  password: Seq.STRING,
  role: Seq.ENUM("admin", "member")
}, {underscored:true});

var Article = seq.define('article', {
  title: Seq.STRING,
  text: Seq.TEXT
}, {underscored:true});

User.hasMany(Article);
Article.belongsTo(User);

seq.sync({force:true}).then(() => {
    User.create({
        name: "김동욱",
        userid: "admin",
        password: "7964",
        role: "admin",
        email: "naver@asdasd.com"

    }).catch(err => {
        console.log(err);

    }).then(donguk => {
        return User.create({
            name: "손님",
            userid: "guest",
            password: "7964",
            role: "member",
            email: "aabcs@asdasd.com"
        });

    }).then(guest => {
        guest.name = "착한손님"; // update
        return guest.save();

    }).then(guest => {
        return guest.update({
            name: "나쁜 손님"
        });
    }).then(guest => {
        console.log(guest.name);

        return Promise.all([
            Article.create({
                title: "article from guest",
                text: "aaa",
                user_id: guest.id
            }),
            Article.create({
                title: "article2 from guest",
                text: "bbb",
                user_id: guest.id
            })
        ]);
    }).then(() => {

        Article.findAll({
            where: {
            },
            order: [
                ["id", "desc"]
            ],
            include: [{
                model: User,
                where: {
                    name: {
                        $like: "나쁜%"
                    }
                }
            }]
        }).then(res => {
            console.log(res);
        });
    });
});