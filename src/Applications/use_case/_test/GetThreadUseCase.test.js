/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating get detail thread action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const thread = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      username: 'dicoding',
    };

    const comments = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
        content: 'a comment content',
        isDeleted: false,
      }),

      new DetailComment({
        id: 'comment-456',
        username: 'johndoe',
        date: new Date('2023-01-02T00:00:00.000Z').toISOString(),
        content: 'a comment content',
        isDeleted: true,
      }),
    ];

    const replies = [
      new DetailReply({
        id: 'reply-123',
        content: 'a reply content',
        date: new Date('2023-01-02T00:00:00.000Z').toISOString(),
        username: 'dicoding',
        commentId: 'comment-123',
        isDeleted: true,
      }),

      new DetailReply({
        id: 'reply-456',
        content: 'a reply content',
        date: new Date('2023-01-03T00:00:00.000Z').toISOString(),
        username: 'johndoe',
        commentId: 'comment-456',
        isDeleted: false,
      }),
    ];

    const expectedCommentsAndReplies = {
      id: 'thread-123',
      title: 'a thread',
      username: 'dicoding',
      date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      body: 'a thread body',
      comments: [
        {
          content: 'a comment content',
          date: new Date('2023-01-01T00:00:00.000Z').toISOString(),
          id: 'comment-123',
          username: 'dicoding',
          replies: [
            {
              content: '**balasan telah dihapus**',
              date: new Date('2023-01-02T00:00:00.000Z').toISOString(),
              id: 'reply-123',
              username: 'dicoding',
            },
          ],
        },
        {
          content: '**komentar telah dihapus**',
          date: new Date('2023-01-02T00:00:00.000Z').toISOString(),
          id: 'comment-456',
          username: 'johndoe',
          replies: [
            {
              content: 'a reply content',
              date: new Date('2023-01-03T00:00:00.000Z').toISOString(),
              id: 'reply-456',
              username: 'johndoe',
            },
          ],
        },
      ],
    };

    // Create dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking needed function
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(comments));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(replies));

    // Create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(detailThread).toEqual(expectedCommentsAndReplies);
  });
});
