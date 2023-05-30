const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };

    const userId = 'user-123';

    /** create use case depedency */
    const mockReplyRepository = new ReplyRepository();

    /** mocking */
    mockReplyRepository.verifyReplyIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockReplyRepository.verifyReplyIsExist).toBeCalledWith({
      threadId: useCaseParams.threadId,
      commentId: useCaseParams.commentId,
      replyId: useCaseParams.replyId,
    });

    expect(mockReplyRepository.verifyReplyAccess).toBeCalledWith({
      replyId: useCaseParams.replyId,
      owner: userId,
    });

    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCaseParams.replyId);
  });
});
