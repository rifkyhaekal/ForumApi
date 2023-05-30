const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      content: 'a comment content',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specifications', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'dicoding',
      date: [],
      content: true,
      isDeleted: 'yes',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
  });

  it('should create data comment object correctyly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'dicoding',
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      content: 'a comment content',
      isDeleted: false,
    };

    // Action
    const { id, username, date, content } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
