// src/entities/Profile.js
export class Profile {
    constructor({
                    id,
                    userId,
                    name,
                    location,
                    bio,
                    image,
                    icon,
                    experience,
                    social
                }) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.location = location;
        this.bio = bio;
        this.image = image;
        this.icon = icon || '';
        this.experience = experience;
        this.social = social || {};
    }
}
