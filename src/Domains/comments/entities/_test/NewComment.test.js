const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'a comment content',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'a comment content',
      owner: true,
      threadId: [],
    };

    // Actiond & Support
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'a comment content',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    const { content, owner, threadId } = new NewComment(payload);

    // Assert
    expect(content).toStrictEqual(payload.content);
    expect(owner).toStrictEqual(payload.owner);
    expect(threadId).toStrictEqual(payload.threadId);
  });
});
