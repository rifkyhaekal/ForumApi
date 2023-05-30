class NewComment {
  constructor(payload) {
    this._validatePayload(payload);

    const { content, owner, threadId } = payload;

    this.content = content;
    this.owner = owner;
    this.threadId = threadId;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
    }
  }

  _verifyProperty({ content, owner, threadId }) {
    return !content || !owner || !threadId;
  }

  _verifyDataType({ content, owner, threadId }) {
    return typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string';
  }
}

module.exports = NewComment;
