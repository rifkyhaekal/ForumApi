const DetailThread = require('../DetailThread');

describe('a Detail Thread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      username: 'dicoding',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specifications', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: true,
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      username: 'dicoding',
      comments: {},
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
  });

  it('should create data thread object correctyly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(), // Convert Date object to string
      username: 'dicoding',
      comments: [],
    };

    // Action
    const { id, title, body, date, username, comments } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
    expect(Array.isArray(comments)).toBe(true);
  });
});
