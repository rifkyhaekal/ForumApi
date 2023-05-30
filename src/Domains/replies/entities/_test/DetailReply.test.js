const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'a reply content',
      username: 'dicoding',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specifications', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: {},
      date: [],
      username: 'dicoding',
      commentId: 'comment-123',
      isDeleted: 'yes',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'a reply content',
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      username: 'dicoding',
      commentId: 'comment-123',
      isDeleted: true,
    };

    // Action
    const { id, content, date, username, commentId } = new DetailReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(commentId).toEqual(payload.commentId);
  });
});
