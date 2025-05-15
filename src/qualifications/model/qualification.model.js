export default class Qualification {
    constructor({ id, reviewerName, reviewerAvatar, stars, comment, images = [], createdAt }) {
      this.id = id;
      this.reviewerName = reviewerName;
      this.reviewerAvatar = reviewerAvatar;
      this.stars = stars;
      this.comment = comment;
      this.images = images;
      this.createdAt = createdAt;
    }
  
    static fromAPI(data) {
      return new Qualification({
        id: data.id,
        reviewerName: data.reviewerName,
        reviewerAvatar: data.reviewerAvatar,
        stars: data.stars,
        comment: data.comment,
        images: data.images || [],
        createdAt: data.createdAt
      });
    }
  
    toAPI() {
      return {
        id: this.id,
        reviewerName: this.reviewerName,
        reviewerAvatar: this.reviewerAvatar,
        stars: this.stars,
        comment: this.comment,
        images: this.images,
        createdAt: this.createdAt
      };
    }
  }
  
  