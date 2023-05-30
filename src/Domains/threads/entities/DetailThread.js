class DetailThread {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
    }
  }

  _verifyProperty({ id, title, body, date, username, comments }) {
    return !id || !title || !body || !date || !username || !comments;
  }

  _verifyDataType({ id, title, body, date, username, comments }) {
    return typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string' || typeof username !== 'string' || !Array.isArray(comments);
  }
}

module.exports = DetailThread;
