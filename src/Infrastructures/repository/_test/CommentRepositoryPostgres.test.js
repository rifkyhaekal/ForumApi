const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add new comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'a comment content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      /** add user */
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding',
      });

      /** add new thread */
      await ThreadsTableTestHelper.addThread({
        title: 'a thread',
        body: 'a thread body',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'a comment content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      /** add user */
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding',
      });

      /** add new thread */
      await ThreadsTableTestHelper.addThread({
        title: 'a thread',
        body: 'a thread body',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'a comment content',
          owner: 'user-123',
        })
      );
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment by id', async () => {
      // Arrange
      const addedComment = {
        id: 'comment-123',
        threadId: 'thread-123',
      };

      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding',
      });

      /** add new thread */
      await ThreadsTableTestHelper.addThread({
        title: 'a thread',
        body: 'a thread body',
      });

      /** add comment */
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(addedComment.id);
      const comment = await CommentsTableTestHelper.findCommentById(addedComment.id);

      // Assert
      expect(comment[0].is_deleted).toEqual(true);
    });
  });

  describe('verifyCommentIsExist function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(() =>
        commentRepositoryPostgres.verifyCommentIsExist({
          commentId: 'comment-123',
          threadId: 'thread-123',
        })
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      /** add user */
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding',
      });

      /** add new thread */
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      });

      /** add comment */
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentIsExist({
          commentId: 'comment-123',
          threadId: 'thread-123',
        })
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentAccess function', () => {
    it('should throw AuthorizationError when you no access to delete the comment', async () => {
      // Arrange
      /** add user */
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding',
      });

      /** add new thread */
      await ThreadsTableTestHelper.addThread({
        title: 'a thread',
        body: 'a thread body',
      });

      /** add comment */
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(() =>
        commentRepositoryPostgres.verifyCommentAccess({
          commentId: 'comment-123',
          owner: 'user-122',
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not to throw AuthorizationError when you have access to delete the comment', async () => {
      // Arrange
      /** add user */
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding',
      });

      /** add new thread */
      await ThreadsTableTestHelper.addThread({
        title: 'a thread',
        body: 'a thread body',
      });

      /** add comment */
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAccess({
          commentId: 'comment-123',
          owner: 'user-123',
        })
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return all comment from a thread correctly', async () => {
      // Arrange
      const user = {
        id: 'user-123',
        username: 'dicoding',
      };

      const newThread = {
        id: 'thread-123',
      };

      const firstComment = {
        id: 'comment-123',
        date: new Date('2023-01-01T00:00:00.000Z'),
        content: 'a comment content',
        owner: 'user-123',
        isDeleted: false,
      };

      const secondComment = {
        id: 'comment-456',
        date: new Date('2023-01-02T00:00:00.000Z'),
        content: 'a comment content',
        owner: 'user-123',
        isDeleted: false,
      };

      /** add user */
      await UsersTableTestHelper.addUser(user);
      /** add new thread */
      await ThreadsTableTestHelper.addThread(newThread);
      /** add first and second comment */
      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Expected comments
      const expectedComments = [new DetailComment({ ...firstComment, username: user.username, date: firstComment.date }), new DetailComment({ ...secondComment, username: user.username, date: secondComment.date })];

      // Assert
      expect(comments).toEqual(expectedComments);
    });
  });
});
