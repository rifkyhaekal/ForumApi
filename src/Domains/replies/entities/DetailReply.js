class DetailReply {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, content, date, username, commentId, isDeleted } = payload;

    this.id = id;
    this.content = isDeleted ? '**balasan telah dihapus**' : content;
    this.username = username;
    this.commentId = commentId;
    this.date = date;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ id, content, date, username, commentId, isDeleted }) {
    return !id || !content || !date || !username || !commentId || isDeleted === 'undefined';
  }

  _verifyDataType({ id, content, date, username, commentId, isDeleted }) {
    return typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date || typeof date === 'string') || typeof username !== 'string' || typeof commentId !== 'string' || typeof isDeleted !== 'boolean';
  }
}

module.exports = DetailReply;
