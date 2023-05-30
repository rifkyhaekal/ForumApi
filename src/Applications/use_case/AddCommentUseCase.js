const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    const { threadId } = useCaseParams;
    await this._threadRepository.verifyThreadIsExistById(threadId);
    const newComment = new NewComment({ ...useCasePayload, owner: userId, threadId });
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
