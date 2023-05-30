class AddedComment {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
    }
  }

  _verifyProperty({ id, content, owner }) {
    return !id || !content || !owner;
  }

  _verifyDataType({ id, content, owner }) {
    return typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string';
  }
}

module.exports = AddedComment;
