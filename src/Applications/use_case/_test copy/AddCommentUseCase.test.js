const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment function', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a comment content',
    };
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const userId = 'user-123';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'a comment content',
      owner: 'user-123',
    });

    /** creating depedency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExistById = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: 'a comment content',
          owner: 'user-123',
        })
      )
    );

    /** create use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadIsExistById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
        owner: userId,
        threadId: useCaseParams.threadId,
      })
    );
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
