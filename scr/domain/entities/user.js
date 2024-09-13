class User {
    constructor(username, email, password, bio, avatar) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.avatar = avatar;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = User;