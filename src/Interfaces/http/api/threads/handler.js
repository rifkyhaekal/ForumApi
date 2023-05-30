const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postAddCommentHandler = this.postAddCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postThreadHandler({ payload, auth }, h) {
    const usecasePayload = {
      title: payload.title,
      body: payload.body,
      owner: auth.credentials.id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(usecasePayload);

    const response = h.response({
      status: 'success',
      message: 'Thread added succesfully',
      data: {
        addedThread,
      },
    });

    response.code(201);
    return response;
  }

  async postAddCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(request.payload, request.params, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async postCommentReplyHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(request.payload, request.params, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const { id: userId } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }

  async getThreadHandler(request) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.params);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async deleteReplyHandler(request) {
    const { id: userId } = request.auth.credentials;

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadHandler;
