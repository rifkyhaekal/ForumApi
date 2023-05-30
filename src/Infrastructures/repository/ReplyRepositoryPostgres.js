const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({ content, owner, commentId }) {
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) returning id, content, owner',
      values: [id, content, owner, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `
            SELECT replies.id, replies.content, users.username,
              replies.comment_id, replies.date, replies.is_deleted
            FROM replies
              INNER JOIN comments ON replies.comment_id = comments.id
              INNER JOIN users ON replies.owner = users.id
            WHERE comments.thread_id = $1
            ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(
      (data) =>
        new DetailReply({
          ...data,
          commentId: data.comment_id,
          isDeleted: data.is_deleted,
        })
    );
  }

  async verifyReplyIsExist({ threadId, commentId, replyId }) {
    const query = {
      text: `
            SELECT 1 FROM replies 
              INNER JOIN comments 
            ON replies.comment_id = comments.id
              INNER JOIN threads
            ON comments.thread_id = threads.id
              WHERE threads.id = $1
            AND comments.id = $2
            AND replies.id = $3`,
      values: [threadId, commentId, replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyAccess({ replyId, owner }) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak memiliki akses untuk menghapus balasan ini');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
