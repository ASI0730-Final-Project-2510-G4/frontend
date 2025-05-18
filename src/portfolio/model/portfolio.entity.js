// src/entities/Project.js
export class Project {
    constructor({
                    id,
                    title,
                    image,
                    likes = '0',
                    comments = '0',
                    description = '',
                    technologies = [] // <- Se agrega aquí
                }) {
        this.id = id
        this.title = title
        this.image = image
        this.likes = likes
        this.comments = comments
        this.description = description
        this.technologies = technologies // <- Y se asigna aquí
    }
}
