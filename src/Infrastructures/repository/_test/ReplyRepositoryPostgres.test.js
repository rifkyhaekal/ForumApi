const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'title thread',
      body: 'a thread body',
      owner: 'user-123',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'a comment content',
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe('addReply function', () => {
    it('should persist add new reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'a reply content',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return addReply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'a reply content',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: 'a reply content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: expectedAddedReply.id,
          content: expectedAddedReply.content,
          owner: expectedAddedReply.owner,
        })
      );
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return all replies by thread id correctly', async () => {
      // Arrange

      /** add more new user */
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'johndoe',
      });

      /** add more new comment */
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'a comment content',
        threadId: 'thread-123',
        owner: 'user-456',
      });

      /** add new reply */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'a reply content',
        owner: 'user-123',
        commentId: 'comment-123',
        date: new Date('2023-01-01T00:00:00.000Z'),
        isDeleted: false,
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        content: 'a reply content',
        owner: 'user-456',
        commentId: 'comment-456',
        date: new Date('2023-01-01T00:00:00.000Z'),
        isDeleted: false,
      });

      const expectedReplies = [
        {
          id: 'reply-123',
          content: 'a reply content',
          username: 'dicoding',
          commentId: 'comment-123',
          date: new Date('2023-01-01T00:00:00.000Z'),
        },

        {
          id: 'reply-456',
          content: 'a reply content',
          username: 'johndoe',
          commentId: 'comment-456',
          date: new Date('2023-01-01T00:00:00.000Z'),
        },
      ];

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      // Assert
      expect(replies).toEqual(expectedReplies);
    });
  });

  describe('verifyReplyIsExist function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      expect(() =>
        replyRepositoryPostgres.verifyReplyIsExist({
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-123',
        })
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is found', async () => {
      // Arrange
      /** add reply */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        date: new Date('2023-01-01T00:00:00.000Z'),
        isDeleted: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyIsExist({
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-123',
        })
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyAccess function', () => {
    it('should throw AuthorizationError when you no access to delete the reply', async () => {
      /** add reply */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        date: new Date('2023-01-01T00:00:00.000Z'),
        isDeleted: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      expect(
        replyRepositoryPostgres.verifyReplyAccess({
          replyId: 'reply-123',
          owner: 'user-456',
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when you have access to delete the reply', async () => {
      /** add reply */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        date: new Date('2023-01-01T00:00:00.000Z'),
        isDeleted: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyAccess({
          replyId: 'reply-123',
          owner: 'user-123',
        })
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete the reply by comment id correctlt', async () => {
      /** add reply */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        date: new Date('2023-01-01T00:00:00.000Z'),
        isDeleted: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply[0].is_deleted).toBe(true);
    });
  });
});
