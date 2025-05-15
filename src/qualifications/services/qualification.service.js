import Qualification from '../model/qualification.model';

export const qualificationService = {
  async getQualificationsForDesigner(designerId) {
    const rawData = [
      {
        id: '1',
        reviewerName: 'Cliente Uno',
        reviewerAvatar: 'https://i.pravatar.cc/50?u=1',
        stars: 5,
        comment: 'Gran trabajo, muy profesional.',
        createdAt: '2025-05-15'
      },
      {
        id: '2',
        reviewerName: 'Cliente Dos',
        reviewerAvatar: 'https://i.pravatar.cc/50?u=2',
        stars: 4,
        comment: 'Buen trabajo, aunque tardó un poco.',
        images: ['https://via.placeholder.com/80'],
        createdAt: '2025-05-14'
      }
    ];

    return rawData.map(Qualification.fromAPI);
  },

  async submitQualification(qualification) {
    const payload = qualification.toAPI();
    console.log('Enviando a fake API', payload);
    alert('Review enviada con éxito!');
  }
};