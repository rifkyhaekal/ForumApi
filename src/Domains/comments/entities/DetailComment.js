class DetailComment {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, username, date, content, isDeleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
    }
  }

  _verifyProperty({ id, username, date, content, isDeleted }) {
    return !id || !username || !date || !content || isDeleted === 'undefined';
  }

  _verifyDataType({ id, username, date, content, isDeleted }) {
    return typeof id !== 'string' || typeof username !== 'string' || !(date instanceof Date || typeof date === 'string') || typeof content !== 'string' || typeof isDeleted !== 'boolean';
  }
}

module.exports = DetailComment;
