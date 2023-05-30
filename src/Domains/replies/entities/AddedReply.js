class AddedReply {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ id, content, owner }) {
    return !id || !content || !owner;
  }

  _verifyDataType({ id, content, owner }) {
    return typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string';
  }
}

module.exports = AddedReply;
