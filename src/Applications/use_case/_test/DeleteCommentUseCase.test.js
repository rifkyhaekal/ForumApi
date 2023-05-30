const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const userId = 'user-123';

    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockCommentRepository.verifyCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    // Create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith({
      commentId: useCaseParams.commentId,
      threadId: useCaseParams.threadId,
    });
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith({
      commentId: useCaseParams.commentId,
      owner: userId,
    });
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCaseParams.commentId);
  });
});
