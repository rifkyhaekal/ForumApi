class NewReply {
  constructor(payload) {
    this._validatePayload(payload);

    const { content, owner, commentId } = payload;

    this.content = content;
    this.owner = owner;
    this.commentId = commentId;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ content, owner, commentId }) {
    return !content || !owner || !commentId;
  }

  _verifyDataType({ content, owner, commentId }) {
    return typeof content !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string';
  }
}

module.exports = NewReply;
